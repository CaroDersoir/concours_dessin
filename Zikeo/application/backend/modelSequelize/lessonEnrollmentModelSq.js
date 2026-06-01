/** définition Sequelize de la table lesson_enrollments **/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const LessonEnrollment = sequelize.define('LessonEnrollment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'lesson_enrollments',
    timestamps: false
});

module.exports = LessonEnrollment;
