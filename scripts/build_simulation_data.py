# -*- coding: utf-8 -*-
import json
import os

os.makedirs(r'C:\Users\Piyanut\Desktop\Code_Work\elderly_forum_simulation\data', exist_ok=True)

booths = [
    # Top Row (Facing South)
    {
        'id': 'P05',
        'code': 'P05',
        'title': 'Wellness Service สำหรับผู้สูงอายุ ตรวจคัดกรองอัลไซเมอร์และมะเร็งลำไส้ใหญ่',
        'agency': 'Bangkok Genomics Innovation (BGI)',
        'category': 'partner',
        'category_th': 'บูธเอกชน / ภาคี',
        'units': 2,
        'dimensions': '4 x 2 เมตร',
        'services': [
            'บริการตรวจคัดกรองความเสี่ยงโรคอัลไซเมอร์ (Alzheimer) ทางพันธุกรรม',
            'บริการตรวจคัดกรองมะเร็งลำไส้ใหญ่และทวารหนักเบื้องต้น',
            'ให้คำปรึกษาเวชศาสตร์ฟื้นฟูระดับพันธุกรรมสำหรับผู้สูงอายุ'
        ],
        'equipment': ['ชุดตรวจทางพันธุกรรม', 'เคาน์เตอร์ให้คำปรึกษา', 'จอ LED นำเสนอข้อมูล', 'Roll up 2 อัน'],
        'electrical_needs': 'ปลั๊กไฟ 2 จุด (500W)',
        'power_watts': 500,
        'quota_morning': 25,
        'quota_afternoon': 25,
        'quota_total': 50,
        'avg_service_time_mins': 8,
        'color': '#E67E22',
        'layout': {'row': 'top', 'col': 1, 'x': 14.0, 'y': 2.0, 'w': 4.0, 'h': 2.0, 'facing': 'S'}
    },
    {
        'id': 'A18',
        'code': 'A18',
        'title': 'นวัตกรรมชีววิทยาศาสตร์เพื่อผู้สูงอายุ รากฟันเทียม ถุงทวารเทียม ชุดตรวจพยาธิใบไม้ตับ',
        'agency': 'ศูนย์ความเป็นเลิศด้านชีววิทยาศาสตร์ (องค์การมหาชน) - TCELS',
        'category': 'academic',
        'category_th': 'บูธวิชาการ',
        'units': 2,
        'dimensions': '4 x 2 เมตร',
        'services': [
            'จัดแสดงรากฟันเทียมมาตรฐานสากลราคาเข้าถึงได้สำหรับผู้สูงวัย',
            'สาธิตถุงทวารเทียมคุณภาพสูงสำหรับผู้ป่วยผ่าตัดลำไส้',
            'ชุดตรวจคัดกรองพยาธิใบไม้ตับป้องกันมะเร็งท่อน้ำดี'
        ],
        'equipment': ['โมเดลรากฟันเทียม', 'ชุดสาธิตถุงทวารเทียม', 'ชุดตรวจพยาธิใบไม้ตับ', 'แผ่นพับวิชาการ'],
        'electrical_needs': 'ปลั๊กไฟ 1 จุด (300W)',
        'power_watts': 300,
        'quota_morning': None,
        'quota_afternoon': None,
        'quota_total': None,
        'avg_service_time_mins': 5,
        'color': '#2980B9',
        'layout': {'row': 'top', 'col': 2, 'x': 18.0, 'y': 2.0, 'w': 4.0, 'h': 2.0, 'facing': 'S'}
    },
    {
        'id': 'P07',
        'code': 'P07',
        'title': 'อุปกรณ์ออกกำลังกายและฝึกบริหารกล้ามเนื้อผู้สูงอายุ HUR ฟินแลนด์',
        'agency': 'บริษัท เอเอสจี เวลเนส แอนด์ อินโนเวชั่น จำกัด (ASG Wellness)',
        'category': 'partner',
        'category_th': 'บูธเอกชน / ภาคี',
        'units': 2,
        'dimensions': '4 x 2 เมตร',
        'services': [
            'ทดสอบและฝึกบริหารกล้ามเนื้อระบบแรงดันลม (Pneumatic) เทคโนโลยีฟินแลนด์',
            'ประเมินความแข็งแรงและความสมดุลกล้ามเนื้อด้วย Smart Card',
            'สาธิตการออกกำลังกายสำหรับผู้สูงอายุและผู้ใช้วีลแชร์'
        ],
        'equipment': ['เครื่องออกกำลังกาย HUR ฟินแลนด์ 2 เครื่อง', 'แท่นประเมินกล้ามเนื้อ', 'Roll up 2 อัน', 'โน้ตบุ๊ก'],
        'electrical_needs': 'ปลั๊กไฟ 2 จุด (1200W)',
        'power_watts': 1200,
        'quota_morning': 30,
        'quota_afternoon': 30,
        'quota_total': 60,
        'avg_service_time_mins': 7,
        'color': '#E67E22',
        'layout': {'row': 'top', 'col': 3, 'x': 22.0, 'y': 2.0, 'w': 4.0, 'h': 2.0, 'facing': 'S'}
    },
    {
        'id': 'S13',
        'code': 'S13',
        'title': 'บริการจัดหางานและส่งเสริมการมีงานทำของผู้สูงอายุ',
        'agency': 'กรมการจัดหางาน กระทรวงแรงงาน',
        'category': 'service',
        'category_th': 'บูธบริการประชาชน',
        'units': 1,
        'dimensions': '2 x 2 เมตร',
        'services': [
            'รับลงทะเบียนผู้สูงอายุที่ประสงค์จะทำงาน',
            'จับคู่งานและแนะนำตำแหน่งงานที่เหมาะสมกับสุขภาพและวัย',
            'ให้คำปรึกษาการประกอบอาชีพอิสระและสิทธิประโยชน์แรงงานสูงอายุ'
        ],
        'equipment': ['คอมพิวเตอร์ระบบจัดหางาน 1 ชุด', 'เอกสารตำแหน่งงานว่าง', 'Roll up 2 อัน'],
        'electrical_needs': 'ปลั๊กไฟ 1 จุด (400W)',
        'power_watts': 400,
        'quota_morning': 40,
        'quota_afternoon': 40,
        'quota_total': 80,
        'avg_service_time_mins': 5,
        'color': '#27AE60',
        'layout': {'row': 'top', 'col': 4, 'x': 26.0, 'y': 2.0, 'w': 2.0, 'h': 2.0, 'facing': 'S'}
    },
    {
        'id': 'S07',
        'code': 'S07',
        'title': 'ตรวจวิเคราะห์สภาพผิว และแจกผลิตภัณฑ์ตำรับสถาบันโรคผิวหนัง',
        'agency': 'สถาบันโรคผิวหนัง กรมการแพทย์',
        'category': 'service',
        'category_th': 'บูธบริการประชาชน',
        'units': 3,
        'dimensions': '6 x 2 เมตร',
        'services': [
            'ตรวจวิเคราะห์ความชุ่มชื้น เม็ดสี และรอยโรคผิวหนังผู้สูงอายุด้วยกล้องความละเอียดสูง',
            'ให้คำปรึกษาโรคผิวหนังที่พบบ่อยในผู้สูงอายุ ผิวแห้งคัน แผลเรื้อรัง',
            'แจกผลิตภัณฑ์ตำรับสถาบันโรคผิวหนังสูตรเฉพาะผู้สูงวัย'
        ],
        'equipment': ['ชุดเครื่องตรวจวิเคราะห์สภาพผิว (PC + กล้อง + ที่วางกล้อง)', 'โน้ตบุ๊ก 1 เครื่อง', 'ผลิตภัณฑ์ยาและเวชสำอาง'],
        'electrical_needs': 'ปลั๊กไฟ 2 จุด (800W)',
        'power_watts': 800,
        'quota_morning': 30,
        'quota_afternoon': 40,
        'quota_total': 70,
        'avg_service_time_mins': 8,
        'color': '#27AE60',
        'layout': {'row': 'top', 'col': 5, 'x': 28.0, 'y': 2.0, 'w': 6.0, 'h': 2.0, 'facing': 'S'}
    },
    {
        'id': 'S05',
        'code': 'S05',
        'title': 'ตรวจคัดกรองสมองเสื่อม ตรวจมวลกระดูก ฝึกสมอง VR และ Eye Movement',
        'agency': 'สถาบันประสาทวิทยา กรมการแพทย์',
        'category': 'service',
        'category_th': 'บูธบริการประชาชน',
        'units': 3,
        'dimensions': '6 x 2 เมตร',
        'services': [
            'ตรวจวัดความหนาแน่นมวลกระดูกด้วยเครื่อง Ultrasound Bone Densitometer',
            'ฝึกสมองและกระตุ้นการรับรู้ในโลกเสมือนจริงด้วยแว่น VR',
            'ฝึกการตอบสนองของระบบประสาทผ่านเครื่อง Eye Movement Trainer',
            'คัดกรองภาวะสมองเสื่อมเบื้องต้นและพิมพ์ผลตรวจพร้อมให้คำแนะนำ'
        ],
        'equipment': ['เครื่องตรวจวัดมวลกระดูก 1 เครื่อง', 'โน้ตบุ๊ก 1 เครื่อง', 'Roll up 6 อัน', 'เครื่อง VR 1 เครื่อง', 'เครื่อง Eye movement', 'ปริ้นเตอร์ 1 เครื่อง'],
        'electrical_needs': 'ปลั๊กไฟ 3 จุด (1500W)',
        'power_watts': 1500,
        'quota_morning': 30,
        'quota_afternoon': 20,
        'quota_total': 50,
        'avg_service_time_mins': 10,
        'color': '#27AE60',
        'layout': {'row': 'top', 'col': 6, 'x': 36.0, 'y': 2.0, 'w': 6.0, 'h': 2.0, 'facing': 'S'}
    },
    {
        'id': 'A01',
        'code': 'A01',
        'title': 'โภชนาการ Good food Good brain Good life & PT/OT Brain Body Balance Booster',
        'agency': 'โรงพยาบาลประสาทเชียงใหม่ กรมการแพทย์',
        'category': 'academic',
        'category_th': 'บูธวิชาการ',
        'units': 2,
        'dimensions': '4 x 2 เมตร',
        'services': [
            'ทดสอบและฟื้นฟูสมรรถภาพกายและสมอง PT/OT',
            'สาธิตเครื่องเล่นเกมส์ฝึกสมอง Nintendo Wii & Balance Board',
            'สาธิตเครื่อง Neoflect Cognition วิเคราะห์ความจำและการตัดสินใจ'
        ],
        'equipment': ['Roll up 2 อัน', 'จอทีวีและเครื่องเล่นเกม Wii 1 ชุด', 'เครื่อง Neoflect Cognition 1 เครื่อง', 'โต๊ะวางของ 2 ตัว โต๊ะวางเครื่อง 1 ตัว'],
        'electrical_needs': 'ปลั๊กไฟ 2 จุด (900W)',
        'power_watts': 900,
        'quota_morning': None,
        'quota_afternoon': None,
        'quota_total': None,
        'avg_service_time_mins': 6,
        'color': '#2980B9',
        'layout': {'row': 'top', 'col': 7, 'x': 44.0, 'y': 2.0, 'w': 4.0, 'h': 2.0, 'facing': 'S'}
    },

    # East Wall Upper (Facing West)
    {
        'id': 'S01',
        'code': 'S01',
        'title': 'ตรวจคัดกรองจอประสาทตาด้วย AI และวัดความแข็งหลอดเลือดแดงส่วนปลาย (CAVI)',
        'agency': 'โรงพยาบาลราชวิถี กรมการแพทย์',
        'category': 'service',
        'category_th': 'บูธบริการประชาชน',
        'units': 3,
        'dimensions': '2 x 6 เมตร (แนวตั้ง)',
        'services': [
            'ถ่ายภาพและคัดกรองเบาหวานขึ้นจอตาและจุดรับภาพเสื่อมด้วยระบบ AI Fundus',
            'ตรวจวัดดัชนีความแข็งตัวของหลอดเลือดแดงส่วนปลายด้วยเครื่อง CAVI',
            'ตรวจวัดความดันโลหิตและชีพจร คัดกรองความเสี่ยงโรคหลอดเลือดสมองและหัวใจ'
        ],
        'equipment': [
            'เครื่อง Fundus Camera ตรวจจอตา + คอมพิวเตอร์ AI + จอโทรทัศน์',
            'เครื่อง CAVI วัดความแข็งหลอดเลือด + เตียงนอนตรวจ + ปริ้นเตอร์ผลตรวจ'
        ],
        'electrical_needs': 'ปลั๊กไฟ 4 จุด (1600W)',
        'power_watts': 1600,
        'quota_morning': 30,
        'quota_afternoon': 30,
        'quota_total': 60,
        'avg_service_time_mins': 12,
        'color': '#27AE60',
        'layout': {'row': 'east_wall_north', 'col': 1, 'x': 52.0, 'y': 5.0, 'w': 2.0, 'h': 6.0, 'facing': 'W'}
    },

    # Middle-Left Island (North side facing North, South side facing South)
    {
        'id': 'P02',
        'code': 'P02',
        'title': 'สัตว์เลี้ยงบำบัดและสุขภาพใจผู้สูงอายุ',
        'agency': 'มูลนิธิเพื่อสุนัขในซอย (Soi Dog Foundation)',
        'category': 'partner',
        'category_th': 'บูธเอกชน / ภาคี',
        'units': 1,
        'dimensions': '2 x 2 เมตร',
        'services': [
            'ให้ความรู้สัตว์เลี้ยงบำบัด (Pet Therapy) ลดภาวะซึมเศร้าในผู้สูงอายุ',
            'คำแนะนำการเลี้ยงและดูแลสัตว์เลี้ยงอย่างปลอดภัยถูกสุขอนามัยในวัยชรา'
        ],
        'equipment': ['Roll up 2 อัน', 'แผ่นพับความรู้', 'ของที่ระลึก'],
        'electrical_needs': 'ปลั๊กไฟ 1 จุด (200W)',
        'power_watts': 200,
        'quota_morning': None,
        'quota_afternoon': None,
        'quota_total': None,
        'avg_service_time_mins': 4,
        'color': '#E67E22',
        'layout': {'row': 'mid_left_n', 'col': 1, 'x': 2.0, 'y': 10.5, 'w': 2.0, 'h': 2.0, 'facing': 'N'}
    },
    {
        'id': 'A16',
        'code': 'A16',
        'title': 'การสร้างเสริมสุขภาวะระยะท้าย การตายดี และการทำ Living Will (มาตรา 12)',
        'agency': 'สำนักงานคณะกรรมการสุขภาพแห่งชาติ (สช.)',
        'category': 'academic',
        'category_th': 'บูธวิชาการ',
        'units': 2,
        'dimensions': '4 x 2 เมตร',
        'services': [
            'ให้คำปรึกษาการทำหนังสือแสดงเจตนาปฏิเสธการรักษาพยาบาล (Living Will มาตรา 12)',
            'แนวทางการดูแลผู้ป่วยระยะสุดท้ายแบบประคับประคอง (Palliative Care)',
            'คู่มือเตรียมความพร้อมครอบครัวเพื่อการจากไปอย่างสงบและสมศักดิ์ศรี'
        ],
        'equipment': ['เอกสารแบบฟอร์ม Living Will', 'Roll up 3 อัน', 'เคาน์เตอร์ให้คำปรึกษา'],
        'electrical_needs': 'ปลั๊กไฟ 1 จุด (300W)',
        'power_watts': 300,
        'quota_morning': None,
        'quota_afternoon': None,
        'quota_total': None,
        'avg_service_time_mins': 10,
        'color': '#2980B9',
        'layout': {'row': 'mid_left_n', 'col': 2, 'x': 4.0, 'y': 10.5, 'w': 4.0, 'h': 2.0, 'facing': 'N'}
    },
    {
        'id': 'P08',
        'code': 'P08',
        'title': 'AGYHERO ธุรกิจดูแลผู้สูงอายุดิจิทัลครบวงจร',
        'agency': 'AGYHERO Platform',
        'category': 'partner',
        'category_th': 'บูธเอกชน / ภาคี',
        'units': 1,
        'dimensions': '2 x 2 เมตร',
        'services': [
            'แพลตฟอร์มจับคู่ผู้ดูแลผู้สูงอายุ (Caregiver Matching)',
            'ระบบติดตามสุขภาพทางไกลและระบบแจ้งเตือนฉุกเฉินสำหรับผู้สูงวัย',
            'หลักสูตรฝึกอบรมผู้ดูแลมืออาชีพมาตรฐานสากล'
        ],
        'equipment': ['Tablet นำเสนอแพลตฟอร์ม', 'จอ TV 43 นิ้ว', 'Roll up 2 อัน'],
        'electrical_needs': 'ปลั๊กไฟ 2 จุด (400W)',
        'power_watts': 400,
        'quota_morning': None,
        'quota_afternoon': None,
        'quota_total': None,
        'avg_service_time_mins': 5,
        'color': '#E67E22',
        'layout': {'row': 'mid_left_s', 'col': 1, 'x': 2.0, 'y': 12.5, 'w': 2.0, 'h': 2.0, 'facing': 'S'}
    },
    {
        'id': 'P04',
        'code': 'P04',
        'title': 'โครงการ Happy Money สุขเงินสร้างได้ วางแผนการเงินวัยเกษียณ',
        'agency': 'ตลาดหลักทรัพย์แห่งประเทศไทย (SET)',
        'category': 'partner',
        'category_th': 'บูธเอกชน / ภาคี',
        'units': 1,
        'dimensions': '2 x 2 เมตร',
        'services': [
            'บริการตรวจสุขภาพทางการเงินและวิเคราะห์ความพอเพียงของเงินออม',
            'เครื่องมือคำนวณเงินเพื่อการเกษียณและจัดสรรพอร์ตลงทุนลดความเสี่ยง',
            'แจกคู่มือ Happy Money สุขเงินสร้างได้'
        ],
        'equipment': ['คอมพิวเตอร์คำนวณพอร์ตเกษียณ', 'นิทรรศการวางแผนการเงิน', 'คู่มือ Happy Money'],
        'electrical_needs': 'ปลั๊กไฟ 1 จุด (400W)',
        'power_watts': 400,
        'quota_morning': None,
        'quota_afternoon': None,
        'quota_total': None,
        'avg_service_time_mins': 8,
        'color': '#E67E22',
        'layout': {'row': 'mid_left_s', 'col': 2, 'x': 4.0, 'y': 12.5, 'w': 2.0, 'h': 2.0, 'facing': 'S'}
    },
    {
        'id': 'P03',
        'code': 'P03',
        'title': 'การจ้างงานผู้สูงอายุ โครงการพี่ใหญ่ไฟแรง',
        'agency': 'บิ๊กซี ซูเปอร์เซ็นเตอร์ (Big C)',
        'category': 'partner',
        'category_th': 'บูธเอกชน / ภาคี',
        'units': 1,
        'dimensions': '2 x 2 เมตร',
        'services': [
            'เปิดรับสมัครพนักงานสูงวัยโครงการพี่ใหญ่ไฟแรงทำงานสาขาใกล้บ้าน',
            'ชี้แจงสวัสดิการ เวลาทำงานยืดหยุ่น และการประกันสุขภาพพนักงานสูงอายุ'
        ],
        'equipment': ['โต๊ะรับสมัครงาน', 'Roll up Big C', 'โบรชัวร์รับสมัครงาน'],
        'electrical_needs': 'ปลั๊กไฟ 1 จุด (300W)',
        'power_watts': 300,
        'quota_morning': None,
        'quota_afternoon': None,
        'quota_total': None,
        'avg_service_time_mins': 6,
        'color': '#E67E22',
        'layout': {'row': 'mid_left_s', 'col': 3, 'x': 6.0, 'y': 12.5, 'w': 2.0, 'h': 2.0, 'facing': 'S'}
    },

    # Middle-Center Island
    {
        'id': 'P01',
        'code': 'P01',
        'title': 'การวางแผนดูแลล่วงหน้า (Advance Care Planning) และประเมินความรู้เท่าทันการตาย',
        'agency': 'ชุมชนกรุณาเพื่อการอยู่และตายดี (Peaceful Death)',
        'category': 'partner',
        'category_th': 'บูธเอกชน / ภาคี',
        'units': 4,
        'dimensions': '8 x 2 เมตร',
        'services': [
            'เวิร์กชอป Advance Care Planning แบบมีส่วนร่วม',
            'กิจกรรมการเรียนรู้ผ่านเกมไพ่ไขชีวิต (Death Dialogue Cards)',
            'ประเมินดัชนีความรู้เท่าทันการตายและการสื่อสารในครอบครัว'
        ],
        'equipment': ['โต๊ะทำกิจกรรมกลุ่ม 4 ตัว', 'เก้าอี้ 8 ตัว', 'เกมไพ่ไขชีวิต', 'บอร์ดนิทรรศการ'],
        'electrical_needs': 'ปลั๊กไฟ 2 จุด (400W)',
        'power_watts': 400,
        'quota_morning': 40,
        'quota_afternoon': 40,
        'quota_total': 80,
        'avg_service_time_mins': 15,
        'color': '#E67E22',
        'layout': {'row': 'mid_center_n', 'col': 1, 'x': 11.0, 'y': 10.5, 'w': 8.0, 'h': 2.0, 'facing': 'N'}
    },
    {
        'id': 'A14',
        'code': 'A14',
        'title': 'ผลิตภัณฑ์การออมเงินและสินเชื่อ Reverse Mortgage เพื่อผู้สูงอายุ',
        'agency': 'ธนาคารออมสิน',
        'category': 'academic',
        'category_th': 'บูธวิชาการ',
        'units': 1,
        'dimensions': '2 x 2 เมตร',
        'services': [
            'เงินฝากเผื่อเรียกพิเศษผู้สูงวัยอัตราดอกเบี้ยพิเศษ',
            'สินเชื่อที่อยู่อาศัยสำหรับผู้สูงอายุ (Reverse Mortgage)',
            'ให้คำแนะนำการบริหารจัดการทรัพย์สินวัยเกษียณ'
        ],
        'equipment': ['เคาน์เตอร์บริการทางการเงิน', 'Roll up ธนาคารออมสิน', 'เอกสารผลิตภัณฑ์'],
        'electrical_needs': 'ปลั๊กไฟ 1 จุด (300W)',
        'power_watts': 300,
        'quota_morning': None,
        'quota_afternoon': None,
        'quota_total': None,
        'avg_service_time_mins': 6,
        'color': '#2980B9',
        'layout': {'row': 'mid_center_s', 'col': 1, 'x': 11.0, 'y': 12.5, 'w': 2.0, 'h': 2.0, 'facing': 'S'}
    },
    {
        'id': 'A13',
        'code': 'A13',
        'title': 'แนะนำสิทธิประโยชน์ การสมัครสมาชิก และการใช้งาน App กอช.',
        'agency': 'กองทุนการออมแห่งชาติ (กอช.)',
        'category': 'academic',
        'category_th': 'บูธวิชาการ',
        'units': 1,
        'dimensions': '2 x 2 เมตร',
        'services': [
            'รับสมัครสมาชิก กอช. สร้างบำนาญสำหรับแรงงานนอกระบบ',
            'ตรวจสอบยอดเงินออมและเงินสมทบจากรัฐบาลแบบเรียลไทม์',
            'สอนการดาวน์โหลดและใช้งาน Application กอช.'
        ],
        'equipment': ['Tablet สมัครสมาชิก 2 เครื่อง', 'Roll up 2 อัน', 'แผ่นพับสิทธิประโยชน์'],
        'electrical_needs': 'ปลั๊กไฟ 1 จุด (300W)',
        'power_watts': 300,
        'quota_morning': None,
        'quota_afternoon': None,
        'quota_total': None,
        'avg_service_time_mins': 5,
        'color': '#2980B9',
        'layout': {'row': 'mid_center_s', 'col': 2, 'x': 13.0, 'y': 12.5, 'w': 2.0, 'h': 2.0, 'facing': 'S'}
    },
    {
        'id': 'A12',
        'code': 'A12',
        'title': 'สุขภาวะผู้สูงอายุและการสร้างเสริมสุขภาพในชุมชน กาย-ใจ-ปัญญา-สังคม',
        'agency': 'สำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ (สสส.)',
        'category': 'academic',
        'category_th': 'บูธวิชาการ',
        'units': 2,
        'dimensions': '4 x 2 เมตร',
        'services': [
            'นิทรรศการองค์ความรู้และคู่มือเตรียมพร้อมก่อนสูงวัย',
            'โมเดลชุมชนสุขภาวะและการสร้างสิ่งแวดล้อมที่เป็นมิตรต่อผู้สูงอายุ',
            'สื่อมัลติมีเดียและแจกหนังสือองค์ความรู้ด้านสุขภาพ'
        ],
        'equipment': ['Backdrop นิทรรศการ สสส.', 'จอทีวีสื่อมัลติมีเดีย', 'หนังสือและคู่มือสุขภาพ'],
        'electrical_needs': 'ปลั๊กไฟ 2 จุด (600W)',
        'power_watts': 600,
        'quota_morning': None,
        'quota_afternoon': None,
        'quota_total': None,
        'avg_service_time_mins': 5,
        'color': '#2980B9',
        'layout': {'row': 'mid_center_s', 'col': 3, 'x': 15.0, 'y': 12.5, 'w': 4.0, 'h': 2.0, 'facing': 'S'}
    },

    # Middle-Right Island
    {
        'id': 'P06',
        'code': 'P06',
        'title': 'นวัตกรรมอุปกรณ์และเทคโนโลยีทางการแพทย์เพื่อผู้สูงอายุและผู้ป่วยติดเตียง',
        'agency': 'บริษัท แอดวานซ์ โซลูชั่น เซอร์วิส จำกัด',
        'category': 'partner',
        'category_th': 'บูธเอกชน / ภาคี',
        'units': 2,
        'dimensions': '4 x 2 เมตร',
        'services': [
            'สาธิตเตียงปรับไฟฟ้าเพื่อการพยาบาลผู้สูงอายุ',
            'อุปกรณ์ช่วยพยุงเดินป้องกันล้ม และเบาะลดแผลกดทับ',
            'ระบบสัญญาณเรียกพยาบาลฉุกเฉินไร้สาย'
        ],
        'equipment': ['เตียงปรับไฟฟ้าสาธิต', 'อุปกรณ์ช่วยพยุงเดิน', 'Roll up 2 อัน'],
        'electrical_needs': 'ปลั๊กไฟ 2 จุด (700W)',
        'power_watts': 700,
        'quota_morning': None,
        'quota_afternoon': None,
        'quota_total': None,
        'avg_service_time_mins': 6,
        'color': '#E67E22',
        'layout': {'row': 'mid_right_n', 'col': 1, 'x': 22.0, 'y': 10.5, 'w': 4.0, 'h': 2.0, 'facing': 'N'}
    },
    {
        'id': 'A17',
        'code': 'A17',
        'title': 'แพลตฟอร์มนิรันดร์ (Nirun) บริหารศูนย์ผู้สูงอายุ & Elder Meal ระบบจัดสำรับอาหาร',
        'agency': 'สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ (สวทช.)',
        'category': 'academic',
        'category_th': 'บูธวิชาการ',
        'units': 2,
        'dimensions': '2 x 4 เมตร (ข้ามเหนือ-ใต้)',
        'services': [
            'แพลตฟอร์มนิรันดร์ (Nirun) ระบบดิจิทัลบริหารจัดการศูนย์ดูแลผู้สูงอายุ',
            'Elder Meal ระบบปัญญาประดิษฐ์คำนวณและจัดสำรับอาหารผู้สูงอายุเฉพาะบุคคล',
            'ทดสอบโปรแกรมคำนวณสารอาหารและพลังงานที่ผู้สูงวัยต้องการต่อวัน'
        ],
        'equipment': ['คอมพิวเตอร์สาธิตแพลตฟอร์ม Nirun', 'จอ Touch Screen', 'แผ่นพับวิชาการ'],
        'electrical_needs': 'ปลั๊กไฟ 2 จุด (800W)',
        'power_watts': 800,
        'quota_morning': None,
        'quota_afternoon': None,
        'quota_total': None,
        'avg_service_time_mins': 7,
        'color': '#2980B9',
        'layout': {'row': 'mid_right_split', 'col': 2, 'x': 26.0, 'y': 10.5, 'w': 2.0, 'h': 4.0, 'facing': 'E'}
    },
    {
        'id': 'A15',
        'code': 'A15',
        'title': 'ผลิตภัณฑ์ยา อาหารเสริม และเวชสำอางสำหรับผู้สูงอายุ',
        'agency': 'องค์การเภสัชกรรม (GPO)',
        'category': 'academic',
        'category_th': 'บูธวิชาการ',
        'units': 2,
        'dimensions': '4 x 2 เมตร',
        'services': [
            'จัดแสดงยา อาหารเสริม และนวัตกรรมเวชสำอางสำหรับผู้สูงอายุของ GPO',
            'ให้คำปรึกษาการใช้ยาอย่างปลอดภัยและข้อควรระวังในการกินยาหลายขนาน (Polypharmacy)',
            'จำหน่ายผลิตภัณฑ์สุขภาพในราคาพิเศษ'
        ],
        'equipment': ['ชุดนิทรรศการสำเร็จรูป GPO', 'ตู้โชว์ยาและอาหารเสริม', 'เอกสารวิชาการ'],
        'electrical_needs': 'ปลั๊กไฟ 2 จุด (500W)',
        'power_watts': 500,
        'quota_morning': None,
        'quota_afternoon': None,
        'quota_total': None,
        'avg_service_time_mins': 5,
        'color': '#2980B9',
        'layout': {'row': 'mid_right_s', 'col': 1, 'x': 22.0, 'y': 12.5, 'w': 4.0, 'h': 2.0, 'facing': 'S'}
    },

    # Grand Staircase & Escalators Area
    {
        'id': 'S08',
        'code': 'S08',
        'title': 'Digital Dentistry ตรวจสแกนช่องปากระบบดิจิทัล 3 มิติ และคัดกรองสุขภาพฟัน',
        'agency': 'สถาบันทันตกรรม กรมการแพทย์',
        'category': 'service',
        'category_th': 'บูธบริการประชาชน',
        'units': 3,
        'dimensions': '6 x 2 เมตร',
        'services': [
            'ตรวจสแกนฟันและช่องปาก 3 มิติด้วย Intraoral 3D Scanner',
            'ตรวจคัดกรองรอยโรคมะเร็งช่องปากและเหงือกอักเสบในผู้สูงอายุ',
            'ให้คำปรึกษาการทำฟันเทียมและรากฟันเทียมสำหรับผู้สูงวัย'
        ],
        'equipment': ['เครื่อง 3D Intraoral Scanner 1 ชุด', 'เก้าอี้ตรวจทันตกรรมเคลื่อนที่', 'จอแสดงผลดิจิทัล', 'Roll up 3 อัน'],
        'electrical_needs': 'ปลั๊กไฟ 3 จุด (1200W)',
        'power_watts': 1200,
        'quota_morning': 25,
        'quota_afternoon': 25,
        'quota_total': 50,
        'avg_service_time_mins': 12,
        'color': '#27AE60',
        'layout': {'row': 'stairs_north', 'col': 1, 'x': 35.5, 'y': 9.0, 'w': 6.0, 'h': 2.0, 'facing': 'N'}
    },
    {
        'id': 'A03',
        'code': 'A03',
        'title': 'Application Insomnia (นิทรารมณ์) เพื่อการดูแลปัญหาการนอนหลับ',
        'agency': 'สถาบันโรคทรวงอก กรมการแพทย์',
        'category': 'academic',
        'category_th': 'บูธวิชาการ',
        'units': 1,
        'dimensions': '2 x 2 เมตร',
        'services': [
            'ดาวน์โหลดและทดลองใช้งานแอปพลิเคชันนิทรารมณ์ บันทึกการนอนหลับ',
            'คัดกรองภาวะหยุดหายใจขณะหลับ (OSA) และนอนไม่หลับเรื้อรัง',
            'คำแนะนำสุขอนามัยการนอนหลับ (Sleep Hygiene) สำหรับผู้สูงอายุ'
        ],
        'equipment': ['Tablet สาธิต Application', 'Roll up 2 อัน', 'แผ่นพับ'],
        'electrical_needs': 'ปลั๊กไฟ 1 จุด (300W)',
        'power_watts': 300,
        'quota_morning': None,
        'quota_afternoon': None,
        'quota_total': None,
        'avg_service_time_mins': 5,
        'color': '#2980B9',
        'layout': {'row': 'stairs_north', 'col': 2, 'x': 41.5, 'y': 9.0, 'w': 2.0, 'h': 2.0, 'facing': 'N'}
    },
    {
        'id': 'S02',
        'code': 'S02',
        'title': 'สงฆ์ไทยห่างไกลโรคและป้องกันภาวะหกล้มในพระสงฆ์สูงอายุ',
        'agency': 'โรงพยาบาลสงฆ์ กรมการแพทย์',
        'category': 'service',
        'category_th': 'บูธบริการประชาชน',
        'units': 2,
        'dimensions': '2 x 4 เมตร (แนวตั้ง)',
        'services': [
            'ตรวจคัดกรองสุขภาพเบื้องต้นสำหรับพระสงฆ์และผู้สูงอายุ',
            'สาธิตท่ากายบริหารและอุปกรณ์ออกกำลังกายที่สอดคล้องกับพระวินัย',
            'โมเดลภัตตาหารสุขภาพลดหวาน มัน เค็ม ห่างไกลโรค NCDs'
        ],
        'equipment': ['อุปกรณ์ออกกำลังกายสำหรับพระสงฆ์', 'โมเดลอาหารสุขภาพ', 'แผ่นพับคำแนะนำ'],
        'electrical_needs': 'ปลั๊กไฟ 1 จุด (400W)',
        'power_watts': 400,
        'quota_morning': 30,
        'quota_afternoon': 20,
        'quota_total': 50,
        'avg_service_time_mins': 8,
        'color': '#27AE60',
        'layout': {'row': 'stairs_east_upper', 'col': 1, 'x': 47.5, 'y': 11.0, 'w': 2.0, 'h': 4.0, 'facing': 'E'}
    },
    {
        'id': 'S12',
        'code': 'S12',
        'title': 'การตรวจคัดกรองโรคมะเร็งและไวรัสตับอักเสบบีและซี',
        'agency': 'สถาบันมะเร็งแห่งชาติ กรมการแพทย์',
        'category': 'service',
        'category_th': 'บูธบริการประชาชน',
        'units': 2,
        'dimensions': '2 x 4 เมตร (แนวตั้ง)',
        'services': [
            'ตรวจคัดกรองการติดเชื้อไวรัสตับอักเสบบีและซีด้วยชุดตรวจเร็ว (Rapid Test)',
            'ประเมินความเสี่ยงโรคมะเร็งลำไส้ใหญ่ มะเร็งตับ และมะเร็งเต้านม',
            'ให้คำแนะนำโภชนาการผักผลไม้ 5 สีต้านมะเร็ง'
        ],
        'equipment': ['ชุดตรวจคัดกรองไวรัสตับอักเสบ', 'โมเดลผักผลไม้ 5 สี', 'โน้ตบุ๊ก', 'Roll up 6 อัน'],
        'electrical_needs': 'ปลั๊กไฟ 2 จุด (500W)',
        'power_watts': 500,
        'quota_morning': 25,
        'quota_afternoon': 25,
        'quota_total': 50,
        'avg_service_time_mins': 10,
        'color': '#27AE60',
        'layout': {'row': 'stairs_east_lower', 'col': 1, 'x': 47.5, 'y': 15.0, 'w': 2.0, 'h': 4.0, 'facing': 'E'}
    },
    {
        'id': 'A11',
        'code': 'A11',
        'title': 'ศูนย์อาเซียนเพื่อการสูงวัยอย่างมีสุขภาวะและนวัตกรรม (ACAI)',
        'agency': 'ASEAN Centre for Active Ageing and Innovation (ACAI)',
        'category': 'academic',
        'category_th': 'บูธวิชาการ',
        'units': 1,
        'dimensions': '2 x 2 เมตร',
        'services': [
            'จัดแสดงยุทธศาสตร์และนวัตกรรม Active Ageing ระดับอาเซียนและ ASEAN+3',
            'เครือข่ายความร่วมมือการดูแลสุขภาพผู้สูงอายุระหว่างประเทศ',
            'แจกเอกสารวิชาการและของที่ระลึก'
        ],
        'equipment': ['Roll up 4 อัน', 'แท่นใส่เอกสาร', 'Laptop / Monitor 1 เครื่อง', 'ต้นไม้ประดับ 2 กระถาง', 'สะพานไฟ'],
        'electrical_needs': 'ปลั๊กไฟ 1 จุด (400W)',
        'power_watts': 400,
        'quota_morning': None,
        'quota_afternoon': None,
        'quota_total': None,
        'avg_service_time_mins': 5,
        'color': '#2980B9',
        'layout': {'row': 'stairs_south', 'col': 1, 'x': 35.5, 'y': 20.0, 'w': 2.0, 'h': 2.0, 'facing': 'S'}
    },
    {
        'id': 'A10',
        'code': 'A10',
        'title': 'Breathology เครื่องวัดระดับน้ำตาลในร่างกายด้วยลมหายใจ',
        'agency': 'สถาบันวิจัยและประเมินเทคโนโลยีทางการแพทย์ กรมการแพทย์',
        'category': 'academic',
        'category_th': 'บูธวิชาการ',
        'units': 1,
        'dimensions': '2 x 2 เมตร',
        'services': [
            'สาธิตนวัตกรรมตรวจวัดน้ำตาลกลูโคสผ่านลมหายใจ (Breathology Non-invasive)',
            'รายงานผลการประเมินความคุ้มค่าและเทคโนโลยีทางการแพทย์สำหรับผู้ป่วยเบาหวาน'
        ],
        'equipment': ['เครื่องตรวจวัดลมหายใจ Breathology', 'คอมพิวเตอร์ประมวลผล', 'Roll up 2 อัน'],
        'electrical_needs': 'ปลั๊กไฟ 1 จุด (600W)',
        'power_watts': 600,
        'quota_morning': None,
        'quota_afternoon': None,
        'quota_total': None,
        'avg_service_time_mins': 6,
        'color': '#2980B9',
        'layout': {'row': 'stairs_south', 'col': 2, 'x': 37.5, 'y': 20.0, 'w': 2.0, 'h': 2.0, 'facing': 'S'}
    },
    {
        'id': 'S04',
        'code': 'S04',
        'title': 'ปลอดโรคจากงาน เบิกบานวัยเกษียณ Healthy & Happy Retire',
        'agency': 'โรงพยาบาลนพรัตนราชธานี กรมการแพทย์',
        'category': 'service',
        'category_th': 'บูธบริการประชาชน',
        'units': 2,
        'dimensions': '4 x 2 เมตร',
        'services': [
            'ตรวจวัดสมรรถภาพกล้ามเนื้อมือบีบและขา (Grip Strength & Muscle Power)',
            'ประเมินโรคจากการทำงาน โรคกระดูกและกล้ามเนื้อในวัยทำงานก่อนเกษียณ',
            'ให้คำปรึกษาโภชนาการและจัดเมนูอาหารวัยเกษียณ'
        ],
        'equipment': ['เครื่องตรวจวัดสมรรถภาพกล้ามเนื้อ', 'ทีวีขนาด 52 นิ้ว', 'Backdrop แนะนำ 8 อัน', 'ป้ายชื่อ 50*300 ซม.', 'โมเดลอาหาร'],
        'electrical_needs': 'ปลั๊กไฟ 3 จุด (1100W)',
        'power_watts': 1100,
        'quota_morning': 30,
        'quota_afternoon': 30,
        'quota_total': 60,
        'avg_service_time_mins': 8,
        'color': '#27AE60',
        'layout': {'row': 'stairs_south', 'col': 3, 'x': 39.5, 'y': 20.0, 'w': 4.0, 'h': 2.0, 'facing': 'S'}
    },

    # Bottom-Left Island
    {
        'id': 'A05',
        'code': 'A05',
        'title': 'ผลกระทบสุราและยาเสพติดต่อผู้สูงอายุ และการดูแลสุขภาพ',
        'agency': 'สถาบันบำบัดรักษาและฟื้นฟูผู้ติดยาเสพติดแห่งชาติบรมราชชนนี (สบยช.)',
        'category': 'academic',
        'category_th': 'บูธวิชาการ',
        'units': 1,
        'dimensions': '2 x 2 เมตร',
        'services': [
            'คัดกรองพฤติกรรมการดื่มสุรา การสูบบุหรี่ และการใช้ยานอนหลับในผู้สูงวัย',
            'แนวทางการฟื้นฟูสุขภาพสมองและตับจากสารเสพติดและแอลกอฮอล์'
        ],
        'equipment': ['Roll up 2 ชิ้น', 'แผ่นพับความรู้', 'ชุดทดสอบแบบประเมิน'],
        'electrical_needs': 'ปลั๊กไฟ 1 จุด (200W)',
        'power_watts': 200,
        'quota_morning': None,
        'quota_afternoon': None,
        'quota_total': None,
        'avg_service_time_mins': 5,
        'color': '#2980B9',
        'layout': {'row': 'bot_left_n', 'col': 1, 'x': 2.0, 'y': 17.5, 'w': 2.0, 'h': 2.0, 'facing': 'N'}
    },
    {
        'id': 'A06',
        'code': 'A06',
        'title': 'การคัดกรองผู้สูงอายุในชุมชน โดย อสม. (9 ด้านสุขภาพ)',
        'agency': 'กรมสนับสนุนบริการสุขภาพ (สบส.)',
        'category': 'academic',
        'category_th': 'บูธวิชาการ',
        'units': 1,
        'dimensions': '2 x 2 เมตร',
        'services': [
            'การใช้แอปพลิเคชัน อสม.ออนไลน์ และ Smart อสม. คัดกรองสุขภาพผู้สูงอายุ 9 ด้าน',
            'บทบาท อสม. หมอคนที่ 1 ดูแลผู้สูงอายุกลุ่มติดบ้าน-ติดเตียงในชุมชน'
        ],
        'equipment': ['Backdrop ผ้า ขนาด 3*2 เมตร', 'อุปกรณ์ตกแต่งบูธ', 'เอกสารวิชาการ'],
        'electrical_needs': 'ปลั๊กไฟ 1 จุด (300W)',
        'power_watts': 300,
        'quota_morning': None,
        'quota_afternoon': None,
        'quota_total': None,
        'avg_service_time_mins': 5,
        'color': '#2980B9',
        'layout': {'row': 'bot_left_n', 'col': 2, 'x': 4.0, 'y': 17.5, 'w': 2.0, 'h': 2.0, 'facing': 'N'}
    },
    {
        'id': 'A07',
        'code': 'A07',
        'title': 'ป้องกันพลัดตกหกล้มในผู้สูงอายุ',
        'agency': 'กองป้องกันการบาดเจ็บ กรมควบคุมโรค',
        'category': 'academic',
        'category_th': 'บูธวิชาการ',
        'units': 1,
        'dimensions': '2 x 2 เมตร',
        'services': [
            'ประเมินความเสี่ยงหกล้มในผู้สูงอายุและสิ่งแวดล้อมภายในบ้าน',
            'ชุดสาธิตอุปกรณ์ช่วยเดิน ไม้เท้า แผ่นกันลื่น และราวจับ',
            'คู่มือปรับปรุงบ้านปลอดภัยป้องกันพลัดตกหกล้ม'
        ],
        'equipment': ['Roll up ขนาด 80*200 ซม. 2 ชิ้น', 'ชุดอุปกรณ์สาธิตป้องกันการลื่นล้ม', 'เอกสารวิชาการ'],
        'electrical_needs': 'ปลั๊กไฟ 1 จุด (300W)',
        'power_watts': 300,
        'quota_morning': None,
        'quota_afternoon': None,
        'quota_total': None,
        'avg_service_time_mins': 5,
        'color': '#2980B9',
        'layout': {'row': 'bot_left_n', 'col': 3, 'x': 6.0, 'y': 17.5, 'w': 2.0, 'h': 2.0, 'facing': 'N'}
    },
    {
        'id': 'S09',
        'code': 'S09',
        'title': 'ให้เมตตาประชารักษ์ดูแล ตาดีได้ ตาร้ายไม่เสีย (ตรวจตาครบวงจร & สปาเปลือกตา)',
        'agency': 'โรงพยาบาลเมตตาประชารักษ์ (วัดไร่ขิง) กรมการแพทย์',
        'category': 'service',
        'category_th': 'บูธบริการประชาชน',
        'units': 3,
        'dimensions': '6 x 2 เมตร',
        'services': [
            'ตรวจวัดระดับการมองเห็น (Visual Acuity - VA)',
            'ตรวจวัดความดันลูกตาแบบไม่สัมผัส (Non-contact Tonometry) คัดกรองต้อหิน',
            'ตรวจต้อกระจกด้วยกล้อง Slit Lamp Biomicroscope',
            'ถ่ายภาพจอตาด้วย Fundus Camera',
            'บริการสปาเปลือกตา (Lid Spa) นวดและประคบอุ่นรักษาตาแห้ง'
        ],
        'equipment': [
            'เครื่องตรวจวัดสายตา VA',
            'เครื่องวัดความดันตา Tonometry',
            'กล้องจุลทรรศน์ Slit Lamp',
            'Fundus Camera',
            'เตียง Lid Spa สำหรับสปาเปลือกตา'
        ],
        'electrical_needs': 'ปลั๊กไฟ 4 จุด (1800W)',
        'power_watts': 1800,
        'quota_morning': 30,
        'quota_afternoon': 30,
        'quota_total': 60,
        'avg_service_time_mins': 12,
        'color': '#27AE60',
        'layout': {'row': 'bot_left_s', 'col': 1, 'x': 2.0, 'y': 19.5, 'w': 6.0, 'h': 2.0, 'facing': 'S'}
    },

    # Bottom-Center Island
    {
        'id': 'A08',
        'code': 'A08',
        'title': 'ชะลอชรา ชีวายืนยาว (Active & Healthy Ageing)',
        'agency': 'กรมอนามัย กระทรวงสาธารณสุข',
        'category': 'academic',
        'category_th': 'บูธวิชาการ',
        'units': 2,
        'dimensions': '4 x 2 เมตร',
        'services': [
            'ส่งเสริมโภชนาการสำหรับผู้สูงวัยและอาหารตามวัย',
            'ตรวจประเมินสุขอนามัยในช่องปากและฟันแท้ 20 ซี่ในผู้สูงอายุ',
            'แนะนำการออกกำลังกายที่เหมาะสมและชมรมผู้สูงอายุเข้มแข็ง'
        ],
        'equipment': ['Backdrop ผ้า ขนาด 3*2 เมตร', 'เคาน์เตอร์บาร์ออกบูธ กว้าง 130 ซม. สูง 90 ซม.', 'อุปกรณ์ตกแต่งและเอกสาร'],
        'electrical_needs': 'ปลั๊กไฟ 2 จุด (500W)',
        'power_watts': 500,
        'quota_morning': None,
        'quota_afternoon': None,
        'quota_total': None,
        'avg_service_time_mins': 6,
        'color': '#2980B9',
        'layout': {'row': 'bot_center_n', 'col': 1, 'x': 11.0, 'y': 17.5, 'w': 4.0, 'h': 2.0, 'facing': 'N'}
    },
    {
        'id': 'A09',
        'code': 'A09',
        'title': 'การแพทย์แผนไทยและการแพทย์ทางเลือก การแพทย์แผนจีนสำหรับผู้สูงวัย',
        'agency': 'กรมการแพทย์แผนไทยและการแพทย์ทางเลือก',
        'category': 'academic',
        'category_th': 'บูธวิชาการ',
        'units': 2,
        'dimensions': '4 x 2 เมตร',
        'services': [
            'สาธิตการนวดไทยและการกดจุดบำบัดอาการปวดกล้ามเนื้อเรื้อรัง',
            'การฝังเข็มแผนจีนและครอบแก้วเพื่อปรับสมดุลธาตุในร่างกาย',
            'แนะนำยาสมุนไพรในบัญชียาหลักแห่งชาติสำหรับผู้สูงอายุ'
        ],
        'equipment': ['Roll up 80*200 ซม. 4 ชิ้น', 'Counter วางเอกสาร 1 ตัว', 'ตัวอย่างยาสมุนไพรและโมเดลจำลองเส้นประธานสิบ'],
        'electrical_needs': 'ปลั๊กไฟ 1 จุด (400W)',
        'power_watts': 400,
        'quota_morning': None,
        'quota_afternoon': None,
        'quota_total': None,
        'avg_service_time_mins': 8,
        'color': '#2980B9',
        'layout': {'row': 'bot_center_n', 'col': 2, 'x': 15.0, 'y': 17.5, 'w': 4.0, 'h': 2.0, 'facing': 'N'}
    },
    {
        'id': 'A02',
        'code': 'A02',
        'title': 'กิจกรรมกระตุ้นสมองสำหรับผู้สูงอายุ (Smart Fit Interactive Training)',
        'agency': 'โรงพยาบาลสมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ จังหวัดชลบุรี',
        'category': 'academic',
        'category_th': 'บูธวิชาการ',
        'units': 2,
        'dimensions': '4 x 2 เมตร',
        'services': [
            'ชุดเครื่องมือ Smart Fit ฝึกสมองและการเคลื่อนไหวผ่านเซ็นเซอร์แสงไฟ',
            'ประเมินความเร็วในการตอบสนองและฝึกสมาธิป้องกันอัลไซเมอร์'
        ],
        'equipment': [
            'ชุด Smart Fit (ไฟฝึก 6 อัน, Power bank 6 อัน, Tablet 1 เครื่อง)',
            'คอมพิวเตอร์ All in one 1 เครื่อง',
            'Backdrop และ Counter 1 ชุด',
            'ธงญี่ปุ่นป้ายชื่อ',
            'สะพานไฟ'
        ],
        'electrical_needs': 'ปลั๊กไฟ 2 จุด (800W)',
        'power_watts': 800,
        'quota_morning': None,
        'quota_afternoon': None,
        'quota_total': None,
        'avg_service_time_mins': 8,
        'color': '#2980B9',
        'layout': {'row': 'bot_center_s', 'col': 1, 'x': 11.0, 'y': 19.5, 'w': 4.0, 'h': 2.0, 'facing': 'S'}
    },
    {
        'id': 'S10',
        'code': 'S10',
        'title': 'ตรวจน้ำตาลสะสมปลายนิ้ว HbA1c ตรวจวัดร่างกาย และโภชนาการออกกำลังกาย',
        'agency': 'สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ กรมการแพทย์ (เจ้าภาพ)',
        'category': 'service',
        'category_th': 'บูธบริการประชาชน (เจ้าภาพงาน)',
        'units': 2,
        'dimensions': '4 x 2 เมตร',
        'services': [
            'ตรวจน้ำตาลสะสมในเลือด HbA1c ด้วยเครื่อง Cobas b 101 ทราบผลใน 5 นาที (โควตาจำกัด)',
            'ตรวจวัดความดันโลหิต ดัชนีมวลกาย และองค์ประกอบร่างกาย',
            'ให้คำปรึกษาการปรับพฤติกรรมโภชนาการและการออกกำลังกายเฉพาะบุคคล'
        ],
        'equipment': ['เครื่องวิเคราะห์ผลเลือด Cobas 101 HbA1c', 'โน้ตบุ๊ก', 'Backdrop เจ้าภาพ', 'แผ่นพับความรู้'],
        'electrical_needs': 'ปลั๊กไฟ 2 จุด (900W)',
        'power_watts': 900,
        'quota_morning': 40,
        'quota_afternoon': 30,
        'quota_total': 70,
        'avg_service_time_mins': 7,
        'color': '#27AE60',
        'layout': {'row': 'bot_center_s', 'col': 2, 'x': 15.0, 'y': 19.5, 'w': 4.0, 'h': 2.0, 'facing': 'S'}
    },

    # Bottom-Right Island
    {
        'id': 'S11',
        'code': 'S11',
        'title': 'การคัดกรองและส่งเสริมสุขภาพจิตผู้สูงอายุ ด้วยเครื่อง Smartpulse',
        'agency': 'กรมสุขภาพจิต กระทรวงสาธารณสุข',
        'category': 'service',
        'category_th': 'บูธบริการประชาชน',
        'units': 3,
        'dimensions': '6 x 2 เมตร',
        'services': [
            'ตรวจวัดระดับความเครียดสะสมและการทำงานของหลอดเลือดด้วยเครื่อง Smartpulse 3 เครื่อง',
            'คัดกรองภาวะซึมเศร้าและความเสี่ยงการฆ่าตัวตายในผู้สูงอายุ',
            'ให้คำปรึกษาจิตวิทยาและการฝึกเทคนิคผ่อนคลายความเครียด'
        ],
        'equipment': ['เครื่องตรวจ Smartpulse 3 เครื่อง', 'Tablet บันทึกผล 3 เครื่อง', 'แผ่นพับความรู้สุขภาพจิต'],
        'electrical_needs': 'ปลั๊กไฟ 2 จุด (600W)',
        'power_watts': 600,
        'quota_morning': 15,
        'quota_afternoon': 15,
        'quota_total': 30,
        'avg_service_time_mins': 12,
        'color': '#27AE60',
        'layout': {'row': 'bot_right_n', 'col': 1, 'x': 22.0, 'y': 17.5, 'w': 6.0, 'h': 2.0, 'facing': 'N'}
    },
    {
        'id': 'S03',
        'code': 'S03',
        'title': 'สูงวัย สมองดี ไม่มีล้ม ด้วย Body Composition & Smart Balance',
        'agency': 'สถาบันสิรินธรเพื่อการฟื้นฟูสมรรถภาพทางการแพทย์แห่งชาติ กรมการแพทย์',
        'category': 'service',
        'category_th': 'บูธบริการประชาชน',
        'units': 2,
        'dimensions': '4 x 2 เมตร',
        'services': [
            'ตรวจองค์ประกอบร่างกายด้วยเครื่อง Body Composition Analyzer',
            'ประเมินการทรงตัวและความเสี่ยงล้มด้วยเครื่อง Smart Balance แบบดิจิทัล',
            'สอนท่ากายบริหารฝึกสมองและการทรงตัวสำหรับผู้สูงวัย'
        ],
        'equipment': [
            'เครื่อง Body Composition 1 เครื่อง',
            'เครื่อง Smart Balance 1 เครื่อง',
            'Backdrop แนะนำสถาบัน 1 อัน',
            'Roll up 5 อัน',
            'PC All-in-one 1 เครื่อง',
            'Counter วางแผ่นพับ 1 ตัว'
        ],
        'electrical_needs': 'ปลั๊กไฟ 3 จุด (1400W)',
        'power_watts': 1400,
        'quota_morning': 30,
        'quota_afternoon': 20,
        'quota_total': 50,
        'avg_service_time_mins': 10,
        'color': '#27AE60',
        'layout': {'row': 'bot_right_s', 'col': 1, 'x': 22.0, 'y': 19.5, 'w': 4.0, 'h': 2.0, 'facing': 'S'}
    },
    {
        'id': 'A04',
        'code': 'A04',
        'title': 'คลินิกวัยเก๋า คลินิกป้องกันล้ม และคลินิกฟื้นฟูการรับรู้ความคิดความเข้าใจ',
        'agency': 'โรงพยาบาลเวชชารักษ์ ลำปาง กรมการแพทย์',
        'category': 'academic',
        'category_th': 'บูธวิชาการ',
        'units': 1,
        'dimensions': '2 x 2 เมตร',
        'services': [
            'รูปแบบคลินิกวัยเก๋าเพื่อการดูแลผู้สูงอายุอย่างบูรณาการ',
            'โมเดลฟื้นฟูความรู้ความเข้าใจ (Cognitive Rehabilitation)',
            'โปรแกรมป้องกันการพลัดตกหกล้มในชุมชน'
        ],
        'equipment': ['Roll up 80*200 ซม. 2 ชิ้น', 'ไวนิลขนาด 3*6 เมตร', 'ชุดโน้ตบุ๊กสาธิต', 'แผ่นพับ'],
        'electrical_needs': 'ปลั๊กไฟ 1 จุด (350W)',
        'power_watts': 350,
        'quota_morning': None,
        'quota_afternoon': None,
        'quota_total': None,
        'avg_service_time_mins': 5,
        'color': '#2980B9',
        'layout': {'row': 'bot_right_s', 'col': 2, 'x': 26.0, 'y': 19.5, 'w': 2.0, 'h': 2.0, 'facing': 'S'}
    },

    # East Wall Lower (Facing West)
    {
        'id': 'S06',
        'code': 'S06',
        'title': 'วัดองค์ประกอบของร่างกายและให้ความรู้เรื่องโภชนาการผู้สูงวัย ป้องกันภาวะกล้ามเนื้อลีบ',
        'agency': 'โรงพยาบาลเลิดสิน กรมการแพทย์',
        'category': 'service',
        'category_th': 'บูธบริการประชาชน',
        'units': 2,
        'dimensions': '2 x 4 เมตร (แนวตั้ง)',
        'services': [
            'ตรวจวัดมวลกล้ามเนื้อและมวลไขมันในร่างกาย คัดกรองภาวะ Sarcopenia',
            'คำแนะนำโภชนาการโปรตีนคุณภาพสูงเพื่อเสริมสร้างกล้ามเนื้อผู้สูงวัย',
            'สาธิตเมนูอาหารชะลอวัยและป้องกันภาวะกระดูกพรุน'
        ],
        'equipment': ['เครื่องวัดมวลไขมันและกล้ามเนื้อ 1 เครื่อง', 'Roll up 6 อัน', 'โมเดลอาหาร 3 มิติ', 'แผ่นพับโภชนาการ'],
        'electrical_needs': 'ปลั๊กไฟ 2 จุด (800W)',
        'power_watts': 800,
        'quota_morning': 40,
        'quota_afternoon': 20,
        'quota_total': 60,
        'avg_service_time_mins': 8,
        'color': '#27AE60',
        'layout': {'row': 'east_wall_south', 'col': 1, 'x': 52.0, 'y': 22.0, 'w': 2.0, 'h': 4.0, 'facing': 'W'}
    }
]

# Total units calculation
total_units = sum(b['units'] for b in booths)
total_services = sum(len(b['services']) for b in booths)
total_screening_quota = sum(b['quota_total'] or 0 for b in booths)

print(f"Booths: {len(booths)}")
print(f"Total physical booth units (2x2m): {total_units}")
print(f"Total services offered: {total_services}")
print(f"Daily public screening quota: {total_screening_quota} persons/day")

# Save as JSON
out_path = r'C:\Users\Piyanut\Desktop\Code_Work\elderly_forum_simulation\data\booths.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(booths, f, ensure_ascii=False, indent=2)

print("Saved booths.json successfully!")
