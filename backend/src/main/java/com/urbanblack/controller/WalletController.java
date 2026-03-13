package com.urbanblack.controller;

import com.urbanblack.entity.Agent;
import com.urbanblack.entity.PaymentTransaction;
import com.urbanblack.entity.User;
import com.urbanblack.repository.PaymentTransactionRepository;
import com.urbanblack.repository.UserRepository;
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
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final UserRepository userRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;

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

    @GetMapping("/balance")
    public ResponseEntity<Map<String, Object>> getBalance() {
        Agent agent = getCurrentAgent();
        Map<String, Object> response = new HashMap<>();
        response.put("balance", agent.getWallet() != null ? agent.getWallet().getBalance() : 0.0);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<PaymentTransaction>> getTransactions() {
        return ResponseEntity.ok(paymentTransactionRepository.findByAgentId(getCurrentAgent().getId()));
    }
}
