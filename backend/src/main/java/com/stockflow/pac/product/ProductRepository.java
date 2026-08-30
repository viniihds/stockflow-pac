package com.stockflow.pac.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByCodeIgnoreCase(String code);
    Page<Product> findByActiveIsTrue(Pageable pageable);
    Page<Product> findByNameContainingIgnoreCaseAndActiveIsTrue(String name, Pageable pageable);
    Page<Product> findByCategory_IdAndActiveIsTrue(Long categoryId, Pageable pageable);
}
