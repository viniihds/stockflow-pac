package com.stockflow.pac.reports;

import jakarta.validation.constraints.Size;

import java.time.Instant;

public class ReportsDTOs {

    public record Create(
            @Size(max = 150) String title,
            String periodStart,
            String periodEnd,
            String filters
    ) {}

    public record Response(
            Long id,
            String title,
            String periodStart,
            String periodEnd,
            Instant createdAt,
            String filters
    ) {
        public static Response fromEntity(ReportsService.Report r) {
            return new Response(r.id(), r.title(), r.periodStart(), r.periodEnd(), r.createdAt(), r.filters());
        }
    }
}
