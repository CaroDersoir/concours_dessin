const express = require('express');
const router = express.Router();
const coverController = require('../controller/coverController');
const uploadMiddleware = require('../middleware/uploadMiddleware');

router.post('/', uploadMiddleware.single('file'), coverController.uploadCover);
router.delete('/:id', coverController.deleteCover);

module.exports = router;
