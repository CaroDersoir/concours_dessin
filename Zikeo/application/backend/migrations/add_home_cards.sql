-- Cartes configurables de la page d'accueil (type : link, news, item)

CREATE TABLE IF NOT EXISTS home_cards (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    type     ENUM('link', 'news', 'item') NOT NULL DEFAULT 'link',
    position INT          NOT NULL DEFAULT 0,
    visible  TINYINT(1)   NOT NULL DEFAULT 1,
    icon     VARCHAR(10),
    title    VARCHAR(255) NOT NULL,
    subtitle TEXT,
    url      VARCHAR(255),
    item_id  INT NULL,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE SET NULL
);
