// Récupération depuis le storage
const token = localStorage.getItem("token");
const userJSON = localStorage.getItem("user");

if (!token || !userJSON) {
    console.warn("Utilisateur non connecté");
    // Redirection possible
    // window.location.href = "../login.html";
} else {
    const user = JSON.parse(userJSON);

    console.log("=== UTILISATEUR CONNECTÉ ===");
    console.log("Token :", token);
    console.log("ID :", user.id);
    console.log("Login :", user.login);
    console.log("Nom :", user.nom);
    console.log("Prénom :", user.prenom);
    console.log("NumClub :", user.numClub);
}
