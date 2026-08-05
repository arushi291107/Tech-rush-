/**
 * CventSphere - Event Management & Volunteer Coordination Engine
 * Pure Vanilla JS Application State & View Controller
 */

const state = {
    currentAttendee: null,
    currentVolunteer: null,
    currentOrganizer: null,

    activePortal: 'attendee', // 'attendee' or 'staff'
    activeStaffTab: 'volunteer', // 'volunteer' or 'organizer'

    notifications: [],
    events: [
        {
            id: 'ev-1',
            title: 'Annual Tech Fest & Hackathon 2026',
            category: 'Tech',
            date: '2026-09-15 @ 10:00 AM',
            venue: 'Main Auditorium, Block B',
            capacity: 500,
            sold: 440,
            volunteersAssigned: 12,
            status: 'Live',
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
            description: 'Campus technical fest featuring 24-hr hackathons, AI keynotes, and coding arenas.'
        },
        {
            id: 'ev-2',
            title: 'UX Design System Expo & Masterclass',
            category: 'Design',
            date: '2026-10-02 @ 11:30 AM',
            venue: 'Design Studio Hall 3',
            capacity: 300,
            sold: 220,
            volunteersAssigned: 8,
            status: 'Published',
            image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=80',
            description: 'Explore UI design tokens, component architecture, and design showcases.'
        },
        {
            id: 'ev-3',
            title: 'Founders Summit & Pitch Arena',
            category: 'Business',
            date: '2026-10-20 @ 09:00 AM',
            venue: 'Convention Hall A',
            capacity: 400,
            sold: 380,
            volunteersAssigned: 10,
            status: 'Published',
            image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80',
            description: 'Connecting student founders with VC mentors, angel investors, and incubation grants.'
        }
    ],
    volunteerTeams: [],
    volunteerTasks: [
        { id: 't1', text: 'Set up Registration Desk Laptops & QR Gate Scanners', done: false },
        { id: 't2', text: 'Verify VIP Speaker Hospitality Kits & Lounges', done: false },
        { id: 't3', text: 'Conduct Stage Microphone & Projector Sound Check', done: false },
        { id: 't4', text: 'Assist Gate Security with QR Entry & Exit Telemetry', done: false }
    ],
    attendeesRoster: [],
    myRegistrations: [],
    activeCategoryFilter: 'all',
    selectedEventForReg: null
};

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    showAttendeePortal();
    renderAttendeeEvents();
    renderMyRegistrations();
    renderVolunteerDashboard();
    renderOrganizerDashboard();
});

