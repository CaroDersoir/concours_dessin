const partitionsModel = require('../model/partitionsModel');

exports.getAllPartitions = () => partitionsModel.findAll();

exports.createPartition = (title, url) => partitionsModel.create(title, url);

exports.deletePartition = (id) => partitionsModel.delete(id);
