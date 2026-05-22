console.log("=== concoursEnCours.js chargé ===");

document.addEventListener("DOMContentLoaded", () => {

    const ul = document.getElementById("concours-actuels");

    fetch("/back/concoursEnCours.php")
        .then(res => res.json())
        .then(data => {

            if (!data.success) {
                console.error("Erreur API concours :", data.error);
                ul.innerHTML = "<li>Erreur de chargement</li>";
                return;
            }

            if (data.concours.length === 0) {
                ul.innerHTML = "<li>Aucun concours en cours</li>";
                return;
            }

            data.concours.forEach(concours => {
                const li = document.createElement("li");
                li.textContent = `${concours.theme} (du ${concours.dateDebut} au ${concours.dateFin})`;
                ul.appendChild(li);
            });
        })
        .catch(err => {
            console.error("Erreur fetch :", err);
            ul.innerHTML = "<li>Erreur serveur</li>";
        });
});