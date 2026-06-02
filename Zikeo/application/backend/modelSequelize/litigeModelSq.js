/** définition Sequelize de la table litiges **/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const Litige = sequelize.define('Litige', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    commande_ref: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    type: {
        type: DataTypes.ENUM('livraison', 'qualite', 'paiement', 'autre'),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    statut: {
        type: DataTypes.ENUM('ouvert', 'en_cours', 'resolu', 'rejete'),
        defaultValue: 'ouvert'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'litiges',
    timestamps: false
});

module.exports = Litige;
