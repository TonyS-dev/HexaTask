package com.hexatask.hexatask.domain.model;

import java.time.OffsetDateTime;
import java.util.Objects;
import java.util.UUID;

public class Task {
    private UUID id;
    private UUID projectId;
    private String title;
    private String description;
    private TaskStatus status;
    private boolean deleted;
    private boolean archived;
    private UUID assigneeId;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private Long version;

    public Task() {
    }

    public Task(UUID id, UUID projectId, String title, String description, TaskStatus status,
            boolean deleted, boolean archived, UUID assigneeId,
            OffsetDateTime createdAt, OffsetDateTime updatedAt, Long version) {
        this.id = id;
        this.projectId = projectId;
        this.title = title;
        this.description = description;
        this.status = status != null ? status : TaskStatus.TO_DO;
        this.deleted = deleted;
        this.archived = archived;
        this.assigneeId = assigneeId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.version = version;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public boolean isArchived() {
        return archived;
    }

    public void setArchived(boolean archived) {
        this.archived = archived;
    }

    public UUID getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(UUID assigneeId) {
        this.assigneeId = assigneeId;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    // Domain Logic
    public void complete() {
        if (this.deleted) {
            throw new IllegalStateException("Cannot complete a deleted task.");
        }
        this.status = TaskStatus.DONE;
    }

    public void archive() {
        this.archived = true;
    }

    public void softDelete() {
        this.deleted = true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Task task = (Task) o;
        return Objects.equals(id, task.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
