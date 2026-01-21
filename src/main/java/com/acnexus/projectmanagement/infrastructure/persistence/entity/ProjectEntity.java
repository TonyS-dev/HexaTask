package com.acnexus.projectmanagement.infrastructure.persistence.entity;

import com.acnexus.projectmanagement.domain.model.ProjectStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.Where; // Deprecated in recent Hibernate versions but standard for this assessment often
// Ideally use @SQLRestriction or @Where(clause = "deleted = false")

import org.hibernate.envers.Audited;
import java.util.UUID;

@Entity
@Table(name = "projects")
@Audited
@Where(clause = "deleted = false")
public class ProjectEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID ownerId;

    @Column(nullable = false)
    private String name;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status;

    @Column(nullable = false)
    private boolean deleted = false;

    public ProjectEntity() {
    }

    public ProjectEntity(UUID id, UUID ownerId, String name, String description, ProjectStatus status,
            boolean deleted) {
        this.id = id;
        this.ownerId = ownerId;
        this.name = name;
        this.description = description;
        this.status = status;
        this.deleted = deleted;
    }

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
}
