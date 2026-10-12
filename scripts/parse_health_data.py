import zipfile
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path

EXCEL_PATH = r"C:\Users\Piyanut\Desktop\Data_Analysis_9_Dimensions_2026.xlsx"
OUTPUT_JSON = r"C:\Users\Piyanut\Desktop\Code_Work\elderly_health_2026.json"

DIMENSION_KEYS = [
    {"key": "vision", "name": "การมองเห็น", "col_pct": "D", "col_cnt_screened": "F", "col_cnt_normal": "H", "col_cnt_risk": "I"},
    {"key": "oral", "name": "สุขภาพช่องปาก", "col_pct": "E", "col_cnt_screened": "AI", "col_cnt_normal": "AK", "col_cnt_risk": "AL"},
    {"key": "mobility", "name": "การเคลื่อนไหว", "col_pct": "F", "col_cnt_screened": "AE", "col_cnt_normal": "AG", "col_cnt_risk": "AH"},
    {"key": "adl", "name": "การปฏิบัติกิจวัตรประจำวัน (ADL)", "shortName": "ADL", "col_pct": "G", "col_cnt_screened": "R", "col_cnt_normal": "T", "col_cnt_risk": "U"},
    {"key": "hearing", "name": "การได้ยิน", "col_pct": "H", "col_cnt_screened": "N", "col_cnt_normal": "P", "col_cnt_risk": "Q"},
    {"key": "cognition", "name": "ความคิดความจำ", "col_pct": "I", "col_cnt_screened": "V", "col_cnt_normal": "X", "col_cnt_risk": "Y"},
    {"key": "incontinence", "name": "การกลั้นปัสสาวะ", "col_pct": "J", "col_cnt_screened": "J", "col_cnt_normal": "L", "col_cnt_risk": "M"},
    {"key": "nutrition", "name": "ภาวะโภชนาการ/ขาดสารอาหาร", "shortName": "ขาดสารอาหาร", "col_pct": "K", "col_cnt_screened": "AM", "col_cnt_normal": "AO", "col_cnt_risk": "AP"},
    {"key": "depression", "name": "ภาวะซึมเศร้า (2Q)", "shortName": "ซึมเศร้า 2Q", "col_pct": "L", "col_cnt_screened": "Z", "col_cnt_normal": "AB", "col_cnt_risk": "AC", "col_cnt_risk_extra": "AD"}
]

def clean_num(val):
    if val is None or val == "":
        return 0
    if isinstance(val, (int, float)):
        return val
    s = str(val).replace(",", "").replace("%", "").strip()
    try:
        return float(s) if "." in s else int(s)
    except ValueError:
        return 0

def clean_pct(val):
    if val is None or val == "":
        return 0.0
    if isinstance(val, (int, float)):
        return round(float(val), 2)
    s = str(val).replace("%", "").replace(",", "").strip()
    try:
        return round(float(s), 2)
    except ValueError:
        return 0.0

