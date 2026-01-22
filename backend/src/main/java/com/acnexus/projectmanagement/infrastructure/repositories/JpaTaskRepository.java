package com.acnexus.projectmanagement.infrastructure.repositories;

import com.acnexus.projectmanagement.infrastructure.entities.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JpaTaskRepository extends JpaRepository<TaskEntity, UUID> {
    List<TaskEntity> findByProjectId(UUID projectId);

    @Query("SELECT COUNT(t) FROM TaskEntity t WHERE t.projectId = :projectId AND t.status NOT IN ('DONE', 'CANCELLED')")
    int countActiveTasksByProjectId(@Param("projectId") UUID projectId);
}
