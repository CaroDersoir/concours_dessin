// login.js

const form = document.getElementById("loginForm");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const utilisateur = document.getElementById("utilisateur").value;
    const password = document.getElementById("password").value;

    // Création des données à envoyer
    const formData = new FormData();
    formData.append("utilisateur", utilisateur);
    formData.append("password", password);

    fetch("/back/recup_log.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        //console.log("Réponse complète du serveur :", data);

        if (data.success) {
            alert("Connexion réussie !");
            // Stockage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            console.log("Utilisateur stocké :", data.user);

            window.location.href = "/acceuil.html";

        } else {
            alert("Utilisateur ou mot de passe incorrect");
        }
    })
    .catch(error => {
        console.error("Erreur :", error);
        alert("Erreur serveur");
    });
});
