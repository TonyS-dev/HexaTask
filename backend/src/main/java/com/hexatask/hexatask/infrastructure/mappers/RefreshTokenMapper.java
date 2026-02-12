package com.hexatask.hexatask.infrastructure.mappers;

import com.hexatask.hexatask.domain.model.RefreshToken;
import com.hexatask.hexatask.infrastructure.entities.RefreshTokenEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RefreshTokenMapper {
    RefreshToken toDomain(RefreshTokenEntity entity);

    @Mapping(target = "version", ignore = true)
    RefreshTokenEntity toEntity(RefreshToken refreshToken);
}
