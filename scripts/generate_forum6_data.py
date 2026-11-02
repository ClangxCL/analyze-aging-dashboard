# -*- coding: utf-8 -*-
import json
import os

os.makedirs(r'C:\Users\Piyanut\Desktop\Code_Work\elderly_forum_6_simulation\data', exist_ok=True)

data = {
    'event': {
        'name_th': 'งานสุขภาพผู้สูงอายุแห่งชาติ ครั้งที่ 6',
        'name_en': 'The 6th Thailand National Elderly Health Forum 2027',
        'theme_th': 'ร่วมเรียนรู้ ร่วมดูแล เพื่อสุขภาพผู้สูงอายุ',
        'theme_en': 'Learn Together, Care Together, for Better Elderly Health',
        'edition': 6,
        'year': 2027,
        'venue': 'อาคาร อิมแพค ฟอรัม เมืองทองธานี (IMPACT Forum Muang Thong Thani)',
        'target_audience': 'ประชาชนผู้สูงอายุ, ผู้ดูแล, ครอบครัว, แพทย์, พยาบาล และเครือข่ายชมรมผู้สูงอายุทั่วประเทศ'
    },
    'seminar_rooms': [
        {
            'id': 'room_1',
            'room_code': 'Sapphire 204',
            'title_th': 'ห้องที่ 1: เวชศาสตร์ผู้สูงอายุ & นวัตกรรมนานาชาติ',
            'title_en': 'Room 1: Geriatric Medicine & International Discussion',
            'capacity': 200,
            'current_attendees': 185,
            'stage_size': '3.66 x 6.10 ม. (LED 5.00 x 3.00 ม.)',
            'theme_color': '#00B4D8',
            'description': 'เวทีเสวนาทางวิชาการและการแพทย์ระดับนานาชาติ แลกเปลี่ยนองค์ความรู้เทคโนโลยีล้ำสมัยในการดูแลรักษาผู้สูงอายุ',
            'sessions': [
                {
                    'time': '09:30 - 10:30',
                    'title': 'Geriatric Medicine: Technology and Innovation for Future Challenges',
                    'speaker': 'ศ.นพ. สมเกียรติ วัฒนาพร & ผู้แทน ACAI ASEAN',
                    'key_takeaway': 'การนำหุ่นยนต์และ AI มาช่วยคัดกรองโรคเรื้อรังและประเมินความเปราะบางในผู้สูงอายุ',
                    'status': 'finished'
                },
                {
                    'time': '10:30 - 11:30',
                    'title': 'Dementia Management for the Elderly: AI & Digital Biomarkers',
                    'speaker': 'ทีมวิจัยสถาบันประสาทวิทยา & มหาวิทยาลัยแพทย์ชั้นนำ',
                    'key_takeaway': 'ตรวจจับอัลไซเมอร์และสมองเสื่อมระยะเริ่มต้นผ่านการวิเคราะห์เสียงพูดและคลื่นลูกตา',
                    'status': 'live'
                },
                {
                    'time': '11:30 - 12:30',
                    'title': 'Geriatric Dentistry: การดูแลช่องปากและฟันเพื่อโภชนาการที่ดีในวัยเก๋า',
                    'speaker': 'ทันตแพทย์เชี่ยวชาญ สถาบันทันตกรรม',
                    'key_takeaway': 'เทคนิคดูแลฟันแท้ 20 ซี่ และรากฟันเทียมราคาเข้าถึงได้ เพื่อให้เคี้ยวอาหารได้อร่อย',
                    'status': 'upcoming'
                },
                {
                    'time': '13:30 - 14:30',
                    'title': 'Palliative and End-of-Life Care Center: สุขภาวะระยะสุดท้ายและการตายดี',
                    'speaker': 'เครือข่าย Peaceful Death & สถาบันมะเร็งแห่งชาติ',
                    'key_takeaway': 'การจัดทำ Living Will (มาตรา 12) และการวางแผนดูแลล่วงหน้าอย่างสงบและสมศักดิ์ศรี',
                    'status': 'upcoming'
                },
                {
                    'time': '14:30 - 15:30',
                    'title': 'Geriatric Emergency: ระบบบริการการแพทย์ฉุกเฉินและการเตรียมรับภัยพิบัติ',
                    'speaker': 'สถาบันการแพทย์ฉุกเฉินแห่งชาติ (สพฉ.)',
                    'key_takeaway': 'สายด่วน 1669 และระบบพิกัดฉุกเฉินนำส่งผู้สูงอายุในภาวะน้ำท่วมและอุบัติเหตุในบ้าน',
                    'status': 'upcoming'
                },
                {
                    'time': '15:30 - 16:30',
                    'title': 'Age-Friendly City: เมืองและสิ่งแวดล้อมเพื่อความปลอดภัย ป้องกันการหกล้ม',
                    'speaker': 'คณะกรรมการนโยบายผู้สูงอายุแห่งชาติ & ACAI',
                    'key_takeaway': 'มาตรฐานทางเท้า พื้นต่างระดับ และสิ่งอำนวยความสะดวกสำหรับสังคมสูงวัย',
                    'status': 'upcoming'
                }
            ]
        },
        {
            'id': 'room_2',
            'room_code': 'Sapphire 205',
            'title_th': 'ห้องที่ 2: สหวิชาชีพ & รูปแบบการดูแลสุขภาพผู้สูงอายุ',
            'title_en': 'Room 2: Multidisciplinary Care & Healthy Ageing Models',
            'capacity': 300,
            'current_attendees': 290,
            'stage_size': '3.66 x 6.10 ม. (LED 5.00 x 3.00 ม.)',
            'theme_color': '#27AE60',
            'description': 'เวทีเสวนาเชิงปฏิบัติการที่เน้นประชาชนและบุคลากรสหวิชาชีพ การส่งเสริมสุขภาพกายและใจให้ชะลอวัยอย่างมีความสุข',
            'sessions': [
                {
                    'time': '09:30 - 10:30',
                    'title': 'Pre-Aging & Anti-Aging: ศาสตร์ชะลอวัยก่อนเข้าสู่ภาวะเปราะบาง',
                    'speaker': 'แพทย์เวชศาสตร์ฟื้นฟู สถาบันเวชศาสตร์ฯ ผู้สูงอายุ',
                    'key_takeaway': 'วิธีออกกำลังกายเสริมกล้ามเนื้อลายป้องกันภาวะกล้ามเนื้อลีบ (Sarcopenia) หลังวัย 60',
                    'status': 'finished'
                },
                {
                    'time': '10:30 - 11:30',
                    'title': 'บทบาทและภาคเครือข่ายสาธารณสุขในการดูแลผู้สูงอายุที่มีภาวะสมองเสื่อม',
                    'speaker': 'สมาคมผู้ดูแลผู้ป่วยสมองเสื่อม & เครือข่าย อสม.',
                    'key_takeaway': 'ชุมชนที่เป็นมิตรต่อผู้มีภาวะสมองเสื่อม (Dementia-Friendly Community) ช่วยเหลือผู้หลงลืม',
                    'status': 'live'
                },
                {
                    'time': '11:30 - 12:30',
                    'title': 'Sleep well, Happy mind, Happy Life "หลับดี จิตดี ชีวีมีสุข"',
                    'speaker': 'จิตแพทย์ผู้สูงอายุ สถาบันโรคทรวงอก & กรมสุขภาพจิต',
                    'key_takeaway': 'เทคนิคเข้านอนอย่างมีคุณภาพ ไม่พึ่งพายานอนหลับ และการจัดการความเหงาความซึมเศร้า',
                    'status': 'upcoming'
                },
                {
                    'time': '13:30 - 14:30',
                    'title': 'Alternative Medicine: การแพทย์แผนไทยและการแพทย์ทางเลือกสำหรับผู้สูงอายุ',
                    'speaker': 'กรมการแพทย์แผนไทยและการแพทย์ทางเลือก',
                    'key_takeaway': 'การนวดกดจุดแก้อาการปวดเมื่อย ยาสมุนไพรตำรับบำรุงธาตุ และศาสตร์ฤาษีดัดตน',
                    'status': 'upcoming'
                },
                {
                    'time': '14:30 - 15:30',
                    'title': 'Geriatric Care Models: บริบทที่แตกต่าง กับรูปแบบการดูแลสุขภาพผู้สูงอายุ',
                    'speaker': 'ผู้แทน รพ.สต. ดีเด่น และศูนย์ฟื้นฟูผู้สูงอายุชุมชน',
                    'key_takeaway': 'กรณีศึกษาความสำเร็จ "บวร วชร" ชุมชนดูแลผู้สูงอายุติดบ้านติดเตียงอย่างอบอุ่น',
                    'status': 'upcoming'
                },
                {
                    'time': '15:30 - 16:30',
                    'title': 'Day Care Activities & Services: กิจกรรมฟื้นฟูสำหรับศูนย์ดูแลผู้สูงอายุกลางวัน',
                    'speaker': 'นักกิจกรรมบำบัด สถาบันสิรินธรเพื่อการฟื้นฟูฯ',
                    'key_takeaway': 'เกมฝึกสมอง งานประดิษฐ์ ดนตรีบำบัด และการฝึกเคลื่อนไหวป้องกันการพลัดตกหกล้ม',
                    'status': 'upcoming'
                }
            ]
        },
        {
            'id': 'room_3',
            'room_code': 'Sapphire 206',
            'title_th': 'ห้องที่ 3: นโยบาย สังคม การเงิน & ป้องกันภัยไซเบอร์',
            'title_en': 'Room 3: Policy, Social, Finance & Senior Cyber Safety',
            'capacity': 300,
            'current_attendees': 295,
            'stage_size': '3.66 x 6.10 ม. (LED 5.00 x 3.00 ม.)',
            'theme_color': '#E67E22',
            'description': 'เวทีที่ผู้สูงอายุและครอบครัวให้ความสนใจสูงสุด วางแผนการเงินวัยเกษียณ ปรับปรุงบ้าน และรู้ทันกลโกงออนไลน์',
            'sessions': [
                {
                    'time': '09:30 - 10:30',
                    'title': 'Money and Finance for Aging in Place: บำนาญและการเงินวัยเกษียณ',
                    'speaker': 'ผู้เชี่ยวชาญจากตลาดหลักทรัพย์ (SET) & กอช. & ธนาคารออมสิน',
                    'key_takeaway': 'วางแผนเงินออมอย่างไรให้มีใช้ตลอดชีวิต และสิทธิประโยชน์เงินสมทบจากรัฐบาล',
                    'status': 'finished'
                },
                {
                    'time': '10:30 - 11:30',
                    'title': 'Cyber Security For Aging: รู้เท่าทันภัยไซเบอร์และมิจฉาชีพหลอกผู้สูงอายุ',
                    'speaker': 'กองบังคับการปราบปรามอาชญากรรมทางเทคโนโลยี (บก.ปอท.)',
                    'key_takeaway': '🚨 ไฮไลต์เด็ด: 5 มุกหลอกลวงยอดฮิตของแก๊งคอลเซ็นเตอร์ ลิงก์ดูดเงิน และวิธีป้องกันบัญชีธนาคาร',
                    'status': 'live'
                },
                {
                    'time': '11:30 - 12:30',
                    'title': 'Social Security: ประกันชีวิตโดยการส่งเสริมอาชีพหลังเกษียณ',
                    'speaker': 'กรมการจัดหางาน กระทรวงแรงงาน & ภาคเอกชน (บิ๊กซี)',
                    'key_takeaway': 'เปิดรับสมัครงานตำแหน่งยืดหยุ่นสำหรับผู้สูงวัย และการคุ้มครองสวัสดิการแรงงาน',
                    'status': 'upcoming'
                },
                {
                    'time': '13:30 - 14:30',
                    'title': 'Home Sweet Home: ปรับปรุงบ้านและเทคโนโลยีปลอดภัยสำหรับผู้สูงวัย',
                    'speaker': 'ศูนย์เชี่ยวชาญการออกแบบเพื่อทุกคน (Universal Design)',
                    'key_takeaway': 'จุดติดราวจับในห้องน้ำ ความสูงเตียงนอน แสงสว่าง และเซ็นเซอร์แจ้งเตือนการล้ม',
                    'status': 'upcoming'
                },
                {
                    'time': '14:30 - 15:30',
                    'title': 'สิทธิและกฎหมายสำหรับผู้สูงอายุในทุกมิติ',
                    'speaker': 'นักกฎหมายกระทรวงการพัฒนาสังคมและความมั่นคงของมนุษย์ (พม.)',
                    'key_takeaway': 'เบี้ยยังชีพ สิทธิลดหย่อนภาษี มรดก และการคุ้มครองผู้สูงอายุจากการถูกทอดทิ้ง',
                    'status': 'upcoming'
                },
                {
                    'time': '15:30 - 16:30',
                    'title': 'Care Giving - Families Caring Together: ครอบครัวร่วมใจดูแลผู้สูงอายุ',
                    'speaker': 'สสส. & สมาคมผู้บริบาลผู้สูงอายุไทย',
                    'key_takeaway': 'เทคนิคดูแลจิตใจผู้ดูแล (Caregiver Burnout) และการแบ่งเบาภาระในครอบครัว',
                    'status': 'upcoming'
                }
            ]
        }
    ],
    'booths': [
        {
            'id': 'booth_eye_ai',
            'code': 'S01',
            'title': 'ตรวจคัดกรองจอประสาทตา AI & วัดความแข็งหลอดเลือด CAVI',
            'agency': 'โรงพยาบาลราชวิถี',
            'category': 'service',
            'icon': '👁️',
            'highlight': 'ตรวจเบาหวานขึ้นจอตาใน 3 นาที ทราบผลทันที',
            'equipment': 'Fundus Camera AI, เครื่อง CAVI, เตียงตรวจ',
            'quota_left': 24,
            'quota_total': 60,
            'avg_wait_mins': 12,
            'pos': {'col': 1, 'row': 1},
            'color': '#27ae60'
        },
        {
            'id': 'booth_bone_vr',
            'code': 'S05',
            'title': 'ตรวจวัดมวลกระดูก & ฝึกสมองเสมือนจริง VR',
            'agency': 'สถาบันประสาทวิทยา',
            'category': 'service',
            'icon': '🦴',
            'highlight': 'ตรวจกระดูกพรุนด้วยอัลตราซาวด์ & สวมแว่น VR ท่องอวกาศกระตุ้นสมอง',
            'equipment': 'เครื่อง Bone Density, แว่น VR, Eye Movement Trainer',
            'quota_left': 18,
            'quota_total': 50,
            'avg_wait_mins': 15,
            'pos': {'col': 2, 'row': 1},
            'color': '#27ae60'
        },
        {
            'id': 'booth_hba1c',
            'code': 'S10',
            'title': 'เจาะน้ำตาลสะสม HbA1c & สุขภาพร่างกายครบวงจร',
            'agency': 'สถาบันเวชศาสตร์ฯ ผู้สูงอายุ (เจ้าภาพ)',
            'category': 'service',
            'icon': '🩸',
            'highlight': 'เจาะเลือดปลายนิ้วรู้ผลน้ำตาลสะสม 3 เดือนใน 5 นาที',
            'equipment': 'เครื่อง Cobas b 101, ชุดตรวจร่างกาย, ปริ้นเตอร์',
            'quota_left': 12,
            'quota_total': 70,
            'avg_wait_mins': 10,
            'pos': {'col': 3, 'row': 1},
            'color': '#27ae60'
        },
        {
            'id': 'booth_metta_eye',
            'code': 'S09',
            'title': 'ตรวจต้อกระจก ต้อหิน & บริการสปาเปลือกตา (Lid Spa)',
            'agency': 'โรงพยาบาลเมตตาประชารักษ์ (วัดไร่ขิง)',
            'category': 'service',
            'icon': '✨',
            'highlight': 'ส่องกล้อง Slit Lamp ตรวจต้อกระจก และประคบอุ่นนวดสปาเปลือกตาผ่อนคลาย',
            'equipment': 'Slit Lamp, Tonometry วัดความดันตา, เตียง Lid Spa',
            'quota_left': 16,
            'quota_total': 60,
            'avg_wait_mins': 14,
            'pos': {'col': 1, 'row': 2},
            'color': '#27ae60'
        },
        {
            'id': 'booth_dental_3d',
            'code': 'S08',
            'title': 'Digital Dentistry ตรวจสแกนช่องปากและฟัน 3D',
            'agency': 'สถาบันทันตกรรม กรมการแพทย์',
            'category': 'service',
            'icon': '🦷',
            'highlight': 'สแกนฟัน 3 มิติในช่องปาก ให้คำปรึกษารากฟันเทียมและฟันปลอม',
            'equipment': 'เครื่อง Intraoral 3D Scanner, เก้าอี้ทันตกรรมสนาม',
            'quota_left': 15,
            'quota_total': 50,
            'avg_wait_mins': 12,
            'pos': {'col': 2, 'row': 2},
            'color': '#27ae60'
        },
        {
            'id': 'booth_hur_gym',
            'code': 'P07',
            'title': 'อุปกรณ์ฝึกบริหารกล้ามเนื้อระบบแรงดันลม HUR ฟินแลนด์',
            'agency': 'บริษัท เอเอสจี เวลเนส แอนด์ อินโนเวชั่น จำกัด',
            'category': 'partner',
            'icon': '💪',
            'highlight': 'ออกกำลังกายไร้แรงกระแทก นั่งวีลแชร์ฝึกได้ ป้องกันการล้ม',
            'equipment': 'เครื่อง HUR ฟินแลนด์ 2 เครื่อง, จอคอมพิวเตอร์',
            'quota_left': 25,
            'quota_total': 60,
            'avg_wait_mins': 8,
            'pos': {'col': 3, 'row': 2},
            'color': '#e67e22'
        },
        {
            'id': 'booth_smartfit',
            'code': 'A02',
            'title': 'เกมฝึกสมองและการเคลื่อนไหว Smart Fit แสงไฟโต้ตอบ',
            'agency': 'รพ.สมเด็จพระสังฆราชฯ ชลบุรี',
            'category': 'academic',
            'icon': '🧠',
            'highlight': 'แตะไฟกะพริบฝึกความจำ สมาธิ และการตอบสนองของระบบประสาท',
            'equipment': 'ชุด Smart Fit 6 ดวง, Tablet, จอ All-in-One',
            'quota_left': 999,
            'quota_total': 999,
            'avg_wait_mins': 5,
            'pos': {'col': 1, 'row': 3},
            'color': '#00b4d8'
        },
        {
            'id': 'booth_peaceful_death',
            'code': 'P01',
            'title': 'การวางแผนดูแลล่วงหน้า Living Will & การอยู่และตายดี',
            'agency': 'ชุมชนกรุณาเพื่อการอยู่และตายดี (Peaceful Death)',
            'category': 'partner',
            'icon': '🕊️',
            'highlight': 'เวิร์กชอปเขียนหนังสือแสดงเจตนา และเกมไพ่ไขชีวิตคุยเรื่องระยะสุดท้ายอย่างอบอุ่น',
            'equipment': 'โต๊ะกิจกรรมกลุ่ม, เกมไพ่ไขชีวิต, เอกสารมาตรา 12',
            'quota_left': 35,
            'quota_total': 80,
            'avg_wait_mins': 10,
            'pos': {'col': 2, 'row': 3},
            'color': '#e67e22'
        },
        {
            'id': 'booth_cyber_safety',
            'code': 'P04',
            'title': 'ศูนย์เตือนภัยไซเบอร์ & วางแผนเงินเกษียณ Happy Money',
            'agency': 'ตลาดหลักทรัพย์แห่งประเทศไทย (SET) & บก.ปอท.',
            'category': 'partner',
            'icon': '🛡️',
            'highlight': 'ตรวจเช็กความปลอดภัยมือถือ ป้องกันแอปดูดเงิน & คำนวณเงินออมวัยเกษียณ',
            'equipment': 'แท็บเล็ตทดสอบความรู้เท่าทันมิจฉาชีพ, คู่มือ Happy Money',
            'quota_left': 999,
            'quota_total': 999,
            'avg_wait_mins': 5,
            'pos': {'col': 3, 'row': 3},
            'color': '#e67e22'
        }
    ],
    'elderly_visitors': [
        {
            'id': 'elder_1',
            'name': 'คุณยายสมศรี ใจอารีย์',
            'age': 76,
            'avatar': '👵',
            'condition': 'เบาหวานชนิดที่ 2, สายตาพร่ามัว',
            'mobility': 'เดินช้า มีไม้เท้าช่วยพยุง',
            'target_interest': 'ต้องการตรวจคัดกรองจอประสาทตา (S01) และฟังห้องเสวนาสมองเสื่อม',
            'fatigue': 25,
            'status': 'กำลังเดินไปบูธตรวจตา รพ.ราชวิถี',
            'booth_code': 'S01'
        },
        {
            'id': 'elder_2',
            'name': 'คุณตาบุญมี เกษมสุข',
            'age': 82,
            'avatar': '👴',
            'condition': 'ข้อเข่าเสื่อมระยะที่ 3, กระดูกพรุน',
            'mobility': 'ใช้วีลแชร์ (มีลูกสาวเข็นให้)',
            'target_interest': 'ต้องการตรวจวัดมวลกระดูก (S05) และทดลองเครื่อง HUR ฟินแลนด์',
            'fatigue': 40,
            'status': 'กำลังต่อคิวตรวจมวลกระดูก สถาบันประสาทวิทยา',
            'booth_code': 'S05'
        },
        {
            'id': 'elder_3',
            'name': 'ป้ามาลี รัตนพงษ์',
            'age': 68,
            'avatar': '👵',
            'condition': 'ความดันโลหิตสูง, กังวลเรื่องความจำสั้น',
            'mobility': 'เดินคล่อง กระฉับกระเฉง',
            'target_interest': 'เล่นเกม Smart Fit (A02) และฟังสัมมนาภัยไซเบอร์แก๊งคอลเซ็นเตอร์',
            'fatigue': 15,
            'status': 'กำลังร่วมกิจกรรมกระตุ้นสมอง รพ.สมเด็จพระสังฆราชฯ',
            'booth_code': 'A02'
        },
        {
            'id': 'elder_4',
            'name': 'หลวงตาบุญธรรม',
            'age': 75,
            'avatar': '🧘',
            'condition': 'พระสงฆ์สูงวัย, กรดไหลย้อน, ต้อกระจก',
            'mobility': 'เดินปกติ มีโยมอุปัฏฐากดูแล',
            'target_interest': 'ตรวจตา รพ.เมตตาประชารักษ์ (S09) และรับชุดโภชนาการภัตตาหารสุขภาพ',
            'fatigue': 30,
            'status': 'กำลังรับคำปรึกษาต้อกระจกและนวดสปาเปลือกตา',
            'booth_code': 'S09'
        },
        {
            'id': 'elder_5',
            'name': 'ลุงวิชัย พัฒนกิจ',
            'age': 64,
            'avatar': '👨‍🦳',
            'condition': 'เพิ่งเกษียณ สุขภาพแข็งแรงดี',
            'mobility': 'เดินเร็ว คล่องตัว',
            'target_interest': 'สมัครงานผู้สูงอายุ และฟังสัมมนาการเงินวัยเกษียณห้อง 3',
            'fatigue': 10,
            'status': 'กำลังเดินไปห้องเสวนา Sapphire 206',
            'booth_code': 'P04'
        }
    ],
    'crises': [
        {
            'id': 'crisis_bus_rush',
            'title': 'รถบัสผู้สูงอายุ 5 ชมรมมาถึงพร้อมกัน 80 คน',
            'desc': 'ผู้สูงอายุเดินทางมาถึงจุดลงทะเบียนพร้อมกัน ทำให้เกิดคิวสะสมยาวและต้องการความช่วยเหลือเรื่องวีลแชร์',
            'impact': {'wait_time': '+18 นาที', 'backlog': '+45 คน', 'fatigue': '+25%'},
            'ai_solution': 'เปิดช่อง Fast-Track พิเศษสำหรับ 80+, กระจายเจ้าหน้าที่ช่วยเข็นรถเข็น, จัดจุดนั่งพักแจกน้ำสมุนไพร'
        },
        {
            'id': 'crisis_eye_quota',
            'title': 'โควตาคัดกรองจอประสาทตา AI (S01) ใกล้เต็ม',
            'desc': 'ผู้สูงอายุให้ความสนใจตรวจตาจำนวนมาก คิวรอเกิน 20 คน ทำให้บางท่านยืนรอนานจนเมื่อยล้า',
            'impact': {'wait_time': '+25 นาที', 'backlog': '+30 คน', 'fatigue': '+35%'},
            'ai_solution': 'เปิดรับบัตรคิวดิจิทัลแจ้งเตือนทาง SMS, จัดเก้าอี้พักคอยเสริม, แนะนำคิวสำรองที่บูธ รพ.เมตตาประชารักษ์ (S09)'
        },
        {
            'id': 'crisis_cyber_scam_rush',
            'title': 'คนแน่นทะลักห้องเสวนาภัยไซเบอร์ (Sapphire 206)',
            'desc': 'หัวข้อรู้ทันแก๊งคอลเซ็นเตอร์มีผู้สูงอายุและลูกหลานต้องการเข้าฟังเกิน 300 ที่นั่ง',
            'impact': {'wait_time': '+10 นาที', 'backlog': '+60 คน', 'fatigue': '+15%'},
            'ai_solution': 'เปิดจอถ่ายทอดสด Live Streaming หน้าห้อง, จัดเก้าอี้เสริมโซน Foyer, แจกคู่มือสรุป 5 มุกโจรทันที'
        },
        {
            'id': 'crisis_lost_senior',
            'title': 'คุณยายวัย 83 ปี พลัดหลงกับผู้ดูแลในโถงนิทรรศการ',
            'desc': 'คุณยายมีอาการหลงลืมเบื้องต้น ไม่สามารถจำเบอร์โทรศัพท์บุตรหลานได้',
            'impact': {'wait_time': 'ด่วนพิเศษ', 'backlog': 'ฉุกเฉิน', 'fatigue': '+40%'},
            'ai_solution': 'จิตอาสาพามายังจุดพักผ่อน Care Center, สแกนริสต์แบนด์ QR งานมหกรรม ติดต่อบุตรหลานได้ใน 3 นาที'
        }
    ]
}

out_js = r'C:\Users\Piyanut\Desktop\Code_Work\elderly_forum_6_simulation\data\forum6_data.js'
with open(out_js, 'w', encoding='utf-8') as f:
    f.write('window.FORUM6_DATA = ')
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write(';\n')

print('Generated forum6_data.js successfully!')
