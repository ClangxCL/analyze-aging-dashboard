"""
FastAPI Router for Analyze Aging 9-domain elderly screening metrics,
rankings, heatmaps, GeoJSON choropleth, and validation health telemetry.
"""

import json
from pathlib import Path
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Screening9D, Zone, Province, AnomalyAudit
from ..schemas import (
    AgingKPISummary,
    NationalDomainRankItem,
    ProvinceItem,
    RankingResponse,
    RankingItem,
    HeatmapResponse,
    HeatmapRow,
    HeatmapCell,
    ValidationHealthResponse
)
from ..services.loop_validator import LoopValidator

router = APIRouter(prefix="/aging", tags=["Analyze Aging"])

# Base paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
AGING_DIR = BASE_DIR / "Analyze Aging"
GEOJSON_PATH = AGING_DIR / "thailand-provinces.geojson"
JSON_CACHE_PATH = AGING_DIR / "hdc_elderly_screening_9d_all.json"

DOMAINS_MAP = {
    "d1_visual": "การมองเห็น (Visual Impairment)",
    "d2_incontinence": "การกลั้นปัสสาวะ (Urinary Incontinence)",
    "d3_hearing": "การได้ยิน (Hearing Impairment)",
    "d4_adl": "กิจวัตรประจำวัน (ADL / Physical Dependency)",
    "d5_cognition": "ความคิดความจำ (Cognition / Dementia)",
    "d6_depression": "ภาวะซึมเศร้า (Depression 2Q)",
    "d7_mobility": "การเคลื่อนไหวร่างกาย (Mobility & Fall Risk)",
    "d8_oral": "สุขภาพช่องปาก (Oral Health)",
    "d9_nutrition": "ภาวะขาดสารอาหาร (Nutrition)",
}

def determine_severity_tier(risk_pct: float) -> str:
    """Categorize risk percentage into 4 severity tiers."""
    if risk_pct >= 25.0:
        return "critical"
    elif risk_pct >= 15.0:
        return "high"
    elif risk_pct >= 5.0:
        return "moderate"
    else:
        return "low"


@router.get("/summary", response_model=AgingKPISummary)
def get_aging_summary(
    year: str = Query("2569", description="Fiscal year (2567, 2568, 2569)"),
    zone_id: Optional[str] = Query(None, description="Optional health zone ID (01-13)"),
    province_id: Optional[str] = Query(None, description="Optional province code (e.g. 10, 50)"),
    db: Session = Depends(get_db)
):
    """Retrieve summary KPIs and 9-domain risk rankings (national, zone, or province level)."""
    entity_id = "TH"
    entity_name = "ทั้งประเทศ"
    entity_type = "national"

    if province_id and str(province_id).lower() != "all":
        rec = db.query(Screening9D).filter(
            Screening9D.fiscal_year == year,
            Screening9D.entity_type == "province",
            Screening9D.entity_id == str(province_id).zfill(2)
        ).first()
        if rec:
            entity_id = rec.entity_id
            entity_name = rec.entity_name
            entity_type = "province"
    elif zone_id and str(zone_id).lower() != "all":
        rec = db.query(Screening9D).filter(
            Screening9D.fiscal_year == year,
            Screening9D.entity_type == "zone",
            Screening9D.entity_id == str(zone_id).zfill(2)
        ).first()
        if rec:
            entity_id = rec.entity_id
            entity_name = rec.entity_name
            entity_type = "zone"
    else:
        rec = db.query(Screening9D).filter(
            Screening9D.fiscal_year == year,
            Screening9D.entity_type == "national"
        ).first()

    if not rec:
        # Fallback aggregate if record absent
        zone_recs = db.query(Screening9D).filter(
            Screening9D.fiscal_year == year,
            Screening9D.entity_type == "zone"
        ).all()
        if not zone_recs:
            raise HTTPException(status_code=404, detail=f"No data found for fiscal year {year}")
        target_pop = sum(z.target_pop for z in zone_recs)
        screened_9d = sum(z.screened_9d for z in zone_recs)
        screened_pct = round((screened_9d / target_pop * 100), 2) if target_pop > 0 else 0.0
        domains_data = json.loads(zone_recs[0].domains_data) if zone_recs else {}
    else:
        target_pop = rec.target_pop
        screened_9d = rec.screened_9d
        screened_pct = rec.screened_9d_pct
        domains_data = json.loads(rec.domains_data)

    # Calculate 9-domain risk rankings sorted by risk_pct descending
    domain_ranks_raw = []
    highest_domain_id = "d1_visual"
    highest_risk_val = -1.0

    for did, dinfo in domains_data.items():
        rpct = float(dinfo.get("risk_pct", 0.0))
        if rpct > highest_risk_val:
            highest_risk_val = rpct
            highest_domain_id = did

        domain_ranks_raw.append({
            "domain_id": did,
            "num": int(dinfo.get("num", 1)),
            "name_th": dinfo.get("name_th", DOMAINS_MAP.get(did, did)),
            "name_en": dinfo.get("name_en", ""),
            "screened": int(dinfo.get("screened", 0)),
            "screened_pct": float(dinfo.get("screened_pct", 0.0)),
            "risk": int(dinfo.get("risk", 0)),
            "risk_pct": rpct,
            "severity_tier": determine_severity_tier(rpct)
        })

    # Sort descending by risk_pct
    domain_ranks_raw.sort(key=lambda x: x["risk_pct"], reverse=True)
    domain_rankings = []
    for r_idx, d_item in enumerate(domain_ranks_raw, start=1):
        d_item["rank"] = r_idx
        domain_rankings.append(NationalDomainRankItem(**d_item))

    highest_domain = {
        "id": highest_domain_id,
        "name_th": domains_data.get(highest_domain_id, {}).get("name_th", ""),
        "name_en": domains_data.get(highest_domain_id, {}).get("name_en", ""),
        "risk_pct": highest_risk_val
    }

    return AgingKPISummary(
        fiscal_year=year,
        entity_id=entity_id,
        entity_name=entity_name,
        entity_type=entity_type,
        target_pop=target_pop,
        screened_9d=screened_9d,
        screened_9d_pct=screened_pct,
        highest_risk_domain=highest_domain,
        domains=domains_data,
        domain_rankings=domain_rankings
    )


