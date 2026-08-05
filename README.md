# CventSphere — Full-Stack Setup Guide

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | HTML, Vanilla CSS, Vanilla JS |
| Backend | Node.js + Express.js |
| Database | MySQL (via `mysql2` pool) |
| Auth | JWT (JSON Web Tokens) |
| Real-time | Socket.io |

---

## 🚀 Quick Start (Step by Step)

### 1. Install Node.js
Download and install from **https://nodejs.org** (LTS version recommended).
Verify after install: `node --version` and `npm --version`

### 2. Install MySQL
Download from **https://dev.mysql.com/downloads/installer/**
Remember your MySQL `root` password.

### 3. Create the Database
Open MySQL Workbench (or the CLI) and run:
```sql
-- In MySQL CLI:
mysql -u root -p < database/schema.sql
```
This creates the `cventsphere` database with all tables and seed data.

### 4. Configure Environment
Edit the `.env` file in the project root:
```
DB_PASSWORD=your_mysql_password_here
```
All other defaults are fine for local development.

### 5. Install Node Dependencies
```bash
npm install
```

### 6. Start the Server
```bash
node server.js
```
You should see:
```
🎯 CventSphere Backend Server
🌐 Running at: http://localhost:3000
```

### 7. Open the Frontend
Open `index.html` with VS Code Live Server (port 5500) or just open it in your browser.

---

## 📂 Project Structure

```
r io/
├── index.html          ← Frontend UI
├── styles.css          ← All styles
├── app.js              ← Frontend JS (pure vanilla)
├── server.js           ← Backend entry point
├── package.json        ← Node dependencies
├── .env                ← Your config (DB password, JWT secret)
├── .env.example        ← Template
├── config/
│   └── db.js           ← MySQL connection pool
├── middleware/
│   └── auth.js         ← JWT + role guard
├── routes/
│   ├── auth.js         ← POST /api/auth/signup, /login, /forgot
│   ├── events.js       ← GET/POST/PUT/DELETE /api/events
│   ├── volunteers.js   ← Volunteer assignments & tasks
│   ├── attendees.js    ← Register, QR passes, gate check-in
│   └── admin.js        ← Platform analytics & user management
└── database/
    └── schema.sql      ← MySQL table definitions + seed data
```

---

## 🔑 Seed Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@cventsphere.com | Admin@1234 |
| Organizer | organizer@cventsphere.com | Admin@1234 |

---

## 📡 API Reference

### Auth
| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/api/auth/signup` | `{ name, email, password, role }` |
| POST | `/api/auth/login` | `{ email, password, role }` |
| POST | `/api/auth/forgot` | `{ email }` |

### Events
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/events` | Public |
| POST | `/api/events` | Organizer |
| PUT | `/api/events/:id` | Organizer (owner) |
| DELETE | `/api/events/:id` | Organizer (owner) |

### Attendees
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/attendees/register` | Attendee |
| GET | `/api/attendees/my-passes` | Attendee |
| PUT | `/api/attendees/checkin/:qrCode` | Organizer/Volunteer |

### Volunteers
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/volunteers/my-assignments` | Volunteer |
| POST | `/api/volunteers` | Organizer |
| PUT | `/api/volunteers/:id/respond` | Volunteer |
| PUT | `/api/volunteers/:id/task/:taskId` | Volunteer |

---

## 🔌 Connecting Frontend to Backend

The `app.js` frontend currently uses local in-memory state (for demo/offline use).
To enable backend API calls, add this at the top of `app.js`:

```js
const API_BASE = 'http://localhost:3000/api';

async function apiCall(endpoint, method = 'GET', body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const opts = { method, headers };
    if (body && method !== 'GET') opts.body = JSON.stringify(body);
    try {
        const res = await fetch(`${API_BASE}${endpoint}`, opts);
        return await res.json();
    } catch(e) {
        console.warn('API offline, using local state');
        return null;
    }
}
```

Then replace the inline state mutations in each handler with `apiCall(...)` calls.
