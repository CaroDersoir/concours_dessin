/** logique métier pour les réservations de salle **/

const reservationModel = require('../model/reservationModel');

const MAX_DURATION_MINUTES = 120;

function parseTimeToMinutes(time) {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

function getWeekStart(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day; // ramène au lundi
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);
    return monday.toISOString().split('T')[0];
}

exports.getAll = () => reservationModel.findAll();

exports.getMine = (userId) => reservationModel.findByUser(userId);

exports.create = async (userId, { date, heure_debut, heure_fin, derogation = false, motif = null }, estProfesseur) => {
    const durationExceeded =
        parseTimeToMinutes(heure_fin) - parseTimeToMinutes(heure_debut) > MAX_DURATION_MINUTES;

    let weeklyLimitExceeded = false;
    if (!estProfesseur) {
        const weekStart = getWeekStart(date);
        const myReservations = await reservationModel.findByUser(userId);
        const thisWeek = myReservations.filter(r => {
            if (r.statut === 'refusee') return false;
            if (r.est_derogation && r.statut_derogation === 'refusee') return false;
            return getWeekStart(r.date) === weekStart;
        });
        weeklyLimitExceeded = thisWeek.length >= 1;
    }

    if ((durationExceeded || weeklyLimitExceeded) && !derogation) {
        return { limitExceeded: true, limitType: durationExceeded ? 'duration' : 'weekly' };
    }

    const created = await reservationModel.create({
        user_id: userId,
        date,
        heure_debut,
        heure_fin,
        statut: 'approuvee',
        est_derogation: derogation,
        statut_derogation: derogation ? 'en_attente' : null,
        motif
    });

    return { reservation: created };
};

exports.cancel = (id, userId) => reservationModel.deleteByIdAndUser(id, userId);

exports.adminDelete = (id) => reservationModel.deleteById(id);

exports.getPendingDerogations = () => reservationModel.findPendingDerogations();

exports.adminUpdate = (id, data) => reservationModel.updateById(id, data);

exports.updateDerogation = (id, statut) => reservationModel.updateDerogation(id, statut);