// PORTAL SWITCHERS
function showAttendeePortal() {
    state.activePortal = 'attendee';
    document.getElementById('attendee-portal-view').classList.add('active');
    document.getElementById('staff-portal-view').classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showStaffPortal(targetTab = 'volunteer') {
    state.activePortal = 'staff';
    document.getElementById('attendee-portal-view').classList.remove('active');
    document.getElementById('staff-portal-view').classList.add('active');

    switchStaffTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchStaffTab(tabName) {
    state.activeStaffTab = tabName;

    const btnVol = document.getElementById('big-tab-volunteer');
    const btnOrg = document.getElementById('big-tab-organizer');
    const contentVol = document.getElementById('staff-volunteer-content');
    const contentOrg = document.getElementById('staff-organizer-content');

    if (tabName === 'volunteer') {
        btnVol.classList.add('active');
        btnOrg.classList.remove('active');
        contentVol.classList.add('active');
        contentOrg.classList.remove('active');
    } else {
        btnOrg.classList.add('active');
        btnVol.classList.remove('active');
        contentOrg.classList.add('active');
        contentVol.classList.remove('active');
    }
}

// ATTENDEE LOGIN HANDLER
function handleAttendeeLogin(e) {
    e.preventDefault();
    const name  = document.getElementById('att-name-input').value.trim();
    const email = document.getElementById('att-email-input').value.trim();

    if (!name || !email) return;

    state.currentAttendee = { name, email };

    // Update nav chip
    document.getElementById('user-chip-name').textContent = `${name} (Attendee)`;

    // Replace the auth box with a welcome card — gives clear visual feedback
    const authBox = document.querySelector('.attendee-auth-box');
    if (authBox) {
        authBox.innerHTML = `
            <div style="text-align:center; padding: 28px 24px;">
                <div style="width:64px;height:64px;border-radius:50%;background:rgba(52,211,153,0.15);
                            border:2px solid #34d399;display:flex;align-items:center;justify-content:center;
                            margin:0 auto 16px;font-size:1.8rem;color:#34d399;">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <h3 style="font-size:1.15rem;font-weight:800;margin-bottom:4px;">Welcome, ${name}!</h3>
                <p style="font-size:0.85rem;color:#94a3b8;margin-bottom:20px;">${email}</p>
                <div style="background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.25);
                            border-radius:8px;padding:10px 14px;font-size:0.82rem;color:#34d399;margin-bottom:20px;">
                    <i class="fa-solid fa-shield-check"></i> Attendee session active
                </div>
                <button class="btn btn-outline-sm" style="width:100%;font-size:0.85rem;"
                        onclick="attendeeLogout()">
                    <i class="fa-solid fa-right-from-bracket"></i> Sign Out
                </button>
            </div>
        `;
    }

    // Add a welcome notification
    state.notifications.unshift({ text: `Signed in as ${name}. Browse events below!`, time: 'Just now' });
    renderNotifications();

    showToast(`Welcome, ${name}! Browse events below.`, 'success');

    // Scroll smoothly to the events section
    setTimeout(() => {
        const eventsSection = document.getElementById('attendee-discover-tab');
        if (eventsSection) eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
}

function attendeeLogout() {
    state.currentAttendee = null;
    document.getElementById('user-chip-name').textContent = 'Attendee Portal';

    // Restore the login form
    const authBox = document.querySelector('.attendee-auth-box');
    if (authBox) {
        authBox.innerHTML = `
            <div class="auth-box-header">
                <h3><i class="fa-solid fa-right-to-bracket text-emerald"></i> Attendee Sign In</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Sign in to access your tickets and digital passes</p>
            </div>
            <form id="attendee-login-form" onsubmit="handleAttendeeLogin(event)">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" id="att-name-input" required placeholder="Enter your full name">
                </div>
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" id="att-email-input" required placeholder="Enter your email address">
                </div>
                <div class="form-group">
                    <label>Password / Access Code</label>
                    <input type="password" id="att-pass-input" required placeholder="••••••••">
                </div>
                <button type="submit" class="btn btn-emerald" style="width: 100%;">
                    Sign In as Attendee <i class="fa-solid fa-arrow-right"></i>
                </button>
            </form>
        `;
    }
    showToast('Signed out of Attendee Portal', 'info');
}

// VOLUNTEER AUTH SUB-TABS & HANDLERS
function switchVolAuthSubTab(subTab) {
    const btnLogin = document.getElementById('vol-tab-login-btn');
    const btnSignup = document.getElementById('vol-tab-signup-btn');
    const formLogin = document.getElementById('vol-login-form');
    const formSignup = document.getElementById('vol-signup-form');

    if (subTab === 'login') {
        btnLogin.classList.add('active');
        btnSignup.classList.remove('active');
        formLogin.style.display = 'block';
        formSignup.style.display = 'none';
    } else {
        btnSignup.classList.add('active');
        btnLogin.classList.remove('active');
        formSignup.style.display = 'block';
        formLogin.style.display = 'none';
    }
}

function handleVolLogin(e) {
    e.preventDefault();
    const email = document.getElementById('vol-login-email').value;
    const name = email.split('@')[0].replace('.', ' ');

    state.currentVolunteer = { name, email, role: 'Volunteer Crew' };

    document.getElementById('vol-profile-name').textContent = name;
    document.getElementById('vol-profile-email').textContent = email;
    document.getElementById('volunteer-auth-card').style.display = 'none';
    document.getElementById('volunteer-dashboard-card').style.display = 'block';

    showToast(`Signed in as Volunteer: ${name}`, 'success');
    renderVolunteerDashboard();
}

function handleVolSignup(e) {
    e.preventDefault();
    const name = document.getElementById('vol-signup-name').value;
    const email = document.getElementById('vol-signup-email').value;
    const role = document.getElementById('vol-signup-role').value;

    state.currentVolunteer = { name, email, role };

    document.getElementById('vol-profile-name').textContent = name;
    document.getElementById('vol-profile-email').textContent = email;
    document.getElementById('vol-profile-role').innerHTML = `<i class="fa-solid fa-shield-halved"></i> ${role}`;
    document.getElementById('volunteer-auth-card').style.display = 'none';
    document.getElementById('volunteer-dashboard-card').style.display = 'block';

    showToast(`Volunteer Account Created! Welcome, ${name}`, 'success');
    renderVolunteerDashboard();
}

function volLogout() {
    state.currentVolunteer = null;
    document.getElementById('volunteer-dashboard-card').style.display = 'none';
    document.getElementById('volunteer-auth-card').style.display = 'block';
    showToast('Logged out of Volunteer Portal', 'info');
}

// ORGANISER AUTH SUB-TABS & HANDLERS
function switchOrgAuthSubTab(subTab) {
    const btnLogin = document.getElementById('org-tab-login-btn');
    const btnSignup = document.getElementById('org-tab-signup-btn');
    const formLogin = document.getElementById('org-login-form');
    const formSignup = document.getElementById('org-signup-form');

    if (subTab === 'login') {
        btnLogin.classList.add('active');
        btnSignup.classList.remove('active');
        formLogin.style.display = 'block';
        formSignup.style.display = 'none';
    } else {
        btnSignup.classList.add('active');
        btnLogin.classList.remove('active');
        formSignup.style.display = 'block';
        formLogin.style.display = 'none';
    }
}

function handleOrgLogin(e) {
    e.preventDefault();
    const email = document.getElementById('org-login-email').value;
    const name = email.split('@')[0].replace('.', ' ');

    state.currentOrganizer = { name, email };

    document.getElementById('organizer-auth-card').style.display = 'none';
    document.getElementById('organizer-dashboard-card').style.display = 'block';

    showToast(`Signed in to Organiser Studio: ${name}`, 'success');
    renderOrganizerDashboard();
}

function handleOrgSignup(e) {
    e.preventDefault();
    const orgName = document.getElementById('org-signup-orgname').value;
    const contact = document.getElementById('org-signup-contact').value;
    const email = document.getElementById('org-signup-email').value;

    state.currentOrganizer = { name: contact, orgName, email };

    document.getElementById('organizer-auth-card').style.display = 'none';
    document.getElementById('organizer-dashboard-card').style.display = 'block';

    showToast(`Organiser Account Registered for ${orgName}!`, 'success');
    renderOrganizerDashboard();
}

function orgLogout() {
    state.currentOrganizer = null;
    document.getElementById('organizer-dashboard-card').style.display = 'none';
    document.getElementById('organizer-auth-card').style.display = 'block';
    showToast('Logged out of Organiser Studio', 'info');
}

// ATTENDEE EVENTS DISCOVERY & REGISTRATION
function switchAttendeeSubTab(tabName) {
    const btnDiscover = document.getElementById('btn-tab-discover');
    const btnTickets = document.getElementById('btn-tab-my-tickets');
    const tabDiscover = document.getElementById('attendee-discover-tab');
    const tabTickets = document.getElementById('attendee-tickets-tab');

    if (tabName === 'discover') {
        btnDiscover.classList.add('active');
        btnTickets.classList.remove('active');
        tabDiscover.classList.add('active');
        tabTickets.classList.remove('active');
    } else {
        btnTickets.classList.add('active');
        btnDiscover.classList.remove('active');
        tabTickets.classList.add('active');
        tabDiscover.classList.remove('active');
    }
}

function renderAttendeeEvents() {
    const grid = document.getElementById('events-display-grid');
    if (!grid) return;

    const searchVal = (document.getElementById('event-search-input')?.value || '').toLowerCase();

    const filtered = state.events.filter(ev => {
        const matchesCategory = state.activeCategoryFilter === 'all' || ev.category === state.activeCategoryFilter;
        const matchesSearch = ev.title.toLowerCase().includes(searchVal) || ev.venue.toLowerCase().includes(searchVal);
        return matchesCategory && matchesSearch;
    });

    grid.innerHTML = filtered.map(ev => {
        const remaining = ev.capacity - ev.sold;
        const isSoldOut = remaining <= 0;

        return `
            <div class="event-card">
                <div class="event-card-banner" style="background-image: linear-gradient(to bottom, rgba(11,15,23,0.3), rgba(11,15,23,0.9)), url('${ev.image}');">
                    <span class="banner-cat-tag">${ev.category}</span>
                    <span class="banner-price-tag">Free Entry</span>
                </div>
                <div class="event-card-body">
                    <h3>${ev.title}</h3>
                    <p>${ev.description}</p>
                    <div class="event-meta-info">
                        <span><i class="fa-regular fa-calendar text-emerald"></i> ${ev.date}</span>
                        <span><i class="fa-solid fa-location-dot text-purple"></i> ${ev.venue}</span>
                        <span><i class="fa-solid fa-chair text-cyan"></i> Seats: <strong>${ev.capacity} max</strong> (${remaining} left)</span>
                    </div>
                    <div class="event-card-footer">
                        <button class="btn btn-emerald" style="width: 100%;" ${isSoldOut ? 'disabled style="opacity:0.5;"' : ''} onclick="openCollegeRegModal('${ev.id}')">
                            <i class="fa-solid fa-qrcode"></i> ${isSoldOut ? 'Registration Cap Reached' : 'Register for Event'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterEventsByCategory(cat, btn) {
    state.activeCategoryFilter = cat;
    if (btn) {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
    renderAttendeeEvents();
}

function filterEvents() {
    renderAttendeeEvents();
}

function openCollegeRegModal(eventId) {
    const ev = state.events.find(e => e.id === eventId);
    if (!ev) return;

    state.selectedEventForReg = ev;
    document.getElementById('reg-event-title').value = ev.title;

    const info = document.getElementById('reg-event-header-info');
    info.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 14px; border-radius: var(--radius-md); margin-bottom: 18px;">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--emerald-primary);">${ev.category} &bull; ${ev.date}</div>
            <h4 style="font-size: 1.15rem; font-weight: 800; margin: 2px 0;">${ev.title}</h4>
            <div style="font-size: 0.85rem; color: var(--text-muted);"><i class="fa-solid fa-location-dot"></i> ${ev.venue}</div>
        </div>
    `;

    if (state.currentAttendee) {
        document.getElementById('reg-name').value = state.currentAttendee.name || '';
        document.getElementById('reg-email').value = state.currentAttendee.email || '';
    }

    openModal('collegeRegistrationModal');
}

function handleCollegeRegSubmit(e) {
    e.preventDefault();
    if (!state.selectedEventForReg) return;

    const ev = state.selectedEventForReg;
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const phone = document.getElementById('reg-phone').value;
    const institution = document.getElementById('reg-institution').value;

    const uniqueQr = `CVT-ATT-${Math.floor(1000 + Math.random() * 9000)}`;
    ev.sold += 1;

    state.myRegistrations.unshift({
        qrCode: uniqueQr,
        eventId: ev.id,
        eventName: ev.title,
        date: ev.date,
        venue: ev.venue,
        email,
        institution,
        gateStatus: 'Not Entered'
    });

    state.attendeesRoster.unshift({
        qrCode: uniqueQr,
        name,
        email,
        institution,
        event: ev.title,
        gateStatus: 'Not Entered',
        checkInTime: '--'
    });

    renderAttendeeEvents();
    renderMyRegistrations();
    renderOrganizerDashboard();
    closeModal('collegeRegistrationModal');
    switchAttendeeSubTab('my-tickets');
    showToast(`Registered! Issued Digital Gate Pass #${uniqueQr}`, 'success');
}

function renderMyRegistrations() {
    const container = document.getElementById('my-tickets-container');
    const countSpan = document.getElementById('my-tickets-count');
    if (!container) return;

    if (countSpan) countSpan.textContent = state.myRegistrations.length;

    if (state.myRegistrations.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-dim); padding: 30px;">No event passes registered yet. Browse events to register!</div>`;
        return;
    }

    container.innerHTML = state.myRegistrations.map(r => `
        <div class="ticket-pass-card">
            <div class="ticket-header-row">
                <span class="badge-emerald"><i class="fa-solid fa-ticket"></i> Verified Gate Pass</span>
                <span class="ticket-code">${r.qrCode}</span>
            </div>
            <h3>${r.eventName}</h3>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">
                <div><i class="fa-regular fa-calendar text-emerald"></i> ${r.date}</div>
                <div><i class="fa-solid fa-location-dot text-purple"></i> ${r.venue}</div>
            </div>
            <div class="ticket-qr-stub" style="display: flex; gap: 16px; align-items: center; background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px;">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${r.qrCode}&color=0f172a&bgcolor=34d399" alt="QR Code" style="width: 80px; height: 80px; border-radius: 6px; border: 2px solid #34d399;" />
                <div>
                    <div style="font-weight: 700; color: #FFF;">Unique Entry Pass</div>
                    <div style="font-size: 0.75rem; color: var(--text-dim);">Scan at gate entrance</div>
                </div>
            </div>
            <div style="display: flex; gap: 8px; margin-top: 16px;">
                <button class="btn btn-outline-sm" style="flex:1;" onclick="openViewPassModal('${r.qrCode}')">
                    <i class="fa-solid fa-qrcode"></i> View QR Code
                </button>
                <button class="btn btn-cyan" style="flex:1;" onclick="openCertificateModal('${r.qrCode}')">
                    <i class="fa-solid fa-award"></i> E-Certificate
                </button>
            </div>
        </div>
    `).join('');
}

function openViewPassModal(qrCode) {
    const r = state.myRegistrations.find(item => item.qrCode === qrCode);
    if (!r) return;

    const body = document.getElementById('view-ticket-pass-body');
    body.innerHTML = `
        <div style="text-align: center; padding: 10px 0;">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--emerald-primary); text-transform: uppercase;">Digital Gate Entry Pass</div>
            <h2 style="font-size: 1.4rem; font-weight: 800; margin: 8px 0;">${r.eventName}</h2>
            <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 16px;">${r.date} &bull; ${r.venue}</div>

            <div style="background: #FFF; padding: 20px; border-radius: var(--radius-md); display: inline-block; margin-bottom: 16px;">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${r.qrCode}" alt="Large QR Code" style="width: 200px; height: 200px;" />
            </div>
            <div style="font-family: monospace; font-size: 1.2rem; font-weight: 800; color: var(--emerald-primary);">${r.qrCode}</div>
        </div>
    `;
    openModal('viewTicketModal');
}

function openCertificateModal(qrCode) {
    const r = state.myRegistrations.find(item => item.qrCode === qrCode);
    if (!r) return;

    const attendeeName = state.currentAttendee ? state.currentAttendee.name : 'Verified Participant';

    const body = document.getElementById('certificate-body');
    body.innerHTML = `
        <div style="border: 4px double #38BDF8; padding: 30px; border-radius: 8px;">
            <div style="font-size: 0.85rem; letter-spacing: 2px; color: #38BDF8; text-transform: uppercase; margin-bottom: 10px;">Official Certificate of Participation</div>
            <h1 style="font-size: 2rem; font-weight: 800; font-family: 'Plus Jakarta Sans'; margin-bottom: 10px;">CVENTSPHERE PORTAL</h1>
            <p style="font-size: 0.95rem; color: var(--text-muted);">Awarded to</p>
            <h2 style="font-size: 1.8rem; font-weight: 800; color: #FBBF24; margin: 12px 0;">${attendeeName}</h2>
            <p style="margin: 16px 0; font-size: 1rem;">For successful completion of <strong>${r.eventName}</strong></p>
        </div>
    `;
    openModal('certificateModal');
}

// VOLUNTEER DASHBOARD LOGIC
function renderVolunteerDashboard() {
    const grid = document.getElementById('volunteer-assignments-grid');
    const tasksContainer = document.getElementById('volunteer-tasks-container');
    const progressLabel = document.getElementById('task-progress-label');
    if (!grid) return;

    if (state.volunteerTeams.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-dim); padding: 30px;">No volunteer assignments active yet.</div>`;
    } else {
        grid.innerHTML = state.volunteerTeams.map(v => `
            <div class="shift-card">
                <div>
                    <div style="font-size: 0.8rem; font-weight: 700; color: var(--cyan-primary); text-transform: uppercase;">
                        <i class="fa-solid fa-shield-halved"></i> Role: ${v.role}
                    </div>
                    <h3 style="font-size: 1.15rem; font-weight: 800; margin: 6px 0;">${v.event}</h3>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">Assigned Crew: ${v.name}</div>
                    <div class="badge-status status-published" style="margin-bottom: 14px;">Status: ${v.status}</div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-emerald btn-xs" style="flex: 1;" onclick="respondAssignment('${v.id}', 'Accepted')">
                        <i class="fa-solid fa-check"></i> Accept Duty
                    </button>
                    <button class="btn btn-rose btn-xs" style="flex: 1;" onclick="respondAssignment('${v.id}', 'Rejected')">
                        <i class="fa-solid fa-xmark"></i> Decline
                    </button>
                </div>
            </div>
        `).join('');
    }

    if (tasksContainer) {
        const doneCount = state.volunteerTasks.filter(t => t.done).length;
        if (progressLabel) progressLabel.textContent = `${doneCount} of ${state.volunteerTasks.length} tasks completed`;

        tasksContainer.innerHTML = state.volunteerTasks.map(t => `
            <div class="task-item-row ${t.done ? 'completed' : ''}">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTaskDone('${t.id}')" style="width: 18px; height: 18px; cursor: pointer;">
                    <span>${t.text}</span>
                </div>
                <span class="badge-accent">${t.done ? 'Completed' : 'Pending'}</span>
            </div>
        `).join('');
    }
}

function respondAssignment(id, status) {
    const v = state.volunteerTeams.find(i => i.id === id);
    if (v) {
        v.status = status;
        renderVolunteerDashboard();
        showToast(`Shift invitation: ${status}`, 'info');
    }
}

function toggleTaskDone(taskId) {
    const t = state.volunteerTasks.find(item => item.id === taskId);
    if (t) {
        t.done = !t.done;
        renderVolunteerDashboard();
        showToast(`Task progress updated!`, 'success');
    }
}

// ORGANISER DASHBOARD LOGIC
function renderOrganizerDashboard() {
    const tbodyEv = document.getElementById('organizer-events-tbody');
    const tbodyAtt = document.getElementById('organizer-attendees-tbody');
    const vAssignSelect = document.getElementById('v-assign-event');

    if (vAssignSelect) {
        vAssignSelect.innerHTML = state.events.map(e => `<option value="${e.title}">${e.title}</option>`).join('');
    }

    if (tbodyEv) {
        tbodyEv.innerHTML = state.events.map(ev => {
            const attPct = Math.round((ev.sold / ev.capacity) * 100);
            return `
                <tr>
                    <td><strong style="color: #FFF;">${ev.title}</strong></td>
                    <td>${ev.date} &bull; ${ev.venue}</td>
                    <td><span class="badge-status status-published">${ev.status}</span></td>
                    <td><strong>${ev.sold} / ${ev.capacity} Seats</strong></td>
                    <td><span class="badge-accent">${ev.volunteersAssigned} Crew</span></td>
                    <td><strong style="color: var(--emerald-primary);">${attPct}%</strong></td>
                    <td>
                        <button class="btn btn-outline-sm btn-xs" onclick="deleteEvent('${ev.id}')">
                            <i class="fa-solid fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    if (tbodyAtt) {
        if (state.attendeesRoster.length === 0) {
            tbodyAtt.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 20px;">No registered attendees yet.</td></tr>`;
        } else {
            tbodyAtt.innerHTML = state.attendeesRoster.map(att => `
                <tr>
                    <td><span class="ticket-code">${att.qrCode}</span></td>
                    <td><strong style="color: #FFF;">${att.name}</strong></td>
                    <td>${att.email}</td>
                    <td>${att.event}</td>
                    <td>
                        ${att.gateStatus === 'In-Venue'
                    ? `<span class="badge-status status-in-venue"><i class="fa-solid fa-check"></i> Checked-In</span>`
                    : (att.gateStatus === 'Exited'
                        ? `<span class="badge-status status-exited">Exited</span>`
                        : `<span class="badge-status status-not-entered">Absent</span>`)}
                    </td>
                    <td>${att.checkInTime}</td>
                    <td>
                        <div style="display: flex; gap: 6px;">
                            <button class="btn btn-emerald btn-xs" onclick="scanGateEntry('${att.qrCode}')">
                                <i class="fa-solid fa-right-to-bracket"></i> Entry
                            </button>
                            <button class="btn btn-outline-sm btn-xs" onclick="scanGateExit('${att.qrCode}')">
                                <i class="fa-solid fa-right-from-bracket"></i> Exit
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
    }

    updateDashboardStats();
}

function handleCreateOrEditEvent(e) {
    e.preventDefault();
    const title = document.getElementById('ev-title').value;
    const category = document.getElementById('ev-category').value;
    const date = document.getElementById('ev-date').value;
    const venue = document.getElementById('ev-venue').value;
    const capacity = parseInt(document.getElementById('ev-capacity').value);
    const poster = document.getElementById('ev-poster-url').value;
    const desc = document.getElementById('ev-desc').value;

    state.events.unshift({
        id: `ev-${Date.now()}`,
        title,
        category,
        date,
        venue,
        capacity,
        sold: 0,
        volunteersAssigned: 0,
        status: 'Published',
        image: poster,
        description: desc
    });

    renderAttendeeEvents();
    renderOrganizerDashboard();
    closeModal('createEventModal');
    document.getElementById('create-event-form').reset();
    showToast(`Published Event: "${title}" (Cap: ${capacity} seats)`, 'success');
}

function handleAddVolunteerSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('v-assign-name').value;
    const email = document.getElementById('v-assign-email').value;
    const event = document.getElementById('v-assign-event').value;
    const role = document.getElementById('v-assign-role').value;

    state.volunteerTeams.unshift({
        id: `v-${Date.now()}`,
        name,
        email,
        event,
        role,
        status: 'Accepted',
        tasksCompleted: 0,
        totalTasks: 4
    });

    renderVolunteerDashboard();
    renderOrganizerDashboard();
    closeModal('addVolunteerModal');
    showToast(`Assigned ${name} to ${role} team!`, 'success');
}

function scanGateEntry(qrCode) {
    const att = state.attendeesRoster.find(a => a.qrCode === qrCode);
    if (!att) return;

    if (att.gateStatus === 'In-Venue') {
        showToast(`Duplicate scan prevented: ${att.name} is already inside venue!`, 'info');
        return;
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    att.gateStatus = 'In-Venue';
    att.checkInTime = timeStr;
    showToast(`Gate Entry Scan: ${att.name} checked in at ${timeStr}`, 'success');

    renderOrganizerDashboard();
}

function scanGateExit(qrCode) {
    const att = state.attendeesRoster.find(a => a.qrCode === qrCode);
    if (!att) return;

    att.gateStatus = 'Exited';
    showToast(`Gate Exit Scan: ${att.name} logged exit.`, 'info');
    renderOrganizerDashboard();
}

function deleteEvent(eventId) {
    state.events = state.events.filter(e => e.id !== eventId);
    renderAttendeeEvents();
    renderOrganizerDashboard();
    showToast('Event deleted from directory', 'info');
}

function exportAttendanceReport() {
    const csvContent = "data:text/csv;charset=utf-8," +
        "QR Code,Attendee Name,Email,Event,Gate Status,Checkin Time\n" +
        state.attendeesRoster.map(a => `${a.qrCode},${a.name},${a.email},${a.event},${a.gateStatus},${a.checkInTime}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Attendance_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported Attendance CSV report!', 'success');
}

function updateDashboardStats() {
    const regVal = document.getElementById('org-total-reg-val');
    const checkedVal = document.getElementById('org-checked-in-val');
    const volVal = document.getElementById('org-vol-count-val');
    const rateVal = document.getElementById('org-attendance-rate-val');

    let totalReg = 0;
    state.events.forEach(e => totalReg += e.sold);

    const checkedInCount = state.attendeesRoster.filter(a => a.gateStatus === 'In-Venue' || a.gateStatus === 'Exited').length;
    const rate = totalReg > 0 ? Math.round((checkedInCount / totalReg) * 100) : 0;

    if (regVal) regVal.textContent = totalReg.toLocaleString();
    if (checkedVal) checkedVal.textContent = checkedInCount.toLocaleString();
    if (volVal) volVal.textContent = `${state.volunteerTeams.length} Assigned`;
    if (rateVal) rateVal.textContent = `${rate}%`;
}

// UTILITIES & MODALS
function toggleNotifDropdown() {
    const drop = document.getElementById('notif-dropdown');
    if (drop) drop.classList.toggle('active');
}

function clearNotifs() {
    state.notifications = [];
    renderNotifications();
    showToast('Notifications cleared', 'info');
}

function renderNotifications() {
    const container = document.getElementById('notif-list-container');
    const badge = document.getElementById('notif-count-badge');
    if (!container) return;

    if (badge) badge.textContent = state.notifications.length;

    if (state.notifications.length === 0) {
        container.innerHTML = `<div style="padding: 16px; text-align: center; color: var(--text-dim); font-size: 0.85rem;">No new notifications</div>`;
        return;
    }

    container.innerHTML = state.notifications.map(n => `
        <div class="notif-item">
            <i class="fa-solid fa-bell text-cyan"></i>
            <div>
                <div>${n.text}</div>
                <div style="font-size: 0.75rem; color: var(--text-dim);">${n.time}</div>
            </div>
        </div>
    `).join('');
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fa-solid fa-circle-info text-emerald"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}