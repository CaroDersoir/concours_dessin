# Architecture du projet

## Architecture générale

### Front-end

```text
React Component
      ↓
Service API (Axios)
      ↓
Backend Express
      ↓
Database
```

#### `.env`

* Contient les variables d'environnement stockées localement.
* Centralise la configuration sensible (URL API, clés, etc.).
* Le token d'authentification est automatiquement ajouté aux en-têtes HTTP des requêtes Axios afin d'identifier
  l'utilisateur sans stocker de session côté serveur.

#### `api.js`

* Crée une instance Axios réutilisable pour communiquer avec le backend.
* Configure automatiquement les en-têtes HTTP communs.
* Gère l'authentification avant l'envoi des requêtes.
* Évite la duplication du code de requêtes HTTP.

#### `servicesFront/`

* Centralise les appels API liés aux différents domaines métiers.
* Encapsule les opérations CRUD, les uploads et les traitements spécifiques.
* Utilise l'instance Axios commune pour bénéficier de la configuration et de l'authentification automatiques.

#### `public/index.html`

* Page HTML de base dans laquelle React injecte l'application.
* Contient la configuration générale du site (favicon, responsive, métadonnées, etc.).
* Permet l'ajout de scripts externes (Google APIs, reCAPTCHA, etc.).

#### `public/manifest.json`

* Décrit l'application pour les navigateurs et appareils mobiles.
* Utilisé notamment pour les fonctionnalités PWA (Progressive Web App).

#### `index.js`

* Point d'entrée principal de l'application React.
* Monte l'application dans le DOM.
* Initialise les providers globaux (Router, Context API, internationalisation, etc.).
* Configure les routes et la navigation entre les pages.

---

### Back-end

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Model
  ↓
Database
```

#### `.env`

* Contient les variables d'environnement stockées localement.
* Stocke les informations sensibles (connexion base de données, clés API, etc.).

#### `routes/index.js`

* Centralise l'ensemble des routes de l'API.
* Associe les différents modules métier à leurs endpoints respectifs.

#### `routes/xxxRoutes.js`

* Définit les endpoints API.
* Associe chaque route à une méthode du contrôleur.

#### `controllers/`

* Reçoit les requêtes HTTP.
* Récupère les paramètres envoyés par le client.
* Fait le lien entre les routes et la logique métier.

#### `services/`

* Contient la logique métier de l'application.
* Applique les règles de gestion.
* Réalise les calculs et traitements complexes.
* Communique avec les modèles.

#### `models/`

* Interagit avec les modèles Sequelize.
* Exécute les opérations de lecture et d'écriture via l'ORM.
* Retourne des données exploitables par les services.

#### `modelsSequelize/`

* Définit les tables, colonnes et relations de la base de données à l'aide de Sequelize.

#### `middlewares/`

* Exécute des traitements avant ou après les requêtes.
* Exemples : authentification, validation, gestion des fichiers, sélection du dossier de stockage.

#### `config/db.js`

* Gère la connexion à la base de données.

#### `sequelizeConfig/`

* Contient la configuration de Sequelize.
* Paramètre la connexion à l'ORM et son comportement.

#### `node_modules/`

* Contient l'ensemble des dépendances du projet installées via npm.

---

## Flux complet d'une requête

```text
[ React Component ]
          ↓
[ Service Front ]
          ↓
[ Axios (api.js) ]
          ↓
[ Route Express ]
          ↓
[ Controller ]
          ↓
[ Service ]
          ↓
[ Model ]
          ↓
[ Sequelize ]
          ↓
[ Database ]
```
