/**
 * ElderHealth Forum 2026 (The 6th Thailand National Elderly Health Forum 2026)
 * Frontend Application Logic & Universal Accessibility Engine
 */

const API_BASE = '/api';

// State Management
const appState = {
  currentFontSize: 'normal',
  isHighContrast: false,
  recognition: null,
  isListening: false,
  currentMicFieldId: null,
  speechSynth: window.speechSynthesis,
  adminToken: localStorage.getItem('forum2026_admin_token') || null,
  scheduleSlides: [],
  currentSlideIndex: 0,
  banners: []
};

// ----------------------------------------------------
// 1. Accessibility Management
// ----------------------------------------------------
function setFontSize(size) {
  document.documentElement.classList.remove('font-normal', 'font-large', 'font-xlarge');
  document.documentElement.classList.add(`font-${size}`);
  appState.currentFontSize = size;
  localStorage.setItem('forum_a11y_font', size);
  
  // Highlight active button
  document.querySelectorAll('.btn-font-size').forEach(btn => {
    btn.classList.toggle('bg-emerald-700', btn.dataset.size === size);
    btn.classList.toggle('text-white', btn.dataset.size === size);
  });
}

function toggleHighContrast() {
  appState.isHighContrast = !appState.isHighContrast;
  document.documentElement.classList.toggle('high-contrast', appState.isHighContrast);
  localStorage.setItem('forum_a11y_contrast', appState.isHighContrast ? '1' : '0');
  
  const contrastBtn = document.getElementById('btnToggleContrast');
  if (contrastBtn) {
    contrastBtn.classList.toggle('bg-yellow-400', appState.isHighContrast);
    contrastBtn.classList.toggle('text-black', appState.isHighContrast);
  }
}

// ----------------------------------------------------
// 2. Web Speech API (Speech-to-Text & Text-to-Speech)
// ----------------------------------------------------
function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn('Speech Recognition is not supported by this browser.');
    return;
  }
  
  appState.recognition = new SpeechRecognition();
  appState.recognition.lang = 'th-TH';
  appState.recognition.continuous = false;
  appState.recognition.interimResults = false;

  appState.recognition.onstart = function() {
    appState.isListening = true;
    showVoiceNotification(true, 'กำลังรับฟังเสียงพูดของคุณ... กรุณาพูดได้เลยค่ะ');
    if (appState.currentMicFieldId) {
      const micBtn = document.getElementById(`mic-btn-${appState.currentMicFieldId}`);
      if (micBtn) micBtn.classList.add('mic-active');
    }
  };

  appState.recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    if (appState.currentMicFieldId) {
      const targetInput = document.getElementById(appState.currentMicFieldId);
      if (targetInput) {
        // Append or replace
        targetInput.value = targetInput.value ? `${targetInput.value} ${transcript}` : transcript;
        targetInput.dispatchEvent(new Event('input'));
        targetInput.focus();
      }
    }
  };

  appState.recognition.onerror = function(event) {
    console.error('Speech recognition error:', event.error);
    showVoiceNotification(false, 'เกิดข้อผิดพลาดในการรับเสียง หรือไมโครโฟนยังไม่ได้รับอนุญาต');
    stopListening();
  };

  appState.recognition.onend = function() {
    stopListening();
  };
}

function toggleVoiceInput(fieldId) {
  if (!appState.recognition) {
    alert('เบราว์เซอร์ของคุณยังไม่รองรับระบบสั่งงานด้วยเสียง กรุณาใช้ Chrome หรือ Safari เวอร์ชั่นล่าสุด');
    return;
  }

  if (appState.isListening && appState.currentMicFieldId === fieldId) {
    appState.recognition.stop();
    stopListening();
  } else {
    appState.currentMicFieldId = fieldId;
    try {
      appState.recognition.start();
    } catch (e) {
      appState.recognition.stop();
      setTimeout(() => appState.recognition.start(), 200);
    }
  }
}

function stopListening() {
  appState.isListening = false;
  showVoiceNotification(false, '');
  if (appState.currentMicFieldId) {
    const micBtn = document.getElementById(`mic-btn-${appState.currentMicFieldId}`);
    if (micBtn) micBtn.classList.remove('mic-active');
  }
  appState.currentMicFieldId = null;
}

function showVoiceNotification(show, message) {
  const notif = document.getElementById('voiceNoticeBanner');
  if (!notif) return;
  if (show) {
    notif.classList.remove('hidden');
    notif.querySelector('.voice-text').textContent = message;
  } else {
    notif.classList.add('hidden');
  }
}

