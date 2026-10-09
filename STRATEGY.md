# AI Resume Intelligence Platform — Strategy & Design
> Mini Project | 5th Sem | BCS554
> Team: Soumya Joshi · Tanishka Verma · Vanshika Gupta | Supervisor: Prof. Anshul Tickoo

---

## 1. What We're Building & Why It's Unique

Most students already know they can paste their resume into ChatGPT and ask for feedback.
**That is not a product.** We are building one.

### The Core Differentiation

| Capability | ChatGPT / basic tools | Our Platform |
|---|---|---|
| Resume feedback | Generic paragraph | Structured, scored, section-wise |
| ATS Score | No | Yes — with breakdown + evidence |
| Skill gap analysis | No | Yes — what you have vs what roles need |
| Role recommendation | Generic | Matched from a curated role catalogue |
| Role eligibility | No | Yes — which job titles/roles you qualify for, with % fit |
| Resume rewrite suggestions | Vague | Specific bullet-by-bullet improvements |
| LaTeX mode | No | Yes — improved `.tex` you can download |
| Cover letter | Manual copy-paste | One-click, tailored to a matched role |
| Interview prep | No | Yes — predicted Q&A based on your profile |
| Re-analyze after improving | No | Yes — see score change |

### One-Line Pitch
> *"We don't just tell you your resume is weak — we show you exactly why, what to fix, and re-score it after you improve it."*

---

## 2. Scope Decision: No Live Job API

**Live job scraping or third-party job APIs are OUT of MVP scope.**

Reasons:
- External APIs (Adzuna, JSearch) have rate limits, cost, and availability risk during demos
- Scraping major job sites violates their ToS
- It adds debugging complexity without adding core product value

**Instead:** We use a **curated internal job-description corpus** (50–100 JDs across common roles like Java Dev, Frontend Dev, Data Analyst, etc.) stored as JSON/text files in the backend. This is more reliable, demo-safe, and we own the matching logic — which is what actually matters.

**Future enhancement:** Plug in a live job API behind an abstraction interface. Architecture supports it already.

---

## 3. Resume Input: PDF Upload AND LaTeX Mode — Both Feasible

### PDF Upload Mode
- User uploads `.pdf` resume
- Backend uses **Apache PDFBox** to extract text
- Text goes into the AI pipeline
- ✅ Simple, works for everyone

### LaTeX / Overleaf Mode ← The WOW Feature
- User pastes their `.tex` source code (from Overleaf)
- Backend strips LaTeX commands, extracts readable content
- Same AI analysis pipeline runs
- AI also generates an **improved `.tex` file** — same template, better content
- Frontend shows side-by-side: original code | improved code
- User downloads the improved `.tex` and re-opens in Overleaf

**Why this is special:** No existing resume tool improves your actual LaTeX source code. Engineering students who use Overleaf will love this.

> **Both modes are supported in MVP.** PDF is the primary path; LaTeX mode is the differentiator.

---

## 4. Full User Flow

