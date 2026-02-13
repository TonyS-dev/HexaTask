package com.hexatask.hexatask.infrastructure.mappers;

import com.hexatask.hexatask.domain.model.Project;
import com.hexatask.hexatask.infrastructure.entities.ProjectEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProjectMapper {
    Project toDomain(ProjectEntity entity);

    @Mapping(target = "version", ignore = true)
    ProjectEntity toEntity(Project project);
}
