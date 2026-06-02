const coverModel = require('../model/coverModel');

exports.uploadCover = async (id, fileUrl) => {
    return await coverModel.addItemCover(id, fileUrl);
};

exports.deleteCover = async (id) => {
    return await coverModel.deleteById(id);
};

