document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token");
    if (!token) return;

    fetch('/back/concourUtil.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            utilisateur: token
        })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.success) {
            console.error(data.error);
            return;
        }

        const ulActuels = document.getElementById('concours-actuels');
        const ulPasses  = document.getElementById('concours-passes');

        data.concours.forEach(c => {
            const li = document.createElement('li');
            li.textContent = `${c.theme} (${c.etat})`;

            if (c.etat === 'en_cours') {
                ulActuels.appendChild(li);
            } else {
                ulPasses.appendChild(li);
            }
        });
    })
    .catch(err => console.error(err));
});
