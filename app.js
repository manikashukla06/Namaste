/**
 * NAMASTE - ICD-11 EHR Integration Platform
 * Application Controller & Workflow Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // App State
    const state = {
        currentScreen: 'dashboard',
        selectedPatientId: 'P001',
        selectedAyushTermId: 'AYU-AML-042',
        currentRole: 'doctor',
        searchTerm: '',
        patientFilter: '',
        selectedApiId: 'api-1'
    };

    // DOM Cache
    const mainContent = document.getElementById('main-content');
    const navItems = document.querySelectorAll('.nav-item');
    const roleSelect = document.getElementById('role-select');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const userTitle = document.getElementById('user-title');
    const queueCountBadge = document.getElementById('sidebar-queue-count');

    // Init App
    init();

    function init() {
        bindEvents();
        updateQueueBadge();
        renderScreen(state.currentScreen);
    }

    function bindEvents() {
        // Navigation sidebar clicks
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const targetScreen = item.getAttribute('data-screen');
                if (targetScreen) {
                    navItems.forEach(nav => nav.classList.remove('active'));
                    item.classList.add('active');
                    state.currentScreen = targetScreen;
                    renderScreen(targetScreen);
                }
            });
        });

        // Quick action shortcuts bar in header
        document.querySelectorAll('.quick-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-target');
                const patientId = btn.getAttribute('data-patient');
                if (patientId) state.selectedPatientId = patientId;
                if (target) {
                    navItems.forEach(nav => {
                        nav.classList.remove('active');
                        if (nav.getAttribute('data-screen') === target) {
                            nav.classList.add('active');
                        }
                    });
                    state.currentScreen = target;
                    renderScreen(target);
                }
            });
        });

        // Role Selector switch
        if (roleSelect) {
            roleSelect.addEventListener('change', (e) => {
                state.currentRole = e.target.value;
                updateRoleView();
                showToast(`Switched role to: ${e.target.options[e.target.selectedIndex].text}`, 'info');
                renderScreen(state.currentScreen);
            });
        }
    }

    function updateRoleView() {
        const user = window.NAMASTE_DATA.currentUser;
        if (state.currentRole === 'doctor') {
            userAvatar.innerText = "VS";
            userName.innerText = "Dr. Vikram Sharma";
            userTitle.innerText = "Senior Specialist (BAMS, MD)";
        } else if (state.currentRole === 'staff') {
            userAvatar.innerText = "PR";
            userName.innerText = "Pooja Rawat";
            userTitle.innerText = "Clinical Data Nurse";
        } else if (state.currentRole === 'admin') {
            userAvatar.innerText = "AK";
            userName.innerText = "Amit Kumar";
            userTitle.innerText = "Hospital Medical Director";
        } else if (state.currentRole === 'developer') {
            userAvatar.innerText = "DEV";
            userName.innerText = "Developer Portal";
            userTitle.innerText = "API & Integration Admin";
        }
    }

    function updateQueueBadge() {
        const pendingCount = window.NAMASTE_DATA.verificationQueue.filter(q => q.status === 'Pending').length;
        if (queueCountBadge) {
            queueCountBadge.innerText = pendingCount;
        }
    }

    // Main Router
    function renderScreen(screen) {
        window.scrollTo(0, 0);
        switch (screen) {
            case 'dashboard':
                renderDashboard();
                break;
            case 'patients':
                renderPatientsList();
                break;
            case 'patient-detail':
                renderPatientDetail(state.selectedPatientId);
                break;
            case 'encounter':
                renderNewEncounter();
                break;
            case 'terminology':
                renderTerminologyExplorer();
                break;
            case 'mapping-detail':
                renderMappingDetail(state.selectedAyushTermId);
                break;
            case 'verification':
                renderVerificationQueue();
                break;
            case 'analytics':
                renderAnalytics();
                break;
            case 'developer':
                renderDeveloperPortal();
                break;
            case 'settings':
                renderSettings();
                break;
            default:
                renderDashboard();
        }
    }

    // Helper: Toast Notifications
    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-info';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3500);
    }

    // Helper: Confidence Progress Bar
    function getConfidenceHtml(confidence) {
        return `
            <div class="confidence-wrapper">
                <div class="confidence-track">
                    <div class="confidence-fill" style="width: ${confidence}%;"></div>
                </div>
                <div class="confidence-text">${confidence}%</div>
            </div>
        `;
    }

    // =========================================================================
    // 1. DOCTOR DASHBOARD (MAIN SCREEN)
    // =========================================================================
    function renderDashboard() {
        const stats = window.NAMASTE_DATA.stats;
        const pendingQueue = window.NAMASTE_DATA.verificationQueue.filter(q => q.status === 'Pending');
        const patients = window.NAMASTE_DATA.patients;

        mainContent.innerHTML = `
            <div class="screen-header">
                <div>
                    <h2 class="screen-title">
                        <i class="fa-solid fa-user-doctor" style="color: #0284C7;"></i>
                        <span>Doctor Clinical Workspace</span>
                    </h2>
                    <div class="screen-subtitle">Welcome back, Dr. Sharma. Overview of active EHR encounters & terminology mappings.</div>
                </div>
                <div>
                    <button class="btn btn-primary" id="dash-btn-new-encounter">
                        <i class="fa-solid fa-plus"></i> New Clinical Encounter
                    </button>
                </div>
            </div>

            <!-- Action Required Alert Banner -->
            <div class="alert-banner">
                <div class="alert-content">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <div>
                        <strong style="font-size: 0.95rem;">Action Required: ${pendingQueue.length} AYUSH → ICD-11 Dual-Coding Mappings Pending</strong>
                        <div style="font-size: 0.8rem; font-weight: 500; opacity: 0.9;">Clinician verification required before syncing to ABDM central health records.</div>
                    </div>
                </div>
                <button class="btn btn-warning btn-sm" id="dash-btn-review-queue">
                    <i class="fa-solid fa-stethoscope"></i> Review Queue (${pendingQueue.length})
                </button>
            </div>

            <!-- Key Metrics Grid -->
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-icon">
                        <i class="fa-solid fa-hospital-user"></i>
                    </div>
                    <div>
                        <div class="metric-value">${stats.todaysPatients}</div>
                        <div class="metric-label">Today's Active Patients</div>
                    </div>
                </div>

                <div class="metric-card alert-border">
                    <div class="metric-icon alert-icon">
                        <i class="fa-solid fa-circle-exclamation"></i>
                    </div>
                    <div>
                        <div class="metric-value">${pendingQueue.length}</div>
                        <div class="metric-label">Pending Verification</div>
                    </div>
                </div>

                <div class="metric-card">
                    <div class="metric-icon" style="background: #E0F2FE; color: #0284C7;">
                        <i class="fa-solid fa-circle-check"></i>
                    </div>
                    <div>
                        <div class="metric-value">${stats.verifiedMappings}</div>
                        <div class="metric-label">Verified Dual Codings</div>
                    </div>
                </div>

                <div class="metric-card">
                    <div class="metric-icon" style="background: #F1F5F9; color: #334155;">
                        <i class="fa-solid fa-notes-medical"></i>
                    </div>
                    <div>
                        <div class="metric-value">${stats.recentRecords}</div>
                        <div class="metric-label">Recent EHR Encounters</div>
                    </div>
                </div>
            </div>

            <!-- Dashboard Columns (Recent Patients & Pending Items) -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
                <!-- Left: Recent Patients -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">
                            <i class="fa-solid fa-users" style="color: #0284C7;"></i>
                            <span>Recent Clinical Encounters</span>
                        </div>
                        <a style="font-size: 0.82rem; color: #0284C7; font-weight: 700; cursor: pointer;" id="dash-link-all-patients">View All (${patients.length}) →</a>
                    </div>
                    <div class="table-responsive">
                        <table class="clinical-table">
                            <thead>
                                <tr>
                                    <th>Patient ID / ABHA</th>
                                    <th>Name</th>
                                    <th>AYUSH Diagnosis</th>
                                    <th>Mapped ICD-11</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${patients.map(p => {
            const latestCond = p.activeConditions[0] || {};
            const statusClass = latestCond.status === 'Verified' ? 'badge-verified' : 'badge-pending';
            return `
                                        <tr>
                                            <td>
                                                <strong style="color: #0284C7;">${p.id}</strong>
                                                <div style="font-size: 0.72rem; color: #64748B; font-family: var(--font-mono);">${p.abhaId}</div>
                                            </td>
                                            <td>
                                                <strong style="font-size: 0.9rem;">${p.name}</strong>
                                                <div style="font-size: 0.75rem; color: #64748B;">${p.age} Yrs / ${p.gender}</div>
                                            </td>
                                            <td>
                                                <span class="badge badge-system">${latestCond.ayushTerm || 'N/A'}</span>
                                            </td>
                                            <td>
                                                <span class="badge badge-code">${latestCond.icd11Code || 'N/A'}</span>
                                            </td>
                                            <td>
                                                <span class="badge ${statusClass}">${latestCond.status || 'Pending'}</span>
                                            </td>
                                            <td>
                                                <button class="btn btn-secondary btn-sm btn-open-patient" data-id="${p.id}">
                                                    <i class="fa-solid fa-folder-open"></i> EHR
                                                </button>
                                            </td>
                                        </tr>
                                    `;
        }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Right: Pending Mappings Direct Actions -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">
                            <i class="fa-solid fa-clock-rotate-left" style="color: #D97706;"></i>
                            <span>Verification Queue</span>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        ${pendingQueue.slice(0, 3).map(item => `
                            <div style="padding: 12px; background: #F8FAFC; border-radius: var(--radius-sm); border: 1px solid var(--color-border);">
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                                    <span style="font-weight: 700; font-size: 0.85rem;">${item.ayushTerm}</span>
                                    <span class="badge badge-pending">${item.confidence}% Match</span>
                                </div>
                                <div style="font-size: 0.76rem; color: #64748B; margin-bottom: 6px;">
                                    Mapped to: <strong style="color: #0284C7;">${item.icd11Suggested}</strong>
                                </div>
                                <div style="display: flex; gap: 6px;">
                                    <button class="btn btn-success btn-sm btn-quick-verify" data-id="${item.id}" style="flex: 1;">
                                        <i class="fa-solid fa-check"></i> Verify
                                    </button>
                                    <button class="btn btn-secondary btn-sm btn-quick-inspect" data-term="${item.ayushTerm}">
                                        <i class="fa-solid fa-eye"></i> Details
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Attach Event Handlers for Dashboard
        document.getElementById('dash-btn-new-encounter')?.addEventListener('click', () => {
            state.currentScreen = 'encounter';
            renderScreen('encounter');
        });

        document.getElementById('dash-btn-review-queue')?.addEventListener('click', () => {
            state.currentScreen = 'verification';
            renderScreen('verification');
        });

        document.getElementById('dash-link-all-patients')?.addEventListener('click', () => {
            state.currentScreen = 'patients';
            renderScreen('patients');
        });

        document.querySelectorAll('.btn-open-patient').forEach(btn => {
            btn.addEventListener('click', () => {
                state.selectedPatientId = btn.getAttribute('data-id');
                state.currentScreen = 'patient-detail';
                renderScreen('patient-detail');
            });
        });

        document.querySelectorAll('.btn-quick-verify').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const target = window.NAMASTE_DATA.verificationQueue.find(q => q.id === id);
                if (target) {
                    target.status = 'Verified';
                    updateQueueBadge();
                    showToast(`Successfully verified dual-coding for ${target.ayushTerm} → ${target.icd11Suggested}`, 'success');
                    renderDashboard();
                }
            });
        });

        document.querySelectorAll('.btn-quick-inspect').forEach(btn => {
            btn.addEventListener('click', () => {
                state.currentScreen = 'mapping-detail';
                renderScreen('mapping-detail');
            });
        });
    }

    // =========================================================================
    // 2. PATIENTS LIST & EHR SEARCH
    // =========================================================================
    function renderPatientsList() {
        const patients = window.NAMASTE_DATA.patients;

        mainContent.innerHTML = `
            <div class="screen-header">
                <div>
                    <h2 class="screen-title">
                        <i class="fa-solid fa-address-book" style="color: #0284C7;"></i>
                        <span>Patient Directory & EHR Registry</span>
                    </h2>
                    <div class="screen-subtitle">Search registered patients by Name, ABHA ID, or Patient Identification.</div>
                </div>
            </div>

            <!-- Search Bar -->
            <div class="card" style="padding: 16px;">
                <div style="display: flex; gap: 12px; align-items: center;">
                    <div style="flex: 1; position: relative;">
                        <input type="text" id="patient-search-input" class="form-control" placeholder="⚡ Instant Search: Type Name, ABHA ID (e.g. 91-4820...), or Patient ID..." value="${state.patientFilter}" autofocus>
                    </div>
                    <button class="btn btn-primary" id="btn-do-patient-search">
                        <i class="fa-solid fa-magnifying-glass"></i> Instant Filter
                    </button>
                </div>
            </div>

            <!-- Patient Table -->
            <div class="card">
                <div class="table-responsive">
                    <table class="clinical-table">
                        <thead>
                            <tr>
                                <th>Patient ID</th>
                                <th>ABHA Health ID</th>
                                <th>Patient Name</th>
                                <th>Age / Sex</th>
                                <th>Active AYUSH Condition</th>
                                <th>Mapped ICD-11 Code</th>
                                <th>Last Visit</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="patient-table-body">
                            ${renderPatientRows(patients, state.patientFilter)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        function renderPatientRows(allPatients, query) {
            const q = (query || '').toLowerCase().trim();
            const filtered = allPatients.filter(p => {
                if (!q) return true;
                return p.name.toLowerCase().includes(q) || p.abhaId.includes(q) || p.id.toLowerCase().includes(q);
            });

            if (filtered.length === 0) {
                return `<tr><td colspan="8" style="text-align: center; padding: 24px; color: #64748B;">No matching patient records found for "${query}"</td></tr>`;
            }

            return filtered.map(p => {
                const cond = p.activeConditions[0] || {};
                return `
                    <tr>
                        <td><strong style="color: #0284C7;">${p.id}</strong></td>
                        <td>
                            <span style="font-family: var(--font-mono); font-size: 0.8rem; background: #F1F5F9; padding: 2px 6px; border-radius: 4px;">
                                <i class="fa-solid fa-id-card" style="color: #0284C7;"></i> ${p.abhaId}
                            </span>
                        </td>
                        <td><strong style="font-size: 0.92rem;">${p.name}</strong></td>
                        <td>${p.age} Yrs / ${p.gender}</td>
                        <td><span class="badge badge-system">${cond.ayushTerm || 'None'}</span></td>
                        <td><span class="badge badge-code">${cond.icd11Code || 'None'}</span></td>
                        <td>${p.lastVisit}</td>
                        <td>
                            <button class="btn btn-primary btn-sm btn-open-patient" data-id="${p.id}">
                                <i class="fa-solid fa-notes-medical"></i> Open EHR Timeline
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        function attachPatientRowListeners() {
            document.querySelectorAll('.btn-open-patient').forEach(btn => {
                btn.addEventListener('click', () => {
                    state.selectedPatientId = btn.getAttribute('data-id');
                    state.currentScreen = 'patient-detail';
                    renderScreen('patient-detail');
                });
            });
        }

        attachPatientRowListeners();

        const searchInput = document.getElementById('patient-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                state.patientFilter = e.target.value;
                const tbody = document.getElementById('patient-table-body');
                if (tbody) {
                    tbody.innerHTML = renderPatientRows(patients, state.patientFilter);
                    attachPatientRowListeners();
                }
            });
        }

        document.getElementById('btn-do-patient-search')?.addEventListener('click', () => {
            const tbody = document.getElementById('patient-table-body');
            if (tbody) {
                tbody.innerHTML = renderPatientRows(patients, state.patientFilter);
                attachPatientRowListeners();
            }
        });
    }

    // =========================================================================
    // 3. PATIENT EHR CLINICAL RECORD TIMELINE
    // =========================================================================
    function renderPatientDetail(patientId) {
        const patient = window.NAMASTE_DATA.patients.find(p => p.id === patientId) || window.NAMASTE_DATA.patients[0];

        mainContent.innerHTML = `
            <div class="screen-header">
                <div>
                    <button class="btn btn-secondary btn-sm" id="btn-back-to-patients" style="margin-bottom: 8px;">
                        <i class="fa-solid fa-arrow-left"></i> Back to Patient Directory
                    </button>
                    <h2 class="screen-title">
                        <i class="fa-solid fa-hospital-user" style="color: #0284C7;"></i>
                        <span>Electronic Health Record (EHR) — ${patient.name}</span>
                    </h2>
                    <div class="screen-subtitle">Standardized Dual-Coded Clinical History & Diagnostic Timeline</div>
                </div>
                <div>
                    <button class="btn btn-primary" id="btn-new-encounter-for-patient">
                        <i class="fa-solid fa-plus-circle"></i> Add New Encounter
                    </button>
                </div>
            </div>

            <!-- Patient Profile & Vitals Header Card -->
            <div class="card" style="background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);">
                <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 20px; align-items: center;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                            <h3 style="font-size: 1.3rem; font-weight: 800;">${patient.name}</h3>
                            <span class="badge badge-system">${patient.id}</span>
                            <span style="font-family: var(--font-mono); font-size: 0.78rem; background: #E0F2FE; color: #0369A1; padding: 2px 8px; border-radius: 4px; font-weight: 700;">
                                ABHA: ${patient.abhaId}
                            </span>
                        </div>
                        <div style="font-size: 0.85rem; color: #64748B; display: flex; gap: 16px;">
                            <span><strong>Age/Sex:</strong> ${patient.age} Yrs (${patient.gender})</span>
                            <span><strong>Blood Group:</strong> ${patient.bloodGroup}</span>
                            <span><strong>Phone:</strong> ${patient.phone}</span>
                        </div>
                    </div>

                    <!-- Vitals Box -->
                    <div style="background: #FFFFFF; padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--color-border);">
                        <div style="font-size: 0.7rem; uppercase; font-weight: 700; color: #64748B; margin-bottom: 4px;">Recorded Vitals</div>
                        <div style="font-size: 0.78rem; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                            <span>BP: <strong>${patient.vitals.bp}</strong></span>
                            <span>Pulse: <strong>${patient.vitals.pulse}</strong></span>
                            <span>Temp: <strong>${patient.vitals.temp}</strong></span>
                            <span>BMI: <strong>${patient.vitals.bmi}</strong></span>
                        </div>
                    </div>

                    <!-- Allergies Box -->
                    <div style="background: #FEF2F2; padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid #FCA5A5;">
                        <div style="font-size: 0.7rem; uppercase; font-weight: 700; color: #991B1B; margin-bottom: 2px;">
                            <i class="fa-solid fa-triangle-exclamation"></i> Documented Allergies
                        </div>
                        <div style="font-size: 0.82rem; font-weight: 700; color: #7F1D1D;">
                            ${patient.allergies.join(', ') || 'None Recorded'}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Active Standardized Dual-Coding Diagnoses Card -->
            <div class="card">
                <div class="card-header">
                    <div class="card-title">
                        <i class="fa-solid fa-kaaba" style="color: #0284C7;"></i>
                        <span>Active Diagnoses (NAMASTE AYUSH + WHO ICD-11 Dual-Coding)</span>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="clinical-table">
                        <thead>
                            <tr>
                                <th>AYUSH Term (NAMASTE)</th>
                                <th>NAMASTE Code</th>
                                <th>Standardized ICD-11 Code & Title</th>
                                <th>Confidence</th>
                                <th>Verification Status</th>
                                <th>Diagnosing Clinician</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${patient.activeConditions.map(cond => `
                                <tr>
                                    <td><strong style="color: #0284C7; font-size: 0.95rem;">${cond.ayushTerm}</strong></td>
                                    <td><span class="badge badge-system">${cond.namasteCode}</span></td>
                                    <td>
                                        <div style="font-weight: 700;">
                                            <span class="badge badge-code">${cond.icd11Code}</span> ${cond.icd11Title}
                                        </div>
                                    </td>
                                    <td>${getConfidenceHtml(cond.confidence)}</td>
                                    <td>
                                        <span class="badge ${cond.status === 'Verified' ? 'badge-verified' : 'badge-pending'}">
                                            ${cond.status === 'Verified' ? '<i class="fa-solid fa-check"></i> Verified' : '<i class="fa-solid fa-clock"></i> Pending'}
                                        </span>
                                    </td>
                                    <td>${cond.doctor}</td>
                                </tr>
                            `).map(item => item).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Clinical Encounter Timeline -->
            <div class="card">
                <div class="card-header">
                    <div class="card-title">
                        <i class="fa-solid fa-timeline" style="color: #0284C7;"></i>
                        <span>Clinical Encounters & Timeline Records</span>
                    </div>
                </div>

                <div class="timeline">
                    ${patient.encounters.map(enc => `
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-card">
                                <div class="timeline-header">
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <span class="timeline-date">${enc.date}</span>
                                        <span class="badge badge-system">${enc.type}</span>
                                    </div>
                                    <span style="font-size: 0.78rem; color: #64748B;">Attending: <strong>${enc.doctor}</strong></span>
                                </div>
                                <div style="font-size: 0.88rem; margin-bottom: 10px;">
                                    <strong>Chief Complaint:</strong> ${enc.chiefComplaint}
                                </div>
                                <div style="background: #F0F9FF; padding: 10px; border-radius: var(--radius-sm); border: 1px solid #BAE6FD; margin-bottom: 10px; display: flex; gap: 20px;">
                                    <div>AYUSH Diagnosis: <strong style="color: #0369A1;">${enc.ayushDiagnosis}</strong></div>
                                    <div>ICD-11 Mapping: <strong style="color: #0369A1;">${enc.icd11Mapping}</strong></div>
                                </div>
                                <div style="font-size: 0.83rem; color: #334155; margin-bottom: 8px;">
                                    <strong>Clinical Notes:</strong> ${enc.notes}
                                </div>
                                ${enc.prescription ? `
                                    <div style="font-size: 0.8rem; background: #F8FAFC; padding: 8px 12px; border-radius: 6px; border: 1px solid #E2E8F0;">
                                        <strong style="color: #475569;"><i class="fa-solid fa-pills"></i> Prescribed Medicines:</strong>
                                        <ul style="margin-left: 18px; margin-top: 4px;">
                                            ${enc.prescription.map(m => `<li><strong>${m.name}</strong> (${m.dose}) - ${m.freq} [${m.type}]</li>`).join('')}
                                        </ul>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.getElementById('btn-back-to-patients')?.addEventListener('click', () => {
            state.currentScreen = 'patients';
            renderScreen('patients');
        });

        document.getElementById('btn-new-encounter-for-patient')?.addEventListener('click', () => {
            state.currentScreen = 'encounter';
            renderScreen('encounter');
        });
    }

    // =========================================================================
    // 4. NEW CLINICAL ENCOUNTER WORKSPACE (1-SCREEN DUAL CODING TOOL)
    // =========================================================================
    function renderNewEncounter() {
        const patients = window.NAMASTE_DATA.patients;
        const ayushTerms = window.NAMASTE_DATA.ayushTerms;
        let selectedTerm = ayushTerms[0];

        mainContent.innerHTML = `
            <div class="screen-header">
                <div>
                    <h2 class="screen-title">
                        <i class="fa-solid fa-stethoscope" style="color: #0284C7;"></i>
                        <span>New Clinical Encounter & Dual Coding Workspace</span>
                    </h2>
                    <div class="screen-subtitle">Integrated Ayush Terminology Search & WHO ICD-11 Auto-Mapping Workspace</div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <!-- Left: Patient & Clinical Notes Form -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">
                            <i class="fa-solid fa-user-pen"></i>
                            <span>1. Encounter Patient & Symptoms</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Select Patient</label>
                        <select class="form-control" id="enc-patient-select">
                            ${patients.map(p => `<option value="${p.id}">${p.name} (${p.id} - ABHA ${p.abhaId})</option>`).join('')}
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Chief Complaint & Clinical Presentation</label>
                        <textarea class="form-control" id="enc-chief-complaint" rows="3" placeholder="Enter patient complaints, symptom duration, and clinical findings..."></textarea>
                    </div>

                    <div class="form-group">
                        <label class="form-label">AYUSH Terminology Search (NAMASTE DB)</label>
                        <select class="form-control" id="enc-ayush-select">
                            ${ayushTerms.map(t => `<option value="${t.id}">${t.term} [${t.system}] - ${t.namasteCode}</option>`).join('')}
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Add Prescribed Formulation (Optional)</label>
                        <input type="text" class="form-control" id="enc-rx-input" placeholder="e.g. Avipattikar Churna 3g BD before meals">
                    </div>
                </div>

                <!-- Right: Auto-Suggested ICD-11 Dual-Coding Panel -->
                <div class="card" style="border-top: 4px solid #0284C7;">
                    <div class="card-header">
                        <div class="card-title">
                            <i class="fa-solid fa-wand-magic-sparkles" style="color: #0284C7;"></i>
                            <span>2. Standardized ICD-11 Mapping Engine</span>
                        </div>
                        <span class="badge badge-verified">Live AI Matcher</span>
                    </div>

                    <div id="enc-mapping-box">
                        <!-- Populated by updateEncounterMappingPreview -->
                    </div>
                </div>
            </div>
        `;

        function updateEncounterMappingPreview(termId) {
            selectedTerm = ayushTerms.find(t => t.id === termId) || ayushTerms[0];
            const candidate = selectedTerm.icd11Candidate;
            const container = document.getElementById('enc-mapping-box');
            if (!container) return;

            container.innerHTML = `
                <div style="background: #F0F9FF; border: 1px solid #BAE6FD; padding: 16px; border-radius: var(--radius-md); margin-bottom: 16px;">
                    <div style="font-size: 0.75rem; uppercase; font-weight: 700; color: #0369A1; margin-bottom: 4px;">Selected Traditional Term</div>
                    <div style="font-size: 1.15rem; font-weight: 800; color: #0369A1;">${selectedTerm.term}</div>
                    <div style="font-size: 0.8rem; color: #475569; margin-top: 2px;">
                        System: <strong>${selectedTerm.system}</strong> | NAMASTE Code: <span class="badge badge-system">${selectedTerm.namasteCode}</span>
                    </div>
                </div>

                <div style="background: #FFFFFF; border: 1px solid var(--color-border); padding: 16px; border-radius: var(--radius-md); margin-bottom: 16px;">
                    <div style="font-size: 0.75rem; uppercase; font-weight: 700; color: #64748B; margin-bottom: 4px;">WHO ICD-11 Candidate Mapping</div>
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                        <span class="badge badge-code" style="font-size: 1rem;">${candidate.code}</span>
                        <strong style="font-size: 0.98rem; color: #1E293B;">${candidate.title}</strong>
                    </div>
                    <div style="font-size: 0.78rem; color: #64748B; font-family: var(--font-mono); margin-bottom: 8px;">
                        ICD-11 TM-2 Module Extension: ${candidate.tm2Code}
                    </div>

                    <div style="margin-bottom: 10px;">
                        <div style="font-size: 0.76rem; font-weight: 700; color: #475569; margin-bottom: 2px;">Algorithmic Match Confidence:</div>
                        ${getConfidenceHtml(candidate.confidence)}
                    </div>

                    <div style="font-size: 0.78rem; color: #475569; background: #F8FAFC; padding: 8px 10px; border-radius: 6px;">
                        <strong>Mapping Rationale:</strong> ${candidate.matchReason}
                    </div>
                </div>

                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-success" id="btn-save-encounter" style="flex: 1;">
                        <i class="fa-solid fa-check"></i> Verify Mapping & Save EHR Record
                    </button>
                </div>
            `;

            document.getElementById('btn-save-encounter')?.addEventListener('click', () => {
                const patientId = document.getElementById('enc-patient-select').value;
                const complaint = document.getElementById('enc-chief-complaint').value || "Routine outpatient visit.";
                const rx = document.getElementById('enc-rx-input').value;

                const patient = window.NAMASTE_DATA.patients.find(p => p.id === patientId);
                if (patient) {
                    patient.activeConditions.unshift({
                        ayushTerm: selectedTerm.term,
                        namasteCode: selectedTerm.namasteCode,
                        icd11Code: candidate.code,
                        icd11Title: candidate.title,
                        confidence: candidate.confidence,
                        status: 'Verified',
                        diagnosedDate: '17 Aug 2026',
                        doctor: 'Dr. Vikram Sharma'
                    });

                    patient.encounters.unshift({
                        id: `ENC-${Math.floor(1000 + Math.random() * 9000)}`,
                        date: '17 Aug 2026',
                        type: 'Outpatient Dual-Coding Encounter',
                        doctor: 'Dr. Vikram Sharma',
                        chiefComplaint: complaint,
                        ayushDiagnosis: selectedTerm.term,
                        icd11Mapping: `${candidate.code} - ${candidate.title}`,
                        confidence: candidate.confidence,
                        status: 'Verified',
                        notes: 'Clinician reviewed and approved auto-suggested ICD-11 candidate.',
                        prescription: rx ? [{ name: rx, dose: 'Standard', freq: 'BD', duration: '7 days', type: 'Prescription' }] : null
                    });

                    showToast(`Encounter saved! Standardized ICD-11 record synced to Patient ${patient.name}`, 'success');
                    state.selectedPatientId = patient.id;
                    state.currentScreen = 'patient-detail';
                    renderScreen('patient-detail');
                }
            });
        }

        const ayushSelect = document.getElementById('enc-ayush-select');
        if (ayushSelect) {
            ayushSelect.addEventListener('change', (e) => {
                updateEncounterMappingPreview(e.target.value);
            });
            updateEncounterMappingPreview(ayushSelect.value);
        }
    }

    // =========================================================================
    // 5. AYUSH TERMINOLOGY EXPLORER (USP DEDICATED SCREEN)
    // =========================================================================
    function renderTerminologyExplorer() {
        const ayushTerms = window.NAMASTE_DATA.ayushTerms;
        let activeSystem = 'All';

        mainContent.innerHTML = `
            <div class="screen-header">
                <div>
                    <h2 class="screen-title">
                        <i class="fa-solid fa-book-medical" style="color: #0284C7;"></i>
                        <span>NAMASTE AYUSH Standard Terminology Explorer</span>
                    </h2>
                    <div class="screen-subtitle">National Ayush Morbidity and Standardized Terminology Electronic Portal Dataset</div>
                </div>
            </div>

            <!-- Filter Controls & Real-Time Search Bar -->
            <div class="card" style="padding: 16px;">
                <div style="display: flex; gap: 16px; align-items: center; justify-content: space-between; flex-wrap: wrap;">
                    <div style="display: flex; gap: 8px;" id="term-system-filters">
                        <button class="btn btn-primary btn-sm btn-sys-filter active" data-sys="All">All Systems</button>
                        <button class="btn btn-secondary btn-sm btn-sys-filter" data-sys="Ayurveda">Ayurveda</button>
                        <button class="btn btn-secondary btn-sm btn-sys-filter" data-sys="Unani">Unani</button>
                        <button class="btn btn-secondary btn-sm btn-sys-filter" data-sys="Siddha">Siddha</button>
                    </div>
                    <div style="flex: 1; max-width: 380px;">
                        <input type="text" id="term-search-input" class="form-control" placeholder="⚡ Search term, Sanskrit name, or code..." value="${state.searchTerm}">
                    </div>
                    <div style="font-size: 0.82rem; color: #64748B;" id="term-count-indicator">
                        Showing <strong>${ayushTerms.length}</strong> Concepts
                    </div>
                </div>
            </div>

            <!-- Terminology Cards Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;" id="terms-grid">
                <!-- Rendered dynamically -->
            </div>
        `;

        function renderTermsGrid() {
            const grid = document.getElementById('terms-grid');
            if (!grid) return;

            const q = (state.searchTerm || '').toLowerCase().trim();
            const filtered = ayushTerms.filter(t => {
                const matchSystem = activeSystem === 'All' || t.system === activeSystem;
                if (!matchSystem) return false;
                if (!q) return true;
                return t.term.toLowerCase().includes(q) ||
                    t.namasteCode.toLowerCase().includes(q) ||
                    t.description.toLowerCase().includes(q) ||
                    t.icd11Candidate.code.toLowerCase().includes(q) ||
                    t.icd11Candidate.title.toLowerCase().includes(q);
            });

            const countIndicator = document.getElementById('term-count-indicator');
            if (countIndicator) {
                countIndicator.innerHTML = `Showing <strong>${filtered.length}</strong> Concepts`;
            }

            if (filtered.length === 0) {
                grid.innerHTML = `<div style="grid-column: 1 / -1; background: white; padding: 30px; text-align: center; border-radius: var(--radius-md); border: 1px solid var(--color-border); color: #64748B;">No terminology concepts found matching "${q}"</div>`;
                return;
            }

            grid.innerHTML = filtered.map(term => `
                <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <span class="badge badge-system">${term.system}</span>
                            <span class="badge badge-code">${term.namasteCode}</span>
                        </div>
                        <h3 style="font-size: 1.15rem; font-weight: 800; color: #0284C7; margin-bottom: 6px;">${term.term}</h3>
                        <p style="font-size: 0.82rem; color: #475569; margin-bottom: 12px; line-height: 1.4;">${term.description}</p>
                        
                        <div style="background: #F8FAFC; padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); margin-bottom: 12px;">
                            <div style="font-size: 0.72rem; font-weight: 700; color: #64748B; uppercase; margin-bottom: 4px;">Candidate ICD-11 Dual Code</div>
                            <div style="font-size: 0.86rem; font-weight: 700; color: #1E293B;">
                                <span class="badge badge-code">${term.icd11Candidate.code}</span> ${term.icd11Candidate.title}
                            </div>
                        </div>
                    </div>

                    <div style="display: flex; gap: 8px; margin-top: 12px;">
                        <button class="btn btn-secondary btn-sm btn-inspect-term" data-id="${term.id}" style="flex: 1;">
                            <i class="fa-solid fa-circle-info"></i> View Mapping Rationale
                        </button>
                    </div>
                </div>
            `).join('');

            document.querySelectorAll('.btn-inspect-term').forEach(btn => {
                btn.addEventListener('click', () => {
                    state.selectedAyushTermId = btn.getAttribute('data-id');
                    state.currentScreen = 'mapping-detail';
                    renderScreen('mapping-detail');
                });
            });
        }

        const termSearchInput = document.getElementById('term-search-input');
        if (termSearchInput) {
            termSearchInput.addEventListener('input', (e) => {
                state.searchTerm = e.target.value;
                renderTermsGrid();
            });
        }

        document.querySelectorAll('.btn-sys-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.btn-sys-filter').forEach(b => {
                    b.classList.remove('btn-primary');
                    b.classList.add('btn-secondary');
                });
                btn.classList.remove('btn-secondary');
                btn.classList.add('btn-primary');
                activeSystem = btn.getAttribute('data-sys');
                renderTermsGrid();
            });
        });

        renderTermsGrid();
    }

    // =========================================================================
    // 6. MAPPING DETAIL & VERIFICATION WORKSPACE
    // =========================================================================
    function renderMappingDetail(termId) {
        const ayushTerms = window.NAMASTE_DATA.ayushTerms;
        const term = ayushTerms.find(t => t.id === termId) || ayushTerms[0];
        const cand = term.icd11Candidate;

        mainContent.innerHTML = `
            <div class="screen-header">
                <div>
                    <button class="btn btn-secondary btn-sm" id="btn-back-to-terms" style="margin-bottom: 8px;">
                        <i class="fa-solid fa-arrow-left"></i> Back to Terminology
                    </button>
                    <h2 class="screen-title">
                        <i class="fa-solid fa-code-compare" style="color: #0284C7;"></i>
                        <span>AYUSH → ICD-11 Dual Coding Deep-Dive Analysis</span>
                    </h2>
                    <div class="screen-subtitle">Clinical semantic correlation & verification audit workbench</div>
                </div>
            </div>

            <!-- Dual Mapping Header Banner -->
            <div class="card" style="background: linear-gradient(135deg, #0369A1 0%, #0284C7 100%); color: white;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <div style="font-size: 0.76rem; text-transform: uppercase; font-weight: 700; opacity: 0.85;">Traditional AYUSH Term</div>
                        <div style="font-size: 1.5rem; font-weight: 800;">${term.term}</div>
                        <div style="font-size: 0.85rem; opacity: 0.9;">NAMASTE Code: ${term.namasteCode} | System: ${term.system}</div>
                    </div>
                    <div style="font-size: 2rem; opacity: 0.6;"><i class="fa-solid fa-arrow-right-arrow-left"></i></div>
                    <div style="text-align: right;">
                        <div style="font-size: 0.76rem; text-transform: uppercase; font-weight: 700; opacity: 0.85;">Standardized WHO ICD-11 Concept</div>
                        <div style="font-size: 1.5rem; font-weight: 800;">${cand.code} — ${cand.title}</div>
                        <div style="font-size: 0.85rem; opacity: 0.9;">TM-2 Extension: ${cand.tm2Code}</div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
                <!-- Left Column: Why This Mapping? Evidence Breakdown -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">
                            <i class="fa-solid fa-microscope" style="color: #0284C7;"></i>
                            <span>"Why This Mapping?" — Semantic & Clinical Rationale</span>
                        </div>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <h4 style="font-size: 0.9rem; font-weight: 700; color: #334155; margin-bottom: 6px;">1. Algorithmic Confidence Metric</h4>
                        ${getConfidenceHtml(cand.confidence)}
                        <p style="font-size: 0.78rem; color: #64748B; margin-top: 4px;">Computed via NLP transformer fine-tuned on Ministry of Ayush & WHO Chapter 26 datasets.</p>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <h4 style="font-size: 0.9rem; font-weight: 700; color: #334155; margin-bottom: 6px;">2. Matched Clinical Manifestations</h4>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${term.symptoms.map(s => `<span class="badge badge-system"><i class="fa-solid fa-check" style="color: #10B981;"></i> ${s}</span>`).join('')}
                        </div>
                    </div>

                    <div>
                        <h4 style="font-size: 0.9rem; font-weight: 700; color: #334155; margin-bottom: 6px;">3. Expert Rationale</h4>
                        <div style="background: #F8FAFC; padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); font-size: 0.85rem; color: #334155;">
                            ${cand.matchReason}
                        </div>
                    </div>
                </div>

                <!-- Right Column: Clinician Verification Box -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">
                            <i class="fa-solid fa-user-check" style="color: #16A34A;"></i>
                            <span>Clinician Verification Panel</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Current Audit Status</label>
                        <div>
                            <span class="badge ${cand.status === 'Verified' ? 'badge-verified' : 'badge-pending'}" style="font-size: 0.9rem; padding: 6px 12px;">
                                ${cand.status === 'Verified' ? '<i class="fa-solid fa-circle-check"></i> Verified by Clinician' : '<i class="fa-solid fa-clock"></i> Pending Clinician Review'}
                            </span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Verification Audit Note</label>
                        <textarea class="form-control" id="audit-note-input" rows="3" placeholder="Enter clinical notes or endoscopy/lab validation reasoning..."></textarea>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <button class="btn btn-success" id="btn-verify-mapping">
                            <i class="fa-solid fa-check"></i> Confirm & Approve Mapping
                        </button>
                        <button class="btn btn-warning" id="btn-modify-mapping">
                            <i class="fa-solid fa-pen"></i> Modify ICD-11 Code
                        </button>
                        <button class="btn btn-danger" id="btn-reject-mapping">
                            <i class="fa-solid fa-xmark"></i> Reject Candidate Mapping
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('btn-back-to-terms')?.addEventListener('click', () => {
            state.currentScreen = 'terminology';
            renderScreen('terminology');
        });

        document.getElementById('btn-verify-mapping')?.addEventListener('click', () => {
            cand.status = 'Verified';
            cand.verifiedBy = window.NAMASTE_DATA.currentUser.name;
            cand.verifiedAt = new Date().toLocaleString();
            showToast(`Approved dual coding for ${term.term}! Logged in audit trail.`, 'success');
            renderMappingDetail(termId);
        });

        document.getElementById('btn-reject-mapping')?.addEventListener('click', () => {
            cand.status = 'Rejected';
            showToast(`Rejected candidate mapping for ${term.term}.`, 'info');
            renderMappingDetail(termId);
        });
    }

    // =========================================================================
    // 7. VERIFICATION QUEUE
    // =========================================================================
    function renderVerificationQueue() {
        const queue = window.NAMASTE_DATA.verificationQueue;

        mainContent.innerHTML = `
            <div class="screen-header">
                <div>
                    <h2 class="screen-title">
                        <i class="fa-solid fa-circle-check" style="color: #0284C7;"></i>
                        <span>Clinician Verification Queue</span>
                    </h2>
                    <div class="screen-subtitle">Pending AYUSH → ICD-11 mapping validations awaiting doctor approval</div>
                </div>
            </div>

            <div class="card">
                <div class="table-responsive">
                    <table class="clinical-table">
                        <thead>
                            <tr>
                                <th>Queue ID</th>
                                <th>Patient Name</th>
                                <th>AYUSH Diagnosis</th>
                                <th>Suggested ICD-11 Code</th>
                                <th>Match Score</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${queue.map(item => `
                                <tr>
                                    <td><strong style="color: #0284C7;">${item.id}</strong></td>
                                    <td><strong>${item.patientName}</strong> (${item.patientId})</td>
                                    <td><span class="badge badge-system">${item.ayushTerm}</span></td>
                                    <td><span class="badge badge-code">${item.icd11Suggested}</span></td>
                                    <td>${getConfidenceHtml(item.confidence)}</td>
                                    <td>
                                        <span class="badge ${item.status === 'Verified' ? 'badge-verified' : 'badge-pending'}">
                                            ${item.status}
                                        </span>
                                    </td>
                                    <td>
                                        ${item.status === 'Pending' ? `
                                            <button class="btn btn-success btn-sm btn-queue-approve" data-id="${item.id}">
                                                <i class="fa-solid fa-check"></i> Approve
                                            </button>
                                        ` : `
                                            <span style="font-size: 0.8rem; color: #16A34A; font-weight: 700;">Verified</span>
                                        `}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.querySelectorAll('.btn-queue-approve').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const target = queue.find(q => q.id === id);
                if (target) {
                    target.status = 'Verified';
                    updateQueueBadge();
                    showToast(`Verified ${target.ayushTerm} → ${target.icd11Suggested}`, 'success');
                    renderVerificationQueue();
                }
            });
        });
    }

    // =========================================================================
    // 8. CLINICAL ANALYTICS
    // =========================================================================
    function renderAnalytics() {
        const stats = window.NAMASTE_DATA.stats;

        mainContent.innerHTML = `
            <div class="screen-header">
                <div>
                    <h2 class="screen-title">
                        <i class="fa-solid fa-chart-line" style="color: #0284C7;"></i>
                        <span>NAMASTE – ICD-11 Dual-Coding Analytics</span>
                    </h2>
                    <div class="screen-subtitle">Clinical adoption metrics, mapping accuracy distribution, and terminology utilization</div>
                </div>
            </div>

            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-icon"><i class="fa-solid fa-database"></i></div>
                    <div>
                        <div class="metric-value">${stats.totalAyushTermsRecorded}</div>
                        <div class="metric-label">Total Terms Recorded</div>
                    </div>
                </div>

                <div class="metric-card">
                    <div class="metric-icon" style="background: #E0F2FE; color: #0284C7;"><i class="fa-solid fa-link"></i></div>
                    <div>
                        <div class="metric-value">${stats.mappedToIcd11}</div>
                        <div class="metric-label">Mapped to WHO ICD-11</div>
                    </div>
                </div>

                <div class="metric-card">
                    <div class="metric-icon" style="background: #DCFCE7; color: #16A34A;"><i class="fa-solid fa-circle-check"></i></div>
                    <div>
                        <div class="metric-value">${stats.verifiedMappings}</div>
                        <div class="metric-label">Clinician Verified (78%)</div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <!-- Status Breakdown Chart -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">
                            <i class="fa-solid fa-chart-pie"></i>
                            <span>Dual Coding Verification Status Breakdown</span>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 14px; padding: 10px 0;">
                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 4px;">
                                <span>Verified Mappings</span>
                                <span>780 (78%)</span>
                            </div>
                            <div style="height: 10px; background: #E2E8F0; border-radius: 5px; overflow: hidden;">
                                <div style="width: 78%; height: 100%; background: #16A34A;"></div>
                            </div>
                        </div>

                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 4px;">
                                <span>Pending Doctor Verification</span>
                                <span>154 (15%)</span>
                            </div>
                            <div style="height: 10px; background: #E2E8F0; border-radius: 5px; overflow: hidden;">
                                <div style="width: 15%; height: 100%; background: #D97706;"></div>
                            </div>
                        </div>

                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 4px;">
                                <span>Rejected / Modified</span>
                                <span>32 (3%)</span>
                            </div>
                            <div style="height: 10px; background: #E2E8F0; border-radius: 5px; overflow: hidden;">
                                <div style="width: 3%; height: 100%; background: #DC2626;"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- AYUSH System Distribution -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">
                            <i class="fa-solid fa-layer-group"></i>
                            <span>System Distribution (Ayurveda, Unani, Siddha)</span>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 14px; padding: 10px 0;">
                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 4px;">
                                <span>Ayurveda (65%)</span>
                                <span>811 Terms</span>
                            </div>
                            <div style="height: 10px; background: #E2E8F0; border-radius: 5px; overflow: hidden;">
                                <div style="width: 65%; height: 100%; background: #0284C7;"></div>
                            </div>
                        </div>

                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 4px;">
                                <span>Unani (20%)</span>
                                <span>250 Terms</span>
                            </div>
                            <div style="height: 10px; background: #E2E8F0; border-radius: 5px; overflow: hidden;">
                                <div style="width: 20%; height: 100%; background: #0EA5E9;"></div>
                            </div>
                        </div>

                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 4px;">
                                <span>Siddha (15%)</span>
                                <span>187 Terms</span>
                            </div>
                            <div style="height: 10px; background: #E2E8F0; border-radius: 5px; overflow: hidden;">
                                <div style="width: 15%; height: 100%; background: #38BDF8;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // =========================================================================
    // 9. DEVELOPER & LIVE API PLAYGROUND PORTAL
    // =========================================================================
    function renderDeveloperPortal() {
        const endpoints = window.NAMASTE_DATA.apiEndpoints;
        const currentEndpoint = endpoints.find(e => e.id === state.selectedApiId) || endpoints[0];

        mainContent.innerHTML = `
            <div class="screen-header">
                <div>
                    <h2 class="screen-title">
                        <i class="fa-solid fa-code" style="color: #0284C7;"></i>
                        <span>Developer & Integration API Portal</span>
                    </h2>
                    <div class="screen-subtitle">RESTful APIs for external EHR systems to integrate NAMASTE search & WHO ICD-11 dual coding</div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px;">
                <!-- Left: Endpoint Selector List -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">
                            <i class="fa-solid fa-list-check"></i>
                            <span>Integration APIs</span>
                        </div>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        ${endpoints.map(ep => `
                            <div class="api-item-btn ${ep.id === state.selectedApiId ? 'active' : ''}" data-id="${ep.id}"
                                style="padding: 10px 12px; border-radius: var(--radius-sm); border: 1px solid ${ep.id === state.selectedApiId ? '#0284C7' : 'var(--color-border)'}; background: ${ep.id === state.selectedApiId ? '#F0F9FF' : '#FFFFFF'}; cursor: pointer;">
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
                                    <span class="badge ${ep.method === 'GET' ? 'badge-verified' : 'badge-code'}">${ep.method}</span>
                                    <strong style="font-size: 0.82rem; font-family: var(--font-mono);">${ep.path}</strong>
                                </div>
                                <div style="font-size: 0.76rem; color: #64748B;">${ep.title}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Right: API Sandbox & Explorer -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">
                            <i class="fa-solid fa-terminal"></i>
                            <span>Interactive API Explorer</span>
                        </div>
                        <button class="btn btn-primary btn-sm" id="btn-run-api-test">
                            <i class="fa-solid fa-paper-plane"></i> Send Test Request
                        </button>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <h3 style="font-size: 1.1rem; font-weight: 800; color: #1E293B; margin-bottom: 4px;">${currentEndpoint.title}</h3>
                        <p style="font-size: 0.84rem; color: #475569;">${currentEndpoint.description}</p>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Request Endpoint URL</label>
                        <div style="display: flex; gap: 8px;">
                            <span class="badge badge-verified" style="font-size: 0.9rem; padding: 8px 12px;">${currentEndpoint.method}</span>
                            <input type="text" class="form-control" style="font-family: var(--font-mono);" value="https://api.ayush.gov.in${currentEndpoint.sampleRequest || currentEndpoint.path}" readonly>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Live Response Inspector (JSON)</label>
                        <pre class="code-block" id="api-response-viewer">${JSON.stringify(currentEndpoint.sampleResponse, null, 2)}</pre>
                    </div>
                </div>
            </div>
        `;

        document.querySelectorAll('.api-item-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                state.selectedApiId = btn.getAttribute('data-id');
                renderDeveloperPortal();
            });
        });

        document.getElementById('btn-run-api-test')?.addEventListener('click', () => {
            const viewer = document.getElementById('api-response-viewer');
            if (viewer) {
                const resp = Object.assign({}, currentEndpoint.sampleResponse, {
                    timestamp: new Date().toISOString(),
                    executionTimeMs: `${Math.floor(6 + Math.random() * 8)} ms`,
                    status: "HTTP 200 OK (Instant)"
                });
                viewer.innerText = JSON.stringify(resp, null, 2);
                showToast(`🚀 API Call Succeeded: HTTP 200 OK (${resp.executionTimeMs})`, 'success');
            }
        });
    }

    // =========================================================================
    // 10. HOSPITAL SETTINGS
    // =========================================================================
    function renderSettings() {
        mainContent.innerHTML = `
            <div class="screen-header">
                <div>
                    <h2 class="screen-title">
                        <i class="fa-solid fa-gear" style="color: #0284C7;"></i>
                        <span>System & ABDM Integration Settings</span>
                    </h2>
                    <div class="screen-subtitle">Manage NAMASTE terminology dataset versions, ABDM Gateway nodes, and RBAC permissions</div>
                </div>
            </div>

            <div class="card" style="max-width: 650px;">
                <div class="form-group">
                    <label class="form-label">NAMASTE Terminology Dataset Version</label>
                    <input type="text" class="form-control" value="NAMASTE National Ayush Morbidity v2.4 (2026-06 Release)" readonly>
                </div>

                <div class="form-group">
                    <label class="form-label">WHO ICD-11 Chapter 26 Module</label>
                    <input type="text" class="form-control" value="WHO ICD-11 MMS 2026-01 (TM-2 Dual Coding Enabled)" readonly>
                </div>

                <div class="form-group">
                    <label class="form-label">ABDM Health Repository ID (HIP Code)</label>
                    <input type="text" class="form-control" value="IN0710042918 - National Institute of Ayurveda EHR Gateway">
                </div>

                <button class="btn btn-primary" onclick="alert('Configuration saved successfully!')">
                    <i class="fa-solid fa-floppy-disk"></i> Save Configuration
                </button>
            </div>
        `;
    }
});