function readNoteText(textToSpeak) {
  if (!window.speechSynthesis) {
    alert('ระบบสังเคราะห์เสียงพูดไม่รองรับในเบราว์เซอร์นี้');
    return;
  }
  
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    return;
  }
  
  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = 'th-TH';
  utterance.rate = 0.95; // Slightly slower, clear for elderly
  utterance.pitch = 1.0;
  
  window.speechSynthesis.speak(utterance);
}

// ----------------------------------------------------
// 3. Cascading Dropdown Handlers
// ----------------------------------------------------
function setupCascadingDropdowns() {
  // Public Form: Province -> Amphoe -> Tambon
  const pubProvSelect = document.getElementById('pub_province');
  const pubAmphoeSelect = document.getElementById('pub_amphoe');
  const pubTambonSelect = document.getElementById('pub_tambon');

  if (pubProvSelect) {
    // Populate all Thai provinces
    pubProvSelect.innerHTML = '<option value="">-- เลือกจังหวัด --</option>' + 
      window.THAI_PROVINCES.map(p => `<option value="${p}">${p}</option>`).join('');

    pubProvSelect.addEventListener('change', function() {
      const selectedProv = this.value;
      if (!selectedProv) {
        pubAmphoeSelect.innerHTML = '<option value="">-- เลือกอำเภอ --</option>';
        pubTambonSelect.innerHTML = '<option value="">-- เลือกตำบล --</option>';
        return;
      }
      const amphoes = window.getAmphoesForProvince(selectedProv);
      pubAmphoeSelect.innerHTML = '<option value="">-- เลือกอำเภอ --</option>' +
        amphoes.map(a => `<option value="${a}">${a}</option>`).join('');
      pubTambonSelect.innerHTML = '<option value="">-- เลือกตำบล --</option>';
    });

    pubAmphoeSelect.addEventListener('change', function() {
      const selectedProv = pubProvSelect.value;
      const selectedAmphoe = this.value;
      if (!selectedAmphoe) {
        pubTambonSelect.innerHTML = '<option value="">-- เลือกตำบล --</option>';
        return;
      }
      const tambons = window.getTambonsForAmphoe(selectedProv, selectedAmphoe);
      pubTambonSelect.innerHTML = '<option value="">-- เลือกตำบล --</option>' +
        tambons.map(t => `<option value="${t}">${t}</option>`).join('');
    });
  }

  // Medical Form: Health Region -> Province -> Amphoe -> Tambon
  const medRegionSelect = document.getElementById('med_health_region');
  const medProvSelect = document.getElementById('med_province');
  const medAmphoeSelect = document.getElementById('med_amphoe');
  const medTambonSelect = document.getElementById('med_tambon');

  if (medRegionSelect && medProvSelect) {
    medRegionSelect.innerHTML = '<option value="">-- เลือกเขตบริการสุขภาพ (1 - 12) --</option>' +
      Object.keys(window.THAI_HEALTH_REGIONS).map(r => `<option value="${r}">${r}</option>`).join('');

    medRegionSelect.addEventListener('change', function() {
      const region = this.value;
      if (!region || !window.THAI_HEALTH_REGIONS[region]) {
        medProvSelect.innerHTML = '<option value="">-- เลือกจังหวัด --</option>';
        return;
      }
      const provinces = window.THAI_HEALTH_REGIONS[region];
      medProvSelect.innerHTML = '<option value="">-- เลือกจังหวัดในเขตนี้ --</option>' +
        provinces.map(p => `<option value="${p}">${p}</option>`).join('');
      medAmphoeSelect.innerHTML = '<option value="">-- เลือกอำเภอ --</option>';
      medTambonSelect.innerHTML = '<option value="">-- เลือกตำบล --</option>';
    });

    medProvSelect.addEventListener('change', function() {
      const selectedProv = this.value;
      if (!selectedProv) {
        medAmphoeSelect.innerHTML = '<option value="">-- เลือกอำเภอ --</option>';
        return;
      }
      const amphoes = window.getAmphoesForProvince(selectedProv);
      medAmphoeSelect.innerHTML = '<option value="">-- เลือกอำเภอ --</option>' +
        amphoes.map(a => `<option value="${a}">${a}</option>`).join('');
      medTambonSelect.innerHTML = '<option value="">-- เลือกตำบล --</option>';
    });

    medAmphoeSelect.addEventListener('change', function() {
      const selectedProv = medProvSelect.value;
      const selectedAmphoe = this.value;
      if (!selectedAmphoe) {
        medTambonSelect.innerHTML = '<option value="">-- เลือกตำบล --</option>';
        return;
      }
      const tambons = window.getTambonsForAmphoe(selectedProv, selectedAmphoe);
      medTambonSelect.innerHTML = '<option value="">-- เลือกตำบล --</option>' +
        tambons.map(t => `<option value="${t}">${t}</option>`).join('');
    });
  }
}

