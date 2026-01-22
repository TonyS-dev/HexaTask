package com.acnexus.projectmanagement.infrastructure.adapters.persistence;

import com.acnexus.projectmanagement.domain.common.PageResult;
import com.acnexus.projectmanagement.domain.model.Project;
import com.acnexus.projectmanagement.domain.ports.out.ProjectRepositoryPort;
import com.acnexus.projectmanagement.infrastructure.entities.ProjectEntity;
import com.acnexus.projectmanagement.infrastructure.mappers.ProjectMapper;
import com.acnexus.projectmanagement.infrastructure.repositories.JpaProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProjectRepositoryAdapter implements ProjectRepositoryPort {

    private final JpaProjectRepository repository;
    private final ProjectMapper mapper;

    @Override
    public Project save(Project project) {
        var entity = mapper.toEntity(project);

        if (project.getId() != null) {
            repository.findById(project.getId()).ifPresent(existing -> {
                entity.setVersion(existing.getVersion());
            });
        }

        try {
            ProjectEntity saved = repository.saveAndFlush(entity);
            return mapper.toDomain(saved);
        } catch (DataIntegrityViolationException ex) {
            log.warn("Data integrity violation while saving project: {}", ex.getMessage());
            throw ex;
        }
    }

    @Override
    public Optional<Project> findById(UUID id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Project> findAll() {
        return repository.findAll().stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Project> findByOwnerId(UUID ownerId) {
        return repository.findByOwnerId(ownerId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

        @Override
        public PageResult<Project> findByOwnerId(UUID ownerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ProjectEntity> result = repository.findByOwnerId(ownerId, pageable);

        List<Project> content = result.getContent().stream()
            .map(mapper::toDomain)
            .collect(Collectors.toList());

        return PageResult.of(
            content,
            page,
            size,
            result.getTotalElements(),
            result.getTotalPages(),
            result.hasNext(),
            result.hasPrevious());
        }

    @Override
    public boolean existsById(UUID id) {
        return repository.existsById(id);
    }
}
