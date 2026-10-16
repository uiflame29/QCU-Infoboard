
# Figma Make AI Design Specification & Master Process Flow: University Executive Tier

  

**Project Title:** QCU InfoBoard: A Data Visualization and Dashboard System for Institutional Planning at Quezon City University

  

**Target User Accounts:**

  

* **University President:** Dr. Victor Atienza (`doc.atienza` | `DocAtienza@2026`)

  
  

* **Vice President for Academic Affairs (VPAA):** Dr. Elena Bautista (`vpaa.qcu` | `VPAA@2026`)

  
  

**Target Environment:** Figma Make AI / Interactive Clickable High-Fidelity Prototyping Framework

**Document Scope:** Complete, production-grade Markdown prototype blueprint and implementation specification detailing the visual design system, security workflows, side navigation hierarchy, universal UI controls, and screen-by-screen data visualization layouts tailored for the University Executive tier.

  

---

  

## 1. Executive Summary & Prototyping Purpose

  

The QCU InfoBoard Executive Information System (EIS) provides Quezon City University leadership with real-time analytics and visual key performance indicators (KPIs). This prototyping specification translates the executive module blueprint into actionable instructions for Figma Make AI, structuring the interactive pathways, component states, and data visualization layouts for Dr. Victor Atienza (President) and Dr. Elena Bautista (VPAA).

  

---

  

## 2. Design System Tokens & Visual Palette

  

All Figma components, cards, backgrounds, and interactive elements must adhere strictly to these defined color tokens and styling rules:

  

### 2.1 Primary Design System Hex Tokens

  

* **Primary Dark (`#200D2D`):** Deep Navy-Purple for sidebar fills, dark container headers, and top accents.

* **Secondary Light (`#BB96E4`):** Ethereal Lilac for active navigation items, hover states, and pill badges.

* **Highlight Accent (`#FFD066`):** Golden Harvest for primary KPI stat values and warning indicators.

  

### 2.2 College Visualization Color Standards

  
  
  

* **CCS** (College of Computer Studies): Dark Slate / Gray (`#333333`)

  
  

* **COE** (College of Engineering): Vibrant Orange (`#FF6B00`)

  
  

* **COB** (College of Business): Warm Yellow (`#FFC700`)

  
  

* **COA** (College of Accountancy): Forest Green (`#00875A`)

  
  

* **COED** (College of Education): Royal Blue (`#0052CC`)

  
  
  

### 2.3 Layout Structure & Interaction Tokens

  

* **Typography:** Inter font family optimized for dense dashboards and scorecards.

* **Bento Grid Containers:** Rounded containers (`16px` to `24px` radius) with soft component shadows (`0px 8px 24px rgba(32, 13, 45, 0.08)`).

* **Universal Filtering Engine:** Persistent top filter bar (`Academic Year, Campus, College, Program, Year Level, Demographic Slicers`) that triggers real-time UI updates.

  
  
  

---

  

## 3. Security Architecture & Authentication Prototyping Flow

  

```text

[Executive Sign-In] ──> [Password Check] ──> [Email OTP (10m Expiry)] ──> [Validate Code]

│ │ │ │

│ Invalid Credentials │ 3 Failed Attempts │ Expired / Wrong │ Valid Code

▼ ▼ ▼ ▼

[Error Alert] ──> [Freeze Account] ──> [Alert MIS Admin] ──> [Route to Dashboard]

  

```

  

1. **Access Gate & Credential Entry:** Executive inputs username (`doc.atienza` or `vpaa.qcu`) and password.

  
  

2. **Primary Credential Verification:** If invalid, increments failed attempt counter and displays an enumeration-safe alert (`"Invalid username, password, or security code"`).

  
  

3. **2FA Email OTP Dispatch:** Triggers a 6-digit numeric OTP with a strict **10-minute expiration window** per NIST SP 800-63B standards.

  
  

4. **Automated Security Lockout:** Entering incorrect credentials or OTP codes **3 consecutive times** automatically freezes the account (`Status: FROZEN`), dispatches an alert to MIS, and records an audit log entry.

  
  

5. **Session Routing:** Validated OTP issues an authenticated session token, routing the user directly to the Executive Dashboard.

  
  
  

---

  

## 4. Centralized Side Navigation Architecture

  

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

  

## 5. Screen-by-Screen Prototype Implementation Breakdown

  

### Module 5.1: Executive Dashboard (High-Level University Pulse)

  

* **Workflow:** `[Open EIS]` $\rightarrow$ `[Authenticate Account]` $\rightarrow$ `[Landing: Executive Dashboard Loaded]` $\rightarrow$ `[Review Summary KPI Cards & Visualizations]` $\rightarrow$ `[Apply Global Filters]`

  

* Header KPI Scorecards Component Stack:

  
  

* **Total Enrolled Students:** `10,000` (`+4.2%` increase vs. prior term).

  
  

* **Overall Gender Ratio:** `54.0% Female / 46.0% Male`.

  
  

* **First-Gen Milestone Population:** `3,800` Students (`38.0%` of total headcount).

  
  

* **Active Faculty Members:** `240` Headcount (`65%` Full-Time / `35%` Part-Time).

  
  
  
  

* Bento Grid Visualizations Component Stack:

  
  

* **Enrollees per College:** Donut Chart (CCS: `3,500`, COE: `2,500`, COB: `2,000`, COA: `1,200`, COED: `800`). *Interaction:* Clicking a college segment filters the active view.

  
  

