/** définition Sequelize de la table home_cards **/

const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelizeConfig');
const Item = require('./itemModelSq');

const HomeCard = sequelize.define('HomeCard', {
    id:       {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    type:     {type: DataTypes.ENUM('link', 'news', 'item'), allowNull: false, defaultValue: 'link'},
    position: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
    visible:  {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
    icon:     {type: DataTypes.STRING(10)},
    title:    {type: DataTypes.STRING, allowNull: false},
    subtitle: {type: DataTypes.TEXT},
    url:      {type: DataTypes.STRING},
    item_id:  {type: DataTypes.INTEGER, allowNull: true}
}, {
    tableName: 'home_cards',
    timestamps: false
});

HomeCard.belongsTo(Item, {foreignKey: 'item_id', as: 'item'});

module.exports = HomeCard;
