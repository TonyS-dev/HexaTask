package com.acnexus.projectmanagement.infrastructure.adapter;

import com.acnexus.projectmanagement.domain.model.RefreshToken;
import com.acnexus.projectmanagement.domain.model.User;
import com.acnexus.projectmanagement.domain.ports.out.RefreshTokenRepositoryPort;
import com.acnexus.projectmanagement.infrastructure.persistence.entity.RefreshTokenEntity;
import com.acnexus.projectmanagement.infrastructure.persistence.mapper.RefreshTokenMapper;
import com.acnexus.projectmanagement.infrastructure.persistence.mapper.UserMapper;
import com.acnexus.projectmanagement.infrastructure.persistence.repository.JpaRefreshTokenRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class JpaRefreshTokenAdapter implements RefreshTokenRepositoryPort {

    private final JpaRefreshTokenRepository repository;
    private final RefreshTokenMapper mapper;
    private final UserMapper userMapper;

    public JpaRefreshTokenAdapter(JpaRefreshTokenRepository repository, RefreshTokenMapper mapper,
            UserMapper userMapper) {
        this.repository = repository;
        this.mapper = mapper;
        this.userMapper = userMapper;
    }

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return repository.findByToken(token).map(mapper::toDomain);
    }

    @Override
    public RefreshToken save(RefreshToken refreshToken) {
        RefreshTokenEntity entity = mapper.toEntity(refreshToken);
        RefreshTokenEntity saved = repository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public int deleteByUser(User user) {
        return repository.deleteByUser(userMapper.toEntity(user));
    }
}
