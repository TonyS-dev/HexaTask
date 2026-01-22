package com.acnexus.projectmanagement.infrastructure.adapters.persistence;

import com.acnexus.projectmanagement.domain.model.User;
import com.acnexus.projectmanagement.domain.ports.out.UserRepositoryPort;
import com.acnexus.projectmanagement.infrastructure.entities.UserEntity;
import com.acnexus.projectmanagement.infrastructure.mappers.UserMapper;
import com.acnexus.projectmanagement.infrastructure.repositories.JpaUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserRepositoryAdapter implements UserRepositoryPort {

    private final JpaUserRepository repository;
    private final UserMapper mapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User save(User user) {
        var entity = mapper.toEntity(user);

        // If updating existing user, preserve version field
        if (user.getId() != null) {
            repository.findById(user.getId()).ifPresent(existing -> {
                entity.setVersion(existing.getVersion());
            });
        }

        // Encode password if it's not already encoded (doesn't start with $2a$)
        if (entity.getPassword() != null && !entity.getPassword().startsWith("$2a$")) {
            entity.setPassword(passwordEncoder.encode(entity.getPassword()));
        }

        try {
            UserEntity saved = repository.saveAndFlush(entity);
            return mapper.toDomain(saved);
        } catch (DataIntegrityViolationException ex) {
            log.warn("Data integrity violation while saving user: {}", ex.getMessage());
            throw ex;
        }
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return repository.findByEmail(email).map(mapper::toDomain);
    }

    @Override
    public Optional<User> findById(UUID id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public boolean existsByEmail(String email) {
        return repository.findByEmail(email).isPresent();
    }

    @Override
    public boolean existsById(UUID id) {
        return repository.existsById(id);
    }
}
