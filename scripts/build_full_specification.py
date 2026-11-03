import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def build_documents():
    doc = docx.Document()

    # Set Margins
    for s in doc.sections:
        s.top_margin = Inches(0.8)
        s.bottom_margin = Inches(0.8)
        s.left_margin = Inches(0.8)
        s.right_margin = Inches(0.8)

    md_lines = []

    def log_md(line=""):
        md_lines.append(line)

    def set_cell_background(cell, fill_hex):
        tcPr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
        tcPr.append(shd)

    def set_cell_margins(cell, top=70, bottom=70, left=100, right=100):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
        tcPr.append(tcMar)

    def create_table(headers, data, col_widths=None, header_bg="1A365D", alt_bg="F8FAFC"):
        table = doc.add_table(rows=len(data) + 1, cols=len(headers))
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False

        # Header Row
        hdr_cells = table.rows[0].cells
        for i, title in enumerate(headers):
            hdr_cells[i].text = title
            set_cell_background(hdr_cells[i], header_bg)
            set_cell_margins(hdr_cells[i], top=90, bottom=90, left=100, right=100)
            p = hdr_cells[i].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in p.runs:
                run.font.bold = True
                run.font.color.rgb = RGBColor(255, 255, 255)
                run.font.size = Pt(9.5)
                run.font.name = 'TH Sarabun New'

        # Data Rows
        for row_idx, row_data in enumerate(data):
            row_cells = table.rows[row_idx + 1].cells
            bg_color = alt_bg if row_idx % 2 == 1 else "FFFFFF"
            for col_idx, text in enumerate(row_data):
                row_cells[col_idx].text = str(text)
                set_cell_background(row_cells[col_idx], bg_color)
                set_cell_margins(row_cells[col_idx], top=50, bottom=50, left=80, right=80)
                p = row_cells[col_idx].paragraphs[0]
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                for run in p.runs:
                    run.font.size = Pt(9)
                    run.font.name = 'TH Sarabun New'

        if col_widths:
            for row in table.rows:
                for idx, width in enumerate(col_widths):
                    row.cells[idx].width = Inches(width)

        doc.add_paragraph()

        # Markdown representation
        md_table_hdr = "| " + " | ".join(headers) + " |"
        md_table_sep = "| " + " | ".join(["---"] * len(headers)) + " |"
        log_md(md_table_hdr)
        log_md(md_table_sep)
        for row_data in data:
            log_md("| " + " | ".join(str(c).replace("\n", "<br>") for c in row_data) + " |")
        log_md("")

    def add_h(text, level=1):
        h = doc.add_heading(text, level=level)
        h.paragraph_format.space_before = Pt(12)
        h.paragraph_format.space_after = Pt(3)
        run = h.runs[0]
        run.font.name = 'TH Sarabun New'
        if level == 1:
            run.font.size = Pt(16)
            run.font.bold = True
            run.font.color.rgb = RGBColor(26, 54, 93)
            log_md(f"\n# {text}\n")
        elif level == 2:
            run.font.size = Pt(13)
            run.font.bold = True
            run.font.color.rgb = RGBColor(43, 108, 176)
            log_md(f"\n## {text}\n")
        elif level == 3:
            run.font.size = Pt(11)
            run.font.bold = True
            run.font.color.rgb = RGBColor(45, 55, 72)
            log_md(f"\n### {text}\n")
        return h

    def add_p(text, bold=False, italic=False, color=None):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        run = p.add_run(text)
        run.font.name = 'TH Sarabun New'
        run.font.size = Pt(10.5)
        run.font.bold = bold
        run.font.italic = italic
        if color:
            run.font.color.rgb = color
        log_md(text)
        return p

    def add_sql(code_text):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        set_cell_background(cell, "EDF2F7")
        set_cell_margins(cell, top=70, bottom=70, left=100, right=100)
        
        cp = cell.paragraphs[0]
        cp.paragraph_format.space_before = Pt(2)
        cp.paragraph_format.space_after = Pt(2)
        run = cp.add_run(code_text)
        run.font.name = 'Consolas'
        run.font.size = Pt(8.5)
        run.font.color.rgb = RGBColor(45, 55, 72)
        doc.add_paragraph()

        log_md("```sql\n" + code_text + "\n```\n")

    # Cover Title
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(20)
    title_p.paragraph_format.space_after = Pt(4)
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    trun = title_p.add_run("คู่มือมาตรฐานชุดข้อมูลสุขภาพผู้สูงอายุ (Elderly Health Data Set)\nโครงสร้างฟิลด์จาก 43 แฟ้ม รหัสมาตรฐาน และเงื่อนไขการประมวลผล (Conditions)")
    trun.font.name = 'TH Sarabun New'
    trun.font.size = Pt(18)
    trun.font.bold = True
    trun.font.color.rgb = RGBColor(26, 54, 93)

    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_before = Pt(0)
    sub_p.paragraph_format.space_after = Pt(16)
    sub_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    srun = sub_p.add_run("กลุ่มงานสารสนเทศระบบสุขภาพด้านผู้สูงอายุ สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ กรมการแพทย์\nเชื่อมโยงระบบ 43 แฟ้มมาตรฐานกระทรวงสาธารณสุข และระบบ DMS Care Tools")
    srun.font.name = 'TH Sarabun New'
    srun.font.size = Pt(12)
    srun.font.italic = True
    srun.font.color.rgb = RGBColor(74, 85, 104)

    log_md("# คู่มือมาตรฐานชุดข้อมูลสุขภาพผู้สูงอายุ (Elderly Health Data Set Specification)")
    log_md("### โครงสร้างฟิลด์จาก 43 แฟ้ม รหัสมาตรฐานสากล และเงื่อนไขการประมวลผล (Conditions & Business Rules)")
    log_md("**กลุ่มงานสารสนเทศระบบสุขภาพด้านผู้สูงอายุ สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ กรมการแพทย์**\n")

    # Section 0: Executive Revisions
    add_h("สรุปผลการตรวจสอบ ปรับปรุง และแก้ไขชุดข้อมูล (Executive Revision Notes)", level=1)
    add_p("1. การตรวจสอบและปรับแก้รหัสที่คลาดเคลื่อน: ปรับแก้รหัส E162 ในเอกสารเดิมที่ระบุเป็นเบาหวานชนิดที่ 2 ซึ่งตามมาตรฐาน ICD-10 สากลและ ICD-10-TM รหัส E16.2 คือ Hypoglycaemia, unspecified (ภาวะน้ำตาลในเลือดต่ำ) ส่วนโรคเบาหวานชนิดที่ 2 คือกลุ่มรหัส E11 (E11.0 – E11.9)")
    add_p("2. การจัดระบบรหัส Dagger & Asterisk (+/*): จัดคู่รหัสสาเหตุและอาการแสดงในกลุ่มสมรรถภาพสมองให้ถูกต้อง เช่น F00.0 คู่กับ G30.0*, F02.0 คู่กับ G31.0*, F02.3 คู่กับ G20*")
    add_p("3. การบรรจุรหัสที่ขอเพิ่มเติมเข้าสู่ระบบอย่างครบถ้วน:")
    add_p("   • Stroke (ICD-10: I60 – I69): ครอบคลุมระยะเฉียบพลัน (I60-I64) และระยะเรื้อรัง/ผลตกค้าง (I65-I69)")
    add_p("   • STEMI (ICD-10: I21.0 – I21.3): กล้ามเนื้อหัวใจตายเฉียบพลันชนิด ST-elevation จำแนกตามผนังหัวใจ")
    add_p("   • Fall (ICD-10: W00 – W19): สาเหตุภายนอกของการหกล้ม กำหนดให้บันทึกใน DIAGTYPE = '5'")
    add_p("   • Hip Fracture (ICD-10: S72, S72.0 – S72.9): กระดูกสะโพกหักจากการล้ม กำหนดให้บันทึกใน DIAGTYPE = '1'")
    add_p("4. การเพิ่มส่วนเงื่อนไข (Conditions & Business Rules) ครบทั้ง 16 หมวด พร้อมระบุโครงสร้างฟิลด์ 43 แฟ้ม ชนิดข้อมูล และการนำไปใช้งาน")

    # Section 1: Demographics
    add_h("หมวดที่ 1: ข้อมูลทั่วไปของผู้สูงอายุ (Demographics & Base Population)", level=1)
    add_p("วัตถุประสงค์: สกัดฐานประชากรผู้สูงอายุที่มีชีวิตและอยู่ในเขตพื้นที่รับผิดชอบ เพื่อเป็นฐานคำนวณ (Denominator) สำหรับทุกกลุ่มอาการ")
    
    add_h("ตารางโครงสร้างฟิลด์จาก 43 แฟ้มที่เกี่ยวข้อง (หมวดที่ 1)", level=2)
    create_table(
        ["แฟ้ม", "ชื่อฟิลด์", "ชนิดข้อมูล", "คำอธิบายฟิลด์", "การนำไปใช้ใน Condition / กฎการประมวลผล"],
        [
            ["PERSON", "HOSPCODE", "VARCHAR(5)", "รหัสสถานพยาบาล 5 หลัก", "ใช้เชื่อมโยงกับแฟ้มอื่นภายในสถานบริการ"],
            ["PERSON", "CID", "VARCHAR(13)", "เลขบัตรประชาชน 13 หลัก", "ใช้ตัดคนซ้ำ (Deduplication) ข้ามสถานบริการ และ Join กับแฟ้ม DEATH"],
            ["PERSON", "PID", "VARCHAR(15)", "ทะเบียนบุคคลในสถานบริการ", "ใช้เชื่อมโยงข้อมูลภายในสถานพยาบาลเดียวกัน"],
            ["PERSON", "HID", "VARCHAR(14)", "รหัสบ้าน", "ใช้เชื่อมโยงกับแฟ้ม HOME เพื่อดึงที่อยู่"],
            ["PERSON", "PRENAME", "VARCHAR(20)", "คำนำหน้าชื่อ", "ข้อมูลทั่วไป"],
            ["PERSON", "NAME", "VARCHAR(50)", "ชื่อผู้สูงอายุ", "ข้อมูลทั่วไป"],
            ["PERSON", "LNAME", "VARCHAR(50)", "นามสกุล", "ข้อมูลทั่วไป"],
            ["PERSON", "SEX", "VARCHAR(1)", "เพศ (1=ชาย, 2=หญิง)", "ใช้จำแนกประชากรตามเพศ"],
            ["PERSON", "BIRTH", "DATE", "วันเดือนปีเกิด (YYYY-MM-DD)", "เงื่อนไข: TIMESTAMPDIFF(YEAR, BIRTH, :eval_date) >= 60"],
            ["PERSON", "TYPEAREA", "VARCHAR(1)", "สถานะบุคคลในเขตรับผิดชอบ", "เงื่อนไข: TYPEAREA IN ('1', '3') (1=ในเขตตัวอยู่, 3=นอกเขตตัวอยู่)"],
            ["PERSON", "DISCHARGE", "VARCHAR(1)", "สถานะการจำหน่ายบุคคล", "เงื่อนไข: DISCHARGE = '9' (ยังอยู่/มีชีวิต) และตัด DISCHARGE = '1' (ตาย) ออก"],
            ["PERSON", "D_UPDATE", "DATETIME", "วันเวลาที่ปรับปรุงข้อมูลล่าสุด", "ใช้เรียงลำดับเลือกเรคอร์ดล่าสุดในการตัดคนซ้ำ"],
            ["HOME", "HID", "VARCHAR(14)", "รหัสบ้าน", "เชื่อมโยงกับ PERSON.HID"],
            ["HOME", "HOUSE_ID", "VARCHAR(11)", "รหัสบ้านตามกรมการปกครอง", "การอ้างอิงเชิงพื้นที่"],
            ["HOME", "HOUSE", "VARCHAR(75)", "บ้านเลขที่", "ที่อยู่ของผู้สูงอายุ"],
            ["HOME", "VILLAGE", "VARCHAR(2)", "หมู่ที่", "วิเคราะห์เชิงพื้นที่ระดับหมู่บ้าน"],
            ["HOME", "TAMBON", "VARCHAR(2)", "รหัสตำบล", "วิเคราะห์ระดับตำบล"],
            ["HOME", "AMPUR", "VARCHAR(2)", "รหัสอำเภอ", "วิเคราะห์ระดับอำเภอ"],
            ["HOME", "CHANGWAT", "VARCHAR(2)", "รหัสจังหวัด", "วิเคราะห์ระดับจังหวัด"],
            ["DEATH", "CID", "VARCHAR(13)", "เลขบัตรประชาชนผู้เสียชีวิต", "เงื่อนไข: ตัด CID ที่ปรากฏในแฟ้ม DEATH ออกจากกลุ่มเป้าหมาย"],
            ["DEATH", "DDEATH", "DATE", "วันที่เสียชีวิต", "เงื่อนไข: DDEATH <= :eval_date ถือว่าเสียชีวิตแล้ว"],
            ["DEATH", "CDEATH", "VARCHAR(6)", "สาเหตุการเสียชีวิต (ICD-10)", "ใช้วิเคราะห์สาเหตุการตายของผู้สูงอายุ"]
        ],
        col_widths=[1.0, 1.2, 1.1, 1.8, 1.9]
    )

    add_h("เงื่อนไขการประมวลผล (Conditions)", level=2)
    add_p("1. เกณฑ์อายุ: คำนวณอายุ ณ วันที่ประมวลผล หรือวันสิ้นปีงบประมาณ ต้องมีอายุตั้งแต่ 60 ปีบริบูรณ์ขึ้นไป")
    add_p("2. สถานะมีชีวิต: ต้องมีสถานะ DISCHARGE = '9' ในแฟ้ม PERSON และไม่มีประวัติในแฟ้ม DEATH (หรือวันที่ตายหลังวันประมวลผล)")
    add_p("3. พื้นที่รับผิดชอบ: กำหนด TYPEAREA IN ('1', '3')")
    add_p("4. การกำจัดคนซ้ำ: Group by CID 13 หลัก เลือกข้อมูล D_UPDATE ล่าสุด")

    add_h("ตัวอย่างคำสั่ง SQL (หมวดที่ 1)", level=2)
    add_sql("""SELECT 
    p.HOSPCODE, p.CID, p.PID, p.PRENAME, p.NAME, p.LNAME, p.SEX, p.BIRTH,
    TIMESTAMPDIFF(YEAR, p.BIRTH, '2026-09-30') AS AGE_YEAR,
    p.TYPEAREA, h.HOUSE, h.VILLAGE, h.TAMBON, h.AMPUR, h.CHANGWAT
FROM person p
LEFT JOIN home h ON p.HOSPCODE = h.HOSPCODE AND p.HID = h.HID
LEFT JOIN death d ON p.CID = d.CID
WHERE TIMESTAMPDIFF(YEAR, p.BIRTH, '2026-09-30') >= 60
  AND p.DISCHARGE = '9'
  AND (d.CID IS NULL OR d.DDEATH > '2026-09-30')
  AND p.TYPEAREA IN ('1', '3');""")

    # Section 2: Diabetes Mellitus
    add_h("หมวดที่ 2: Data Set เรื่องโรคเบาหวาน (Diabetes Mellitus - DM)", level=1)
    add_p("วัตถุประสงค์: ติดตามการคัดกรองเบาหวานในประชากรสูงอายุ การขึ้นทะเบียนผู้ป่วย และการเฝ้าระวังภาวะแทรกซ้อนที่เท้าและจอประสาทตา")

    add_h("ตารางโครงสร้างฟิลด์จาก 43 แฟ้มที่เกี่ยวข้อง (หมวดที่ 2)", level=2)
    create_table(
        ["แฟ้ม", "ชื่อฟิลด์", "ชนิดข้อมูล", "คำอธิบายฟิลด์", "การนำไปใช้ใน Condition / กฎการประมวลผล"],
        [
            ["NCDSCREEN", "PID", "VARCHAR(15)", "ทะเบียนบุคคล", "เชื่อมกับ PERSON"],
            ["NCDSCREEN", "DATE_SERV", "DATE", "วันที่รับบริการคัดกรอง", "เงื่อนไข: ตรวจสอบในปีงบประมาณที่ประเมิน"],
            ["NCDSCREEN", "BSLEVEL", "DECIMAL(4,0)", "ระดับน้ำตาลในเลือด (mg/dL)", "เงื่อนไข: Fasting >= 126 หรือ Random >= 200 สงสัยเบาหวาน"],
            ["NCDSCREEN", "BSTEST", "VARCHAR(1)", "วิธีการเจาะน้ำตาล", "1=Fasting Blood Sugar (FBS), 2=Random Blood Sugar (RBS)"],
            ["NCDSCREEN", "WEIGHT", "DECIMAL(5,1)", "น้ำหนักตัว (กก.)", "ใช้คำนวณดัชนีมวลกาย (BMI)"],
            ["NCDSCREEN", "HEIGHT", "DECIMAL(3,0)", "ส่วนสูง (ซม.)", "ใช้คำนวณดัชนีมวลกาย (BMI)"],
            ["NCDSCREEN", "WAIST_CM", "DECIMAL(3,0)", "รอบเอว (ซม.)", "เกณฑ์อ้วนลงพุง (ชาย >= 90 ซม., หญิง >= 80 ซม.)"],
            ["CHRONIC", "CHRONIC", "VARCHAR(6)", "รหัสโรคเรื้อรัง (ICD-10)", "เงื่อนไข: SUBSTRING(CHRONIC,1,3) IN ('E10','E11','E12','E13','E14')"],
            ["CHRONIC", "DATE_DIAG", "DATE", "วันที่วินิจฉัยโรคครั้งแรก", "วันที่ผู้ป่วยขึ้นทะเบียนโรคเรื้อรัง"],
            ["CHRONIC_FU", "FOOT", "VARCHAR(1)", "การตรวจเท้า", "1=ปกติ, 2=เสี่ยง, 3=มีแผล (เงื่อนไข: ตรวจอย่างน้อยปีละ 1 ครั้ง)"],
            ["CHRONIC_FU", "RETINA", "VARCHAR(1)", "การตรวจตา/จอประสาทตา", "1=ปกติ, 2=พบเบาหวานขึ้นตา, 3=ส่งต่อ (เงื่อนไข: ตรวจอย่างน้อยปีละ 1 ครั้ง)"],
            ["DIAGNOSIS_OPD", "DIAGCODE", "VARCHAR(6)", "รหัสวินิจฉัยโรค ICD-10", "E10-E14 ครอบคลุมภาวะแทรกซ้อน .0 ถึง .9"],
            ["DIAGNOSIS_OPD", "DIAGTYPE", "VARCHAR(1)", "ประเภทการวินิจฉัย", "เงื่อนไข: DIAGTYPE IN ('1', '2') อย่างน้อย 2 ครั้งในปีงบประมาณ"]
        ],
        col_widths=[1.1, 1.1, 1.1, 1.8, 1.9]
    )

    add_h("ชุดรหัสมาตรฐานและเงื่อนไข (หมวดที่ 2)", level=2)
    add_p("• รหัส ICD-10 เบาหวาน:")
    add_p("   - E10 (Type 1 DM: พึ่งอินซูลิน), E11 (Type 2 DM: ไม่พึ่งอินซูลิน) [แก้ไขจาก E162]")
    add_p("   - E12 (Malnutrition DM), E13 (Other specified DM), E14 (Unspecified DM)")
    add_p("   - รหัสย่อยภาวะแทรกซ้อน: .0 (Coma), .1 (Ketoacidosis), .2 (Renal), .3 (Eye), .4 (Neuro), .5 (Circulatory), .7 (Multiple), .9 (No complications)")
    add_p("• เงื่อนไขสงสัยเบาหวาน: NCDSCREEN.BSTEST = '1' AND NCDSCREEN.BSLEVEL >= 126 หรือ BSTEST = '2' AND BSLEVEL >= 200")
    add_p("• เงื่อนไขผู้ป่วยยืนยัน: บันทึกใน CHRONIC (E10-E14) หรือมี DIAGNOSIS_OPD รหัส E10-E14 (DIAGTYPE 1 หรือ 2) อย่างน้อย 2 ครั้ง")

    # Section 3: Hypertension
    add_h("หมวดที่ 3: Data Set เรื่องโรคความดันโลหิตสูง (Hypertension - HT)", level=1)
    add_p("วัตถุประสงค์: ติดตามการคัดกรองความดันโลหิต การขึ้นทะเบียนผู้ป่วย และการควบคุมระดับความดันโลหิตให้อยู่ในเกณฑ์มาตรฐาน")

    add_h("ตารางโครงสร้างฟิลด์จาก 43 แฟ้มที่เกี่ยวข้อง (หมวดที่ 3)", level=2)
    create_table(
        ["แฟ้ม", "ชื่อฟิลด์", "ชนิดข้อมูล", "คำอธิบายฟิลด์", "การนำไปใช้ใน Condition / กฎการประมวลผล"],
        [
            ["NCDSCREEN", "PID", "VARCHAR(15)", "ทะเบียนบุคคล", "เชื่อมกับ PERSON"],
            ["NCDSCREEN", "DATE_SERV", "DATE", "วันที่รับบริการคัดกรอง", "เงื่อนไข: ตรวจสอบในปีงบประมาณ"],
            ["NCDSCREEN", "SBP_1", "DECIMAL(3,0)", "ความดันตัวบน ครั้งที่ 1 (mmHg)", "เงื่อนไขสงสัย HT: SBP_1 >= 140 mmHg"],
            ["NCDSCREEN", "DBP_1", "DECIMAL(3,0)", "ความดันตัวล่าง ครั้งที่ 1 (mmHg)", "เงื่อนไขสงสัย HT: DBP_1 >= 90 mmHg"],
            ["NCDSCREEN", "SBP_2", "DECIMAL(3,0)", "ความดันตัวบน ครั้งที่ 2 (mmHg)", "เงื่อนไขยืนยันคัดกรอง: SBP_2 >= 140 mmHg"],
            ["NCDSCREEN", "DBP_2", "DECIMAL(3,0)", "ความดันตัวล่าง ครั้งที่ 2 (mmHg)", "เงื่อนไขยืนยันคัดกรอง: DBP_2 >= 90 mmHg"],
            ["CHRONIC", "CHRONIC", "VARCHAR(6)", "รหัสโรคเรื้อรัง ICD-10", "เงื่อนไข: SUBSTRING(CHRONIC,1,3) IN ('I10','I11','I12','I13','I15')"],
            ["CHRONIC_FU", "SBP", "DECIMAL(3,0)", "ความดันตัวบนในการติดตาม", "เงื่อนไขควบคุมได้: SBP < 140 mmHg ในการตรวจครั้งล่าสุด"],
            ["CHRONIC_FU", "DBP", "DECIMAL(3,0)", "ความดันตัวล่างในการติดตาม", "เงื่อนไขควบคุมได้: DBP < 90 mmHg ในการตรวจครั้งล่าสุด"],
            ["DIAGNOSIS_OPD", "DIAGCODE", "VARCHAR(6)", "รหัสวินิจฉัยโรค ICD-10", "I10 - I15 (Primary & Secondary HT)"],
            ["DIAGNOSIS_OPD", "DIAGTYPE", "VARCHAR(1)", "ประเภทการวินิจฉัย", "เงื่อนไข: DIAGTYPE IN ('1', '2') อย่างน้อย 2 ครั้งในปีงบประมาณ"]
        ],
        col_widths=[1.1, 1.1, 1.1, 1.8, 1.9]
    )

    add_h("ชุดรหัสมาตรฐานและเงื่อนไข (หมวดที่ 3)", level=2)
    add_p("• รหัส ICD-10 ความดันโลหิตสูง: I10 (Primary HT), I11 (Hypertensive heart disease), I12 (Hypertensive renal disease), I13 (Hypertensive heart & renal disease), I15 (Secondary HT เช่น I15.0 หลอดเลือดไตตีบ)")
    add_p("• เงื่อนไขควบคุมความดันได้ (Control Rate): ผู้ป่วย HT ใน CHRONIC_FU การวัดครั้งล่าสุดมี SBP < 140 AND DBP < 90 mmHg")

    # Section 4: CVD Risk, Stroke & STEMI
    add_h("หมวดที่ 4: Data Set เรื่องความเสี่ยงโรคหัวใจและหลอดเลือด (CVD Risk, Stroke & STEMI)", level=1)
    add_p("วัตถุประสงค์: เชื่อมโยงการคัดกรอง Thai CVD Risk Score กับผลลัพธ์การเกิดโรคหลอดเลือดสมอง (Stroke) และกล้ามเนื้อหัวใจตายเฉียบพลัน (STEMI)")

    add_h("ตารางโครงสร้างฟิลด์จาก 43 แฟ้มที่เกี่ยวข้อง (หมวดที่ 4)", level=2)
    create_table(
        ["แฟ้ม", "ชื่อฟิลด์", "ชนิดข้อมูล", "คำอธิบายฟิลด์", "การนำไปใช้ใน Condition / กฎการประมวลผล"],
        [
            ["SPECIALPP", "PID", "VARCHAR(15)", "ทะเบียนบุคคล", "เชื่อมกับ PERSON"],
            ["SPECIALPP", "DATE_SERV", "DATE", "วันที่รับบริการประเมินความเสี่ยง", "วันที่ตรวจคัดกรอง Thai CVD Risk"],
            ["SPECIALPP", "PPSPECIAL", "VARCHAR(7)", "รหัสบริการส่งเสริมสุขภาพ", "เงื่อนไข: 1B1230 - 1B1239 (ระดับความเสี่ยง CVD)"],
            ["DIAGNOSIS_OPD", "PID", "VARCHAR(15)", "ทะเบียนบุคคล", "เชื่อมกับ PERSON"],
            ["DIAGNOSIS_OPD", "DATE_SERV", "DATE", "วันที่รับบริการรักษา", "ใช้วิเคราะห์ Event ภายหลังวันคัดกรอง"],
            ["DIAGNOSIS_OPD", "DIAGCODE", "VARCHAR(6)", "รหัสวินิจฉัยโรค ICD-10", "STEMI: I21.0 - I21.3 | Stroke: I60 - I69"],
            ["DIAGNOSIS_OPD", "DIAGTYPE", "VARCHAR(1)", "ประเภทการวินิจฉัย", "เงื่อนไข: DIAGTYPE = '1' (Principal Diagnosis โรคหลัก)"]
        ],
        col_widths=[1.1, 1.1, 1.1, 1.8, 1.9]
    )

    add_h("ชุดรหัสมาตรฐานและเงื่อนไข (หมวดที่ 4)", level=2)
    add_p("• รหัส SPECIAL PP (Thai CVD Risk Score):")
    add_p("   - 1B1230: ไม่มีความเสี่ยง (<10%), 1B1231: เสี่ยงปานกลาง (10% - <20%)")
    add_p("   - 1B1232: เสี่ยงสูง (20% - <30%), 1B1234: เสี่ยงสูงมาก แนะนำ/รักษา (30% - <40%)")
    add_p("   - 1B1235: เสี่ยงสูงมากที่สุด รักษาต่อ (>=40%), 1B1239: ไม่ระบุรายละเอียด")
    add_p("• รหัส ICD-10 STEMI (DIAGTYPE = '1'): I21.0 (Anterior), I21.1 (Inferior), I21.2 (Other sites), I21.3 (Unspecified)")
    add_p("• รหัส ICD-10 Stroke (DIAGTYPE = '1'):")
    add_p("   - เฉียบพลัน: I60 (Subarachnoid), I61 (Intracerebral), I62 (Other intracranial), I63 (Infarction), I64 (Stroke unspecified)")
    add_p("   - เรื้อรัง/ตีบ/ผลตกค้าง: I65, I66, I67, I68, I69 (Sequelae)")
    add_p("• เงื่อนไขการเชื่อมโยง (Linkage Condition): ผู้ที่มีผลคัดกรองเสี่ยงสูง (1B1232, 1B1234, 1B1235) ติดตามการเกิดโรคหลัก Stroke หรือ STEMI ภายในระยะเวลา 1 ปี")

    # Section 5: Hearing
    add_h("หมวดที่ 5: Data Set เรื่องการได้ยิน (Hearing Impairment)", level=1)
    add_p("วัตถุประสงค์: ติดตามการตรวจคัดกรองสมรรถภาพการได้ยิน การตรวจยืนยันด้วย Audiometry และการเข้าถึงเครื่องช่วยฟัง")

    add_h("ตารางโครงสร้างฟิลด์จาก 43 แฟ้มที่เกี่ยวข้อง (หมวดที่ 5)", level=2)
    create_table(
        ["แฟ้ม", "ชื่อฟิลด์", "ชนิดข้อมูล", "คำอธิบายฟิลด์", "การนำไปใช้ใน Condition / กฎการประมวลผล"],
        [
            ["SPECIALPP", "PID", "VARCHAR(15)", "ทะเบียนบุคคล", "เชื่อมกับ PERSON"],
            ["SPECIALPP", "PPSPECIAL", "VARCHAR(7)", "รหัสบริการส่งเสริมสุขภาพ", "1B710, 1B711 (อสม.) | 1B1060, 1B1061, 1B1069 (FMHT รพ.สต.)"],
            ["DIAGNOSIS_OPD", "DIAGCODE", "VARCHAR(6)", "รหัสวินิจฉัย ICD-10", "H90.0 - H90.8 (Conductive, Sensorineural, Mixed), H91, Z46.1"],
            ["DIAGNOSIS_OPD", "DIAGTYPE", "VARCHAR(1)", "ประเภทการวินิจฉัย", "DIAGTYPE IN ('1', '2')"],
            ["PROCEDURE_OPD", "PROCEDURECODE", "VARCHAR(7)", "รหัสหัตถการ ICD-9-CM", "เงื่อนไข: 95.41 (Audiometry ตรวจวัดระดับการได้ยิน)"]
        ],
        col_widths=[1.1, 1.1, 1.1, 1.8, 1.9]
    )

    add_h("ชุดรหัสมาตรฐานและเงื่อนไข (หมวดที่ 5)", level=2)
    add_p("• SPECIAL PP: 1B710 (อสม. ปกติ), 1B711 (อสม. เสี่ยง) | 1B1060 (FMHT < 12 ปกติ), 1B1061 (FMHT >= 12 เสี่ยงสูง ส่งต่อ), 1B1069 (ประเมินไม่ได้)")
    add_p("• ICD-10: H90.0-H90.8 (สูญเสียการได้ยิน), Z46.1 (ตรวจปรับแต่งเครื่องช่วยฟัง)")
    add_p("• ICD-9-CM: 95.41 (Audiometry)")
    add_p("• เงื่อนไขผู้มีปัญหาการได้ยิน: ได้รับคัดกรอง 1B711 หรือ 1B1061 หรือได้รับการวินิจฉัย H90-H91 หรือตรวจ Audiometry 95.41")

    # Section 6: Oral Health
    add_h("หมวดที่ 6: Data Set เรื่องสุขภาพช่องปาก (Oral Health)", level=1)
    add_p("วัตถุประสงค์: ติดตามสภาวะทันตสุขภาพ 5 กลุ่มโรคสำคัญ การตรวจคัดกรอง และประเมินจำนวนฟันแท้ใช้งาน (Functional Teeth)")

    add_h("ตารางโครงสร้างฟิลด์จาก 43 แฟ้มที่เกี่ยวข้อง (หมวดที่ 6)", level=2)
    create_table(
        ["แฟ้ม", "ชื่อฟิลด์", "ชนิดข้อมูล", "คำอธิบายฟิลด์", "การนำไปใช้ใน Condition / กฎการประมวลผล"],
        [
            ["SPECIALPP", "PPSPECIAL", "VARCHAR(7)", "รหัสบริการส่งเสริมสุขภาพ", "1B730, 1B731 (อสม.) | 1B1260 - 1B1269 (ตรวจช่องปากและพฤติกรรม)"],
            ["DENTAL", "PID", "VARCHAR(15)", "ทะเบียนบุคคล", "เชื่อมกับ PERSON"],
            ["DENTAL", "PTEETH", "DECIMAL(2,0)", "จำนวนฟันแท้ที่มีอยู่ (ซี่)", "เงื่อนไขฟันใช้งานได้: PTEETH >= 20 ซี่"],
            ["DENTAL", "PERMANENT_PAIR", "DECIMAL(2,0)", "จำนวนคู่สบฟันแท้ (คู่)", "เงื่อนไขฟันใช้งานได้: PERMANENT_PAIR >= 4 คู่"],
            ["DENTAL", "NEED_DENTURE", "VARCHAR(1)", "ความต้องการใส่ฟันเทียม", "1=ต้องการฟันเทียมบางส่วน, 2=ต้องการฟันเทียมทั้งปาก"],
            ["DIAGNOSIS_OPD", "DIAGCODE", "VARCHAR(6)", "รหัสวินิจฉัย ICD-10", "K08.1-K08.2, K05.2-K05.3, K11.70, C00-C10, K13.2, K02, K04"],
            ["PROCEDURE_OPD", "PROCEDURECODE", "VARCHAR(7)", "รหัสหัตถการ ICD-9-CM", "23.2, 23.3, 23.41-23.49, 23.6, 23.7, 24.4, 96.54, 99.97"]
        ],
        col_widths=[1.1, 1.1, 1.1, 1.8, 1.9]
    )

    add_h("ชุดรหัสมาตรฐานและเงื่อนไข (หมวดที่ 6)", level=2)
    add_p("• 5 กลุ่มโรคสำคัญ: 1. สูญเสียฟัน (K08.1-K08.2), 2. ปริทันต์อักเสบ (K05.2-K05.3), 3. ปากแห้ง (K11.70, K11.71, R68.2), 4. มะเร็ง/รอยโรคก่อนมะเร็ง (C00-C10, K13.2, L43, L93), 5. ฟันผุและโพรงประสาท (K02, K04)")
    add_p("• เงื่อนไขผู้สูงอายุมีฟันแท้ใช้งานได้ตามเกณฑ์: DENTAL.PTEETH >= 20 AND DENTAL.PERMANENT_PAIR >= 4")

    # Section 7: Vision
    add_h("หมวดที่ 7: Data Set เรื่องการมองเห็น (Visual Impairment & Eye Diseases)", level=1)
    add_p("วัตถุประสงค์: ติดตามการตรวจคัดกรองสายตาระยะใกล้/ระยะไกล คัดกรองต้อกระจก ต้อหิน จอประสาทตาเสื่อม และระดับสายตาเลือนราง/ตาบอด")

    add_h("ตารางโครงสร้างฟิลด์จาก 43 แฟ้มที่เกี่ยวข้อง (หมวดที่ 7)", level=2)
    create_table(
        ["แฟ้ม", "ชื่อฟิลด์", "ชนิดข้อมูล", "คำอธิบายฟิลด์", "การนำไปใช้ใน Condition / กฎการประมวลผล"],
        [
            ["SPECIALPP", "PPSPECIAL", "VARCHAR(7)", "รหัสบริการส่งเสริมสุขภาพ", "1B700, 1B701 (อสม.) | 1B1240 - 1B1259 (ระยะใกล้/ไกล/ต้อกระจก/ต้อหิน/AMD)"],
            ["DIAGNOSIS_OPD", "DIAGCODE", "VARCHAR(6)", "รหัสวินิจฉัย ICD-10", "H25-H28 (ต้อกระจก), H40 (ต้อหิน), H35.3-4 (AMD), H11.0, H36.0, H54"],
            ["DIAGNOSIS_OPD", "DIAGTYPE", "VARCHAR(1)", "ประเภทการวินิจฉัย", "H54.0-H54.9 ใช้เป็น DIAGTYPE IN ('2', '4') ระบุระดับสายตา"],
            ["PROCEDURE_OPD", "PROCEDURECODE", "VARCHAR(7)", "รหัสหัตถการ", "95.09 (VA), OP9001 (Fundus Camera), OP9002 (OCT), OP9004 (VF)"]
        ],
        col_widths=[1.1, 1.1, 1.1, 1.8, 1.9]
    )

    add_h("ชุดรหัสมาตรฐานและเงื่อนไข (หมวดที่ 7)", level=2)
    add_p("• รหัสคัดกรองพบปัญหา: 1B701, 1B1241-1B1242 (ใกล้), 1B1244-1B1245 (ไกล), 1B1251-1B1252 (ต้อกระจก), 1B1254-1B1255 (ต้อหิน), 1B1257-1B1258 (AMD)")
    add_p("• ระดับสายตาผิดปกติ: H54.0 (ตาบอดสองข้าง), H54.1 (ตาบอด 1 ข้าง เลือนราง 1 ข้าง), H54.2 (สายตาเลือนรางสองข้าง), H54.4 (ตาบอดข้างเดียว)")

    # Section 8: Osteoporosis
    add_h("หมวดที่ 8: Data Set เรื่องโรคกระดูกพรุน (Osteoporosis)", level=1)
    add_p("วัตถุประสงค์: ติดตามการประเมินความเสี่ยง OSTA Index, FRAX Score การวินิจฉัยโรคกระดูกพรุน และภาวะกระดูกหักจากกระดูกพรุน (Fragility Fractures)")

    add_h("ตารางโครงสร้างฟิลด์จาก 43 แฟ้มที่เกี่ยวข้อง (หมวดที่ 8)", level=2)
    create_table(
        ["แฟ้ม", "ชื่อฟิลด์", "ชนิดข้อมูล", "คำอธิบายฟิลด์", "การนำไปใช้ใน Condition / กฎการประมวลผล"],
        [
            ["SPECIALPP", "PPSPECIAL", "VARCHAR(7)", "รหัสบริการส่งเสริมสุขภาพ", "OSTA: 1B1010-1B1019 | FRAX Score: 1B1090-1B1099"],
            ["DIAGNOSIS_OPD", "DIAGCODE", "VARCHAR(6)", "รหัสวินิจฉัย ICD-10", "M80 (มีกระดูกหัก), M81 (ไม่มีกระดูกหัก), M82, S72, S52, S42, S22"],
            ["DIAGNOSIS_OPD", "DIAGTYPE", "VARCHAR(1)", "ประเภทการวินิจฉัย", "DIAGTYPE IN ('1', '2')"]
        ],
        col_widths=[1.1, 1.1, 1.1, 1.8, 1.9]
    )

    add_h("ชุดรหัสมาตรฐานและเงื่อนไข (หมวดที่ 8)", level=2)
    add_p("• OSTA Index: 1B1010 (ต่ำ: > -1), 1B1011 (ปานกลาง: -4 ถึง -1), 1B1012 (สูง: < -4 แนะนำตรวจ DEXA)")
    add_p("• FRAX Score: 1B1090 (ไม่เสี่ยง), 1B1091 (เสี่ยงสูง: Hip > 3% หรือ Major > 20%)")
    add_p("• ICD-10: M80-M82 (Osteoporosis), S72 (Femur/Hip), S52 (Forearm), S42 (Humerus), S22 (Vertebrae)")
    add_p("• เงื่อนไข Fragility Fracture: มีรหัส Fracture ร่วมกับ M80 หรือ M81 ในปีงบประมาณเดียวกัน")

    # Section 9: Osteoarthritis of Knee
    add_h("หมวดที่ 9: Data Set เรื่องโรคข้อเข่าเสื่อม (Osteoarthritis of Knee)", level=1)
    add_p("วัตถุประสงค์: ติดตามการคัดกรองข้อเข่าเสื่อมทางคลินิก และการวินิจฉัยโรคข้อเข่าเสื่อม")

    add_h("ตารางโครงสร้างฟิลด์จาก 43 แฟ้มที่เกี่ยวข้อง (หมวดที่ 9)", level=2)
    create_table(
        ["แฟ้ม", "ชื่อฟิลด์", "ชนิดข้อมูล", "คำอธิบายฟิลด์", "การนำไปใช้ใน Condition / กฎการประมวลผล"],
        [
            ["SPECIALPP", "PPSPECIAL", "VARCHAR(7)", "รหัสบริการส่งเสริมสุขภาพ", "1B1270 (ปกติ), 1B1271 (ผิดปกติ รักษา), 1B1272 (ผิดปกติ ส่งต่อ)"],
            ["DIAGNOSIS_OPD", "DIAGCODE", "VARCHAR(6)", "รหัสวินิจฉัย ICD-10", "M17.0 - M17.9 (Gonarthrosis ปฐมภูมิ/ทุติยภูมิ), M15, M19"],
            ["DIAGNOSIS_OPD", "DIAGTYPE", "VARCHAR(1)", "ประเภทการวินิจฉัย", "DIAGTYPE IN ('1', '2')"]
        ],
        col_widths=[1.1, 1.1, 1.1, 1.8, 1.9]
    )

    add_h("ชุดรหัสมาตรฐานและเงื่อนไข (หมวดที่ 9)", level=2)
    add_p("• SPECIAL PP: 1B1270 (ปกติ), 1B1271 (ผิดปกติ ให้คำแนะนำ/รักษา), 1B1272 (ผิดปกติ ส่งต่อ)")
    add_p("• ICD-10: M17.0 (สองข้าง), M17.1 (ข้างเดียว), M17.2-M17.5 (ทุติยภูมิ/อุบัติเหตุ), M17.9 (ไม่ระบุ), M15, M19")
    add_p("• เงื่อนไขพบโรค: SPECIALPP ในกลุ่ม ('1B1271', '1B1272') หรือ DIAGCODE LIKE 'M17%' (DIAGTYPE 1 หรือ 2)")

    # Section 10: Cognitive Impairment & Dementia
    add_h("หมวดที่ 10: Data Set เรื่องสมรรถภาพสมองและภาวะสมองเสื่อม (Cognitive Impairment & Dementia)", level=1)
    add_p("วัตถุประสงค์: ติดตามการคัดกรองความรู้คิดด้วย Mini-Cog, MMSE-T, MoCA การตรวจแล็บหาสาเหตุที่รักษาได้ และการวินิจฉัยสมองเสื่อม")

    add_h("ตารางโครงสร้างฟิลด์จาก 43 แฟ้มที่เกี่ยวข้อง (หมวดที่ 10)", level=2)
    create_table(
        ["แฟ้ม", "ชื่อฟิลด์", "ชนิดข้อมูล", "คำอธิบายฟิลด์", "การนำไปใช้ใน Condition / กฎการประมวลผล"],
        [
            ["SPECIALPP", "PPSPECIAL", "VARCHAR(7)", "รหัสบริการส่งเสริมสุขภาพ", "1B122, 1B1220-3 (ชุมชน) | 1B1020-2 (Mini-Cog) | 1B1224-9 (MMSE-T) | 1B1030-9 (MoCA)"],
            ["LABFU", "LABTEST", "VARCHAR(7)", "รหัสการตรวจทางห้องปฏิบัติการ", "CBC, TSH, BUN, CREATININE, LFT, VDRL (Rule-out สาเหตุอื่น)"],
            ["LABFU", "LABRESULT", "VARCHAR(50)", "ผลการตรวจแล็บ", "ผลตรวจทางห้องปฏิบัติการ"],
            ["DIAGNOSIS_OPD", "DIAGCODE", "VARCHAR(6)", "รหัสวินิจฉัย ICD-10", "F00 (G30), F01, F02 (G31, A81, G10, G20, B22), F03, F06.7, G31.8"],
            ["DIAGNOSIS_OPD", "DIAGTYPE", "VARCHAR(1)", "ประเภทการวินิจฉัย", "DIAGTYPE IN ('1', '2')"]
        ],
        col_widths=[1.1, 1.1, 1.1, 1.8, 1.9]
    )

    add_h("ชุดรหัสมาตรฐานและเงื่อนไข (หมวดที่ 10)", level=2)
    add_p("• Mini-Cog: 1B1020 (>=4 ปกติ), 1B1021 (=3 สงสัย MCI), 1B1022 (0-2 สงสัย Dementia ส่งต่อ)")
    add_p("• MMSE-T 2002: 1B1224 (ปกติ), 1B1225 (ปกติ สงสัย MCI ส่งต่อ), 1B1226 (ผิดปกติ ส่งต่อ MoCA)")
    add_p("• MoCA: 1B1030 (ปกติ >= 25), 1B1031 (ผิดปกติ สงสัย MCI), 1B1032 (ผิดปกติ สงสัย Dementia ส่งรักษา)")
    add_p("• ICD-10: F00 (G30.* Alzheimer), F01 (Vascular dementia), F02 (Dementia in other diseases), F03 (Unspecified), F06.7 (Mild cognitive disorder - MCI), G31.8 (Lewy bodies)")
    add_p("• เงื่อนไขสงสัยความรู้คิดบกพร่อง: 1B1221, 1B1223, 1B1021, 1B1022, 1B1225, 1B1226, 1B1031, 1B1032")

    # Section 11: Depression & Suicide Risk
    add_h("หมวดที่ 11: Data Set เรื่องภาวะซึมเศร้าและความเสี่ยงฆ่าตัวตาย (Depression & Suicide Risk)", level=1)
    add_p("วัตถุประสงค์: ติดตามกระบวนการคัดกรอง 2Q -> ประเมิน 9Q -> ประเมิน 8Q และแบบวัด TGDS 30 สำหรับผู้สูงอายุ")

    add_h("ตารางโครงสร้างฟิลด์จาก 43 แฟ้มที่เกี่ยวข้อง (หมวดที่ 11)", level=2)
    create_table(
        ["แฟ้ม", "ชื่อฟิลด์", "ชนิดข้อมูล", "คำอธิบายฟิลด์", "การนำไปใช้ใน Condition / กฎการประมวลผล"],
        [
            ["SPECIALPP", "PPSPECIAL", "VARCHAR(7)", "รหัสบริการส่งเสริมสุขภาพ", "2Q: 1B0280-1 | 9Q: 1B0282-5 | 8Q: 1B0270-3 | TGDS: 1B1040-9"],
            ["DIAGNOSIS_OPD", "DIAGCODE", "VARCHAR(6)", "รหัสวินิจฉัย ICD-10", "F32.x (Depressive episode), F33.x (Recurrent), F34.1, F38, F39"],
            ["DIAGNOSIS_OPD", "DIAGTYPE", "VARCHAR(1)", "ประเภทการวินิจฉัย", "DIAGTYPE IN ('1', '2')"]
        ],
        col_widths=[1.1, 1.1, 1.1, 1.8, 1.9]
    )

    add_h("ชุดรหัสมาตรฐานและเงื่อนไข (หมวดที่ 11)", level=2)
    add_p("• 2Q: 1B0280 (ปกติ 0 คะแนน), 1B0281 (ผิดปกติ มีอาการ >= 1 ข้อ -> ส่งทำ 9Q ต่อ)")
    add_p("• 9Q: 1B0282 (<7 ปกติ), 1B0283 (7-12 น้อย), 1B0284 (13-18 ปานกลาง), 1B0285 (>= 19 รุนแรง)")
    add_p("• 8Q: 1B0270 (0 ไม่มี), 1B0271 (1-8 น้อย), 1B0272 (9-16 ปานกลาง เฝ้าระวัง), 1B0273 (>= 17 รุนแรง ส่งต่อด่วน)")
    add_p("• TGDS 30: 1B1040 (0-12 ปกติ), 1B1041 (13-18 เศร้าเล็กน้อย), 1B1042 (19-24 เศร้าปานกลาง), 1B1043 (25-30 เศร้ารุนแรง)")
    add_p("• เงื่อนไขผู้ป่วยที่ต้องได้รับการรักษา: 9Q >= 13 (1B0284, 1B0285) หรือ TGDS >= 19 (1B1042, 1B1043) หรือวินิจฉัย F32-F39")

    # Section 12: Falls & Hip Fracture
    add_h("หมวดที่ 12: Data Set เรื่องภาวะหกล้มและกระดูกสะโพกหัก (Falls & Hip Fracture)", level=1)
    add_p("วัตถุประสงค์: ติดตามการคัดกรอง TUG, SPPB การบันทึกสาเหตุภายนอกของการหกล้ม (W00-W19) ร่วมกับกระดูกสะโพกหัก (S72)")

    add_h("ตารางโครงสร้างฟิลด์จาก 43 แฟ้มที่เกี่ยวข้อง (หมวดที่ 12)", level=2)
    create_table(
        ["แฟ้ม", "ชื่อฟิลด์", "ชนิดข้อมูล", "คำอธิบายฟิลด์", "การนำไปใช้ใน Condition / กฎการประมวลผล"],
        [
            ["SPECIALPP", "PPSPECIAL", "VARCHAR(7)", "รหัสบริการส่งเสริมสุขภาพ", "TUG: 1B120, 1B1200-1B1203 | SPPB: 1B1050-1B1059"],
            ["DIAGNOSIS_OPD", "PID", "VARCHAR(15)", "ทะเบียนบุคคล", "เชื่อมกับ PERSON"],
            ["DIAGNOSIS_OPD", "SEQ", "VARCHAR(16)", "ลำดับการรับบริการ", "ใช้จับคู่โรคหลักกับสาเหตุภายนอกในการรับบริการครั้งเดียวกัน"],
            ["DIAGNOSIS_OPD", "DIAGCODE", "VARCHAR(6)", "รหัส ICD-10", "กระดูกหัก S72.x | สาเหตุล้ม W00-W19 | อาการ R54, R29.6, M62.5"],
            ["DIAGNOSIS_OPD", "DIAGTYPE", "VARCHAR(1)", "ประเภทการวินิจฉัย", "1=Principal Dx, 4=Other Dx, 5=External Cause"]
        ],
        col_widths=[1.1, 1.1, 1.1, 1.8, 1.9]
    )

    add_h("ชุดรหัสมาตรฐานและเงื่อนไข (หมวดที่ 12)", level=2)
    add_p("• TUG Test: 1B1200 (< 12 วินาที ไม่เสี่ยง), 1B1201 (>= 12 วินาที เสี่ยง), 1B1202 (เสี่ยง ส่งต่อ SPPB)")
    add_p("• SPPB: 1B1050 (10-12 ข้อจำกัดน้อย), 1B1051 (7-9 เล็กน้อย), 1B1052 (4-6 ปานกลาง เสี่ยงล้ม), 1B1053 (0-3 รุนแรง เสี่ยงล้มสูงมาก)")
    add_p("• รหัสสาเหตุภายนอก W00 – W19 (DIAGTYPE = '5'): W00 (พื้นลื่น), W01 (สะดุดล้ม), W06 (ตกเตียง), W07 (ตกเก้าอี้), W10 (ตกบันได), W18 (ล้มระดับเดียวกัน), W19 (ล้มไม่ระบุ)")
    add_p("• รหัสกระดูกสะโพกหัก S72 (DIAGTYPE = '1'): S72.0 (คอสะโพก), S72.1 (Intertrochanteric), S72.2 (Subtrochanteric)")
    add_p("• กฎการบันทึกรหัส (Coding Rules):")
    add_p("   - กฎ 1 (Fall + Fracture): DIAGTYPE = '1' ต้องเป็นรหัสกระดูกหัก (S72.x, S52.x) และ DIAGTYPE = '5' ต้องเป็นรหัสสาเหตุล้ม (W00-W19)")
    add_p("   - กฎ 2 (ล้มไม่มีโรคอื่น): DIAGTYPE = '1' ใช้ R54 (Senility) และ DIAGTYPE = '4' ใช้ R29.6 (Tendency to fall), M62.5, Z13.9")
    add_p("   - กฎ 3 (มีโรคประจำตัวที่เป็นสาเหตุล้ม เช่น Stroke, Parkinson): DIAGTYPE = '1' ใช้โรคนั้น และ DIAGTYPE = '4' ใช้ R29.6, M62.5, R54")

    # Section 13: Urinary Incontinence
    add_h("หมวดที่ 13: Data Set เรื่องการกลั้นปัสสาวะ (Urinary Incontinence)", level=1)
    add_p("วัตถุประสงค์: ติดตามการคัดกรองภาวะกลั้นปัสสาวะ และการวินิจฉัยภาวะกลั้นปัสสาวะไม่อยู่ชนิดต่างๆ")

    add_h("ตารางโครงสร้างฟิลด์จาก 43 แฟ้มที่เกี่ยวข้อง (หมวดที่ 13)", level=2)
    create_table(
        ["แฟ้ม", "ชื่อฟิลด์", "ชนิดข้อมูล", "คำอธิบายฟิลด์", "การนำไปใช้ใน Condition / กฎการประมวลผล"],
        [
            ["SPECIALPP", "PPSPECIAL", "VARCHAR(7)", "รหัสบริการส่งเสริมสุขภาพ", "1B1283 (คัดกรอง), 1B1284 (ปกติ), 1B1285 (พบปัญหา)"],
            ["DIAGNOSIS_OPD", "DIAGCODE", "VARCHAR(6)", "รหัสวินิจฉัย ICD-10", "N39.3 (Stress), N39.4 (Urge/Other), R32, N31.0-9, R35, R39"],
            ["DIAGNOSIS_OPD", "DIAGTYPE", "VARCHAR(1)", "ประเภทการวินิจฉัย", "DIAGTYPE IN ('1', '2', '4')"]
        ],
        col_widths=[1.1, 1.1, 1.1, 1.8, 1.9]
    )

    add_h("ชุดรหัสมาตรฐานและเงื่อนไข (หมวดที่ 13)", level=2)
    add_p("• SPECIAL PP: 1B1283 (คัดกรอง), 1B1284 (ไม่มีปัญหา), 1B1285 (พบปัญหากลั้นปัสสาวะ)")
    add_p("• ICD-10: N39.3 (Stress incontinence), N39.4 (Urge incontinence), R32 (Unspecified), N31.0-N31.9 (Neurogenic bladder), R35 (Nocturia)")
    add_p("• เงื่อนไขพบปัญหา: SPECIALPP = '1B1285' หรือ DIAGCODE ในกลุ่ม ('N393', 'N394', 'R32')")

    # Section 14: Malnutrition & Sarcopenia
    add_h("หมวดที่ 14: Data Set เรื่องภาวะขาดสารอาหารและมวลกล้ามเนื้อน้อย (Malnutrition & Sarcopenia)", level=1)
    add_p("วัตถุประสงค์: ติดตามการประเมินชุด 1K, MNA Short/Full Form, Modified MSRA-5 และการให้คำปรึกษาโภชนาการ")

    add_h("ตารางโครงสร้างฟิลด์จาก 43 แฟ้มที่เกี่ยวข้อง (หมวดที่ 14)", level=2)
    create_table(
        ["แฟ้ม", "ชื่อฟิลด์", "ชนิดข้อมูล", "คำอธิบายฟิลด์", "การนำไปใช้ใน Condition / กฎการประมวลผล"],
        [
            ["SPECIALPP", "PPSPECIAL", "VARCHAR(7)", "รหัสบริการส่งเสริมสุขภาพ", "ชุด 1K: 1K1, 1K10-16 | MNA: 1B1000-5 | MSRA-5: 1B1080-9"],
            ["DIAGNOSIS_OPD", "DIAGCODE", "VARCHAR(6)", "รหัสวินิจฉัย ICD-10", "E43 (ขาดรุนแรง), E44.0-1, E46, R63.4 (น้ำหนักลด), Z68.1, M62.5"],
            ["PROCEDURE_OPD", "PROCEDURECODE", "VARCHAR(7)", "รหัสหัตถการ", "89.39 (ตรวจประเมินโภชนาการ), 94.49 (ให้คำปรึกษาโภชนาการ)"]
        ],
        col_widths=[1.1, 1.1, 1.1, 1.8, 1.9]
    )

    add_h("ชุดรหัสมาตรฐานและเงื่อนไข (หมวดที่ 14)", level=2)
    add_p("• ชุด 1K: 1K10 (ปกติ), 1K11-1K13 (เสี่ยง), 1K14-1K16 (ขาดสารอาหาร)")
    add_p("• MNA: 1B1000 (12-14 ปกติ), 1B1001 (8-11 เสี่ยง), 1B1002 (0-7 ขาดสารอาหาร) | 1B1003 (24-30 ปกติ), 1B1004 (17-23.5 เสี่ยง), 1B1005 (<17 ขาดสารอาหาร)")
    add_p("• Modified MSRA-5: 1B1080 (ปกติ), 1B1081 (เสี่ยงต่ำ-ปานกลาง), 1B1082 (เสี่ยงสูง ส่งต่อ)")
    add_p("• ICD-10: E43-E46 (Protein-energy malnutrition), R63.4 (น้ำหนักลดผิดปกติ), Z68.1 (BMI <= 19.9), M62.5 (มวลกล้ามเนื้อลีบ)")

    # Section 15: Sleep Disorders
    add_h("หมวดที่ 15: Data Set เรื่องปัญหาการนอน (Sleep Disorders)", level=1)
    add_p("วัตถุประสงค์: ติดตามการวินิจฉัยภาวะนอนไม่หลับ หยุดหายใจขณะหลับ (OSA) และการตรวจ Polysomnography (Sleep Study)")

    add_h("ตารางโครงสร้างฟิลด์จาก 43 แฟ้มที่เกี่ยวข้อง (หมวดที่ 15)", level=2)
    create_table(
        ["แฟ้ม", "ชื่อฟิลด์", "ชนิดข้อมูล", "คำอธิบายฟิลด์", "การนำไปใช้ใน Condition / กฎการประมวลผล"],
        [
            ["DIAGNOSIS_OPD", "DIAGCODE", "VARCHAR(6)", "รหัสวินิจฉัย ICD-10", "G47.0-9 (Insomnia, OSA, Narcolepsy) | F51.0-9 (Nonorganic sleep)"],
            ["DIAGNOSIS_OPD", "DIAGTYPE", "VARCHAR(1)", "ประเภทการวินิจฉัย", "DIAGTYPE IN ('1', '2', '4')"],
            ["PROCEDURE_OPD", "PROCEDURECODE", "VARCHAR(7)", "รหัสหัตถการ ICD-9-CM", "เงื่อนไขตรวจยืนยัน: 89.17 (Polysomnogram / Sleep Study), 89.14 (EEG)"]
        ],
        col_widths=[1.1, 1.1, 1.1, 1.8, 1.9]
    )

    add_h("ชุดรหัสมาตรฐานและเงื่อนไข (หมวดที่ 15)", level=2)
    add_p("• ICD-10 G47: G47.0 (นอนไม่หลับ Insomnia), G47.1 (Hypersomnia), G47.3 (Sleep Apnea / OSA หยุดหายใจขณะหลับ), G47.4 (Narcolepsy)")
    add_p("• ICD-10 F51: F51.0 (Nonorganic insomnia นอนไม่หลับจากจิตใจ), F51.1-F51.5 (ละเมอ/ฝันร้าย)")
    add_p("• ICD-9-CM: 89.17 (Sleep Study / Polysomnography)")

    # Section 16: ADL, Frailty & LTC
    add_h("หมวดที่ 16: Data Set เรื่องกิจวัตรประจำวัน ภาวะเปราะบาง และการดูแลระยะยาว (ADL, Frailty & LTC)", level=1)
    add_p("วัตถุประสงค์: ติดตามการประเมิน Barthel ADL Index, Frail Scale, การประเมิน LTC และการฟื้นฟูสมรรถภาพทางกายภาพบำบัด")

    add_h("ตารางโครงสร้างฟิลด์จาก 43 แฟ้มที่เกี่ยวข้อง (หมวดที่ 16)", level=2)
    create_table(
        ["แฟ้ม", "ชื่อฟิลด์", "ชนิดข้อมูล", "คำอธิบายฟิลด์", "การนำไปใช้ใน Condition / กฎการประมวลผล"],
        [
            ["SPECIALPP", "PPSPECIAL", "VARCHAR(7)", "รหัสบริการส่งเสริมสุขภาพ", "1B720-1 (อสม.) | 1B1280-2 (ADL) | 1B1070-9 (Frail) | 1B1273-5 (LTC)"],
            ["DIAGNOSIS_OPD", "DIAGCODE", "VARCHAR(6)", "รหัสวินิจฉัย ICD-10", "Z74.0 - Z74.9 (ภาวะพึ่งพิงผู้ดูแล), Z73.6, R54"],
            ["PROCEDURE_OPD", "PROCEDURECODE", "VARCHAR(7)", "รหัสหัตถการ ICD-9-CM", "93.11 - 93.39 (กายภาพบำบัดและการฝึกเดิน), 93.83 (กิจกรรมบำบัด)"]
        ],
        col_widths=[1.1, 1.1, 1.1, 1.8, 1.9]
    )

    add_h("ชุดรหัสมาตรฐานและเงื่อนไข (หมวดที่ 16)", level=2)
    add_p("• Barthel ADL Index: 1B1280 (12-20 ติดสังคม), 1B1281 (5-11 ติดบ้าน), 1B1282 (0-4 ติดเตียง)")
    add_p("• Frail Scale: 1B1070 (0 Robust ปกติ), 1B1071 (1-2 Pre-frail ก่อนเปราะบาง), 1B1072 (3-5 Frail ภาวะเปราะบาง)")
    add_p("• LTC: 1B1273 (ไม่ต้องดูแล), 1B1274 (เฝ้าระวัง), 1B1275 (ต้องได้รับการดูแลระยะยาว LTC)")
    add_p("• ICD-10: Z74.0 (เคลื่อนไหวลำบาก), Z74.1 (ต้องการคนช่วยดูแลตนเอง), Z74.2-Z74.3, Z73.6, R54")

    # Master Table: Screening by Provider Level
    add_h("ตารางสรุปการคัดกรองจำแนกตามระดับสถานพยาบาลและผู้ดูแล", level=1)
    create_table(
        ["เรื่อง / ปัญหาสำคัญ", "อสม. / ญาติ / ผู้ดูแล", "สถานบริการปฐมภูมิ (รพ.สต.)", "รพช. / รพท. / รพศ."],
        [
            ["1. เบาหวาน", "คัดกรองความเสี่ยง พฤติกรรม", "NCDSCREEN (BSLEVEL, SBP, DBP)", "วินิจฉัย E10-E14, ติดตาม FOOT, RETINA"],
            ["2. ความดันโลหิต", "วัดความดันเบื้องต้น", "NCDSCREEN วัดซ้ำ 2 ครั้ง", "วินิจฉัย I10-I15, ตรวจ EKG, ตรวจไต"],
            ["3. ความเสี่ยง CVD / หลอดเลือด", "-", "1B1230 - 1B1239 (Thai CVD Risk)", "วินิจฉัย Stroke (I60-I69), STEMI (I21.0-I21.3)"],
            ["4. การได้ยิน", "1B710, 1B711", "1B1060, 1B1061, 1B1069 (FMHT)", "Audiometry 95.41, วินิจฉัย H90-H91, เครื่องช่วยฟัง Z46.1"],
            ["5. สุขภาพช่องปาก", "1B730, 1B731", "1B1260 - 1B1269 (ตรวจช่องปาก)", "ทันตกรรมเฉพาะทาง, ฟันเทียม 23.4/23.6, มะเร็ง C00-C10"],
            ["6. การมองเห็น", "1B700, 1B701", "1B1240 - 1B1259 (ใกล้/ไกล/ต้อ)", "Fundus Camera OP9001, OCT, VF, ผ่าตัดต้อ H25, H40"],
            ["7. กระดูกพรุน", "-", "1B1010 - 1B1019 (OSTA Index)", "1B1090-9 (FRAX), ตรวจ DEXA, วินิจฉัย M80-M82"],
            ["8. ข้อเข่าเสื่อม", "-", "1B1270, 1B1271, 1B1272", "วินิจฉัย M17.0 - M17.9, X-ray, ผ่าตัดเปลี่ยนข้อเข่า"],
            ["9. สมรรถภาพสมอง", "1B122, 1B1220-3", "1B1020 - 1B1022 (Mini-Cog)", "MMSE-T (1B1224-9), MoCA (1B1030-9), วินิจฉัย F00-F03"],
            ["10. ภาวะซึมเศร้า", "1B0280, 1B0281 (2Q)", "1B0282-5 (9Q), 1B0270-3 (8Q)", "TGDS 30 (1B1040-9), วินิจฉัย F32-F39, จิตบำบัด"],
            ["11. ภาวะหกล้ม", "-", "1B120, 1B1200-3 (TUG)", "SPPB (1B1050-9), วินิจฉัย Hip Fracture S72, สาเหตุ W00-W19"],
            ["12. การกลั้นปัสสาวะ", "-", "1B1283, 1B1284, 1B1285", "วินิจฉัย N39.3, N39.4, R32, Urodynamic study"],
            ["13. ภาวะโภชนาการ", "1K1, 1K10 - 1K16", "1B1000 - 1B1002 (MNA-SF)", "MNA-Full (1B1003-5), MSRA-5 (1B1080-9), โภชนบำบัด"],
            ["14. ปัญหาการนอน", "ซักประวัติการนอน", "ซักประวัติ/ประเมินสุขอนามัยการนอน", "วินิจฉัย G47, F51, Sleep Study 89.17"],
            ["15. กิจวัตรประจำวัน", "1B720, 1B721", "1B1280 - 1B1282 (Barthel ADL)", "Frail Scale (1B1070-9), LTC (1B1273-5), กายภาพบำบัด 93.x"]
        ],
        col_widths=[1.5, 1.4, 1.8, 2.3]
    )

    # Master SQL Queries
    add_h("แม่แบบคำสั่ง SQL สำหรับสกัดข้อมูลจากระบบ 43 แฟ้ม (SQL Query Templates)", level=1)
    
    add_h("Query 1: สกัดประชากรผู้สูงอายุเป้าหมาย (Base Target Population)", level=2)
    add_sql("""SELECT 
    p.HOSPCODE,
    p.CID,
    p.PID,
    p.PRENAME,
    p.NAME,
    p.LNAME,
    p.SEX,
    p.BIRTH,
    TIMESTAMPDIFF(YEAR, p.BIRTH, '2026-09-30') AS AGE_YEAR,
    p.TYPEAREA,
    h.HOUSE,
    h.VILLAGE,
    h.TAMBON,
    h.AMPUR,
    h.CHANGWAT,
    p.D_UPDATE
FROM person p
LEFT JOIN home h 
    ON p.HOSPCODE = h.HOSPCODE AND p.HID = h.HID
LEFT JOIN death d 
    ON p.CID = d.CID
WHERE TIMESTAMPDIFF(YEAR, p.BIRTH, '2026-09-30') >= 60
  AND p.DISCHARGE = '9'
  AND (d.CID IS NULL OR d.DDEATH > '2026-09-30')
  AND p.TYPEAREA IN ('1', '3');""")

    add_h("Query 2: ผู้สูงอายุที่หกล้มและเกิดกระดูกสะโพกหัก (Fall + Hip Fracture)", level=2)
    add_sql("""SELECT 
    d1.HOSPCODE,
    d1.PID,
    d1.SEQ,
    d1.DATE_SERV,
    d1.DIAGCODE AS FRACTURE_ICD10,
    d2.DIAGCODE AS FALL_CAUSE_ICD10,
    CASE 
        WHEN d1.DIAGCODE LIKE 'S720%' THEN 'คอสะโพกหัก (Femoral neck fracture)'
        WHEN d1.DIAGCODE LIKE 'S721%' THEN 'Intertrochanteric fracture'
        WHEN d1.DIAGCODE LIKE 'S722%' THEN 'Subtrochanteric fracture'
        ELSE 'Femur fracture อื่นๆ'
    END AS FRACTURE_TYPE,
    CASE 
        WHEN d2.DIAGCODE = 'W00' THEN 'ลื่นบนพื้นเปียก'
        WHEN d2.DIAGCODE = 'W01' THEN 'สะดุดสิ่งของแล้วล้ม'
        WHEN d2.DIAGCODE = 'W06' THEN 'ตกจากเตียง'
        WHEN d2.DIAGCODE = 'W07' THEN 'ตกจากเก้าอี้'
        WHEN d2.DIAGCODE = 'W10' THEN 'ตกจากบันได'
        WHEN d2.DIAGCODE = 'W18' THEN 'หกล้มในระดับเดียวกัน'
        WHEN d2.DIAGCODE = 'W19' THEN 'หกล้มไม่ระบุรายละเอียด'
        ELSE 'สาเหตุการล้มอื่นๆ'
    END AS FALL_CAUSE
FROM diagnosis_opd d1
INNER JOIN diagnosis_opd d2 
    ON d1.HOSPCODE = d2.HOSPCODE 
   AND d1.PID = d2.PID 
   AND d1.SEQ = d2.SEQ
WHERE d1.DIAGTYPE = '1'
  AND (d1.DIAGCODE LIKE 'S72%' OR d1.DIAGCODE IN ('S720','S721','S722'))
  AND d2.DIAGTYPE = '5'
  AND (d2.DIAGCODE BETWEEN 'W00' AND 'W19' OR d2.DIAGCODE LIKE 'W%');""")

    add_h("Query 3: การคัดกรอง Thai CVD Risk และการเกิด Stroke / STEMI ภายใน 1 ปี", level=2)
    add_sql("""SELECT 
    sp.HOSPCODE,
    sp.PID,
    sp.DATE_SERV AS SCREEN_DATE,
    sp.PPSPECIAL AS CVD_RISK_CODE,
    CASE 
        WHEN sp.PPSPECIAL = '1B1230' THEN 'ไม่เสี่ยง (<10%)'
        WHEN sp.PPSPECIAL = '1B1231' THEN 'เสี่ยงปานกลาง (10-<20%)'
        WHEN sp.PPSPECIAL = '1B1232' THEN 'เสี่ยงสูง (20-<30%)'
        WHEN sp.PPSPECIAL = '1B1234' THEN 'เสี่ยงสูงมาก (30-<40%)'
        WHEN sp.PPSPECIAL = '1B1235' THEN 'เสี่ยงสูงอันตราย (>=40%)'
        ELSE 'ไม่ระบุ'
    END AS RISK_LEVEL,
    ev.DATE_SERV AS EVENT_DATE,
    ev.DIAGCODE AS EVENT_ICD10,
    CASE 
        WHEN ev.DIAGCODE BETWEEN 'I60' AND 'I69' THEN 'Stroke (โรคหลอดเลือดสมอง)'
        WHEN ev.DIAGCODE LIKE 'I21%' THEN 'STEMI (กล้ามเนื้อหัวใจตายเฉียบพลัน)'
        ELSE 'Other Cardiovascular Event'
    END AS EVENT_TYPE,
    DATEDIFF(ev.DATE_SERV, sp.DATE_SERV) AS DAYS_TO_EVENT
FROM specialpp sp
LEFT JOIN diagnosis_opd ev 
    ON sp.HOSPCODE = ev.HOSPCODE 
   AND sp.PID = ev.PID 
   AND ev.DATE_SERV >= sp.DATE_SERV
   AND ev.DATE_SERV <= DATE_ADD(sp.DATE_SERV, INTERVAL 1 YEAR)
   AND ev.DIAGTYPE = '1'
   AND (
       (ev.DIAGCODE BETWEEN 'I60' AND 'I69') 
       OR (ev.DIAGCODE IN ('I210', 'I211', 'I212', 'I213'))
   )
WHERE sp.PPSPECIAL IN ('1B1230', '1B1231', '1B1232', '1B1234', '1B1235', '1B1239');""")

    # Save DOCX
    docx_path = "c:/Users/Piyanut/Desktop/Code_Work/docs/Elderly_Health_Dataset_Specification_and_Conditions.docx"
    doc.save(docx_path)
    print(f"Word document saved successfully to: {docx_path}")

    # Save Markdown
    md_path = "c:/Users/Piyanut/Desktop/Code_Work/docs/Elderly_Health_Dataset_Specification_and_Conditions.md"
    with open(md_path, "w", encoding="utf-8") as f:
        f.write("\n".join(md_lines))
    print(f"Markdown document saved successfully to: {md_path}")

if __name__ == "__main__":
    build_documents()
