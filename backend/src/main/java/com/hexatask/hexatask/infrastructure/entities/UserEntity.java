package com.hexatask.hexatask.infrastructure.entities;

import com.hexatask.hexatask.domain.model.Role;
import jakarta.persistence.*;
import org.hibernate.envers.Audited;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Persistable;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@Audited
public class UserEntity implements Persistable<UUID> {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

    @Version
    private Long version;

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = UUID.randomUUID();
        }
        createdAt = OffsetDateTime.now();
        updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    @Override
    public boolean isNew() {
        return version == null;
    }
}
