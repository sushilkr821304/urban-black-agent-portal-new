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
@RequestMapping("/api/profile")
public class AgentController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    AgentRepository agentRepository;

    @GetMapping
    public ResponseEntity<?> getProfile(Authentication authentication) {
        User user = userRepository.findByPhoneNumber(authentication.getName()).get();
        return ResponseEntity.ok(user.getAgent());
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("agencyName") String agencyName,
            @RequestParam(value = "profilePhoto", required = false) MultipartFile file,
            Authentication authentication) throws IOException {
        
        User user = userRepository.findByPhoneNumber(authentication.getName()).get();
        Agent agent = user.getAgent();
        
        agent.setName(name);
        agent.setEmail(email);
        agent.setAgencyName(agencyName);
        
        if (file != null) {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path path = Paths.get("./uploads/profile");
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }
            Files.copy(file.getInputStream(), path.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
            agent.setProfilePhoto("uploads/profile/" + fileName);
        }
        
        agentRepository.save(agent);
        return ResponseEntity.ok(agent);
    }
}
