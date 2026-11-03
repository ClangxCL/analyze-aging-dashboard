import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

doc = docx.Document()

# Page Margins
sections = doc.sections
for s in sections:
    s.top_margin = Inches(0.8)
    s.bottom_margin = Inches(0.8)
    s.left_margin = Inches(0.8)
    s.right_margin = Inches(0.8)

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=80, bottom=80, left=120, right=120):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_table(headers, data, col_widths=None, header_bg="1A365D", alt_bg="F7FAFC"):
    table = doc.add_table(rows=len(data) + 1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    # Header Row
    hdr_cells = table.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].text = title
        set_cell_background(hdr_cells[i], header_bg)
        set_cell_margins(hdr_cells[i], top=100, bottom=100, left=120, right=120)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)
            run.font.size = Pt(10)
            run.font.name = 'TH Sarabun New'

    # Data Rows
    for row_idx, row_data in enumerate(data):
        row_cells = table.rows[row_idx + 1].cells
        bg_color = alt_bg if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate(row_data):
            row_cells[col_idx].text = str(text)
            set_cell_background(row_cells[col_idx], bg_color)
            set_cell_margins(row_cells[col_idx], top=60, bottom=60, left=100, right=100)
            p = row_cells[col_idx].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.size = Pt(9.5)
                run.font.name = 'TH Sarabun New'

    if col_widths:
        for row in table.rows:
            for idx, width in enumerate(col_widths):
                row.cells[idx].width = Inches(width)

    doc.add_paragraph()

def add_h(text, level=1):
    h = doc.add_heading(text, level=level)
    h.paragraph_format.space_before = Pt(12)
    h.paragraph_format.space_after = Pt(4)
    run = h.runs[0]
    run.font.name = 'TH Sarabun New'
    if level == 1:
        run.font.size = Pt(16)
        run.font.bold = True
        run.font.color.rgb = RGBColor(26, 54, 93)
    elif level == 2:
        run.font.size = Pt(13)
        run.font.bold = True
        run.font.color.rgb = RGBColor(43, 108, 176)
    elif level == 3:
        run.font.size = Pt(11)
        run.font.bold = True
        run.font.color.rgb = RGBColor(45, 55, 72)
    return h

def add_p(text, bold=False, italic=False, color=None):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    run = p.add_run(text)
    run.font.name = 'TH Sarabun New'
    run.font.size = Pt(11)
    run.font.bold = bold
    run.font.italic = italic
    if color:
        run.font.color.rgb = color
    return p

def add_sql(code_text):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    set_cell_background(cell, "EDF2F7")
    set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
    
    cp = cell.paragraphs[0]
    cp.paragraph_format.space_before = Pt(2)
    cp.paragraph_format.space_after = Pt(2)
    run = cp.add_run(code_text)
    run.font.name = 'Consolas'
    run.font.size = Pt(8.5)
    run.font.color.rgb = RGBColor(45, 55, 72)
    doc.add_paragraph()

# Document Title / Cover Header
title_p = doc.add_paragraph()
title_p.paragraph_format.space_before = Pt(24)
title_p.paragraph_format.space_after = Pt(6)
title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
trun = title_p.add_run("คู่มือมาตรฐานชุดข้อมูลสุขภาพผู้สูงอายุ (Data Set Specification)\nพร้อมโครงสร้างฟิลด์จาก 43 แฟ้ม และเงื่อนไขการประมวลผล (Conditions)")
trun.font.name = 'TH Sarabun New'
trun.font.size = Pt(20)
trun.font.bold = True
trun.font.color.rgb = RGBColor(26, 54, 93)

sub_p = doc.add_paragraph()
sub_p.paragraph_format.space_before = Pt(0)
sub_p.paragraph_format.space_after = Pt(16)
sub_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
srun = sub_p.add_run("สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ กรมการแพทย์ กระทรวงสาธารณสุข\nเชื่อมโยงระบบข้อมูล 43 แฟ้มมาตรฐานกระทรวงสาธารณสุข และเครื่องมือ DMS Care Tools")
srun.font.name = 'TH Sarabun New'
srun.font.size = Pt(12)
srun.font.italic = True
srun.font.color.rgb = RGBColor(74, 85, 104)

doc.add_paragraph().paragraph_format.space_after = Pt(8)

# Section 0: Revision Summary
add_h("สรุปผลการปรับปรุงและตรวจสอบความครบถ้วนของข้อมูล (Executive Revision Notes)", level=1)
add_p("1. การตรวจสอบและปรับแก้รหัสที่คลาดเคลื่อน: ปรับแก้รหัส E162 ในเอกสารเดิมที่ระบุเป็นเบาหวานชนิดที่ 2 ซึ่งตามมาตรฐาน ICD-10 สากลและ ICD-10-TM ของกระทรวงสาธารณสุข รหัส E16.2 คือ Hypoglycaemia, unspecified ส่วนเบาหวานชนิดที่ 2 คือกลุ่มรหัส E11 (E11.0 – E11.9)")
add_p("2. การจัดระบบรหัส Dagger & Asterisk (+/*): จัดคู่รหัสสาเหตุและอาการแสดงในกลุ่มโรคสมองเสื่อมให้ถูกต้อง เช่น F00.0 คู่กับ G30.0*, F02.0 คู่กับ G31.0*, F02.3 คู่กับ G20*")
add_p("3. การบรรจุรหัสที่ขอเพิ่มเติมเข้าสู่ระบบอย่างครบถ้วน:")
add_p("   • Stroke (ICD-10: I60 – I69): แยกกลุ่มเฉียบพลัน (I60-I64) และกลุ่มเรื้อรัง/ผลตกค้าง (I65-I69)")
add_p("   • STEMI (ICD-10: I21.0 – I21.3): กล้ามเนื้อหัวใจตายเฉียบพลันชนิด ST-elevation แยกตามผนังหัวใจ")
add_p("   • Fall (ICD-10: W00 – W19): สาเหตุภายนอกของการหกล้ม (DIAGTYPE = '5')")
add_p("   • Hip Fracture (ICD-10: S72, S72.0 – S72.9): กระดูกสะโพกหักจากการล้ม (DIAGTYPE = '1')")
add_p("4. การเพิ่มส่วนเงื่อนไข (Conditions & Business Rules) ครบทั้ง 16 หมวด พร้อมระบุโครงสร้างฟิลด์จาก 43 แฟ้มอย่างละเอียด")

doc.save("c:/Users/Piyanut/Desktop/Code_Work/docs/Elderly_Health_Dataset_Specification_and_Conditions.docx")
print("Base Word document created")
