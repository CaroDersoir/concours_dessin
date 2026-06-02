/** requêtes sur la table litiges **/

const Litige = require('../modelSequelize/litigeModelSq');
const Customer = require('../modelSequelize/customerModelSq');

if (!Litige.associations.customer) {
    Litige.belongsTo(Customer, { foreignKey: 'user_id', as: 'customer' });
}

const flattenCustomer = (r) => {
    const plain = r.get({ plain: true });
    return { ...plain, user_nom: plain.customer?.nom || null, user_prenom: plain.customer?.prenom || null, user_email: plain.customer?.email || null, customer: undefined };
};

exports.findByUser = (userId) =>
    Litige.findAll({ where: { user_id: userId }, order: [['created_at', 'DESC']] })
        .then(rows => rows.map(r => r.get({ plain: true })));

exports.findAll = () =>
    Litige.findAll({
        order: [['created_at', 'DESC']],
        include: [{ model: Customer, as: 'customer', attributes: ['nom', 'prenom', 'email'] }]
    }).then(rows => rows.map(flattenCustomer));

exports.updateStatut = (id, statut) =>
    Litige.update({ statut }, { where: { id } })
        .then(([affected]) => affected > 0);

exports.create = (data) =>
    Litige.create(data).then(r => r.get({ plain: true }));
