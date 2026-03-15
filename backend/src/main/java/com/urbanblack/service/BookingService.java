package com.urbanblack.service;

import com.urbanblack.entity.Agent;
import com.urbanblack.entity.Booking;
import com.urbanblack.entity.Customer;
import com.urbanblack.entity.Driver;
import com.urbanblack.entity.WalletTransaction;
import com.urbanblack.repository.BookingRepository;
import com.urbanblack.repository.CustomerRepository;
import com.urbanblack.repository.DriverRepository;
import com.urbanblack.repository.WalletRepository;
import com.urbanblack.repository.WalletTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private WalletTransactionRepository walletTransactionRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Transactional
    public Booking createBooking(Booking booking, Agent agent) {
        // Handle Customer (Find or Create)
        Customer customer = booking.getCustomer();
        if (customer != null && customer.getPhone() != null) {
            Customer existingCustomer = customerRepository.findByPhone(customer.getPhone())
                    .orElseGet(() -> customerRepository.save(customer));
            booking.setCustomer(existingCustomer);
            if (booking.getCustomerName() == null) booking.setCustomerName(existingCustomer.getName());
            if (booking.getCustomerPhone() == null) booking.setCustomerPhone(existingCustomer.getPhone());
        }

        if (booking.getTripDate() != null && booking.getTripTime() == null) {
            booking.setTripTime(booking.getTripDate().toLocalTime().toString());
        }

        // Generate Booking ID (UB-XXXX)
        booking.setBookingId("UB-" + (1000 + new Random().nextInt(9000)));
        booking.setAgent(agent);
        booking.setCreatedAt(LocalDateTime.now());

        if (booking.getStatus() == null) {
            booking.setStatus("NEW");
        }
        if (booking.getPaymentStatus() == null) {
            booking.setPaymentStatus("Pending");
        }

        return bookingRepository.save(booking);
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void sanitizeDatabase() {
        System.out.println("Starting Database Sanitization: Normalizing statuses...");
        
        // Seed drivers if none exist
        if (driverRepository.count() == 0) {
            seedDrivers();
        }

        // Normalize Booking Statuses
        List<Booking> allBookings = bookingRepository.findAll();
        System.out.println("Found " + allBookings.size() + " bookings to sanitize.");
        LocalDateTime now = LocalDateTime.now();
        
        for (Booking b : allBookings) {
            boolean changed = false;
            String oldStatus = b.getStatus();
            String s = oldStatus != null ? oldStatus.trim() : "Upcoming";
            String normalized = s;

            // 1. Keyword Normalization
            if (s.equalsIgnoreCase("upcoming") || s.equalsIgnoreCase("new booking") || s.equalsIgnoreCase("new")) normalized = "NEW";
            else if (s.equalsIgnoreCase("assigned")) normalized = "ASSIGNED";
            else if (s.equalsIgnoreCase("inprogress") || s.equalsIgnoreCase("in progress") || s.equalsIgnoreCase("in-progress") || s.equalsIgnoreCase("in_progress")) normalized = "IN_PROGRESS";
            else if (s.equalsIgnoreCase("completed")) normalized = "COMPLETED";
            else if (s.equalsIgnoreCase("cancelled")) normalized = "CANCELLED";

            // 2. Logical Correction
            if (!normalized.equals("CANCELLED") && !normalized.equals("COMPLETED")) {
                if (b.getDriver() != null && b.getTripStartedAt() == null) {
                    normalized = "ASSIGNED";
                } else if (b.getTripStartedAt() != null && b.getTripCompletedAt() == null) {
                    normalized = "IN_PROGRESS";
                } else if (b.getTripCompletedAt() != null) {
                    normalized = "COMPLETED";
                }
            }

            if (!normalized.equals(oldStatus)) {
                b.setStatus(normalized);
                changed = true;
            }

            if (changed) {
                bookingRepository.save(b);
            }
        }

        // Normalize Driver Statuses to AVAILABLE, BUSY, OFFLINE
        List<Driver> allDrivers = driverRepository.findAll();
        for (Driver d : allDrivers) {
            String status = d.getStatus();
            if (status == null) status = "AVAILABLE";

            String normalized = status.trim().toUpperCase();
            if (normalized.equals("AVAILABLE") || normalized.equals("ON TRIP") || normalized.equals("BUSY") || normalized.equals("OFFLINE")) {
                if (normalized.equals("ON TRIP")) normalized = "BUSY";
            } else {
                normalized = "AVAILABLE";
            }

            if (!normalized.equals(status)) {
                d.setStatus(normalized);
                driverRepository.save(d);
            }
        }
        System.out.println("Database Sanitization Complete.");
    }

    private void seedDrivers() {
        System.out.println("Seeding dummy drivers...");
        String[][] drivers = {
            {"Rajesh Kumar", "9876543210", "MH12-AB-1234", "Premium Sedan", "4.8", "Pune - Hinjewadi"},
            {"Suresh Yadav", "9765432109", "MH12-CD-5678", "SUV (6 Seater)", "4.5", "Pune - Baner"},
            {"Vikram Singh", "9654321098", "MH14-EF-9012", "Luxury Car", "4.9", "Pune - Koregaon Park"},
            {"Amit Patel", "9543210987", "MH12-GH-3456", "Sedan", "4.2", "Pune - Wakad"},
            {"Deepak Sharma", "9432109876", "MH14-IJ-7890", "Hatchback", "4.6", "Pune - Hadapsar"}
        };

        for (String[] d : drivers) {
            Driver driver = Driver.builder()
                .driverName(d[0])
                .phone(d[1])
                .vehicleNumber(d[2])
                .vehicleType(d[3])
                .rating(Double.parseDouble(d[4]))
                .currentLocation(d[5])
                .status("AVAILABLE")
                .build();
            driverRepository.save(driver);
        }
    }

    public Page<Booking> getBookings(Long agentId, String status, String query, Pageable pageable) {
        Page<Booking> bookings;
        if (query != null && !query.isEmpty()) {
            bookings = bookingRepository.searchBookings(agentId, query, pageable);
        } else if (status != null && !status.equals("All")) {
            bookings = bookingRepository.findByAgentIdAndStatusIgnoreCase(agentId, status, pageable);
        } else {
            bookings = bookingRepository.findByAgentId(agentId, pageable);
        }

        // Apply real-time fixes/normalization if needed
        bookings.getContent().forEach(this::checkAndFixBookingStatus);
        
        return bookings;
    }

    private void checkAndFixBookingStatus(Booking booking) {
        String oldStatus = booking.getStatus();
        LocalDateTime now = LocalDateTime.now();
        boolean changed = false;
        
        // 1. Cancelled/Completed are terminal (mostly)
        if ("Cancelled".equalsIgnoreCase(oldStatus) || "Completed".equalsIgnoreCase(oldStatus)) {
            // Still check snapshots for history
            if (booking.getCustomerName() == null && booking.getCustomer() != null) {
                booking.setCustomerName(booking.getCustomer().getName());
                changed = true;
            }
            if (booking.getCustomerPhone() == null && booking.getCustomer() != null) {
                booking.setCustomerPhone(booking.getCustomer().getPhone());
                changed = true;
            }
            if (changed) bookingRepository.save(booking);
            return;
        }

        // Ensure snapshotted data exists
        if (booking.getCustomerName() == null && booking.getCustomer() != null) {
            booking.setCustomerName(booking.getCustomer().getName());
            changed = true;
        }
        if (booking.getCustomerPhone() == null && booking.getCustomer() != null) {
            booking.setCustomerPhone(booking.getCustomer().getPhone());
            changed = true;
        }
        if (booking.getTripTime() == null && booking.getTripDate() != null) {
            booking.setTripTime(booking.getTripDate().toLocalTime().toString());
            changed = true;
        }

        // 2. Past Date Rule
        String targetStatus = oldStatus;
        if ("NEW".equalsIgnoreCase(oldStatus) && booking.getTripDate() != null && booking.getTripDate().isBefore(now)) {
            targetStatus = "COMPLETED";
            if (booking.getTripCompletedAt() == null) booking.setTripCompletedAt(booking.getTripDate().plusHours(1));
        } else {
            // 3. Automated Logic
            if (booking.getDriver() == null) {
                targetStatus = "NEW";
            } else if (booking.getTripStartedAt() == null) {
                targetStatus = "ASSIGNED";
            } else if (booking.getTripCompletedAt() == null) {
                targetStatus = "IN_PROGRESS";
            } else {
                targetStatus = "COMPLETED";
            }
        }

        if (!targetStatus.equalsIgnoreCase(oldStatus)) {
            booking.setStatus(targetStatus);
            changed = true;
        }

        if (changed) {
            bookingRepository.save(booking);
        }
    }

    @Transactional
    public Booking startTrip(Long id, Long agentId) {
        return updateBookingStatus(id, "IN_PROGRESS", agentId);
    }

    @Transactional
    public Booking updateBookingStatus(Long id, String status, Long agentId) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getAgent().getId().equals(agentId)) {
            throw new RuntimeException("Unauthorized");
        }

        String oldStatus = booking.getStatus();
        
        // Robust Normalization
        String normalizedStatus = status.trim();
        if (normalizedStatus.equalsIgnoreCase("upcoming") || normalizedStatus.equalsIgnoreCase("new")) normalizedStatus = "NEW";
        else if (normalizedStatus.equalsIgnoreCase("assigned")) normalizedStatus = "ASSIGNED";
        else if (normalizedStatus.equalsIgnoreCase("inprogress") || normalizedStatus.equalsIgnoreCase("in progress") || normalizedStatus.equalsIgnoreCase("in-progress") || normalizedStatus.equalsIgnoreCase("in_progress")) normalizedStatus = "IN_PROGRESS";
        else if (normalizedStatus.equalsIgnoreCase("completed")) normalizedStatus = "COMPLETED";
        else if (normalizedStatus.equalsIgnoreCase("cancelled")) normalizedStatus = "CANCELLED";
        else {
            normalizedStatus = status.toUpperCase();
        }
        
        booking.setStatus(normalizedStatus);

        if (normalizedStatus.equals("IN_PROGRESS") && booking.getTripStartedAt() == null) {
            booking.setTripStartedAt(LocalDateTime.now());
        }
        
        if (normalizedStatus.equals("COMPLETED") && booking.getTripCompletedAt() == null) {
            booking.setTripCompletedAt(LocalDateTime.now());
            if (booking.getTripStartedAt() == null) {
                booking.setTripStartedAt(booking.getTripDate());
            }
        }

        // If status changes to terminal or driver is changed, handle driver status
        if (normalizedStatus.equals("CANCELLED") || normalizedStatus.equals("COMPLETED")) {
            if (booking.getDriver() != null) {
                Driver driver = booking.getDriver();
                driver.setStatus("AVAILABLE");
                driverRepository.save(driver);
            }
        }

        if (normalizedStatus.equals("COMPLETED") && !oldStatus.equalsIgnoreCase("COMPLETED")) {
                double amount = booking.getAmount() != null ? booking.getAmount() : 0.0;
                double commission = Math.round(amount * 0.20 * 100.0) / 100.0;
                double netEaring = amount - commission;

                booking.setCommissionAmount(commission);
                booking.setAgentEarning(netEaring);

                // 1. Credit Trip Earnings
                WalletTransaction creditTx = WalletTransaction.builder()
                        .agent(booking.getAgent())
                        .transactionType("CREDIT")
                        .amount(amount)
                        .description("Trip Earnings: " + booking.getBookingId())
                        .referenceId(booking.getBookingId())
                        .status("Success")
                        .build();
                walletTransactionRepository.save(creditTx);

                // 2. Debit Commission
                WalletTransaction debitTx = WalletTransaction.builder()
                        .agent(booking.getAgent())
                        .transactionType("DEBIT")
                        .amount(commission)
                        .description("Commission Deduction: " + booking.getBookingId())
                        .referenceId(booking.getBookingId())
                        .status("Success")
                        .build();
                walletTransactionRepository.save(debitTx);

                // 3. Update Wallet Balance
                if (booking.getAgent().getWallet() != null) {
                    booking.getAgent().getWallet().setBalance(
                        booking.getAgent().getWallet().getBalance() + netEaring
                    );
                    walletRepository.save(booking.getAgent().getWallet());
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
        booking.setStatus("ASSIGNED");
        return bookingRepository.save(booking);
    }


    @Transactional
    public Booking completeTrip(Long id, Long agentId) {
        return updateBookingStatus(id, "COMPLETED", agentId);
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
