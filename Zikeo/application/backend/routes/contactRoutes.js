/** route POST /contact/evaluation **/

const express = require('express');
const router = express.Router();
const contactController = require('../controller/contactController');

router.post('/evaluation', contactController.sendEvaluation);

module.exports = router;
