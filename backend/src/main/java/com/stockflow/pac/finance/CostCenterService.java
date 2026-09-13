package com.stockflow.pac.finance;

import com.stockflow.pac.common.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import static com.stockflow.pac.finance.CostCenterDTOs.*;

@Service
public class CostCenterService {

    private final CostCenterRepository repository;

    public CostCenterService(CostCenterRepository repository) {
        this.repository = repository;
    }

    public Page<CostCenter> list(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (query != null && !query.isBlank()) {
            return repository.findByNameContainingIgnoreCaseAndActiveIsTrue(query, pageable);
        }
        return repository.findByActiveIsTrue(pageable);
    }

    public CostCenter getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Centro de custo não encontrado"));
    }

    public CostCenter create(Create body) {
        CostCenter costCenter = new CostCenter();
        costCenter.setName(body.name());
        costCenter.setDescription(body.description());
        costCenter.setActive(body.active() == null ? true : body.active());
        return repository.save(costCenter);
    }

    public CostCenter update(Long id, Update body) {
        CostCenter costCenter = getById(id);
        if (body.name() != null) costCenter.setName(body.name());
        if (body.description() != null) costCenter.setDescription(body.description());
        if (body.active() != null) costCenter.setActive(body.active());
        return repository.save(costCenter);
    }

    public void softDelete(Long id) {
        CostCenter costCenter = getById(id);
        costCenter.setActive(false);
        repository.save(costCenter);
    }
}
