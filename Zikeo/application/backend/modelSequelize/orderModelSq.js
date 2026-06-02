/** définition Sequelize de la table orders **/

const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const Order = sequelize.define('Order', {
    id:               {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user_id:          {type: DataTypes.INTEGER, allowNull: false},
    order_number:     {type: DataTypes.STRING(20), allowNull: false, unique: true},
    status:           {type: DataTypes.STRING(20), defaultValue: 'en_traitement'},
    adresse_livraison:{type: DataTypes.STRING},
    contact_nom:      {type: DataTypes.STRING(100)},
    contact_email:    {type: DataTypes.STRING(100)},
    contact_telephone:{type: DataTypes.STRING(30)},
    payment_method:   {type: DataTypes.STRING(50), defaultValue: 'carte'},
    promo_code:       {type: DataTypes.STRING(50)},
    discount_percent: {type: DataTypes.DECIMAL(5, 2), defaultValue: 0},
    total_ht:         {type: DataTypes.DECIMAL(10, 2), allowNull: false},
    total_ttc:        {type: DataTypes.DECIMAL(10, 2), allowNull: false},
    created_at:       {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
}, {
    tableName: 'orders',
    timestamps: false
});

module.exports = Order;
