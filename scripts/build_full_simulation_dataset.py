# -*- coding: utf-8 -*-
import json
import os

booths_file = r'C:\Users\Piyanut\Desktop\Code_Work\elderly_forum_simulation\data\booths.json'
with open(booths_file, 'r', encoding='utf-8') as f:
    booths = json.load(f)

event_info = {
    'name_th': 'การประชุมวิชาการเวชศาสตร์และวิทยาการด้านผู้สูงอายุ ครั้งที่ 5 (The 5th Thailand Elderly Health Service Forum 2025)',
    'name_en': 'The 5th Thailand Elderly Health Service Forum 2025',
    'edition': 5,
    'theme_th': 'บูรณาการทุกมิติ..... เพื่อชีวิตที่ดีกว่าของผู้สูงอายุ',
    'theme_en': 'Comprehensive Integration For Better Elderly Lives',
    'organizer': 'สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ กรมการแพทย์ กระทรวงสาธารณสุข',
    'dates': '21 - 23 มกราคม 2568',
    'venue': 'อาคาร อิมแพค ฟอรัม เมืองทองธานี (IMPACT Forum Muang Thong Thani)',
    'expected_attendees': 1500,
    'theme_colors': {
        'coral_gold': {'hex': '#D97757', 'name': 'Coral Gold (สีน้ำตาลอมส้ม)', 'meaning': 'เปี่ยมพลัง สุขภาพ การบำบัดจิตใจ'},
        'capri': {'hex': '#00B4D8', 'name': 'Capri (สีฟ้าอมเขียว)', 'meaning': 'มีชีวิตชีวา แข็งแกร่ง ทรงพลัง แต่นุ่มนวล'},
        'peach_fuzz': {'hex': '#FFBE98', 'name': 'Peach Fuzz (สีพีชอ่อนละมุน)', 'meaning': 'อบอุ่น อ่อนโยน ทันสมัย มองโลกในแง่ดี'},
        'butterfly': {'hex': '#88D49E', 'name': 'Butterfly (สีเขียวอ่อนดิจิทัล)', 'meaning': 'พลังจินตนาการและสิ่งแวดล้อมยั่งยืน'}
    },
    'dimensions': [
        {'id': 'health', 'title': 'มิติสุขภาพ', 'icon': '❤️', 'desc': 'ระบบสุขภาพที่เหมาะสม ศูนย์ฟื้นฟู นวัตกรรมเทคโนโลยี การแพทย์ทางเลือก สุขภาพจิต'},
        {'id': 'economy', 'title': 'มิติเศรษฐกิจ', 'icon': '💰', 'desc': 'ระบบบำนาญ การออม ปฏิรูประบบการเงิน การจ้างงานผู้สูงอายุ ขยายอายุเกษียณ'},
        {'id': 'environment', 'title': 'มิติสภาพแวดล้อม', 'icon': '🏡', 'desc': 'บ้าน-ชุมชนที่เหมาะกับผู้สูงอายุ พื้นที่สาธารณะ Universal Design สิ่งอำนวยความสะดวก'},
        {'id': 'society', 'title': 'มิติสังคม', 'icon': '🤝', 'desc': 'บวร วชร (บ้าน วัด โรงเรียน วิสาหกิจ ชมรม โรงพยาบาล) เครือข่ายจิตอาสา สวัสดิการสังคม'}
    ]
}

