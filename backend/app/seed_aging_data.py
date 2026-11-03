"""
Seed script for Analyze Aging 9-domain elderly screening data.
Extracts screening data from Excel / JSON into PostgreSQL / SQLite database.
"""

import os
import sys
import json
from pathlib import Path
from sqlalchemy.orm import Session
from .database import engine, SessionLocal, Base
from .models import Zone, Province, Screening9D, AnomalyAudit

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
AGING_DIR = BASE_DIR / "Analyze Aging"
JSON_CACHE_PATH = AGING_DIR / "hdc_elderly_screening_9d_all.json"
EXCEL_PATH = AGING_DIR / "hdc_elderly_screening_9domains.xlsx"

DOMAINS_METADATA = [
    {"id": "d1_visual", "num": 1, "name_th": "การมองเห็น", "name_en": "Visual Impairment", "icon": "eye"},
    {"id": "d2_incontinence", "num": 2, "name_th": "การกลั้นปัสสาวะ", "name_en": "Urinary Incontinence", "icon": "droplet"},
    {"id": "d3_hearing", "num": 3, "name_th": "การได้ยิน", "name_en": "Hearing Impairment", "icon": "ear"},
    {"id": "d4_adl", "num": 4, "name_th": "กิจวัตรประจำวัน (ADL)", "name_en": "ADL / Physical Dependency", "icon": "activity"},
    {"id": "d5_cognition", "num": 5, "name_th": "ความคิดความจำ", "name_en": "Cognition / Dementia", "icon": "brain"},
    {"id": "d6_depression", "num": 6, "name_th": "ภาวะซึมเศร้า (2Q)", "name_en": "Depression", "icon": "heart"},
    {"id": "d7_mobility", "num": 7, "name_th": "การเคลื่อนไหวร่างกาย", "name_en": "Mobility & Fall Risk", "icon": "footprints"},
    {"id": "d8_oral", "num": 8, "name_th": "สุขภาพช่องปาก", "name_en": "Oral Health", "icon": "smile"},
    {"id": "d9_nutrition", "num": 9, "name_th": "ภาวะขาดสารอาหาร", "name_en": "Nutrition", "icon": "apple"},
]

def load_data_source():
    """Load extracted structured data, running extraction if needed."""
    if JSON_CACHE_PATH.exists():
        with open(JSON_CACHE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    
    # Fallback: import and run extract_all
    sys.path.insert(0, str(AGING_DIR))
    import extract_9domains_data
    extract_9domains_data.extract_all()
    with open(JSON_CACHE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def seed_database(db: Session = None):
    """Seed health zones, provinces, and multi-year 9-domain records."""
    close_at_end = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_at_end = True

    try:
        data = load_data_source()
        years_data = data.get("years", {})
        
        # 1. Seed Health Zones from latest year (2569)
        zones_map = {}
        year_2569 = years_data.get("2569", {})
        for z in year_2569.get("zones", []):
            zid = str(z["zone_id"]).zfill(2) if z["zone_id"].isdigit() else z["zone_id"]
            zname = z["zone_name"]
            zones_map[zid] = zname
            
            existing = db.query(Zone).filter(Zone.zone_id == zid).first()
            if not existing:
                db.add(Zone(zone_id=zid, zone_name=zname))
                
        # Add National zone if not present
        if not db.query(Zone).filter(Zone.zone_id == "TH").first():
            db.add(Zone(zone_id="TH", zone_name="ภาพรวมประเทศ (National Total)"))
        db.commit()
        
        # 2. Seed Provinces from latest year (2569)
        provinces_count = 0
        for p in year_2569.get("provinces", []):
            pcode = str(p["province_code"]).zfill(2)
            pname = p["province_name"]
            zid = str(p["zone_id"]).zfill(2) if p["zone_id"].isdigit() else p["zone_id"]
            
            existing_p = db.query(Province).filter(Province.province_code == pcode).first()
            if not existing_p:
                db.add(Province(province_code=pcode, province_name_th=pname, zone_id=zid))
                provinces_count += 1
            else:
                existing_p.province_name_th = pname
                existing_p.zone_id = zid
        db.commit()

        # 3. Seed Screening9D records for all years
        records_count = 0
        for year, ydata in years_data.items():
            # Clear existing records for this year to ensure idempotent seed
            db.query(Screening9D).filter(Screening9D.fiscal_year == str(year)).delete()
            
            # National record
            nat = ydata.get("national_summary")
            if nat:
                db.add(Screening9D(
                    fiscal_year=str(year),
                    entity_type="national",
                    entity_id="TH",
                    entity_name=nat.get("zone_name", "ทั่วประเทศ"),
                    zone_id="TH",
                    target_pop=nat.get("target_pop", 0),
                    screened_9d=nat.get("screened_9d", 0),
                    screened_9d_pct=nat.get("screened_9d_pct", 0.0),
                    domains_data=json.dumps(nat.get("domains", {}), ensure_ascii=False),
                    is_validated=True
                ))
                records_count += 1
                
            # Zones records
            for z in ydata.get("zones", []):
                zid = str(z["zone_id"]).zfill(2) if z["zone_id"].isdigit() else z["zone_id"]
                db.add(Screening9D(
                    fiscal_year=str(year),
                    entity_type="zone",
                    entity_id=zid,
                    entity_name=z.get("zone_name", f"เขตสุขภาพที่ {zid}"),
                    zone_id=zid,
                    target_pop=z.get("target_pop", 0),
                    screened_9d=z.get("screened_9d", 0),
                    screened_9d_pct=z.get("screened_9d_pct", 0.0),
                    domains_data=json.dumps(z.get("domains", {}), ensure_ascii=False),
                    is_validated=True
                ))
                records_count += 1
                
            # Provinces records
            for p in ydata.get("provinces", []):
                pcode = str(p["province_code"]).zfill(2)
                zid = str(p["zone_id"]).zfill(2) if p["zone_id"].isdigit() else p["zone_id"]
                db.add(Screening9D(
                    fiscal_year=str(year),
                    entity_type="province",
                    entity_id=pcode,
                    entity_name=p.get("province_name", ""),
                    zone_id=zid,
                    target_pop=p.get("target_pop", 0),
                    screened_9d=p.get("screened_9d", 0),
                    screened_9d_pct=p.get("screened_9d_pct", 0.0),
                    domains_data=json.dumps(p.get("domains", {}), ensure_ascii=False),
                    is_validated=True
                ))
                records_count += 1
                
        db.commit()
        
        # Summary verification
        total_zones = db.query(Zone).count()
        total_provinces = db.query(Province).count()
        total_records = db.query(Screening9D).count()
        
        print(f"Seeding completed successfully:")
        print(f"  - Health Zones: {total_zones}")
        print(f"  - Provinces: {total_provinces}")
        print(f"  - Screening 9D Records: {total_records}")
        
        return {
            "zones": total_zones,
            "provinces": total_provinces,
            "records": total_records
        }
        
    finally:
        if close_at_end:
            db.close()

if __name__ == "__main__":
    seed_database()
