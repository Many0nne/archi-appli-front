---
Liste des tests définit à implémenter
---
l'utilisateur peut acheter des billets pour un spectacle avec des places encore en vente
l'utilisateur ne peut pas acheter de billets pour un spectacle avec 0 place en vente
l'utilisateur n'a pas acces aux vues restreintes aux administrateurs
l'administrateur peut acceder aux vues restreintes
l'utilisateur peut voir les spectacles
l'utilisateur peut faire des recherches sur les spectacles
la page /spectacles affiche les spectacles retournes par l'API dans des cartes
la page /spectacles n'affiche pas les spectacles dont la date est passee
chaque carte affiche le titre, la date formatee, le prix et le nombre de places
le badge "Complet" s'affiche quand availableTickets = 0
le nombre de places restantes s'affiche quand availableTickets > 0
le bouton "Reserver" est desactive quand availableTickets = 0
le bouton "Reserver" est actif quand availableTickets > 0
la page /spectacles charge et affiche au moins une carte de spectacle
la carte "Le Roi Lion" affiche "Complet" et son bouton est desactive
la carte "Hamlet" affiche "10 places" et son bouton est actif
la carte "Othello" n'est pas visible dans la liste car le spectacle est passe
la recherche declenche un GET /spectacles?search=hamlet quand l'utilisateur tape "hamlet"
la recherche est insensible a la casse quand l'utilisateur tape "HAMLET"
si la recherche retourne un tableau vide, un message "Aucun spectacle trouve" est affiche
si la recherche retourne des resultats, seules les cartes correspondantes sont affichees
effacer le champ de recherche recharge tous les spectacles avec GET /spectacles sans parametre
taper "Shakespeare" dans la barre de recherche affiche uniquement les spectacles correspondants
taper un terme sans resultat affiche un message de liste vide
la modal de reservation affiche le nombre de places disponibles
l'input de quantite dans la modal est min = 1 et max = min(availableTickets, 50)
si availableTickets = 8, l'input de quantite est plafonne a 8
si availableTickets = 60, l'input de quantite est plafonne a 50
la quantite 0 ou negative est refusee dans la modal
le prix total affiche dans la modal est recalcule quand la quantite change
cliquer "Commander" avec quantite = 3 appelle POST /reservations avec spectacleId, userId et quantity = 3
apres une reservation reussie, la modal affiche un message de succes ou se ferme
apres une reservation reussie, le nombre de places disponibles est mis a jour
ouvrir la modal de "Hamlet", selectionner 2 billets puis cliquer "Commander" confirme la reservation
la carte d'un spectacle complet affiche un bouton "Reserver" desactive
la carte d'un spectacle complet affiche le badge "Complet"
dans la modal d'un spectacle complet, l'input de quantite est absent ou desactive
dans la modal d'un spectacle complet, le bouton "Commander" est desactive
ouvrir la modal de "Le Roi Lion" avec 0 place affiche un bouton "Commander" desactive
aucun appel POST /reservations n'est emis quand le bouton "Commander" est desactive
cliquer "Commander" sans etre connecte redirige vers /login
aucun appel POST /reservations n'est effectue si l'utilisateur n'est pas connecte
un utilisateur non connecte ouvre la modal Hamlet, clique "Commander" et est redirige vers /login
RequireRole avec role ADMIN et utilisateur sans role ADMIN redirige vers /login
RequireRole avec role ADMIN et utilisateur avec role ADMIN rend les children
ProtectedRoute sans token redirige vers /login
ProtectedRoute avec token rend les children
ProtectedRoute affiche un etat de chargement si l'authentification n'est pas initialisee
dans la navbar, le lien "Admin" est absent pour un utilisateur sans role ADMIN
dans la navbar, le lien "Admin" est visible pour un utilisateur avec role ADMIN
un utilisateur standard qui navigue vers /admin est redirige
un utilisateur non connecte qui navigue vers /reservations est redirige vers /login
un utilisateur admin qui navigue vers /admin voit la page admin
dans la navbar, un utilisateur non connecte voit le bouton "Se connecter"
dans la navbar, un utilisateur non connecte ne voit pas de nom d'utilisateur
dans la navbar, un utilisateur non connecte ne voit pas le lien "Admin"
dans la navbar, un utilisateur connecte standard voit son nom "Jean Dupont"
dans la navbar, un utilisateur connecte voit "Se deconnecter" a la place de "Se connecter"
dans la navbar, un utilisateur connecte standard ne voit pas le lien "Admin"
dans la navbar, un utilisateur avec role ADMIN voit le lien "Admin"
la page /reservations affiche les reservations futures dans la section "A venir"
la page /reservations affiche les reservations passees dans la section "Passees"
quand l'API retourne une liste vide, un message "Aucune reservation" est affiche dans chaque section
le bouton "Annuler" est visible pour une reservation future avec spectacle dans plus de 2 heures
le bouton "Annuler" est absent ou desactive pour une reservation avec spectacle dans moins de 2 heures
cliquer "Annuler" appelle DELETE /reservations/:id
si DELETE /reservations/:id retourne 400 pour annulation tardive, un toast d'erreur est affiche
apres annulation reussie, la reservation disparait de la section "A venir"
la quantite et le nom du spectacle sont affiches pour chaque reservation
un utilisateur connecte accede a /reservations et voit ses reservations a venir et passees
annuler une reservation a venir la fait disparaitre de la liste avec un toast de confirmation
sur la page admin, "Revenus totaux" affiche "1 250,00 EUR"
sur la page admin, "Reservations totales" affiche "42"
sur la page admin, le tableau des ventes affiche une ligne par spectacle avec titre, billets vendus et revenus
sur la page admin, "Hamlet - 30 billets - 750,00 EUR" est present dans le tableau
sur la page admin, "Carmen - 20 billets - 700,00 EUR" est present dans le tableau
si GET /admin/stats retourne 500, un toast d'erreur est affiche
cliquer "Nouveau spectacle" ouvre un formulaire vide
remplir tous les champs et soumettre appelle POST /spectacles avec les bonnes donnees
apres creation reussie, le nouveau spectacle apparait dans le tableau
soumettre le formulaire admin avec un titre vide affiche une erreur et n'appelle pas POST
soumettre le formulaire admin avec un prix negatif affiche une erreur
soumettre le formulaire admin avec une date dans le passe affiche une erreur
soumettre le formulaire admin avec 0 billet disponible affiche une erreur ou est refuse
cliquer "Modifier" sur un spectacle ouvre le formulaire pre-rempli
modifier le titre et soumettre appelle PUT /spectacles/:id avec le nouveau titre
la liste admin est mise a jour apres modification reussie
cliquer "Supprimer" affiche un dialogue de confirmation
confirmer la suppression appelle DELETE /spectacles/:id
annuler le dialogue de confirmation n'appelle pas DELETE
apres suppression reussie, le spectacle n'apparait plus dans le tableau
un admin peut creer un spectacle et le voir apparaitre dans le tableau
un admin peut supprimer un spectacle et le voir disparaitre du tableau apres confirmation
un admin peut modifier le titre d'un spectacle et voir le nouveau titre dans le tableau
si GET /spectacles retourne 500, un toast ou message d'erreur est affiche sur la page spectacles
si POST /reservations retourne 500, un toast d'erreur est affiche dans la modal
si DELETE /reservations/:id retourne 500, un toast d'erreur est affiche sur la page reservations
si GET /admin/stats retourne 500, un toast d'erreur est affiche sur la page admin
si POST /spectacles retourne 500, un toast d'erreur est affiche dans le formulaire admin