stages = [
    {
        'id': 'grand_diamond',
        'name': 'Grand Diamond Ballroom',
        'type': 'Main Plenary Hall',
        'capacity': 1000,
        'vip_capacity': 21,
        'stage_dimensions': '4.88 x 12.20 x 1.00 เมตร',
        'led_screen': '10.00 x 4.00 เมตร',
        'sessions': [
            {'time': '08:30 - 09:00', 'title': 'ลงทะเบียนผู้เข้าร่วมประชุมวิชาการและชมนิทรรศการ', 'speaker': 'ฝ่ายต้อนรับและลงทะเบียน', 'expected_attendance': 950},
            {'time': '09:00 - 09:30', 'title': 'พิธีเปิดงานมหกรรมสุขภาพผู้สูงอายุ ครั้งที่ 5', 'speaker': 'รัฐมนตรีว่าการกระทรวงสาธารณสุข / อธิบดีกรมการแพทย์', 'expected_attendance': 1000},
            {'time': '09:30 - 10:15', 'title': 'ปาฐกถาพิเศษ: "สร้างนำซ่อม...เพื่อป้องกันโรคเรื้อรังในผู้สูงอายุด้วยนวัตกรรมและภูมิปัญญาไทย"', 'speaker': 'ผู้ทรงคุณวุฒิระดับประเทศ', 'expected_attendance': 1000},
            {'time': '10:15 - 10:45', 'title': 'การแสดงดนตรีบำบัด "บรรเลงกู่เจิง"', 'speaker': 'วง Guzheng Ensemble สถาบันประสาทวิทยา', 'expected_attendance': 950},
            {'time': '10:45 - 12:00', 'title': 'การเสวนาผู้บริหารระดับสูง: "การขับเคลื่อนเศรษฐกิจสุขภาพ คู่ขนานภูมิปัญญาไทย เพื่อรองรับสังคมสูงวัย"', 'speaker': 'ผู้บริหารระดับสูง สธ., พม., มท., สสส., TCELS', 'expected_attendance': 900},
            {'time': '12:00 - 13:00', 'title': 'พักรับประทานอาหารกลางวัน และชมนิทรรศการบูธสุขภาพ', 'speaker': 'Exhibition & Networking Break', 'expected_attendance': 300},
            {'time': '13:00 - 15:30', 'title': 'Plenary Lecture: "สังคมสูงอายุไทย เท่าทันโลกไซเบอร์และการเปลี่ยนแปลงประชากร"', 'speaker': 'วิทยากรผู้เชี่ยวชาญด้านเศรษฐกิจดิจิทัลและผู้สูงอายุ', 'expected_attendance': 850},
            {'time': '15:30 - 16:30', 'title': 'Closing Plenary Lecture & สรุปทิศทางนโยบายผู้สูงอายุไทยสู่เวทีอาเซียน', 'speaker': 'คณะกรรมการจัดงานและสถาบันเวชศาสตร์ฯ ผู้สูงอายุ', 'expected_attendance': 800}
        ]
    },
    {
        'id': 'sapphire_204',
        'name': 'Sapphire 204 (Room 1)',
        'type': 'International Discussion',
        'capacity': 200,
        'stage_dimensions': '3.66 x 6.10 x 0.60 เมตร',
        'led_screen': '5.00 x 3.00 เมตร',
        'sessions': [
            {'time': '09:30 - 10:30', 'title': 'Geriatric Medicine: Technology and Innovation for Future Challenges', 'speaker': 'International Geriatric Experts & ACAI', 'expected_attendance': 190},
            {'time': '10:30 - 11:30', 'title': 'Dementia Management for the Elderly: AI & Digital Biomarkers', 'speaker': 'Neurology & Cognitive Research Team', 'expected_attendance': 200},
            {'time': '11:30 - 12:30', 'title': 'Geriatric Dentistry: Oral Health Care for Good Nutrition in the Elderly', 'speaker': 'สถาบันทันตกรรม & International Dental Forum', 'expected_attendance': 175},
            {'time': '13:30 - 14:30', 'title': 'Palliative and End-of-Life Care Center for the Elderly', 'speaker': 'Palliative Care Specialists Network', 'expected_attendance': 195},
            {'time': '14:30 - 15:30', 'title': 'Geriatric Emergency & Disaster Services System for Elderly', 'speaker': 'Emergency Medical System & Disaster Preparedness Team', 'expected_attendance': 180},
            {'time': '15:30 - 16:30', 'title': 'Age-Friendly City & Fall Protection Technologies in ASEAN Context', 'speaker': 'ACAI & Urban Planning Delegates', 'expected_attendance': 190}
        ]
    },
    {
        'id': 'sapphire_205',
        'name': 'Sapphire 205 (Room 2)',
        'type': 'Multidisciplinary Care',
        'capacity': 300,
        'stage_dimensions': '3.66 x 6.10 x 0.60 เมตร',
        'led_screen': '5.00 x 3.00 เมตร',
        'sessions': [
            {'time': '09:30 - 10:30', 'title': 'Geriatric Care Development in Thailand: บทบาทและพัฒนาการด้านการดูแลผู้สูงอายุ', 'speaker': 'สถาบันเวชศาสตร์ฯ ผู้สูงอายุ & รพ.เครือข่ายกรมการแพทย์', 'expected_attendance': 285},
            {'time': '10:30 - 11:30', 'title': 'Pre-Aging, Pre-Frailty and Anti-Aging: ศาสตร์ชะลอวัยและป้องกันภาวะเปราะบาง', 'speaker': 'อายุรแพทย์เวชศาสตร์ผู้สูงอายุ & นักกายภาพบำบัด', 'expected_attendance': 300},
            {'time': '11:30 - 12:30', 'title': 'บทบาทและภาคเครือข่ายสาธารณสุขในการดูแลผู้สูงอายุที่มีภาวะสมองเสื่อม', 'speaker': 'สถาบันประสาทวิทยา & สมาคมผู้ดูแลผู้ป่วยสมองเสื่อม', 'expected_attendance': 290},
            {'time': '13:30 - 14:30', 'title': 'Sleep well, Happy mind, Happy Life "หลับดี จิตดี ชีวีมีสุข"', 'speaker': 'สถาบันโรคทรวงอก & กรมสุขภาพจิต', 'expected_attendance': 300},
            {'time': '14:30 - 15:30', 'title': 'Alternative and Traditional Medicine: การแพทย์ทางเลือกและการแพทย์แผนไทยในผู้สูงวัย', 'speaker': 'กรมการแพทย์แผนไทยและการแพทย์ทางเลือก', 'expected_attendance': 280},
            {'time': '15:30 - 16:30', 'title': 'Day Care Activities and Services สำหรับผู้สูงอายุในปัจจุบันและอนาคต', 'speaker': 'ผู้เชี่ยวชาญด้านกิจกรรมบำบัดและ Day Care Center', 'expected_attendance': 270}
        ]
    },
    {
        'id': 'sapphire_206',
        'name': 'Sapphire 206 (Room 3)',
        'type': 'Policy / Social / Environment',
        'capacity': 300,
        'stage_dimensions': '3.66 x 6.10 x 0.60 เมตร',
        'led_screen': '5.00 x 3.00 เมตร',
        'sessions': [
            {'time': '09:30 - 10:30', 'title': 'Money and Finance for Aging in Place: บำนาญและการเงินวัยเกษียณ', 'speaker': 'ตลาดหลักทรัพย์แห่งประเทศไทย (SET) & ธนาคารออมสิน & กอช.', 'expected_attendance': 295},
            {'time': '10:30 - 11:30', 'title': 'Social Security: ประกันชีวิตโดยการส่งเสริมอาชีพหลังเกษียณ', 'speaker': 'กรมการจัดหางาน กระทรวงแรงงาน & ภาคเอกชน Big C', 'expected_attendance': 275},
            {'time': '11:30 - 12:30', 'title': 'Home Use & Technology For Aging: Home Sweet Home ปรับปรุงบ้านเพื่อผู้สูงอายุ', 'speaker': 'ศูนย์เชี่ยวชาญการออกแบบเพื่อทุกคน & กรมสนับสนุนบริการสุขภาพ', 'expected_attendance': 285},
            {'time': '13:30 - 14:30', 'title': 'Cyber Security For Aging "รู้เท่าทันภัยไซเบอร์และมิจฉาชีพในผู้สูงอายุ"', 'speaker': 'กองบังคับการสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี', 'expected_attendance': 300},
            {'time': '14:30 - 15:30', 'title': 'Age Friendly Community and Environment for Thai Context', 'speaker': 'ผู้แทนองค์กรปกครองส่วนท้องถิ่น & นักวิชาการด้านสังคมศาสตร์', 'expected_attendance': 280},
            {'time': '15:30 - 16:30', 'title': 'Care giving – Families Caring Together "ผู้ดูแล ครอบครัว สังคม กับการดูแลผู้สูงอายุ"', 'speaker': 'สมาคมผู้บริบาลผู้สูงอายุไทย & สสส.', 'expected_attendance': 290}
        ]
    }
]

