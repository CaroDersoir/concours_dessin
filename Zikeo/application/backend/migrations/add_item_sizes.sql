-- Ajoute la table item_sizes pour gérer les stocks par taille

CREATE TABLE IF NOT EXISTS item_sizes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    size VARCHAR(20) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);
