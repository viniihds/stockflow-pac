package com.stockflow.pac.product;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class ProductDTOs {
    public record Create(
            @NotNull Long categoryId,
            @NotBlank @Size(max = 150) String name,
            @NotBlank @Size(max = 50) String code,
            @NotNull @DecimalMin(value = "0.0", inclusive = true) BigDecimal price,
            @NotNull @Min(0) Integer stockQuantity,
            @NotNull @Min(0) Integer minimumStock,
            @Size(max = 1000) String description,
            Boolean active
    ) {}

    public record Update(
            Long categoryId,
            @Size(max = 150) String name,
            @Size(max = 50) String code,
            @DecimalMin(value = "0.0", inclusive = true) BigDecimal price,
            @Min(0) Integer stockQuantity,
            @Min(0) Integer minimumStock,
            @Size(max = 1000) String description,
            Boolean active
    ) {}

    public record Response(
            Long id,
            Long categoryId,
            String name,
            String code,
            BigDecimal price,
            Integer stockQuantity,
            Integer minimumStock,
            String description,
            Boolean active
    ) {
        public static Response fromEntity(Product product) {
            return new Response(
                    product.getId(),
                    product.getCategory() != null ? product.getCategory().getId() : null,
                    product.getName(),
                    product.getCode(),
                    product.getPrice(),
                    product.getStockQuantity(),
                    product.getMinimumStock(),
                    product.getDescription(),
                    product.getActive()
            );
        }
    }
}
