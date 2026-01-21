package com.acnexus.projectmanagement.infrastructure.persistence.mapper;

import com.acnexus.projectmanagement.domain.model.User;
import com.acnexus.projectmanagement.infrastructure.persistence.entity.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toDomain(UserEntity entity);

    UserEntity toEntity(User user);
}
