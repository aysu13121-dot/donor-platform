/* ==========================================
   QAN DOSTU - FRONT-END JAVASCRIPT APPLICATION
   ========================================== */

let currentUser = JSON.parse(localStorage.getItem('qandostu_user')) || null;

document.addEventListener('DOMContentLoaded', () => {
    updateNavUser();
    loadStats();
    loadRequests();
    loadDonors();
});

function switchTab(tabName) {
    ['requests', 'donors', 'create', 'profile'].forEach(name => {
        const sec = document.getElementById(`section-${name}`);
        const btn = document.getElementById(`tab-${name}-btn`);
        if (sec) sec.classList.add('hidden');
        if (btn) btn.classList.remove('active');
    });

    const activeSec = document.getElementById(`section-${tabName}`);
    const activeBtn = document.getElementById(`tab-${tabName}-btn`);
    if (activeSec) activeSec.classList.remove('hidden');
    if (activeBtn) activeBtn.classList.add('active');

    if (tabName === 'requests') loadRequests();
    if (tabName === 'donors') loadDonors();
    if (tabName === 'profile') renderProfileTab();
}

async function loadStats() {
    try {
        const res = await fetch('/api/stats');
        if (!res.ok) return;
        const data = await res.json();

        animateCounter('stat-total-donors', data.total_donors);
        animateCounter('stat-active-donors', data.active_donors);
        animateCounter('stat-active-requests', data.active_requests);
        animateCounter('stat-fulfilled-requests', data.fulfilled_requests);
        animateCounter('stat-total-cities', data.total_cities);
    } catch (err) {
        console.error("Statistika yüklənərkən xəta:", err);
    }
}

function animateCounter(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    let current = 0;
    const step = Math.ceil(target / 20) || 1;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
        } else {
            el.textContent = current;
        }
    }, 40);
}

