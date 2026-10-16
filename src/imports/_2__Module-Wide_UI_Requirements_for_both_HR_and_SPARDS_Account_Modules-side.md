

----------

# Module-Wide UI Requirements for both HR and SPARDS Account Modules-side:

Implement the **HR Analytics Module** using the same layout structure, visual hierarchy, component arrangement, and design consistency as the **SPARDS Analytics Module**. The HR Analytics page should follow the same overall page flow, including:

-   Analytics Menu/Tab Navigation positioned above the filters.
-   Centralized Live Filters section below the analytics menu.
-   KPI Cards displayed immediately below the filters.
-   Charts and analytics content following the KPI Cards.

Additionally, replicate the **exact KPI card design pattern** used in the SPARDS Analytics Module, including:

-   Card sizing and spacing
-   Card styling, borders, shadows, and corner radius
-   Typography hierarchy and label formatting
-   Metric value presentation
-   Responsive layout behavior

Maintain consistent styling, spacing, alignment, colors, and component placement across both modules to provide a unified analytics experience throughout the system. The HR Analytics Module should visually feel like an extension of the SPARDS Analytics Module while only changing the content, metrics, charts, and HR-specific analytical data.

Remove the first (top) **Live Filters** container that contains the text _"Live Filters - All visuals update instantly"_ and retain only the second filter container as the system's single centralized filtering section. Consolidate all filtering functionality into this remaining container and ensure all filters remain fully functional. Redesign and align the second filter container so that all filter dropdowns, Reset button, Live status indicator, Chart Selection button, and Export All button fit neatly within a single horizontal row without wrapping, while maintaining responsive behavior, proper spacing, and visual consistency across the dashboard.

Refactor the **HR Import Data Module** to fully adopt the layout structure, visual design, component organization, and user experience pattern of the **SPARDS Import Data Module**. The HR Import Data page should use the SPARDS page as the design reference and maintain the same visual hierarchy, spacing, card layout, sizing, alignment, and component styling throughout the interface.

Specifically:

-   Replace the current HR Import Data layout with the same page structure used in the SPARDS Import Data module.
-   Move the **Active Validation Requests** section from the right sidebar and place it below the **Schema Validation Preview**, matching the SPARDS layout.
-   Replace the current dataset-type radio button selection with the same dataset selection card/button design used in SPARDS.
-   Redesign the file upload section to use the same large drag-and-drop upload container, file preview presentation, and action placement as SPARDS.
-   Match the Schema Validation Preview card design, including headers, validation statistics display, table styling, spacing, and status indicators.
-   Implement the same validation request card layout, status badges, button styles, card spacing, and list presentation used in SPARDS.
-   Maintain HR-specific content, terminology, records, and validation workflows, but ensure the overall UI structure and design closely mirror the SPARDS implementation.
-   Apply the same responsive behavior, visual consistency, typography hierarchy, border radius, shadow treatment, paddings, and spacing system used in SPARDS.

The final HR Import Data page should feel like an HR-specific version of the SPARDS Import Data module, with identical layout patterns and design language while only differing in HR-related datasets, records, validation content, and module naming.

### Expected User Experience

A user should be able to select any combination of filters and immediately observe corresponding changes across the entire dashboard. Every chart, KPI card, table, summary, and exported report must reflect the exact same filtered dataset, providing a fully synchronized and interactive analytics experience.

### Implementation Note

All filtering, visualization, reporting, export, chart management, and dashboard components must remain fully synchronized. Any user action involving filter selection, chart selection, or data updates should automatically refresh all related datasets, visualizations, KPIs, summaries, exports, and analytical content throughout the module while maintaining consistency and accuracy across the interface.