@router.get("/rankings", response_model=RankingResponse)
def get_aging_rankings(
    year: str = Query("2569", description="Fiscal year"),
    domain: str = Query("d1_visual", description="Domain ID (d1_visual .. d9_nutrition)"),
    level: str = Query("province", description="Administrative level: 'province' or 'zone'"),
    zone_filter: Optional[str] = Query(None, description="Optional zone ID to filter provinces"),
    limit: int = Query(10, ge=1, le=100, description="Number of top items to return"),
    order: str = Query("desc", description="'desc', 'asc', 'risk_count_desc', 'coverage_desc', 'target_desc'"),
    db: Session = Depends(get_db)
):
    """Retrieve dynamic TOP Rank leaderboards for specified domain, level, and zone."""
    query = db.query(Screening9D).filter(
        Screening9D.fiscal_year == year,
        Screening9D.entity_type == level
    )

    if level == "province" and zone_filter and str(zone_filter).lower() != "all":
        query = query.filter(Screening9D.zone_id == str(zone_filter).zfill(2))

    recs = query.all()
    if not recs:
        raise HTTPException(status_code=404, detail=f"No {level} records found for fiscal year {year}")

    items = []
    for r in recs:
        try:
            d_dict = json.loads(r.domains_data)
            domain_info = d_dict.get(domain, {})
            screened = int(domain_info.get("screened", r.screened_9d))
            risk = int(domain_info.get("risk", 0))
            risk_pct = float(domain_info.get("risk_pct", 0.0))
        except Exception:
            screened, risk, risk_pct = 0, 0, 0.0

        coverage_pct = round((screened / r.target_pop * 100), 2) if r.target_pop > 0 else 0.0

        items.append({
            "entity_id": r.entity_id,
            "entity_name": r.entity_name,
            "zone_id": r.zone_id,
            "target_pop": r.target_pop,
            "screened": screened,
            "coverage_pct": coverage_pct,
            "risk": risk,
            "risk_pct": risk_pct
        })

    # Sort based on order
    ord_clean = str(order).lower()
    if ord_clean in ["asc", "risk_asc"]:
        items.sort(key=lambda x: x["risk_pct"], reverse=False)
    elif ord_clean in ["risk_count_desc", "risk_count"]:
        items.sort(key=lambda x: x["risk"], reverse=True)
    elif ord_clean in ["coverage_desc", "coverage"]:
        items.sort(key=lambda x: x["coverage_pct"], reverse=True)
    elif ord_clean in ["target_desc", "target"]:
        items.sort(key=lambda x: x["target_pop"], reverse=True)
    else:  # default 'desc' / 'risk_desc'
        items.sort(key=lambda x: x["risk_pct"], reverse=True)

    ranked_items = []
    for rank_idx, item in enumerate(items[:limit], start=1):
        ranked_items.append(RankingItem(
            rank=rank_idx,
            entity_id=item["entity_id"],
            entity_name=item["entity_name"],
            zone_id=item["zone_id"],
            target_pop=item["target_pop"],
            screened=item["screened"],
            risk=item["risk"],
            risk_pct=item["risk_pct"]
        ))

    domain_name = DOMAINS_MAP.get(domain, domain)

    return RankingResponse(
        fiscal_year=year,
        domain_id=domain,
        domain_name=domain_name,
        level=level,
        zone_filter=zone_filter,
        order=order,
        total_items=len(items),
        rankings=ranked_items
    )


