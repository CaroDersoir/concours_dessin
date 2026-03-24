console.log("Script selectConcoursNonInscrit.js chargé");

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const select = document.getElementById("concours");

    if (!select) return;

    fetch("/back/concoursPasInscrit.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({ utilisateur: token })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.success) {
            console.error(data.error);
            return;
        }

        if (data.concours.length === 0) {
            const option = document.createElement("option");
            option.textContent = "Aucun concours disponible";
            option.disabled = true;
            select.appendChild(option);
            return;
        }

        data.concours.forEach(concours => {
            const option = document.createElement("option");
            option.value = concours.numConcours;
            option.textContent =
                `${concours.theme} (du ${concours.dateDebut} au ${concours.dateFin})`;
            select.appendChild(option);
        });
    })
    .catch(err => console.error("Erreur JS :", err));
});


document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-inscription");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Utilisateur non connecté !");
            return;
        }

        const formData = new FormData(form);
        formData.append("token", token); // on envoie le token pour identifier l'utilisateur

        try {
            const response = await fetch("/back/concoursDemandeInscription.php", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                alert("Inscription enregistrée avec succès ! Statut : en attente");
                form.reset();
            } else {
                alert("Erreur : " + result.message);
            }
        } catch (err) {
            console.error("Erreur JS :", err);
            alert("Erreur serveur !");
        }
    });
});
