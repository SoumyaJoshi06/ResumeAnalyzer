# Frontend UI Design & Flow
> AI Resume Intelligence Platform — React + Vite + TailwindCSS

---

## Design Philosophy

- **Minimal** — only show what matters at each step, no information overload
- **Progressive** — info revealed step by step, not all at once
- **Dark/Neutral theme** — professional, modern feel (dark sidebar, white content area)
- **One clear action per screen** — user always knows what to do next

---

## Tech Stack

| Library | Purpose |
|---|---|
| React + Vite | Framework + fast dev server |
| TailwindCSS | Utility-first styling |
| Axios | HTTP calls to backend |
| react-circular-progressbar | ATS score circle |
| react-syntax-highlighter | LaTeX code diff (future) |
| React Context | Share analysis result across all tabs |

---

## Screens Overview

```
Screen 1 → LANDING          (Upload resume)
Screen 2 → LOADING          (AI is working...)
Screen 3 → DASHBOARD        (All results — tab-based)
              Tab A → Score
              Tab B → Skills & Gap
              Tab C → Matched Roles
              Tab D → Improvements
```

---

## Screen 1 — Landing Page

**Goal:** Get user to upload their PDF. Nothing else.

```
┌─────────────────────────────────────────────────┐
│                                                  │
│                  ResumeIQ                        │
│                                                  │
│   Understand your resume. Know your gaps.        │
│   Get hired.                                     │
│                                                  │
│  ┌─────────────────────────────────────────┐    │
│  │                                          │    │
│  │   📄  Drag & drop your resume PDF        │    │
│  │       or click to browse                 │    │
│  │                                          │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
│         [ Analyse My Resume → ]                  │
│                                                  │
│    Supports PDF · Max 10MB                       │
│                                                  │
└─────────────────────────────────────────────────┘
```

**UI Details:**
- Clean centered layout, full-height screen
- Drag-drop zone with dashed border — turns solid green on hover/file-drop
- File name shown after selection: `📄 Soumya_Resume.pdf ✓`
- Button disabled until file is selected
- Subtle background: dark gradient or soft pattern
- No navbar, no links — just the upload. Keep focus.

**API Called:** None yet

---

## Screen 2 — Loading / Processing Screen

**Goal:** Keep user engaged while 3 AI calls happen (can take 5–10 seconds).

```
┌─────────────────────────────────────────────────┐
│                                                  │
│            Analysing your resume...              │
│                                                  │
│   ✅  Reading your PDF                           │
│   ✅  Extracting your profile                    │
│   ⏳  Scoring your resume      ← animated        │
│   ○   Finding skill gaps                         │
│   ○   Matching roles                             │
│                                                  │
│         [  spinning loader  ]                    │
│                                                  │
│   This takes about 10–15 seconds                 │
│                                                  │
└─────────────────────────────────────────────────┘
```

**UI Details:**
- Steps tick off one by one (fake animation, real call is one API)
- Step icons: ✅ done → ⏳ in progress (spinning) → ○ pending
- Subtle pulsing animation on the loader
- DO NOT show a plain spinner — the step-by-step list makes it feel alive and professional
- This is what impresses people during a demo

**API Called:** `POST /api/resume/analyse` (multipart file upload)
- On success → navigate to Dashboard with response data
- On error → show error message + "Try Again" button

---

## Screen 3 — Dashboard

**Goal:** Show all results in a clean tabbed layout. User navigates at their own pace.

### Layout Structure

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER:  📄 Soumya_Resume.pdf    Score: 74/100   [New ↑]    │
├──────────────────────────────────────────────────────────────┤
│  TABS:  [Score]  [Skills & Gap]  [Roles]  [Improvements]     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                    TAB CONTENT                               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

- Header always visible — shows file name, total score, and a "New Analysis" button
- Tabs switch content without page reload
- Active tab has underline highlight

---

