package com.stockflow.pac.product;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.stockflow.pac.product.ProductDTOs.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public Page<Response> list(@RequestParam(name = "q", required = false) String query,
                               @RequestParam(required = false) Long categoryId,
                               @RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "20") int size) {
        return productService.list(query, categoryId, page, size).map(Response::fromEntity);
    }

    @GetMapping("/{id}")
    public Response get(@PathVariable Long id) {
        return Response.fromEntity(productService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Response> create(@Valid @RequestBody Create body) {
        Product savedProduct = productService.create(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(Response.fromEntity(savedProduct));
    }

    @PutMapping("/{id}")
    public Response update(@PathVariable Long id, @Valid @RequestBody Update body) {
        return Response.fromEntity(productService.update(id, body));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDelete(@PathVariable Long id) {
        productService.softDelete(id);
        return ResponseEntity.noContent().build();
    }
}
