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
                                 CustomerRepository customerRepository,
                                 DriverRepository driverRepository,
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

                Customer customer1 = Customer.builder().name("Sushil Kumar").phone("9155909858").build();
                Customer customer2 = Customer.builder().name("Amit Verma").phone("9876543211").build();
                customerRepository.saveAll(List.of(customer1, customer2));

                bookingRepository.saveAll(List.of(
                    Booking.builder()
                        .bookingId("BK-9901")
                        .customer(customer1)
                        .pickupLocation("Pune Airport")
                        .dropLocation("Hinjewadi")
                        .vehicleType("Premium Sedan")
                        .status("In Progress")
                        .amount(4500.0)
                        .tripDate(LocalDateTime.now())
                        .agent(agent)
                        .build(),
                    Booking.builder()
                        .bookingId("BK-9902")
                        .customer(customer2)
                        .pickupLocation("Viman Nagar")
                        .dropLocation("Mumbai Airport")
                        .vehicleType("SUV (6 Seater)")
                        .status("Upcoming")
                        .amount(2200.0)
                        .tripDate(LocalDateTime.now().plusDays(1))
                        .agent(agent)
                        .build(),
                    Booking.builder()
                        .bookingId("BK-9903")
                        .customer(customer1)
                        .pickupLocation("Baner")
                        .dropLocation("Kothrud")
                        .vehicleType("Standard Sedan")
                        .status("Completed")
                        .amount(8500.0)
                        .tripDate(LocalDateTime.now().minusDays(2))
                        .agent(agent)
                        .build()
                ));

                System.out.println("Seed Data Loaded: 9876543210 / password123");

                driverRepository.saveAll(List.of(
                    Driver.builder().driverName("Rajesh Kumar").phone("9876540001").vehicleType("Premium Sedan").vehicleNumber("MH12-AB-1234").status("Available").build(),
                    Driver.builder().driverName("Suresh Yadav").phone("9876540002").vehicleType("SUV (6 Seater)").vehicleNumber("MH12-CD-5678").status("Available").build(),
                    Driver.builder().driverName("Vikram Singh").phone("9876540003").vehicleType("Luxury Car").vehicleNumber("MH14-EF-9012").status("Available").build()
                ));
            }
        };
    }
}
