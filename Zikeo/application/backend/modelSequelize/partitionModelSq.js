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
    author: {
        type: DataTypes.STRING,
        allowNull: true
    },
    instrument: {
        type: DataTypes.ENUM('piano', 'guitare', 'saxophone', 'batterie', 'voix', 'basse', 'violon', 'violoncelle', 'trompette', 'tutti'),
        allowNull: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    uploaded_by: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'partitions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Partition;