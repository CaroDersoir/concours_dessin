/** service pour les tailles d'articles **/

const itemSizeModel = require('../model/itemSizeModel');

exports.getSizesByItemId = (itemId) => itemSizeModel.findByItemId(itemId);

exports.setSizes = (itemId, sizes) => itemSizeModel.setSizes(itemId, sizes);
