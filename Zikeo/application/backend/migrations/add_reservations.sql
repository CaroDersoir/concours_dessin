CREATE TABLE reservations (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    user_id           INT  NOT NULL,
    date              DATE NOT NULL,
    heure_debut       TIME NOT NULL,
    heure_fin         TIME NOT NULL,
    statut            ENUM('approuvee', 'refusee') NOT NULL DEFAULT 'approuvee',
    est_derogation    TINYINT(1) NOT NULL DEFAULT 0,
    statut_derogation ENUM('en_attente', 'approuvee', 'refusee') NULL DEFAULT NULL,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES customer(id) ON DELETE CASCADE
);
