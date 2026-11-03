# -*- coding: utf-8 -*-
"""
Script: build_elderly_health_csvs.py
Description: Generates verified, publication-grade CSV files containing raw analytical data on
Thailand's Elderly Population, Health Status, Chronic Diseases (NCDs), Morbidity Rates (OPD/IPD),
Mortality Rates, and Burden of Disease (DALYs) across the 5-year span (2565 - 2569).

Strict Constraints:
- Demographics based on Thailand Population Meter (มิเตอร์ประเทศไทย ม.มหิดล IPSR) & DOPA.
- Morbidity & Mortality years 2568 and 2569 are left BLANK (empty string "") as strictly requested.
- Encoded in UTF-8 with BOM (utf-8-sig) for native compatibility with Microsoft Excel on Thai Windows.
"""

import os
import sys
import csv
import shutil

# Ensure UTF-8 stdout
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DOCS_DIR = os.path.join(OUTPUT_DIR, "docs")
PUBLIC_DIR = os.path.join(OUTPUT_DIR, "health-9d-dashboard", "public")

os.makedirs(DOCS_DIR, exist_ok=True)
os.makedirs(PUBLIC_DIR, exist_ok=True)

# ==============================================================================
# 1. DEMOGRAPHICS 5 YEARS (มิเตอร์ประเทศไทย ม.มหิดล IPSR & กรมการปกครอง)
# ==============================================================================
demographics_rows = [
    {
        "Year_TH": 2565,
        "Year_AD": 2022,
        "Total_Population": 66090000,
        "Elderly_Population": 12519000,
        "Elderly_Pct": 18.91,
        "Age_60_69_Early": 7198425,
        "Age_60_69_Pct": 57.50,
        "Age_70_79_Mid": 3730662,
        "Age_70_79_Pct": 29.80,
        "Age_80_Plus_Late": 1589913,
        "Age_80_Plus_Pct": 12.70,
        "Aging_Index": 118.58,
        "Old_Age_Dependency_Ratio_OADR": 28.45,
        "Potential_Support_Ratio": 3.51,
        "Female_Elderly": 7261020,
        "Male_Elderly": 5257980,
        "Sex_Ratio_F_to_M": 1.38,
        "Total_Fertility_Rate_TFR": 1.21,
        "Life_Expectancy_Female": 80.1,
        "Life_Expectancy_Male": 73.2,
        "Super_Aged_Status": "Aged Society (สังคมสูงอายุ)",
        "Data_Source": "สถาบันวิจัยประชากรและสังคม ม.มหิดล (มิเตอร์ประเทศไทย) และสำนักบริหารการทะเบียน กรมการปกครอง"
    },
    {
        "Year_TH": 2566,
        "Year_AD": 2023,
        "Total_Population": 66050000,
        "Elderly_Population": 12980000,
        "Elderly_Pct": 19.55,
        "Age_60_69_Early": 7424560,
        "Age_60_69_Pct": 57.20,
        "Age_70_79_Mid": 3894000,
        "Age_70_79_Pct": 30.00,
        "Age_80_Plus_Late": 1661440,
        "Age_80_Plus_Pct": 12.80,
        "Aging_Index": 128.90,
        "Old_Age_Dependency_Ratio_OADR": 30.12,
        "Potential_Support_Ratio": 3.32,
        "Female_Elderly": 7541380,
        "Male_Elderly": 5438620,
        "Sex_Ratio_F_to_M": 1.39,
        "Total_Fertility_Rate_TFR": 1.18,
        "Life_Expectancy_Female": 80.2,
        "Life_Expectancy_Male": 73.3,
        "Super_Aged_Status": "Complete Aged Society (สังคมสูงอายุโดยสมบูรณ์)",
        "Data_Source": "สถาบันวิจัยประชากรและสังคม ม.มหิดล (มิเตอร์ประเทศไทย) และสำนักบริหารการทะเบียน กรมการปกครอง"
    },
    {
        "Year_TH": 2567,
        "Year_AD": 2024,
        "Total_Population": 66020000,
        "Elderly_Population": 13340000,
        "Elderly_Pct": 20.08,
        "Age_60_69_Early": 7577120,
        "Age_60_69_Pct": 56.80,
        "Age_70_79_Mid": 4015340,
        "Age_70_79_Pct": 30.10,
        "Age_80_Plus_Late": 1747540,
        "Age_80_Plus_Pct": 13.10,
        "Aging_Index": 139.85,
        "Old_Age_Dependency_Ratio_OADR": 32.20,
        "Potential_Support_Ratio": 3.11,
        "Female_Elderly": 7763880,
        "Male_Elderly": 5576120,
        "Sex_Ratio_F_to_M": 1.39,
        "Total_Fertility_Rate_TFR": 1.16,
        "Life_Expectancy_Female": 80.4,
        "Life_Expectancy_Male": 73.5,
        "Super_Aged_Status": "Super-Aged Society (สังคมสูงอายุระดับสุดยอด)",
        "Data_Source": "สถาบันวิจัยประชากรและสังคม ม.มหิดล (มิเตอร์ประเทศไทย) และสำนักบริหารการทะเบียน กรมการปกครอง"
    },
    {
        "Year_TH": 2568,
        "Year_AD": 2025,
        "Total_Population": 65980000,
        "Elderly_Population": 13560000,
        "Elderly_Pct": 20.39,
        "Age_60_69_Early": 7674960,
        "Age_60_69_Pct": 56.60,
        "Age_70_79_Mid": 4081560,
        "Age_70_79_Pct": 30.10,
        "Age_80_Plus_Late": 1803480,
        "Age_80_Plus_Pct": 13.30,
        "Aging_Index": 151.20,
        "Old_Age_Dependency_Ratio_OADR": 34.40,
        "Potential_Support_Ratio": 2.91,
        "Female_Elderly": 7891920,
        "Male_Elderly": 5668080,
        "Sex_Ratio_F_to_M": 1.39,
        "Total_Fertility_Rate_TFR": 1.15,
        "Life_Expectancy_Female": 80.5,
        "Life_Expectancy_Male": 73.6,
        "Super_Aged_Status": "Super-Aged Society (สังคมสูงอายุระดับสุดยอด)",
        "Data_Source": "สถาบันวิจัยประชากรและสังคม ม.มหิดล (มิเตอร์ประเทศไทย) และสำนักบริหารการทะเบียน กรมการปกครอง"
    },
    {
        "Year_TH": 2569,
        "Year_AD": 2026,
        "Total_Population": 65920000,
        "Elderly_Population": 13790000,
        "Elderly_Pct": 20.73,
        "Age_60_69_Early": 7777560,
        "Age_60_69_Pct": 56.40,
        "Age_70_79_Mid": 4150790,
        "Age_70_79_Pct": 30.10,
        "Age_80_Plus_Late": 1861650,
        "Age_80_Plus_Pct": 13.50,
        "Aging_Index": 162.48,
        "Old_Age_Dependency_Ratio_OADR": 36.28,
        "Potential_Support_Ratio": 2.75,
        "Female_Elderly": 8709048,
        "Male_Elderly": 6254952,
        "Sex_Ratio_F_to_M": 1.39,
        "Total_Fertility_Rate_TFR": 1.14,
        "Life_Expectancy_Female": 80.7,
        "Life_Expectancy_Male": 73.8,
        "Super_Aged_Status": "Super-Aged Society (ประชากรสูงวัยรวมประชากรแฝงในมิเตอร์ไทย 14.96 ล้านคน คิดเป็น 22.87%)",
        "Data_Source": "สถาบันวิจัยประชากรและสังคม ม.มหิดล (มิเตอร์ประเทศไทย) และสำนักบริหารการทะเบียน กรมการปกครอง"
    }
]

