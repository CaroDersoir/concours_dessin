const express = require('express');
const router = express.Router();
const partitionsController = require('../controller/partitionsController');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const {requireAuth, requireAdmin} = require('../controller/customerController');

router.get('/', partitionsController.getPartitions);
router.post('/', requireAuth, uploadMiddleware.single('file'), partitionsController.uploadPartition);
router.delete('/:id', requireAdmin, partitionsController.deletePartition);

module.exports = router;
