const homeCardService = require('../service/homeCardService');

exports.getVisible = async (req, res) => {
    try {
        const cards = await homeCardService.getVisibleCards();
        res.json(cards);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.getAll = async (req, res) => {
    try {
        const cards = await homeCardService.getAllCards();
        res.json(cards);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.create = async (req, res) => {
    try {
        const {type, icon, title, subtitle, url, item_id, position, visible} = req.body;
        if (!title) return res.status(400).json({error: 'Le titre est obligatoire.'});
        if (!['link', 'news', 'item'].includes(type)) return res.status(400).json({error: 'Type invalide.'});
        const card = await homeCardService.createCard({
            type,
            icon: icon || null,
            title,
            subtitle: subtitle || null,
            url: url || null,
            item_id: item_id ? Number(item_id) : null,
            position: position !== undefined ? Number(position) : 0,
            visible: visible !== undefined ? Boolean(visible) : true
        });
        res.status(201).json(card);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.update = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const {type, icon, title, subtitle, url, item_id, position, visible} = req.body;
        const fields = {};
        if (type !== undefined) fields.type = type;
        if (icon !== undefined) fields.icon = icon;
        if (title !== undefined) fields.title = title;
        if (subtitle !== undefined) fields.subtitle = subtitle;
        if (url !== undefined) fields.url = url;
        if (item_id !== undefined) fields.item_id = item_id ? Number(item_id) : null;
        if (position !== undefined) fields.position = Number(position);
        if (visible !== undefined) fields.visible = Boolean(visible);
        const updated = await homeCardService.updateCard(id, fields);
        if (!updated) return res.status(404).json({error: 'Carte introuvable.'});
        res.json({message: 'Carte mise à jour.'});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.remove = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const deleted = await homeCardService.deleteCard(id);
        if (!deleted) return res.status(404).json({error: 'Carte introuvable.'});
        res.json({message: 'Carte supprimée.'});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};
