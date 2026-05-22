// Récupère le formulaire et le paragraphe pour le message
const form = document.getElementById('formConcours');
const message = document.getElementById('message');

// Écouteur d'événement sur le submit
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // Récupère les données du formulaire
    const formData = new FormData(form);
    console.log(formData);
    try {
        // Envoi des données au serveur PHP
        const response = await fetch('/back/administrateurCreeConcours.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if(result.success) {
            message.style.color = 'green';
            message.textContent = 'Concours créé avec succès !';
            form.reset(); // Réinitialise le formulaire
        } else {
            message.style.color = 'red';
            message.textContent = 'Erreur : ' + result.error;
        }
    } catch(err) {
        message.style.color = 'red';
        message.textContent = 'Erreur serveur : ' + err;
    }
});
