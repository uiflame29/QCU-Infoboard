
### Executive Summary & Scope Verification

The **QCU InfoBoard** (also known as **EduMetrics QCU**) is a web-based **Executive Information System (EIS)** and interactive data visualization platform specifically engineered for Quezon City University. Its primary institutional goal is to eliminate the severe administrative burden of manual queries, spreadsheet cross-matching, and hand-tallying traditionally performed by the **HR, Registrar, and Admissions departments** whenever university leadership requires metrics.

By synthesizing fragmented academic records into real-time, visual key performance indicators (KPIs) and interactive dashboards, the platform empowers decision-makers—such as the University President, Vice President for Academic Affairs (VPAA), Deans, and Department Heads—to conduct immediate data-driven strategic planning, resource allocation, and policy evaluation without administrative delays.

----------

### 1. Global Role & System Architecture

EduMetrics QCU enforces a strict **Role-Based Access Control (RBAC)** model to segregate backend system configuration and data ingestion from executive read-and-filter analytics.

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

#### Role & Permission Matrix (RBAC)

System Role

Authorized QCU Personnel

Access Scope & Permission Level

Real-Life Purpose & Operational Responsibility

**System Administrator**

Management Information Systems (MIS) Staff, Lead Registrar Data Officer, Lead HR Data Officer

**Full CRUD Access** (Create, Read, Update, Delete) across user profiles, data ingestion engines, validation rules, system parameters, and audit logging.

Maintains backend data integrity, ingests masterlists, manages user credentials, unlocks frozen accounts, and ensures security compliance.

**University Executive**

University President, VPAA, Deans (e.g., Dean of CCS, COE), Department Heads

**Read-Only & Filter Access**. Full interactive access to all analytics modules, drill-downs, search bars, and report generation engines.

Analyzes institutional trends, evaluates program capacity, monitors sociological milestones, and exports filtered decision-making reports without altering raw database tables.

----------

#### Universal Filtering Engine & Real-Time Dynamic Binding Rules

To guarantee fluid exploration across all visual modules, a centralized **Universal Filter Bar** sits permanently at the top of every dashboard. Selecting or clearing any filter parameter immediately re-queries the backend visualization index and re-renders all on-screen charts, KPI scorecards, and data grids in real-time.

1.  **Default State**: `"All"` (Captures the complete 10,000+ university dataset across all campuses and academic units).
2.  **Academic Year (AY)**: `2024–2025`, `2025–2026`, `2026–2027`.
3.  **Campus Location**: `San Bartolome (Main)`, `San Francisco`, `Batasan Campus`.
4.  **Colleges / Academic Units**:
    -   `CCS` (College of Computer Studies)
    -   `COE` (College of Engineering)
    -   `COB` (College of Business)
    -   `COA` (College of Accountancy)
    -   `COED` (College of Education)
5.  **Academic Programs**:
    -   _CCS_: Bachelor of Science in Information Technology (`BSIT`), Bachelor of Science in Information Systems (`BSIS`), Bachelor of Science in Computer Science (`BSCS`).
    -   _COE_: Bachelor of Science in Industrial Engineering (`BSIE`), Bachelor of Science in Electronics Engineering (`BSECE`), Bachelor of Science in Computer Engineering (`BSCE`).
    -   _COB_: Bachelor of Science in Entrepreneurship (`BSEntrep`).
    -   _COA_: Bachelor of Science in Accountancy (`BSA`), Bachelor of Science in Management Accounting (`BSMA`).
    -   _COED_: Bachelor of Early Childhood Education (`BECEd`).
6.  **Academic Year Levels**: `1st Year`, `2nd Year`, `3rd Year`, `4th Year`.
7.  **Demographic & Contextual Slicers**:
    -   _Student Slicers_: Age Range Slider (`17–45+`), First-Gen Status (`First-Gen` vs. `Non-First-Gen`).
    -   _Faculty Slicers_: Employment Status (`Full-Time` vs. `Part-Time`).

----------

#### Security & Authentication Architecture

