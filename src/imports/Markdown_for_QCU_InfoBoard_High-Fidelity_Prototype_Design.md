
# Figma Make AI Master Prompt & High-Fidelity Prototype Specification

**Project Title**: QCU InfoBoard: A Data Visualization and Dashboard System for Institutional Planning at Quezon City University (EduMetrics QCU)  
**Target Environment**: Figma Make AI / Interactive Clickable High-Fidelity Prototyping Framework  
**Document Purpose**: A comprehensive, production-grade Markdown design specification detailing all visual styles, UI component hierarchies, role-based access flows, dynamic dataset bindings, wireframe structures, and sub-module screens.

----------

## 1. Executive Summary & Design System Specifications

### 1.1 Project Mission & Purpose

The **QCU InfoBoard (EduMetrics QCU)** is a web-based **Executive Information System (EIS)** designed to consolidate fragmented institutional records into visual, real-time analytics for Quezon City University leadership. The system eliminates manual queries, spreadsheet cross-matching, and hand-tallying traditionally performed by the **HR, Registrar, and Admissions departments**.

### 1.2 Design System Tokens & Hex Color Palette

To recreate the visual style from the reference UI snippets, all Figma components, cards, backgrounds, and buttons must adhere strictly to these defined hex tokens:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       GLOBAL UI DESIGN TOKEN SYSTEM                         │
├─────────────────┬───────────┬───────────────────────────────────────────────┤
│ Style Role      │ Hex Code  │ Component Application                         │
├─────────────────┼───────────┼───────────────────────────────────────────────┤
│ Primary Dark    │ #200D2D   │ Deep Bloodwood / Navy-Purple. Sidebar, dark   │
│                 │           │ card fills, high-level header backgrounds.    │
│ Secondary Light │ #BB96E4   │ Ethereal Lilac. Active menu selections, hover │
│                 │           │ states, pill badges, soft gradient overlays.  │
│ Accent Highlight│ #FFD066   │ Golden Harvest. Primary KPI stat values, alert│
│                 │           │ notifications, active filter highlights.      │
│ Deep Secondary  │ #4C1413   │ Obsidian Bloom. Dark container headers,       │
│                 │           │ alert card fills, secondary contrast panels.  │
│ Soft Background │ #FFDBED   │ Blossom Vapor. Card hover surfaces, modal     │
│                 │           │ overlays, light accent text backgrounds.      │
└─────────────────┴───────────┴───────────────────────────────────────────────┘

```

### 1.3 College & Academic Department Visual Color Standards

Charts that display data disaggregated by academic units must use these color standards for immediate recognition across screens:

-   **CCS** (College of Computer Studies): Gray / Dark Slate (`#333333`)
-   **COE** (College of Engineering): Vibrant Orange (`#FF6B00`)
-   **COB** (College of Business): Warm Yellow (`#FFC700`)
-   **COA** (College of Accountancy): Forest Green (`#00875A`)
-   **COED** (College of Education): Royal Blue (`#0052CC`)

### 1.4 Typography, Layout Structure & Components

-   **Font Family**: **Inter** (Clean, modern sans-serif with tall x-height).
-   **Card & Container Styling**: Bento-grid layout using rounded corners (`border-radius: 16px` to `24px`), subtle drop-shadows (`0px 8px 24px rgba(32, 13, 45, 0.08)`), and soft gradient background fills.
-   **Button Elements**: Fully rounded pill buttons (`border-radius: 9999px`) or smooth rounded buttons (`border-radius: 12px`) with hover elevation.
-   **Navigation Bar**: Collapsible hide/unhide side navigation bar triggered by a top-left hamburger menu or profile button. When opened, it reveals the logged-in user profile badge, full user account details, assigned RBAC role badge, and active module links.

----------

## 2. Global Role & System Architecture

EduMetrics QCU uses a **Role-Based Access Control (RBAC)** architecture to separate backend administrative maintenance from executive read-and-filter analytics.

