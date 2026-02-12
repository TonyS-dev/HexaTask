package com.hexatask.hexatask.infrastructure.mappers;

import com.hexatask.hexatask.domain.model.User;
import com.hexatask.hexatask.infrastructure.entities.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toDomain(UserEntity entity);

    @Mapping(target = "version", ignore = true)
    UserEntity toEntity(User user);
}
