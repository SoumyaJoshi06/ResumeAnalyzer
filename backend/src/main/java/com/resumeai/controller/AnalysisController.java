package com.resumeai.controller;

import com.resumeai.model.*;
import com.resumeai.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/analyse")
@RequiredArgsConstructor
public class AnalysisController {

    private final SessionStore sessionStore;
    private final AIAnalysisService aiService;
    private final JobMatchingService jobMatchingService;

    /** Get the full analysis result for a session */
    @GetMapping("/{sessionId}")
    public ResponseEntity<?> getAnalysis(@PathVariable String sessionId) {
        SessionData session = sessionStore.get(sessionId);
        if (session == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(session.getAnalysisResponse());
    }

    /**
     * Get skill gap for a specific role.
     * Body: { "role": "Java Backend Developer" }
     */
    @PostMapping("/{sessionId}/gap")
    public ResponseEntity<?> getSkillGap(@PathVariable String sessionId,
                                         @RequestBody Map<String, String> body) {
        SessionData session = sessionStore.get(sessionId);
        if (session == null) {
            return ResponseEntity.notFound().build();
        }

        String role = body.get("role");
        if (role == null || role.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "role is required"));
        }

        Optional<JobDefinition> jobDef = jobMatchingService.findByRole(role);
        if (jobDef.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Role not found in catalogue: " + role));
        }

        ResumeProfile profile = session.getAnalysisResponse().getProfile();
        SkillGapReport report = aiService.analyseSkillGap(
                profile.getSkills(),
                role,
                jobDef.get().getRequiredSkills(),
                jobDef.get().getPreferredSkills()
        );

        return ResponseEntity.ok(report);
    }

    /** List all available roles in the catalogue */
    @GetMapping("/roles")
    public ResponseEntity<?> getRoles() {
        return ResponseEntity.ok(
                jobMatchingService.getAllRoles().stream()
                        .map(jd -> Map.of("role", jd.getRole(), "level", jd.getLevel()))
                        .toList()
        );
    }
}
