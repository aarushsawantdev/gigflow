# GigFlow — Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack and TypeScript.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-Mandatory-blue) ![Docker](https://img.shields.io/badge/Docker-Supported-blue)

---

## ✨ Features

- **JWT Authentication** — Register, login, protected routes, bcrypt password hashing
- **Lead CRUD** — Create, read, update, delete leads with full validation
- **Advanced Filtering** — Filter by status, source, search by name/email, sort by date
- **Debounced Search** — 400ms debounce for efficient API calls
- **Pagination** — Backend pagination, 10 records/page with metadata
- **CSV Export** — Export filtered leads as CSV
- **Role-Based Access Control** — Admin vs Sales User permissions
- **Dark Mode** — Full dark/light mode toggle (persisted)
- **Responsive UI** — Mobile-first design with collapsible sidebar

---

## 🛠 Tech Stack

| Layer     | Tech                                    |
|-----------|-----------------------------------------|
| Frontend  | React 18, TypeScript, TailwindCSS, Vite |
| Backend   | Node.js, Express, TypeScript            |
| Database  | MongoDB, Mongoose                       |
| Auth      | JWT, bcryptjs                           |
| Dev Tools | Docker, docker-compose                  |

---

## 📁 Project Structure

```
gigflow/
├── backend/
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routers
│   │   ├── types/          # TypeScript interfaces
│   │   └── index.ts        # Entry point
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios + API calls
│   │   ├── components/     # Reusable UI components
│   │   │   ├── auth/
│   │   │   ├── layout/
│   │   │   ├── leads/
│   │   │   └── ui/
│   │   ├── context/        # Auth + Theme context
│   │   ├── hooks/          # useLeads, useDebounce
│   │   ├── pages/          # Route-level components
│   │   ├── types/          # Shared TypeScript types
│   │   └── main.tsx
│   ├── .env.example
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 🚀 Local Setup (Without Docker)

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/gigflow.git
cd gigflow
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Frontend setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit VITE_API_URL if needed
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## 🐳 Docker Setup

```bash
# From the root gigflow/ directory
cp .env.example .env
# Edit .env with a strong JWT_SECRET

docker-compose up --build
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- MongoDB: `localhost:27017`

---

## 🔑 API Documentation

Base URL: `http://localhost:5000/api`

### Auth Routes

| Method | Endpoint         | Description       | Auth |
|--------|-----------------|-------------------|------|
| POST   | /auth/register   | Register user     | ❌   |
| POST   | /auth/login      | Login user        | ❌   |
| GET    | /auth/me         | Get current user  | ✅   |

**Register body:**
```json
{ "name": "John Doe", "email": "john@example.com", "password": "secret123", "role": "sales" }
```

**Login body:**
```json
{ "email": "john@example.com", "password": "secret123" }
```

### Leads Routes (all require Bearer token)

| Method | Endpoint              | Description             | Role       |
|--------|-----------------------|-------------------------|------------|
| GET    | /leads                | Get all leads (filtered)| All        |
| POST   | /leads                | Create lead             | All        |
| GET    | /leads/:id            | Get single lead         | All        |
| PUT    | /leads/:id            | Update lead             | All        |
| DELETE | /leads/:id            | Delete lead             | Admin only |
| GET    | /leads/stats          | Get lead stats          | All        |
| GET    | /leads/export/csv     | Export CSV              | All        |

**Query params for GET /leads:**
```
?page=1&limit=10&status=New&source=Website&search=john&sort=latest
```

**Lead body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "status": "New",
  "source": "Website",
  "notes": "Interested in premium plan"
}
```

**Pagination response format:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## 🔐 Role Permissions

| Action          | Admin | Sales User        |
|-----------------|-------|-------------------|
| View all leads  | ✅    | ❌ (own only)     |
| Create lead     | ✅    | ✅                |
| Update lead     | ✅    | ✅ (own only)     |
| Delete lead     | ✅    | ❌                |
| Export CSV      | ✅    | ✅ (own only)     |
| View stats      | ✅    | ✅ (own only)     |

---

## 🌙 Dark Mode

Click the moon/sun icon in the sidebar to toggle. Preference is persisted in localStorage.

---

## 📬 Submission

Submitted by: **[Your Name]**  
Email: ritik.yadav@servicehive.tech  
CC: hr.recruitment@servicehive.tech
