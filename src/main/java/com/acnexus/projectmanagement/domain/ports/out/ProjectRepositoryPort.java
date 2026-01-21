package com.acnexus.projectmanagement.domain.ports.out;

import com.acnexus.projectmanagement.domain.model.Project;
import java.util.Optional;
import java.util.UUID;

public interface ProjectRepositoryPort {
    Project save(Project project);

    Optional<Project> findById(UUID id);
    // Add other methods as needed (findAll, etc.)
}
