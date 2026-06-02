-- Migration : nouveaux statuts de suivi pour les commandes
-- Remplace 'confirmed' par 'en_traitement' et met à jour le défaut

ALTER TABLE orders
    MODIFY COLUMN status VARCHAR(20) NOT NULL DEFAULT 'en_traitement';

UPDATE orders
SET status = 'en_traitement'
WHERE status = 'confirmed';
