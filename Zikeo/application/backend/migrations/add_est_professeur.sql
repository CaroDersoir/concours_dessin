-- Ajoute la colonne est_professeur à la table customer

ALTER TABLE customer
    ADD COLUMN IF NOT EXISTS est_professeur TINYINT(1) NOT NULL DEFAULT 0;
