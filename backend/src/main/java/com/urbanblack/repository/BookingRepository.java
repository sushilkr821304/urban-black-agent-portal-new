package com.urbanblack.repository;

import com.urbanblack.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByAgentIdOrderByDateDesc(Long agentId);
}
