console.log("Script concoursCompetiteur.js chargé");

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    fetch("/back/concourCompetiteur.php", {
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

        const ulActuels = document.getElementById("concours-actuels");
        const ulPasses = document.getElementById("concours-passes");
        const ulOuverts = document.getElementById("concours-ouverts");

        ulActuels.innerHTML = "";
        ulPasses.innerHTML = "";
        ulOuverts.innerHTML = "";

        data.concours.forEach(concours => {
            const li = document.createElement("li");
            li.classList.add("concours-item");

            li.innerHTML = `
                <strong>${concours.theme}</strong><br>
                Du ${concours.dateDebut} au ${concours.dateFin}<br>
                État : ${concours.etat}<br>
            `;

            // 🔹 Cas 1 : participe et pas fini
            if (concours.participe == 1 && concours.etat !== 'resultat' && concours.etat !== 'evalue') {
                li.innerHTML += `
                    <button class="btn-voir-concours"
                        onclick="window.location.href='/role/competiteurConcoursInscrit.html?concours=${concours.numConcours}'">
                        Voir le concours
                    </button>
                `;
                ulActuels.appendChild(li);
            }

            // 🔹 Cas 2 : participe et fini
            else if (concours.participe == 1) {
                li.innerHTML += `
                    <button class="btn-voir-concours"
                        onclick="window.location.href='/role/competiteurConcoursResultat.html?concours=${concours.numConcours}'">
                        Voir le concours
                    </button>
                `;
                ulPasses.appendChild(li);
            }

            // 🔹 Cas 3 : ne participe pas et concours ouvert
            else if (concours.etat === 'en_cours' || concours.etat === 'pas_commence') {
                li.innerHTML += `
                    <button class="btn-voir-concours"
                        onclick="window.location.href='/role/competiteurConcoursPasInscrit.html?concours=${concours.numConcours}'">
                        Voir le concours
                    </button>
                `;
                ulOuverts.appendChild(li);
            }
        });
    })
    .catch(err => console.error("Erreur JS :", err));
});