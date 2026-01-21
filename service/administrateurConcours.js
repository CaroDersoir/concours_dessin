console.log("=== concoursEnCours.js chargé ===");

document.addEventListener("DOMContentLoaded", () => {

    const ulEnCours = document.getElementById("concours-actuels");
    const ulPasses = document.getElementById("concours-passes");

    ulEnCours.innerHTML = "";
    ulPasses.innerHTML = "";

    fetch("/back/administrateurConcours.php")
        .then(res => res.json())
        .then(data => {

            if (!data.success) {
                console.error("Erreur API concours :", data.error);
                ulEnCours.innerHTML = "<li>Erreur de chargement</li>";
                ulPasses.innerHTML = "<li>Erreur de chargement</li>";
                return;
            }

            if (data.concours.length === 0) {
                ulEnCours.innerHTML = "<li>Aucun concours</li>";
                ulPasses.innerHTML = "<li>Aucun concours</li>";
                return;
            }

            let hasEnCours = false;
            let hasPasses = false;

            data.concours.forEach(concours => {
                const li = document.createElement("li");
                li.textContent =
                    `${concours.theme} (du ${concours.dateDebut} au ${concours.dateFin})`;

                if (concours.etat === "en_cours" || concours.etat === "attente") {
                    ulEnCours.appendChild(li);
                    hasEnCours = true;
                }

                if (concours.etat === "resultat" || concours.etat === "evalue") {
                    ulPasses.appendChild(li);
                    hasPasses = true;
                }
            });

            if (!hasEnCours) {
                ulEnCours.innerHTML = "<li>Aucun concours en cours</li>";
            }

            if (!hasPasses) {
                ulPasses.innerHTML = "<li>Aucun concours passé</li>";
            }
        })
        .catch(err => {
            console.error("Erreur fetch :", err);
            ulEnCours.innerHTML = "<li>Erreur serveur</li>";
            ulPasses.innerHTML = "<li>Erreur serveur</li>";
        });
});
