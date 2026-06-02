-- Ajoute la colonne uploaded_by à la table partitions (FK vers customers)

ALTER TABLE partitions
    ADD COLUMN uploaded_by INT NULL,
    ADD CONSTRAINT fk_partition_uploader
        FOREIGN KEY (uploaded_by) REFERENCES customers(id) ON DELETE SET NULL;
