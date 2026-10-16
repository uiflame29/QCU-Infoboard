# QCU InfoBoard: University Executive Module & Content Blueprint (VPAA & President Tier)

  

**Target Roles:** University President (Dr. Victor Atienza) & Vice President for Academic Affairs (Dr. Elena Bautista)

  

**System Title:** QCU InfoBoard: A Data Visualization and Dashboard System for Institutional Planning at Quezon City University

  

---

  

## 1. Account Credentials & Security Authentication Flow

  

* **Account Credentials & Routing:**

* **University President:** Name: `Dr. Victor Atienza` | Username: `doc.atienza` | Password: `DocAtienza@2026` | Role: University Executive (`Read/Filter-Only`)

  
  

* **VPAA:** Name: `Dr. Elena Bautista` | Username: `vpaa.qcu` | Password: `VPAA@2026` | Role: University Executive (`Read/Filter-Only`)

  
  
  
  

* **Security Authentication Subroutine:**

* **Access Gate & Credential Entry:** Executives enter authorized credentials at the split-screen sign-in interface.

  
  

* **Primary Credential Verification:** Backend validates hashed credentials. Invalid attempts trigger an enumeration-safe error alert (`"Invalid username, password, or security code"`) and increment the failure counter.

  
  

* **Two-Factor Authentication (2FA Email OTP):** Upon successful password validation, a 6-digit numeric One-Time Password is sent to the executive's registered QCU email with a strict **10-minute expiration window** per NIST SP 800-63B standards.

  
  

* **Automated Security Lockout:** Entering incorrect credentials or OTP codes **3 consecutive times** automatically freezes/locks the account (`Status: FROZEN`), dispatches an automated notification alert to the MIS System Administrator, and records an immutable audit log entry.

  
  

* **Role Routing:** Validated OTP codes issue an authenticated session token and route the executive directly to the **Executive Dashboard**.

  
  
  
  
  

---

  

## 2. Side Navigation Architecture & Module Layout for Executive Accounts

  

All analytical capabilities are organized into a collapsible side navigation bar featuring the following high-level modules:

  

```text

📊 DASHBOARDS

└─ Executive Dashboard Overview

  

📈 ANALYTICS SUITE

├─ Enrollment Analytics

├─ Faculty Analytics

└─ Admission / First-Gen Analytics

  

📂 DATA & UTILITIES

├─ Search & Filter Portal

└─ Export Reports & Certified Briefings

  

```

  

---

  

## 3. Universal System Rules & Interaction Design Tokens

  

* **Design System Tokens & Palette:**

* **Primary Dark (`#200D2D`):** Deep Navy-Purple for sidebar fills and container headers.

* **Secondary Light (`#BB96E4`):** Ethereal Lilac for active navigation items and hover states.

* **Highlight Accent (`#FFD066`):** Golden Harvest for primary KPI scorecards and stat callouts.

  
  

* College Visualization Color Standards:

  
  

* **CCS** (College of Computer Studies): Dark Slate / Gray (`#333333`).

  
  

* **COE** (College of Engineering): Vibrant Orange (`#FF6B00`).

  
  

* **COB** (College of Business): Warm Yellow (`#FFC700`).

  
  

* **COA** (College of Accountancy): Forest Green (`#00875A`).

  
  

* **COED** (College of Education): Royal Blue (`#0052CC`).

  
  
  
  

* **Universal Filtering Engine:** A persistent top filter bar (`Academic Year, Campus, College, Program, Year Level, Demographic Slicers`) that dynamically re-queries the backend database and updates all on-screen charts, metrics, and grids in real time.

  
  

* **Interaction Micro-Behaviors:**

* **Header Global Export Button:** Exports all dynamically rendered page content into a print-ready PDF or raw XLSX file.

  
  

* **Per-Chart & Per-Table Export Buttons:** Dedicated controls for extracting individual component data.

* **`View Chart` Zoomed-In Modal:** Opens a solo enlarged modal displaying detailed descriptions and hoverable data points.

