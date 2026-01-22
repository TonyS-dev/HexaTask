CREATE SEQUENCE revinfo_seq START WITH 1 INCREMENT BY 50;

CREATE TABLE revinfo (
    rev INTEGER NOT NULL,
    revtstmp BIGINT,
    PRIMARY KEY (rev)
);

CREATE TABLE users_aud (
    id UUID NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,
    email VARCHAR(255),
    password VARCHAR(255),
    full_name VARCHAR(255),
    role VARCHAR(50),
    active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    version BIGINT,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_users_aud_revinfo FOREIGN KEY (rev) REFERENCES revinfo(rev)
);

CREATE TABLE projects_aud (
    id UUID NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,
    owner_id UUID,
    name VARCHAR(255),
    description TEXT,
    status VARCHAR(50),
    deleted BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    version BIGINT,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_projects_aud_revinfo FOREIGN KEY (rev) REFERENCES revinfo(rev)
);

CREATE TABLE tasks_aud (
    id UUID NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,
    project_id UUID,
    title VARCHAR(255),
    description TEXT,
    completed BOOLEAN,
    deleted BOOLEAN,
    archived BOOLEAN,
    assignee_id UUID,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    version BIGINT,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_tasks_aud_revinfo FOREIGN KEY (rev) REFERENCES revinfo(rev)
);
