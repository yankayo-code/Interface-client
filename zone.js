let panier = [];

const cartes = document.querySelectorAll('.selection');

cartes.forEach(function(carte) {

    const zoneQuantite = carte.querySelector('.zone-quantite');

    // Clic sur la carte entière → afficher/cacher la zone
    carte.addEventListener('click', function() {
        zoneQuantite.classList.toggle('visible');
    });

    // Clic sur la zone de quantité elle-même → ne pas faire remonter le clic à la carte
    zoneQuantite.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // Clic sur le bouton "Ajouter" spécifiquement
    const btnAjouter = carte.querySelector('.btn-ajouter');
    btnAjouter.addEventListener('click', function() {
        const nomPlat = carte.querySelector('h3').textContent;
        const prixTexte = carte.querySelector('strong').textContent;
        const prixNombre = parseInt(prixTexte.replace(/\D/g, ''));
        const quantite = parseInt(carte.querySelector('.input-quantite').value);

        const article = {
            nom: nomPlat,
            prix: prixNombre,
            quantite: quantite
        };

        panier.push(article);

        afficherPanier();

        console.log(panier);

        zoneQuantite.classList.remove('visible');
    });

});



function afficherPanier() {
    const titrePanier = document.getElementById('titre-panier');
    const listePanier = document.getElementById('liste-panier');
    const totalPanier = document.getElementById('total-panier');

    listePanier.innerHTML = '';

    let total = 0;
    let nombreArticles = 0;

    panier.forEach(function(article) {
        const ligne = document.createElement('li');
        ligne.textContent = article.quantite + 'x ' + article.nom + ' - ' + (article.prix * article.quantite) + ' FCFA';
        listePanier.appendChild(ligne);

        total = total + (article.prix * article.quantite);
        nombreArticles = nombreArticles + article.quantite;
    });

    titrePanier.textContent = 'Votre panier (' + nombreArticles + ')';
    totalPanier.textContent = 'Total : ' + total + ' FCFA';
}

const btnValider = document.getElementById('btn-valider');


btnValider.addEventListener('click', function() {
    if (panier.length === 0) {
        alert('Votre panier est vide. Ajoutez au moins un plat avant de valider.');
        return;
    }

    const nomClient = localStorage.getItem('nomClient');
    const telephoneClient = localStorage.getItem('telephoneClient');
    const residenceClient = localStorage.getItem('residenceClient');
    const modeReception = localStorage.getItem('modeReception');


    const commande = {
        client: {
            nom: nomClient,
            telephone: telephoneClient,
            residence: residenceClient,
            modeReception: modeReception
        },
        articles: panier
    };

    fetch('https://zeduc-backend.bonto.run/commande', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commande)
    })
    .then(function(response) {
    return response.text();
    })
    .then(function(data) {
    console.log('Réponse du serveur :', data);

    alert('Merci ' + nomClient + ' ! Votre commande a bien été reçue. Le restaurant vous contactera bientôt.');

    panier = [];
    afficherPanier();
    })
    .catch(function(erreur) {
    console.log('Erreur lors de l\'envoi :', erreur);
    alert('Une erreur est survenue, merci de réessayer.');
});
});
