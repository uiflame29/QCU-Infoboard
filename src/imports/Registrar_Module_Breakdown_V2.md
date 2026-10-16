# **UPDATED REGISTRAR ROLE Functional Requirements and Workflow Specification** 

Cross-Checked and Enhanced Against the UPDATED 09_25_26 QCU InfoBoard Module and End-to-End Full Process Event Flow 

|Item|Updated Scope|
|---|---|
|Role|Registrar|
|Covered Colleges|COA, COB, CCS, COE, COED|
|Main Modules|Dashboard • Import Data • Enrollment Analytics • Faculty Analytics • Admission Analytics|
|Baseline Rule|All existing Registrar Functional Requirements are retained unless explicitly identified as outside Registrar scope.|
|Enhancement Rule|Registrar-relevant items found in the updated InfoBoard source are added without replacing baseline<br>requirements.|
|Visualization Rule|Examples use consistent sample data and demonstrate real-time filter-driven recalculation.|



This version is designed as a consolidated working specification for process-flow definition, Figma prototyping, functional requirements, and data-visualization planning. 

Revision note: Cross-check requirements are now integrated into their designated Registrar modules in Version 3. 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 1 

## **1. Cross-Check Summary: UPDATED InfoBoard vs. Registrar Functional Requirements** 

The existing Registrar Functional Requirements document already covers the core Registrar modules, permissions, filters, dashboard, import workflow, enrollment analytics, faculty analytics, admission analytics, drill-down, reports, search, validation, update workflow, cross-module relationships, and functional requirement IDs. The updated InfoBoard source adds several Registrar-relevant visualization and filter behaviors that were only partially represented or absent in the Registrar document. 

|Registrar-relevant item in updated InfoBoard|Status in Registrar PDF|Action in Version 2|
|---|---|---|
|Universal real-time filter bar|Partially covered|Expanded with centralized filter behavior and live recalculation<br>examples.|
|Campus Location filter|Missing|Added to Global Data Dimensions, Global Filters, workflows, and<br>examples.|
|Age Range filter (17–45+)|Missing|Added as optional student demographic filter.|
|First-Gen Status filter|Missing|Added to student/admission analytics and dynamic examples.|
|Faculty Employment Status: Full-Time /<br>Part-Time|Missing|Added to faculty filters and dynamic examples.|
|Student Geographic Origin / QC Districts|Missing|Added to Student Demographics.|
|Age Range & Civil Status|Missing|Added to Student Demographics.|
|Program Capacity Utilization with gauge/table|Partially covered|Expanded with capacity utilization dataset and live filter behavior.|
|Faculty Academic Rank|Missing|Added to Faculty Analytics.|
|Faculty Gender & Marital Status breakdown|Partially covered|Expanded with sample dataset and dynamic filter example.|
|Faculty Qualification stacked visualization|Covered|Expanded with consistent sample data and filters.|
|Admission/First-Gen socioeconomic income|Missing|Added to Admission Analytics where data is available.|
|Scholarship distribution by First-Gen status|Missing|Added as an optional admission/first-gen visualization.|
|First-Gen year-level retention/progression<br>funnel|Missing|Added as optional cohort visualization.|
|Interactive chart-element drill-down|Partially covered|Explicitly added to drill-down behavior.|
|Timestamped certified PDF/Excel export|Covered|Expanded with report-generation behavior.|
|Mandatory confirmation for state-changing<br>actions|Partially covered|Applied to Registrar import confirmation and other Registrar<br>state-changing actions.|
|System Admin User Management / Audit Logs|Out of Registrar scope|Not added to Registrar modules; retained only as architecture<br>boundary.|



Scope decision: System Administrator functions such as user management, account unlocking, security audit-log administration, system configuration, and backend schema administration are not added as Registrar capabilities because the existing Registrar permission matrix explicitly excludes those functions. 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 2 

## **2. Existing Registrar Functional Requirements — Retained Baseline** 

The following section preserves the substantive contents of the existing Registrar Functional Requirements and Workflow Specification. It is included as the baseline and is not intentionally removed. Enhancements are provided in later sections. 

Registrar Role Functional Requirements and Workflow Specification 

Comprehensive specification for Dashboard, Import Data, Enrollment Analytics, Faculty Analytics, and Admission Analytics <b>Role</b> <b>Registrar</b> 

Covered Colleges COA, COB, CCS, COE, COED 

Primary Purpose University academic data monitoring, analytics, reporting, and data import 

Main Modules Dashboard • Import Data • Enrollment Analytics • Faculty Analytics • Admission Analytics 

KPI Design Principle 

`Summary Cards` → `Overall Situation Charts/Graphs` → `Breakdown and Comparison Tables` → `Detailed Information Filters` → `Specific Analysis Drill-Down` → `College and Program Details Reports` → `Formal Output` 

### **1. Role Overview** 

The Registrar is responsible for monitoring and managing university academic information, particularly student enrollment, student records, faculty information, and admission-related data. 

The Registrar module provides a centralized analytics platform for COA, COB, CCS, COE, and COED. 

The system provides summarized information through KPI cards, charts, graphs, tables, filters, and reports. 

The main modules are: 

- Dashboard 

- Import Data 

- Enrollment Analytics 

- Faculty Analytics 

- Admission Analytics 

The system shall allow the Registrar to view information at the university, college, and program levels. 

### **2. Registrar Role and Permission Matrix** 

<b>Function</b> <b>Registrar Access</b> 

View Dashboard 

View Enrollment Analytics 

View Student Analytics 

View Faculty Analytics 

View Admission Analytics 

Import Data Filter Data Search Data 

View College Data 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 3 

View Program Data Compare Academic Years Compare Semesters Generate Reports Export Analytics View Detailed Records Edit Imported Data Limited Manage Users Manage Roles Configure System Settings Delete System-Wide Data 

### **3. Global System Architecture** 

QCU InfoBoard System 

I 

REGISTRAR 

I 

##### IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII 

I I I 

Enrollment Data Faculty Data Admission Data 

I I I 

Enrollment Analytics Faculty Analytics Admission Analytics 

I I I 

IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII 

I 

Registrar Dashboard 

### **4. Global Data Dimensions** 

<b>Dimension</b> <b>Examples</b> 

Academic Year 2024–2025, 2025–2026, 2026–2027 Semester 1st Semester, 2nd Semester, Summer College COA, COB, CCS, COE, COED Program Programs under each college Year Level 1st Year, 2nd Year, 3rd Year, 4th Year Student Status Regular, Irregular, Graduating, Leave, Withdrawn Student Type New, Continuing, Returning, Transferee Gender Based on available institutional records Academic Performance GPA/GWA, academic standing Faculty Status Active, Inactive Faculty Qualification Bachelor's, Master's, Doctorate/Ph.D. Admission Status Applicant, Qualified, Accepted, Enrolled 

### **5. Global Filters** 

Academic Year 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 4 

↓ 

Semester 

↓ 

College ↓ Program ↓ Year Level ↓ Student Status ↓ 

Student Type 

### **Functional Requirements** 

FR-REG-FLT-01 – The system shall allow the Registrar to filter data by academic year. 

FR-REG-FLT-02 – The system shall allow the Registrar to filter data by semester. FR-REG-FLT-03 – The system shall allow the Registrar to filter data by college. FR-REG-FLT-04 – The system shall allow the Registrar to filter data by program. FR-REG-FLT-05 – The system shall allow multiple filters to be applied at the same time. FR-REG-FLT-06 – The system shall automatically update summary cards, charts, and tables based on selected filters. FR-REG-FLT-07 – The system shall provide a Clear Filters function. 

FR-REG-FLT-08 – The system shall display the currently applied filters. 

### **6. Module 1 – Dashboard** 

### **6.1 Purpose** 

The Dashboard shall provide the Registrar with a high-level summary of the university's current academic and administrative data. 

The Dashboard should allow the Registrar to quickly understand overall student population, faculty population, current enrollment, admission activity, student retention, student progression, academic performance, and student-to-faculty capacity. 

### **6.2 Dashboard Summary Cards** 

<b>Summary Card</b> <b>Information</b> 

Total Students Total number of students in the selected academic period 

Total Faculty Total number of active faculty 

Total Applicants Total number of applicants for the selected admission period 

Total Enrolled Total number of enrolled students 

Retention Rate Overall percentage of retained students 

Progression Rate Overall percentage of students who progressed 

