const coverService = require('../service/coverService');

exports.uploadCover = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({error: 'Aucun fichier envoyé'});
        }

        const folder = req.file.destination.replace(/^\.\//, '');
        const fileUrl = `http://localhost:5000/${folder}/${req.file.filename}`;
        const result = await coverService.uploadCover(req.body.vetementId, fileUrl);

        res.status(200).json({fileUrl, success: result});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.deleteCover = async (req, res) => {
    try {
        const deleted = await coverService.deleteCover(req.params.id);
        if (!deleted) return res.status(404).json({error: 'Image introuvable'});
        res.status(204).send();
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};
