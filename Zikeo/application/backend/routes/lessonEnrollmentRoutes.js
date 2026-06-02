/** routes des inscriptions aux formations **/

const express = require('express');
const router = express.Router();
const lessonEnrollmentController = require('../controller/lessonEnrollmentController');

router.get('/by-lesson/:lessonId', lessonEnrollmentController.getByLesson);

module.exports = router;
