"""
Unit tests for Analyze Aging database models, relationships, and audit logging.
"""

import pytest
import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
from backend.app.database import Base
from backend.app.models import Zone, Province, Screening9D, AnomalyAudit

# Use an in-memory SQLite database for isolated unit testing
TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="function")
def test_db():
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    
    yield session
    
    session.close()
    Base.metadata.drop_all(bind=engine)

def test_health_zone_creation(test_db):
    """Test creating HealthZone records and primary key uniqueness."""
    zone1 = Zone(zone_id="01", zone_name="เขตสุขภาพที่ 1")
    test_db.add(zone1)
    test_db.commit()
    
    fetched = test_db.query(Zone).filter(Zone.zone_id == "01").first()
    assert fetched is not None
    assert fetched.zone_name == "เขตสุขภาพที่ 1"
    
    # Duplicate primary key must raise IntegrityError
    duplicate_zone = Zone(zone_id="01", zone_name="เขตสุขภาพที่ 1 ซ้ำ")
    test_db.add(duplicate_zone)
    with pytest.raises(IntegrityError):
        test_db.commit()
    test_db.rollback()

def test_province_zone_relationship(test_db):
    """Test province creation and relationship back to health zone."""
    zone = Zone(zone_id="01", zone_name="เขตสุขภาพที่ 1")
    test_db.add(zone)
    test_db.commit()
    
    prov = Province(province_code="50", province_name_th="เชียงใหม่", zone_id="01")
    test_db.add(prov)
    test_db.commit()
    
    fetched_prov = test_db.query(Province).filter(Province.province_code == "50").first()
    assert fetched_prov is not None
    assert fetched_prov.zone.zone_name == "เขตสุขภาพที่ 1"
    assert len(zone.provinces) == 1
    assert zone.provinces[0].province_name_th == "เชียงใหม่"

def test_screening_9d_record_persistence(test_db):
    """Test persisting and querying multi-domain screening records."""
    domains_sample = {
        "d1_visual": {"screened": 1000, "risk": 50, "risk_pct": 5.0},
        "d6_depression": {"screened": 1000, "risk": 20, "risk_pct": 2.0, "extra_2q_plus": 5}
    }
    
    record = Screening9D(
        fiscal_year="2569",
        entity_type="province",
        entity_id="50",
        entity_name="เชียงใหม่",
        zone_id="01",
        target_pop=1500,
        screened_9d=1000,
        screened_9d_pct=66.67,
        domains_data=json.dumps(domains_sample),
        is_validated=True
    )
    test_db.add(record)
    test_db.commit()
    
    fetched = test_db.query(Screening9D).filter(
        Screening9D.fiscal_year == "2569",
        Screening9D.entity_id == "50"
    ).first()
    
    assert fetched is not None
    assert fetched.screened_9d == 1000
    parsed_domains = json.loads(fetched.domains_data)
    assert parsed_domains["d1_visual"]["risk_pct"] == 5.0
    assert parsed_domains["d6_depression"]["extra_2q_plus"] == 5

def test_anomaly_audit_logging(test_db):
    """Test logging and querying validation anomaly records."""
    audit = AnomalyAudit(
        rule_name="ARITHMETIC_INVARIANT",
        severity="WARNING",
        fiscal_year="2569",
        entity_id="10",
        details="Normal + Risk (1020) does not equal Screened (1000)",
        resolution_action="Recalculated risk percentage and logged warning"
    )
    test_db.add(audit)
    test_db.commit()
    
    audits = test_db.query(AnomalyAudit).filter(AnomalyAudit.rule_name == "ARITHMETIC_INVARIANT").all()
    assert len(audits) == 1
    assert audits[0].entity_id == "10"
    assert audits[0].severity == "WARNING"
    assert "Recalculated" in audits[0].resolution_action
