-- Crée la table promotions et ajoute la clé étrangère dans items

CREATE TABLE IF NOT EXISTS promotions (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    name             VARCHAR(255)   NOT NULL,
    code             VARCHAR(50)    NOT NULL UNIQUE,
    description      TEXT,
    discount_percent DECIMAL(5, 2)  NOT NULL,
    start_date       DATE           NOT NULL,
    end_date         DATE           NOT NULL,
    conditions       TEXT
);

ALTER TABLE items
    ADD COLUMN promotion_id INT NULL,
    ADD CONSTRAINT fk_items_promotion
        FOREIGN KEY (promotion_id) REFERENCES promotions (id) ON DELETE SET NULL;
