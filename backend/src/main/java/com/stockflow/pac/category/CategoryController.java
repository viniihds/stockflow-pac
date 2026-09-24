package com.stockflow.pac.category;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMethod;

import static com.stockflow.pac.category.CategoryDTOs.*;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(
        origins = {"http://localhost:5173"},
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
        allowedHeaders = {"*"}
)
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public Page<Response> list(@RequestParam(name = "q", required = false) String query,
                               @RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "20") int size) {
        return categoryService.list(query, page, size).map(Response::fromEntity);
    }

    @GetMapping("/{id}")
    public Response get(@PathVariable Long id) {
        return Response.fromEntity(categoryService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Response> create(@Valid @RequestBody Create body) {
        Category savedCategory = categoryService.create(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(Response.fromEntity(savedCategory));
    }

    @PutMapping("/{id}")
    public Response update(@PathVariable Long id, @Valid @RequestBody Update body) {
        return Response.fromEntity(categoryService.update(id, body));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDelete(@PathVariable Long id) {
        categoryService.softDelete(id);
        return ResponseEntity.noContent().build();
    }
}
