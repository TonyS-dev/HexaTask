package com.acnexus.projectmanagement.infrastructure.persistence.repository;

import com.acnexus.projectmanagement.infrastructure.persistence.entity.ProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface JpaProjectRepository extends JpaRepository<ProjectEntity, UUID> {
}
