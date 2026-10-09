package com.resumeai.model;

import lombok.Data;
import java.util.List;

@Data
public class JobDefinition {
    private String role;
    private String level;
    private List<String> requiredSkills;
    private List<String> preferredSkills;
    private List<String> keywords;
    private String description;
}
