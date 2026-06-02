-- Distingue les promotions "article" (liées directement à un item) des promotions "code" (appliquées au panier)

ALTER TABLE promotions
    ADD COLUMN type ENUM('item', 'code', 'tutti') NOT NULL DEFAULT 'code',
    MODIFY COLUMN code VARCHAR(50) NULL;
