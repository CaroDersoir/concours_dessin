/** connexion à la base de donnée **/

const mysql = require('mysql2');
require('dotenv').config();


// Connexion à MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
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
