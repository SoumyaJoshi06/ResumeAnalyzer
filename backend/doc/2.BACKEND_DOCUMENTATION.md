# Backend Development Documentation
> AI Resume Intelligence Platform — Spring Boot Backend

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Language |
| Spring Boot | 4.1.1 | Application framework |
| Spring AI | 2.0.1 | LLM integration abstraction |
| OpenAI GPT-4o-mini | API | AI analysis, scoring, suggestions |
| Apache PDFBox | 3.0.3 | PDF text extraction |
| Lombok | Latest (Boot-managed) | Reduce boilerplate (getters, setters, builders) |
| Jackson | Latest (Boot-managed) | JSON serialization / deserialization |
| Maven | 3.x | Build tool |

---

## Project Structure

```
backend/
├── pom.xml
└── src/
    └── main/
        ├── java/com/resumeai/
        │   ├── ResumeAnalyserApplication.java
        │   ├── config/
        │   │   ├── AppConfig.java
        │   │   └── WebConfig.java
        │   ├── model/
        │   │   ├── ResumeProfile.java
        │   │   ├── ATSScoreCard.java
        │   │   ├── SkillGapReport.java
        │   │   ├── ImprovementSuggestion.java
        │   │   ├── JobRoleMatch.java
        │   │   ├── JobDefinition.java
        │   │   ├── FullAnalysisResponse.java
        │   │   └── SessionData.java
        │   ├── service/
        │   │   ├── ResumeParseService.java
        │   │   ├── AIAnalysisService.java
        │   │   ├── JobMatchingService.java
        │   │   └── SessionStore.java
        │   └── controller/
        │       ├── ResumeController.java
        │       └── AnalysisController.java
        └── resources/
            ├── application.yml
            └── jd-corpus/
                ├── java-backend-developer.json
                ├── frontend-react-developer.json
                ├── full-stack-developer.json
                ├── data-analyst.json
                ├── ml-ai-engineer.json
                ├── devops-engineer.json
                ├── android-developer.json
                ├── cloud-engineer.json
                ├── software-engineer.json
                └── qa-test-engineer.json
```

---

## Package & File Breakdown

### `ResumeAnalyserApplication.java`
- Entry point — standard `@SpringBootApplication` + `main()`.

---

### `config/` Package

#### `AppConfig.java`
- **Purpose:** Declares shared beans used across the app.
- **Beans:**
  - `ChatClient` — Spring AI's main LLM client. Built from `ChatClient.Builder` (auto-configured by Spring AI starter). Used in `AIAnalysisService` to call OpenAI.
  - `ObjectMapper` — Jackson JSON mapper. Used in `AIAnalysisService` to deserialize OpenAI responses into model classes.
- **Concept:** Spring `@Configuration` + `@Bean` — centralised bean definition instead of scattering `new` across services.

#### `WebConfig.java`
- **Purpose:** Configures CORS so the React frontend (running on `localhost:5173` or `localhost:3000`) can call the backend (`localhost:8080`) without browser blocking.
- **Implements:** `WebMvcConfigurer` and overrides `addCorsMappings()`.
- **Concept:** Cross-Origin Resource Sharing (CORS) — browsers block requests from one origin to another by default. This allows it explicitly for our frontend origins.

---

### `model/` Package
All model classes are plain Java objects (POJOs) annotated with Lombok for clean code.

#### `ResumeProfile.java`
- Represents the structured candidate profile extracted from the resume.
- Fields: `name`, `email`, `phone`, `summary`, `skills` (List), `experience` (List), `education` (List), `projects` (List), `certifications` (List), `targetRoles` (List).
- Contains inner static classes: `Experience`, `Education`, `Project`.
- **Concept:** Nested static classes to represent complex structured data cleanly.

#### `ATSScoreCard.java`
- Represents the ATS score result from OpenAI.
- Fields: `totalScore` (int, 0–100), `sections` (ATSSections), `strengths` (List), `criticalIssues` (List).
- `ATSSections` contains 6 `SectionScore` objects (one per scoring dimension).
- `SectionScore` has: `score`, `maxScore`, `feedback`.

#### `SkillGapReport.java`
- Represents the skill gap analysis for a chosen target role.
- Fields: `targetRole`, `strong` (List), `partial` (List), `missing` (List), `priorityLearning` (List of `PrioritySkill`).
- `PrioritySkill` has: `skill`, `reason`, `resource` (free learning link).

