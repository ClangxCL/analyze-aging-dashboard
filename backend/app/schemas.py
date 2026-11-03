from typing import List, Optional, Dict, Any
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


# ==========================================
# Analyze Aging: 9-Domain Analytics Schemas
# ==========================================

class DomainMetric(BaseModel):
    num: int
    name_th: str
    name_en: str
    screened: int
    screened_pct: float
    normal: int
    risk: int
    risk_pct: float
    extra_2q_plus: Optional[int] = None

class NationalDomainRankItem(BaseModel):
    rank: int
    domain_id: str
    num: int
    name_th: str
    name_en: str
    screened: int
    screened_pct: float
    risk: int
    risk_pct: float
    severity_tier: str

class AgingKPISummary(BaseModel):
    fiscal_year: str
    entity_id: Optional[str] = "TH"
    entity_name: Optional[str] = "ทั้งประเทศ"
    entity_type: Optional[str] = "national"
    target_pop: int
    screened_9d: int
    screened_9d_pct: float
    highest_risk_domain: Dict[str, Any]
    domains: Dict[str, DomainMetric]
    domain_rankings: Optional[List[NationalDomainRankItem]] = None

class ProvinceItem(BaseModel):
    province_code: str
    province_name_th: str
    province_name_en: Optional[str] = None
    zone_id: str

class RankingItem(BaseModel):
    rank: int
    entity_id: str
    entity_name: str
    zone_id: Optional[str] = None
    target_pop: int
    screened: int
    risk: int
    risk_pct: float

class RankingResponse(BaseModel):
    fiscal_year: str
    domain_id: str
    domain_name: str
    level: str
    zone_filter: Optional[str] = None
    order: Optional[str] = "desc"
    total_items: int
    rankings: List[RankingItem]

class HeatmapCell(BaseModel):
    domain_id: str
    domain_name: str
    screened: int
    risk: int
    risk_pct: float
    severity_tier: str  # "low", "moderate", "high", "critical"

class HeatmapRow(BaseModel):
    entity_id: str
    entity_name: str
    zone_id: Optional[str] = None
    target_pop: int
    screened_9d: int
    screened_9d_pct: float
    domains: Dict[str, HeatmapCell]

class HeatmapResponse(BaseModel):
    fiscal_year: str
    level: str
    rows: List[HeatmapRow]

class ValidationHealthResponse(BaseModel):
    overall_status: str
    timestamp: str
    total_anomalies_recorded: int
    loops: Dict[str, Any]

