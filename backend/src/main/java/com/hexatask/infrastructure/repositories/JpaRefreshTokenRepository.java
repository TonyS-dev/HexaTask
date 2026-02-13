package com.hexatask.hexatask.infrastructure.repositories;

import com.hexatask.hexatask.infrastructure.entities.RefreshTokenEntity;
import com.hexatask.hexatask.infrastructure.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface JpaRefreshTokenRepository extends JpaRepository<RefreshTokenEntity, UUID> {
    Optional<RefreshTokenEntity> findByToken(String token);

    @Modifying
    int deleteByUser(UserEntity user);
}
