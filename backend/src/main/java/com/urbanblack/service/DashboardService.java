package com.urbanblack.service;

import com.urbanblack.dto.DashboardStatsResponse;
import com.urbanblack.entity.ActivityLog;
import com.urbanblack.entity.Agent;
import com.urbanblack.entity.Booking;
import com.urbanblack.repository.ActivityLogRepository;
import com.urbanblack.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BookingRepository bookingRepository;
    private final ActivityLogRepository activityLogRepository;

    public DashboardStatsResponse getStats(Agent agent) {
        Long agentId = agent.getId();
        LocalDateTime todayStart = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        
        long todayBookings = bookingRepository.findRecentByAgentId(agentId, todayStart).size();
        long totalBookings = bookingRepository.countByAgentId(agentId);
        long upcomingBookings = bookingRepository.countByAgentIdAndStatus(agentId, "NEW");
        long assignedBookings = bookingRepository.countByAgentIdAndStatus(agentId, "ASSIGNED");
        long inProgressBookings = bookingRepository.countByAgentIdAndStatus(agentId, "IN_PROGRESS");
        long completedBookings = bookingRepository.countByAgentIdAndStatus(agentId, "COMPLETED");
        long cancelledBookings = bookingRepository.countByAgentIdAndStatus(agentId, "CANCELLED");
        
        Double totalEarnings = bookingRepository.sumTotalEarningsByAgentId(agentId);
        Double totalAgentEarnings = bookingRepository.sumTotalAgentEarnings(agentId);
        Double walletBalance = agent.getWallet() != null ? agent.getWallet().getBalance() : 0.0;

        // Calculate today's commission (agent earnings for today's completed bookings)
        Double todayCommission = bookingRepository.findRecentByAgentId(agentId, todayStart).stream()
                .filter(b -> "COMPLETED".equals(b.getStatus()))
                .mapToDouble(b -> b.getAgentEarning() != null ? b.getAgentEarning() : 0.0)
                .sum();

        return DashboardStatsResponse.builder()
                .walletBalance(walletBalance)
                .todayBookings(todayBookings)
                .totalBookings(totalBookings)
                .overallEarnings(totalAgentEarnings != null ? totalAgentEarnings : 0.0)
                .todayCommission(todayCommission)
                .pendingBookings(upcomingBookings + assignedBookings + inProgressBookings)
                .completedBookings(completedBookings)
                .cancelledBookings(cancelledBookings)
                .build();
    }

    public List<Booking> getRecentBookings(Agent agent) {
        return bookingRepository.findRecentByAgentId(agent.getId(), LocalDateTime.now().minusDays(30));
    }

    public List<ActivityLog> getRecentActivities(Agent agent) {
        return activityLogRepository.findByAgentIdOrderByCreatedAtDesc(agent.getId());
    }
    
    public void logActivity(Agent agent, String type, String description) {
        ActivityLog log = ActivityLog.builder()
                .agent(agent)
                .type(type)
                .description(description)
                .build();
        activityLogRepository.save(log);
    }
    public Map<String, Object> getAnalytics(Agent agent) {
        Long agentId = agent.getId();
        Map<String, Object> analytics = new HashMap<>();

        // 1. Booking Distribution
        Map<String, Long> distribution = new LinkedHashMap<>();
        distribution.put("Completed", bookingRepository.countByAgentIdAndStatus(agentId, "COMPLETED"));
        distribution.put("Pending", bookingRepository.countByAgentIdAndStatus(agentId, "NEW") + 
                                   bookingRepository.countByAgentIdAndStatus(agentId, "ASSIGNED") + 
                                   bookingRepository.countByAgentIdAndStatus(agentId, "IN_PROGRESS"));
        distribution.put("Cancelled", bookingRepository.countByAgentIdAndStatus(agentId, "CANCELLED"));
        analytics.put("distribution", distribution);

        // 2. Revenue Trend (Last 6 Months)
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(5).withDayOfMonth(1).with(LocalTime.MIN);
        List<Booking> recentBookings = bookingRepository.findAllForReports(agentId, sixMonthsAgo, LocalDateTime.now());

        Map<String, Double> revenueTrend = new LinkedHashMap<>();
        
        // Initialize last 6 months with 0
        for (int i = 5; i >= 0; i--) {
            String monthName = LocalDateTime.now().minusMonths(i).getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            revenueTrend.put(monthName, 0.0);
        }

        // Fill with real data
        for (Booking b : recentBookings) {
            if ("COMPLETED".equals(b.getStatus()) && b.getAmount() != null) {
                String monthName = b.getTripDate().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
                if (revenueTrend.containsKey(monthName)) {
                    revenueTrend.put(monthName, revenueTrend.get(monthName) + b.getAmount());
                }
            }
        }

        analytics.put("revenueLabels", new ArrayList<>(revenueTrend.keySet()));
        analytics.put("revenueData", new ArrayList<>(revenueTrend.values()));
        analytics.put("hasData", recentBookings.size() > 0);

        return analytics;
    }
}
