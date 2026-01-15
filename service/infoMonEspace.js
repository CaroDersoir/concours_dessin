async function fetchUserInfo() {
    const tokenInput = document.getElementById('tokenInput');
    const token = tokenInput.value.trim();

    if (!token) {
        alert("Veuillez entrer un token !");
        return;
    }

    const formData = new FormData();
    formData.append('utilisateur', token);

    try {
        const response = await fetch('back/infoUtilisateur.php', {
            method: 'POST',
            body: formData
        });

        const data_info = await response.json();

        // 🔹 Affichage complet dans la console pour vérifier
        console.log("=== DATA_INFO REÇU DU PHP ===");
        console.log(data_info);

        if (data_info.success) {
            const user = data_info.user;

            // 🔹 Affichage détaillé de chaque champ pour vérification
            console.log("ID :", user.id);
            console.log("Login :", user.login);
            console.log("Nom :", user.nom);
            console.log("Prénom :", user.prenom);
            console.log("NumClub :", user.numClub);

            // Mise à jour du HTML
            document.getElementById('mail').textContent = user.login + '@exemple.com';
            document.getElementById('login').textContent = user.login;
            document.getElementById('nom').textContent = user.nom;
            document.getElementById('prenom').textContent = user.prenom;
            document.getElementById('numClub').textContent = user.numClub;
        } else {
            console.warn(`Erreur : ${data_info.error}`);
        }
    } catch (error) {
        console.error("Erreur serveur :", error);
        alert('Erreur serveur.');
    }
}

document.getElementById('fetchBtn').addEventListener('click', fetchUserInfo);