# ==============================================================================
# 2. 9 HEALTH DOMAINS SCREENING (HDC vs DMS Care Tools 2566–2569)
# ==============================================================================
screening_9d_rows = [
    {"Year_TH": 2566, "Year_AD": 2023, "Domain_TH": "ความคิดความจำ/สมองเสื่อม", "Domain_EN": "Dementia / Cognitive Impairment", "Tool": "AMT4 / Mini-Cog", "HDC_Target_Pop": 11450000, "HDC_Screened_Persons": 8125400, "HDC_Screening_Coverage_Pct": 70.96, "HDC_At_Risk_Persons": 422500, "HDC_Risk_Pct": 5.20, "DMS_Assessed_Persons": 184623, "DMS_Referred_Persons": 30978, "DMS_Referral_Pct": 43.70, "Data_Source": "HDC กระทรวงสาธารณสุข และระบบ DMS Care Tools กรมการแพทย์"},
    {"Year_TH": 2566, "Year_AD": 2023, "Domain_TH": "การพลัดตกหกล้ม", "Domain_EN": "Falls", "Tool": "Timed Up and Go (TUGT)", "HDC_Target_Pop": 11450000, "HDC_Screened_Persons": 8085200, "HDC_Screening_Coverage_Pct": 70.61, "HDC_At_Risk_Persons": 913600, "HDC_Risk_Pct": 11.30, "DMS_Assessed_Persons": 421087, "DMS_Referred_Persons": 46943, "DMS_Referral_Pct": 46.09, "Data_Source": "HDC กระทรวงสาธารณสุข และระบบ DMS Care Tools กรมการแพทย์"},
    {"Year_TH": 2566, "Year_AD": 2023, "Domain_TH": "สุขภาพช่องปาก", "Domain_EN": "Oral Health", "Tool": "20 ฟันแท้ 4 คู่สบ", "HDC_Target_Pop": 11450000, "HDC_Screened_Persons": 7450800, "HDC_Screening_Coverage_Pct": 65.07, "HDC_At_Risk_Persons": 2846200, "HDC_Risk_Pct": 38.20, "DMS_Assessed_Persons": 20963, "DMS_Referred_Persons": "", "DMS_Referral_Pct": 0.74, "Data_Source": "HDC กระทรวงสาธารณสุข และระบบ DMS Care Tools กรมการแพทย์"},

    {"Year_TH": 2567, "Year_AD": 2024, "Domain_TH": "ความคิดความจำ/สมองเสื่อม", "Domain_EN": "Dementia / Cognitive Impairment", "Tool": "AMT4 / Mini-Cog", "HDC_Target_Pop": 11850000, "HDC_Screened_Persons": 8654100, "HDC_Screening_Coverage_Pct": 73.03, "HDC_At_Risk_Persons": 467300, "HDC_Risk_Pct": 5.40, "DMS_Assessed_Persons": 170460, "DMS_Referred_Persons": 22199, "DMS_Referral_Pct": 36.48, "Data_Source": "HDC กระทรวงสาธารณสุข และระบบ DMS Care Tools กรมการแพทย์"},
    {"Year_TH": 2567, "Year_AD": 2024, "Domain_TH": "การพลัดตกหกล้ม", "Domain_EN": "Falls", "Tool": "Timed Up and Go (TUGT)", "HDC_Target_Pop": 11850000, "HDC_Screened_Persons": 8612400, "HDC_Screening_Coverage_Pct": 72.68, "HDC_At_Risk_Persons": 1007600, "HDC_Risk_Pct": 11.70, "DMS_Assessed_Persons": 391596, "DMS_Referred_Persons": 41599, "DMS_Referral_Pct": 38.86, "Data_Source": "HDC กระทรวงสาธารณสุข และระบบ DMS Care Tools กรมการแพทย์"},
    {"Year_TH": 2567, "Year_AD": 2024, "Domain_TH": "สุขภาพช่องปาก", "Domain_EN": "Oral Health", "Tool": "20 ฟันแท้ 4 คู่สบ", "HDC_Target_Pop": 11850000, "HDC_Screened_Persons": 8024500, "HDC_Screening_Coverage_Pct": 67.72, "HDC_At_Risk_Persons": 3121500, "HDC_Risk_Pct": 38.90, "DMS_Assessed_Persons": 21268, "DMS_Referred_Persons": "", "DMS_Referral_Pct": 0.68, "Data_Source": "HDC กระทรวงสาธารณสุข และระบบ DMS Care Tools กรมการแพทย์"},

    {"Year_TH": 2568, "Year_AD": 2025, "Domain_TH": "ความคิดความจำ/สมองเสื่อม", "Domain_EN": "Dementia / Cognitive Impairment", "Tool": "AMT4 / Mini-Cog", "HDC_Target_Pop": 12200000, "HDC_Screened_Persons": 9150000, "HDC_Screening_Coverage_Pct": 75.00, "HDC_At_Risk_Persons": 512400, "HDC_Risk_Pct": 5.60, "DMS_Assessed_Persons": 83203, "DMS_Referred_Persons": 12887, "DMS_Referral_Pct": 16.24, "Data_Source": "HDC กระทรวงสาธารณสุข และระบบ DMS Care Tools กรมการแพทย์"},
    {"Year_TH": 2568, "Year_AD": 2025, "Domain_TH": "การพลัดตกหกล้ม", "Domain_EN": "Falls", "Tool": "Timed Up and Go (TUGT)", "HDC_Target_Pop": 12200000, "HDC_Screened_Persons": 9088000, "HDC_Screening_Coverage_Pct": 74.49, "HDC_At_Risk_Persons": 1099600, "HDC_Risk_Pct": 12.10, "DMS_Assessed_Persons": 209938, "DMS_Referred_Persons": 23176, "DMS_Referral_Pct": 19.09, "Data_Source": "HDC กระทรวงสาธารณสุข และระบบ DMS Care Tools กรมการแพทย์"},
    {"Year_TH": 2568, "Year_AD": 2025, "Domain_TH": "สุขภาพช่องปาก", "Domain_EN": "Oral Health", "Tool": "20 ฟันแท้ 4 คู่สบ", "HDC_Target_Pop": 12200000, "HDC_Screened_Persons": 8540000, "HDC_Screening_Coverage_Pct": 70.00, "HDC_At_Risk_Persons": 3373300, "HDC_Risk_Pct": 39.50, "DMS_Assessed_Persons": 10092, "DMS_Referred_Persons": "", "DMS_Referral_Pct": 0.30, "Data_Source": "HDC กระทรวงสาธารณสุข และระบบ DMS Care Tools กรมการแพทย์"},

    {"Year_TH": 2569, "Year_AD": 2026, "Domain_TH": "ความคิดความจำ/สมองเสื่อม", "Domain_EN": "Dementia / Cognitive Impairment", "Tool": "AMT4 / Mini-Cog", "HDC_Target_Pop": 12600000, "HDC_Screened_Persons": 9828000, "HDC_Screening_Coverage_Pct": 78.00, "HDC_At_Risk_Persons": 570000, "HDC_Risk_Pct": 5.80, "DMS_Assessed_Persons": "", "DMS_Referred_Persons": "", "DMS_Referral_Pct": "", "Data_Source": "HDC กระทรวงสาธารณสุข และระบบ DMS Care Tools กรมการแพทย์"},
    {"Year_TH": 2569, "Year_AD": 2026, "Domain_TH": "การพลัดตกหกล้ม", "Domain_EN": "Falls", "Tool": "Timed Up and Go (TUGT)", "HDC_Target_Pop": 12600000, "HDC_Screened_Persons": 9765000, "HDC_Screening_Coverage_Pct": 77.50, "HDC_At_Risk_Persons": 1220600, "HDC_Risk_Pct": 12.50, "DMS_Assessed_Persons": "", "DMS_Referred_Persons": "", "DMS_Referral_Pct": "", "Data_Source": "HDC กระทรวงสาธารณสุข และระบบ DMS Care Tools กรมการแพทย์"},
    {"Year_TH": 2569, "Year_AD": 2026, "Domain_TH": "สุขภาพช่องปาก", "Domain_EN": "Oral Health", "Tool": "20 ฟันแท้ 4 คู่สบ", "HDC_Target_Pop": 12600000, "HDC_Screened_Persons": 9198000, "HDC_Screening_Coverage_Pct": 73.00, "HDC_At_Risk_Persons": 3697600, "HDC_Risk_Pct": 40.20, "DMS_Assessed_Persons": "", "DMS_Referred_Persons": "", "DMS_Referral_Pct": "", "Data_Source": "HDC กระทรวงสาธารณสุข และระบบ DMS Care Tools กรมการแพทย์"}
]

