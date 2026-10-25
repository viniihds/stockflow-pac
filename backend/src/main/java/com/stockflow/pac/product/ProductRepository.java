package com.stockflow.pac.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByCodeIgnoreCase(String code);
    Page<Product> findByUser_IdAndActiveIsTrue(Long userId, Pageable pageable);
    Page<Product> findByUser_IdAndNameContainingIgnoreCaseAndActiveIsTrue(Long userId, String name, Pageable pageable);
    Page<Product> findByUser_IdAndCategory_IdAndActiveIsTrue(Long userId, Long categoryId, Pageable pageable);
    java.util.Optional<Product> findByIdAndUser_Id(Long id, Long userId);
}
