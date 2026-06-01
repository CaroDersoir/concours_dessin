/** communique avec le frontend pour les promotions **/

const promotionService = require('../service/promotionService');

function validatePromotionPayload(payload) {
    if (!payload || typeof payload !== 'object') return 'Payload invalide';
    if (!payload.name || typeof payload.name !== 'string') return 'Le nom est obligatoire';
    if (!payload.code || typeof payload.code !== 'string') return 'Le code est obligatoire';
    if (payload.discount_percent === undefined || Number.isNaN(Number(payload.discount_percent))) {
        return 'La réduction est obligatoire et doit être numérique';
    }
    if (Number(payload.discount_percent) <= 0 || Number(payload.discount_percent) > 100) {
        return 'La réduction doit être comprise entre 1 et 100';
    }
    if (!payload.start_date) return 'La date de début est obligatoire';
    if (!payload.end_date) return 'La date de fin est obligatoire';
    if (new Date(payload.start_date) > new Date(payload.end_date)) {
        return 'La date de début doit être antérieure à la date de fin';
    }
    return null;
}

exports.getPromotions = async (req, res) => {
    try {
        const promotions = await promotionService.getAllPromotions();
        res.json(promotions);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.getPromotionById = async (req, res) => {
    try {
        const promotion = await promotionService.getPromotionById(req.params.id);
        if (!promotion) return res.status(404).json({error: 'Promotion introuvable'});
        res.json(promotion);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.validateCode = async (req, res) => {
    try {
        const {code} = req.params;
        const promotion = await promotionService.getPromotionByCode(code.toUpperCase());

        if (!promotion) {
            return res.status(404).json({valid: false, error: 'Code invalide'});
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const start = new Date(promotion.start_date);
        const end = new Date(promotion.end_date);

        if (today < start || today > end) {
            return res.status(400).json({valid: false, error: 'Ce code n\'est plus valide'});
        }

        res.json({valid: true, promotion});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.createPromotion = async (req, res) => {
    try {
        const payload = {
            ...req.body,
            code: (req.body.code || '').toUpperCase(),
            discount_percent: Number(req.body.discount_percent)
        };

        const validationError = validatePromotionPayload(payload);
        if (validationError) return res.status(400).json({error: validationError});

        const created = await promotionService.createPromotion(payload);
        res.status(201).json(created);
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({error: 'Ce code est déjà utilisé'});
        }
        res.status(500).json({error: err.message});
    }
};

exports.updatePromotion = async (req, res) => {
    try {
        const payload = {
            ...req.body,
            code: req.body.code ? req.body.code.toUpperCase() : undefined,
            discount_percent: Number(req.body.discount_percent)
        };

        const validationError = validatePromotionPayload(payload);
        if (validationError) return res.status(400).json({error: validationError});

        const updated = await promotionService.updatePromotion(req.params.id, payload);
        if (!updated) return res.status(404).json({error: 'Promotion introuvable'});
        res.json({message: 'Promotion mise à jour'});
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({error: 'Ce code est déjà utilisé'});
        }
        res.status(500).json({error: err.message});
    }
};

exports.deletePromotion = async (req, res) => {
    try {
        const deleted = await promotionService.deletePromotion(req.params.id);
        if (!deleted) return res.status(404).json({error: 'Promotion introuvable'});
        res.status(204).send();
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};
