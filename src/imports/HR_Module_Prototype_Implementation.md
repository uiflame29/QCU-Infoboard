
# Figma Make AI Design Specification & Master Process Flow

**Project Title**: QCU InfoBoard: A Data Visualization and Dashboard System for Institutional Planning at Quezon City University (EduMetrics QCU)  
**Target User Account**: **HR Department Head / HR Data Administrator**  
**Account Credentials**: Username: `hrdepartment.qcu` | Password: `HRDept@2026`  
**Target Environment**: Figma Make AI / Interactive Clickable High-Fidelity Prototyping Framework  
**Document Scope**: Complete, production-grade Markdown specification detailing the visual design system, system architecture, security workflows, side navigation hierarchy, universal UI controls, and screen-by-screen data visualization blueprints tailored exclusively for the **Human Resource (HR) Department Suite**.

----------

## 1. Executive Summary & Institutional Purpose

The **QCU InfoBoard (EduMetrics QCU)** is a web-based **Executive Information System (EIS)** designed to consolidate fragmented institutional records into visual, real-time analytics for Quezon City University leadership. The **HR Department Suite** specifically modernizes academic personnel management by replacing manual queries, spreadsheet cross-matching, and hand-tallying traditionally required when tracking faculty metrics, teaching loads, employment statuses, and accreditation compliance.

Through this workstation, the HR Head (`hrdepartment.qcu`) can oversee workforce demographics, monitor student-to-faculty capacity ratios, process batch record submissions through a secure validation pipeline, maintain digitized e-record vaults, and export certified compliance reports for the Vice President for Academic Affairs (VPAA) and university deans.

----------

## 2. Design System Tokens & Visual Palette

To achieve a cohesive, high-end visual layout matching the bento-style design guidelines, all Figma components, cards, backgrounds, and interactive elements must adhere strictly to these defined color tokens and styling rules.

### 2.1 Primary Design System Hex Tokens

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

### 2.2 College & Academic Department Visual Color Standards

Charts that display data disaggregated by academic colleges must enforce fixed color tokens across all dashboard views to ensure instant visual recognition:

-   **CCS** (College of Computer Studies): Dark Slate / Gray (`#333333`)
-   **COE** (College of Engineering): Vibrant Orange (`#FF6B00`)
-   **COB** (College of Business): Warm Yellow (`#FFC700`)
-   **COA** (College of Accountancy): Forest Green (`#00875A`)
-   **COED** (College of Education): Royal Blue (`#0052CC`)

### 2.3 Layout Structure, Typography & Styling Guidelines

-   **Typography**: **Inter** font family (clean, highly readable sans-serif with tall x-height optimized for dense tables and KPI scorecards).
-   **Bento Grid Containers**: Dashboard cards feature rounded corners (`16px` to `24px` radius), soft component shadows (`0px 8px 24px rgba(32, 13, 45, 0.08)`), and soft gradient fills.
-   **Button Elements**: Fully rounded pill buttons (`border-radius: 9999px`) or smooth rounded buttons (`border-radius: 12px`) with subtle hover elevation.
-   **Vector Iconography**: Scalable vector graphics (SVG icons) for all navigational items and action buttons.
-   **Real-time Digital Clock Header**: Top header displays a live clock rendering `MM/DD/YYYY | HH:MM:SS AM/PM` with ticking seconds alongside global search, notification drawer bell icon, and authenticated user account details (`HR Head: hrdepartment.qcu`).
-   **Mandatory Confirmation & Toast Subroutines**: All state-altering decisions (archiving records, restoring profiles, requesting validation, committing uploads, or logging out) require an explicit **Modal Confirmation Dialog** followed by a **Toast Notification Alert**.

----------

## 3. Security Architecture & HR Authentication Flow

Access to the HR Department Suite is governed by a **Role-Based Access Control (RBAC)** model combined with a NIST-compliant Two-Factor Authentication (2FA) pipeline.

