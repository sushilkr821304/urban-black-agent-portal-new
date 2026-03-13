package com.urbanblack.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.urbanblack.dto.PaymentOrderRequest;
import com.urbanblack.dto.PaymentOrderResponse;
import com.urbanblack.dto.PaymentVerificationRequest;
import com.urbanblack.entity.Agent;
import com.urbanblack.entity.PaymentTransaction;
import com.urbanblack.repository.PaymentTransactionRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RazorpayService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    private RazorpayClient razorpayClient;

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final com.urbanblack.repository.WalletRepository walletRepository;

    @PostConstruct
    public void init() {
        try {
            this.razorpayClient = new RazorpayClient(keyId, keySecret);
        } catch (RazorpayException e) {
            log.error("Failed to initialize Razorpay Client: {}", e.getMessage());
        }
    }

    public PaymentOrderResponse createPaymentOrder(PaymentOrderRequest request, Agent agent) throws RazorpayException {
        // Razorpay expects amount in paise (1 INR = 100 paise)
        int amountInPaise = (int) (request.getAmount() * 100);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", request.getCurrency() != null ? request.getCurrency() : "INR");
        orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

        Order razorpayOrder = razorpayClient.orders.create(orderRequest);

        String orderId = razorpayOrder.get("id");
        String status = razorpayOrder.get("status");

        // Save transaction to DB
        PaymentTransaction transaction = PaymentTransaction.builder()
                .razorpayOrderId(orderId)
                .amount(request.getAmount())
                .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
                .status("CREATED")
                .agent(agent)
                .build();
        paymentTransactionRepository.save(transaction);

        return PaymentOrderResponse.builder()
                .razorpayOrderId(orderId)
                .amount(request.getAmount())
                .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
                .status(status)
                .build();
    }

    public boolean verifyPaymentSignature(PaymentVerificationRequest request) {
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.getRazorpayOrderId());
            options.put("razorpay_payment_id", request.getRazorpayPaymentId());
            options.put("razorpay_signature", request.getRazorpaySignature());

            boolean isValid = Utils.verifyPaymentSignature(options, keySecret);

            Optional<PaymentTransaction> transactionOpt = paymentTransactionRepository.findByRazorpayOrderId(request.getRazorpayOrderId());
            if (transactionOpt.isPresent()) {
                PaymentTransaction transaction = transactionOpt.get();
                transaction.setRazorpayPaymentId(request.getRazorpayPaymentId());
                transaction.setRazorpaySignature(request.getRazorpaySignature());
                
                if (isValid && !"SUCCESS".equals(transaction.getStatus())) {
                    transaction.setStatus("SUCCESS");
                    
                    // Update Agent Wallet Balance
                    Agent agent = transaction.getAgent();
                    if (agent != null && agent.getWallet() != null) {
                        com.urbanblack.entity.Wallet wallet = agent.getWallet();
                        wallet.setBalance(wallet.getBalance() + transaction.getAmount());
                        walletRepository.save(wallet);
                    }
                } else if (!isValid) {
                    transaction.setStatus("FAILED");
                }
                paymentTransactionRepository.save(transaction);
            }

            return isValid;
        } catch (RazorpayException e) {
            log.error("Signature verification failed: {}", e.getMessage());
            return false;
        }
    }
    public java.util.List<PaymentTransaction> getAllPayments() {
        return paymentTransactionRepository.findAll();
    }

    public java.util.List<PaymentTransaction> getPaymentsForAgent(Long agentId) {
        return paymentTransactionRepository.findByAgentId(agentId);
    }

    public Optional<PaymentTransaction> getPaymentById(Long id) {
        return paymentTransactionRepository.findById(id);
    }

    public Optional<PaymentTransaction> updatePaymentStatus(Long id, String status) {
        Optional<PaymentTransaction> transactionOpt = paymentTransactionRepository.findById(id);
        if (transactionOpt.isPresent()) {
            PaymentTransaction transaction = transactionOpt.get();
            transaction.setStatus(status);
            return Optional.of(paymentTransactionRepository.save(transaction));
        }
        return Optional.empty();
    }

    public boolean deletePayment(Long id) {
        if (paymentTransactionRepository.existsById(id)) {
            paymentTransactionRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
