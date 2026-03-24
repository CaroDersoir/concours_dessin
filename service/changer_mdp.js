document.addEventListener("DOMContentLoaded", () => {

    // ======== Récupération des éléments ========
    const modal = document.getElementById("pwdModal");
    const openBtn = document.getElementById("changePwdBtn");
    const closeBtn = document.querySelector(".modal .close");
    const form = document.getElementById("pwdForm");
    const msg = document.getElementById("pwdMsg");

    // Sécurité : si un élément manque
    if (!modal || !openBtn || !closeBtn || !form || !msg) {
        console.error("❌ Élément DOM manquant pour le changement de mot de passe");
        return;
    }

    // ======== Ouvrir la modal ========
    openBtn.addEventListener("click", () => {
        modal.style.display = "block";
        msg.textContent = "";
        msg.style.color = "red";
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

    // ======== Soumission du formulaire ========
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const oldPwd = document.getElementById("oldPwd").value;
        const newPwd = document.getElementById("newPwd").value;
        const confirmPwd = document.getElementById("confirmPwd").value;

        if (newPwd !== confirmPwd) {
            msg.textContent = "Les nouveaux mots de passe ne correspondent pas !";
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            msg.textContent = "Utilisateur non connecté.";
            return;
        }

        const formData = new FormData();
        formData.append("token", token);
        formData.append("oldPwd", oldPwd);
        formData.append("newPwd", newPwd);

        try {
            const response = await fetch("/back/changePassword.php", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                msg.style.color = "green";
                msg.textContent = "Mot de passe changé avec succès !";

                setTimeout(() => {
                    modal.style.display = "none";
                    msg.style.color = "red";
                }, 1500);
            } else {
                msg.textContent = data.error;
            }

        } catch (err) {
            console.error(err);
            msg.textContent = "Erreur serveur.";
        }
    });
});
