-- Crée la table promotions et ajoute la clé étrangère dans items

CREATE TABLE IF NOT EXISTS promotions (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    name             VARCHAR(255)   NOT NULL,
    -- code is nullable: promotions can be applied directly to an item (no code)
    code             VARCHAR(50)    NULL UNIQUE,
    description      TEXT,
    discount_percent DECIMAL(5, 2)  NOT NULL,
    start_date       DATE           NOT NULL,
    end_date         DATE           NOT NULL,
    conditions       TEXT,
    -- apply_to_cart = 1 means this promotion is intended to be used via a code on the cart
    apply_to_cart    TINYINT(1)     NOT NULL DEFAULT 0
);

ALTER TABLE items
    ADD COLUMN promotion_id INT NULL,
    ADD CONSTRAINT fk_items_promotion
        FOREIGN KEY (promotion_id) REFERENCES promotions (id) ON DELETE SET NULL;
