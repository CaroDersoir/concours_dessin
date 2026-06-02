const express = require('express');
const router = express.Router();
const homeCardController = require('../controller/homeCardController');
const {requireAdmin} = require('../controller/customerController');

router.get('/',       homeCardController.getVisible);
router.get('/admin',  requireAdmin, homeCardController.getAll);
router.post('/',      requireAdmin, homeCardController.create);
router.put('/:id',    requireAdmin, homeCardController.update);
router.delete('/:id', requireAdmin, homeCardController.remove);

module.exports = router;
