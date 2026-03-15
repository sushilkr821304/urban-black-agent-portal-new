package com.urbanblack.dto;

import lombok.*;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EarningsSummaryDTO {
    private Double todayEarnings;
    private Double weeklyEarnings;
    private Double monthlyEarnings;
    private Double totalEarnings;
    
    private Long totalTrips;
    private Double averageEarningsPerTrip;
    
    // For Breakdown Pie Chart
    private Double totalFareCollected;
    private Double totalCommission;
    private Double netAgentEarnings;
    
    // For Trend Chart
    private Map<String, Double> earningsTrend; // Date -> Amount
    
    // Growth percentages (placeholders for UI)
    @Builder.Default
    private String todayGrowth = "+5%";
    @Builder.Default
    private String weeklyGrowth = "+12%";
    @Builder.Default
    private String monthlyGrowth = "+8%";
    @Builder.Default
    private String totalGrowth = "+15%";
}
