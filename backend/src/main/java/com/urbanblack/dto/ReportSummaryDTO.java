package com.urbanblack.dto;

import lombok.*;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportSummaryDTO {
    private Long totalBookings;
    private Long completedTrips;
    private Long cancelledTrips;
    private Double totalRevenue;
    
    // Earnings breakdown
    private Double totalFareCollected;
    private Double platformCommission;
    private Double netAgentEarnings;

    // For charts
    private Map<String, Double> bookingsTrend; // Date -> Count
    private Map<String, Double> revenueTrend;  // Date -> Revenue
    private Map<String, Long> statusDistribution;
}
