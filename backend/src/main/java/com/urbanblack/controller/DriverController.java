package com.urbanblack.controller;

import com.urbanblack.entity.Driver;
import com.urbanblack.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    @Autowired
    private DriverRepository driverRepository;

    @GetMapping
    public ResponseEntity<List<Driver>> getAllDrivers() {
        return ResponseEntity.ok(driverRepository.findAll());
    }

    @GetMapping("/available")
    public ResponseEntity<List<Driver>> getAvailableDrivers() {
        return ResponseEntity.ok(driverRepository.findByStatus("Available"));
    }

    @PostMapping
    public ResponseEntity<Driver> addDriver(@RequestBody Driver driver) {
        if (driver.getStatus() == null)
            driver.setStatus("Available");
        return ResponseEntity.ok(driverRepository.save(driver));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Driver> updateStatus(@PathVariable Long id, @RequestParam String status) {
        Driver driver = driverRepository.findById(id).orElseThrow(() -> new RuntimeException("Driver not found"));
        driver.setStatus(status);
        return ResponseEntity.ok(driverRepository.save(driver));
    }
}