```
                                 ┌───────────────────────────────┐
                                 │     QCU InfoBoard System      │
                                 └───────────────┬───────────────┘
                                                 │
                        ┌────────────────────────┴────────────────────────┐
                        ▼                                                 ▼
     ┌─────────────────────────────────────┐           ┌─────────────────────────────────────┐
     │      System Administrator Role      │           │      University Executive Role      │
     ├─────────────────────────────────────┤           ├─────────────────────────────────────┤
     │ • Full CRUD Permissions             │           │ • View & Filter-Only Permissions    │
     │ • Data Ingestion & Schema Parsing   │           │ • Executive Dashboard               │
     │ • Data Validation Subroutine        │           │ • Student Analytics Module          │
     │ • User Account Lifecycle (Unlock)   │           │ • Faculty Analytics Module          │
     │ • System Configuration Parameters   │           │ • Admission/First-Gen Analytics     │
     │ • Security Audit Trail Monitoring   │           │ • Certified Report Generation       │
     └─────────────────────────────────────┘           └─────────────────────────────────────┘

```

### 2.1 Role & Permission Matrix (RBAC)

System Role

Authorized QCU Personnel

Access Scope & Permission Level

Operational Responsibility

**System Administrator**

Management Information Systems (MIS) Staff, Lead Registrar Data Officer, Lead HR Data Officer

**Full CRUD Access** (Create, Read, Update, Delete) across user accounts, data ingestion engines, schema validation rules, system parameters, and audit logging.

Ingests masterlists, manages user accounts, unlocks frozen accounts, validates data schemas, and monitors security logs.

**University Executive**

University President, Vice President for Academic Affairs (VPAA), Deans, Department Heads

**Read-Only & Filter Access**. Interactive access to analytics dashboards, dynamic slicers, global search, and certified report generation.

Evaluates institutional performance, monitors student milestones, plans faculty capacity, and exports certified reports without altering raw database tables.

----------

### 2.2 Universal Filtering Engine & Real-Time Binding Rules

A **Universal Filter Bar** sits permanently at the top of all analytics pages. Selecting or modifying any filter immediately re-queries the dataset and updates all on-screen charts, scorecards, and data tables in real time:

1.  **Default View**: `"All"` (Captures the complete 10,000+ student dataset and active faculty across all campuses).
2.  **Academic Year (AY)**: `2024–2025`, `2025–2026`, `2026–2027`.
3.  **Campus Location**: `San Bartolome (Main)`, `San Francisco`, `Batasan Campus`.
4.  **Colleges / Academic Units**: `CCS`, `COE`, `COB`, `COA`, `COED`.
5.  **Academic Programs**:
    -   _CCS_: `BSIT`, `BSIS`, `BSCS`.
    -   _COE_: `BSIE`, `BSECE`, `BSCE`.
    -   _COB_: `BSEntrep`.
    -   _COA_: `BSA`, `BSMA`.
    -   _COED_: `BECEd`.
6.  **Academic Year Levels**: `1st Year`, `2nd Year`, `3rd Year`, `4th Year`.
7.  **Demographic & Contextual Slicers**:
    -   _Student Slicers_: Age Range Slider (`17–45+`), First-Gen Status (`First-Gen` vs. `Non-First-Gen`).
    -   _Faculty Slicers_: Employment Status (`Full-Time` vs. `Part-Time`).

----------

### 2.3 Authentication, 2FA & Security Architecture

1.  **Two-Factor Authentication (2FA / Email OTP)**: Primary credential validation triggers a 6-digit numeric OTP sent to the user's registered QCU email. The code expires strictly after **10 minutes** per NIST SP 800-63B guidelines.
2.  **Account Lockout Protection**: Entering incorrect passwords or invalid OTP codes **3 consecutive times** automatically freezes/locks the user account to prevent brute-force intrusion.
3.  **Enumeration-Safe Security Messaging**: System error messages use generic wording (e.g., _"Invalid username, password, or security code"_) to prevent unauthorized account discovery.
4.  **Immutable Security Audit Logging**: Every system action (login attempt, account edit, dataset upload, report download) records a chronological, unalterable log entry containing exact Timestamp (`MM/DD/YYYY, HH:MM:SS`), Account Actor, Event Description, Impacted Entity, and Source IP Address.
5.  **Confirmation & Success Dialogs**: Every state-changing decision (unlocking an account, deactivating a user, committing data uploads, system logout) requires a **Confirmation Modal Overlay** followed by a **Success / Error Toast Alert**.

