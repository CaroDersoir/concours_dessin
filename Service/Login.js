// login.js

// On récupère le formulaire
const form = document.getElementById("loginForm");

// On écoute l'événement submit
form.addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    // Récupère les valeurs
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Pour l'instant, on affiche les infos dans une alert
    alert(`Email: ${email}\nMot de passe: ${password}`);

    // Ici tu peux ajouter la logique réelle, par ex. envoyer les infos au serveur
});
