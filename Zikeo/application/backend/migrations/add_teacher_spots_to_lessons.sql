ALTER TABLE lessons
    ADD COLUMN teacher_id INT          NULL,
    ADD COLUMN spots      INT          NOT NULL DEFAULT 0,
    ADD CONSTRAINT fk_lessons_teacher FOREIGN KEY (teacher_id) REFERENCES customer(id) ON DELETE SET NULL;
