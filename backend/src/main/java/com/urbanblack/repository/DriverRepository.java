package com.urbanblack.repository;

import com.urbanblack.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    List<Driver> findByStatus(String status);
}