```
┌─────────────────────────────────────────────────────┐
│                    LANDING PAGE                      │
│      "Understand. Improve. Get Hired."               │
│                                                      │
│   [ Upload PDF Resume ]  [ Paste LaTeX / .tex ]      │
└──────────────┬──────────────────────┬───────────────┘
               │                      │
               ▼                      ▼
    ┌──────────────────┐   ┌────────────────────────┐
    │  PDF Upload       │   │   LaTeX Mode            │
    │  PDFBox extracts  │   │   Strip commands,       │
    │  plain text       │   │   extract content       │
    └────────┬─────────┘   └──────────┬─────────────┘
             │                        │
             └────────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   AI ANALYSIS ENGINE  │  ← Spring AI + OpenAI GPT-4o
              │                       │
              │  Step 1: Extract      │  → Structured candidate profile (JSON)
              │  Step 2: Score        │  → ATS score, section-wise breakdown
              │  Step 3: Skills       │  → Skill list + gap vs target roles
              │  Step 4: Improve      │  → Bullet-by-bullet suggestions
              │  Step 5: Roles        │  → Top matching roles from catalogue
              └───────────┬───────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │          CAREER DASHBOARD            │
        │                                      │
        │  [Score] [Skills] [Roles/Eligibility]   │
        │  [Improve] [Cover Letter] [Interview]│
        └──────┬──────┬──────┬────────────────┘
               │      │      │
        ┌──────┘      │      └──────────────────────┐
        │             │                             │
        ▼             ▼                             ▼
┌─────────────┐ ┌──────────────┐         ┌──────────────────┐
│  ATS SCORE  │ │ SKILL GAP    │         │  MATCHED JOBS     │
│             │ │              │         │  (from internal   │
│  Total: 74  │ │ ✅ Java       │         │   JD corpus)      │
│  ──────────  │ │ ✅ Spring    │         │                  │
│  ATS:  17/20│ │ ⚠️  Docker   │         │ [Java Dev — 88%] │
│  Skills:18/25│ │ ❌ AWS      │         │ [Backend — 82%]  │
│  Projects:15│ │ ❌ CI/CD    │         │ [Full Stack — 73%]│
│  Impact: 11 │ │              │         │                  │
│  Role: 13   │ │ Roadmap:     │         │ [Select a role]  │
└─────────────┘ │ AWS → course │         └────────┬─────────┘
                │ CI/CD → ..   │                  │
                └──────────────┘                  ▼
                                     ┌──────────────────────┐
                                     │  JD MATCH DETAIL      │
                                     │  "Java Dev @ 88%"    │
                                     │                      │
                                     │  Matched: Java, Spring│
                                     │  Missing: Docker, K8s │
                                     │  Why you fit: ...    │
                                     │                      │
                                     │ [Generate Cover Ltr] │
                                     │ [Interview Prep]     │
                                     └──────────────────────┘
                                               │
                              ┌────────────────┴──────────────┐
                              │                               │
                              ▼                               ▼
                   ┌──────────────────┐          ┌───────────────────┐
                   │  COVER LETTER    │          │  INTERVIEW PREP   │
                   │  Generated for   │          │                   │
                   │  this exact JD   │          │ Q1: Tell me about │
                   │  [Copy][Download]│          │     yourself...   │
                   └──────────────────┘          │ Q2: Explain your  │
                                                 │     Java project  │
                                                 │ Q3: What is REST? │
                                                 └───────────────────┘

─────────────── IMPROVE TAB ────────────────────────────────────────

PDF Mode:
  Current bullet: "Developed an app"
  Improved:       "Built REST API using Spring Boot handling 500 req/s"
  [Apply all suggestions] → rewrite full resume content
  [Re-analyze] → new score shown with before/after comparison

LaTeX Mode:
  LEFT panel: Original .tex code
  RIGHT panel: Improved .tex code (diff highlighted)
  [Download improved .tex]
  [Open in Overleaf]
```

---

## 5. System Architecture

```
┌──────────────────────────────────────────────────────┐
│                   REACT FRONTEND                      │
│   Vite + TailwindCSS + Axios + react-pdf             │
│   Landing | Dashboard | LaTeX Editor | Chat           │
└───────────────────────┬──────────────────────────────┘
                        │ REST (JSON)
                        ▼
┌──────────────────────────────────────────────────────┐
│                SPRING BOOT BACKEND                    │
│                                                       │
│  Controllers                                          │
│  ├── ResumeController      /api/resume/*             │
│  ├── AnalysisController    /api/analyse/*            │
│  ├── ImprovementController /api/improve/*            │
│  └── JobController         /api/jobs/*               │
│                                                       │
│  Services                                             │
│  ├── ResumeParseService    (PDFBox / LaTeX strip)    │
│  ├── AIAnalysisService     (Spring AI → GPT-4o)      │
│  ├── ScoringService        (structured ATS score)    │
│  ├── SkillGapService       (gap vs role catalogue)   │
│  ├── JobMatchingService    (resume vs JD corpus)     │
│  ├── ImprovementService    (suggestions + rewrite)   │
│  ├── LatexImproveService   (improved .tex output)    │
│  ├── CoverLetterService    (tailored cover letter)   │
│  └── InterviewPrepService  (Q&A from profile+role)   │
│                                                       │
│  Data (local files — no DB for MVP)                  │
│  ├── /resources/roles/     (role definitions JSON)   │
│  ├── /resources/jd-corpus/ (50–100 JD text files)   │
│  └── /resources/skills/    (skill taxonomy JSON)     │
└───────────────┬──────────────────────────────────────┘
                │
                ▼
        ┌───────────────┐
        │  OpenAI API   │
        │  GPT-4o / 4o-mini
        └───────────────┘
```

---