Average Academic Performance Overall average GPA/GWA 

Student-to-Faculty Ratio Overall student-to-faculty ratio 

### **6.3 Dashboard Charts** 

<b>Chart</b> <b>Type</b> <b>Purpose</b> 

Enrollment by College Bar / Donut Compare student population among COA, COB, CCS, COE, and COED 

Enrollment Trend Line Show enrollment changes by semester and academic year 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 5 

Student Distribution by Year Level Column Show 1st to 4th year distribution 

Student Status Distribution Donut Show overall student status composition 

Faculty Distribution by College Bar Compare faculty counts across colleges 

Student-to-Faculty Ratio Horizontal Bar Compare capacity by college 

Admission Funnel Funnel Show movement from applicants to enrolled students 

Current vs Previous Enrollment Grouped Bar Compare selected academic periods 

### **7. Module 2 – Import Data** 

### **7.1 Purpose** 

The Import Data module shall allow the Registrar to upload and update university data used by the analytics modules. Supported file formats may include CSV and Excel, depending on the final system implementation. 

### **7.2 Data Categories** 

<b>Category</b> <b>Main Data Fields</b> 

Student Data Student ID, academic year, semester, college, program, year level, gender, student type, student status, enrollment status, GPA/GWA, credits earned, progression status 

Faculty Data Faculty ID, college, program/department, gender, marital status if available, academic qualification, faculty status, teaching load, academic year, semester 

<b>Category</b> <b>Main Data Fields</b> 

Admission Data Applicant ID, application date, academic year, college, program, applicant type, qualification status, admission status, acceptance status, enrollment status 

### **7.3 Import Workflow** 

Registrar 

↓ 

Open Import Data 

↓ Select Data Type ↓ Upload File ↓ System Reads File ↓ 

System Reads File 

Validate File 

↓ 

Check Required Fields 

↓ 

Check Duplicate Records 

↓ 

Check Invalid Values 

↓ 

Display Validation Summary 

↓ 

Registrar Reviews Results 

↓ 

Confirm Import 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 6 

↓ 

System Saves Valid Data 

↓ 

Analytics Updated 

### **7.4 Import Summary Cards** 

<b>Summary Card</b> <b>Information</b> 

Total Records Total records detected in the uploaded file Valid Records Records that passed validation Invalid Records Records containing errors 

Duplicate Records Records identified as duplicates 

Last Import Date and time of the most recent import 

### **7.5 Import Functional Requirements** 

FR-REG-IMP-01 – The system shall allow the Registrar to select the type of data to import. FR-REG-IMP-02 – The system shall allow the Registrar to upload supported files. FR-REG-IMP-03 – The system shall validate required fields. FR-REG-IMP-04 – The system shall detect duplicate records. FR-REG-IMP-05 – The system shall detect missing information. FR-REG-IMP-06 – The system shall detect invalid college and program values. FR-REG-IMP-07 – The system shall display an import summary before final confirmation. FR-REG-IMP-08 – The system shall prevent invalid records from affecting analytics. FR-REG-IMP-09 – The system shall record the date and time of an import. FR-REG-IMP-10 – The system shall record the user who performed the import. 

FR-REG-IMP-11 – The system shall provide an import history. 

### **8. Module 3 – Enrollment Analytics** 

### **8.1 Purpose** 

Enrollment Analytics shall provide the Registrar with a complete overview of the university's student population, including enrollment, demographics, student type, student status, academic performance, progression, retention, college distribution, program distribution, and year-level distribution. 

### **8.2 Enrollment Summary Cards** 

<b>Summary Card</b> <b>Information</b> 

Total Enrollment Total enrolled students 

Enrollment Change Increase/decrease from the previous period 

Average Academic Performance Overall average GPA/GWA 

Retention Rate Overall percentage of students retained 

Progression Rate Overall percentage of students progressing 

Graduating Students Total students classified as graduating 

### **8.3 Enrollment Charts** 

<b>Chart</b> <b>Type</b> <b>Purpose</b> 

Enrollment by College Donut / Bar Show distribution among five colleges 

Enrollment by Program Horizontal Bar Compare programs within colleges 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 7 

Enrollment Trend Line Show changes by semester and academic year 

Enrollment by Year Level Column Show student distribution by year level 

Student Type Distribution Donut Show new, continuing, returning, transferee, and other categories 

Student Status Distribution Donut Show regular, irregular, graduating, leave, withdrawn, and other statuses 

### **9. Student Demographics** 

Summary Cards <b>Summary Card</b> <b>Information</b> 

Total Students Overall student population 

Gender Distribution Summary of recorded gender distribution 

New Student Population Total newly enrolled students 

Continuing Student Population Total continuing students 

#### Charts 

- Gender Distribution – Donut Chart 

- Gender by College – Grouped Bar Chart 

- Student Type Distribution – Donut Chart 

- Student Type by College – Stacked Bar Chart 

- Year Level Distribution – Column Chart 

- Student Demographics by Program – Bar Chart 

### **10. Student Academic Performance** 

Summary Cards <b>Summary Card</b> <b>Information</b> 

Average GPA/GWA Overall academic performance 

Passing Rate Overall percentage meeting the passing requirement 

Academic Completion Rate Overall percentage of completed academic requirements 

Students with Academic Concern Total students requiring academic monitoring 

Charts 

- GPA/GWA Distribution – Histogram / Column Chart 

- Academic Performance by College – Bar Chart 

- Academic Performance by Program – Horizontal Bar Chart 

- Academic Performance Trend – Line Chart 

- Performance by Year Level – Grouped Bar Chart 

### **11. Student Progression Analytics** 

Summary Cards <b>Summary Card</b> <b>Information</b> 

Progression Rate Overall percentage progressing to the next level 

On-Time Progression Rate Percentage progressing according to expected academic schedule 

Retention Rate Overall percentage of students retained 

Graduating Students Total students expected/classified as graduating 

#### Charts 

- Progression by Year Level – Stacked Bar Chart 

- Progression by College – Bar Chart 

- Progression by Program – Horizontal Bar Chart 

- Cohort Progression – Line Chart 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 8 

### **12. Student Retention and Attrition** 

Summary Cards <b>Summary Card</b> <b>Information</b> 

Retention Rate Overall percentage of retained students 

Students Not Returning Total students who did not continue 

Withdrawal Rate Overall percentage of withdrawn students 

Transfer-Out Count Total students who transferred out, if available 

Charts 

- Retention Trend – Line Chart 

- Retention by College – Bar Chart 

- Retention by Program – Horizontal Bar Chart 

- Student Status Movement – Flow/Sankey-style Chart 

- Retention by Student Type – Stacked Bar Chart 

### **13. Enrollment Capacity** 

The Registrar shall be able to compare the student population with faculty availability. 

Summary Cards <b>Summary Card</b> <b>Information</b> 

Total Students Overall student population 

Total Faculty Overall active faculty 

Student-to-Faculty Ratio Overall ratio 

Average Students per Faculty Average student count assigned per faculty 

Student-to-Faculty Ratio by College <b>College</b> <b>Ratio</b> 

CCS 45 : 1 COE 40 : 1 COB 40 : 1 COA 30 : 1 COED 28 : 1 

### **14. Module 4 – Faculty Analytics** 

### **14.1 Purpose** 

Faculty Analytics shall provide the Registrar with a summary of faculty population, distribution, qualifications, demographics, and academic capacity. 

### **14.2 Faculty Summary Cards** 

<b>Summary Card</b> <b>Information</b> 

Total Active Faculty Total active faculty members 

Student-to-Faculty Ratio Overall student-to-faculty ratio 

Average Teaching Load Average teaching load, if available 

Faculty Qualification Summary Overall summary of faculty academic qualifications 

Faculty Distribution Overall distribution across colleges 

### **14.3 Faculty Distribution Charts** 

- Faculty by College – Donut Chart / Bar Chart 

- Faculty by Program – Horizontal Bar Chart 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 9 

- Faculty by Gender – Donut Chart 

- Faculty Demographics by College – Grouped Bar Chart 

### **15. Faculty Qualifications** 

Summary Cards <b>Summary Card</b> <b>Information</b> 

Total Faculty Overall faculty population 

Faculty with Master's Degree or Higher Total faculty meeting the selected qualification level 

Faculty with Doctorate/Ph.D. Total faculty with doctorate-level qualification 

