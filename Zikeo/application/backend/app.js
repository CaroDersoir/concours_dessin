/** config l'application (express) **/

//on importe le framwork express
const express = require('express');
//middleware pour permet d'autoriser les requêtes vers un autre domaine, ce qui est par défaut interdit pour des raisons de sécurité
const cors = require('cors');
// express() est une fonction qui crée une instance de l’application Express. Cette instance app sera notre application express
const app = express();


// activer CORS pour permettre les requêtes depuis le frontend (React) vers le backend (Node.js) sans problèmes de politique de même origine.
app.use(cors());
app.use(express.json());

// routes
// const itemsRoutes = require('./routes/itemsRoutes');
// app.use('/api/items', itemsRoutes);

app.use('/api', require('./routes'));
app.use('/images', express.static('images'));
app.use('/documents', express.static('documents'));
app.use('/others', express.static('others'));

//middleware pour lire te transformer le corps des requêtes http
// const bodyParser = require('body-parser'); → intégré dans express ajrd


//on va exporter app pour qu'on puisse y accéder depuis les autres fichiers du projet, notamment notre serveur Node
module.exports = app;