## 6. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Backend | Spring Boot 3.x | Robust, standard, team-familiar |
| AI | Spring AI + OpenAI GPT-4o | Abstracts LLM calls cleanly; GPT-4o is fast and reliable |
| LLM fallback | GPT-4o-mini | For cost control during development |
| PDF parsing | Apache PDFBox | Best Java PDF text extractor |
| LaTeX parsing | Custom regex + string processing | Strip `\command{}`, keep content |
| Frontend | React + Vite + TailwindCSS | Fast modern UI |
| HTTP client | Axios (frontend), WebClient (backend) | Standard |
| Job data | Internal JSON corpus | No external API dependency |
| State | Session-scoped in memory | No DB for MVP |
| Config | `application.yml` + env vars | Standard Spring |

**What "Matched Roles" means:** We show job titles/roles the candidate is *eligible to apply for* — like "Java Backend Developer — 88% fit" — based on comparing their skills against a curated role catalogue. There are NO real job listings, NO apply links. This is purely role-title eligibility based on skill overlap.

The user picks a role → sees the skill gap for that specific role → gets a cover letter and interview prep tailored to that role.

---

## 7. AI Pipeline (How Each OpenAI Call Works)

All calls return **structured JSON** using `response_format: json_object`. No free-form text in API responses — everything is typed and parsed.

```
Call 1 — PROFILE EXTRACTION
  Input : raw resume text
  Output: { name, email, skills[], experience[], education[], projects[], certifications[] }

Call 2 — ATS SCORING
  Input : raw resume text
  Output: { totalScore, sections: { atsKeywords, skills, projects, impact, roleAlignment }, 
            strengths[], criticalIssues[] }

Call 3 — SKILL GAP ANALYSIS
  Input : candidate skills[] + target role (from role catalogue)
  Output: { strong[], partial[], missing[], priorityLearning[{ skill, why, resource }] }

Call 4 — IMPROVEMENT SUGGESTIONS
  Input : resume text + weak bullets identified from scoring
  Output: { suggestions[{ original, improved, reason }], fullImprovedText }

Call 5 (LaTeX mode only) — LATEX IMPROVEMENT
  Input : original .tex code + suggestions from Call 4
  Output: improved .tex code (same template, better content inside \item tags)

Call 6 — COVER LETTER
  Input : candidate profile + selected JD text
  Output: full cover letter text

Call 7 — INTERVIEW PREP
  Input : candidate profile + target role
  Output: { questions[{ question, hint, category }] }
```

---

## 8. Job Description Corpus (Internal)

Instead of a live API, we maintain a static corpus of ~50–80 JDs across common roles:

```
/resources/jd-corpus/
├── backend-java-developer.json
├── frontend-react-developer.json
├── fullstack-developer.json
├── data-analyst.json
├── ml-engineer.json
├── devops-engineer.json
├── android-developer.json
└── ...
```

Each file:
```json
{
  "role": "Backend Java Developer",
  "requiredSkills": ["Java", "Spring Boot", "REST API", "SQL", "Git"],
  "preferredSkills": ["Docker", "AWS", "Kafka", "CI/CD"],
  "experienceLevel": "Fresher / 0-2 years",
  "description": "Full JD text here for LLM matching...",
  "keywords": ["microservices", "hibernate", "maven"]
}
```

Matching logic: Extract candidate skills → compute overlap score with each JD → rank → feed top matches to LLM for explanation.

---

## 9. Phase-wise Development Plan

### Phase 1 — Backend Core (Week 1)
**Goal:** Working API for resume analysis, no frontend needed yet

**What to build:**
- Spring Boot project setup with Spring AI, PDFBox, WebClient dependencies
- `ResumeParseService` — PDF text extraction
- `LatexParseService` — strip LaTeX commands, extract content
- OpenAI `ChatClient` config with structured JSON output
- `AIAnalysisService` — orchestrates all 4 core OpenAI calls
- `ScoringService` — parse + structure ATS score response
- `SkillGapService` — load role catalogue, compute gap, enrich with LLM
- `ImprovementService` — suggestions + full rewritten resume text
- REST controllers + DTOs for all endpoints
- JD corpus files (create ~20–30 JDs to start)
- `JobMatchingService` — skill overlap scoring against corpus

**Technical changes:**
- `pom.xml`: add `spring-ai-openai-spring-boot-starter`, `pdfbox`, `jackson`
- `application.yml`: OpenAI key, model config
- Domain model classes: `ResumeProfile`, `ATSScoreCard`, `SkillGapReport`, `JobMatch`
- Resources folder: role catalogue JSON, JD corpus JSON files

