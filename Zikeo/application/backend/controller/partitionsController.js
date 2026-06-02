const partitionsService = require('../service/partitionsService');
const customerService = require('../service/customerService');

exports.getPartitions = async (req, res) => {
    try {
        const partitions = await partitionsService.getAllPartitions();
        res.json(partitions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.uploadPartition = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({error: 'Aucun fichier envoyé'});

        const user = await customerService.findById(req.userId);
        if (!user || !user.can_upload_partition) {
            return res.status(403).json({error: 'Vous n\'êtes pas autorisé à ajouter des partitions.'});
        }

        const folder = req.file.destination.replace(/^\.\//, '');
        const fileUrl = `http://localhost:5000/${folder}/${req.file.filename}`;
        const title = req.body.title || req.file.originalname;
        const author = req.body.author || null;
        const instrument = req.body.instrument || null;
        const partition = await partitionsService.createPartition(title, fileUrl, author, instrument, req.userId);

        res.status(201).json(partition);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.deletePartition = async (req, res) => {
    try {
        const deleted = await partitionsService.deletePartition(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