----------

## 3. Step-by-Step Process Flows per Sub-Module

```
                       ┌─────────────────────────────────────┐
                       │     AUTHENTICATION & GATEKEEPER     │
                       └──────────────────┬──────────────────┘
                                          │
                         ┌────────────────┴────────────────┐
                         ▼                                 ▼
         ┌───────────────────────────────┐ ┌───────────────────────────────┐
         │     SYSTEM ADMINISTRATOR      │ │     UNIVERSITY EXECUTIVE      │
         ├───────────────────────────────┤ ├───────────────────────────────┤
         │ 1. Data Ingestion (Flourish)  │ │ 1. Executive Dashboard        │
         │ 2. Schema Data Validation     │ │ 2. Student Analytics          │
         │ 3. User Management & Unlock   │ │ 3. Faculty Analytics          │
         │ 4. Audit Logging & System Conf│ │ 4. Admission / First-Gen      │
         │ 5. Filter & Export Reports    │ │ 5. Filter & Export Reports    │
         └───────────────────────────────┘ └───────────────────────────────┘

```

### Module A: Authentication & Security Gate

```
[User Signs In] ──> [Validate Password] ──> [Send Email OTP (10m)] ──> [Check OTP Code]
       │                   │                      │                       │
       │ Fail              │ Fail (3x)            │ Expired/Fail          │ Valid
       ▼                   ▼                      ▼                       ▼
 [Error Alert] ──> [Freeze User Account] ──> [Send Admin Alert] ──> [Route by Role (RBAC)]

```

1.  **Access Gate**: User lands on the split-screen sign-in view.
2.  **Credential Entry**: User inputs Username and Password.
3.  **Primary Validation**: System validates credentials. If invalid, increments failed attempt counter and shows an enumeration-safe error alert.
4.  **2FA Trigger**: Valid passwords dispatch a 6-digit OTP code to the user's registered QCU email.
5.  **OTP Check**: User submits the 6-digit code. If failed 3 consecutive times, status updates to `FROZEN/LOCKED` and sends a notification bell alert to System Admins.
6.  **Role Routing**: Successful verification issues a session token and routes the user:
    -   `System Administrator` \(\rightarrow\) Administrative Control Center (Full CRUD).
    -   `University Executive` \(\rightarrow\) Executive Dashboard (Read/Filter-Only).

----------

### Module B: System Admin — Data Ingestion & Governance

1.  **Ingestion Navigation**: Administrator selects **Data Ingestion** from the side panel.
2.  **Flourish-Style File Drag-and-Drop**: Admin drags and drops master `.CSV` or `.XLSX` datasets (e.g., `Registrar_Enrollees_AY2026.csv`).
3.  **Data Parsing & Validation Subroutine**: Backend parses rows against database schemas, flagging missing student IDs, invalid gender tags, or missing income brackets. Renders a Flourish-style Data Grid highlighting valid rows in green and malformed rows in red.
4.  **In-Line Cell Editing**: Admin edits malformed cell entries directly within the grid.
5.  **Database Commit**: Clicking _"Commit to Central Database"_ pops a Confirmation Dialog Modal. Upon approval, central analytics update immediately and create an audit log entry.

----------

### Module C: Interactive Executive Analytics & Drill-Down

1.  **Dashboard Landing**: Executive lands on the primary Executive Dashboard.
2.  **Module Switch**: Uses the side panel to navigate to **Student Analytics**, **Faculty Analytics**, or **Admission/First-Gen Analytics**.
3.  **Multi-Filter Execution**: Adjusts top filters (e.g., `Campus: San Bartolome`, `College: CCS`, `Program: BSIT`). All charts, cards, and data tables update in real time.
4.  **Interactive Element Drill-Down**: Clicking a chart segment (e.g., the _"First-Generation"_ slice on a pie chart) filters the page view to isolate that specific demographic group.
5.  **Certified Report Generation**: Clicks _"Generate Report"_, selects format (`PDF` or `Excel`), and downloads a certified institutional document.

