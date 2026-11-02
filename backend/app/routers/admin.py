import os
import shutil
import json
import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Header
from fastapi.responses import Response, StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from passlib.context import CryptContext
from ..auth import create_access_token, verify_access_token

from ..database import get_db
from ..models import (
    AdminUser, AttendeePublic, AttendeeMedical, AttendeeAsean,
    EventDocument, EventBanner, EventScheduleSlide, AuditLog
)
from ..schemas import AdminLoginRequest, AdminLoginResponse
from ..services.audit import log_audit
from ..services.excel_export import generate_attendees_excel
from ..config import settings

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
router = APIRouter(prefix="/admin", tags=["Admin CMS & Operations"])

def verify_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization Header")
    try:
        token = authorization.replace("Bearer ", "").strip()
        payload = verify_access_token(token)
        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid or expired authentication token: {str(e)}")

@router.post("/login", response_model=AdminLoginResponse)
def admin_login(req: AdminLoginRequest, db: Session = Depends(get_db)):
    user = db.query(AdminUser).filter(AdminUser.username == req.username).first()
    if not user:
        # Check default master fallback if not seeded
        if req.username == "admin" and req.password == "forum2026":
            token = create_access_token({"sub": "admin", "role": "superadmin"})
            return AdminLoginResponse(
                access_token=token,
                full_name="ผู้ดูแลระบบ (Admin MOPH)",
                role="superadmin"
            )
        raise HTTPException(status_code=401, detail="ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง")
        
    if not pwd_context.verify(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง")
        
    token = create_access_token({"sub": user.username, "role": user.role})
    log_audit(db, "ADMIN_LOGIN", target_type="AdminUser", target_id=str(user.id), details={"username": user.username})
    return AdminLoginResponse(
        access_token=token,
        full_name=user.full_name,
        role=user.role
    )

@router.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db), token: dict = Depends(verify_token)):
    pub_count = db.query(AttendeePublic).count()
    med_count = db.query(AttendeeMedical).count()
    asean_count = db.query(AttendeeAsean).count()
    total = pub_count + med_count + asean_count
    
    # Regional breakdown (Health regions)
    regions_query = db.query(
        AttendeeMedical.health_region, func.count(AttendeeMedical.id)
    ).group_by(AttendeeMedical.health_region).all()
    regional_breakdown = {r[0]: r[1] for r in regions_query if r[0]}
    
    # Top Provinces in Public
    prov_query = db.query(
        AttendeePublic.province, func.count(AttendeePublic.id)
    ).group_by(AttendeePublic.province).order_by(func.count(AttendeePublic.id).desc()).limit(7).all()
    top_provinces = {p[0]: p[1] for p in prov_query if p[0]}
    
    # ASEAN Countries Breakdown
    asean_query = db.query(
        AttendeeAsean.country, func.count(AttendeeAsean.id)
    ).group_by(AttendeeAsean.country).all()
    asean_breakdown = {c[0]: c[1] for c in asean_query if c[0]}
    
    # Recent 10 audit logs
    recent_logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(8).all()
    logs_summary = [
        {
            "id": l.id,
            "action": l.action,
            "target": f"{l.target_type or ''} #{l.target_id or ''}",
            "time": l.created_at.strftime("%H:%M:%S (%d/%m)"),
            "details": json.loads(l.details) if l.details else {}
        }
        for l in recent_logs
    ]
    
    return {
        "summary": {
            "total_attendees": total,
            "public_count": pub_count,
            "medical_count": med_count,
            "asean_count": asean_count
        },
        "regional_breakdown": regional_breakdown,
        "top_provinces": top_provinces,
        "asean_breakdown": asean_breakdown,
        "recent_logs": logs_summary
    }

