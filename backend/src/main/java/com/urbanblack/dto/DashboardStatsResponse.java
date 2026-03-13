package com.urbanblack.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class DashboardStatsResponse {
    private Double walletBalance;
    private Long todayBookings;
    private Long totalBookings;
    private Double overallEarnings;
    private Double todayCommission;
    private Long pendingBookings;
    private Long completedBookings;
    private Long cancelledBookings;
}
