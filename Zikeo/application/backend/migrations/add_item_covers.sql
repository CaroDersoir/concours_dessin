CREATE TABLE item_covers (
    id      INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT          NOT NULL,
    url     VARCHAR(500) NOT NULL,
    FOREIGN KEY (item_id) REFERENCES items (id) ON DELETE CASCADE
);

INSERT INTO item_covers (item_id, url)
SELECT id, cover
FROM items
WHERE cover IS NOT NULL
  AND cover != '';

ALTER TABLE items DROP COLUMN cover;
