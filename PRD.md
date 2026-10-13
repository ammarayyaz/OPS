# Product Requirements Document (PRD)
## Outlook Sync Dashboard & Productivity Suite

---

### Document Information
- **Product Name**: Outlook Productivity Suite (OPS)
- **Document Version**: 1.0.0
- **Status**: Draft / Ready for Review
- **Owner**: Product & Design Engineering
- **Target Platform**: Modern Desktop & Responsive Web (Chromium, Safari, Firefox, Edge)

---

## 1. Executive Summary & Vision

### 1.1 Objective
Outlook Productivity Suite is a hyper-focused, minimal executive dashboard that establishes a bidirectional bridge with Microsoft Outlook (via Microsoft Graph API). It synchronizes a user's corporate or personal Microsoft account to surface **Pending Tasks**, **Aligned Tasks**, calendar commitments, and flagged communication in real time—without the bloated clutter, cognitive fatigue, and visual noise of standard corporate productivity clients.

### 1.2 Core Product Principles
1. **Ultra-Minimalism**: No fluff, no superfluous widgets, and no excessive information density. Only essential metrics and actionable items are visible.
2. **Strict Restraint**:
   - **Zero Emojis**: Clean textual hierarchy and monochrome SVG iconography only.
   - **Zero Visual Dots**: No pulsing green status indicators, colored presence pills, or live badges on cards.
   - **Card Content Diet**: Maximum 3 data points per card (Action Title, Context/Origin, Due Date or Numerical Priority).
   - **Subtly Rounded Precision Geometry**: Very slight, refined border radii (2px–6px) across cards, controls, badges, and modals, eliminating harsh 90-degree corners while maintaining crisp architectural sophistication.
   - **Zero Decorative Borders**: Structural separation achieved purely through surface tone, contrasting backgrounds, and whitespace—no divider lines or borders.
3. **Multi-Tab Architecture**: Dedicated views for distinct workflows (Dashboard Overview, Pending Tasks, Aligned Tasks, Schedule/Sync, and Settings) rather than cramming everything into a single crowded page.
4. **Theme Adaptability & Palette**: Native support for Pure White Light Mode (`#FFFFFF`) and True Black Dark Mode (`#05080A`), styled with the selected **Dashboard Sample Orange** palette (Deep Rust `#7A2904`, Rich Terracotta `#A53C08`, Vivid Orange `#F05500`, Tangerine `#F7803A`, Peach `#FCA772`, Charcoal Contrast `#33373B`).

---

## 2. User Personas & Core Problem Statement

