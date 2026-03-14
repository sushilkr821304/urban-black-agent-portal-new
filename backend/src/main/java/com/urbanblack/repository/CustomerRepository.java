package com.urbanblack.repository;

import com.urbanblack.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByPhone(String phone);

    @Query(value = "SELECT c FROM Customer c WHERE EXISTS (SELECT 1 FROM Booking b WHERE b.customer = c AND b.agent.id = :agentId)",
           countQuery = "SELECT COUNT(c) FROM Customer c WHERE EXISTS (SELECT 1 FROM Booking b WHERE b.customer = c AND b.agent.id = :agentId)")
    Page<Customer> findByAgentId(@Param("agentId") Long agentId, Pageable pageable);

    @Query(value = "SELECT c FROM Customer c WHERE EXISTS (SELECT 1 FROM Booking b WHERE b.customer = c AND b.agent.id = :agentId) AND (" +
            "LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.phone) LIKE LOWER(CONCAT('%', :query, '%')))",
           countQuery = "SELECT COUNT(c) FROM Customer c WHERE EXISTS (SELECT 1 FROM Booking b WHERE b.customer = c AND b.agent.id = :agentId) AND (" +
            "LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.phone) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Customer> searchByAgentId(@Param("agentId") Long agentId, @Param("query") String query, Pageable pageable);
}
