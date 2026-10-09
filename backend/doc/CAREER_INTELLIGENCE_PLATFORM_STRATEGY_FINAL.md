# Career Intelligence Platform — Final Strategy & System Design

**Project type:** AI-powered full-stack web application  
**Primary stack:** Spring Boot + Spring AI + React  
**LLM:** OpenAI API for MVP; provider abstraction for Ollama/local models later  
**Primary users:** College students, fresh graduates, internship seekers, early-career job seekers  
**Initial implementation priority:** Backend first → frontend → advanced capabilities  
**Recommended architecture:** Modular monolith first; persistence/authentication/vector search later

---

## 1. Executive Summary

The original project idea is an AI-powered resume analysis platform. The supplied project scope already includes resume extraction, ATS-style scoring, actionable feedback, skill-gap analysis, career-role recommendations, job matching, job opportunities, and resume version tracking.

The final product should **not** be positioned as only an "AI Resume Analyzer." A user can already upload a resume to a general AI chatbot and receive feedback. The product should instead be positioned as an:

> **AI Career Intelligence Platform that understands a candidate, identifies realistic career paths, explains skill gaps, matches the candidate against relevant job descriptions, and guides measurable resume improvement.**

The central product loop is:

```text
Resume / LaTeX Source
        ↓
Resume Understanding
        ↓
Structured Candidate Profile
        ↓
Resume Quality Analysis
        ↓
Target Role Recommendation
        ↓
Skill-Gap Analysis
        ↓
Job-Description Matching
        ↓
Explainable Recommendations
        ↓
Resume Improvement
        ↓
New Resume Version
        ↓
Re-analysis + Progress
```

### Important scope decision

**Live job aggregation is not a core MVP dependency.**

For a college project, depending on scraping or external job APIs too early adds avoidable complexity, availability problems, rate limits, terms-of-use concerns, and debugging overhead.

Instead:

- **MVP:** Use a curated/internal job-description corpus for matching and market-style analysis.
- **Future:** Add permitted live job APIs/feeds behind a provider abstraction.
- **Do not make direct scraping of major job websites a required architecture dependency.**

This gives the team a reliable demo while still allowing the architecture to evolve into real-time job intelligence later.

---

# 2. Product Vision

## 2.1 Core problem

Students often know their technologies but do not know:

- Which roles their current profile actually fits.
- Whether their resume communicates their skills effectively.
- Which skills are most important to learn next.
- How their current projects map to real job requirements.
- Which improvements would have the biggest effect on their target role.

## 2.2 Product promise

The platform answers four questions:

1. **What does my resume currently say about me?**
2. **Which roles am I best suited for?**
3. **What am I missing for those roles?**
4. **What should I change or learn next?**

The system should turn those answers into an actionable workflow rather than a single AI-generated paragraph.

---

# 3. What Makes the Product Different From ChatGPT?

The key differentiation is **workflow + structured data + matching + progress**, not simply calling an LLM.

## 3.1 Structured candidate profile

Instead of returning only prose, the backend extracts a structured profile:

```text
Candidate
├── Summary
├── Education
├── Experience
├── Projects
├── Skills
│   ├── Programming
│   ├── Frameworks
│   ├── Databases
│   ├── Cloud
│   └── Tools
├── Certifications
├── Achievements
├── Target-role signals
└── Resume quality indicators
```

This structured profile becomes the input for all downstream services.

## 3.2 Explainable scoring

The score should not be an arbitrary LLM number.

Example:

```text
Career Resume Readiness: 78/100

ATS / Structure          17/20
Skill Relevance          18/25
Projects / Experience    15/20
Impact / Quantification  11/15
Role Alignment           12/15
Clarity / Completeness    5/5
```

Every score should have evidence and recommended actions.

## 3.3 Role-fit analysis

Instead of asking the LLM "What jobs should I apply for?", the system compares the candidate profile against a controlled role catalogue.

Example:

```text
Best-fit roles

Backend Developer       88%
Java Developer          86%
Software Engineer      82%
Full Stack Developer    73%
Data Engineer           58%
```

## 3.4 Skill-gap analysis

For a selected target role:

```text
Target Role: Backend Developer

Strong
✓ Java
✓ Spring Boot
✓ REST APIs
✓ SQL

Partial
⚠ Docker

Missing / Priority
! AWS
! CI/CD
! Kafka
```

## 3.5 Job-description matching

The MVP should contain a curated job-description dataset so the platform can demonstrate:

```text
Candidate Profile
       ↓
Job Description Corpus
       ↓
Matching Engine
       ↓
Top matching jobs / role descriptions
       ↓
Explain why the candidate matches
```

