/** routes des litiges **/

const express = require('express');
const router = express.Router();
const litigeController = require('../controller/litigeController');

router.get('/mine', litigeController.getMine);
router.get('/', litigeController.getAll);
router.put('/:id/statut', litigeController.updateStatut);
router.post('/', litigeController.create);

module.exports = router;
