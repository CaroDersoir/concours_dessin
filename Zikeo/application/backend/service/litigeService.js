/** logique métier pour les litiges **/

const litigeModel = require('../model/litigeModel');

exports.getMine = (userId) => litigeModel.findByUser(userId);

exports.getAll = () => litigeModel.findAll();

exports.updateStatut = (id, statut) => litigeModel.updateStatut(id, statut);

exports.create = (userId, { commande_ref, type, description }) =>
    litigeModel.create({ user_id: userId, commande_ref: commande_ref || null, type, description, statut: 'ouvert' });
