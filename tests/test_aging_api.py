"""
Integration tests for Analyze Aging REST API endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.seed_aging_data import seed_database

@pytest.fixture(scope="module")
def client():
    # Ensure database is seeded with Analyze Aging records
    seed_database()
    with TestClient(app) as test_client:
        yield test_client

def test_get_aging_summary(client):
    """Test GET /api/aging/summary returns valid national KPIs."""
    response = client.get("/api/aging/summary?year=2569")
    assert response.status_code == 200
    data = response.json()
    
    assert data["fiscal_year"] == "2569"
    assert data["target_pop"] > 0
    assert data["screened_9d"] > 0
    assert 0.0 <= data["screened_9d_pct"] <= 100.0
    assert "highest_risk_domain" in data
    assert "domains" in data
    assert len(data["domains"]) == 9
    assert "d1_visual" in data["domains"]
    assert "d6_depression" in data["domains"]

def test_get_aging_rankings_provinces(client):
    """Test GET /api/aging/rankings returns ordered provincial leaderboard."""
    response = client.get("/api/aging/rankings?year=2569&domain=d1_visual&level=province&limit=5&order=desc")
    assert response.status_code == 200
    data = response.json()
    
    assert data["fiscal_year"] == "2569"
    assert data["domain_id"] == "d1_visual"
    assert data["level"] == "province"
    assert len(data["rankings"]) == 5
    
    # Assert descending order of risk_pct
    risk_pcts = [item["risk_pct"] for item in data["rankings"]]
    assert risk_pcts == sorted(risk_pcts, reverse=True)
    assert data["rankings"][0]["rank"] == 1

def test_get_aging_rankings_zones(client):
    """Test GET /api/aging/rankings returns ordered health zones leaderboard."""
    response = client.get("/api/aging/rankings?year=2568&domain=d6_depression&level=zone&limit=13")
    assert response.status_code == 200
    data = response.json()
    
    assert data["level"] == "zone"
    assert len(data["rankings"]) <= 13
    assert all("zone_id" in item for item in data["rankings"])

def test_get_aging_heatmap(client):
    """Test GET /api/aging/heatmap returns multi-domain risk matrix."""
    response = client.get("/api/aging/heatmap?year=2569&level=zone")
    assert response.status_code == 200
    data = response.json()
    
    assert data["fiscal_year"] == "2569"
    assert data["level"] == "zone"
    assert len(data["rows"]) >= 12
    
    first_row = data["rows"][0]
    assert "domains" in first_row
    assert len(first_row["domains"]) == 9
    assert first_row["domains"]["d1_visual"]["severity_tier"] in ["low", "moderate", "high", "critical"]

def test_get_aging_geojson(client):
    """Test GET /api/aging/geojson returns GeoJSON feature collection with risk attributes."""
    response = client.get("/api/aging/geojson?year=2569&domain=d7_mobility")
    assert response.status_code == 200
    data = response.json()
    
    assert data.get("type") == "FeatureCollection"
    features = data.get("features", [])
    assert len(features) >= 76
    
    first_props = features[0].get("properties", {})
    assert "risk_pct" in first_props
    assert "domain_id" in first_props
    assert first_props["domain_id"] == "d7_mobility"
    assert "severity_tier" in first_props

def test_get_validation_health(client):
    """Test GET /api/aging/validation-health returns operational status of all 5 loops."""
    response = client.get("/api/aging/validation-health")
    assert response.status_code == 200
    data = response.json()
    
    assert "overall_status" in data
    assert "loops" in data
    loops = data["loops"]
    assert "loop1_ingestion" in loops
    assert "loop2_invariants" in loops
    assert "loop3_rollup" in loops
    assert "loop4_geotopology" in loops
    assert "loop5_serving" in loops
    assert loops["loop1_ingestion"]["is_valid"] is True
    assert loops["loop4_geotopology"]["is_valid"] is True

def test_get_aging_national_domain_rankings(client):
    """Test that summary endpoint returns all 9 domains ordered by risk_pct descending."""
    response = client.get("/api/aging/summary?year=2569")
    assert response.status_code == 200
    data = response.json()
    assert "domain_rankings" in data
    rankings = data["domain_rankings"]
    assert len(rankings) == 9
    assert rankings[0]["rank"] == 1
    # Check descending order of risk_pct
    rpcts = [d["risk_pct"] for d in rankings]
    assert rpcts == sorted(rpcts, reverse=True)
    # Check highest domain matches #1 rank
    assert rankings[0]["domain_id"] == data["highest_risk_domain"]["id"]

def test_get_aging_rankings_with_zone_filter_and_order(client):
    """Test ranking with zone_filter and order variants."""
    # Filter to Zone 01
    response = client.get("/api/aging/rankings?year=2569&domain=d1_visual&level=province&zone_filter=01&limit=10&order=desc")
    assert response.status_code == 200
    data = response.json()
    assert len(data["rankings"]) > 0
    assert all(r["zone_id"] == "01" for r in data["rankings"])

    # Ascending order
    response_asc = client.get("/api/aging/rankings?year=2569&domain=d1_visual&level=province&order=asc&limit=5")
    assert response_asc.status_code == 200
    data_asc = response_asc.json()
    rpcts_asc = [r["risk_pct"] for r in data_asc["rankings"]]
    assert rpcts_asc == sorted(rpcts_asc, reverse=False)

def test_get_provinces_endpoint(client):
    """Test /api/aging/provinces returns 77 provinces and respects zone filter."""
    res_all = client.get("/api/aging/provinces")
    assert res_all.status_code == 200
    all_provinces = res_all.json()
    assert len(all_provinces) == 77

    res_z1 = client.get("/api/aging/provinces?zone_id=01")
    assert res_z1.status_code == 200
    z1_provinces = res_z1.json()
    assert 0 < len(z1_provinces) < 77
    assert all(p["zone_id"] == "01" for p in z1_provinces)

def test_get_demographics_5y(client):
    """Test /api/aging/demographics-5y returns 5-year elderly population meters."""
    res = client.get("/api/aging/demographics-5y")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 5
    years = [d["Year_TH"] for d in data]
    assert 2565 in years and 2569 in years
    latest = data[-1]
    assert latest["Elderly_Pct"] > 20.0
    assert "Super_Aged_Status" in latest

def test_get_functional_adl(client):
    """Test /api/aging/functional-adl returns 3-tier ADL and 9-domain highlights."""
    res = client.get("/api/aging/functional-adl")
    assert res.status_code == 200
    data = res.json()
    assert "adl_groups" in data
    assert "screening_highlights" in data
    adl_pcts = [g["Percentage"] for g in data["adl_groups"]]
    # Should sum to ~100% (95.8 + 3.1 + 1.1)
    assert abs(sum(adl_pcts) - 100.0) < 0.5

def test_get_ncd_diseases(client):
    """Test /api/aging/ncd-diseases returns 10 chronic diseases + multimorbidity."""
    res = client.get("/api/aging/ncd-diseases")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 11
    # Check HT is #1
    ht = next(d for d in data if d["ICD10_Code"] == "I10")
    assert ht["Prevalence_Pct"] > 50.0

def test_get_morbidity_opd_ipd(client):
    """Test /api/aging/morbidity-opd-ipd supports care_type OPD and IPD."""
    res_opd = client.get("/api/aging/morbidity-opd-ipd?care_type=OPD")
    assert res_opd.status_code == 200
    opd_data = res_opd.json()
    assert len(opd_data) == 10
    assert all("OPD" in d["Care_Type"] for d in opd_data)

    res_ipd = client.get("/api/aging/morbidity-opd-ipd?care_type=IPD")
    assert res_ipd.status_code == 200
    ipd_data = res_ipd.json()
    assert len(ipd_data) == 10
    assert all("IPD" in d["Care_Type"] for d in ipd_data)

def test_get_mortality_top10(client):
    """Test /api/aging/mortality-top10 returns mortality rankings and total."""
    res = client.get("/api/aging/mortality-top10")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 10
    # First row is Total
    assert data[0]["ICD10_Code"] == "Total"
    # Cancer is #1 cause
    cancer = next(d for d in data if "C00-C97" in d["ICD10_Code"])
    assert str(cancer["Rank"]) == "1"

def test_get_dalys_bod(client):
    """Test /api/aging/dalys-bod returns 10 conditions with YLL and YLD breakdown."""
    res = client.get("/api/aging/dalys-bod")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 10
    stroke = data[0]
    assert stroke["Rank"] == 1
    assert stroke["Total_DALYs_Years"] == stroke["YLL_Premature_Death_Years"] + stroke["YLD_Disability_Years"]