----------

### Module D: System Admin — User Management & Security Audit Logging

1.  **Account Lifecycle Execution**: Admin opens User Management to perform CRUD operations.
2.  **Account Unlock Subroutine**: If an Executive account is locked after 3 wrong password/OTP attempts, Admin clicks _"Unlock Account"_, confirms via Modal, resets the counter, and sends a password reset email.
3.  **Audit Trail Review**: Admin opens Activity Audit Logs.
4.  **Log Filtering**: Filters logs using the Date Picker (`MM/DD/YYYY`), filter badges (`Logins`, `Exports`, `Ingestions`), or Search Bar.
5.  **Security Notifications**: The top notification bell alerts admins whenever accounts freeze, large exports occur, or data schema errors are flagged.

----------

## 4. Screen-by-Screen High-Fidelity Prototype Specification

### Screen 1: Authentication & 2FA Gatekeeper

-   **Layout Structure**: Split-screen design. Left panel displays QCU official seal, campus background artwork, and project header. Right panel contains a card container (`#200D2D` dark fill or `#FFFFFF` light fill).
-   **UI Elements**:
    -   Input Fields: `Username / QCU Email`, `Password`.
    -   Primary Button: `Sign In` (`#BB96E4` background fill, rounded pill style).
    -   Prototype Testing Toggle: `[ Executive View | Admin View ]`.
    -   **2FA OTP Modal Overlay**: 6 individual code digit boxes, 10-minute countdown timer (`09:59`), and `Resend Code` button.
-   **Real-Life Purpose & Staff Benefit**: Secures student socioeconomic data, demographic records, and faculty evaluations from unauthorized access, maintaining Data Privacy compliance.

----------

### Screen 2: Executive Dashboard (Main High-Level Pulse)

-   **Wireframe Layout**: Top Header (Search, Notifications, Profile, Collapsible Side Navigation Button) + Universal Filter Bar + 4 Top KPI Scorecards + 2x2 Bento Visualization Grid.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ [≡] [QCU Logo] EduMetrics QCU - Executive Dashboard  [Search Bar] [🔔 3] [Profile]│
├─────────────────────────────────────────────────────────────────────────────────┤
│ FILTERS: [AY: 2026-2027 ▼] [Campus: All ▼] [College: All ▼] [Program: All ▼]     │
├───────────────────┬───────────────────┬───────────────────┬─────────────────────┤
│ Total Enrolled    │ Overall Gender    │ First-Gen Cohort  │ Active Faculty      │
│ 10,000 Students   │ 54% F / 46% M     │ 3,800 (38.0%)     │ 240 Headcount       │
├───────────────────┴───────────────────┴───────────────────┴─────────────────────┤
│ ┌──────────────────────────────────────┐ ┌────────────────────────────────────┐ │
│ │ Enrollees per College (Donut Chart)  │ │ First-Gen Status (Pie Chart)       │ │
│ │ • CCS: 3,500  • COE: 2,500           │ │ • First-Gen Graduates: 3,800 (38%)  │ │
│ │ • COB: 2,000  • COA: 1,200           │ │ • Non-First-Gen: 6,200 (62%)       │ │
│ │ • COED: 800                          │ │                                    │ │
│ └──────────────────────────────────────┘ └────────────────────────────────────┘ │
│ ┌──────────────────────────────────────┐ ┌────────────────────────────────────┐ │
│ │ Gender Breakdown (Grouped Column)    │ │ Faculty Ranks (Horizontal Bar)     │ │
│ │ • CCS: 1,800 M / 1,700 F             │ │ • Instructors: 140                 │ │
│ │ • COE: 1,600 M / 900 F               │ │ • Assistant Professors: 65         │ │
│ │ • COED: 200 M / 600 F                │ │ • Associate / Full Profs: 35       │ │
│ └──────────────────────────────────────┘ └────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘

