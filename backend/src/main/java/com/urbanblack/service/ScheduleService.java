package com.urbanblack.service;

import com.urbanblack.entity.Booking;
import com.urbanblack.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Service
public class ScheduleService {

    @Autowired
    private BookingRepository bookingRepository;

    public Page<Booking> getAllTrips(Long agentId, Pageable pageable) {
        return bookingRepository.findByAgentId(agentId, pageable);
    }

    public Page<Booking> getTodayTrips(Long agentId, Pageable pageable) {
        LocalDateTime start = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime end = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        return bookingRepository.findByAgentIdAndTripDateBetween(agentId, start, end, pageable);
    }

    public Page<Booking> getUpcomingTrips(Long agentId, Pageable pageable) {
        return bookingRepository.findByAgentIdAndStatus(agentId, "Upcoming", pageable);
    }

    public Page<Booking> getCompletedTrips(Long agentId, Pageable pageable) {
        return bookingRepository.findByAgentIdAndStatus(agentId, "Completed", pageable);
    }

    public Page<Booking> searchTrips(Long agentId, String query, Pageable pageable) {
        return bookingRepository.searchBookings(agentId, query, pageable);
    }

    public Page<Booking> getTripsByDate(Long agentId, LocalDate date, Pageable pageable) {
        LocalDateTime start = LocalDateTime.of(date, LocalTime.MIN);
        LocalDateTime end = LocalDateTime.of(date, LocalTime.MAX);
        return bookingRepository.findByAgentIdAndTripDateBetween(agentId, start, end, pageable);
    }
    
    public Page<Booking> getTripsByStatus(Long agentId, String status, Pageable pageable) {
        if (status.equalsIgnoreCase("All")) {
            return bookingRepository.findByAgentId(agentId, pageable);
        }
        return bookingRepository.findByAgentIdAndStatus(agentId, status, pageable);
    }
}