* **`[Chart Selection]` Filter Button:** Opens a dropdown checkbox menu allowing executives to customize on-screen chart visibility.

  
  
  

---

  

## 4. Detailed Module-by-Module Process Breakdown & Dashboards

  

### Module 4.1: Executive Dashboard (High-Level University Pulse)

  

* **Workflow:** `[Open EIS]` $\rightarrow$ `[Authenticate Account]` $\rightarrow$ `[Landing: Executive Dashboard Loaded]` $\rightarrow$ `[Review Summary KPI Cards & Visualizations]` $\rightarrow$ `[Apply Global Filters]`

  

* **Default Focus:** University-wide institutional and academic health (Total headcount, enrollment variance, workforce capacity, and system alerts).

  
  

* Header KPI Scorecards:

  
  

* **Total Enrolled Students:** `10,000` (Displays `+4.2%` increase vs. prior term).

  
  

* **Overall Gender Ratio:** `54.0% Female / 46.0% Male`.

  
  

* **First-Gen Milestone Population:** `3,800` Students (`38.0%` of total headcount).

  
  

* **Active Faculty Members:** `240` Headcount (`65%` Full-Time / `35%` Part-Time).

  
  
  
  

* Bento Grid Visualizations:

  
  

* **Enrollees per College:** Donut Chart (CCS: `3,500`, COE: `2,500`, COB: `2,000`, COA: `1,200`, COED: `800`). *Rationale/Use:* Identifies high-volume colleges requiring budget or infrastructure allocations.

  
  

* **First-Gen vs. Non-First-Gen Status:** Pie Chart (`3,800` First-Gen / `6,200` Non-First-Gen). *Rationale/Use:* Tracks institutional targets for educating first-generation family scholars.

  
  

* **Gender Disaggregated Distribution:** Grouped Column Chart comparing male/female counts per college. *Rationale/Use:* Monitors gender parity across technical and non-technical programs.

  
  

* **Faculty Profile by Academic Rank:** Horizontal Bar Chart (`140` Instructors, `65` Assistant Professors, `25` Associate Professors, `10` Full Professors). *Rationale/Use:* Evaluates promotion pipelines and accreditation readiness.

  
  
  
  
  

---

  

### Module 4.2: Student Demographics Analytics Module

  

* **Workflow:** `[Navigate to Student Analytics]` $\rightarrow$ `[Apply Scope & Demographic Filters]` $\rightarrow$ `[Review Term-over-Term Trends]` $\rightarrow$ `[Analyze College-Level Headcounts]` $\rightarrow$ `[Export Findings]`

  

* Header KPI Badges:

  
  

* **Largest Academic Program:** `BSIT` (`1,800` Enrollees).

  
  

* **Top Female-Majority Program:** `BECEd` (`75.0%` Female).

  
  

* **Classroom Capacity Utilization:** `88.5%`.

  
  
  
  

* Bento Grid Visualizations:

  
  

* **Student Geographic Origin:** Horizontal Bar / Heatmap (District 2: `3,200`, District 5: `2,500`, District 1: `1,800`, District 3: `1,200`, District 4: `800`, Non-QC: `500`). *Rationale/Use:* Informs local scholarship distribution, bus routes, and satellite campus planning.

  
  

* **Age Range & Civil Status:** Stacked Bar Chart mapping civil status across age brackets. *Rationale/Use:* Assists admissions and student affairs in scheduling evening/weekend classes for working students.

  
  

* **Program Enrollees & Capacity Utilization:** Data Table Grid with Capacity Gauge Bars (e.g., BSIT: `1,800 / 2,000` at `90%`). *Rationale/Use:* Eliminates manual student counting during facility and course section allocations.

  
  
  
  
  

---

  

### Module 4.3: Faculty Analytics Module

  

* **Workflow:** `[Navigate to Faculty Analytics]` $\rightarrow$ `[Apply Workforce & Department Filters]` $\rightarrow$ `[Review Campus-Wide Workforce Metrics]` $\rightarrow$ `[Analyze Professional Backgrounds]` $\rightarrow$ `[Evaluate Workload]`

  