Average Qualification Level Overall qualification summary, if supported by the data 

Charts 

- Qualification by College – Stacked Column Chart 

- Overall Qualification Distribution – Donut Chart 

- Qualification by Program – Stacked Bar Chart 

- Qualification Trend – Line / Stacked Column Chart 

### **16. Faculty Capacity Analytics** 

Summary Cards <b>Summary Card</b> <b>Information</b> 

Total Students Overall student population 

Total Faculty Overall active faculty 

Student-to-Faculty Ratio Overall ratio 

Average Students per Faculty Average number of students per faculty 

Charts 

- Student-to-Faculty Ratio by College – Bar Chart 

- Faculty by Program – Bar Chart 

- Students by Program – Bar Chart 

- Faculty Capacity Trend – Line Chart 

- Student and Faculty Comparison – Grouped Bar Chart 

### **17. Faculty Trend Analytics** 

- Faculty Count Trend – Line Chart 

- Faculty by College Over Time – Multi-line or Grouped Column Chart 

- Faculty Qualification Trend – Stacked Column Chart 

### **18. Module 5 – Admission Analytics** 

### **18.1 Purpose** 

Admission Analytics shall allow the Registrar to monitor the movement of applicants from application to enrollment. The module covers applicants, qualification, acceptance, confirmation, enrollment, college, program, applicant type, and admission trends. 

### **18.2 Admission Summary Cards** 

<b>Summary Card</b> <b>Information</b> 

Total Applicants Total applicants 

Total Qualified Total qualified applicants 

Total Accepted Total accepted applicants 

Total Enrolled Total applicants who became enrolled students 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 10 

Admission Conversion Rate Overall percentage of applicants who became enrolled 

Application Growth Change in applications compared with the previous admission period 

### **18.3 Admission Funnel** 

Applicants 

↓ 

Qualified Applicants 

↓ Accepted Applicants ↓ Confirmed Applicants ↓ 

Enrolled Students 

### **19. Applicants by College** 

Chart Type: Column Chart 

Displays applicant counts for COA, COB, CCS, COE, and COED. 

### **20. Applicants by Program** 

Chart Type: Horizontal Bar Chart 

Programs shall be grouped under their corresponding colleges. The Registrar shall be able to select a college to view its programs. 

### **21. Admission Status** 

Chart Type: Donut Chart 

- Applicant 

- Qualified 

- Accepted 

- Confirmed 

- Enrolled 

- Not Qualified 

- Withdrawn 

- Other official statuses 

### **22. Admission Trend** 

Chart Type: Line Chart 

Displays total applications, qualified applicants, accepted applicants, and enrolled applicants across admission periods. 

### **23. Admission by Student Type** 

Chart Type: Stacked Bar Chart 

Displays applicant distribution by applicable classifications such as first-time applicants, transferees, returning students, and other official classifications. 

### **24. Admission Conversion Analytics** 

Qualification Rate Qualified Applicants 

IIIIIIIIIIIIIIIIIIII `× 100` 

Total Applicants 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 11 

Acceptance Rate Accepted Applicants 

IIIIIIIIIIIIIIIIIIII `× 100` 

Qualified Applicants 

Enrollment Conversion Rate Enrolled Applicants 

IIIIIIIIIIIIIIIIIIII `× 100` 

Accepted Applicants 

The system shall clearly identify the denominator used for each rate. 

### **25. Admission-to-Enrollment Comparison** 

Chart Type: Grouped Column Chart 

The chart shall compare Applicants, Qualified, Accepted, and Enrolled by college. 

### **26. College and Program Hierarchy** 

University 

I 

III `COA` 

I III `Program` 

I III `Program` 

I III `Program` 

I 

III `COB` 

I III `Program` 

I III `Program` 

I 

III `CCS` 

I III `Program` 

I III `Program` I III `Program` I 

III `COE` 

I III `Program` I III `Program` I 

III `COED` 

III `Program` 

III `Program` 

The actual program names shall be retrieved from the university's official program data. 

### **27. Drill-Down Function** 

University 

↓ 

College 

↓ Program ↓ Year Level ↓ 

Student Category 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 12 

↓ 

Detailed Aggregated Data 

The system shall preserve the selected filters during drill-down. 

### **28. Report Generation** 

Enrollment Reports 

- Enrollment Summary 

- Enrollment by College 

- Enrollment by Program 

- Enrollment by Year Level 

- Student Demographics 

- Student Status 

- Academic Performance 

- Student Progression 

- Retention 

Faculty Reports 

- Faculty Summary 

- Faculty Distribution 

- Faculty Qualifications 

- Faculty Demographics 

- Faculty Capacity 

- Student-to-Faculty Ratio 

Admission Reports 

- Applicant Summary 

- Admission Status 

- Admission Funnel 

- Applicants by College 

- Applicants by Program 

- Admission Conversion 

- Admission Trends 

### **29. Export Requirements** 

FR-REG-EXP-01 – The system shall allow the Registrar to export filtered analytics. 

FR-REG-EXP-02 – The exported report shall reflect the selected filters. FR-REG-EXP-03 – The report shall display the report title. FR-REG-EXP-04 – The report shall display the selected academic year and semester. 

FR-REG-EXP-05 – The report shall display the date of report generation. 

FR-REG-EXP-06 – The system shall allow charts and summary tables to be included in generated reports. 

### **30. Search Function** 

The system shall provide a search function for relevant information. 

- Student ID 

- Program 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 13 

- College 

- Academic Year 

- Faculty ID 

- Applicant ID 

- Admission Status 

Search results shall follow the Registrar's access permissions. 

### **31. Data Validation** 

- Missing Student ID 

- Duplicate Student ID 

- Invalid College 

- Invalid Program 

- Invalid Academic Year 

- Invalid Semester 

- Invalid Year Level 

- Missing Student Status 

- Invalid Faculty Qualification 

- Duplicate Applicant ID 

- Invalid Admission Status 

### **Validation Summary** 

IMPORT VALIDATION 

Total: 1,250 Valid: 1,220 Invalid: 30 Duplicates: 20 

[View Details] 

### **32. Data Update Workflow** 

New Institutional Data 

↓ Registrar Imports Data ↓ System Validates Data ↓ 

System Validates Data 

### **Validation Summary** 

↓ 

Registrar Reviews ↓ Confirm Import ↓ 

Valid Data Stored 

↓ ↓ 

Analytics Recalculated 

Dashboard Updated 

### **33. Cross-Module Data Relationship** 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 14 

### **Dashboard** 

I 

IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII 

I I I 

Enrollment Faculty Admission Analytics Analytics Analytics 

I I I 

IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII 

I 

### **Import Data** 

### **Admission-to-Enrollment Relationship** 

Applicant ↓ Qualified ↓ Accepted ↓ Confirmed ↓ Enrolled ↓ New Student ↓ Continuing Student ↓ Graduating Student 

### **34. Main Registrar Workflow** 

### **Login** 

### **Login** 

↓ 

System Verifies Credentials ↓ System Identifies Registrar Role ↓ Registrar Dashboard 

### **Dashboard** 

### **Dashboard** 

↓ View Summary Cards ↓ View Charts ↓ Apply Filters 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 15 

↓ 

View Updated Summary 

↓ 

Select Chart 

↓ Drill Down ↓ 

View Detailed Analytics 

### **Enrollment Workflow** 

Enrollment Analytics 

↓ Select Academic Year ↓ Select Semester ↓ Select College ↓ Select Program ↓ View Enrollment Summary ↓ View Demographics ↓ View Academic Performance ↓ 

View Progression ↓ View Retention ↓ Generate Report 

### **Faculty Workflow** 

Faculty Analytics ↓ 

Select Academic Period ↓ Select College ↓ 

View Faculty Summary ↓ View Faculty Distribution ↓ 

View Qualifications 

↓ 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 16 

View Capacity 

↓ 

View Student-to-Faculty Ratio 

↓ 

Generate Report 

### **Admission Workflow** 

Admission Analytics ↓ Select Admission Period ↓ View Admission Summary ↓ View Applicant Distribution ↓ View Qualification ↓ View Acceptance ↓ View Enrollment ↓ Compare Colleges/Programs ↓ Generate Report 

### **Import Workflow** 

### **Import Data** 

↓ Select Data Category ↓ Upload File ↓ Validate Data ↓ View Import Summary ↓ Review Errors ↓ Confirm Import ↓ 

