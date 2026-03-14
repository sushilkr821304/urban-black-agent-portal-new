package com.urbanblack.service;

import com.urbanblack.dto.CustomerDTO;
import com.urbanblack.entity.Booking;
import com.urbanblack.entity.Customer;
import com.urbanblack.repository.BookingRepository;
import com.urbanblack.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public Page<CustomerDTO> getCustomers(Long agentId, String query, Pageable pageable) {
        Page<Customer> customerPage;
        if (query != null && !query.isEmpty()) {
            customerPage = customerRepository.searchByAgentId(agentId, query, pageable);
        } else {
            customerPage = customerRepository.findByAgentId(agentId, pageable);
        }

        List<Long> customerIds = customerPage.getContent().stream().map(Customer::getId).collect(Collectors.toList());
        
        // Fetch bookings for these customers for this agent efficiently
        List<Booking> allAgentBookings = bookingRepository.findByAgentIdAndCustomerIdIn(agentId, customerIds);

        return customerPage.map(customer -> {
            List<Booking> customerBookings = allAgentBookings.stream()
                    .filter(b -> b.getCustomer().getId().equals(customer.getId()))
                    .collect(Collectors.toList());

            LocalDateTime lastBooking = customerBookings.stream()
                    .map(Booking::getTripDate)
                    .max(Comparator.naturalOrder())
                    .orElse(null);

            long completed = customerBookings.stream().filter(b -> "Completed".equalsIgnoreCase(b.getStatus())).count();
            long cancelled = customerBookings.stream().filter(b -> "Cancelled".equalsIgnoreCase(b.getStatus())).count();

            return CustomerDTO.builder()
                    .id(customer.getId())
                    .name(customer.getName())
                    .phone(customer.getPhone())
                    .email(customer.getEmail())
                    .city(customer.getCity())
                    .address(customer.getAddress())
                    .totalBookings((long) customerBookings.size())
                    .completedTrips(completed)
                    .cancelledTrips(cancelled)
                    .lastBookingDate(lastBooking)
                    .status("Active")
                    .build();
        });
    }

    public CustomerDTO getCustomerById(Long id, Long agentId) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        List<Booking> customerBookings = bookingRepository.findByAgentIdAndCustomerIdIn(agentId, List.of(id));
        
        if (customerBookings.isEmpty()) throw new RuntimeException("Unauthorized or no bookings for this customer");

        LocalDateTime lastBooking = customerBookings.stream()
                .map(Booking::getTripDate)
                .max(Comparator.naturalOrder())
                .orElse(null);

        long completed = customerBookings.stream().filter(b -> "Completed".equalsIgnoreCase(b.getStatus())).count();
        long cancelled = customerBookings.stream().filter(b -> "Cancelled".equalsIgnoreCase(b.getStatus())).count();

        return CustomerDTO.builder()
                .id(customer.getId())
                .name(customer.getName())
                .phone(customer.getPhone())
                .email(customer.getEmail())
                .city(customer.getCity())
                .address(customer.getAddress())
                .totalBookings((long) customerBookings.size())
                .completedTrips(completed)
                .cancelledTrips(cancelled)
                .lastBookingDate(lastBooking)
                .status("Active")
                .build();
    }

    public List<Booking> getCustomerBookings(Long id, Long agentId) {
        return bookingRepository.findByAgentIdAndCustomerIdIn(agentId, List.of(id));
    }
}
