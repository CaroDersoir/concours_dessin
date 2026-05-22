const express = require('express');
const router = express.Router();
const partitionsController = require('../controller/partitionsController');
const uploadMiddleware = require('../middleware/uploadMiddleware');

router.get('/', partitionsController.getPartitions);
router.post('/', uploadMiddleware.single('file'), partitionsController.uploadPartition);
router.delete('/:id', partitionsController.deletePartition);

module.exports = router;
