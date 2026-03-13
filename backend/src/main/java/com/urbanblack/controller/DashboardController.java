package com.urbanblack.controller;

import com.urbanblack.dto.DashboardStatsResponse;
import com.urbanblack.entity.ActivityLog;
import com.urbanblack.entity.Agent;
import com.urbanblack.entity.Booking;
import com.urbanblack.entity.User;
import com.urbanblack.repository.UserRepository;
import com.urbanblack.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserRepository userRepository;

    private Agent getCurrentAgent() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        User user = userRepository.findByPhoneNumber(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getAgent();
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getStats() {
        return ResponseEntity.ok(dashboardService.getStats(getCurrentAgent()));
    }

    @GetMapping("/recent-bookings")
    public ResponseEntity<List<Booking>> getRecentBookings() {
        return ResponseEntity.ok(dashboardService.getRecentBookings(getCurrentAgent()));
    }

    @GetMapping("/activities")
    public ResponseEntity<List<ActivityLog>> getActivities() {
        return ResponseEntity.ok(dashboardService.getRecentActivities(getCurrentAgent()));
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Agent agent = getCurrentAgent();
        DashboardStatsResponse stats = dashboardService.getStats(agent);
        
        Map<String, Object> analytics = new HashMap<>();
        
        // Booking Distribution
        Map<String, Long> distribution = new HashMap<>();
        distribution.put("Completed", stats.getCompletedBookings());
        distribution.put("Pending", stats.getPendingBookings());
        distribution.put("Cancelled", stats.getCancelledBookings());
        analytics.put("distribution", distribution);
        
        // Mock Revenue Data (Weekly/Monthly)
        analytics.put("revenueLabels", List.of("Jan", "Feb", "Mar", "Apr", "May", "Jun"));
        analytics.put("revenueData", List.of(12000, 15000, 8000, 22000, 18000, 25000));
        
        return ResponseEntity.ok(analytics);
    }
}
