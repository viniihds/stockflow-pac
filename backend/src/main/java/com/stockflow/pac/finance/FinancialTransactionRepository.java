package com.stockflow.pac.finance;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface FinancialTransactionRepository extends JpaRepository<FinancialTransaction, Long> {
    Page<FinancialTransaction> findByFinancialCategory_Id(Long categoryId, Pageable pageable);
    Page<FinancialTransaction> findByCostCenter_Id(Long costCenterId, Pageable pageable);
    Page<FinancialTransaction> findByTransactionType(TransactionType type, Pageable pageable);
    Page<FinancialTransaction> findByTransactionDateBetween(LocalDate start, LocalDate end, Pageable pageable);
    Page<FinancialTransaction> findByFinancialCategory_IdAndTransactionType(Long categoryId, TransactionType type, Pageable pageable);
    Page<FinancialTransaction> findByCostCenter_IdAndTransactionType(Long costCenterId, TransactionType type, Pageable pageable);
}
