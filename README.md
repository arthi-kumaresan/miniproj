# Compliance Vault - Setup Guide

## Quick Start

### Step 1: Kill any existing Node processes using port 5000
```bash
# In a new terminal:
for /f "tokens=5" %a in ('netstat -ano ^| findstr :5000') do taskkill /f /pid %a
```

### Step 2: Install & Run the Backend (Port 5001)
```bash
cd v2/server
npm install
npm run dev
```

### Step 3: Install & Run the Frontend (Port 5173)
```bash
# Open a SECOND terminal:
cd v2/client
npm install
npm run dev
```

### Step 4: Open in Browser
Navigate to: **http://localhost:5173**

## Project Structure
```
v2/
├── client/                # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/    # Layout, GlassCard, UploadModal
│   │   ├── context/       # AuthContext
│   │   ├── pages/         # Dashboard, Documents, Approvals, Audit, Users, Expiry
│   │   ├── api/           # Axios instance
│   │   └── App.jsx        # All routes
│   └── tailwind.config.js # Premium theme
└── server/                # Express + MongoDB
    ├── models/            # User, Document
    ├── middleware/         # JWT Auth + RBAC
    ├── routes/            # Auth, Documents
    └── index.js           # Server entry (port 5001)
```
"# miniproj" 
