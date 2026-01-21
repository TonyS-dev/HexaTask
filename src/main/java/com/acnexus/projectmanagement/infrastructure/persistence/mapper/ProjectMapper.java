package com.acnexus.projectmanagement.infrastructure.persistence.mapper;

import com.acnexus.projectmanagement.domain.model.Project;
import com.acnexus.projectmanagement.infrastructure.persistence.entity.ProjectEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProjectMapper {
    Project toDomain(ProjectEntity entity);

    ProjectEntity toEntity(Project project);
}
