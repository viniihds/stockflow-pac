package com.stockflow.pac.stockmovement;

import com.stockflow.pac.common.ResourceNotFoundException;
import com.stockflow.pac.product.Product;
import com.stockflow.pac.product.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.stockflow.pac.stockmovement.StockMovementDTOs.*;

@Service
public class StockMovementService {

    private final StockMovementRepository stockMovementRepository;
    private final ProductRepository productRepository;

    public StockMovementService(StockMovementRepository stockMovementRepository, ProductRepository productRepository) {
        this.stockMovementRepository = stockMovementRepository;
        this.productRepository = productRepository;
    }

    public Page<StockMovement> list(Long productId, MovementType movementType, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (productId != null && movementType != null) {
            return stockMovementRepository.findByProduct_IdAndMovementType(productId, movementType, pageable);
        }
        if (productId != null) {
            return stockMovementRepository.findByProduct_Id(productId, pageable);
        }
        if (movementType != null) {
            return stockMovementRepository.findByMovementType(movementType, pageable);
        }
        return stockMovementRepository.findAll(pageable);
    }

    public StockMovement getById(Long id) {
        return stockMovementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movimentação não encontrada"));
    }

    @Transactional
    public StockMovement create(Create body) {
        Product product = productRepository.findById(body.productId())
                .orElseThrow(() -> new IllegalArgumentException("Produto inválido"));

        if (body.quantity() == null || body.quantity() <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero");
        }
        if (body.movementType() == null) {
            throw new IllegalArgumentException("Tipo de movimentação é obrigatório");
        }

        // Calcula novo saldo
        int current = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
        int newQty = switch (body.movementType()) {
            case ENTRY -> current + body.quantity();
            case EXIT -> current - body.quantity();
        };
        if (newQty < 0) {
            throw new IllegalArgumentException("Estoque insuficiente para saída");
        }

        // Persiste movimentação
        StockMovement movement = new StockMovement();
        movement.setProduct(product);
        movement.setMovementType(body.movementType());
        movement.setQuantity(body.quantity());
        movement.setDestination(body.destination());
        movement.setReason(body.reason());
        if (body.movementDate() != null) {
            movement.setMovementDate(body.movementDate());
        }

        // Atualiza estoque do produto
        product.setStockQuantity(newQty);
        productRepository.save(product);

        return stockMovementRepository.save(movement);
    }
}
