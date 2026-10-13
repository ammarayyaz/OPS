# Design System & UI Specification Document
## Outlook Productivity Suite (OPS)

---

### Document Overview
- **Product**: Outlook Productivity Suite
- **Version**: 1.0.0
- **Aesthetic Classification**: Architectural Ultra-Minimalism (Swiss / Braun / Executive Discipline)
- **Target Surfaces**: Desktop Web, Tablet Web, Modern High-Resolution Displays

---

## 1. Design Philosophy & Absolute Directives

This application rejects decorative embellishments, visual noise, and cognitive clutter. It is built for sustained executive focus and zero distraction.

### 1.1 Mandatory Rules of Restraint
1. **Zero Emojis**: Absolutely NO unicode emojis anywhere in headings, buttons, status indicators, tabs, or card content. All iconography is strictly monochrome SVGs.
2. **Zero Status Dots**: NO green, amber, red, or blue circles, live indicators, or pulsing presence dots on cards or headers. Status is represented strictly via clean uppercase typography (e.g., `PENDING`, `ALIGNED`, `SYNCED`).
3. **Card Content Diet**: Maximum 3 data points per card. No avatar stacks, no tag clouds, no progress bars inside cards, and no excessive metadata.
4. **Universal Sharp Geometry**: `border-radius: 0 !important;` applied globally across every button, card, modal, input, dropdown, and container.
5. **Zero Outlines & Zero Break Lines**: No border strokes, no `<hr>` divider lines, no underlines under headers, and no table gridlines. Structural hierarchy is formed solely through subtle surface fills, pure whitespace, and typography.
6. **Zero Glow**: No neon box-shadows, no glowing rings, and no glowing text shadows. Surfaces are pure, crisp, and flat.
7. **Left Fixed Edge-Flush Sidebar**: The primary navigation is permanently anchored flush to the left viewport edge with zero margins or floating gaps (`position: fixed; top: 0; left: 0; bottom: 0; height: 100vh;`).

---

## 2. Color Token Architecture (Custom Palette Ready)

> **Notice on Colors**: As requested, the color system is built entirely on CSS Custom Properties with explicit token slots. The user will specify their exact color choices; in the meantime, clean architectural neutral foundations (Pure White light mode & True Black dark mode) are established with clean placeholder accent slots.

### 2.1 CSS Variable Structure & Token Definitions

