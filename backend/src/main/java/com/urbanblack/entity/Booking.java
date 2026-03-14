package com.urbanblack.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

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

    @ManyToOne
    @JoinColumn(name = "agent_id")
    @JsonIgnore
    private Agent agent;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    private String pickupLocation;
    private String dropLocation;
    private LocalDateTime tripDate;
    private String vehicleType;
    private String status; // Upcoming, Assigned, In Progress, Completed, Cancelled
    private Double amount;
    private String paymentStatus; // Pending, Paid
    private Integer passengersCount;

    @Column(length = 1000)
    private String specialNotes;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    // Convenience methods for frontend if needed
    public String getCustomerName() {
        return customer != null ? customer.getName() : "N/A";
    }

    public String getCustomerPhone() {
        return customer != null ? customer.getPhone() : "N/A";
    }
}