```
[HR Head Sign-In] ──> [Password Check] ──> [Email OTP (10m Expiry)] ──> [Validate Code]
       │                    │                      │                        │
       │ Invalid Credentials│ 3 Failed Attempts    │ Expired / Wrong        │ Valid Code
       ▼                    ▼                      ▼                        ▼
 [Error Alert]  ──>  [Freeze Account]  ──>  [Alert MIS Admin]  ──>  [Route to HR Workstation]

```

1.  **Primary Credential Entry**: The HR Head enters Username (`hrdepartment.qcu`) and Password (`HRDept@2026`).
2.  **Credential Check**: Backend validates credentials against hashed entries. If invalid, increments failed attempt counter and displays an enumeration-safe alert (_"Invalid username, password, or security code"_).
3.  **2FA Email OTP Dispatch**: Valid credentials trigger a 6-digit numeric OTP sent to the registered HR email (`hrdepartment@qcu.edu.ph`). The code expires strictly after **10 minutes** per NIST SP 800-63B standards.
4.  **Automated Security Lockout**: Failing password or OTP entries **3 consecutive times** locks the account (`Status: FROZEN`), dispatches an automated notification bell alert to MIS System Administrators, and logs a security audit entry.
5.  **Session Routing**: Successful verification issues an authenticated session token, routing the user directly to the **HR Dashboard Overview**.

----------

## 4. Centralized Side Navigation Architecture for HR Account

Header-based navigation buttons are eliminated. All system modules are consolidated into a collapsible side navigation bar where menu items are dynamically filtered based on HR permissions:

```
📊 DASHBOARDS
 └─ Dashboard Overview

📈 ANALYTICS
 ├─ Faculty Overview
 ├─ Faculty Demographics
 ├─ Academic Rank Analytics
 ├─ Teaching Load Analytics
 ├─ Employment Status Analytics
 ├─ Performance Analytics
 └─ Faculty Retention Analytics

📂 DATA MANAGEMENT
 ├─ Import Data (Validation Request Submission)
 ├─ Faculty Records
 └─ Faculty Performance

🏫 COLLEGE DATA
 ├─ CCS Faculty
 ├─ COA Faculty
 ├─ COB Faculty
 ├─ COE Faculty
 └─ COED Faculty

📑 REPORTS
 ├─ Faculty Reports
 └─ Export Reports

🔍 SEARCH & FILTER
 └─ Search & Filter Portal

```

----------

## 5. Universal HR UI Rules, Controls & Action Buttons

To ensure an interactive experience, every HR module incorporates these four standardized visual design controls:

1.  **Universal Filtering Engine Bar**: A persistent top bar containing filters for _Academic Year_, _Campus_, _College/Department_, _Program_, and _Employment Type_ (Full-Time vs. Part-Time). Adjusting any filter immediately re-queries the dataset and updates all on-screen charts, scorecards, and data tables in real time.
2.  **Header Global Export Button**: A primary top-right button labeled **`[ Export All Page Data ]`** that compiles all active page content into a print-ready PDF executive briefing or raw XLSX spreadsheet.
3.  **Per-Chart & Per-Table Export Buttons**: Every individual chart card and data table container features an **`Export`** icon button for granular, specific data extraction.
4.  **`View Chart` Zoomed-In Modal Subroutine**: Each chart card includes a **`View Chart`** button. Clicking it pops an enlarged solo modal overlay displaying full titles, detailed descriptions, hoverable data points, and customized display settings.
5.  **`[Chart Selection]` Main Page Filter Button**: A primary page control button that opens a dropdown checkbox list of all available charts on that module. The HR Head can check or uncheck specific items to display or enlarge only desired visualizations on screen.

----------

## 6. Detailed Screen-by-Screen High-Fidelity Prototype Blueprint

### Screen 6.1: Authentication & 2FA Gatekeeper Modal

