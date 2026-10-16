
# Master Figma Make AI Design Specification & System Architecture

**Project Title**: QCU InfoBoard: A Data Visualization and Dashboard System for Institutional Planning at Quezon City University
**Target Environment**: Figma Make AI / Interactive Clickable High-Fidelity Prototyping Framework  
**Document Purpose**: A comprehensive, production-grade Markdown design specification detailing all visual tokens, UI component hierarchies, Role-Based Access Control (RBAC) flows, dynamic dataset bindings, wireframe structures, and sub-module screens.

----------

## 1. Executive Overview & Institutional Purpose

The **QCU InfoBoard** is a web-based **Executive Information System (EIS)** and interactive data visualization platform specifically engineered for Quezon City University. Its primary institutional mission is to eliminate the severe administrative burden of manual database queries, spreadsheet cross-matching, and hand-tallying traditionally performed by the **Human Resources (HR), Registrar, and Admissions departments** whenever university leadership requires metrics.

By synthesizing fragmented academic records into real-time, visual key performance indicators (KPIs) and interactive dashboards, the platform empowers decision-makers—such as the University President, Vice President for Academic Affairs (VPAA), Deans, and Department Heads—to conduct immediate data-driven strategic planning, resource allocation, and policy evaluation without administrative delays.

----------

## 2. Global Design System, UI Tokens & Visual Palette

To achieve a cohesive, high-end visual layout matching the bento-style design guidelines, all Figma components, cards, backgrounds, and interactive elements must adhere strictly to these defined color tokens and styling rules.

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

_(Source Tokens: `#200D2D`, `#BB96E4`, `#FFD066`, `#4C1413`, `#FFDBED`)_.

### 2.2 College & Academic Department Chart Color Standards

Charts that display data disaggregated by academic colleges must enforce fixed color tokens across all dashboard views to ensure instant visual recognition:

-   **CCS** (College of Computer Studies): Dark Slate / Gray (`#333333`)
-   **COE** (College of Engineering): Vibrant Orange (`#FF6B00`)
-   **COB** (College of Business): Warm Yellow (`#FFC700`)
-   **COA** (College of Accountancy): Forest Green (`#00875A`)
-   **COED** (College of Education): Royal Blue (`#0052CC`)

### 2.3 Layout Structure, Typography & Components

-   **Typography**: **Inter** font family (clean sans-serif with optimized legibility across dense data tables and KPI cards).
-   **Bento Grid Containers**: Cards feature rounded corners (`16px` to `24px` radius), smooth elevation drop-shadows (`0px 8px 24px rgba(32, 13, 45, 0.08)`), and soft gradient background fills.
-   **Buttons & Controls**: Fully rounded pill buttons (`border-radius: 9999px`) or smooth rounded buttons (`border-radius: 12px`) with subtle hover scale/brightness transitions.
-   **Iconography**: Scalable vector graphics (SVG icons) for crisp display across mobile and desktop viewports.
-   **Real-time Digital Timekeeping Header**: Top header displays a live clock rendering `MM/DD/YYYY | HH:MM:SS AM/PM` with ticking seconds alongside global search, a notification drawer bell icon with alert badges, and authenticated user account details.
-   **Mandatory Confirmation & Toast Subroutines**: All state-changing actions (e.g., unlocking an account, deactivating a user, archiving records, committing validated datasets, or logging out) require an explicit **Modal Confirmation Dialog** followed by a **Toast Notification Alert**.

----------

## 3. Global Role & System Architecture

QCU InfoBoard enforces a strict **Role-Based Access Control (RBAC)** model to segregate backend platform administration, data validation, and configuration from executive read-and-filter analytics.

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

### 3.1 Role & Permission Scope Matrix

System Role

Authorized QCU Personnel

Permission Scope

Primary Operational Responsibility

**System Administrator**

Management Information Systems (MIS) Staff, Lead Systems Engineers

**Full Administrative CRUD** across user accounts, validation engines, system configs, institutional rosters, and security audit logs.

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

### 3.2 Centralized Side Navigation Structure

Header-based navigation buttons have been completely eliminated. All system modules are now consolidated into a collapsible and expandable Side Navigation Panel where items are dynamically shown or restricted based on role permissions:

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

### 3.3 Universal Filtering Engine & Dynamic Real-Time Binding Rules

