document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const numConcours = params.get("concours");
    const token = localStorage.getItem("token"); // 🔹 récupérer le token

    fetch("/back/concoursResultat.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({ 
            numConcours,       // concours sélectionné
            utilisateur: token // 🔹 token pour identifier le compétiteur
        })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.success) {
            console.error(data.error);
            return;
        }

        // 🔹 Titre + infos concours
        document.getElementById("titre-concours").textContent =
            `Résultats – ${data.concours.theme}`;

        document.getElementById("theme").textContent = data.concours.theme;
        document.getElementById("dateDebut").textContent = data.concours.dateDebut;
        document.getElementById("dateFin").textContent = data.concours.dateFin;

        // 🔹 Dessins du compétiteur
        const container = document.getElementById("dessins-container");
        container.innerHTML = "";

        if (data.dessins.length === 0) {
            container.innerHTML = `<p><em>Aucun dessin sauvegardé</em></p>`;
            return;
        }

        data.dessins.forEach((dessin, index) => {
            const div = document.createElement("div");
            div.classList.add("dessin-card");

            div.innerHTML = `
                <h3>Dessin ${index + 1}</h3>
                <p>Moyenne : ${dessin.moyenne ?? "Non évalué"}</p>
                ${
                    dessin.image
                        ? `<img src="data:image/jpeg;base64,${dessin.image}" class="dessin-img">`
                        : `<p><em>Aucun dessin sauvegardé</em></p>`
                }
            `;

            container.appendChild(div);
        });
    })
    .catch(err => console.error("Erreur JS :", err));
});
