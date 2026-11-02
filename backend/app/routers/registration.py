import json
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from ..database import get_db
from ..models import AttendeePublic, AttendeeMedical, AttendeeAsean
from ..schemas import (
    PublicRegisterRequest, MedicalRegisterRequest, AseanRegisterRequest,
    RegistrationResponse
)
from ..services.deduplication import (
    handle_public_registration, handle_medical_registration, handle_asean_registration
)

router = APIRouter(prefix="/register", tags=["Registration"])

@router.post("/public", response_model=RegistrationResponse)
def register_public(req: PublicRegisterRequest, request: Request, db: Session = Depends(get_db)):
    client_ip = request.client.host if (request and request.client) else "127.0.0.1"
    attendee, is_updated = handle_public_registration(db, req.model_dump(), ip_address=client_ip)
    
    msg = "อัปเดตข้อมูลการลงทะเบียนล่าสุดเรียบร้อยแล้ว (ตรวจพบชื่อ-นามสกุลในระบบ)" if is_updated else "ลงทะเบียนสำเร็จเรียบร้อยแล้ว"
    
    return RegistrationResponse(
        status="success",
        message=msg,
        registration_code=attendee.registration_code,
        is_updated=is_updated,
        attendee={
            "id": attendee.id,
            "title": attendee.title,
            "full_name": attendee.full_name,
            "province": attendee.province,
            "registration_code": attendee.registration_code
        }
    )

@router.post("/medical", response_model=RegistrationResponse)
def register_medical(req: MedicalRegisterRequest, request: Request, db: Session = Depends(get_db)):
    client_ip = request.client.host if (request and request.client) else "127.0.0.1"
    attendee, is_updated = handle_medical_registration(db, req.model_dump(), ip_address=client_ip)
    
    msg = "อัปเดตข้อมูลการลงทะเบียนล่าสุดเรียบร้อยแล้ว (ตรวจพบชื่อ-นามสกุลในระบบ)" if is_updated else "ลงทะเบียนสำเร็จเรียบร้อยแล้ว"
    
    return RegistrationResponse(
        status="success",
        message=msg,
        registration_code=attendee.registration_code,
        is_updated=is_updated,
        attendee={
            "id": attendee.id,
            "title": attendee.title,
            "full_name": attendee.full_name,
            "organization": attendee.organization,
            "health_region": attendee.health_region,
            "registration_code": attendee.registration_code
        }
    )

@router.post("/asean", response_model=RegistrationResponse)
def register_asean(req: AseanRegisterRequest, request: Request, db: Session = Depends(get_db)):
    client_ip = request.client.host if (request and request.client) else "127.0.0.1"
    attendee, is_updated = handle_asean_registration(db, req.model_dump(), ip_address=client_ip)
    
    msg = "Registration updated with latest information." if is_updated else "Registration successful."
    
    return RegistrationResponse(
        status="success",
        message=msg,
        registration_code=attendee.registration_code,
        is_updated=is_updated,
        attendee={
            "id": attendee.id,
            "title": attendee.title,
            "full_name": attendee.full_name,
            "country": attendee.country,
            "organization": attendee.organization,
            "registration_code": attendee.registration_code
        }
    )

@router.get("/status/search")
def search_registration_status(query: str, db: Session = Depends(get_db)):
    q = query.strip()
    if not q or len(q) < 2:
        return {"results": []}
    
    results = []
    
    # 1. Search in Public
    pub_matches = db.query(AttendeePublic).filter(
        AttendeePublic.full_name.ilike(f"%{q}%")
    ).all()
    for p in pub_matches:
        results.append({
            "registration_code": p.registration_code,
            "category": "ประชาชนทั่วไป / ผู้สูงอายุ",
            "category_key": "public",
            "full_name": p.full_name,
            "detail": f"จ.{p.province} อ.{p.amphoe}",
            "created_at": p.created_at.strftime("%d/%m/%Y %H:%M"),
            "status": "ลงทะเบียนสำเร็จ (ยืนยัน)"
        })
        
    # 2. Search in Medical
    med_matches = db.query(AttendeeMedical).filter(
        AttendeeMedical.full_name.ilike(f"%{q}%")
    ).all()
    for m in med_matches:
        results.append({
            "registration_code": m.registration_code,
            "category": "บุคลากรทางการแพทย์และสาธารณสุข",
            "category_key": "medical",
            "full_name": m.full_name,
            "detail": f"{m.organization} ({m.health_region})",
            "created_at": m.created_at.strftime("%d/%m/%Y %H:%M"),
            "status": "ลงทะเบียนสำเร็จ (ยืนยัน)"
        })
        
    # 3. Search in ASEAN
    asn_matches = db.query(AttendeeAsean).filter(
        or_(
            AttendeeAsean.full_name.ilike(f"%{q}%"),
            AttendeeAsean.first_name.ilike(f"%{q}%"),
            AttendeeAsean.last_name.ilike(f"%{q}%")
        )
    ).all()
    for a in asn_matches:
        results.append({
            "registration_code": a.registration_code,
            "category": "ASEAN Member States Delegate",
            "category_key": "asean",
            "full_name": a.full_name,
            "detail": f"{a.organization}, {a.country}",
            "created_at": a.created_at.strftime("%d/%m/%Y %H:%M"),
            "status": "Confirmed"
        })
        
    return {"query": q, "count": len(results), "results": results}