#### `ImprovementSuggestion.java`
- One suggestion card — before/after pair.
- Fields: `original` (the weak bullet point from the resume), `improved` (AI-rewritten version), `reason` (why it's better).

#### `JobRoleMatch.java`
- Represents one matched role result from `JobMatchingService`.
- Fields: `role`, `matchPercentage` (int), `matchedSkills` (List), `missingSkills` (List).
- Uses `@AllArgsConstructor` — constructor with all fields (needed because matching logic builds it with `new`).

#### `JobDefinition.java`
- Represents one entry from the JD corpus JSON files.
- Fields: `role`, `level`, `requiredSkills`, `preferredSkills`, `keywords`, `description`.
- Loaded at startup by `JobMatchingService`.

#### `FullAnalysisResponse.java`
- The top-level response object returned by `POST /api/resume/analyse`.
- Fields: `sessionId`, `profile`, `scoreCard`, `improvements`, `matchedRoles`.
- Uses `@Builder` — clean builder pattern for constructing the object in the controller.

#### `SessionData.java`
- Stores what we cache in memory per session.
- Fields: `resumeText` (raw extracted text), `analysisResponse` (the full result).
- Needed so later calls (like skill gap for a specific role) can reuse the parsed profile without re-uploading the PDF.

---

### `service/` Package

#### `ResumeParseService.java`
- **Purpose:** Extract plain text from an uploaded PDF.
- **Key API:** `PDFBox 3.x` — uses `Loader.loadPDF(byte[])` (note: PDFBox 3.x changed from `PDDocument.load()` to `Loader.loadPDF()`).
- **Method:** `extractTextFromPdf(MultipartFile file)` → returns `String`.
- **Error handling:** Throws `IllegalArgumentException` if extracted text is blank (e.g. scanned image PDFs).
- **Concept:** `MultipartFile` — Spring's abstraction for uploaded files. Gives access to `getBytes()`, `getContentType()`, `getOriginalFilename()`.

#### `AIAnalysisService.java`
- **Purpose:** Central AI brain — all OpenAI calls go through here.
- **Dependency:** `ChatClient` (Spring AI), `ObjectMapper` (Jackson).
- **4 public methods:**

  | Method | OpenAI Call | Returns |
  |---|---|---|
  | `extractProfile(resumeText)` | Call #1 | `ResumeProfile` |
  | `scoreResume(resumeText)` | Call #2 | `ATSScoreCard` |
  | `generateImprovements(resumeText)` | Call #3 | `List<ImprovementSuggestion>` |
  | `analyseSkillGap(skills, role, required, preferred)` | Call #4 | `SkillGapReport` |

- **Prompt strategy:** Each prompt instructs GPT to return **only raw JSON** — no markdown, no explanation. This makes parsing reliable.
- **`cleanJson()` helper:** Strips ` ```json ... ``` ` markdown fences in case GPT wraps the response anyway.
- **`callAndParse()`** — generic helper that calls OpenAI, cleans response, deserializes into any class.
- **`callAndParseList()`** — same but deserializes into a `List<T>`.
- **Concept:** Spring AI `ChatClient` — abstracts the HTTP call to OpenAI. Prompt is built fluently: `chatClient.prompt().user(promptText).call().content()`.
- **Concept:** Jackson `TypeFactory` — used to construct generic `List<T>` type for deserialization at runtime.

#### `JobMatchingService.java`
- **Purpose:** Load the JD corpus at startup, compute match % for candidate skills against all roles. No AI used here — pure Java logic.
- **`@PostConstruct loadCatalogue()`** — runs once at startup. Uses Spring's `PathMatchingResourcePatternResolver` to find all `*.json` files in `classpath:jd-corpus/` and deserializes each into a `JobDefinition`.
- **`matchRoles(candidateSkills)`** — normalises both sides to lowercase, computes:
  - Required skill overlap = 80% weight
  - Preferred skill overlap = 20% weight
  - Returns top 5 matches sorted by match %.
- **`findByRole(role)`** — looks up a specific role definition for the skill gap call.
- **Concept:** `@PostConstruct` — runs after Spring initialises the bean. Good pattern for loading static data once.
- **Concept:** `PathMatchingResourcePatternResolver` — Spring utility to load multiple classpath resources matching a pattern (like `jd-corpus/*.json`).
- **Concept:** Java Streams — `stream().map().sorted().limit().collect()` pipeline for clean functional-style matching.

#### `SessionStore.java`
- **Purpose:** In-memory cache — stores resume text + analysis result per session.
- **Storage:** `ConcurrentHashMap<String, SessionData>` — thread-safe, no DB needed for MVP.
- **`createSession(data)`** — generates a UUID, stores data, returns the ID.
- **`get(sessionId)`** — retrieves stored data.
- **Concept:** `ConcurrentHashMap` — thread-safe map. Multiple requests can hit the server simultaneously; this avoids race conditions without locks.
- **Concept:** `UUID.randomUUID()` — generates unique session IDs (e.g. `f47ac10b-58cc-4372-a567-0e02b2c3d479`).

---

### `controller/` Package

#### `ResumeController.java`
- **Endpoint:** `POST /api/resume/analyse`
- **Input:** `MultipartFile` via `@RequestParam("file")`
- **Flow:**
  1. Validate: not empty, content type is `application/pdf`
  2. `ResumeParseService` → extract text
  3. `AIAnalysisService` → profile extraction (AI)
  4. `AIAnalysisService` → ATS scoring (AI)
  5. `AIAnalysisService` → improvement suggestions (AI)
  6. `JobMatchingService` → role match (plain Java)
  7. Build `FullAnalysisResponse`, store in `SessionStore`, return with `sessionId`
- **Logging:** `@Slf4j` — logs each step so you can see progress in the console during development.
- **Concept:** `@RestController` — combines `@Controller` + `@ResponseBody`, so return values are automatically serialized to JSON.
- **Concept:** `ResponseEntity<?>` — gives full control over HTTP status codes (200, 400, 500) and response body.

#### `AnalysisController.java`
- **Endpoints:**
  - `GET /api/analyse/{sessionId}` — retrieve full analysis for a session
  - `POST /api/analyse/{sessionId}/gap` — get skill gap for a specific role (body: `{ "role": "Java Backend Developer" }`)
  - `GET /api/analyse/roles` — list all available roles in the corpus
- **Concept:** `@PathVariable` — extracts `sessionId` from the URL path.
- **Concept:** `@RequestBody` — deserializes the JSON body into a `Map<String, String>` for the role gap request.

---

### `resources/application.yml`
```yaml
spring:
  ai:
    openai:
      api-key: ${OPENAI_API_KEY}     # read from environment variable
      chat:
        options:
          model: gpt-4o-mini
          temperature: 0.3            # low = consistent, deterministic output
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

server:
  port: 8080
```
- `${OPENAI_API_KEY}` — Spring reads from env var. Never hardcode API keys.
- `temperature: 0.3` — lower temperature = more consistent, structured JSON output from GPT.

---

### `resources/jd-corpus/*.json` — 10 files

Each file is a job definition for one role. Loaded at startup by `JobMatchingService`.

| File | Role |
|---|---|
| `java-backend-developer.json` | Java Backend Developer |
| `frontend-react-developer.json` | Frontend Developer (React) |
| `full-stack-developer.json` | Full Stack Developer |
| `data-analyst.json` | Data Analyst |
| `ml-ai-engineer.json` | ML / AI Engineer |
| `devops-engineer.json` | DevOps Engineer |
| `android-developer.json` | Android Developer |
| `cloud-engineer.json` | Cloud Engineer |
| `software-engineer.json` | Software Engineer (General) |
| `qa-test-engineer.json` | QA / Test Engineer |

Each file structure:
```json
{
  "role": "Role Title",
  "level": "Fresher / 0-2 years",
  "requiredSkills": ["Skill1", "Skill2"],
  "preferredSkills": ["SkillA", "SkillB"],
  "keywords": ["keyword1"],
  "description": "JD text"
}
```

---

## API Endpoints Summary

| Method | URL | Description | Test via Postman |
|---|---|---|---|
| `POST` | `/api/resume/analyse` | Upload PDF → full analysis | form-data, key=`file`, type=File |
| `GET` | `/api/analyse/{sessionId}` | Get cached analysis | Path param: session ID from above |
| `POST` | `/api/analyse/{sessionId}/gap` | Skill gap for a role | Body: `{"role": "Java Backend Developer"}` |
| `GET` | `/api/analyse/roles` | List all available roles | No body needed |

---

## Key Concepts Used

| Concept | Where Used | What It Does |
|---|---|---|
| `@SpringBootApplication` | Main class | Enables auto-configuration, component scan, Spring Boot |
| `@RestController` | Controllers | Marks class as REST controller, auto-serializes return to JSON |
| `@RequestMapping` | Controllers | Base URL path for all methods in the controller |
| `@PostMapping` / `@GetMapping` | Controller methods | HTTP method + path mapping |
| `@RequestParam` | `ResumeController` | Reads `file` from multipart form-data |
| `@PathVariable` | `AnalysisController` | Reads `sessionId` from URL path |
| `@RequestBody` | `AnalysisController` | Deserializes JSON body to Java object |
| `ResponseEntity<?>` | Controllers | Full control over HTTP response status + body |
| `@Service` | Services | Marks class as Spring service, makes it injectable |
| `@Configuration` | Config classes | Marks class as bean definition source |
| `@Bean` | `AppConfig` | Declares a Spring-managed bean |
| `@PostConstruct` | `JobMatchingService` | Runs once after bean initialization (load JD corpus) |
| `@RequiredArgsConstructor` | Services, Controllers | Lombok — generates constructor for all `final` fields (constructor injection) |
| `@Slf4j` | Services, Controllers | Lombok — injects `log` field for logging |
| `@Data` | Model classes | Lombok — generates getters, setters, `equals`, `hashCode`, `toString` |
| `@Builder` | `FullAnalysisResponse` | Lombok — generates builder pattern for clean object construction |
| `@AllArgsConstructor` | `JobRoleMatch` | Lombok — generates constructor with all fields |
| `ChatClient` | `AIAnalysisService` | Spring AI — abstraction to call OpenAI (or any LLM) |
| `ConcurrentHashMap` | `SessionStore` | Thread-safe in-memory storage |
| `PathMatchingResourcePatternResolver` | `JobMatchingService` | Load multiple classpath files by pattern |
| `ObjectMapper` | `AIAnalysisService` | Jackson — parse JSON string → Java object |
| `MultipartFile` | `ResumeParseService` | Spring abstraction for uploaded file |
| `Loader.loadPDF()` | `ResumeParseService` | PDFBox 3.x API to load PDF from byte array |
| Java Streams | `JobMatchingService` | Functional pipeline: map → filter → sort → collect |
| `UUID.randomUUID()` | `SessionStore` | Generate unique session IDs |

---

## Test Strategy (Manual — Postman)

### Step 1: Start the server
```bash
# Set your OpenAI API key first
set OPENAI_API_KEY=sk-your-key-here       # Windows
export OPENAI_API_KEY=sk-your-key-here    # Mac/Linux

mvn spring-boot:run
```
Server starts on `http://localhost:8080`

---

### Step 2: Upload PDF and get full analysis
```
POST http://localhost:8080/api/resume/analyse

Body → form-data
  Key:   file   (type: File)
  Value: [select your resume PDF]
```

**Expected response:**
```json
{
  "sessionId": "f47ac10b-58cc-...",
  "profile": {
    "name": "Soumya Joshi",
    "skills": ["Java", "Spring Boot", "React"],
    ...
  },
  "scoreCard": {
    "totalScore": 74,
    "sections": {
      "atsKeywords": { "score": 15, "maxScore": 20, "feedback": "..." },
      ...
    }
  },
  "improvements": [
    { "original": "...", "improved": "...", "reason": "..." }
  ],
  "matchedRoles": [
    { "role": "Java Backend Developer", "matchPercentage": 88, ... }
  ]
}
```
Save the `sessionId` from the response for the next tests.

---

### Step 3: Get skill gap for a role
```
POST http://localhost:8080/api/analyse/{sessionId}/gap

Body → raw → JSON
{
  "role": "Java Backend Developer"
}
```

**Expected response:**
```json
{
  "targetRole": "Java Backend Developer",
  "strong": ["Java", "Spring Boot"],
  "partial": ["Docker"],
  "missing": ["AWS", "CI/CD"],
  "priorityLearning": [
    { "skill": "AWS", "reason": "...", "resource": "AWS Free Tier + A Cloud Guru" }
  ]
}
```

---

### Step 4: List all roles
```
GET http://localhost:8080/api/analyse/roles
```
Returns all 10 roles available in the JD corpus.

---

### Step 5: Get full analysis by session
```
GET http://localhost:8080/api/analyse/{sessionId}
```
Returns the same response as Step 2 (cached).

---

### What to check in each test

| Test | What to verify |
|---|---|
| Upload non-PDF | Should return 400 with `"Only PDF files are accepted"` |
| Upload empty file | Should return 400 with `"File is empty"` |
| Upload valid PDF | Should return 200 with all 4 sections populated |
| Skill gap with valid role | Should return 200 with strong/partial/missing lists |
| Skill gap with invalid role | Should return 400 with `"Role not found in catalogue"` |
| Get analysis with bad sessionId | Should return 404 |
| Check console logs | Should see each step logged: "Running AI profile extraction...", etc. |

---

## How to Run

```bash
cd backend

# Set API key (Windows)
set OPENAI_API_KEY=sk-your-actual-openai-key

# Run
mvn spring-boot:run
```

Or build the JAR and run:
```bash
mvn clean package -DskipTests
java -DOPENAI_API_KEY=sk-your-key -jar target/resume-analyser-1.0.0-SNAPSHOT.jar
```
