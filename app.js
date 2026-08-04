/**
 * CventSphere - Centralized Event & Volunteer Management Ecosystem
 * Core JavaScript Logic for 11 Centralized Modules
 */

// 1. GLOBAL STATE DATA STORE
const state = {
    currentUser: {
        name: 'Jordan Hayes',
        email: 'jordan.hayes@college.edu',
        role: 'Attendee', // 'Organizer', 'Volunteer', 'Attendee', 'Admin'
        collegeId: '2024-CSE-094',
        department: 'CSE'
    },
    notifications: [
        { id: 1, text: 'Registration Confirmed for Annual Tech Fest 2026', time: '10 mins ago', type: 'success' },
        { id: 2, text: 'Volunteer Shift Assigned: Technical Team Lead', time: '1 hour ago', type: 'info' },
        { id: 3, text: 'Event Reminder: Hackathon starts tomorrow at 10 AM', time: '2 hours ago', type: 'warning' }
    ],
    events: [
        {
            id: 'ev-1',
            title: 'Annual Tech Fest & Hackathon 2026',
            category: 'Tech',
            date: '2026-09-15 @ 10:00 AM',
            venue: 'Main Auditorium, Block B',
            price: 0,
            capacity: 500, // Registration Limit
            sold: 440,
            volunteersAssigned: 12,
            status: 'Live',
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
            description: 'The premier campus technical fest featuring 24-hr hackathons, AI workshops, and coding arenas.'
        },
        {
            id: 'ev-2',
            title: 'UX Design System Expo & Masterclass',
            category: 'Design',
            date: '2026-10-02 @ 11:30 AM',
            venue: 'Design Studio Hall 3',
            price: 50,
            capacity: 300,
            sold: 220,
            volunteersAssigned: 8,
            status: 'Published',
            image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=80',
            description: 'Explore UI design tokens, component architecture, and campus design showcases.'
        },
        {
            id: 'ev-3',
            title: 'E-Cell Founders Summit & Pitch Arena',
            category: 'Business',
            date: '2026-10-20 @ 09:00 AM',
            venue: 'Convention Hall A',
            price: 0,
            capacity: 400,
            sold: 380,
            volunteersAssigned: 10,
            status: 'Published',
            image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80',
            description: 'Connecting student entrepreneurs with VC mentors, angel investors, and incubation grants.'
        },
        {
            id: 'ev-4',
            title: 'Inter-College Esports Tournament 2026',
            category: 'Gaming',
            date: '2026-11-05 @ 01:00 PM',
            venue: 'Student Activity Arena',
            price: 20,
            capacity: 600,
            sold: 580,
            volunteersAssigned: 15,
            status: 'Published',
            image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
            description: 'Valorant, BGMI, and FIFA campus championship with live shoutcasting and VR setups.'
        }
    ],
    volunteerTeams: [
        { id: 'v-1', name: 'Sarah Chen', email: 'sarah.chen@college.edu', event: 'Annual Tech Fest 2026', role: 'Technical Team', status: 'Accepted', tasksCompleted: 3, totalTasks: 4 },
        { id: 'v-2', name: 'Marcus Vance', email: 'marcus.v@college.edu', event: 'UX Design Expo', role: 'Registration Desk', status: 'Accepted', tasksCompleted: 4, totalTasks: 4 },
        { id: 'v-3', name: 'Elena Rostova', email: 'elena.r@college.edu', event: 'E-Cell Summit', role: 'Hospitality', status: 'Pending', tasksCompleted: 1, totalTasks: 3 },
        { id: 'v-4', name: 'David Kim', email: 'david.k@college.edu', event: 'Esports Tournament', role: 'Stage Management', status: 'Accepted', tasksCompleted: 2, totalTasks: 4 }
    ],
    volunteerTasks: [
        { id: 't1', text: 'Set up Registration Desk Laptops & QR Scanners', done: true },
        { id: 't2', text: 'Verify VIP Speaker Hospitality Kits & Lounges', done: true },
        { id: 't3', text: 'Conduct Stage Microphone & Projector Sound Check', done: false },
        { id: 't4', text: 'Assist Gate Security with QR Entry/Exit Logging', done: false }
    ],
    attendeesRoster: [
        { qrCode: 'CVT-ATT-8821', name: 'Jordan Hayes', collegeId: '2024-CSE-094', dept: 'CSE', year: '2nd Year', branch: 'CSE-B', event: 'Annual Tech Fest 2026', gateStatus: 'In-Venue', checkInTime: '09:42 AM' },
        { qrCode: 'CVT-ATT-8822', name: 'Samantha Reed', collegeId: '2023-ECE-041', dept: 'ECE', year: '3rd Year', branch: 'ECE-A', event: 'UX Design Expo', gateStatus: 'Not Entered', checkInTime: '--' },
        { qrCode: 'CVT-ATT-8823', name: 'Alex Rivera', collegeId: '2022-ME-112', dept: 'ME', year: '4th Year', branch: 'ME-C', event: 'E-Cell Summit', gateStatus: 'Exited', checkInTime: '09:15 AM' },
        { qrCode: 'CVT-ATT-8824', name: 'Rohan Sharma', collegeId: '2025-EE-018', dept: 'EE', year: '1st Year', branch: 'EE-A', event: 'Esports Tournament', gateStatus: 'In-Venue', checkInTime: '10:05 AM' }
    ],
    myRegistrations: [
        {
            qrCode: 'CVT-ATT-8821',
            eventId: 'ev-1',
            eventName: 'Annual Tech Fest & Hackathon 2026',
            date: '2026-09-15 @ 10:00 AM',
            venue: 'Main Auditorium, Block B',
            collegeId: '2024-CSE-094',
            dept: 'CSE',
            gateStatus: 'In-Venue',
            certificateAvailable: true
        }
    ],
    adminUsers: [
        { id: 'u1', name: 'Dr. Aris Thorne', email: 'aris.thorne@college.edu', collegeId: 'FAC-901', role: 'Organizer', dept: 'CSE', status: 'Active' },
        { id: 'u2', name: 'Jordan Hayes', email: 'jordan.hayes@college.edu', collegeId: '2024-CSE-094', role: 'Attendee', dept: 'CSE', status: 'Active' },
        { id: 'u3', name: 'Sarah Chen', email: 'sarah.chen@college.edu', collegeId: '2023-ECE-041', role: 'Volunteer', dept: 'ECE', status: 'Active' },
        { id: 'u4', name: 'System Admin', email: 'admin@cventsphere.edu', collegeId: 'ADM-001', role: 'Admin', dept: 'IT Systems', status: 'Active' }
    ],
    activeCategoryFilter: 'all',
    selectedEventForReg: null
};

