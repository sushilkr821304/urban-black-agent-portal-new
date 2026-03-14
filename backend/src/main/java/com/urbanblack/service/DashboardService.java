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
import java.util.List;

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
        long upcomingBookings = bookingRepository.countByAgentIdAndStatus(agentId, "Upcoming");
        long assignedBookings = bookingRepository.countByAgentIdAndStatus(agentId, "Assigned");
        long inProgressBookings = bookingRepository.countByAgentIdAndStatus(agentId, "In Progress");
        long completedBookings = bookingRepository.countByAgentIdAndStatus(agentId, "Completed");
        long cancelledBookings = bookingRepository.countByAgentIdAndStatus(agentId, "Cancelled");
        
        Double totalEarnings = bookingRepository.sumTotalEarningsByAgentId(agentId);
        Double walletBalance = agent.getWallet() != null ? agent.getWallet().getBalance() : 0.0;

        return DashboardStatsResponse.builder()
                .walletBalance(walletBalance)
                .todayBookings(todayBookings)
                .totalBookings(totalBookings)
                .overallEarnings(totalEarnings != null ? totalEarnings : 0.0)
                .todayCommission(todayBookings * 50.0) // Mock commission logic
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
}
