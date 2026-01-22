-- Seed users
INSERT INTO users (id, email, password, full_name, role, active, created_at, updated_at, version)
VALUES ('11111111-1111-1111-1111-111111111111', 'juan@mail.com', '$2a$12$WKH3UqcS6EzCkT8iGE6eUOvL4M0NY4a974BnLsJxTEj7MgB1G3Wdy', 'Juan Perez', 'ROLE_MEMBER', true, NOW(), NOW(), 0)
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (id, email, password, full_name, role, active, created_at, updated_at, version)
VALUES ('22222222-2222-2222-2222-222222222222', 'anto@mail.com', '$2a$12$WKH3UqcS6EzCkT8iGE6eUOvL4M0NY4a974BnLsJxTEj7MgB1G3Wdy', 'Anto Garcia', 'ROLE_MEMBER', true, NOW(), NOW(), 0)
ON CONFLICT (email) DO NOTHING;

-- Seed projects for owner juan@mail.com
INSERT INTO projects (id, owner_id, name, description, status, deleted, created_at, updated_at, version)
VALUES
    ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Website Redesign', 'Marketing site refresh', 'ACTIVE', false, NOW(), NOW(), 0),
    ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Mobile App', 'Internal productivity app', 'DRAFT', false, NOW(), NOW(), 0)
ON CONFLICT (id) DO NOTHING;

-- Seed project for owner anto@mail.com
INSERT INTO projects (id, owner_id, name, description, status, deleted, created_at, updated_at, version)
VALUES ('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'Data Platform', 'Analytics backlog', 'DRAFT', false, NOW(), NOW(), 0)
ON CONFLICT (id) DO NOTHING;

-- Seed tasks for Website Redesign project
INSERT INTO tasks (id, project_id, title, description, deleted, archived, assignee_id, created_at, updated_at, version, status)
VALUES
    ('66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 'Landing page', 'Create new hero section', false, false, '11111111-1111-1111-1111-111111111111', NOW(), NOW(), 0, 'IN_PROGRESS'),
    ('77777777-7777-7777-7777-777777777777', '33333333-3333-3333-3333-333333333333', 'Pricing page', 'Add pricing cards', false, false, '11111111-1111-1111-1111-111111111111', NOW(), NOW(), 0, 'TO_DO'),
    ('88888888-8888-8888-8888-888888888888', '33333333-3333-3333-3333-333333333333', 'Contact form', 'Wire up backend', false, false, '11111111-1111-1111-1111-111111111111', NOW(), NOW(), 0, 'DONE')
ON CONFLICT (id) DO NOTHING;