// 2. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    renderAllViews();
});

function renderAllViews() {
    renderNotifications();
    renderOrganizerEvents();
    renderOrganizerVolunteers();
    renderOrganizerAttendees();
    renderOrganizerAnalytics();
    renderVolunteerDashboard();
    renderAttendeeEvents();
    renderMyRegistrations();
    renderAdminPanel();
    updateDashboardStats();
}

// 3. NAVIGATION & VIEW SWITCHING
function switchView(viewName) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.dataset.view === viewName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    document.querySelectorAll('.view-section').forEach(sec => {
        sec.classList.remove('active');
    });

    const targetSection = document.getElementById(`${viewName}-view`);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 4. NOTIFICATIONS HUB
function toggleNotifDropdown() {
    const drop = document.getElementById('notif-dropdown');
    if (drop) drop.classList.toggle('active');
}

function clearNotifs() {
    state.notifications = [];
    renderNotifications();
    showToast('Notifications marked as read', 'info');
}

function renderNotifications() {
    const container = document.getElementById('notif-list-container');
    const badge = document.getElementById('notif-count-badge');
    if (!container) return;

    if (badge) badge.textContent = state.notifications.length;

    if (state.notifications.length === 0) {
        container.innerHTML = `<div style="padding: 16px; text-align: center; color: var(--text-dim); font-size: 0.85rem;">No unread notifications</div>`;
        return;
    }

    container.innerHTML = state.notifications.map(n => `
        <div class="notif-item">
            <i class="fa-solid fa-circle-info text-cyan" style="margin-top: 2px;"></i>
            <div>
                <div>${n.text}</div>
                <div class="notif-time">${n.time}</div>
            </div>
        </div>
    `).join('');
}

