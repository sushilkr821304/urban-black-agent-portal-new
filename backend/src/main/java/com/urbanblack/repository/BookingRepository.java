package com.urbanblack.repository;

import com.urbanblack.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByAgentIdOrderByDateDesc(Long agentId);
    long countByAgentIdAndStatus(Long agentId, String status);
    long countByAgentId(Long agentId);
    
    @org.springframework.data.jpa.repository.Query("SELECT SUM(b.amount) FROM Booking b WHERE b.agent.id = :agentId")
    Double sumTotalEarningsByAgentId(Long agentId);

    @org.springframework.data.jpa.repository.Query("SELECT b FROM Booking b WHERE b.agent.id = :agentId AND b.date >= :startDate")
    List<Booking> findRecentByAgentId(Long agentId, java.time.LocalDateTime startDate);
}
