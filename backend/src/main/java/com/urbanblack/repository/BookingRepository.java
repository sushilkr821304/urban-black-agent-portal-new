package com.urbanblack.repository;

import com.urbanblack.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Page<Booking> findByAgentId(Long agentId, Pageable pageable);

    Page<Booking> findByAgentIdAndStatusIgnoreCase(Long agentId, String status, Pageable pageable);
    Page<Booking> findByAgentIdAndStatus(Long agentId, String status, Pageable pageable);

    @Query("SELECT b FROM Booking b LEFT JOIN b.driver d WHERE b.agent.id = :agentId AND (" +
            "LOWER(b.bookingId) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(b.customerName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(b.customerPhone) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(d.driverName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(b.pickupLocation) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(b.dropLocation) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Booking> searchBookings(@Param("agentId") Long agentId, @Param("query") String query, Pageable pageable);

    Page<Booking> findByAgentIdAndTripDateBetween(Long agentId, LocalDateTime start, LocalDateTime end, Pageable pageable);

    Page<Booking> findByAgentIdAndTripDateAfter(Long agentId, LocalDateTime start, Pageable pageable);

    Page<Booking> findByAgentIdAndStatusIn(Long agentId, java.util.Collection<String> statuses, Pageable pageable);

    long countByAgentIdAndStatus(Long agentId, String status);

    long countByAgentId(Long agentId);

    @Query("SELECT SUM(b.amount) FROM Booking b WHERE b.agent.id = :agentId AND b.status = 'COMPLETED'")
    Double sumTotalEarningsByAgentId(@Param("agentId") Long agentId);

    @Query("SELECT b FROM Booking b WHERE b.agent.id = :agentId AND b.tripDate >= :startDate ORDER BY b.tripDate DESC")
    List<Booking> findRecentByAgentId(@Param("agentId") Long agentId, @Param("startDate") LocalDateTime startDate);

    @Query("SELECT b FROM Booking b WHERE b.agent.id = :agentId " +
           "AND b.tripDate >= :startDate AND b.tripDate <= :endDate " +
           "AND (:status IS NULL OR b.status = :status) " +
           "AND (:route IS NULL OR b.pickupLocation LIKE %:route% OR b.dropLocation LIKE %:route%) " +
           "ORDER BY b.tripDate DESC")
    Page<Booking> filterReports(
            @Param("agentId") Long agentId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("status") String status,
            @Param("route") String route,
            Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.agent.id = :agentId " +
            "AND b.tripDate >= :startDate AND b.tripDate <= :endDate")
    List<Booking> findAllForReports(
            @Param("agentId") Long agentId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT b FROM Booking b WHERE b.agent.id = :agentId AND b.customer.id IN :customerIds")
    List<Booking> findByAgentIdAndCustomerIdIn(@Param("agentId") Long agentId, @Param("customerIds") java.util.Collection<Long> customerIds);

    @Query("SELECT SUM(b.agentEarning) FROM Booking b WHERE b.agent.id = :agentId AND b.status = 'COMPLETED'")
    Double sumTotalAgentEarnings(@Param("agentId") Long agentId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.agent.id = :agentId AND b.status = 'COMPLETED'")
    Long countCompletedTripsByAgentId(@Param("agentId") Long agentId);

    @Query("SELECT b FROM Booking b WHERE b.agent.id = :agentId AND b.status = 'COMPLETED' ORDER BY b.tripDate DESC")
    List<Booking> findCompletedByAgentId(Long agentId);
}
