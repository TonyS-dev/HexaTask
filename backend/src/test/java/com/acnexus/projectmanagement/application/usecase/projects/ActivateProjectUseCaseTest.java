package com.acnexus.projectmanagement.application.usecase.projects;

import com.acnexus.projectmanagement.domain.events.ProjectActivatedEvent;
import com.acnexus.projectmanagement.domain.exception.ProjectActivationException;
import com.acnexus.projectmanagement.domain.exception.UnauthorizedException;
import com.acnexus.projectmanagement.domain.model.Project;
import com.acnexus.projectmanagement.domain.model.ProjectStatus;
import com.acnexus.projectmanagement.domain.ports.in.projects.ActivateProjectPort;
import com.acnexus.projectmanagement.domain.ports.out.CurrentUserPort;
import com.acnexus.projectmanagement.domain.ports.out.DomainEventPublisher;
import com.acnexus.projectmanagement.domain.ports.out.ProjectRepositoryPort;
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
class ActivateProjectUseCaseTest {

    @Mock
    private ProjectRepositoryPort projectRepository;
    @Mock
    private TaskRepositoryPort taskRepository;
    @Mock
    private DomainEventPublisher eventPublisher;
    @Mock
    private CurrentUserPort currentUserPort;

    private ActivateProjectUseCaseImpl useCase;

    @BeforeEach
    void setUp() {
        useCase = new ActivateProjectUseCaseImpl(projectRepository, taskRepository, eventPublisher, currentUserPort);
    }

    @Test
    void execute_WithTasks_ShouldSucceed() {
        UUID projectId = UUID.randomUUID();
        UUID ownerId = UUID.randomUUID();
        Project project = new Project(projectId, ownerId, "Test Project", "Desc", ProjectStatus.DRAFT, false,
                OffsetDateTime.now(), OffsetDateTime.now(), 0L);

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(currentUserPort.getCurrentUserId()).thenReturn(ownerId);
        when(taskRepository.countActiveTasksByProjectId(projectId)).thenReturn(5);
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> invocation.getArgument(0));

        useCase.execute(projectId);

        assertEquals(ProjectStatus.ACTIVE, project.getStatus());
        verify(projectRepository).save(project);
        verify(eventPublisher).publish(any(ProjectActivatedEvent.class));
    }

    @Test
    void execute_WithoutTasks_ShouldFail() {
        UUID projectId = UUID.randomUUID();
        UUID ownerId = UUID.randomUUID();
        Project project = new Project(projectId, ownerId, "Test Project", "Desc", ProjectStatus.DRAFT, false,
                OffsetDateTime.now(), OffsetDateTime.now(), 0L);

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(currentUserPort.getCurrentUserId()).thenReturn(ownerId);
        when(taskRepository.countActiveTasksByProjectId(projectId)).thenReturn(0);

        assertThrows(ProjectActivationException.class, () -> useCase.execute(projectId));
        assertEquals(ProjectStatus.DRAFT, project.getStatus());
        verify(projectRepository, never()).save(any());
        verify(eventPublisher, never()).publish(any());
    }

    @Test
    void execute_ByNonOwner_ShouldFail() {
        UUID projectId = UUID.randomUUID();
        UUID ownerId = UUID.randomUUID();
        UUID differentUserId = UUID.randomUUID();
        Project project = new Project(projectId, ownerId, "Test Project", "Desc", ProjectStatus.DRAFT, false,
                OffsetDateTime.now(), OffsetDateTime.now(), 0L);

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(currentUserPort.getCurrentUserId()).thenReturn(differentUserId);

        assertThrows(UnauthorizedException.class, () -> useCase.execute(projectId));
        assertEquals(ProjectStatus.DRAFT, project.getStatus());
        verify(projectRepository, never()).save(any());
        verify(eventPublisher, never()).publish(any());
    }}