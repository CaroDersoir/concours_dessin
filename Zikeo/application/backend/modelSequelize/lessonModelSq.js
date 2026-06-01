/** définition Sequelize de la table lessons **/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const Lesson = sequelize.define('Lesson', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    type: {
        type: DataTypes.ENUM('theory', 'instrument'),
        allowNull: false
    },
    level: {
        type: DataTypes.ENUM('débutant', 'intermédiaire', 'avancé'),
        allowNull: false,
        defaultValue: 'débutant'
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    spots: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    salle: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'local'
    }
}, {
    tableName: 'lessons',
    timestamps: false
});

module.exports = Lesson;