```

#### Header KPI Scorecard Widgets

1.  **Total Enrolled Students**: `10,000` (`+4.2%` vs prior term).
2.  **Overall Gender Ratio**: `54.0% Female` / `46.0% Male` (Split indicator bar).
3.  **First-Gen Milestone Population**: `3,800 Students` (`38.0%` of total headcount).
4.  **Active Faculty Members**: `240 Headcount` (`65% Full-Time` / `35% Part-Time`).

#### Bento Grid Visualizations & Prototyping Data

Chart Title & UI Position

Visual Chart Type

Chart Selection Rationale

Prototype Visual Data (Filter: "All")

Real-Life Purpose & Beneficiary Staff

**Enrollees per College** _(Top-Left Grid)_

**Donut Chart** (College Color Coding)

Displays proportions across 5 academic colleges clearly.

• **CCS**: 3,500 (`#333333`)• **COE**: 2,500 (`#FF6B00`)• **COB**: 2,000 (`#FFC700`)• **COA**: 1,200 (`#00875A`)• **COED**: 800 (`#0052CC`)

**University President & VPAA**: Identifies high-volume colleges requiring larger budget and classroom allocations.

**First-Gen Milestone Status** _(Top-Right Grid)_

**Pie Chart** (2 Segments)

Contrasts the milestone cohort against the overall student population.

• **First-Gen Graduates**: 3,800 (38.0%)• **Non-First-Gen**: 6,200 (62.0%)

**Student Affairs & LGU Liaison**: Tracks QCU's mandate to educate first-generation family scholars.

**Gender Disaggregated Distribution** _(Bottom-Left Grid)_

**Grouped Column Chart** (Paired Male/Female bars)

Enables side-by-side comparison of gender breakdown per college.

• **CCS**: 1,800 M / 1,700 F• **COE**: 1,600 M / 900 F• **COB**: 800 M / 1,200 F• **COA**: 400 M / 800 F• **COED**: 200 M / 600 F

**Gender & Development (GAD) Office**: Monitors gender balance across technical and non-technical degree programs.

**Faculty Profile by Academic Rank** _(Bottom-Right Grid)_

**Horizontal Bar Chart**

Ranking structures read naturally along horizontal progress bars.

• **Instructors I–III**: 140• **Assistant Professors**: 65• **Associate Professors**: 25• **Full Professors**: 10

**HR Office & Academic Deans**: Evaluates promotion pipelines and faculty accreditation readiness.

----------

### Screen 3: Student Demographics Analytics Module

-   **Module Purpose**: Tracks student age, civil status, residency, and program enrollment capacity.
-   **Header KPI Badges**:
    -   **Largest Academic Program**: `BSIT` (1,800 Enrollees).
    -   **Top Female-Majority Program**: `BECEd` (75.0% Female).
    -   **Overall Classroom Capacity Utilization**: `88.5%`.

#### Bento Grid Visualizations & Prototyping Data

Chart Title & Position

Visual Chart Type

Chart Selection Rationale

Prototype Visual Data (Filter: "All")

Real-Life Purpose & Beneficiary Staff

**Student Geographic Origin** _(Main Grid Top)_

**Horizontal Bar / Heatmap** (QC Districts 1–6)

Ranks student residency concentration across Quezon City districts.

• **District 2**: 3,200 (32%)• **District 5**: 2,500 (25%)• **District 1**: 1,800 (18%)• **District 3**: 1,200 (12%)• **District 4**: 800 (8%)• **District 6 / Non-QC**: 500 (5%)

**Registrar & QC LGU**: Guides community outreach, scholarship allocation, and student transport services.

**Age Range & Civil Status** _(Main Grid Middle)_

**Stacked Bar Chart**

Illustrates civil status distribution across student age brackets.

• **17–20 Yrs**: 7,500 Single, 50 Married• **21–24 Yrs**: 1,800 Single, 200 Married• **25+ Yrs**: 200 Single, 250 Married

**Admissions & Student Affairs**: Informs scheduling of evening/weekend class sections for working adult learners.

**Program Capacity Utilization** _(Main Grid Bottom)_

**Data Table Grid** with Progress Bars

Combines numeric figures with visual capacity meters.

