/** communique avec le frontend pour les séances de formations **/

const jwt = require('jsonwebtoken');
const lessonSessionService = require('../service/lessonSessionService');

const verifyToken = (req) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) throw new Error('Token manquant.');
    return jwt.verify(auth.slice(7), 'votre_clé_secrète');
};

exports.getByLesson = async (req, res) => {
    try {
        const lessonId = parseInt(req.params.lessonId, 10);
        const sessions = await lessonSessionService.getByLesson(lessonId);
        res.json(sessions);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.getMine = async (req, res) => {
    try {
        const {userId} = verifyToken(req);
        const sessions = await lessonSessionService.getForUser(userId);
        res.json(sessions);
    } catch (err) {
        res.status(401).json({error: err.message});
    }
};

exports.getAll = async (req, res) => {
    try {
        const sessions = await lessonSessionService.getAll();
        res.json(sessions);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.create = async (req, res) => {
    try {
        const {lesson_id, date, heure_debut, heure_fin} = req.body;
        if (!lesson_id || !date || !heure_debut || !heure_fin)
            return res.status(400).json({error: 'lesson_id, date, heure_debut et heure_fin sont obligatoires.'});
        const session = await lessonSessionService.create({lesson_id: Number(lesson_id), date, heure_debut, heure_fin});
        res.status(201).json(session);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.update = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const updated = await lessonSessionService.update(id, req.body);
        if (!updated) return res.status(404).json({error: 'Séance introuvable.'});
        res.json(req.body);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.delete = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const deleted = await lessonSessionService.delete(id);
        if (!deleted) return res.status(404).json({error: 'Séance introuvable.'});
        res.status(204).send();
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};
