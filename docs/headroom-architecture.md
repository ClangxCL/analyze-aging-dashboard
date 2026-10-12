# Backend & Database Capacity Headroom Architecture Guide

## 1. Executive Summary & Core Philosophy

In backend and database engineering, **Headroom** is the reserve buffer between standard peak operational demand and the point where system latency degrades non-linearly or crashes:

$$\text{Headroom} = 1 - \frac{\text{Peak Operational Load}}{\text{Maximum Sustainable Capacity}}$$

### The Physics of Headroom: Why 70% is the "Saturation Knee"
Under queuing theory (**Kingman's formula** and **Little's Law**), wait times do not scale linearly with resource utilization. As utilization approaches 80–100%, queue wait time approaches infinity:

```
Latency / Queue Wait
   ^
   |                                          * (Cascading Failure / OOM / Timeouts)
   |                                        *
   |                                       *
   |                                    *
   |                                *
   |                         *  <- Knee of the curve (~70-75% utilization)
   |       ________________*
   +----------------------------------------------------> Utilization (%)
           0%             50%        70%    80%   100%
```

Operating without at least **25–35% headroom** means any micro-burst, autovacuum run, cache invalidation wave, or network hiccup will push the system past the saturation knee, causing **timeout storms, connection pool starvation, and cascading retry loops**.

---

## 2. Headroom Target Matrix

| Dimension | Safe Steady-State | Warning Threshold | Critical Ceiling | Minimum Headroom Buffer | Failure Mode When Exhausted |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Backend CPU** | $\le 55\%$ | $70\%$ | $80\%$ | **30%** | Request queueing, HTTP 504 timeouts |
| **Backend Memory** | $\le 65\%$ | $75\%$ | $85\%$ | **25%** | Linux OOM Killer terminating workers |
| **DB Connections** | $\le 50\%$ of pool | $70\%$ | $85\%$ | **30–50%** | `FATAL: remaining connection slots reserved` |
| **DB Buffer Cache Hit Ratio** | $\ge 99\%$ | $95\%$ | $< 90\%$ | **N/A** (Quality metric) | Disk I/O spike, high read latency |
| **Disk Storage** | $\le 70\%$ | $80\%$ | $90\%$ | **20–30%** | Postgres forces read-only, vacuum cannot run |
| **Disk IOPS / Burst Credit** | $\le 60\%$ baseline | $75\%$ | $90\%$ | **35%** | Disk stalls, checkpoint delays, replication lag |
| **Postgres XID Wraparound** | $< 200\text{M}$ txns | $500\text{M}$ txns | $1\text{B}$ txns | **50% of 2B limit** | Forced database shutdown into emergency mode |
| **Network Bandwidth / Sockets** | $\le 50\%$ | $70\%$ | $85\%$ | **30%** | TCP SYN drops, socket exhaustion (`TIME_WAIT`) |

---

## 3. Backend Layer Headroom Strategies

```mermaid
flowchart TD
    Client[Client Traffic] --> RateLimit[1. Adaptive Rate Limiter / Ingress]
    RateLimit --> Shedding{2. Load Shedder (Headroom Check)}
    Shedding -- "Headroom OK (<75%)" --> Workers[3. App Worker Pool]
    Shedding -- "Headroom Exhausted (>80%)" --> Drop[Return 429 / 503 Retry-After]
    Workers --> Cache[(4. Redis / L1 Cache)]
    Cache -- Cache Hit --> Workers
    Cache -- Cache Miss --> Pooler[5. DB Connection Pooler (PgBouncer/Supavisor)]
    Pooler --> Postgres[(6. Primary Database)]
```

### 3.1. Concurrency & Pool Sizing
Avoid arbitrary unbounded thread or process pools. Size application concurrency using Little's Law:

$$N = \lambda \times W$$
*(Where $N$ = in-flight concurrent requests, $\lambda$ = request arrival rate, $W$ = average response time).*

- **Keep thread pools bounded**: Never let HTTP servers spawn infinite goroutines/threads without a concurrency limiter.
- **Fail-fast with backpressure**: When incoming requests exceed worker capacity, reject with `HTTP 429 Too Many Requests` or `HTTP 503 Service Unavailable` rather than letting queues buffer infinitely.

