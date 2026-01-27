document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".sidebar-president a");
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
            // =========================
            // Section statistiques
            // =========================
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
            // =========================
            // Section resultats
            // =========================
            if (section === "resultats") {
                try {

                    // On réutilise EXACTEMENT le même appel que pour l'admin/directeur
                    const res = await fetch('/back/administrateurStatistique.php');
                    const result = await res.json();

                    if (result.success) {
                        const d = result.data;
                        document.getElementById('enCours').textContent = d.concoursEnCours;
                        document.getElementById('finis').textContent = d.concoursFini;
                        document.getElementById('participants').textContent = d.participants;
                        document.getElementById('dessins').textContent = d.dessins;

                        const list = document.getElementById('clubs');
                        list.innerHTML = d.clubs.map(c =>
                            `<li><strong>${c.nomClub}</strong> - ${c.departement}</li>`
                        ).join('');
                    }
                } catch (err) {
                    console.error("Erreur president :", err);
                }
            }
        } catch (err) {
            main.innerHTML = `<p>Erreur : ${err}</p>`;
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
