fetch('https://zeduc-backend.bonto.run/').catch(function() {});

const MOT_DE_PASSE_ADMIN = 'junior59';

const btnConnexion = document.getElementById('btn-connexion');

btnConnexion.addEventListener('click', function() {
    const saisie = document.getElementById('input-mot-de-passe').value;

    if (saisie === MOT_DE_PASSE_ADMIN) {
        document.getElementById('zone-mot-de-passe').style.display = 'none';
        document.getElementById('zone-admin').style.display = 'block';
        chargerPlats();
    } else {
        alert('Mot de passe incorrect.');
    }
});

function chargerPlats(tentative) {
    tentative = tentative || 1;
    const liste = document.getElementById('liste-plats-admin');

    if (tentative === 1) {
        liste.innerHTML = '<p>Chargement des plats, merci de patienter...</p>';
    }

    fetch('https://zeduc-backend.bonto.run/plats')
        .then(function(response) { return response.json(); })
        .then(function(plats) {
            liste.innerHTML = '';

            plats.forEach(function(plat) {
                const ligne = document.createElement('div');
                ligne.innerHTML = '<label><input type="checkbox" data-id="' + plat._id + '" ' + (plat.disponible ? 'checked' : '') + '> ' + plat.nom + '</label>';
                liste.appendChild(ligne);
            });

            const checkboxes = document.querySelectorAll('#liste-plats-admin input[type="checkbox"]');
            checkboxes.forEach(function(checkbox) {
                checkbox.addEventListener('change', function() {
                    const id = checkbox.getAttribute('data-id');
                    const disponible = checkbox.checked;

                    fetch('https://zeduc-backend.bonto.run/plats/' + id, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ disponible: disponible })
                    })
                    .catch(function() {
                        alert('La modification n\'a pas été enregistrée, réessaie.');
                        checkbox.checked = !disponible;
                    });
                });
            });
        })
        .catch(function() {
            if (tentative < 5) {
                setTimeout(function() { chargerPlats(tentative + 1); }, 4000);
            } else {
                liste.innerHTML = '<p>Impossible de charger les plats. Recharge la page dans un instant.</p>';
            }
        });
}