A **Universal Filter Bar** sits permanently at the top of every dashboard screen. Selecting or modifying any filter parameter immediately re-queries the backend visualization index and re-renders all on-screen charts, scorecards, and data tables in real time:

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
7.  **Demographic Slicers**:
    -   _Student Slicers_: Age Range Slider (`17–45+`), First-Gen Status (`First-Gen` vs. `Non-First-Gen`).
    -   _Faculty Slicers_: Employment Status (`Full-Time` vs. `Part-Time`).

----------

## 4. Security, Governance & Administrative Ingestion Pipeline

### 4.1 Two-Factor Authentication (2FA) & Account Lockout Protocol

```
[User Sign-In] ──> [Password Check] ──> [Email OTP (10m Expiry)] ──> [Validate Code]
       │                  │                      │                         │
       │ Invalid          │ 3 Failed Attempts    │ Expired / Wrong         │ Valid Code
       ▼                  ▼                      ▼                         ▼
 [Error Alert] ──> [Freeze User Account] ──> [Trigger Admin Alert] ──> [RBAC Middleware Route]

```

1.  **Primary Credential Verification**: User enters Username/Email and Password. Backend checks hashed credentials.
2.  **2FA Email OTP Dispatch**: Valid password entry triggers a 6-digit numeric One-Time Password (OTP) sent to the user's registered QCU email. The code expires strictly after **10 minutes** per NIST SP 800-63B standards.
3.  **Enumeration-Safe Error Messaging**: Failed login attempts render generic error alerts (_"Invalid username, password, or security code"_) to prevent account enumeration attacks.
4.  **Automated Account Lockout**: Failing credential or OTP checks **3 consecutive times** updates the user account state to `Status: FROZEN`, triggers a notification bell alert to System Admins, and blocks further attempts.

----------

### 4.2 Data Ingestion & Data Validation Pipeline

To ensure high data integrity, raw file uploads do not update central database tables directly. Instead, the system uses a two-tier review pipeline:

```
[Dept Head Uploads Masterlist] ──> [Clicks 'Request Validation'] ──> [Enters Admin Validation Queue]
                                                                                │
                                                                       [Admin Clicks 'Review']
                                                                                │
                                                             [Modal Shows Error/Warning Rows Only]
                                                                                │
                                                                ┌───────────────┴───────────────┐
                                                                ▼                               ▼
                                                        [Issues Flagged]                [Data Clean / Ready]
                                                                │                               │
                                                        [Admin Clicks 'Notify']         [Admin Clicks 'Ingest']
                                                                │                               │
                                                     [Type Feedback Comment]         [Commit Batch to Database]
                                                                │                               │
                                                     [Thread Sent to Exec]           [Real-Time Visuals Update]

```

1.  **Executive Ingestion Stage**: Executives upload `.CSV` or `.XLSX` files, preview row layouts, and click **`Request Validation`** (replacing old direct commit buttons). A **`Replace File`** button allows re-uploading modified files.
2.  **Admin Validation Stage**: The Admin opens the **Data Validation Queue**, locates the dataset, and clicks **`Review`**.
3.  **Isolated Error Preview**: The review modal automatically filters and displays **only specific rows containing errors or warnings** (e.g., missing Student IDs or malformed codes), hiding clean rows.
4.  **Threaded Feedback Subroutine**: If rows are invalid, Admin clicks **`Notify`** and submits a comment (e.g., _"Row 1043 has an invalid gender code 'Mle'"_), creating an active discussion thread on the Executive's view.
5.  **Database Integration**: Once clean, Admin clicks **`Ingest`**, prompting a confirmation dialog that commits the batch to the live database and updates executive dashboards instantly.

----------

### 4.3 Immutable Activity Audit Logging Protocol