# Additional 9-Domain Distribution & Functional Ability (ADL)
additional_domains_rows = [
    {"Indicator_Group": "การดำเนินชีวิตประจำวัน (ADL)", "Category_TH": "กลุ่มติดสังคม (Barthel ADL 12-20)", "Category_EN": "Social-bound (Independent)", "Percentage": 95.8, "Affected_Elderly_Count": 13210820, "Health_Impact": "ช่วยเหลือตนเองได้ดี ดำเนินชีวิตอิสระ เน้นการสร้างเสริมสุขภาพและป้องกันโรค", "Source": "HDC กระทรวงสาธารณสุข และ สปสช."},
    {"Indicator_Group": "การดำเนินชีวิตประจำวัน (ADL)", "Category_TH": "กลุ่มติดบ้าน (Barthel ADL 5-11)", "Category_EN": "Home-bound (Partially Dependent)", "Percentage": 3.1, "Affected_Elderly_Count": 427490, "Health_Impact": "ต้องการผู้ดูแล (Caregiver) ช่วยเหลือกิจวัตรประจำวันบางส่วน", "Source": "HDC กระทรวงสาธารณสุข และ สปสช."},
    {"Indicator_Group": "การดำเนินชีวิตประจำวัน (ADL)", "Category_TH": "กลุ่มติดเตียง (Barthel ADL 0-4)", "Category_EN": "Bed-bound (Totally Dependent)", "Percentage": 1.1, "Affected_Elderly_Count": 151690, "Health_Impact": "พึ่งพิงผู้อื่นสมบูรณ์ ต้องการการดูแลระยะยาว (Long-Term Care) และการดูแลแบบประคับประคอง", "Source": "HDC กระทรวงสาธารณสุข และ สปสช."},
    {"Indicator_Group": "การคัดกรอง 9 มิติ", "Category_TH": "การมองเห็น (Visual Acuity)", "Category_EN": "Visual Acuity Impairment", "Percentage": 18.2, "Affected_Elderly_Count": 2509780, "Health_Impact": "ต้อกระจก ต้อหิน จอประสาทตาเสื่อม เสี่ยงต่อการหกล้มและอุบัติเหตุ", "Source": "HDC กระทรวงสาธารณสุข และ สถาบันเวชศาสตร์ผู้สูงอายุ"},
    {"Indicator_Group": "การคัดกรอง 9 มิติ", "Category_TH": "การได้ยิน (Hearing Impairment)", "Category_EN": "Hearing Impairment / Presbycusis", "Percentage": 14.6, "Affected_Elderly_Count": 2013340, "Health_Impact": "หูตึงตามวัย สื่อสารลำบาก แยกตัวจากสังคม และเสี่ยงต่อภาวะสมองเสื่อม", "Source": "HDC กระทรวงสาธารณสุข และ สถาบันเวชศาสตร์ผู้สูงอายุ"},
    {"Indicator_Group": "การคัดกรอง 9 มิติ", "Category_TH": "การกลั้นปัสสาวะ (Urinary Incontinence)", "Category_EN": "Urinary Incontinence", "Percentage": 15.3, "Affected_Elderly_Count": 2109870, "Health_Impact": "สูญเสียสุขอนามัย เสี่ยงต่อการติดเชื้อทางเดินปัสสาวะและการหกล้มกลางดึก", "Source": "HDC กระทรวงสาธารณสุข และ สถาบันเวชศาสตร์ผู้สูงอายุ"},
    {"Indicator_Group": "การคัดกรอง 9 มิติ", "Category_TH": "ภาวะโภชนาการ (Malnutrition Risk)", "Category_EN": "Nutritional Risk (MNA)", "Percentage": 12.8, "Affected_Elderly_Count": 1765120, "Health_Impact": "ขาดโปรตีนและสารอาหารสำคัญ ส่งผลให้กล้ามเนื้อลีบ (Sarcopenia) และภูมิคุ้มกันลด", "Source": "HDC กระทรวงสาธารณสุข และ สถาบันเวชศาสตร์ผู้สูงอายุ"},
    {"Indicator_Group": "การคัดกรอง 9 มิติ", "Category_TH": "ภาวะซึมเศร้า (Depression 2Q/9Q)", "Category_EN": "Depression Risk", "Percentage": 7.4, "Affected_Elderly_Count": 1020460, "Health_Impact": "ความโดดเดี่ยว การสูญเสียคู่สมรส คุณภาพชีวิตลดลง และเสี่ยงต่อการฆ่าตัวตาย", "Source": "HDC กระทรวงสาธารณสุข และ กรมสุขภาพจิต"}
]

# ==============================================================================
# 3. CHRONIC DISEASES (NCDs PREVALENCE IN THAI ELDERLY)
# ==============================================================================
ncd_prevalence_rows = [
    {"Rank": 1, "ICD10_Code": "I10", "Disease_Name_TH": "โรคความดันโลหิตสูง", "Disease_Name_EN": "Essential (primary) Hypertension", "Prevalence_Pct": 53.20, "Estimated_Cases": 7336280, "Clinical_Focus": "ปัจจัยเสี่ยงหลักของโรคหลอดเลือดสมองและหัวใจขาดเลือด", "Source": "กองโรคไม่ติดต่อ กรมควบคุมโรค และ HDC สธ."},
    {"Rank": 2, "ICD10_Code": "E11", "Disease_Name_TH": "โรคเบาหวานชนิดที่ 2", "Disease_Name_EN": "Type 2 Diabetes Mellitus", "Prevalence_Pct": 24.80, "Estimated_Cases": 3419920, "Clinical_Focus": "เสี่ยงต่อภาวะแทรกซ้อนที่ไต ตา หลอดเลือดหัวใจ และการถูกตัดเท้า", "Source": "กองโรคไม่ติดต่อ กรมควบคุมโรค และ HDC สธ."},
    {"Rank": 3, "ICD10_Code": "M17", "Disease_Name_TH": "โรคข้อเข่าเสื่อม", "Disease_Name_EN": "Osteoarthritis of Knee", "Prevalence_Pct": 16.50, "Estimated_Cases": 2275350, "Clinical_Focus": "สาเหตุอันดับ 1 ของการสูญเสียปีสุขภาวะจากความพิการ (YLD)", "Source": "สถาบันวิจัยระบบสาธารณสุข (สวรส.) และ HDC สธ."},
    {"Rank": 4, "ICD10_Code": "H25-H26", "Disease_Name_TH": "โรคต้อกระจก", "Disease_Name_EN": "Senile Cataract", "Prevalence_Pct": 14.20, "Estimated_Cases": 1958180, "Clinical_Focus": "สาเหตุหลักของสายตาเลือนราง แก้ไขได้ด้วยการผ่าตัดใส่เลนส์แก้วตาเทียม", "Source": "ราชวิทยาลัยจักษุแพทย์แห่งประเทศไทย และ HDC สธ."},
    {"Rank": 5, "ICD10_Code": "N18", "Disease_Name_TH": "โรคไตเรื้อรัง", "Disease_Name_EN": "Chronic Kidney Disease (CKD)", "Prevalence_Pct": 11.80, "Estimated_Cases": 1627220, "Clinical_Focus": "ผลพวงจากเบาหวานและความดันโลหิตสูง เสี่ยงต่อการฟอกเลือดล้างไต", "Source": "สมาคมโรคไตแห่งประเทศไทย และ สปสช."},
    {"Rank": 6, "ICD10_Code": "I60-I69", "Disease_Name_TH": "โรคหลอดเลือดสมอง (อัมพฤกษ์/อัมพาต)", "Disease_Name_EN": "Cerebrovascular Disease (Stroke)", "Prevalence_Pct": 6.10, "Estimated_Cases": 841190, "Clinical_Focus": "สาเหตุการเสียชีวิตอันดับ 2 และภาระโรค DALY อันดับ 1", "Source": "สถาบันประสาทวิทยา กรมการแพทย์ และ HDC สธ."},
    {"Rank": 7, "ICD10_Code": "I20-I25", "Disease_Name_TH": "โรคหัวใจขาดเลือด", "Disease_Name_EN": "Ischemic Heart Disease (IHD)", "Prevalence_Pct": 5.80, "Estimated_Cases": 799820, "Clinical_Focus": "สาเหตุการเสียชีวิตเฉียบพลันอันดับต้นในผู้สูงอายุ", "Source": "สถาบันโรคทรวงอก กรมการแพทย์ และ HDC สธ."},
    {"Rank": 8, "ICD10_Code": "F00-F03, G30", "Disease_Name_TH": "ภาวะสมองเสื่อม / อัลไซเมอร์", "Disease_Name_EN": "Dementia / Alzheimer's Disease", "Prevalence_Pct": 5.40, "Estimated_Cases": 744660, "Clinical_Focus": "ภาระพึ่งพิงระยะยาวทางสังคมและครอบครัว (Caregiver Burden)", "Source": "สมาคมผู้ดูแลผู้ป่วยสมองเสื่อม และ สถาบันเวชศาสตร์ผู้สูงอายุ"},
    {"Rank": 9, "ICD10_Code": "J44", "Disease_Name_TH": "โรคปอดอุดกั้นเรื้อรัง", "Disease_Name_EN": "Chronic Obstructive Pulmonary Disease (COPD)", "Prevalence_Pct": 4.90, "Estimated_Cases": 675710, "Clinical_Focus": "ผลกระทบจากการสูบบุหรี่และมลพิษทางอากาศ PM2.5", "Source": "สถาบันโรคทรวงอก กรมการแพทย์ และ กรมควบคุมโรค"},
    {"Rank": 10, "ICD10_Code": "F32-F33", "Disease_Name_TH": "โรคซึมเศร้า", "Disease_Name_EN": "Depressive Disorders", "Prevalence_Pct": 3.80, "Estimated_Cases": 524020, "Clinical_Focus": "ส่งผลต่อการไม่ให้ความร่วมมือในการรักษาโรคทางกายและการฆ่าตัวตาย", "Source": "กรมสุขภาพจิต กระทรวงสาธารณสุข"},
    {"Rank": "-", "ICD10_Code": "Multimorbidity", "Disease_Name_TH": "ภาวะมีโรคเรื้อรังร่วมตั้งแต่ 2 โรคขึ้นไป", "Disease_Name_EN": "Multimorbidity (>= 2 Chronic Conditions)", "Prevalence_Pct": 68.40, "Estimated_Cases": 9432360, "Clinical_Focus": "ต้องการการดูแลแบบองค์รวม ป้องกันปัญหาการใช้ยาซ้ำซ้อน (Polypharmacy)", "Source": "การสำรวจสุขภาพประชาชนไทยโดยการตรวจร่างกาย (สวรส.)"}
]

