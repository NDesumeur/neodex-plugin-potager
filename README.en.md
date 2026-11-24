# Veggie Patch

A pixel art defense game: on 5 rows of vegetable patch, vegetables stop the pests before they reach the house.

*Version française : [README.md](README.md)*

## Controls

- **Mouse**: click a plant at the top, then a square in the garden. Click seeds to pick them up.
- **Keyboard**: **1 to 7** to pick the plant, **arrows** for the square, **Enter** to plant, **C** to pick up a seed, **X** for the shovel.
- **P** or **Esc**: pause.

## The plants

- **Clover** (25): makes seeds now and then.
- **Radish** (50): shoots at the pests in its row.
- **Cabbage** (50, level 2): very tough, it blocks the way.
- **Nettle** (25, level 3): stings whatever walks over it.
- **Chili** (100, level 4): shoots fireballs that hurt a lot.

Each plant has a waiting time before you can plant another one. The **shovel** removes a plant.

## Seasons

Levels 1 to 10 are played in summer, in a garden in bloom. Levels 11 to 15 are played in autumn (dead leaves, mushrooms, falling leaves) and levels 16 to 20 in winter (snow, frost, snowflakes). The waves keep growing. If you had already finished level 10, you go straight on to level 11.

Two plants arrive with autumn:
- **Sunflower** (key 6, 50 seeds, from level 11): it gives a big seed worth 50 every 12 seconds.
- **Pumpkin** (key 7, 125 seeds, from level 13): a wall much sturdier than the cabbage.

The shovel is now on **X** or **0**.

## Full screen

The **Full screen** button fills the whole screen with the garden (Escape to leave). Otherwise the game takes all the height the window leaves.

## The pests

- **Slugs** and **snails** (tougher) eat the plants in front of them.
- **Crows** fly over the plants.
- **Moles** dig under the plants up to the middle of the garden.
- **Boars**, very tough, come at the end.

Every level ends with a **big wave**. A **cat** guards each row: it chases everyone away, only once. If a pest gets through a row with no cat, the patch is overrun.

## Mini-games (new in 1.2.0)

Three mini-games with different rules, started from the **MINI-GAMES** card in the side column (NEW GAME takes you back to the levels). Winning them does not move the levels on; the card counts how many times each one was won.

- **Cabbage bowling**: no seeds and no plants. A queue of cabbages fills up at the top; click a tile **before the red line** (or Enter) to roll the first one. The cabbage rolls to the right, hits the first pest and **bounces** onto a neighbouring row to hit more (×2, ×3…). A **red cabbage** explodes over the three rows around it. Crows do not come.
- **Seed conveyor**: no more seeds to spend. Plants (radish, cabbage, chilli, nettle, pumpkin) arrive at random on a belt at the top; pick one (click or 1 to 7), then a tile. The shovel is still there to make room.
- **Night garden**: nothing falls from the sky, you start with 150 seeds, and the garden is dark: you only see around the cursor, the plants and the shots. The pests' eyes shine in the dark.

## Stats

The Bests panel keeps the **level reached**, **levels won**, **pests defeated** and the number of **games**. The game resumes at the level reached.

## Data and sync

Your bests are saved by NeoDex, backed up and synced between your PCs if sync is on.

## Install

In NeoDex: **NeoStore → Discover → Veggie Patch → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
