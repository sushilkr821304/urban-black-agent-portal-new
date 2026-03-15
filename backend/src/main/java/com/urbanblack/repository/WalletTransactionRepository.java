package com.urbanblack.repository;

import com.urbanblack.entity.WalletTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {
    
    Page<WalletTransaction> findByAgentIdOrderByCreatedAtDesc(Long agentId, Pageable pageable);

    @Query("SELECT wt FROM WalletTransaction wt WHERE wt.agent.id = :agentId " +
           "AND wt.createdAt >= :startDate AND wt.createdAt <= :endDate " +
           "ORDER BY wt.createdAt DESC")
    Page<WalletTransaction> findByAgentIdAndDateRange(
            @Param("agentId") Long agentId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    List<WalletTransaction> findByAgentId(Long agentId);
}
