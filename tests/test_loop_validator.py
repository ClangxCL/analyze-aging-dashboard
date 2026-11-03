"""
Unit tests for Loop Engineering validation framework and anomaly logging.
"""

import pytest
import math
import json
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.database import Base
from backend.app.models import AnomalyAudit
from backend.app.services.loop_validator import LoopValidator

TEST_DB_URL = "sqlite:///:memory:"

@pytest.fixture
def validator_with_db(tmp_path):
    engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSession()
    audit_file = tmp_path / "anomalies_test.json"
    
    val = LoopValidator(db=session, audit_file=audit_file)
    yield val, session, audit_file
    
    session.close()
    Base.metadata.drop_all(bind=engine)

def test_loop1_ingestion_schema(validator_with_db):
    val, session, _ = validator_with_db
    
    # Valid dataset
    valid_data = {
        "years": {
            "2567": {"zones": [{"zone_id": str(i)} for i in range(1, 14)], "provinces": [{"province_code": str(i)} for i in range(1, 78)]},
            "2568": {"zones": [{"zone_id": str(i)} for i in range(1, 14)], "provinces": [{"province_code": str(i)} for i in range(1, 78)]},
            "2569": {"zones": [{"zone_id": str(i)} for i in range(1, 14)], "provinces": [{"province_code": str(i)} for i in range(1, 78)]}
        }
    }
    res = val.validate_ingestion_schema(valid_data)
    assert res["is_valid"] is True
    assert res["status"] == "PASSED"
    
    # Corrupted: missing year 2569
    corrupted_data = {
        "years": {
            "2567": {"zones": [], "provinces": []},
            "2568": {"zones": [], "provinces": []}
        }
    }
    res_corrupt = val.validate_ingestion_schema(corrupted_data)
    assert res_corrupt["is_valid"] is False
    assert any("2569" in issue for issue in res_corrupt["issues"])
    assert len(val.anomalies) > 0

def test_loop2_arithmetic_invariants(validator_with_db):
    val, session, _ = validator_with_db
    
    # Test Screened > Target: coverage capped at 100%
    corrupt_rec = {
        "target_pop": 500,
        "screened_9d": 800,
        "screened_9d_pct": 160.0,
        "domains": {
            "d1_visual": {"screened": 800, "risk": 80, "risk_pct": 10.0, "normal": 720}
        }
    }
    res = val.validate_arithmetic_invariants(corrupt_rec, "2569", "50")
    assert res["remediated"] is True
    assert corrupt_rec["screened_9d_pct"] == 100.0
    
    # Test zero-division safeguard: screened == 0
    zero_rec = {
        "target_pop": 100,
        "screened_9d": 0,
        "screened_9d_pct": 0.0,
        "domains": {
            "d1_visual": {"screened": 0, "risk": 0, "risk_pct": 50.0}  # Broken initial risk_pct
        }
    }
    res_zero = val.validate_arithmetic_invariants(zero_rec, "2569", "10")
    assert zero_rec["domains"]["d1_visual"]["risk_pct"] == 0.0
    
    # Test discrepancy auto-repair
    discrepant_rec = {
        "target_pop": 1000,
        "screened_9d": 1000,
        "domains": {
            "d2_incontinence": {"screened": 1000, "risk": 150, "risk_pct": 5.0}  # 150/1000 is 15.0%, not 5.0%
        }
    }
    val.validate_arithmetic_invariants(discrepant_rec, "2569", "70")
    assert discrepant_rec["domains"]["d2_incontinence"]["risk_pct"] == 15.0

def test_loop3_hierarchical_rollup(validator_with_db):
    val, session, _ = validator_with_db
    
    provinces = [
        {"province_code": "50", "zone_id": "01", "screened_9d": 600},
        {"province_code": "51", "zone_id": "01", "screened_9d": 400}
    ]
    zones = [
        {"zone_id": "01", "screened_9d": 1000}
    ]
    
    res = val.validate_hierarchical_rollup(provinces, zones, fiscal_year="2569")
    assert res["is_valid"] is True
    assert res["status"] == "PASSED"
    
    # Large mismatch
    bad_zones = [{"zone_id": "01", "screened_9d": 2000}]  # 1000 vs 2000 (100% error)
    bad_res = val.validate_hierarchical_rollup(provinces, bad_zones, fiscal_year="2569")
    assert bad_res["is_valid"] is False
    assert len(bad_res["discrepancies"]) == 1

def test_loop4_geo_topology(validator_with_db):
    val, session, _ = validator_with_db
    
    mock_geojson = {
        "features": [
            {"properties": {"code": "10"}},
            {"properties": {"code": "50"}}
        ]
    }
    
    provinces = [
        {"province_code": "10", "province_name": "กรุงเทพมหานคร"},
        {"province_code": "50", "province_name": "เชียงใหม่"}
    ]
    
    res = val.validate_geo_topology(provinces, geojson_data=mock_geojson)
    assert res["is_valid"] is True
    assert res["match_rate_pct"] == 100.0
    
    # Unmatched province (code 99)
    provinces.append({"province_code": "99", "province_name": "แดนสมมติ"})
    bad_res = val.validate_geo_topology(provinces, geojson_data=mock_geojson)
    assert bad_res["is_valid"] is False
    assert len(bad_res["unmatched"]) == 1
    assert bad_res["unmatched"][0]["code"] == "99"

def test_loop5_serving_telemetry(validator_with_db):
    val, session, _ = validator_with_db
    
    clean_payload = {"summary": {"total_pop": 1000, "risk_pct": 12.5}}
    res = val.validate_serving_payload(clean_payload)
    assert res["is_valid"] is True
    assert res["status"] == "PASSED"
    
    # Broken payload with NaN
    nan_payload = {"summary": {"total_pop": 1000, "risk_pct": float("nan")}}
    bad_res = val.validate_serving_payload(nan_payload)
    assert bad_res["is_valid"] is False
    assert len(bad_res["nan_errors"]) > 0

def test_audit_persistence(validator_with_db):
    val, session, audit_file = validator_with_db
    
    val.log_anomaly("TEST_RULE", "ERROR", "2569", "50", "Test anomaly message", "Manual audit required")
    val.persist_audit_file()
    
    # Verify DB persistence
    db_entry = session.query(AnomalyAudit).filter(AnomalyAudit.rule_name == "TEST_RULE").first()
    assert db_entry is not None
    assert db_entry.details == "Test anomaly message"
    
    # Verify File persistence
    assert audit_file.exists()
    with open(audit_file, "r", encoding="utf-8") as f:
        file_data = json.load(f)
    assert file_data["total_anomalies"] == 1
    assert file_data["items"][0]["entity_id"] == "50"