@router.get("/attendees")
def get_attendees(
    category: str = "all",
    search: str = "",
    page: int = 1,
    limit: int = 25,
    db: Session = Depends(get_db),
    token: dict = Depends(verify_token)
):
    items = []
    
    # Public
    if category in ["all", "public"]:
        q = db.query(AttendeePublic)
        if search:
            q = q.filter(AttendeePublic.full_name.ilike(f"%{search}%"))
        for p in q.all():
            items.append({
                "id": p.id,
                "category": "public",
                "category_label": "ประชาชนทั่วไป / ผู้สูงอายุ",
                "registration_code": p.registration_code,
                "full_name": f"{p.title} {p.full_name}",
                "detail": f"อายุ {p.age} ปี, จ.{p.province} อ.{p.amphoe}",
                "phone": p.phone or "-",
                "email": p.email or "-",
                "updated_at": p.updated_at.strftime("%d/%m/%Y %H:%M") if p.updated_at else ""
            })
            
    # Medical
    if category in ["all", "medical"]:
        q = db.query(AttendeeMedical)
        if search:
            q = q.filter(AttendeeMedical.full_name.ilike(f"%{search}%"))
        for m in q.all():
            items.append({
                "id": m.id,
                "category": "medical",
                "category_label": "บุคลากรทางการแพทย์",
                "registration_code": m.registration_code,
                "full_name": f"{m.title} {m.full_name}",
                "detail": f"{m.position} - {m.organization} ({m.health_region})",
                "phone": m.phone or "-",
                "email": m.email or "-",
                "updated_at": m.updated_at.strftime("%d/%m/%Y %H:%M") if m.updated_at else ""
            })
            
    # ASEAN
    if category in ["all", "asean"]:
        q = db.query(AttendeeAsean)
        if search:
            q = q.filter(AttendeeAsean.full_name.ilike(f"%{search}%"))
        for a in q.all():
            items.append({
                "id": a.id,
                "category": "asean",
                "category_label": "ASEAN Delegate",
                "registration_code": a.registration_code,
                "full_name": f"{a.title} {a.full_name}",
                "detail": f"{a.position} - {a.organization}, {a.country}",
                "phone": a.phone or "-",
                "email": a.email or "-",
                "updated_at": a.updated_at.strftime("%d/%m/%Y %H:%M") if a.updated_at else ""
            })
            
    # Pagination in memory
    total_count = len(items)
    start = (page - 1) * limit
    paginated_items = items[start:start + limit]
    
    return {
        "total": total_count,
        "page": page,
        "limit": limit,
        "items": paginated_items
    }

@router.get("/export/excel")
def export_attendees_excel(db: Session = Depends(get_db), token: dict = Depends(verify_token)):
    excel_stream = generate_attendees_excel(db)
    log_audit(db, "EXPORT_EXCEL", details={"timestamp": datetime.datetime.utcnow().isoformat()})
    
    filename = f"Forum2027_Attendees_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    return Response(
        content=excel_stream.getvalue(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.post("/documents")
def create_document(
    title: str = Form(...),
    category: str = Form(...), # accommodation, event_material, etc.
    description: str = Form(""),
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
    token: dict = Depends(verify_token)
):
    saved_file_name = "default_document.pdf"
    file_size = 0
    
    if file:
        saved_file_name = f"{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
        dest_path = os.path.join(settings.DOCS_DIR, saved_file_name)
        with open(dest_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        file_size = os.path.getsize(dest_path)
    else:
        # Create a stub file if none uploaded
        dest_path = os.path.join(settings.DOCS_DIR, saved_file_name)
        if not os.path.exists(dest_path):
            with open(dest_path, "w", encoding="utf-8") as f:
                f.write(f"Sample Document: {title}\nUploaded via Forum 2026 CMS")
        file_size = os.path.getsize(dest_path)
        
    doc = EventDocument(
        category=category,
        title=title,
        description=description,
        file_name=file.filename if file else title,
        file_path=saved_file_name,
        file_size_bytes=file_size,
        upload_date=datetime.datetime.utcnow(),
        is_active=True
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    
    log_audit(db, "UPLOAD_DOCUMENT", target_type="EventDocument", target_id=str(doc.id), details={"title": title, "category": category})
    return {"status": "success", "message": "เพิ่มเอกสารสำเร็จ", "id": doc.id}

@router.delete("/documents/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db), token: dict = Depends(verify_token)):
    doc = db.query(EventDocument).filter(EventDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    db.delete(doc)
    db.commit()
    log_audit(db, "DELETE_DOCUMENT", target_type="EventDocument", target_id=str(doc_id), details={"title": doc.title})
    return {"status": "success", "message": "ลบเอกสารสำเร็จ"}

@router.get("/logs")
def get_audit_logs(limit: int = 50, db: Session = Depends(get_db), token: dict = Depends(verify_token)):
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).all()
    return {
        "logs": [
            {
                "id": l.id,
                "action": l.action,
                "target_type": l.target_type,
                "target_id": l.target_id,
                "details": json.loads(l.details) if l.details else {},
                "ip_address": l.ip_address,
                "created_at": l.created_at.strftime("%d/%m/%Y %H:%M:%S")
            }
            for l in logs
        ]
    }