@router.get("/provinces", response_model=List[ProvinceItem])
def get_provinces(
    zone_id: Optional[str] = Query(None, description="Optional zone ID to filter"),
    db: Session = Depends(get_db)
):
    """Retrieve list of Thailand 77 provinces with zone mapping."""
    query = db.query(Province)
    if zone_id and str(zone_id).lower() != "all":
        query = query.filter(Province.zone_id == str(zone_id).zfill(2))
    provinces = query.order_by(Province.province_code).all()
    return [
        ProvinceItem(
            province_code=p.province_code,
            province_name_th=p.province_name_th,
            province_name_en=p.province_name_en,
            zone_id=p.zone_id
        )
        for p in provinces
    ]


@router.get("/heatmap", response_model=HeatmapResponse)
def get_aging_heatmap(
    year: str = Query("2569", description="Fiscal year"),
    level: str = Query("zone", description="Administrative level: 'zone' or 'province'"),
    zone_filter: Optional[str] = Query(None, description="Optional zone_id to filter provinces"),
    db: Session = Depends(get_db)
):
    """Retrieve multi-domain risk heatmap matrix."""
    query = db.query(Screening9D).filter(
        Screening9D.fiscal_year == year,
        Screening9D.entity_type == level
    )
    if zone_filter and level == "province":
        query = query.filter(Screening9D.zone_id == str(zone_filter).zfill(2))

    recs = query.order_by(Screening9D.entity_id).all()
    if not recs:
        raise HTTPException(status_code=404, detail=f"No {level} records found for year {year}")

    rows = []
    for r in recs:
        try:
            d_dict = json.loads(r.domains_data)
        except Exception:
            d_dict = {}

        cells = {}
        for did, dname in DOMAINS_MAP.items():
            dinfo = d_dict.get(did, {})
            screened = int(dinfo.get("screened", 0))
            risk = int(dinfo.get("risk", 0))
            risk_pct = float(dinfo.get("risk_pct", 0.0))
            cells[did] = HeatmapCell(
                domain_id=did,
                domain_name=dname,
                screened=screened,
                risk=risk,
                risk_pct=risk_pct,
                severity_tier=determine_severity_tier(risk_pct)
            )

        rows.append(HeatmapRow(
            entity_id=r.entity_id,
            entity_name=r.entity_name,
            zone_id=r.zone_id,
            target_pop=r.target_pop,
            screened_9d=r.screened_9d,
            screened_9d_pct=r.screened_9d_pct,
            domains=cells
        ))

    return HeatmapResponse(
        fiscal_year=year,
        level=level,
        rows=rows
    )


@router.get("/geojson")
def get_aging_geojson(
    year: str = Query("2569", description="Fiscal year"),
    domain: str = Query("d1_visual", description="Domain ID"),
    zone_filter: Optional[str] = Query(None, description="Optional zone ID to filter"),
    db: Session = Depends(get_db)
):
    """Stream Thailand GeoJSON features enriched with active screening risk percentages."""
    if not GEOJSON_PATH.exists():
        raise HTTPException(status_code=500, detail="GeoJSON boundary file not found")

    with open(GEOJSON_PATH, "r", encoding="utf-8") as f:
        geojson = json.load(f)

    # Fetch province records
    recs = db.query(Screening9D).filter(
        Screening9D.fiscal_year == year,
        Screening9D.entity_type == "province"
    ).all()

    # Build lookup map by 2-digit province_code
    prov_data = {}
    for r in recs:
        pcode = str(r.entity_id).zfill(2)
        try:
            d_dict = json.loads(r.domains_data)
            dinfo = d_dict.get(domain, {})
            rpct = float(dinfo.get("risk_pct", 0.0))
            screened = int(dinfo.get("screened", r.screened_9d))
            risk = int(dinfo.get("risk", 0))
        except Exception:
            rpct, screened, risk = 0.0, 0, 0

        prov_data[pcode] = {
            "entity_name": r.entity_name,
            "zone_id": r.zone_id,
            "target_pop": r.target_pop,
            "screened": screened,
            "risk": risk,
            "risk_pct": rpct,
            "severity_tier": determine_severity_tier(rpct)
        }

    # Rank provinces
    sorted_codes = sorted(prov_data.keys(), key=lambda k: prov_data[k]["risk_pct"], reverse=True)
    rank_map = {code: idx + 1 for idx, code in enumerate(sorted_codes)}

    # Enrich GeoJSON features
    has_zone_filter = bool(zone_filter and str(zone_filter).lower() != "all")
    target_zone = str(zone_filter).zfill(2) if has_zone_filter else None

    for feature in geojson.get("features", []):
        props = feature.get("properties", {})
        code = str(props.get("pro_code") or props.get("code") or props.get("PROV_CODE") or feature.get("id") or "").zfill(2)
        p_metric = prov_data.get(code)
        if p_metric:
            props.update(p_metric)
            props["rank"] = rank_map.get(code, 99)
            props["domain_id"] = domain
            props["domain_name"] = DOMAINS_MAP.get(domain, domain)
            props["fiscal_year"] = year
            props["is_in_zone"] = (p_metric.get("zone_id") == target_zone) if has_zone_filter else True
        else:
            props["risk_pct"] = 0.0
            props["screened"] = 0
            props["severity_tier"] = "low"
            props["rank"] = 99
            props["is_in_zone"] = False if has_zone_filter else True

    return JSONResponse(content=geojson)


