CREATE TABLE lesson_enrollments (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    user_id   INT NOT NULL,
    lesson_id INT NOT NULL,
    UNIQUE KEY unique_enrollment (user_id, lesson_id),
    FOREIGN KEY (user_id)   REFERENCES customer(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)  ON DELETE CASCADE
);
