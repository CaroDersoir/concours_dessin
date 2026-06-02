const jwt = require('jsonwebtoken');
const reservationService = require('../service/reservationService');
const customerModel = require('../model/customerModel');

const verifyToken = (req) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) throw new Error('Token manquant.');
    return jwt.verify(auth.slice(7), 'votre_clé_secrète');
};

exports.getAll = async (req, res) => {
    try {
        const reservations = await reservationService.getAll();
        res.json(reservations);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.getMine = async (req, res) => {
    try {
        const {userId} = verifyToken(req);
        const reservations = await reservationService.getMine(userId);
        res.json(reservations);
    } catch (err) {
        res.status(401).json({error: err.message});
    }
};

exports.create = async (req, res) => {
    try {
        const {userId} = verifyToken(req);
        const {date, heure_debut, heure_fin, derogation, motif} = req.body;

        if (!date || !heure_debut || !heure_fin)
            return res.status(400).json({error: 'date, heure_debut et heure_fin sont obligatoires.'});

        if (heure_fin <= heure_debut)
            return res.status(400).json({error: "L'heure de fin doit être après l'heure de début."});

        const user = await customerModel.findById(userId);
        const result = await reservationService.create(
            userId,
            {date, heure_debut, heure_fin, derogation: !!derogation, motif: motif || null},
            !!user?.est_professeur
        );

        if (result.limitExceeded)
            return res.status(409).json({error: 'Limite dépassée.', limitType: result.limitType});

        res.status(201).json(result.reservation);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.cancel = async (req, res) => {
    try {
        const {userId} = verifyToken(req);
        const id = parseInt(req.params.id, 10);
        const deleted = await reservationService.cancel(id, userId);
        if (!deleted) return res.status(404).json({error: 'Réservation introuvable.'});
        res.status(204).send();
    } catch (err) {
        res.status(401).json({error: err.message});
    }
};

exports.adminDelete = async (req, res) => {
    try {
        const {userId} = verifyToken(req);
        const user = await customerModel.findById(userId);
        if (user?.role !== 'admin') return res.status(403).json({error: 'Accès refusé.'});
        const id = parseInt(req.params.id, 10);
        const deleted = await reservationService.adminDelete(id);
        if (!deleted) return res.status(404).json({error: 'Réservation introuvable.'});
        res.status(204).send();
    } catch (err) {
        res.status(401).json({error: err.message});
    }
};

exports.adminUpdate = async (req, res) => {
    try {
        const {userId} = verifyToken(req);
        const user = await customerModel.findById(userId);
        if (user?.role !== 'admin') return res.status(403).json({error: 'Accès refusé.'});
        const id = parseInt(req.params.id, 10);
        const {date, heure_debut, heure_fin, motif} = req.body;
        if (!date || !heure_debut || !heure_fin)
            return res.status(400).json({error: 'date, heure_debut et heure_fin sont obligatoires.'});
        if (heure_fin <= heure_debut)
            return res.status(400).json({error: "L'heure de fin doit être après l'heure de début."});
        const updated = await reservationService.adminUpdate(id, {date, heure_debut, heure_fin, motif: motif || null});
        if (!updated) return res.status(404).json({error: 'Réservation introuvable.'});
        res.json({message: 'Réservation mise à jour.'});
    } catch (err) {
        res.status(401).json({error: err.message});
    }
};

exports.getPendingDerogations = async (req, res) => {
    try {
        const {userId} = verifyToken(req);
        const user = await customerModel.findById(userId);
        if (user?.role !== 'admin') return res.status(403).json({error: 'Accès refusé.'});
        const derogations = await reservationService.getPendingDerogations();
        res.json(derogations);
    } catch (err) {
        res.status(401).json({error: err.message});
    }
};

exports.updateDerogation = async (req, res) => {
    try {
        const {userId} = verifyToken(req);
        const user = await customerModel.findById(userId);
        if (user?.role !== 'admin') return res.status(403).json({error: 'Accès refusé.'});
        const id = parseInt(req.params.id, 10);
        const {statut} = req.body;
        if (!['approuvee', 'refusee'].includes(statut))
            return res.status(400).json({error: "statut doit être 'approuvee' ou 'refusee'."});
        await reservationService.updateDerogation(id, statut);
        res.json({message: 'Dérogation mise à jour.'});
    } catch (err) {
        res.status(401).json({error: err.message});
    }
};
