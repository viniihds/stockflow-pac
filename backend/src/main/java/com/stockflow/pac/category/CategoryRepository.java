package com.stockflow.pac.category;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByNameIgnoreCase(String name);
    Page<Category> findByNameContainingIgnoreCaseAndActiveIsTrue(String name, Pageable pageable);
    Page<Category> findByActiveIsTrue(Pageable pageable);
}
