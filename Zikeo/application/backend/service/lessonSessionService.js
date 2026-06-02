/** logique métier pour les séances de formations **/

const lessonSessionModel = require('../model/lessonSessionModel');
const lessonEnrollmentModel = require('../model/lessonEnrollmentModel');
const lessonModel = require('../model/lessonModel');

exports.getAll = async () => {
    const [sessions, lessons] = await Promise.all([
        lessonSessionModel.findAll(),
        lessonModel.findAll()
    ]);
    const lessonMap = Object.fromEntries(lessons.map(l => [l.id, l]));
    return sessions.map(s => ({ ...s, lesson: lessonMap[s.lesson_id] || null }));
};

exports.getForUser = async (userId) => {
    const enrollments = await lessonEnrollmentModel.findByUser(userId);
    const lessonIds = enrollments.map(e => e.lesson_id);
    if (lessonIds.length === 0) return [];

    const [sessions, lessons] = await Promise.all([
        lessonSessionModel.findByLessonIds(lessonIds),
        lessonModel.findAll()
    ]);

    const lessonMap = Object.fromEntries(lessons.map(l => [l.id, l]));
    return sessions.map(s => ({ ...s, lesson: lessonMap[s.lesson_id] || null }));
};

exports.getByLesson = (lessonId) =>
    lessonSessionModel.findByLessonIds([lessonId]);

exports.create = (data) => lessonSessionModel.create(data);

exports.update = (id, data) => lessonSessionModel.update(id, data);

exports.delete = (id) => lessonSessionModel.delete(id);