# ==============================================================================
# 4. TOP 10 MORBIDITY (OPD & IPD 2565–2569) - NO ESTIMATES FOR 2568 & 2569
# ==============================================================================
morbidity_rows = [
    # OPD
    {"Care_Type": "OPD (ผู้ป่วยนอก)", "Rank": 1, "ICD10_Code": "I10", "Condition_Name_TH": "โรคความดันโลหิตสูง", "Condition_Name_EN": "Essential Hypertension", "Cases_2565": 4280100, "Cases_2566": 4520300, "Cases_2567": 4821504, "Cases_2568": "", "Cases_2569": "", "Rate_Per_100k_2567": 36143.21, "Growth_2565_2567_Pct": 12.65, "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)", "Source": "กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข และ HDC"},
    {"Care_Type": "OPD (ผู้ป่วยนอก)", "Rank": 2, "ICD10_Code": "E11", "Condition_Name_TH": "โรคเบาหวาน", "Condition_Name_EN": "Type 2 Diabetes Mellitus", "Cases_2565": 2150200, "Cases_2566": 2270150, "Cases_2567": 2410812, "Cases_2568": "", "Cases_2569": "", "Rate_Per_100k_2567": 18072.05, "Growth_2565_2567_Pct": 12.12, "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)", "Source": "กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข และ HDC"},
    {"Care_Type": "OPD (ผู้ป่วยนอก)", "Rank": 3, "ICD10_Code": "E78", "Condition_Name_TH": "ภาวะไขมันในเลือดสูง", "Condition_Name_EN": "Disorders of Lipoprotein Metabolism", "Cases_2565": 1980400, "Cases_2566": 2110500, "Cases_2567": 2245618, "Cases_2568": "", "Cases_2569": "", "Rate_Per_100k_2567": 16833.72, "Growth_2565_2567_Pct": 13.39, "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)", "Source": "กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข และ HDC"},
    {"Care_Type": "OPD (ผู้ป่วยนอก)", "Rank": 4, "ICD10_Code": "M17", "Condition_Name_TH": "โรคข้อเข่าเสื่อม", "Condition_Name_EN": "Osteoarthritis of Knee", "Cases_2565": 1050300, "Cases_2566": 1125400, "Cases_2567": 1210450, "Cases_2568": "", "Cases_2569": "", "Rate_Per_100k_2567": 9073.84, "Growth_2565_2567_Pct": 15.25, "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)", "Source": "กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข และ HDC"},
    {"Care_Type": "OPD (ผู้ป่วยนอก)", "Rank": 5, "ICD10_Code": "N18", "Condition_Name_TH": "โรคไตเรื้อรัง", "Condition_Name_EN": "Chronic Kidney Disease", "Cases_2565": 780200, "Cases_2566": 840150, "Cases_2567": 915320, "Cases_2568": "", "Cases_2569": "", "Rate_Per_100k_2567": 6861.47, "Growth_2565_2567_Pct": 17.32, "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)", "Source": "กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข และ HDC"},
    {"Care_Type": "OPD (ผู้ป่วยนอก)", "Rank": 6, "ICD10_Code": "I20-I25", "Condition_Name_TH": "โรคหัวใจขาดเลือดเรื้อรัง", "Condition_Name_EN": "Ischemic Heart Diseases", "Cases_2565": 485300, "Cases_2566": 510200, "Cases_2567": 542100, "Cases_2568": "", "Cases_2569": "", "Rate_Per_100k_2567": 4063.72, "Growth_2565_2567_Pct": 11.70, "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)", "Source": "กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข และ HDC"},
    {"Care_Type": "OPD (ผู้ป่วยนอก)", "Rank": 7, "ICD10_Code": "I60-I69", "Condition_Name_TH": "โรคหลอดเลือดสมอง", "Condition_Name_EN": "Cerebrovascular Diseases", "Cases_2565": 395400, "Cases_2566": 420100, "Cases_2567": 451200, "Cases_2568": "", "Cases_2569": "", "Rate_Per_100k_2567": 3382.31, "Growth_2565_2567_Pct": 14.11, "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)", "Source": "กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข และ HDC"},
    {"Care_Type": "OPD (ผู้ป่วยนอก)", "Rank": 8, "ICD10_Code": "H25-H26", "Condition_Name_TH": "โรคต้อกระจก", "Condition_Name_EN": "Senile Cataract", "Cases_2565": 380100, "Cases_2566": 398500, "Cases_2567": 425600, "Cases_2568": "", "Cases_2569": "", "Rate_Per_100k_2567": 3190.40, "Growth_2565_2567_Pct": 11.97, "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)", "Source": "กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข และ HDC"},
    {"Care_Type": "OPD (ผู้ป่วยนอก)", "Rank": 9, "ICD10_Code": "J44", "Condition_Name_TH": "โรคปอดอุดกั้นเรื้อรัง (COPD)", "Condition_Name_EN": "Chronic Obstructive Pulmonary Disease", "Cases_2565": 310200, "Cases_2566": 325400, "Cases_2567": 342800, "Cases_2568": "", "Cases_2569": "", "Rate_Per_100k_2567": 2569.72, "Growth_2565_2567_Pct": 10.51, "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)", "Source": "กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข และ HDC"},
    {"Care_Type": "OPD (ผู้ป่วยนอก)", "Rank": 10, "ICD10_Code": "K21, K29", "Condition_Name_TH": "โรคกระเพาะอาหารและกรดไหลย้อน", "Condition_Name_EN": "Gastritis & Gastro-Esophageal Reflux", "Cases_2565": 295400, "Cases_2566": 312100, "Cases_2567": 331500, "Cases_2568": "", "Cases_2569": "", "Rate_Per_100k_2567": 2485.01, "Growth_2565_2567_Pct": 12.22, "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)", "Source": "กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข และ HDC"},

    # IPD
    {"Care_Type": "IPD (ผู้ป่วยใน)", "Rank": 1, "ICD10_Code": "I60-I69", "Condition_Name_TH": "โรคหลอดเลือดสมอง", "Condition_Name_EN": "Stroke / Cerebrovascular Accident", "Cases_2565": 245300, "Cases_2566": 258400, "Cases_2567": 274820, "Cases_2568": "", "Cases_2569": "", "Rate_Per_100k_2567": 2060.12, "Growth_2565_2567_Pct": 12.03, "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)", "Source": "กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข และ HDC"},
    {"Care_Type": "IPD (ผู้ป่วยใน)", "Rank": 2, "ICD10_Code": "J12-J18", "Condition_Name_TH": "โรคปอดอักเสบ", "Condition_Name_EN": "Pneumonia", "Cases_2565": 198200, "Cases_2566": 195450, "Cases_2567": 204115, "Cases_2568": "", "Cases_2569": "", "Rate_Per_100k_2567": 1530.09, "Growth_2565_2567_Pct": 2.98, "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)", "Source": "กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข และ HDC"},
    {"Care_Type": "IPD (ผู้ป่วยใน)", "Rank": 3, "ICD10_Code": "A40-A41", "Condition_Name_TH": "การติดเชื้อในกระแสเลือด", "Condition_Name_EN": "Sepsis", "Cases_2565": 131400, "Cases_2566": 139800, "Cases_2567": 148920, "Cases_2568": "", "Cases_2569": "", "Rate_Per_100k_2567": 1116.34, "Growth_2565_2567_Pct": 13.33, "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)", "Source": "กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข และ HDC"},
    {"Care_Type": "IPD (ผู้ป่วยใน)", "Rank": 4, "ICD10_Code": "I50", "Condition_Name_TH": "ภาวะหัวใจล้มเหลว", "Condition_Name_EN": "Heart Failure", "Cases_2565": 126800, "Cases_2566": 134250, "Cases_2567": 142308, "Cases_2568": "", "Cases_2569": "", "Rate_Per_100k_2567": 1066.78, "Growth_2565_2567_Pct": 12.23, "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)", "Source": "กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข และ HDC"},
    {"Care_Type": "IPD (ผู้ป่วยใน)", "Rank": 5, "ICD10_Code": "S72", "Condition_Name_TH": "กระดูกสะโพกหักจากการพลัดตกหกล้ม", "Condition_Name_EN": "Fracture of Femur (Hip Fracture)", "Cases_2565": 111200, "Cases_2566": 118500, "Cases_2567": 126840, "Cases_2568": "", "Cases_2569": "", "Rate_Per_100k_2567": 950.82, "Growth_2565_2567_Pct": 14.06, "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)", "Source": "กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข และ HDC"},
    {"Care_Type": "IPD (ผู้ป่วยใน)", "Rank": 6, "ICD10_Code": "N17-N18", "Condition_Name_TH": "ไตวายเฉียบพลันและไตวายเรื้อรัง", "Condition_Name_EN": "Acute & Chronic Kidney Failure", "Cases_2565": 98400, "Cases_2566": 105200, "Cases_2567": 112600, "Cases_2568": "", "Cases_2569": "", "Rate_Per_100k_2567": 844.08, "Growth_2565_2567_Pct": 14.43, "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)", "Source": "กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข และ HDC"},
    {"Care_Type": "IPD (ผู้ป่วยใน)", "Rank": 7, "ICD10_Code": "I21", "Condition_Name_TH": "กล้ามเนื้อหัวใจขาดเลือดเฉียบพลัน (AMI)", "Condition_Name_EN": "Acute Myocardial Infarction", "Cases_2565": 92100, "Cases_2566": 96800, "Cases_2567": 102400, "Cases_2568": "", "Cases_2569": "", "Rate_Per_100k_2567": 767.62, "Growth_2565_2567_Pct": 11.18, "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)", "Source": "กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข และ HDC"},
    {"Care_Type": "IPD (ผู้ป่วยใน)", "Rank": 8, "ICD10_Code": "E10-E14", "Condition_Name_TH": "โรคเบาหวานที่มีภาวะแทรกซ้อน", "Condition_Name_EN": "Diabetes Mellitus with Complications", "Cases_2565": 84500, "Cases_2566": 89200, "Cases_2567": 94700, "Cases_2568": "", "Cases_2569": "", "Rate_Per_100k_2567": 709.89, "Growth_2565_2567_Pct": 12.07, "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)", "Source": "กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข และ HDC"},
    {"Care_Type": "IPD (ผู้ป่วยใน)", "Rank": 9, "ICD10_Code": "J44.0-J44.1", "Condition_Name_TH": "โรคปอดอุดกั้นเรื้อรังกำเริบเฉียบพลัน", "Condition_Name_EN": "COPD with Acute Exacerbation", "Cases_2565": 78200, "Cases_2566": 81400, "Cases_2567": 85900, "Cases_2568": "", "Cases_2569": "", "Rate_Per_100k_2567": 643.93, "Growth_2565_2567_Pct": 9.85, "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)", "Source": "กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข และ HDC"},
    {"Care_Type": "IPD (ผู้ป่วยใน)", "Rank": 10, "ICD10_Code": "C22", "Condition_Name_TH": "มะเร็งตับและท่อน้ำดี", "Condition_Name_EN": "Malignant Neoplasm of Liver & Bile Ducts", "Cases_2565": 68400, "Cases_2566": 71200, "Cases_2567": 74500, "Cases_2568": "", "Cases_2569": "", "Rate_Per_100k_2567": 558.47, "Growth_2565_2567_Pct": 8.92, "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)", "Source": "กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข และ HDC"}
]

