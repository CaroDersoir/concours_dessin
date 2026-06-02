/**
 * connexion à l'ORM : couche logicielle pour effectuer des opérations CRUD sans écrire directement de requêtes SQL
 */

require('dotenv').config;

const {Sequelize} = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    logging: false
});
module.exports = sequelize;