This is the important distinction: the project owns the **matching logic**, not just an external search box.

## 3.6 Resume optimization

The system should convert analysis into concrete resume changes.

Example:

```text
Current issue:
"Developed an e-commerce application."

Suggested improvement:
"Built a Spring Boot REST API for order processing,
using PostgreSQL and JWT authentication."

Reason:
Adds technology, implementation detail and measurable evidence.
```

## 3.7 Version comparison

The user should be able to compare versions:

```text
Version 1        Version 2
71/100     →     82/100

+ stronger project bullets
+ better role alignment
+ improved skill visibility
- still missing Docker evidence
```

This creates the product loop:

> **Analyze → Improve → Re-analyze → Measure**

---

# 4. Final MVP Scope

## Must-have MVP

1. PDF resume upload.
2. PDF text extraction.
3. Structured resume/profile extraction using Spring AI + OpenAI.
4. Hybrid resume score.
5. Strengths and weaknesses.
6. Actionable recommendations.
7. Skill extraction and normalization.
8. Recommended career roles.
9. Role-specific skill-gap analysis.
10. Curated job-description corpus.
11. Resume-to-job/description matching.
12. Explainable match score.
13. React dashboard.
14. Resume improvement suggestions.
15. Re-analysis after improvement.

## Strong MVP+ feature

**Overleaf / LaTeX Source Mode**

This is especially useful for engineering students because it allows the project to go beyond generic PDF analysis.

## Not required for MVP

- User authentication.
- OAuth.
- Full persistent database.
- Real-time job aggregation.
- Direct website scraping.
- Complex multi-agent architecture.
- Large vector database deployment.
- Production-scale distributed system.

These can be added later without changing the core business logic.

---

# 5. User Experience / Full Product Flow

## 5.1 Main flow

```text
Landing Page
      ↓
Analyze My Resume
      ↓
Upload PDF
      ↓
Resume Processing
      ↓
AI Analysis
      ↓
Career Dashboard
      ├── Resume Score
      ├── Skills
      ├── Resume Issues
      ├── Recommended Roles
      ├── Skill Gaps
      └── Matching Job Descriptions
              ↓
        Select Target Role
              ↓
      Target-role Analysis
              ↓
       Improve Resume
              ↓
        New Version
              ↓
       Re-analyze
              ↓
     Progress / Score Change
```

## 5.2 Overleaf flow

```text
Choose Overleaf Mode
        ↓
Paste / Upload LaTeX source
        ↓
Parse source
        ↓
Render current resume
        ↓
Extract candidate content
        ↓
AI analysis
        ↓
Suggested improvements
        ↓
Generate improved source
        ↓
Render preview
        ↓
Current vs Improved
        ↓
Download .tex / PDF
```

### Terminology decision

Call this **LaTeX / Overleaf Source Mode**, not YAML mode.

An Overleaf resume is normally maintained as LaTeX source, commonly `.tex` plus assets. YAML may be used in some custom tooling, but it should not be the platform's required resume-source representation.

---

# 6. Final System Architecture

```text
┌───────────────────────────────────────────────────────────────┐
│                         REACT FRONTEND                        │
│                                                               │
│ Landing │ Upload │ Dashboard │ Roles │ Skill Gaps │ Jobs      │
│ Resume Improvement │ Version Comparison │ Overleaf Mode       │
└──────────────────────────────┬────────────────────────────────┘
                               │ HTTPS / REST
                               ▼
┌───────────────────────────────────────────────────────────────┐
│                       SPRING BOOT                             │
│                                                               │
│ Controllers / REST API                                         │
│                                                               │
│ Application Services                                           │
│ ├── ResumeProcessingService                                   │
│ ├── ResumeAnalysisService                                     │
│ ├── CareerRecommendationService                               │
│ ├── SkillGapService                                            │
│ ├── JobMatchingService                                         │
│ ├── ResumeOptimizationService                                 │
│ └── VersionComparisonService                                   │
│                                                               │
│ AI Layer                                                       │
│ ├── Spring AI                                                  │
│ ├── Prompt / Output handling                                   │
│ └── LLM provider abstraction                                   │
│                                                               │
│ Integration Layer                                              │
│ ├── PDF parser                                                 │
│ ├── LaTeX processor                                            │
│ └── Future live-job providers                                  │
└───────────────┬─────────────────────┬─────────────────────────┘
                │                     │
                ▼                     ▼
        ┌──────────────┐       ┌────────────────────┐
        │  OpenAI API  │       │ Internal Job Corpus│
        │  MVP LLM     │       │ MVP matching data  │
        └──────────────┘       └────────────────────┘

                FUTURE
                   │
                   ▼
        ┌─────────────────────────┐
        │ PostgreSQL + pgvector   │
        │ users / resumes / jobs  │
        │ versions / matches     │
        └─────────────────────────┘
                   │
                   ▼
        ┌─────────────────────────┐
        │ Live Job Provider Layer │
        │ APIs / feeds / partners │
        └─────────────────────────┘
```

