// Fonction pour charger les statistiques depuis PHP
console.log('administrateurStatistique.js chargé');
async function loadStats() {
    try {
        const response = await fetch('/back/administrateurStatistique.php');
        const result = await response.json();

        if (!result.success) {
            console.error('Erreur serveur:', result.error);
            return;
        }

        const data = result.data;

        // Mettre à jour le HTML
        document.getElementById('enCours').textContent = data.concoursEnCours;
        document.getElementById('finis').textContent = data.concoursFini;
        document.getElementById('participants').textContent = data.participants;
        document.getElementById('dessins').textContent = data.dessins;
        document.getElementById('moyenne').textContent = data.moyenneNotes !== null ? data.moyenneNotes : 'N/A';

        // Clubs
        const clubsList = document.getElementById('clubs');
        clubsList.innerHTML = ''; // vide la liste avant ajout

        data.clubs.forEach(club => {

            // Li pour le nom
            const liNom = document.createElement('li');
            liNom.textContent = `${club.nomClub} (Département ${club.departement})`;
            clubsList.appendChild(liNom);

            // Li pour le téléphone, indenté
            if (club.numTelephone) {
                const liTel = document.createElement('li');
                liTel.textContent = `Tel: ${club.numTelephone}`;
                liTel.style.marginLeft = '20px'; // décale à droite
                liTel.style.listStyleType = 'none'; // retire le point devant
                clubsList.appendChild(liTel);
            }
        });

    } catch (error) {
        console.error('Erreur fetch:', error);
    }
}

// Appel de la fonction au chargement de la page
window.addEventListener('DOMContentLoaded', loadStats);



