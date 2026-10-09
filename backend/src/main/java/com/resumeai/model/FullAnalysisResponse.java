package com.resumeai.model;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class FullAnalysisResponse {
    private String sessionId;
    private ResumeProfile profile;
    private ATSScoreCard scoreCard;
    private List<ImprovementSuggestion> improvements;
    private List<JobRoleMatch> matchedRoles;
}
