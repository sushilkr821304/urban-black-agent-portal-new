package com.urbanblack.controller;

import com.urbanblack.entity.Agent;
import com.urbanblack.entity.Booking;
import com.urbanblack.entity.User;
import com.urbanblack.repository.AgentRepository;
import com.urbanblack.repository.BookingRepository;
import com.urbanblack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    AgentRepository agentRepository;

    @Autowired
    BookingRepository bookingRepository;

    @GetMapping("/history")
    public ResponseEntity<?> getBookingHistory(Authentication authentication) {
        User user = userRepository.findByPhoneNumber(authentication.getName()).get();
        Agent agent = user.getAgent();
        List<Booking> bookings = bookingRepository.findByAgentIdOrderByDateDesc(agent.getId());
        return ResponseEntity.ok(bookings);
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking, Authentication authentication) {
        User user = userRepository.findByPhoneNumber(authentication.getName()).get();
        Agent agent = user.getAgent();
        booking.setAgent(agent);
        bookingRepository.save(booking);
        return ResponseEntity.ok(booking);
    }
}
