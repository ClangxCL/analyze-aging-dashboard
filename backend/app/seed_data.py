import datetime
from passlib.context import CryptContext
from .config import settings
from .database import engine, Base, SessionLocal
from .models import (
    AdminUser, EventBanner, EventScheduleSlide, EventDocument,
    AttendeePublic, AttendeeMedical, AttendeeAsean, AuditLog
)

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def init_and_seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # 1. Seed Admin User
    if not db.query(AdminUser).filter(AdminUser.username == "admin").first():
        admin = AdminUser(
            username="admin",
            hashed_password=pwd_context.hash("forum2026"),
            full_name="นพ.สมศักดิ์ วัฒนาเจริญ (ผู้ดูแลระบบกลาง กรมการแพทย์)",
            role="superadmin"
        )
        db.add(admin)
        print("Seeded default admin user: admin / forum2026")
        
    # 2. Seed Official Banners (1920x1080)
    if db.query(EventBanner).count() == 0:
        b1 = EventBanner(
            title="แบนเนอร์หลัก มหกรรมสุขภาพผู้สูงอายุแห่งชาติ ครั้งที่ 6 (1920x1080)",
            image_url="/assets/Banner_Forum6_Official.png",
            dimensions="1920x1080",
            display_order=1,
            is_active=True
        )
        db.add(b1)
        print("Seeded default event banners.")
        
    # 3. Seed A4 Vertical Schedule Slides
    if db.query(EventScheduleSlide).count() == 0:
        s1 = EventScheduleSlide(
            title="กำหนดการวันที่ 1: พิธีเปิดและการเสวนาวิชาการระดับนานาชาติ (Sapphire 204)",
            image_url="/assets/schedule_day1_2026.svg",
            page_number=1,
            is_active=True
        )
        s2 = EventScheduleSlide(
            title="กำหนดการวันที่ 2: นวัตกรรมเวชศาสตร์และเวิร์กช็อปผู้สูงวัยสุขภาพดี (Sapphire 205)",
            image_url="/assets/schedule_day2_2026.svg",
            page_number=2,
            is_active=True
        )
        db.add_all([s1, s2])
        print("Seeded default A4 schedule slides.")
        
    # 4. Seed Documents (Accommodation & Event Materials)
    if db.query(EventDocument).count() == 0:
        d1 = EventDocument(
            category="accommodation",
            title="แบบฟอร์มการสำรองห้องพักและคำแนะนำโรงแรมใกล้งาน (Accommodation Booking Form)",
            description="สำหรับบุคลากรทางการแพทย์และผู้แทนอาเซียนในการจองห้องพักเครือโรงแรม อิมแพค เมืองทองธานี พร้อมอัตราส่วนลดพิเศษ",
            file_name="Forum6_Hotel_Reservation_Form.pdf",
            file_path="Forum6_Hotel_Reservation_Form.pdf",
            file_size_bytes=425000,
            upload_date=datetime.datetime.utcnow(),
            is_active=True
        )
        d2 = EventDocument(
            category="event_material",
            title="เอกสารประกอบการประชุมวิชาการ เวชศาสตร์และวิทยาการด้านผู้สูงอายุ",
            description="สรุปหัวข้อบรรยาย รายนามวิทยากร และกรอบทิศทางการดูแลสุขภาพผู้สูงวัยระยะยาว 2570",
            file_name="Forum6_Academic_Handbook.pdf",
            file_path="Forum6_Academic_Handbook.pdf",
            file_size_bytes=1850000,
            upload_date=datetime.datetime.utcnow(),
            is_active=True
        )
        d3 = EventDocument(
            category="event_material",
            title="คู่มือแนวทางการขอรับหน่วยกิตการศึกษาต่อเนื่องสาขาพยาบาลศาสตร์ (CNEU)",
            description="เงื่อนไขและข้อกำหนดการบันทึกชั่วโมงหน่วยกิตสำหรับพยาบาลวิชาชีพที่เข้าร่วมงาน",
            file_name="Nursing_CE_Credit_Guideline.pdf",
            file_path="Nursing_CE_Credit_Guideline.pdf",
            file_size_bytes=312000,
            upload_date=datetime.datetime.utcnow(),
            is_active=True
        )
        db.add_all([d1, d2, d3])
        print("Seeded default event documents.")
        
    # 5. Seed Sample Attendees for realistic dashboard metrics
    if db.query(AttendeePublic).count() == 0:
        sample_public = [
            AttendeePublic(
                registration_code=f"PUB-{settings.EVENT_YEAR}-0001",
                title="นาย",
                full_name="บุญมี สุขสวัสดิ์",
                age=67,
                address="45/2 หมู่ 3",
                province="นนทบุรี",
                amphoe="เมืองนนทบุรี",
                tambon="บางกระสอ",
                phone="081-456-7890",
                email="boonmee@email.com",
                interests='["พิธีเปิดและเสวนาช่วงเช้า", "ชมนิทรรศการ/บูธ"]'
            ),
            AttendeePublic(
                registration_code=f"PUB-{settings.EVENT_YEAR}-0002",
                title="นาง",
                full_name="วรรณา สดใส",
                age=72,
                address="89 ซอยติวานนท์ 14",
                province="นนทบุรี",
                amphoe="ปากเกร็ด",
                tambon="บางพูด",
                phone="089-234-5678",
                interests='["ชมนิทรรศการ/บูธ", "การเสวนาวิชาการ ห้องสังคม เศรษฐกิจและสิ่งแวดล้อม"]'
            ),
            AttendeePublic(
                registration_code=f"PUB-{settings.EVENT_YEAR}-0003",
                title="นางสาว",
                full_name="กมลวรรณ ชัยเจริญ",
                age=62,
                address="12/8 ถนนสุขุมวิท 71",
                province="กรุงเทพมหานคร",
                amphoe="วัฒนา",
                tambon="คลองตันเหนือ",
                phone="086-789-0123",
                email="kamonwan@email.com",
                interests='["การเสวนาวิชาการ ห้องบุคลาการทางการแพทย์และสาธารณสุข"]'
            )
        ]
        db.add_all(sample_public)
        
    if db.query(AttendeeMedical).count() == 0:
        sample_medical = [
            AttendeeMedical(
                registration_code=f"MED-{settings.EVENT_YEAR}-0001",
                title="พยาบาล",
                full_name="พว. นฤมล เกียรติสกุล",
                position="พยาบาล",
                nursing_license_no="62145892",
                organization="โรงพยาบาลศิริราช",
                health_region="เขตสุขภาพที่ 13 (กทม.)",
                province="กรุงเทพมหานคร",
                amphoe="บางกอกน้อย",
                tambon="ศิริราช",
                phone="085-112-3344",
                email="narumon.k@hospital.go.th",
                interests='["การเสวนาวิชาการ ห้องบุคลาการทางการแพทย์และสาธารณสุข"]'
            ),
            AttendeeMedical(
                registration_code=f"MED-{settings.EVENT_YEAR}-0002",
                title="นาย",
                full_name="นพ. กิตติศักดิ์ พรหมดี",
                position="แพทย์",
                organization="โรงพยาบาลศูนย์ขอนแก่น",
                health_region="เขตสุขภาพที่ 7",
                province="ขอนแก่น",
                amphoe="เมืองขอนแก่น",
                tambon="ในเมือง",
                phone="084-556-7788",
                email="dr.kittisak@khonkaenhosp.org",
                interests='["การเสวนาวิชาการ ห้อง International (ต่างประเทศ)", "การเสวนาวิชาการ ห้องบุคลาการทางการแพทย์และสาธารณสุข"]'
            ),
            AttendeeMedical(
                registration_code=f"MED-{settings.EVENT_YEAR}-0003",
                title="นาง",
                full_name="สุจิตรา วงศ์สว่าง",
                position="นักกายภาพ",
                organization="โรงพยาบาลลำปาง",
                health_region="เขตสุขภาพที่ 1",
                province="ลำปาง",
                amphoe="เมืองลำปาง",
                tambon="หัวเวียง",
                phone="081-998-7766",
                email="sujitra.pt@lampang.go.th",
                interests='["ชมนิทรรศการ/บูธ"]'
            )
        ]
        db.add_all(sample_medical)
        
    if db.query(AttendeeAsean).count() == 0:
        sample_asean = [
            AttendeeAsean(
                registration_code=f"ASN-{settings.EVENT_YEAR}-0001",
                country="Singapore",
                title="Dr.",
                first_name="Hwee Ling",
                last_name="Tan",
                full_name="Hwee Ling Tan",
                gender="Female",
                position="Senior Consultant, Geriatric Medicine",
                organization="Singapore General Hospital",
                phone="+65 6321 4311",
                email="tan.hwee.ling@sgh.com.sg"
            ),
            AttendeeAsean(
                registration_code=f"ASN-{settings.EVENT_YEAR}-0002",
                country="Malaysia",
                title="Prof.",
                first_name="Ahmad",
                last_name="Razali",
                full_name="Ahmad Razali",
                gender="Male",
                position="Dean, Faculty of Health Sciences",
                organization="Universiti Malaya",
                phone="+60 3 7967 4922",
                email="ahmad.razali@um.edu.my"
            )
        ]
        db.add_all(sample_asean)
        
    db.commit()
    db.close()
    print("Database seeding completed.")

if __name__ == "__main__":
    init_and_seed()
