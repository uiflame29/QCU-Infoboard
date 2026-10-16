
# Master Process Flow Breakdown & Figma Make AI Design Specification

**Project Title**: QCU InfoBoard: A Data Visualization and Dashboard System for Institutional Planning at Quezon City University (EduMetrics QCU)  
**Target User Account**: **SPARDS Department Head / Scholarship & Financial Assistance Data Administrator**  
**Account Credentials**: Username: `spardsdepartment.qcu` | Password: `SPARDS@2026`  
**Target Environment**: Figma Make AI / Interactive Clickable High-Fidelity Prototyping Framework  
**Document Scope**: Complete, production-grade Markdown specification detailing the visual design system, system architecture, security workflows, side navigation hierarchy, universal UI controls, and screen-by-screen data visualization blueprints tailored exclusively for the **Scholarship and Placement / Student Affairs & Financial Assistance (SPARDS) Department Suite**.

----------

## 1. Executive Overview & Institutional Purpose

The **QCU InfoBoard (EduMetrics QCU)** is a web-based **Executive Information System (EIS)** engineered to consolidate fragmented university records into real-time visual analytics for Quezon City University leadership. The **SPARDS Department Suite** specifically modernizes student financial aid administration, grant tracking, and socioeconomic mobility monitoring. It eliminates the manual spreadsheet cross-matching, paper application verification, and hand-tallying traditionally required when overseeing scholarship distributions across campus units.

Through this dedicated workstation, the SPARDS Department Head (**`spardsdepartment.qcu`**) can track municipal and national scholarship grants (such as **QCYDO**, **UNIFAST/TES**, and **CHED**), monitor the academic performance and GPA retention of beneficiaries, evaluate socioeconomic household income distributions, process batch scholar masterlists through an administrative validation pipeline, manage digitized scholar document vaults, and export certified compliance reports for the University President, Vice President for Academic Affairs (VPAA), and Quezon City Local Government Unit (LGU) partners.

----------

## 2. Design System Tokens & Visual Palette

To guarantee design continuity across all QCU InfoBoard modules, all Figma components, cards, backgrounds, and interactive elements must adhere strictly to these defined color tokens and layout rules.

### 2.1 Primary Design System Hex Palette

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
│ Highlight Accent│ #FFD066   │ Golden Harvest. Primary KPI stat values, alert│
│                 │           │ notifications, active filter highlights.      │
│ Deep Secondary  │ #4C1413   │ Obsidian Bloom. Dark container headers,       │
│                 │           │ alert card fills, secondary contrast panels.  │
│ Soft Surface    │ #FFDBED   │ Blossom Vapor. Card hover surfaces, modal     │
│                 │           │ overlays, light accent text backgrounds.      │
└─────────────────┴───────────┴───────────────────────────────────────────────┘

```

_(Source Tokens: **`#200D2D`**, **`#BB96E4`**, **`#FFD066`**, **`#4C1413`**, **`#FFDBED`**)_.

### 2.2 College & Academic Department Visual Color Standards

Charts that display data disaggregated by academic colleges must enforce fixed color tokens across all dashboard views to ensure instant visual recognition:

-   **CCS** (College of Computer Studies): Dark Slate / Gray (**`#333333`**)
-   **COE** (College of Engineering): Vibrant Orange (**`#FF6B00`**)
-   **COB** (College of Business): Warm Yellow (**`#FFC700`**)
-   **COA** (College of Accountancy): Forest Green (**`#00875A`**)
-   **COED** (College of Education): Royal Blue (**`#0052CC`**)

### 2.3 Layout Structure, Typography & Styling Guidelines

