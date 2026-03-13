package com.urbanblack.config;

import com.urbanblack.entity.*;
import com.urbanblack.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class SeedDataConfig {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, 
                                 AgentRepository agentRepository, 
                                 BookingRepository bookingRepository,
                                 PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                User user = User.builder()
                        .phoneNumber("9876543210")
                        .password(passwordEncoder.encode("password123"))
                        .role("ROLE_AGENT")
                        .isVerified(true)
                        .build();
                
                user = userRepository.save(user);

                Agent agent = Agent.builder()
                        .user(user)
                        .name("Urban Black Admin")
                        .email("admin@urbanblack.com")
                        .agencyName("Urban Black Agency")
                        .rating(4.9)
                        .totalBookings(1540)
                        .completedJobs(1120)
                        .pendingRequests(5)
                        .monthlyEarnings(75000.0)
                        .build();
                
                Wallet wallet = Wallet.builder().agent(agent).balance(12400.0).build();
                agent.setWallet(wallet);
                
                agentRepository.save(agent);

                bookingRepository.saveAll(List.of(
                    Booking.builder().bookingId("BK-9901").customerName("Sushil Kumar").serviceType("Chauffeur Service").status("In Progress").amount(4500.0).date(LocalDateTime.now()).agent(agent).build(),
                    Booking.builder().bookingId("BK-9902").customerName("Amit Verma").serviceType("Airport Transfer").status("Pending").amount(2200.0).date(LocalDateTime.now().minusDays(1)).agent(agent).build(),
                    Booking.builder().bookingId("BK-9903").customerName("Priya Raj").serviceType("Full Day Rental").status("Completed").amount(8500.0).date(LocalDateTime.now().minusDays(2)).agent(agent).build()
                ));

                System.out.println("Seed Data Loaded: 9876543210 / password123");
            }
        };
    }
}
