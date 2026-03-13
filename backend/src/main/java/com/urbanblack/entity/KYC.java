package com.urbanblack.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KYC {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String agencyName;
    private String email;
    private String aadharNumber;
    private String panNumber;
    private String pinCode;
    private String city;
    private String state;
    
    private String aadharFrontImage;
    private String aadharBackImage;
    private String panImage;
    
    @Builder.Default
    private String kycStatus = "Pending"; // Pending, In Progress, Completed, Rejected

    @OneToOne
    @JoinColumn(name = "agent_id")
    private Agent agent;
}
