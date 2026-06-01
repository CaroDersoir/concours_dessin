/** définition Sequelize de la table item_covers **/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const ItemCover = sequelize.define('ItemCover', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    item_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'item_covers',
    timestamps: false
});

module.exports = ItemCover;