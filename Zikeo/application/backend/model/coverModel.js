/** requêtes sur la table item_covers **/

const ItemCover = require('../modelSequelize/coverModelSq');

exports.addItemCover = (id, imageUrl) => {
    return ItemCover.create({ item_id: id, url: imageUrl })
        .then(row => row.get({ plain: true }));
};

exports.deleteById = (id) => {
    return ItemCover.destroy({ where: { id } }).then(n => n > 0);
};