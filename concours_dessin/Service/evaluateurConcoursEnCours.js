console.log("Script evaluateurConcoursEnCours.js chargé");

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const urlParams = new URLSearchParams(window.location.search);
    const numConcours = urlParams.get("concours");

    const themeSpan = document.getElementById("theme");
    const dateDebutSpan = document.getElementById("dateDebut");
    const dateFinSpan = document.getElementById("dateFin");
    const etatSpan = document.getElementById("etat");

    const dessinsContainer = document.getElementById("dessins-evaluateur");

    if (!token || !numConcours) return;

    fetch("/back/evaluateurConcoursEnCours.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ utilisateur: token, concours: numConcours })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Données reçues :", data);
        if (!data.success) {
            console.error("Erreur :", data.error);
            return;
        }

        // Afficher les infos du concours
        themeSpan.textContent = data.concours.theme;
        dateDebutSpan.textContent = data.concours.dateDebut;
        dateFinSpan.textContent = data.concours.dateFin;
        etatSpan.textContent = data.concours.etat;

        dessinsContainer.innerHTML = "";

        data.dessins.forEach(d => {
            const div = document.createElement("div");
            div.classList.add("dessin-item");

            div.innerHTML = `
                <p><strong>Commentaire du participant :</strong> ${d.commentaire}</p>
                <img src="${d.leDessin}" alt="dessin" style="max-width:200px; display:block; margin-bottom:5px;">
                <label>
                    Note sur 20 :
                    <input type="number" min="0" max="20" name="note" data-dessin="${d.numDessin}" value="${d.note || ''}">
                </label>
                <button class="btn-submit-note" data-dessin="${d.numDessin}">Soumettre la note</button>
                <p class="message" style="color:green;"></p>
            `;

            dessinsContainer.appendChild(div);
        });

        // Ajouter les événements pour chaque bouton
        const btns = document.querySelectorAll(".btn-submit-note");
        btns.forEach(btn => {
            btn.addEventListener("click", () => {
                const numDessin = btn.dataset.dessin;
                const input = document.querySelector(`input[data-dessin="${numDessin}"]`);
                const note = input.value;

                if (note === "") {
                    alert("Veuillez entrer une note.");
                    return;
                }

                fetch("/back/submitNote.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({ utilisateur: token, numDessin: numDessin, note: note })
                })
                .then(res => res.json())
                .then(resData => {
                    if (!resData.success) {
                        alert("Erreur : " + resData.error);
                        return;
                    }
                    const message = btn.nextElementSibling;
                    message.textContent = "Note enregistrée !";
                })
                .catch(err => console.error("Erreur JS :", err));
            });
        });

    })
    .catch(err => console.error("Erreur JS :", err));
});