def parse_xlsx():
    ns = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
    with zipfile.ZipFile(EXCEL_PATH, 'r') as z:
        shared_strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            ss_tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            for si in ss_tree.findall('s:si', ns):
                text = ''.join([t.text or '' for t in si.findall('.//s:t', ns)])
                shared_strings.append(text)

        def read_rows(sheet_xml):
            tree = ET.fromstring(z.read(sheet_xml))
            rows = []
            for r in tree.findall('.//s:row', ns):
                r_idx = int(r.attrib.get('r', 0))
                cols = {}
                for c in r.findall('s:c', ns):
                    coord = c.attrib.get('r')
                    col = ''.join([ch for ch in coord if ch.isalpha()])
                    t = c.attrib.get('t')
                    v_el = c.find('s:v', ns)
                    val = v_el.text if v_el is not None else ''
                    if t == 's' and val.isdigit():
                        val = shared_strings[int(val)]
                    cols[col] = val
                rows.append((r_idx, cols))
            return rows

        sheet3_rows = read_rows('xl/worksheets/sheet3.xml') # ภาพรวมรายเขตสุขภาพ 1-12
        sheet4_rows = read_rows('xl/worksheets/sheet4.xml') # ข้อมูลดิบ ร้อยละ
        sheet5_rows = read_rows('xl/worksheets/sheet5.xml') # ข้อมูลดิบจำนวน

        # Parse sheet 4 (percentages)
        # Row 2 is header, Row 3 to 78 are provinces
        provinces_pct = {}
        for r_idx, cols in sheet4_rows:
            if r_idx <= 2:
                continue
            prov_name = cols.get('C', '').strip()
            if not prov_name:
                continue
            zone_name = cols.get('B', '').strip()
            provinces_pct[prov_name] = {
                "id": int(cols.get('A', 0)),
                "zone": zone_name,
                "province": prov_name,
                "percentages": {dim["key"]: clean_pct(cols.get(dim["col_pct"])) for dim in DIMENSION_KEYS}
            }

        # Parse sheet 5 (counts)
        # Row 1-2 headers, Row 3 to 78 are provinces
        provinces_counts = {}
        for r_idx, cols in sheet5_rows:
            if r_idx <= 2:
                continue
            prov_name = cols.get('B', '').strip()
            if not prov_name:
                continue
            counts = {
                "total_screened": clean_num(cols.get('C')),
                "screened_9d": clean_num(cols.get('D')),
                "pct_screened_9d": clean_pct(cols.get('E')),
                "dimensions": {}
            }
            for dim in DIMENSION_KEYS:
                scr = clean_num(cols.get(dim["col_cnt_screened"]))
                norm = clean_num(cols.get(dim["col_cnt_normal"]))
                risk = clean_num(cols.get(dim["col_cnt_risk"]))
                counts["dimensions"][dim["key"]] = {
                    "screened": scr,
                    "normal": norm,
                    "risk": risk
                }
            provinces_counts[prov_name] = counts

        # Parse sheet 3 (regional summaries)
        regions_summary = {}
        for r_idx, cols in sheet3_rows:
            if r_idx <= 2:
                continue
            zone_name = cols.get('A', '').strip()
            if not zone_name or "เขตสุขภาพ" not in zone_name:
                continue
            regions_summary[zone_name] = {
                "zone": zone_name,
                "province_count": cols.get('B', '').strip(),
                "total_screened": clean_num(cols.get('C')),
                "screened_9d": clean_num(cols.get('D')),
                "pct_screened_9d": clean_pct(cols.get('E')),
                "top_5_raw": [cols.get(col_letter, '') for col_letter in ['F', 'G', 'H', 'I', 'J']]
            }

    # Merge into rich province objects
    all_provinces = []
    zone_province_map = {}

    for prov_name, pct_data in provinces_pct.items():
        cnt_data = provinces_counts.get(prov_name, {})
        zone = pct_data["zone"]
        zone_num = int(re.search(r'\d+', zone).group()) if re.search(r'\d+', zone) else 0

        # Build dimensions array for this province with rankings 1-9
        dims_list = []
        for dim in DIMENSION_KEYS:
            d_key = dim["key"]
            risk_pct = pct_data["percentages"].get(d_key, 0.0)
            dim_cnt = cnt_data.get("dimensions", {}).get(d_key, {})
            dims_list.append({
                "key": d_key,
                "name": dim["name"],
                "shortName": dim.get("shortName", dim["name"]),
                "riskPct": risk_pct,
                "screened": dim_cnt.get("screened", 0),
                "normal": dim_cnt.get("normal", 0),
                "risk": dim_cnt.get("risk", 0)
            })

        # Rank 1 to 9 descending by riskPct
        dims_ranked = sorted(dims_list, key=lambda x: x["riskPct"], reverse=True)
        for rank_idx, item in enumerate(dims_ranked, start=1):
            item["rank"] = rank_idx

        # Map back by key with rank included
        dims_by_key = {item["key"]: item for item in dims_ranked}

        prov_obj = {
            "id": pct_data["id"],
            "province": prov_name,
            "zone": zone,
            "zoneNumber": zone_num,
            "totalScreened": cnt_data.get("total_screened", 0),
            "screened9d": cnt_data.get("screened_9d", 0),
            "pctScreened9d": cnt_data.get("pct_screened_9d", 0.0),
            "top1Issue": dims_ranked[0]["name"],
            "top1RiskPct": dims_ranked[0]["riskPct"],
            "dimensions": dims_by_key,
            "rankedDimensions": dims_ranked
        }
        all_provinces.append(prov_obj)

        if zone not in zone_province_map:
            zone_province_map[zone] = []
        zone_province_map[zone].append(prov_obj)

    # Compute aggregate stats per Region (1-12)
    regions_list = []
    for zone_num in range(1, 13):
        zone_name = f"เขตสุขภาพที่ {zone_num}"
        provs = zone_province_map.get(zone_name, [])
        sheet3_info = regions_summary.get(zone_name, {})

        # Compute or verify regional dimension totals
        reg_dims = {}
        for dim in DIMENSION_KEYS:
            d_key = dim["key"]
            tot_scr = sum(p["dimensions"][d_key]["screened"] for p in provs)
            tot_risk = sum(p["dimensions"][d_key]["risk"] for p in provs)
            tot_norm = sum(p["dimensions"][d_key]["normal"] for p in provs)
            reg_risk_pct = round((tot_risk / tot_scr * 100), 2) if tot_scr > 0 else 0.0
            reg_dims[d_key] = {
                "key": d_key,
                "name": dim["name"],
                "shortName": dim.get("shortName", dim["name"]),
                "screened": tot_scr,
                "risk": tot_risk,
                "normal": tot_norm,
                "riskPct": reg_risk_pct
            }

        # Regional rankings 1 to 9
        reg_dims_ranked = sorted(list(reg_dims.values()), key=lambda x: x["riskPct"], reverse=True)
        for r_idx, item in enumerate(reg_dims_ranked, start=1):
            item["rank"] = r_idx

        reg_obj = {
            "zone": zone_name,
            "zoneNumber": zone_num,
            "provinceCount": len(provs),
            "provinces": [p["province"] for p in provs],
            "totalScreened": sheet3_info.get("total_screened", sum(p["totalScreened"] for p in provs)),
            "screened9d": sheet3_info.get("screened_9d", sum(p["screened9d"] for p in provs)),
            "pctScreened9d": sheet3_info.get("pct_screened_9d", 0.0),
            "top1Issue": reg_dims_ranked[0]["name"],
            "top1RiskPct": reg_dims_ranked[0]["riskPct"],
            "dimensions": reg_dims,
            "rankedDimensions": reg_dims_ranked
        }
        regions_list.append(reg_obj)

    # National Overview
    nat_total_screened = sum(r["totalScreened"] for r in regions_list)
    nat_screened_9d = sum(r["screened9d"] for r in regions_list)
    nat_pct_9d = round(nat_screened_9d / nat_total_screened * 100, 2) if nat_total_screened > 0 else 0.0

    nat_dims = {}
    for dim in DIMENSION_KEYS:
        d_key = dim["key"]
        tot_scr = sum(r["dimensions"][d_key]["screened"] for r in regions_list)
        tot_risk = sum(r["dimensions"][d_key]["risk"] for r in regions_list)
        tot_norm = sum(r["dimensions"][d_key]["normal"] for r in regions_list)
        nat_pct = round(tot_risk / tot_scr * 100, 2) if tot_scr > 0 else 0.0
        nat_dims[d_key] = {
            "key": d_key,
            "name": dim["name"],
            "shortName": dim.get("shortName", dim["name"]),
            "screened": tot_scr,
            "risk": tot_risk,
            "normal": tot_norm,
            "riskPct": nat_pct
        }

    nat_ranked = sorted(list(nat_dims.values()), key=lambda x: x["riskPct"], reverse=True)
    for r_idx, item in enumerate(nat_ranked, start=1):
        item["rank"] = r_idx

    final_payload = {
        "metadata": {
            "title": "การวิเคราะห์ข้อมูลคัดกรองสุขภาพผู้สูงอายุ 9 ด้าน ประจำปีงบประมาณ 2569",
            "source": "Data_Analysis_9_Dimensions_2026.xlsx",
            "year": 2569,
            "totalProvinces": len(all_provinces),
            "totalRegions": len(regions_list),
            "nationalScreened": nat_total_screened,
            "nationalScreened9d": nat_screened_9d,
            "nationalPctScreened9d": nat_pct_9d,
            "dimensionCatalog": DIMENSION_KEYS
        },
        "national": {
            "totalScreened": nat_total_screened,
            "screened9d": nat_screened_9d,
            "pctScreened9d": nat_pct_9d,
            "dimensions": nat_dims,
            "rankedDimensions": nat_ranked
        },
        "regions": regions_list,
        "provinces": all_provinces
    }

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(final_payload, f, ensure_ascii=False, indent=2)

    print(f"Successfully processed {len(all_provinces)} provinces and {len(regions_list)} regions.")
    print(f"Saved to {OUTPUT_JSON}")

if __name__ == "__main__":
    parse_xlsx()
