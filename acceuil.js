const formAccueil = document.getElementById('form-accueil');

formAccueil.addEventListener('submit', function(event) {
    event.preventDefault();

    const nomClient = document.getElementById('input-nom-client').value;
    const telephoneClient = document.getElementById('input-telephone-client').value;
    const residenceClient = document.getElementById('input-residence-client').value;

    localStorage.setItem('nomClient', nomClient);
    localStorage.setItem('telephoneClient', telephoneClient);
    localStorage.setItem('residenceClient', residenceClient);

    window.location.href = 'index.html';
});

/* event.preventDefault() : par défaut, soumettre un <form> recharge automatiquement la page (comportement natif du HTML, hérité d'une époque où tout passait par des rechargements). On annule ce comportement pour garder le contrôle en JavaScript.
 localStorage.setItem('clé', valeur) : localStorage est une sorte de mémoire permanente du navigateur, propre à ton site — contrairement à une simple variable JavaScript qui disparaît dès qu'on change de page, localStorage persiste même après avoir 
 navigué vers index.html. C'est exactement ce qu'il nous faut puisque accueil.html et index.html sont deux pages séparées.
 window.location.href = 'index.html' : redirige le navigateur vers ta page menu, une fois les infos stockées.*/