-   **Typography**: **Inter** font family (clean, modern sans-serif with tall x-height optimized for dense data tables and KPI scorecards).
-   **Bento Grid Containers**: Dashboard cards feature rounded corners (**`16px` to `24px` radius**), soft component drop-shadows (**`0px 8px 24px rgba(32, 13, 45, 0.08)`**), and subtle gradient background fills.
-   **Buttons & Controls**: Fully rounded pill buttons (**`border-radius: 9999px`**) or smooth rounded buttons (**`border-radius: 12px`**) with hover elevation and active state transitions.
-   **Vector Iconography**: Scalable vector graphics (**SVG icons**) for crisp rendering across desktop and high-density viewports.
-   **Real-time Digital Clock Header**: Top bar displays a live digital clock rendering **`MM/DD/YYYY | HH:MM:SS AM/PM`** with ticking seconds alongside global search, notification drawer bell icon, and authenticated user profile details (**`SPARDS Head: spardsdepartment.qcu`**).
-   **Mandatory Confirmation & Toast Subroutines**: All state-altering actions (e.g., archiving scholar profiles, restoring records, submitting validation requests, or logging out) require an explicit **Modal Confirmation Dialog** followed by a **Toast Notification Alert**.

----------

## 3. Security Architecture & SPARDS Authentication Flow

Access to the SPARDS Department Workstation is secured by a **Role-Based Access Control (RBAC)** framework integrated with a NIST-compliant Two-Factor Authentication (2FA) pipeline.

```
[SPARDS Head Sign-In] ──> [Password Check] ──> [Email OTP (10m Expiry)] ──> [Validate Code]
          │                     │                       │                         │
          │ Invalid Credentials │ 3 Failed Attempts     │ Expired / Wrong         │ Valid Code
          ▼                     ▼                       ▼                         ▼
    [Error Alert]  ──>   [Freeze Account]  ──>   [Alert MIS Admin]  ──>  [Route to SPARDS Hub]

```

1.  **Access Gate & Primary Credential Entry**:
    -   The SPARDS Department Head lands on the split-screen sign-in interface.
    -   Enters credentials: **Username**: **`spardsdepartment.qcu`** | **Password**: **`SPARDS@2026`**.
2.  **Primary Credential Check**:
    -   The backend validates hashed credentials against the central user database.
    -   _If Invalid_: Increments the failed attempt counter and displays an enumeration-safe error alert (_"Invalid username, password, or security code"_).
3.  **Two-Factor Authentication (2FA Email OTP)**:
    -   Upon successful password check, a 6-digit numeric One-Time Password (OTP) is dispatched to the SPARDS Head's registered email (**`spardsdepartment@qcu.edu.ph`**).
    -   Code validity follows NIST SP 800-63B guidelines with a **10-minute expiration window**.
4.  **Automated Security Lockout Subroutine**:
    -   Failing password or OTP checks **3 consecutive times** updates the account state to **`Status: FROZEN`**, dispatches a real-time notification alert to MIS System Administrators, and records a security audit log entry.
5.  **Session Routing**:
    -   Valid OTP verification issues an authenticated session token, routing the user directly to the **SPARDS Dashboard Overview**.

----------

## 4. Centralized Side Navigation Hierarchy for SPARDS Account

Header-based navigation buttons are removed. All system modules are consolidated into a collapsible side navigation bar where menu items are dynamically filtered to display SPARDS-specific analytics, data management, and college scholar rosters:

```
📊 DASHBOARDS
 └─ Dashboard Overview

📈 ANALYTICS
 ├─ Scholar Overview
 ├─ Socioeconomic & Income Analytics
 ├─ Scholarship Grant Breakdown
 ├─ Academic Performance & GPA Tracking
 ├─ Scholar Retention & Progression Funnel
 ├─ First-Generation Scholar Analytics
 └─ Disbursement & Financial Aid Analytics

📂 DATA MANAGEMENT
 ├─ Import Data (Validation Request Submission)
 ├─ Scholar Records Management
 └─ Grant Program Management

🏫 COLLEGE DATA
 ├─ CCS Scholars
 ├─ COA Scholars
 ├─ COB Scholars
 ├─ COE Scholars
 └─ COED Scholars

📑 REPORTS
 ├─ Scholarship Reports
 └─ Export Reports

🔍 SEARCH & FILTER
 └─ Search & Filter Portal

```

----------

## 5. Universal SPARDS UI Rules, Controls & Action Buttons

To deliver an interactive, high-fidelity experience, every SPARDS module incorporates these five standardized visual design controls:

