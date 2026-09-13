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
        public static Response fromEntity(StockMovement movement) {
            return new Response(
                    movement.getId(),
                    movement.getProduct() != null ? movement.getProduct().getId() : null,
                    movement.getMovementType(),
                    movement.getQuantity(),
                    movement.getDestination(),
                    movement.getReason(),
                    movement.getMovementDate()
            );
        }
    }
}
