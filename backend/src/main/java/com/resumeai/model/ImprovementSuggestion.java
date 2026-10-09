package com.resumeai.model;

import lombok.Data;

@Data
public class ImprovementSuggestion {
    private String original;
    private String improved;
    private String reason;
}
