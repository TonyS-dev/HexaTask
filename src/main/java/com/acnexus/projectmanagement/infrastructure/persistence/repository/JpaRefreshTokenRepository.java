package com.acnexus.projectmanagement.infrastructure.persistence.repository;

import com.acnexus.projectmanagement.infrastructure.persistence.entity.RefreshTokenEntity;
import com.acnexus.projectmanagement.infrastructure.persistence.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.Optional;
import java.util.UUID;

public interface JpaRefreshTokenRepository extends JpaRepository<RefreshTokenEntity, UUID> {
    Optional<RefreshTokenEntity> findByToken(String token);

    @Modifying
    int deleteByUser(UserEntity user);
}