// 5. USER AUTHENTICATION & PROFILE
function switchAuthTab(tab) {
    document.getElementById('auth-tab-login-btn').classList.remove('active');
    document.getElementById('auth-tab-signup-btn').classList.remove('active');
    document.getElementById('auth-tab-forgot-btn').classList.remove('active');

    document.getElementById('auth-login-form').style.display = 'none';
    document.getElementById('auth-signup-form').style.display = 'none';
    document.getElementById('auth-forgot-form').style.display = 'none';

    if (tab === 'login') {
        document.getElementById('auth-tab-login-btn').classList.add('active');
        document.getElementById('auth-login-form').style.display = 'block';
    } else if (tab === 'signup') {
        document.getElementById('auth-tab-signup-btn').classList.add('active');
        document.getElementById('auth-signup-form').style.display = 'block';
    } else {
        document.getElementById('auth-tab-forgot-btn').classList.add('active');
        document.getElementById('auth-forgot-form').style.display = 'block';
    }
}

function handleLoginSubmit(e) {
    e.preventDefault();
    const role = document.getElementById('login-role').value;
    const email = document.getElementById('login-email').value;

    state.currentUser = {
        name: email.split('@')[0].replace('.', ' '),
        email,
        role,
        collegeId: '2024-CSE-094',
        department: 'CSE'
    };

    document.getElementById('auth-btn-label').textContent = `${state.currentUser.name} (${role})`;
    closeModal('authModal');
    showToast(`Logged in successfully as ${role}!`, 'success');

    if (role === 'Organizer') switchView('organizer');
    else if (role === 'Volunteer') switchView('volunteer');
    else if (role === 'Admin') switchView('admin');
    else switchView('attendee');
}

function handleSignupSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const role = document.getElementById('signup-role').value;

    state.currentUser.name = name;
    state.currentUser.role = role;

    document.getElementById('auth-btn-label').textContent = `${name} (${role})`;
    closeModal('authModal');
    showToast(`Account created for ${name}!`, 'success');
}

function handleForgotSubmit(e) {
    e.preventDefault();
    closeModal('authModal');
    showToast('Password reset link sent to your college email.', 'info');
}