Every administrative action, dataset modification, failed login, and report download generates a chronological audit entry.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ CHRONOLOGICAL AUDIT TRAIL LOG SAMPLE DATA TABLE                                                        │
├────┼─────────────────────┼──────────────────┼──────────────┬───────────┼─────────────┼─────────────────────┼──────────────┤
│ #  │ Timestamp (s)       │ User Email       │ Actor        │ Role      │ Module      │ Performed Action    │ Source IP    │
├────┼─────────────────────┼──────────────────┼──────────────┼───────────┼─────────────┼─────────────────────┼──────────────┤
│ 01 │ 09/26/2026 10:14:02 │ rfernan@qcu.edu  │ admin_ruel   │ SysAdmin  │ Validation  │ INGEST_DATA_BATCH   │ 192.168.1.45 │
│ 02 │ 09/26/2026 09:30:11 │ ldecena@qcu.edu  │ exec_vpaa    │ Executive │ Reports     │ EXPORT_PDF_REPORT   │ 112.201.42.10│
│ 03 │ 09/26/2026 08:12:05 │ mbarra@qcu.edu│ exec_ccs     │ Dean_CCS  │ Auth_2FA    │ ACCOUNT_LOCKED_3X   │ 112.201.42.88│
│ 04 │ 09/26/2026 07:45:22 │ admin_mis@qcu.edu│ admin_mis    │ SysAdmin  │ UserMgmt    │ UNLOCK_USER_ACCOUNT │ 192.168.1.50 │
└────┴─────────────────────┴──────────────────┴──────────────┴───────────┴─────────────┴─────────────────────┴──────────────┘

```

_(Logging Attributes: Exact Date, Time with Seconds, Actor Email, Role, Module, Description, Source IP Address)_.

----------

## 5. Step-by-Step Module Process Breakdown & Workflows

### Module 5.1: System Admin Control Center Dashboard

-   **Top KPI Scorecard Widgets**:
    -   `Total System Users`: Counts registered accounts (`12 Total | 10 Active / 2 Frozen or Inactive`).
    -   `Total Enrolled Students`: Baseline headcount (`10,000` for AY 2026–2027).
    -   `Total University Employees`: Combined headcount of faculty and non-teaching staff (`320`).
    -   `Total Active Faculty`: Headcount of regular full-time and part-time instructors (`240`).
    -   `Enrollment Rate`: Percentage of admitted applicants who completed registration (`88.5%`).
    -   `Total Academic Programs`: Active degree programs offered (`10 Programs across 5 Colleges`).
-   **Pending Data Ingestions Content Card**: Data table displaying pending batch uploads submitted by Department Heads. Columns: `# | Dataset Name | Originating Dept | Record Count | Action Button`. Clicking **`Review`** redirects directly to the Data Validation Module with that pre-filtered file.
-   **Recent Activity Feed**: Real-time log list showing recent actions, timestamps with seconds, user actors, and event tags.
-   **Quick Action Buttons**: Modal launchers for `[ + Add User ]`, `[ + Add Student ]`, `[ + Add Employee ]`, and `[ 🔍 Validate Data ]`.

----------

### Module 5.2: User Management & Account Governance

-   **Status Filter KPI Cards**: Top metric cards (`Total Users`, `Active`, `Frozen`, `Deactivated/Inactive`) act as dynamic filter toggles when clicked.
-   **Roster Data Table**: Displays `# | Role | Full Name | Username | Email | Status | Date Created | Last Log In | Attempts | Actions`.
-   **`[ + Add User ]` Subroutine**: Opens a modal form requiring Full Name, Email, Username, Assigned Role, and Initial Permissions. Submitting triggers a Confirmation Dialog followed by a Success Toast Alert.
-   **Account Unlock Subroutine**: For accounts frozen due to 3 failed attempts (`Status: FROZEN`), Admin clicks **`Unlock User`**. A confirmation modal appears; confirming resets the attempt counter to `0`, updates status to `ACTIVE`, logs an audit entry, and emails a credential reset link to the user.
-   **Freeze / Deactivate Execution**: Admin clicks `Freeze` or `Deactivate` on any profile, confirms via modal, and the system updates the account state immediately.

----------

### Module 5.3: Institutional Roster Governance (Dropdown Sub-Menus)

Admin manages foundational university masterlists across seven dedicated sub-menus under `Institutional Data`:

1.  **`Students` Sub-Menu**:
    -   **KPI Cards**: `Total Students Enrolled (10,000)`, `1st Year (3,500 | 35%)`, `2nd Year (2,800 | 28%)`, `3rd Year (2,000 | 20%)`, `4th Year (1,400 | 14%)`, `Graduating Cohort (300 | 3%)`.
    -   **Visual Charts**: _Gender Aggregation per College_ (grouped column), _Enrollment Trend_ (historical line chart), and _Distribution by College_ (donut chart).
    -   **Filters & Table**: Search bar + filters for AY, Term, College, Program, Campus, Year Level, Status (Enrolled, Graduated, Unenrolled, Dropout), and Gender. Grid displays Student ID, Name, College, Program, Year Level, Status, and Edit/Archive actions.
