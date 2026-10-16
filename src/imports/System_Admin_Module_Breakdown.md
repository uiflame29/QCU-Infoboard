
### Executive Overview & Architectural Evolution

The **QCU InfoBoard (EduMetrics QCU)** is a web-based **Executive Information System (EIS)** and interactive data visualization platform specifically engineered for Quezon City University. Its primary institutional mission is to eliminate the severe administrative burden of manual queries, spreadsheet cross-matching, and hand-tallying traditionally performed by the **HR, Registrar, and Admissions departments** whenever university leadership requires metrics.

To achieve a higher level of operational security, maintain strict data integrity, and provide seamless usability across administrative tiers, the system architecture has undergone a comprehensive functional overhaul:

1.  **Centralized Functional Sidebar Navigation**: Header-based navigation buttons have been completely eliminated. All system modules are now organized into functional areas within a collapsible side navigation bar.
2.  **Strict Administrative Data Integrity Pipeline**: System Administrators no longer perform raw file uploads directly. Instead, Department Heads and Executives upload raw spreadsheets in their respective modules and submit a **"Request Validation"** query. The System Administrator processes these files through a dedicated **Data Validation Engine**, reviewing flagged errors line-by-line before committing clean data to the central analytics database.
3.  **Enhanced System Governance & Security**: Introduces real-time header timekeeping (with seconds), notification bell drawer overlays, SVG vector iconography, NIST-compliant 2FA Email OTP, automated 3-attempt account freeze subroutines, and immutable activity audit logs.

----------

### 1. Global Role & System Architecture

#### Role & Permission Matrix (RBAC)

Access privileges are strictly partitioned into functional roles to prevent unauthorized data tampering while enabling read-and-filter analytics for executive decision-makers.

```
                                 ┌───────────────────────────────┐
                                 │     QCU InfoBoard System      │
                                 └───────────────┬───────────────┘
                                                 │
                        ┌────────────────────────┴────────────────────────┐
                        ▼                                                 ▼
     ┌─────────────────────────────────────┐           ┌─────────────────────────────────────┐
     │      System Administrator Role      │           │     Executive & Department Roles    │
     ├─────────────────────────────────────┤           ├─────────────────────────────────────┤
     │ • Full System CRUD & Governance     │           │ • View & Multi-Filter Analytics     │
     │ • Data Validation & Rule Enforcement│           │ • Data Ingestion (Upload Masterlist)│
     │ • Account Lifecycle (Freeze/Unlock) │           │ • Request Data Validation           │
     │ • System Configuration Parameters   │           │ • Review Feedback Threads           │
     │ • Security Audit Trail Monitoring   │           │ • Certified Report Generation       │
     └─────────────────────────────────────┘           └─────────────────────────────────────┘

```

Functional System Role

Authorized QCU Personnel

Permission Scope

Primary Operational Responsibility

**System Administrator**

Management Information Systems (MIS) Staff, Lead Systems Engineers

**Full Administrative CRUD** across user accounts, validation engines, system configs, institutional structures, and security audit logs.

Maintains system health, validates pending data ingestion requests, enforces database rules, unlocks frozen accounts, and monitors security logs.

**University Executive / VPAA**

University President, Vice President for Academic Affairs, Executive Directors

**Read & Filter Analytics + Export + Data Upload Request**.

Analyzes high-level institutional health, uploads raw executive records, requests data validation, and exports certified reports.

**Academic Deans** _(CCS, COE, COB, COA, COED)_

College Deans (e.g., Dean of Computer Studies)

**College-Specific Scope Access** (View College Analytics, Student/Faculty Roster, Export).

Oversees college-level headcount, program capacities, faculty loads, and accreditation metrics.

**Registrar & Admissions Officers**

Registrar Data Officers, Admissions Head

**Data Management & Analytics Access** (Upload Enrollment/Admissions Masterlists, Filter Analytics).

Ingests student masterlists, tracks admission yield rates, and monitors district demographic trends.

----------

#### Global Navigation Structure (Side Navigation)

To ensure design consistency, the side navigation menu uses a unified, functional structure where items are dynamically shown or restricted based on role permissions:

```
📊 DASHBOARDS
 ├─ Dashboard (Admin Control / Executive Pulse)
📈 ANALYTICS
 ├─ Student Analytics
 ├─ Faculty Analytics
 ├─ Admission Analytics
📂 DATA MANAGEMENT
 ├─ Import Data (Executive / Registrar Ingestion)
 ├─ Institutional Data (Admin Roster Governance)
 ├─ Data Validation (Admin Governance Portal)
👥 USER MANAGEMENT
 ├─ Manage User Accounts
🏫 COLLEGE DATA
 ├─ CCS Student / CCS Faculty
 ├─ COA Student / COA Faculty
 ├─ COB Student / COB Faculty
 ├─ COE Student / COE Faculty
 ├─ COED Student / COED Faculty
📑 REPORTS
 ├─ Export Reports (PDF / XLSX Engine)
🔍 SEARCH & FILTER
 ├─ Global Search & Filter Portal
⚙ SYSTEM
 ├─ System Configuration
 ├─ Activity Logs

```

----------

#### Global Design System & UI Standards

-   **Color Palette (Hex Tokens)**:
    -   **Primary Dark (`#200D2D`)**: Bloodwood Deep. Used for side navigation background, dark container fills, and top header accents.
    -   **Secondary Accent (`#BB96E4`)**: Ethereal Lilac. Used for active navigation highlights, button hover fills, and status badges.
    -   **Highlight Accent (`#FFD066`)**: Golden Harvest. Used for primary KPI metric values, warning indicators, and active filter tags.
    -   **Deep Secondary (`#4C1413`)**: Obsidian Bloom. Used for alert container headers and high-contrast alert states.
    -   **Soft Surface (`#FFDBED`)**: Blossom Vapor. Used for card background fills, subtle hover states, and modal overlays.
-   **College Visualization Color Standards**:
    -   **CCS (College of Computer Studies)**: Dark Slate / Gray (`#333333`)
    -   **COE (College of Engineering)**: Vibrant Orange (`#FF6B00`)
    -   **COB (College of Business)**: Warm Yellow (`#FFC700`)
    -   **COA (College of Accountancy)**: Forest Green (`#00875A`)
    -   **COED (College of Education)**: Royal Blue (`#0052CC`)
-   **Typography & Styling**: Inter font family. Bento-Grid card layouts with rounded corners (`16px`–`24px` radius), smooth component shadows, and pure SVG vector icons.
-   **Real-time Header Bar**: Displays the system title, global search bar, notification drawer bell, logged user profile badge, and a live digital clock rendering `MM/DD/YYYY | HH:MM:SS AM/PM` with ticking seconds.
-   **Mandatory Confirmation Subroutines**: All state-altering actions (e.g., locking users, deactivating accounts, archiving student records, committing validated data, or logging out) trigger an explicit **Modal Confirmation Dialog** followed by a **Toast Alert**.

----------

### 2. Step-by-Step Breakdown of Process Flows per Module

```
                       ┌─────────────────────────────────────┐
                       │     AUTHENTICATION & GATEKEEPER     │
                       └──────────────────┬──────────────────┘
                                          │
                         ┌────────────────┴────────────────┐
                         ▼                                 ▼
         ┌───────────────────────────────┐ ┌───────────────────────────────┐
         │  SYSTEM ADMINISTRATOR FLOW    │ │  EXECUTIVE / DEPT HEAD FLOW   │
         ├───────────────────────────────┤ ├───────────────────────────────┤
         │ 1. Admin Control Dashboard    │ │ 1. Executive Analytics Pulse  │
         │ 2. Data Validation & Review   │ │ 2. Data Ingestion Upload      │
         │ 3. User Account Management    │ │ 3. Request Data Validation    │
         │ 4. Institutional Roster Config│ │ 4. Review Feedback Threads    │
         │ 5. System Configuration       │ │ 5. Dynamic Slicer Analytics   │
         │ 6. Activity Audit Trail Logs  │ │ 6. Certified Report Export    │
         └───────────────────────────────┘ └───────────────────────────────┘

```

#### Module A: Authentication, 2FA Gatekeeper & Role Routing

1.  **Credentials Submission**: User lands on the split-screen sign-in view and inputs primary credentials (`Username/Email` and `Password`).
2.  **Primary Credential Check**: System validates hashed credentials against the database.
    -   _If Invalid_: Increments the account's failed attempt counter and displays an enumeration-safe alert (_"Invalid username, password, or security code"_).
3.  **Email OTP Dispatch**: Upon valid password entry, a 6-digit numeric One-Time Password (OTP) is dispatched to the user's registered email account, expiring strictly after **10 minutes** per NIST SP 800-63B guidelines.
4.  **OTP Verification & Security Lockout**: User inputs the 6-digit code on the 2FA screen.
    -   _If OTP Fails 3 Consecutive Times_: The backend state machine locks the user account (`Status: FROZEN`), updates attempts to `3`, triggers a real-time notification alert to System Admins, and blocks further attempts.
5.  **Session Routing**: Upon valid OTP check, a session token is issued, and RBAC middleware routes the user based on their assigned role.