@router.get("/validation-health", response_model=ValidationHealthResponse)
def get_validation_health(
    db: Session = Depends(get_db)
):
    """Query telemetry and audit results for all 5 continuous validation loops."""
    validator = LoopValidator(db=db)
    
    # Load dataset for audit check
    dataset = {}
    if JSON_CACHE_PATH.exists():
        with open(JSON_CACHE_PATH, "r", encoding="utf-8") as f:
            dataset = json.load(f)

    audit_result = validator.run_full_pipeline_audit(dataset)
    return ValidationHealthResponse(
        overall_status=audit_result["overall_status"],
        timestamp=audit_result["timestamp"],
        total_anomalies_recorded=audit_result["total_anomalies_recorded"],
        loops=audit_result["loops"]
    )


# =====================================================================
# THEMATIC DATASETS: 6 Topic Modules from Analyze Aging Archive
# =====================================================================
DEMOGRAPHICS_CSV = AGING_DIR / "1_demographics_population_meter_2565_2569.csv"
ADL_CSV = AGING_DIR / "2_1_functional_ability_adl_and_screening.csv"
NCD_CSV = AGING_DIR / "3_chronic_diseases_ncd_prevalence.csv"
MORBIDITY_CSV = AGING_DIR / "4_top10_morbidity_opd_ipd_2565_2569.csv"
MORTALITY_CSV = AGING_DIR / "5_top10_mortality_causes_2565_2569.csv"
DALYS_CSV = AGING_DIR / "6_burden_of_disease_dalys_bod.csv"

def read_clean_csv(file_path: Path) -> List[Dict[str, Any]]:
    if not file_path.exists():
        return []
    import pandas as pd
    import numpy as np
    df = pd.read_csv(file_path)
    df = df.replace({np.nan: None})
    return df.to_dict(orient="records")

@router.get("/demographics-5y")
def get_demographics_5y():
    """Retrieve 5-year demographic population meter (2565-2569)."""
    return read_clean_csv(DEMOGRAPHICS_CSV)

@router.get("/functional-adl")
def get_functional_adl():
    """Retrieve functional ability (ADL) categories and screening indicators."""
    records = read_clean_csv(ADL_CSV)
    adl_groups = [r for r in records if r.get("Indicator_Group") == "การดำเนินชีวิตประจำวัน (ADL)"]
    screening_highlights = [r for r in records if r.get("Indicator_Group") != "การดำเนินชีวิตประจำวัน (ADL)"]
    return {
        "adl_groups": adl_groups,
        "screening_highlights": screening_highlights
    }

@router.get("/ncd-diseases")
def get_ncd_diseases():
    """Retrieve 10 major chronic diseases (NCDs) and multimorbidity prevalence in elderly."""
    return read_clean_csv(NCD_CSV)

@router.get("/morbidity-opd-ipd")
def get_morbidity_opd_ipd(
    care_type: Optional[str] = Query(None, description="Filter by 'OPD' or 'IPD'")
):
    """Retrieve Top 10 OPD outpatient and Top 10 IPD inpatient morbidities (2565-2569)."""
    records = read_clean_csv(MORBIDITY_CSV)
    if care_type:
        ctype = care_type.strip().upper()
        records = [r for r in records if ctype in str(r.get("Care_Type", "")).upper()]
    return records

@router.get("/mortality-top10")
def get_mortality_top10():
    """Retrieve Top 10 mortality causes among Thai elderly (2565-2569)."""
    return read_clean_csv(MORTALITY_CSV)

@router.get("/dalys-bod")
def get_dalys_bod():
    """Retrieve Burden of Disease (DALYs, YLL, YLD, and Ratio) for Thai elderly."""
    return read_clean_csv(DALYS_CSV)