Save Valid Data 

↓ 

Update Analytics 

### **35. Functional Requirements Summary** 

<b>ID</b> <b>Functional Requirement</b> 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 17 

FR-REG-01 The system shall provide a Registrar-specific dashboard. FR-REG-02 The system shall display summarized enrollment information. FR-REG-03 The system shall display student demographic analytics. FR-REG-04 The system shall display student academic performance analytics. FR-REG-05 The system shall display student progression analytics. FR-REG-06 The system shall display student retention analytics. FR-REG-07 The system shall display summarized faculty information. FR-REG-08 The system shall display faculty distribution. FR-REG-09 The system shall display faculty qualifications. FR-REG-10 The system shall display faculty capacity information. FR-REG-11 The system shall display student-to-faculty ratios. FR-REG-12 The system shall display summarized admission information. FR-REG-13 The system shall display the admission funnel. FR-REG-14 The system shall display applicant-to-enrollment conversion. FR-REG-15 The system shall allow the Registrar to import data. FR-REG-16 The system shall validate imported data. FR-REG-17 The system shall detect duplicate records. FR-REG-18 The system shall detect invalid records. FR-REG-19 The system shall support academic year filtering. FR-REG-20 The system shall support semester filtering. FR-REG-21 The system shall support college filtering. FR-REG-22 The system shall support program filtering. FR-REG-23 The system shall support year-level filtering. FR-REG-24 The system shall update summary cards based on selected filters. FR-REG-25 The system shall update charts based on selected filters. FR-REG-26 The system shall support college-to-program drill-down. FR-REG-27 The system shall provide detailed analytics tables. FR-REG-28 The system shall generate reports. FR-REG-29 The system shall allow filtered analytics to be exported. FR-REG-30 The system shall maintain import history. 

FR-REG-31 The system shall record the date and user associated with an import. 

FR-REG-32 The system shall update analytics after valid data is imported. 

FR-REG-33 The system shall restrict administrative functions that are outside the Registrar role. 

### **36. Recommended Registrar Information Architecture** 

REGISTRAR 

I 

III `Dashboard` 

I III `Summary Cards` 

I III `Enrollment Overview` I III `Student Overview` I III `Faculty Overview` 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 18 

I III `Admission Overview` 

I III `Import Data` I III `Student Data` I III `Faculty Data` I III `Admission Data` I III `Import History` I III `Enrollment Analytics` I III `Enrollment Overview` I III `Student Demographics` I III `Student Status` I III `Academic Performance` I III `Student Progression` I III `Retention` I III `Faculty Analytics` I III `Faculty Overview` I III `Faculty Distribution` I III `Faculty Demographics` I III `Faculty Qualifications` I III `Faculty Capacity` I III `Admission Analytics` I III `Admission Overview` I III `Applicant Demographics` I III `Admission Status` I III `Admission Funnel` I III `College/Program Analysis` I III `Admission Trends` I 

III `Reports` III `Enrollment Reports` III `Faculty Reports` 

III `Admission Reports` 

### **37. Overall Registrar Workflow** 

REGISTRAR LOGIN 

I 

M DASHBOARD 

I 

IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII 

I I I 

M M M ENROLLMENT FACULTY ADMISSION ANALYTICS ANALYTICS ANALYTICS 

I I I 

IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII 

I 

M FILTER / DRILL DOWN 

I 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 19 

M VIEW SUMMARY 

I 

M VIEW CHARTS 

I 

#### M VIEW DETAILS 

I 

#### M GENERATE REPORT L 

##### I 

IMPORT DATA 

I 

#### M DATA VALIDATION 

##### I 

#### M UPDATE ANALYTICS 

### **38. KPI Design Principle** 

The Registrar interface shall follow a summary-first design. KPI cards shall communicate the overall situation at a glance, while charts and tables shall provide the detailed breakdown. 

#### <b>Interface Element</b> <b>Purpose</b> 

Summary Cards Show overall totals, rates, averages, and high-level indicators 

Charts / Graphs Show breakdowns, comparisons, trends, and distributions 

Tables Show detailed information and supporting values 

Filters Allow the Registrar to focus on a specific period, college, program, or category 

Drill-Down Allow movement from university-level summaries to college and program details 

Reports Provide formal, exportable outputs for administrative use 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 20 

## **3. Registrar Global Enhancements from the Updated InfoBoard Flow** 

The updated InfoBoard source defines a Universal Filtering Engine in which selecting or clearing a filter immediately re-queries the visualization data and re-renders charts, KPI scorecards, and data grids. This behavior is now made explicit for the Registrar role. 

|Filter|Example Values|Applies To|Dynamic Result|
|---|---|---|---|
|Academic Year|2024–2025 / 2025–2026 /<br>2026–2027|All modules|All summary values and charts recalculate.|
|Semester|1st / 2nd / Summer|All academic modules|Period-specific values update.|
|Campus|San Bartolome / San Francisco /<br>Batasan / All|Student, Faculty, Admission|Campus-specific population replaces<br>All-campus totals.|
|College|COA / COB / CCS / COE / COED|All modules|College totals and related charts update.|
|Program|Official program list|Student, Faculty, Admission|Program-level values replace college-level<br>totals.|
|Year Level|1st / 2nd / 3rd / 4th|Student analytics|Enrollment, demographics, performance,<br>progression and retention update.|
|Student Status|Regular / Irregular / Graduating /<br>Leave / Withdrawn|Student analytics|Status distribution and related KPIs update.|
|Student Type|New / Continuing / Returning /<br>Transferee|Student & Admission|Student-type distributions update.|
|Age Range|17–20 / 21–24 / 25+ / custom<br>17–45+|Student demographics|Demographic charts isolate the selected age<br>group.|
|First-Gen Status|First-Gen / Non-First-Gen|Student & Admission|First-Gen counts and related<br>admission/retention charts update.|
|Faculty Employment<br>Status|Full-Time / Part-Time|Faculty analytics|Faculty totals, qualification and demographic<br>charts update.|



### **Enhanced filter workflow** 

Select/Clear Filter → System validates filter combination → Backend re-queries filtered dataset → Summary cards recalculate → Charts recalculate → Tables recalculate → Active-filter chips update → User may drill down while preserving filters. 

#### Integrated Cross-Check Requirements · Global Filter Engine 

FR-REG-FLT-09 · The system shall allow the Registrar to filter analytics by campus location when campus data is available. 

FR-REG-FLT-10 · The system shall allow the Registrar to filter student analytics by age range when age data is available. 

FR-REG-FLT-11 · The system shall allow the Registrar to filter student analytics by First-Generation Status when that field is available and authorized. FR-REG-FLT-12 · The system shall allow the Registrar to filter faculty analytics by employment status such as Full-Time and Part-Time when available. 

FR-REG-FLT-13 · The system shall recalculate all applicable summary cards, charts, and tables immediately after a filter is changed or cleared. 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 21 

## **4. Consistent Illustrative Dataset for Visualization Prototyping** 

The following dataset is an illustrative prototype dataset for visualization and process-flow purposes. It is designed to be internally consistent around the previously specified planning totals of 12,450 students and 342 active faculty. It is not presented as an official QCU statistical record. Where the existing specification contains target ratios (CCS 45:1, COE 40:1, COB 40:1, COA 30:1, COED 28:1), those ratios remain retained as planning/reference values; the sample headcounts below are illustrative and may be adjusted once official source data are available. 

|College|Students|Active Faculty|Illustrative Ratio|Existing Target Ratio|Programs|
|---|---|---|---|---|---|
|CCS|5,220|116|45.0 : 1|45 : 1|BSIT, BSIS, BSCS|
|COE|2,720|68|40.0 : 1|40 : 1|BSIE, BSECE, BSCE|
|COB|2,000|50|40.0 : 1|40 : 1|BSEntrep|
|COA|1,500|50|30.0 : 1|30 : 1|BSA, BSMA|
|COED|1,010|58|17.4 : 1|28 : 1|BECEd|
|TOTAL|12,450|342|36.4 : 1|—||



### **Core student dataset** 

|Year Level|Students|New|Continuing|Returning|Transferee|
|---|---|---|---|---|---|
|1st Year|3,350|2,850|200|100|200|
|2nd Year|3,150|150|2,750|150|100|
|3rd Year|3,050|80|2,780|120|70|
|4th Year|2,900|50|2,650|130|70|
|TOTAL|12,450|3,130|8,380|500|440|



