package com.acnexus.projectmanagement.infrastructure.mappers;

import com.acnexus.projectmanagement.domain.model.Task;
import com.acnexus.projectmanagement.infrastructure.entities.TaskEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    Task toDomain(TaskEntity entity);

    @Mapping(target = "version", ignore = true)
    TaskEntity toEntity(Task task);
}
