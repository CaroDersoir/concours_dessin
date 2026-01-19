document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('inscriptionForm');
    const password = document.getElementById('password');
    const confirm_password = document.getElementById('confirm_password');

    form.addEventListener('submit', function(event) {
        // Vérification du mot de passe
        if (password.value !== confirm_password.value) {
            alert("Les mots de passe ne correspondent pas !");
            event.preventDefault(); // empêche l'envoi du formulaire
            return;
        }
        else {
            alert("Inscription réussie !");
            window.location.href = "/acceuil.html";
        }
        
    });
});
