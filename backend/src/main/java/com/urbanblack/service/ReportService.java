package com.urbanblack.service;

import com.urbanblack.dto.ReportSummaryDTO;
import com.urbanblack.entity.Booking;
import com.urbanblack.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private BookingRepository bookingRepository;

    public Page<Booking> getFilteredBookings(Long agentId, LocalDateTime start, LocalDateTime end, String status, String route, Pageable pageable) {
        if ("All".equalsIgnoreCase(status)) status = null;
        return bookingRepository.filterReports(agentId, start, end, status, route, pageable);
    }

    public ReportSummaryDTO getReportSummary(Long agentId, LocalDateTime start, LocalDateTime end) {
        List<Booking> bookings = bookingRepository.findAllForReports(agentId, start, end);
        
        long total = bookings.size();
        long completed = bookings.stream().filter(b -> "COMPLETED".equalsIgnoreCase(b.getStatus())).count();
        long cancelled = bookings.stream().filter(b -> "CANCELLED".equalsIgnoreCase(b.getStatus())).count();
        
        double revenue = bookings.stream()
                .filter(b -> "COMPLETED".equalsIgnoreCase(b.getStatus()))
                .mapToDouble(b -> b.getAgentEarning() != null ? b.getAgentEarning() : 0.0)
                .sum();

        double fareCollected = bookings.stream()
                .filter(b -> "COMPLETED".equalsIgnoreCase(b.getStatus()))
                .mapToDouble(b -> b.getAmount() != null ? b.getAmount() : 0.0)
                .sum();

        double commission = bookings.stream()
                .filter(b -> "COMPLETED".equalsIgnoreCase(b.getStatus()))
                .mapToDouble(b -> b.getCommissionAmount() != null ? b.getCommissionAmount() : 0.0)
                .sum();

        // Trends
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd MMM");
        Map<String, Double> bookingsTrend = new TreeMap<>();
        Map<String, Double> revenueTrend = new TreeMap<>();
        Map<String, Long> statusDistribution = bookings.stream()
                .collect(Collectors.groupingBy(b -> b.getStatus() != null ? b.getStatus() : "Unknown", Collectors.counting()));

        bookings.forEach(b -> {
            String date = b.getTripDate().format(dtf);
            bookingsTrend.merge(date, 1.0, Double::sum);
            if ("COMPLETED".equalsIgnoreCase(b.getStatus())) {
                revenueTrend.merge(date, b.getAgentEarning() != null ? b.getAgentEarning() : 0.0, Double::sum);
            }
        });

        return ReportSummaryDTO.builder()
                .totalBookings(total)
                .completedTrips(completed)
                .cancelledTrips(cancelled)
                .totalRevenue(revenue)
                .totalFareCollected(fareCollected)
                .platformCommission(commission)
                .netAgentEarnings(revenue)
                .bookingsTrend(bookingsTrend)
                .revenueTrend(revenueTrend)
                .statusDistribution(statusDistribution)
                .build();
    }

    public List<Booking> getAllForExport(Long agentId, LocalDateTime start, LocalDateTime end) {
        return bookingRepository.findAllForReports(agentId, start, end);
    }
}
