package com.acnexus.projectmanagement.domain.ports.out;

import com.acnexus.projectmanagement.domain.model.RefreshToken;
import com.acnexus.projectmanagement.domain.model.User;
import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepositoryPort {
    Optional<RefreshToken> findByToken(String token);

    RefreshToken save(RefreshToken refreshToken);

    int deleteByUser(User user);
}