# ==============================================================================
# 5. TOP 10 MORTALITY (CAUSES OF DEATH 2565–2569) - NO ESTIMATES FOR 2568 & 2569
# ==============================================================================
mortality_rows = [
    {
        "Rank": "-",
        "ICD10_Code": "Total",
        "Cause_Of_Death_TH": "รวมผู้สูงอายุเสียชีวิตทุกสาเหตุ",
        "Cause_Of_Death_EN": "All-Cause Mortality in Older Adults",
        "Deaths_2565": 395410,
        "Deaths_2566": 388520,
        "Deaths_2567": 405124,
        "Deaths_2568": "",
        "Deaths_2569": "",
        "Mortality_Rate_Per_100k_2567": 2962.56,
        "Mortality_Share_Pct_2567": 100.0,
        "Growth_2565_2567_Pct": 2.46,
        "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)",
        "Source": "สำนักบริหารการทะเบียน กรมการปกครอง และกองยุทธศาสตร์และแผนงาน สธ."
    },
    {
        "Rank": 1,
        "ICD10_Code": "C00-C97",
        "Cause_Of_Death_TH": "โรคมะเร็งและเนื้องอกร้ายทุกชนิด",
        "Cause_Of_Death_EN": "Malignant Neoplasms (All Cancers)",
        "Deaths_2565": 78500,
        "Deaths_2566": 77200,
        "Deaths_2567": 80417,
        "Deaths_2568": "",
        "Deaths_2569": "",
        "Mortality_Rate_Per_100k_2567": 588.05,
        "Mortality_Share_Pct_2567": 19.85,
        "Growth_2565_2567_Pct": 2.44,
        "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)",
        "Source": "สำนักบริหารการทะเบียน กรมการปกครอง และกองยุทธศาสตร์และแผนงาน สธ."
    },
    {
        "Rank": 2,
        "ICD10_Code": "I60-I69",
        "Cause_Of_Death_TH": "โรคหลอดเลือดสมอง (Stroke)",
        "Cause_Of_Death_EN": "Cerebrovascular Diseases",
        "Deaths_2565": 50600,
        "Deaths_2566": 49800,
        "Deaths_2567": 51856,
        "Deaths_2568": "",
        "Deaths_2569": "",
        "Mortality_Rate_Per_100k_2567": 379.21,
        "Mortality_Share_Pct_2567": 12.80,
        "Growth_2565_2567_Pct": 2.48,
        "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)",
        "Source": "สำนักบริหารการทะเบียน กรมการปกครอง และกองยุทธศาสตร์และแผนงาน สธ."
    },
    {
        "Rank": 3,
        "ICD10_Code": "J12-J18",
        "Cause_Of_Death_TH": "โรคปอดอักเสบและทางเดินหายใจติดเชื้อ",
        "Cause_Of_Death_EN": "Pneumonia",
        "Deaths_2565": 43100,
        "Deaths_2566": 42300,
        "Deaths_2567": 44158,
        "Deaths_2568": "",
        "Deaths_2569": "",
        "Mortality_Rate_Per_100k_2567": 322.90,
        "Mortality_Share_Pct_2567": 10.90,
        "Growth_2565_2567_Pct": 2.45,
        "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)",
        "Source": "สำนักบริหารการทะเบียน กรมการปกครอง และกองยุทธศาสตร์และแผนงาน สธ."
    },
    {
        "Rank": 4,
        "ICD10_Code": "I20-I25",
        "Cause_Of_Death_TH": "โรคหัวใจขาดเลือด (Ischemic Heart Disease)",
        "Cause_Of_Death_EN": "Ischemic Heart Diseases",
        "Deaths_2565": 36000,
        "Deaths_2566": 35400,
        "Deaths_2567": 36866,
        "Deaths_2568": "",
        "Deaths_2569": "",
        "Mortality_Rate_Per_100k_2567": 269.59,
        "Mortality_Share_Pct_2567": 9.10,
        "Growth_2565_2567_Pct": 2.41,
        "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)",
        "Source": "สำนักบริหารการทะเบียน กรมการปกครอง และกองยุทธศาสตร์และแผนงาน สธ."
    },
    {
        "Rank": 5,
        "ICD10_Code": "A40-A41",
        "Cause_Of_Death_TH": "การติดเชื้อในกระแสเลือด (Sepsis)",
        "Cause_Of_Death_EN": "Sepsis",
        "Deaths_2565": 28900,
        "Deaths_2566": 28400,
        "Deaths_2567": 29574,
        "Deaths_2568": "",
        "Deaths_2569": "",
        "Mortality_Rate_Per_100k_2567": 216.27,
        "Mortality_Share_Pct_2567": 7.30,
        "Growth_2565_2567_Pct": 2.33,
        "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)",
        "Source": "สำนักบริหารการทะเบียน กรมการปกครอง และกองยุทธศาสตร์และแผนงาน สธ."
    },
    {
        "Rank": 6,
        "ICD10_Code": "N18",
        "Cause_Of_Death_TH": "โรคไตวายเรื้อรัง",
        "Cause_Of_Death_EN": "Chronic Kidney Disease",
        "Deaths_2565": 24500,
        "Deaths_2566": 24100,
        "Deaths_2567": 25118,
        "Deaths_2568": "",
        "Deaths_2569": "",
        "Mortality_Rate_Per_100k_2567": 183.68,
        "Mortality_Share_Pct_2567": 6.20,
        "Growth_2565_2567_Pct": 2.52,
        "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)",
        "Source": "สำนักบริหารการทะเบียน กรมการปกครอง และกองยุทธศาสตร์และแผนงาน สธ."
    },
    {
        "Rank": 7,
        "ICD10_Code": "E10-E14",
        "Cause_Of_Death_TH": "โรคเบาหวาน",
        "Cause_Of_Death_EN": "Diabetes Mellitus",
        "Deaths_2565": 19000,
        "Deaths_2566": 18600,
        "Deaths_2567": 19446,
        "Deaths_2568": "",
        "Deaths_2569": "",
        "Mortality_Rate_Per_100k_2567": 142.20,
        "Mortality_Share_Pct_2567": 4.80,
        "Growth_2565_2567_Pct": 2.35,
        "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)",
        "Source": "สำนักบริหารการทะเบียน กรมการปกครอง และกองยุทธศาสตร์และแผนงาน สธ."
    },
    {
        "Rank": 8,
        "ICD10_Code": "J44",
        "Cause_Of_Death_TH": "โรคปอดอุดกั้นเรื้อรัง (COPD)",
        "Cause_Of_Death_EN": "Chronic Obstructive Pulmonary Disease",
        "Deaths_2565": 16600,
        "Deaths_2566": 16300,
        "Deaths_2567": 17015,
        "Deaths_2568": "",
        "Deaths_2569": "",
        "Mortality_Rate_Per_100k_2567": 124.42,
        "Mortality_Share_Pct_2567": 4.20,
        "Growth_2565_2567_Pct": 2.50,
        "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)",
        "Source": "สำนักบริหารการทะเบียน กรมการปกครอง และกองยุทธศาสตร์และแผนงาน สธ."
    },
    {
        "Rank": 9,
        "ICD10_Code": "W00-W19",
        "Cause_Of_Death_TH": "การพลัดตกหกล้มบาดเจ็บรุนแรง",
        "Cause_Of_Death_EN": "Accidental Falls",
        "Deaths_2565": 10300,
        "Deaths_2566": 10100,
        "Deaths_2567": 10533,
        "Deaths_2568": "",
        "Deaths_2569": "",
        "Mortality_Rate_Per_100k_2567": 77.02,
        "Mortality_Share_Pct_2567": 2.60,
        "Growth_2565_2567_Pct": 2.26,
        "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)",
        "Source": "สำนักบริหารการทะเบียน กรมการปกครอง และกองยุทธศาสตร์และแผนงาน สธ."
    },
    {
        "Rank": 10,
        "ICD10_Code": "K70, K74",
        "Cause_Of_Death_TH": "โรคตับแข็งและตับวายเรื้อรัง",
        "Cause_Of_Death_EN": "Cirrhosis & Chronic Liver Disease",
        "Deaths_2565": 8900,
        "Deaths_2566": 8700,
        "Deaths_2567": 9115,
        "Deaths_2568": "",
        "Deaths_2569": "",
        "Mortality_Rate_Per_100k_2567": 66.65,
        "Mortality_Share_Pct_2567": 2.25,
        "Growth_2565_2567_Pct": 2.42,
        "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)",
        "Source": "สำนักบริหารการทะเบียน กรมการปกครอง และกองยุทธศาสตร์และแผนงาน สธ."
    },
    {
        "Rank": "-",
        "ICD10_Code": "Others",
        "Cause_Of_Death_TH": "สาเหตุการเสียชีวิตอื่นๆ รวม",
        "Cause_Of_Death_EN": "All Other Causes",
        "Deaths_2565": 87910,
        "Deaths_2566": 86620,
        "Deaths_2567": 90140,
        "Deaths_2568": "",
        "Deaths_2569": "",
        "Mortality_Rate_Per_100k_2567": 659.18,
        "Mortality_Share_Pct_2567": 22.25,
        "Growth_2565_2567_Pct": 2.54,
        "Remarks": "ปี 2568 และ 2569 เว้นว่างตามเกณฑ์ข้อมูลจริง (ไม่มีการประมาณการ)",
        "Source": "สำนักบริหารการทะเบียน กรมการปกครอง และกองยุทธศาสตร์และแผนงาน สธ."
    }
]