---

# 7. Backend Design

Use a **modular monolith** initially.

Do not start with multiple microservices. The project is easier to build, test, explain and deploy as one Spring Boot application.

## Suggested package structure

```text
com.project.careerai
│
├── controller
│   ├── ResumeController
│   ├── AnalysisController
│   ├── CareerController
│   ├── JobController
│   ├── ImprovementController
│   └── VersionController
│
├── service
│   ├── ResumeProcessingService
│   ├── ResumeAnalysisService
│   ├── CareerRecommendationService
│   ├── SkillGapService
│   ├── JobMatchingService
│   ├── ResumeOptimizationService
│   └── VersionComparisonService
│
├── ai
│   ├── LlmClient
│   ├── OpenAiLlmClient
│   ├── PromptService
│   └── AiResponseMapper
│
├── document
│   ├── PdfTextExtractor
│   ├── LatexParser
│   └── LatexRenderer
│
├── career
│   ├── RoleCatalog
│   ├── RoleFitCalculator
│   └── SkillGapCalculator
│
├── jobs
│   ├── JobRepository
│   ├── JobProviderClient
│   ├── JobNormalizer
│   └── FutureLiveJobProvider
│
├── matching
│   ├── SkillMatcher
│   ├── KeywordMatcher
│   ├── SemanticMatcher
│   └── MatchScoreCalculator
│
├── model
│   ├── ResumeProfile
│   ├── ResumeAnalysis
│   ├── Skill
│   ├── CareerRole
│   ├── JobDescription
│   ├── JobMatch
│   └── ResumeVersion
│
└── exception
    ├── GlobalExceptionHandler
    └── ErrorResponse
```

---

# 8. AI / LLM Strategy

## 8.1 LLM choice

### MVP: OpenAI API

OpenAI is the recommended starting point because it removes the need to run a local model and keeps the demo simpler and more predictable.

### Future: Ollama

Keep Ollama behind the same abstraction so that a local model can be explored later.

```java
public interface LlmClient {
    ResumeProfile extractResumeProfile(String resumeText);
    ResumeAnalysis analyzeResume(ResumeProfile profile);
}
```

Implementation:

```text
LlmClient
├── OpenAiLlmClient    ← MVP
└── OllamaLlmClient    ← Future
```

The rest of the application should not depend directly on either provider.

---

# 9. Spring AI Role

Spring AI should be the AI orchestration layer inside Spring Boot.

Use it for:

- Chat/model integration.
- Prompt templates.
- Structured AI responses.
- Embeddings when needed.
- Vector-store integration later.
- Tool/function integration later.

Do not add agentic behavior simply for the sake of saying the project is "agentic."

The first version should use predictable service orchestration.

---

# 10. Resume Processing Pipeline

```text
Upload PDF
   ↓
Validate file
   ↓
Extract text
   ↓
Clean / normalize text
   ↓
Detect sections
   ↓
Structured AI extraction
   ↓
ResumeProfile
   ↓
Deterministic metrics
   ↓
AI semantic analysis
   ↓
ResumeAnalysis
```

## Structured output

The LLM should return structured data instead of uncontrolled prose.

Example:

```json
{
  "candidateSummary": "Backend-focused final-year student",
  "skills": [
    {
      "name": "Java",
      "category": "Programming",
      "confidence": 0.96
    },
    {
      "name": "Spring Boot",
      "category": "Framework",
      "confidence": 0.94
    }
  ],
  "experienceMonths": 8,
  "projects": [
    {
      "name": "Order Management System",
      "technologies": ["Java", "Spring Boot", "PostgreSQL"]
    }
  ],
  "targetRoles": [
    {
      "role": "Backend Developer",
      "fit": 87
    }
  ]
}
```

---

# 11. Resume Scoring Strategy

Use a hybrid deterministic + AI approach.

Suggested starting weights:

```text
Resume Quality Score
│
├── ATS / Structure             20%
├── Skill Relevance             20%
├── Project / Experience        20%
├── Impact / Quantification     15%
├── Role Alignment              15%
└── Clarity / Completeness      10%
```

## Deterministic checks

Use code for:

