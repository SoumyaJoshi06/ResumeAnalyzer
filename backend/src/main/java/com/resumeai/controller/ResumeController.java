package com.resumeai.controller;

import com.resumeai.model.*;
import com.resumeai.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeParseService parseService;
    private final AIAnalysisService aiService;
    private final JobMatchingService jobMatchingService;
    private final SessionStore sessionStore;

    /**
     * Main endpoint: Upload PDF → run full analysis → return results.
     * Test via Postman: POST /api/resume/analyse  (form-data, key=file, type=File)
     */
    @PostMapping("/analyse")
    public ResponseEntity<?> analyse(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/pdf")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only PDF files are accepted"));
        }

        try {
            log.info("Starting analysis for file: {}", file.getOriginalFilename());

            // Step 1: Extract text from PDF
            String resumeText = parseService.extractTextFromPdf(file);
            log.debug("Extracted {} characters from PDF", resumeText.length());

            // Step 2: AI calls (profile + score + improvements)
            log.info("Running AI profile extraction...");
            ResumeProfile profile = aiService.extractProfile(resumeText);

            log.info("Running ATS scoring...");
            ATSScoreCard scoreCard = aiService.scoreResume(resumeText);

            log.info("Generating improvement suggestions...");
            List<ImprovementSuggestion> improvements = aiService.generateImprovements(resumeText);

            // Step 3: Role matching (plain Java — no AI call)
            log.info("Matching roles from corpus...");
            List<JobRoleMatch> matchedRoles = jobMatchingService.matchRoles(profile.getSkills());

            // Build response
            FullAnalysisResponse response = FullAnalysisResponse.builder()
                    .profile(profile)
                    .scoreCard(scoreCard)
                    .improvements(improvements)
                    .matchedRoles(matchedRoles)
                    .build();

            // Store session
            SessionData sessionData = new SessionData();
            sessionData.setResumeText(resumeText);
            sessionData.setAnalysisResponse(response);
            String sessionId = sessionStore.createSession(sessionData);
            response.setSessionId(sessionId);

            log.info("Analysis complete. Session ID: {}", sessionId);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Analysis failed: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Analysis failed: " + e.getMessage()));
        }
    }
}
