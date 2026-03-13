package com.urbanblack.dto;

import lombok.Data;

@Data
public class PaymentOrderRequest {
    private Double amount;
    private String currency;
}