* Header KPI Badges:

  
  

* **Overall Student-to-Faculty Ratio:** `41.6 : 1`.

  
  

* **Faculty Master's / Ph.D. Qualification Rate:** `62.5%`.

  
  

* **Full-Time vs. Part-Time Split:** `156 Full-Time / 84 Part-Time`.

  
  
  
  

* Bento Grid Visualizations:

  
  

* **Faculty Distribution by Department:** Donut Chart (CCS: `75`, COE: `55`, COB: `45`, COA: `35`, COED: `30`). *Rationale/Use:* Balances faculty hiring budgets proportionately against student volumes.

  
  

* **Gender & Marital Status Breakdown:** Grouped Bar Chart evaluating demographic subgroups across faculty cohorts. *Rationale/Use:* Informs benefit administration and wellness initiatives.

  
  

* **Academic Qualifications & Attainment:** Stacked Column Chart showing highest degrees attained per department. *Rationale/Use:* Ensures qualifications satisfy CHED accreditation standards.

  
  
  
  
  

---

  

### Module 4.4: Admission / First-Generation Analytics Module

  

* **Workflow:** `[Navigate to Admission Analytics]` $\rightarrow$ `[Select Admission Cycle]` $\rightarrow$ `[Review Application Funnel Metrics]` $\rightarrow$ `[Analyze Conversion Rates]` $\rightarrow$ `[Evaluate Feeder Schools]`

  

* Header KPI Badges:

  
  

* **Total First-Generation Cohort:** `3,800` Students.

  
  

* **Top First-Gen Program Choice:** `BSIT` (`1,200` Students).

  
  

* **Total Government Scholars:** `6,800` Students (QCYDO, CHED, TES).

  
  
  
  

* Bento Grid Visualizations:

  
  

* **Socioeconomic Household Income Brackets:** Donut Chart (Low Income <P15k: Lower Middle P15k-P30k: Upper/Middle `28%`, `62%`,>P30k: `10%`). *Rationale/Use:* Justifies local government financial aid and subsidy expansion.

  
  

* **Scholarship Grant Distribution:** Grouped Column Chart comparing grants across First-Gen and Non-First-Gen students. *Rationale/Use:* Tracks financial support distribution across vulnerable cohorts.

  
  

* **First-Gen Year-Level Retention Progression:** Funnel Chart (1st Year Entry: `1,400`, 2nd Year Retention: `1,050`, 3rd Year: `800`, 4th Year Graduation: `550`). *Rationale/Use:* Identifies key dropout transition points to deploy interventions.

  
  
  
  
  

---

  

### Module 4.5: Search & Filter Portal

  

* **Workflow:** `[Click Global Search Bar]` $\rightarrow$ `[Type Keyword or ID]` $\rightarrow$ `[Apply Advanced Parameter Filters]` $\rightarrow$ `[Inspect Quick-Lookup Results Table]` $\rightarrow$ `[Open Detailed Profile View]`

  

* **System Displays & Function:** Universal lookup providing instant access to executive profile summaries, department-wide metrics, faculty credentials, and student demographic histories for auditing and monitoring.

  
  
  

---

  

### Module 4.6: Automated Certified Report Generation Module

  

* **Workflow:** `[Open Export Reports]` $\rightarrow$ `[Select Report Type]` $\rightarrow$ `[Apply Custom Filters]` $\rightarrow$ `[Choose Format (PDF / XLSX)]` $\rightarrow$ `[Generate Report]` $\rightarrow$ `[Download File]`

  

* **Target Export Sub-Modules:** Checkboxes for *Executive KPI Summary Scorecard*, *Student Enrollment & Gender Disaggregation Matrix*, *Faculty Profile & Qualification Audit*, and *First-Generation Milestone & Scholarship Distribution*.

  
  

* **Real-Life Purpose & Staff Benefit:** Eliminates the traditional 2–3 week manual compilation delay, enabling executives to instantly generate board-ready documentation.
