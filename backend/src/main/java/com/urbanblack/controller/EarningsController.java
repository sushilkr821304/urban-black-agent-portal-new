package com.urbanblack.controller;

import com.urbanblack.entity.Agent;
import com.urbanblack.entity.User;
import com.urbanblack.repository.UserRepository;
import com.urbanblack.service.EarningsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/earnings")
public class EarningsController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EarningsService earningsService;

    private Agent getAuthenticatedAgent(Authentication authentication) {
        User user = userRepository.findByPhoneNumber(authentication.getName()).orElseThrow();
        if (user.getAgent() == null) throw new RuntimeException("Agent profile not found");
        return user.getAgent();
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(@RequestParam(defaultValue = "overall") String range, Authentication authentication) {
        Agent agent = getAuthenticatedAgent(authentication);
        return ResponseEntity.ok(earningsService.getEarningsSummary(agent.getId(), range));
    }

    @GetMapping("/bookings")
    public ResponseEntity<?> getBookings(@RequestParam(defaultValue = "20") int limit, Authentication authentication) {
        Agent agent = getAuthenticatedAgent(authentication);
        return ResponseEntity.ok(earningsService.getEarningsBookings(agent.getId(), limit));
    }

    @GetMapping("/today")
    public ResponseEntity<?> getToday(Authentication authentication) {
        Agent agent = getAuthenticatedAgent(authentication);
        return ResponseEntity.ok(earningsService.getEarningsSummary(agent.getId(), "today"));
    }

    @GetMapping("/weekly")
    public ResponseEntity<?> getWeekly(Authentication authentication) {
        Agent agent = getAuthenticatedAgent(authentication);
        return ResponseEntity.ok(earningsService.getEarningsSummary(agent.getId(), "weekly"));
    }

    @GetMapping("/monthly")
    public ResponseEntity<?> getMonthly(Authentication authentication) {
        Agent agent = getAuthenticatedAgent(authentication);
        return ResponseEntity.ok(earningsService.getEarningsSummary(agent.getId(), "monthly"));
    }
}
