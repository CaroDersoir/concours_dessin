/** regroupe les routes / utile si plusieurs modules **/

const express = require('express');
const router = express.Router();

const itemsRoutes = require('./itemsRoutes');
const coverRoutes = require('./coverRoutes');
const itemSizeRoutes = require('./itemSizeRoutes');
const partitionsRoutes = require('./partitionsRoutes');
const usersRoutes = require('./customerRoutes');
const lessonRoutes = require('./lessonRoutes');
const lessonSessionRoutes = require('./lessonSessionRoutes');
const lessonEnrollmentRoutes = require('./lessonEnrollmentRoutes');
const reservationRoutes = require('./reservationRoutes');
const promotionRoutes = require('./promotionRoutes');
const litigeRoutes = require('./litigeRoutes');
const orderRoutes = require('./orderRoutes');
const homeCardRoutes = require('./homeCardRoutes');
const contactRoutes = require('./contactRoutes');

router.use('/items', itemsRoutes);
router.use('/covers', coverRoutes);
router.use('/item-sizes', itemSizeRoutes);
router.use('/partitions', partitionsRoutes);
router.use('/users', usersRoutes);
router.use('/lessons', lessonRoutes);
router.use('/lesson-sessions', lessonSessionRoutes);
router.use('/lesson-enrollments', lessonEnrollmentRoutes);
router.use('/reservations', reservationRoutes);
router.use('/promotions', promotionRoutes);
router.use('/litiges', litigeRoutes);
router.use('/orders', orderRoutes);
router.use('/home-cards', homeCardRoutes);
router.use('/contact', contactRoutes);

module.exports = router;
