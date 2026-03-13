package com.urbanblack.controller;

import com.urbanblack.entity.Agent;
import com.urbanblack.entity.KYC;
import com.urbanblack.entity.User;
import com.urbanblack.repository.AgentRepository;
import com.urbanblack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.Collections;
import java.util.UUID;

@RestController
@RequestMapping("/api/kyc")
public class KYCController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    AgentRepository agentRepository;

    @Value("${upload.path}")
    private String uploadPath;

    @PostMapping("/submit")
    public ResponseEntity<?> submitKyc(
            @RequestParam("agencyName") String agencyName,
            @RequestParam("email") String email,
            @RequestParam("aadharNumber") String aadharNumber,
            @RequestParam("panNumber") String panNumber,
            @RequestParam("pinCode") String pinCode,
            @RequestParam("city") String city,
            @RequestParam("state") String state,
            @RequestParam(value = "aadharFront", required = false) MultipartFile aadharFront,
            @RequestParam(value = "aadharBack", required = false) MultipartFile aadharBack,
            @RequestParam(value = "panCard", required = false) MultipartFile panCard,
            Authentication authentication) throws IOException {

        User user = userRepository.findByPhoneNumber(authentication.getName()).get();
        Agent agent = agentRepository.findByUserId(user.getId()).get();

        KYC kyc = agent.getKyc();
        if (kyc == null) {
            kyc = new KYC();
            kyc.setAgent(agent);
        }

        kyc.setAgencyName(agencyName);
        kyc.setEmail(email);
        kyc.setAadharNumber(aadharNumber);
        kyc.setPanNumber(panNumber);
        kyc.setPinCode(pinCode);
        kyc.setCity(city);
        kyc.setState(state);
        kyc.setKycStatus("In Progress");

        if (aadharFront != null) kyc.setAadharFrontImage(saveFile(aadharFront));
        if (aadharBack != null) kyc.setAadharBackImage(saveFile(aadharBack));
        if (panCard != null) kyc.setPanImage(saveFile(panCard));

        agent.setKyc(kyc);
        agentRepository.save(agent);

        return ResponseEntity.ok("KYC submitted successfully");
    }

    @GetMapping("/status")
    public ResponseEntity<?> getStatus(Authentication authentication) {
        User user = userRepository.findByPhoneNumber(authentication.getName()).get();
        Agent agent = agentRepository.findByUserId(user.getId()).get();
        if (agent.getKyc() == null) {
            return ResponseEntity.ok(Collections.singletonMap("kycStatus", "Pending"));
        }
        return ResponseEntity.ok(agent.getKyc());
    }

    private String saveFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path path = Paths.get(uploadPath + "/kyc");
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
        Files.copy(file.getInputStream(), path.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
        return "uploads/kyc/" + fileName;
    }
}
