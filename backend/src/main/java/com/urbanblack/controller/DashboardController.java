package com.urbanblack.controller;

import com.urbanblack.entity.Agent;
import com.urbanblack.entity.Booking;
import com.urbanblack.entity.User;
import com.urbanblack.repository.AgentRepository;
import com.urbanblack.repository.BookingRepository;
import com.urbanblack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    AgentRepository agentRepository;

    @Autowired
    BookingRepository bookingRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(Authentication authentication) {
        String phoneNumber = authentication.getName();
        User user = userRepository.findByPhoneNumber(phoneNumber).get();
        Agent agent = agentRepository.findByUserId(user.getId()).get();

        List<Booking> recentBookings = bookingRepository.findByAgentIdOrderByDateDesc(agent.getId());
        if (recentBookings.size() > 5) {
            recentBookings = recentBookings.subList(0, 5);
        }

        Map<String, Object> response = new HashMap<>();
        
        List<Map<String, Object>> stats = new ArrayList<>();
        stats.add(createStat("Total Bookings", agent.getTotalBookings().toString(), "+12%", "#6C2BD9"));
        stats.add(createStat("Completed Jobs", agent.getCompletedJobs().toString(), "+8%", "#10B981"));
        stats.add(createStat("Pending Requests", agent.getPendingRequests().toString(), "-2%", "#F59E0B"));
        stats.add(createStat("Monthly Earnings", "₹" + agent.getMonthlyEarnings(), "+15%", "#EC4899"));
        stats.add(createStat("Wallet Balance", "₹" + (agent.getWallet() != null ? agent.getWallet().getBalance() : 0), null, "#3B82F6"));
        stats.add(createStat("Customer Rating", agent.getRating().toString(), "Top 5%", "#F59E0B"));

        response.put("stats", stats);
        response.put("recentBookings", recentBookings);
        response.put("kycStatus", agent.getKyc() != null ? agent.getKyc().getKycStatus() : "Pending");

        return ResponseEntity.ok(response);
    }

    private Map<String, Object> createStat(String title, String value, String trend, String color) {
        Map<String, Object> stat = new HashMap<>();
        stat.put("title", title);
        stat.put("value", value);
        stat.put("trend", trend);
        stat.put("color", color);
        return stat;
    }
}
