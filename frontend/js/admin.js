/**
 * Forum 2026 Project - Admin Backoffice & CMS Engine
 */

const ADMIN_API = '/api/admin';
let adminToken = localStorage.getItem('forum2026_admin_token') || null;

function checkAdminAuth() {
  const loginSection = document.getElementById('adminLoginSection');
  const dashboardSection = document.getElementById('adminDashboardSection');
  
  if (!adminToken) {
    if (loginSection) loginSection.classList.remove('hidden');
    if (dashboardSection) dashboardSection.classList.add('hidden');
  } else {
    if (loginSection) loginSection.classList.add('hidden');
    if (dashboardSection) dashboardSection.classList.remove('hidden');
    loadDashboardData();
    loadAdminAttendees();
    loadAuditLogs();
  }
}

async function handleAdminLogin(event) {
  event.preventDefault();
  const form = event.target;
  const username = form.username.value.trim();
  const password = form.password.value;
  const errorMsg = document.getElementById('loginErrorMessage');
  errorMsg.classList.add('hidden');

  try {
    const res = await fetch(`${ADMIN_API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'เข้าสู่ระบบไม่สำเร็จ');

    adminToken = data.access_token;
    localStorage.setItem('forum2026_admin_token', adminToken);
    localStorage.setItem('forum2026_admin_user', data.full_name);
    checkAdminAuth();
  } catch (err) {
    errorMsg.textContent = err.message;
    errorMsg.classList.remove('hidden');
  }
}

function handleAdminLogout() {
  adminToken = null;
  localStorage.removeItem('forum2026_admin_token');
  localStorage.removeItem('forum2026_admin_user');
  checkAdminAuth();
}

async function loadDashboardData() {
  if (!adminToken) return;

  try {
    const res = await fetch(`${ADMIN_API}/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (res.status === 401) {
      handleAdminLogout();
      return;
    }
    const data = await res.json();

    // Summary counts
    document.getElementById('statTotalAttendees').textContent = data.summary.total_attendees.toLocaleString();
    document.getElementById('statPublicAttendees').textContent = data.summary.public_count.toLocaleString();
    document.getElementById('statMedicalAttendees').textContent = data.summary.medical_count.toLocaleString();
    document.getElementById('statAseanAttendees').textContent = data.summary.asean_count.toLocaleString();

    // Render Health Regions list
    const regionContainer = document.getElementById('healthRegionBreakdownContainer');
    if (regionContainer) {
      regionContainer.innerHTML = Object.entries(data.regional_breakdown).map(([region, count]) => `
        <div class="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
          <span class="text-sm font-medium text-stone-800">${region}</span>
          <span class="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-bold font-mono">${count} คน</span>
        </div>
      `).join('') || '<p class="text-stone-400 text-sm">ยังไม่มีข้อมูลบุคลากรในแต่ละเขต</p>';
    }

    // Top Provinces list
    const provContainer = document.getElementById('topProvincesContainer');
    if (provContainer) {
      provContainer.innerHTML = Object.entries(data.top_provinces).map(([prov, count]) => `
        <div class="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
          <span class="text-sm font-medium text-stone-800">${prov}</span>
          <span class="px-2.5 py-1 bg-blue-100 text-blue-900 rounded-full text-xs font-bold font-mono">${count} คน</span>
        </div>
      `).join('') || '<p class="text-stone-400 text-sm">ยังไม่มีข้อมูลจังหวัด</p>';
    }

    // Recent Audit Logs
    const recentLogsContainer = document.getElementById('recentLogsPreviewContainer');
    if (recentLogsContainer) {
      recentLogsContainer.innerHTML = data.recent_logs.map(log => `
        <div class="p-3 border-b border-stone-100 text-sm flex justify-between items-start">
          <div>
            <span class="font-mono text-xs text-emerald-800 font-semibold">${log.action}</span>
            <p class="text-stone-600 text-xs mt-0.5">${JSON.stringify(log.details)}</p>
          </div>
          <span class="text-stone-400 text-xs whitespace-nowrap">${log.time}</span>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
  }
}

async function loadAdminAttendees() {
  if (!adminToken) return;
  const tbody = document.getElementById('attendeesTableBody');
  const categoryFilter = document.getElementById('filterAttendeeCategory')?.value || 'all';
  const search = document.getElementById('searchAttendeeInput')?.value.trim() || '';

  tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-stone-500">กำลังโหลดรายชื่อผู้ลงทะเบียน...</td></tr>';

  try {
    const res = await fetch(`${ADMIN_API}/attendees?category=${categoryFilter}&search=${encodeURIComponent(search)}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();

    if (data.items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-stone-400">ไม่พบข้อมูลผู้ลงทะเบียน</td></tr>';
      return;
    }

    tbody.innerHTML = data.items.map((item, idx) => `
      <tr class="hover:bg-stone-50 border-b border-stone-100 text-sm">
        <td class="p-3 text-center text-stone-400 font-mono">${idx + 1}</td>
        <td class="p-3 font-mono font-semibold text-emerald-900">${item.registration_code}</td>
        <td class="p-3">
          <span class="font-bold text-stone-900">${item.full_name}</span>
          <span class="block text-xs text-stone-500">${item.category_label}</span>
        </td>
        <td class="p-3 text-stone-700">${item.detail}</td>
        <td class="p-3 text-stone-600 text-xs">${item.phone}<br/>${item.email}</td>
        <td class="p-3 text-stone-400 text-xs whitespace-nowrap">${item.updated_at}</td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-red-600">ข้อผิดพลาด: ${err.message}</td></tr>`;
  }
}

function triggerExcelExport() {
  if (!adminToken) {
    alert('กรุณาเข้าสู่ระบบก่อนดาวน์โหลดข้อมูล');
    return;
  }
  // Trigger download with auth token in URL or fetch blob
  fetch(`${ADMIN_API}/export/excel`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  })
  .then(res => res.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Forum2027_Attendees_${new Date().toISOString().slice(0,10)}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  })
  .catch(err => alert('ไม่สามารถส่งออกไฟล์ Excel ได้: ' + err.message));
}

async function loadAuditLogs() {
  if (!adminToken) return;
  const container = document.getElementById('auditLogsTableBody');
  if (!container) return;

  try {
    const res = await fetch(`${ADMIN_API}/logs`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    container.innerHTML = data.logs.map((log, i) => `
      <tr class="hover:bg-stone-50 border-b border-stone-100 text-xs font-mono">
        <td class="p-2.5 text-stone-400">${i + 1}</td>
        <td class="p-2.5 font-bold text-emerald-800">${log.action}</td>
        <td class="p-2.5 text-stone-600">${log.target_type || '-'} (${log.target_id || '-'})</td>
        <td class="p-2.5 text-stone-700 max-w-xs truncate">${JSON.stringify(log.details)}</td>
        <td class="p-2.5 text-stone-400">${log.ip_address || '-'}</td>
        <td class="p-2.5 text-stone-500 whitespace-nowrap">${log.created_at}</td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Error loading audit logs:', err);
  }
}

async function handleUploadDocumentForm(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  try {
    const res = await fetch(`${ADMIN_API}/documents`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}` },
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'อัปโหลดไม่สำเร็จ');
    alert('บันทึกและเผยแพร่เอกสารเรียบร้อยแล้ว');
    form.reset();
    loadDashboardData();
  } catch (err) {
    alert('ข้อผิดพลาด: ' + err.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
});
