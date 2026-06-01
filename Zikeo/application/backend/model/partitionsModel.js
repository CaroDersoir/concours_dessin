/** requêtes sur la table partitions **/

const Partition = require('../modelSequelize/partitionModelSq');

exports.findAll = () => {
    return Partition.findAll({ order: [['created_at', 'DESC']] })
        .then(rows => rows.map(r => r.get({ plain: true })));
};

exports.create = (title, url) => {
    return Partition.create({ title, url })
        .then(created => created.get({ plain: true }));
};

exports.delete = (id) => {
    return Partition.destroy({ where: { id } })
        .then(affectedRows => affectedRows > 0);
};