/** définition Sequelize de la table item_sizes **/

const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const ItemSize = sequelize.define('ItemSize', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    item_id: {type: DataTypes.INTEGER, allowNull: false},
    size: {type: DataTypes.STRING(20), allowNull: false},
    stock: {type: DataTypes.INTEGER, defaultValue: 0}
}, {
    tableName: 'item_sizes',
    timestamps: false
});

module.exports = ItemSize;
