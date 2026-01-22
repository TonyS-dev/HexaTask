package com.acnexus.projectmanagement.infrastructure.mappers;

import com.acnexus.projectmanagement.domain.model.Project;
import com.acnexus.projectmanagement.infrastructure.entities.ProjectEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProjectMapper {
    Project toDomain(ProjectEntity entity);

    @Mapping(target = "version", ignore = true)
    ProjectEntity toEntity(Project project);
}
