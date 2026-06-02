/** reçoit les requêtes d'évaluation et délègue à contactService **/

const contactService = require('../service/contactService');

exports.sendEvaluation = async (req, res) => {
    const {email, message} = req.body;
    if (!email || !message) {
        return res.status(400).json({error: 'Email et message requis'});
    }
    try {
        await contactService.sendEvaluation(email, message);
        res.json({success: true});
    } catch (err) {
        res.status(500).json({error: 'Erreur lors de l\'envoi'});
    }
};
