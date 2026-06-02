const jwt = require('jsonwebtoken');
const litigeService = require('../service/litigeService');
const customerModel = require('../model/customerModel');

const TYPES_VALIDES = ['livraison', 'qualite', 'paiement', 'autre'];
const STATUTS_VALIDES = ['ouvert', 'en_cours', 'resolu', 'rejete'];

const verifyToken = (req) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) throw new Error('Token manquant.');
    return jwt.verify(auth.slice(7), 'votre_clé_secrète');
};

exports.getAll = async (req, res) => {
    try {
        const {userId} = verifyToken(req);
        const user = await customerModel.findById(userId);
        if (user?.role !== 'admin') return res.status(403).json({error: 'Accès refusé.'});
        const litiges = await litigeService.getAll();
        res.json(litiges);
    } catch (err) {
        res.status(401).json({error: err.message});
    }
};

exports.updateStatut = async (req, res) => {
    try {
        const {userId} = verifyToken(req);
        const user = await customerModel.findById(userId);
        if (user?.role !== 'admin') return res.status(403).json({error: 'Accès refusé.'});
        const id = parseInt(req.params.id, 10);
        const {statut} = req.body;
        if (!STATUTS_VALIDES.includes(statut))
            return res.status(400).json({error: 'Statut invalide.'});
        const updated = await litigeService.updateStatut(id, statut);
        if (!updated) return res.status(404).json({error: 'Litige introuvable.'});
        res.json({message: 'Statut mis à jour.'});
    } catch (err) {
        res.status(401).json({error: err.message});
    }
};

exports.getMine = async (req, res) => {
    try {
        const {userId} = verifyToken(req);
        const litiges = await litigeService.getMine(userId);
        res.json(litiges);
    } catch (err) {
        res.status(401).json({error: err.message});
    }
};

exports.create = async (req, res) => {
    try {
        const {userId} = verifyToken(req);
        const {commande_ref, type, description} = req.body;

        if (!type || !description)
            return res.status(400).json({error: 'type et description sont obligatoires.'});

        if (!TYPES_VALIDES.includes(type))
            return res.status(400).json({error: 'type invalide.'});

        if (description.trim().length < 10)
            return res.status(400).json({error: 'La description doit contenir au moins 10 caractères.'});

        const litige = await litigeService.create(userId, {commande_ref, type, description: description.trim()});
        res.status(201).json(litige);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};