-   **Visual Layout**: Split-screen design. Left panel displays QCU official seal, campus imagery, and project header. Right panel contains a dark container (`#200D2D`) with input fields.
-   **Interactive Elements**: `Username / QCU Email` field, `Password` field, `Sign In` pill button (`#BB96E4`), and a role toggle for prototype demonstration.
-   **2FA OTP Overlay**: 6 digit code entry boxes, 10-minute countdown timer (`09:59`), `Resend Code` link, and `Verify OTP` button.

----------

### Screen 6.2: HR Dashboard Overview

-   **Purpose**: Serves as the high-level personnel command center for the HR Head, summarizing total university headcount and instructional capacity.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ HR Dashboard Overview                                                 [09/29/2026 LIVE] │
├─────────────────┬─────────────────┬─────────────────┬─────────────────┬─────────────────┤
│ Total Employees │ Faculty Headcnt │ Admin Staff     │ Utilities/Maint │ Security Guards │
│ 320 Personnel   │ 240 Headcount   │ 45 Personnel    │ 20 Personnel    │ 15 Guards       │
├─────────────────┴─────────────────┴─────────────────┴─────────────────┴─────────────────┤
│ FILTERS: [AY: 2026-2027 ▼] [Campus: All ▼] [College: All ▼]  [ Export All Page Data ]   │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐ ┌────────────────────────────────────┐ │
│ │ Employees by Classification (Donut)  │ │ Full-Time vs Part-Time (Pie Chart) │ │
│ │ • Faculty / Professors: 240 (75%)    │ │ • Full-Time Faculty: 156 (65%)     │ │
│ │ • Administrative Staff: 45 (14.1%)   │ │ • Part-Time Faculty: 84 (35%)      │ │
│ │ • Utilities & Maint: 20 (6.25%)      │ │ [View Chart] [Export Chart]        │ │
│ │ • Security Guards: 15 (4.69%)        │ └────────────────────────────────────┘ │
│ │ [View Chart] [Export Chart]          │                                        │
│ └──────────────────────────────────────┘                                        │
│ ┌──────────────────────────────────────┐ ┌────────────────────────────────────┐ │
│ │ Student-to-Faculty Ratio (Gauge Widget)│ Qualifications by Program (Column) │ │
│ │ • University Ratio: 41.6 : 1         │ │ • Master's / Ph.D. Rate: 62.5%     │ │
│ │ • Target Benchmark: < 45.0 : 1       │ │ • Doctorate: 35 | Master's: 115    │ │
│ │ [View Chart] [Export Chart]          │ │ [View Chart] [Export Chart]        │ │
│ └──────────────────────────────────────┘ └────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────┘

```

##### Header KPI Summary Cards

1.  **Total Employee Count**: `320` total university personnel.
2.  **Faculty / Professors Count**: `240` instructional staff.
3.  **Administrative Staff Count**: `45` non-teaching office personnel.
4.  **Utilities & Maintenance Staff**: `20` campus physical plant personnel.
5.  **Security Guards Count**: `15` campus security personnel.

##### Bento Grid Visualizations & Mockup Datasets

Chart Title

Visual Chart Type

Visual Selection Rationale

Mockup Visual Data (Filter: "All")

Staff Benefit & Purpose

**Employees by Classification**

**Donut Chart**

Clearly visualizes headcount proportions across the 4 major workforce categories.

• **Faculty/Professors**: 240 (75.0%)• **Administrative Staff**: 45 (14.1%)• **Utilities & Maintenance**: 20 (6.25%)• **Security Guards**: 15 (4.69%)

**HR Head**: Monitors overall workforce distribution and manages departmental payroll allocations.

**Full-Time vs. Part-Time Ratio**

**Pie Chart** (2 Segments)

Contrasts permanent faculty against part-time instructional staff.

• **Full-Time Regular**: 156 (65.0%)• **Part-Time Lecturers**: 84 (35.0%)

**HR Head & Deans**: Evaluates permanent staffing stability and contractual hiring limits.

**Student-to-Faculty Ratio**

**Gauge Widget** with Benchmark Target

Tracks teaching capacity against institutional quality thresholds.

• **University Average**: 41.6 : 1• **Benchmark Limit**: 45.0 : 1 (Green Zone)

**VPAA & HR**: Identifies over-burdened departments needing immediate instructor hiring.

**Qualifications by Program**

**Stacked Column Chart**

Shows highest degree earned across academic programs.

• **Doctorate (Ph.D./Ed.D.)**: 35 (14.6%)• **Master's Degree**: 115 (47.9%)• **Bachelor's Degree**: 90 (37.5%)

**Quality Assurance**: Ensures faculty qualifications satisfy CHED accreditation mandates.

----------

### Screen 6.3: HR Analytics Sub-Suite (7 Specialized Sub-Views)

The **Analytics** dropdown expands into seven specialized sub-module views:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ HR ANALYTICS SUB-SUITE                                                                  │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ Active Sub-View: [ Faculty Overview ▼ ]   Filters: [ College: CCS ▼ ]  [ Program: BSIT ▼ ] │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ [📊 Faculty Overview] [👤 Demographics] [🎓 Academic Rank] [📚 Teaching Load]          │
│ [💼 Employment Status] [⭐ Performance] [🔄 Faculty Retention]                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘

```

