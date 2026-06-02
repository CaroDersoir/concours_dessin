/** requêtes sur la table items **/

const {Op} = require('sequelize');
const Item = require('../modelSequelize/itemModelSq');
const ItemCover = require('../modelSequelize/coverModelSq');
const ItemSize = require('../modelSequelize/itemSizeModelSq');
const Promotion = require('../modelSequelize/promotionModelSq');

function toPlainWithCovers(item) {
    const plain = item.get({ plain: true });
    return {
        ...plain,
        covers: (plain.item_covers || []).map(c => c.url),
        coverObjects: (plain.item_covers || []).map(c => ({id: c.id, url: c.url})),
        sizes: (plain.item_sizes || []).map(s => ({id: s.id, size: s.size, stock: s.stock}))
    };
}

async function getActiveTuttiPromo() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const promo = await Promotion.findOne({
        where: {
            type: 'tutti',
            start_date: { [Op.lte]: today },
            end_date: { [Op.gte]: today }
        },
        order: [['discount_percent', 'DESC']]
    });
    return promo ? promo.get({ plain: true }) : null;
}

exports.findAll = async () => {
    const [items, tuttiPromo] = await Promise.all([
        Item.findAll({ include: [
            { model: ItemCover, as: 'item_covers' },
            { model: ItemSize, as: 'item_sizes' },
            { model: Promotion, as: 'promotion' }
        ]}),
        getActiveTuttiPromo()
    ]);

    return items.map(item => {
        const plain = toPlainWithCovers(item);
        if (!plain.promotion && tuttiPromo) {
            plain.promotion = tuttiPromo;
        }
        return plain;
    });
};

exports.findById = async (id) => {
    const [item, tuttiPromo] = await Promise.all([
        Item.findByPk(id, {
            include: [
                { model: ItemCover, as: 'item_covers' },
                { model: ItemSize, as: 'item_sizes' },
                { model: Promotion, as: 'promotion' }
            ]
        }),
        getActiveTuttiPromo()
    ]);
    if (!item) return undefined;
    const plain = toPlainWithCovers(item);
    if (!plain.promotion && tuttiPromo) {
        plain.promotion = tuttiPromo;
    }
    return plain;
};

exports.create = (item) => {
    return Item.create(item).then(created => ({
        ...created.get({ plain: true }),
        covers: []
    }));
};

exports.updateItem = async (id, item) => {
    await Item.update(item, { where: { id } });
    const exists = await Item.count({ where: { id } });
    return exists > 0;
};

exports.updateStock = (id, stock) => {
    return Item.update({ stock }, { where: { id } })
        .then(([affectedRows]) => affectedRows > 0);
};

exports.delete = (id) => {
    return Item.destroy({ where: { id } })
        .then(affectedRows => affectedRows > 0);
};
