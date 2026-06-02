const jwt = require('jsonwebtoken');
const orderService = require('../service/orderService');
const customerModel = require('../model/customerModel');

const STATUTS_VALIDES = ['en_traitement', 'en_transit', 'livre'];

const verifyToken = (req) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) throw new Error('Token manquant.');
    return jwt.verify(auth.slice(7), 'votre_clé_secrète');
};

exports.getAllOrders = async (req, res) => {
    try {
        const {userId} = verifyToken(req);
        const user = await customerModel.findById(userId);
        if (user?.role !== 'admin') return res.status(403).json({error: 'Accès refusé.'});
        const orders = await orderService.getAllOrders();
        res.json(orders);
    } catch (err) {
        res.status(401).json({error: err.message});
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const {userId} = verifyToken(req);
        const user = await customerModel.findById(userId);
        if (user?.role !== 'admin') return res.status(403).json({error: 'Accès refusé.'});
        const id = parseInt(req.params.id, 10);
        const {status} = req.body;
        if (!STATUTS_VALIDES.includes(status))
            return res.status(400).json({error: 'Statut invalide.'});
        const updated = await orderService.updateOrderStatus(id, status);
        if (!updated) return res.status(404).json({error: 'Commande introuvable.'});
        res.json({message: 'Statut mis à jour.'});
    } catch (err) {
        res.status(401).json({error: err.message});
    }
};

exports.createOrder = async (req, res) => {
    try {
        const {userId} = verifyToken(req);
        const order = await orderService.createOrder(userId, req.body);
        res.status(201).json(order);
    } catch (err) {
        res.status(err.message === 'Token manquant.' ? 401 : 500).json({error: err.message});
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const {userId} = verifyToken(req);
        const orders = await orderService.getUserOrders(userId);
        res.json(orders);
    } catch (err) {
        res.status(401).json({error: err.message});
    }
};