### 3.2. Adaptive Load Shedding
When CPU or latency spikes, shed non-essential work before core services crash:
- **Priority tiers**:
  - Tier 0 (Critical): Authentication, payment, core read/write workflows.
  - Tier 1 (Important): Search, notifications.
  - Tier 2 (Background/Disposable): Analytics telemetry, non-urgent sync, cache pre-warming.
- When resource headroom drops below 20%, drop Tier 2 traffic immediately.

### 3.3. Context Deadlines and Cancellation Budgets
Every backend request must carry a context timeout budget:
```
Total Client Timeout: 3000ms
  ├── Ingress Gateway: 2900ms
  ├── Backend Service: 2500ms
  └── Database Query: 2000ms (statement_timeout)
```
If a client cancels or disconnects, propagate cancellation downstream to abort the database query instantly and free DB execution slots.

---

## 4. Database (PostgreSQL / Supabase) Headroom Architecture

### 4.1. Connection Headroom & Connection Pooling
PostgreSQL forks a dedicated backend process per direct connection, consuming 5–10MB+ RAM and incurring CPU context-switching overhead.

#### Sizing Rule (PostgreSQL Core Formula):
$$\text{Max DB Connections} \approx (\text{CPU Cores} \times 2) + \text{Disk Spindles/Channels}$$

For example, an 8-core server should run around **16 to 25 active database execution connections**.

#### Architecture Pattern:
- **Never allow direct client connections**: Connect application instances to a pooler (**Supavisor** or **PgBouncer**) in **Transaction Mode**.
- **Reserve Superuser Headroom**: Keep `superuser_reserved_connections = 3` so operations/DBAs can always log in to troubleshoot during connection starvation.
- Set conservative connection timeouts:
  ```sql
  -- Drop idle connections that hold server memory
  ALTER SYSTEM SET idle_in_transaction_session_timeout = '30s';
  ALTER SYSTEM SET statement_timeout = '15s';
  ```

### 4.2. Query Performance Headroom
Poor query design directly robs database CPU and disk I/O headroom:

1. **Covering & Composite Indexes**:
   - Index columns evaluated in `WHERE`, `ORDER BY`, and foreign keys.
   - Prevent sequential scans on tables with $>10{,}000$ rows.
2. **Eliminate Offset Pagination**:
   - `OFFSET 100000` forces Postgres to scan and discard 100,000 rows.
   - Use **Keyset/Cursor pagination** (`WHERE id > :last_seen_id ORDER BY id LIMIT 20`).
3. **N+1 Query Elimination**:
   - Batch lookups using `IN (...)` or JOINs instead of looping in backend code.
4. **Lock Headroom (`SKIP LOCKED`)**:
   - For job queues or distributed processing, avoid blocking locks:
     ```sql
     -- CORRECT: Non-blocking queue worker
     SELECT id, payload
     FROM job_queue
     WHERE status = 'pending'
     ORDER BY scheduled_at
     FOR UPDATE SKIP LOCKED
     LIMIT 1;
     ```

### 4.3. Autovacuum and Disk Headroom
Postgres MVCC generates dead tuples on every `UPDATE` and `DELETE`.
- **Disk Space Headroom**: Postgres requires at least **20–30% free disk space** for index creation, autovacuum operations, and WAL file spikes. If disk reaches 100%, Postgres halts writes.
- **Tune Autovacuum for High Throughput**:
  ```sql
  -- Increase autovacuum cost limit to let vacuum finish faster without starving I/O
  ALTER SYSTEM SET autovacuum_vacuum_cost_limit = 1000;
  ALTER SYSTEM SET autovacuum_vacuum_scale_factor = 0.05; -- Trigger at 5% tuple updates rather than default 20%
  ALTER SYSTEM SET autovacuum_naptime = '15s';
  ```

### 4.4. Transaction ID (XID) Wraparound Headroom
Postgres tracks transactions using 32-bit integers (~2.1 billion transactions). If autovacuum freezes fall behind, Postgres enters emergency read-only mode to prevent data corruption.
- Monitor `autovacuum_freeze_max_age` (default 200M).
- Alert when un-frozen transaction distance exceeds 500M.

---

