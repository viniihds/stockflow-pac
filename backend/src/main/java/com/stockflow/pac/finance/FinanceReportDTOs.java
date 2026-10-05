package com.stockflow.pac.finance;

import jakarta.validation.constraints.Size;

import java.time.Instant;

public class FinanceReportDTOs {

    public record Request(
            String periodStart,
            String periodEnd,
            @Size(max = 120) String costCenter,
            @Size(max = 250) String notes
    ) {}

    public record Totals(double income, double expenses, double balance) {}

    public record Response(
            Long id,
            Instant createdAt,
            String periodStart,
            String periodEnd,
            Totals totals
    ) {
        public static Response fromEntity(FinanceReportService.Report r) {
            return new Response(r.id(), r.createdAt(), r.periodStart(), r.periodEnd(), new Totals(r.income(), r.expenses(), r.balance()));
        }
    }
}
