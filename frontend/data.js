/**
 * TTM CrossBridge AI - Embedded Clinical Knowledge Base
 * Sources: DTAM (กรมการแพทย์แผนไทยและการแพทย์ทางเลือก)
 */

const TTM_DATA = {
  icdMappings: [
    {
      id: "MAP-001",
      ttmName: "ลมจับโปงแห้งเข่า",
      ttmEng: "Lom Jub Pong Haeng Khao",
      icd10tm: "U60.20",
      icd10tmTitle: "ลมจับโปงแห้งเข่า (ข้อเข่าเสื่อม)",
      icd10: "M17.9",
      icd10Title: "Osteoarthritis of knee, unspecified",
      elementImbalance: "ธาตุลม (วาโย) กำเริบ, ธาตุดิน (อัฐิ/ข้อกระดูก) หย่อน",
      dosha: "วาตะ (Vata)",
      category: "อาการปวดเรื้อรัง / ข้อเข่า",
      recommendedHerbs: ["เถาวัลย์เปรียง", "ไพล", "ลูกประคบสมุนไพร", "ยาน้ำมันไตรตรึงค์"],
      inclusionCriteria: "ปวดขัดข้อเข่า ข้อฝืดตึงตอนเช้า < 30 นาที อายุ > 45 ปี",
      redFlags: "ข้อเข่าบวมแดงร้อนรุนแรง (สงสัย Septic arthritis หรือ Gout), มีไข้สูง, ลงน้ำหนักไม่ได้"
    },
    {
      id: "MAP-002",
      ttmName: "ลมปลายปัตฆาตหัวไหล่/สะบัก",
      ttmEng: "Lom Plai Pattakhat",
      icd10tm: "U62.00",
      icd10tmTitle: "ลมปลายปัตฆาต (กลุ่มอาการปวดกล้ามเนื้อและเยื่อพังผืด)",
      icd10: "M79.1",
      icd10Title: "Myalgia / Myofascial pain syndrome",
      elementImbalance: "ธาตุลม (วาโย) คั่งคั่ง ติดขัดในเส้นประธานสิบ (อิทา-ปิงคลา)",
      dosha: "วาตะ (Vata)",
      category: "อาการปวดเรื้อรัง / ออฟฟิศซินโดรม",
      recommendedHerbs: ["เถาวัลย์เปรียง", "ยาธาตุอบเชย", "น้ำมันไพล", "การนวดราชสำนัก"],
      inclusionCriteria: "ปวดตึงกล้ามเนื้อคอบ่าไหล่ มี Trigger point คลำได้ลำกล้ามเนื้อตึง",
      redFlags: "มีอาการชาร้าวลงแขน กล้ามเนื้อแขนลีบอ่อนแรง (สงสัย Cervical radiculopathy)"
    },
    {
      id: "MAP-003",
      ttmName: "ไข้หวัด / ไข้เปลี่ยนฤดู",
      ttmEng: "Khai Wat (Seasonal Cold)",
      icd10tm: "U56.00",
      icd10tmTitle: "โรคไข้หวัด (อาการไข้ต่ำ เจ็บคอ คัดจมูก)",
      icd10: "J00",
      icd10Title: "Acute nasopharyngitis [common cold]",
      elementImbalance: "ธาตุไฟ (เตโช - สันตัปปัคคี) กำเริบ, ธาตุน้ำ (เสมหะ) คั่ง",
      dosha: "ปิตตะ-เสมหะ (Pitta-Kapha)",
      category: "โรคติดเชื้อทางเดินหายใจส่วนบนเฉียบพลัน",
      recommendedHerbs: ["ฟ้าทะลายโจร", "ยาประสะมะแว้ง", "ยาจันทลีลา", "ยาปราบชมพูทวีป"],
      inclusionCriteria: "ไข้ต่ำ < 38.5 C, เจ็บคอ คัดจมูก น้ำมูกไหล ไม่มีอาการหอบเหนื่อย",
      redFlags: "หายใจหอบเหนื่อย, SpO2 < 95%, ไข้สูงหนาวสั่น > 3 วัน, ผู้ป่วยตั้งครรภ์"
    },
    {
      id: "MAP-004",
      ttmName: "มธุรเมหะ (โรคเบาหวาน)",
      ttmEng: "Mathurameha (Diabetes Mellitus)",
      icd10tm: "U72.10",
      icd10tmTitle: "มธุรเมหะ (ปัสสาวะหวาน / เบาหวาน)",
      icd10: "E11.9",
      icd10Title: "Type 2 diabetes mellitus without complications",
      elementImbalance: "ธาตุน้ำ (เสมหะ/มุตตะ) พิการ, ธาตุดิน (วักกัง/ตับม้าม) แปรปรวน",
      dosha: "เสมหะ-ปิตตะ (Kapha-Pitta)",
      category: "โรคไม่ติดต่อเรื้อรัง (NCDs)",
      recommendedHerbs: ["ใบชะพลู", "มะระขี้นก", "ยาบำรุงธาตุ", "ตรีผลา"],
      inclusionCriteria: "เบาหวานชนิดที่ 2 อายุ 30-70 ปี, FBS 126 - 180 mg/dL, HbA1c 7.0 - 7.9%",
      redFlags: "FBS > 180 mg/dL, HbA1c > 8.0%, eGFR < 60, Serum Cr > 1.5, สงสัย DKA"
    },
    {
      id: "MAP-005",
      ttmName: "ลมแน่นอึดอัด / ท้องอืดท้องเฟ้อ",
      ttmEng: "Lom Naen Ut-At / Dyspepsia",
      icd10tm: "U77.10",
      icd10tmTitle: "ลมในกระเพาะและลำไส้ (ท้องอืด ท้องเฟ้อ แน่นจุกเสียด)",
      icd10: "K30",
      icd10Title: "Functional dyspepsia",
      elementImbalance: "ธาตุลม (โกฏฐาสยาวาตา) กำเริบ, ธาตุไฟย่อยอาหาร (ปริณามัคคี) หย่อน",
      dosha: "วาตะ-ปิตตะ (Vata-Pitta)",
      category: "ระบบทางเดินอาหาร",
      recommendedHerbs: ["ขมิ้นชัน", "ยาขมิ้นชันแคปซูล", "ยาประสะกะเพรา", "ยาธาตุบรรจบ", "ขิง"],
      inclusionCriteria: "จุกเสียด แน่นท้อง ท้องอืด มีลมในกระเพาะ ถ่ายอุจจาระปกติ",
      redFlags: "ถ่ายดำ (Melena), อาเจียนเป็นเลือด, น้ำหนักลดผิดปกติ, กลืนลำบาก"
    },
    {
      id: "MAP-006",
      ttmName: "โรคนอนไม่หลับ (ลมระส่ำระสาย)",
      ttmEng: "Non Mai Lub / Insomnia",
      icd10tm: "U57.00",
      icd10tmTitle: "โรคนอนไม่หลับตามศาสตร์แพทย์แผนไทย",
      icd10: "G47.0",
      icd10Title: "Insomnia, unspecified",
      elementImbalance: "หทัยวาตะ (ลมควบคุมจิตใจ) กำเริบ, เตโชธาตุร้อนเกิน",
      dosha: "วาตะ-ปิตตะ (Vata-Pitta)",
      category: "อาการนอนไม่หลับ",
      recommendedHerbs: ["ยาหอมนวโกฐ", "ยาหอมอินทจักร์", "บัวบก", "การนวดศีรษะ"],
      inclusionCriteria: "หลับยาก ตื่นบ่อย หลับไม่สนิท ไม่มีภาวะซึมเศร้ารุนแรง",
      redFlags: "มีความคิดฆ่าตัวตาย (Suicidal risk), อาการประสาทหลอน, เสพติดยานอนหลับขนาดสูง"
    }
  ],

  hdiRules: [
    {
      id: "HDI-001",
      herb: "ฟ้าทะลายโจร",
      drugKeywords: ["warfarin", "aspirin", "clopidogrel", "dabigatran", "rivaroxaban"],
      severity: "RED",
      title: "ห้ามใช้ร่วมกันเด็ดขาด (Contraindicated)",
      mechanism: "สาร Andrographolide มีฤทธิ์ Antiplatelet aggregation และยับยั้งเอนไซม์ CYP2C9 ซึ่งทำลาย Warfarin ส่งผลให้ระดับยาในเลือดสูงขึ้นอย่างมีนัยสำคัญ",
      clinicalRisk: "เพิ่มความเสี่ยง Major Bleeding, เลือดออกในทางเดินอาหาร หรือเลือดออกในสมอง",
      recommendation: "【สั่งหยุดฟ้าทะลายโจรทันที】 รักษาไข้หวัดด้วยยาพาราเซตามอลหรือยาบรรเทาอาการอื่นที่ไม่ต้านเกล็ดเลือด",
      action: "STOP_HERB"
    },
    {
      id: "HDI-002",
      herb: "ฟ้าทะลายโจร",
      drugKeywords: ["amlodipine", "enalapril", "losartan"],
      severity: "YELLOW",
      title: "เฝ้าระวังความดันโลหิต (Monitor with Caution)",
      mechanism: "ฟ้าทะลายโจรมีฤทธิ์ลดความดันโลหิตแบบเสริมฤทธิ์ (Additive hypotensive effect)",
      clinicalRisk: "อาจเกิดอาการหน้ามืด วิงเวียน หรือความดันตกขณะเปลี่ยนท่า (Orthostatic hypotension)",
      recommendation: "ใช้ระยะสั้นไม่เกิน 5-7 วันตาม CPG หวัด และรับประทานห่างจากยาความดันอย่างน้อย 2 ชั่วโมง",
      action: "MONITOR"
    },
    {
      id: "HDI-003",
      herb: "เถาวัลย์เปรียง",
      drugKeywords: ["paracetamol", "tramadol"],
      severity: "GREEN",
      title: "ปลอดภัยและส่งเสริมการรักษา (Safe & Synergistic)",
      mechanism: "สารสกัดเถาวัลย์เปรียงยับยั้งเอนไซม์ COX-2 ต้านการอักเสบเทียบเท่า Diclofenac แต่ปลอดภัยต่อไตและกระเพาะอาหารอย่างมาก",
      clinicalRisk: "ไม่มีความเสี่ยงที่มีนัยสำคัญทางคลินิก",
      recommendation: "【สนับสนุนให้รับประทานต่อ】 สามารถใช้เป็น First-Line Drug เพื่อลดการใช้ยาเคมีสังเคราะห์กลุ่ม NSAIDs ในผู้สูงอายุ",
      action: "SUPPORT_HERB"
    },
    {
      id: "HDI-004",
      herb: "เถาวัลย์เปรียง",
      drugKeywords: ["ibuprofen", "diclofenac", "naproxen", "celecoxib"],
      severity: "YELLOW",
      title: "กลไกออกฤทธิ์ซ้ำซ้อน (Duplicate Mechanism)",
      mechanism: "กลไกยับยั้งการอักเสบซ้ำซ้อนกับยา NSAIDs",
      clinicalRisk: "ไม่มีพิษเสริมรุนแรง แต่ไม่จำเป็นต้องรับประทานคู่กัน",
      recommendation: "แนะนำให้ปรับลดยา NSAIDs ลง แล้วใช้เถาวัลย์เปรียงเดี่ยวเพื่อถนอมการทำงานของไต",
      action: "TAPER_NSAID"
    },
    {
      id: "HDI-005",
      herb: "ขมิ้นชัน",
      drugKeywords: ["omeprazole", "esomeprazole", "antacids", "simethicone"],
      severity: "GREEN",
      title: "ปลอดภัยและส่งเสริมการรักษา (Safe & Synergistic)",
      mechanism: "สารเคอร์คูมินอยด์ช่วยสมานแผลในกระเพาะอาหาร กระตุ้นการหลั่ง Mucin และขับลม ส่งเสริมการรักษาโรคกรดไหลย้อนร่วมกับยายับยั้งการหลั่งกรด",
      clinicalRisk: "ไม่มีปฏิกิริยาไม่พึงประสงค์",
      recommendation: "【รับประทานร่วมกันได้】 ทานขมิ้นชัน 500 มก. 4 ครั้งหลังอาหารและก่อนนอน",
      action: "SAFE"
    },
    {
      id: "HDI-006",
      herb: "ขมิ้นชัน",
      drugKeywords: ["warfarin"],
      severity: "YELLOW",
      title: "เฝ้าระวังค่าการแข็งตัวของเลือด (Monitor INR)",
      mechanism: "Curcumin ในขนาดสูงอาจมีฤทธิ์ต้านการเกาะกลุ่มของเกล็ดเลือดเล็กน้อย",
      clinicalRisk: "อาจทำให้ค่า INR ผันผวนได้ในบางราย",
      recommendation: "หากทานเป็นสารสกัดเข้มข้นต่อเนื่อง ให้ตรวจติดตามค่า INR ภายใน 2 สัปดาห์",
      action: "MONITOR"
    },
    {
      id: "HDI-007",
      herb: "ชะพลู",
      drugKeywords: ["metformin", "glipizide", "glimepiride", "insulin"],
      severity: "YELLOW",
      title: "เฝ้าระวังภาวะน้ำตาลในเลือดต่ำ (Additive Hypoglycemia)",
      mechanism: "ชะพลูมีฤทธิ์กระตุ้นการหลั่งอินซูลินและเพิ่ม Glucose uptake สู่เซลล์ เสริมฤทธิ์ยาลดน้ำตาลแผนปัจจุบัน",
      clinicalRisk: "อาจเกิดภาวะน้ำตาลตก (Hypoglycemia) โดยเฉพาะถ้าทานร่วมกับ Sulfonylurea หรือ Insulin",
      recommendation: "ตรวจวัด DTX สม่ำเสมอ หากค่าน้ำตาลลดลงคงที่ สามารถพิจารณาปรับลดยาแผนปัจจุบันได้",
      action: "MONITOR"
    },
    {
      id: "HDI-008",
      herb: "รางจืด",
      drugKeywords: ["metformin", "amlodipine", "enalapril", "losartan", "warfarin", "aspirin", "atorvastatin", "simvastatin"],
      severity: "RED",
      title: "รบกวนการดูดซึมยาอย่างรุนแรง (Drug Clearance Interaction)",
      mechanism: "รางจืดกระตุ้นเอนไซม์ล้างพิษในตับ (CYP450) และจับสารเคมีในทางเดินอาหาร ทำให้เร่งขับยาแผนปัจจุบันออกจากร่างกายอย่างรวดเร็ว",
      clinicalRisk: "ระดับยาแผนปัจจุบันในกระแสเลือดตกวูบ ส่งผลให้ควบคุมโรคประจำตัวไม่ได้",
      recommendation: "【ห้ามรับประทานพร้อมยาประจำตัว】 หากจำเป็นต้องดื่มแก้พิษ ให้เว้นห่างจากยาแผนปัจจุบันอย่างน้อย 2-4 ชั่วโมง",
      action: "SEPARATE_TIME"
    },
    {
      id: "HDI-009",
      herb: "ยาต้มหม้อ / ยาสมุนไพรไม่ทราบสูตร",
      drugKeywords: ["enalapril", "losartan", "metformin", "amlodipine"],
      severity: "RED",
      title: "อันตรายขั้นวิกฤตต่อผู้ป่วยโรคไต (Severe Renal Hazard)",
      mechanism: "ยาต้มและยาหม้อไม่ทราบสูตรมักมีปริมาณโพแทสเซียม (Potassium) สูง และเสี่ยงต่อการปนเปื้อนสเตียรอยด์สังเคราะห์หรือสารหนู/ตะกั่ว",
      clinicalRisk: "เสี่ยงภาวะ Hyperkalemia รุนแรง หัวใจเต้นผิดจังหวะ และภาวะไตวายเฉียบพลันซ้ำซ้อน (Acute-on-chronic kidney injury)",
      recommendation: "【สั่งหยุดรับประทานทันที】 นัดตรวจ Serum Creatinine, eGFR และ Electrolytes ด่วน",
      action: "CRITICAL_STOP"
    }
  ],

  elements: {
    wind: {
      name: "ธาตุลม (วาโยธาตุ)",
      months: [4, 5, 6],
      monthsText: "เมษายน, พฤษภาคม, มิถุนายน (เดือน 5, 6, 7 จันทรคติ)",
      color: "#10B981",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
      description: "เกี่ยวข้องกับการเคลื่อนไหว การเต้นของหัวใจ (หทัยวาตะ) เส้นประสาท และการไหลเวียนเลือด",
      tasteAdvice: "ควรรับประทานอาหารรสมัน, สุขุม, เผ็ดร้อน เพื่อขับลมและกระจายเลือดลม",
      foodExamples: "ขิง, ข่า, ตะไคร้, กะเพรา, โหระพา, น้ำกระชาย, พริกไทย, งาดำ",
      exerciseAdvice: "ท่าฤๅษีดัดตน แก้ปวดเอวและแก้ขัดแขนขา เดินช้าๆ ทำสมาธิคลายเครียด"
    },
    water: {
      name: "ธาตุน้ำ (อาโปธาตุ)",
      months: [7, 8, 9],
      monthsText: "กรกฎาคม, สิงหาคม, กันยายน (เดือน 8, 9, 10 จันทรคติ)",
      color: "#0284C7",
      badgeClass: "bg-sky-100 text-sky-800 border-sky-300",
      description: "เกี่ยวข้องกับของเหลวในร่างกาย โลหิต น้ำดี น้ำไขข้อ และระบบน้ำเหลือง",
      tasteAdvice: "ควรรับประทานอาหารรสเปรี้ยว รสขม เพื่อกัดเสมหะและบำรุงโลหิต",
      foodExamples: "มะนาว, มะขาม, ส้ม, ต้มยำ, แกงส้ม, มะระ, ขี้เหล็ก, ยอดสะเดา",
      exerciseAdvice: "ท่าฤๅษีดัดตนบริหารทรวงอก แก้อาการแน่นหน้าอกและกระตุ้นการไหลเวียนน้ำเหลือง"
    },
    earth: {
      name: "ธาตุดิน (ปถวีธาตุ)",
      months: [10, 11, 12],
      monthsText: "ตุลาคม, พฤศจิกายน, ธันวาคม (เดือน 11, 12, 1 จันทรคติ)",
      color: "#D97706",
      badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
      description: "เกี่ยวข้องกับอวัยวะโครงสร้างแข็ง กระดูก กล้ามเนื้อ ตับ หัวใจ ไต และลำไส้",
      tasteAdvice: "ควรรับประทานอาหารรสฝาด รสหวาน รสมัน รสเค็ม เพื่อบำรุงโครงสร้างกล้ามเนื้อและกระดูก",
      foodExamples: "ผักกูด, ดอกแค, สะตอ, ถั่วต่างๆ, ฟักทอง, กล้วยน้ำว้า, ปลาช่อนย่าง",
      exerciseAdvice: "ท่าฤๅษีดัดตนเสริมความยืดหยุ่นของข้อต่อและกล้ามเนื้อหลัง"
    },
    fire: {
      name: "ธาตุไฟ (เตโชธาตุ)",
      months: [1, 2, 3],
      monthsText: "มกราคม, กุมภาพันธ์, มีนาคม (เดือน 2, 3, 4 จันทรคติ)",
      color: "#EF4444",
      badgeClass: "bg-rose-100 text-rose-800 border-rose-300",
      description: "เกี่ยวข้องกับความอบอุ่นในร่างกาย อุณหภูมิ และระบบย่อยอาหาร (ปริณามัคคี)",
      tasteAdvice: "ควรรับประทานอาหารรสขม รสเย็น รสจืด เพื่อดับความร้อนและลดการอักเสบ",
      foodExamples: "ฟักเขียว, แตงกวา, บวบ, ใบบัวบก, มะระขี้นก, เก๊กฮวย, ต้มจืด",
      exerciseAdvice: "ท่าฤๅษีดัดตนผ่อนคลายกล้ามเนื้อ การฝึกกำหนดลมหายใจเพื่อลดความร้อนในร่างกาย"
    }
  },

  calculateBirthElement: function(birthDateStr) {
    if (!birthDateStr) return this.elements.wind;
    const date = new Date(birthDateStr);
    const month = date.getMonth() + 1; // 1 - 12
    if ([4, 5, 6].includes(month)) return this.elements.wind;
    if ([7, 8, 9].includes(month)) return this.elements.water;
    if ([10, 11, 12].includes(month)) return this.elements.earth;
    return this.elements.fire;
  }
};