landmarks = [
    {
        'id': 'registration_desk',
        'name': 'Registration Desk (จุดลงทะเบียน)',
        'x': 17.5,
        'y': 25.5,
        'w': 9.0,
        'h': 1.6,
        'desc': 'เคาน์เตอร์ลงทะเบียน 10 จุด รับป้ายชื่อ เอกสาร และของที่ระลึก'
    },
    {
        'id': 'directory_board',
        'name': 'Directory Board (ผังนิทรรศการและนำทาง)',
        'x': 10.5,
        'y': 24.5,
        'w': 2.4,
        'h': 0.6,
        'desc': 'ป้ายผังงานรวมขนาด 2.40 x 2.50 เมตร พร้อม QR Code ค้นหาบูธ'
    },
    {
        'id': 'photo_backdrop',
        'name': 'Photo Backdrop (จุดถ่ายภาพที่ระลึก)',
        'x': 36.0,
        'y': 25.0,
        'w': 6.0,
        'h': 1.2,
        'desc': 'ฉากถ่ายภาพหลักขนาด 3.00 x 6.00 เมตร ลวดลาย Forum 2025'
    },
    {
        'id': 'grand_staircase',
        'name': 'Grand Staircase & Escalators (บันไดและบันไดเลื่อนขึ้น-ลง)',
        'x': 35.5,
        'y': 11.5,
        'w': 10.0,
        'h': 7.5,
        'desc': 'บันไดหลักและบันไดเลื่อนเชื่อมต่อระหว่างชั้นของอาคารอิมแพค ฟอรัม'
    },
    {
        'id': 'water_fall',
        'name': 'Water Fall Feature (ม่านน้ำตกประดับ)',
        'x': 52.0,
        'y': 12.0,
        'w': 1.5,
        'h': 6.0,
        'desc': 'น้ำตกและจุดพักผ่อนริมโถงทางเดิน'
    },
    {
        'id': 'archway_west',
        'name': 'Welcome Archway (ซุ้มประตูทางเข้า)',
        'x': 0.5,
        'y': 7.0,
        'w': 0.8,
        'h': 3.0,
        'desc': 'ซุ้มต้อนรับขนาด 0.50 x 3.00 x 4.00 เมตร'
    }
]

