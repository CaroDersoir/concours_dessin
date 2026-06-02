/** définition Sequelize de la table order_items **/

const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const OrderItem = sequelize.define('OrderItem', {
    id:         {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    order_id:   {type: DataTypes.INTEGER, allowNull: false},
    item_id:    {type: DataTypes.INTEGER},
    item_name:  {type: DataTypes.STRING, allowNull: false},
    item_price: {type: DataTypes.DECIMAL(10, 2), allowNull: false},
    quantity:   {type: DataTypes.INTEGER, allowNull: false}
}, {
    tableName: 'order_items',
    timestamps: false
});

module.exports = OrderItem;
