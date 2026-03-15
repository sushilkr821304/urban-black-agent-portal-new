package com.urbanblack.controller;

import com.urbanblack.entity.Agent;
import com.urbanblack.entity.Booking;
import com.urbanblack.entity.User;
import com.urbanblack.repository.UserRepository;
import com.urbanblack.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReportService reportService;

    private Agent getAuthenticatedAgent(Authentication authentication) {
        User user = userRepository.findByPhoneNumber(authentication.getName()).orElseThrow();
        if (user.getAgent() == null) throw new RuntimeException("Agent profile not found");
        return user.getAgent();
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            Authentication authentication) {
        Agent agent = getAuthenticatedAgent(authentication);
        return ResponseEntity.ok(reportService.getReportSummary(agent.getId(), fromDate.atStartOfDay(), toDate.atTime(LocalTime.MAX)));
    }

    @GetMapping("/bookings")
    public ResponseEntity<?> getBookings(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String route,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Agent agent = getAuthenticatedAgent(authentication);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(reportService.getFilteredBookings(
                agent.getId(), fromDate.atStartOfDay(), toDate.atTime(LocalTime.MAX), status, route, pageable));
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam String format, // csv or pdf
            Authentication authentication) {
        Agent agent = getAuthenticatedAgent(authentication);
        List<Booking> data = reportService.getAllForExport(agent.getId(), fromDate.atStartOfDay(), toDate.atTime(LocalTime.MAX));
        
        byte[] content;
        String filename;
        MediaType mediaType;

        if ("pdf".equalsIgnoreCase(format)) {
            content = generatePdfReport(data, fromDate, toDate);
            filename = "Report_" + fromDate + "_to_" + toDate + ".pdf";
            mediaType = MediaType.APPLICATION_PDF;
        } else {
            content = generateCsvReport(data);
            filename = "Report_" + fromDate + "_to_" + toDate + ".csv";
            mediaType = MediaType.parseMediaType("text/csv");
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(mediaType)
                .body(content);
    }

    private byte[] generateCsvReport(List<Booking> bookings) {
        StringBuilder csv = new StringBuilder();
        csv.append("Booking ID,Customer,Route,Date,Fare,Agent Earning,Status\n");
        for (Booking b : bookings) {
            csv.append(String.format("%s,%s,%s to %s,%s,%.2f,%.2f,%s\n",
                    b.getBookingId(),
                    b.getCustomerName(),
                    b.getPickupLocation(),
                    b.getDropLocation(),
                    b.getTripDate().toString(),
                    b.getAmount() != null ? b.getAmount() : 0.0,
                    b.getAgentEarning() != null ? b.getAgentEarning() : 0.0,
                    b.getStatus()));
        }
        return csv.toString().getBytes();
    }

    private byte[] generatePdfReport(List<Booking> bookings, LocalDate from, LocalDate to) {
        try (java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream()) {
            com.lowagie.text.Document document = new com.lowagie.text.Document(com.lowagie.text.PageSize.A4.rotate());
            com.lowagie.text.pdf.PdfWriter.getInstance(document, out);
            document.open();

            com.lowagie.text.Font titleFont = com.lowagie.text.FontFactory.getFont(com.lowagie.text.FontFactory.HELVETICA_BOLD, 18);
            document.add(new com.lowagie.text.Paragraph("URBAN BLACK - PERFORMANCE REPORT", titleFont));
            document.add(new com.lowagie.text.Paragraph("Period: " + from + " to " + to));
            document.add(new com.lowagie.text.Paragraph(" "));

            com.lowagie.text.pdf.PdfPTable table = new com.lowagie.text.pdf.PdfPTable(7);
            table.setWidthPercentage(100);
            String[] headers = {"ID", "Customer", "Route", "Date", "Fare", "Earnings", "Status"};
            for (String h : headers) {
                com.lowagie.text.pdf.PdfPCell cell = new com.lowagie.text.pdf.PdfPCell(new com.lowagie.text.Phrase(h));
                cell.setBackgroundColor(java.awt.Color.LIGHT_GRAY);
                table.addCell(cell);
            }

            for (Booking b : bookings) {
                table.addCell(b.getBookingId());
                table.addCell(b.getCustomerName());
                table.addCell(b.getPickupLocation() + " -> " + b.getDropLocation());
                table.addCell(b.getTripDate().toLocalDate().toString());
                table.addCell("₹" + (b.getAmount() != null ? b.getAmount() : 0));
                table.addCell("₹" + (b.getAgentEarning() != null ? b.getAgentEarning() : 0));
                table.addCell(b.getStatus());
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            return "Error generating PDF".getBytes();
        }
    }
}
