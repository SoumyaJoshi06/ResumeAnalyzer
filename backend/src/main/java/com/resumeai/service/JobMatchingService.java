package com.resumeai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumeai.model.JobDefinition;
import com.resumeai.model.JobRoleMatch;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobMatchingService {

    private final ObjectMapper objectMapper;
    private List<JobDefinition> jobCatalogue = new ArrayList<>();

    @PostConstruct
    public void loadCatalogue() {
        try {
            PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            Resource[] resources = resolver.getResources("classpath:jd-corpus/*.json");
            for (Resource resource : resources) {
                JobDefinition jd = objectMapper.readValue(resource.getInputStream(), JobDefinition.class);
                jobCatalogue.add(jd);
                log.debug("Loaded JD: {}", jd.getRole());
            }
            log.info("Loaded {} job definitions from corpus", jobCatalogue.size());
        } catch (Exception e) {
            log.error("Failed to load JD corpus: {}", e.getMessage());
        }
    }

    /**
     * Match candidate skills against all roles in the catalogue.
     * Returns top 5 matches sorted by match percentage (descending).
     */
    public List<JobRoleMatch> matchRoles(List<String> candidateSkills) {
        if (candidateSkills == null || candidateSkills.isEmpty()) return List.of();

        Set<String> normalizedCandidate = candidateSkills.stream()
                .map(this::normalize)
                .collect(Collectors.toSet());

        return jobCatalogue.stream()
                .map(jd -> computeMatch(jd, normalizedCandidate))
                .sorted(Comparator.comparingInt(JobRoleMatch::getMatchPercentage).reversed())
                .limit(5)
                .collect(Collectors.toList());
    }

    public Optional<JobDefinition> findByRole(String role) {
        return jobCatalogue.stream()
                .filter(jd -> jd.getRole().equalsIgnoreCase(role))
                .findFirst();
    }

    public List<JobDefinition> getAllRoles() {
        return Collections.unmodifiableList(jobCatalogue);
    }

    private JobRoleMatch computeMatch(JobDefinition jd, Set<String> candidateSkills) {
        List<String> allRequired = jd.getRequiredSkills().stream()
                .map(this::normalize).toList();
        List<String> allPreferred = jd.getPreferredSkills().stream()
                .map(this::normalize).toList();

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String skill : allRequired) {
            if (candidateSkills.contains(skill)) {
                matched.add(skill);
            } else {
                missing.add(skill);
            }
        }

        // Preferred skills contribute a smaller bonus
        int preferredMatched = (int) allPreferred.stream()
                .filter(candidateSkills::contains)
                .count();

        int requiredScore = allRequired.isEmpty() ? 0
                : (int) ((double) matched.size() / allRequired.size() * 80);
        int preferredScore = allPreferred.isEmpty() ? 0
                : (int) ((double) preferredMatched / allPreferred.size() * 20);

        int matchPercentage = Math.min(100, requiredScore + preferredScore);

        return new JobRoleMatch(
                jd.getRole(),
                matchPercentage,
                matched.stream().map(s -> capitalize(s)).collect(Collectors.toList()),
                missing.stream().map(s -> capitalize(s)).collect(Collectors.toList())
        );
    }

    /** Lowercase and strip spaces/hyphens/dots so "Spring Boot" == "springboot" == "spring-boot" */
    private String normalize(String s) {
        if (s == null) return "";
        return s.toLowerCase().replaceAll("[\\s\\-_./]", "");
    }

    private String capitalize(String s) {
        if (s == null || s.isEmpty()) return s;
        return Character.toUpperCase(s.charAt(0)) + s.substring(1);
    }
}
