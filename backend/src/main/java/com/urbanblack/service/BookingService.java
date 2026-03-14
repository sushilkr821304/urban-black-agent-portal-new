package com.urbanblack.service;

import com.urbanblack.entity.Agent;
import com.urbanblack.entity.Booking;
import com.urbanblack.entity.Customer;
import com.urbanblack.entity.Driver;
import com.urbanblack.repository.BookingRepository;
import com.urbanblack.repository.CustomerRepository;
import com.urbanblack.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Transactional
    public Booking createBooking(Booking booking, Agent agent) {
        // Handle Customer (Find or Create)
        Customer customer = booking.getCustomer();
        if (customer != null && customer.getPhone() != null) {
            Customer existingCustomer = customerRepository.findByPhone(customer.getPhone())
                    .orElseGet(() -> customerRepository.save(customer));
            booking.setCustomer(existingCustomer);
        }

        // Generate Booking ID (UB-XXXX)
        booking.setBookingId("UB-" + (1000 + new Random().nextInt(9000)));
        booking.setAgent(agent);
        booking.setCreatedAt(LocalDateTime.now());

        if (booking.getStatus() == null) {
            booking.setStatus("Upcoming");
        }
        if (booking.getPaymentStatus() == null) {
            booking.setPaymentStatus("Pending");
        }

        return bookingRepository.save(booking);
    }

    public Page<Booking> getBookings(Long agentId, String status, String query, Pageable pageable) {
        if (query != null && !query.isEmpty()) {
            return bookingRepository.searchBookings(agentId, query, pageable);
        } else if (status != null && !status.equals("All")) {
            return bookingRepository.findByAgentIdAndStatus(agentId, status, pageable);
        } else {
            return bookingRepository.findByAgentId(agentId, pageable);
        }
    }

    @Transactional
    public Booking updateBookingStatus(Long id, String status, Long agentId) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getAgent().getId().equals(agentId)) {
            throw new RuntimeException("Unauthorized");
        }

        String oldStatus = booking.getStatus();
        booking.setStatus(status);

        // If status changes from Assigned to something else and no longer assigned,
        // maybe free up driver?
        if (status.equalsIgnoreCase("Cancelled") || status.equalsIgnoreCase("Completed")) {
            if (booking.getDriver() != null) {
                Driver driver = booking.getDriver();
                driver.setStatus("AVAILABLE");
                driverRepository.save(driver);
            }
        }

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking assignDriver(Long id, Long driverId, Long agentId) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getAgent().getId().equals(agentId)) {
            throw new RuntimeException("Unauthorized");
        }
        Driver driver = driverRepository.findById(driverId).orElseThrow(() -> new RuntimeException("Driver not found"));

        // Update driver status
        driver.setStatus("BUSY");
        driverRepository.save(driver);

        booking.setDriver(driver);
        booking.setStatus("Assigned");
        return bookingRepository.save(booking);
    }

    public byte[] generateInvoice(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        try (java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream()) {
            com.lowagie.text.Document document = new com.lowagie.text.Document(com.lowagie.text.PageSize.A4);
            com.lowagie.text.pdf.PdfWriter.getInstance(document, out);
            document.open();

            com.lowagie.text.Font titleFont = com.lowagie.text.FontFactory
                    .getFont(com.lowagie.text.FontFactory.HELVETICA_BOLD, 20);
            com.lowagie.text.Paragraph title = new com.lowagie.text.Paragraph("URBAN BLACK - INVOICE", titleFont);
            title.setAlignment(com.lowagie.text.Element.ALIGN_CENTER);
            document.add(title);
            document.add(new com.lowagie.text.Paragraph(" "));

            document.add(new com.lowagie.text.Paragraph("Invoice Number: INV-" + booking.getBookingId()));
            document.add(new com.lowagie.text.Paragraph("Booking ID: " + booking.getBookingId()));
            document.add(new com.lowagie.text.Paragraph("Date: " + java.time.format.DateTimeFormatter
                    .ofPattern("yyyy-MM-dd HH:mm").format(java.time.LocalDateTime.now())));
            document.add(new com.lowagie.text.Paragraph(
                    "------------------------------------------------------------------------------------------------------------------"));

            document.add(new com.lowagie.text.Paragraph("Customer Name: " + booking.getCustomerName()));
            document.add(new com.lowagie.text.Paragraph("Customer Phone: " + booking.getCustomerPhone()));
            document.add(new com.lowagie.text.Paragraph("Vehicle Type: " + booking.getVehicleType()));
            document.add(new com.lowagie.text.Paragraph("Trip Date: " + booking.getTripDate().toString()));
            document.add(new com.lowagie.text.Paragraph(" "));

            document.add(new com.lowagie.text.Paragraph("Pickup Location: " + booking.getPickupLocation()));
            document.add(new com.lowagie.text.Paragraph("Drop Location: " + booking.getDropLocation()));
            document.add(new com.lowagie.text.Paragraph(" "));

            if (booking.getDriver() != null) {
                document.add(new com.lowagie.text.Paragraph("Driver Name: " + booking.getDriver().getDriverName()));
                document.add(
                        new com.lowagie.text.Paragraph("Vehicle Number: " + booking.getDriver().getVehicleNumber()));
            }

            document.add(new com.lowagie.text.Paragraph(" "));
            com.lowagie.text.Font amountFont = com.lowagie.text.FontFactory
                    .getFont(com.lowagie.text.FontFactory.HELVETICA_BOLD, 16);
            document.add(new com.lowagie.text.Paragraph("Total Amount: ₹" + booking.getAmount(), amountFont));
            document.add(new com.lowagie.text.Paragraph("Payment Status: " + booking.getPaymentStatus()));

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating invoice PDF", e);
        }
    }
}
