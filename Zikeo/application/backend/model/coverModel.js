const db = require('../config/db');

exports.addItemCover = (id, imageUrl) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO item_covers (item_id, url) VALUES (?, ?)',
            [id, imageUrl],
            (err, results) => {
                if (err) return reject(err);
                resolve(results.affectedRows > 0);
            }
        );
    });
};
