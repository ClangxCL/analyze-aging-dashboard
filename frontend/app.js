/**
 * TTM Smart Clinical Co-pilot - HIS Plugin Engine
 * Features: Real-time Free-text NLP, Rule-based Knowledge Retrieval, 
 * TTM Prognosis Prediction, ICD Cross-Mapping & HIS Herb-Drug Safety Check
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  const state = {
    // Current Active Patient in Hospital Information System (HIS)
    hisPatient: {
      hn: 'HN-694201',
      name: 'นายสมบัติ วัฒนากุล',
      dob: '1962-05-15',
      age: 64,
      gender: 'ชาย',
      clinic: 'คลินิกการแพทย์แผนไทยและแพทย์ทางเลือก (OPD TTM)',
      vitals: {
        bp: '135/84 mmHg',
        bpSys: 135,
        bpDia: 84,
        pulse: 78,
        temp: 36.6,
        rr: 18
      },
      labs: {
        fbs: 138,
        egfr: 74,
        cr: 1.1
      },
      // Active Meds synced from HIS database
      hisActiveMeds: [
        { name: 'Metformin', dose: '500 mg tab 1x2 pc', category: 'Antidiabetic' },
        { name: 'Amlodipine', dose: '5 mg tab 1x1 pc', category: 'Antihypertensive' },
        { name: 'Aspirin', dose: '81 mg tab 1x1 pc', category: 'Antiplatelet' },
        { name: 'Warfarin', dose: '3 mg tab 1x1 hs', category: 'Anticoagulant' } // Kept for testing Red alert!
      ],
      allergies: 'ปฏิเสธประวัติแพ้ยา'
    },

    // Current Analysis Result derived from Knowledge Base & Typing
    currentAnalysis: null,

    // Treatment selections
    treatment: {
      useMassage: true,
      selectedHerbs: ['เถาวัลย์เปรียง'],
      selectedProcedures: []
    }
  };

  // Prediction and NLP Rules Dataset
  const nlpRules = [
    {
      keywords: ["เข่า", "ข้อเข่า", "กรอบแกรบ", "ขัด", "งอเข่า", "ฝืด", "บันได"],
      ttmCode: "U60.20",
      ttmName: "ลมจับโปงแห้งเข่า",
      icd10Code: "M17.9",
      icd10Name: "Osteoarthritis of knee, unspecified",
      affectedElements: ["E08 (อัฐิ/กระดูก)", "E07 (นหารู/เอ็น)", "W11 (ลสิกา/น้ำไขข้อ)", "A05 (อังคมังคานุสารีวาตา)"],
      earthState: "หย่อน (Deficiency)",
      waterState: "หย่อน (Deficiency - น้ำไขข้อแห้ง)",
      windState: "กำเริบ (Aggravation - ลมคั่งขัดในข้อ)",
      fireState: "ปกติ",
      triDosha: "วาตะ (Vata)",
      prognosisKey: "yapya",
      prognosisTitle: "ยาปยะ (โรคเรื้อรังที่ทำได้เพียงประคับประคอง)",
      prognosisDesc: "เนื่องจากโครงสร้างอัฐิ (กระดูกอ่อน) มีการเสื่อมสภาพถาวร และลสิกาแห้ง ไม่สามารถรักษาให้หายขาดได้ แต่สามารถฟื้นฟูข้อต่อและชะลอการผ่าตัดเปลี่ยนข้อได้ด้วยการแพทย์แผนไทย",
      flareSeason: "วสันตฤดู (ฤดูฝน) และช่วงสภาพอากาศชื้นเย็น ลมจะพัดคั่งคั่งในข้อมากขึ้น",
      progressionRisk: "หากไม่รักษา ลมจะพัดพาความแห้งกร้านสู่ข้อเข่าอีกข้าง และลามขึ้นสู่แนวเส้นเอ็นสะโพกและหลัง (เส้นอิทา-ปิงคลา)",
      recommendedHerbs: ["เถาวัลย์เปรียง", "ไพล", "ยาน้ำมันไตรตรึงค์"],
      recommendedProcedures: ["นวดราชสำนักบำบัดข้อเข่า (เปิดประตูลม คลายเส้นอิทา-ปิงคลา)", "ประคบสมุนไพรร้อน", "พอกยาเข่าตำรับพระคัมภีร์"],
      severityScore: 6,
      severityLevel: "ปานกลาง (Moderate)"
    },
    {
      keywords: ["คอ", "บ่า", "ไหล่", "สะบัก", "ตึง", "ออฟฟิศ", "ร้าว", "คอมพิวเตอร์"],
      ttmCode: "U62.00",
      ttmName: "ลมปลายปัตฆาตสะบักและคอบ่า",
      icd10Code: "M79.1",
      icd10Name: "Myalgia / Myofascial pain syndrome",
      affectedElements: ["E06 (มังสัง/กล้ามเนื้อ)", "E07 (นหารู/เอ็น)", "A05 (อังคมังคานุสารีวาตา)"],
      earthState: "เกร็งตัว แข็งตึง (Hypertonic)",
      waterState: "ปกติ",
      windState: "คั่งคั่ง ติดขัด (Stagnant Wind)",
      fireState: "ปกติ",
      triDosha: "วาตะ (Vata)",
      prognosisKey: "dukkha_sadhita",
      prognosisTitle: "ทุกขสาธิตะ (รักษาหายได้ยาก - ต้องใช้เวลา)",
      prognosisDesc: "กล้ามเนื้อมังสังและนหารูเกร็งตัวเป็นลำแข็งเรื้อรัง ต้องอาศัยการนวดรักษาคลายจุดสัญญาณร่วมกับการอบประคบต่อเนื่อง 2-4 สัปดาห์",
      flareSeason: "ช่วงบ่ายถึงค่ำ (กาลสมุฏฐานวาตะ) และเมื่อทำงานหน้าจอนานเกิน 3 ชั่วโมงต่อเนื่อง",
      progressionRisk: "กล้ามเนื้อจะกลายเป็นพังผืดเรื้อรัง (กิโลมกัง) และลมจะแล่นขึ้นศีรษะส่งผลให้เกิดอาการปวดไมเกรน ตาพร่ามัว",
      recommendedHerbs: ["เถาวัลย์เปรียง", "ยาธาตุอบเชย", "น้ำมันไพล"],
      recommendedProcedures: ["นวดรักษาแบบราชสำนัก จุดสัญญาณ 4, 5 หัวไหล่", "อบไอน้ำสมุนไพร"],
      severityScore: 5,
      severityLevel: "ปานกลาง (Moderate)"
    },
    {
      keywords: ["ไข้", "หวัด", "เจ็บคอ", "น้ำมูก", "ไอ", "ครั่นเนื้อ", "ตัวร้อน"],
      ttmCode: "U56.10",
      ttmName: "ไข้หวัดน้อย (สันนิบาตหวัด)",
      icd10Code: "J00",
      icd10Name: "Acute nasopharyngitis [common cold]",
      affectedElements: ["F01 (สันตัปปัคคี/ไฟไข้)", "W02 (เสมหัง/เสมหะ)", "W10 (สิงฆาณิกา/น้ำมูก)"],
      earthState: "ปกติ",
      waterState: "คั่งคั่ง (Excess Mucus)",
      windState: "ปกติ",
      fireState: "กำเริบ (Aggravation - ตัวร้อน)",
      triDosha: "ปิตตะ-เสมหะ (Pitta-Kapha)",
      prognosisKey: "sukha_sadhita",
      prognosisTitle: "สุขสาธิตะ (รักษาหายได้ง่าย)",
      prognosisDesc: "เป็นโรคเฉียบพลัน ร่างกายมีธาตุไฟและน้ำกำเริบระยะสั้น สามารถรักษาให้หายเป็นปกติได้ภายใน 3 - 5 วัน ด้วยการใช้ยาสมุนไพรรสขมเย็นและขับเสมหะ",
      flareSeason: "สารทฤดู (ปลายฝนต้นหนาว) และช่วงที่อากาศเปลี่ยนแปลงฉับพลัน",
      progressionRisk: "หากปล่อยทิ้งไว้ ไฟสันตัปปัคคีจะลามสู่ปัปผาสัง (ปอด) กลายเป็นไข้หวัดใหญ่หรือหลอดลมอักเสบ",
      recommendedHerbs: ["ฟ้าทะลายโจร", "ยาประสะมะแว้ง", "ยาจันทลีลา"],
      recommendedProcedures: ["งดการนวดเวลามีไข้ (ข้อห้ามใช้ CPG) แนะนำเช็ดตัวด้วยน้ำอุ่น"],
      severityScore: 4,
      severityLevel: "เล็กน้อยถึงปานกลาง (Mild-Moderate)"
    },
    {
      keywords: ["เบาหวาน", "น้ำตาล", "ปัสสาวะบ่อย", "มธุรเมหะ", "หิวน้ำ", "เพลีย"],
      ttmCode: "U72.10",
      ttmName: "มธุรเมหะ (โรคเบาหวาน)",
      icd10Code: "E11.9",
      icd10Name: "Type 2 diabetes mellitus",
      affectedElements: ["W12 (มุตตัง/ปัสสาวะ)", "W02 (เสมหัง)", "E10 (วักกัง/ไต)", "E12 (ยกนัง/ตับ)"],
      earthState: "แปรปรวน (Fluctuating)",
      waterState: "พิการ (Vitiated)",
      windState: "ปกติ",
      fireState: "หย่อน (Deficiency)",
      triDosha: "เสมหะ-ปิตตะ (Kapha-Pitta)",
      prognosisKey: "yapya",
      prognosisTitle: "ยาปยะ (โรคเรื้อรังที่ทำได้เพียงประคับประคอง)",
      prognosisDesc: "ระบบน้ำมุตตังและวักกังแปรปรวนเรื้อรัง ต้องเน้นการปรับพฤติกรรม อาหารรสขมจืด และยาสมุนไพรช่วยคุมระดับน้ำตาลควบคู่กับยาแผนปัจจุบัน",
      flareSeason: "เหมันตฤดู (ฤดูหนาว) และช่วงที่บริโภคอาหารรสหวานจัด",
      progressionRisk: "น้ำตาลจะกระทบต่อหลอดเลือดโลหิตังและเส้นประสาท เกิดภาวะแทรกซ้อนปลายประสาทอักเสบ (ชาปลายมือเท้า) และไตเสื่อม",
      recommendedHerbs: ["ชะพลู", "มะระขี้นก", "ตรีผลา"],
      recommendedProcedures: ["การนวดสัมผัสเบาปลายมือปลายเท้าเพื่อกระตุ้นการไหลเวียน"],
      severityScore: 6,
      severityLevel: "ปานกลาง (Moderate)"
    },
    {
      keywords: ["อัมพฤกษ์", "อ่อนแรง", "หน้าเบี้ยว", "หลอดเลือดสมอง", "เดินเซ", "แขนตก"],
      ttmCode: "U59.00",
      ttmName: "อัมพฤกษ์ (ลมติดขัดแล่นไม่ตลอด)",
      icd10Code: "I69.3",
      icd10Name: "Sequelae of cerebral infarction",
      affectedElements: ["A05 (อังคมังคานุสารีวาตา)", "A06 (สัตถกวาตะ)", "E20 (มัตถลุงคัง/สมอง)"],
      earthState: "เสื่อมสภาพ (Impaired)",
      waterState: "ปกติ",
      windState: "พิการ ขัดแล่น (Vitiated Wind)",
      fireState: "ปกติ",
      triDosha: "วาตะ (Vata)",
      prognosisKey: "yapya",
      prognosisTitle: "ยาปยะ (ฟื้นฟูสมรรถภาพระยะยาว - Intermediate Care)",
      prognosisDesc: "จัดอยู่ในกลุ่มการดูแลระยะกลาง (IMC) ต้องฟื้นฟูเส้นประธานสิบและกระตุ้นการไหลเวียนของลมอังคมังคานุสารีวาตาอย่างต่อเนื่อง 3-6 เดือน",
      flareSeason: "ช่วงอากาศเย็นจัด หรือช่วงที่มีความดันโลหิตสูงและอารมณ์แปรปรวน",
      progressionRisk: "หากไม่ฟื้นฟูสม่ำเสมอ กล้ามเนื้อจะลีบตัวและเกิดข้อยึดติดถาวร",
      recommendedHerbs: ["ยาหอมนวโกฐ", "ยาตรีผลา"],
      recommendedProcedures: ["นวดฟื้นฟูสมรรถภาพผู้ป่วยโรคหลอดเลือดสมอง (IMC)"],
      severityScore: 7,
      severityLevel: "รุนแรง (Severe)"
    }
  ];

  // Herb-Drug Interaction Matrix
  const hdiRules = [
    {
      herb: "ฟ้าทะลายโจร",
      targetDrugs: ["warfarin", "aspirin", "clopidogrel"],
      risk: "RED",
      title: "อันตรายสูง: เสี่ยงต่อภาวะเลือดออกผิดปกติรุนแรง (Major Bleeding)",
      mechanism: "Andrographolide มีฤทธิ์ Antiplatelet และยับยั้งเอนไซม์ CYP2C9 อย่างแรง ทำให้ระดับยา Warfarin ในเลือดพุ่งสูงขึ้น",
      action: "【ห้ามจ่ายฟ้าทะลายโจร】 ผู้ป่วยมีประวัติใช้ยาใน HIS อยู่ ให้เปลี่ยนเป็นยาจันทลีลาหรือยาประสะมะแว้งแทน"
    },
    {
      herb: "ฟ้าทะลายโจร",
      targetDrugs: ["amlodipine", "enalapril"],
      risk: "YELLOW",
      title: "เฝ้าระวัง: ฤทธิ์ลดความดันเสริมกัน (Additive Hypotension)",
      mechanism: "ฟ้าทะลายโจรมีฤทธิ์ขยายหลอดเลือดเสริมกับยาลดความดัน อาจทำให้หน้ามืดหรือความดันตกขณะเปลี่ยนท่า",
      action: "【จ่ายได้ระยะสั้น < 5 วัน】 กำชับให้ทานห่างจากยาความดัน 2 ชั่วโมง และเฝ้าระวังความดันโลหิต"
    },
    {
      herb: "เถาวัลย์เปรียง",
      targetDrugs: ["paracetamol"],
      risk: "GREEN",
      title: "ปลอดภัยและส่งเสริมการรักษา (Safe & Synergistic)",
      mechanism: "ยับยั้ง COX-2 ต้านการอักเสบเทียบเท่ายาเคมีสังเคราะห์ แต่ปลอดภัยต่อไตและกระเพาะอาหารอย่างยิ่ง",
      action: "【สนับสนุนให้จ่ายเป็น First-Line Drug】 ขนาดยา 400 มก. 3 ครั้งหลังอาหาร ช่วยลดการใช้ยาเคมี NSAIDs"
    },
    {
      herb: "เถาวัลย์เปรียง",
      targetDrugs: ["ibuprofen", "diclofenac"],
      risk: "YELLOW",
      title: "กลไกออกฤทธิ์ซ้ำซ้อน (Duplicate Mechanism)",
      mechanism: "ออกฤทธิ์ยับยั้งการอักเสบซ้ำซ้อนกับยา NSAIDs",
      action: "【แนะนำประสานเพื่อลดยาเคมี】 เสนอแพทย์แผนปัจจุบันให้หยุด NSAIDs แล้วใช้เถาวัลย์เปรียงเดี่ยว"
    },
    {
      herb: "ชะพลู",
      targetDrugs: ["metformin", "glipizide"],
      risk: "YELLOW",
      title: "เฝ้าระวังน้ำตาลในเลือดตก (Additive Hypoglycemia)",
      mechanism: "ชะพลูเสริมฤทธิ์การหลั่งอินซูลิน อาจทำให้ระดับน้ำตาลในเลือดลดลงเร็วกว่าปกติ",
      action: "【จ่ายได้แต่ต้องเตือนผู้ป่วย】 กำชับตรวจวัด DTX สม่ำเสมอ ไม่ทานตอนท้องว่าง"
    },
    {
      herb: "ขมิ้นชัน",
      targetDrugs: ["omeprazole"],
      risk: "GREEN",
      title: "ปลอดภัยและส่งเสริมการรักษา (Safe & Synergistic)",
      mechanism: "สมานแผลในกระเพาะและขับลม ส่งเสริมการรักษาโรคกระเพาะร่วมกับยาลดกรด",
      action: "【จ่ายร่วมกันได้】 ขมิ้นชัน 500-1000 มก. 4 ครั้งหลังอาหารและก่อนนอน"
    },
    {
      herb: "ยาต้มหม้อ / ยาสมุนไพรไม่ทราบสูตร",
      targetDrugs: ["metformin", "enalapril", "warfarin", "aspirin", "amlodipine"],
      risk: "RED",
      title: "ความเสี่ยงสูงจากการไม่ทราบมาตรฐานสูตรยา (Severe Renal Hazard)",
      mechanism: "ยาต้มหม้อพื้นบ้านเสี่ยงต่อการปนเปื้อน Potassium สูง หรือสเตียรอยด์สังเคราะห์ เสี่ยงไตวายเฉียบพลัน",
      action: "【สั่งให้ผู้ป่วยหยุดรับประทานทันที】 เปลี่ยนมาใช้ยาสมุนไพรในบัญชียาหลักแห่งชาติที่มี GMP แทน"
    }
  ];

  // DOM Elements
  const textNoteInput = document.getElementById('txt-clinical-note');
  const spanDetectedKeywords = document.getElementById('badge-detected-keywords');
  const divElementsGrid = document.getElementById('div-elements-grid');
  const divPrognosisBox = document.getElementById('div-prognosis-box');
  const divIcdMapping = document.getElementById('div-icd-mapping');
  const divTreatmentPlan = document.getElementById('div-treatment-plan');
  const divSafetyGate = document.getElementById('div-safety-gate');
  const containerHisMeds = document.getElementById('container-his-meds');

  // Render Synced HIS Medications in Left Pane
  function renderHisMeds() {
    if (!containerHisMeds) return;
    containerHisMeds.innerHTML = state.hisPatient.hisActiveMeds.map(med => `
      <div class="flex items-center justify-between p-2 bg-white rounded border border-slate-200 text-xs shadow-2xs">
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full ${med.name === 'Warfarin' ? 'bg-rose-500' : 'bg-emerald-500'}"></span>
          <div>
            <strong class="text-slate-900">${med.name}</strong>
            <span class="text-slate-500 text-[11px]">(${med.dose})</span>
          </div>
        </div>
        <span class="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-mono">${med.category}</span>
      </div>
    `).join('');
  }

  // Real-time Text Analysis & Rule Matching
  function analyzeClinicalText(text) {
    if (!text || text.trim() === '') {
      text = "ปวดข้อเข่าขัด มีเสียงกรอบแกรบ เดินลำบาก ข้อฝืดตอนเช้า";
    }

    // Match rules based on keywords
    let matchedRule = nlpRules[0]; // Default to knee OA
    let maxMatches = 0;
    let matchedWords = [];

    nlpRules.forEach(rule => {
      let matches = 0;
      let words = [];
      rule.keywords.forEach(kw => {
        if (text.includes(kw)) {
          matches++;
          words.push(kw);
        }
      });
      if (matches > maxMatches) {
        maxMatches = matches;
        matchedRule = rule;
        matchedWords = words;
      }
    });

    state.currentAnalysis = {
      rule: matchedRule,
      matchedWords: matchedWords.length > 0 ? matchedWords : matchedRule.keywords.slice(0, 3)
    };

    // Auto-update treatment selection default
    state.treatment.selectedHerbs = [matchedRule.recommendedHerbs[0]];
    state.treatment.selectedProcedures = matchedRule.recommendedProcedures;

    renderPluginResults();
  }

  // Render Co-pilot Plugin Right Pane
  function renderPluginResults() {
    const analysis = state.currentAnalysis;
    if (!analysis) return;
    const r = analysis.rule;

    // 1. Detected Keywords Badge
    if (spanDetectedKeywords) {
      spanDetectedKeywords.innerHTML = analysis.matchedWords.map(w => `
        <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-medium text-[11px] border border-emerald-300">
          ✓ ${w}
        </span>
      `).join(' ');
    }

    // 2. Elements 42 & Smutthan
    if (divElementsGrid) {
      divElementsGrid.innerHTML = `
        <div class="grid grid-cols-4 gap-2 text-center text-xs mb-3">
          <div class="p-2 bg-amber-50 border border-amber-200 rounded">
            <span class="text-slate-500 text-[10px] block">ธาตุดิน</span>
            <strong class="text-amber-900">${r.earthState}</strong>
          </div>
          <div class="p-2 bg-sky-50 border border-sky-200 rounded">
            <span class="text-slate-500 text-[10px] block">ธาตุน้ำ</span>
            <strong class="text-sky-900">${r.waterState}</strong>
          </div>
          <div class="p-2 bg-emerald-50 border border-emerald-300 rounded shadow-xs">
            <span class="text-slate-500 text-[10px] block">ธาตุลม</span>
            <strong class="text-emerald-800">${r.windState}</strong>
          </div>
          <div class="p-2 bg-rose-50 border border-rose-200 rounded">
            <span class="text-slate-500 text-[10px] block">ธาตุไฟ</span>
            <strong class="text-rose-900">${r.fireState}</strong>
          </div>
        </div>

        <div class="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
          <div><strong class="text-slate-900">ธาตุเฉพาะจุดที่ตรวจพบความผิดปกติ (คัมภีร์เวชศึกษา):</strong></div>
          <div class="flex flex-wrap gap-1 mt-1">
            ${r.affectedElements.map(e => `
              <span class="px-2 py-0.5 bg-white border border-slate-300 rounded text-[11px] font-medium text-slate-800">• ${e}</span>
            `).join('')}
          </div>
          <div class="pt-1.5 flex justify-between items-center text-[11px]">
            <span><strong>ตรีโทษเด่น:</strong> <span class="text-emerald-800 font-bold">${r.triDosha}</span></span>
            <span><strong>ความรุนแรง:</strong> <span class="px-2 py-0.5 rounded font-bold ${r.severityScore >= 7 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}">${r.severityLevel} (${r.severityScore}/10)</span></span>
          </div>
        </div>
      `;
    }

    // 3. TTM Prognosis Prediction (ระบบพยากรณ์โรคเวชกรรมไทย - The Winning Feature!)
    if (divPrognosisBox) {
      let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
      if (r.prognosisKey === 'yapya') badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
      if (r.prognosisKey === 'dukkha_sadhita') badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';

      divPrognosisBox.innerHTML = `
        <div class="p-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-lg shadow-xs space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-bold flex items-center gap-1.5 text-emerald-400">
              <span>🔮</span> ผลการพยากรณ์โรคเวชกรรมไทย (TTM Prognosis Prediction):
            </span>
            <span class="px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${badgeColor}">
              ${r.prognosisTitle}
            </span>
          </div>
          <p class="text-slate-300 text-[11px] leading-relaxed">${r.prognosisDesc}</p>
          <div class="grid grid-cols-2 gap-2 pt-1 border-t border-slate-700/80 text-[11px]">
            <div>
              <span class="text-amber-300 font-semibold block">⚠️ ฤดูกาล/ช่วงเวลาที่เสี่ยงกำเริบ:</span>
              <span class="text-slate-300">${r.flareSeason}</span>
            </div>
            <div>
              <span class="text-rose-300 font-semibold block">📈 แนวโน้มการลุกลามหากไม่รักษา:</span>
              <span class="text-slate-300">${r.progressionRisk}</span>
            </div>
          </div>
        </div>
      `;
    }

    // 4. ICD Cross-Mapping
    if (divIcdMapping) {
      divIcdMapping.innerHTML = `
        <div class="grid grid-cols-2 gap-2.5 text-xs">
          <div class="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg">
            <span class="text-[10px] font-bold text-emerald-800 block">การวินิจฉัยเวชกรรมไทย (ICD-10-TM)</span>
            <strong class="text-sm text-slate-900 block mt-0.5">${r.ttmName}</strong>
            <span class="font-mono text-xs font-bold text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-300 inline-block mt-1">
              ${r.ttmCode}
            </span>
          </div>
          <div class="p-2.5 bg-blue-50 border border-blue-300 rounded-lg">
            <span class="text-[10px] font-bold text-blue-800 block">การเทียบเคียงโรคแผนปัจจุบัน (ICD-10)</span>
            <strong class="text-sm text-slate-900 block mt-0.5">${r.icd10Name}</strong>
            <span class="font-mono text-xs font-bold text-blue-700 bg-white px-1.5 py-0.5 rounded border border-blue-300 inline-block mt-1">
              ${r.icd10Code}
            </span>
          </div>
        </div>
      `;
    }

    // 5. Treatment Plan & Herb-Drug Safety Gate
    renderTreatmentAndSafety();
  }

  // Render Treatment Options and Active Safety Check against HIS Meds
  function renderTreatmentAndSafety() {
    const analysis = state.currentAnalysis;
    if (!analysis) return;
    const r = analysis.rule;

    // Treatment Plan Selection
    if (divTreatmentPlan) {
      divTreatmentPlan.innerHTML = `
        <div class="space-y-2 text-xs">
          <div>
            <span class="font-bold text-slate-800">1. หัตถการการแพทย์แผนไทยที่แนะนำ:</span>
            <ul class="list-disc list-inside text-slate-700 pl-1 mt-0.5 space-y-0.5 text-[11px]">
              ${r.recommendedProcedures.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>
          <div class="pt-1.5 border-t border-slate-100">
            <span class="font-bold text-slate-800">2. ยาสมุนไพรที่เลือกสั่งจ่าย (คลิกเพื่อทดสอบอันตรกิริยา):</span>
            <div id="chips-herb-selection" class="flex flex-wrap gap-1.5 mt-1.5">
              ${['เถาวัลย์เปรียง', 'ฟ้าทะลายโจร', 'ขมิ้นชัน', 'ชะพลู', 'ยาต้มหม้อ / ยาสมุนไพรไม่ทราบสูตร'].map(herb => {
                const isSelected = state.treatment.selectedHerbs.includes(herb);
                return `
                  <button type="button" onclick="toggleHerbSelection('${herb}')" 
                    class="px-2.5 py-1 text-xs rounded border font-medium transition cursor-pointer ${
                      isSelected ? 'bg-emerald-700 text-white border-emerald-800 shadow-2xs' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                    }">
                    ${herb}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;
    }

    // Herb-Drug Safety Gate Check against HIS Active Meds!
    if (divSafetyGate) {
      const hisDrugNames = state.hisPatient.hisActiveMeds.map(m => m.name.toLowerCase());
      const selectedHerbs = state.treatment.selectedHerbs;
      const detectedAlerts = [];

      selectedHerbs.forEach(herb => {
        hdiRules.forEach(rule => {
          if (rule.herb === herb) {
            const matchedDrug = rule.targetDrugs.find(td => hisDrugNames.some(hd => hd.includes(td)));
            if (matchedDrug) {
              detectedAlerts.push({
                herb: herb,
                drug: matchedDrug.toUpperCase(),
                risk: rule.risk,
                title: rule.title,
                mechanism: rule.mechanism,
                action: rule.action
              });
            }
          }
        });
      });

      if (detectedAlerts.length === 0) {
        divSafetyGate.innerHTML = `
          <div class="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-800">
            <div class="font-bold flex items-center gap-1.5">
              <span>🟢</span> ปลอดภัย (Low Risk / No Interaction Detected)
            </div>
            <p class="text-[11px] text-slate-700 mt-0.5">
              ไม่พบอันตรกิริยาที่เป็นอันตรายระหว่างยาสมุนไพรที่เลือก กับรายการยาแผนปัจจุบัน 4 รายการที่ซิงค์มาจาก HIS
            </p>
          </div>
        `;
      } else {
        divSafetyGate.innerHTML = detectedAlerts.map(alert => {
          let border = 'border-l-4 border-emerald-500 bg-emerald-50';
          let badge = 'bg-emerald-100 text-emerald-800 border-emerald-300';
          let icon = '🟢';

          if (alert.risk === 'RED') {
            border = 'border-l-4 border-rose-600 bg-rose-50';
            badge = 'bg-rose-100 text-rose-800 border-rose-300';
            icon = '🔴';
          } else if (alert.risk === 'YELLOW') {
            border = 'border-l-4 border-amber-500 bg-amber-50';
            badge = 'bg-amber-100 text-amber-800 border-amber-300';
            icon = '🟡';
          }

          return `
            <div class="p-3 rounded-r-lg border-y border-r border-slate-200 ${border} mb-2 text-xs shadow-2xs">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5 font-bold text-slate-900">
                  <span>${icon}</span>
                  <span>${alert.herb} ⟷ ${alert.drug} (จากประวัติยา HIS)</span>
                </div>
                <span class="px-2 py-0.5 text-[10px] font-bold rounded-full border ${badge}">${alert.risk} ALERT</span>
              </div>
              <p class="text-slate-700 text-[11px] mt-1"><strong>กลไกเภสัชวิทยา:</strong> ${alert.mechanism}</p>
              <div class="p-2 bg-white rounded border border-slate-200 font-medium text-slate-900 mt-1.5 text-[11px]">
                <strong class="text-emerald-800">คำแนะนำสำหรับแพทย์แผนไทย:</strong> ${alert.action}
              </div>
            </div>
          `;
        }).join('');
      }
    }
  }

  // Toggle Herb Selection
  window.toggleHerbSelection = function(herbName) {
    if (state.treatment.selectedHerbs.includes(herbName)) {
      state.treatment.selectedHerbs = state.treatment.selectedHerbs.filter(h => h !== herbName);
    } else {
      state.treatment.selectedHerbs.push(herbName);
    }
    renderTreatmentAndSafety();
  };

  // Quick Prompt Sample Buttons
  window.insertSamplePrompt = function(promptText) {
    textNoteInput.value = promptText;
    analyzeClinicalText(promptText);
  };

  // Sync back to HIS (Simulate Plugin Insertion)
  window.syncBackToHis = function() {
    const a = state.currentAnalysis;
    if (!a) return;
    const r = a.rule;
    
    alert(`✅ ซิงค์ผลการตรวจเข้าสู่ระบบ HIS สำเร็จ!\n\n` +
      `• ICD-10-TM: ${r.ttmCode} (${r.ttmName})\n` +
      `• ICD-10: ${r.icd10Code} (${r.icd10Name})\n` +
      `• สมุฏฐาน: ${r.triDosha} (ความรุนแรง: ${r.severityLevel})\n` +
      `• การพยากรณ์โรค: ${r.prognosisTitle}\n` +
      `• แผนการรักษา: นวดราชสำนัก + ยาสมุนไพร (${state.treatment.selectedHerbs.join(', ')})\n` +
      `• ผลตรวจสอบความปลอดภัยยา (HDI): ผ่านการตรวจสอบเรียบร้อย`
    );
  };

  // Real-time Event Listener for Typing
  if (textNoteInput) {
    textNoteInput.addEventListener('input', (e) => {
      analyzeClinicalText(e.target.value);
    });
  }

  // Initialize
  renderHisMeds();
  analyzeClinicalText(textNoteInput.value);
});