2.  **`College` Sub-Menu**: Displays structural cards for each college (CCS, COE, COB, COA, COED) showing total program counts, student headcounts, and a `View College` button that redirects to the filtered Student Roster.
3.  **`Programs` Sub-Menu**: Data table displaying Program Code, Program Name, Assigned College, Enrolled Count, Graduated Count, and Edit action buttons.
4.  **`Department` Sub-Menu**: Tracks administrative units (Office of the President, Finance, HR Management, ICTO, Student Affairs, Facilities, Security, Library, Research Office).
5.  **`Faculty`, `Employee`, & `Academic Year` Sub-Menus**: Data tables to register faculty profiles, administrative staff, and active term calendars.

----------

### Module 5.4: Data Validation Engine

-   **Validation Queue KPI Cards**: Interactive filter toggles for `Total Pending`, `Passed/Validated`, `No Issues`, `Warnings`, `Errors`, and `Notified`.
-   **Inspection Grid**: Displays `Status Icon | Record Ingested | Rule Name | Category | Department | Records Checked | Issues Found | Action Buttons`.
-   **In-Line Review Subroutine**: Clicking **`Review`** opens the Schema Review Modal displaying **only the specific rows containing errors or warnings**.
-   **Feedback Threading**: Clicking **`Notify`** opens a comment box to send correction feedback directly to the Executive's ingestion interface.
-   **Database Commit**: Clicking **`Ingest`** prompts a confirmation modal, committing the batch to the live central database.

----------

### Module 5.5: System Configuration Module

-   **Config Category Cards**: Open dedicated setup modals for _General Settings_, _Academic Settings_, _User & Role Settings_, _Notification Rules_, _Data & Validation Rules_, and _System Maintenance_.
-   **System Overview Health Panel**: Real-time telemetry monitoring Database Engine Status (`MySQL 8.0 CE - ONLINE`), Web Server Status (`NGINX - ONLINE`), Storage Utilization (`128 GB / 1 TB`), Last Backup Timestamp (`MM/DD/YYYY | HH:MM:SS`), and System Uptime (`99.98%`).

----------

### Module 5.6: Activity Audit Logs & Security Portal

-   **Header Filter Cards**: `Total Logins Today`, `Failed OTP Alerts`, `Data Ingestions`, `Certified Exports`.
-   **Controls**: Date Range Picker (`From MM/DD/YYYY To MM/DD/YYYY`), Module Dropdown, and Global Search Bar.
-   **Data Grid**: Displays exact Timestamp with seconds, User Email, Actor Name, Role, Impacted Module, Event Description, and Source IP Address.

----------

## 7. Figma Interactive Prototyping Pathways & Interaction Rules

```
[Start Prototype Session] ──> [Sign-In Screen]
                                    │
                         (Valid Credentials & OTP)
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
 [System Administrator Flow]                           [University Executive Flow]
   │                                                     │
   ├── Side Navigation (Full Scope)                      ├── Side Navigation (Restricted Scope)
   ├── User Management                                   ├── Executive Dashboard
   │     └── [Unlock Account Modal]                      │     └── [Click Donut Segment -> Filter]
   ├── Data Validation Engine                            ├── Student Analytics
   │     ├── [In-Line Error Review Modal]                ├── Faculty Analytics
   │     ├── [Threaded Feedback Modal]                   ├── Admission / First-Gen
   │     └── [Ingest Batch Modal]                        ├── Import Data (Request Validation)
   ├── System Configuration                              └── Certified Report Generator
   ├── Activity Audit Logs                                     └── [PDF / XLSX Export Modal]
   └── Logout Modal                                      └── Logout Modal

```

1.  **Hover Tooltip Interactions**: All visual chart segments, bars, donut slices, and data table rows feature interactive hover states rendering dark floating tooltip badges displaying exact numeric metrics and percentages.
2.  **Dynamic Filter Binding**: Selecting options in the Universal Filter Bar triggers smooth animation transitions where all on-screen charts morph in real time to reflect sliced data subsets.
3.  **Drawer & Modal Overlays**: Clicking hamburger menu buttons slides open the Collapsible Side Navigation Bar. State-altering decisions trigger confirmation modals followed by toast alerts.

----------

