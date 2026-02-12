package com.hexatask.hexatask.infrastructure.mappers;

import com.hexatask.hexatask.domain.model.Task;
import com.hexatask.hexatask.infrastructure.entities.TaskEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    Task toDomain(TaskEntity entity);

    @Mapping(target = "version", ignore = true)
    TaskEntity toEntity(Task task);
}
