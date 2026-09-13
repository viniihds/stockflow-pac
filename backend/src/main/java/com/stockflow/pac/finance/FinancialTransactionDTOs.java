package com.stockflow.pac.finance;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class FinancialTransactionDTOs {

    public record Create(
            @NotNull Long financialCategoryId,
            Long costCenterId,
            Long stockMovementId,
            @NotNull TransactionType transactionType,
            String description,
            @NotNull @DecimalMin(value = "0.01", inclusive = true) BigDecimal amount,
            LocalDate transactionDate
    ) {}

    public record Response(
            Long id,
            Long financialCategoryId,
            Long costCenterId,
            Long stockMovementId,
            TransactionType transactionType,
            String description,
            BigDecimal amount,
            LocalDate transactionDate
    ) {
        public static Response fromEntity(FinancialTransaction transaction) {
            return new Response(
                    transaction.getId(),
                    transaction.getFinancialCategory() != null ? transaction.getFinancialCategory().getId() : null,
                    transaction.getCostCenter() != null ? transaction.getCostCenter().getId() : null,
                    transaction.getStockMovement() != null ? transaction.getStockMovement().getId() : null,
                    transaction.getTransactionType(),
                    transaction.getDescription(),
                    transaction.getAmount(),
                    transaction.getTransactionDate()
            );
        }
    }
}
