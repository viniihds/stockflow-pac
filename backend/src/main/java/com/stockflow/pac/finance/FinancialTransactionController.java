package com.stockflow.pac.finance;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

import static com.stockflow.pac.finance.FinancialTransactionDTOs.*;

@RestController
@RequestMapping("/api/financial-transactions")
public class FinancialTransactionController {

    private final FinancialTransactionService service;

    public FinancialTransactionController(FinancialTransactionService service) {
        this.service = service;
    }

    @GetMapping
    public Page<Response> list(@RequestParam(required = false) Long financialCategoryId,
                               @RequestParam(required = false) Long costCenterId,
                               @RequestParam(required = false) TransactionType transactionType,
                               @RequestParam(required = false) LocalDate startDate,
                               @RequestParam(required = false) LocalDate endDate,
                               @RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "20") int size) {
        return service.list(financialCategoryId, costCenterId, transactionType, startDate, endDate, page, size)
                .map(Response::fromEntity);
    }

    @GetMapping("/{id}")
    public Response get(@PathVariable Long id) {
        return Response.fromEntity(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<Response> create(@Valid @RequestBody Create body) {
        var saved = service.create(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(Response.fromEntity(saved));
    }
}
