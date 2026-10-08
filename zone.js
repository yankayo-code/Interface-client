let panier = [];

function chargerMenu(tentative) {
    const menu = document.querySelector('.menu');
    if (tentative === 1) {
        menu.innerHTML = '<p>Chargement du menu, merci de patienter...</p>';
    }

    fetch('https://zeduc-backend.bonto.run/plats')
        .then(function(response) { return response.json(); })
        .then(function(plats) {
            menu.innerHTML = '';

            const platsDisponibles = plats.filter(function(plat) {
                return plat.disponible;
            });

            platsDisponibles.forEach(function(plat) {
                const carte = document.createElement('article');
                carte.className = 'card selection';
                carte.innerHTML = '<img src="' + plat.image + '" alt="' + plat.nom + '">' +
                    '<h3>' + plat.nom + '</h3>' +
                    '<strong>' + plat.prix + ' FCFA</strong>' +
                    '<div class="zone-quantite"><input type="number" class="input-quantite" value="1" min="1"><button class="btn-ajouter">Ajouter</button></div>';
                menu.appendChild(carte);
            });

            activerCartes();
        })
        .catch(function() {
            if (tentative < 5) {
                setTimeout(function() { chargerMenu(tentative + 1); }, 4000);
            } else {
                menu.innerHTML = '<p>Impossible de charger le menu. Rechargez la page dans un instant.</p>';
            }
        });
}

chargerMenu(1);

function activerCartes() {
    const cartes = document.querySelectorAll('.selection');

    cartes.forEach(function(carte) {

        const zoneQuantite = carte.querySelector('.zone-quantite');

        carte.addEventListener('click', function() {
            zoneQuantite.classList.toggle('visible');
        });

        zoneQuantite.addEventListener('click', function(event) {
            event.stopPropagation();
        });

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
            zoneQuantite.classList.remove('visible');
        });

    });
}

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
        alert('Merci ' + nomClient + ' ! Votre commande a bien été reçue. Le restaurant vous contactera bientôt.');
        panier = [];
        afficherPanier();
    })
    .catch(function(erreur) {
        alert('Une erreur est survenue, merci de réessayer.');
    });
});