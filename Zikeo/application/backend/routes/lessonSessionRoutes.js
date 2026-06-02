/** routes des séances de formations **/

const express = require('express');
const router = express.Router();
const lessonSessionController = require('../controller/lessonSessionController');

router.get('/mine', lessonSessionController.getMine);
router.get('/by-lesson/:lessonId', lessonSessionController.getByLesson);
router.get('/', lessonSessionController.getAll);
router.post('/', lessonSessionController.create);
router.put('/:id', lessonSessionController.update);
router.delete('/:id', lessonSessionController.delete);

module.exports = router;
