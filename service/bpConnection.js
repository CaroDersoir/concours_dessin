// BP_connection.js

document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("loginBtn");

    if (!loginBtn) return;

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
        // UTILISATEUR CONNECTÉ
        loginBtn.textContent = "Se déconnecter";

        loginBtn.addEventListener("click", () => {
            // Suppression des infos utilisateur
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Optionnel : message
            alert("Vous êtes déconnecté");

            // Redirection
            window.location.href = "/acceuil.html";
        });

    } else {
        // UTILISATEUR NON CONNECTÉ
        loginBtn.textContent = "Se connecter";

        loginBtn.addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }
});

