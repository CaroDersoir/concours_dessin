/** démarre le serveur **/

require('dotenv').config();
const http = require('http');
const app = require('./app');
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const sequelize = require('./config/sequelizeConfig');
const Item = require('./modelSequelize/itemModelSq');

console.log('voila du code')

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});


// Synchronisation des modèles avec la base de données
sequelize.sync()
    .then(() => {
        console.log('Base de données synchronisée avec succès.');
    })
    .catch(error => {
        console.error('Erreur lors de la synchronisation de la base de données :', error);
    });