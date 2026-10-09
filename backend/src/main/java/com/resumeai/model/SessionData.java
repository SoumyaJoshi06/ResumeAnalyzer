package com.resumeai.model;

import lombok.Data;

@Data
public class SessionData {
    private String resumeText;
    private FullAnalysisResponse analysisResponse;
}
