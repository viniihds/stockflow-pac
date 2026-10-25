package com.stockflow.pac.product;

import com.stockflow.pac.category.Category;
import com.stockflow.pac.category.CategoryRepository;
import com.stockflow.pac.common.ResourceNotFoundException;
import com.stockflow.pac.security.CurrentUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import static com.stockflow.pac.product.ProductDTOs.*;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CurrentUser currentUser;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, CurrentUser currentUser) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.currentUser = currentUser;
    }

    public Page<Product> list(String query, Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Long userId = currentUser.getOrThrow().getId();
        if (categoryId != null) {
            return productRepository.findByUser_IdAndCategory_IdAndActiveIsTrue(userId, categoryId, pageable);
        }
        if (query != null && !query.isBlank()) {
            return productRepository.findByUser_IdAndNameContainingIgnoreCaseAndActiveIsTrue(userId, query, pageable);
        }
        return productRepository.findByUser_IdAndActiveIsTrue(userId, pageable);
    }

    public Product getById(Long id) {
        Long userId = currentUser.getOrThrow().getId();
        return productRepository.findByIdAndUser_Id(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));
    }

    public Product create(Create body) {
        Category category = categoryRepository.findById(body.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("Categoria inválida"));

        Product product = new Product();
        product.setCategory(category);
        product.setName(body.name());
        product.setCode(body.code());
        product.setPrice(body.price());
        product.setStockQuantity(body.stockQuantity());
        product.setMinimumStock(body.minimumStock());
        product.setDescription(body.description());
        product.setActive(body.active() == null ? true : body.active());
        product.setUser(currentUser.getOrThrow());
        return productRepository.save(product);
    }

    public Product update(Long id, Update body) {
        Product product = getById(id);
        if (body.categoryId() != null) {
            Category category = categoryRepository.findById(body.categoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Categoria inválida"));
            product.setCategory(category);
        }
        if (body.name() != null) product.setName(body.name());
        if (body.code() != null) product.setCode(body.code());
        if (body.price() != null) product.setPrice(body.price());
        if (body.stockQuantity() != null) product.setStockQuantity(body.stockQuantity());
        if (body.minimumStock() != null) product.setMinimumStock(body.minimumStock());
        if (body.description() != null) product.setDescription(body.description());
        if (body.active() != null) product.setActive(body.active());
        return productRepository.save(product);
    }

    public void softDelete(Long id) {
        Product product = getById(id);
        product.setActive(false);
        productRepository.save(product);
    }
}