1.  **`Faculty Overview` Sub-View**:
    -   **KPI Badges**: `Total Faculty (240)`, `Active Departments (10)`, `Full-Time Ratio (65%)`.
    -   **Charts**: Overall faculty distribution by college using official color tokens (CCS: `#333333`, COE: `#FF6B00`, COB: `#FFC700`, COA: `#00875A`, COED: `#0052CC`).
2.  **`Faculty Demographics` Sub-View**:
    -   **Charts**:
        -   _Gender Aggregation_: Grouped column chart (`Male: 110`, `Female: 130`).
        -   _Marital Status Distribution_: Donut chart (`Single: 130`, `Married: 102`, `Widow/Widower: 8`).
        -   _Age Brackets_: Stacked bar chart (`21–30 Yrs: 45`, `31–40 Yrs: 110`, `41–50 Yrs: 60`, `51+ Yrs: 25`).
3.  **`Academic Rank Analytics` Sub-View**:
    -   **Charts**: Horizontal bar chart rendering academic ranks (`Instructor I–III: 140`, `Assistant Professor: 65`, `Associate Professor: 25`, `Full Professor: 10`).
    -   **Purpose**: Tracks promotional pipelines and salary grade distributions.
4.  **`Teaching Load Analytics` Sub-View**:
    -   **Charts**: Stacked bar chart displaying unit load distribution per program (`18–21 units: 110 faculty`, `12–15 units: 80 faculty`, `Overload >21 units: 50 faculty`).
    -   **Purpose**: Prevents faculty burnout and ensures fair instructional load balancing.
5.  **`Employment Status Analytics` Sub-View**:
    -   **Charts**: Grouped bar chart comparing employment classifications (`Full-Time: 156`, `Part-Time: 84`, `Contractual: 30`) alongside active statuses (`Active: 220`, `On Leave: 10`, `Resigned: 6`, `Retired: 4`).
6.  **`Performance Analytics` Sub-View**:
    -   **Charts**: Stacked column chart rendering annual faculty evaluation scores (`Outstanding: 85`, `Very Satisfactory: 120`, `Satisfactory: 30`, `Needs Improvement: 5`).
7.  **`Faculty Retention Analytics` Sub-View**:
    -   **Charts**: Line graph tracking 5-year turnover rates and tenure retention progression.

----------

### Screen 6.4: HR Data Management Suite

#### 6.4.1 Import Data (Validation Request Submission)

