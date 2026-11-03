"""
Playwright End-to-End tests for Analyze Aging Dashboard using pytest-playwright.
"""

import pytest
import subprocess
import time
import socket
import re
from playwright.sync_api import Page, expect

def is_port_open(host="127.0.0.1", port=8000):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex((host, port)) == 0

@pytest.fixture(scope="module", autouse=True)
def live_server():
    server_process = None
    if not is_port_open():
        cmd = [r".\.venv\Scripts\python.exe", "-m", "uvicorn", "backend.app.main:app", "--host", "127.0.0.1", "--port", "8000"]
        server_process = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        # Wait up to 10 seconds for server to start
        for _ in range(20):
            if is_port_open():
                break
            time.sleep(0.5)
            
    yield
    
    if server_process:
        server_process.terminate()
        server_process.wait()

def test_dashboard_mount_and_hydration(page: Page):
    """Assert dashboard loads, displays title, and hydrates KPI cards."""
    page.goto("http://127.0.0.1:8000/aging_dashboard.html")
    expect(page).to_have_title("Analyze Aging: ระบบเฝ้าระวังและวิเคราะห์สุขภาพผู้สูงอายุ 9 ด้าน (MOPH HDC)")
    
    target_pop = page.locator("#kpi-target-pop")
    expect(target_pop).not_to_have_text("-", timeout=10000)
    
    screened_count = page.locator("#kpi-screened-count")
    expect(screened_count).not_to_have_text("-")

def test_leaderboard_and_limit_toggles(page: Page):
    """Assert leaderboard renders rows and respects Top 5 / Top 10 toggles."""
    page.goto("http://127.0.0.1:8000/aging_dashboard.html")
    
    rows = page.locator("#ranking-table-body tr")
    expect(rows).to_have_count(10, timeout=10000)
    
    # Click Top 5
    page.click("#btn-limit-5")
    expect(rows).to_have_count(5)

def test_choropleth_map_and_domain_switch(page: Page):
    """Assert D3 choropleth map renders paths and updates on domain switch."""
    page.goto("http://127.0.0.1:8000/aging_dashboard.html")
    
    # Wait for map paths
    province_paths = page.locator("#thailand-map-svg path")
    expect(province_paths.first).to_be_visible(timeout=10000)
    assert province_paths.count() >= 70
    
    # Switch domain to d6_depression
    page.select_option("#filter-domain", "d6_depression")
    leaderboard_title = page.locator("#leaderboard-title")
    expect(leaderboard_title).to_contain_text("ภาวะซึมเศร้า", timeout=10000)

def test_national_domain_rankings_cards(page: Page):
    """Assert national 9-domain risk ranking renders 9 cards ordered by highest risk, and clicking switches active domain."""
    page.goto("http://127.0.0.1:8000/aging_dashboard.html")
    
    # Wait for the 9 domain ranking cards
    cards = page.locator("#national-domain-ranking-grid > div")
    expect(cards).to_have_count(9, timeout=10000)
    
    # First card is Rank 1
    first_card = cards.first
    expect(first_card).to_contain_text("🥇 อันดับ 1")
    
    # Click on the second ranked domain card
    cards.nth(1).click()
    # Check that it activates focus
    expect(cards.nth(1)).to_contain_text("กำลังเลือกดูมิตินี้", timeout=5000)

def test_filters_comprehensive(page: Page):
    """Assert full filtering across zone, order, limit and reset."""
    page.goto("http://127.0.0.1:8000/aging_dashboard.html")
    
    # Filter by Zone 01
    page.select_option("#filter-zone", "01")
    # Verify banner updates
    banner = page.locator("#filter-status-banner")
    expect(banner).to_contain_text("เขตสุขภาพที่ 1", timeout=5000)
    
    # Change sort order to lowest risk (asc)
    page.select_option("#filter-order", "asc")
    leaderboard_title = page.locator("#leaderboard-title")
    expect(leaderboard_title).to_contain_text("ร้อยละความเสี่ยงต่ำสุด", timeout=5000)
    
    # Change limit to Top 25
    page.click("#btn-limit-25")
    rows = page.locator("#ranking-table-body tr")
    # Zone 1 has 8 provinces, so rows should be 8
    expect(rows).to_have_count(8, timeout=5000)
    
    # Reset filters
    page.locator("button:has-text('รีเซ็ต')").first.click()
    expect(banner).to_contain_text("ทั้งประเทศ", timeout=5000)
    rows_after_reset = page.locator("#ranking-table-body tr")
    expect(rows_after_reset).to_have_count(10, timeout=5000)

def test_thematic_tabs_navigation_and_rendering(page: Page):
    """Assert all 7 thematic tabs navigate cleanly and hydrate charts and tables."""
    page.goto("http://127.0.0.1:8000/aging_dashboard.html")
    
    # 1. Tab 1: 9 Domains & ADL Cards
    expect(page.locator("text=กลุ่มติดสังคม (Independent)")).to_be_visible(timeout=10000)
    expect(page.locator("text=95.8%").first).to_be_visible()

    # 2. Tab 2: Demographics 5 Years
    page.click("#btn-tab-demographics")
    expect(page.locator("#tab-demographics")).to_be_visible()
    expect(page.locator("#demographics-tbody tr")).to_have_count(5, timeout=10000)
    expect(page.locator("#demographics-chart")).to_be_visible()
    expect(page.locator("#age-group-chart")).to_be_visible()

    # 3. Tab 3: Chronic Diseases (NCDs)
    page.click("#btn-tab-ncd")
    expect(page.locator("#tab-ncd")).to_be_visible()
    expect(page.locator("#ncd-tbody tr")).to_have_count(11, timeout=10000)
    expect(page.locator("#ncd-chart")).to_be_visible()
    expect(page.locator("#ncd-clinical-cards > div")).to_have_count(10)

    # Test NCD sorting and category filter
    page.click("#btn-ncd-count")
    page.click("#btn-ncd-cat-cardio")
    expect(page.locator("#ncd-clinical-cards > div").first).to_be_visible()

    # 4. Tab 4: Morbidity OPD & IPD
    page.click("#btn-tab-morbidity")
    expect(page.locator("#tab-morbidity")).to_be_visible()
    expect(page.locator("#morbidity-tbody tr")).to_have_count(10, timeout=10000)
    # Switch to IPD
    page.click("#btn-morb-ipd")
    expect(page.locator("#morbidity-tbody tr")).to_have_count(10, timeout=5000)
    # Switch metric to rate
    page.click("#btn-morb-rate")
    expect(page.locator("#morbidity-chart")).to_be_visible()

    # 5. Tab 5: Mortality Causes
    page.click("#btn-tab-mortality")
    expect(page.locator("#tab-mortality")).to_be_visible()
    expect(page.locator("#mortality-tbody tr")).to_have_count(12, timeout=10000)
    expect(page.locator("#mortality-bar-chart")).to_be_visible()
    expect(page.locator("#mortality-pie-chart")).to_be_visible()

    # 6. Tab 6: DALYs & BOD
    page.click("#btn-tab-dalys")
    expect(page.locator("#tab-dalys")).to_be_visible()
    expect(page.locator("#dalys-tbody tr")).to_have_count(10, timeout=10000)
    expect(page.locator("#dalys-chart")).to_be_visible()
    # Switch DALYs view to 100% share
    page.click("#btn-dalys-pct")
    expect(page.locator("#dalys-chart")).to_be_visible()
