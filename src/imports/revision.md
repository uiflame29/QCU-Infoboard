
### 1. Key System Revisions & Enhancements

-   Multi-Department Access Controls: Split login credentials and dedicated dashboard views created across all five academic departments: CCS (Computer Studies), COA (Accountancy), COB (Business), COE (Engineering), and COED (Education).
    
-   Interactive Dashboard Widgets: Every KPI summary card and chart widget is fully interactive—clicking any visual element immediately redirects the Dean to the corresponding analytics page with all active filters preserved.
    
-   Updated Faculty Analytics Widget: Replaces previous static views with a dedicated widget displaying Full-Time vs. Part-Time Faculty, Student-to-Faculty Ratio, and an interactive View Faculty button.
    
-   Updated First-Generation Analytics Widget: Replaces previous retention blocks with a dedicated widget showing First-Gen vs. Non-First-Gen breakdown, First-Gen Percentage, and a View Analytics button.
    
-   Chart Title Standardization: Re-titles the cohort pipeline progression chart to First-Gen Year-Level Retention Progression.
    

----------

### 2. Module-by-Module Process Flow Breakdown

#### A. Login & Department Access Gate

1.  Quick Access Bar Selection: Users select their role/department from quick-access shortcut buttons (Executive, System Admin, CCS Dean, COA Dean, COB Dean, COE Dean, COED Dean) or enter standard credentials.
    
2.  Departmental Routing: Authenticated Deans are routed to their college-specific dashboard loaded with departmental master data.
    

#### B. College Dean Dashboard

1.  KPI Scorecard Monitoring: Displays top-level metrics including Total Enrollees, Active Faculty Members, Student-to-Faculty Ratio, and Program Capacity Utilization.
    
2.  Global Filter Bar: Deans apply filters by Academic Year, Program (e.g., BSIT, BSIS, BSCS), Year Level, and Campus.
    
3.  Interactive Widget Navigation:
    

-   Enrollment Analytics: Displays program/year-level distribution; clicking View Students redirects to Student Analytics.
    
-   Faculty Analytics: Displays FT/PT ratio and workload metrics; clicking View Faculty redirects to Faculty Analytics.
    
-   First-Gen Analytics: Displays socioeconomic representation; clicking View Analytics opens filtered student demographics.
    

#### C. Student Analytics Module

1.  Demographic Visualizations: Interactive Donut, Bar, and Pie charts render Gender Distribution, Residency, Program Share, Year Level, and Enrollment Status.
    
2.  First-Gen & Retention Tracking: Evaluates First-Gen student proportions (Donut Chart) and tracks retention progression across 1st to 4th year cohorts (Funnel Chart).
    
3.  Student Directory & Record Management: Interactive data table allowing Deans to search, filter, view profile cards, edit student records, and update enrollment statuses.
    
4.  Data Exporting: Exports filtered records directly via Export PDF, Export Excel, or Generate Report buttons.
    

#### D. Faculty Analytics Module

1.  Faculty Capacity Overview: Displays total faculty headcount, Full-Time vs. Part-Time split, and Student-to-Faculty ratios.
    
2.  Qualifications & Workload Analysis: Visualizes educational attainment (Bachelor's, Master's, Ph.D.) and program teaching allocations.
    
3.  Faculty Directory Management: Complete searchable directory displaying ID, Name, Program, Employment Status, Attainment, and Status, with modal-confirmed Edit and Archive actions.
    

#### E. Export Reports Module

1.  Scope & Section Selection: Deans select Academic Year, Program, and Year Level filters, then check desired sections (Dashboard Summary, Student Analytics, Faculty Analytics, Program Capacity, First-Gen Report).
    
2.  Format Generation & Download: Compiles selected sections into either a print-ready PDF Executive Summary or an Excel Workbook (.xlsx) complete with timestamping and audit preview.
    

----------

### 3. Visual UI Markups & Wireframe Representations

Below are text-based UI markups representing the images, charts, and layout updates specified in the source document.

#### Markup 1: Quick Access Login Bar (Login Revisions)

+----------------------------------------------------------------------------------------------------+

