console.log("Script evaluateur chargé");

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    const ulAFaire = document.getElementById("listeConcoursEvaluateurAFaire");
    const ulFait = document.getElementById("listeConcoursEvaluateurFait");
    const blocEvaluateur = document.getElementById("evaluateurAffichage");
    const spanEvaluateur = document.getElementById("evaluateur");

    if (!token || !ulAFaire || !ulFait || !blocEvaluateur) return;

    fetch("/back/evaluateur.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ utilisateur: token })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Réponse evaluateur.php :", data);

        // ❌ pas évaluateur
        if (!data.success && data.error === "NOT_EVALUATEUR") {
            spanEvaluateur.textContent = "Accès refusé : vous n'êtes pas évaluateur.";
            blocEvaluateur.style.display = "none";
            return;
        }

        // ❌ autre erreur
        if (!data.success) {
            console.error("Erreur :", data.error);
            return;
        }

        // ✅ évaluateur
        blocEvaluateur.style.display = "block";
        spanEvaluateur.textContent = "Vous êtes évaluateur";

        ulAFaire.innerHTML = "";
        ulFait.innerHTML = "";

        data.concours.forEach(concours => {
            const li = document.createElement("li");
            li.classList.add("concours-item");

            // Contenu de base
            li.innerHTML = `
                <strong>${concours.theme}</strong><br>
                Du ${concours.dateDebut} au ${concours.dateFin}<br>
                État : ${concours.etat}<br>
            `;

            // 🔹 Concours à évaluer (pas encore évalué)
            if (concours.dejaEvalue == 0 && concours.etat === "en_cours") {
                li.innerHTML += `
                    <button class="btn-voir-concours"
                        onclick="window.location.href='/role/evaluateurConcoursEnCours.html?concours=${concours.numConcours}'">
                        Évaluer maintenant
                    </button>
                `;
                ulAFaire.appendChild(li);
            } 
            // 🔹 Concours déjà évalué
            else if (concours.dejaEvalue == 1 && (concours.etat === "evalue" || concours.etat === "resultat")) {
                ulFait.appendChild(li);
            } 
            // 🔹 Concours en cours mais pas encore assigné (optionnel)
            else if (concours.etat === "en_cours" && concours.etat === 'pas_commence') {
                li.innerHTML += `
                    <em>Pas encore assigné à ce concours</em>
                `;
                ulAFaire.appendChild(li);
            }
        });

        // Messages si aucune liste
        if (!ulAFaire.hasChildNodes()) {
            ulAFaire.innerHTML = "<li>Aucun concours à évaluer</li>";
        }
        if (!ulFait.hasChildNodes()) {
            ulFait.innerHTML = "<li>Aucun concours évalué</li>";
        }
    })
    .catch(err => console.error("Erreur JS :", err));
});
