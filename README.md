Galerie+ est une application web permettant de rechercher et d’afficher des images de haute qualité grâce à l’API Unsplash.
L’utilisateur peut effectuer une recherche par mot-clé, filtrer par orientation (paysage, portrait, carré), afficher les images sous forme de cartes, ouvrir une image en plein écran (modal) et naviguer entre les images.
En absence de clé API valide, le projet fonctionne automatiquement en mode démo avec des images générées depuis picsum.photos.

Technologies utilisées:
HTML5 — structure de la page
CSS3 — mise en page responsive, design moderne, effets, modal
JavaScript (Vanilla) — requêtes API, création dynamique des cartes, gestion du modal, navigation, pagination
API Unsplash (recherche d'images)
Picsum.photos (mode démo sans clé API)

Fonctionnalités principales:
Recherche d’images par mot-clé
Filtre par orientation : paysage, portrait ou carré
Grille responsive avec affichage des images sous forme de cartes
Pagination : bouton Charger plus pour afficher davantage de résultats
Modal plein écran avec :
navigation précédente / suivante
légende affichant l’auteur et la description
fermeture via clic extérieur ou touche ESC
Interface adaptée aux mobiles
Design moderne : flous, dégradés, ombres, animations au survol
Mode démo automatique si aucune clé API n’est fournie
Lien GitHub Pages (version en ligne)
https://tassnyme512.github.io/tasnim_soussi_recherche/

Nouveautés explorées / Ce que j’ai appris:
Manipuler Fetch API pour appeler une API externe (Unsplash)
Gérer une pagination API et afficher dynamiquement les résultats
Générer des éléments HTML en JavaScript (cartes, images, meta)
Créer et gérer une fenêtre modale personnalisée (ouverture, fermeture, navigation)
Utiliser dataset pour associer des données aux éléments (index des images)
Compréhension et usage d’aria-label, aria-live et de l’accessibilité dans les interfaces
Gestion des états (query, page, index active) en JavaScript
Utilisation d’un mode fallback automatique (mock images) en cas de clé API absente
Approfondissement du design moderne : dégradés, ombres, backdrop-filter, transitions CSS

Difficultés rencontrées:
Intégration de l’API Unsplash et gestion des erreurs de requêtes
Problèmes d'affichage lors du changement de page (load more)
Modal qui restait ouvert ou ne se fermait pas correctement
Conflits entre les tailles des images (verticales / horizontales) dans la grille
Compatibilité mobile / responsive
Bloquage possible si aucune clé API n’était fournie (résultat vide)

Solutions apportées:
Mise en place d’un mode démo avec picsum.photos pour éviter les erreurs sans clé API
Centralisation des états (query, page, orientation, index courant) dans des variables JS
Fonction createCard() pour générer proprement chaque carte d'image
Utilisation de overflow: hidden + object-fit: cover pour gérer les images irrégulières
Ajout d’aria-hidden, rôles HTML et compatibilité clavier pour un modal accessible
Ajout d’un système de navigation clavier (← → et ESC)
Gestion propre du reset de la galerie, effacement et re-render à chaque nouvelle recherche
