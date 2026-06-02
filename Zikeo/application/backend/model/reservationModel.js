/** requêtes sur la table reservations **/

const Reservation = require('../modelSequelize/reservationModelSq');
const Customer = require('../modelSequelize/customerModelSq');

if (!Reservation.associations.customer) {
    Reservation.belongsTo(Customer, { foreignKey: 'user_id', as: 'customer' });
}

exports.findAll = () =>
    Reservation.findAll({
        order: [['date', 'ASC'], ['heure_debut', 'ASC']],
        include: [{ model: Customer, as: 'customer', attributes: ['nom', 'prenom', 'email'] }]
    }).then(rows => rows.map(r => {
        const plain = r.get({ plain: true });
        return { ...plain, user_nom: plain.customer?.nom || null, user_prenom: plain.customer?.prenom || null, user_email: plain.customer?.email || null, customer: undefined };
    }));

exports.findByUser = (userId) =>
    Reservation.findAll({ where: { user_id: userId } })
        .then(rows => rows.map(r => r.get({ plain: true })));

exports.findPendingDerogations = () =>
    Reservation.findAll({
        where: { statut_derogation: 'en_attente' },
        order: [['date', 'ASC']],
        include: [{ model: Customer, as: 'customer', attributes: ['nom', 'prenom', 'email'] }]
    }).then(rows => rows.map(r => {
        const plain = r.get({ plain: true });
        return { ...plain, user_nom: plain.customer?.nom || null, user_prenom: plain.customer?.prenom || null, user_email: plain.customer?.email || null, customer: undefined };
    }));

exports.create = (data) =>
    Reservation.create(data).then(r => r.get({ plain: true }));

exports.deleteByIdAndUser = (id, userId) =>
    Reservation.destroy({ where: { id, user_id: userId } })
        .then(affected => affected > 0);

exports.deleteById = (id) =>
    Reservation.destroy({ where: { id } })
        .then(affected => affected > 0);

exports.updateById = (id, data) =>
    Reservation.update(data, { where: { id } })
        .then(([affected]) => affected > 0);

exports.updateDerogation = (id, statut_derogation) =>
    Reservation.update({ statut_derogation }, { where: { id } })
        .then(([affected]) => affected > 0);
