package com.urbanblack.controller;

import com.urbanblack.entity.KYC;
import com.urbanblack.repository.KYCRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/kyc")
//@PreAuthorize("hasRole('ADMIN')") // Uncomment when admin roles are set up
public class AdminController {

    @Autowired
    KYCRepository kycRepository;

    @GetMapping("/pending")
    public ResponseEntity<List<KYC>> getPendingKyc() {
        return ResponseEntity.ok(kycRepository.findByKycStatus("In Progress"));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveKyc(@PathVariable Long id) {
        KYC kyc = kycRepository.findById(id).orElseThrow(() -> new RuntimeException("KYC not found"));
        kyc.setKycStatus("Approved");
        kyc.setVerifiedAt(LocalDateTime.now());
        kycRepository.save(kyc);
        return ResponseEntity.ok("KYC Approved successfully");
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<?> rejectKyc(@PathVariable Long id) {
        KYC kyc = kycRepository.findById(id).orElseThrow(() -> new RuntimeException("KYC not found"));
        kyc.setKycStatus("Rejected");
        kyc.setVerifiedAt(LocalDateTime.now());
        kycRepository.save(kyc);
        return ResponseEntity.ok("KYC Rejected successfully");
    }
}
