// to do



// ======== Mot de passe simulé ========
let currentPassword = "123456"; // mot de passe initial (simulé)

// ======== Récupération des éléments ========
const modal = document.getElementById("pwdModal");
const openBtn = document.getElementById("changePwdBtn");
const closeBtn = document.querySelector(".modal .close");
const form = document.getElementById("pwdForm");
const msg = document.getElementById("pwdMsg");

// ======== Ouvrir la modal ========
openBtn.addEventListener("click", () => {
    modal.style.display = "block";
    msg.textContent = "";
    form.reset();
});

// ======== Fermer la modal ========
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// ======== Fermer si clic en dehors ========
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// ======== Logique du formulaire ========
form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const oldPwd = document.getElementById("oldPwd").value;
    const newPwd = document.getElementById("newPwd").value;
    const confirmPwd = document.getElementById("confirmPwd").value;
    
    if (oldPwd !== currentPassword) {
        msg.textContent = "L'ancien mot de passe est incorrect !";
        return;
    }
    
    if (newPwd !== confirmPwd) {
        msg.textContent = "Les nouveaux mots de passe ne correspondent pas !";
        return;
    }
    
    // Changement du mot de passe
    currentPassword = newPwd;
    msg.style.color = "green";
    msg.textContent = "Mot de passe changé avec succès !";

    // Optionnel : fermer la modal après 1.5s
    setTimeout(() => {
        modal.style.display = "none";
        msg.style.color = "red"; // reset couleur
    }, 1500);
});
