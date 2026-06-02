/** requêtes sur la table lessons **/

const Lesson = require('../modelSequelize/lessonModelSq');
const Customer = require('../modelSequelize/customerModelSq');

if (!Lesson.associations.teacher) {
    Lesson.belongsTo(Customer, { foreignKey: 'teacher_id', as: 'teacher' });
}

function flattenTeacher(plain) {
    return {
        ...plain,
        teacher_nom: plain.teacher?.nom || null,
        teacher_prenom: plain.teacher?.prenom || null,
        teacher: undefined
    };
}

const teacherInclude = [{ model: Customer, as: 'teacher', attributes: ['nom', 'prenom'], required: false }];

exports.findAll = () =>
    Lesson.findAll({ include: teacherInclude })
        .then(rows => rows.map(r => flattenTeacher(r.get({ plain: true }))));

exports.findById = (id) =>
    Lesson.findByPk(id, { include: teacherInclude })
        .then(r => r ? flattenTeacher(r.get({ plain: true })) : undefined);

exports.findByType = (type) =>
    Lesson.findAll({ where: { type } }).then(rows => rows.map(r => r.get({ plain: true })));

exports.create = (lesson) => Lesson.create(lesson).then(r => r.get({ plain: true }));

exports.update = (id, lesson) =>
    Lesson.update(lesson, { where: { id } }).then(([affected]) => affected > 0);

exports.delete = (id) =>
    Lesson.destroy({ where: { id } }).then(affected => affected > 0);
