package com.acnexus.projectmanagement.infrastructure.repositories;

import com.acnexus.projectmanagement.infrastructure.entities.ProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JpaProjectRepository extends JpaRepository<ProjectEntity, UUID> {
    List<ProjectEntity> findByOwnerId(UUID ownerId);

    Page<ProjectEntity> findByOwnerId(UUID ownerId, Pageable pageable);
}
