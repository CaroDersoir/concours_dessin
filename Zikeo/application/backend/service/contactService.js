/** envoi d'un email d'évaluation vers l'adresse du club **/

require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

exports.sendEvaluation = async (senderEmail, message) => {
    await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        subject: `Évaluation Zikeo — ${senderEmail}`,
        text: `De : ${senderEmail}\n\n${message}`
    });
};
