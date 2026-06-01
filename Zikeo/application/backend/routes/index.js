/** regroupe les routes / utile si plusieurs modules **/

const express = require('express');
const router = express.Router();

const itemsRoutes = require('./itemsRoutes');
const coverRoutes = require('./coverRoutes');
const partitionsRoutes = require('./partitionsRoutes');
const usersRoutes = require('./customerRoutes');
const lessonRoutes = require('./lessonRoutes');
const lessonSessionRoutes = require('./lessonSessionRoutes');
const reservationRoutes = require('./reservationRoutes');
const promotionRoutes = require('./promotionRoutes');

router.use('/items', itemsRoutes);
router.use('/covers', coverRoutes);
router.use('/partitions', partitionsRoutes);
router.use('/users', usersRoutes);
router.use('/lessons', lessonRoutes);
router.use('/lesson-sessions', lessonSessionRoutes);
router.use('/reservations', reservationRoutes);
router.use('/promotions', promotionRoutes);

module.exports = router;
