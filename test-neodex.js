// lancé par le test « local » de NeoDex : plante au clavier (un trèfle, puis des radis devant les nuisibles, comme un lecteur d'écran le ferait),
// ramasse les graines et vérifie que des nuisibles sont vaincus (avec NEO_SHOTS : garde des images du jeu, sans la teinte du thème)
module.exports = async ({ pj, sleep }) => {
  const key = k => pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: '${k}', bubbles: true})), 0`);
  const label = () => pj(`document.getElementById('pgCanvas').getAttribute('aria-label')`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('pgCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'potager-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await sleep(500); await shot('0-depart');
  await key(' ');
  let cur = [1, 2];  // la case de départ du curseur (colonne 1, rangée 2, comptées à partir de 0)
  const goto = async (c, r) => { while (cur[0] < c) { await key('ArrowRight'); cur[0]++; } while (cur[0] > c) { await key('ArrowLeft'); cur[0]--; } while (cur[1] < r) { await key('ArrowDown'); cur[1]++; } while (cur[1] > r) { await key('ArrowUp'); cur[1]--; } };
  const plant = async (n, c, r) => { await key(String(n)); await goto(c, r); await key('Enter'); };
  await plant(1, 0, 2);
  const todo = [[2, 1, 0], [2, 1, 1], [2, 1, 2], [2, 1, 3], [2, 1, 4], [1, 0, 1], [1, 0, 3]];
  let l = '';
  for (let i = 0; i < 260; i++) {
    await key('c');
    const m = /: (\d+) graines/.exec(l = await label());
    if (todo.length && m && +m[1] >= (todo[0][0] === 1 ? 25 : 50)) { const count = async () => +/(\d+) plantes/.exec(await label())[1], before = await count(); const [n, c, r] = todo[0]; await plant(n, c, r); await sleep(300); if (await count() > before) todo.shift(); }
    if (i === 120) await shot('1-jardin');
    if (/(\d+) vaincus/.exec(l)?.[1] >= 3 && i > 150) break;
    await sleep(200);
  }
  await shot('2-combat');
  const k = /(\d+) plantes, (\d+) nuisibles, (\d+) vaincus/.exec(l = await label());
  if (!k || +k[1] < 4 || +k[3] < 1) throw new Error('il fallait planter et vaincre des nuisibles : « ' + l + ' »');
  return l;
};