// ----------------------------------------------------
// 4. Form Submission & Deduplication Handling
// ----------------------------------------------------
async function handlePublicSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'กำลังบันทึกข้อมูล...';

  const interests = Array.from(form.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value);

  const payload = {
    title: form.title.value,
    full_name: form.full_name.value.trim(),
    age: parseInt(form.age.value, 10),
    address: form.address.value.trim(),
    province: form.province.value,
    amphoe: form.amphoe.value,
    tambon: form.tambon.value,
    phone: form.phone.value.trim() || null,
    email: form.email.value.trim() || null,
    interests: interests
  };

  try {
    const res = await fetch(`${API_BASE}/register/public`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.detail || 'เกิดข้อผิดพลาดในการลงทะเบียน');

    showSuccessModal({
      title: result.is_updated ? 'อัปเดตข้อมูลสำเร็จ (ชื่อ-สกุลตรงกับในระบบ)' : 'ลงทะเบียนสำเร็จเรียบร้อยแล้ว',
      message: result.message,
      regCode: result.registration_code,
      name: `${payload.title} ${payload.full_name}`,
      note: 'ท่านสามารถใช้ชื่อ-นามสกุล หรือรหัสลงทะเบียนนี้เพื่อตรวจสอบสิทธิ์เข้าร่วมงานได้ทุกเมื่อ'
    });
    form.reset();
  } catch (err) {
    alert(`ข้อผิดพลาด: ${err.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'ยืนยันการลงทะเบียน';
  }
}

async function handleMedicalSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'กำลังบันทึกข้อมูล...';

  const interests = Array.from(form.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value);

  const payload = {
    title: form.title.value,
    full_name: form.full_name.value.trim(),
    position: form.position.value,
    position_other: form.position_other ? form.position_other.value.trim() : null,
    nursing_license_no: form.nursing_license_no.value.trim() || null,
    organization: form.organization.value.trim(),
    health_region: form.health_region.value,
    province: form.province.value,
    amphoe: form.amphoe.value,
    tambon: form.tambon.value,
    phone: form.phone.value.trim() || null,
    email: form.email.value.trim() || null,
    interests: interests
  };

  try {
    const res = await fetch(`${API_BASE}/register/medical`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.detail || 'เกิดข้อผิดพลาดในการลงทะเบียน');

    showSuccessModal({
      title: result.is_updated ? 'อัปเดตข้อมูลวิชาการสำเร็จ' : 'ลงทะเบียนบุคลากรทางการแพทย์สำเร็จ',
      message: result.message,
      regCode: result.registration_code,
      name: `${payload.title} ${payload.full_name}`,
      note: `หน่วยงาน: ${payload.organization} (${payload.health_region})`
    });
    form.reset();
  } catch (err) {
    alert(`ข้อผิดพลาด: ${err.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'ยืนยันการลงทะเบียนบุคลากร';
  }
}

async function handleAseanSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting registration...';

  const payload = {
    country: form.country.value,
    country_other: form.country_other ? form.country_other.value.trim() : null,
    title: form.title.value,
    title_other: form.title_other ? form.title_other.value.trim() : null,
    first_name: form.first_name.value.trim(),
    last_name: form.last_name.value.trim(),
    gender: form.gender.value,
    position: form.position.value.trim(),
    organization: form.organization.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim()
  };

  try {
    const res = await fetch(`${API_BASE}/register/asean`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.detail || 'Error occurred while registering.');

    showSuccessModal({
      title: 'Registration Successful',
      message: result.message,
      regCode: result.registration_code,
      name: `${payload.title} ${payload.first_name} ${payload.last_name}`,
      note: `Country: ${payload.country} | Organization: ${payload.organization}`
    });
    form.reset();
  } catch (err) {
    alert(`Error: ${err.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Registration';
  }
}

// ----------------------------------------------------
// 5. Registration Status Check
// ----------------------------------------------------
async function performStatusSearch() {
  const query = document.getElementById('searchQueryInput').value.trim();
  const resultsContainer = document.getElementById('searchResultsContainer');
  if (!query || query.length < 2) {
    resultsContainer.innerHTML = '<p class="text-stone-500 py-4 text-center">กรุณากรอกชื่อหรือนามสกุลอย่างน้อย 2 ตัวอักษรเพื่อค้นหา</p>';
    return;
  }

  resultsContainer.innerHTML = '<div class="py-8 text-center text-emerald-800 font-medium">กำลังค้นหาข้อมูล...</div>';

  try {
    const res = await fetch(`${API_BASE}/register/status/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="p-6 bg-[#eee5da] border border-[#d6c5b2] rounded-2xl text-center">
          <p class="text-[#a67b4f] font-bold">ไม่พบข้อมูลการลงทะเบียนที่ตรงกับ "${query}"</p>
          <p class="text-[#6e6459] text-sm mt-1">โปรดตรวจสอบการสะกดชื่อ-นามสกุล หรือทำการลงทะเบียนใหม่ในเมนูด้านบน</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = data.results.map(r => `
      <div class="p-5 bg-[#eee5da] border border-[#d6c5b2] rounded-2xl shadow-sm hover:border-[#a67b4f] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f7efe6] text-[#9a744d] border border-[#d6c5b2] rounded-full text-xs font-semibold">
            ${r.category}
          </span>
          <h3 class="text-lg font-bold text-[#171411] mt-2">${r.full_name}</h3>
          <p class="text-[#6e6459] text-sm mt-0.5">${r.detail}</p>
        </div>
        <div class="sm:text-right flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-[#d6c5b2]">
          <span class="text-xs text-[#7d7267] block font-mono">รหัสลงทะเบียน</span>
          <span class="text-base font-mono font-bold text-[#a67b4f]">${r.registration_code}</span>
          <span class="inline-flex items-center gap-1 text-xs text-emerald-700 mt-1 font-semibold">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            ${r.status}
          </span>
        </div>
      </div>
    `).join('');
  } catch (err) {
    resultsContainer.innerHTML = `<div class="p-4 text-red-600 text-center">เกิดข้อผิดพลาดในการค้นหา: ${err.message}</div>`;
  }
}

// ----------------------------------------------------
// 6. Schedule Slider & Touch Gestures
// ----------------------------------------------------
async function loadSchedules() {
  try {
    const res = await fetch(`${API_BASE}/content/schedules`);
    const data = await res.json();
    appState.scheduleSlides = data.schedules || [];
    renderScheduleSlide();
    setupTouchGestures();
  } catch (err) {
    console.error('Error loading schedules:', err);
  }
}

function renderScheduleSlide() {
  const container = document.getElementById('scheduleSlideContainer');
  const counter = document.getElementById('scheduleSlideCounter');
  const titleElem = document.getElementById('scheduleSlideTitle');
  if (!container || appState.scheduleSlides.length === 0) return;

  const current = appState.scheduleSlides[appState.currentSlideIndex];
  container.innerHTML = `
    <img src="${current.image_url}" alt="${current.title}" class="w-full h-full object-contain cursor-zoom-in" onclick="openFullscreenSchedule('${current.image_url}')">
  `;
  if (counter) counter.textContent = `หน้า ${appState.currentSlideIndex + 1} จาก ${appState.scheduleSlides.length}`;
  if (titleElem) titleElem.textContent = current.title;
}

function nextScheduleSlide() {
  if (appState.scheduleSlides.length === 0) return;
  appState.currentSlideIndex = (appState.currentSlideIndex + 1) % appState.scheduleSlides.length;
  renderScheduleSlide();
}

function prevScheduleSlide() {
  if (appState.scheduleSlides.length === 0) return;
  appState.currentSlideIndex = (appState.currentSlideIndex - 1 + appState.scheduleSlides.length) % appState.scheduleSlides.length;
  renderScheduleSlide();
}

function setupTouchGestures() {
  const sliderElem = document.getElementById('scheduleSlideContainer');
  if (!sliderElem) return;

  let touchStartX = 0;
  let touchEndX = 0;

  sliderElem.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  sliderElem.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
      nextScheduleSlide(); // Swipe left -> Next
    }
    if (touchEndX > touchStartX + threshold) {
      prevScheduleSlide(); // Swipe right -> Previous
    }
  }
}

