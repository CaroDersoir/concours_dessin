/** définition Sequelize de la table customer **/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const Customer = sequelize.define('Customer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nom: {
        type: DataTypes.STRING
    },
    prenom: {
        type: DataTypes.STRING
    },
    adresse: {
        type: DataTypes.STRING
    },
    telephone: {
        type: DataTypes.STRING
    },
    adresse_livraison: {
        type: DataTypes.STRING
    },
    preferences_paiement: {
        type: DataTypes.STRING
    },
    email_verified: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    verification_code: {
        type: DataTypes.STRING(10)
    },
    verification_code_expires: {
        type: DataTypes.DATE
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    },
    est_professeur: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'customer',
    timestamps: false
});

module.exports = Customer;