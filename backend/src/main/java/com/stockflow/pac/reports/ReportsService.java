package com.stockflow.pac.reports;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class ReportsService {

    public record Report(Long id, String title, String periodStart, String periodEnd, Instant createdAt, String filters) {}

    private final List<Report> store = new ArrayList<>();
    private final AtomicLong seq = new AtomicLong(1);

    public synchronized List<Report> list() {
        return List.copyOf(store);
    }

    public synchronized Report create(ReportsDTOs.Create body) {
        var id = seq.getAndIncrement();
        var now = Instant.now();
        var report = new Report(id,
                body.title(),
                body.periodStart(),
                body.periodEnd(),
                now,
                body.filters());
        store.add(report);
        return report;
    }
}
