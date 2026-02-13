package com.hexatask.hexatask.domain.ports.out;

import com.hexatask.hexatask.domain.model.RefreshToken;
import com.hexatask.hexatask.domain.model.User;
import java.util.Optional;

public interface RefreshTokenRepositoryPort {
    Optional<RefreshToken> findByToken(String token);

    RefreshToken save(RefreshToken refreshToken);

    int deleteByUser(User user);
}
