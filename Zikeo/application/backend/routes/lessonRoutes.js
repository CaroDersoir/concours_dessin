/** indique quelle fonction appeler pour quelle URL — leçons **/

const express = require('express');
const router = express.Router();
const lessonController = require('../controller/lessonController');

router.get('/', lessonController.getLessons);
router.post('/', lessonController.createLesson);
router.get('/:id', lessonController.getLessonById);
router.put('/:id', lessonController.updateLesson);
router.delete('/:id', lessonController.deleteLesson);

module.exports = router;
