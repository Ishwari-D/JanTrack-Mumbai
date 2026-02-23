<div align="center">

# 🏛️ JanTrack Mumbai

### Civic Awareness & Candidate Transparency Platform

*Empowering Citizens. Strengthening Democracy.*

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI_Powered-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

---

**1,578+ Candidates** · **227 Wards** · **1,600+ Promises Tracked** · **AI-Powered Insights**

[🚀 Get Started](#-getting-started) · [✨ Features](#-features) · [🛠️ Tech Stack](#%EF%B8%8F-tech-stack) · [📁 Structure](#-project-structure) · [🗺️ Roadmap](#%EF%B8%8F-roadmap)

</div>

---

## 📌 About

> In local and general elections, voters lack access to clear, consolidated information about candidates — their assets, criminal records, promises, and performance. **JanTrack Mumbai** bridges this gap.

JanTrack Mumbai is a **digital report card** for election candidates. It gives Mumbai's citizens real-time, verified data on local candidates, tracks their promises, lets citizens report civic issues, and visualizes constituency-level information through interactive dashboards and maps.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📊 Candidate Intelligence
- **1,578+ verified profiles** with assets, education, criminal records
- Side-by-side **candidate comparison** tool
- **Promise tracking** — monitor manifesto fulfillment
- Asset declarations formatted in ₹ Crores
- Filter & search across all 227 wards

</td>
<td width="50%">

### 🤖 AI Assistant — "Jan Sahayak"
- Powered by **Google Gemini**
- Queries live MongoDB data — **zero hallucinations**
- Natural language: *"Who has the most assets in Ward 45?"*
- Context-aware responses from real candidate database
- Handles civic questions, comparisons, and lookups

</td>
</tr>
<tr>
<td width="50%">

### 🗺️ Interactive Ward Maps
- All **227 Mumbai wards** on Leaflet + OpenStreetMap
- Candidate distribution by constituency
- Interactive navigation and route planning
- Visual ward boundary exploration

</td>
<td width="50%">

### 🗣️ Civic Issue Reporting
- 📍 Geolocation tagging for precise issue location
- 📸 Photo evidence upload via **Cloudinary**
- Status tracking on reported issues
- Feedback and reporting system

</td>
</tr>
<tr>
<td colspan="2">

### 🔐 Multi-Layer Admin Security

```
┌──────────────────────────────────────────────────────────────────────┐
│                        Admin Login Flow                              │
│                                                                      │
│   Step 1: Username + Password ──→ scrypt hash verification           │
│   Step 2: 👤 Facial Recognition ──→ face-api.js (sub-admins only)   │
│   Step 3: 📱 OTP Verification ──→ Email via Resend (all admins)     │
│   Step 4: ✅ Session Created ──→ express-session + memorystore       │
│                                                                      │
│   Main Admin: Password + OTP                                        │
│   Sub-Admin:  Password + Face + OTP                                 │
└──────────────────────────────────────────────────────────────────────┘
```

- **Main admin** creates and manages sub-admin accounts
- Face enrollment and verification for sub-admins
- Candidate CRUD operations (add/edit/delete profiles)
- Issue report review and management

</td>
</tr>
</table>

### 🎨 UI & Experience
- 🌗 **Dark/Light mode** toggle (next-themes)
- 📱 **Responsive design** — desktop, tablet, mobile
- ✨ **Smooth animations** via Framer Motion
- 📈 **Interactive charts** with Recharts
- ⚡ **Gzip compression** for fast loading

---

## 🛠️ Tech Stack

<table>
<tr>
<th align="left">Layer</th>
<th align="left">Technology</th>
<th align="left">Purpose</th>
</tr>
<tr><td rowspan="7"><strong>Frontend</strong></td>
<td>React 19 + Vite 7</td><td>UI framework + blazing-fast bundler</td></tr>
<tr><td>Tailwind CSS v4</td><td>Utility-first styling</td></tr>
<tr><td>Radix UI</td><td>Accessible component primitives</td></tr>
<tr><td>TanStack Query</td><td>Server state management & caching</td></tr>
<tr><td>Wouter</td><td>Lightweight client-side routing</td></tr>
<tr><td>Leaflet + React-Leaflet</td><td>Interactive maps</td></tr>
<tr><td>Recharts + Framer Motion</td><td>Charts & animations</td></tr>
<tr><td rowspan="6"><strong>Backend</strong></td>
<td>Express.js v5</td><td>HTTP server & API</td></tr>
<tr><td>MongoDB Atlas + Mongoose</td><td>Primary database (candidates, issues, etc.)</td></tr>
<tr><td>PostgreSQL + Drizzle ORM</td><td>Auth database (users table only)</td></tr>
<tr><td>Passport.js</td><td>Authentication (Local Strategy)</td></tr>
<tr><td>face-api.js</td><td>Facial recognition for sub-admin auth</td></tr>
<tr><td>Zod</td><td>Runtime schema validation</td></tr>
<tr><td rowspan="4"><strong>Services</strong></td>
<td>Google Gemini API</td><td>AI chatbot intelligence</td></tr>
<tr><td>Cloudinary</td><td>Image hosting & optimization</td></tr>
<tr><td>Resend</td><td>Email OTP delivery</td></tr>
<tr><td>OpenStreetMap</td><td>Map tiles & geographic data</td></tr>
<tr><td><strong>Data Eng.</strong></td>
<td>Python (pymongo, pandas)</td><td>Data cleaning, sync, and transformation scripts</td></tr>
</table>

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18 — [Download](https://nodejs.org/)
- **Python** ≥ 3.8 — [Download](https://www.python.org/) *(optional, for data scripts)*
- **Git** — [Download](https://git-scm.com/)

### Quick Start

```bash
# 1. Clone
git clone https://github.com/OmkarD09/JanTrack-Mumbai.git
cd JanTrack-Mumbai

# 2. Install
npm install

# 3. Configure — create .env in root
```

```env
MONGODB_URI=your_mongodb_atlas_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RESEND_API_KEY=your_resend_key
GEMINI_API_KEY=your_gemini_key
```

```bash
# 4. Run
npm run dev
```

> App runs at **http://localhost:5000** (API + client served together)

### All Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run dev:client` | Start Vite frontend only |
| `npm run build` | Production build (client + server) |
| `npm start` | Run production server |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push Drizzle schema to PostgreSQL |
| `python sync_engine.py` | Sync JSON → MongoDB |
| `python scripts/update_assets.py` | Format asset values |
| `python scripts/update_genders.py` | Auto-assign gender data |

---

## 📁 Project Structure

```
JanTrack-Mumbai/
│
├── client/                         # ⚛️  React Frontend
│   ├── src/
│   │   ├── App.tsx                 # Root component + routing
│   │   ├── pages/                  # Route pages
│   │   │   ├── home.tsx            #   Landing page with live stats
│   │   │   ├── dashboard.tsx       #   Data dashboard & charts
│   │   │   ├── candidates.tsx      #   Candidate listing & search
│   │   │   ├── candidate-profile.tsx   # Individual candidate view
│   │   │   ├── compare.tsx         #   Side-by-side comparison
│   │   │   ├── ward-map.tsx        #   Interactive Leaflet map
│   │   │   ├── report-issue.tsx    #   Civic issue form
│   │   │   ├── auth.tsx            #   Login / Register
│   │   │   ├── about-us.tsx        #   About the platform
│   │   │   ├── admin/              #   Admin dashboard (6 files)
│   │   │   └── not-found.tsx       #   404 page
│   │   ├── components/             # Reusable UI components (64 files)
│   │   ├── hooks/                  # Custom React hooks
│   │   └── lib/                    # Utility functions
│   └── public/                     # Static assets
│
├── server/                         # 🖥️  Express Backend
│   ├── index.ts                    # Entry point + middleware
│   ├── routes.ts                   # All API endpoints
│   ├── auth.ts                     # Passport + face + OTP auth
│   ├── storage.ts                  # Data access layer
│   ├── db.ts                       # MongoDB connection
│   ├── models/                     # Mongoose schemas
│   │   ├── Candidate.ts
│   │   ├── Issue.ts
│   │   ├── Admin.ts
│   │   ├── User.ts
│   │   ├── Report.ts
│   │   ├── Feedback.ts
│   │   └── ActivityLog.ts
│   └── lib/                        # Service integrations
│       ├── gemini.ts               #   Google Gemini AI
│       ├── cloudinary.ts           #   Image uploads
│       └── email.ts                #   Email / OTP
│
├── shared/
│   └── schema.ts                   # Drizzle schema + TS interfaces + Zod
│
├── scripts/                        # 🐍 Python data pipelines
│   ├── update_assets.py
│   ├── update_genders.py
│   └── ...
│
├── script/                         # 📜 TS utility scripts
│   ├── build.ts                    # Production build
│   ├── seed.ts                     # DB seeding
│   └── ...
│
├── sync_engine.py                  # JSON → MongoDB sync
├── data_stream.json                # Candidate data source
└── package.json
```

---

## 🔒 Security

<table>
<tr><th>Feature</th><th>Status</th><th>Implementation</th></tr>
<tr><td>Facial Recognition</td><td>✅</td><td>face-api.js (sub-admin login)</td></tr>
<tr><td>OTP Verification</td><td>✅</td><td>Email via Resend API</td></tr>
<tr><td>Password Hashing</td><td>✅</td><td>scrypt + salt (Node.js crypto)</td></tr>
<tr><td>Multi-Factor Auth</td><td>✅</td><td>Password + Face + OTP</td></tr>
<tr><td>Session Management</td><td>✅</td><td>express-session + memorystore</td></tr>
<tr><td>Input Validation</td><td>✅</td><td>Zod schemas on endpoints</td></tr>
<tr><td>CORS</td><td>✅</td><td>Origin-based configuration</td></tr>
<tr><td>Compression</td><td>✅</td><td>Gzip via compression middleware</td></tr>
<tr><td>Helmet.js</td><td>🔲</td><td>Planned — security headers</td></tr>
<tr><td>Rate Limiting</td><td>🔲</td><td>Planned — express-rate-limit</td></tr>
<tr><td>CSRF Protection</td><td>🔲</td><td>Planned — token-based</td></tr>
<tr><td>Audit Logging</td><td>🔲</td><td>Planned — full action tracking</td></tr>
<tr><td>Redis Sessions</td><td>🔲</td><td>Planned — replace memorystore</td></tr>
</table>

---

## 🗺️ Roadmap

```
Phase 1 — Core Platform                          ████████████████████  Done ✅
Phase 2 — Security Hardening                     ░░░░░░░░░░░░░░░░░░░░  Next 🎯
Phase 3 — Performance & Accessibility            ░░░░░░░░░░░░░░░░░░░░  Planned
Phase 4 — Feature Expansion                      ░░░░░░░░░░░░░░░░░░░░  Planned
Phase 5 — Scale & Expand                         ░░░░░░░░░░░░░░░░░░░░  Future
```

| Phase | What's Included |
|---|---|
| **1. Core** ✅ | Candidate profiles, AI chatbot, ward maps, issue reporting, admin dashboard, facial + OTP auth, dark mode, responsive UI |
| **2. Security** 🎯 | Helmet.js, rate limiting, CSRF protection, audit logging, Redis sessions, input sanitization |
| **3. Performance** | PWA, code splitting, lazy loading, WCAG 2.1 AA, keyboard navigation, Lighthouse optimization |
| **4. Features** | Multilingual (Marathi, Hindi), community voting, analytics dashboard, push notifications, mobile apps |
| **5. Scale** | Multi-city (Pune, Delhi, Bangalore), election results, community forums, public APIs |

---

## 🤝 Contributing

```bash
# Fork → Clone → Branch → Commit → Push → PR
git clone https://github.com/OmkarD09/JanTrack-Mumbai.git
git checkout -b feature/your-feature
git commit -m "Add your feature"
git push origin feature/your-feature
# Open a Pull Request on GitHub
```

---

## 📝 License

**MIT License** — Copyright (c) 2024 JanTrack Mumbai Team

---

<div align="center">

### 🙏 Acknowledgments

**Election Commission of India** · **Mumbai Municipal Corporation** · **Google Gemini Team** · **Open Source Community**

---

**Built with ❤️ for better civic engagement**

[⬆ Back to Top](#%EF%B8%8F-jantrack-mumbai)

</div>
