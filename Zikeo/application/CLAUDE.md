# Projet

Site pour un projet scolaire. Il sera utilisé par des étudiants pour la gestion du club de musique.
Sur ce site, ils r acheter du merch, avoir accès aux partitions, aux différentes formations musicales proposées,
au
planning du local, et pouvoir réserver du matériel.

L'objectif est de faire un code simple et clair.

## Stack

- **Frontend** : React 18+, JavaScript (ES2022+)
- **Routing** : React Router v6
- **Build** : Vite
- **Backend** : Node.js, Express, MySQL

## Conventions de code

- une page simple qui organisera les différents composants, dont le header et le footer
- écrire un commentaire au début du fichier qui explicite son rôle

## Structure du projet

```
backend/
    src/
        config/      # connexion à la base de données
        controller/  # reçoit les requêtes HTTP et appelle le service
        documents/        # documents qui seront téléchargés depuis le site par l'admin, et ensuite mis à disposition sur le site
        images/        # images qui seront téléchargées depuis le site par l'admin, et ensuite affichées sur le site
        middleware/     # traitements avant requêtes
        migrations/        # requêtes SQL 
        model/     # requêtes sql / requêtes directement branchées à la bdd
        routes/  # chemins HTTP appelés par le front pour envoyer des fichiers
        service/    # appelle le model avec règles métiers
        
Frontend
  ↓
Routes
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Model

```

```
frontend/
    src/
      assets/      # image pour l'affichage fixe 
      components/   # Composants réutilisables par les pages
      pages/        # Vues / routes
      context/        # CE qui est partagé sur l'ensemble des pages
      services/     # Appels API côté front
```

## Commandes utiles

```bash
npm start # démarrer le front
nodemon start # démarrer le back
```

## Comportement attendu de l'agent

- Toujours planifier avant d'implémenter une feature complexe
- Ne pas installer de nouvelles dépendances sans validation explicite
- Ne pas demander validation pour modification css
- En cas de doute sur l'architecture, demander avant d'agir
- Respecter les nommages précédents, en copiant la logique dans les nouvelles variables ou noms de fichiers.