package com.stockflow.pac.stockmovement;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public class StockMovementDTOs {

    public record Create(
            @NotNull Long productId,
            @NotNull MovementType movementType,
            @NotNull @Min(1) Integer quantity,
            String destination,
            String reason,
            Instant movementDate
    ) {}

    public record Response(
            Long id,
            Long productId,
            MovementType movementType,
            Integer quantity,
            String destination,
            String reason,
            Instant movementDate
    ) {
        public static Response fromEntity(StockMovement m) {
            return new Response(
                    m.getId(),
                    m.getProduct() != null ? m.getProduct().getId() : null,
                    m.getMovementType(),
                    m.getQuantity(),
                    m.getDestination(),
                    m.getReason(),
                    m.getMovementDate()
            );
        }
    }
}