- Missing sections.
- Number of projects.
- Number of quantified bullets.
- Skill count.
- Resume length.
- Contact-information presence.
- Obvious date inconsistencies.
- Duplicate/repeated text.
- Basic formatting signals.

## AI checks

Use the LLM for:

- Project quality.
- Strength of achievements.
- Relevance of experience.
- Clarity.
- Role alignment.
- Quality of recommendations.

This prevents the score from becoming an unexplained hallucinated number.

---

# 12. Career Role Recommendation Engine

Create a controlled role catalogue.

Example initial roles:

```text
Backend Developer
Java Developer
Software Engineer
Full Stack Developer
Frontend Developer
Data Analyst
Data Engineer
ML Engineer
DevOps Engineer
Cloud Engineer
QA Automation Engineer
```

Each role should define:

```text
Role
├── Required skills
├── Preferred skills
├── Related skills
├── Common keywords
├── Experience expectation
└── Project evidence expectations
```

Role fit can be computed from:

```text
Role Fit =
skill coverage
+ experience alignment
+ project evidence
+ semantic relevance
```

The LLM should explain the result, not invent the entire scoring system.

---

# 13. Skill-Gap Engine

For the selected target role:

```text
Candidate Skills
       ↓
Role Skill Matrix
       ↓
Skill Comparison
       ↓
┌───────────────────────────┐
│ Strong                    │
│ Java, Spring Boot, SQL    │
├───────────────────────────┤
│ Partial                   │
│ Docker                    │
├───────────────────────────┤
│ Priority gaps             │
│ AWS, CI/CD, Kafka         │
└───────────────────────────┘
```

Rank gaps by:

- Importance for the target role.
- Frequency in the project's job-description corpus.
- Candidate evidence.
- Whether the skill is completely missing or merely weakly demonstrated.

This makes the output actionable.

---

# 14. Job Matching — MVP Design

## Core decision

The MVP should demonstrate job matching without requiring live job scraping.

Create a curated internal job-description dataset covering realistic fresher/early-career roles.

Example:

```text
job-descriptions/
├── backend-java-01.json
├── backend-java-02.json
├── spring-boot-01.json
├── software-engineer-01.json
├── frontend-01.json
├── data-analyst-01.json
└── devops-fresher-01.json
```

Example record:

```json
{
  "id": "job-001",
  "title": "Java Backend Developer",
  "companyType": "Product Company",
  "location": "Bengaluru",
  "experience": "0-2 years",
  "skills": [
    "Java",
    "Spring Boot",
    "REST API",
    "SQL",
    "Git",
    "Docker"
  ],
  "description": "..."
}
```

## Matching pipeline

```text
ResumeProfile
      ↓
Normalize candidate skills
      ↓
Retrieve relevant job descriptions
      ↓
Skill overlap
      ↓
Keyword overlap
      ↓
Semantic similarity (optional)
      ↓
Experience compatibility
      ↓
Location compatibility
      ↓
Final match score
```

Example result:

```text
Java Backend Developer
Match: 91%

Skill match       93%
Project fit       89%
Experience fit    95%
Location fit      100%

Matched
✓ Java
✓ Spring Boot
✓ REST APIs
✓ PostgreSQL

Gaps
⚠ Docker
⚠ AWS
```

---

# 15. Market Intelligence — MVP Version

Even without live job aggregation, the application can provide a **market-style snapshot** from the controlled job-description corpus.

Example:

```text
Backend Developer — Market Snapshot

Most common skills in our corpus

Java        ██████████
Spring Boot █████████
SQL         ████████
Docker      ██████
AWS         ██████
Kafka       ████

Candidate gaps
AWS / Docker / Kafka
```

The product should clearly label this as being based on the platform's job-description corpus rather than claiming real-time market statistics.

This gives the team the visual/product effect of market intelligence while keeping the MVP deterministic and reliable.

---

# 16. Live Job Intelligence — Future Enhancement

Move real-time job aggregation to a future phase.

## Future architecture

```text
                  ┌────────────────────────┐
                  │ Live Job Sources       │
                  │                        │
                  │ Official APIs          │
                  │ Public feeds           │
                  │ Partner integrations   │
                  └───────────┬────────────┘
                              ↓
                  ┌────────────────────────┐
                  │ Job Ingestion Service   │
                  └───────────┬────────────┘
                              ↓
                  ┌────────────────────────┐
                  │ Normalize + Deduplicate│
                  └───────────┬────────────┘
                              ↓
                  ┌────────────────────────┐
                  │ Jobs DB / Vector Store │
                  └───────────┬────────────┘
                              ↓
                  ┌────────────────────────┐
                  │ Matching Engine         │
                  └───────────┬────────────┘
                              ↓
                     Personalized Jobs
```

