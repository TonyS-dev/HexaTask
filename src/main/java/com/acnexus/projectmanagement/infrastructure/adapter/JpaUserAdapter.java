package com.acnexus.projectmanagement.infrastructure.adapter;

import com.acnexus.projectmanagement.domain.model.User;
import com.acnexus.projectmanagement.domain.ports.out.UserRepositoryPort;
import com.acnexus.projectmanagement.infrastructure.persistence.entity.UserEntity;
import com.acnexus.projectmanagement.infrastructure.persistence.mapper.UserMapper;
import com.acnexus.projectmanagement.infrastructure.persistence.repository.JpaUserRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class JpaUserAdapter implements UserRepositoryPort {

    private final JpaUserRepository repository;
    private final UserMapper mapper;

    public JpaUserAdapter(JpaUserRepository repository, UserMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public User save(User user) {
        UserEntity entity = mapper.toEntity(user);
        UserEntity saved = repository.save(entity);
        return mapper.toDomain(saved);
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
}
