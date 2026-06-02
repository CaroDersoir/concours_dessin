CREATE TABLE litiges (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT NOT NULL,
    commande_ref VARCHAR(100) NULL,
    type         ENUM('livraison', 'qualite', 'paiement', 'autre') NOT NULL,
    description  TEXT NOT NULL,
    statut       ENUM('ouvert', 'en_cours', 'resolu', 'rejete') NOT NULL DEFAULT 'ouvert',
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES customer(id) ON DELETE CASCADE
);