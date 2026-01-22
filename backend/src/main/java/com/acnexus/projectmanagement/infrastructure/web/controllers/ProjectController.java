package com.acnexus.projectmanagement.infrastructure.web.controllers;

import com.acnexus.projectmanagement.application.dto.projects.CreateProjectCommand;
import com.acnexus.projectmanagement.application.dto.projects.ProjectDto;
import com.acnexus.projectmanagement.domain.common.PageResult;
import com.acnexus.projectmanagement.domain.model.Project;
import com.acnexus.projectmanagement.domain.ports.in.projects.ActivateProjectPort;
import com.acnexus.projectmanagement.domain.ports.in.projects.CreateProjectPort;
import com.acnexus.projectmanagement.domain.ports.in.projects.GetProjectPort;
import com.acnexus.projectmanagement.domain.ports.in.projects.ListProjectsPort;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Project management controller.
 */
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final CreateProjectPort createProjectPort;
    private final ListProjectsPort listProjectsPort;
    private final GetProjectPort getProjectPort;
    private final ActivateProjectPort activateProjectPort;

    @PostMapping("/{id}/activate")
    public ResponseEntity<Void> activateProject(@PathVariable UUID id) {
        activateProjectPort.execute(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<ProjectDto> createProject(@RequestBody CreateProjectCommand command) {
        Project project = createProjectPort.execute(command);
        return ResponseEntity.ok(mapToDto(project));
    }

    @GetMapping
    public ResponseEntity<PageResult<ProjectDto>> listProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageResult<Project> projects = listProjectsPort.execute(page, size);
        PageResult<ProjectDto> dtos = mapPage(projects);
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getProject(@PathVariable UUID id) {
        Project project = getProjectPort.execute(id);
        return ResponseEntity.ok(mapToDto(project));
    }

    private ProjectDto mapToDto(Project project) {
        return ProjectDto.builder()
                .id(project.getId())
                .ownerId(project.getOwnerId())
                .name(project.getName())
                .description(project.getDescription())
                .status(project.getStatus())
                .deleted(project.isDeleted())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    private PageResult<ProjectDto> mapPage(PageResult<Project> page) {
        List<ProjectDto> content = page.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return PageResult.of(
                content,
                page.getPage(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isHasNext(),
                page.isHasPrevious());
    }
}
