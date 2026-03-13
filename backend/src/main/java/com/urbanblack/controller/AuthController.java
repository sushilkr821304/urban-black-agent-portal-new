package com.urbanblack.controller;

import com.urbanblack.dto.JwtResponse;
import com.urbanblack.dto.LoginRequest;
import com.urbanblack.dto.SignupRequest;
import com.urbanblack.entity.Agent;
import com.urbanblack.entity.User;
import com.urbanblack.entity.Wallet;
import com.urbanblack.repository.AgentRepository;
import com.urbanblack.repository.UserRepository;
import com.urbanblack.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    AgentRepository agentRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    com.urbanblack.service.OtpService otpService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getPhoneNumber(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(loginRequest.getPhoneNumber());

        User user = userRepository.findByPhoneNumber(loginRequest.getPhoneNumber()).get();

        return ResponseEntity.ok(new JwtResponse(jwt, user.getId(), user.getPhoneNumber()));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody java.util.Map<String, String> request) {
        String phoneNumber = request.get("phoneNumber");
        if (phoneNumber == null || phoneNumber.length() != 10) {
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("message", "Invalid phone number"));
        }
        
        if (userRepository.findByPhoneNumber(phoneNumber).isPresent()) {
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("message", "Phone number is already registered"));
        }
        
        otpService.generateAndSendOtp(phoneNumber);
        return ResponseEntity.ok(java.util.Collections.singletonMap("message", "OTP sent successfully"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody java.util.Map<String, String> request) {
        String phoneNumber = request.get("phoneNumber");
        String otp = request.get("otp");
        
        boolean isValid = otpService.verifyOtp(phoneNumber, otp);
        
        if (isValid) {
            return ResponseEntity.ok(java.util.Collections.singletonMap("message", "OTP verified successfully"));
        } else {
            return ResponseEntity.status(400).body(java.util.Collections.singletonMap("message", "Invalid or expired OTP"));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.findByPhoneNumber(signUpRequest.getPhoneNumber()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Phone number is already in use!");
        }

        // Create new user's account
        User user = User.builder()
                .phoneNumber(signUpRequest.getPhoneNumber())
                .password(encoder.encode(signUpRequest.getPassword()))
                .role("ROLE_AGENT")
                .isVerified(true)
                .build();

        user = userRepository.save(user);

        // Create associated agent profile
        Agent agent = Agent.builder()
                .user(user)
                .name("New Agent")
                .email("")
                .totalBookings(0)
                .completedJobs(0)
                .pendingRequests(0)
                .monthlyEarnings(0.0)
                .build();
        
        Wallet wallet = Wallet.builder().agent(agent).balance(0.0).build();
        agent.setWallet(wallet);
        
        agentRepository.save(agent);

        return ResponseEntity.ok("User registered successfully!");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        User user = userRepository.findByPhoneNumber(authentication.getName()).get();
        return ResponseEntity.ok(user);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody java.util.Map<String, String> request, Authentication authentication) {
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");
        
        User user = userRepository.findByPhoneNumber(authentication.getName()).get();
        
        if (!encoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("message", "Incorrect current password"));
        }
        
        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);
        
        return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Password updated successfully"));
    }
}
