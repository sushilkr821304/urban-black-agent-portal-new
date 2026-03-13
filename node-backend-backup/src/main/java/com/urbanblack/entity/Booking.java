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
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String bookingId;
    
    private String customerName;
    private String serviceType;
    private String status; // Pending, In Progress, Completed, Cancelled
    private LocalDateTime date;
    private Double amount;

    @ManyToOne
    @JoinColumn(name = "agent_id")
    private Agent agent;
}