```css
:root {
  /* =====================================================================
     [USER SPECIFIED PALETTE - "Dashboard Sample Orange"]
     ===================================================================== */
  --color-rust-deep:      #7A2904;    /* Deep Rust / Espresso Terracotta */
  --color-terracotta:     #A53C08;    /* Rich Terracotta / Burnt Orange (KPI primary) */
  --color-vivid-orange:   #F05500;    /* Vivid High-Signal Orange */
  --color-tangerine:      #F7803A;    /* Warm Tangerine / Amber */
  --color-peach:          #FCA772;    /* Warm Apricot / Peach */
  --color-canvas-tint:    #FFF3EB;    /* Light Canvas Peach Tint (optional) */
  --color-charcoal:       #33373B;    /* Contrast Charcoal Slate Grey */

  --color-accent-primary:   var(--color-terracotta);
  --color-accent-hover:     var(--color-rust-deep);
  --color-accent-contrast:  #FFFFFF;
  --color-accent-vivid:     var(--color-vivid-orange);
  --color-accent-subtle:    #FEEFE6;

  /* =====================================================================
     LIGHT MODE FOUNDATION (Pure White Canvas with Orange Accents)
     ===================================================================== */
  --bg-canvas:            #FFFFFF;    /* Strict pure white canvas */
  --bg-sidebar:           #FBF8F5;    /* Subtle warm edge-flush sidebar surface */
  --bg-sidebar-hover:     #F4EDE8;    /* Sidebar item hover */
  --bg-sidebar-active:    #EFE3DC;    /* Active navigation item fill */
  --bg-card:              #F8F9FA;    /* Minimal flat card surface */
  --bg-card-hover:        #F1F3F5;    /* Card hover state */
  --bg-card-featured:     var(--color-terracotta); /* Featured high-priority tile */
  --bg-input:             #F1F3F5;    /* Sharp input surface */
  
  --text-primary:         #111827;    /* High-contrast primary reading text */
  --text-secondary:       #4B5563;    /* Contextual descriptions & labels */
  --text-muted:           #8C95A0;    /* Secondary metadata & timestamps */
  --text-sidebar:         #1F2937;    /* Sidebar navigation typography */
}

/* =====================================================================
   DARK MODE FOUNDATION (True Deep Black Canvas with Burnt Orange Accents)
   ===================================================================== */
[data-theme="dark"] {
  --color-accent-primary:   #F05500;    /* High visibility vivid orange in dark mode */
  --color-accent-hover:     #FF6A1A;    /* Brighter orange hover */
  --color-accent-contrast:  #05080A;    /* Contrast dark text */
  --color-accent-vivid:     #FA7D38;
  --color-accent-subtle:    #24120A;    /* Dark burnt amber subtle highlight */

  --bg-canvas:            #05080A;    /* Strict true deep black canvas */
  --bg-sidebar:           #0E1114;    /* Edge-flush dark sidebar surface */
  --bg-sidebar-hover:     #161A20;    /* Dark sidebar item hover */
  --bg-sidebar-active:    #1F242C;    /* Active dark navigation item */
  --bg-card:              #101317;    /* Minimal flat dark card surface */
  --bg-card-hover:        #181D23;    /* Dark card hover surface */
  --bg-card-featured:     #7A2904;    /* Dark mode deep rust featured tile */
  --bg-input:             #13171C;    /* Sharp dark input background */

  --text-primary:         #F9FAFB;    /* Crisp light text on black */
  --text-secondary:       #9CA3AF;    /* Subtle descriptions */
  --text-muted:           #6B7280;    /* Timestamps and secondary labels */
  --text-sidebar:         #E5E7EB;    /* Dark sidebar typography */
}
```

---

## 3. Typography System & Hierarchy

The application strictly enforces a refined geometric typographic stack:
1. **Century Gothic** (`"Century Gothic", "CenturyGothic", AppleGothic, "ITC Avant Garde Gothic", sans-serif`) for interface labels, headings, buttons, body text, and navigation.
2. **Century Gothic Tabular Numerals** (`font-variant-numeric: tabular-nums`) for all counts, statistics, metrics, dates, and timestamps.

### 3.1 Typography Scale Reference