// 6. ORGANIZER DASHBOARD CONTROLS
function switchOrganizerTab(tabName) {
    document.querySelectorAll('#organizer-view .tab-btn').forEach(btn => {
        if (btn.dataset.tab === tabName) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    document.querySelectorAll('#organizer-view .tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    const targetTab = document.getElementById(`${tabName}-tab`);
    if (targetTab) targetTab.classList.add('active');
}

function renderOrganizerEvents() {
    const tbody = document.getElementById('organizer-events-tbody');
    const countSpan = document.getElementById('org-events-count');
    if (!tbody) return;

    if (countSpan) countSpan.textContent = state.events.length;

    tbody.innerHTML = state.events.map(ev => {
        const attPct = Math.round((ev.sold / ev.capacity) * 100);

        return `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <img src="${ev.image}" style="width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover;">
                        <div>
                            <strong style="color: #FFF;">${ev.title}</strong>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">${ev.category}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div><i class="fa-regular fa-calendar text-purple"></i> ${ev.date}</div>
                    <div style="font-size: 0.8rem; color: var(--text-dim);">${ev.venue}</div>
                </td>
                <td><span class="badge-status status-published">${ev.status}</span></td>
                <td>
                    <strong>${ev.sold} / ${ev.capacity} Seats</strong>
                    <div class="mini-progress-bar" style="margin-top: 4px; width: 110px;">
                        <div class="fill" style="width: ${Math.min(attPct, 100)}%;"></div>
                    </div>
                </td>
                <td><span class="badge-accent">${ev.volunteersAssigned} Crew Members</span></td>
                <td><strong style="color: var(--emerald-primary);">${attPct}%</strong></td>
                <td>
                    <div style="display: flex; gap: 6px;">
                        <button class="btn btn-outline-sm btn-xs" onclick="openEditEventModal('${ev.id}')">
                            <i class="fa-solid fa-pen"></i> Edit
                        </button>
                        <button class="btn btn-rose btn-xs" onclick="deleteEvent('${ev.id}')">
                            <i class="fa-solid fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function openEditEventModal(eventId) {
    const ev = state.events.find(e => e.id === eventId);
    if (!ev) return;

    document.getElementById('event-modal-title').innerHTML = `<i class="fa-solid fa-pen text-purple"></i> Edit Event Details`;
    document.getElementById('ev-edit-id').value = ev.id;
    document.getElementById('ev-title').value = ev.title;
    document.getElementById('ev-category').value = ev.category;
    document.getElementById('ev-date').value = ev.date;
    document.getElementById('ev-venue').value = ev.venue;
    document.getElementById('ev-capacity').value = ev.capacity;
    document.getElementById('ev-poster-url').value = ev.image;
    document.getElementById('ev-desc').value = ev.description;
    document.getElementById('ev-modal-submit-btn').textContent = 'Save Changes';

    openModal('createEventModal');
}

function handleCreateOrEditEvent(e) {
    e.preventDefault();
    const editId = document.getElementById('ev-edit-id').value;
    const title = document.getElementById('ev-title').value;
    const category = document.getElementById('ev-category').value;
    const date = document.getElementById('ev-date').value;
    const venue = document.getElementById('ev-venue').value;
    const capacity = parseInt(document.getElementById('ev-capacity').value);
    const poster = document.getElementById('ev-poster-url').value;
    const desc = document.getElementById('ev-desc').value;

    if (editId) {
        const ev = state.events.find(e => e.id === editId);
        if (ev) {
            ev.title = title;
            ev.category = category;
            ev.date = date;
            ev.venue = venue;
            ev.capacity = capacity;
            ev.image = poster;
            ev.description = desc;
            showToast(`Updated Event: "${title}"`, 'success');
        }
    } else {
        state.events.unshift({
            id: `ev-${Date.now()}`,
            title,
            category,
            date,
            venue,
            price: 0,
            capacity,
            sold: 0,
            volunteersAssigned: 0,
            status: 'Published',
            image: poster,
            description: desc
        });
        showToast(`Published Event: "${title}" (Limit: ${capacity} seats)`, 'success');
    }

    renderAllViews();
    closeModal('createEventModal');
    document.getElementById('create-event-form').reset();
    document.getElementById('ev-edit-id').value = '';
}

function deleteEvent(eventId) {
    state.events = state.events.filter(e => e.id !== eventId);
    renderAllViews();
    showToast('Event deleted from system', 'info');
}

function renderOrganizerVolunteers() {
    const tbody = document.getElementById('organizer-volunteer-team-tbody');
    const eventSelect = document.getElementById('v-assign-event');
    if (!tbody) return;

    if (eventSelect) {
        eventSelect.innerHTML = state.events.map(e => `<option value="${e.title}">${e.title}</option>`).join('');
    }

    tbody.innerHTML = state.volunteerTeams.map(v => `
        <tr>
            <td>
                <strong style="color: #FFF;">${v.name}</strong>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${v.email}</div>
            </td>
            <td>${v.event}</td>
            <td><span class="badge-role">${v.role}</span></td>
            <td>
                ${v.status === 'Accepted' 
                    ? `<span class="badge-status status-published"><i class="fa-solid fa-check"></i> Accepted</span>`
                    : `<span class="badge-status status-draft"><i class="fa-solid fa-clock"></i> Invited</span>`}
            </td>
            <td><span class="badge-accent">${v.tasksCompleted} / ${v.totalTasks} Tasks Done</span></td>
            <td>
                <button class="btn btn-outline-sm btn-xs" onclick="reassignVolunteerRole('${v.id}')">
                    <i class="fa-solid fa-rotate"></i> Reassign
                </button>
            </td>
        </tr>
    `).join('');
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

    renderAllViews();
    closeModal('addVolunteerModal');
    showToast(`Assigned ${name} to ${role} team!`, 'success');
}

function reassignVolunteerRole(vId) {
    const v = state.volunteerTeams.find(item => item.id === vId);
    if (v) {
        const roles = ['Registration Desk', 'Technical Team', 'Photography', 'Hospitality', 'Stage Management'];
        const nextRole = roles[(roles.indexOf(v.role) + 1) % roles.length];
        v.role = nextRole;
        renderOrganizerVolunteers();
        showToast(`Reassigned ${v.name} to ${nextRole}`, 'info');
    }
}

function renderOrganizerAttendees() {
    const tbody = document.getElementById('organizer-attendees-tbody');
    if (!tbody) return;

    tbody.innerHTML = state.attendeesRoster.map(att => `
        <tr>
            <td><span class="ticket-code"><i class="fa-solid fa-qrcode"></i> ${att.qrCode}</span></td>
            <td>
                <strong style="color: #FFF;">${att.name}</strong>
                <div style="font-size: 0.8rem; color: var(--cyan-primary); font-family: monospace;">${att.collegeId}</div>
            </td>
            <td>${att.dept} &bull; ${att.year} (${att.branch})</td>
            <td>${att.event}</td>
            <td>
                ${att.gateStatus === 'In-Venue' 
                    ? `<span class="badge-status status-in-venue"><i class="fa-solid fa-person-walking-arrow-right"></i> Checked-In</span>` 
                    : (att.gateStatus === 'Exited' 
                        ? `<span class="badge-status status-exited"><i class="fa-solid fa-person-walking-arrow-loop-left"></i> Exited</span>`
                        : `<span class="badge-status status-not-entered">Absent / Pending</span>`)}
            </td>
            <td><span style="font-size: 0.85rem; color: var(--text-muted);">${att.checkInTime}</span></td>
            <td>
                <div style="display: flex; gap: 6px;">
                    <button class="btn btn-emerald btn-xs" onclick="scanGateEntry('${att.qrCode}')">
                        <i class="fa-solid fa-right-to-bracket"></i> Entry Scan
                    </button>
                    <button class="btn btn-outline-sm btn-xs" onclick="scanGateExit('${att.qrCode}')">
                        <i class="fa-solid fa-right-from-bracket"></i> Exit Scan
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function scanGateEntry(qrCode) {
    const att = state.attendeesRoster.find(a => a.qrCode === qrCode);
    if (!att) return;

    if (att.gateStatus === 'In-Venue') {
        showToast(`DUPLICATE CHECK-IN PREVENTED: ${att.name} is already checked in!`, 'info');
        return;
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    att.gateStatus = 'In-Venue';
    att.checkInTime = timeStr;
    showToast(`GATE ENTRY SCAN: ${att.name} (${att.collegeId}) checked in at ${timeStr}`, 'success');

    renderOrganizerAttendees();
    updateDashboardStats();
}

function scanGateExit(qrCode) {
    const att = state.attendeesRoster.find(a => a.qrCode === qrCode);
    if (!att) return;

    att.gateStatus = 'Exited';
    showToast(`GATE EXIT SCAN: ${att.name} logged exit.`, 'info');
    renderOrganizerAttendees();
    updateDashboardStats();
}

function renderOrganizerAnalytics() {
    const barChart = document.getElementById('chart-registrations-bar');
    const deptList = document.getElementById('chart-dept-distribution');
    if (!barChart) return;

    barChart.innerHTML = state.events.map(e => `
        <div class="bar-item">
            <div class="bar-label">
                <span>${e.title}</span>
                <strong>${e.sold} / ${e.capacity} Seats</strong>
            </div>
            <div class="bar-track">
                <div class="bar-fill-purple" style="width: ${(e.sold/e.capacity)*100}%;"></div>
            </div>
        </div>
    `).join('');

    if (deptList) {
        const depts = [
            { name: 'Computer Science (CSE)', count: '1,420 Students', pct: 42 },
            { name: 'Electronics (ECE)', count: '890 Students', pct: 26 },
            { name: 'Mechanical (ME)', count: '540 Students', pct: 16 },
            { name: 'Electrical & Civil', count: '520 Students', pct: 16 }
        ];

        deptList.innerHTML = depts.map(d => `
            <div class="bar-item">
                <div class="bar-label">
                    <span>${d.name}</span>
                    <strong>${d.count} (${d.pct}%)</strong>
                </div>
                <div class="bar-track">
                    <div class="bar-fill-cyan" style="width: ${d.pct}%;"></div>
                </div>
            </div>
        `).join('');
    }
}

function exportAttendanceReport(type) {
    if (type === 'excel') {
        const csvContent = "data:text/csv;charset=utf-8," + 
            "QR Code,Student Name,College ID,Department,Year,Event,Gate Status,Checkin Time\n" +
            state.attendeesRoster.map(a => `${a.qrCode},${a.name},${a.collegeId},${a.dept},${a.year},${a.event},${a.gateStatus},${a.checkInTime}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "CventSphere_Attendance_Report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Exported Attendance CSV / Excel file!', 'success');
    } else {
        window.print();
    }
}

// 7. VOLUNTEER DASHBOARD & TASK CHECKLIST
function renderVolunteerDashboard() {
    const grid = document.getElementById('volunteer-assignments-grid');
    const tasksContainer = document.getElementById('volunteer-tasks-container');
    const progressLabel = document.getElementById('task-progress-label');
    if (!grid) return;

    grid.innerHTML = state.volunteerTeams.map(v => `
        <div class="shift-card">
            <div>
                <div style="font-size: 0.8rem; font-weight: 700; color: var(--cyan-primary); text-transform: uppercase;">
                    <i class="fa-solid fa-shield-halved"></i> Team Role: ${v.role}
                </div>
                <h3 style="font-size: 1.2rem; font-weight: 800; margin: 6px 0;">${v.event}</h3>
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">Assigned to: ${v.name} (${v.email})</div>
                <div class="badge-status status-published" style="margin-bottom: 16px;">Status: ${v.status}</div>
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
        showToast(`Assignment status updated to: ${status}`, status === 'Accepted' ? 'success' : 'info');
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

// 8. ATTENDEE DASHBOARD & 8-FIELD REGISTRATION FORM
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
                    <span class="banner-price-tag">${ev.price > 0 ? `$${ev.price}` : 'Free Entry'}</span>
                </div>
                <div class="event-card-body">
                    <h3>${ev.title}</h3>
                    <p>${ev.description}</p>
                    <div class="event-meta-info">
                        <span><i class="fa-regular fa-calendar text-emerald"></i> ${ev.date}</span>
                        <span><i class="fa-solid fa-location-dot text-purple"></i> ${ev.venue}</span>
                        <span><i class="fa-solid fa-chair text-cyan"></i> Capacity: <strong>${ev.capacity} seats</strong> (${remaining} available)</span>
                    </div>
                    <div class="event-card-footer">
                        <button class="btn btn-emerald" style="width: 100%;" ${isSoldOut ? 'disabled style="opacity:0.5;"' : ''} onclick="openCollegeRegModal('${ev.id}')">
                            <i class="fa-solid fa-graduation-cap"></i> ${isSoldOut ? 'Registration Cap Reached' : 'Register (8-Field Form)'}
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

    openModal('collegeRegistrationModal');
}

function handleCollegeRegSubmit(e) {
    e.preventDefault();
    if (!state.selectedEventForReg) return;

    const ev = state.selectedEventForReg;
    const name = document.getElementById('reg-name').value;
    const collegeId = document.getElementById('reg-college-id').value;
    const email = document.getElementById('reg-email').value;
    const phone = document.getElementById('reg-phone').value;
    const dept = document.getElementById('reg-dept').value;
    const year = document.getElementById('reg-year').value;
    const branch = document.getElementById('reg-branch').value;

    const uniqueQr = `CVT-ATT-${Math.floor(1000 + Math.random() * 9000)}`;

    ev.sold += 1;

    state.myRegistrations.unshift({
        qrCode: uniqueQr,
        eventId: ev.id,
        eventName: ev.title,
        date: ev.date,
        venue: ev.venue,
        collegeId,
        dept,
        gateStatus: 'Not Entered',
        certificateAvailable: true
    });

    state.attendeesRoster.unshift({
        qrCode: uniqueQr,
        name,
        collegeId,
        dept,
        year,
        branch,
        event: ev.title,
        gateStatus: 'Not Entered',
        checkInTime: '--'
    });

    renderAllViews();
    closeModal('collegeRegistrationModal');
    switchAttendeeSubTab('my-tickets');
    showToast(`Registration Successful! Issued QR Pass #${uniqueQr}`, 'success');
}

function renderMyRegistrations() {
    const container = document.getElementById('my-tickets-container');
    const countSpan = document.getElementById('attendee-my-tickets-count');
    if (!container) return;

    if (countSpan) countSpan.textContent = state.myRegistrations.length;

    container.innerHTML = state.myRegistrations.map(r => `
        <div class="ticket-pass-card">
            <div class="ticket-header-row">
                <span class="badge-emerald"><i class="fa-solid fa-id-card"></i> Student Gate Pass</span>
                <span class="ticket-code">${r.qrCode}</span>
            </div>
            <h3>${r.eventName}</h3>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">
                <div><i class="fa-regular fa-calendar text-emerald"></i> ${r.date}</div>
                <div><i class="fa-solid fa-location-dot text-purple"></i> ${r.venue}</div>
                <div><i class="fa-solid fa-building-columns text-cyan"></i> Roll No: <strong>${r.collegeId}</strong></div>
            </div>
            <div class="ticket-qr-stub">
                <i class="fa-solid fa-qrcode qr-large"></i>
                <div>
                    <div style="font-weight: 700; color: #FFF;">Unique Entry & Exit Pass</div>
                    <div style="font-size: 0.75rem; color: var(--text-dim);">Scan at gate entrance</div>
                </div>
            </div>
            <div style="display: flex; gap: 8px; margin-top: 16px;">
                <button class="btn btn-outline-sm" style="flex:1;" onclick="openViewPassModal('${r.qrCode}')">
                    <i class="fa-solid fa-qrcode"></i> View QR
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
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--emerald-primary); text-transform: uppercase;">Campus Gate Entry & Exit Pass</div>
            <h2 style="font-size: 1.4rem; font-weight: 800; margin: 8px 0;">${r.eventName}</h2>
            <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 16px;">${r.date} &bull; ${r.venue}</div>

            <div style="background: #FFF; padding: 20px; border-radius: var(--radius-md); display: inline-block; margin-bottom: 16px;">
                <i class="fa-solid fa-qrcode" style="font-size: 8rem; color: #0B0F17;"></i>
            </div>
            <div style="font-family: monospace; font-size: 1.2rem; font-weight: 800; color: var(--emerald-primary);">${r.qrCode}</div>
            <div style="margin-top: 10px; font-size: 0.85rem; color: var(--text-muted);">College Roll No: <strong>${r.collegeId}</strong></div>
        </div>
    `;
    openModal('viewTicketModal');
}

function openCertificateModal(qrCode) {
    const r = state.myRegistrations.find(item => item.qrCode === qrCode);
    if (!r) return;

    const body = document.getElementById('certificate-body');
    body.innerHTML = `
        <div style="border: 4px double #38BDF8; padding: 30px; border-radius: 8px;">
            <div style="font-size: 0.85rem; letter-spacing: 2px; color: #38BDF8; text-transform: uppercase; margin-bottom: 10px;">Official Certificate of Participation</div>
            <h1 style="font-size: 2.2rem; font-weight: 800; font-family: 'Plus Jakarta Sans'; margin-bottom: 10px;">CVENTSPHERE CAMPUS PORTAL</h1>
            <p style="font-size: 0.95rem; color: var(--text-muted);">This is proudly awarded to</p>
            <h2 style="font-size: 1.8rem; font-weight: 800; color: #FBBF24; margin: 12px 0;">${state.currentUser.name}</h2>
            <p style="font-size: 0.95rem; color: var(--text-muted);">Roll No: <strong>${r.collegeId}</strong> &bull; Dept: <strong>${r.dept}</strong></p>
            <p style="margin: 16px 0; font-size: 1rem;">For active participation and completion of <strong>${r.eventName}</strong></p>
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 16px;">
                <div>
                    <div style="font-family: monospace; font-size: 0.8rem; color: var(--text-dim);">Verify ID: ${r.qrCode}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${r.date}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-style: italic; font-weight: 700; color: #38BDF8;">Dean of Student Affairs</div>
                    <div style="font-size: 0.75rem; color: var(--text-dim);">Official Stamp & Signature</div>
                </div>
            </div>
        </div>
    `;
    openModal('certificateModal');
}

function printCertificate() {
    window.print();
}

// 9. ADMIN PANEL (MODULE 11)
function switchAdminTab(tabName) {
    document.querySelectorAll('#admin-view .tab-btn').forEach(btn => {
        if (btn.dataset.adminTab === tabName) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    document.querySelectorAll('#admin-view .tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    const targetTab = document.getElementById(`${tabName}-tab`);
    if (targetTab) targetTab.classList.add('active');
}

function renderAdminPanel() {
    const userTbody = document.getElementById('admin-users-tbody');
    const evTbody = document.getElementById('admin-events-tbody');
    const userCount = document.getElementById('admin-user-count');
    if (!userTbody) return;

    if (userCount) userCount.textContent = state.adminUsers.length;

    userTbody.innerHTML = state.adminUsers.map(u => `
        <tr>
            <td>
                <strong style="color: #FFF;">${u.name}</strong>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${u.email}</div>
            </td>
            <td><span style="font-family: monospace; color: var(--cyan-primary);">${u.collegeId}</span></td>
            <td><span class="badge-role">${u.role}</span></td>
            <td>${u.dept}</td>
            <td><span class="badge-status status-published">${u.status}</span></td>
            <td>
                <button class="btn btn-rose btn-xs" onclick="deleteUser('${u.id}')">
                    <i class="fa-solid fa-user-minus"></i> Remove
                </button>
            </td>
        </tr>
    `).join('');

    if (evTbody) {
        evTbody.innerHTML = state.events.map(e => `
            <tr>
                <td><strong style="color: #FFF;">${e.title}</strong></td>
                <td>Dr. Aris Thorne (Faculty Head)</td>
                <td><strong>${e.sold} / ${e.capacity}</strong></td>
                <td>${e.date}</td>
                <td><span class="badge-status status-published">${e.status}</span></td>
                <td>
                    <button class="btn btn-rose btn-xs" onclick="deleteEvent('${e.id}')">
                        <i class="fa-solid fa-ban"></i> Delete Event
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function deleteUser(uId) {
    state.adminUsers = state.adminUsers.filter(u => u.id !== uId);
    renderAdminPanel();
    showToast('User removed from portal database', 'info');
}

// 10. UTILITIES & STATS
function updateDashboardStats() {
    const regVal = document.getElementById('org-total-reg-val');
    const checkedVal = document.getElementById('org-checked-in-val');
    const absentVal = document.getElementById('org-absent-val');
    const rateVal = document.getElementById('org-attendance-rate-val');

    let totalReg = 0;
    state.events.forEach(e => totalReg += e.sold);

    const checkedInCount = state.attendeesRoster.filter(a => a.gateStatus === 'In-Venue' || a.gateStatus === 'Exited').length;
    const absentCount = Math.max(0, totalReg - checkedInCount);
    const rate = totalReg > 0 ? Math.round((checkedInCount / totalReg) * 100) : 78;

    if (regVal) regVal.textContent = totalReg.toLocaleString();
    if (checkedVal) checkedVal.textContent = checkedInCount.toLocaleString();
    if (absentVal) absentVal.textContent = absentCount.toLocaleString();
    if (rateVal) rateVal.textContent = `${rate}%`;
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check text-emerald' : 'fa-circle-info text-cyan'}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function scrollToElement(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}
