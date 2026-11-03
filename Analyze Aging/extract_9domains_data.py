"""
ETL script to extract, normalize, and validate 9-domain elderly screening data
from Analyze Aging/hdc_elderly_screening_9domains.xlsx into optimized JSON.
"""

import sys
import json
import os
import openpyxl

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

EXCEL_PATH = os.path.join(os.path.dirname(__file__), 'hdc_elderly_screening_9domains.xlsx')
OUTPUT_JSON = os.path.join(os.path.dirname(__file__), 'hdc_elderly_screening_9d_all.json')

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

YEAR_SHEET_MAP = {
    "2569": {
        "zone": "เขตสุขภาพ 2569 (ล่าสุด)",
        "province": "รายจังหวัด 2569 (ล่าสุด)"
    },
    "2568": {
        "zone": "เขตสุขภาพ 2568",
        "province": "รายจังหวัด 2568"
    },
    "2567": {
        "zone": "เขตสุขภาพ 2567",
        "province": "รายจังหวัด 2567"
    }
}

def safe_int(val):
    if val is None or val == '':
        return 0
    try:
        return int(float(val))
    except (ValueError, TypeError):
        return 0

def safe_float(val, precision=2):
    if val is None or val == '':
        return 0.0
    try:
        return round(float(val), precision)
    except (ValueError, TypeError):
        return 0.0

def parse_domains_from_row(row, start_idx, is_province=False):
    """
    Extracts the 9 domains from a row starting at start_idx.
    In province sheets:
      start_idx is 7.
      d1: 7, 8, 9, 10
      d2: 11, 12, 13, 14
      d3: 15, 16, 17, 18
      d4: 19, 20, 21, 22
      d5: 23, 24, 25, 26
      d6: 27, 28, 29, 30, (31 extra)
      d7: 32, 33, 34, 35
      d8: 36, 37, 38, 39
      d9: 40, 41, 42, 43
    In zone sheets:
      start_idx is 5.
      d1: 5, 6, 7, 8
      d2: 9, 10, 11, 12
      d3: 13, 14, 15, 16
      d4: 17, 18, 19, 20
      d5: 21, 22, 23, 24
      d6: 25, 26, 27, 28, (29 extra)
      d7: 30, 31, 32, 33
      d8: 34, 35, 36, 37
      d9: 38, 39, 40, 41
    """
    domains = {}
    curr = start_idx
    for d in DOMAINS_METADATA:
        did = d["id"]
        dnum = d["num"]
        
        screened = safe_int(row[curr])
        screened_pct = safe_float(row[curr + 1])
        normal = safe_int(row[curr + 2])
        risk = safe_int(row[curr + 3])
        
        # Risk percentage calculated as (risk / screened * 100)
        risk_pct = round((risk / screened * 100), 2) if screened > 0 else 0.0
        
        domain_data = {
            "num": dnum,
            "name_th": d["name_th"],
            "name_en": d["name_en"],
            "screened": screened,
            "screened_pct": screened_pct,
            "normal": normal,
            "risk": risk,
            "risk_pct": risk_pct
        }
        
        # d6 has an additional 2Q+ extra column
        if did == "d6_depression":
            domain_data["extra_2q_plus"] = safe_int(row[curr + 4])
            curr += 5
        else:
            curr += 4
            
        domains[did] = domain_data
        
    return domains

def extract_all():
    print(f"Loading workbook from: {EXCEL_PATH} ...")
    wb = openpyxl.load_workbook(EXCEL_PATH, data_only=True)
    
    result = {
        "metadata": {
            "title": "การคัดกรองผู้สูงอายุ 9 ด้าน HDC สธ.",
            "report_id": "aa86b13e8cb60cae6c3216b7e3e5f151",
            "source": "Health Data Center (HDC), Ministry of Public Health",
            "years": ["2569", "2568", "2567"],
            "domains": DOMAINS_METADATA
        },
        "years": {}
    }
    
    for year, sheets in YEAR_SHEET_MAP.items():
        print(f"\nProcessing Fiscal Year {year}...")
        ws_zone = wb[sheets["zone"]]
        ws_prov = wb[sheets["province"]]
        
        year_data = {
            "national_summary": None,
            "zones": [],
            "provinces": []
        }
        
        # Parse Zones
        zone_rows = list(ws_zone.iter_rows(values_only=True))
        # row 4 is header, row 5 to 17 are zones 01 to 13, row 18 is national total
        for r_idx in range(4, len(zone_rows)):
            row = zone_rows[r_idx]
            z_id = str(row[0]).strip() if row[0] is not None else ""
            z_name = str(row[1]).strip() if row[1] is not None else ""
            if not z_id or z_id.lower() == 'none':
                continue
                
            target_pop = safe_int(row[2])
            screened_9d = safe_int(row[3])
            screened_9d_pct = safe_float(row[4])
            domains = parse_domains_from_row(row, start_idx=5, is_province=False)
            
            zone_obj = {
                "zone_id": z_id,
                "zone_name": z_name,
                "target_pop": target_pop,
                "screened_9d": screened_9d,
                "screened_9d_pct": screened_9d_pct,
                "domains": domains
            }
            
            if z_id in ("TH", "ALL") or "ทั่วประเทศ" in z_name:
                year_data["national_summary"] = zone_obj
            else:
                year_data["zones"].append(zone_obj)
                
        # Parse Provinces
        prov_rows = list(ws_prov.iter_rows(values_only=True))
        for r_idx in range(4, len(prov_rows)):
            row = prov_rows[r_idx]
            z_id = str(row[0]).strip() if row[0] is not None else ""
            z_name = str(row[1]).strip() if row[1] is not None else ""
            p_code = str(row[2]).strip() if row[2] is not None else ""
            p_name = str(row[3]).strip() if row[3] is not None else ""
            
            if not p_code or p_code.lower() == 'none':
                continue
                
            target_pop = safe_int(row[4])
            screened_9d = safe_int(row[5])
            screened_9d_pct = safe_float(row[6])
            domains = parse_domains_from_row(row, start_idx=7, is_province=True)
            
            prov_obj = {
                "zone_id": z_id,
                "zone_name": z_name,
                "province_code": p_code,
                "province_name": p_name,
                "target_pop": target_pop,
                "screened_9d": screened_9d,
                "screened_9d_pct": screened_9d_pct,
                "domains": domains
            }
            
            if p_code in ("TH", "ALL") or "ทั่วประเทศ" in p_name:
                if not year_data["national_summary"]:
                    year_data["national_summary"] = prov_obj
            else:
                year_data["provinces"].append(prov_obj)
                
        print(f"  Year {year}: Extracted {len(year_data['zones'])} zones, {len(year_data['provinces'])} provinces.")
        if year_data["national_summary"]:
            print(f"  National Summary: Target {year_data['national_summary']['target_pop']:,}, Screened 9D {year_data['national_summary']['screened_9d']:,} ({year_data['national_summary']['screened_9d_pct']}%)")
            
        result["years"][year] = year_data
        
    print(f"\nWriting structured JSON to: {OUTPUT_JSON} ...")
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
        
    file_size_kb = os.path.getsize(OUTPUT_JSON) / 1024
    print(f"Success! Output file size: {file_size_kb:.2f} KB")

if __name__ == '__main__':
    extract_all()
