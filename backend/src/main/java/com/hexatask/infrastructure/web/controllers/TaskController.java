package com.hexatask.hexatask.infrastructure.web.controllers;

import com.hexatask.hexatask.application.dto.tasks.CreateTaskCommand;
import com.hexatask.hexatask.application.dto.tasks.TaskDto;
import com.hexatask.hexatask.domain.model.Task;
import com.hexatask.hexatask.domain.model.TaskStatus;
import com.hexatask.hexatask.domain.ports.in.tasks.CreateTaskPort;
import com.hexatask.hexatask.domain.ports.in.tasks.ListTasksPort;
import com.hexatask.hexatask.domain.ports.in.tasks.UpdateTaskStatusPort;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Task management controller.
 */
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final CreateTaskPort createTaskPort;
    private final ListTasksPort listTasksPort;
    private final UpdateTaskStatusPort updateTaskStatusPort;

    @PostMapping
    public ResponseEntity<TaskDto> createTask(@RequestBody CreateTaskCommand command) {
        Task task = createTaskPort.execute(command);
        return ResponseEntity.ok(mapToDto(task));
    }

    @GetMapping
    public ResponseEntity<List<TaskDto>> getTasks(@RequestParam UUID projectId) {
        List<Task> tasks = listTasksPort.execute(projectId);
        List<TaskDto> dtos = tasks.stream().map(this::mapToDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable UUID id, @RequestBody StatusUpdateDto statusDto) {
        updateTaskStatusPort.execute(id, statusDto.status);
        return ResponseEntity.ok().build();
    }

    record StatusUpdateDto(TaskStatus status) {
    }

    private TaskDto mapToDto(Task task) {
        return TaskDto.builder()
                .id(task.getId())
                .projectId(task.getProjectId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .archived(task.isArchived())
                .assigneeId(task.getAssigneeId())
                .createdAt(task.getCreatedAt())
                .build();
    }
}
