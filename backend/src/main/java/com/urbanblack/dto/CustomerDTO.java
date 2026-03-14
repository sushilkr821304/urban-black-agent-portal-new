package com.urbanblack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDTO {
    private Long id;
    private String name;
    private String phone;
    private String email;
    private String city;
    private String address;
    private Long totalBookings;
    private Long completedTrips;
    private Long cancelledTrips;
    private LocalDateTime lastBookingDate;
    private String status;
}