* **First-Gen vs. Non-First-Gen Status:** Pie Chart (`3,800` First-Gen / `6,200` Non-First-Gen). *Interaction:* Hovering shows precise counts and percentage breakdowns.

  
  

* **Gender Disaggregated Distribution:** Grouped Column Chart comparing male/female counts per college.

  
  

* **Faculty Profile by Academic Rank:** Horizontal Bar Chart (`140` Instructors, `65` Assistant Professors, `25` Associate Professors, `10` Full Professors).

  
  
  
  
  

---

  

### Module 5.2: Student Demographics Analytics Module

  

* **Workflow:** `[Navigate to Student Analytics]` $\rightarrow$ `[Apply Scope & Demographic Filters]` $\rightarrow$ `[Review Term-over-Term Trends]` $\rightarrow$ `[Analyze College-Level Headcounts]` $\rightarrow$ `[Export Findings]`

  

* Header KPI Badges Component Stack:

  
  

* **Largest Academic Program:** `BSIT` (`1,800` Enrollees).

  
  

* **Top Female-Majority Program:** `BECEd` (`75.0%` Female).

  
  

* **Classroom Capacity Utilization:** `88.5%`.

  
  
  
  

* Bento Grid Visualizations Component Stack:

  
  

* **Student Geographic Origin:** Horizontal Bar / Heatmap (District 2: `3,200`, District 5: `2,500`, District 1: `1,800`, District 3: `1,200`, District 4: `800`, Non-QC: `500`).

  
  

* **Age Range & Civil Status:** Stacked Bar Chart mapping civil status across age brackets.

  
  

* **Program Enrollees & Capacity Utilization:** Data Table Grid with Capacity Gauge Bars (e.g., BSIT: `1,800 / 2,000` at `90%`). *Interaction:* Clicking a program row opens a detail view.

  
  
  
  
  

---

  

### Module 5.3: Faculty Analytics Module

  

* **Workflow:** `[Navigate to Faculty Analytics]` $\rightarrow$ `[Apply Workforce & Department Filters]` $\rightarrow$ `[Review Campus-Wide Workforce Metrics]` $\rightarrow$ `[Analyze Professional Backgrounds]` $\rightarrow$ `[Evaluate Workload]`

  

* Header KPI Badges Component Stack:

  
  

* **Overall Student-to-Faculty Ratio:** `41.6 : 1`.

  
  

* **Faculty Master's / Ph.D. Qualification Rate:** `62.5%`.

  
  

* **Full-Time vs. Part-Time Split:** `156 Full-Time / 84 Part-Time`.

  
  
  
  

* Bento Grid Visualizations Component Stack:

  
  

* **Faculty Distribution by Department:** Donut Chart (CCS: `75`, COE: `55`, COB: `45`, COA: `35`, COED: `30`).

  
  

* **Gender & Marital Status Breakdown:** Grouped Bar Chart evaluating demographic subgroups.

  
  

* **Academic Qualifications & Attainment:** Stacked Column Chart showing highest degrees attained per department.

  
  
  
  
  

---

  

### Module 5.4: Admission / First-Generation Analytics Module

  

* **Workflow:** `[Navigate to Admission Analytics]` $\rightarrow$ `[Select Admission Cycle]` $\rightarrow$ `[Review Application Funnel Metrics]` $\rightarrow$ `[Analyze Conversion Rates]` $\rightarrow$ `[Evaluate Feeder Schools]`

  

* Header KPI Badges Component Stack:

  
  

* **Total First-Generation Cohort:** `3,800` Students.

  
  

* **Top First-Gen Program Choice:** `BSIT` (`1,200` Students).

  
  

* **Total Government Scholars:** `6,800` Students (QCYDO, CHED, TES).

  
  
  
  

* Bento Grid Visualizations Component Stack:

  
  

* **Socioeconomic Household Income Brackets:** Donut Chart (Low Income `<P15k`: Lower Middle Upper/Middle ` `28%`, `62%`, `P15k–P30k`:>P30k`: `10%`).

  
  

* **Scholarship Grant Distribution:** Grouped Column Chart comparing grants across First-Gen and Non-First-Gen students.

  
  

* **First-Gen Year-Level Retention Progression:** Funnel Chart (1st Year Entry: `1,400`, 2nd Year Retention: `1,050`, 3rd Year: `800`, 4th Year Graduation: `550`).

  
  
  
  
  

---

  

### Module 5.5: Search & Filter Portal

  

* **Workflow:** `[Click Global Search Bar]` $\rightarrow$ `[Type Keyword or ID]` $\rightarrow$ `[Apply Advanced Parameter Filters]` $\rightarrow$ `[Inspect Quick-Lookup Results Table]` $\rightarrow$ `[Open Detailed Profile View]`

  

* **Prototype Implementation Component:** Instant type-ahead lookup results container with entity categorization badges for student records, faculty profiles, and institutional reports.

  
  
  

---

  

### Module 5.6: Automated Certified Report Generation Module

  

* **Workflow:** `[Open Export Reports]` $\rightarrow$ `[Select Report Type]` $\rightarrow$ `[Apply Custom Filters]` $\rightarrow$ `[Choose Format (PDF / XLSX)]` $\rightarrow$ `[Generate Report]` $\rightarrow$ `[Download File]`

  

* **Prototype Implementation Component:** Interactive modal form featuring checkboxes for *Executive KPI Summary Scorecard*, *Student Enrollment Matrix*, *Faculty Qualification Audit*, and *First-Generation Distribution*, alongside format toggle buttons and a `[Generate & Export Report]` action button.
