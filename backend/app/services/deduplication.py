import json
import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models import AttendeePublic, AttendeeMedical, AttendeeAsean
from ..config import settings
from .audit import log_audit

def normalize_name(name: str) -> str:
    """Removes duplicate spaces and standardizes name."""
    if not name:
        return ""
    return " ".join(name.strip().split())

def handle_public_registration(db: Session, data: dict, ip_address: str = None):
    norm_name = normalize_name(data.get("full_name", ""))
    existing = db.query(AttendeePublic).filter(
        func.lower(AttendeePublic.full_name) == func.lower(norm_name)
    ).first()
    
    interests_json = json.dumps(data.get("interests", []), ensure_ascii=False)
    
    if existing:
        # Update existing record with the latest submitted details
        old_info = {
            "phone": existing.phone,
            "province": existing.province,
            "address": existing.address
        }
        existing.title = data.get("title", existing.title)
        existing.age = data.get("age", existing.age)
        existing.address = data.get("address", existing.address)
        existing.province = data.get("province", existing.province)
        existing.amphoe = data.get("amphoe", existing.amphoe)
        existing.tambon = data.get("tambon", existing.tambon)
        existing.phone = data.get("phone", existing.phone)
        existing.email = data.get("email", existing.email)
        existing.interests = interests_json
        existing.updated_at = datetime.datetime.utcnow()
        db.commit()
        db.refresh(existing)
        
        log_audit(
            db=db,
            action="DEDUPLICATE_UPDATE_PUBLIC",
            target_type="AttendeePublic",
            target_id=str(existing.id),
            details={
                "name": norm_name,
                "registration_code": existing.registration_code,
                "reason": "Name already exists. Overwriting with latest update per specification.",
                "previous_info": old_info
            },
            ip_address=ip_address
        )
        return existing, True
    else:
        # Generate new registration code: PUB-2027-XXXX
        count = db.query(AttendeePublic).count() + 1
        reg_code = f"PUB-{settings.EVENT_YEAR}-{count:04d}"
        
        new_attendee = AttendeePublic(
            registration_code=reg_code,
            title=data.get("title"),
            full_name=norm_name,
            age=data.get("age"),
            address=data.get("address"),
            province=data.get("province"),
            amphoe=data.get("amphoe"),
            tambon=data.get("tambon"),
            phone=data.get("phone"),
            email=data.get("email"),
            interests=interests_json
        )
        db.add(new_attendee)
        db.commit()
        db.refresh(new_attendee)
        
        log_audit(
            db=db,
            action="CREATE_REGISTRATION_PUBLIC",
            target_type="AttendeePublic",
            target_id=str(new_attendee.id),
            details={"name": norm_name, "registration_code": reg_code},
            ip_address=ip_address
        )
        return new_attendee, False

def handle_medical_registration(db: Session, data: dict, ip_address: str = None):
    norm_name = normalize_name(data.get("full_name", ""))
    existing = db.query(AttendeeMedical).filter(
        func.lower(AttendeeMedical.full_name) == func.lower(norm_name)
    ).first()
    
    interests_json = json.dumps(data.get("interests", []), ensure_ascii=False)
    
    if existing:
        existing.title = data.get("title", existing.title)
        existing.position = data.get("position", existing.position)
        existing.position_other = data.get("position_other", existing.position_other)
        existing.nursing_license_no = data.get("nursing_license_no", existing.nursing_license_no)
        existing.organization = data.get("organization", existing.organization)
        existing.health_region = data.get("health_region", existing.health_region)
        existing.province = data.get("province", existing.province)
        existing.amphoe = data.get("amphoe", existing.amphoe)
        existing.tambon = data.get("tambon", existing.tambon)
        existing.phone = data.get("phone", existing.phone)
        existing.email = data.get("email", existing.email)
        existing.interests = interests_json
        existing.updated_at = datetime.datetime.utcnow()
        db.commit()
        db.refresh(existing)
        
        log_audit(
            db=db,
            action="DEDUPLICATE_UPDATE_MEDICAL",
            target_type="AttendeeMedical",
            target_id=str(existing.id),
            details={"name": norm_name, "registration_code": existing.registration_code, "reason": "Deduplicate name overwrite"},
            ip_address=ip_address
        )
        return existing, True
    else:
        count = db.query(AttendeeMedical).count() + 1
        reg_code = f"MED-{settings.EVENT_YEAR}-{count:04d}"
        
        new_attendee = AttendeeMedical(
            registration_code=reg_code,
            title=data.get("title"),
            full_name=norm_name,
            position=data.get("position"),
            position_other=data.get("position_other"),
            nursing_license_no=data.get("nursing_license_no"),
            organization=data.get("organization"),
            health_region=data.get("health_region"),
            province=data.get("province"),
            amphoe=data.get("amphoe"),
            tambon=data.get("tambon"),
            phone=data.get("phone"),
            email=data.get("email"),
            interests=interests_json
        )
        db.add(new_attendee)
        db.commit()
        db.refresh(new_attendee)
        
        log_audit(
            db=db,
            action="CREATE_REGISTRATION_MEDICAL",
            target_type="AttendeeMedical",
            target_id=str(new_attendee.id),
            details={"name": norm_name, "registration_code": reg_code},
            ip_address=ip_address
        )
        return new_attendee, False

def handle_asean_registration(db: Session, data: dict, ip_address: str = None):
    first_name = normalize_name(data.get("first_name", ""))
    last_name = normalize_name(data.get("last_name", ""))
    full_name = f"{first_name} {last_name}".strip()
    
    existing = db.query(AttendeeAsean).filter(
        func.lower(AttendeeAsean.full_name) == func.lower(full_name)
    ).first()
    
    if existing:
        existing.country = data.get("country", existing.country)
        existing.country_other = data.get("country_other", existing.country_other)
        existing.title = data.get("title", existing.title)
        existing.title_other = data.get("title_other", existing.title_other)
        existing.gender = data.get("gender", existing.gender)
        existing.position = data.get("position", existing.position)
        existing.organization = data.get("organization", existing.organization)
        existing.phone = data.get("phone", existing.phone)
        existing.email = data.get("email", existing.email)
        existing.updated_at = datetime.datetime.utcnow()
        db.commit()
        db.refresh(existing)
        
        log_audit(
            db=db,
            action="DEDUPLICATE_UPDATE_ASEAN",
            target_type="AttendeeAsean",
            target_id=str(existing.id),
            details={"name": full_name, "registration_code": existing.registration_code, "reason": "Deduplicate name overwrite"},
            ip_address=ip_address
        )
        return existing, True
    else:
        count = db.query(AttendeeAsean).count() + 1
        reg_code = f"ASN-{settings.EVENT_YEAR}-{count:04d}"
        
        new_attendee = AttendeeAsean(
            registration_code=reg_code,
            country=data.get("country"),
            country_other=data.get("country_other"),
            title=data.get("title"),
            title_other=data.get("title_other"),
            first_name=first_name,
            last_name=last_name,
            full_name=full_name,
            gender=data.get("gender"),
            position=data.get("position"),
            organization=data.get("organization"),
            phone=data.get("phone"),
            email=data.get("email")
        )
        db.add(new_attendee)
        db.commit()
        db.refresh(new_attendee)
        
        log_audit(
            db=db,
            action="CREATE_REGISTRATION_ASEAN",
            target_type="AttendeeAsean",
            target_id=str(new_attendee.id),
            details={"name": full_name, "registration_code": reg_code},
            ip_address=ip_address
        )
        return new_attendee, False
