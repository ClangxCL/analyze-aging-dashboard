import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('dms_parsed_years.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

col_names = [
    'zone',
    'fall_advise_person', 'fall_advise_count',
    'fall_refer_person', 'fall_refer_count',
    'fall_careplan_person', 'fall_careplan_count',
    'amt_advise_person', 'amt_advise_count',
    'amt_refer_person', 'amt_refer_count',
    'mmse_advise_person', 'mmse_advise_count',
    'mmse_refer_person', 'mmse_refer_count',
    'oral_abnormal_person', 'oral_abnormal_count',
    'oral_careplan_person', 'oral_careplan_count',
    'oral_program_person', 'oral_program_count'
]

summary_by_year = {}

for y, zones in data.items():
    if not zones:
        summary_by_year[y] = None
        continue
    totals = {c: 0 for c in col_names[1:]}
    for z in zones:
        for idx, col in enumerate(col_names[1:], start=1):
            val = int(z[idx]) if z[idx].isdigit() else 0
            totals[col] += val
    summary_by_year[y] = totals

for y, t in summary_by_year.items():
    print(f"=== YEAR {y} ===")
    if t is None:
        print("  No data recorded in database / 0 records")
        continue
    # Falls
    fall_total_person = t['fall_advise_person'] + t['fall_refer_person'] + t['fall_careplan_person']
    fall_total_count = t['fall_advise_count'] + t['fall_refer_count'] + t['fall_careplan_count']
    print("  FALLS (ภาวะหกล้ม):")
    print(f"    ให้คำแนะนำ/รักษา: {t['fall_advise_person']:,} คน ({t['fall_advise_count']:,} ครั้ง)")
    print(f"    ส่งรักษาต่อ: {t['fall_refer_person']:,} คน ({t['fall_refer_count']:,} ครั้ง)")
    print(f"    จัดทำ Care Plan: {t['fall_careplan_person']:,} คน ({t['fall_careplan_count']:,} ครั้ง)")
    print(f"    รวมประเมินเสี่ยงหกล้ม: {fall_total_person:,} คน ({fall_total_count:,} ครั้ง)")
    
    # Dementia
    amt_person = t['amt_advise_person'] + t['amt_refer_person']
    amt_count = t['amt_advise_count'] + t['amt_refer_count']
    mmse_person = t['mmse_advise_person'] + t['mmse_refer_person']
    mmse_count = t['mmse_advise_count'] + t['mmse_refer_count']
    dem_total_person = amt_person + mmse_person
    dem_total_count = amt_count + mmse_count
    print("  DEMENTIA (สมองเสื่อม):")
    print(f"    AMT ผิดปกติ (แนะนำ/รักษา): {t['amt_advise_person']:,} คน ({t['amt_advise_count']:,} ครั้ง)")
    print(f"    AMT ผิดปกติ (ส่งรักษาต่อ): {t['amt_refer_person']:,} คน ({t['amt_refer_count']:,} ครั้ง)")
    print(f"    MMSE ผิดปกติ (แนะนำ/รักษา): {t['mmse_advise_person']:,} คน ({t['mmse_advise_count']:,} ครั้ง)")
    print(f"    MMSE ผิดปกติ (ส่งรักษาต่อ): {t['mmse_refer_person']:,} คน ({t['mmse_refer_count']:,} ครั้ง)")
    print(f"    รวมประเมินผิดปกติสมองเสื่อม: {dem_total_person:,} คน ({dem_total_count:,} ครั้ง)")
    
    # Oral
    oral_total_person = t['oral_abnormal_person'] + t['oral_careplan_person'] + t['oral_program_person']
    oral_total_count = t['oral_abnormal_count'] + t['oral_careplan_count'] + t['oral_program_count']
    print("  ORAL (ช่องปาก):")
    print(f"    พบผิดปกติ: {t['oral_abnormal_person']:,} คน ({t['oral_abnormal_count']:,} ครั้ง)")
    print(f"    จัดทำ Care Plan: {t['oral_careplan_person']:,} คน ({t['oral_careplan_count']:,} ครั้ง)")
    print(f"    Care Plan + โปรแกรม: {t['oral_program_person']:,} คน ({t['oral_program_count']:,} ครั้ง)")
    print(f"    รวมประเมินผิดปกติช่องปาก: {oral_total_person:,} คน ({oral_total_count:,} ครั้ง)")

with open('dms_summary_totals.json', 'w', encoding='utf-8') as f:
    json.dump(summary_by_year, f, ensure_ascii=False, indent=2)
