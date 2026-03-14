package com.urbanblack.controller;

import com.urbanblack.entity.Agent;
import com.urbanblack.entity.Booking;
import com.urbanblack.entity.User;
import com.urbanblack.repository.BookingRepository;
import com.urbanblack.repository.UserRepository;
import com.urbanblack.service.BookingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingRepository bookingRepository;

    // Get all bookings with pagination + filters
    @GetMapping
    public ResponseEntity<?> getBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String query,
            Authentication authentication) {

        User user = userRepository.findByPhoneNumber(authentication.getName()).orElseThrow();
        Agent agent = user.getAgent();

        if (agent == null) {
            return ResponseEntity.badRequest().body("Agent profile not found");
        }

        return ResponseEntity.ok(
                bookingService.getBookings(
                        agent.getId(),
                        status,
                        query,
                        PageRequest.of(page, size, Sort.by("tripDate").descending())));
    }

    // Booking history API
    @GetMapping("/history")
    public ResponseEntity<?> getBookingHistory(Authentication authentication) {

        User user = userRepository.findByPhoneNumber(authentication.getName()).orElseThrow();
        Agent agent = user.getAgent();

        if (agent == null) {
            return ResponseEntity.badRequest().body("Agent profile not found");
        }

        List<Booking> bookings = bookingRepository.findRecentByAgentId(
                agent.getId(),
                LocalDateTime.now().minusYears(1));

        return ResponseEntity.ok(bookings);
    }

    // Get single booking details
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingDetails(@PathVariable Long id, Authentication authentication) {

        User user = userRepository.findByPhoneNumber(authentication.getName()).orElseThrow();
        Booking booking = bookingRepository.findById(id).orElseThrow();

        if (!booking.getAgent().getId().equals(user.getAgent().getId())) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        return ResponseEntity.ok(booking);
    }

    // Create booking
    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody Booking booking, Authentication authentication) {

        User user = userRepository.findByPhoneNumber(authentication.getName()).orElseThrow();
        Agent agent = user.getAgent();

        if (agent == null) {
            return ResponseEntity.badRequest().body("Agent profile not found");
        }

        return ResponseEntity.ok(bookingService.createBooking(booking, agent));
    }

    // Update booking status
    @PutMapping("/update-status/{id}")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication authentication) {

        User user = userRepository.findByPhoneNumber(authentication.getName()).orElseThrow();

        return ResponseEntity.ok(
                bookingService.updateBookingStatus(
                        id,
                        status,
                        user.getAgent().getId()));
    }

    // Assign driver
    @PutMapping("/assign-driver/{id}")
    public ResponseEntity<?> assignDriver(
            @PathVariable Long id,
            @RequestParam Long driverId,
            Authentication authentication) {

        User user = userRepository.findByPhoneNumber(authentication.getName()).orElseThrow();

        return ResponseEntity.ok(
                bookingService.assignDriver(
                        id,
                        driverId,
                        user.getAgent().getId()));
    }

    // Cancel booking
    @DeleteMapping("/cancel/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, Authentication authentication) {

        User user = userRepository.findByPhoneNumber(authentication.getName()).orElseThrow();

        return ResponseEntity.ok(
                bookingService.updateBookingStatus(
                        id,
                        "Cancelled",
                        user.getAgent().getId()));
    }

    // Export CSV
    @GetMapping("/export-csv")
    public ResponseEntity<byte[]> exportCsv(Authentication authentication) {

        User user = userRepository.findByPhoneNumber(authentication.getName()).orElseThrow();
        Agent agent = user.getAgent();

        List<Booking> allBookings = bookingRepository.findRecentByAgentId(
                agent.getId(),
                LocalDateTime.now().minusYears(1));

        StringBuilder csv = new StringBuilder();
        csv.append("Booking ID,Customer,Phone,Pickup,Drop,Date,Status,Amount\n");

        for (Booking b : allBookings) {
            csv.append(String.format("%s,%s,%s,%s,%s,%s,%s,%.2f\n",
                    b.getBookingId(),
                    b.getCustomerName(),
                    b.getCustomerPhone(),
                    b.getPickupLocation(),
                    b.getDropLocation(),
                    b.getTripDate(),
                    b.getStatus(),
                    b.getAmount()));
        }

        byte[] csvBytes = csv.toString().getBytes();

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=bookings.csv")
                .header("Content-Type", "text/csv")
                .body(csvBytes);
    }
}