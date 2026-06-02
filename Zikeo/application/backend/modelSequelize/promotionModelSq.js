/** définition Sequelize de la table promotions **/

const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const Promotion = sequelize.define('Promotion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true
    },
    description: {
        type: DataTypes.TEXT
    },
    discount_percent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    conditions: {
        type: DataTypes.TEXT
    }
    ,
    type: {
        type: DataTypes.ENUM('item', 'code'),
        allowNull: false,
        defaultValue: 'item'
    }
}, {
    tableName: 'promotions',
    timestamps: false
});

module.exports = Promotion;
