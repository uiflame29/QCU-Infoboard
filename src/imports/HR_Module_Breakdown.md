
### Step-by-Step Process Flow Breakdown: Human Resource (HR) Department Suite

**System Title**: QCU InfoBoard: A Data Visualization and Dashboard System for Institutional Planning at Quezon City University (EduMetrics QCU)  
**Target User Role**: **HR Head / HR Department Data Administrator**  
**Account Credentials**: Username: `hrdepartment.qcu` | Password: `HRDept@2026`

----------

### 1. Account Credentials & Security Authentication Flow

```
[HR Head Sign-In] ──> [Password Check] ──> [Email OTP (10m Expiry)] ──> [Validate Code]
       │                    │                      │                        │
       │ Invalid Credentials│ 3 Failed Attempts    │ Expired / Wrong        │ Valid Code
       ▼                    ▼                      ▼                        ▼
 [Error Alert]  ──>  [Freeze Account]  ──>  [Alert MIS Admin]  ──>  [Route to HR Workstation]

```

1.  **Access Gate & Credential Entry**:
    -   The HR Head arrives at the split-screen sign-in interface.
    -   Enters authorized credentials: **Username**: `hrdepartment.qcu` | **Password**: `HRDept@2026`.
2.  **Primary Credential Verification**:
    -   The backend validates hashed credentials against the user registry.
    -   _If Invalid_: Increments the failed attempt counter and renders an enumeration-safe error alert (_"Invalid username, password, or security code"_).
3.  **Two-Factor Authentication (2FA Email OTP)**:
    -   Upon successful password check, a 6-digit numeric One-Time Password (OTP) is dispatched to the HR Head's registered email (`hrdepartment@qcu.edu.ph`).
    -   Code validity adheres strictly to NIST SP 800-63B standards with a **10-minute expiration window**.
4.  **Automated Security Lockout Subroutine**:
    -   Failing password or OTP checks **3 consecutive times** automatically locks the account (`Status: FROZEN`), dispatches an automated notification bell alert to MIS System Administrators, and records a security audit log entry.
5.  **Session Token Issuance & Role Routing**:
    -   Successful OTP validation issues an authenticated session token, and Role-Based Access Control (RBAC) middleware routes the HR Head directly to the **HR Department Workstation**.

----------

### 2. Side Navigation Architecture & Module Layout for HR Account

All system modules are consolidated into a collapsible side navigation bar where items are dynamically filtered to show HR-specific analytics, data management, and college rosters:

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

### 3. Universal System Rules & Interaction Design Tokens

To ensure consistency across the HR Head workspace, every module enforces these visual and functional standards:

-   **Design System Tokens & Palette**:
    -   **Primary Dark (`#200D2D`)**: Deep Bloodwood / Navy-Purple for sidebar fills, dark container headers, and top accents.
    -   **Secondary Light (`#BB96E4`)**: Ethereal Lilac for active navigation items, hover states, and pill badges.
    -   **Highlight Accent (`#FFD066`)**: Golden Harvest for primary KPI stat values and warning indicators.
    -   **Deep Secondary (`#4C1413`)**: Obsidian Bloom for dark alert card fills.
    -   **Soft Surface (`#FFDBED`)**: Blossom Vapor for card background surfaces and modal overlays.
-   **College Visualization Color Standards**:
    -   **CCS** (College of Computer Studies): Dark Slate / Gray (`#333333`).
    -   **COE** (College of Engineering): Vibrant Orange (`#FF6B00`).
    -   **COB** (College of Business): Warm Yellow (`#FFC700`).
    -   **COA** (College of Accountancy): Forest Green (`#00875A`).
    -   **COED** (College of Education): Royal Blue (`#0052CC`).
-   **Universal Filtering Engine**: Persistent top filter bar (_Academic Year, Campus, College/Department, Program, Employment Type_) that dynamically re-queries the backend and updates all on-screen charts, scorecards, and tables in real time.
-   **Header Global Export Button**: Main top-bar button to export all dynamically displayed page content into a print-ready PDF or raw XLSX file.
-   **Per-Chart & Per-Table Export Buttons**: Every individual chart card and data table contains a dedicated export button for granular data extraction.
-   **`View Chart` Zoomed-In Modal Subroutine**: Clicking `View Chart` on any card opens a solo enlarged modal displaying full titles, detailed descriptions, and hoverable data points.
-   **`[Chart Selection]` Filter Button**: Main page filter button opening a dropdown checkbox menu that lets the HR Head select specific charts to display or enlarge on screen.
-   **Confirmation & Toast Subroutines**: All state-altering decisions (e.g., archiving records, restoring profiles, submitting validation requests) trigger an explicit **Modal Confirmation Dialog** followed by a **Toast Notification Alert**.

----------

### 4. Detailed Module-by-Module Process Breakdown & Sample Datasets

#### Module 4.1: HR Dashboard Overview

Serves as the high-level personnel pulse check for the HR Head.

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

**HR Head**: Monitors total staff distribution and manages departmental payroll allocations.

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

#### Module 4.2: HR Analytics Sub-Suite

