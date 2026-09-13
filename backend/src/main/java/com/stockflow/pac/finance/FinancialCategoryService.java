package com.stockflow.pac.finance;

import com.stockflow.pac.common.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import static com.stockflow.pac.finance.FinancialCategoryDTOs.*;

@Service
public class FinancialCategoryService {

    private final FinancialCategoryRepository repository;

    public FinancialCategoryService(FinancialCategoryRepository repository) {
        this.repository = repository;
    }

    public Page<FinancialCategory> list(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (query != null && !query.isBlank()) {
            return repository.findByNameContainingIgnoreCaseAndActiveIsTrue(query, pageable);
        }
        return repository.findByActiveIsTrue(pageable);
    }

    public FinancialCategory getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria financeira não encontrada"));
    }

    public FinancialCategory create(Create body) {
        FinancialCategory category = new FinancialCategory();
        category.setName(body.name());
        category.setDescription(body.description());
        category.setActive(body.active() == null ? true : body.active());
        return repository.save(category);
    }

    public FinancialCategory update(Long id, Update body) {
        FinancialCategory category = getById(id);
        if (body.name() != null) category.setName(body.name());
        if (body.description() != null) category.setDescription(body.description());
        if (body.active() != null) category.setActive(body.active());
        return repository.save(category);
    }

    public void softDelete(Long id) {
        FinancialCategory category = getById(id);
        category.setActive(false);
        repository.save(category);
    }
}
