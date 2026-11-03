import re
from pathlib import Path
from html.parser import HTMLParser

FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"

def test_index_html_structure():
    index_file = FRONTEND_DIR / "index.html"
    assert index_file.exists()
    content = index_file.read_text(encoding="utf-8")

    # 1. Viewport & responsive tags
    assert 'name="viewport"' in content

    # 2. Analyze Aging 6 Navigation Tabs
    assert 'tab-9domains' in content
    assert 'tab-demographics' in content
    assert 'tab-ncd' in content
    assert 'tab-morbidity' in content
    assert 'tab-mortality' in content
    assert 'tab-dalys' in content
    assert 'tab-loops' not in content

    # 3. Core Functional & Visual Sections
    assert 'thailand-map-svg' in content
    assert 'national-domain-ranking-grid' in content
    assert 'demographics-chart' in content
    assert 'ncd-chart' in content
    assert 'morbidity-chart' in content
    assert 'mortality-bar-chart' in content
    assert 'dalys-chart' in content

def test_admin_html_structure():
    admin_file = FRONTEND_DIR / "admin.html"
    assert admin_file.exists()
    content = admin_file.read_text(encoding="utf-8")

    # Admin KPI counters
    assert "statTotalAttendees" in content
    assert "statPublicAttendees" in content
    assert "statMedicalAttendees" in content
    assert "statAseanAttendees" in content

    # Regional & Top provinces breakdown
    assert "healthRegionBreakdownContainer" in content
    assert "topProvincesContainer" in content

    # Attendees list & Excel export
    assert "attendeesTableBody" in content
    assert "triggerExcelExport" in content

    # Document CMS & Audit Logs
    assert "handleUploadDocumentForm" in content
    assert "auditLogsTableBody" in content

def test_css_and_js_assets():
    css_file = FRONTEND_DIR / "css" / "style.css"
    assert css_file.exists()
    css_content = css_file.read_text(encoding="utf-8")
    assert "--min-touch-target: 48px;" in css_content
    assert "mic-pulse" in css_content
    assert "high-contrast" in css_content

    app_js = FRONTEND_DIR / "js" / "app.js"
    assert app_js.exists()
    app_js_content = app_js.read_text(encoding="utf-8")
    assert "SpeechRecognition" in app_js_content
    assert "speechSynthesis" in app_js_content
    assert "setupTouchGestures" in app_js_content
    assert "handlePublicSubmit" in app_js_content

    geo_js = FRONTEND_DIR / "js" / "thai_address_data.js"
    assert geo_js.exists()
    geo_content = geo_js.read_text(encoding="utf-8")
    assert "THAI_HEALTH_REGIONS" in geo_content
    assert "THAI_PROVINCES" in geo_content