Enforces a secure data pipeline where raw spreadsheet uploads are submitted to System Admins for review before database integration.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ BATCH DATA INGESTION (HR WORKSTATION)                                                  │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ Target Dataset: (•) HR Faculty Registry   ( ) Employee Masterlist                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ Drag & Drop Master CSV / XLSX File Here:                                                │
│ ┌─────────────────────────────────────────────────────────────────────────────────────┐ │
│ │  📄 [ HR_Faculty_Registry_AY2026.xlsx ] - 240 Rows Detected                         │ │
│ └─────────────────────────────────────────────────────────────────────────────────────┘ │
│ [ 🔄 Replace File ]                                       [ 📤 Request Validation ]     │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ SCHEMA VALIDATION PREVIEW (Read-Only)                                                   │
├───────────┬──────────────┬──────────────┬──────────────┬─────────────┬──────────────────┤
│ Row #     │ Employee ID  │ Full Name    │ Department   │ Status      │ Parsing Status   │
├───────────┼──────────────┼──────────────┼──────────────┼─────────────┼──────────────────┤
│ Row 012   │ EMP-23-0102  │ Juan Dela Cruz│ CCS          │ FULL-TIME   │ VALID (Green)    │
│ Row 013   │ EMP-23-0103  │ Maria Santos │ COE          │ INVALID_TAG │ ERROR (Red)      │
└───────────┴──────────────┴──────────────┴──────────────┴─────────────┴──────────────────┘
│ ACTIVE VALIDATION REQUESTS (Side Panel Card)                                            │
│ • Request #102: HR_Faculty_AY2026.xlsx ── Status: REQUIRES ACTION (Feedback Thread)     │
│   [View Discussion Thread]                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────┘

```

1.  **Dataset Selection**: HR Head selects `HR Faculty Registry` or `Employee Masterlist`.
2.  **File Upload & Replacement**: Drags and drops the `.XLSX` file. Clicking **`Replace File`** allows swapping files.
3.  **Read-Only Schema Preview**: Displays row formatting. Direct cell editing is disabled in preview mode, requiring corrections in local spreadsheets.
4.  **Validation Request Submission**: Clicks **`Request Validation`** (disabled until pre-parser verifies structure) to send the dataset to the Admin Validation Queue.
5.  **Feedback Side Panel**: Displays status trackers (`Pending`, `Validated`, `Requires Action`) and thread buttons to communicate with Admin reviewers.

#### 6.4.2 Faculty Records Management & Archive Vault

-   **Global Controls**: Search bar, AY filter, Campus filter, Department filter, **`[ Generate Report ]`**, **`[ + Add Faculty ]`**, **`[ Reset Filters ]`**.
-   **Roster Data Table Columns**: `Checkbox | Employee ID | Last Name | First Name | Middle Name | Department | Employment (Full/Part-Time) | QCU Job Position | Status (Active / On Leave) | Date Hired | Actions (View, Edit, Archive)`.
-   **Archive Subroutine & Vault Page**: Clicking `Archive` prompts a confirmation modal. Archiving transfers the profile to the separate **Archive Page**, which lists all archived personnel with an individual **`Restore`** button for each item.

----------

### Screen 6.5: College Data (Faculty Scope & Summary Matrix)

Contains dedicated sub-menus for `CCS Faculty`, `COA Faculty`, `COB Faculty`, `COE Faculty`, and `COED Faculty`.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ DEPARTMENTAL SUMMARY MATRIX (COLLEGE DATA - CCS FACULTY SCOPE)                          │
├──────────┬───────────────┬─────────────────┬──────────┬──────────────┬──────────┬───────┤
│ Dept Code│ Department    │ Department Chair│ Faculty  │ Student-Fac. │ Avg Load │ Actions│
├──────────┼───────────────┼─────────────────┼──────────┼──────────────┼──────────┼───────┤
│ IT-DEPT  │ Info Tech     │ Prof. M. Santos │ 35 Staff │ 42.1 : 1     │ 18 Units │ [Roster]│
│ CS-DEPT  │ Computer Sci  │ Dr. R. Reyes    │ 25 Staff │ 38.5 : 1     │ 18 Units │ [Roster]│
│ IS-DEPT  │ Info Systems  │ Prof. A. Cruz   │ 15 Staff │ 40.0 : 1     │ 21 Units │ [Roster]│
└──────────┴───────────────┴─────────────────┴──────────┴──────────────┴──────────┴───────┘

```

