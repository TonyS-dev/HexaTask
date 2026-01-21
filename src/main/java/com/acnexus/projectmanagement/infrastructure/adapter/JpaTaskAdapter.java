package com.acnexus.projectmanagement.infrastructure.adapter;

import com.acnexus.projectmanagement.domain.model.Task;
import com.acnexus.projectmanagement.domain.ports.out.TaskRepositoryPort;
import com.acnexus.projectmanagement.infrastructure.persistence.entity.TaskEntity;
import com.acnexus.projectmanagement.infrastructure.persistence.mapper.TaskMapper;
import com.acnexus.projectmanagement.infrastructure.persistence.repository.JpaTaskRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class JpaTaskAdapter implements TaskRepositoryPort {

    private final JpaTaskRepository repository;
    private final TaskMapper mapper;

    public JpaTaskAdapter(JpaTaskRepository repository, TaskMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Task save(Task task) {
        TaskEntity entity = mapper.toEntity(task);
        TaskEntity saved = repository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Task> findById(UUID id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Task> findByProjectId(UUID projectId) {
        return repository.findByProjectId(projectId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public int countActiveTasksByProjectId(UUID projectId) {
        return repository.countActiveTasksByProjectId(projectId);
    }
}
