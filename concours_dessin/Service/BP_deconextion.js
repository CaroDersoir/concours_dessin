// JS/logout.js

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {

        // repasse en non connecté
        localStorage.setItem("role", "0");

        // optionnel : nettoyer d'autres données
        // localStorage.clear();

        // redirection
        window.location.href = "../Acceuil.html";
    });
}
