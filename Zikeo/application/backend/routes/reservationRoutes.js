/** routes des réservations de salle **/

const express = require('express');
const router = express.Router();
const reservationController = require('../controller/reservationController');

router.get('/mine', reservationController.getMine);
router.get('/derogations', reservationController.getPendingDerogations);
router.get('/', reservationController.getAll);
router.post('/', reservationController.create);
router.delete('/admin/:id', reservationController.adminDelete);
router.delete('/:id', reservationController.cancel);
router.put('/admin/:id', reservationController.adminUpdate);
router.put('/:id/derogation', reservationController.updateDerogation);

module.exports = router;
