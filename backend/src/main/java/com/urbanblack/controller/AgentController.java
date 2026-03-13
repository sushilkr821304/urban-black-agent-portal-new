package com.urbanblack.controller;

import com.urbanblack.entity.Agent;
import com.urbanblack.entity.User;
import com.urbanblack.repository.AgentRepository;
import com.urbanblack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/agents")
public class AgentController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    AgentRepository agentRepository;

    @Autowired
    com.urbanblack.service.CloudinaryService cloudinaryService;

    @GetMapping("/dashboard/profile")
    public ResponseEntity<?> getDashboardProfile(Authentication authentication) {
        User user = userRepository.findByPhoneNumber(authentication.getName()).get();
        return ResponseEntity.ok(user.getAgent());
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        User user = userRepository.findByPhoneNumber(authentication.getName()).get();
        return ResponseEntity.ok(user.getAgent());
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam(value = "dob", required = false) String dob,
            @RequestParam(value = "gender", required = false) String gender,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "city", required = false) String city,
            @RequestParam(value = "state", required = false) String state,
            @RequestParam(value = "pincode", required = false) String pincode,
            @RequestParam(value = "agencyName", required = false) String agencyName,
            @RequestParam(value = "alternateMobile", required = false) String alternateMobile,
            @RequestParam(value = "experienceYears", required = false) String experienceYears,
            @RequestParam(value = "specialization", required = false) String specialization,
            @RequestParam(value = "education", required = false) String education,
            @RequestParam(value = "languages", required = false) String languages,
            @RequestParam(value = "profilePhoto", required = false) MultipartFile file,
            Authentication authentication) {
        
        try {
            User user = userRepository.findByPhoneNumber(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Agent agent = user.getAgent();
            
            if (agent == null) {
                agent = new Agent();
                agent.setUser(user);
                
                // Initialize Wallet for new agent
                com.urbanblack.entity.Wallet wallet = new com.urbanblack.entity.Wallet();
                wallet.setAgent(agent);
                wallet.setBalance(0.0);
                agent.setWallet(wallet);
            }
            
            if (name != null) agent.setName(name);
            if (email != null) agent.setEmail(email);
            if (dob != null) agent.setDob(dob);
            if (gender != null) agent.setGender(gender);
            if (address != null) agent.setAddress(address);
            if (city != null) agent.setCity(city);
            if (state != null) agent.setState(state);
            if (pincode != null) agent.setPincode(pincode);
            if (agencyName != null) agent.setAgencyName(agencyName);
            if (alternateMobile != null) agent.setAlternateMobile(alternateMobile);
            
            if (experienceYears != null && !experienceYears.isEmpty() && !experienceYears.equals("null") && !experienceYears.equals("undefined")) {
                try {
                    agent.setExperienceYears(Integer.parseInt(experienceYears));
                } catch (NumberFormatException e) {
                    // Ignore invalid format
                }
            }
            
            if (specialization != null) agent.setSpecialization(specialization);
            if (education != null) agent.setEducation(education);
            if (languages != null) agent.setLanguages(languages);
            
            if (file != null && !file.isEmpty()) {
                String photoUrl = cloudinaryService.uploadFile(file, "agents/profile");
                agent.setProfilePhoto(photoUrl);
            }
            
            agentRepository.save(agent);
            return ResponseEntity.ok(agent);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating profile: " + e.getMessage());
        }
    }
}
