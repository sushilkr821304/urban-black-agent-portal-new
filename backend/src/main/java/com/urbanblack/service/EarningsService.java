package com.urbanblack.service;

import com.urbanblack.dto.EarningsSummaryDTO;
import com.urbanblack.entity.Booking;
import com.urbanblack.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EarningsService {

    @Autowired
    private BookingRepository bookingRepository;

    public EarningsSummaryDTO getEarningsSummary(Long agentId, String range) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start;
        
        switch (range.toLowerCase()) {
            case "today":
                start = now.with(LocalTime.MIN);
                break;
            case "weekly":
                start = now.minusWeeks(1).with(LocalTime.MIN);
                break;
            case "monthly":
                start = now.minusMonths(1).with(LocalTime.MIN);
                break;
            default: // overall
                start = LocalDateTime.of(2000, 1, 1, 0, 0);
        }

        List<Booking> allCompleted = bookingRepository.findCompletedByAgentId(agentId);
        List<Booking> filtered = allCompleted.stream()
                .filter(b -> b.getTripDate().isAfter(start))
                .collect(Collectors.toList());

        Double totalEarnings = filtered.stream()
                .mapToDouble(b -> b.getAgentEarning() != null ? b.getAgentEarning() : 0.0)
                .sum();

        Double totalFare = filtered.stream()
                .mapToDouble(b -> b.getAmount() != null ? b.getAmount() : 0.0)
                .sum();

        Double totalCommission = filtered.stream()
                .mapToDouble(b -> b.getCommissionAmount() != null ? b.getCommissionAmount() : 0.0)
                .sum();

        // Specific time-based earnings for the 4 cards
        LocalDateTime todayStart = now.with(LocalTime.MIN);
        LocalDateTime weekStart = now.minusWeeks(1).with(LocalTime.MIN);
        LocalDateTime monthStart = now.minusMonths(1).with(LocalTime.MIN);

        Double todayEarnings = allCompleted.stream()
                .filter(b -> b.getTripDate().isAfter(todayStart))
                .mapToDouble(b -> b.getAgentEarning() != null ? b.getAgentEarning() : 0.0)
                .sum();

        Double weekEarnings = allCompleted.stream()
                .filter(b -> b.getTripDate().isAfter(weekStart))
                .mapToDouble(b -> b.getAgentEarning() != null ? b.getAgentEarning() : 0.0)
                .sum();

        Double monthEarnings = allCompleted.stream()
                .filter(b -> b.getTripDate().isAfter(monthStart))
                .mapToDouble(b -> b.getAgentEarning() != null ? b.getAgentEarning() : 0.0)
                .sum();

        Double lifetimeEarnings = allCompleted.stream()
                .mapToDouble(b -> b.getAgentEarning() != null ? b.getAgentEarning() : 0.0)
                .sum();

        // Trends
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd MMM");
        Map<String, Double> trend = new TreeMap<>();
        filtered.forEach(b -> {
            String date = b.getTripDate().format(dtf);
            trend.merge(date, b.getAgentEarning() != null ? b.getAgentEarning() : 0.0, Double::sum);
        });

        long tripCount = filtered.size();
        Double avgEarnings = tripCount > 0 ? totalEarnings / tripCount : 0.0;

        return EarningsSummaryDTO.builder()
                .todayEarnings(todayEarnings)
                .weeklyEarnings(weekEarnings)
                .monthlyEarnings(monthEarnings)
                .totalEarnings(lifetimeEarnings)
                .totalTrips(tripCount)
                .averageEarningsPerTrip(avgEarnings)
                .totalFareCollected(totalFare)
                .totalCommission(totalCommission)
                .netAgentEarnings(totalEarnings)
                .earningsTrend(trend)
                .build();
    }

    public List<Booking> getEarningsBookings(Long agentId, int limit) {
        return bookingRepository.findCompletedByAgentId(agentId).stream()
                .limit(limit)
                .collect(Collectors.toList());
    }
}