| PROTOTYPE QUICK ACCESS |

| |

| [ Executive ] [ System Admin ] [ CCS Dean ] [ COA Dean ] [ COB Dean ] [ COE Dean ] ... |

+----------------------------------------------------------------------------------------------------+

  

#### Markup 2: Faculty Readiness — Qualifications by Program (Faculty Analytics Chart)

+----------------------------------------------------------------------------------------------------+

| FACULTY READINESS [ Faculty Detail ]|

| Qualifications by Program |

| |

| Headcount |

| 40 |------------------------------------------------------------------------------------------ |

| | +---------------+ +---------------+ +---------------+ |

| 30 | | ■ Ph.D. | | ■ Ph.D. | | ■ Ph.D. | |

| | +---------------+ +---------------+ +---------------+ |

| 20 | | | | | | | |

| | | ▓ Master's | | ▓ Master's | | ▓ Master's | |

| 10 | | | | | | | |

| | +---------------+ +---------------+ +---------------+ |

| 0 | | ░ Bachelor's | | ░ Bachelor's | | ░ Bachelor's | |

| +---------------------+---------------+---------+---------------+---------+---------------+--|

| BSIT BSIS BSCS |

| |

| Legend: ░ Bachelor's ▓ Master's ■ Ph.D. |

+----------------------------------------------------------------------------------------------------+

  

#### Markup 3: First-Gen Year-Level Retention Progression (Cohort Line Chart)

+----------------------------------------------------------------------------------------------------+

| COHORT PIPELINE |

| First-Gen Year-Level Retention Progression |

| |

| Students |

| 1200 |-----\*----------------------------------------------------------------------------------- |

| | \ |

| 900 | \---------------------\*--------------------------------------------------------- |

| | \ |

| 600 | \--------------------\*--------------------------------- |

| | \ |

| 300 | \--------------------\*--------- |

| | |

| 0 +--------------------------------------------------------------------------------------------|

| 1st Year 2nd Year 3rd Year 4th Year |

+----------------------------------------------------------------------------------------------------+

  

#### Markup 4: Program Capacity & Performance Scorecards

+-----------------------------------+ +-----------------------------------+ +-----------------------------------+

| [BSIT] [Capacity Watch]| | [BSIS] [On Track]| | [BSCS] [On Track]|

| | | | | |

| 1,800 91% 382 | | 900 88% 174 | | 800 93% 168 |

| Enrolled Retention Graduates | | Enrolled Retention Graduates | | Enrolled Retention Graduates |

| | | | | |

| [========================......] | | [========================......] | | [========================......] |

+-----------------------------------+ +-----------------------------------+ +-----------------------------------+

  

#### Markup 5: Updated Executive Dashboard Layout

+----------------------------------------------------------------------------------------------------+

| QCU INFOBOARD — DEAN ADMINISTRATIVE DASHBOARD [ Filter: AY 2026-2027 ▼ ] [🔔] |

+----------------------------------------------------------------------------------------------------+

| TOP KPI CARDS (Clickable): |

| +--------------------+ +--------------------+ +--------------------+ +--------------------+ |

| | Total Enrollees | | Active Faculty | | Student-to-Faculty | | Capacity Util. | |

| | 3,500 Students | | 75 Headcount | | 41.6 : 1 | | 88.5% | |

| +--------------------+ +--------------------+ +--------------------+ +--------------------+ |

+----------------------------------------------------------------------------------------------------+

| MAIN WIDGET GRIDS: |

| +--------------------------------------------+ +----------------------------------------------+ |

| | ENROLLMENT ANALYTICS WIDGET | | FACULTY ANALYTICS WIDGET | |

| | • Program Enrollment & Year Level Share | | • Full-Time vs. Part-Time Distribution | |

| | • Interactive Donut/Bar Chart Visuals | | • Student-to-Faculty Ratio Metrics | |

| | | | | |

| | [ View Students Button ]| | [ View Faculty Button ] | |

| +--------------------------------------------+ +----------------------------------------------+ |

| +--------------------------------------------+ +----------------------------------------------+ |

