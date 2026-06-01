/** fait le lien entre controller et model **/

require('dotenv').config();
const nodemailer = require('nodemailer');
const customerModel = require('../model/customerModel');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

exports.findByEmail = async (email) => {
    return customerModel.findByEmail(email);
};

exports.createUser = async ({email, password}) => {
    return customerModel.create({email, password});
};

exports.findById = async (id) => {
    return customerModel.findById(id);
};

exports.updateUser = async (id, fields) => {
    return customerModel.updateById(id, fields);
};

exports.getAllUsers = async () => {
    return customerModel.findAll();
};

exports.deleteUser = async (id) => {
    return customerModel.deleteById(id);
};

exports.setVerificationCode = async (id, code, expires) => {
    return customerModel.setVerificationCode(id, code, expires);
};

exports.sendVerificationEmail = async (email, code) => {
    const link = `http://localhost:3000/verify-email?code=${code}`;
    await transporter.sendMail({
        from: `"Zikeo" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Confirmez votre compte Zikeo',
        html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
                <h2>Bienvenue sur Zikeo !</h2>
                <p>Votre code de confirmation est :</p>
                <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px;">${code}</p>
                <p>Ou cliquez sur ce lien pour confirmer directement :</p>
                <a href="${link}" style="background:#1976d2;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none;">Confirmer mon email</a>
                <p style="margin-top:16px;color:#888;font-size:12px;">Ce code expire dans 1 heure.</p>
            </div>
        `
    });
};

exports.verifyEmailCode = async (code) => {
    const user = await customerModel.findByVerificationCode(code);
    if (!user) throw new Error('Code invalide.');
    if (new Date() > new Date(user.verification_code_expires)) throw new Error('Code expiré. Veuillez vous réinscrire.');
    await customerModel.markEmailVerified(user.id);
    return user;
};
