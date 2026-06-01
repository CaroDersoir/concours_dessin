/** requêtes sur la table lesson_sessions **/

const { Op } = require('sequelize');
const LessonSession = require('../modelSequelize/lessonSessionModelSq');

exports.findAll = () =>
    LessonSession.findAll().then(rows => rows.map(r => r.get({ plain: true })));

exports.findByLessonIds = (ids) =>
    ids.length === 0
        ? Promise.resolve([])
        : LessonSession.findAll({ where: { lesson_id: { [Op.in]: ids } } })
              .then(rows => rows.map(r => r.get({ plain: true })));

exports.create = (data) =>
    LessonSession.create(data).then(r => r.get({ plain: true }));

exports.update = (id, data) =>
    LessonSession.update(data, { where: { id } }).then(([affected]) => affected > 0);

exports.delete = (id) =>
    LessonSession.destroy({ where: { id } }).then(affected => affected > 0);
