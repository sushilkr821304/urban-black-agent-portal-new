package com.urbanblack.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String driverName;
    private String phone;
    private String vehicleNumber;
    private String vehicleType;
    private String status; // Available, On Trip, Offline

    @JsonIgnore
    @OneToMany(mappedBy = "driver")
    private List<Booking> bookings;
}
