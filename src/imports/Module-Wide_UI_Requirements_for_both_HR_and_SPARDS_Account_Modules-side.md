

----------

# Module-Wide UI Requirements for both HR and SPARDS Account Modules-side:

## Dynamic Filtering Functionality

A centralized and consistent filtering mechanism shall be implemented across all analytical, reporting, and data visualization components within each module page.

### Available Filters

The filtering system may include, but is not limited to, the following criteria:

-   **Academic Year**
-   **Campus**
    -   San Bartolome
    -   San Francisco
    -   Batasan
-   **College/Department**
    -   CCS
    -   COB
    -   COA
    -   COE
    -   COED
-   **Program**
    -   Dynamically populated based on the selected College
-   Additional module-specific filters as required

### Dynamic Data Updates

-   All charts, tables, KPIs, metrics, and analytical summaries must automatically update based on the filter selections made by the **HR Department Head** user.
-   Any change in filter values must instantly refresh and synchronize all associated visualizations, datasets, and summary information without requiring a page reload.
-   The implementation should include additional sample datasets to demonstrate dynamic filtering behavior and ensure data consistency throughout each module.

----------

# User Interface Enhancements

### SVG Icon Standardization

-   Use centralized SVG icons across all account modules for the following actions:
    -   View
    -   Edit
    -   Archive
-   Icons should be consistent throughout the system to improve visual uniformity and conserve interface space.
-   Tooltip labels must appear on hover to clearly indicate each action.

# Enhanced College and Program Filtering Logic

Improve the **College** filter functionality by supporting the following options:

-   All Colleges
-   CCS
-   COB
-   COA
-   COE
-   COED

### Dynamic Program Filtering Behavior

-   When **All Colleges** is selected, the Program filter shall display all available programs across all colleges.
-   When a specific College is selected, the Program filter shall automatically update and display only the programs associated with that College.
-   The filtering relationship between College and Program must be fully dynamic and synchronized.

### Required Academic Structure

#### CCS – College of Computer Studies

-   BS Information Technology (BSIT)
-   BS Information Systems (BSIS)
-   BS Computer Science (BSCS)

#### COB – College of Business

-   BS Business Administration (BSBA)
-   BS Entrepreneurship (BSE)

#### COA – College of Accountancy

-   Bachelor of Science in Accountancy (BSA)

#### COE – College of Engineering

-   BS Electrical Engineering (BSEE)
-   BS Industrial Engineering (BSIE)

#### COED – College of Education

-   BECED – Bachelor of Early Childhood Education

### Data Requirements

-   Add and distribute student records across the various colleges and programs listed above.
-   Ensure sufficient sample data exists in each college and program to properly demonstrate filtering, visualization updates, chart generation, and reporting functionalities.

----------

### Consolidation of Duplicate Live Filters

**Review and eliminate duplicate "Live Filters" sections that perform the same filtering functionality within a single page. A unified filtering area should be maintained to avoid redundancy, improve usability, and ensure a cleaner interface design.**

#### Requirements

-   Only **one centralized Live Filters section** shall be displayed per page.
-   The primary Live Filters section shall contain all applicable filtering controls, including but not limited to:
    -   Academic Year
    -   Campus
    -   College
    -   Program
    -   Other module-specific filters (e.g., Grant Type, Income Bracket)
-   Remove any duplicate filter dropdowns that replicate filtering functionality already available in the primary Live Filters section.
-   Ensure all filters remain fully functional and continue to dynamically update charts, tables, KPIs, metrics, and analytical summaries throughout the page.
-   The **Chart Selection** control and **Export All** button should remain positioned within a dedicated action area beneath or beside the primary filter section and must not introduce a second set of filtering controls.
-   If additional filters are required for specific modules, they should be incorporated into the existing centralized Live Filters section rather than creating a separate filter container.
-   All filtering operations must remain synchronized, ensuring that any filter modification immediately updates all related visualizations and datasets without requiring a page refresh.

#### UI/UX Objective

The page should present a **single source of filtering controls** to prevent user confusion, minimize unnecessary interface clutter, and provide a more streamlined analytical dashboard experience. The final layout should clearly separate:

1.  **Filtering Controls** (Live Filters)
2.  **Dashboard Actions** (Chart Selection, Export All, Reset)
3.  **Visualizations and Analytics Content**

This structure ensures a cleaner, more intuitive, and professional dashboard design while maintaining full filtering functionality across all modules.

# Comprehensive Dynamic Filter Synchronization

All filters implemented throughout the module shall be fully functional, interconnected, and capable of dynamically updating all related data visualizations, analytics, and reporting components in real time.

### Functional Requirements

-   Every filter selection made by the user must immediately affect all applicable dashboard components, including:
    
    -   Charts
    -   Graphs
    -   Dashboards
    -   KPI Cards
    -   Statistical Summaries
    -   Data Tables
    -   Reports
    -   Exported Data
-   Filters must operate using a **global synchronization model**, where a single filter change automatically updates all dependent visualizations and datasets within the current module.
    
-   The filtering system must support combined filtering logic. For example:
    
    -   Academic Year + Campus
    -   Academic Year + Campus + College
    -   Academic Year + Campus + College + Program
    -   Any other valid filter combination
-   All displayed counts, percentages, averages, totals, trends, rankings, and chart datasets must be recalculated dynamically based on the user's current filter selections.
    

### Chart and Analytics Synchronization

-   Every chart must display only the records that satisfy the active filter criteria.
-   Different charts should present different analytical perspectives of the same filtered dataset while maintaining data consistency across the page.
-   No chart, table, metric, or summary should continue displaying unfiltered or outdated information once a filter selection has changed.

### Real-Time Data Refresh

-   Changes made to any filter shall automatically refresh:
    
    -   Chart datasets
    -   Table records
    -   KPI values
    -   Summary statistics
    -   Trend analyses
    -   Export outputs
-   Updates should occur without requiring a page refresh or manual reload.
    

### Data Integrity Requirement

-   All visualizations and reporting components must always reference the same filtered dataset source to ensure consistency and accuracy across the module.
-   Values displayed in charts, KPI cards, tables, summaries, and exported reports must match one another under the currently selected filter criteria.

### Testing and Sample Data Requirement

-   Add sufficient sample records across all Academic Years, Campuses, Colleges, Programs, and other applicable categories.
-   Sample data should be distributed realistically to verify that every filter combination produces visible and meaningful changes throughout all charts, metrics, tables, and reports.
-   Avoid using static or hardcoded values that do not respond to filter selections.

### Expected User Experience

A user should be able to select any combination of filters and immediately observe corresponding changes across the entire dashboard. Every chart, KPI card, table, summary, and exported report must reflect the exact same filtered dataset, providing a fully synchronized and interactive analytics experience.

### Implementation Note

All filtering, visualization, reporting, export, chart management, and dashboard components must remain fully synchronized. Any user action involving filter selection, chart selection, or data updates should automatically refresh all related datasets, visualizations, KPIs, summaries, exports, and analytical content throughout the module while maintaining consistency and accuracy across the interface.