1.  **Universal Filtering Engine Bar**: A persistent top filter bar containing slicers for **Academic Year**, **Campus Location**, **College/Department**, **Academic Program**, **Scholarship Type** (QCYDO, UNIFAST/TES, CHED, Academic, LGU/Private Grants), and **Household Income Bracket**. Modifying any filter re-queries the dataset and updates all on-screen charts, scorecards, and data tables in real time.
2.  **Header Global Export Button**: A primary top-right button labeled **`[ Export All Page Data ]`** that compiles all active page content into a print-ready PDF executive briefing or raw XLSX workbook.
3.  **Per-Chart & Per-Table Export Buttons**: Every individual chart card and data table container features a dedicated **`Export`** icon button for granular, specific data extraction.
4.  **`View Chart` Zoomed-In Modal Subroutine**: Each chart card includes a **`View Chart`** button. Clicking it opens an enlarged solo modal overlay displaying full titles, detailed descriptions, hoverable data points, and customized display parameters.
5.  **`[Chart Selection]` Main Page Filter Button**: A primary page control button that opens a dropdown checkbox list of all available charts on that module. The SPARDS Head can check or uncheck specific items to display or enlarge desired visualizations on screen.

----------

## 6. Detailed Screen-by-Screen High-Fidelity Prototype Blueprint

### Screen 6.1: Authentication & 2FA Gatekeeper Modal

-   **Visual Layout**: Split-screen design. Left panel displays QCU official seal, campus artwork, and project header. Right panel contains a dark card container (**`#200D2D`**) with input fields.
-   **Interactive Elements**: **`Username / QCU Email`** field, **`Password`** field, **`Sign In`** pill button (**`#BB96E4`**), and role selector for prototype testing.
-   **2FA OTP Overlay**: 6 individual digit boxes, 10-minute countdown timer (**`09:59`**), **`Resend Code`** link, and **`Verify OTP`** button.

----------

### Screen 6.2: SPARDS Dashboard Overview

-   **Purpose**: Serves as the primary financial assistance command center for the SPARDS Department Head, summarizing university-wide scholarship coverage, active grant allocations, and student aid penetration rates.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ SPARDS Dashboard Overview                                             [09/29/2026 LIVE] │
├─────────────────┬─────────────────┬─────────────────┬─────────────────┬─────────────────┤
│ Total Scholars  │ QCYDO Scholars  │ UNIFAST/TES     │ CHED Scholars   │ LGU/Private Gr. │
│ 6,800 Students  │ 4,000 Scholars  │ 2,000 Scholars  │ 500 Scholars    │ 300 Scholars    │
├─────────────────┴─────────────────┴─────────────────┴─────────────────┴─────────────────┤
│ FILTERS: [AY: 2026-2027 ▼] [Campus: All ▼] [College: All ▼]  [ Export All Page Data ]   │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐ ┌────────────────────────────────────┐ │
│ │ Scholarship Grant Breakdown (Donut)  │ │ Scholars per College (Stacked Col) │ │
│ │ • QCYDO LGU Grant: 4,000 (58.8%)     │ │ • CCS: 2,380  • COE: 1,700         │ │
│ │ • UNIFAST / TES: 2,000 (29.4%)       │ │ • COB: 1,360  • COA: 816           │ │
│ │ • CHED Scholarship: 500 (7.35%)      │ │ • COED: 544                        │ │
│ │ • Private/Institutional: 300 (4.41%) │ │ [View Chart] [Export Chart]        │ │
│ │ [View Chart] [Export Chart]          │ └────────────────────────────────────┘ │
│ └──────────────────────────────────────┘                                        │
│ ┌──────────────────────────────────────┐ ┌────────────────────────────────────┐ │
│ │ Household Income Brackets (Donut)    │ │ Academic Standing Ratio (Pie)      │ │
│ │ • Low Income (< ₱15k): 4,216 (62%)   │ │ • Dean's Lister (GPA ≤ 1.75): 42%  │ │
│ │ • Lower Middle (₱15k-30k): 1,904 (28%)│ • Good Standing (GPA 1.76-2.25): 48%│ │
│ │ • Middle Income (> ₱30k): 680 (10%)   │ │ • At-Risk (GPA > 2.25): 10%        │ │
│ │ [View Chart] [Export Chart]          │ │ [View Chart] [Export Chart]        │ │
│ └──────────────────────────────────────┘ └────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────┘

