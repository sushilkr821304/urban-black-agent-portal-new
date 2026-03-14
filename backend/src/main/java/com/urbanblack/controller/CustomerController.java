package com.urbanblack.controller;

import com.urbanblack.entity.Agent;
import com.urbanblack.entity.User;
import com.urbanblack.repository.UserRepository;
import com.urbanblack.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerService customerService;

    private Long getAgentId(Authentication authentication) {
        User user = userRepository.findByPhoneNumber(authentication.getName()).orElseThrow();
        Agent agent = user.getAgent();
        if (agent == null) throw new RuntimeException("Agent profile not found");
        return agent.getId();
    }

    @GetMapping
    public ResponseEntity<?> getCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String query,
            Authentication authentication) {
        
        Long agentId = getAgentId(authentication);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("id").descending());

        return ResponseEntity.ok(customerService.getCustomers(agentId, query, pageRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(customerService.getCustomerById(id, getAgentId(authentication)));
    }

    @GetMapping("/{id}/bookings")
    public ResponseEntity<?> getCustomerBookings(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(customerService.getCustomerBookings(id, getAgentId(authentication)));
    }
}