----------

#### Module B: System Admin — Control Center Dashboard

1.  **Admin Dashboard Entry**: System Admin lands on the central administrative command page.
2.  **KPI Overview Inspection**: Admin reviews high-level system indicators:
    -   `Total System Users`: Counts all registered accounts across Active, Frozen, and Inactive states.
    -   `Total Students (AY 2026–2027)`: Active enrolled student population.
    -   `Total Employees`: Combined headcount of faculty and non-teaching staff.
    -   `Total Faculty`: Headcount of regular full-time and part-time instructors.
    -   `Enrollment Rate`: Percentage of admitted applicants who completed formal registration.
    -   `Total Academic Programs`: Count of active degree programs offered under the 5 colleges.
3.  **Pending Data Ingestions Subroutine**:
    -   Admin inspects the **Pending Items Content Card**, which displays pending batch uploads from Department Heads (e.g., Registrar Enrollment records, HR Employee records, duplicate entries, or incomplete forms).
    -   Clicking the `Review` action button on any pending row redirects the Admin directly to the **Data Validation Module** with that specific file pre-selected.
4.  **Recent Activity Monitoring**: Admin views the chronological stream of system events (showing User, Action, and Date/Time with Seconds).
5.  **Quick Action Execution**: Admin can trigger rapid modals (`Add User`, `Add Student`, `Add Employee`, or `Validate Data`) directly from the dashboard header.

----------

#### Module C: System Admin — User Management

```
[Open User Management] ──> [Filter Status Cards] ──> [Search User] ──> [Select Quick Action]
                                                                              │
                                 ┌────────────────────────────────────────────┴────────────────────────────────────────────┐
                                 ▼                                            ▼                                            ▼
                        [Modal: Add/Edit User]                       [Modal: Freeze/Deactivate]                   [Subroutine: Unlock Account]
                                 │                                            │                                            │
                        [Submit Form & Confirm]                      [Confirm State Change]                       [Reset Attempt Counter to 0]
                                 │                                            │                                            │
                        [Toast: User Created]                        [Toast: Status Updated]                      [Dispatch Password Link]

```

1.  **User Grid Navigation**: Admin accesses `Manage User Accounts` from the side navigation.
2.  **Filter Toggling via KPI Cards**: Admin clicks interactive top KPI cards (`Total Users`, `Active`, `Frozen`, `Deactivated/Inactive`) to filter the user data table instantly.
3.  **User Search & Roster Audit**: Admin searches by Name, Username, Email, or Role. The table displays: `# | Role | Full Name | Username | Email | Status | Date Created | Last Log In | Attempts | Actions`.
    -   The footer text dynamically updates (e.g., _"Showing 12/12 of users"_).
4.  **Add User Execution**: Clicking `+ Add User` pops a modal form requiring Full Name, Email, Username, Assigned RBAC Role, and initial permissions, followed by a confirmation dialog.
5.  **Account Unlock Subroutine**:
    -   For accounts frozen due to 3 failed password/OTP attempts (`Status: FROZEN (3x)`), Admin clicks `Unlock User`.
    -   A confirmation dialog pops up. Upon confirmation, the system resets the failed attempt counter to `0`, updates status to `ACTIVE`, logs the audit event, and emails a secure credential reset link to the user.
6.  **Freeze / Deactivate Execution**: Admin clicks `Freeze` or `Deactivate` on any account, confirms via modal, and the system updates the account state immediately.

----------

#### Module D: System Admin — Institutional User Roster Governance

Admin accesses the new `Institutional` side navigation section to manage foundational university masterlists across 7 sub-menus:

1.  **`Students` Sub-Menu**:
    -   **KPI Cards**: `Total Students Enrolled`, `1st Year` (count & %), `2nd Year` (count & %), `3rd Year` (count & %), `4th Year` (count & %), `Graduating` (count & %).
    -   **Visual Charts**:
        -   _Gender Aggregation per College_: Grouped bar chart.
        -   _Enrollment Trend_: Historical line chart updating automatically as new period records are imported.
        -   _Distribution by College_: Donut chart representing current semester shares.
    -   **Data Table & Filters**: Search bar + filters for Academic Year, Semester (1st, 2nd, Summer), College, Program, Campus, Year Level, Status (Enrolled, Graduated, Unenrolled, Dropout), and Gender.
    -   **Roster Columns**: `Checkbox | Student ID | Last Name | First Name | Middle Name | College | Program | Year Level | Status | Academic Year | Gender | Actions (Edit, Archive)`.
    -   **Action Buttons**: `Generate Report`, `Add Student` (modal), and `Archive` (with confirmation modals). Footer displays dynamic pagination (`,,...`) and _"Showing 1 to 10 of 10,000 total students"_.