```

##### Header KPI Summary Cards

1.  **Total Active Scholars**: **`6,800`** students (**`68.0%`** of QCU's 10,000 total enrolled population).
2.  **QCYDO Scholars Count**: **`4,000`** Quezon City Youth Development Office grant recipients.
3.  **UNIFAST / TES Scholars Count**: **`2,000`** Tertiary Education Subsidy beneficiaries.
4.  **CHED Scholars Count**: **`500`** Commission on Higher Education state scholars.
5.  **Private / LGU Institutional Scholars**: **`300`** specialized community and corporate grant holders.

##### Bento Grid Visualizations & Mockup Datasets

Chart Title

Visual Chart Type

Visual Selection Rationale

Mockup Visual Data (Filter: "All")

Staff Benefit & Purpose

**Scholarship Grant Breakdown**

**Donut Chart**

Clearly visualizes proportion distribution across the major financial assistance grant providers.

• **QCYDO Grant**: 4,000 (58.8%)• **UNIFAST / TES**: 2,000 (29.4%)• **CHED Grant**: 500 (7.35%)• **Private/Other**: 300 (4.41%)

**SPARDS Head & LGU**: Monitors municipal vs. national scholarship funding dependencies.

**Scholars per College**

**Stacked Column Chart** (College Color Coding)

Displays scholar volume across colleges using official college color tokens.

• **CCS**: 2,380 (**`#333333`**)• **COE**: 1,700 (**`#FF6B00`**)• **COB**: 1,360 (**`#FFC700`**)• **COA**: 816 (**`#00875A`**)• **COED**: 544 (**`#0052CC`**)

**Deans & SPARDS**: Balances financial assistance allocations proportionately against college populations.

**Household Income Brackets**

**Donut Chart**

Visualizes economic background categories across total scholar enrollees.

• **Low Income** (< ₱15k/mo): 4,216 (62.0%)• **Lower Middle** (₱15k–₱30k): 1,904 (28.0%)• **Middle Income** (> ₱30k): 680 (10.0%)

**SPARDS Head**: Empirically justifies municipal financial aid expansion for low-income families.

**Academic Standing Ratio**

**Pie Chart** (3 Segments)

Tracks scholar academic compliance against retention GPA requirements.

• **Dean's Lister Cohort**: 2,856 (42.0%)• **Good Academic Standing**: 3,264 (48.0%)• **Academic Probation / At-Risk**: 680 (10.0%)

**Guidance & SPARDS**: Flags at-risk scholars early to deploy academic peer-tutoring support.

----------

### Screen 6.3: SPARDS Analytics Sub-Suite (7 Specialized Sub-Views)

The **Analytics** dropdown expands into seven specialized sub-module views:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ SPARDS ANALYTICS SUB-SUITE                                                              │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ Active Sub-View: [ Scholar Overview ▼ ]  Filters: [ College: CCS ▼ ]  [ Program: BSIT ▼ ]│
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ [📊 Scholar Overview] [💵 Socioeconomic] [🎓 Grant Breakdown] [📚 Academic Performance] │
│ [🔄 Retention Funnel] [⭐ First-Gen Scholars] [💳 Disbursement Analytics]               │
└─────────────────────────────────────────────────────────────────────────────────────────┘

