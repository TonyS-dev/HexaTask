package com.acnexus.projectmanagement.application.usecase.tasks;

import com.acnexus.projectmanagement.domain.events.TaskCompletedEvent;
import com.acnexus.projectmanagement.domain.exception.InvalidDomainStateException;
import com.acnexus.projectmanagement.domain.exception.ResourceNotFoundException;
import com.acnexus.projectmanagement.domain.model.Task;
import com.acnexus.projectmanagement.domain.model.TaskStatus;
import com.acnexus.projectmanagement.domain.ports.in.tasks.CompleteTaskUseCase;
import com.acnexus.projectmanagement.domain.ports.out.AuditLogPort;
import com.acnexus.projectmanagement.domain.ports.out.DomainEventPublisher;
import com.acnexus.projectmanagement.domain.ports.out.TaskRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class CompleteTaskUseCaseImpl implements CompleteTaskUseCase {

    private final TaskRepositoryPort taskRepository;
    private final DomainEventPublisher eventPublisher;
    private final AuditLogPort auditLogPort;

    public CompleteTaskUseCaseImpl(TaskRepositoryPort taskRepository,
            DomainEventPublisher eventPublisher,
            AuditLogPort auditLogPort) {
        this.taskRepository = taskRepository;
        this.eventPublisher = eventPublisher;
        this.auditLogPort = auditLogPort;
    }

    @Override
    @Transactional
    public void execute(UUID taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        if (task.getStatus() == TaskStatus.DONE) {
            throw new InvalidDomainStateException("Task is already completed.");
        }

        task.complete();
        taskRepository.save(task);

        auditLogPort.register("TASK_COMPLETED", taskId);
        eventPublisher.publish(new TaskCompletedEvent(taskId));
    }
}