**Validation:** Test all endpoints via Postman with a sample resume PDF

---

### Phase 2 — AI Extras (Week 2)
**Goal:** Cover letter, interview prep, LaTeX mode fully working

**What to build:**
- `LatexImproveService` — take .tex input, return improved .tex
- `CoverLetterService` — generate tailored cover letter for a selected JD
- `InterviewPrepService` — generate Q&A from candidate profile + role
- Session-scoped caching of analysis results (so re-use parsed profile across calls)
- Input validation + error handling for all endpoints

**Technical changes:**
- Spring `@SessionScope` or simple `ConcurrentHashMap` cache keyed by sessionId
- New endpoints: `POST /api/improve/latex`, `POST /api/improve/cover-letter`, `POST /api/improve/interview-prep`
- Prompt engineering refinement based on Phase 1 testing output

**Validation:** Full end-to-end test for both PDF and LaTeX flows

---

### Phase 3 — React Frontend (Week 2–3)
**Goal:** Presentable, working UI for demo

**What to build:**
- Vite + React + TailwindCSS project setup
- Landing page with toggle: `Upload PDF` / `Paste LaTeX`
- File upload component (PDF drag-drop)
- LaTeX code textarea input
- Loading screen with progress steps (makes AI processing feel alive)
- **Dashboard tabs:**
  - Score tab: circular progress + section score bars
  - Skills tab: skill chips (green/orange/red), gap list, learning links
  - Roles tab: role/title cards showing which job roles the candidate is eligible for, ranked by match %
  - Jobs tab: for each matched role, show which skills match, which are missing, and why they fit
  - Improve tab: before/after bullet suggestions + re-analyze button
  - Cover Letter tab: generated text + copy/download
  - Interview tab: Q&A accordion
- LaTeX mode extra: side-by-side code viewer (original | improved) + download button

**Technical changes:**
- Axios service layer (`/src/api/resumeApi.js`) for all backend calls
- Global state: React Context or Zustand to pass analysis result across tabs
- `react-syntax-highlighter` for LaTeX code diff display
- `react-circular-progressbar` for score visualization

---

### Phase 4 — Polish & Demo Prep (Week 3–4)
**Goal:** Looks great, runs reliably, ready for college presentation

**What to build:**
- Loading skeletons for all panels
- Proper error messages (if OpenAI fails, file too large, etc.)
- Responsive layout (mobile-friendly basics)
- Sample demo resume (pre-prepared for live demo so it looks impressive)
- CORS config in Spring Boot
- Environment variable setup docs for team

**Technical changes:**
- `@CrossOrigin` or `WebMvcConfigurer` CORS setup
- `.env` file for React (API base URL)
- Production build script notes

---

## 10. Future Enhancements (Mention During Demo)

These are real product features — say "we've designed the architecture to support these" during presentation:

| Feature | What it adds |
|---|---|
| User authentication (JWT) | Save resume history, track versions over time |
| PostgreSQL + JPA | Persist analyses, score history, versions |
| Resume version comparison | v1 vs v2 score comparison with diff |
| Live job API integration | Real-time India jobs (Adzuna/JSearch) plug in cleanly |
| RAG / vector search | Semantic matching of resume to JDs, career Q&A chatbot |
| Multi-LLM support | Switch between GPT-4, Claude, Gemini via Spring AI abstraction |
| LinkedIn import | Fetch profile directly without uploading a file |
| Mobile app | React Native using same backend |
| Admin analytics | Which skills are most commonly missing, score distributions |

---

## 11. What to Say When Asked "Why Not Just Use ChatGPT?"

> "ChatGPT gives you a paragraph. We give you a structured score, a skill gap report, a list of matching roles with percentages, a rewritten resume, a cover letter for a specific role, and predicted interview questions — all in one workflow. And if you use Overleaf, we improve your actual LaTeX code so you can download it and use it immediately. ChatGPT doesn't do any of that."

---

## Summary: MVP Priority Order

```
MUST DEMO (Core product)
├── PDF upload + ATS score with section breakdown
├── Skill extraction + gap analysis vs a chosen role
├── Top matching job descriptions from corpus
└── Improvement suggestions (before / after bullets)

STRONG DIFFERENTIATORS (Show these)
├── LaTeX mode — improved .tex download
├── Cover letter generator (one click, for a matched JD)
└── Interview Q&A predictor

BONUS (If time allows)
└── Re-analyze after improvement → show score improvement
```
