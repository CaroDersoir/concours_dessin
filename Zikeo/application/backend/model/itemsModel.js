/** requêtes sur la table items **/

const Item = require('../modelSequelize/itemModelSq');
const ItemCover = require('../modelSequelize/coverModelSq');

function toPlainWithCovers(item) {
    const plain = item.get({ plain: true });
    return { ...plain, covers: (plain.item_covers || []).map(c => c.url) };
}

exports.findAll = () => {
    return Item.findAll({ include: [{ model: ItemCover, as: 'item_covers' }] })
        .then(items => items.map(toPlainWithCovers));
};

exports.findById = (id) => {
    return Item.findByPk(id, {
        include: [{ model: ItemCover, as: 'item_covers' }]
    }).then(item => item ? toPlainWithCovers(item) : undefined);
};

exports.create = (item) => {
    return Item.create(item).then(created => ({
        ...created.get({ plain: true }),
        covers: []
    }));
};

exports.updateItem = (id, item) => {
    return Item.update(item, { where: { id } })
        .then(([affectedRows]) => affectedRows > 0);
};

exports.updateStock = (id, stock) => {
    return Item.update({ stock }, { where: { id } })
        .then(([affectedRows]) => affectedRows > 0);
};

exports.delete = (id) => {
    return Item.destroy({ where: { id } })
        .then(affectedRows => affectedRows > 0);
};