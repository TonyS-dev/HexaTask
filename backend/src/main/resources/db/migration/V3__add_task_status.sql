ALTER TABLE tasks ADD COLUMN status VARCHAR(255) NOT NULL DEFAULT 'TO_DO';
UPDATE tasks SET status = 'DONE' WHERE completed = true;
ALTER TABLE tasks DROP COLUMN completed;

ALTER TABLE tasks_aud ADD COLUMN status VARCHAR(255);
UPDATE tasks_aud SET status = 'DONE' WHERE completed = true;
UPDATE tasks_aud SET status = 'TO_DO' WHERE status IS NULL;
ALTER TABLE tasks_aud DROP COLUMN completed;
