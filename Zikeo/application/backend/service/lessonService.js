/** fait le lien entre controller et model pour les leçons **/

const lessonModel = require('../model/lessonModel');

exports.getAllLessons = () => lessonModel.findAll();

exports.getLessonById = (id) => lessonModel.findById(id);

exports.createLesson = (lesson) => lessonModel.create(lesson);

exports.updateLesson = (id, lesson) => lessonModel.update(id, lesson);

exports.deleteLesson = (id) => lessonModel.delete(id);
