import io
import json
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from sqlalchemy.orm import Session
from ..models import AttendeePublic, AttendeeMedical, AttendeeAsean

def generate_attendees_excel(db: Session) -> io.BytesIO:
    wb = openpyxl.Workbook()
    # Remove default sheet
    wb.remove(wb.active)
    
    # Styles
    header_fill = PatternFill(start_color="1B4D3E", end_color="1B4D3E", fill_type="solid")
    header_font = Font(name="Sarabun", size=11, bold=True, color="FFFFFF")
    data_font = Font(name="Sarabun", size=10)
    thin_border = Border(
        left=Side(style='thin', color='DDDDDD'),
        right=Side(style='thin', color='DDDDDD'),
        top=Side(style='thin', color='DDDDDD'),
        bottom=Side(style='thin', color='DDDDDD')
    )
    
    # ----------------------------------------------------
    # Sheet 1: ประชาชนทั่วไป / ผู้สูงอายุ
    # ----------------------------------------------------
    ws1 = wb.create_sheet(title="ประชาชนทั่วไปและผู้สูงอายุ")
    headers1 = [
        "ลำดับ", "รหัสลงทะเบียน", "คำนำหน้า", "ชื่อ-นามสกุล", "อายุ (ปี)",
        "ที่อยู่", "ตำบล", "อำเภอ", "จังหวัด", "เบอร์โทรศัพท์", "อีเมล",
        "สิ่งที่สนใจเข้าร่วม", "วันที่ลงทะเบียน", "แก้ไขล่าสุด"
    ]
    ws1.append(headers1)
    
    public_rows = db.query(AttendeePublic).order_by(AttendeePublic.id.asc()).all()
    for idx, r in enumerate(public_rows, start=1):
        interests_list = []
        try:
            interests_list = json.loads(r.interests) if r.interests else []
        except:
            pass
        ws1.append([
            idx,
            r.registration_code,
            r.title,
            r.full_name,
            r.age,
            r.address,
            r.tambon,
            r.amphoe,
            r.province,
            r.phone or "-",
            r.email or "-",
            ", ".join(interests_list),
            r.created_at.strftime("%Y-%m-%d %H:%M:%S") if r.created_at else "",
            r.updated_at.strftime("%Y-%m-%d %H:%M:%S") if r.updated_at else ""
        ])
        
    # ----------------------------------------------------
    # Sheet 2: บุคลากรทางการแพทย์และสาธารณสุข
    # ----------------------------------------------------
    ws2 = wb.create_sheet(title="บุคลากรทางการแพทย์")
    headers2 = [
        "ลำดับ", "รหัสลงทะเบียน", "คำนำหน้า", "ชื่อ-นามสกุล", "ตำแหน่ง",
        "ตำแหน่งอื่น (ระบุ)", "เลขขอหน่วยกิตพยาบาล", "หน่วยงาน", "เขตบริการสุขภาพ",
        "จังหวัด", "อำเภอ", "ตำบล", "เบอร์โทรศัพท์", "อีเมล",
        "สิ่งที่สนใจเข้าร่วม", "วันที่ลงทะเบียน", "แก้ไขล่าสุด"
    ]
    ws2.append(headers2)
    
    med_rows = db.query(AttendeeMedical).order_by(AttendeeMedical.id.asc()).all()
    for idx, r in enumerate(med_rows, start=1):
        interests_list = []
        try:
            interests_list = json.loads(r.interests) if r.interests else []
        except:
            pass
        ws2.append([
            idx,
            r.registration_code,
            r.title,
            r.full_name,
            r.position,
            r.position_other or "-",
            r.nursing_license_no or "-",
            r.organization,
            r.health_region,
            r.province,
            r.amphoe,
            r.tambon,
            r.phone or "-",
            r.email or "-",
            ", ".join(interests_list),
            r.created_at.strftime("%Y-%m-%d %H:%M:%S") if r.created_at else "",
            r.updated_at.strftime("%Y-%m-%d %H:%M:%S") if r.updated_at else ""
        ])
        
    # ----------------------------------------------------
    # Sheet 3: ASEAN Member States
    # ----------------------------------------------------
    ws3 = wb.create_sheet(title="ASEAN Delegates")
    headers3 = [
        "No.", "Registration Code", "Country", "Country (Other)", "Title",
        "Title (Other)", "First Name", "Last Name", "Full Name", "Gender",
        "Position", "Organization", "Telephone", "E-Mail", "Registration Date", "Last Updated"
    ]
    ws3.append(headers3)
    
    asean_rows = db.query(AttendeeAsean).order_by(AttendeeAsean.id.asc()).all()
    for idx, r in enumerate(asean_rows, start=1):
        ws3.append([
            idx,
            r.registration_code,
            r.country,
            r.country_other or "-",
            r.title,
            r.title_other or "-",
            r.first_name,
            r.last_name,
            r.full_name,
            r.gender,
            r.position,
            r.organization,
            r.phone,
            r.email,
            r.created_at.strftime("%Y-%m-%d %H:%M:%S") if r.created_at else "",
            r.updated_at.strftime("%Y-%m-%d %H:%M:%S") if r.updated_at else ""
        ])
        
    # Apply styling & auto column width to all sheets
    for ws in [ws1, ws2, ws3]:
        # Format Header row
        for cell in ws[1]:
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = Alignment(horizontal="center", vertical="center")
        
        # Format Data rows
        for row in ws.iter_rows(min_row=2):
            for cell in row:
                cell.font = data_font
                cell.border = thin_border
                if cell.column in [1, 2, 5]: # Index, Code, Age
                    cell.alignment = Alignment(horizontal="center", vertical="center")
                else:
                    cell.alignment = Alignment(vertical="center")
                    
        # Column auto-width
        for col in ws.columns:
            max_len = max(len(str(cell.value or '')) for cell in col)
            col_letter = get_column_letter(col[0].column)
            ws.column_dimensions[col_letter].width = max(max_len + 4, 12)
            
    stream = io.BytesIO()
    wb.save(stream)
    stream.seek(0)
    return stream
