/** fait le lien entre controller et model **/

const homeCardModel = require('../model/homeCardModel');

exports.getVisibleCards = () => homeCardModel.findVisible();
exports.getAllCards     = () => homeCardModel.findAll();
exports.createCard     = (data) => homeCardModel.create(data);
exports.updateCard     = (id, data) => homeCardModel.updateById(id, data);
exports.deleteCard     = (id) => homeCardModel.deleteById(id);
