/** requêtes sur la table lesson_enrollments **/

const LessonEnrollment = require('../modelSequelize/lessonEnrollmentModelSq');

exports.findByUser = (userId) =>
    LessonEnrollment.findAll({ where: { user_id: userId } })
        .then(rows => rows.map(r => r.get({ plain: true })));

exports.create = (data) =>
    LessonEnrollment.create(data).then(r => r.get({ plain: true }));

exports.delete = (userId, lessonId) =>
    LessonEnrollment.destroy({ where: { user_id: userId, lesson_id: lessonId } })
        .then(affected => affected > 0);
