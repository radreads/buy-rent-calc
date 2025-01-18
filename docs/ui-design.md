# UI Design Specification

## Layout Overview
```
+----------------------------------------+
|           Rent vs Buy Calculator        |
+----------------+-----------------------+
|   Input Form   |    Results Dashboard  |
|  +---------+   |  +-----------------+ |
|  | Rent    |   |  | Monthly Costs   | |
|  | Inputs  |   |  | (Bar Chart)     | |
|  +---------+   |  |                 | |
|  +---------+   |  +-----------------+ |
|  | Buy     |   |  +-----------------+ |
|  | Inputs  |   |  | Break-even      | |
|  +---------+   |  | (Line Chart)    | |
|  +---------+   |  |                 | |
|  |Scenario |   |  +-----------------+ |
|  |Controls |   |  +-----------------+ |
|  +---------+   |  | Cost Breakdown  | |
|                |  | (Pie Charts)    | |
+----------------+-----------------------+
```

## Input Form Section

### Rent Inputs
```
+----------------------------------+
| Rent Details                     |
+----------------------------------+
| Monthly Rent     | $[      2000] |
| Utilities       | $[       200] |
| Renters Ins.    | $[        30] |
+----------------------------------+
```

### Buy Inputs
```
+----------------------------------+
| Purchase Details                 |
+----------------------------------+
| Home Price      | $[    400000] |
| Down Payment    | $[     80000] |
|                | [20]%         |
| Interest Rate  | [3.5]%        |
| Loan Term      | [30] years    |
+----------------------------------+
| Monthly Costs                    |
+----------------------------------+
| Property Tax   | $[      4000] |
| Maintenance    | $[       300] |
| Home Insurance | $[       150] |
+----------------------------------+
```

### Scenario Controls
```
+----------------------------------+
| Scenario                         |
+----------------------------------+
| [Save Current] [Load Scenario ▼] |
| Name: [Default Scenario       ]  |
+----------------------------------+
```

## Results Dashboard Section

### Monthly Cost Comparison
```
+----------------------------------+
| Monthly Costs                    |
|            $3000                 |
|   ┌────┐      ┌────┐            |
|   │Rent│      │Buy │            |
|   └────┘      └────┘            |
|   $2230       $2800             |
+----------------------------------+
```

### Break-even Analysis
```
+----------------------------------+
| Break-even Timeline              |
|   ^                             |
|   │      Buy                    |
|   │   ╱                         |
|   │╱                            |
|   │     Rent                    |
|   └─────────────────────>       |
|   0    5    10    15    Years   |
+----------------------------------+
```

### Cost Distribution
```
+----------------------------------+
| Monthly Cost Breakdown           |
|   ┌────────┐    ┌────────┐      |
|   │ Rent   │    │  Buy   │      |
|   │        │    │        │      |
|   └────────┘    └────────┘      |
+----------------------------------+
```

## Color Scheme
- Primary: #2563eb (Blue)
- Secondary: #4f46e5 (Indigo)
- Rent: #ec4899 (Pink)
- Buy: #8b5cf6 (Purple)
- Background: #ffffff (White)
- Text: #1f2937 (Gray 800)
- Border: #e5e7eb (Gray 200)

## Typography
- Headings: Inter, sans-serif
- Body: Inter, sans-serif
- Numbers: Mono font for better alignment

## Responsive Behavior
- Desktop: Side-by-side layout (as shown)
- Tablet: Side-by-side with reduced padding
- Mobile: Stacked layout
  - Inputs on top
  - Results below
  - Full-width charts 

## Mobile Layout

### Mobile View (Portrait)
```
+----------------------------------+
|      Rent vs Buy Calculator      |
+----------------------------------+
| [Toggle Inputs/Results ▼]        |
+----------------------------------+
|          Input Form              |
| +------------------------------+ |
| | Rent Details                 | |
| +------------------------------+ |
| | Monthly Rent   | $[    2000] | |
| | Utilities     | $[     200] | |
| | Renters Ins.  | $[      30] | |
| +------------------------------+ |
|                                  |
| +------------------------------+ |
| | Purchase Details             | |
| +------------------------------+ |
| | Home Price    | $[  400000] | |
| | Down Payment  | $[   80000] | |
| |              | [20]%       | |
| | Interest Rate| [3.5]%      | |
| | Loan Term    | [30] years  | |
| +------------------------------+ |
| | Monthly Costs               | |
| | Property Tax | $[    4000] | |
| | Maintenance  | $[     300] | |
| | Home Ins.    | $[     150] | |
| +------------------------------+ |
|                                  |
| +------------------------------+ |
| | [Save Current] [Load     ▼] | |
| +------------------------------+ |
+----------------------------------+
|         Results Dashboard        |
| +------------------------------+ |
| | Monthly Costs               | |
| |          $3000              | |
| | ┌────┐                      | |
| | │Rent│ $2230               | |
| | └────┘                      | |
| | ┌────┐                      | |
| | │Buy │ $2800               | |
| | └────┘                      | |
| +------------------------------+ |
|                                  |
| +------------------------------+ |
| | Break-even Timeline         | |
| | [Full-width line chart]     | |
| +------------------------------+ |
|                                  |
| +------------------------------+ |
| | Cost Distribution           | |
| | [Full-width pie charts]     | |
| +------------------------------+ |
+----------------------------------+
```

### Mobile-Specific Features
- Toggle button to switch between inputs and results
- Collapsible sections for Rent/Buy inputs
- Full-width charts for better readability
- Sticky navigation bar with toggle
- Bottom sheet for scenario selection

### Mobile Interactions
- Swipe between inputs and results
- Pinch to zoom on charts
- Double tap to expand chart to full screen
- Pull to refresh calculations

### Mobile-First Considerations
- Larger touch targets (min 44px)
- Input fields expand to full width
- Number pad keyboard for numerical inputs
- Currency/percentage formatting as you type
- Clear error messages below inputs
- Floating action button for quick save 