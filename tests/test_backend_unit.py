import pytest
from backend.app.config import settings
from backend.app.seed_data import init_and_seed
from backend.app.database import SessionLocal
from backend.app.schemas import (
    PublicRegisterRequest, MedicalRegisterRequest, AseanRegisterRequest, AdminLoginRequest
)
from backend.app.routers import registration, content, admin

@pytest.fixture(scope="module")
def db():
    init_and_seed()
    session = SessionLocal()
    yield session
    session.close()

def test_content_apis(db):
    banners = content.get_banners(db=db)
    assert len(banners["banners"]) >= 1
    assert any("1920x1080" in b["dimensions"] for b in banners["banners"])

    schedules = content.get_schedules(db=db)
    assert len(schedules["schedules"]) >= 1

    docs = content.get_documents(db=db)
    assert len(docs["documents"]) >= 1

def test_public_registration_and_deduplication(db):
    req_pub = PublicRegisterRequest(
        title="นาย",
        full_name="สมเกียรติ พึ่งพาธรรม",
        age=70,
        address="88/4 ม.5",
        province="นนทบุรี",
        amphoe="ปากเกร็ด",
        tambon="บางพูด",
        phone="0819991111",
        interests=["พิธีเปิดและเสวนาช่วงเช้า", "ชมนิทรรศการ/บูธ"]
    )
    # First registration
    res1 = registration.register_public(req=req_pub, request=None, db=db)
    assert res1.status == "success"
    assert f"PUB-{settings.EVENT_YEAR}-" in res1.registration_code

    # Second registration with duplicate name (deduplication test)
    req_pub.phone = "0819992222"
    res2 = registration.register_public(req=req_pub, request=None, db=db)
    assert res2.status == "success"
    assert res2.is_updated is True
    assert res2.registration_code == res1.registration_code

def test_medical_registration(db):
    req_med = MedicalRegisterRequest(
        title="แพทย์",
        full_name="นพ. วรวิทย์ เกรียงไกร",
        position="แพทย์",
        nursing_license_no=None,
        organization="โรงพยาบาลศูนย์อุดรธานี",
        health_region="เขตสุขภาพที่ 8",
        province="อุดรธานี",
        amphoe="เมืองอุดรธานี",
        tambon="หมากแข้ง",
        phone="0871112233",
        interests=["การเสวนาวิชาการ ห้องบุคลาการทางการแพทย์และสาธารณสุข"]
    )
    res = registration.register_medical(req=req_med, request=None, db=db)
    assert res.status == "success"
    assert f"MED-{settings.EVENT_YEAR}-" in res.registration_code

def test_asean_registration(db):
    req_asn = AseanRegisterRequest(
        country="Philippines",
        title="Dr.",
        first_name="Maria",
        last_name="Santos",
        gender="Female",
        position="Chief Medical Officer",
        organization="Philippine General Hospital",
        phone="+63 2 8554 8400",
        email="m.santos@pgh.gov.ph"
    )
    res = registration.register_asean(req=req_asn, request=None, db=db)
    assert res.status == "success"
    assert f"ASN-{settings.EVENT_YEAR}-" in res.registration_code

def test_status_search(db):
    search_res = registration.search_registration_status(query="สมเกียรติ", db=db)
    assert search_res["count"] >= 1
    assert any("สมเกียรติ พึ่งพาธรรม" in r["full_name"] for r in search_res["results"])

def test_admin_flow_and_excel(db):
    # Admin login
    login_res = admin.admin_login(req=AdminLoginRequest(username="admin", password="forum2026"), db=db)
    assert login_res.access_token is not None

    token_payload = admin.verify_token(authorization=f"Bearer {login_res.access_token}")
    
    # Dashboard stats
    stats = admin.get_dashboard_stats(db=db, token=token_payload)
    assert stats["summary"]["total_attendees"] >= 5
    assert len(stats["regional_breakdown"]) >= 1

    # Attendees list
    attendees = admin.get_attendees(category="all", search="", page=1, limit=20, db=db, token=token_payload)
    assert attendees["total"] >= 5

    # Excel export
    excel_res = admin.export_attendees_excel(db=db, token=token_payload)
    assert len(excel_res.body) > 2000
    assert "openxmlformats" in excel_res.media_type

    # Audit logs
    logs = admin.get_audit_logs(limit=20, db=db, token=token_payload)
    assert len(logs["logs"]) >= 1
