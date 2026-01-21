package com.acnexus.projectmanagement.infrastructure.adapter;

import com.acnexus.projectmanagement.domain.model.Project;
import com.acnexus.projectmanagement.domain.ports.out.ProjectRepositoryPort;
import com.acnexus.projectmanagement.infrastructure.persistence.entity.ProjectEntity;
import com.acnexus.projectmanagement.infrastructure.persistence.mapper.ProjectMapper;
import com.acnexus.projectmanagement.infrastructure.persistence.repository.JpaProjectRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class JpaProjectAdapter implements ProjectRepositoryPort {

    private final JpaProjectRepository repository;
    private final ProjectMapper mapper;

    public JpaProjectAdapter(JpaProjectRepository repository, ProjectMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Project save(Project project) {
        ProjectEntity entity = mapper.toEntity(project);
        ProjectEntity saved = repository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Project> findById(UUID id) {
        return repository.findById(id).map(mapper::toDomain);
    }
}
