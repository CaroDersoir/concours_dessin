document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".sidebar-directeur a");
    const main = document.getElementById("main-content");

    // Fonction pour charger les sections via AJAX
    const loadSection = async (section) => {
        try {
            const response = await fetch(`/serviceRole/fetchSection.php?section=${section}`);
            const html = await response.text();
            main.innerHTML = html;

            // =========================
            // Section formulaire (inscription d'un utilisateur)
            // =========================
            if (section === "formulaire") {
                const form = document.getElementById('inscriptionForm');
                if (form) {
                    form.addEventListener('submit', async (evt) => {
                        evt.preventDefault();
                        const formData = new FormData(form);

                        try {
                            const res = await fetch('/serviceRole/submitForm.php', {
                                method: 'POST',
                                body: formData
                            });
                            const text = await res.text();
                            const messageDiv = document.getElementById('formMessage');
                            if (messageDiv) messageDiv.innerHTML = text;
                            form.reset();
                        } catch (err) {
                            alert("Erreur lors de l'envoi du formulaire : " + err);
                        }
                    });
                }
            }

            // =========================
            // Section demandes (traitement des demandes)
            // =========================
            if (section === "demandes") {
                const buttons = main.querySelectorAll('.btn-demande');
                buttons.forEach((btn) => {
                    btn.addEventListener('click', async () => {
                        const id = btn.dataset.id;
                        const action = btn.dataset.action; // "accepte" ou "refuse"

                        if (!id || !action) return;

                        try {
                            const resp = await fetch('/serviceRole/traiterDemande.php', {
                                method: 'POST',
                                body: new URLSearchParams({ id, action })
                            });
                            const text = await resp.text();
                            alert(text);
                            // Recharger la section après traitement
                            loadSection('demandes');
                        } catch (err) {
                            alert("Erreur lors du traitement : " + err);
                        }
                    });
                });
            }
            if (section === "statistiques") {
                console.log("Chargement des données statistiques...");
                try {
                    const resStats = await fetch('/back/administrateurStatistique.php');
                    const result = await resStats.json();

                    if (result.success) {
                        const data = result.data;
                        // On remplit les spans direct
                        document.getElementById('enCours').textContent = data.concoursEnCours;
                        document.getElementById('finis').textContent = data.concoursFini;
                        document.getElementById('participants').textContent = data.participants;
                        document.getElementById('dessins').textContent = data.dessins;
                        document.getElementById('moyenne').textContent = data.moyenneNotes ?? 'N/A';

                        // On remplit les clubs
                        const clubsList = document.getElementById('clubs');
                        clubsList.innerHTML = '';
                        data.clubs.forEach(club => {
                            const li = document.createElement('li');
                            li.innerHTML = `<strong>${club.nomClub}</strong> (Dept: ${club.departement})<br>
                                            <small style="margin-left:20px">Tel: ${club.numTelephone || 'Non renseigné'}</small>`;
                            clubsList.appendChild(li);
                        });
                    }
                } catch (err) {
                    console.error("Erreur lors du remplissage des stats:", err);
                }
            }
            if (section === "resultats") {
                console.log("Chargement des concours du club...");
                const token = localStorage.getItem("token");

                try {
                    const response = await fetch("/back/concoursClub.php", {
                        method: "POST",
                        body: new URLSearchParams({ utilisateur: token })
                    });
                    const data = await response.json();

                    if (data.success) {
                        const ulActuels = document.getElementById("concours-actuels");
                        const ulPasses = document.getElementById("concours-passes");

                        ulActuels.innerHTML = "";
                        ulPasses.innerHTML = "";

                        data.concours.forEach(c => {
                            // On ne crée l'élément que si le club participe
                            if (c.participe_club == 1) {
                                const li = document.createElement("li");
                                li.classList.add("concours-item");
                                li.innerHTML = `
                        <strong>${c.theme}</strong><br>
                        Du ${c.dateDebut} au ${c.dateFin}<br>
                        <em>État : ${c.etat}</em><br>
                    `;

                                // Si fini -> liste de droite, sinon -> liste de gauche
                                if (c.etat === 'resultat' || c.etat === 'evalue' || new Date(c.dateFin) < new Date()) {
                                    ulPasses.appendChild(li);
                                } else {
                                    ulActuels.appendChild(li);
                                }
                            }
                        });

                        // Petit message si rien à afficher
                        if (ulActuels.innerHTML === "") ulActuels.innerHTML = "<li>Aucun concours en cours.</li>";
                        if (ulPasses.innerHTML === "") ulPasses.innerHTML = "<li>Aucun historique.</li>";
                    }
                } catch (err) {
                    console.error("Erreur chargement concours club:", err);
                }
            }

        } catch (err) {
            main.innerHTML = `<p>Erreur lors du chargement : ${err}</p>`;
        }
    };

    // =========================
    // Navigation des liens du menu
    // =========================
    links.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            loadSection(link.dataset.section);
        });
    });

    // Charge la première section par défaut
    if (links.length > 0) loadSection(links[0].dataset.section);
});