### Tab A — Score

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   ┌───────────────┐    Strengths                        │
│   │               │    ✅ Strong Java and Spring skills  │
│   │     74        │    ✅ Good project descriptions      │
│   │    /100       │    ✅ Clean formatting               │
│   │               │                                     │
│   └───────────────┘    Issues to Fix                    │
│   (circular progress)  ⚠ No quantified impact           │
│                        ⚠ Missing keywords for ATS       │
│                        ⚠ Role target unclear            │
│                                                         │
│  ───────────────────────────────────────────────────    │
│                                                         │
│  ATS Keywords         ███████████████░░░░░  15/20       │
│  Skills Relevance     ████████████████████  20/25       │
│  Projects             ████████████░░░░░░░░  12/20       │
│  Impact / Numbers     ████████░░░░░░░░░░░░   8/15       │
│  Role Alignment       ██████████████░░░░░░  11/15       │
│  Clarity              █████  5/5                        │
│                                                         │
└──────────────────────────────────────────────────────────┘
```

**UI Details:**
- Circular progress (ring style) — colour changes: red (0–50), orange (51–70), green (71–100)
- Section bars: horizontal progress bars with score + maxScore label
- Strengths = green check icons, Issues = orange warning icons
- Clean 2-column layout: score ring on left, strengths/issues on right

**API used:** data from `POST /api/resume/analyse` response → `scoreCard`

---

### Tab B — Skills & Gap

```
┌──────────────────────────────────────────────────────────┐
│  Your Skills                                             │
│                                                          │
│  [Java] [Spring Boot] [REST API] [SQL] [React]          │
│  [Git] [HTML] [CSS] [Python]                            │
│                                                          │
│  ──────────────────────────────────────────────────      │
│                                                          │
│  Select a role to see your skill gap:                    │
│                                                          │
│  [ Java Backend Developer ▼ ]                            │
│                                                          │
│  ✅ Strong         ⚠ Partial          ❌ Missing         │
│  ──────────        ─────────          ─────────          │
│  Java              Docker             AWS                │
│  Spring Boot                          CI/CD              │
│  REST API                             Kafka              │
│  SQL                                                     │
│                                                          │
│  Priority Learning                                       │
│  ┌────────────────────────────────────────────────┐     │
│  │ 1. AWS — Critical for cloud deployments        │     │
│  │    → Free resource: AWS Skill Builder           │     │
│  │ 2. CI/CD — Expected in most backend roles      │     │
│  │    → Free resource: GitHub Actions Docs         │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**UI Details:**
- Skill chips at top — just showing all extracted skills as pill tags
- Role dropdown — pre-populated with matched roles from `matchedRoles`
- When user **changes the dropdown**, it calls the skill gap API for that role
- 3-column layout: Strong (green) | Partial (orange) | Missing (red)
- Priority learning cards below — numbered, with resource link

**API called on role change:** `POST /api/analyse/{sessionId}/gap`
- Body: `{ "role": "selected role" }`
- Default role = top matched role (auto-loaded on tab open)

---

### Tab C — Matched Roles

```
┌──────────────────────────────────────────────────────────┐
│  Roles you're eligible for                               │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Java Backend Developer          ████████████ 88%│   │
│  │  Matched: Java, Spring Boot, SQL                 │   │
│  │  Missing: Docker, AWS                            │   │
│  │                        [ See Skill Gap → ]       │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Software Engineer               ██████████░  82%│   │
│  │  Matched: Java, OOP, Git                         │   │
│  │  Missing: System Design                          │   │
│  │                        [ See Skill Gap → ]       │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Full Stack Developer            ████████░░░  73%│   │
│  │  ...                                             │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**UI Details:**
- Role cards — one per matched role, sorted highest to lowest %
- Match % shown as a horizontal bar inside the card + number
- Bar colour: green (80+), orange (60–79), red (<60)
- Matched skills shown as small green chips, missing as red chips (top 3 only, to keep it clean)
- "See Skill Gap →" button — switches to Tab B and pre-selects that role

**API used:** data already in `POST /api/resume/analyse` response → `matchedRoles`
- No new API call needed for this tab

---

### Tab D — Improvements

```
┌──────────────────────────────────────────────────────────┐
│  How to make your resume stronger                        │
│  AI found 5 areas to improve                            │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Suggestion 1                                    │   │
│  │                                                  │   │
│  │  Before:                                         │   │
│  │  "Developed an e-commerce application"           │   │
│  │                                                  │   │
│  │  After:                                          │   │
│  │  "Built a Spring Boot REST API for order         │   │
│  │   processing, handling 500+ requests/sec         │   │
│  │   with MySQL and JWT authentication"             │   │
│  │                                                  │   │
│  │  Why: Adds technology, scale, and specificity    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Suggestion 2  ...                               │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**UI Details:**
- One card per suggestion
- "Before" text: red/pink tinted background, strikethrough style
- "After" text: green tinted background, bold
- "Why" text: small grey italic note below
- Cards are collapsible — click to expand if there are 5+ suggestions
- Copy button on "After" text (copies improved bullet to clipboard)