1.  **Two-Factor Authentication (2FA / Email OTP)**: Every login attempt requires a secondary verification step. Upon entering valid primary credentials, a 6-digit numeric One-Time Password (OTP) is dispatched to the user's registered QCU email account. The OTP expires strictly after **10 minutes** per NIST SP 800-63B standards.
2.  **Brute-Force & Enumeration-Safe Security Lockout**:
    -   An account counter tracks consecutive failed credential or OTP validation attempts.
    -   If a user inputs wrong credentials or invalid OTP codes **3 consecutive times**, the system automatically freezes/locks the user account to prevent unauthorized access.
    -   Login responses utilize enumeration-safe error messages (e.g., _"Invalid username, password, or security code"_), preventing malicious actors from discovering valid accounts.
3.  **Security Audit Trails & Immutability**:
    -   Every administrative action (login, failed attempt, data ingestion, user modification, report export) is logged chronologically into an immutable audit table.
    -   Logs capture exact timestamps (`MM/DD/YYYY, HH:MM:SS`), Account Actor, Event Action, Impacted Module, and Source IP Address.

----------

#### System Design Standards & Visual Branding

To ensure consistent Figma prototyping and visual clarity, all UI layouts adhere to strict color guidelines and confirmation flows:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      COLLEGE CHART COLOR STANDARDS                      │
├──────────────┬──────────────────────────┬───────────────────────────────┤
│ College Code │ College Name             │ Defined UI Color Code         │
├──────────────┼──────────────────────────┼───────────────────────────────┤
│ CCS          │ College of Computer Stud.│ Gray / Dark Slate (#333333)   │
│ COE          │ College of Engineering   │ Vibrant Orange (#FF6B00)      │
│ COB          │ College of Business      │ Warm Yellow (#FFC700)         │
│ COA          │ College of Accountancy   │ Forest Green (#00875A)        │
│ COED         │ College of Education     │ Royal Blue (#0052CC)          │
└──────────────┴──────────────────────────┴───────────────────────────────┘

```

-   **Modal Confirmation Standards**: Every state-changing decision (e.g., account deactivation, unlocking a frozen user, committing raw data ingestion, and system logout) must trigger a mandatory **Confirmation Dialog Modal** asking the user to confirm the action, followed by an explicit **Success / Error Toast Dialog**.
-   **Bento-Grid Dashboard Layout**: Inspired by modern data command centers, dashboard widgets are laid out in rounded grid containers, grouping related KPI scorecards and chart cards cleanly to minimize visual fatigue.

----------

### 2. Step-by-Step Breakdown of Process Flows per Sub-Module

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

#### Module A: Authentication & Security Gate

```
[User Signs In] ──> [Validate Password] ──> [Send Email OTP (10m)] ──> [Check OTP Code]
       │                   │                      │                       │
       │ Fail              │ Fail (3x)            │ Expired/Fail          │ Valid
       ▼                   ▼                      ▼                       ▼
 [Error Alert] ──> [Freeze User Account] ──> [Send Admin Alert] ──> [Route by Role (RBAC)]

```

1.  **Access Gate**: User lands on the split-screen sign-in interface.
2.  **Credential Submission**: User enters Username and Password.
3.  **Primary Validation**: Backend validates hashed credentials against the MySQL user registry.
    -   _If Invalid_: Displays enumeration-safe error message _"Invalid credentials"_. Increments failed attempt counter.
4.  **2FA Trigger**: Upon valid password entry, backend generates a random 6-digit code, stores its cryptographic hash, and triggers an email API to dispatch the code.
5.  **OTP Verification**: User enters 6-digit code on the 2FA screen.
    -   _If OTP Fails 3 Consecutive Times_: State machine updates user status to `LOCKED / FROZEN`. Triggers an automated system notification bell alert to the System Admin.
6.  **Role Routing**: Upon successful OTP check, session token is issued, and RBAC middleware routes the user:
    -   `System Admin` \(\rightarrow\) Administrative Control Center (Full CRUD).
    -   `University Executive` \(\rightarrow\) Executive Dashboard (Read/Filter-Only).

----------

#### Module B: System Admin — Data Ingestion & Governance Flow

1.  **Ingestion Navigation**: Administrator opens the **Data Ingestion Module**.
2.  **Flourish-Style File Drag-and-Drop**: Admin drags and drops master datasets (`.CSV` or `.XLSX`) provided by Registrar, HR, or Admissions (e.g., `Enrollees_AY2026_Masterlist.csv`).
3.  **Data Parsing & Schema Validation Subroutine**: The backend automatically parses the file rows and runs validation rules:
    -   Flags missing required attributes (e.g., missing Student ID, missing Income Bracket, invalid Program Code).
    -   Renders an interactive **Flourish-Style Data Grid Modal** highlighting valid rows in green and malformed rows in red.
4.  **In-Line Correction**: Admin corrects malformed cell entries directly within the web table grid interface.
5.  **Database Commit**: Admin clicks _"Commit to Central Database"_. The system pops a mandatory Confirmation Dialog. Upon confirmation, central analytics tables update instantly, and an audit entry is generated.

----------

#### Module C: Interactive Executive Analytics & Drill-Down Flow

1.  **Dashboard Entry**: Executive lands on the primary Executive Dashboard featuring top KPI scorecards.
2.  **Module Switch**: Executive navigates via the left sidebar to **Student Analytics**, **Faculty Analytics**, or **Admission/First-Gen Analytics**.
3.  **Multi-Filter Execution**: Executive selects filter parameters from the Universal Filter Bar (e.g., `Campus: San Bartolome`, `College: CCS`, `Program: BSIT`).
4.  **Real-Time Visualization Rendering**: The frontend sends an asynchronous query request. All charts, graphs, breakdown tables, and KPI badges instantly transition and reflect the filtered subset.
5.  **Interactive Element Drill-Down**: Clicks on specific chart elements (e.g., clicking the _"First-Generation"_ slice on a pie chart) to isolate and filter the entire page view by that specific demographic cohort.
6.  **Certified Report Generation**: Clicks _"Generate Report"_, selects format (`PDF` or `Excel`), and downloads a pre-formatted, timestamped executive summary reflecting the active filter view.

----------

#### Module D: System Admin — User Management & Security Audit Trail

1.  **Account Lifecycle Execution**: Admin opens the User Management data table to perform CRUD operations.
2.  **Account Unlock Subroutine**: If an Executive account is locked due to 3 failed login/OTP attempts, Admin locates the account, clicks _"Unlock Account"_, and confirms via Modal. The system resets the failed counter and sends a temporary password link to the user.
3.  **Audit Log Inspection**: Admin opens the Activity Audit Log portal.
4.  **Log Filtering**: Admin uses the Date Picker (`MM/DD/YYYY`) or Global Search Bar to filter events (e.g., filtering for event type `"Data Export"` or user `"Admin_MIS"`).
5.  **Real-Time Security Notifications**: The notification bell alerts admins whenever sensitive system events occur (e.g., account frozen, bulk data export, schema mismatch during ingestion).

----------

### 3. Detailed Wireframe, Attributes & Prototyping Blueprint

This section provides the complete Figma prototyping structure, UI attributes, realistic sample data (modeled on QCU's 10,000 baseline student population and active faculty), chart selection rationales, and real-life staff benefits.

----------

#### Screen 1: Authentication & 2FA Gatekeeper

-   **Layout Structure**: Split-screen design. Left side features QCU official branding, campus imagery, and project title. Right side contains a white card container with input fields.
-   **UI Elements**:
    -   Input fields: `Username / Email`, `Password`.
    -   Primary Button: `Sign In`.
    -   2FA OTP Modal overlay: 6 separate digit boxes, 10-minute countdown timer, and `Resend Code` link.
-   **Real-Life Purpose & Staff Benefit**: Protects sensitive student socioeconomic records, personal demographic identities, and faculty evaluation details from public web access or unauthorized academic personnel, achieving compliance with Data Privacy regulations.

----------

#### Screen 2: Executive Dashboard (High-Level University Pulse)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ [QCU Logo] EduMetrics QCU - Executive Dashboard      [Search Bar] [🔔] [Profile]│
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

##### Header KPI Scorecard Cards

1.  **Total Enrolled Students**: `10,000` (Displays `+4.2%` increase vs. prior term).
2.  **Overall Gender Ratio**: `54.0% Female` / `46.0% Male` (Compact split bar badge).
3.  **First-Gen Milestone Population**: `3,800` Students (`38.0%` of total headcount).
4.  **Active Faculty Members**: `240` Headcount (`65% Full-Time` / `35% Part-Time`).

##### Chart Visualizations & Prototyping Data

Chart Title & UI Location

Visual Chart Type

Chart Selection Rationale

Mockup Visual Data (Filter: Default "All")

Real-Life Purpose & Beneficiary Staff

**Enrollees per College** _(Top-Left Grid)_

**Donut Chart** (Segmented by College colors)

Ideal for displaying proportions of a whole across 5 academic colleges.

• **CCS**: 3,500 (Gray/Black) • **COE**: 2,500 (Orange) • **COB**: 2,000 (Yellow) • **COA**: 1,200 (Green) • **COED**: 800 (Blue)

**University President & VPAA**: Immediately identifies high-volume colleges requiring larger budget allocations, building space, and administrative staff.

**First-Gen vs. Non-First-Gen Status** _(Top-Right Grid)_

**Pie Chart** (2 Segments)

Clearly contrasts the sociological milestone cohort against the general population.

• **First-Generation Students**: 3,800 (38.0%) • **Non-First-Gen Students**: 6,200 (62.0%)

**Student Affairs & LGU Liaison**: Tracks QCU’s local government mandate to educate first-generation family scholars.

**Gender Disaggregated Distribution** _(Bottom-Left Grid)_

**Grouped Column Chart** (Paired Male/Female bars per college)

Allows direct side-by-side comparison of gender distribution within each specific college.

• **CCS**: 1,800 M / 1,700 F • **COE**: 1,600 M / 900 F • **COB**: 800 M / 1,200 F • **COA**: 400 M / 800 F • **COED**: 200 M / 600 F

**Gender & Development (GAD) Office**: Monitors gender parity across technical and non-technical degree programs.

**Faculty Profile by Academic Rank** _(Bottom-Right Grid)_

**Horizontal Bar Chart**

Ranking structure reads naturally from top to bottom along horizontal bars.

• **Instructor I–III**: 140 • **Assistant Professor**: 65 • **Associate Professor**: 25 • **Full Professor**: 10

**HR Office & Academic Deans**: Evaluates faculty promotion pipelines and accreditation readiness.

-   **Real-Time Dynamic Filter Behavior**: Selecting `College: CCS` dynamically recalculates all Executive KPI cards: Total Enrolled updates to `3,500`, Gender Ratio updates to `51.4% M / 48.6% F`, and First-Gen updates to `1,400 (40.0%)`.

----------

#### Screen 3: Student Demographics Analytics Module

-   **Module Intent**: Provides granular insights into student age, civil status, geographic residency, and program enrollment capacity.
-   **Header KPI Badges**:
    -   **Largest Academic Program**: `BSIT` (1,800 Enrollees).
    -   **Top Female-Majority Program**: `BECEd` (75.0% Female).
    -   **Overall Classroom Capacity Utilization**: `88.5%`.

##### Chart Visualizations & Prototyping Data

Chart Title & UI Location

Visual Chart Type

Chart Selection Rationale

Mockup Visual Data (Filter: Default "All")

Real-Life Purpose & Beneficiary Staff

**Student Geographic Origin** _(Main Grid Top)_

**Horizontal Bar / Heatmap** (Quezon City Districts 1–6)

Displays rank-ordered student residency concentrations across local districts.

• **District 2**: 3,200 (32%) • **District 5**: 2,500 (25%) • **District 1**: 1,800 (18%) • **District 3**: 1,200 (12%) • **District 4**: 800 (8%) • **District 6 / Non-QC**: 500 (5%)

**Registrar & QC LGU**: Informs local scholarship distribution, community bus routes, and satellite campus planning.

**Age Range & Civil Status** _(Main Grid Middle)_

**Stacked Bar Chart**

Shows civil status distribution across defined age brackets.

• **17–20 Yrs**: 7,500 Single, 50 Married • **21–24 Yrs**: 1,800 Single, 200 Married • **25+ Yrs**: 200 Single, 250 Married

**Admissions & Student Affairs**: Helps schedule evening/weekend class sections for older or married working students.

**Program Enrollees & Capacity Utilization** _(Main Grid Bottom)_

**Data Table Grid** with Capacity Gauge Bars

Displays exact numeric figures alongside visual percentage fill meters.

• **BSIT**: 1,800 / 2,000 Capacity (`90%` - Gray) • **BSEntrep**: 1,500 / 1,600 (`93.7%` - Yellow) • **BSA**: 800 / 1,000 (`80%` - Green) • **BSCE**: 600 / 800 (`75%` - Orange)

**Academic Deans & Registrar**: Directly eliminates manual student counting when allocating lab facilities and course sections.

-   **Real-Time Dynamic Filter Behavior**: Adjusting the **Age Range Slider** to `22–30 Years` instantly isolates adult learners, updating the Geographic Origin chart to show District 2 leading with 600 enrollees.

----------

#### Screen 4: Faculty Analytics Module

-   **Module Intent**: Assists HR and Academic Deans in monitoring instructional capacity, faculty qualifications, and employment stability.
-   **Header KPI Badges**:
    -   **Overall Student-to-Faculty Ratio**: `41.6 : 1`.
    -   **Faculty Master's / Ph.D. Qualification Rate**: `62.5%`.
    -   **Full-Time vs. Part-Time Split**: `156 Full-Time` / `84 Part-Time`.

##### Chart Visualizations & Prototyping Data

Chart Title & UI Location

Visual Chart Type

Chart Selection Rationale

Mockup Visual Data (Filter: Default "All")

Real-Life Purpose & Beneficiary Staff

**Faculty Distribution by Department** _(Top-Left Grid)_

**Donut Chart**

Displays department headcount shares using official college colors.

• **CCS**: 75 Faculty (Gray/Black) • **COE**: 55 Faculty (Orange) • **COB**: 45 Faculty (Yellow) • **COA**: 35 Faculty (Green) • **COED**: 30 Faculty (Blue)

**HR Department**: Balances faculty hiring budgets proportionately against student enrollment volume per college.

**Gender & Marital Status Breakdown** _(Top-Right Grid)_

**Grouped Bar Chart**

Evaluates demographic balances across faculty cohorts.

• **Male**: 60 Single, 50 Married • **Female**: 70 Single, 60 Married

**HR Office**: Informs employee benefit administration and institutional wellness initiatives.

**Academic Qualifications & Attainment** _(Bottom Grid)_

**Stacked Column Chart**

Highlights highest degree attained across each department.

• **CCS**: 30 Bachelor's, 35 Master's, 10 Ph.D. • **COE**: 20 Bachelor's, 25 Master's, 10 Ph.D. • **COA**: 10 Bachelor's, 20 Master's, 5 Ph.D.

**VPAA & Quality Assurance**: Ensures faculty qualifications satisfy CHED accreditation standards.

-   **Real-Time Dynamic Filter Behavior**: Selecting `Employment Status: Part-Time` updates the Academic Qualification chart to show that 70% of part-time faculty hold Bachelor's degrees.

----------

#### Screen 5: Admission & First-Generation Milestone Analytics Module

-   **Module Intent**: Fulfills QCU’s core sociological mission by tracking first-generation student progress, household income, and scholarship retention.
-   **Header KPI Badges**:
    -   **Total First-Generation Cohort**: `3,800 Students`.
    -   **Top First-Gen Program Choice**: `BSIT` (1,200 First-Gen Students).
    -   **Total Government Scholars**: `6,800 Students` (QCYDO, CHED, TES).

##### Chart Visualizations & Prototyping Data

Chart Title & UI Location

Visual Chart Type

Chart Selection Rationale

Mockup Visual Data (Filter: Default "All")

Real-Life Purpose & Beneficiary Staff

**Socioeconomic Household Income Brackets** _(Top-Left Grid)_

**Donut Chart**

Visualizes economic background categories across enrollees.

• **Low Income** (< ₱15k/mo): 6,200 (62%) • **Lower Middle** (₱15k–₱30k/mo): 2,800 (28%) • **Middle Income** (> ₱30k/mo): 1,000 (10%)

**Admissions & Student Affairs**: Provides empirical data to justify local government financial aid and subsidy expansion.

**Scholarship Grant Distribution** _(Top-Right Grid)_

**Grouped Column Chart**

Compares scholarship grants between First-Gen and Non-First-Gen students.

• **QCYDO Grant**: 2,500 First-Gen / 1,500 Non-Gen • **UNIFAST / TES**: 1,200 First-Gen / 800 Non-Gen • **CHED Scholarship**: 300 First-Gen / 500 Non-Gen

**Scholarship Office**: Tracks financial support distribution across vulnerable student cohorts.

**First-Gen Year-Level Retention Progression** _(Bottom Grid)_

**Funnel Chart**

Visually illustrates cohort attrition from 1st Year entry through 4th Year graduation.

• **1st Year Entry**: 1,400 First-Gen • **2nd Year Retention**: 1,050 (75%) • **3rd Year Retention**: 800 (57.1%) • **4th Year Graduation**: 550 (39.3%)

**Guidance Counselors & Student Affairs**: Identifies key dropout transition points (e.g., 2nd to 3rd year) to deploy retention interventions.

-   **Real-Time Dynamic Filter Behavior**: Selecting `Scholarship: QCYDO` re-renders the Retention Funnel, showing that QCYDO scholarship recipients maintain a significantly higher 4th-year retention rate (`68%` vs. `39.3%` overall).

----------

#### Screen 6: Automated Certified Report Generation Module

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

-   **Module Intent**: Replaces manual report generation with an instant, certified document export engine.
-   **Real-Life Purpose & Staff Benefit**: Eliminates the 2–3 week delay where Registrar and HR staff had to manually query databases and compile spreadsheets for annual university board meetings. Executives generate certified summaries instantly.

----------

#### Screen 7: System Admin — User Management & Security Portal

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
│ Dean Mark Borromeo│ mborromeo@qcu     │ exec_ccs     │ FROZEN(3x)│ [UNLOCK USER]│
└───────────────────┴───────────────────┴──────────────┴───────────┴──────────────┘

```

-   **Module Intent**: Gives authorized MIS administrators full control over system user accounts, credentials, and access statuses.
-   **UI Elements & Actions**:
    -   Account data table displaying Name, Username, Email, Assigned Role (`System Admin` vs. `University Executive`), Account Status (`ACTIVE`, `FROZEN_LOCKED`, `DEACTIVATED`).
    -   Action Buttons: `Edit Profile`, `Freeze/Deactivate`, `Unlock Account`, `Reset Credentials`.
-   **Real-Life Purpose & Staff Benefit**: Provides immediate internal resolution when an Executive gets locked out after 3 wrong password/OTP attempts, eliminating external IT dependence.

----------

#### Screen 8: System Admin — Data Ingestion & Flourish-Style Validation Portal

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

-   **Module Intent**: Allows MIS staff to upload raw registrar/HR spreadsheets and validate formatting before database integration.
-   **UI Elements**: File Drag-and-Drop Dropzone, Dataset Type Selector (`Registrar Student Masterlist`, `HR Faculty Registry`, `Admissions Survey`), Data Validation Table with line-by-line status flags (`VALID - Green`, `ERROR - Red`).
-   **Real-Life Purpose & Staff Benefit**: Prevents corrupted or misformatted administrative spreadsheets from breaking executive visualizations.

----------

#### Screen 9: System Admin — Activity Audit Logs & Security Portal

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

-   **Module Intent**: Maintains a tamper-proof historical record of all system events for security auditing and accountability.
-   **Header KPI Cards**: Clickable summary filter cards (`Total Logins`, `Failed OTP / Lockouts`, `Data Ingestions`, `Certified Exports`).
-   **Data Attributes**: Timestamp (`MM/DD/YYYY, HH:MM:SS`), Account Actor, Action Description, Impacted Entity, Source IP Address.
-   **Real-Life Purpose & Staff Benefit**: Guarantees complete administrative accountability. If sensitive socioeconomic records are exported, the system identifies who performed the export, when it occurred, and the originating IP address.

----------

