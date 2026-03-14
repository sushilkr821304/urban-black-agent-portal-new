package com.urbanblack.controller;

import com.urbanblack.entity.Agent;
import com.urbanblack.entity.User;
import com.urbanblack.repository.UserRepository;
import com.urbanblack.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ScheduleService scheduleService;

    private Long getAgentId(Authentication authentication) {
        User user = userRepository.findByPhoneNumber(authentication.getName()).orElseThrow();
        Agent agent = user.getAgent();
        if (agent == null) throw new RuntimeException("Agent profile not found");
        return agent.getId();
    }

    @GetMapping
    public ResponseEntity<?> getSchedule(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Authentication authentication) {
        
        Long agentId = getAgentId(authentication);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("tripDate").ascending());

        if (date != null) {
            return ResponseEntity.ok(scheduleService.getTripsByDate(agentId, date, pageRequest));
        } else if (status != null && !status.isEmpty()) {
            return ResponseEntity.ok(scheduleService.getTripsByStatus(agentId, status, pageRequest));
        } else {
            return ResponseEntity.ok(scheduleService.getAllTrips(agentId, pageRequest));
        }
    }

    @GetMapping("/today")
    public ResponseEntity<?> getTodayTrips(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        return ResponseEntity.ok(scheduleService.getTodayTrips(getAgentId(authentication), PageRequest.of(page, size, Sort.by("tripDate").ascending())));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<?> getUpcomingTrips(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        return ResponseEntity.ok(scheduleService.getUpcomingTrips(getAgentId(authentication), PageRequest.of(page, size, Sort.by("tripDate").ascending())));
    }

    @GetMapping("/completed")
    public ResponseEntity<?> getCompletedTrips(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        return ResponseEntity.ok(scheduleService.getCompletedTrips(getAgentId(authentication), PageRequest.of(page, size, Sort.by("tripDate").descending())));
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchTrips(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        return ResponseEntity.ok(scheduleService.searchTrips(getAgentId(authentication), q, PageRequest.of(page, size, Sort.by("tripDate").ascending())));
    }
}
