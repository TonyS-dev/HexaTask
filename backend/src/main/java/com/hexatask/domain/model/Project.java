package com.hexatask.hexatask.domain.model;

import com.hexatask.hexatask.domain.exception.ProjectActivationException;

import java.time.OffsetDateTime;
import java.util.Objects;
import java.util.UUID;

public class Project {
    private UUID id;
    private UUID ownerId;
    private String name;
    private String description;
    private ProjectStatus status;
    private boolean deleted;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private Long version;

    public Project() {
    }

    public Project(UUID id, UUID ownerId, String name, String description, ProjectStatus status,
            boolean deleted, OffsetDateTime createdAt, OffsetDateTime updatedAt, Long version) {
        this.id = id;
        this.ownerId = ownerId;
        this.name = name;
        this.description = description;
        this.status = status != null ? status : ProjectStatus.DRAFT;
        this.deleted = deleted;
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

    public UUID getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(UUID ownerId) {
        this.ownerId = ownerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
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

    // Domain Logic Invariants

    public void activate(int activeTasksCount) {
        if (this.deleted) {
            throw new ProjectActivationException("Cannot activate a deleted project.");
        }
        if (this.status == ProjectStatus.ACTIVE) {
            throw new ProjectActivationException("Project is already active.");
        }
        if (activeTasksCount <= 0) {
            throw new ProjectActivationException("Project must have at least one active task to be activated.");
        }
        this.status = ProjectStatus.ACTIVE;
    }

    public void softDelete() {
        this.deleted = true;
    }

    public boolean canBeModifiedBy(UUID userId) {
        return this.ownerId != null && this.ownerId.equals(userId);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Project project = (Project) o;
        return Objects.equals(id, project.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