## 5. Diagnostic Queries for Auditing Headroom

Run these diagnostics to evaluate current database headroom:

### 1. Connection Utilization Headroom
```sql
SELECT 
    max_conn.setting::int AS max_connections,
    cur.total_connections,
    cur.active_connections,
    cur.idle_connections,
    ROUND((cur.total_connections::numeric / max_conn.setting::numeric) * 100, 2) AS connection_utilization_pct,
    ROUND(100 - (cur.total_connections::numeric / max_conn.setting::numeric) * 100, 2) AS headroom_pct
FROM 
    pg_settings max_conn,
    (
        SELECT 
            COUNT(*) AS total_connections,
            COUNT(*) FILTER (WHERE state = 'active') AS active_connections,
            COUNT(*) FILTER (WHERE state = 'idle') AS idle_connections
        FROM pg_stat_activity
        WHERE backend_type = 'client backend'
    ) cur
WHERE max_conn.name = 'max_connections';
```

### 2. Cache Hit Ratio (RAM Buffer Headroom)
```sql
SELECT 
    sum(heap_blks_read) AS disk_blocks_read,
    sum(heap_blks_hit)  AS buffer_cache_hits,
    ROUND((sum(heap_blks_hit)::numeric / NULLIF((sum(heap_blks_hit) + sum(heap_blks_read)), 0)::numeric) * 100, 2) AS buffer_hit_ratio_pct
FROM pg_statio_user_tables;
```
*(If `buffer_hit_ratio_pct` is below 98%, database memory headroom is insufficient; queries are hitting disk).*

### 3. Missing Indexes & Table Scan Hotspots (CPU Headroom Consumers)
```sql
SELECT 
    relname AS table_name,
    seq_scan,
    idx_scan,
    n_live_tup AS live_rows,
    ROUND((seq_scan::numeric / NULLIF(seq_scan + idx_scan, 0)::numeric) * 100, 2) AS seq_scan_percentage
FROM pg_stat_user_tables
WHERE (seq_scan + idx_scan) > 100 AND n_live_tup > 5000
ORDER BY seq_scan DESC
LIMIT 10;
```

### 4. Transaction Wraparound Headroom
```sql
SELECT 
    datname,
    age(datfrozenxid) AS oldest_xid_age,
    2147483648 - age(datfrozenxid) AS remaining_xid_headroom,
    ROUND((age(datfrozenxid)::numeric / 2147483648::numeric) * 100, 2) AS xid_consumption_pct
FROM pg_database
WHERE datallowconn
ORDER BY oldest_xid_age DESC;
```

### 5. Slow Query Hotspots (`pg_stat_statements`)
```sql
SELECT 
    query,
    calls,
    ROUND(total_exec_time::numeric, 2) AS total_exec_ms,
    ROUND(mean_exec_time::numeric, 2) AS mean_exec_ms,
    ROUND((total_exec_time / sum(total_exec_time) OVER ()) * 100, 2) AS pct_total_db_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 5;
```

---

## 6. Sizing & Scaling Operational Playbook

### Autoscaling Lead-Time Rule
When scaling backend services horizontally in response to load spikes:
- Auto-scale trigger must be set at **$\le 65\%$ CPU / Memory utilization**.
- Sizing equation for scale-out threshold:
  $$\text{Scale-Out Threshold} = 100\% - (\text{Growth Rate Per Minute} \times \text{Pod Provisioning Time (min)}) - \text{Safety Buffer (15\%)}$$
- If a new pod takes 90 seconds to warm up and pass health checks, triggering at 80% means the system will hit 100% and drop traffic before the new pod is ready.

### Summary Checklist for Engineering Teams
- [ ] Direct connections blocked; application instances route through connection pooler.
- [ ] `statement_timeout` and `idle_in_transaction_session_timeout` enforced globally.
- [ ] Database autoscale or disk auto-expand configured at 75% threshold.
- [ ] Deadlines / timeout budgets propagated end-to-end through HTTP contexts.
- [ ] Non-essential endpoints instrumented with shed-headers and rate limiting.
- [ ] Keyset pagination implemented on all high-cardinality collections.
- [ ] Continuous monitoring on `pg_stat_activity` locks and buffer cache hit ratio.
