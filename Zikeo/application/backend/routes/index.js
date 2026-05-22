/** regroupe les routes / utile si plusieurs modules **/

const express = require('express');
const router = express.Router();

const itemsRoutes = require('./itemsRoutes');
const coverRoutes = require('./coverRoutes');
const partitionsRoutes = require('./partitionsRoutes');

router.use('/items', itemsRoutes);
router.use('/covers', coverRoutes);
router.use('/partitions', partitionsRoutes);

module.exports = router;
