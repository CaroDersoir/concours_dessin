// Service/Nav_log.js
/*
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    const privateLinks = document.querySelectorAll(".nav-private");

    if (token && user) {
        // Utilisateur connecté → afficher liens privés
        privateLinks.forEach(link => {
            link.style.display = "inline-block";
        });


    } else {
        // Utilisateur non connecté → cacher liens privés
        privateLinks.forEach(link => {
            link.style.display = "none";
        });


    }
});
*/

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    const privateLinks = document.querySelectorAll(".nav-private");

    if (token && user) {
        // Utilisateur connecté → montrer les menus privés
        privateLinks.forEach(el => {
            el.style.display = "inline-block"; // ou "block" si div dropdown
        });
    } else {
        // Utilisateur non connecté → cacher les menus privés
        privateLinks.forEach(el => {
            el.style.display = "none";
        });
    }
});

