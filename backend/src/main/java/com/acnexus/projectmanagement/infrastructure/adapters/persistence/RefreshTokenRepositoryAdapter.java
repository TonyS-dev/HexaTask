package com.acnexus.projectmanagement.infrastructure.adapters.persistence;

import com.acnexus.projectmanagement.domain.model.RefreshToken;
import com.acnexus.projectmanagement.domain.model.User;
import com.acnexus.projectmanagement.domain.ports.out.RefreshTokenRepositoryPort;
import com.acnexus.projectmanagement.infrastructure.entities.RefreshTokenEntity;
import com.acnexus.projectmanagement.infrastructure.mappers.RefreshTokenMapper;
import com.acnexus.projectmanagement.infrastructure.mappers.UserMapper;
import com.acnexus.projectmanagement.infrastructure.repositories.JpaRefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenRepositoryAdapter implements RefreshTokenRepositoryPort {

    private final JpaRefreshTokenRepository repository;
    private final RefreshTokenMapper mapper;
    private final UserMapper userMapper;

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return repository.findByToken(token).map(mapper::toDomain);
    }

    @Override
    public RefreshToken save(RefreshToken refreshToken) {
        var entity = mapper.toEntity(refreshToken);

        if (refreshToken.getId() != null) {
            repository.findById(refreshToken.getId()).ifPresent(existing -> {
                entity.setVersion(existing.getVersion());
            });
        }

        try {
            RefreshTokenEntity saved = repository.saveAndFlush(entity);
            return mapper.toDomain(saved);
        } catch (DataIntegrityViolationException ex) {
            log.warn("Data integrity violation while saving refresh token: {}", ex.getMessage());
            throw ex;
        }
    }

    @Override
    public int deleteByUser(User user) {
        return repository.deleteByUser(userMapper.toEntity(user));
    }
}