| Token | Family | Size | Weight | Line Height | Letter Spacing | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display-metric` | Century Gothic | 38px | 600 | 1.0 | -0.02em | Large KPI numbers (e.g. `00`, `18`) |
| `heading-1` | Century Gothic | 24px | 600 | 1.2 | -0.01em | Primary page / tab title |
| `heading-2` | Century Gothic | 15px | 600 | 1.3 | +0.00em | Section headers, card titles |
| `body-base` | Century Gothic | 13px | 400 | 1.5 | +0.01em | Default text, descriptions |
| `label-meta` | Century Gothic | 11px | 600 | 1.2 | +0.06em | Uppercase source tags, status text |
| `number-meta` | Century Gothic | 12px | 500 | 1.4 | +0.00em | Timestamps, due dates, item counts |

---

## 4. Layout Architecture & Spatial Grid

### 4.1 Global Viewport Layout

```
0px                                260px                                Viewport Max
+----------------------------------+-----------------------------------------------+
|                                  |                                               |
|  FIXED EDGE-FLUSH SIDEBAR        |  MAIN CONTENT VIEWPORT                        |
|  - Position: fixed               |  - Margin-Left: 260px                         |
|  - Top: 0, Left: 0, Bottom: 0    |  - Height: 100vh                              |
|  - Width: 260px                  |  - Overflow-y: auto                           |
|  - Height: 100vh                 |  - Padding: 40px 48px                         |
|  - Zero margins, Zero borders    |  - Zero borders, Pure contrast canvas         |
|                                  |                                               |
|  [App Title]                     |  [Tab Header: Title + Timestamp]              |
|                                  |                                               |
|  [Navigation Items]              |  [KPI Stat Strip (4 Columns)]                 |
|  - Dashboard                     |                                               |
|  - Pending Tasks                 |  [Tab-Specific Grid / List Content]           |
|  - Aligned Tasks                 |  - Ultra-minimal cards                        |
|  - Settings                      |  - No dots, no emojis, no borders             |
|                                  |                                               |
|  [Footer: Profile & Theme]       |                                               |
+----------------------------------+-----------------------------------------------+
```

### 4.2 Mobile Viewport & Responsive Navbar Architecture (<= 860px)

```
0px                                                                 Viewport Max
+-------------------------------------------------------------------------------+
|  MOBILE TOP BAR (Fixed, Height: 52px, Zero Borders)                           |
|  [OPS // OUTLOOK]               [SYNC: ACTIVE]  [THEME: LIGHT]  [MENU ICON]   |
+-------------------------------------------------------------------------------+
|                                                                               |
|  FULL-WIDTH RESPONSIVE MAIN VIEWPORT (Zero Left Margin, 100% Width)           |
|  - Padding: 68px 16px 82px 16px                                               |
|  - 1 or 2 Column KPI Grid (Zero awkward text wrapping)                        |
|  - Single Column Analytics & Split View Containers                            |
|                                                                               |
+-------------------------------------------------------------------------------+
|  MOBILE BOTTOM TAB BAR (Fixed, Height: 58px, Thumb Friendly, Sharp Edges)     |
|  [DASHBOARD]        [PENDING (0)]        [ALIGNED (0)]        [SETTINGS]      |
+-------------------------------------------------------------------------------+
```

- **Mobile Top Bar**: Edge-flush header with brand title, live sync timestamp, quick theme switcher, and navigation drawer toggle.
- **Slide-In Drawer**: On mobile, the full desktop sidebar converts into a slide-in drawer (`transform: translateX(-100%)` to `translateX(0)`) with a dark backdrop overlay (`rgba(5, 8, 10, 0.65)`).
- **Mobile Bottom Tab Bar**: 4 quick-access tabs (`Dashboard`, `Pending`, `Aligned`, `Settings`) anchored to the bottom edge with active terracotta indicator fill and live numeric badges.
- **Content Grid Auto-Adaptation**: Metric cards collapse to a clean 2-column or 1-column layout, eliminating crowded side-by-side collisions on narrow screens.

---

## 5. Screen & Component Specifications

### 5.1 Screen 1: Login & Authentication Page (`/login`)
Designed as a standalone focused portal prior to entering the dashboard.

- **Layout**: Full-screen centered view on canvas (`var(--bg-canvas)`).
- **Authentication Card**:
  - Width: `420px`.
  - Background: `var(--bg-card)`.
  - Border: None (`border: none !important;`).
  - Radius: `0` (`border-radius: 0 !important;`).
  - Padding: `48px 40px`.
- **Card Elements**:
  1. **Brand Wordmark**: `OUTLOOK PRODUCTIVITY SUITE` (13px, uppercase, letter-spacing +0.08em, SF Pro Text).
  2. **Headline**: `Sign in with your Microsoft account` (20px, SF Pro Text, weight 600).
  3. **Subtext**: `Connect your Outlook ID for live task synchronization and alignment.` (13px, `var(--text-secondary)`).
  4. **Primary SSO Button**:
     - Full width (`100%`).
     - Height: `46px`.
     - Zero border, zero radius.
     - Background: `var(--color-accent-primary)`, Text: `var(--color-accent-contrast)`.
     - Contains sharp monochrome Microsoft SVG icon + text `SIGN IN WITH MICROSOFT`.
  5. **Account Type Selector**:
     - Segmented flat toggle (no rounded corners, no borders): `Work / School` vs `Personal Account`.
  6. **Persistence Checkbox**:
     - Sharp square checkbox: `Keep signed in on this device`.
  7. **Notice**:
     - `Protected by Microsoft Entra OAuth 2.0 PKCE. Read/Write task sync enabled.`

---

### 5.2 Screen 2: Fixed Left Navigation Sidebar
Always visible when authenticated. Flush with the window border.

- **Width**: `260px`.
- **Background**: `var(--bg-sidebar)`.
- **Border**: None (`border: none !important; box-shadow: none !important;`).
- **Padding**: `28px 16px`.
- **Header Section**:
  - Wordmark: `OPS // OUTLOOK` (12px, weight 700, uppercase).
  - Synchronized Account Sublabel: `user@organization.com` (11px, `var(--text-muted)`).
- **Navigation Tabs**:
  - Flat rectangular items (height: `40px`, padding: `0 14px`, display: `flex`, align-items: `center`).
  - Zero radius (`border-radius: 0 !important;`).
  - Zero border.
  - States:
    - Default: Text `var(--text-sidebar)`.
    - Hover: Background `var(--bg-sidebar-hover)`.
    - Active: Background `var(--bg-sidebar-active)`, Font weight 600.
  - Tab Items:
    1. **Dashboard** (SVG Icon: Grid)
    2. **Pending Tasks** (SVG Icon: Clock / List)
    3. **Aligned Tasks** (SVG Icon: Target / Focus)
    4. **Settings** (SVG Icon: Sliders / Gear)
- **Footer Section**:
  - Live Sync Text: `OUTLOOK SYNC: ACTIVE` (10px, weight 600, tabular-nums for time `13:45:10`).
  - Note: Strictly NO green dot. Just clean uppercase text.
  - Theme Switcher: Flat text button `LIGHT` / `DARK`.

---

### 5.3 Screen 3: Executive Dashboard Tab
The default landing overview after login.

#### A. Header Area
- Page title: `EXECUTIVE DASHBOARD` (22px, weight 600).
- Sync status banner: `SYNCED WITH OUTLOOK 3M AGO` (12px, Inter tabular numbers, `var(--text-muted)`).
- Action: `REFRESH SYNC` button (flat fill, 0 radius, zero border).

#### B. KPI Metrics Strip (4 Columns)
Four equal-width flat tiles (`var(--bg-card)`):
1. **PENDING TASKS**:
   - Number: `18` (`display-metric`, Inter tabular).
   - Label: `AWAITING TRIAGE` (11px uppercase).
2. **ALIGNED TASKS**:
   - Number: `42` (`display-metric`, Inter tabular).
   - Label: `GOAL LINKED` (11px uppercase).
3. **DUE TODAY**:
   - Number: `05` (`display-metric`, Inter tabular).
   - Label: `CRITICAL COMMITMENTS` (11px uppercase).
4. **ALIGNMENT RATIO**:
   - Number: `70%` (`display-metric`, Inter tabular).
   - Label: `STRATEGIC FOCUS` (11px uppercase).

#### C. Immediate Priority Queue (Cards Deck)
- Displays 5 highest urgency pending tasks.
- Each item is rendered using the **Strict Minimal Card Anatomy** (see Section 6).

#### D. Outlook Analytics Visualizations (Sample Orange Palette)
1. **Outlook Incoming Volume & Category Split** (Horizontal Stacked Bars):
   - Compares weekly incoming workload across 5 Outlook categories:
     - Flagged Emails (Deep Rust `#7A2904`)
     - Calendar Invites (Rich Terracotta `#A53C08`)
     - Microsoft To Do Tasks (Vivid Signal Orange `#F05500`)
     - VIP & Executive Threads (Warm Tangerine `#F7803A`)
     - @Mentions & Shared Attachments (Warm Peach `#FCA772`)
   - Time frames: `THIS WEEK`, `LAST WEEK`, `PRIOR (W39)`.
2. **Daily Outlook Inbox & Task Triage Balance** (Vertical Bi-Directional Columns):
   - Monitors daily velocity across Monday–Friday:
     - Positive bars: Cleared/resolved emails and completed tasks (Vivid Signal Orange `#F05500`).
     - Negative bars: New unread backlog and pending flagged threads (Contrast Charcoal `#33373B`).
   - Clean typographic legends (Zero dots, zero emojis).

---

### 5.4 Screen 4: Pending Tasks Tab
Dedicated screen for processing incoming Outlook items.

- **Header Controls**:
  - Title: `PENDING TASKS` (`18 TOTAL ITEMS`).
  - Minimal search field: Flat rectangle, zero border, zero outline.
  - Filter pills (sharp flat buttons): `ALL (18)`, `FLAGGED EMAIL (11)`, `TO DO (7)`, `OVERDUE (3)`.
- **Task List View**:
  - Stack of sharp cards with comfortable vertical spacing (gap: `8px`).
  - Quick action toolbar on hover or selection:
    - `ALIGN TO GOAL` (opens project selection dropdown).
    - `MARK COMPLETE` (pushes completion to Outlook).
    - `POSTPONE 24H` (adjusts due date).

---

### 5.5 Screen 5: Aligned Tasks Tab
Dedicated screen for tasks mapped to active strategic initiatives.

- **Header Controls**:
  - Title: `ALIGNED TASKS` (`42 ACTIVE MILESTONES`).
  - View Toggle: `BY PROJECT` / `BY PRIORITY TIER` / `CHRONOLOGICAL`.
- **Project Accordions / Blocks**:
  - Flat header row: Project Name (e.g., `Q4 ENTERPRISE EXPANSION`) + Task Count (`8`).
  - Clean card list grouped under each project header.
  - Each card shows: Task Title, Milestone Name, Scheduled Due Date (Inter font).

---

### 5.6 Screen 6: Settings Tab
Full control center for synchronization, theme, and user preferences.

- **Section 1: Microsoft Account Sync**:
  - Current Connected ID: `muhammad.ammar@mgapparel.com`.
  - Microsoft Graph Tenant: `MG Apparel Enterprise Tenant (Azure AD)`.
  - Status: Plain text label `AUTHENTICATED & ACTIVE` (NO green dot).
  - Sync Frequency Selector: Dropdown (`Real-Time Webhook`, `5 Minutes`, `15 Minutes`, `Manual`).
  - Actions: Flat buttons for `SYNC NOW` and `DISCONNECT ACCOUNT`.
- **Section 2: Appearance & Theme**:
  - Mode selector: `LIGHT MODE` (`#FFFFFF`), `DARK MODE` (`#05080A`), `PEACH TINT` (`#FFF3EB`).
  - **Custom Color Palette Input**:
    - Hex field for `Primary Accent Color` (`#A53C08` Terracotta).
    - Hex field for `Secondary Accent Color` (`#F05500` Vivid Orange).
    - Hex field for `Base Contrast Accent` (`#7A2904` Deep Rust).
- **Section 3: Content & Privacy Restraints**:
  - Toggle: `Mask Subject Lines on Dashboard` (replaces email subject lines with anonymous partner codes).
  - Toggle: `Sync Microsoft Teams @Mentions to Pending Triage`.
  - Toggle: `Auto-generate Pre-Meeting Dossiers (15 min prior)`.
  - Toggle: `Enforce 10-Minute Buffer Time Protection`.
  - Toggle: `AI Action Extraction & Executive Thread Summarization`.

---

### 5.7 Screen 7: Calendar & Focus Scheduling Tab
Dedicated time-blocking and focus protection center:
- **KPI Metrics**: Dedicated Focus Hours (`4.5h`), Meeting Load (`3.5h`), Execution Health Ratio (`56%`), Buffer Integrity (`100%`).
- **Today's Outlook Calendar Meetings**: Chronological list of meetings with organizer, attendees count, and one-click `VIEW PRE-MEETING DOSSIER` trigger.
- **Confirmed Focus Holds**: Auto-blocked deep-work sessions (45m/75m/90m) protected against back-to-back meeting fatigue.
- **Actions**: `+ BLOCK FOCUS SLOT`, `AUTO-INSERT 10M BUFFERS`.

---

### 5.8 Screen 8: Executive Briefing & Daily Digests Tab
Executive synthesis and communication oversight:
- **08:30 Morning Briefing**: Non-negotiable priorities, first calendar engagement, protected focus time summary, and VIP alerts.
- **17:30 End-of-Day Clearance Digest**: Inbox clearance velocity, carryover items, delegation tracking, and tomorrow's forecast.
- **VIP Counterparty Watchlist**: Management interface for high-priority senders (`board@mgapparel.com`, `procurement@mgapparel.com`, etc.) routing mail to top of queue.
- **Task Delegation Gateway**: Live tracking ledger of tasks assigned to direct reports with automated Outlook nudging.

---

### 5.9 Slide-Out Inspection Sheet & AI Triage Drawer
Edge-flush 480px drawer appearing from the right viewport:
- **AI Executive Thread Summary**: Concise 2–3 bullet point executive summary of complex email chains.
- **Extracted Action Deliverables**: Checkbox deliverables parsed directly from email body.
- **One-Click Canned Responses**: Graph SendMail triggers (`ACKNOWLEDGE`, `APPROVE`, `DEFER`) without opening Outlook.
- **Fast-Actions**: `BLOCK 45M FOCUS SLOT`, `DELEGATE TASK`, `MARK COMPLETE`.

---

## 6. Strict Minimal Card Anatomy Specification

```
+-------------------------------------------------------------------------------+
| [NO BORDERS]   [NO ROUNDED CORNERS]   [NO COLORED DOTS]   [NO EMOJIS]         |
| Background: var(--bg-card)              Padding: 16px 20px                    |
|                                                                               |
| Re: Architecture Review & Milestone Planning                  OCT 14, 2026   |
| (14px SF Pro Text, Weight 500, var(--text-primary))           (12px Inter)    |
|                                                                               |
| FLAGGED EMAIL // CLIENT SUCCESS                               PENDING         |
| (11px SF Pro Text, Uppercase, var(--text-muted))              (11px SF Pro)   |
+-------------------------------------------------------------------------------+
```

### 6.1 Card Rule Checklist
- [x] **Zero Rounded Corners**: `border-radius: 0 !important;`
- [x] **Zero Borders**: `border: none !important;`
- [x] **Zero Status Dots**: Text label `PENDING` instead of a colored dot or pill badge.
- [x] **Zero Emojis**: Clean textual source tag `FLAGGED EMAIL` instead of `✉️` or `🚩`.
- [x] **Max 3-4 Elements**:
  1. Task / Thread Title.
  2. Source / Context Category.
  3. Due Date / Timestamp (Inter tabular).
  4. Typographic Status Label (Monochrome).

---

## 7. Production CSS Foundation

```css
/* Universal Base Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border-radius: 0 !important; /* Universal sharp edges */
  outline: none !important;     /* Zero outlines */
}

html, body {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: var(--bg-canvas);
  color: var(--text-primary);
  font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Inter Tabular Figures for Numbers & Dates */
.metric-num, .date-num, .stat-value, .timestamp {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, monospace, sans-serif !important;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

/* Edge-Flush Fixed Left Sidebar */
.app-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 260px;
  height: 100vh;
  background-color: var(--bg-sidebar);
  border: none !important;
  box-shadow: none !important;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px 18px;
  z-index: 100;
}

/* Main Content Area */
.app-content {
  margin-left: 260px;
  width: calc(100% - 260px);
  height: 100vh;
  overflow-y: auto;
  background-color: var(--bg-canvas);
  padding: 44px 56px;
  border: none !important;
}

/* Minimal Flat Card */
.minimal-card {
  background-color: var(--bg-card);
  border: none !important;
  box-shadow: none !important;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: background-color 0.15s ease;
  cursor: pointer;
}

.minimal-card:hover {
  background-color: var(--bg-card-hover);
}

/* Flat Buttons (No Border, Zero Radius, Zero Outline) */
.btn-flat {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  background-color: var(--color-accent-primary);
  color: var(--color-accent-contrast);
  transition: background-color 0.15s ease;
}

.btn-flat:hover {
  background-color: var(--color-accent-hover);
}
```
