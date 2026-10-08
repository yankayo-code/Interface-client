fetch('https://zeduc-backend.bonto.run/').catch(function() {});
const formAccueil = document.getElementById('form-accueil');

const boutonsMode = document.querySelectorAll('input[name="mode-reception"]');
const champResidence = document.getElementById('input-residence-client');

function mettreAJourChampResidence() {
    const modeActuel = document.querySelector('input[name="mode-reception"]:checked').value;

    if (modeActuel === 'livraison') {
        champResidence.style.display = 'block';
        champResidence.required = true;
    } else {
        champResidence.style.display = 'none';
        champResidence.required = false;
    }
}

boutonsMode.forEach(function(bouton) {
    bouton.addEventListener('change', mettreAJourChampResidence);
});

mettreAJourChampResidence();

formAccueil.addEventListener('submit', function(event) {
    event.preventDefault();

    const nomClient = document.getElementById('input-nom-client').value;
    const telephoneClient = document.getElementById('input-telephone-client').value;
    const residenceClient = document.getElementById('input-residence-client').value;
    const modeReception = document.querySelector('input[name="mode-reception"]:checked').value;

    localStorage.setItem('nomClient', nomClient);
    localStorage.setItem('telephoneClient', telephoneClient);
    localStorage.setItem('residenceClient', residenceClient);
    localStorage.setItem('modeReception', modeReception);

    window.location.href = 'menu.html';
});