• **BSIT**: 1,800 / 2,000 Cap (`90%` - Gray)• **BSEntrep**: 1,500 / 1,600 (`93.7%` - Yellow)• **BSA**: 800 / 1,000 (`80%` - Green)• **BSCE**: 600 / 800 (`75%` - Orange)

**Academic Deans & Registrar**: Replaces manual counting when assigning lab spaces and section counts.

----------

### Screen 4: Faculty Analytics Module

-   **Module Purpose**: Monitors instructional load, faculty qualifications, and employment stability.
-   **Header KPI Badges**:
    -   **Overall Student-to-Faculty Ratio**: `41.6 : 1`.
    -   **Faculty Master's / Ph.D. Rate**: `62.5%`.
    -   **Full-Time vs Part-Time Split**: `156 Full-Time` / `84 Part-Time`.

#### Bento Grid Visualizations & Prototyping Data

Chart Title & Position

Visual Chart Type

Chart Selection Rationale

Prototype Visual Data (Filter: "All")

Real-Life Purpose & Beneficiary Staff

**Faculty Distribution by Department** _(Top-Left Grid)_

**Donut Chart** (College Color Coding)

Shows department headcount shares using official college colors.

• **CCS**: 75 Faculty (`#333333`)• **COE**: 55 Faculty (`#FF6B00`)• **COB**: 45 Faculty (`#FFC700`)• **COA**: 35 Faculty (`#00875A`)• **COED**: 30 Faculty (`#0052CC`)

**HR Department**: Balances faculty hiring budgets proportionately against student volume.

**Gender & Marital Status** _(Top-Right Grid)_

**Grouped Bar Chart**

Compares demographic variables across faculty cohorts.

• **Male**: 60 Single, 50 Married• **Female**: 70 Single, 60 Married

**HR Office**: Informs employee benefit administration and wellness planning.

**Academic Qualification Ratio** _(Bottom Grid)_

**Stacked Column Chart**

Highlights highest degree earned across departments.

• **CCS**: 30 Bachelor's, 35 Master's, 10 Ph.D.• **COE**: 20 Bachelor's, 25 Master's, 10 Ph.D.• **COA**: 10 Bachelor's, 20 Master's, 5 Ph.D.

**VPAA & Quality Assurance**: Ensures faculty qualifications meet CHED accreditation standards.

----------

### Screen 5: Admission & First-Generation Milestone Analytics Module

-   **Module Purpose**: Tracks socio-economic mobility, first-generation student retention, and scholarship support.
-   **Header KPI Badges**:
    -   **Total First-Generation Cohort**: `3,800 Students`.
    -   **Top First-Gen Program Choice**: `BSIT` (1,200 First-Gen Students).
    -   **Total Government Scholars**: `6,800 Students` (QCYDO, CHED, TES).

#### Bento Grid Visualizations & Prototyping Data

Chart Title & Position

Visual Chart Type

Chart Selection Rationale

Prototype Visual Data (Filter: "All")

Real-Life Purpose & Beneficiary Staff

**Household Income Brackets** _(Top-Left Grid)_

**Donut Chart**

Visualizes economic background categories across enrollees.

• **Low Income** (< ₱15k/mo): 6,200 (62%)• **Lower Middle** (₱15k–₱30k/mo): 2,800 (28%)• **Middle Income** (> ₱30k/mo): 1,000 (10%)

**Admissions & Student Affairs**: Provides data to justify local government financial aid and subsidy expansion.

**Scholarship Grant Distribution** _(Top-Right Grid)_

**Grouped Column Chart**

Compares scholarship grants between First-Gen and Non-First-Gen students.

• **QCYDO Grant**: 2,500 First-Gen / 1,500 Non-Gen• **UNIFAST / TES**: 1,200 First-Gen / 800 Non-Gen• **CHED Scholarship**: 300 First-Gen / 500 Non-Gen

**Scholarship Office**: Tracks financial support distribution across vulnerable student groups.

**First-Gen Year-Level Retention** _(Bottom Grid)_

**Funnel Chart**

Illustrates cohort retention from 1st Year entry through 4th Year graduation.

