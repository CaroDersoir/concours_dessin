/** fait le lien entre controller et model pour les promotions **/

const promotionModel = require('../model/promotionModel');

exports.getAllPromotions = () => promotionModel.findAll();

exports.getPromotionById = (id) => promotionModel.findById(id);

exports.getPromotionByCode = (code) => promotionModel.findByCode(code);

exports.createPromotion = (data) => promotionModel.create(data);

exports.updatePromotion = (id, data) => promotionModel.update(id, data);

exports.deletePromotion = (id) => promotionModel.delete(id);
