package com.stockflow.pac.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoryDTOs {
    public record Create(
            @NotBlank @Size(max = 100) String name,
            @Size(max = 500) String description,
            @Size(max = 20) String color,
            Boolean active
    ) {}

    public record Update(
            @Size(max = 100) String name,
            @Size(max = 500) String description,
            @Size(max = 20) String color,
            Boolean active
    ) {}

    public record Response(
            Long id,
            String name,
            String description,
            String color,
            Boolean active
    ) {
        public static Response fromEntity(Category category) {
            return new Response(
                    category.getId(),
                    category.getName(),
                    category.getDescription(),
                    category.getColor(),
                    category.getActive()
            );
        }
    }
}
