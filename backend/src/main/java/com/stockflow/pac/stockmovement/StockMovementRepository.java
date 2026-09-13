package com.stockflow.pac.stockmovement;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    Page<StockMovement> findByProduct_Id(Long productId, Pageable pageable);
    Page<StockMovement> findByMovementType(MovementType movementType, Pageable pageable);
    Page<StockMovement> findByProduct_IdAndMovementType(Long productId, MovementType movementType, Pageable pageable);
}
