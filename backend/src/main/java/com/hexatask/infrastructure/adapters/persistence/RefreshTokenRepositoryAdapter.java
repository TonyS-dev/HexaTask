package com.hexatask.hexatask.infrastructure.adapters.persistence;

import com.hexatask.hexatask.domain.model.RefreshToken;
import com.hexatask.hexatask.domain.model.User;
import com.hexatask.hexatask.domain.ports.out.RefreshTokenRepositoryPort;
import com.hexatask.hexatask.infrastructure.entities.RefreshTokenEntity;
import com.hexatask.hexatask.infrastructure.mappers.RefreshTokenMapper;
import com.hexatask.hexatask.infrastructure.mappers.UserMapper;
import com.hexatask.hexatask.infrastructure.repositories.JpaRefreshTokenRepository;
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
