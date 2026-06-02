/** définition Sequelize de la table items, avec association item_covers, item_sizes et promotion **/

const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelizeConfig');
const ItemCover = require('./coverModelSq');
const ItemSize = require('./itemSizeModelSq');
const Promotion = require('./promotionModelSq');

const Item = sequelize.define('Item', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    size: {
        type: DataTypes.STRING
    },
    comfort: {
        type: DataTypes.INTEGER
    },
    gender: {
        type: DataTypes.STRING,
        defaultValue: 'neutre'
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    promotion_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'items',
    timestamps: false
});

Item.hasMany(ItemCover, {foreignKey: 'item_id', as: 'item_covers'});
ItemCover.belongsTo(Item, {foreignKey: 'item_id'});

Item.hasMany(ItemSize, {foreignKey: 'item_id', as: 'item_sizes'});
ItemSize.belongsTo(Item, {foreignKey: 'item_id'});

Item.belongsTo(Promotion, {foreignKey: 'promotion_id', as: 'promotion'});
Promotion.hasMany(Item, {foreignKey: 'promotion_id', as: 'items'});

module.exports = Item;