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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CompleteTaskUseCaseTest {

    @Mock
    private TaskRepositoryPort taskRepository;
    @Mock
    private DomainEventPublisher eventPublisher;
    @Mock
    private AuditLogPort auditLogPort;

    private CompleteTaskUseCaseImpl useCase;

    @BeforeEach
    void setUp() {
        useCase = new CompleteTaskUseCaseImpl(taskRepository, eventPublisher, auditLogPort);
    }

    @Test
    void execute_ShouldGenerateAuditAndNotification() {
        UUID taskId = UUID.randomUUID();
        Task task = new Task(taskId, UUID.randomUUID(), "Title", "Desc", TaskStatus.TO_DO, false, false,
                UUID.randomUUID(), OffsetDateTime.now(), OffsetDateTime.now(), 0L);

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));

        useCase.execute(taskId);

        assertEquals(TaskStatus.DONE, task.getStatus());
        verify(taskRepository).save(task);
        verify(auditLogPort).register(eq("TASK_COMPLETED"), eq(taskId));
        verify(eventPublisher).publish(any(TaskCompletedEvent.class));
    }

    @Test
    void execute_AlreadyCompleted_ShouldFail() {
        UUID taskId = UUID.randomUUID();
        Task task = new Task(taskId, UUID.randomUUID(), "Title", "Desc", TaskStatus.DONE, false, false,
                UUID.randomUUID(), OffsetDateTime.now(), OffsetDateTime.now(), 0L);

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));

        assertThrows(InvalidDomainStateException.class, () -> useCase.execute(taskId));

        verify(taskRepository, never()).save(any());
        verify(auditLogPort, never()).register(any(), any());
        verify(eventPublisher, never()).publish(any());
    }

    @Test
    void execute_TaskNotFound_ShouldFail() {
        UUID taskId = UUID.randomUUID();

        when(taskRepository.findById(taskId)).thenReturn(java.util.Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> useCase.execute(taskId));

        verify(taskRepository, never()).save(any());
        verify(auditLogPort, never()).register(any(), any());
        verify(eventPublisher, never()).publish(any());
    }
}
