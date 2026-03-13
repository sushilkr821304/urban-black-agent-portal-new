package com.urbanblack.controller;

import com.razorpay.RazorpayException;
import com.urbanblack.dto.PaymentOrderRequest;
import com.urbanblack.dto.PaymentOrderResponse;
import com.urbanblack.dto.PaymentVerificationRequest;
import com.urbanblack.entity.Agent;
import com.urbanblack.entity.User;
import com.urbanblack.repository.UserRepository;
import com.urbanblack.service.RazorpayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final RazorpayService razorpayService;
    private final UserRepository userRepository;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentOrderRequest request, 
                                         @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String phoneNumber = userDetails.getUsername();
            Optional<User> userOpt = userRepository.findByPhoneNumber(phoneNumber);
            
            if (userOpt.isEmpty() || userOpt.get().getAgent() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Agent not found"));
            }

            Agent agent = userOpt.get().getAgent();
            PaymentOrderResponse response = razorpayService.createPaymentOrder(request, agent);
            return ResponseEntity.ok(response);
        } catch (RazorpayException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating Razorpay order: " + e.getMessage()));
        }
    }

    @PostMapping("/verify-signature")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        boolean isValid = razorpayService.verifyPaymentSignature(request);
        if (isValid) {
            return ResponseEntity.ok(Map.of("message", "Payment verified successfully", "status", "SUCCESS"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Invalid payment signature", "status", "FAILED"));
        }
    }
    @GetMapping("/all")
    public ResponseEntity<?> getAllPayments() {
        return ResponseEntity.ok(razorpayService.getAllPayments());
    }

    @GetMapping
    public ResponseEntity<?> getMyPayments(@AuthenticationPrincipal UserDetails userDetails) {
        String phoneNumber = userDetails.getUsername();
        Optional<User> userOpt = userRepository.findByPhoneNumber(phoneNumber);
        
        if (userOpt.isEmpty() || userOpt.get().getAgent() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Agent not found"));
        }

        Agent agent = userOpt.get().getAgent();
        return ResponseEntity.ok(razorpayService.getPaymentsForAgent(agent.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentById(@PathVariable Long id) {
        return razorpayService.getPaymentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Status is required"));
        }

        return razorpayService.updatePaymentStatus(id, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePayment(@PathVariable Long id) {
        boolean deleted = razorpayService.deletePayment(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Payment deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
