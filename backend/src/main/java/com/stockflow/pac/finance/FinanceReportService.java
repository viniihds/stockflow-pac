package com.stockflow.pac.finance;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class FinanceReportService {

    public record Report(Long id, Instant createdAt, String periodStart, String periodEnd, double income, double expenses) {
        public double balance() { return income - expenses; }
    }

    private final AtomicLong seq = new AtomicLong(1);

    public synchronized Report generate(FinanceReportDTOs.Request req) {
        // Lógica simples: apenas gera valores determinísticos baseados no tempo atual para efeito de protótipo
        long id = seq.getAndIncrement();
        Instant now = Instant.now();
        // Exemplo determinístico: usar nanos atuais para variar um pouco
        double base = (now.getEpochSecond() % 1000) / 10.0;
        double income = 1000.0 + base * 3;
        double expenses = 400.0 + base;
        return new Report(id, now, req.periodStart(), req.periodEnd(), income, expenses);
    }
}
