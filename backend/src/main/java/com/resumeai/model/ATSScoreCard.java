package com.resumeai.model;

import lombok.Data;
import java.util.List;

@Data
public class ATSScoreCard {
    private int totalScore;
    private ATSSections sections;
    private List<String> strengths;
    private List<String> criticalIssues;

    @Data
    public static class ATSSections {
        private SectionScore atsKeywords;
        private SectionScore skillsRelevance;
        private SectionScore projectsExperience;
        private SectionScore impactQuantification;
        private SectionScore roleAlignment;
        private SectionScore clarityCompleteness;
    }

    @Data
    public static class SectionScore {
        private int score;
        private int maxScore;
        private String feedback;
    }
}
