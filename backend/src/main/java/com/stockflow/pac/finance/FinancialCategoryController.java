package com.stockflow.pac.finance;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.stockflow.pac.finance.FinancialCategoryDTOs.*;

@RestController
@RequestMapping("/api/financial-categories")
public class FinancialCategoryController {

    private final FinancialCategoryService service;

    public FinancialCategoryController(FinancialCategoryService service) {
        this.service = service;
    }

    @GetMapping
    public Page<Response> list(@RequestParam(name = "q", required = false) String query,
                               @RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "20") int size) {
        return service.list(query, page, size).map(Response::fromEntity);
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

    @PutMapping("/{id}")
    public Response update(@PathVariable Long id, @Valid @RequestBody Update body) {
        return Response.fromEntity(service.update(id, body));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDelete(@PathVariable Long id) {
        service.softDelete(id);
        return ResponseEntity.noContent().build();
    }
}
