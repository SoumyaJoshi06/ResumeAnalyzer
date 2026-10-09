package com.resumeai.model;

import lombok.Data;
import java.util.List;

@Data
public class SkillGapReport {
    private String targetRole;
    private List<String> strong;
    private List<String> partial;
    private List<String> missing;
    private List<PrioritySkill> priorityLearning;

    @Data
    public static class PrioritySkill {
        private String skill;
        private String reason;
        private String resource;
    }
}
