package com.urbanblack.service;

import com.urbanblack.dto.PassbookSummaryDTO;
import com.urbanblack.entity.Agent;
import com.urbanblack.entity.WalletTransaction;
import com.urbanblack.repository.WalletTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PassbookService {

    @Autowired
    private WalletTransactionRepository walletTransactionRepository;

    public Page<WalletTransaction> getTransactions(Long agentId, Pageable pageable) {
        return walletTransactionRepository.findByAgentIdOrderByCreatedAtDesc(agentId, pageable);
    }

    public Page<WalletTransaction> filterTransactions(Long agentId, LocalDateTime start, LocalDateTime end, Pageable pageable) {
        return walletTransactionRepository.findByAgentIdAndDateRange(agentId, start, end, pageable);
    }

    public PassbookSummaryDTO getSummary(Agent agent) {
        List<WalletTransaction> txs = walletTransactionRepository.findByAgentId(agent.getId());
        
        Double credits = txs.stream()
                .filter(t -> "CREDIT".equalsIgnoreCase(t.getTransactionType()) && "Success".equalsIgnoreCase(t.getStatus()))
                .mapToDouble(WalletTransaction::getAmount)
                .sum();
                
        Double debits = txs.stream()
                .filter(t -> "DEBIT".equalsIgnoreCase(t.getTransactionType()) && "Success".equalsIgnoreCase(t.getStatus()))
                .mapToDouble(WalletTransaction::getAmount)
                .sum();
                
        Double balance = (agent.getWallet() != null) ? agent.getWallet().getBalance() : 0.0;

        return PassbookSummaryDTO.builder()
                .totalCredits(credits)
                .totalDebits(debits)
                .currentBalance(balance)
                .build();
    }
}