A specialized analytical suite covering seven dedicated sub-views:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ HR ANALYTICS SUB-SUITE                                                                  │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ Active View: [ Faculty Overview ▼ ]   Filters: [ College: CCS ▼ ]  [ Program: BSIT ▼ ] │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ [📊 Faculty Overview] [👤 Demographics] [🎓 Academic Rank] [📚 Teaching Load]          │
│ [💼 Employment Status] [⭐ Performance] [🔄 Faculty Retention]                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘

```

1.  **`Faculty Overview` Sub-View**:
    -   **KPI Badges**: `Total Faculty (240)`, `Active Departments (10)`, `Full-Time Ratio (65%)`.
    -   **Charts**: Overall faculty distribution by college using official color tokens.
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

#### Module 4.3: HR Data Management Suite

##### 4.3.1 Import Data (Validation Request Submission)

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

1.  **Dataset Type Selection**: HR Head selects `HR Faculty Registry` or `Employee Masterlist`.
2.  **File Upload & Replacement**: Drags and drops the `.XLSX` file. Clicking **`Replace File`** allows swapping files.
3.  **Read-Only Schema Preview**: Displays row formatting. Direct cell editing is disabled in preview mode, requiring corrections in local spreadsheets.
4.  **Validation Request Submission**: Clicks **`Request Validation`** (disabled until pre-parser verifies structure) to send the dataset to the Admin Validation Queue.
5.  **Feedback Side Panel**: Displays status trackers (`Pending`, `Validated`, `Requires Action`) and thread buttons to communicate with Admin reviewers.

##### 4.3.2 Faculty Records Management

-   **Global Controls**: Search bar, AY filter, Campus filter, Department filter, **`[ Generate Report ]`**, **`[ + Add Faculty ]`**, **`[ Reset Filters ]`**.
-   **Roster Data Table Columns**: `Checkbox | Employee ID | Last Name | First Name | Middle Name | Department | Employment (Full/Part-Time) | QCU Job Position | Status (Active / On Leave) | Date Hired | Actions (View, Edit, Archive)`.
-   **Archive Subroutine & Vault Page**: Clicking `Archive` prompts a confirmation modal. Archiving transfers the profile to the separate **Archive Page**, which lists all archived personnel with an individual **`Restore`** button for each item.

----------

#### Module 4.4: College Data (Faculty Scope)

Contains dedicated sub-menus for `CCS Faculty`, `COA Faculty`, `COB Faculty`, `COE Faculty`, and `COED Faculty`.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ DEPARTMENTAL SUMMARY MATRIX (COLEGE DATA - CCS FACULTY SCOPE)                           │
├──────────┬───────────────┬─────────────────┬──────────┬──────────────┬──────────┬───────┤
│ Dept Code│ Department    │ Department Chair│ Faculty  │ Student-Fac. │ Avg Load │ Actions│
├──────────┼───────────────┼─────────────────┼──────────┼──────────────┼──────────┼───────┤
│ IT-DEPT  │ Info Tech     │ Prof. M. Santos │ 35 Staff │ 42.1 : 1     │ 18 Units │ [Roster]│
│ CS-DEPT  │ Computer Sci  │ Dr. R. Reyes    │ 25 Staff │ 38.5 : 1     │ 18 Units │ [Roster]│
│ IS-DEPT  │ Info Systems  │ Prof. A. Cruz   │ 15 Staff │ 40.0 : 1     │ 21 Units │ [Roster]│
└──────────┴───────────────┴─────────────────┴──────────┴──────────────┴──────────┴───────┘

```

-   **Departmental Summary Matrix Attributes**: `Dept Code & Name`, `College`, `Department Chair Name`, `Faculty Headcount`, `Student-to-Faculty Ratio`, `Average Unit Load`, `Status (Active / On Leave)`, and a **`View Roster`** action button that filters down to that department's faculty.

----------

#### Module 4.5: Faculty E-Records Vault & Document Management

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

#### Module 4.6: HR Reports & Export Portal

Generates pre-formatted HR compliance reports based on active filter selections.

-   **Report Templates**: _Faculty Profile Summary_, _CHED Qualification Compliance Report_, _Departmental Teaching Load Audit_.
-   **Export Formats**: Formatted PDF Document (print-ready briefing) or Raw XLSX Workbook.

----------

### Verification Summary

Every requirement from the source document `HR Account and Modules to be Added & Implemented.pdf` has been verified and incorporated:

1.  **Account Identity**: `username: hrdepartment.qcu` | `password: HRDept@2026`.
2.  **Sidebar Structure**: Added dropdown sub-items under Dashboard, Analytics, Data Management, College Data, and Reports.
3.  **KPI Scorecards**: Employee, Faculty, Admin, Utilities/Maintenance, Security Guard counts.
4.  **Analytics Visualizations**: Employee classifications, full/part-time ratios, student-faculty ratios, qualifications by program, teaching load distributions, and performance metrics.
5.  **Data Management & Vault**: Faculty records table, archive page with restore buttons, Departmental Summary Matrix, and Faculty E-Records Vault.
6.  **Universal HR Controls**: Individual chart/table export buttons, header export button, universal filter bar, `View Chart` zoomed-in modals, and `[Chart Selection]` main page filter button.

----------

