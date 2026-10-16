

----------

# Module-Wide Filtering, Visualization, and Export Requirements for HR and SPARDS Account and Modules-side

## 1. Export Functionality

Each module shall provide comprehensive export capabilities to support both individual and full-page data extraction requirements.

### Individual Export Actions

-   Every chart and data table must include a dedicated **Export** button.
-   This button shall allow users to export only the currently displayed dataset, visualization, or table associated with that specific component.
-   Exported data must reflect any active filter selections applied by the user.

### Module-Level Export All Action

-   A dedicated **Export All** button shall be placed within the page header of each module.
-   Selecting this action shall export all charts, tables, metrics, reports, and analytical content currently displayed within the module.
-   The exported content must dynamically reflect the active filter criteria selected by the user at the time of export.

----------

## 2. Dynamic Filtering Functionality

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

## 3. Chart Viewing and Expansion Feature

To improve data analysis and visualization review, each chart card within the applicable account modules shall include both **View Chart** and **Export** actions.

### View Chart Functionality

-   Selecting the **View Chart** button shall open an expanded or dedicated chart view.
-   This expanded view must provide a more detailed presentation of the selected visualization.

### Expanded Chart View Requirements

The dedicated chart view shall display:

-   Chart title
-   Descriptive chart summary or explanation
-   Interactive hover functionality for viewing detailed data points and values
-   Applicable legends
-   Labels
-   Additional supporting information relevant to the visualization

This functionality shall allow users to focus on an individual visualization and perform more detailed analysis.

----------

## 4. Chart Selection and Display Management

Review and cross-check all existing filter controls throughout the module pages. Any duplicated chart-related filter buttons should be consolidated and replaced with a centralized **Chart Selection** control.

### Chart Selection Filter Control

-   A **Chart Selection** filter button shall be available on every applicable module page.
-   Selecting the control shall open a dropdown menu containing checkbox options for all charts available within the current page.

### Chart Selection Features

-   Users may select one or multiple charts from the available list.
-   Selected charts shall automatically be displayed in an enlarged, prioritized, or focused view within the main content area.
-   The displayed visualizations must update dynamically according to the user's selections without requiring a page refresh.
-   The chart list must be generated dynamically based on the charts available within the current module.

This functionality enables HR Department Head users to create a customized analytical dashboard experience focused on the visualizations most relevant to their needs.

----------

# User Interface Enhancements

### SVG Icon Standardization

-   Use centralized SVG icons across all account modules for the following actions:
    -   View
    -   Edit
    -   Archive
-   Icons should be consistent throughout the system to improve visual uniformity and conserve interface space.
-   Tooltip labels must appear on hover to clearly indicate each action.

### Scroll-to-Top Button

-   Implement a **Scroll-to-Top** button on long pages for improved navigation.
-   The functionality and design should follow the same implementation pattern used in other account modules.

### Year Level Filter Removal

-   Remove the **Year Level** filtering functionality from all HR account modules for the current implementation phase.

### Import Data UI Consistency

-   Apply the same **Import Data** UI design and visual styling used in the **SPARDS Department Account** to all HR account modules.
-   This design should be adopted because it provides a cleaner, more polished, and more user-friendly layout.

----------

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

### Implementation Note

All filtering, visualization, reporting, export, chart management, and dashboard components must remain fully synchronized. Any user action involving filter selection, chart selection, or data updates should automatically refresh all related datasets, visualizations, KPIs, summaries, exports, and analytical content throughout the module while maintaining consistency and accuracy across the interface.