2.  **`College` Sub-Menu**:
    -   Features search, AY filter, Semester filter, `Add College`, `Reset`, and `Generate Report`.
    -   Displays structural cards for each college (e.g., **College of Computer Studies**: 3 programs, total enrolled headcount, and a `View College` button that redirects to the filtered Student Roster).
    -   Academic Units Covered: CCS (BSIT, BSIS, BSCS), COB (BSBA, BSEntrep), COA (BSA), COE (BSEE, BSIE), COED (BECEd).
3.  **`Programs` Sub-Menu**:
    -   Features search, AY filter, Semester filter, College filter, `Add Program`, `Reset`, and `Generate Report`.
    -   Data Table: `Program Code | Program Name | College | Total Students | Enrolled Students | Graduate Students | Level (Baccalaureate) | Actions (Edit)`.
4.  **`Department` Sub-Menu**:
    -   Features search, `Add Department`, `Reset`, and `Generate Report`.
    -   Data Table: `Department Name` (Office of the President, Finance Office, HR Management, ICTO, Student Affairs Office, Facilities Management, Security Office, Library Services, Research Management Office, etc.), `Department Head Name`, `Type of Department`, `Personnel Count`, and `Actions (Edit)`.
5.  **`Faculty`, `Employee`, & `Academic Year` Sub-Menus**: Provide structured CRUD data tables for managing faculty rosters, administrative staff profiles, and academic term calendar windows.

----------

#### Module E: Data Validation Engine & Review Subroutine (Admin Governance)

This module forms the operational core of data governance, ensuring that raw administrative uploads undergo strict verification before updating executive charts.

```
[Dept Head Uploads File] ──> [Requests Validation] ──> [Enters Admin Validation Queue]
                                                                    │
                                                           [Admin Clicks Review]
                                                                    │
                                                 [Modal Shows Error/Warning Rows Only]
                                                                    │
                                                    ┌───────────────┴───────────────┐
                                                    ▼                               ▼
                                            [Issues Identified]             [Data Clean / Resolved]
                                                    │                               │
                                            [Admin Click 'Notify']          [Admin Clicks 'Ingest']
                                                    │                               │
                                         [Type Feedback Comment]         [Commit Batch to Database]
                                                    │                               │
                                         [Sends Thread to Exec]          [Real-Time Visuals Update]

```

1.  **Validation Queue Entry**: Admin opens `Data Validation` from the side navigation.
2.  **Queue KPI Summary Cards**:
    -   `Total Pending`: Count of datasets awaiting administrative review.
    -   `Passed/Validated`: Count of successfully integrated datasets.
    -   `No Issues`: Datasets passing schema checks automatically.
    -   `Warnings`: Datasets containing non-critical formatting anomalies.
    -   `Errors`: Datasets containing fatal schema mismatches (e.g., missing Student IDs, invalid program codes).
    -   `Notified`: Datasets where feedback comments were sent back to Department Heads. _(All KPI cards act as clickable filter toggles for the validation table)_.
3.  **Validation Inspection Grid**: Displays: `Status Icon (No Issues, Warning, Error, Validated) | Data Record Ingested | Rule Name | Description | Category | Department | Records Checked | Issues Found | Actions`.
4.  **In-Line Review Subroutine**:
    -   Clicking `Review` on a dataset with Warnings or Errors opens a **Schema Review Modal Overlay**.
    -   **Isolated Error Preview**: To maximize efficiency, the modal filters and displays **only the specific rows containing errors or warnings**, hiding valid rows.
    -   **Notify & Feedback Threading**: If errors cannot be fixed automatically, Admin clicks `Notify`, types clear correction instructions (e.g., _"Row 1043 contains an invalid Gender Tag 'INVALID_TAG'. Please update in your source CSV and re-upload"_), and submits. This creates an active feedback thread visible on the Executive/Department Head's ingestion interface.
5.  **Ingestion Approval**: For datasets flagged as `No Issues` or once errors are resolved, Admin clicks `Ingest`. The system prompts a confirmation modal and commits the batch to the live database, instantly updating executive visualizations.

----------

#### Module F: Executive / Department Head — Data Ingestion Interface

1.  **Ingestion Navigation**: Executive or Department Head opens `Import Data` from the side navigation.
2.  **Dataset Selection**: User selects the target dataset type (`Registrar Student Masterlist`, `HR Faculty Registry`, or `Admissions Survey`).
3.  **File Upload & Replacement**: User drags and drops their master `.CSV` or `.XLSX` file.
    -   _Updated Controls_: Replaces the old "Remove File" button with a sleek **`Replace File`** button.
