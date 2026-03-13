package com.urbanblack.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // LOGIN, BOOKING_CREATED, PAYMENT_RECEIVED, etc.
    private String description;
    private LocalDateTime createdAt;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne
    @JoinColumn(name = "agent_id")
    private Agent agent;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