### Provider abstraction

Do not hard-code one external provider into the rest of the application.

```java
public interface JobProviderClient {
    List<Job> search(JobSearchCriteria criteria);
}
```

Possible future providers can implement the interface independently.

### Scraping policy

Direct scraping of job websites should **not** be the required design. Prefer sources that explicitly provide APIs, feeds, partnerships, or other permitted mechanisms.

This keeps the architecture legally and operationally safer and avoids making the college demo dependent on a fragile scraper.

---

# 17. RAG Strategy

RAG is useful, but it should not be added only as a buzzword.

## Good RAG content

A future knowledge base can contain:

- Role definitions.
- Role-to-skill relationships.
- Skill synonyms.
- Resume guidelines.
- ATS guidance.
- Career-development material.
- Role competency matrices.
- Curated technical learning resources.

Flow:

```text
Candidate Profile + Target Role
             ↓
Retrieve relevant career knowledge
             ↓
LLM reasoning
             ↓
Grounded recommendation
```

## What does not need RAG initially?

The internal job-description corpus can simply be queried directly in the MVP.

Current job listings in a future phase should come from a live-data source rather than being treated as permanent knowledge-base documents.

### Recommended timing

```text
Phase 1 → no vector database
Phase 2 → optional pgvector + embeddings
Phase 3 → richer personalized RAG
```

---

# 18. Overleaf / LaTeX Mode

This can be a strong differentiating engineering feature.

## User flow

```text
LaTeX Source
     ↓
Parse source
     ↓
Extract resume content
     ↓
ResumeProfile
     ↓
AI analysis
     ↓
Improvement plan
     ↓
Generate source changes
     ↓
Render preview
     ↓
Current vs Improved
     ↓
Download .tex / PDF
```

## Important design principle

Never silently overwrite the user's source.

Prefer:

```text
Current Version
       vs
Suggested Version
```

with accepted/rejected changes where feasible.

### MVP implementation level

Start with:

```text
.tex input
   ↓
extract content
   ↓
AI suggestions
   ↓
generate improved .tex
   ↓
preview
```

Full source-level intelligent diffing can come later.

### Rendering

Because LaTeX compilation can execute commands, rendering should eventually happen in an isolated/sandboxed process or container rather than directly on the application host.

---

# 19. React Frontend Design

## Landing page

Hero message:

> **Know what your resume qualifies you for. Know what you should improve next.**

Primary actions:

- Analyze Resume
- Use Overleaf Mode

## Dashboard

```text
┌───────────────────────────────────────────────────────────┐
│ Career Readiness: 78/100                                  │
│ Target Role: Backend Developer                            │
└───────────────────────────────────────────────────────────┘

┌──────────────┐ ┌──────────────┐ ┌────────────────────────┐
│ Resume Score │ │ Role Fit     │ │ Priority Gaps          │
│ 78           │ │ 86%          │ │ AWS / Docker / Kafka  │
└──────────────┘ └──────────────┘ └────────────────────────┘

Resume Insights
[Strengths] [Issues] [Recommendations]

Career Paths
[Backend] [Java] [Software Engineer] [Full Stack]

Market Snapshot
[Common Skills] [Candidate Gaps]

Recommended Matches
[Job / JD Cards]
```

## Improvement screen

```text
Current Score     71
Potential Score   83

Top Improvements
1. Quantify project impact
2. Highlight backend/API work
3. Add deployment evidence
4. Remove generic statements

[Improve Resume]
```

---

# 20. REST API Design — MVP

## Resume

```http
POST /api/v1/resumes/analyze
GET  /api/v1/resumes/{resumeId}
GET  /api/v1/resumes/{resumeId}/analysis
```

## Career roles

```http
GET /api/v1/career/roles
GET /api/v1/career/roles/recommendations?resumeId={id}
GET /api/v1/career/roles/{roleId}/skill-gaps?resumeId={id}
```

## Job matching

```http
GET  /api/v1/jobs/search?q=java
POST /api/v1/jobs/match
GET  /api/v1/jobs/recommended?resumeId={id}&role={role}
```

For MVP, these endpoints can work against the internal curated dataset.

## Resume improvement

```http
POST /api/v1/resumes/{resumeId}/improvement-plan
```

## LaTeX mode

```http
POST /api/v1/latex/analyze
POST /api/v1/latex/improve
POST /api/v1/latex/render
```

---

# 21. Data Model Strategy