**API used:** data already in `POST /api/resume/analyse` response → `improvements`
- No new API call needed

---

## Complete User Flow with API Calls

```
User opens app
    │
    ▼
[Screen 1: Landing]
    │  User selects PDF → clicks "Analyse"
    │
    ▼
[Screen 2: Loading]
    │  API: POST /api/resume/analyse  ← ONE call, all data returned
    │  (multipart file upload)
    │  Response: { sessionId, profile, scoreCard, improvements, matchedRoles }
    │  Stored in React Context globally
    │
    ▼
[Screen 3: Dashboard — Tab A: Score]
    │  No API call — data from Context
    │
    ├── User clicks Tab B (Skills & Gap)
    │      Auto-calls gap for top matched role:
    │      API: POST /api/analyse/{sessionId}/gap → { "role": "top role" }
    │      User can change role → same API called again
    │
    ├── User clicks Tab C (Roles)
    │      No API call — data from Context (matchedRoles)
    │      User clicks "See Skill Gap" → switches to Tab B for that role
    │
    ├── User clicks Tab D (Improvements)
    │      No API call — data from Context (improvements)
    │
    └── User clicks "New Analysis" in header
           → back to Screen 1, Context cleared
```

**Summary: Only 2 API calls total**
1. `POST /api/resume/analyse` — once, on upload
2. `POST /api/analyse/{sessionId}/gap` — each time user picks a role in Tab B

---

## Component Breakdown

```
src/
├── api/
│   └── resumeApi.js          axios calls — uploadAndAnalyse(), getSkillGap()
│
├── context/
│   └── AnalysisContext.jsx   global state — sessionId, profile, scoreCard,
│                              improvements, matchedRoles
│
├── pages/
│   ├── Landing.jsx            Screen 1
│   ├── Loading.jsx            Screen 2
│   └── Dashboard.jsx          Screen 3 — tab container
│
├── components/
│   ├── UploadZone.jsx         drag-drop file input
│   ├── StepProgress.jsx       animated steps on loading screen
│   ├── ScoreTab.jsx           circular progress + section bars + strengths/issues
│   ├── SkillsTab.jsx          skill chips + role dropdown + gap columns + roadmap
│   ├── RolesTab.jsx           role cards with match % bars
│   └── ImprovementsTab.jsx    before/after suggestion cards
│
└── App.jsx                    routing: Landing → Loading → Dashboard
```

---

## Colour System (TailwindCSS)

| Meaning | Colour | Tailwind Class |
|---|---|---|
| Strong / Good | Green | `bg-green-100 text-green-700` |
| Partial / Warning | Orange | `bg-orange-100 text-orange-700` |
| Missing / Bad | Red | `bg-red-100 text-red-700` |
| Score 71–100 | Green ring | `text-green-500` |
| Score 51–70 | Orange ring | `text-orange-500` |
| Score 0–50 | Red ring | `text-red-500` |
| Background | Slate/Gray | `bg-slate-50` |
| Cards | White | `bg-white shadow-sm rounded-xl` |
| Tab active | Indigo underline | `border-b-2 border-indigo-600` |

---

## What Makes This UI Stand Out

| Ordinary tool | Our UI |
|---|---|
| Single page with big blob of text | Tabbed dashboard — clean sections |
| Just a score number | Score ring + section bars + evidence |
| Skill list | 3-column gap: Strong / Partial / Missing |
| Generic suggestions | Before/after card with specific reason |
| Static page | Role dropdown triggers live API call for gap |
| Plain spinner | Step-by-step progress on loading screen |
