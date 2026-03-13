package com.urbanblack.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String password;

    private boolean isVerified;

    private String role; // e.g., "ROLE_AGENT"

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Agent agent;
}