### **Core admission dataset** 

|Admission Stage|Applicants|Rate / Note|
|---|---|---|
|Applicants|5,600|100% of applicants|
|Qualified|4,600|82.1% of applicants|
|Accepted|4,050|88.0% of qualified|
|Confirmed|3,750|92.6% of accepted|
|Enrolled|3,420|91.2% of confirmed / 61.1% of applicants|



For charts that require a different denominator—such as gender, first-generation status, income, or scholarship participation—the relevant sample table below defines the exact denominator so that percentages remain interpretable. 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 22 

## **5. Registrar Dashboard — Detailed Process and Dynamic Visualization** 

Purpose: Provide a summary-first view of the current academic situation. The existing Dashboard summary cards and charts are retained. The updated InfoBoard filter behavior is added so the Dashboard becomes a live, filter-aware summary rather than a static page. 

|Summary Card|Default Value|When College = CCS|
|---|---|---|
|Total Students|12,450|5,220|
|Total Faculty|342|116|
|Total Applicants|5,600|2,250|
|Total Enrolled|3,420|1,480|
|Retention Rate|89.4%|91.2%|
|Progression Rate|84.7%|87.1%|
|Average Academic Performance|2.24 GWA|2.12 GWA|
|Student-to-Faculty Ratio|36.4 : 1|45.0 : 1|



### **Dashboard charts** 

|Chart|Type|Default Sample|CCS Filter Result|Dynamic Behavior|
|---|---|---|---|---|
|Enrollment by College|Donut / Bar|CCS 5,220; COE 2,720; COB<br>2,000; COA 1,500; COED 1,010|CCS = 5,220|All segments recalculate.|
|Enrollment Trend|Line|AY25–26 S1 5,980; S2 6,470;<br>AY26–27 S1 6,020; S2 6,430|CCS trend only|Trend points update.|
|Year Level|Column|1st 3,350; 2nd 3,150; 3rd 3,050; 4th<br>2,900|CCS: 1,420; 1,310; 1,270; 1,220|Bars recalculate.|
|Student Status|Donut|Regular 8,650; Irregular 2,200;<br>Graduating 1,150; Leave 250;<br>Withdrawn 200|CCS subset|Percentages use filtered<br>total.|
|Faculty by College|Bar|CCS 116; COE 68; COB 50; COA<br>50; COED 58|CCS 116|College filter isolates<br>faculty.|
|Student-to-Faculty<br>Ratio|Horizontal Bar|CCS 45.0; COE 40.0; COB 40.0;<br>COA 30.0; COED 17.4|CCS 45.0|Ratio recalculates.|
|Admission Funnel|Funnel|5,600→4,600→4,050→3,750→<br>3,420|CCS 2,250→1,890→1,680→<br>1,560→1,480|Every stage uses active<br>filters.|
|Current vs Previous<br>Enrollment|Grouped Bar|Current 6,430 vs Previous 6,120|CCS 2,720 vs 2,550|Comparison remains<br>visible.|



### **Dashboard process flow** 

Registrar Login → Dashboard Loads → Default Filters = All → Summary Cards Load → Charts Load → Registrar Selects Filter(s) → System Re-queries Data → Cards/Charts/Tables Update → Registrar Selects Chart Element → Drill-Down Preserves Filters → View Details → Generate Report. 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 23 

## **6. Import Data — Registrar-Side Enhanced Workflow** 

All existing Import Data requirements are retained. The updated InfoBoard flow adds a stronger validation-preview concept and mandatory confirmation for the state-changing database commit. For the Registrar role, this should be limited to authorized Registrar data-import functions; backend system configuration remains outside scope. 

Enhanced workflow: Open Import Data → Select Data Category → Upload CSV/XLSX → Read File → Validate Schema → Check Required Fields → Check Duplicates → Check Invalid College/Program/Status Values → Display Validation Preview → Registrar Reviews → Correct allowed errors / request correction as permitted → Confirm Import → Success/Error Toast → Valid Records Stored → Analytics Recalculated → Import History Updated. 

### **Validation preview sample** 

|Field|Sample Value|Validation|Result|
|---|---|---|---|
|Student ID|26-10421|Required + unique|VALID|
|College|CCS|Must exist in official list|VALID|
|Program Code|BSIT|Must belong to selected college|VALID|
|Gender|FEMALE|Accepted institutional value|VALID|
|Academic Year|2026–2027|Configured AY|VALID|
|Semester|1st Semester|Configured period|VALID|
|Year Level|2nd Year|Must be 1st–4th|VALID|
|Student Status|Regular|Accepted status|VALID|
|Student ID|26-10421|Duplicate check|ERROR / DUPLICATE|



### **Import summary sample** 

|Metric|Example|
|---|---|
|Total Records|1,250|
|Valid Records|1,220|
|Invalid Records|30|
|Duplicate Records|20|
|Last Import|09/29/2026 10:42:16|
|Imported By|Registrar account|



Dynamic post-import behavior: after a valid import is confirmed, affected analytics are recalculated. Example: if 120 new valid enrollment records for CCS are imported, CCS enrollment changes from 5,220 to 5,340 and the Dashboard, Enrollment Analytics, year-level distribution, college distribution, and relevant capacity metrics update accordingly. 

Integrated Cross-Check Requirements · Import Data 

FR-REG-IMP-12 · The system shall display a validation preview before the Registrar confirms an import commit. 

FR-REG-IMP-13 · The system shall require confirmation before a Registrar import changes stored institutional analytics data. 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 24 

## **7. Enrollment Analytics — Complete Registrar Process** 

This module retains all existing enrollment, demographic, academic performance, progression, retention, and capacity requirements. The updated InfoBoard source adds geographic origin, age/civil status, and capacity-utilization visualization concepts. 

|Section / Chart|Type|Sample Dataset|Filter Example→Updated Result|
|---|---|---|---|
|Enrollment by College|Donut / Bar|CCS 5,220; COE 2,720; COB 2,000; COA 1,500;<br>COED 1,010|College=COE→2,720|
|Enrollment by Program|Horizontal Bar|BSIT 2,650; BSIS 1,350; BSCS 1,220; BSIE 1,180;<br>BSECE 850; BSCE 690; BSEntrep 2,000; BSA 1,050;<br>BSMA 450; BECEd 1,010|College=CCS→BSIT/BSIS/BSCS<br>only|
|Enrollment Trend|Line|2025 S1 5,980; 2025 S2 6,470; 2026 S1 6,020; 2026<br>S2 6,430|AY=2026–2027→selected points|
|Enrollment by Year Level|Column|1st 3,350; 2nd 3,150; 3rd 3,050; 4th 2,900|Program=BSIT→720; 680; 640; 610|
|Student Type Distribution|Donut|New 3,130; Continuing 8,380; Returning 500;<br>Transferee 440|Year Level=1st→filtered distribution|
|Student Status<br>Distribution|Donut|Regular 8,650; Irregular 2,200; Graduating 1,150;<br>Leave 250; Withdrawn 200|College=COED→recalculated|
|Gender Distribution|Donut|Female 6,820; Male 5,430|College=COED→filtered gender|
|Gender by College|Grouped Bar|CCS 2,750F/2,470M; COE 1,150F/1,570M; COB<br>1,150F/850M; COA 900F/600M; COED 870F/140M|College=COED→870F/140M|
|Student Type by College|Stacked Bar|College-level new/continuing/returning/transferee|College=CCS→CCS stack|
|Year Level Distribution|Column|1st–4th year totals|Age=25+→adult subset|
|Student Demographics by<br>Program|Bar|Program-level student counts plus gender/type|Program=BSIT→BSIT only|



#### Integrated Cross-Check Requirements · Enrollment Analytics 

FR-REG-ENR-01 · The system shall provide student geographic-origin analytics when residency data is available. 

FR-REG-ENR-02 · The system shall provide age-range and civil-status analytics when those data fields are available. 

FR-REG-ENR-03 · The system shall provide program capacity-utilization information using student counts and configured capacity values when available. 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 25 

## **8. Student Demographics — Added Updated InfoBoard Visualizations** 

The updated InfoBoard source specifically provides Student Geographic Origin and Age Range & Civil Status visualizations. These are added without removing the existing demographics requirements. 

