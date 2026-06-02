/** requêtes SQL liées aux utilisateurs **/

const Customer = require('../modelSequelize/customerModelSq');

exports.findByEmail = (email) => {
    return Customer.findOne({ where: { email } })
        .then(row => row ? row.get({ plain: true }) : null);
};

exports.create = ({ email, password }) => {
    return Customer.create({ email, password })
        .then(created => created.id);
};

exports.findById = (id) => {
    return Customer.findByPk(id, {
        attributes: ['id', 'email', 'nom', 'prenom', 'adresse', 'telephone', 'adresse_livraison', 'preferences_paiement', 'role', 'can_upload_partition', 'est_professeur']
    }).then(row => row ? row.get({ plain: true }) : null);
};

exports.findAll = () => {
    return Customer.findAll({
        attributes: ['id', 'email', 'nom', 'prenom', 'role', 'can_upload_partition', 'est_professeur']
    }).then(rows => rows.map(r => r.get({ plain: true })));
};

exports.updateById = (id, fields) => {
    return Customer.update(fields, { where: { id } })
        .then(([affectedRows]) => affectedRows);
};

exports.deleteById = (id) => {
    return Customer.destroy({ where: { id } })
        .then(affectedRows => affectedRows > 0);
};

exports.setVerificationCode = (id, code, expires) => {
    return Customer.update({ verification_code: code, verification_code_expires: expires }, { where: { id } });
};

exports.findByVerificationCode = (code) => {
    return Customer.findOne({ where: { verification_code: code } })
        .then(row => row ? row.get({ plain: true }) : null);
};

exports.markEmailVerified = (id) => {
    return Customer.update(
        { email_verified: 1, verification_code: null, verification_code_expires: null },
        { where: { id } }
    );
};