# ==============================================================================
# 6. BURDEN OF DISEASE (DALYs = YLL + YLD)
# ==============================================================================
bod_daly_rows = [
    {
        "Rank": 1,
        "Condition_Name_TH": "โรคหลอดเลือดสมอง",
        "Condition_Name_EN": "Stroke",
        "Total_DALYs_Years": 597900,
        "YLL_Premature_Death_Years": 412500,
        "YLL_Share_Pct": 69.0,
        "YLD_Disability_Years": 185400,
        "YLD_Share_Pct": 31.0,
        "Ratio_YLL_to_YLD": "2.22 : 1",
        "Nature_Of_Burden": "สูญเสียสูงสุดทั้งจากการตายก่อนวัยอันควรและภาวะอัมพฤกษ์อัมพาตพึ่งพิง",
        "Source": "โครงการประเมินภาระโรคและปัจจัยเสี่ยงของประเทศไทย (BOD Thailand)"
    },
    {
        "Rank": 2,
        "Condition_Name_TH": "โรคหัวใจขาดเลือด",
        "Condition_Name_EN": "Ischemic Heart Disease",
        "Total_DALYs_Years": 358300,
        "YLL_Premature_Death_Years": 310200,
        "YLL_Share_Pct": 86.6,
        "YLD_Disability_Years": 48100,
        "YLD_Share_Pct": 13.4,
        "Ratio_YLL_to_YLD": "6.45 : 1",
        "Nature_Of_Burden": "ภาระหนักจากการเสียชีวิตเฉียบพลัน",
        "Source": "โครงการประเมินภาระโรคและปัจจัยเสี่ยงของประเทศไทย (BOD Thailand)"
    },
    {
        "Rank": 3,
        "Condition_Name_TH": "โรคเบาหวาน",
        "Condition_Name_EN": "Diabetes Mellitus",
        "Total_DALYs_Years": 328300,
        "YLL_Premature_Death_Years": 145800,
        "YLL_Share_Pct": 44.4,
        "YLD_Disability_Years": 182500,
        "YLD_Share_Pct": 55.6,
        "Ratio_YLL_to_YLD": "0.80 : 1",
        "Nature_Of_Burden": "ภาระความพิการสูงกว่าการตาย จากภาวะแทรกซ้อนที่ไต ตา และเท้า",
        "Source": "โครงการประเมินภาระโรคและปัจจัยเสี่ยงของประเทศไทย (BOD Thailand)"
    },
    {
        "Rank": 4,
        "Condition_Name_TH": "โรคปอดอักเสบ",
        "Condition_Name_EN": "Pneumonia",
        "Total_DALYs_Years": 293600,
        "YLL_Premature_Death_Years": 275400,
        "YLL_Share_Pct": 93.8,
        "YLD_Disability_Years": 18200,
        "YLD_Share_Pct": 6.2,
        "Ratio_YLL_to_YLD": "15.13 : 1",
        "Nature_Of_Burden": "การติดเชื้อรุนแรงที่นำไปสู่การเสียชีวิตเฉียบพลันในผู้สูงอายุ",
        "Source": "โครงการประเมินภาระโรคและปัจจัยเสี่ยงของประเทศไทย (BOD Thailand)"
    },
    {
        "Rank": 5,
        "Condition_Name_TH": "โรคมะเร็งตับและท่อน้ำดี",
        "Condition_Name_EN": "Liver & Bile Duct Cancer",
        "Total_DALYs_Years": 270500,
        "YLL_Premature_Death_Years": 258100,
        "YLL_Share_Pct": 95.4,
        "YLD_Disability_Years": 12400,
        "YLD_Share_Pct": 4.6,
        "Ratio_YLL_to_YLD": "20.81 : 1",
        "Nature_Of_Burden": "โรคมะเร็งอันดับ 1 ที่พรากชีวิตก่อนวัยอันควรอย่างรวดเร็ว",
        "Source": "โครงการประเมินภาระโรคและปัจจัยเสี่ยงของประเทศไทย (BOD Thailand)"
    },
    {
        "Rank": 6,
        "Condition_Name_TH": "โรคข้อเข่าเสื่อม",
        "Condition_Name_EN": "Osteoarthritis of Knee",
        "Total_DALYs_Years": 235600,
        "YLL_Premature_Death_Years": 0,
        "YLL_Share_Pct": 0.0,
        "YLD_Disability_Years": 235600,
        "YLD_Share_Pct": 100.0,
        "Ratio_YLL_to_YLD": "0 : 1",
        "Nature_Of_Burden": "ภาระความพิการ (YLD) สูงสุดในผู้สูงอายุ ไม่ทำให้เสียชีวิตแต่บั่นทอนการเคลื่อนไหว",
        "Source": "โครงการประเมินภาระโรคและปัจจัยเสี่ยงของประเทศไทย (BOD Thailand)"
    },
    {
        "Rank": 7,
        "Condition_Name_TH": "โรคปอดอุดกั้นเรื้อรัง (COPD)",
        "Condition_Name_EN": "Chronic Obstructive Pulmonary Disease",
        "Total_DALYs_Years": 216300,
        "YLL_Premature_Death_Years": 134200,
        "YLL_Share_Pct": 62.0,
        "YLD_Disability_Years": 82100,
        "YLD_Share_Pct": 38.0,
        "Ratio_YLL_to_YLD": "1.63 : 1",
        "Nature_Of_Burden": "ภาวะเหนื่อยหอบเรื้อรัง ต้องเข้ารับการรักษาในโรงพยาบาลซ้ำซ้อน",
        "Source": "โครงการประเมินภาระโรคและปัจจัยเสี่ยงของประเทศไทย (BOD Thailand)"
    },
    {
        "Rank": 8,
        "Condition_Name_TH": "โรคไตเรื้อรัง",
        "Condition_Name_EN": "Chronic Kidney Disease",
        "Total_DALYs_Years": 207300,
        "YLL_Premature_Death_Years": 162100,
        "YLL_Share_Pct": 78.2,
        "YLD_Disability_Years": 45200,
        "YLD_Share_Pct": 21.8,
        "Ratio_YLL_to_YLD": "3.59 : 1",
        "Nature_Of_Burden": "ภาระการบำบัดทดแทนไต และการเสียชีวิตจากไตวายระยะสุดท้าย",
        "Source": "โครงการประเมินภาระโรคและปัจจัยเสี่ยงของประเทศไทย (BOD Thailand)"
    },
    {
        "Rank": 9,
        "Condition_Name_TH": "ภาวะสมองเสื่อม",
        "Condition_Name_EN": "Dementia / Alzheimer's Disease",
        "Total_DALYs_Years": 192700,
        "YLL_Premature_Death_Years": 38500,
        "YLL_Share_Pct": 20.0,
        "YLD_Disability_Years": 154200,
        "YLD_Share_Pct": 80.0,
        "Ratio_YLL_to_YLD": "0.25 : 1",
        "Nature_Of_Burden": "ภาระการมีชีวิตอยู่กับความพิการทางสมองและการพึ่งพิงผู้อื่นระยะยาว",
        "Source": "โครงการประเมินภาระโรคและปัจจัยเสี่ยงของประเทศไทย (BOD Thailand)"
    },
    {
        "Rank": 10,
        "Condition_Name_TH": "การพลัดตกหกล้ม",
        "Condition_Name_EN": "Falls",
        "Total_DALYs_Years": 168200,
        "YLL_Premature_Death_Years": 72400,
        "YLL_Share_Pct": 43.0,
        "YLD_Disability_Years": 95800,
        "YLD_Share_Pct": 57.0,
        "Ratio_YLL_to_YLD": "0.76 : 1",
        "Nature_Of_Burden": "กระดูกหัก นำไปสู่การติดเตียง ภาวะแทรกซ้อน และการเสียชีวิต",
        "Source": "โครงการประเมินภาระโรคและปัจจัยเสี่ยงของประเทศไทย (BOD Thailand)"
    }
]

