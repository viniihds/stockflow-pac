package com.stockflow.pac.finance;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.stockflow.pac.finance.FinanceReportDTOs.*;

@RestController
@RequestMapping("/api/finance/reports")
public class FinanceReportController {

    private final FinanceReportService service;

    public FinanceReportController(FinanceReportService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Response> generate(@RequestBody Request body) {
        var rep = service.generate(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(Response.fromEntity(rep));
    }
}
