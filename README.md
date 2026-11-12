# Potager

Un jeu de défense en pixel art : sur 5 rangées de potager, des légumes arrêtent les nuisibles avant qu'ils atteignent la maison.

*English version: [README.en.md](README.en.md)*

## Commandes

- **Souris** : clique sur une plante en haut, puis sur une case du jardin. Clique sur les graines pour les ramasser.
- **Clavier** : **1 à 5** pour choisir la plante, **flèches** pour la case, **Entrée** pour planter, **C** pour ramasser une graine, **X** pour la pelle.
- **P** ou **Échap** : pause.

## Les plantes

- **Trèfle** (25) : donne des graines de temps en temps.
- **Radis** (50) : tire sur les nuisibles de sa rangée.
- **Chou** (50, niveau 2) : très solide, il bloque le passage.
- **Ortie** (25, niveau 3) : pique ce qui marche dessus.
- **Piment** (100, niveau 4) : tire des boules de feu qui font très mal.

Chaque plante a un temps d'attente avant d'en replanter une. La **pelle** retire une plante.

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