• **1st Year Entry**: 1,400 First-Gen• **2nd Year Retention**: 1,050 (75%)• **3rd Year Retention**: 800 (57.1%)• **4th Year Graduation**: 550 (39.3%)

**Guidance Counselors & Student Affairs**: Identifies key dropout transition points to deploy retention support.

----------

### Screen 6: Automated Certified Report Generation Module

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│              EXECUTIVE REPORT GENERATION & EXPORT ENGINE                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Active Scope Filter: [Academic Year: 2026-2027] [College: CCS] [Campus: Main]   │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Select Target Export Data Sub-Modules:                                          │
│  [X] Executive KPI Summary Scorecard                                           │
│  [X] Student Enrollment & Gender Disaggregation Matrix                          │
│  [ ] Faculty Profile & Qualification Audit                                       │
│  [X] First-Generation Milestone & Scholarship Distribution                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Export File Format Selection:                                                   │
│  (•) Formatted PDF Document (Print-Ready Executive Briefing)                     │
│  ( ) Raw Data Excel Workbook (.XLSX Worksheet)                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│ [Cancel]                                            [Generate & Export Report]  │
└─────────────────────────────────────────────────────────────────────────────────┘

```

-   **Module Purpose**: Generates print-ready executive summaries or raw spreadsheet exports reflecting active dashboard filter settings.
-   **Real-Life Purpose & Staff Benefit**: Replaces weeks of manual database querying and spreadsheet assembly by Registrar and HR staff before university board meetings with instant certified report exports.

----------

### Screen 7: System Admin — User Management Portal

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ USER MANAGEMENT & ACCOUNT CONTROL CENTER                           [+ Add User] │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Search: [ Search user name, email, or role...                           ]       │
├───────────────────┬───────────────────┬──────────────┬───────────┬──────────────┤
│ Name & Email      │ Username          │ Assigned Role│ Status    │ Quick Actions│
├───────────────────┼───────────────────┼──────────────┼───────────┼──────────────┤
│ Dr. Lourdes Decena│ ldecena@qcu.edu.ph│ exec_vpaa    │ ACTIVE    │ [Edit] [Freeze]│
│ Prof. Roan Fernan │ rfernandez@qcu    │ admin_mis    │ ACTIVE    │ [Edit] [Freeze]│
│ Dean Mark Barra   │ mborromeo@qcu     │ exec_ccs     │ FROZEN(3x)│ [UNLOCK USER]│
└───────────────────┴───────────────────┴──────────────┴───────────┴──────────────┘

```

-   **Module Layout**: Searchable user data grid featuring Name, Email, Username, Assigned RBAC Role, Account Status (`ACTIVE`, `FROZEN_LOCKED`, `DEACTIVATED`), and Quick Action buttons (`Edit Profile`, `Freeze/Deactivate`, `Unlock Account`).
-   **Real-Life Purpose & Staff Benefit**: Provides immediate internal resolution when an Executive account freezes after 3 wrong password/OTP attempts, removing reliance on external IT support.

----------

### Screen 8: System Admin — Data Ingestion & Flourish-Style Validation Portal

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ BATCH DATA INGESTION & SCHEMA VALIDATION ENGINE                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Drag & Drop Master CSV / Excel File Here:                                       │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │  📄 [ Enrollees_AY2026_Masterlist.csv ] - 10,000 Rows Detected               │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────┤
│ SCHEMA VALIDATION PREVIEW TABLE (2 Errors Detected)                             │
├───────────┬────────────┬──────────────┬──────────────┬───────────┬──────────────┤
│ Row #     │ Student ID │ Program Code │ Gender Tag   │ Income    │ Parsing Status│
├───────────┼────────────┼──────────────┼──────────────┼───────────┼──────────────┤
│ Row 1042  │ 23-2652    │ BSIT         │ FEMALE       │ Low       │ VALID (Green)│
│ Row 1043  │ 20-2121    │ BSIS         │ INVALID_TAG  │ Middle    │ ERROR (Red)  │
└───────────┴────────────┴──────────────┴──────────────┴───────────┴──────────────┘
│ [Fix Errors In-Line]                                [Commit Batch to Database]  │
└─────────────────────────────────────────────────────────────────────────────────┘

