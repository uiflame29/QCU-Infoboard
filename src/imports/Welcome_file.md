
### Overview & Structural Breakdown of

### The COLLEGE DATA_DEAN (2).pdf document defines two core system architecture updates for the QCU InfoBoard College Dean Portal:

1.  Account & Filtering Scope Isolation: Strict data segregation ensuring that each College Dean account accesses and filters data only for their assigned college and academic programs.
    
2.  Redesigned Navigation Sidebar: A structured hierarchy separating core analytics, data management, and search tools into two primary categories (College Intelligence and Discovery) with nested dropdown menus.
    

----------

### 1. Departmental Account & Program Filtering Rules

When a College Dean logs into the portal and applies filters across any module, the system restricts the program selection dropdowns strictly to their designated department:

College Code

College Name

Authorized Academic Programs

CCS

College of Computer Studies

• BS Information Technology (BSIT)• BS Information Systems (BSIS)• BS Computer Science (BSCS)

COB

College of Business

• BS Business Administration (BSBA)• BS Entrepreneurship (BSE)

COA

College of Accountancy

• Bachelor of Science in Accountancy (BSA)

COE

College of Engineering

• BS Electrical Engineering (BSEE)• BS Industrial Engineering (BSIE)

COED

College of Education

• Bachelor of Early Childhood Education (BECED)

----------

### 2. Sidebar Navigation Wireframe Markup

Below is the structured text-based UI markup representing the exact navigation sidebar image layout from the source document:

=====================================================================

QCU InfoBoard Sidebar Interface

=====================================================================

┌─────────────────────────────────────────────────────────────────┐

│ [🎓] QCU InfoBoard [X] │

│ COLLEGE DEAN │

├─────────────────────────────────────────────────────────────────┤

│ ┌───────────────────────────────────────────────────────────┐ │

│ │ (MS) Dean Maria Santos │ │

│ │ Dean, College of Computer... │ │

│ │ [ COLLEGE DEAN ] │ │

│ │ dean.ccs@qcu.edu.ph │ │

│ └───────────────────────────────────────────────────────────┘ │

├─────────────────────────────────────────────────────────────────┤

│ COLLEGE INTELLIGENCE │

│ │

│ [⊞] Dashboard Overview • │

│ [👤] Analytics ▾ │

│ ├── Student Analytics │

│ └── Faculty Analytics │

│ [📊] Data Management ▾ │

│ ├── Student Data Management │

│ └── Faculty Data Management │

│ [⭐] College Data │

│ [📄] Reports │

├─────────────────────────────────────────────────────────────────┤

│ DISCOVERY │

│ │

│ [🔍] Search & Filter │

├─────────────────────────────────────────────────────────────────┤

│ [➔] Sign Out │

└─────────────────────────────────────────────────────────────────┘

=====================================================================

  

----------

### 3. Detailed Element-by-Element Markup Breakdown

#### A. Header & User Profile Container

-   Application Header: Displays the institutional title QCU InfoBoard alongside the portal role label COLLEGE DEAN and a close icon ([X]).
    
-   User Profile Card:
    

-   Initials Avatar:  (MS) initials circle.
    
-   User Name:  Dean Maria Santos.
    
-   Title:  Dean, College of Computer....
    
-   Role Badge:  [ COLLEGE DEAN ].
    
-   Email:  dean.ccs@qcu.edu.ph.
    

#### B. Category 1: COLLEGE INTELLIGENCE

-   Dashboard Overview: Primary landing page widget marked with an active status dot (•).
    
-   Analytics Dropdown (▾):
    

-   Student Analytics: Opens demographic distributions, First-Gen student tracking, and cohort retention charts.
    
-   Faculty Analytics: Opens faculty headcount, Full-Time/Part-Time ratios, and degree attainment analytics.
    

-   Data Management Dropdown (▾):
    

-   Student Data Management: Opens the searchable student directory table for managing profile details and enrollment statuses.
    
-   Faculty Data Management: Opens the searchable faculty directory table for managing teaching loads and archiving records.
    

-   College Data: Central repository for departmental master records.
    
-   Reports: Opens the executive report builder to generate certified PDF or Excel summaries.
    

#### C. Category 2: DISCOVERY

-   Search & Filter: Opens global search utility and multi-attribute filter configurations across department datasets.
    

#### D. Footer / Session Control

-   Sign Out: Terminates session token and redirects the user back to the system login gate.