-   **Departmental Summary Matrix Attributes**: `Dept Code & Name`, `College`, `Department Chair Name`, `Faculty Headcount`, `Student-to-Faculty Ratio`, `Average Unit Load (Units)`, `Status (Active / On Leave)`, and a **`View Roster`** action button that filters down to that department's faculty.

----------

### Screen 6.6: Faculty E-Records Vault & Document Management

Manages digitized personnel records and compliance documents.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ FACULTY E-RECORDS VAULT                                                                 │
├───────────────────┬───────────────────┬───────────────────┬─────────────────────────────┤
│ Digitized E-Files │ Verified Docs     │ Pending Verif.    │ Active RFID Badges          │
│ 1,250 Files       │ 1,100 Verified    │ 120 Pending       │ 240 Issued Badges           │
├───────────────────┴───────────────────┴───────────────────┴─────────────────────────────┤
│ Search: [ Search faculty name, document title, or status...                           ] │
├───────────────────┬────────────────────────┬───────────┬──────────────┬────────┬────────┤
│ Faculty Name      │ Document Title         │ Category  │ Format & Size│ Status │ Action │
├───────────────────┼────────────────────────┼───────────┼──────────────┼────────┼────────┤
│ Dr. Lourdes Decena│ Ph.D._Diploma_Trans.pdf│ Academic  │ PDF (2.4 MB) │VERIFIED│[View]  │
│ Prof. Mark Santos │ CHED_Cert_AY2026.pdf   │ Legal     │ PDF (1.1 MB) │RENEWAL │[View]  │
└───────────────────┴────────────────────────┴───────────┴──────────────┴────────┴────────┘

```

-   **Header KPI Cards**: `Total Digitized E-Files (1,250)`, `Verified Documents (1,100)`, `Pending Verification (120)`, `Active RFID Badges (240)`.
-   **Document Vault Columns**: `Faculty Member Name`, `Document Title`, `Category (Academic, Legal, Medical, Appointment)`, `File Format & Size`, `Date Uploaded`, `Verification Status (Needs Renewal, Pending, Verified)`, and `View File` button.

----------

### Screen 6.7: HR Reports & Export Portal

Generates pre-formatted HR compliance reports based on active filter selections.

-   **Report Templates**: _Faculty Profile Summary_, _CHED Qualification Compliance Report_, _Departmental Teaching Load Audit_.
-   **Export Formats**: Formatted PDF Document (print-ready briefing) or Raw XLSX Workbook.

----------

## 7. Interactive Figma Prototyping Pathways & Event Rules

```
[Start HR Session] ──> [Sign-In Screen (hrdepartment.qcu)]
                                    │
                         (Valid Credentials & OTP)
                                    │
                         [HR Workstation Dashboard]
                                    │
 ┌──────────────────────────────────┼──────────────────────────────────┐
 ▼                                  ▼                                  ▼
[Analytics Sub-Suite]      [Data Management]                  [College Data]
 ├─ Faculty Overview        ├─ Import Data (Req. Validation)   ├─ CCS / COE / COB
 ├─ Demographics            ├─ Faculty Records                 ├─ COA / COED
 ├─ Rank & Qualifications   │   └── [Archive Vault & Restore]  └─ Summary Matrix
 ├─ Teaching Loads          ├─ E-Records Vault
 └─ Retention Metrics       └─ HR Reports Export Engine

```

1.  **Hover Tooltip Interactions**: Visual chart segments, bar stacks, donut slices, and data table rows feature interactive hover states rendering dark floating tooltips with numeric values and percentages.
2.  **Universal Slicer Binding**: Selecting options in the Universal Filter Bar triggers smooth animation transitions where all charts re-render dynamically.
3.  **Modal & Drawer Overlays**: Selecting menu buttons slides open the Collapsible Navigation Panel. State-altering decisions trigger confirmation modals followed by toast alerts.

----------

