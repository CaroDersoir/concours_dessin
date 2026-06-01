/** routes pour les promotions **/

const express = require('express');
const router = express.Router();
const promotionController = require('../controller/promotionController');

router.get('/', promotionController.getPromotions);
router.get('/validate/:code', promotionController.validateCode);
router.get('/:id', promotionController.getPromotionById);
router.post('/', promotionController.createPromotion);
router.put('/:id', promotionController.updatePromotion);
router.delete('/:id', promotionController.deletePromotion);

module.exports = router;