simulation_config = {
    'hall_bounds': {'width': 56.0, 'height': 28.0, 'margin': 1.0},
    'aisle_widths': {
        'main_corridor_north': 6.2,
        'main_corridor_center': 4.1,
        'side_corridors': 3.0,
        'east_corridor': 5.5,
        'stairs_clearance': 7.5,
        'registration_foyer': 5.7
    },
    'personas': [
        {
            'type': 'elderly',
            'name': 'ผู้สูงอายุ (Elderly Visitor)',
            'icon': '🧓',
            'color': '#E67E22',
            'speed': 0.7,
            'share_pct': 40,
            'interests': ['S01', 'S09', 'S10', 'S05', 'S03', 'S06', 'S07', 'S08', 'S04', 'S02', 'A02', 'A09', 'P01', 'P04'],
            'dwell_mins': [10, 20]
        },
        {
            'type': 'doctor_nurse',
            'name': 'แพทย์ / พยาบาล / สหวิชาชีพ (Healthcare Pro)',
            'icon': '🩺',
            'color': '#2980B9',
            'speed': 1.1,
            'share_pct': 30,
            'interests': ['sapphire_204', 'sapphire_205', 'grand_diamond', 'A01', 'A18', 'A17', 'A10', 'A08', 'A11', 'S01', 'S05', 'S08'],
            'dwell_mins': [15, 45]
        },
        {
            'type': 'caregiver_family',
            'name': 'ผู้ดูแลและประชาชนทั่วไป (Caregiver & Public)',
            'icon': '👨‍👩‍👦',
            'color': '#27AE60',
            'speed': 0.9,
            'share_pct': 20,
            'interests': ['P01', 'P07', 'P08', 'P06', 'P03', 'P04', 'A16', 'A14', 'A13', 'A12', 'A07', 'A06', 'S11', 'S13', 'sapphire_206'],
            'dwell_mins': [8, 25]
        },
        {
            'type': 'monk_vip',
            'name': 'พระสงฆ์ / แขกวีไอพี (Monk / VIP)',
            'icon': '🧘',
            'color': '#D35400',
            'speed': 0.8,
            'share_pct': 5,
            'interests': ['S02', 'grand_diamond', 'A12', 'S10'],
            'dwell_mins': [15, 30]
        },
        {
            'type': 'student_researcher',
            'name': 'นักศึกษา / นักวิจัย (Student / Researcher)',
            'icon': '🎓',
            'color': '#8E44AD',
            'speed': 1.2,
            'share_pct': 5,
            'interests': ['A17', 'A10', 'A18', 'A02', 'A11', 'sapphire_204', 'sapphire_205', 'grand_diamond'],
            'dwell_mins': [10, 30]
        }
    ]
}

full_data = {
    'event': event_info,
    'booths': booths,
    'stages': stages,
    'landmarks': landmarks,
    'simulation_config': simulation_config,
    'meta': {
        'total_booths': len(booths),
        'total_booth_units': sum(b['units'] for b in booths),
        'total_services': sum(len(b['services']) for b in booths),
        'total_screening_quota': sum(b['quota_total'] or 0 for b in booths),
        'total_stages': len(stages),
        'total_stage_capacity': sum(s['capacity'] for s in stages)
    }
}

# Write JSON
json_path = r'C:\Users\Piyanut\Desktop\Code_Work\elderly_forum_simulation\data\simulation_data.json'
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(full_data, f, ensure_ascii=False, indent=2)

# Write JS wrapper for zero-cors browser file usage
js_path = r'C:\Users\Piyanut\Desktop\Code_Work\elderly_forum_simulation\data\simulation_data.js'
with open(js_path, 'w', encoding='utf-8') as f:
    f.write('window.FORUM_SIMULATION_DATA = ')
    json.dump(full_data, f, ensure_ascii=False, indent=2)
    f.write(';\n')

print(f"Dataset assembled successfully into JSON and JS!")
print(f"Event: {event_info['name_th']}")
print(f"Booths: {full_data['meta']['total_booths']} booths ({full_data['meta']['total_booth_units']} units)")
print(f"Total screening capacity: {full_data['meta']['total_screening_quota']} persons/day")
print(f"Total stage capacity: {full_data['meta']['total_stage_capacity']} seats across {full_data['meta']['total_stages']} halls")
