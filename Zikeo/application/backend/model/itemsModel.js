/** récupérer les données **/

const db = require('../config/db');

const COVERS_SEP = '|||';

function parseCovers(row) {
    const { covers_raw, ...rest } = row;
    return { ...rest, covers: covers_raw ? covers_raw.split(COVERS_SEP) : [] };
}

exports.findAll = () => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT i.*, GROUP_CONCAT(ic.url SEPARATOR '${COVERS_SEP}') AS covers_raw
             FROM items i
             LEFT JOIN item_covers ic ON ic.item_id = i.id
             GROUP BY i.id`,
            (err, results) => {
                if (err) return reject(err);
                resolve(results.map(parseCovers));
            }
        );
    });
};

exports.findById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT i.*, GROUP_CONCAT(ic.url SEPARATOR '${COVERS_SEP}') AS covers_raw
             FROM items i
             LEFT JOIN item_covers ic ON ic.item_id = i.id
             WHERE i.id = ?
             GROUP BY i.id`,
            [id],
            (err, results) => {
                if (err) return reject(err);
                resolve(results[0] ? parseCovers(results[0]) : undefined);
            }
        );
    });
};

exports.create = (item) => {
    const {
        name,
        price,
        size = null,
        comfort = null,
        onSale = false,
        gender = 'neutre',
        category,
        stock = 0,
    } = item;

    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO items (name, price, size, comfort, onSale, gender, category, stock)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, price, size, comfort, onSale ? 1 : 0, gender, category, stock],
            (err, results) => {
                if (err) return reject(err);
                resolve({ id: results.insertId, ...item, covers: [] });
            }
        );
    });
};

exports.update = (id, item) => {
    const {
        name,
        price,
        size = null,
        comfort = null,
        onSale = false,
        gender = 'neutre',
        category,
        stock = 0,
    } = item;

    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE items
             SET name     = ?,
                 price    = ?,
                 size     = ?,
                 comfort  = ?,
                 onSale   = ?,
                 gender   = ?,
                 category = ?,
                 stock    = ?
             WHERE id = ?`,
            [name, price, size, comfort, onSale ? 1 : 0, gender, category, stock, id],
            (err, results) => {
                if (err) return reject(err);
                resolve(results.affectedRows > 0);
            }
        );
    });
};

exports.updateStock = (id, stock) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE items SET stock = ? WHERE id = ?',
            [stock, id],
            (err, results) => {
                if (err) return reject(err);
                resolve(results.affectedRows > 0);
            }
        );
    });
};

exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM items WHERE id = ?', [id], (err, results) => {
            if (err) return reject(err);
            resolve(results.affectedRows > 0);
        });
    });
};