```

-   **Module Layout**: File Drag-and-Drop Dropzone, Dataset Type Selector (`Registrar Masterlist`, `HR Registry`, `Admissions Survey`), Data Validation Preview Grid highlighting valid rows in green and malformed rows in red with in-line cell editing.
-   **Real-Life Purpose & Staff Benefit**: Prevents corrupted administrative spreadsheets from breaking executive visualizations.

----------

### Screen 9: System Admin — Activity Audit Logs & Security Portal

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ SYSTEM ACTIVITY AUDIT LOGS & SECURITY TRAIL                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ DATE RANGE: [ From: 09/01/2026 ] [ To: 09/24/2026 ]  SEARCH: [ Filter logs... ] │
├───────────────────┬───────────────────┬───────────────────┬─────────────────────┤
│ Total Logins Today│ Failed OTP Alerts │ Data Ingestions   │ Certified Exports   │
│ 42 Events         │ 3 Locked Accounts │ 2 Files Committed │ 14 PDF Reports      │
├───────────────────┴───────────────────┴───────────────────┴─────────────────────┤
│ CHRONOLOGICAL SYSTEM AUDIT TRAIL TABLE                                          │
├────────────────────┬──────────────────┬──────────────────────┬──────────────────┤
│ Exact Timestamp    │ Account Actor    │ Performed Action     │ Source IP        │
├────────────────────┼──────────────────┼──────────────────────┼──────────────────┤
│ 09/24/2026 10:14:02│ admin_ruel       │ COMMIT_DATA_INGESTION│ 192.168.1.45     │
│ 09/24/2026 09:30:11│ exec_vpaa        │ EXPORT_PDF_REPORT    │ 112.201.42.10    │
│ 09/24/2026 08:12:05│ exec_ccs         │ ACCOUNT_LOCKED_3X    │ 112.201.42.88    │
└────────────────────┴──────────────────┴──────────────────────┴──────────────────┘

```

-   **Module Layout**: Date Range Pickers, Search Bar, 4 Top Clickable Filter Scorecards (`Total Logins`, `Failed OTP Alerts`, `Data Ingestions`, `Certified Exports`), and Chronological Audit Trail Grid recording Timestamp (`MM/DD/YYYY, HH:MM:SS`), Account Actor, Action Description, Impacted Entity, and Source IP Address.
-   **Real-Life Purpose & Staff Benefit**: Ensures complete administrative accountability. If sensitive student records are exported, the system logs the exact user, time, and IP address for compliance.

----------

## 5. Complete Figma Interactive Prototype Click Pathways

```
[Start Session] ──> [Sign In Page]
                           │
                 (Valid Password & OTP)
                           │
         ┌─────────────────┴─────────────────┐
         ▼                                   ▼
 [System Administrator]             [University Executive]
   │                                  │
   ├── User Management                ├── Executive Dashboard
   │     └── [Unlock Account Modal]   │     └── [Click Donut Segment -> Filter View]
   ├── Data Ingestion                 ├── Student Analytics
   │     └── [Flourish Data Preview]  ├── Faculty Analytics
   │           └── [Commit Modal]     ├── Admission / First-Gen
   ├── Activity Audit Logs            └── Certified Report Generation
   │     └── [Filter by KPI Card]           └── [Export PDF / Excel Modal]
   └── Logout Modal                     └── Logout Modal

```

1.  **Sign-In Flow**: Submitting credentials on Screen 1 opens the 2FA OTP Modal overlay. Verification routes System Administrators to the Admin Control Panel and University Executives to the Executive Dashboard.
2.  **Side Navigation Drawers**: Clicking the hamburger menu or profile icon slides open the Collapsible Navigation Bar displaying user account details and available module links.
3.  **Filter Interactivity**: Selecting options in the Universal Filter Bar dynamically updates on-screen charts, KPI scorecards, and data tables.
4.  **Modal Overlays**: State-changing actions (unlocking users, committing uploads, report downloads, logging out) trigger a Confirmation Dialog Modal followed by a Success/Error Toast Notification.

----------


