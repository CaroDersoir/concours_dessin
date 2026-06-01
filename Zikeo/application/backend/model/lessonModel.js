/** requêtes sur la table lessons **/

const Lesson = require('../modelSequelize/lessonModelSq');

exports.findAll = () => Lesson.findAll().then(rows => rows.map(r => r.get({ plain: true })));

exports.findById = (id) =>
    Lesson.findByPk(id).then(r => r ? r.get({ plain: true }) : undefined);

exports.findByType = (type) =>
    Lesson.findAll({ where: { type } }).then(rows => rows.map(r => r.get({ plain: true })));

exports.create = (lesson) => Lesson.create(lesson).then(r => r.get({ plain: true }));

exports.update = (id, lesson) =>
    Lesson.update(lesson, { where: { id } }).then(([affected]) => affected > 0);

exports.delete = (id) =>
    Lesson.destroy({ where: { id } }).then(affected => affected > 0);
