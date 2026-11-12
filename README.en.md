# Veggie Patch

A pixel art defense game: on 5 rows of vegetable patch, vegetables stop the pests before they reach the house.

*Version française : [README.md](README.md)*

## Controls

- **Mouse**: click a plant at the top, then a square in the garden. Click seeds to pick them up.
- **Keyboard**: **1 to 5** to pick the plant, **arrows** for the square, **Enter** to plant, **C** to pick up a seed, **X** for the shovel.
- **P** or **Esc**: pause.

## The plants

- **Clover** (25): makes seeds now and then.
- **Radish** (50): shoots at the pests in its row.
- **Cabbage** (50, level 2): very tough, it blocks the way.
- **Nettle** (25, level 3): stings whatever walks over it.
- **Chili** (100, level 4): shoots fireballs that hurt a lot.

Each plant has a waiting time before you can plant another one. The **shovel** removes a plant.

## The pests

- **Slugs** and **snails** (tougher) eat the plants in front of them.
- **Crows** fly over the plants.
- **Moles** dig under the plants up to the middle of the garden.
- **Boars**, very tough, come at the end.

Every level ends with a **big wave**. A **cat** guards each row: it chases everyone away, only once. If a pest gets through a row with no cat, the patch is overrun.

## Stats

The Bests panel keeps the **level reached**, **levels won**, **pests defeated** and the number of **games**. The game resumes at the level reached.

## Data and sync

Your bests are saved by NeoDex, backed up and synced between your PCs if sync is on.

## Install

In NeoDex: **NeoStore → Discover → Veggie Patch → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
