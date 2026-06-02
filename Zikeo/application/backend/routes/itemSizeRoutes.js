/** routes pour les tailles par article **/

const express = require('express');
const router = express.Router();
const itemSizeController = require('../controller/itemSizeController');

router.get('/:itemId', itemSizeController.getSizes);
router.put('/:itemId', itemSizeController.setSizes);

module.exports = router;