| | FIRST-GENERATION ANALYTICS WIDGET | | COHORT RETENTION PROGRESSION WIDGET | |

| | • First-Gen vs. Non-First-Gen Breakdown | | • First-Gen Year-Level Retention Line Chart | |

| | • Overall First-Gen Percentage | | • Progression from 1st Year to Graduation | |

| | | | | |

| | [ View Analytics Button ]| | [ View Retention Details ] | |

| +--------------------------------------------+ +----------------------------------------------+ |

+----------------------------------------------------------------------------------------------------+

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

### Part 1: Student Analytics Revisions

### Core Enhancements & Functional Summary

1.  Four Multi-Metric Distribution Charts: Introduces visual breakdowns for student demographics:
    

-   Gender Distribution: Donut Chart.
    
-   Program Share: Donut Chart (BSIT, BSIS, BSCS).
    
-   Year-Level Distribution: Horizontal Bar Chart (1st to 4th Year).
    
-   Enrollment Status: Pie Chart (Enrolled, On Leave, Dropped, Graduated).
    

3.  Student Directory & Record Management Table: Interactive grid listing Student ID, Name, Program, Year Level, Gender, Academic Year, Enrollment Status, and Actions (View Profile, Edit Info, Update Status). Includes global search, multi-column filters, and a Clear Filters reset action.
    
4.  First-Generation Student Monitoring: Dedicated Donut Chart evaluating First-Gen vs. Non-First-Gen ratios, featuring a View First-Generation Students filter trigger.
    
5.  Cohort Retention Pipeline: Funnel Chart tracking cohort progression from 1st Year entry through 4th Year graduation.
    
6.  Trend Analysis Engine: Historical trend line charts and summary analytics cards evaluating population growth, program demand, and retention performance.
    

----------

#### Student Analytics UI Markups

##### Markup S1: Demographic Distribution Charts Grid

+----------------------------------------------------------------------------------------------------+

| STUDENT DEMOGRAPHICS ANALYTICS |

+---------------------------------------------------+------------------------------------------------+

| GENDER DISTRIBUTION (Donut Chart) | PROGRAM DISTRIBUTION (Donut Chart) |

| | |

| ( Female: 54% ) | ( BSIT: 51% ) |

| ( Male: 46% ) | ( BSIS: 26% BSCS: 23% ) |

| | |

| Legend: ▓ Female (54%) ░ Male (46%) | Legend: █ BSIT (51%) ▓ BSIS (26%) ░ BSCS (23%) |

+---------------------------------------------------+------------------------------------------------+

| YEAR LEVEL DISTRIBUTION (Horizontal Bar) | ENROLLMENT STATUS (Pie Chart) |

| | |

| 1st Year: [==========================] 1,200 | ( Enrolled: 88% ) |

| 2nd Year: [====================] 900 | ( Leave: 5% Grad: 7% ) |

| 3rd Year: [==============] 800 | |

| 4th Year: [==========] 600 | Legend: █ Enrolled ▓ On Leave ░ Graduated |

+---------------------------------------------------+------------------------------------------------+

  

##### Markup S2: First-Gen Donut & Retention Funnel

+---------------------------------------------------+------------------------------------------------+

| FIRST-GENERATION MONITORING | RETENTION PIPELINE (Funnel Chart) |

| | |

| ( First-Gen: 38% ) | 1st Year Entry: \========================/ 1,400|

| ( Non-First-Gen: 62% ) | 2nd Year Ret: \======================/ 1,050 |

| | 3rd Year Ret: \==================/ 800 |

| [ View First-Gen Students Button ] | 4th Year Grad: \============/ 550 |

| Function: Filters Directory to First-Gen Cohort | [ View Retention Details Button ] |

+---------------------------------------------------+------------------------------------------------+

  

##### Markup S3: Student Information Management Directory

+----------------------------------------------------------------------------------------------------+

| STUDENT DIRECTORY TABLE |

| Search: [ Search Student ID, Name... ] Filters: [Program ▼] [Year ▼] [Status ▼] [Clear Filters]|

+------------+--------------------+---------+------------+--------+----------+-----------+-----------+

