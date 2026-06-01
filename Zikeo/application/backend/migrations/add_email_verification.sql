-- Ajout des colonnes pour la vérification d'email sur le compte client
ALTER TABLE customer
    ADD COLUMN email_verified TINYINT(1) NOT NULL DEFAULT 0,
    ADD COLUMN verification_code VARCHAR(10),
    ADD COLUMN verification_code_expires DATETIME;
