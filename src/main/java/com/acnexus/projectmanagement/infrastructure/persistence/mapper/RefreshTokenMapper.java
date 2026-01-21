package com.acnexus.projectmanagement.infrastructure.persistence.mapper;

import com.acnexus.projectmanagement.domain.model.RefreshToken;
import com.acnexus.projectmanagement.infrastructure.persistence.entity.RefreshTokenEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = { UserMapper.class })
public interface RefreshTokenMapper {
    RefreshToken toDomain(RefreshTokenEntity entity);

    RefreshTokenEntity toEntity(RefreshToken refreshToken);
}
