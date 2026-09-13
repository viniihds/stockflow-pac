package com.stockflow.pac.finance;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CostCenterRepository extends JpaRepository<CostCenter, Long> {
    Page<CostCenter> findByActiveIsTrue(Pageable pageable);
    Page<CostCenter> findByNameContainingIgnoreCaseAndActiveIsTrue(String name, Pageable pageable);
}
