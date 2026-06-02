/** requêtes sur les tables orders et order_items **/

const Order = require('../modelSequelize/orderModelSq');
const OrderItem = require('../modelSequelize/orderItemModelSq');
const Customer = require('../modelSequelize/customerModelSq');

if (!Order.associations.items) {
    Order.hasMany(OrderItem, {foreignKey: 'order_id', as: 'items'});
    OrderItem.belongsTo(Order, {foreignKey: 'order_id'});
}
if (!Order.associations.customer) {
    Order.belongsTo(Customer, {foreignKey: 'user_id', as: 'customer'});
}

exports.create = async (orderData, items) => {
    const order = await Order.create(orderData);
    await OrderItem.bulkCreate(items.map(i => ({...i, order_id: order.id})));
    return order.get({plain: true});
};

exports.findByUserId = (userId) =>
    Order.findAll({
        where: {user_id: userId},
        include: [{model: OrderItem, as: 'items'}],
        order: [['created_at', 'DESC']]
    }).then(rows => rows.map(r => r.get({plain: true})));

exports.findAll = () =>
    Order.findAll({
        order: [['created_at', 'DESC']],
        include: [
            {model: Customer, as: 'customer', attributes: ['nom', 'prenom', 'email']},
            {model: OrderItem, as: 'items'}
        ]
    }).then(rows => rows.map(r => {
        const plain = r.get({plain: true});
        return {
            ...plain,
            customer_nom: plain.customer?.nom || null,
            customer_prenom: plain.customer?.prenom || null,
            customer_email: plain.customer?.email || null,
            customer: undefined
        };
    }));

exports.updateStatus = (id, status) =>
    Order.update({status}, {where: {id}})
        .then(([affected]) => affected > 0);