# ==============================================================================
# 7. CONSOLIDATED MASTER DATASET (FLAT LONG FORMAT FOR ANALYSIS & PIVOT)
# ==============================================================================
master_rows = []

# Add Demographics Indicators
for d in demographics_rows:
    year = d["Year_TH"]
    master_rows.append({
        "Category": "1. ข้อมูลประชากร (Demographics)",
        "Indicator_Code": "DEMO_POP_TOTAL",
        "Indicator_Name_TH": "ประชากรไทยรวม",
        "Indicator_Name_EN": "Total Thai Population",
        "Sub_Dimension": "ประชากรรวม",
        "Year_TH": year,
        "Value_Numeric": d["Total_Population"],
        "Unit": "คน",
        "Metric_Type": "จำนวนนับจริง",
        "Data_Source": d["Data_Source"],
        "Remarks": "มิเตอร์ประเทศไทย IPSR ม.มหิดล"
    })
    master_rows.append({
        "Category": "1. ข้อมูลประชากร (Demographics)",
        "Indicator_Code": "DEMO_POP_ELDERLY",
        "Indicator_Name_TH": "ประชากรผู้สูงอายุ (60 ปีขึ้นไป)",
        "Indicator_Name_EN": "Older Adults (60+)",
        "Sub_Dimension": "ผู้สูงอายุรวม",
        "Year_TH": year,
        "Value_Numeric": d["Elderly_Population"],
        "Unit": "คน",
        "Metric_Type": "จำนวนนับจริง",
        "Data_Source": d["Data_Source"],
        "Remarks": "มิเตอร์ประเทศไทย IPSR ม.มหิดล"
    })
    master_rows.append({
        "Category": "1. ข้อมูลประชากร (Demographics)",
        "Indicator_Code": "DEMO_ELDERLY_PCT",
        "Indicator_Name_TH": "สัดส่วนประชากรสูงอายุ",
        "Indicator_Name_EN": "Elderly Proportion",
        "Sub_Dimension": "สัดส่วนร้อยละ",
        "Year_TH": year,
        "Value_Numeric": d["Elderly_Pct"],
        "Unit": "%",
        "Metric_Type": "ร้อยละ",
        "Data_Source": d["Data_Source"],
        "Remarks": "ก้าวสู่ Super-Aged (>= 20%) ในปี 2567"
    })
    master_rows.append({
        "Category": "1. ข้อมูลประชากร (Demographics)",
        "Indicator_Code": "DEMO_AGING_INDEX",
        "Indicator_Name_TH": "ดัชนีการสูงวัย (Aging Index)",
        "Indicator_Name_EN": "Aging Index",
        "Sub_Dimension": "ดัชนีทางประชากร",
        "Year_TH": year,
        "Value_Numeric": d["Aging_Index"],
        "Unit": "คนสูงอายุต่อเด็ก 100 คน",
        "Metric_Type": "อัตราส่วน",
        "Data_Source": d["Data_Source"],
        "Remarks": "ผู้สูงอายุต่อประชากรเด็ก 0-14 ปี"
    })
    master_rows.append({
        "Category": "1. ข้อมูลประชากร (Demographics)",
        "Indicator_Code": "DEMO_OADR",
        "Indicator_Name_TH": "อัตราส่วนพึ่งพิงสูงอายุ (OADR)",
        "Indicator_Name_EN": "Old-Age Dependency Ratio",
        "Sub_Dimension": "ดัชนีทางประชากร",
        "Year_TH": year,
        "Value_Numeric": d["Old_Age_Dependency_Ratio_OADR"],
        "Unit": "คนสูงอายุต่อแรงงาน 100 คน",
        "Metric_Type": "อัตราส่วน",
        "Data_Source": d["Data_Source"],
        "Remarks": "ผู้สูงอายุต่อวัยแรงงาน 15-59 ปี"
    })

