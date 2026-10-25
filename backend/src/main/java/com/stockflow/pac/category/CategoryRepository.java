package com.stockflow.pac.category;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByNameIgnoreCase(String name);
    Page<Category> findByUser_IdAndNameContainingIgnoreCaseAndActiveIsTrue(Long userId, String name, Pageable pageable);
    Page<Category> findByUser_IdAndActiveIsTrue(Long userId, Pageable pageable);
    java.util.Optional<Category> findByIdAndUser_Id(Long id, Long userId);
}
