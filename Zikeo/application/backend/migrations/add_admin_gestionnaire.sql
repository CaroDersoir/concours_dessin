ALTER TABLE customer
    ADD COLUMN role ENUM('user', 'admin') NOT NULL DEFAULT 'user';
