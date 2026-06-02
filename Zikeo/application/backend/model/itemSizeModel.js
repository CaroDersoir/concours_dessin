/** requêtes sur la table item_sizes **/

const ItemSize = require('../modelSequelize/itemSizeModelSq');

exports.findByItemId = (itemId) => {
    return ItemSize.findAll({where: {item_id: itemId}, order: [['id', 'ASC']]})
        .then(rows => rows.map(r => r.get({plain: true})));
};

exports.setSizes = async (itemId, sizes) => {
    await ItemSize.destroy({where: {item_id: itemId}});
    if (!sizes || sizes.length === 0) return [];
    const created = await ItemSize.bulkCreate(
        sizes.map(s => ({item_id: itemId, size: s.size, stock: s.stock ?? 0}))
    );
    return created.map(r => r.get({plain: true}));
};