function openFullscreenSchedule(imgUrl) {
  const modal = document.getElementById('scheduleLightboxModal');
  const modalImg = document.getElementById('scheduleLightboxImg');
  if (!modal || !modalImg) return;
  modalImg.src = imgUrl;
  modal.classList.remove('hidden');
}

function closeFullscreenSchedule() {
  const modal = document.getElementById('scheduleLightboxModal');
  if (modal) modal.classList.add('hidden');
}

// ----------------------------------------------------
// 7. Downloadable Documents
// ----------------------------------------------------
async function loadDocuments() {
  const container = document.getElementById('documentsListContainer');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/content/documents`);
    const data = await res.json();
    if (!data.documents || data.documents.length === 0) {
      container.innerHTML = '<p class="text-[#7d7267] text-center py-6">ไม่มีเอกสารสำหรับดาวน์โหลดในขณะนี้</p>';
      return;
    }

    container.innerHTML = data.documents.map(d => `
      <div class="aura-card p-6 flex flex-col justify-between group bg-[#eee5da] border border-[#d6c5b2]">
        <div>
          <div class="flex items-center justify-between text-xs text-[#7d7267] mb-3">
            <span class="px-3 py-1 bg-[#f7efe6] border border-[#d6c5b2] rounded-full text-[#9a744d] font-semibold">
              ${d.category === 'accommodation' ? 'เอกสารจองที่พัก' : 'เอกสารวิชาการ'}
            </span>
            <span class="font-mono text-[#7d7267]">${d.upload_date}</span>
          </div>
          <h3 class="font-bold text-[#171411] text-lg leading-snug group-hover:text-[#a67b4f] transition-colors">${d.title}</h3>
          <p class="text-sm text-[#6e6459] mt-2 line-clamp-2 leading-relaxed">${d.description || ''}</p>
        </div>
        <div class="mt-6 pt-4 border-t border-[#d6c5b2] flex items-center justify-between">
          <span class="text-xs text-[#7d7267] font-mono">${d.file_size}</span>
          <a href="${d.download_url}" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-[#171614] text-white hover:bg-[#2c2621] rounded-full text-xs font-bold transition shadow-sm">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            ดาวน์โหลด
          </a>
        </div>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<p class="text-red-600 text-center py-4">ไม่สามารถโหลดเอกสารได้: ${err.message}</p>`;
  }
}

// ----------------------------------------------------
// 8. Success Confirmation Modal
// ----------------------------------------------------
function showSuccessModal({ title, message, regCode, name, note }) {
  const modal = document.getElementById('registrationSuccessModal');
  if (!modal) return;
  document.getElementById('modalSuccessTitle').textContent = title;
  document.getElementById('modalSuccessMessage').textContent = message;
  document.getElementById('modalSuccessRegCode').textContent = regCode;
  document.getElementById('modalSuccessName').textContent = name;
  document.getElementById('modalSuccessNote').textContent = note;
  modal.classList.remove('hidden');

  // Trigger audio feedback note
  readNoteText(`บันทึกข้อมูลเรียบร้อยแล้วค่ะ คุณ ${name} รหัสลงทะเบียนคือ ${regCode}`);
}

function closeSuccessModal() {
  const modal = document.getElementById('registrationSuccessModal');
  if (modal) modal.classList.add('hidden');
}

// ----------------------------------------------------
// 9. Initializer
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Load saved accessibility prefs
  const savedFont = localStorage.getItem('forum_a11y_font') || 'normal';
  setFontSize(savedFont);
  if (localStorage.getItem('forum_a11y_contrast') === '1') {
    toggleHighContrast();
  }

  initSpeechRecognition();
  setupCascadingDropdowns();
  loadSchedules();
  loadDocuments();
  initEventCountdown();

  // Voice note reader button for public form
  const readNoteBtn = document.getElementById('btnReadPublicFormNote');
  if (readNoteBtn) {
    readNoteBtn.addEventListener('click', () => {
      const name = document.getElementById('pub_full_name')?.value || 'ท่านผู้เข้าร่วมงาน';
      const prov = document.getElementById('pub_province')?.value || 'ที่ยังไม่ได้ระบุ';
      readNoteText(`ข้อมูลลงทะเบียนของคุณ ${name} อยู่ในจังหวัด ${prov} หากข้อมูลถูกต้องแล้ว สามารถกดปุ่มยืนยันด้านล่างได้เลยค่ะ`);
    });
  }
});

// ----------------------------------------------------
// 10. Real-time Event Countdown Timer
// ----------------------------------------------------
function initEventCountdown() {
  const daysEl = document.getElementById('countdownDays');
  const hoursEl = document.getElementById('countdownHours');
  const minutesEl = document.getElementById('countdownMinutes');
  const secondsEl = document.getElementById('countdownSeconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Target event date: e.g. วันเปิดงานมหกรรมสุขภาพผู้สูงอายุแห่งชาติ
  const eventDate = new Date('2027-04-13T09:00:00+07:00');

  function updateTimer() {
    const now = new Date();
    const diff = eventDate.getTime() - now.getTime();

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = days.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}