```

1.  **`Scholar Overview` Sub-View**:
    -   **KPI Badges**: **`Total Scholars (6,800)`**, **`Scholar Coverage Rate (68.0%)`**, **`Active Grant Programs (12)`**.
    -   **Charts**: Overall scholar distribution across colleges disaggregated by grant provider.
2.  **`Socioeconomic & Income Analytics` Sub-View**:
    -   **Charts**:
        -   _Income Bracket Distribution_: Donut chart disaggregating household income (< ₱15k, ₱15k–₱30k, > ₱30k).
        -   _Parental Employment Breakdown_: Horizontal bar chart tracking parent occupation categories (Government, Private, OFWs, Informal/Self-Employed, Unemployed).
3.  **`Scholarship Grant Breakdown` Sub-View**:
    -   **Charts**: Grouped column chart comparing grant types across colleges (QCYDO, UNIFAST/TES, CHED, Academic Honors, Athletic/Cultural).
4.  **`Academic Performance & GPA Tracking` Sub-View**:
    -   **Charts**: Stacked bar chart rendering GPA distribution per program (**`1.00–1.50: 1,500 scholars`**, **`1.51–2.00: 3,800 scholars`**, **`2.01–2.50: 1,200 scholars`**, **`> 2.50: 300 scholars`**).
    -   **Purpose**: Ensures scholars maintain mandatory grade point averages to retain scholarship eligibility.
5.  **`Scholar Retention & Progression Funnel` Sub-View**:
    -   **Charts**: Funnel chart tracking scholar cohort retention from 1st Year entry through 4th Year graduation (**`1st Yr: 2,500`**, **`2nd Yr: 2,000 [80%]`**, **`3rd Yr: 1,450 [58%]`**, **`4th Yr: 850 [34%]`**).
6.  **`First-Generation Scholar Analytics` Sub-View**:
    -   **Charts**: Grouped column chart contrasting scholarship distributions between First-Generation family college students (**`2,500 First-Gen Scholars`**) and continuing-generation peers (**`4,300 Non-First-Gen Scholars`**).
7.  **`Disbursement & Financial Aid Analytics` Sub-View**:
    -   **Charts**: Line graph tracking quarterly stipend release timelines, disbursement completion percentages, and pending allowance releases.

----------

### Screen 6.4: SPARDS Data Management Suite

#### 6.4.1 Import Data (Validation Request Submission)

Enforces a secure data administrative workflow where raw scholarship masterlists uploaded by SPARDS are submitted to System Admins for review before database integration.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ BATCH DATA INGESTION (SPARDS WORKSTATION)                                               │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ Target Dataset: (•) QCYDO Scholar Masterlist   ( ) UNIFAST/TES Registry                 │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ Drag & Drop Master CSV / XLSX File Here:                                                │
│ ┌─────────────────────────────────────────────────────────────────────────────────────┐ │
│ │  📄 [ QCYDO_Scholars_Masterlist_AY2026.xlsx ] - 4,000 Rows Detected                 │ │
│ └─────────────────────────────────────────────────────────────────────────────────────┘ │
│ [ 🔄 Replace File ]                                       [ 📤 Request Validation ]     │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ SCHEMA VALIDATION PREVIEW (Read-Only)                                                   │
├───────────┬──────────────┬──────────────┬──────────────┬─────────────┬──────────────────┤
│ Row #     │ Student ID   │ Full Name    │ Grant Type   │ Current GPA │ Parsing Status   │
├───────────┼──────────────┼──────────────┼──────────────┼─────────────┼──────────────────┤
│ Row 001   │ 23-2652      │ Naya Alia │ QCYDO_FULL   │ 1.25        │ VALID (Green)    │
│ Row 002   │ 20-2121      │ Alizandra M. │ UNIFAST_TES  │ INVALID_GPA │ ERROR (Red)      │
└───────────┴──────────────┴──────────────┴──────────────┴─────────────┴──────────────────┘
│ ACTIVE VALIDATION REQUESTS (Side Panel Card)                                            │
│ • Request #204: QCYDO_Scholars_AY2026.xlsx ── Status: REQUIRES ACTION (Feedback Thread) │
│   [View Discussion Thread]                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────┘

```

1.  **Dataset Type Selection**: SPARDS Head selects target dataset (**`QCYDO Scholar Masterlist`**, **`UNIFAST/TES Registry`**, or **`CHED Grant Roster`**).
2.  **File Upload & Replacement**: Drags and drops the `.XLSX` file. Clicking **`Replace File`** allows swapping files.
3.  **Read-Only Schema Preview**: Displays row formatting. Direct cell editing is disabled in preview mode, requiring corrections in local master spreadsheets.
4.  **Validation Request Submission**: Clicks **`Request Validation`** (disabled until pre-parser verifies structure) to send the dataset to the Admin Validation Queue.
5.  **Feedback Side Panel**: Displays status trackers (**`Pending`**, **`Validated`**, **`Requires Action`**) and thread buttons to communicate directly with Admin reviewers.

