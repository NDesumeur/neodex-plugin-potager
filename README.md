# Potager

Un jeu de défense en pixel art : sur 5 rangées de potager, des légumes arrêtent les nuisibles avant qu'ils atteignent la maison.

*English version: [README.en.md](README.en.md)*

## Commandes

- **Souris** : clique sur une plante en haut, puis sur une case du jardin. Clique sur les graines pour les ramasser.
- **Clavier** : **1 à 7** pour choisir la plante, **flèches** pour la case, **Entrée** pour planter, **C** pour ramasser une graine, **X** pour la pelle.
- **P** ou **Échap** : pause.

## Les plantes

- **Trèfle** (25) : donne des graines de temps en temps.
- **Radis** (50) : tire sur les nuisibles de sa rangée.
- **Chou** (50, niveau 2) : très solide, il bloque le passage.
- **Ortie** (25, niveau 3) : pique ce qui marche dessus.
- **Piment** (100, niveau 4) : tire des boules de feu qui font très mal.

Chaque plante a un temps d'attente avant d'en replanter une. La **pelle** retire une plante.

## Les saisons

Les niveaux 1 à 10 se jouent en été, dans un jardin fleuri. Les niveaux 11 à 15 se jouent en automne (feuilles mortes, champignons, feuilles qui tombent) et les niveaux 16 à 20 en hiver (neige, givre, flocons). Les vagues sont de plus en plus grandes. Si tu avais déjà fini le niveau 10, tu reprends directement au niveau 11.

Deux plantes arrivent avec l'automne :
- **Tournesol** (touche 6, 50 graines, dès le niveau 11) : il donne une grosse graine qui vaut 50, toutes les 12 secondes.
- **Citrouille** (touche 7, 125 graines, dès le niveau 13) : un mur bien plus solide que le chou.

La pelle passe sur **X** ou **0**.

## Plein écran

Le bouton **Plein écran** agrandit le jardin à tout l'écran (Échap pour en sortir). Hors plein écran, le jeu prend toute la hauteur que laisse la fenêtre.

## Les nuisibles

- **Limaces** et **escargots** (plus solides) mangent les plantes devant eux.
- Les **corbeaux** volent au-dessus des plantes.
- Les **taupes** creusent sous les plantes jusqu'au milieu du jardin.
- Les **sangliers**, très costauds, arrivent à la fin.

Chaque niveau finit par une **grande vague**. Un **chat** garde chaque rangée : il chasse tout le monde une seule fois. Si un nuisible passe une rangée sans chat, le potager est envahi.

## Statistiques

Le panneau Records garde le **niveau atteint**, les **niveaux gagnés**, les **nuisibles vaincus** et le nombre de **parties**. Le jeu reprend au niveau atteint.

## Données et synchronisation

Tes records sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Potager → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
