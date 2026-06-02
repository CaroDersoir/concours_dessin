-- Tables commandes et lignes de commande

CREATE TABLE IF NOT EXISTS orders (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    user_id          INT            NOT NULL,
    order_number     VARCHAR(20)    NOT NULL UNIQUE,
    status           VARCHAR(20)    NOT NULL DEFAULT 'confirmed',
    adresse_livraison VARCHAR(255),
    contact_nom      VARCHAR(100),
    contact_email    VARCHAR(100),
    contact_telephone VARCHAR(30),
    payment_method   VARCHAR(50)    NOT NULL DEFAULT 'carte',
    promo_code       VARCHAR(50),
    discount_percent DECIMAL(5,2)   NOT NULL DEFAULT 0,
    total_ht         DECIMAL(10,2)  NOT NULL,
    total_ttc        DECIMAL(10,2)  NOT NULL,
    created_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    order_id   INT            NOT NULL,
    item_id    INT,
    item_name  VARCHAR(255)   NOT NULL,
    item_price DECIMAL(10,2)  NOT NULL,
    quantity   INT            NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