async function loadRequests() {
    const grid = document.getElementById('requests-grid');
    if (!grid) return;

    grid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Sorğular yüklənir...</p></div>';

    const blood = document.getElementById('req-filter-blood').value;
    const city = document.getElementById('req-filter-city').value;
    const urgency = document.getElementById('req-filter-urgency').value;

    const params = new URLSearchParams();
    if (blood) params.append('blood_type', blood);
    if (city) params.append('city', city);
    if (urgency) params.append('urgency', urgency);

    try {
        const res = await fetch(`/api/requests?${params.toString()}`);
        const requests = await res.json();

        if (!requests || requests.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-folder-open"></i>
                    <p>Axtarışınıza uyğun heç bir təcili qan sorğusu tapılmadı.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = requests.map(req => {
            const isUrgentBorder = req.urgency === 'Critical' ? 'critical-border' : (req.urgency === 'Urgent' ? 'urgent-border' : '');
            const cleanPhone = req.contact_phone.replace(/\s+/g, '');
            const waPhone = cleanPhone.startsWith('+') ? cleanPhone.slice(1) : cleanPhone;

            return `
                <div class="request-card ${isUrgentBorder}">
                    <div>
                        <div class="card-header">
                            <div class="blood-type-badge">${req.blood_type}</div>
                            <span class="urgency-tag ${req.urgency}">${req.urgency === 'Critical' ? 'Çox Təcili' : (req.urgency === 'Urgent' ? 'Təcili' : 'Normal')}</span>
                        </div>
                        <div class="card-body">
                            <h4 class="card-title">${req.patient_name}</h4>
                            <div class="card-info">
                                <div class="info-item"><i class="fa-solid fa-hospital"></i> <span>${req.hospital}</span></div>
                                <div class="info-item"><i class="fa-solid fa-location-dot"></i> <span>${req.city}</span></div>
                                <div class="info-item"><i class="fa-solid fa-vial"></i> <span><strong>${req.units_needed}</strong> vahid qan lazımdır</span></div>
                                <div class="info-item"><i class="fa-solid fa-user-pen"></i> <span>Elan verən: ${req.author_name || 'Anonim'}</span></div>
                            </div>
                            ${req.note ? `<div class="card-note">"${req.note}"</div>` : ''}
                        </div>
                    </div>
                    <div>
                        <div class="card-actions">
                            <a href="tel:${cleanPhone}" class="btn-contact"><i class="fa-solid fa-phone"></i> Zəng Et</a>
                            <a href="https://wa.me/${waPhone}" target="_blank" class="btn-contact btn-whatsapp"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>
                        </div>
                        <button class="btn-primary" style="width: 100%; margin-top: 10px; justify-content: center; font-size: 0.85rem;" onclick="openOfferModal(${req.id}, '${req.patient_name}', '${req.blood_type}')">
                            <i class="fa-solid fa-hand-holding-heart"></i> Donor Ol / Kömək Et
                        </button>
                    </div>
                </div>
            `;
        }).join('');

    } catch (err) {
        console.error("Sorğular yüklənərkən xəta:", err);
        grid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><p>Məlumatları yükləyərkən xəta baş verdi.</p></div>';
    }
}

function resetReqFilters() {
    document.getElementById('req-filter-blood').value = '';
    document.getElementById('req-filter-city').value = '';
    document.getElementById('req-filter-urgency').value = '';
    loadRequests();
}

async function loadDonors() {
    const grid = document.getElementById('donors-grid');
    if (!grid) return;

    grid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Donorlar yüklənir...</p></div>';

    const blood = document.getElementById('donor-filter-blood').value;
    const city = document.getElementById('donor-filter-city').value;
    const avail = document.getElementById('donor-filter-avail').value;

    const params = new URLSearchParams();
    if (blood) params.append('blood_type', blood);
    if (city) params.append('city', city);
    if (avail !== "") params.append('is_available', avail);

    try {
        const res = await fetch(`/api/donors?${params.toString()}`);
        const donors = await res.json();

        if (!donors || donors.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-user-slash"></i>
                    <p>Axtarışa uyğun aktiv donor tapılmadı.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = donors.map(d => {
            const cleanPhone = (d.phone || '').replace(/\s+/g, '');
            const waPhone = cleanPhone.startsWith('+') ? cleanPhone.slice(1) : cleanPhone;
            const isAvail = d.is_available === 1;

            return `
                <div class="donor-card">
                    <div>
                        <div class="card-header">
                            <div class="blood-type-badge donor-badge">${d.blood_type || '?'}</div>
                            <span class="urgency-tag ${isAvail ? 'Normal' : 'Urgent'}">
                                ${isAvail ? '<i class="fa-solid fa-circle-check"></i> Aktiv Donor' : 'Müvəqqəti Passiv'}
                            </span>
                        </div>
                        <div class="card-body">
                            <h4 class="card-title">${d.full_name || 'Donor'}</h4>
                            <div class="card-info">
                                <div class="info-item"><i class="fa-solid fa-location-dot"></i> <span>${d.city || 'Şəhər qeyd olunmayıb'}</span></div>
                                <div class="info-item"><i class="fa-solid fa-calendar-check"></i> <span>Son donorluq: ${d.last_donation_date || 'Məlumat yoxdur'}</span></div>
                            </div>
                            ${d.bio ? `<div class="card-note">"${d.bio}"</div>` : ''}
                        </div>
                    </div>
                    ${cleanPhone ? `
                        <div class="card-actions">
                            <a href="tel:${cleanPhone}" class="btn-contact"><i class="fa-solid fa-phone"></i> Zəng Et</a>
                            <a href="https://wa.me/${waPhone}" target="_blank" class="btn-contact btn-whatsapp"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');

    } catch (err) {
        console.error("Donorlar yüklənərkən xəta:", err);
        grid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><p>Məlumatları yükləyərkən xəta baş verdi.</p></div>';
    }
}

function resetDonorFilters() {
    document.getElementById('donor-filter-blood').value = '';
    document.getElementById('donor-filter-city').value = '';
    document.getElementById('donor-filter-avail').value = '1';
    loadDonors();
}

async function submitBloodRequest(e) {
    e.preventDefault();
    if (!currentUser) {
        showToast("Sorğu yaratmaq üçün hesabınıza daxil olmalısınız!", "error");
        switchTab('profile');
        return;
    }

    const payload = {
        user_id: currentUser.id,
        patient_name: document.getElementById('create-patient-name').value,
        blood_type: document.getElementById('create-blood-type').value,
        urgency: document.getElementById('create-urgency').value,
        hospital: document.getElementById('create-hospital').value,
        city: document.getElementById('create-city').value,
        units_needed: document.getElementById('create-units').value,
        contact_phone: document.getElementById('create-phone').value,
        note: document.getElementById('create-note').value
    };

    try {
        const res = await fetch('/api/requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) {
            showToast(data.error || "Sorğu yaradılarkən xəta baş verdi.", "error");
            return;
        }

        showToast("Təcili qan sorğunuz uğurla dərc edildi!", "success");
        document.getElementById('create-request-form').reset();
        loadStats();
        switchTab('requests');

    } catch (err) {
        console.error("Sorğu yaratma xətası:", err);
        showToast("Şəbəkə xətası baş verdi.", "error");
    }
}

function updateNavUser() {
    const navText = document.getElementById('nav-user-name');
    if (currentUser && navText) {
        navText.textContent = currentUser.full_name || currentUser.email;
    } else if (navText) {
        navText.textContent = "Giriş / Profil";
    }
}

function toggleAuthMode(mode) {
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');
    const loginBtn = document.getElementById('show-login-btn');
    const regBtn = document.getElementById('show-register-btn');

    if (mode === 'login') {
        loginForm.classList.remove('hidden');
        regForm.classList.add('hidden');
        loginBtn.className = "btn-primary";
        regBtn.className = "btn-secondary";
    } else {
        loginForm.classList.add('hidden');
        regForm.classList.remove('hidden');
        loginBtn.className = "btn-secondary";
        regBtn.className = "btn-primary";
    }
}

function renderProfileTab() {
    const authBox = document.getElementById('auth-container');
    const profBox = document.getElementById('profile-container');

    if (!currentUser) {
        authBox.classList.remove('hidden');
        profBox.classList.add('hidden');
    } else {
        authBox.classList.add('hidden');
        profBox.classList.remove('hidden');

        document.getElementById('prof-name').value = currentUser.full_name || '';
        document.getElementById('prof-email').value = currentUser.email || '';
        document.getElementById('prof-blood').value = currentUser.blood_type || 'A+';
        document.getElementById('prof-city').value = currentUser.city || 'Bakı';
        document.getElementById('prof-phone').value = currentUser.phone || '';
        document.getElementById('prof-last-date').value = currentUser.last_donation_date || '';
        document.getElementById('prof-bio').value = currentUser.bio || '';
        document.getElementById('prof-available').checked = currentUser.is_available === 1;
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (!res.ok) {
            showToast(data.error || "Giriş alına bilmədi", "error");
            return;
        }

        currentUser = data;
        localStorage.setItem('qandostu_user', JSON.stringify(currentUser));
        updateNavUser();
        showToast(`Xoş gəldiniz, ${currentUser.full_name}!`, "success");
        renderProfileTab();

    } catch (err) {
        showToast("Şəbəkə xətası baş verdi.", "error");
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const payload = {
        full_name: document.getElementById('reg-name').value,
        email: document.getElementById('reg-email').value,
        password: document.getElementById('reg-password').value,
        blood_type: document.getElementById('reg-blood').value,
        city: document.getElementById('reg-city').value,
        phone: document.getElementById('reg-phone').value,
        bio: document.getElementById('reg-bio').value
    };

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (!res.ok) {
            showToast(data.error || "Qeydiyyat xətası", "error");
            return;
        }

        currentUser = data;
        localStorage.setItem('qandostu_user', JSON.stringify(currentUser));
        updateNavUser();
        showToast("Qeydiyyatınız uğurla tamamlandı!", "success");
        loadStats();
        renderProfileTab();

    } catch (err) {
        showToast("Şəbəkə xətası baş verdi.", "error");
    }
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    if (!currentUser) return;

    const payload = {
        full_name: document.getElementById('prof-name').value,
        blood_type: document.getElementById('prof-blood').value,
        city: document.getElementById('prof-city').value,
        phone: document.getElementById('prof-phone').value,
        last_donation_date: document.getElementById('prof-last-date').value,
        bio: document.getElementById('prof-bio').value,
        is_available: document.getElementById('prof-available').checked ? 1 : 0
    };

    try {
        const res = await fetch(`/api/profile/${currentUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (!res.ok) {
            showToast(data.error || "Yeniləmə xətası", "error");
            return;
        }

        currentUser = data;
        localStorage.setItem('qandostu_user', JSON.stringify(currentUser));
        updateNavUser();
        showToast("Profiliniz yadda saxlanıldı!", "success");
        loadStats();

    } catch (err) {
        showToast("Şəbəkə xətası baş verdi.", "error");
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('qandostu_user');
    updateNavUser();
    showToast("Hesabdan çıxış edildi.", "success");
    renderProfileTab();
}

function openOfferModal(reqId, patientName, bloodType) {
    if (!currentUser) {
        showToast("Donor müraciəti göndərmək üçün hesabınıza daxil olmalısınız!", "error");
        switchTab('profile');
        return;
    }

    document.getElementById('offer-req-id').value = reqId;
    document.getElementById('modal-request-info').innerHTML = `<strong>${patientName}</strong> (${bloodType}) üçün donorluq etmək istədiyinizi təsdiqləyin:`;
    document.getElementById('offer-modal').classList.add('active');
}

function closeOfferModal() {
    document.getElementById('offer-modal').classList.remove('active');
    document.getElementById('offer-message').value = '';
}

async function submitDonationOffer(e) {
    e.preventDefault();
    const reqId = document.getElementById('offer-req-id').value;
    const message = document.getElementById('offer-message').value;

    try {
        const res = await fetch(`/api/requests/${reqId}/offers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ donor_id: currentUser.id, message })
        });
        const data = await res.json();

        if (!res.ok) {
            showToast(data.error || "Müraciət göndərilə bilmədi", "error");
            return;
        }

        closeOfferModal();
        showToast("Müraciətiniz uğurla göndərildi! Təşəkkür edirik! ❤️", "success");

    } catch (err) {
        showToast("Şəbəkə xətası baş verdi.", "error");
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}" style="color:${type === 'success' ? '#10B981' : '#E63946'};"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}/* ==========================================
   QAN DOSTU - FRONT-END JAVASCRIPT APPLICATION
   ========================================== */

let currentUser = JSON.parse(localStorage.getItem('qandostu_user')) || null;

document.addEventListener('DOMContentLoaded', () => {
    updateNavUser();
    loadStats();
    loadRequests();
    loadDonors();
});

function switchTab(tabName) {
    ['requests', 'donors', 'create', 'profile'].forEach(name => {
        const sec = document.getElementById(`section-${name}`);
        const btn = document.getElementById(`tab-${name}-btn`);
        if (sec) sec.classList.add('hidden');
        if (btn) btn.classList.remove('active');
    });

    const activeSec = document.getElementById(`section-${tabName}`);
    const activeBtn = document.getElementById(`tab-${tabName}-btn`);
    if (activeSec) activeSec.classList.remove('hidden');
    if (activeBtn) activeBtn.classList.add('active');

    if (tabName === 'requests') loadRequests();
    if (tabName === 'donors') loadDonors();
    if (tabName === 'profile') renderProfileTab();
}

async function loadStats() {
    try {
        const res = await fetch('/api/stats');
        if (!res.ok) return;
        const data = await res.json();

        animateCounter('stat-total-donors', data.total_donors);
        animateCounter('stat-active-donors', data.active_donors);
        animateCounter('stat-active-requests', data.active_requests);
        animateCounter('stat-fulfilled-requests', data.fulfilled_requests);
        animateCounter('stat-total-cities', data.total_cities);
    } catch (err) {
        console.error("Statistika yüklənərkən xəta:", err);
    }
}

function animateCounter(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    let current = 0;
    const step = Math.ceil(target / 20) || 1;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
        } else {
            el.textContent = current;
        }
    }, 40);
}

