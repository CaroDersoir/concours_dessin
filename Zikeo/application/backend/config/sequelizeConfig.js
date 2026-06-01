const {Sequelize} = require('sequelize');
const sequelize = new Sequelize('zikeo', 'root', 'csecret', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306, // Le port par défaut de MySQL
});
module.exports = sequelize;