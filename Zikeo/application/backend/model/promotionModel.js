/** requêtes sur la table promotions **/

const Promotion = require('../modelSequelize/promotionModelSq');
// import nécessaire pour déclencher les associations Item <-> Promotion
const Item = require('../modelSequelize/itemModelSq');

exports.findAll = () =>
    Promotion.findAll({
        include: [{model: Item, as: 'items', attributes: ['id', 'name', 'price', 'promotion_id']}]
    }).then(rows => rows.map(r => r.get({plain: true})));

exports.findById = (id) =>
    Promotion.findByPk(id, {
        include: [{model: Item, as: 'items', attributes: ['id', 'name', 'price', 'promotion_id']}]
    }).then(r => r ? r.get({plain: true}) : undefined);

exports.findByCode = (code) =>
    Promotion.findOne({where: {code}})
        .then(r => r ? r.get({plain: true}) : undefined);

exports.create = (data) =>
    Promotion.create(data).then(r => r.get({plain: true}));

exports.update = (id, data) =>
    Promotion.update(data, {where: {id}}).then(([n]) => n > 0);

exports.delete = (id) =>
    Promotion.destroy({where: {id}}).then(n => n > 0);
