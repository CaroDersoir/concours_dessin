const coverModel = require('../model/coverModel');

exports.uploadCover = async (id, fileUrl) => {
    return await coverModel.addItemCover(id, fileUrl);
};

