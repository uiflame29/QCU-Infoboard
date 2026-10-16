# 🎓 QCU InfoBoard
### Comprehensive Institutional Data Analytics & Decision Support System
**Quezon City University (QCU)**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-3.10-22c55e?style=for-the-badge)](https://recharts.org/)

---

## 📌 Overview

**QCU InfoBoard** is a centralized, role-based data intelligence and executive decision-support portal engineered for **Quezon City University**. Designed to break down departmental data silos across university operations, the platform empowers university leadership, deans, and administrative heads with real-time analytics, predictive forecasting, and actionable institutional insights across **3 Campuses** and **5 Colleges**.

### Campuses Covered
- 🏛️ **San Bartolome (Main Campus)**
- 🏛️ **Batasan Campus**
- 🏛️ **San Francisco Campus**

### Academic Colleges
- **CCS** — College of Computer Studies (BSIT, BSIS, BSCS)
- **COB** — College of Business (BSBA, BSE)
- **COA** — College of Accountancy (BSA)
- **COE** — College of Engineering (BSEE, BSIE)
- **COED** — College of Education (BECED)

---

## 🚀 Key Modules & Role-Based Portals

The system implements strict **Role-Based Access Control (RBAC)**, tailoring views and data isolation to specific institutional roles:

```
                                  ┌───────────────────────────┐
                                  │      QCU InfoBoard        │
                                  └─────────────┬─────────────┘
                                                │
         ┌──────────────────┬───────────────────┼───────────────────┬──────────────────┐
         │                  │                   │                   │                  │
         ▼                  ▼                   ▼                   ▼                  ▼
┌─────────────────┐ ┌───────────────┐ ┌───────────────────┐ ┌───────────────┐ ┌────────────────┐
│   University    │ │ College Deans │ │    University     │ │ Human Resource│ │    SPARDS      │
│ President & VPAA│ │ (CCS, COB,    │ │    Registrar      │ │ (HR Portal)   │ │ (Scholarships) │
│ Executive Suite │ │  COA, COE, ..)│ │                   │ │               │ │                │
└─────────────────┘ └───────────────┘ └───────────────────┘ └───────────────┘ └────────────────┘
```

### 1. 🏛️ University President & Executive Suite (VPAA)
- **Executive 12-Pillar Strategic Framework**: Institutional KPIs across Curriculum, Educators, Student Engagement, Research, Community Synergy, Supportive Infrastructures, and Governance.
- **Trend Forecasting Center**: Multi-year predictive enrollment projection, graduation trajectory, and attrition modeling.
- **District Choropleth Visualization**: Geospatial student distribution mapping across Quezon City districts (Districts 1 to 6 and surrounding regions).
- **Admission-to-Enrollment Pipeline**: Real-time conversion tracking, first-generation scholar demographics, and household income brackets.

### 2. 🎓 College Dean Portal (Isolated College Intelligence)
- **Departmental Scoping**: Deans are scoped exclusively to their respective college programs.
- **Enrollment & Academic Analytics**: Program capacity utilization, curriculum retention curves, and student performance tracking.
- **Faculty Workload & Roster Management**: Teaching load balancing, credentials, tenure metrics, and faculty distribution.

### 3. 📑 University Registrar Portal
- **Campus & Program Allocation**: Live capacity utilization metrics across the San Bartolome, Batasan, and San Francisco campuses.
- **Enrollment Validation**: Automated comparison between applicant intake records and confirmed enrolled rosters.
- **Data Export & Certification**: Instant institutional summary sheets and historical audit trails.

### 4. 👥 Human Resources (HR) Portal
- **Faculty E-Records**: Digital faculty profile management, educational attainment tracking, and tenure distribution.
- **Faculty Analytics**: Academic rank allocation, department head rosters, and teaching compliance.
- **Data Ingestion**: Bulk import for employee master data with built-in format validation.

### 5. 🏅 SPARDS (Scholarships & Financial Assistance Portal)
- **Grant & Scholarship Analytics**: Distribution tracking for university, LGU, and private foundation grants.
- **First-Generation Student Intelligence**: Progression, retention, and graduation metrics for first-in-family college students.
- **Household Income & Equity Monitoring**: Socioeconomic bracket analysis to ensure equitable resource distribution.

### 6. ⚙️ System Administrator Portal
- **User Provisioning & Security**: User creation, role reassignment, password reset workflows, and account freezing.
- **Data Ingestion Engine**: Staged CSV/Excel data loading, data validation rule checks, and error remediation.
- **Comprehensive Audit Logs**: Detailed chronological action history tracking data submissions, logins, and schema modifications.

---

## 📊 Core Features & Interactive Capabilities

- 🔍 **Global Multi-Dimensional Filters**: Instantly slice and dice institutional data by Academic Year, Semester, Campus, College, Academic Program, Year Level, Socioeconomic Status, and Scholar Type.
- 📈 **Dynamic Visualizations with Recharts**: Responsive Bar Charts, Composed Trend Lines, Donut Distributions, Radar Competency Maps, and Treemaps.
- 🗺️ **Quezon City Geospatial Mapping**: Interactive SVG choropleth mapping illustrating density of student origins by QC legislative district.
- 📥 **Flexible Data Exporting**: One-click export for datasets, charts, and summary reports to Excel/CSV and printable formats.
- 🔐 **Simulated Two-Factor Authentication (OTP)**: Secure authentication flow featuring simulated one-time password verification for executive and administrative accounts.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/) |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Chart Visualizations** | [Recharts 3.10](https://recharts.org/) |
| **State Management** | React Context API with persistent session simulation |
| **Build & Tooling** | Rolldown-powered Vite build with zero-config HMR |

---

## ⚡ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (Version 9 or higher) or `pnpm`

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/uiflame29/QCU-Infoboard.git
   cd QCU-Infoboard
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser and navigate to:
   ```
   http://localhost:8443
   ```
   *(or `http://localhost:5173` depending on port availability)*

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🔑 Demo & Test Accounts

Use any of the following pre-configured credentials to explore the different role portals. When prompted for OTP verification, use `123456`.

| Portal Role | Username | Password | Default Scope |
|---|---|---|---|
| **University President** | `doc.atienza` | `DocAtienza@2026` | University-wide / Executive |
| **VP Academic Affairs** | `vpaa.qcu` | `VPAA@2026` | University-wide Academic |
| **Dean, Computer Studies** | `dean_ccs` | `Dean@123` | College of Computer Studies (CCS) |
| **Dean, Engineering** | `dean_coe` | `Dean@123` | College of Engineering (COE) |
| **Dean, Business** | `dean_cob` | `Dean@123` | College of Business (COB) |
| **Dean, Education** | `dean_coed` | `Dean@123` | College of Education (COED) |
| **University Registrar** | `registrar.qcu` | `Registrar@2026` | Enrollment & Student Records |
| **HR Department Head** | `hrdepartment.qcu` | `HRDept@2026` | Faculty & Personnel Records |
| **SPARDS Scholarship Head** | `spardsdepartment.qcu` | `SPARDS@2026` | Scholarships & Grants |
| **System Administrator** | `admin_mis` | `Admin@123` | Full Administrative Privileges |

> **OTP Code**: `123456` (applies to all accounts)

---

## 📂 Project Architecture

```plaintext
QCU-INFOBOARD/
├── .figma/                 # Figma design tokens and site configuration
├── src/
│   ├── assets/             # Branding imagery, university logos, and QC district SVG maps
│   ├── components/         # Reusable UI widgets (Layout, FilterBar, AnalyticsChartCard, Modals, Toasts)
│   ├── context/            # Global AppContext (active user, filters, navigation state)
│   ├── data/               # Mock datasets, institutional baselines, and demo credentials
│   ├── imports/            # System architecture specifications and departmental briefs
│   ├── screens/            # Application portals and analytics screens
│   │   ├── admin/          # Admin Dashboard, User Management, Audit Logs, Data Ingestion
│   │   ├── hr/             # HR Analytics, Faculty E-Records, Staff Rosters
│   │   ├── president/      # Executive Dashboard, Forecasting, Strategic Pillars
│   │   ├── spards/         # Scholarship Analytics, Scholar Rosters, Grants
│   │   ├── AdmissionAnalytics.tsx
│   │   ├── DeanDashboard.tsx
│   │   ├── RegistrarDashboard.tsx
│   │   └── StudentAnalytics.tsx
│   ├── App.tsx             # Main router and screen dispatch component
│   ├── index.css           # Global Tailwind CSS imports and theme configuration
│   └── main.tsx            # Application entrypoint
├── package.json            # Dependencies and npm scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build and server settings
```

---

## 🤝 Contributing & Pull Request Policy

Contributions, improvements, and feature proposals are welcome! To maintain system stability and code security, the repository follows a strict **Pull Request (PR)** review process:

1. **Fork the Repository** to your own GitHub account.
2. **Create a Feature Branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes:**
   ```bash
   git commit -m "feat: Add new analytics view for campus energy"
   ```
4. **Push to your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request**: Submit a PR to the `main` branch of this repository.
6. **Review & Approval**: The repository maintainer will review the code, verify design alignment, and accept (merge) or reject (close) the request.

---

## 📄 License & Attribution

Developed for **Quezon City University (QCU)**. All institutional logos, district mappings, and institutional data architectures remain the intellectual property of Quezon City University.
