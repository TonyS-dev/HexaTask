package com.acnexus.projectmanagement.infrastructure.persistence.repository;

import com.acnexus.projectmanagement.infrastructure.persistence.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface JpaTaskRepository extends JpaRepository<TaskEntity, UUID> {
    List<TaskEntity> findByProjectId(UUID projectId);

    @Query("SELECT COUNT(t) FROM TaskEntity t WHERE t.projectId = :projectId AND t.completed = false AND t.deleted = false")
    int countActiveTasksByProjectId(@Param("projectId") UUID projectId);
}
