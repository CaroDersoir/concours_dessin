// Contact.js

// On récupère le bouton
const mapsButton = document.getElementById("openMapsBtn");

// On ajoute l'événement click
mapsButton.addEventListener("click", () => {
    const address = "10 Bd Jean Jeanneteau, 49100 Angers, France";
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, "_blank"); // ouvre dans un nouvel onglet
});
