/** définition Sequelize de la table lesson_sessions **/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const LessonSession = sequelize.define('LessonSession', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    lesson_id: {
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
    }
}, {
    tableName: 'lesson_sessions',
    timestamps: false
});

module.exports = LessonSession;
