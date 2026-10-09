package com.resumeai.service;

import com.resumeai.model.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIAnalysisService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    // ── 1. PROFILE EXTRACTION ─────────────────────────────────────────────────

    public ResumeProfile extractProfile(String resumeText) {
        resumeText = resumeText.replace("%", "%%");
        String prompt = """
                You are a resume parser. Extract structured information from the resume below.
                Return ONLY a valid JSON object — no markdown, no explanation, just raw JSON.

                JSON format:
                {
                  "name": "full name",
                  "email": "email or empty string",
                  "phone": "phone or empty string",
                  "summary": "professional summary or objective if present, else empty string",
                  "skills": ["skill1", "skill2"],
                  "experience": [{"title": "", "company": "", "duration": "", "description": ""}],
                  "education": [{"degree": "", "institution": "", "year": ""}],
                  "projects": [{"name": "", "technologies": [], "description": ""}],
                  "certifications": [],
                  "targetRoles": ["2-3 roles this candidate is best suited for based on their profile"]
                }

                Resume:
                %s
                """.formatted(resumeText);

        return callAndParse(prompt, ResumeProfile.class);
    }

    // ── 2. ATS SCORING ────────────────────────────────────────────────────────

    public ATSScoreCard scoreResume(String resumeText) {
        resumeText = resumeText.replace("%", "%%");
        String prompt = """
                You are an expert ATS system and career coach with deep knowledge of Indian tech hiring.
                Score this resume and return ONLY valid JSON — no markdown, no explanation.

                Scoring criteria (total 100 points):
                - atsKeywords: presence of industry-relevant keywords, action verbs (max 20)
                - skillsRelevance: relevance and depth of listed skills (max 25)
                - projectsExperience: quality and relevance of projects/experience (max 20)
                - impactQuantification: use of numbers/metrics to show impact (max 15)
                - roleAlignment: how well resume aligns to a clear target role (max 15)
                - clarityCompleteness: structure, contact info, all sections present (max 5)

                Return this exact JSON:
                {
                  "totalScore": <0-100>,
                  "sections": {
                    "atsKeywords": {"score": <0-20>, "maxScore": 20, "feedback": "specific feedback"},
                    "skillsRelevance": {"score": <0-25>, "maxScore": 25, "feedback": ""},
                    "projectsExperience": {"score": <0-20>, "maxScore": 20, "feedback": ""},
                    "impactQuantification": {"score": <0-15>, "maxScore": 15, "feedback": ""},
                    "roleAlignment": {"score": <0-15>, "maxScore": 15, "feedback": ""},
                    "clarityCompleteness": {"score": <0-5>, "maxScore": 5, "feedback": ""}
                  },
                  "strengths": ["strength1", "strength2", "strength3"],
                  "criticalIssues": ["issue1", "issue2", "issue3"]
                }

                Resume:
                %s
                """.formatted(resumeText);

        return callAndParse(prompt, ATSScoreCard.class);
    }

    // ── 3. IMPROVEMENT SUGGESTIONS ────────────────────────────────────────────

    public List<ImprovementSuggestion> generateImprovements(String resumeText) {
        resumeText = resumeText.replace("%", "%%");
        String prompt = """
                You are an expert resume writer. Identify the 4-5 weakest bullet points or descriptions
                in this resume and rewrite them to be stronger.
                Return ONLY a valid JSON array — no markdown, no explanation.

                Rules for improvement:
                - Start with a strong action verb (Built, Designed, Implemented, Reduced, Increased)
                - Mention specific technologies used
                - Add quantified impact where possible (%%, users, time saved, requests/sec)
                - Be concrete and specific, not vague

                Return this JSON array:
                [
                  {
                    "original": "exact original text from resume",
                    "improved": "improved version",
                    "reason": "brief reason why this is better"
                  }
                ]

                Resume:
                %s
                """.formatted(resumeText);

        return callAndParseList(prompt, ImprovementSuggestion.class);
    }

    // ── 4. SKILL GAP ANALYSIS (on-demand per selected role) ──────────────────

    public SkillGapReport analyseSkillGap(List<String> candidateSkills,
                                          String targetRole,
                                          List<String> requiredSkills,
                                          List<String> preferredSkills) {
        String prompt = """
                You are a career coach. Analyse the skill gap for this candidate.
                Return ONLY valid JSON — no markdown, no explanation.

                Candidate skills: %s
                Target role: %s
                Required skills for role: %s
                Preferred skills for role: %s

                Rules:
                - "strong": skills the candidate has that are required for the role
                - "partial": skills they have listed but need more depth for this role
                - "missing": required skills completely absent from their profile
                - "priorityLearning": top 3-4 missing skills ranked by importance, with a free resource

                Return this JSON:
                {
                  "targetRole": "%s",
                  "strong": [],
                  "partial": [],
                  "missing": [],
                  "priorityLearning": [
                    {"skill": "", "reason": "why critical for this role", "resource": "free course or platform"}
                  ]
                }
                """.formatted(
                candidateSkills,
                targetRole,
                requiredSkills,
                preferredSkills,
                targetRole
        );

        return callAndParse(prompt, SkillGapReport.class);
    }

    // ── HELPERS ───────────────────────────────────────────────────────────────

    private <T> T callAndParse(String prompt, Class<T> type) {
        try {
            String response = chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
            log.debug("Raw AI response for {}: {}", type.getSimpleName(), response);
            String cleaned = extractJson(response, false);
            return objectMapper.readValue(cleaned, type);
        } catch (Exception e) {
            log.error("AI call failed for type {}: {}", type.getSimpleName(), e.getMessage());
            throw new RuntimeException("AI analysis failed: " + e.getMessage(), e);
        }
    }

    private <T> List<T> callAndParseList(String prompt, Class<T> type) {
        try {
            String response = chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
            log.debug("Raw AI response for List<{}>: {}", type.getSimpleName(), response);
            String cleaned = extractJson(response, true);
            var listType = objectMapper.getTypeFactory().constructCollectionType(List.class, type);
            return objectMapper.readValue(cleaned, listType);
        } catch (Exception e) {
            log.error("AI list call failed for type {}: {}", type.getSimpleName(), e.getMessage());
            throw new RuntimeException("AI analysis failed: " + e.getMessage(), e);
        }
    }

    /**
     * Strips markdown fences and extracts the first JSON object or array from the AI response.
     * Handles cases where the model adds explanatory text before/after the JSON.
     */
    private String extractJson(String raw, boolean expectArray) {
        if (raw == null) return expectArray ? "[]" : "{}";
        String trimmed = raw.trim();

        // Strip markdown code fences (```json ... ``` or ``` ... ```)
        if (trimmed.startsWith("```")) {
            trimmed = trimmed.replaceFirst("(?s)^```[a-zA-Z]*\\s*", "")
                             .replaceFirst("(?s)\\s*```$", "")
                             .trim();
        }

        // If the response starts with the expected delimiter, use it directly
        char startChar = expectArray ? '[' : '{';
        if (trimmed.charAt(0) == startChar) {
            return trimmed;
        }

        // Otherwise, find the first occurrence of [ or { and extract to matching close
        int startIdx = trimmed.indexOf(startChar);
        if (startIdx == -1) {
            // Fallback: try the other delimiter
            startIdx = trimmed.indexOf(expectArray ? '{' : '[');
        }
        if (startIdx != -1) {
            log.warn("AI response had leading text; extracting JSON from index {}", startIdx);
            return trimmed.substring(startIdx);
        }

        log.error("Could not extract JSON from AI response: {}", trimmed);
        return expectArray ? "[]" : "{}";
    }
}
