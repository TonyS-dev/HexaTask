package com.acnexus.projectmanagement.infrastructure.mappers;

import com.acnexus.projectmanagement.domain.model.RefreshToken;
import com.acnexus.projectmanagement.infrastructure.entities.RefreshTokenEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RefreshTokenMapper {
    RefreshToken toDomain(RefreshTokenEntity entity);

    @Mapping(target = "version", ignore = true)
    RefreshTokenEntity toEntity(RefreshToken refreshToken);
}
