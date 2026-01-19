console.log("=== infoMonEspace.js chargé ===");

document.addEventListener("DOMContentLoaded", () => {


    const token = localStorage.getItem("token");
    const userJSON = localStorage.getItem("user");


    if (!token || !userJSON) {
        console.warn("Utilisateur non connecté");
        // Redirection possible
        // window.location.href = "/login.html";
        return;
    }

    const user = JSON.parse(userJSON);
    console.log("Utilisateur parsé :", user);

    // 🔹 Injection dans le HTML
    document.getElementById('mail').textContent   = user.login + "@exemple.com"; // ou user.email
    document.getElementById('login').textContent  = user.login;
    document.getElementById('nom').textContent    = user.nom;
    document.getElementById('prenom').textContent = user.prenom;
    document.getElementById('numClub').textContent = user.numClub;
});
