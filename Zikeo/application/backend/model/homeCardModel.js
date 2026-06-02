/** requêtes sur la table home_cards **/

const HomeCard = require('../modelSequelize/homeCardModelSq');
const Item = require('../modelSequelize/itemModelSq');
const ItemCover = require('../modelSequelize/coverModelSq');

function plainWithItemCovers(row) {
    const plain = row.get({plain: true});
    if (plain.item?.item_covers) {
        plain.item.covers = plain.item.item_covers.map(c => c.url);
        delete plain.item.item_covers;
    }
    return plain;
}

const itemInclude = {
    model: Item,
    as: 'item',
    required: false,
    include: [{model: ItemCover, as: 'item_covers'}]
};

exports.findVisible = () =>
    HomeCard.findAll({
        where: {visible: true},
        include: [itemInclude],
        order: [['position', 'ASC']]
    }).then(rows => rows.map(plainWithItemCovers));

exports.findAll = () =>
    HomeCard.findAll({
        include: [itemInclude],
        order: [['position', 'ASC']]
    }).then(rows => rows.map(plainWithItemCovers));

exports.create = (data) =>
    HomeCard.create(data).then(r => r.get({plain: true}));

exports.updateById = (id, data) =>
    HomeCard.update(data, {where: {id}}).then(([n]) => n > 0);

exports.deleteById = (id) =>
    HomeCard.destroy({where: {id}}).then(n => n > 0);