async function loadRequests() {
    const grid = document.getElementById('requests-grid');
    if (!grid) return;

    grid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Sorğular yüklənir...</p></div>';

    const blood = document.getElementById('req-filter-blood').value;
    const city = document.getElementById('req-filter-city').value;
    const urgency = document.getElementById('req-filter-urgency').value;

    const params = new URLSearchParams();
    if (blood) params.append('blood_type', blood);
    if (city) params.append('city', city);
    if (urgency) params.append('urgency', urgency);

    try {
        const res = await fetch(`/api/requests?${params.toString()}`);
        const requests = await res.json();

        if (!requests || requests.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-folder-open"></i>
                    <p>Axtarışınıza uyğun heç bir təcili qan sorğusu tapılmadı.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = requests.map(req => {
            const isUrgentBorder = req.urgency === 'Critical' ? 'critical-border' : (req.urgency === 'Urgent' ? 'urgent-border' : '');
            const cleanPhone = req.contact_phone.replace(/\s+/g, '');
            const waPhone = cleanPhone.startsWith('+') ? cleanPhone.slice(1) : cleanPhone;

            return `
                <div class="request-card ${isUrgentBorder}">
                    <div>
                        <div class="card-header">
                            <div class="blood-type-badge">${req.blood_type}</div>
                            <span class="urgency-tag ${req.urgency}">${req.urgency === 'Critical' ? 'Çox Təcili' : (req.urgency === 'Urgent' ? 'Təcili' : 'Normal')}</span>
                        </div>
                        <div class="card-body">
                            <h4 class="card-title">${req.patient_name}</h4>
                            <div class="card-info">
                                <div class="info-item"><i class="fa-solid fa-hospital"></i> <span>${req.hospital}</span></div>
                                <div class="info-item"><i class="fa-solid fa-location-dot"></i> <span>${req.city}</span></div>
                                <div class="info-item"><i class="fa-solid fa-vial"></i> <span><strong>${req.units_needed}</strong> vahid qan lazımdır</span></div>
                                <div class="info-item"><i class="fa-solid fa-user-pen"></i> <span>Elan verən: ${req.author_name || 'Anonim'}</span></div>
                            </div>
                            ${req.note ? `<div class="card-note">"${req.note}"</div>` : ''}
                        </div>
                    </div>
                    <div>
                        <div class="card-actions">
                            <a href="tel:${cleanPhone}" class="btn-contact"><i class="fa-solid fa-phone"></i> Zəng Et</a>
                            <a href="https://wa.me/${waPhone}" target="_blank" class="btn-contact btn-whatsapp"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>
                        </div>
                        <button class="btn-primary" style="width: 100%; margin-top: 10px; justify-content: center; font-size: 0.85rem;" onclick="openOfferModal(${req.id}, '${req.patient_name}', '${req.blood_type}')">
                            <i class="fa-solid fa-hand-holding-heart"></i> Donor Ol / Kömək Et
                        </button>
                    </div>
                </div>
            `;
        }).join('');

    } catch (err) {
        console.error("Sorğular yüklənərkən xəta:", err);
        grid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><p>Məlumatları yükləyərkən xəta baş verdi.</p></div>';
    }
}

function resetReqFilters() {
    document.getElementById('req-filter-blood').value = '';
    document.getElementById('req-filter-city').value = '';
    document.getElementById('req-filter-urgency').value = '';
    loadRequests();
}

async function loadDonors() {
    const grid = document.getElementById('donors-grid');
    if (!grid) return;

    grid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Donorlar yüklənir...</p></div>';

    const blood = document.getElementById('donor-filter-blood').value;
    const city = document.getElementById('donor-filter-city').value;
    const avail = document.getElementById('donor-filter-avail').value;

    const params = new URLSearchParams();
    if (blood) params.append('blood_type', blood);
    if (city) params.append('city', city);
    if (avail !== "") params.append('is_available', avail);

    try {
        const res = await fetch(`/api/donors?${params.toString()}`);
        const donors = await res.json();

        if (!donors || donors.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-user-slash"></i>
                    <p>Axtarışa uyğun aktiv donor tapılmadı.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = donors.map(d => {
            const cleanPhone = (d.phone || '').replace(/\s+/g, '');
            const waPhone = cleanPhone.startsWith('+') ? cleanPhone.slice(1) : cleanPhone;
            const isAvail = d.is_available === 1;

            return `
                <div class="donor-card">
                    <div>
                        <div class="card-header">
                            <div class="blood-type-badge donor-badge">${d.blood_type || '?'}</div>
                            <span class="urgency-tag ${isAvail ? 'Normal' : 'Urgent'}">
                                ${isAvail ? '<i class="fa-solid fa-circle-check"></i> Aktiv Donor' : 'Müvəqqəti Passiv'}
                            </span>
                        </div>
                        <div class="card-body">
                            <h4 class="card-title">${d.full_name || 'Donor'}</h4>
                            <div class="card-info">
                                <div class="info-item"><i class="fa-solid fa-location-dot"></i> <span>${d.city || 'Şəhər qeyd olunmayıb'}</span></div>
                                <div class="info-item"><i class="fa-solid fa-calendar-check"></i> <span>Son donorluq: ${d.last_donation_date || 'Məlumat yoxdur'}</span></div>
                            </div>
                            ${d.bio ? `<div class="card-note">"${d.bio}"</div>` : ''}
                        </div>
                    </div>
                    ${cleanPhone ? `
                        <div class="card-actions">
                            <a href="tel:${cleanPhone}" class="btn-contact"><i class="fa-solid fa-phone"></i> Zəng Et</a>
                            <a href="https://wa.me/${waPhone}" target="_blank" class="btn-contact btn-whatsapp"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');

    } catch (err) {
        console.error("Donorlar yüklənərkən xəta:", err);
        grid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><p>Məlumatları yükləyərkən xəta baş verdi.</p></div>';
    }
}

function resetDonorFilters() {
    document.getElementById('donor-filter-blood').value = '';
    document.getElementById('donor-filter-city').value = '';
    document.getElementById('donor-filter-avail').value = '1';
    loadDonors();
}

async function submitBloodRequest(e) {
    e.preventDefault();
    if (!currentUser) {
        showToast("Sorğu yaratmaq üçün hesabınıza daxil olmalısınız!", "error");
        switchTab('profile');
        return;
    }

    const payload = {
        user_id: currentUser.id,
        patient_name: document.getElementById('create-patient-name').value,
        blood_type: document.getElementById('create-blood-type').value,
        urgency: document.getElementById('create-urgency').value,
        hospital: document.getElementById('create-hospital').value,
        city: document.getElementById('create-city').value,
        units_needed: document.getElementById('create-units').value,
        contact_phone: document.getElementById('create-phone').value,
        note: document.getElementById('create-note').value
    };

    try {
        const res = await fetch('/api/requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) {
            showToast(data.error || "Sorğu yaradılarkən xəta baş verdi.", "error");
            return;
        }

        showToast("Təcili qan sorğunuz uğurla dərc edildi!", "success");
        document.getElementById('create-request-form').reset();
        loadStats();
        switchTab('requests');

    } catch (err) {
        console.error("Sorğu yaratma xətası:", err);
        showToast("Şəbəkə xətası baş verdi.", "error");
    }
}

function updateNavUser() {
    const navText = document.getElementById('nav-user-name');
    if (currentUser && navText) {
        navText.textContent = currentUser.full_name || currentUser.email;
    } else if (navText) {
        navText.textContent = "Giriş / Profil";
    }
}

function toggleAuthMode(mode) {
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');
    const loginBtn = document.getElementById('show-login-btn');
    const regBtn = document.getElementById('show-register-btn');

    if (mode === 'login') {
        loginForm.classList.remove('hidden');
        regForm.classList.add('hidden');
        loginBtn.className = "btn-primary";
        regBtn.className = "btn-secondary";
    } else {
        loginForm.classList.add('hidden');
        regForm.classList.remove('hidden');
        loginBtn.className = "btn-secondary";
        regBtn.className = "btn-primary";
    }
}

function renderProfileTab() {
    const authBox = document.getElementById('auth-container');
    const profBox = document.getElementById('profile-container');

    if (!currentUser) {
        authBox.classList.remove('hidden');
        profBox.classList.add('hidden');
    } else {
        authBox.classList.add('hidden');
        profBox.classList.remove('hidden');

        document.getElementById('prof-name').value = currentUser.full_name || '';
        document.getElementById('prof-email').value = currentUser.email || '';
        document.getElementById('prof-blood').value = currentUser.blood_type || 'A+';
        document.getElementById('prof-city').value = currentUser.city || 'Bakı';
        document.getElementById('prof-phone').value = currentUser.phone || '';
        document.getElementById('prof-last-date').value = currentUser.last_donation_date || '';
        document.getElementById('prof-bio').value = currentUser.bio || '';
        document.getElementById('prof-available').checked = currentUser.is_available === 1;
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (!res.ok) {
            showToast(data.error || "Giriş alına bilmədi", "error");
            return;
        }

        currentUser = data;
        localStorage.setItem('qandostu_user', JSON.stringify(currentUser));
        updateNavUser();
        showToast(`Xoş gəldiniz, ${currentUser.full_name}!`, "success");
        renderProfileTab();

    } catch (err) {
        showToast("Şəbəkə xətası baş verdi.", "error");
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const payload = {
        full_name: document.getElementById('reg-name').value,
        email: document.getElementById('reg-email').value,
        password: document.getElementById('reg-password').value,
        blood_type: document.getElementById('reg-blood').value,
        city: document.getElementById('reg-city').value,
        phone: document.getElementById('reg-phone').value,
        bio: document.getElementById('reg-bio').value
    };

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (!res.ok) {
            showToast(data.error || "Qeydiyyat xətası", "error");
            return;
        }

        currentUser = data;
        localStorage.setItem('qandostu_user', JSON.stringify(currentUser));
        updateNavUser();
        showToast("Qeydiyyatınız uğurla tamamlandı!", "success");
        loadStats();
        renderProfileTab();

    } catch (err) {
        showToast("Şəbəkə xətası baş verdi.", "error");
    }
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    if (!currentUser) return;

    const payload = {
        full_name: document.getElementById('prof-name').value,
        blood_type: document.getElementById('prof-blood').value,
        city: document.getElementById('prof-city').value,
        phone: document.getElementById('prof-phone').value,
        last_donation_date: document.getElementById('prof-last-date').value,
        bio: document.getElementById('prof-bio').value,
        is_available: document.getElementById('prof-available').checked ? 1 : 0
    };

    try {
        const res = await fetch(`/api/profile/${currentUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (!res.ok) {
            showToast(data.error || "Yeniləmə xətası", "error");
            return;
        }

        currentUser = data;
        localStorage.setItem('qandostu_user', JSON.stringify(currentUser));
        updateNavUser();
        showToast("Profiliniz yadda saxlanıldı!", "success");
        loadStats();

    } catch (err) {
        showToast("Şəbəkə xətası baş verdi.", "error");
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('qandostu_user');
    updateNavUser();
    showToast("Hesabdan çıxış edildi.", "success");
    renderProfileTab();
}

function openOfferModal(reqId, patientName, bloodType) {
    if (!currentUser) {
        showToast("Donor müraciəti göndərmək üçün hesabınıza daxil olmalısınız!", "error");
        switchTab('profile');
        return;
    }

    document.getElementById('offer-req-id').value = reqId;
    document.getElementById('modal-request-info').innerHTML = `<strong>${patientName}</strong> (${bloodType}) üçün donorluq etmək istədiyinizi təsdiqləyin:`;
    document.getElementById('offer-modal').classList.add('active');
}

function closeOfferModal() {
    document.getElementById('offer-modal').classList.remove('active');
    document.getElementById('offer-message').value = '';
}

async function submitDonationOffer(e) {
    e.preventDefault();
    const reqId = document.getElementById('offer-req-id').value;
    const message = document.getElementById('offer-message').value;

    try {
        const res = await fetch(`/api/requests/${reqId}/offers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ donor_id: currentUser.id, message })
        });
        const data = await res.json();

        if (!res.ok) {
            showToast(data.error || "Müraciət göndərilə bilmədi", "error");
            return;
        }

        closeOfferModal();
        showToast("Müraciətiniz uğurla göndərildi! Təşəkkür edirik! ❤️", "success");

    } catch (err) {
        showToast("Şəbəkə xətası baş verdi.", "error");
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}" style="color:${type === 'success' ? '#10B981' : '#E63946'};"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
