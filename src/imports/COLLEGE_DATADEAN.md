
# QCU InfoBoard: System Administrator Process Breakdown & Governance Framework

## 1. Institutional Framework: System Architecture & Role-Based Access Control (RBAC)

The strategic transition of Quezon City University (QCU) from manual, labor-intensive spreadsheet management to a real-time Executive Information System (EIS) requires a sophisticated security architecture. As a Senior Information Systems Architect, I have designed this platform to enforce a strict Role-Based Access Control (RBAC) model. This ensures that the ingestion and management of sensitive institutional records for over 10,000 students and 240 faculty members are functionally segregated from the analytical tools used by university leadership. By maintaining this structural divide, we guarantee data integrity and establish a "single source of truth" for the university.

### RBAC Permission Matrix

System Role

Authorized Personnel

Access Scope & Permission Level

Real-Life Operational Responsibility

**System Administrator**

MIS Staff, Lead Registrar Data Officer, Lead HR Data Officer

**Full CRUD Access:** Create, Read, Update, and Delete permissions across user profiles, data ingestion engines, and audit logs.

Maintains backend integrity, executes schema parsing for masterlists, and manages the account lifecycle.

**University Executive**

President, VPAA, Deans (CCS, COE, etc.), Dept. Heads

**Read-and-Filter Access:** Interactive access to dashboards, drill-downs, and reporting without database modification.

Conducts data-driven strategic planning, monitors program capacity, and exports certified decision-making reports.

**The "So What?" Layer: Institutional Risk Mitigation** The segregation of "Full CRUD" permissions for Administrators versus "Read-and-Filter" for Executives is a critical safeguard. It prevents accidental record deletion or unauthorized manual alterations during the analysis phase. By restricting data modification to a validated administrative workflow, the system ensures that executive visualizations are always derived from sanitized, uncorrupted datasets.

This architectural security begins at the system’s perimeter: the authentication gate.

## 2. Module A: Authentication & Security Gatekeeper Flow

Protecting the academic and socioeconomic records of a large-scale student population requires NIST-compliant security protocols. Our authentication flow is engineered to be resilient against brute-force attacks and credential theft through multi-layered verification and cryptographic hashing.

### Authentication & Security Sequence

1.  **Primary Sign-In:** Users interact with a split-screen interface. Credentials entered are validated against the **MySQL user registry** using secure cryptographic hashing.
2.  **Two-Factor Authentication (2FA):** Upon valid password entry, a 6-digit numeric One-Time Password (OTP) is generated and dispatched to the user’s registered QCU email.
3.  **OTP Expiration:** Per NIST standards, the OTP is strictly valid for only 10 minutes.
4.  **Enumeration-Safe Error Handling:** To prevent malicious actors from identifying valid account names, the system returns a unified error message for any failed login attempt: _"Invalid username, password, or security code."_
5.  **Role-Based Routing:** Upon successful verification, a session token is issued, and the user is routed to either the Administrative Control Center or the Executive Dashboard.

**The "So What?" Layer: Brute-Force Protection & Lockout Logic** The platform utilizes a "3-Consecutive-Failed-Attempt" lockout subroutine. If a user fails the primary login or OTP verification three times, the account status is updated to **FROZEN**. This state change triggers an immediate **Admin Bell Alert** to the MIS team. This prevents automated enumeration attacks from compromising the EIS while providing immediate notification to IT staff for intervention.

Once authenticated, the Administrator’s primary objective is the ingestion of institutional data.

## 3. Module B & Screen 8: Data Ingestion & Governance Workflow

The Data Ingestion module replaces traditional hand-tallying with an automated, Flourish-style visual validation engine. This ensures that only high-quality, verified data reaches the executive dashboards.

### Data Ingestion & Schema Validation Flow

-   **Drag-and-Drop Ingestion:** Administrators upload master datasets (.CSV or .XLSX) provided by the Registrar or HR into a dedicated dropzone.
-   **Automated Schema Parsing:** The backend automatically runs validation rules to flag errors such as missing Student IDs, invalid program codes (e.g., BSIT vs. BIT), or malformed gender tags.
-   **Interactive Grid Modal:** A validation preview highlights valid rows in green and malformed rows in red.
-   **In-Line Cell Editing:** Administrators can correct malformed data directly within the grid interface before committing the batch.

**The "So What?" Layer: Data Quality Assurance** The use of **In-Line Direct Grid Cell Editing** and **Mandatory Confirmation Modals** before database commits acts as a final governance gate. This workflow prevents "dirty data" or corrupted administrative spreadsheets from impacting high-level metrics, ensuring that the VPAA and Deans are making decisions based on accurate, parsed data.

Maintaining clean data is only possible through the active management of the personnel authorized to access the system.

## 4. Module D & Screen 7: User Management & Security Portal

The User Management Portal is the tactical hub for maintaining the account lifecycle and providing critical internal IT support for university leadership.

### Account Unlock Subroutine

In the event an Executive is locked out by the security subroutine, the Administrator performs the following:

1.  Locates the account in the User Management data table.
2.  Selects the **UNLOCK USER** action button.
3.  Confirms the action via a mandatory Modal Confirmation Dialog.
4.  The system resets the failed attempt counter and dispatches a temporary password link to the Executive.

**The "So What?" Layer: Administrative Accountability** By categorizing accounts into **ACTIVE, FROZEN, or DEACTIVATED** statuses, the MIS team maintains granular control over the system's security posture. This internal capability eliminates the need for external IT dependence, ensuring that university leadership experiences minimal downtime while maintaining a clear audit trail of who granted or revoked access.

