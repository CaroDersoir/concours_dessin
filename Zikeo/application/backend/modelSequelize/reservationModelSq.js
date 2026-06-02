/** définition Sequelize de la table reservations **/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const Reservation = sequelize.define('Reservation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    heure_debut: {
        type: DataTypes.TIME,
        allowNull: false
    },
    heure_fin: {
        type: DataTypes.TIME,
        allowNull: false
    },
    statut: {
        type: DataTypes.ENUM('approuvee', 'refusee'),
        defaultValue: 'approuvee'
    },
    est_derogation: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    statut_derogation: {
        type: DataTypes.ENUM('en_attente', 'approuvee', 'refusee'),
        allowNull: true,
        defaultValue: null
    },
    motif: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'reservations',
    timestamps: false
});

module.exports = Reservation;