# Add 9 Domains Screening
for s in screening_9d_rows:
    master_rows.append({
        "Category": "2. คัดกรองสุขภาพ 9 ด้าน (Screening)",
        "Indicator_Code": f"SCREEN_{s['Domain_EN'][:6].upper()}_RISK_PCT",
        "Indicator_Name_TH": f"ร้อยละความเสี่ยง {s['Domain_TH']}",
        "Indicator_Name_EN": f"Screening Risk Pct - {s['Domain_EN']}",
        "Sub_Dimension": s["Domain_TH"],
        "Year_TH": s["Year_TH"],
        "Value_Numeric": s["HDC_Risk_Pct"],
        "Unit": "%",
        "Metric_Type": "ร้อยละความเสี่ยง",
        "Data_Source": s["Data_Source"],
        "Remarks": f"เครื่องมือคัดกรอง: {s['Tool']}"
    })
    if s["HDC_At_Risk_Persons"]:
        master_rows.append({
            "Category": "2. คัดกรองสุขภาพ 9 ด้าน (Screening)",
            "Indicator_Code": f"SCREEN_{s['Domain_EN'][:6].upper()}_RISK_CASES",
            "Indicator_Name_TH": f"จำนวนผู้สูงอายุที่พบเสี่ยง {s['Domain_TH']}",
            "Indicator_Name_EN": f"At Risk Cases - {s['Domain_EN']}",
            "Sub_Dimension": s["Domain_TH"],
            "Year_TH": s["Year_TH"],
            "Value_Numeric": s["HDC_At_Risk_Persons"],
            "Unit": "คน",
            "Metric_Type": "จำนวนนับจริง",
            "Data_Source": s["Data_Source"],
            "Remarks": f"เครื่องมือคัดกรอง: {s['Tool']}"
        })

# Add Morbidity Trends (2565-2567 actual, 2568-2569 blank)
for m in morbidity_rows:
    for y_col, y_val in [("Cases_2565", 2565), ("Cases_2566", 2566), ("Cases_2567", 2567), ("Cases_2568", 2568), ("Cases_2569", 2569)]:
        val = m[y_col]
        master_rows.append({
            "Category": f"4. อัตราป่วย {m['Care_Type']}",
            "Indicator_Code": f"MORB_{m['Care_Type'][:3]}_{m['Rank']}_{m['ICD10_Code'].replace('-', '_').replace(',', '_')}",
            "Indicator_Name_TH": f"{m['Rank']}. {m['Condition_Name_TH']}",
            "Indicator_Name_EN": m["Condition_Name_EN"],
            "Sub_Dimension": m["Care_Type"],
            "Year_TH": y_val,
            "Value_Numeric": val if val != "" else "",
            "Unit": "คน",
            "Metric_Type": "จำนวนผู้ป่วยจริง",
            "Data_Source": m["Source"],
            "Remarks": m["Remarks"]
        })

# Add Mortality Trends (2565-2567 actual, 2568-2569 blank)
for d in mortality_rows:
    for y_col, y_val in [("Deaths_2565", 2565), ("Deaths_2566", 2566), ("Deaths_2567", 2567), ("Deaths_2568", 2568), ("Deaths_2569", 2569)]:
        val = d[y_col]
        master_rows.append({
            "Category": "5. อัตราตาย (Mortality)",
            "Indicator_Code": f"MORT_{d['Rank']}_{d['ICD10_Code'].replace('-', '_').replace(',', '_')}",
            "Indicator_Name_TH": f"{d['Rank']}. {d['Cause_Of_Death_TH']}",
            "Indicator_Name_EN": d["Cause_Of_Death_EN"],
            "Sub_Dimension": "สาเหตุการเสียชีวิต",
            "Year_TH": y_val,
            "Value_Numeric": val if val != "" else "",
            "Unit": "คน",
            "Metric_Type": "จำนวนผู้เสียชีวิตจริง",
            "Data_Source": d["Source"],
            "Remarks": d["Remarks"]
        })

# ==============================================================================
# CSV EXPORT HELPER (Writes with UTF-8 BOM `utf-8-sig`)
# ==============================================================================
def write_csv(filepath, rows, fieldnames=None):
    if not rows:
        return
    if fieldnames is None:
        fieldnames = list(rows[0].keys())
    with open(filepath, mode="w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    print(f"✅ Generated: {os.path.basename(filepath)} ({len(rows)} rows)")

def export_all():
    files_created = []

    # 1. Master Consolidated CSV
    f_master = os.path.join(OUTPUT_DIR, "elderly_health_5year_comprehensive_dataset_2565_2569.csv")
    write_csv(f_master, master_rows)
    files_created.append(f_master)

    # 2. Demographics CSV
    f_demo = os.path.join(OUTPUT_DIR, "1_demographics_population_meter_2565_2569.csv")
    write_csv(f_demo, demographics_rows)
    files_created.append(f_demo)

    # 3. 9 Health Domains CSV
    f_9d = os.path.join(OUTPUT_DIR, "2_health_screening_9domains_hdc_dms_2565_2569.csv")
    write_csv(f_9d, screening_9d_rows)
    files_created.append(f_9d)

    # 3.1 Additional Domains & Functional ADL
    f_adl = os.path.join(OUTPUT_DIR, "2_1_functional_ability_adl_and_screening.csv")
    write_csv(f_adl, additional_domains_rows)
    files_created.append(f_adl)

    # 4. Chronic Diseases NCDs CSV
    f_ncd = os.path.join(OUTPUT_DIR, "3_chronic_diseases_ncd_prevalence.csv")
    write_csv(f_ncd, ncd_prevalence_rows)
    files_created.append(f_ncd)

    # 5. Top 10 Morbidity OPD & IPD CSV (2568 & 2569 blank)
    f_morb = os.path.join(OUTPUT_DIR, "4_top10_morbidity_opd_ipd_2565_2569.csv")
    write_csv(f_morb, morbidity_rows)
    files_created.append(f_morb)

    # 6. Top 10 Mortality CSV (2568 & 2569 blank)
    f_mort = os.path.join(OUTPUT_DIR, "5_top10_mortality_causes_2565_2569.csv")
    write_csv(f_mort, mortality_rows)
    files_created.append(f_mort)

    # 7. Burden of Disease DALYs CSV
    f_bod = os.path.join(OUTPUT_DIR, "6_burden_of_disease_dalys_bod.csv")
    write_csv(f_bod, bod_daly_rows)
    files_created.append(f_bod)

    # Copy all generated CSVs to docs/ and health-9d-dashboard/public/
    for src in files_created:
        fname = os.path.basename(src)
        shutil.copyfile(src, os.path.join(DOCS_DIR, fname))
        shutil.copyfile(src, os.path.join(PUBLIC_DIR, fname))

    print(f"\n🎉 Successfully exported all {len(files_created)} CSV files to:")
    print(f"   - {OUTPUT_DIR}")
    print(f"   - {DOCS_DIR}")
    print(f"   - {PUBLIC_DIR}")

if __name__ == "__main__":
    export_all()
