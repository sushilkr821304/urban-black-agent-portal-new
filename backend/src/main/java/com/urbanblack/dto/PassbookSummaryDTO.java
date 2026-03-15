package com.urbanblack.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PassbookSummaryDTO {
    private Double totalCredits;
    private Double totalDebits;
    private Double currentBalance;
}
