ALTER TABLE customer
    ADD COLUMN nom                  VARCHAR(100),
    ADD COLUMN prenom               VARCHAR(100),
    ADD COLUMN photo                VARCHAR(500),
    ADD COLUMN adresse              VARCHAR(300),
    ADD COLUMN telephone            VARCHAR(20),
    ADD COLUMN adresse_livraison    VARCHAR(300),
    ADD COLUMN preferences_paiement VARCHAR(100);