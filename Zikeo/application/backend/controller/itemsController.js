/** communique avec le frontend **/

const itemsService = require('../service/itemsService');
const Item = require("../modelSequelize/itemModelSq");

const allowedGenders = new Set(['femme', 'homme', 'neutre']);
const allowedCategories = new Set([
    'pantalon',
    'robe',
    'tshirt',
    'chemise',
    'blouse',
    'polo',
    'pull',
    'sweat',
    'chaussures',
    'ceinture',
    'manteau'
]);

function validateItemPayload(payload) {
    if (!payload || typeof payload !== 'object') {
        return 'Payload invalide';
    }

    if (!payload.name || typeof payload.name !== 'string') {
        return 'Le nom est obligatoire';
    }

    if (payload.price === undefined || Number.isNaN(Number(payload.price))) {
        return 'Le prix est obligatoire et doit être numérique';
    }

    if (!allowedGenders.has(payload.gender)) {
        return 'Le genre doit être femme, homme ou neutre';
    }

    if (!allowedCategories.has(payload.category)) {
        return 'Catégorie invalide';
    }

    if (payload.stock === undefined || Number.isNaN(Number(payload.stock))) {
        return 'Le stock est obligatoire et doit être numérique';
    }

    return null;
}

function normalizeItemForResponse(item) {
    if (!item) return item;

    const normalizedOnSale = item.onSale !== undefined
        ? Boolean(item.onSale)
        : Boolean(Number(item.on_sale));

    return {
        ...item,
        onSale: normalizedOnSale,
        on_sale: item.on_sale !== undefined ? Number(item.on_sale) : (normalizedOnSale ? 1 : 0)
    };
}


exports.getItems = async (req, res) => {
    try {
        const items = await itemsService.getAllItems();
        res.json(items.map(normalizeItemForResponse));
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};


exports.getItemById = async (req, res) => {
    try {
        const item = await itemsService.getItemById(req.params.id);

        if (!item) {
            return res.status(404).json({error: 'Not found'});
        }

        res.json(normalizeItemForResponse(item));
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.createItem = async (req, res) => {
    try {
        const {cover, on_sale, ...rest} = req.body;
        const payload = {
            ...rest,
            price: Number(req.body.price),
            stock: Number(req.body.stock),
            comfort: req.body.comfort !== undefined ? Number(req.body.comfort) : null,
            onSale: req.body.onSale !== undefined ? Boolean(req.body.onSale) : Boolean(req.body.on_sale),
            gender: req.body.gender ?? 'neutre',
            category: req.body.category ?? 't-shirt'
        };

        const validationError = validateItemPayload(payload);
        if (validationError) {
            return res.status(400).json({error: validationError});
        }

        const created = await itemsService.createItem(payload);
        res.status(201).json(normalizeItemForResponse(created));
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.updateItem = async (req, res) => {
    try {
        const updated = await itemsService.updateItem(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({error: 'Aucun vêtement trouvé avec cet ID'});
        }
        res.status(200).json(req.body);
    } catch (err) {
        res.status(500).json({error: 'Erreur serveur lors de la requête UPDATE.'})
    }
}

//
// exports.updateItem = async (req, res) => {
//     try {
//         const { cover, on_sale, ...rest } = req.body;
//         const payload = {
//             ...rest,
//             price: Number(req.body.price),
//             stock: Number(req.body.stock),
//             comfort: req.body.comfort !== undefined ? Number(req.body.comfort) : null,
//             onSale: req.body.onSale !== undefined ? Boolean(req.body.onSale) : Boolean(req.body.on_sale),
//             gender: req.body.gender ?? 'neutre',
//             category: req.body.category ?? 't-shirt'
//         };
//
//         const validationError = validateItemPayload(payload);
//         if (validationError) {
//             return res.status(400).json({error: validationError});
//         }
//
//         const updated = await itemsService.updateItem(req.params.id, payload);
//
//         if (!updated) {
//             return res.status(404).json({error: 'Not found'});
//         }
//
//         res.json({message: 'Item mis à jour'});
//     } catch (err) {
//         res.status(500).json({error: err.message});
//     }
// };

exports.updateItemStock = async (req, res) => {
    try {
        const stock = Number(req.body.stock);
        if (Number.isNaN(stock)) {
            return res.status(400).json({error: 'Stock invalide'});
        }

        const updated = await itemsService.updateItemStock(req.params.id, stock);

        if (!updated) {
            return res.status(404).json({error: 'Not found'});
        }

        res.json({message: 'Stock mis à jour'});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const deleted = await itemsService.deleteItem(req.params.id);

        if (!deleted) {
            return res.status(404).json({error: 'Not found'});
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

