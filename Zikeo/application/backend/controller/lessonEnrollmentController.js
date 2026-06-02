/** communique avec le frontend pour les inscriptions aux formations (admin) **/

const jwt = require('jsonwebtoken');
const lessonEnrollmentModel = require('../model/lessonEnrollmentModel');

const verifyAdmin = (req) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) throw new Error('Token manquant.');
    const payload = jwt.verify(auth.slice(7), 'votre_clé_secrète');
    if (payload.role !== 'admin') throw new Error('Accès refusé.');
    return payload;
};

exports.getByLesson = async (req, res) => {
    try {
        verifyAdmin(req);
        const lessonId = parseInt(req.params.lessonId, 10);
        const enrollments = await lessonEnrollmentModel.findByLesson(lessonId);
        res.json(enrollments);
    } catch (err) {
        res.status(err.message === 'Token manquant.' || err.message === 'Accès refusé.' ? 401 : 500)
            .json({ error: err.message });
    }
};
