document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('inscriptionForm');
    const password = document.getElementById('password');
    const confirm_password = document.getElementById('confirm_password');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // bloque l'envoi normal du formulaire

        if (password.value !== confirm_password.value) {
            alert("Les mots de passe ne correspondent pas !");
            return;
        }

        // Préparer les données
        const formData = new FormData(form);

        // Envoyer en POST via fetch
        fetch('/back/inscription.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Inscription réussie !");
                window.location.href = "/accueil.html"; // redirection après succès
            } else {
                alert("Erreur : " + data.error);
            }
        })
        .catch(err => {
            console.error(err);
            alert("Une erreur est survenue côté serveur.");
        });
    });
});
