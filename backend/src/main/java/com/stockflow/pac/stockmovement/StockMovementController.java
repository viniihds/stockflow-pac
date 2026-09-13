package com.stockflow.pac.stockmovement;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.stockflow.pac.stockmovement.StockMovementDTOs.*;

@RestController
@RequestMapping("/api/stock-movements")
public class StockMovementController {

    private final StockMovementService stockMovementService;

    public StockMovementController(StockMovementService stockMovementService) {
        this.stockMovementService = stockMovementService;
    }

    @GetMapping
    public Page<Response> list(@RequestParam(required = false) Long productId,
                               @RequestParam(required = false) MovementType movementType,
                               @RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "20") int size) {
        return stockMovementService.list(productId, movementType, page, size).map(Response::fromEntity);
    }

    @GetMapping("/{id}")
    public Response get(@PathVariable Long id) {
        return Response.fromEntity(stockMovementService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Response> create(@Valid @RequestBody Create body) {
        var saved = stockMovementService.create(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(Response.fromEntity(saved));
    }
}
