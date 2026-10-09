# Database Design — Resume Analyser

## Current State: In-Memory (No Persistent DB)

### What We Use
Sessions are stored in a `ConcurrentHashMap` inside `SessionStore.java`:

```java
private final Map<String, SessionData> store = new ConcurrentHashMap<>();
```

Each session holds:
- The raw extracted resume text
- The full `FullAnalysisResponse` (profile, ATS scorecard, improvements, matched roles)

### Why This Is Acceptable Right Now
| Reason | Detail |
|--------|--------|
| Stateless tool | User uploads PDF → gets analysis → done. No login, no history needed. |
| Short session lifetime | The session ID is only needed for the follow-up `/skill-gap` call within the same request cycle. |
| Simplicity | No DB setup, no migrations, no ORM config. Keeps the project lean. |
| Portfolio/demo scope | Single server, single user at a time — in-memory is sufficient. |

### Known Limitations
| Limitation | Impact |
|------------|--------|
| Data lost on restart | If the server restarts, all sessions are gone. `/skill-gap` calls return 404. |
| No history | Users cannot retrieve past analyses. |
| Not scalable | Multiple server instances each have their own store — sessions don't cross instances. |
| No user identity | Cannot associate analyses with a specific user. |

---

## Future State: Persistent Database (MySQL / PostgreSQL)

### When to Add a DB
Add a persistent database when any of these features are needed:
- User login / authentication
- "My past analyses" / resume history
- Admin dashboard / analytics
- Deployment behind a load balancer (multiple instances)

---

### Proposed Schema

#### `users`
```sql
CREATE TABLE users (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    email       VARCHAR(255) UNIQUE NOT NULL,
    name        VARCHAR(255),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `resume_sessions`
```sql
CREATE TABLE resume_sessions (
    id              VARCHAR(36) PRIMARY KEY,   -- UUID
    user_id         BIGINT REFERENCES users(id),
    file_name       VARCHAR(255),
    resume_text     TEXT,
    total_score     INT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `analysis_results`
```sql
CREATE TABLE analysis_results (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id      VARCHAR(36) REFERENCES resume_sessions(id),
    result_type     ENUM('PROFILE', 'SCORECARD', 'IMPROVEMENTS', 'MATCHED_ROLES'),
    result_json     JSON,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

> **Note:** Storing results as JSON columns avoids complex relational mapping for AI-generated data that changes shape frequently.

---

### Migration Plan (Step-by-Step)

1. **Add dependency** — Spring Data JPA + MySQL/PostgreSQL driver in `pom.xml`
2. **Configure** `application.properties` with datasource URL, username, password
3. **Create JPA entities** — `UserEntity`, `ResumeSessionEntity`
4. **Replace `SessionStore`** — swap `ConcurrentHashMap` with a `ResumeSessionRepository` (JPA)
5. **Add user auth** — Spring Security + JWT (optional but recommended alongside DB)
6. **Flyway/Liquibase** — add DB migration scripts for schema versioning

---

### Recommended Stack (Future)
| Component | Choice | Reason |
|-----------|--------|--------|
| Database | PostgreSQL | Better JSON support, free, production-grade |
| ORM | Spring Data JPA (Hibernate) | Already in Spring ecosystem |
| Migrations | Flyway | Simple, file-based, integrates with Spring Boot |
| Auth | Spring Security + JWT | Stateless, pairs well with REST API |
