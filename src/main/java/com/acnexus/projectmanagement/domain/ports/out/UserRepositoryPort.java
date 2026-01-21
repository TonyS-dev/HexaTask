package com.acnexus.projectmanagement.domain.ports.out;

import com.acnexus.projectmanagement.domain.model.User;
import java.util.Optional;
import java.util.UUID;

public interface UserRepositoryPort {
    User save(User user);

    Optional<User> findByEmail(String email);

    Optional<User> findById(UUID id);

    boolean existsByEmail(String email);
}
