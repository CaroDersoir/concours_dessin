const db = require('../config/db');

exports.findAll = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM partitions ORDER BY created_at DESC', (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.create = (title, url) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO partitions (title, url) VALUES (?, ?)',
            [title, url],
            (err, results) => {
                if (err) return reject(err);
                resolve({id: results.insertId, title, url});
            }
        );
    });
};

exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM partitions WHERE id = ?', [id], (err, results) => {
            if (err) return reject(err);
            resolve(results.affectedRows > 0);
        });
    });
};
