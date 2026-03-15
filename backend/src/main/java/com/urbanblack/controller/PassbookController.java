package com.urbanblack.controller;

import com.urbanblack.entity.Agent;
import com.urbanblack.entity.User;
import com.urbanblack.repository.UserRepository;
import com.urbanblack.service.PassbookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/passbook")
public class PassbookController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PassbookService passbookService;

    private Agent getAuthenticatedAgent(Authentication authentication) {
        User user = userRepository.findByPhoneNumber(authentication.getName()).orElseThrow();
        if (user.getAgent() == null) throw new RuntimeException("Agent profile not found");
        return user.getAgent();
    }

    @GetMapping
    public ResponseEntity<?> getPassbook(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Agent agent = getAuthenticatedAgent(authentication);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(passbookService.getTransactions(agent.getId(), pageable));
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filterPassbook(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Agent agent = getAuthenticatedAgent(authentication);
        Pageable pageable = PageRequest.of(page, size);
        LocalDateTime start = fromDate.atStartOfDay();
        LocalDateTime end = toDate.atTime(LocalTime.MAX);
        return ResponseEntity.ok(passbookService.filterTransactions(agent.getId(), start, end, pageable));
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(Authentication authentication) {
        Agent agent = getAuthenticatedAgent(authentication);
        return ResponseEntity.ok(passbookService.getSummary(agent));
    }
}
