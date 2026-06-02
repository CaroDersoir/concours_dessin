/** gestion des tailles par article **/

const itemSizeService = require('../service/itemSizeService');

exports.getSizes = async (req, res) => {
    try {
        const sizes = await itemSizeService.getSizesByItemId(req.params.itemId);
        res.json(sizes);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.setSizes = async (req, res) => {
    try {
        const {sizes} = req.body;
        if (!Array.isArray(sizes)) return res.status(400).json({error: 'sizes doit être un tableau'});
        const result = await itemSizeService.setSizes(req.params.itemId, sizes);
        res.json(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};
