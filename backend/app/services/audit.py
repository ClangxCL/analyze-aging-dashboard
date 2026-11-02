import json
from sqlalchemy.orm import Session
from ..models import AuditLog

def log_audit(db: Session, action: str, target_type: str = None, target_id: str = None, details: dict = None, ip_address: str = None):
    try:
        log_entry = AuditLog(
            action=action,
            target_type=target_type,
            target_id=str(target_id) if target_id else None,
            details=json.dumps(details, ensure_ascii=False) if details else None,
            ip_address=ip_address
        )
        db.add(log_entry)
        db.commit()
    except Exception as e:
        print(f"Error writing audit log: {e}")
