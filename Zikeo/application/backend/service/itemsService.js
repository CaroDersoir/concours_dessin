/** fait le lien entre controller et model **/

const itemsModel = require('../model/itemsModel');

exports.getAllItems = async () => {
    return await itemsModel.findAll();
};

exports.getItemById = async (id) => {
    return await itemsModel.findById(id);
};

exports.createItem = async (item) => {
    return await itemsModel.create(item);
};

exports.updateItem = async (id, item) => {
    return await itemsModel.update(id, item);
};

exports.updateItemStock = async (id, stock) => {
    return await itemsModel.updateStock(id, stock);
};

exports.deleteItem = async (id) => {
    return await itemsModel.delete(id);
};
