/** requêtes sur la table partitions **/

const Partition = require('../modelSequelize/partitionModelSq');
const Customer = require('../modelSequelize/customerModelSq');

Partition.belongsTo(Customer, { foreignKey: 'uploaded_by', as: 'uploader' });

exports.findAll = () => {
    return Partition.findAll({
        order: [['created_at', 'DESC']],
        include: [{
            model: Customer,
            as: 'uploader',
            attributes: ['nom', 'prenom'],
            required: false
        }]
    }).then(rows => rows.map(r => {
        const plain = r.get({ plain: true });
        return {
            ...plain,
            uploader_name: plain.uploader
                ? `${plain.uploader.prenom} ${plain.uploader.nom}`
                : null
        };
    }));
};

exports.create = (title, url, author, instrument, uploadedBy) => {
    return Partition.create({ title, url, author, instrument, uploaded_by: uploadedBy ?? null })
        .then(created => created.get({ plain: true }));
};

exports.delete = (id) => {
    return Partition.destroy({ where: { id } })
        .then(affectedRows => affectedRows > 0);
};
