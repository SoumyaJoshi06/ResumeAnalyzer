package com.resumeai.model;

import lombok.Data;
import java.util.List;

@Data
public class ResumeProfile {
    private String name;
    private String email;
    private String phone;
    private String summary;
    private List<String> skills;
    private List<Experience> experience;
    private List<Education> education;
    private List<Project> projects;
    private List<String> certifications;
    private List<String> targetRoles;

    @Data
    public static class Experience {
        private String title;
        private String company;
        private String duration;
        private String description;
    }

    @Data
    public static class Education {
        private String degree;
        private String institution;
        private String year;
    }

    @Data
    public static class Project {
        private String name;
        private List<String> technologies;
        private String description;
    }
}