### 2.1 Target User Personas
- **The Executive Lead (Muhammad Ammar // MG Apparel)**: Oversees textile manufacturing, supply chain contracts, international exports, and executive leadership committees in Outlook; requires an ultra-clean executive command center to triage pending escalations, monitor active alignments, protect focus blocks, and receive automated morning and end-of-day digests.
- **The Operations / Commercial Director**: Juggles multi-stakeholder buyer threads and vendor agreements; needs tasks and action deliverables automatically extracted from flagged Outlook threads and Teams @mentions without duplicate manual entry.
- **The Minimalist Executive**: Overwhelmed by default Outlook UI complexity (sidebars, taskbars, status icons, presence dots, notification banners); demands a distraction-free, architectural command center.

### 2.2 Key Pain Points Solved
- **Context Fragmentation**: Having tasks scattered across Outlook Calendar invites, flagged emails, Microsoft To Do lists, and Teams chats.
- **Visual Clutter & Cognitive Overload**: Default Outlook is dense with ribbon menus, status dots, unread badges, and complex toolbars.
- **Lack of Strategic Alignment**: Inability to categorize incoming tasks into "Pending" (needs triage/resolution) vs "Aligned" (mapped to active milestones and core objectives).
- **Meeting Burnout & Focus Erosion**: Back-to-back Outlook calendar bookings leaving zero protected execution time for strategic deep work.

---

## 3. High-Level System Architecture & Microsoft Outlook Sync

```
+-------------------------------------------------------------------------+
|                        Frontend Web Application                         |
|  +--------------------+  +--------------------------------------------+ |
|  |  Fixed Left Nav    |  |  Active Tab Views                          | |
|  |  - Dashboard       |  |  - Dashboard Overview                      | |
|  |  - Pending Tasks   |  |  - Pending Triage Queue                    | |
|  |  - Aligned Tasks   |  |  - Strategic Commitments                   | |
|  |  - Calendar & Focus|  |  - Calendar Sync & Time-Blocking           | |
|  |  - Briefing/Digests|  |  - Morning/EOD Digests & Delegations      | |
|  |  - Settings        |  |  - Theme, M365 Sync & Identity Controls    | |
|  +--------------------+  +--------------------------------------------+ |
+------------------------------------+------------------------------------+
                                     |
                                     | HTTPS / REST & WebSocket
                                     v
+-------------------------------------------------------------------------+
|                  Application Backend / Sync Engine                      |
|  +---------------------+  +---------------------+  +------------------+ |
|  | OAuth 2.0 Auth Hub  |  | Delta Sync Worker   |  | Task Alignment   | |
|  | (MSAL PKCE Flow)    |  | (Graph Webhooks)    |  | Classifier Engine| |
|  +---------------------+  +---------------------+  +------------------+ |
+------------------------------------+------------------------------------+
                                     |
                                     | Microsoft Graph API (v1.0)
                                     v
+-------------------------------------------------------------------------+
|                    Microsoft Cloud Ecosystem                            |
|  - Microsoft Entra ID (Work / School / Personal Microsoft Accounts)     |
|  - Outlook Mail (Flagged Items, High-Priority Messages)                 |
|  - Microsoft To Do / Planner (Pending & Completed Task Lists)           |
|  - Outlook Calendar (Meetings & Focused Time Blocks)                    |
+-------------------------------------------------------------------------+
```

### 3.1 Microsoft Graph API Scopes
The platform requests minimal, least-privilege delegated OAuth 2.0 permissions:
- `User.Read`: Display signed-in user name and email.
- `Tasks.ReadWrite`: Bidirectional sync with Microsoft To Do and Outlook Tasks.
- `Mail.Read`: Access flagged and priority messages for pending action conversion.
- `Calendars.Read`: Read scheduled events to evaluate task alignment windows.
- `offline_access`: Refresh token management for uninterrupted background synchronization.

### 3.2 Sync Lifecycle
- **Initial Sync**: Upon first Microsoft login, pulls active To Do tasks, flagged emails from the last 30 days, and calendar events for the active week.
- **Delta Sync**: Utilizes Graph API Delta Query (`/me/todo/lists/{id}/tasks/delta`) and webhook subscriptions to receive delta changes efficiently.
- **Local Cache**: IndexedDB / secure storage caching ensures instant rendering on load without blocking network spinners.
- **Bidirectional Updates**: Marking a pending or aligned task as complete immediately updates Microsoft To Do and unflags the corresponding email in Outlook.

---

## 4. Multi-Tab Architecture & Core Modules

The application is structured into five distinct top-level functional modules accessible via a permanent, edge-flush left navigation bar.

| Module | Purpose | Key Actions |
| :--- | :--- | :--- |
| **00. Authentication** | Secure entry via Microsoft SSO / OAuth 2.0 | Sign In with Microsoft, Tenant Select, Remember Session |
| **01. Dashboard** | Executive summary & high-priority queue | Quick overview metrics, immediate pending items, alignment ratio |
| **02. Pending Tasks** | Unprocessed inbox & unaligned action items | Triage, mark done, align to objective, set due date |
| **03. Aligned Tasks** | Strategic initiatives & goal-mapped tasks | Milestone filtering, effort tracking, scheduled execution |
| **04. Settings** | Account sync, theme toggle, custom preferences | Account connection status, sync interval, theme selector |

---

## 5. Detailed Feature Specifications

### 5.1 Module 0: Authentication (Login Page)
- **Layout**: Centered architectural card on pure canvas (`#FFFFFF` in light mode, `#05080A` in dark mode).
- **Branding**: Clean typographic wordmark with no decorative imagery.
- **Controls**:
  - `Sign In with Microsoft` primary button (zero radius, flat fill, zero border, zero outline).
  - Account type selector: Corporate / Work / School account (`organizations`) vs Personal Microsoft Account (`consumers`).
  - Session persistence toggle ("Stay signed in for 30 days").
  - Security disclaimer: Clear notice highlighting read/write sync permissions and end-to-end token encryption.
- **State Handling**:
  - Unauthenticated users attempting to access dashboard tabs are immediately redirected to `/login`.
  - Seamless redirection back to intended tab upon successful callback.

### 5.2 Module 1: Executive Dashboard Tab
- **Header**: User welcome, current date, sync timestamp (e.g., `LAST SYNCED 13:42:05`).
- **Metrics Strip**:
  - 4 flat stat blocks using Inter tabular figures:
    1. `PENDING`: Count of open items awaiting review.
    2. `ALIGNED`: Count of tasks linked to active strategic objectives.
    3. `DUE TODAY`: Tasks with deadline equal to current date.
    4. `SYNC RATE`: Sync health percentage or items processed in the last 24h.
  - Zero decorative borders; structured purely through contrasting surface tiles.
- **Immediate Action Queue**:
  - Top 5 urgent pending tasks displayed as minimal cards.
  - Quick action: Single-click resolution or alignment promotion.
- **Outlook Analytics Visualizations (Dashboard Sample Orange Palette)**:
  - **Outlook Incoming Volume & Category Split**: Horizontal stacked progress bars tracking weekly Outlook inbound distribution across 5 core categories (Flagged Emails 35%, Calendar Invites 22%, Microsoft To Do 18%, VIP Threads 15%, @Mentions 10%).
  - **Daily Outlook Inbox & Task Triage Balance**: Vertical column chart visualizing cleared/resolved actions (Vivid Orange positive bars) versus incoming unread/pending backlog (Charcoal negative bars) across Monday–Friday.
- **Strategic Progress Overview**:
  - Linear tabular overview of aligned tasks categorized by primary Outlook categories (`OUTLOOK: EXECUTIVE & CLIENT CORRESPONDENCE`, `MICROSOFT TO DO: STRATEGIC COMMITMENTS`, `OUTLOOK CALENDAR: MEETING PREPARATION`).

### 5.3 Module 2: Pending Tasks Tab
- **Definition**: Represents all incoming action items derived from Microsoft To Do, flagged Outlook emails, and direct user inputs that have not yet been linked to a strategic milestone.
- **Filtering & Search**:
  - Minimal search bar (zero outline, sharp rectangular field).
  - Source filter: `ALL`, `OUTLOOK MAIL`, `MICROSOFT TO DO`, `DIRECT`.
  - Date filter: `TODAY`, `THIS WEEK`, `OVERDUE`.
- **Card Specifications**:
  - **No colored dots** (no green, amber, or red status circles).
  - **No emojis** (no checkmark emojis, fire icons, or clock symbols).
  - Content capped strictly at 3 items:
    1. Task Title (SF Pro Text, medium weight).
    2. Context / Source (e.g., `Re: Quarterly Review - Flagged Email` or `To Do: Default List`).
    3. Due Date / Relative Time (Inter font, tabular numbers).
- **Actions**:
  - `Align`: Moves task to the Aligned Tasks module with milestone assignment.
  - `Complete`: Marks as complete locally and pushes update to Outlook API.
  - `Defer`: Reschedules due date by 24h or 7 days.

### 5.4 Module 3: Aligned Tasks Tab
- **Definition**: Dedicated workspace for tasks that have been mapped to specific business goals, projects, or recurring focus blocks.
- **Alignment Grouping**:
  - View by Project / Strategic Objective.
  - View by Priority Tier (Tier 1: Critical Impact, Tier 2: Core Delivery, Tier 3: Support).
- **Metrics Bar**:
  - Total Aligned Tasks.
  - Completion Rate for current sprint/month (Inter tabular numerals).
- **Card Layout**:
  - Same minimal card discipline: Zero dots, zero borders, zero emojis.
  - Displays: Task Name, Associated Project Name, Scheduled Execution Slot.

### 5.5 Module 4: Settings Tab
- **Microsoft Account Integration**:
  - Connected Account ID / Email address.
  - Connection status badge (text only: `CONNECTED` or `DISCONNECTED`—no colored dots).
  - `Disconnect Account` / `Re-authenticate` button.
  - Sync Interval selector (`Real-time via Webhook`, `Every 5 Minutes`, `Every 15 Minutes`, `Manual Only`).
  - `Sync Now` manual trigger button.
- **Appearance & Theme Configuration**:
  - Theme mode toggle: `Light Mode` (`#FFFFFF`), `Dark Mode` (`#05080A`), or `System Default`.
  - Custom Accent Color Slot: Ready for user-defined primary and secondary hex values.
- **Data & Cache Management**:
  - Local cache size indicator.
  - `Clear Local Cache & Force Full Resync` button.
  - Privacy toggle: Mask email subjects on dashboard overview.

---

## 6. Strict Aesthetic & Component Directives

| Rule | Requirement | Forbidden |
| :--- | :--- | :--- |
| **Geometry** | `border-radius: 0 !important;` universal sharp corners | Any rounded corners (`4px`, `8px`, `9999px`) |
| **Typography** | Century Gothic (`"Century Gothic", "CenturyGothic", AppleGothic, sans-serif`) | System default serif fonts, browser default sans-serifs |
| **Borders & Dividers** | Zero outlines, zero horizontal `<hr>`, zero divider borders | Table cell borders, card outline strokes, navbar divider lines |
| **Glow & Shadow** | Flat surfaces or subtle flat drop shadows only | Box-shadow neon glow, glowing text, pulse animations |
| **Icons & Emojis** | Monochrome SVG icons or text only | Any unicode emojis (`📅`, `✅`, `🔥`, `⚡`, `🟢`, etc.) |
| **Status Indicators** | Clean uppercase typographic status text (e.g., `PENDING`, `SYNCED`) | Live green dots, blinking indicators, colored badge pills |
| **Sidebar Layout (Desktop)** | Left-fixed, edge-flush (0 top, 0 left, 0 bottom, 100vh height) | Floating navbar, top navigation bar, margin gaps around navbar |
| **Mobile Navbar (<= 860px)** | Edge-flush mobile top bar + thumb-friendly mobile bottom tab bar + slide drawer | Squished sidebar, non-responsive side navigation on mobile |

---

## 7. Non-Functional & Security Requirements

### 7.1 Security & Compliance
- **Token Storage**: Microsoft OAuth tokens stored securely; refresh tokens kept in HttpOnly encrypted cookies or secure backend sessions.
- **Zero Third-Party Tracking**: No external analytics or tracking scripts that process user email metadata.
- **Least-Privilege API Access**: Only request necessary Microsoft Graph scopes; no mailbox deletion or admin scopes.

### 7.2 Performance & Responsiveness
- **Initial Load Time**: Under 800ms for cached views.
- **Sync Latency**: Under 2.0s for incremental delta updates.
- **Offline Resilience**: Local IndexedDB cache allows full task viewing and local queue updates while offline, syncing on reconnect.

---

## 8. Implementation Phases & Roadmap

```
Phase 1: Architecture & UI Scaffolding (Current)
├── PRD & Design Specification Approval
├── Clean Typography & Token Engine Setup
└── Multi-Tab Navigation & Surface Layouts

Phase 2: Authentication & Mock State Integration
├── Microsoft Login Page & Session Handling
├── Multi-Tab State Management (Dashboard, Pending, Aligned, Settings)
├── Minimalist Card System & Zero-Dot Engine
└── Light / Dark Mode Toggle

Phase 3: Microsoft Graph Live Integration
├── Microsoft Entra App Registration & OAuth 2.0 Flow
├── Tasks & Flagged Email Sync Engine
└── Real-time Webhooks & Delta Polling

Phase 4: Refinement & Custom Color Injection
├── Custom Palette Application (incorporating User's exact color choices)
└── Performance Profiling & Cross-Browser Verification
```
