package com.urbanblack.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phone;
    private String email;
    private String address;
    private String city;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @JsonIgnore
    @OneToMany(mappedBy = "customer")
    private List<Booking> bookings;
}
