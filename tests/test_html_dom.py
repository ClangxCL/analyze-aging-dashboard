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
    assert 'viewport-fit=cover' in content
    assert 'safe-top' in content
    assert 'safe-bottom' in content

    # 2. Universal Design & A11y Toolbar
    assert 'a11y-toolbar' in content
    assert 'setFontSize' in content
    assert 'toggleHighContrast' in content
    assert 'voiceNoticeBanner' in content

    # 3. Main Headings & Titles per Specification
    assert "มหกรรมสุขภาพผู้สูงอายุแห่งชาติครั้งที่ 6" in content
    assert "การประชุมวิชาการ เวชศาสตร์และวิทยาการด้านผู้สูงอายุ" in content
    assert ("The 6th Thailand National Elderly Health Forum 2026" in content or "The 6th Thailand National Elderly Health Forum 2027" in content)
    assert "ร่วมเรียนรู้ ร่วมดูแล เพื่อสุขภาพผู้สูงอายุ" in content
    assert "สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ" in content

    # 4. Official 1920x1080 Banner & A4 Schedule Slider
    assert "1920x1080" in content
    assert "schedule-a4-viewport" in content
    assert "scheduleSlideContainer" in content
    assert "scheduleLightboxModal" in content

    # 5. Three Registration Modals / Sections
    assert "publicModal" in content # Form 1.1
    assert "pub_full_name" in content
    assert "toggleVoiceInput" in content # Speech-to-text
    assert "btnReadPublicFormNote" in content # Read Note

    assert "medicalModal" in content # Form 1.2
    assert "med_health_region" in content
    assert "nursing_license_no" in content

    assert "aseanModal" in content # Form 1.3
    assert "Accommodation Booking Notice" in content

    # 6. Status verification search (1.4)
    assert "searchQueryInput" in content
    assert "searchResultsContainer" in content

    # 7. Document Downloads (Feature 2)
    assert "documentsListContainer" in content

    # 8. Success modal
    assert "registrationSuccessModal" in content

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