|Chart|Type|Sample Dataset|Purpose / Dynamic Filter|
|---|---|---|---|
|Student Geographic Origin|Horizontal Bar /<br>Heatmap|District 2: 3,984; District 5: 2,650; District 1: 2,050;<br>District 3: 1,430; District 4: 930; District 6/Non-QC:<br>1,406|Age 22–30→selected age<br>cohort|
|Age Range & Civil Status|Stacked Bar|17–20: 7,350 Single/50 Married; 21–24: 2,300/250;<br>25+: 1,600/900|College=CCS→CCS subset|
|Program Capacity Utilization|Table + Gauge|BSIT 2,650/2,900=91.4%; BSIS 1,350/1,500=90.0%;<br>BSA 1,050/1,200=87.5%; BSEntrep<br>2,000/2,100=95.2%|College/Program filter<br>isolates capacity|



### **Recommended demographic filter set** 

Academic Year + Semester + Campus + College + Program + Year Level + Student Type + Student Status + Age Range + First-Gen Status. 

### **Dynamic example** 

Default: 12,450 students. Apply Age Range = 22–30 and College = CCS. The system re-queries only records satisfying both conditions; Total Students, Gender Distribution, Geographic Origin, Year Level, Student Type, Status, and Program Capacity tables all update to the same filtered population. Clearing Age Range returns the CCS-only population without clearing the College filter. 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 26 

## **9. Academic Performance, Progression, and Retention — Detailed Dynamic Examples** 

|Chart|Type|Sample Dataset|Dynamic Example|
|---|---|---|---|
|GPA/GWA Distribution|Histogram / Column|1.00–1.49: 420; 1.50–1.99: 2,850; 2.00–2.49: 4,120;<br>2.50–2.99: 3,280; 3.00+: 1,780|College=CCS→CCS only|
|Academic Performance by<br>College|Bar|CCS 2.12; COE 2.28; COB 2.31; COA 2.19; COED<br>2.05|Year Level=4th→recalculated|
|Academic Performance by<br>Program|Horizontal Bar|BSIT 2.08; BSIS 2.17; BSCS 2.13; BSIE 2.26; BSA<br>2.20; BECEd 2.05|Program filter isolates|
|Academic Performance<br>Trend|Line|AY25–26 S1 2.31; S2 2.27; AY26–27 S1 2.24; S2 2.22|Semester filter narrows|
|Performance by Year Level|Grouped Bar|1st 2.34; 2nd 2.28; 3rd 2.21; 4th 2.10|College=CCS→CCS averages|
|Progression by Year Level|Stacked Bar|1st→2nd: 2,780/570; 2nd→3rd: 2,610/540; 3rd→4th:<br>2,590/460|First-Gen filter→cohort only|
|Progression by College|Bar|CCS 87.1%; COE 84.2%; COB 82.9%; COA 85.0%;<br>COED 88.4%|Program filter recalculates|
|Cohort Progression|Line|2023 cohort: 1st 100%; 2nd 88%; 3rd 78%; 4th 71%|Student Type=Transferee|
|Retention Trend|Line|AY25–26 86.8%; AY26–27 89.4%|First-Gen cohort only|
|Retention by College|Bar|CCS 91.2%; COE 88.0%; COB 87.5%; COA 89.3%;<br>COED 92.0%|College filter isolates|
|Retention by Program|Horizontal Bar|BSIT 91.5%; BSIS 89.0%; BSCS 92.0%; BSA 88.8%;<br>BECEd 92.2%|Year Level/student type refine|
|Student Status Movement|Flow / Sankey-style|Enrolled→Continuing 8,380;→Graduating 1,150;<br>→Leave 250;→Withdrawn 200|Semester updates movement|
|Retention by Student Type|Stacked Bar|New 90%; Continuing 92%; Returning 84%; Transferee<br>81%|College=CCS→filtered|



QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 27 

## **10. Enrollment Capacity and Student-to-Faculty Analysis** 

The existing target ratios are retained. The updated version adds a clearer capacity visualization using student counts, faculty counts, ratio, and optional utilization status. 

|College|Students|Faculty|Calculated Ratio|Existing Target|Interpretation|
|---|---|---|---|---|---|
|CCS|5,220|116|45.0 : 1|45 : 1|At target|
|COE|2,720|68|40.0 : 1|40 : 1|At target|
|COB|2,000|50|40.0 : 1|40 : 1|At target|
|COA|1,500|50|30.0 : 1|30 : 1|At target|
|COED|1,010|58|17.4 : 1|28 : 1|Illustrative; verify official allocation|



### **Recommended visualizations** 

1. Horizontal Bar — Student-to-Faculty Ratio by College. 2. Grouped Bar — Students vs Faculty by College. 3. Capacity Table + Gauge — Student count, faculty count, ratio, target, and utilization. 4. Line Chart — Ratio trend across academic periods. 5. Program-level capacity table for room/lab/course-section planning. 

### **Dynamic example** 

If College = COE and Program = BSCE, the system should recalculate the student count and faculty count for BSCE only, then update the displayed ratio and all related capacity visuals. If the filter is cleared, the college-level view returns. 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 28 

## **11. Faculty Analytics — Updated Registrar-Side Coverage** 

|Chart|Type|Sample Dataset|Dynamic Filter Example|
|---|---|---|---|
|Faculty by College|Donut / Bar|CCS 116; COE 68; COB 50; COA 50; COED 58|Employment=Part-Time→<br>part-time counts|
|Faculty by Program|Horizontal Bar|BSIT 62; BSIS 28; BSCS 26; BSIE 32; BSECE 18;<br>BSCE 18; BSEntrep 50; BSA 32; BSMA 18; BECEd<br>58|College=CCS→CCS programs|
|Faculty by Gender|Donut|Female 178; Male 164|College=COED→filtered|
|Faculty Demographics by<br>College|Grouped Bar|Male/Female and available marital-status counts per<br>college|Employment=Part-Time→groups<br>recalculate|
|Faculty Academic Rank|Horizontal Bar|Instructor I–III 188; Assistant Professor 92; Associate<br>Professor 44; Full Professor 18|College=CCS→CCS ranks|
|Gender & Marital Status|Grouped Bar|Male 74 Single/90 Married; Female 83 Single/95<br>Married|College/employment filters update|
|Qualification by College|Stacked Column|CCS 35B/65M/16D; COE 22B/35M/11D; COB<br>18B/25M/7D; COA 20B/24M/6D; COED 25B/25M/8D|Employment=Part-Time→<br>part-time composition|
|Overall Qualification|Donut|Bachelor's 120; Master's 174; Doctorate/Ph.D. 48|College=COE→filtered|
|Qualification by Program|Stacked Bar|Program-level Bachelor's/Master's/Doctorate counts|Program filter isolates|
|Qualification Trend|Line / Stacked<br>Column|AY25–26 B132/M166/D44; AY26–27 B120/M174/D48|AY filter selects period|
|Faculty Capacity Trend|Line|36.8:1→36.5:1→36.4:1|College filter gives college trend|
|Students vs Faculty|Grouped Bar|College student/faculty totals from core dataset|Program filter changes both|



### **Updated InfoBoard dynamic example** 

When Employment Status = Part-Time is selected, the faculty total, gender distribution, marital-status distribution, academic rank, and qualification charts must all be recalculated from the part-time faculty subset. This mirrors the updated InfoBoard behavior while keeping the Registrar view focused on analytics rather than HR system administration. 

Integrated Cross-Check Requirements · Faculty Analytics 

FR-REG-FAC-01 · The system shall provide faculty academic-rank analytics when rank data is available. FR-REG-FAC-02 · The system shall provide faculty gender and marital-status breakdowns when those fields are available. 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 29 

## **12. Admission Analytics — Expanded Registrar/Admission-Side Flow** 

The existing Admission Analytics requirements remain intact. The updated version expands the module with the richer Admission/First-Generation context found in the updated InfoBoard source, but keeps all added attributes conditional on the availability and authorized use of institutional data. 

