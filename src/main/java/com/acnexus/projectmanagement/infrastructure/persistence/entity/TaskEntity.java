package com.acnexus.projectmanagement.infrastructure.persistence.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Where;
import org.hibernate.envers.Audited;

import java.util.UUID;

@Entity
@Table(name = "tasks")
@Audited
@Where(clause = "deleted = false")
public class TaskEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID projectId;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    private boolean completed = false;

    @Column(nullable = false)
    private boolean deleted = false;

    @Column(nullable = false)
    private boolean archived = false;

    private UUID assigneeId;

    public TaskEntity() {
    }

    public TaskEntity(UUID id, UUID projectId, String title, String description, boolean completed, boolean deleted,
            boolean archived, UUID assigneeId) {
        this.id = id;
        this.projectId = projectId;
        this.title = title;
        this.description = description;
        this.completed = completed;
        this.deleted = deleted;
        this.archived = archived;
        this.assigneeId = assigneeId;
    }

    // Getters and Setters ...
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

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
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
}
