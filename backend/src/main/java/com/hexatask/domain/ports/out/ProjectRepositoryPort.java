package com.hexatask.hexatask.domain.ports.out;

import com.hexatask.hexatask.domain.model.Project;
import com.hexatask.hexatask.domain.common.PageResult;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

public interface ProjectRepositoryPort {
    Project save(Project project);

    Optional<Project> findById(UUID id);

    List<Project> findAll();

    List<Project> findByOwnerId(UUID ownerId);

    PageResult<Project> findByOwnerId(UUID ownerId, int page, int size);

    boolean existsById(UUID id);
}
