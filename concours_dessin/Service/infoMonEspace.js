console.log("=== infoMonEspace.js chargé ===");

document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("Utilisateur non connecté");
        // window.location.href = "/login.html";
        return;
    }

    fetch('/back/infoUtilisateur.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            utilisateur: token
        })
    })
    .then(res => res.json())
    .then(data_info => {
        if (!data_info.success) {
            console.error("Erreur API :", data_info.error);
            return;
        }

        const user = data_info.user;

        document.getElementById('mail').textContent    = user.login + "@exemple.com";
        document.getElementById('login').textContent   = user.login;
        document.getElementById('nom').textContent     = user.nom;
        document.getElementById('prenom').textContent  = user.prenom ?? '';
        document.getElementById('adresse').textContent = user.adresse ?? 'Adresse non renseignée';
        document.getElementById('numClub').textContent = user.numClub;
    })
    .catch(err => {
        console.error("Erreur fetch :", err);
    });
});
