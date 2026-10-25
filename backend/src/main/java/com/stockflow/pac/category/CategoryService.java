package com.stockflow.pac.category;

import com.stockflow.pac.common.ResourceNotFoundException;
import com.stockflow.pac.security.CurrentUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import static com.stockflow.pac.category.CategoryDTOs.*;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CurrentUser currentUser;

    public CategoryService(CategoryRepository categoryRepository, CurrentUser currentUser) {
        this.categoryRepository = categoryRepository;
        this.currentUser = currentUser;
    }

    public Page<Category> list(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Long userId = currentUser.getOrThrow().getId();
        if (query != null && !query.isBlank()) {
            return categoryRepository.findByUser_IdAndNameContainingIgnoreCaseAndActiveIsTrue(userId, query, pageable);
        }
        return categoryRepository.findByUser_IdAndActiveIsTrue(userId, pageable);
    }

    public Category getById(Long id) {
        Long userId = currentUser.getOrThrow().getId();
        return categoryRepository.findByIdAndUser_Id(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));
    }

    public Category create(Create body) {
        // associa ao usuario autenticado
        var user = currentUser.getOrThrow();
        Category category = new Category();
        category.setName(body.name());
        category.setDescription(body.description());
        category.setColor(body.color());
        category.setActive(body.active() == null ? true : body.active());
        category.setUser(user);
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