4.  **Schema Preview**: System displays a read-only preview table highlighting row formatting. Executives cannot edit cells directly in the preview, ensuring corrections are made in their local master spreadsheets.
5.  **Validation Request Submission**:
    -   Replaces the old "Commit Batch to Database" button with **`Request Validation`**.
    -   The button remains disabled until the pre-parser confirms basic structure. Clicking it submits the dataset to the System Admin's Data Validation Queue.
6.  **Feedback Side Card**: Displays a real-time status tracker listing all active validation requests, their status (`Pending`, `Passed/Validated`, `Action Required`), and a `View All` button to read feedback threads sent by the System Admin.

----------

#### Module G: System Configuration Module

Gives System Admins full control over system parameters, academic rules, branding, and server health.

1.  **Top KPI Scorecard Cards**:
    -   `System Modules Configured`: Count of active system functional modules.
    -   `Active User Accounts`: Total active users across all roles.
    -   `System Status`: Real-time status indicator (`Online` / `Offline` across services).
    -   `Last Backup`: Timestamp of the latest automated database backup (`MM/DD/YYYY | HH:MM:SS`).
2.  **Configuration Category Cards** (Clicking opens a dedicated configuration modal):
    -   _General Settings_: System identity, university branding assets, and global preferences.
    -   _Academic Settings_: Academic year calendar boundaries, semester rules, and term defaults.
    -   _User & Role Settings_: Permission matrix enforcement and access control rules.
    -   _Notification Settings_: Thresholds for email alerts, lockout warnings, and ingestion notifications.
    -   _Data & Validation Rules_: Schema formatting, required field constraints, and parsing logic.
    -   _System Maintenance_: Manual database backup triggers, log purging, and health diagnostics.
3.  **System Overview Card**: Live operational telemetry displaying Database Connection Status, Web Server Load, File Storage Utilization, Last Backup Timestamp, and System Uptime (`99.98%`).
4.  **Recent Config Activity**: Displays a chronological list of configuration changes (e.g., _"Updated Academic Settings 2 hours ago by admin_ruel"_) with a `View All` button.

----------

#### Module H: Activity Audit Logs & Security Portal

Maintains an immutable, legally defensible audit trail of every administrative action, data access event, and security alert.

1.  **Header KPI Summary Cards** (Act as quick clickable filters):
    -   `Total Logins Today`: Count of successful authentication sessions.
    -   `Failed OTP Alerts`: Count of failed 2FA attempts and account freeze events.
    -   `Data Ingestions`: Count of committed batch file uploads.
    -   `Certified Exports`: Count of PDF/XLSX reports generated by executives.
2.  **Multi-Filter Engine**: Includes a Date Range Picker (`From MM/DD/YYYY To MM/DD/YYYY`), Module Dropdown, and Global Search Bar.
3.  **Audit Trail Data Table**: `# | Exact Timestamp (MM/DD/YYYY HH:MM:SS) | User Email | Account Actor | Role | Module Impacted | Event Action & Description | Source IP Address`.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ CHRONOLOGICAL AUDIT TRAIL LOG SAMPLE DATA                                                              │
├────┼─────────────────────┼──────────────────┼──────────────┬───────────┼─────────────┼─────────────────────┼──────────────┤
│ #  │ Timestamp (s)       │ User Email       │ Actor        │ Role      │ Module      │ Performed Action    │ Source IP    │
├────┼─────────────────────┼──────────────────┼──────────────┼───────────┼─────────────┼─────────────────────┼──────────────┤
│ 01 │ 09/26/2026 10:14:02 │ rfernan@qcu.edu  │ admin_ruel   │ SysAdmin  │ Validation  │ INGEST_DATA_BATCH   │ 192.168.1.45 │
│ 02 │ 09/26/2026 09:30:11 │ ldecena@qcu.edu  │ exec_vpaa    │ Executive │ Reports     │ EXPORT_PDF_REPORT   │ 112.201.42.10│
│ 03 │ 09/26/2026 08:12:05 │ mbarra@qcu.edu│ exec_ccs     │ Dean_CCS  │ Auth_2FA    │ ACCOUNT_LOCKED_3X   │ 112.201.42.88│
│ 04 │ 09/26/2026 07:45:22 │ admin_mis@qcu.edu│ admin_mis    │ SysAdmin  │ UserMgmt    │ UNLOCK_USER_ACCOUNT │ 192.168.1.50 │
└────┴─────────────────────┴──────────────────┴──────────────┴───────────┴─────────────┴─────────────────────┴──────────────┘


