package com.stockflow.pac.security;

import com.stockflow.pac.user.UserAccount;
import com.stockflow.pac.user.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUser {
    private final UserRepository userRepository;

    public CurrentUser(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String getEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : null;
    }

    public UserAccount getOrThrow() {
        String email = getEmail();
        if (email == null) throw new IllegalStateException("Usuario nao autenticado");
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Usuario nao encontrado"));
    }
}
