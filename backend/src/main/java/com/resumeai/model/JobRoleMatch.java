package com.resumeai.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class JobRoleMatch {
    private String role;
    private int matchPercentage;
    private List<String> matchedSkills;
    private List<String> missingSkills;
}
