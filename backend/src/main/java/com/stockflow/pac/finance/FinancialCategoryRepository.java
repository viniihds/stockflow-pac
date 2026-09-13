package com.stockflow.pac.finance;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FinancialCategoryRepository extends JpaRepository<FinancialCategory, Long> {
    Page<FinancialCategory> findByActiveIsTrue(Pageable pageable);
    Page<FinancialCategory> findByNameContainingIgnoreCaseAndActiveIsTrue(String name, Pageable pageable);
}