#### 6.4.2 Scholar Records Management & Archive Vault

-   **Global Controls**: Search bar, AY filter, Campus filter, College filter, Program filter, **`[ Generate Report ]`**, **`[ + Add Scholar ]`**, **`[ Reset Filters ]`**.
-   **Roster Data Table Columns**: **`Checkbox | Student ID | Last Name | First Name | Middle Name | College | Program | Scholarship Grant Type | Current GPA | Academic Standing | Grant Status (Active / Suspended) | Actions (View, Edit, Archive)`**.
-   **Archive Subroutine & Vault Page**: Clicking **`Archive`** prompts a confirmation modal. Archiving transfers the profile to the separate **Archive Page**, which lists all archived scholar records with an individual **`Restore`** button for each item.

----------

### Screen 6.5: College Data (Scholarship Scope & Summary Matrix)

Contains dedicated sub-menus for **`CCS Scholars`**, **`COA Scholars`**, **`COB Scholars`**, **`COE Scholars`**, and **`COED Scholars`**.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ DEPARTMENTAL SCHOLARSHIP SUMMARY MATRIX (COLLEGE DATA - CCS SCOPE)                      │
├──────────┬───────────────┬─────────────────┬──────────┬──────────────┬──────────┬───────┤
│ Dept Code│ Department    │ Dept Chair      │ Scholars │ Scholar Cov. │ Avg GPA  │ Actions│
├──────────┼───────────────┼─────────────────┼──────────┼──────────────┼──────────┼───────┤
│ IT-DEPT  │ Info Tech     │ Prof. M. Santos │ 1,224 St.│ 68.0%        │ 1.62     │ [Roster]│
│ CS-DEPT  │ Computer Sci  │ Dr. R. Reyes    │ 680 St.  │ 68.0%        │ 1.55     │ [Roster]│
│ IS-DEPT  │ Info Systems  │ Prof. A. Cruz   │ 476 St.  │ 68.0%        │ 1.70     │ [Roster]│
└──────────┴───────────────┴─────────────────┴──────────┴──────────────┴──────────┴───────┘

```

-   **Departmental Summary Matrix Attributes**: **`Dept Code & Name`**, **`College`**, **`Department Chair Name`**, **`Scholar Headcount`**, **`Scholar Coverage Percentage (%)`**, **`Average Scholar GPA`**, **`Status (Active / Under Review)`**, and a **`View Roster`** action button that filters down to that specific department's scholar roster.

----------

### Screen 6.6: Scholar E-Records Vault & Document Management

Manages digitized scholar compliance files, grade slips, and certificates of indigency.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ SCHOLAR E-RECORDS VAULT                                                                 │
├───────────────────┬───────────────────┬───────────────────┬─────────────────────────────┤
│ Digitized E-Files │ Verified Docs     │ Pending Verif.    │ Active Scholar Badges       │
│ 13,600 Files      │ 12,240 Verified   │ 1,360 Pending     │ 6,800 Issued Badges         │
├───────────────────┴───────────────────┴───────────────────┴─────────────────────────────┤
│ Search: [ Search scholar name, student ID, document title...                          ] │
├───────────────────┬────────────────────────┬───────────┬──────────────┬────────┬────────┤
│ Scholar Name      │ Document Title         │ Category  │ Format & Size│ Status │ Action │
├───────────────────┼────────────────────────┼───────────┼──────────────┼────────┼────────┤
│ Naya Alia      │ QCYDO_GradeSlip_2026.pdf│ Academic  │ PDF (1.8 MB) │VERIFIED│[View]  │
│ Alizandra Martin  │ Cert_Indigency_2026.pdf│ Indigency │ PDF (1.2 MB) │RENEWAL │[View]  │
└───────────────────┴────────────────────────┴───────────┴──────────────┴────────┴────────┘

```

-   **Header KPI Cards**: **`Total Digitized Scholar Files (13,600)`**, **`Verified Documents (12,240)`**, **`Pending Verification (1,360)`**, **`Active Scholar ID Badges (6,800)`**.
-   **Document Vault Columns**: **`Scholar Member Name`**, **`Student ID`**, **`Document Title`**, **`Category (Academic Grade Slip, Indigency Certificate, Enrollment Verification, Oath of Undertaking)`**, **`File Format & Size`**, **`Date Uploaded`**, **`Verification Status (Verified, Pending, Needs Renewal)`**, and **`View File`** button.

