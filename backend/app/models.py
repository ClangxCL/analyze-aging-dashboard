import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from .database import Base

class AttendeePublic(Base):
    __tablename__ = "attendees_public"
    
    id = Column(Integer, primary_key=True, index=True)
    registration_code = Column(String(50), unique=True, index=True)
    title = Column(String(50), nullable=False) # นาย / นาง / นางสาว
    full_name = Column(String(255), nullable=False, index=True) # ชื่อ - นามสกุล
    age = Column(Integer, nullable=False)
    address = Column(Text, nullable=False)
    province = Column(String(100), nullable=False, index=True)
    amphoe = Column(String(100), nullable=False)
    tambon = Column(String(100), nullable=False)
    phone = Column(String(50), nullable=True)
    email = Column(String(100), nullable=True)
    interests = Column(Text, nullable=True) # Stored as JSON string
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class AttendeeMedical(Base):
    __tablename__ = "attendees_medical"
    
    id = Column(Integer, primary_key=True, index=True)
    registration_code = Column(String(50), unique=True, index=True)
    title = Column(String(50), nullable=False) # นาย / นาง / นางสาว / อื่นๆ
    full_name = Column(String(255), nullable=False, index=True)
    position = Column(String(100), nullable=False) # แพทย์, พยาบาล, ...
    position_other = Column(String(255), nullable=True)
    nursing_license_no = Column(String(100), nullable=True) # เลขขอหน่วยกิตพยาบาล
    organization = Column(String(255), nullable=False)
    health_region = Column(String(50), nullable=False, index=True) # เขตบริการสุขภาพ 1 - 12
    province = Column(String(100), nullable=False, index=True)
    amphoe = Column(String(100), nullable=False)
    tambon = Column(String(100), nullable=False)
    phone = Column(String(50), nullable=True)
    email = Column(String(100), nullable=True)
    interests = Column(Text, nullable=True) # JSON string
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class AttendeeAsean(Base):
    __tablename__ = "attendees_asean"
    
    id = Column(Integer, primary_key=True, index=True)
    registration_code = Column(String(50), unique=True, index=True)
    country = Column(String(100), nullable=False, index=True)
    country_other = Column(String(100), nullable=True)
    title = Column(String(50), nullable=False) # Prof., Dr., Mr., Ms., Miss, Other
    title_other = Column(String(50), nullable=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    full_name = Column(String(255), nullable=False, index=True)
    gender = Column(String(50), nullable=False)
    position = Column(String(150), nullable=False)
    organization = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    email = Column(String(150), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class EventDocument(Base):
    __tablename__ = "event_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50), nullable=False, index=True) # accommodation, event_material, etc.
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size_bytes = Column(Integer, default=0)
    upload_date = Column(DateTime, default=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class EventBanner(Base):
    __tablename__ = "event_banners"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    image_url = Column(String(500), nullable=False)
    dimensions = Column(String(50), default="1920x1080")
    display_order = Column(Integer, default=1)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class EventScheduleSlide(Base):
    __tablename__ = "event_schedule_slides"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    image_url = Column(String(500), nullable=False)
    page_number = Column(Integer, default=1)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(100), nullable=False, index=True)
    target_type = Column(String(100), nullable=True)
    target_id = Column(String(100), nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AdminUser(Base):
    __tablename__ = "admin_users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="superadmin")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
