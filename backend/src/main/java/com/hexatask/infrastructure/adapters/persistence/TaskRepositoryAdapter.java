package com.hexatask.hexatask.infrastructure.adapters.persistence;

import com.hexatask.hexatask.domain.model.Task;
import com.hexatask.hexatask.domain.ports.out.TaskRepositoryPort;
import com.hexatask.hexatask.infrastructure.entities.TaskEntity;
import com.hexatask.hexatask.infrastructure.mappers.TaskMapper;
import com.hexatask.hexatask.infrastructure.repositories.JpaTaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class TaskRepositoryAdapter implements TaskRepositoryPort {

    private final JpaTaskRepository repository;
    private final TaskMapper mapper;

    @Override
    public Task save(Task task) {
        var entity = mapper.toEntity(task);

        if (task.getId() != null) {
            repository.findById(task.getId()).ifPresent(existing -> {
                entity.setVersion(existing.getVersion());
            });
        }

        try {
            TaskEntity saved = repository.saveAndFlush(entity);
            return mapper.toDomain(saved);
        } catch (DataIntegrityViolationException ex) {
            log.warn("Data integrity violation while saving task: {}", ex.getMessage());
            throw ex;
        }
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
