package com.stockflow.pac.finance;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CostCenterDTOs {
    public record Create(
            @NotBlank @Size(max = 100) String name,
            @Size(max = 500) String description,
            Boolean active
    ) {}

    public record Update(
            @Size(max = 100) String name,
            @Size(max = 500) String description,
            Boolean active
    ) {}

    public record Response(
            Long id,
            String name,
            String description,
            Boolean active
    ) {
        public static Response fromEntity(CostCenter costCenter) {
            return new Response(
                    costCenter.getId(),
                    costCenter.getName(),
                    costCenter.getDescription(),
                    costCenter.getActive()
            );
        }
    }
}
