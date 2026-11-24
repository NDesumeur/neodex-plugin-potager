// lancé par le test « local » de NeoDex : plante au clavier (un trèfle, puis des radis devant les nuisibles, comme un lecteur d'écran le ferait),
// ramasse les graines et vérifie que des nuisibles sont vaincus ; puis l'automne et l'hiver avec le tournesol et la citrouille, le plein écran et la place prise (avec NEO_SHOTS : garde des images du jeu, sans la teinte du thème)
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
  // l'automne et l'hiver : un tournesol (touche 6) et une citrouille (touche 7) plantés au clavier, le tournesol donne une grosse graine de 50
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  const C = code => pj(`(() => { const T = document.getElementById('pgCanvas').__pg; ${code} })()`);
  const seasons = [];
  for (const L of [14, 18]) {
    await C(`T.nw(${L}); return 0;`); await sleep(300); if (L === 18) await shot('3-hiver-depart');
    await key(' '); await C(`T.st().money = 400; T.st().cur = [1, 2]; return 0;`); cur = [1, 2];
    await plant(6, 0, 2); await plant(7, 5, 2); await plant(2, 1, 2);
    const got = await C(`const pg = T.st(); return pg.plants.map(p => p.k).sort().join(',');`);
    if (got !== 'citrouille,radis,tournesol') throw new Error('niveau ' + L + ' : plantes posées ' + got);
    const m0 = await C(`return T.st().money;`);
    await sleep(4500); await key('c'); await key('c'); await sleep(200);
    const m1 = await C(`return T.st().money;`);
    if (m1 - m0 < 50) throw new Error('le tournesol ne donne pas sa graine (' + m0 + ' → ' + m1 + ')');
    seasons.push(/niveau \d+ : \d+ graines, (\w+)/.exec(await label())[1]);
    await shot(L === 14 ? '4-automne' : '5-hiver');
  }
  if (seasons.join() !== 'automne,hiver') throw new Error('saisons : ' + seasons);
  // les mini-jeux (1.2.0) : le bouton du panneau lance le bowling, un chou lancé roule ; le tapis donne des plantes sans graines ; la nuit cache le jardin
  const nb = await pj("document.querySelectorAll('#pgMinis .btn').length"); if (nb !== 3) throw new Error('trois mini-jeux attendus : ' + nb);
  await pj("document.querySelectorAll('#pgMinis .btn')[0].click(), 0"); await sleep(300); await shot('6-bowling-depart');
  if (!/mini-jeu Bowling de choux/.test(await label())) throw new Error('le bowling devait démarrer : ' + await label());
  await key(' '); await C('T.st().balls = ["chou", "boom", "chou", "chou"]; T.st().t = 1500; return 0;'); await sleep(2500);
  const rolled = await C('const pg = T.st(); return [T.roll(1, 1), T.roll(0, 2), T.roll(5, 3)].join(",");'); if (rolled !== 'true,true,false') throw new Error('lancers : ' + rolled);
  await sleep(1400); await shot('7-bowling');
  await C('T.nw(9, "tapis"); return 0;'); await key(' '); await C('const pg = T.st(); pg.cards = ["radis", "chou", "piment"]; pg.sel = 1; pg.cur = [5, 2]; return 0;'); cur = [5, 2]; await key('Enter'); await sleep(200);
  const tp = await C('const pg = T.st(); return pg.plants.map(p => p.k).join() + "|" + pg.cards.join();'); if (tp !== 'chou|radis,piment') throw new Error('tapis : ' + tp);
  await sleep(1500); await shot('8-tapis');
  await C('T.nw(7, "nuit"); return 0;'); await key(' '); await C('const pg = T.st(); pg.money = 300; pg.cur = [1, 2]; return 0;'); cur = [1, 2]; await plant(2, 1, 2); await sleep(5000); await shot('9-nuit');
  if (await C('return T.st().sky;') < 1e8) throw new Error('la nuit, rien ne doit tomber du ciel');
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  await pj(`document.getElementById('pgFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('pgCanvas'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l\'écran');
  const L = await pj(`(() => { const r = document.getElementById('pgCanvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('pgCanvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 300) throw new Error('le jeu dépasse la fenêtre ou reste petit : ' + JSON.stringify(L));
  return l + ' · automne et hiver, tournesol et citrouille · trois mini-jeux · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
