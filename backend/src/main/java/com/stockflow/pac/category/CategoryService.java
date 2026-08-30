package com.stockflow.pac.category;

import com.stockflow.pac.common.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import static com.stockflow.pac.category.CategoryDTOs.*;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Page<Category> list(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (query != null && !query.isBlank()) {
            return categoryRepository.findByNameContainingIgnoreCaseAndActiveIsTrue(query, pageable);
        }
        return categoryRepository.findByActiveIsTrue(pageable);
    }

    public Category getById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));
    }

    public Category create(Create body) {
        Category category = new Category();
        category.setName(body.name());
        category.setDescription(body.description());
        category.setColor(body.color());
        category.setActive(body.active() == null ? true : body.active());
        return categoryRepository.save(category);
    }

    public Category update(Long id, Update body) {
        Category category = getById(id);
        if (body.name() != null) category.setName(body.name());
        if (body.description() != null) category.setDescription(body.description());
        if (body.color() != null) category.setColor(body.color());
        if (body.active() != null) category.setActive(body.active());
        return categoryRepository.save(category);
    }

    public void softDelete(Long id) {
        Category category = getById(id);
        category.setActive(false);
        categoryRepository.save(category);
    }
}
