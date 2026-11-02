from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# Registration schemas
class PublicRegisterRequest(BaseModel):
    title: str = Field(..., example="นาย")
    full_name: str = Field(..., example="สมหมาย ใจดี")
    age: int = Field(..., ge=1, le=130, example=68)
    address: str = Field(..., example="123 หมู่ 4")
    province: str = Field(..., example="นนทบุรี")
    amphoe: str = Field(..., example="เมืองนนทบุรี")
    tambon: str = Field(..., example="บางกระสอ")
    phone: Optional[str] = Field(None, example="0812345678")
    email: Optional[str] = Field(None, example="sommai@example.com")
    interests: Optional[List[str]] = Field(default_factory=list)

class MedicalRegisterRequest(BaseModel):
    title: str = Field(..., example="พยาบาล")
    full_name: str = Field(..., example="สุภาภรณ์ รักษาดี")
    position: str = Field(..., example="พยาบาล")
    position_other: Optional[str] = None
    nursing_license_no: Optional[str] = Field(None, example="5812345678")
    organization: str = Field(..., example="โรงพยาบาลศูนย์ขอนแก่น")
    health_region: str = Field(..., example="เขตสุขภาพที่ 7")
    province: str = Field(..., example="ขอนแก่น")
    amphoe: str = Field(..., example="เมืองขอนแก่น")
    tambon: str = Field(..., example="ในเมือง")
    phone: Optional[str] = Field(None, example="0898765432")
    email: Optional[str] = Field(None, example="nurse.supa@moph.mail.go.th")
    interests: Optional[List[str]] = Field(default_factory=list)

class AseanRegisterRequest(BaseModel):
    country: str = Field(..., example="Singapore")
    country_other: Optional[str] = None
    title: str = Field(..., example="Dr.")
    title_other: Optional[str] = None
    first_name: str = Field(..., example="Wei")
    last_name: str = Field(..., example="Tan")
    gender: str = Field(..., example="Male")
    position: str = Field(..., example="Geriatrician / Medical Officer")
    organization: str = Field(..., example="Singapore General Hospital")
    phone: str = Field(..., example="+65 9123 4567")
    email: str = Field(..., example="wei.tan@sgh.com.sg")

class RegistrationResponse(BaseModel):
    status: str
    message: str
    registration_code: str
    is_updated: bool = False
    attendee: dict

# Search Schema
class SearchResultItem(BaseModel):
    registration_code: str
    category: str
    full_name: str
    organization_or_address: str
    created_at: datetime

# Document Schemas
class EventDocumentResponse(BaseModel):
    id: int
    category: str
    title: str
    description: Optional[str]
    file_name: str
    download_url: str
    file_size_formatted: str
    upload_date: datetime

# Admin Schemas
class AdminLoginRequest(BaseModel):
    username: str
    password: str

class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    full_name: str
    role: str

class DashboardStatsResponse(BaseModel):
    total_attendees: int
    public_count: int
    medical_count: int
    asean_count: int
    regional_breakdown: dict
    popular_interests: dict
    recent_registrations: list
