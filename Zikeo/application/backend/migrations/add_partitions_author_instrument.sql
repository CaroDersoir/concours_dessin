-- Ajoute les colonnes author et instrument à la table partitions

ALTER TABLE partitions
    ADD COLUMN author     VARCHAR(255) NULL,
    ADD COLUMN instrument VARCHAR(255) NULL;
