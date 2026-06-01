/** communique avec le frontend **/

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const https = require('https');
const customerService = require('../service/customerService');

const RECAPTCHA_SECRET = '6LcoJQYtAAAAAC6VEa1R-O_82q08Crnx71SyqBxY'; // ← clé secrète Google reCAPTCHA

const verifyRecaptcha = (token) => new Promise((resolve, reject) => {
    const body = `secret=${RECAPTCHA_SECRET}&response=${token}`;
    const req = https.request({
        hostname: 'www.google.com',
        path: '/recaptcha/api/siteverify',
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body)},
    }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
});

exports.register = async (req, res) => {
    try {
        const {email, password, recaptchaToken} = req.body;

        if (!email || !password) {
            return res.status(400).json({error: 'Email et mot de passe requis.'});
        }

        const captcha = await verifyRecaptcha(recaptchaToken || '');
        if (!captcha.success) {
            return res.status(400).json({error: 'CAPTCHA invalide. Veuillez réessayer.'});
        }

        const existing = await customerService.findByEmail(email);
        if (existing) {
            return res.status(409).json({error: 'Cet email est déjà utilisé.'});
        }

        const hashed = await bcrypt.hash(password, 10);
        const id = await customerService.createUser({email, password: hashed});

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 60 * 60 * 1000);
        await customerService.setVerificationCode(id, code, expires);
        await customerService.sendVerificationEmail(email, code);

        res.status(201).json({message: 'Compte créé. Vérifiez votre email pour activer votre compte.', email});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await customerService.findByEmail(email);
        if (!user) {
            return res.status(401).json({error: 'Identifiants incorrects.'});
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({error: 'Identifiants incorrects.'});
        }

        if (!user.email_verified) {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const expires = new Date(Date.now() + 60 * 60 * 1000);
            await customerService.setVerificationCode(user.id, code, expires);
            await customerService.sendVerificationEmail(user.email, code);
            return res.status(403).json({
                error: 'Email non vérifié. Un code de confirmation a été envoyé.',
                requireVerification: true,
                email: user.email
            });
        }

        const userId = user.id;
        const token = jwt.sign({userId}, 'votre_clé_secrète', {expiresIn: '24h'});
        const fullUser = await customerService.findById(userId);

        res.status(200).json({
            message: 'Authentification réussie.',
            userId,
            token,
            isAdmin: fullUser.role === 'admin'
        });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const {code} = req.body;
        if (!code) return res.status(400).json({error: 'Code requis.'});
        await customerService.verifyEmailCode(code);
        res.json({message: 'Email confirmé. Vous pouvez maintenant vous connecter.'});
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

exports.bypassVerify = async (req, res) => {
    try {
        const {email} = req.body;
        if (!email) return res.status(400).json({error: 'Email requis.'});
        const user = await customerService.findByEmail(email);
        if (!user) return res.status(404).json({error: 'Compte introuvable.'});
        const token = jwt.sign({userId: user.id}, 'votre_clé_secrète', {expiresIn: '24h'});
        res.json({token, userId: user.id});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

const verifyToken = (req) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) throw new Error('Token manquant.');
    return jwt.verify(auth.slice(7), 'votre_clé_secrète');
};

exports.getProfile = async (req, res) => {
    try {
        const {userId} = verifyToken(req);
        const user = await customerService.findById(userId);
        if (!user) return res.status(404).json({error: 'Utilisateur introuvable.'});
        res.json(user);
    } catch (err) {
        res.status(401).json({error: err.message});
    }
};

const requireAdmin = async (req, res, next) => {
    try {
        const {userId} = verifyToken(req);
        const user = await customerService.findById(userId);
        if (!user || user.role !== 'admin') return res.status(403).json({error: 'Accès refusé.'});
        req.userId = userId;
        next();
    } catch (err) {
        res.status(401).json({error: err.message});
    }
};
exports.requireAdmin = requireAdmin;

exports.getAllUsers = async (req, res) => {
    try {
        const users = await customerService.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const deleted = await customerService.deleteUser(id);
        if (!deleted) return res.status(404).json({error: 'Utilisateur introuvable.'});
        res.json({message: 'Utilisateur supprimé.'});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.updateRole = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const {role} = req.body;
        if (role !== 'user' && role !== 'admin') return res.status(400).json({error: "Rôle invalide. Valeurs acceptées : 'user', 'admin'."});
        await customerService.updateUser(id, {role});
        res.json({message: 'Rôle mis à jour.'});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const {userId} = verifyToken(req);
        const {nom, prenom, email, adresse, telephone, adresse_livraison, preferences_paiement, password} = req.body;

        const fields = {};
        if (nom !== undefined) fields.nom = nom;
        if (prenom !== undefined) fields.prenom = prenom;
        if (email !== undefined) fields.email = email;
        if (adresse !== undefined) fields.adresse = adresse;
        if (telephone !== undefined) fields.telephone = telephone;
        if (adresse_livraison !== undefined) fields.adresse_livraison = adresse_livraison;
        if (preferences_paiement !== undefined) fields.preferences_paiement = preferences_paiement;
        if (password) fields.password = await bcrypt.hash(password, 10);

        if (Object.keys(fields).length === 0) {
            return res.status(400).json({error: 'Aucune donnée à mettre à jour.'});
        }

        await customerService.updateUser(userId, fields);
        res.json({message: 'Profil mis à jour.'});
    } catch (err) {
        res.status(401).json({error: err.message});
    }
};