## 5. Module D & Screen 9: Activity Audit Logs & Security Portal

The InfoBoard maintains an **immutable**, chronological audit trail to support institutional transparency and compliance with data privacy regulations.

### System Audit Trail Structure

The audit table tracks five mandatory data attributes for every transaction:

-   **Exact Timestamp:** (MM/DD/YYYY, HH:MM:SS) for precise event sequencing.
-   **Account Actor:** The specific user (e.g., admin_ruel or exec_vpaa) performing the action.
-   **Event Action:** The description of the activity (e.g., ACCOUNT_LOCKED_3X, EXPORT_PDF_REPORT).
-   **Impacted Module/Entity:** The specific area of the system modified or accessed.
-   **Source IP Address:** The originating network address of the request.

**The "So What?" Layer: Forensic Accountability** The audit portal features **KPI summary filter cards** (Total Logins, Failed OTP Alerts, Data Ingestions) that provide a high-level security pulse. The inclusion of **Source IP Addresses** and **Exact Timestamps** serves as a critical forensic tool; in the event of a sensitive data export or security breach, these immutable logs provide a tamper-proof record for accountability.

## 6. Universal Filtering Engine & Real-Time Dynamic Binding Rules

The Universal Filter Bar is the central mechanism for asynchronous data exploration, allowing for the navigation of the university's massive dataset through a simplified interface.

### Filter Parameters & Real-Time Binding

The engine employs **Real-Time Dynamic Binding Rules**, where any selection re-queries the **backend visualization index** to update all on-screen components.

-   **Academic Year (AY):** 2024–2025 through 2026–2027.
-   **Campus:** San Bartolome (Main), San Francisco, and Batasan.
-   **Academic Units:** The five colleges (CCS, COE, COB, COA, COED) and their respective programs (e.g., BSIT, BSIE, BSA).
-   **Demographic Slicers:** Age Range Slider (17–45+), First-Gen Status, and Faculty Employment Status.

**The "So What?" Layer: Actionable Insights** These filters transform a static 10,000-student database into actionable intelligence. By isolating "First-Gen" students at the San Bartolome campus, for example, the university can hyper-target resource allocation and student support strategies where they are needed most.

## 7. Visualizations, Components, and Integrated Sample Datasets

The platform utilizes a **Bento-Grid** layout to group related KPIs and adheres to **College Chart Color Standards** to minimize executive visual fatigue and ensure rapid data recognition.

### Screen 2: Executive Dashboard (High-Level Pulse)

-   **Visual Types:** Donut Charts (Enrollees by College) and Grouped Column Charts (Gender Breakdown).
-   **Rationale:** Donut charts are ideal for displaying the proportions of the five colleges at a glance.
-   **Sample Data:** Total 10,000 students (CCS: 3,500; COE: 2,500; COB: 2,000; COA: 1,200; COED: 800).
-   **College Colors:** CCS (#333333), COE (#FF6B00), COB (#FFC700), COA (#00875A), COED (#0052CC).
-   **Beneficiary:** University President and VPAA for high-level budget and space allocation.

### Screen 3: Student Demographics Analytics

-   **Visual Type:** Heatmap/Horizontal Bar (Geographic Origin) and Data Table with Capacity Gauges.
-   **Rationale:** **"Horizontal bars are perfect for comparing quantities across categories—in this case, student counts per district."**
-   **Sample Data:** District 2: 3,200 (32%); District 5: 2,500 (25%). BSIT: 1,800 / 2,000 Capacity (90% utilization).
-   **Beneficiary:** Registrar and QC LGU for scholarship distribution and campus expansion planning.

### Screen 4: Faculty Analytics

-   **Visual Type:** Stacked Column Chart (Academic Qualifications).
-   **Rationale:** Highlights the highest degree attained (Bachelor's, Master's, Ph.D.) per department to monitor CHED accreditation compliance.
-   **Sample Data:** CCS: 30 Bachelor’s, 35 Master’s, 10 Ph.D.
-   **Beneficiary:** HR Office and Quality Assurance for evaluating faculty promotion pipelines.

### Screen 5: Admission & First-Gen Milestone Analytics

-   **Visual Type:** Funnel Chart (Retention Progression).
-   **Funnel Logic:** Tracks the attrition of the First-Gen cohort from entry to graduation:
    -   1st Year Entry: 1,400 students
    -   2nd Year Retention: 1,050 (75%)
    -   3rd Year Retention: 800 (57.1%)
    -   4th Year Graduation: 550 (39.3%)
-   **Beneficiary:** Guidance Counselors for deploying targeted retention interventions at key dropout points.

### Screen 6: Certified Report Generation

The automated report engine eliminates the 2–3 week delay in manual reporting.

1.  **Selection:** User selects sub-modules (e.g., Student Analytics, First-Gen Report).
2.  **Format:** Choose between **PDF Executive Briefing** (visual) or **Raw Excel** (.xlsx).
3.  **Report Summary Preview:** System displays selected filters and total records included.
4.  **Edit Configuration:** Allows final adjustments before export.
5.  **Execution:** Generates a timestamped, certified report for board meetings.

This integrated framework empowers Quezon City University to achieve a data-driven culture of strategic planning, moving beyond manual administrative burdens toward precise, real-time resource allocation.
