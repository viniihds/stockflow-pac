package com.stockflow.pac.finance;

import com.stockflow.pac.common.ResourceNotFoundException;
import com.stockflow.pac.stockmovement.StockMovement;
import com.stockflow.pac.stockmovement.StockMovementRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static com.stockflow.pac.finance.FinancialTransactionDTOs.*;

@Service
public class FinancialTransactionService {

    private final FinancialTransactionRepository transactionRepository;
    private final FinancialCategoryRepository financialCategoryRepository;
    private final CostCenterRepository costCenterRepository;
    private final StockMovementRepository stockMovementRepository;

    public FinancialTransactionService(FinancialTransactionRepository transactionRepository,
                                       FinancialCategoryRepository financialCategoryRepository,
                                       CostCenterRepository costCenterRepository,
                                       StockMovementRepository stockMovementRepository) {
        this.transactionRepository = transactionRepository;
        this.financialCategoryRepository = financialCategoryRepository;
        this.costCenterRepository = costCenterRepository;
        this.stockMovementRepository = stockMovementRepository;
    }

    public Page<FinancialTransaction> list(Long financialCategoryId,
                                           Long costCenterId,
                                           TransactionType transactionType,
                                           LocalDate startDate,
                                           LocalDate endDate,
                                           int page,
                                           int size) {
        Pageable pageable = PageRequest.of(page, size);

        if (startDate != null && endDate != null) {
            return transactionRepository.findByTransactionDateBetween(startDate, endDate, pageable);
        }
        if (financialCategoryId != null && transactionType != null) {
            return transactionRepository.findByFinancialCategory_IdAndTransactionType(financialCategoryId, transactionType, pageable);
        }
        if (costCenterId != null && transactionType != null) {
            return transactionRepository.findByCostCenter_IdAndTransactionType(costCenterId, transactionType, pageable);
        }
        if (financialCategoryId != null) {
            return transactionRepository.findByFinancialCategory_Id(financialCategoryId, pageable);
        }
        if (costCenterId != null) {
            return transactionRepository.findByCostCenter_Id(costCenterId, pageable);
        }
        if (transactionType != null) {
            return transactionRepository.findByTransactionType(transactionType, pageable);
        }
        return transactionRepository.findAll(pageable);
    }

    public FinancialTransaction getById(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transação financeira não encontrada"));
    }

    @Transactional
    public FinancialTransaction create(Create body) {
        var category = financialCategoryRepository.findById(body.financialCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Categoria financeira inválida"));

        CostCenter costCenter = null;
        if (body.costCenterId() != null) {
            costCenter = costCenterRepository.findById(body.costCenterId())
                    .orElseThrow(() -> new IllegalArgumentException("Centro de custo inválido"));
        }

        StockMovement stockMovement = null;
        if (body.stockMovementId() != null) {
            stockMovement = stockMovementRepository.findById(body.stockMovementId())
                    .orElseThrow(() -> new IllegalArgumentException("Movimentação de estoque inválida"));
        }

        if (body.amount() == null || body.amount().signum() <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero");
        }
        if (body.transactionType() == null) {
            throw new IllegalArgumentException("Tipo de transação é obrigatório");
        }

        FinancialTransaction transaction = new FinancialTransaction();
        transaction.setFinancialCategory(category);
        transaction.setCostCenter(costCenter);
        transaction.setStockMovement(stockMovement);
        transaction.setTransactionType(body.transactionType());
        transaction.setDescription(body.description());
        transaction.setAmount(body.amount());
        if (body.transactionDate() != null) {
            transaction.setTransactionDate(body.transactionDate());
        }

        return transactionRepository.save(transaction);
    }
}
