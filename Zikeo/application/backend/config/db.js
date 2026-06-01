/** connexion à la base de donnée **/

const mysql = require('mysql2');

// Connexion à MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'csecret',
    database: process.env.DB_NAME || 'zikeo',
    port: process.env.DB_PORT || 3306
});

connection.connect((err) => {
        if (err) {
            console.error('Erreur de connexion à mysql :', err);
            return;
        }
        console.log('Connexion réussie à mysql');
    }
);

module.exports = connection;