## Phase 1 — Minimal / stateless

A full user database is not required.

The application can maintain temporary analysis sessions and return generated IDs.

## Phase 2 — PostgreSQL

Add:

```text
users
resumes
resume_versions
resume_analyses
skills
roles
role_skill_requirements
job_descriptions
job_matches
saved_jobs
applications
```

## Phase 3 — richer data

```text
skill_taxonomy
market_snapshots
user_preferences
learning_resources
notifications
```

The service layer should already use domain models so the storage layer can change later.

---

# 22. Authentication and Database — Future Enhancement

Do not block the first working demo on authentication.

### MVP

```text
Browser
  ↓
Spring Boot
  ↓
Temporary Analysis Session
  ↓
AI + Job Corpus
  ↓
Dashboard
```

### Future

```text
React
  ↓
Spring Security
  ↓
JWT / OAuth
  ↓
PostgreSQL
  ↓
Persistent profile
resumes / versions / jobs / applications
```

This is a clean incremental approach rather than premature infrastructure work.

---

# 23. Security and Reliability

Even a college MVP should demonstrate production-minded thinking.

## Required

- Keep API keys on the backend.
- Store secrets in environment variables.
- Validate uploaded file type and size.
- Reject unsupported files.
- Set external-request timeouts.
- Handle external/model failures gracefully.
- Avoid logging full resume contents unnecessarily.
- Treat resume information as private user content.
- Do not fabricate job data.
- Never silently overwrite user source files.

## Future

- Authentication/authorization.
- Rate limiting.
- Persistent audit history.
- Secure file storage.
- Sandboxed LaTeX rendering.
- Observability and tracing.

---

# 24. Agent Strategy

### Recommendation: no agent for the core MVP.

The first workflow is predictable:

```text
Resume
 ↓
Analysis
 ↓
Role recommendation
 ↓
Skill gap
 ↓
Matching
 ↓
Improvement
```

Normal service orchestration is easier to:

- test,
- debug,
- explain to faculty,
- maintain,
- and demonstrate.

## Future Career Copilot

An agent can later orchestrate several services:

```text
User:
"I want a backend role. Tell me what I should fix."

Career Copilot
├── Reads candidate profile
├── Identifies target role
├── Retrieves role requirements
├── Finds relevant job descriptions
├── Runs skill-gap analysis
├── Suggests resume changes
└── Creates an improvement plan
```

That is a better reason to use agents than making the whole backend agentic.

---

# 25. Development Roadmap

## Phase 0 — Architecture and contracts

Deliver:

- Repository structure.
- DTOs.
- Domain models.
- REST contracts.
- Error schema.
- LLM abstraction.
- Job provider abstraction.

**Milestone:** All team members understand the boundaries and API contracts.

## Phase 1 — Resume intelligence backend

Tasks:

1. Spring Boot setup.
2. Resume upload.
3. PDF extraction.
4. Text normalization.
5. Spring AI integration.
6. OpenAI integration.
7. Structured ResumeProfile.
8. Resume scoring.
9. Feedback generation.
10. API tests.

**Milestone:**

> Upload PDF → structured profile + score + feedback.

## Phase 2 — Career intelligence

Tasks:

1. Role catalogue.
2. Role recommendation.
3. Skill-gap engine.
4. Explainable recommendations.
5. Internal market-signal aggregation.

**Milestone:**

> Resume → realistic target roles → skill gaps.

## Phase 3 — Job matching

Tasks:

1. Curated job-description dataset.
2. Job model.
3. Search/filter service.
4. Skill matching.
5. Match scoring.
6. Explanation generation.

**Milestone:**

> Resume → best matching job descriptions → why each matches.

## Phase 4 — React product

Tasks:

1. Landing page.
2. Upload interface.
3. Dashboard.
4. Score cards.
5. Skills visualization.
6. Role cards.
7. Skill gaps.
8. Job cards.
9. Improvement view.
10. Loading/error states.

**Milestone:**

> Complete polished end-to-end product.

## Phase 5 — Overleaf / LaTeX mode

Tasks:

1. `.tex` upload/paste.
2. Source parser.
3. Resume content extraction.
4. AI improvements.
5. Improved source generation.
6. Rendering.
7. Preview.
8. Download.

**Milestone:**

> Engineering student can improve their real Overleaf resume.

## Phase 6 — Persistence and accounts

Tasks:

1. PostgreSQL.
2. Users.
3. Resume history.
4. Version tracking.
5. Saved jobs.
6. Spring Security.
7. JWT/OAuth.

## Phase 7 — Advanced AI and live intelligence

Tasks:

1. Embeddings.
2. pgvector.
3. RAG.
4. Live job provider integrations.
5. Job alerts.
6. Career Copilot agent.
7. Personalized learning roadmap.
8. Interview preparation.
9. Cover letters.

---

# 26. Team Responsibility Split

## Team A — AI / Resume Intelligence

Own:

- PDF extraction.
- ResumeProfile.
- Spring AI.
- OpenAI integration.
- Prompts.
- Structured outputs.
- Scoring.
- Feedback.

## Team B — Backend / Career / Matching

Own:

- Spring Boot REST APIs.
- Role catalogue.
- Skill-gap engine.
- Job corpus.
- Matching algorithm.
- Backend integration.

## Team C — React Frontend

Own:

- UI architecture.
- Upload flow.
- Dashboard.
- Score visualization.
- Role/skill-gap screens.
- Job cards.
- Improvement screens.

## Team D — Advanced Integration

Own later:

- Overleaf mode.
- LaTeX rendering.
- Version comparison.
- PostgreSQL.
- Authentication.
- RAG.
- Live-job providers.

Allocation can be adjusted depending on team size.

---

# 27. Definition of Done — First College Demo

The team does not need every future feature before presenting.

The ideal first demonstration is:

```text
1. Open platform
        ↓
2. Upload real student resume
        ↓
3. Parse resume
        ↓
4. Generate structured profile
        ↓
5. Show resume score
        ↓
6. Show strengths + weaknesses
        ↓
7. Show recommended roles
        ↓
8. Select Backend Developer
        ↓
9. Show skill gaps
        ↓
10. Show matching job descriptions
        ↓
11. Explain match score
        ↓
12. Show market-style skill snapshot
        ↓
13. Generate improvement plan
        ↓
14. Improve resume
        ↓
15. Re-analyze
        ↓
16. Show score improvement
```

This is already a substantial AI full-stack product.

---

# 28. Recommended Presentation Story

Do not say:

> "We built a resume analyzer using OpenAI."

Instead say:

> **"We built an AI career intelligence platform for students and fresh graduates. The platform does not stop at resume feedback. It converts the resume into a structured candidate profile, identifies realistic target roles, explains skill gaps, matches the candidate against relevant job descriptions, and guides resume improvement that can be measured through re-analysis."**

Then demonstrate one student from beginning to end.

Example:

```text
Student profile
Final-year B.Tech
Java + Spring Boot + SQL
2 projects
No internship

↓

Best target roles
Backend Developer       88%
Java Developer          86%
Software Engineer      82%

↓

Top gaps
Docker
AWS
CI/CD

↓

Matching descriptions
Backend Role A          91%
Backend Role B          86%
Java Role C             82%

↓

Improvement plan
• Quantify project impact
• Emphasize REST/API development
• Add deployment evidence
• Highlight relevant backend skills

↓

Re-analysis
71 → 83
```

This tells a complete product story.

---

# 29. Technology Decision Summary

| Area | MVP | Future | Reason |
|---|---|---|---|
| Backend | Spring Boot | Same | Main application/API layer |
| AI orchestration | Spring AI | Same | Fits Java/Spring stack |
| LLM | OpenAI API | Ollama/other providers | Simpler and reliable MVP |
| Frontend | React | Same | Product UI |
| Resume input | PDF | PDF + LaTeX | PDF is universal; LaTeX adds differentiation |
| Job data | Curated job descriptions | Live APIs/feeds | Reliable MVP, extensible later |
| Matching | Rules + keyword/semantic similarity | Embedding-heavy matching | Explainability first |
| Vector DB | None | PostgreSQL + pgvector | Avoid premature complexity |
| Database | Minimal/stateless | PostgreSQL | Persistence later |
| Authentication | None | Spring Security + JWT/OAuth | Not required for core demo |
| Agents | None | Career Copilot | Add only when orchestration adds value |
| Deployment | Simple | Production cloud | Focus on product completeness first |

---

# 30. Final Architecture Principles

1. **Build a product, not an LLM wrapper.**
2. **The main differentiator is the complete career workflow.**
3. **Use deterministic code for deterministic checks.**
4. **Use LLMs for semantic reasoning and generation.**
5. **Make recommendations explainable.**
6. **Do not introduce RAG merely as a buzzword.**
7. **Do not introduce agents merely as a buzzword.**
8. **Do not make live job scraping a core MVP dependency.**
9. **Keep future external integrations behind interfaces.**
10. **Do not expose API keys in React.**
11. **Design for PostgreSQL/auth later without blocking the MVP.**
12. **Treat LaTeX/Overleaf as a power-user engineering feature.**
13. **Measure improvement across resume versions.**
14. **Finish one complete end-to-end vertical slice before adding infrastructure complexity.**

