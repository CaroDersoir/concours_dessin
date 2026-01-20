/*document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const numConcours = params.get("concours");
    const token = localStorage.getItem("token");

    document.getElementById("numConcours").value = numConcours;

    fetch("/back/concoursDetail.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            numConcours,
            utilisateur: token
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        if (!data.success) return;
        
        // Infos concours
        document.getElementById("titre-concours").textContent = data.concours.theme;
        document.getElementById("theme").textContent = data.concours.theme;
        document.getElementById("dateDebut").textContent = data.concours.dateDebut;
        document.getElementById("dateFin").textContent = data.concours.dateFin;
        document.getElementById("etat").textContent = data.concours.etat;

        // Dessins existants
        const container = document.getElementById("dessins-container");
        container.innerHTML = "";

        if (data.dessins.length === 0) {
            container.innerHTML = "<p><em>Aucun dessin enregistré</em></p>";
        }

        data.dessins.forEach((dessin, i) => {
            const div = document.createElement("div");
            div.classList.add("dessin-card");

            div.innerHTML = `
                <h4>Dessin ${i + 1}</h4>
                <p>Moyenne : ${dessin.moyenne ?? "Non évalué"}</p>
                ${
                    dessin.image
                        ? `<img src="data:image/jpeg;base64,${dessin.image}" class="dessin-img">`
                        : `<em>Aucune image</em>`
                }
            `;
            container.appendChild(div);
        });
    });

    // Upload dessin
    document.getElementById("form-dessin").addEventListener("submit", e => {
        e.preventDefault();

        const formData = new FormData(e.target);
        formData.append("utilisateur", token);

        fetch("/back/concoursImage.php", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                location.reload();
            } else {
                alert("Erreur lors de l'envoi");
            }
        });
    });
});
*/

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const numConcours = params.get("concours");
    const token = localStorage.getItem("token");

    // champ caché pour l'upload
    document.getElementById("numConcours").value = numConcours;

    /* ============================
       🔹 DÉTAIL DU CONCOURS
    ============================ */
    fetch("/back/concoursDetail.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            numConcours: numConcours,
            utilisateur: token
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log("DETAIL CONCOURS :", data);
        if (!data.success) return;

        // Infos concours
        document.getElementById("titre-concours").textContent =
            `Concours – ${data.concours.theme}`;
        document.getElementById("theme").textContent = data.concours.theme;
        document.getElementById("dateDebut").textContent = data.concours.dateDebut;
        document.getElementById("dateFin").textContent = data.concours.dateFin;
        document.getElementById("etat").textContent = data.concours.etat;

        const container = document.getElementById("dessins-container");
        container.innerHTML = "";

        if (data.dessins.length === 0) {
            container.innerHTML = "<p><em>Aucun dessin enregistré</em></p>";
            return;
        }

        /* ============================
           🔹 AFFICHAGE DES DESSINS
        ============================ */
        data.dessins.forEach((dessin, index) => {
            const div = document.createElement("div");
            div.classList.add("dessin-card");

            div.innerHTML = `
                <h4>Dessin ${index + 1}</h4>
                <p>Moyenne : ${dessin.moyenne ?? "Non évalué"}</p>
                <div class="dessin-image" id="dessin-img-${dessin.numDessin}">
                    <em>Chargement de l'image...</em>
                </div>
            `;
            container.appendChild(div);

            // 🔹 Charger l'image du dessin
            fetch("/back/concoursImage.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    numDessin: dessin.numDessin
                })
            })
            .then(res => res.json())
            .then(imgData => {
                const imgContainer = document.getElementById(
                    `dessin-img-${dessin.numDessin}`
                );

                if (imgData.success && imgData.image) {
                    imgContainer.innerHTML = `
                        <img src="data:image/jpeg;base64,${imgData.image}"
                             class="dessin-img">
                    `;
                } else {
                    imgContainer.innerHTML =
                        "<em>Aucun dessin sauvegardé</em>";
                }
            });
        });
    })
    .catch(err => console.error("Erreur JS :", err));

    /* ============================
       🔹 UPLOAD DESSIN
    ============================ */
    document
        .getElementById("form-dessin")
        .addEventListener("submit", e => {

        e.preventDefault();

        const formData = new FormData(e.target);
        formData.append("numConcours", numConcours);
        formData.append("utilisateur", token);

        fetch("/back/concoursUploadImage.php", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            console.log("UPLOAD DESSIN :", data);
            if (data.success) {
                location.reload();
            } else {
                alert("Erreur lors de l'envoi du dessin");
            }
        });
    });
});
