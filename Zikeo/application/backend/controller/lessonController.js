/** communique avec le frontend pour les leçons **/

const lessonService = require('../service/lessonService');

const allowedTypes = new Set(['theory', 'instrument']);
const allowedLevels = new Set(['débutant', 'intermédiaire', 'avancé']);

function validateLessonPayload(payload) {
    if (!payload || typeof payload !== 'object') return 'Payload invalide';
    if (!payload.name || typeof payload.name !== 'string') return 'Le nom est obligatoire';
    if (!allowedTypes.has(payload.type)) return 'Le type doit être theory ou instrument';
    if (!allowedLevels.has(payload.level)) return 'Le niveau doit être débutant, intermédiaire ou avancé';
    if (payload.price === undefined || Number.isNaN(Number(payload.price))) return 'Le prix est obligatoire et doit être numérique';
    if (payload.teacher_id !== null && payload.teacher_id !== undefined && Number.isNaN(Number(payload.teacher_id))) return 'teacher_id doit être un identifiant numérique';
    if (payload.spots !== undefined && (Number.isNaN(Number(payload.spots)) || Number(payload.spots) < 0)) return 'Le nombre de places doit être un entier positif';
    return null;
}

exports.getLessons = async (req, res) => {
    try {
        const lessons = await lessonService.getAllLessons();
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getLessonById = async (req, res) => {
    try {
        const lesson = await lessonService.getLessonById(req.params.id);
        if (!lesson) return res.status(404).json({ error: 'Not found' });
        res.json(lesson);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createLesson = async (req, res) => {
    try {
        const payload = {
            name: req.body.name,
            description: req.body.description || null,
            type: req.body.type,
            level: req.body.level ?? 'débutant',
            price: Number(req.body.price),
            available: req.body.available !== undefined ? Boolean(req.body.available) : true,
            teacher_id: req.body.teacher_id ? Number(req.body.teacher_id) : null,
            salle: req.body.salle || 'local',
            spots: req.body.spots !== undefined ? Number(req.body.spots) : 0
        };

        const error = validateLessonPayload(payload);
        if (error) return res.status(400).json({ error });

        const created = await lessonService.createLesson(payload);
        res.status(201).json(created);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateLesson = async (req, res) => {
    try {
        const updated = await lessonService.updateLesson(req.params.id, req.body);
        if (!updated) return res.status(404).json({ error: 'Not found' });
        res.status(200).json(req.body);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteLesson = async (req, res) => {
    try {
        const deleted = await lessonService.deleteLesson(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
