package com.acnexus.projectmanagement.infrastructure.mappers;

import com.acnexus.projectmanagement.domain.model.User;
import com.acnexus.projectmanagement.infrastructure.entities.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toDomain(UserEntity entity);

    @Mapping(target = "version", ignore = true)
    UserEntity toEntity(User user);
}
