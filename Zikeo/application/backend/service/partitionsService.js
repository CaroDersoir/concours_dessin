const partitionsModel = require('../model/partitionsModel');

exports.getAllPartitions = () => partitionsModel.findAll();

exports.createPartition = (title, url, author, instrument, uploadedBy) => partitionsModel.create(title, url, author, instrument, uploadedBy);

exports.deletePartition = (id) => partitionsModel.delete(id);
