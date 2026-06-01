/** requêtes sur la table reservations **/

const Reservation = require('../modelSequelize/reservationModelSq');

exports.findAll = () =>
    Reservation.findAll({ order: [['date', 'ASC'], ['heure_debut', 'ASC']] })
        .then(rows => rows.map(r => r.get({ plain: true })));

exports.findByUser = (userId) =>
    Reservation.findAll({ where: { user_id: userId } })
        .then(rows => rows.map(r => r.get({ plain: true })));

exports.findPendingDerogations = () =>
    Reservation.findAll({ where: { statut_derogation: 'en_attente' } })
        .then(rows => rows.map(r => r.get({ plain: true })));

exports.create = (data) =>
    Reservation.create(data).then(r => r.get({ plain: true }));

exports.deleteByIdAndUser = (id, userId) =>
    Reservation.destroy({ where: { id, user_id: userId } })
        .then(affected => affected > 0);

exports.updateDerogation = (id, statut_derogation) =>
    Reservation.update({ statut_derogation }, { where: { id } })
        .then(([affected]) => affected > 0);
