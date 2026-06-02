/** routes commandes **/

const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');

router.get('/admin', orderController.getAllOrders);
router.put('/admin/:id/status', orderController.updateOrderStatus);
router.post('/', orderController.createOrder);
router.get('/me', orderController.getMyOrders);

module.exports = router;