----------

### Screen 6.7: SPARDS Certified Reports & Export Engine

Generates pre-formatted financial assistance and scholar compliance reports based on active filter settings.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│              SPARDS CERTIFIED REPORT GENERATION ENGINE                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Active Scope Filter: [Academic Year: 2026-2027] [Grant: QCYDO] [Campus: Main]   │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Select Target Export Data Sub-Modules:                                          │
│  [X] Scholarship Distribution & Grant Coverage Matrix                           │
│  [X] Socioeconomic Income Bracket & First-Gen Scholar Summary                   │
│  [ ] Scholar Academic GPA & Retention Audit                                     │
│  [X] Quarterly Allowance Disbursement Status Report                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Export File Format Selection:                                                   │
│  (•) Formatted PDF Document (Print-Ready LGU / Executive Briefing)              │
│  ( ) Raw Data Excel Workbook (.XLSX Worksheet)                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│ [Cancel]                                            [Generate & Export Report]  │
└─────────────────────────────────────────────────────────────────────────────────┘

```

-   **Report Templates**: _QCYDO Municipal Scholar Masterlist_, _UNIFAST/TES Compliance Summary_, _Scholar Academic Retention Audit_, _First-Generation Financial Aid Impact Report_.
-   **Export Formats**: Formatted PDF Document (print-ready briefing) or Raw XLSX Workbook.

----------

## 7. Interactive Figma Prototyping Pathways & Event Rules

```
[Start SPARDS Session] ──> [Sign-In Screen (spardsdepartment.qcu)]
                                      │
                           (Valid Password & OTP)
                                      │
                           [SPARDS Workstation Hub]
                                      │
 ┌────────────────────────────────────┼────────────────────────────────────┐
 ▼                                    ▼                                    ▼
[Analytics Sub-Suite]        [Data Management]                    [College Data]
 ├─ Scholar Overview          ├─ Import Data (Req. Validation)     ├─ CCS / COE / COB
 ├─ Socioeconomic Profile     ├─ Scholar Records Management        ├─ COA / COED
 ├─ Grant Breakdown           │   └── [Archive Vault & Restore]    └─ Summary Matrix
 ├─ GPA & Retention           ├─ E-Records Vault
 └─ First-Gen Metrics         └─ Certified Reports Engine

```

1.  **Hover Tooltip Interactions**: Visual chart segments, bar stacks, donut slices, and data table rows feature interactive hover states rendering dark floating tooltips with exact numeric values and percentages.
2.  **Universal Slicer Binding**: Selecting options in the Universal Filter Bar triggers smooth animation transitions where all charts re-render dynamically.
3.  **Modal & Drawer Overlays**: Selecting menu buttons slides open the Collapsible Navigation Panel. State-altering decisions trigger confirmation modals followed by toast alerts.

----------

## 8. Verification & Completeness Summary

All requested requirements for the **SPARDS Department Head Account** have been systematically cross-checked and verified:

1.  **Account Credentials**: Username **`spardsdepartment.qcu`** | Password **`SPARDS@2026`**.
2.  **Sidebar Structure**: Added dropdown sub-items under Dashboard, Analytics, Data Management, College Data, and Reports tailored to financial assistance and scholarship tracking.
3.  **KPI Scorecards**: Total Scholars, QCYDO Scholars, UNIFAST/TES Scholars, CHED Scholars, and Private/LGU Grant counts.
4.  **Analytics Visualizations**: Scholarship grant distributions, scholars per college, household income brackets, scholar academic standing ratios, teaching/GPA retention funnels, and first-generation scholar comparisons.
5.  **Data Management & Vault**: Scholar records table, archive page with restore buttons, Departmental Scholarship Summary Matrix, and Scholar E-Records Vault.
6.  **Universal SPARDS Controls**: Individual chart/table export buttons, header global export button, universal filter bar, **`View Chart`** zoomed-in modals, and **`[Chart Selection]`** main page filter button.


