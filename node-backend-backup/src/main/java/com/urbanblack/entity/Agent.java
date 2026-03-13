package com.urbanblack.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Agent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String agencyName;
    private String profilePhoto;
    @Builder.Default
    private Double rating = 4.8;
    
    @Builder.Default
    private Integer totalBookings = 0;
    @Builder.Default
    private Integer completedJobs = 0;
    @Builder.Default
    private Integer pendingRequests = 0;
    @Builder.Default
    private Double monthlyEarnings = 0.0;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne(mappedBy = "agent", cascade = CascadeType.ALL)
    private KYC kyc;

    @OneToOne(mappedBy = "agent", cascade = CascadeType.ALL)
    private Wallet wallet;

    @OneToMany(mappedBy = "agent")
    private List<Booking> bookings;
}