---

# 31. Final Presentation Diagram

```text
                           ┌───────────────┐
                           │     USER      │
                           └───────┬───────┘
                                   │
                       PDF / LaTeX / Resume
                                   │
                                   ▼
                    ┌─────────────────────────┐
                    │  RESUME INGESTION       │
                    │  Parse + Normalize      │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ STRUCTURED PROFILE      │
                    │ Skills / Projects / Exp │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
      ┌───────────────┐  ┌───────────────┐  ┌──────────────┐
      │ Resume Score  │  │ Career Roles  │  │ Skill Gaps   │
      └───────┬───────┘  └───────┬───────┘  └──────┬───────┘
              │                  │                  │
              └──────────────────┼──────────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │ JOB DESCRIPTION CORPUS  │
                    │        MVP DATA         │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ MATCHING ENGINE         │
                    │ Fit + Gaps + Evidence   │
                    └────────────┬────────────┘
                                 │
                     ┌───────────┴───────────┐
                     ▼                       ▼
             ┌──────────────┐       ┌─────────────────┐
             │ Best Matches │       │ Market Snapshot │
             └──────┬───────┘       └─────────────────┘
                    │
                    ▼
          ┌─────────────────────────┐
          │ RESUME IMPROVEMENT      │
          │ Suggestions / LaTeX     │
          └────────────┬────────────┘
                       │
                       ▼
          ┌─────────────────────────┐
          │ NEW RESUME VERSION      │
          └────────────┬────────────┘
                       │
                       ▼
                ┌───────────────┐
                │ RE-ANALYZE    │
                └───────┬───────┘
                        │
                        ▼
               ┌────────────────┐
               │ IMPROVEMENT     │
               │ SCORE / GAPS    │
               └────────────────┘

                         FUTURE
                            │
                            ▼
               ┌──────────────────────┐
               │ LIVE JOB PROVIDERS   │
               │ APIs / feeds / etc.  │
               └──────────────────────┘
```

---

# 32. Immediate Build Order

Build in this exact sequence:

```text
1. Spring Boot project
2. Resume upload API
3. PDF extraction
4. ResumeProfile
5. Spring AI + OpenAI
6. Structured resume analysis
7. Hybrid score
8. Career role catalogue
9. Skill-gap engine
10. Curated job-description dataset
11. Matching engine
12. REST API stabilization + tests
13. React application
14. Dashboard
15. Role/skill-gap screens
16. Matching screen
17. Resume improvement screen
18. Re-analysis/version comparison
19. Overleaf / LaTeX mode
20. PostgreSQL + authentication
21. RAG / pgvector
22. Live job provider integration
23. Career Copilot agent
```

---

# 33. Final Product Definition

## Recommended product name

Working names:

- CareerLens AI
- CareerFit AI
- ResumeIQ
- Career Intelligence Platform

The final branding can be decided later.

## One-line definition

> **An AI-powered career intelligence platform that transforms a student's resume into a structured career profile, identifies realistic target roles and skill gaps, matches the profile against relevant job descriptions, and guides measurable resume improvement.**

## Product loop

```text
                 ANALYZE
                    ↓
                UNDERSTAND
                    ↓
              RECOMMEND ROLES
                    ↓
                FIND GAPS
                    ↓
             MATCH OPPORTUNITIES
                    ↓
                IMPROVE
                    ↓
               RE-ANALYZE
                    ↓
                 MEASURE
                    ↺
```

---

# 34. Source Basis

The team's supplied project information describes the original system as an AI-powered full-stack application for resume analysis and includes resume extraction, ATS scoring, actionable feedback, role/skill-gap analysis, job matching, job recommendations, and resume version tracking.

The supplied material is therefore used as the basis for the MVP scope, while the architecture above extends that concept into a coherent product workflow.

---

# 35. Final Scope Decision

### Build now

**Resume intelligence + career intelligence + job-description matching + explainability + improvement loop + React product.**

### Add after the product works

**Overleaf/LaTeX mode + persistence + authentication + RAG.**

### Add later as advanced production capability

**Live job providers, alerts, application tracking, agentic Career Copilot, learning roadmap, interviews and additional personalization.**

The most important goal is to demonstrate one polished flow where the system clearly goes beyond:

> **"Upload resume → AI gives feedback."**

The final product should demonstrate:

> **"Upload resume → understand candidate → identify career direction → find gaps → match opportunities → improve resume → prove improvement."**
