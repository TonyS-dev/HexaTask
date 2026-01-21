package com.acnexus.projectmanagement.infrastructure.persistence.mapper;

import com.acnexus.projectmanagement.domain.model.Task;
import com.acnexus.projectmanagement.infrastructure.persistence.entity.TaskEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    Task toDomain(TaskEntity entity);

    TaskEntity toEntity(Task task);
}
