# TamilMeDictionary — Full-Stack Production Architecture

TamilMeDictionary is the world's first Tamil Medical Dictionary portal built for students, doctors, translators, researchers, and medical writers.

## Architecture

The repository is organized into three distinct folders:

```
TamilMeDictionary/
├── frontend/   # React 18 + Vite + Tailwind CSS v3 (Public Website)
├── backend/    # Python FastAPI + Motor Async MongoDB Driver (REST APIs & Auth)
└── admin/      # React 18 + Vite + Tailwind CSS v3 (Admin Dashboard with full CRUD)
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ installed
- **Python**: 3.10+ installed
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) or MongoDB Atlas connection URI

---

### 2. Backend Setup (`backend/`)

```bash
cd backend
python -m venv venv

# Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
```

#### Environment Variables
Create a `.env` file in `backend/`:
```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=tamilmedictionary
SECRET_KEY=super-secret-key-change-this-in-production-min-32-chars
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@tamilmedictionary.com
ADMIN_PASSWORD=Admin@1234
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

#### Seed Initial Data & Create Admin User
```bash
python -m backend.seed
```

#### Start FastAPI Server
```bash
uvicorn backend.main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`

---

### 3. Frontend Setup (`frontend/`)

```bash
cd frontend
npm install
npm run dev
```
- Public Website URL: `http://localhost:5173`

---

### 4. Admin Dashboard Setup (`admin/`)

```bash
cd admin
npm install
npm run dev
```
- Admin Dashboard URL: `http://localhost:5174`
- Default Admin Login Credentials:
  - **Username**: `admin`
  - **Password**: `Admin@1234`

---

## 🌟 Key Features

1. **Header & Navigation**: Sticky navbar with glassmorphism, responsive mobile drawer, active page highlighting.
2. **Hero Section**: Thirukkural 645 quote, English/Tamil main headings, interactive search bar with instant autocomplete redirect.
3. **Medical Dictionary**: English → Tamil translation search, category filters, paginated grid view.
4. **CMS Driven**: All 13 landing page sections (About, Mission, Services, Statistics, Specialized Areas, Workflow Process, Featured Resources) are dynamically fed from MongoDB.
5. **Contact & Contributions**: Validated contact form storing submissions in MongoDB with unread flags for admin review.
6. **Blog Engine**: Dynamic life sciences and translation articles with slug routing.
7. **Shop / Resources**: Digital glossaries and book products with free/discounted badges.
8. **Secure Admin Dashboard**: JWT authentication, session auto-refresh, full CRUD for terms, blog posts, services, stats, products, contacts, and live JSON CMS editor.

---

## 🎨 Soft UI Design System
- Clean white background (`#f8faff`)
- Vibrant blue gradient theme (`#2563eb` to `#60a5fa`)
- Soft shadows, glassmorphic cards, smooth micro-animations (`animate-fade-in-up`, `animate-float`)
