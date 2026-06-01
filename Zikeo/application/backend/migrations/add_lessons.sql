CREATE TABLE lessons (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    type        ENUM('theory', 'instrument') NOT NULL,
    level       ENUM('débutant', 'intermédiaire', 'avancé') NOT NULL DEFAULT 'débutant',
    price       FLOAT NOT NULL,
    available   BOOLEAN NOT NULL DEFAULT TRUE
);
