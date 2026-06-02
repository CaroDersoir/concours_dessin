/** requêtes sur la table lesson_enrollments **/

const LessonEnrollment = require('../modelSequelize/lessonEnrollmentModelSq');
const Customer = require('../modelSequelize/customerModelSq');

if (!LessonEnrollment.associations.user) {
    LessonEnrollment.belongsTo(Customer, { foreignKey: 'user_id', as: 'user' });
}

exports.findByUser = (userId) =>
    LessonEnrollment.findAll({ where: { user_id: userId } })
        .then(rows => rows.map(r => r.get({ plain: true })));

exports.findByLesson = (lessonId) =>
    LessonEnrollment.findAll({
        where: { lesson_id: lessonId },
        include: [{ model: Customer, as: 'user', attributes: ['id', 'nom', 'prenom', 'email'], required: false }]
    }).then(rows => rows.map(r => {
        const plain = r.get({ plain: true });
        return { ...plain, user: plain.user || null };
    }));

exports.create = (data) =>
    LessonEnrollment.create(data).then(r => r.get({ plain: true }));

exports.delete = (userId, lessonId) =>
    LessonEnrollment.destroy({ where: { user_id: userId, lesson_id: lessonId } })
        .then(affected => affected > 0);
