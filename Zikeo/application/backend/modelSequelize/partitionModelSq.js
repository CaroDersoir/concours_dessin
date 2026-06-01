/** définition Sequelize de la table partitions **/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const Partition = sequelize.define('Partition', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'partitions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Partition;