| Student ID | Student Name | Program | Year Level | Gender | AY | Status | Actions |

+------------+--------------------+---------+------------+--------+----------+-----------+-----------+

| 23-1042 | Juan Dela Cruz | BSIT | 2nd Year | Male | 2026-2027| Active | [View][Edit]

| 22-0891 | Maria Santos | BSIS | 3rd Year | Female | 2026-2027| Active | [View][Edit]

| 24-0112 | Mark Reyes | BSCS | 1st Year | Male | 2026-2027| On Leave | [View][Edit]

+------------+--------------------+---------+------------+--------+----------+-----------+-----------+

  

----------

### Part 2: Faculty Analytics Revisions

#### Core Enhancements & Functional Summary

1.  KPI Scorecard Update: Replaces the previous "Master's / Ph.D. Rate" card with a dedicated Total Faculty Count card.
    
2.  Faculty Directory Review Table: Comprehensive table displaying Faculty ID, Name, Program, Employment Status, Educational Attainment, Status, Date Hired, and Actions (View Profile, Edit Form, Delete/Archive).
    
3.  Faculty Search & Filtering: Quick search bar paired with filters for Employment Status, Educational Attainment, and Program, complete with Clear Filters and View All actions.
    
4.  Faculty Workload & Allocation Monitoring: Visualizes teaching load allocations across BSIT, BSIS, and BSCS programs using a Horizontal Bar Chart and Program Allocation Chart with a View Allocation drill-down button.
    
5.  Confirmation & Status Safety: Triggers mandatory modal confirmation dialogs prior to completing record updates or archiving actions.
    

----------

#### Faculty Analytics UI Markups

##### Markup F1: Reconfigured KPI Scorecard

+-----------------------------------+ +-----------------------------------+ +-----------------------------------+

| TOTAL FACULTY COUNT (Updated) | | FULL-TIME VS PART-TIME RATIO | | STUDENT-TO-FACULTY RATIO |

| | | | | |

| 75 Headcount | | 65% Full-Time / 35% Part-Time | | 41.6 : 1 |

| Active Faculty in Department | | 49 Full-Time / 26 Part-Time | | Average Allocation per Staff |

+-----------------------------------+ +-----------------------------------+ +-----------------------------------+

  

##### Markup F2: Faculty Workload & Allocation Chart

+----------------------------------------------------------------------------------------------------+

| FACULTY WORKLOAD MONITORING [ View Allocation ]|

| Teaching Load Distribution Across Programs |

| |

| BSIT: [====================================================] 35 Faculty Assignments |

| BSIS: [========================================] 25 Faculty Assignments |

| BSCS: [================================] 15 Faculty Assignments |

| |

| Display Type: Horizontal Bar Chart & Program Allocation Matrix |

+----------------------------------------------------------------------------------------------------+

  

##### Markup F3: Faculty Directory & Record Management Table

+----------------------------------------------------------------------------------------------------+

| FACULTY DIRECTORY TABLE [ + Add Faculty ]|

| Search: [ Search Faculty ID or Name... ] Filters: [Status ▼] [Attainment ▼] [Program ▼] [Clear] |

+------------+-----------------------+---------+---------------+------------+--------+------------+--+

| Faculty ID | Name | Program | Employment | Attainment | Status | Date Hired |Act|

+------------+-----------------------+---------+---------------+------------+--------+------------+--+

| F-2018-01 | Dr. Alan Turing | BSCS | Full-Time | Ph.D. | Active | 08/15/2018 |[*]

| F-2020-14 | Prof. Grace Hopper | BSIT | Full-Time | Master's | Active | 01/10/2020 |[*]

| F-2023-09 | Engr. Claude Shannon | BSIS | Part-Time | Bachelor's | Active | 09/01/2023 |[*]

+------------+-----------------------+---------+---------------+------------+--------+------------+--+

| Actions Column (*): [ View ] [ Edit ] [ Archive ] |

| Safety Behavior: Archive or Delete triggers a [ Mandatory Confirmation Modal ] before proceeding. |

+----------------------------------------------------------------------------------------------------+