|Chart / Section|Type|Sample Dataset|Dynamic Filter Example|
|---|---|---|---|
|Applicants by College|Column|CCS 2,250; COE 1,250; COB 900; COA 750; COED<br>450|College=CCS→2,250|
|Applicants by Program|Horizontal Bar|BSIT 1,100; BSIS 620; BSCS 530; BSEntrep 900; BSA<br>520; BSMA 230; BECEd 450|College=CCS→CCS programs|
|Admission Status|Donut|Applicant 5,600; Qualified 4,600; Accepted 4,050;<br>Confirmed 3,750; Enrolled 3,420|College/program filter<br>recalculates|
|Admission Trend|Line|AY25–26 5,100; AY26–27 5,600|Program/college changes trend|
|Admission by Student<br>Type|Stacked Bar|First-time 3,950; Transferee 950; Returning 500; Other<br>200|College=COE→COE types|
|Admission Conversion|Rate Cards / Bars|Qualification 82.1%; Acceptance 88.0%; Enrollment<br>conversion 84.4% of accepted|Rates recalculate with<br>denominator|
|Admission-to-Enrollment|Grouped Column|Per college: Applicants / Qualified / Accepted /<br>Enrolled|College filter isolates|



### **Admission funnel process** 

Applicants → Qualified Applicants → Accepted Applicants → Confirmed Applicants → Enrolled Students → New Student → Continuing Student → Graduating Student. 

### **Rate definitions** 

Qualification Rate = Qualified Applicants ÷ Total Applicants × 100. Acceptance Rate = Accepted Applicants ÷ Qualified Applicants × 100. Enrollment Conversion Rate = Enrolled Applicants ÷ Accepted Applicants × 100. The active denominator must always be displayed or documented with the metric. 

Integrated Cross-Check Requirements · Admission Analytics 

FR-REG-ADM-01 · The system shall provide First-Generation admission analytics when First-Gen data is available and authorized. FR-REG-ADM-02 · The system shall provide socioeconomic household-income analytics when authorized income data is available. FR-REG-ADM-03 · The system shall provide scholarship distribution analytics by relevant student cohort when scholarship data is available. FR-REG-ADM-04 · The system shall provide first-generation year-level retention/progression cohort analytics when the required longitudinal data is available. 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 30 

## **13. Admission / First-Generation Enhancements** 

|Visualization|Type|Sample Dataset|Dynamic Behavior|
|---|---|---|---|
|First-Gen vs Non-First-Gen|Pie / Donut|First-Gen 4,350; Non-First-Gen 8,100|First-Gen filter changes page to<br>selected cohort.|
|First-Gen by Program|Horizontal Bar|BSIT 1,380; BSIS 520; BSCS 410; BSEntrep 690; BSA<br>430; BSMA 190; BECEd 730|College=CCS→CCS programs|
|Household Income Brackets|Donut|Low <I15k: 7,220; Lower MiddleI15k–I30k: 3,620;<br>Middle >I30k: 1,610|First-Gen filter→first-gen<br>income|
|Scholarship Grant Distribution|Grouped Column|QCYDO 1,900 FG/1,050 Non-FG; TES/UniFAST<br>1,250/850; CHED 420/530|Scholarship filter updates|
|First-Gen Year-Level Retention|Funnel|1st 1,550; 2nd 1,240; 3rd 1,020; 4th 820|Scholarship=QCYDO→<br>QCYDO cohort|



These attributes are added because the updated InfoBoard source explicitly includes First-Gen status, socioeconomic household income, scholarship distribution, and first-gen retention/progression. They should be treated as institutional data fields only if the university has an authorized and valid source for them. 

### **Dynamic example** 

Default First-Gen cohort = 4,350. Selecting Scholarship = QCYDO filters the same cohort to QCYDO recipients; the income chart, program distribution, year-level funnel, and summary cards all update to the QCYDO subset. Clearing Scholarship returns the full First-Gen cohort while retaining any other active filters. 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 31 

## **14. Drill-Down, Search, and Detailed Records** 

The existing drill-down hierarchy is retained and expanded with the updated InfoBoard interactive chart-element behavior. 

University → Campus → College → Program → Year Level → Student Category → Detailed Aggregated Data 

A chart click may act as a filter. Example: clicking the CCS segment of Enrollment by College automatically applies College=CCS to the page, recalculates the summary cards, and preserves all existing filters. Clicking BSIT then adds Program=BSIT rather than resetting College=CCS. 

|Search Field|Example|Expected Result|
|---|---|---|
|Student ID|26-10421|Student's authorized aggregated/detail record.|
|Program|BSIT|Programs and analytics matching BSIT.|
|College|CCS|College-level analytics and programs.|
|Academic Year|2026–2027|Records and analytics for selected AY.|
|Faculty ID|FAC-1023|Faculty analytics record within Registrar access.|
|Applicant ID|APP-260842|Admission record within Registrar access.|
|Admission Status|Accepted|Applicants matching selected status.|



#### Integrated Cross-Check Requirement · Drill-Down 

FR-REG-DRL-02 · The system shall allow authorized chart elements to act as drill-down filters while preserving existing filters. 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 32 

## **15. Reports and Export — Enhanced Process** 

All existing Enrollment, Faculty, and Admission report categories are retained. The updated InfoBoard report engine adds an explicit active-filter scope and selectable report sections. 

|Step|Registrar Action|System Response|
|---|---|---|
|1|Select filters|Displays active Academic Year, Semester, Campus, College, Program, and<br>other applicable filters.|
|2|Open Generate Report|Shows report categories and available sub-modules.|
|3|Select sections|KPI summary, charts, tables, enrollment matrix, faculty qualification,<br>admission/first-gen sections as authorized.|
|4|Choose format|PDF or Excel, according to final implementation.|
|5|Confirm generation|System validates current scope and prepares timestamped report.|
|6|Export|Generated report reflects exactly the selected filters and included sections.|



### **Example report scope** 

Academic Year: 2026–2027 | Semester: 1st Semester | Campus: San Bartolome | College: CCS | Program: BSIT | Year Level: 2nd Year | Student Type: Continuing 

Expected output: BSIT 2nd-Year continuing students only, with the relevant KPI cards, enrollment chart, demographics, performance, progression/retention information, and supporting tables recalculated to that scope. 

Integrated Cross-Check Requirement · Reports & Export 

FR-REG-RPT-07 · The system shall allow the Registrar to select report sections while retaining the active filter scope. 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 33 

## **16. Registrar Security and Scope Boundary** 

|Capability|Registrar|System Administrator|
|---|---|---|
|Login / 2FA|Required where enabled by authentication<br>policy|Required|
|View Analytics|||
|Filter / Drill-Down||where permitted|
|Generate / Export Reports||where permitted|
|Import Registrar Data|Limited/authorized||
|Correct validation issues|Limited to permitted import-edit workflow||
|Manage Users|||
|Unlock Frozen Accounts|||
|Manage Roles|||
|Configure System Settings|||
|System-wide Delete||under authorized controls|
|Security Audit Administration|||



The updated InfoBoard source describes 2FA, account lockout, user management, and audit trails. These remain part of the overall system architecture, but user-management and security-administration functions are not converted into Registrar permissions. 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 34 

## **17. Additional Registrar Functional Requirements Added from Cross-Check** 

|ID|Additional Requirement|
|---|---|
|FR-REG-FLT-09|The system shall allow the Registrar to filter analytics by campus location when campus data is available.|
|FR-REG-FLT-10|The system shall allow the Registrar to filter student analytics by age range when age data is available.|
|FR-REG-FLT-11|The system shall allow the Registrar to filter student analytics by First-Generation Status when that field is available<br>and authorized.|
|FR-REG-FLT-12|The system shall allow the Registrar to filter faculty analytics by employment status such as Full-Time and Part-Time<br>when available.|
|FR-REG-FLT-13|The system shall recalculate all applicable summary cards, charts, and tables immediately after a filter is changed or<br>cleared.|
|FR-REG-DRL-02|The system shall allow authorized chart elements to act as drill-down filters while preserving existing filters.|
|FR-REG-ENR-01|The system shall provide student geographic-origin analytics when residency data is available.|
|FR-REG-ENR-02|The system shall provide age-range and civil-status analytics when those data fields are available.|
|FR-REG-ENR-03|The system shall provide program capacity-utilization information using student counts and configured capacity values<br>when available.|
|FR-REG-FAC-01|The system shall provide faculty academic-rank analytics when rank data is available.|
|FR-REG-FAC-02|The system shall provide faculty gender and marital-status breakdowns when those fields are available.|
|FR-REG-ADM-01|The system shall provide First-Generation admission analytics when First-Gen data is available and authorized.|
|FR-REG-ADM-02|The system shall provide socioeconomic household-income analytics when authorized income data is available.|
|FR-REG-ADM-03|The system shall provide scholarship distribution analytics by relevant student cohort when scholarship data is<br>available.|
|FR-REG-ADM-04|The system shall provide first-generation year-level retention/progression cohort analytics when the required<br>longitudinal data is available.|
|FR-REG-RPT-07|The system shall allow the Registrar to select report sections while retaining the active filter scope.|
|FR-REG-IMP-12|The system shall display a validation preview before the Registrar confirms an import commit.|
|FR-REG-IMP-13|The system shall require confirmation before a Registrar import changes stored institutional analytics data.|



QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 35 

## **18. Updated End-to-End Registrar Process Flow** 

|Phase|Step-by-Step Process|System Output|
|---|---|---|
|1. Authentication|Registrar Login→Credentials Verified→2FA/OTP if enabled→Registrar<br>Role Identified|Authenticated Registrar session|
|2. Dashboard|Dashboard Opens→Default Filters = All→Summary Cards and Charts<br>Load|University-level summary|
|3. Filter|Select AY→Semester→Campus→College→Program→Year Level→<br>Status/Type→Demographic Filters|Filtered scope displayed|
|4. Enrollment|Open Enrollment Analytics→Review enrollment→demographics→<br>performance→progression→retention→capacity|Detailed student analytics|
|5. Faculty|Open Faculty Analytics→Review distribution→demographics→rank→<br>qualifications→capacity→ratio|Faculty analytics|
|6. Admission|Open Admission Analytics→Review applicants→qualification→<br>acceptance→confirmation→enrollment→conversion|Admission pipeline|
|7. First-Gen|Apply First-Gen / scholarship / income filters where available→review<br>cohort charts|First-Gen analytics|
|8. Drill-Down|Click chart segment→preserve filters→University→Campus→College<br>→Program→Year Level→Category|Detailed filtered analytics|
|9. Search|Search Student ID / Faculty ID / Applicant ID / Program / College / Status|Matching authorized records|
|10. Import|Open Import→Select data type→Upload→Validate→Review→<br>Confirm→Save valid data|Updated dataset|
|11. Recalculation|System recalculates affected aggregates after valid import|Updated dashboard and charts|
|12. Report|Generate Report→Select sections→PDF/Excel→Export|Filtered formal report|



QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 36 

## **19. Data Consistency and Visualization Rules** 

|Rule|Requirement|
|---|---|
|Single source scope|All charts on one page must use the same active filter scope unless the chart explicitly states a different<br>comparison period.|
|Denominator visibility|Percentages and rates must identify the denominator used.|
|Filter persistence|Drill-down and chart-click filters must not silently clear existing filters.|
|Real-time update|Changing or clearing a filter must update all applicable cards, charts, tables, and displayed totals.|
|No invented official data|Illustrative datasets in this specification are for prototyping; official QCU data must replace them during<br>implementation.|
|Program hierarchy|Program names must come from the university's official program data.|
|Missing attributes|If a field is unavailable, the visualization should show an appropriate unavailable state rather than<br>fabricate values.|
|Import integrity|Invalid and duplicate records must not affect analytics until corrected and validly committed.|
|Report fidelity|Exports must reflect the same active filter scope shown on screen.|
|Registrar scope|User management, role management, system settings, security administration, and system-wide deletion<br>remain outside Registrar permissions.|



### **Recommended UI pattern** 

Summary Cards → Overall Situation | Charts/Graphs → Breakdown and Comparison | Tables → Detailed Information | Filters → Specific Analysis | Drill-Down → College/Program/Category Details | Reports → Formal Output. 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 37 

## **20. Recommended Updated Registrar Information Architecture** 

|Primary Module|Recommended Sub-Sections|
|---|---|
|Dashboard|Summary Cards; Enrollment Overview; Student Overview; Faculty Overview; Admission Overview;<br>Dynamic Filter Bar|
|Import Data|Student Data; Faculty Data; Admission Data; Validation Preview; Import Summary; Import History|
|Enrollment Analytics|Enrollment Overview; Student Demographics; Student Geographic Origin; Student Status; Student<br>Type; Academic Performance; Progression; Retention; Enrollment Capacity|
|Faculty Analytics|Faculty Overview; Faculty Distribution; Faculty Demographics; Academic Rank; Faculty Qualifications;<br>Faculty Capacity; Student-to-Faculty Ratio; Faculty Trends|
|Admission Analytics|Admission Overview; Applicant Demographics; Admission Status; Admission Funnel; Applicants by<br>College; Applicants by Program; Admission Conversion; Admission Trends; First-Gen Analytics;<br>Scholarship Distribution; Income Brackets; First-Gen Retention/Progression|
|Reports|Enrollment Reports; Faculty Reports; Admission Reports; Filtered Report Builder; PDF/Excel Export|



### **Final implementation principle** 

The Registrar module should function as a centralized, filter-driven academic analytics workspace. The existing Registrar requirements remain the baseline; the added features primarily strengthen the real-time visualization, demographic context, capacity analysis, admission/First-Gen analysis, and drill-down behavior found in the updated InfoBoard process flow. 

End of updated specification. 

QCU InfoBoard — Registrar Functional Requirements & Workflow Specification 

Page 38 



---

# Figma Make AI Implementation Instructions

# QCU InfoBoard --- Figma Make AI High-Fidelity Registrar & Admission Implementation Specification

This is the regenerated Markdown implementation specification for the
QCU InfoBoard Registrar module.

## Source of Truth

Use the preserved original Markdown above as the functional source of truth.

## Core Modules

-   Dashboard
-   Import Data
-   Enrollment Analytics
-   Faculty Analytics
-   Admission Analytics
-   Reports and Export
-   Search
-   Global filtering
-   Chart drill-down

## Registrar Scope

The Registrar may view analytics, filter/drill down, generate/export
reports, import authorized Registrar data, and correct validation issues
through the permitted import-edit workflow.

The Registrar may not manage users, unlock frozen accounts, manage
roles, configure system settings, perform system-wide deletion, or
administer security audits.

## Global Filters

Support:

-   Academic Year
-   Semester
-   Campus
-   College
-   Program
-   Year Level
-   Student Status
-   Student Type
-   Age Range when available
-   First-Generation Status when available
-   Faculty Employment Status when available

Changing or clearing a filter must immediately recalculate applicable
KPI cards, charts, tables, and totals while preserving other active
filters.

## Interaction Requirements

All visible controls must be functional. Chart elements may act as
drill-down filters. Drill-down must preserve existing filters.

Import workflow:

`Select Data Type → Upload → Validate → Review → Confirm → Save Valid Data → Recalculate Analytics`

Invalid and duplicate records must not affect analytics until corrected
and validly committed.

Reports must preserve the exact active filter scope and allow section
selection before PDF/Excel export.

## Visual Direction

Use:

-   Inter
-   `#200D2D`
-   `#BB96E4`
-   `#FFD066`
-   `#4C1413`
-   `#FFDBED`

Create a sophisticated, high-fidelity institutional analytics interface
with rounded bento-style cards, soft gradients, SVG icons, responsive
layouts, professional charts, hover states, tooltips, loading states,
empty states, unavailable-data states, and subtle animations.

## Enrollment Analytics

Include:

-   Enrollment overview
-   Student demographics
-   Geographic origin
-   Student status
-   Student type
-   Academic performance
-   Progression
-   Retention
-   Capacity utilization
-   Student-to-faculty ratio

## Faculty Analytics

Include:

-   Faculty distribution
-   Demographics
-   Academic rank
-   Qualifications
-   Employment status
-   Faculty capacity
-   Student-to-faculty ratio
-   Trends

## Admission Analytics

Include:

-   Applicant demographics
-   Admission status
-   Admission funnel
-   Applicants by college
-   Applicants by program
-   Admission conversion
-   Admission trends
-   First-Gen analytics
-   Scholarship distribution
-   Income brackets
-   First-Gen retention/progression

## Data Rules

Do not fabricate official QCU data. If a field is unavailable, show an
appropriate unavailable state.

All charts on a page should use the same active filter scope unless a
comparison period is explicitly defined. Percentages and rates must
identify their denominator.

## Final Instruction to Figma Make AI

Build the complete Registrar experience as an interconnected, clickable,
functional analytics workspace rather than static mockups. Preserve
meaningful filter state, implement real-time recalculation, validate
imports before commit, require confirmation for state-changing imports,
and ensure exports match the active filter scope.
