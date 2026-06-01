CREATE TABLE lesson_sessions (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    lesson_id   INT  NOT NULL,
    date        DATE NOT NULL,
    heure_debut TIME NOT NULL,
    heure_fin   TIME NOT NULL,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);
