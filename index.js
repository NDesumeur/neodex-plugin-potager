// Potager : des légumes défendent le jardin contre les nuisibles, sur 5 rangées.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Potager</span><span class="hint">Clic sur une plante puis sur une case · ou 1 à 7, flèches, Entrée · X : pelle · P : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="pgCanvas" width="276" height="160" role="img" aria-label="Potager"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="pgStats"></div></div>
      <div class="sysCard"><b>MINI-JEUX</b><div class="pgMinis" id="pgMinis" data-pxskip></div></div>
      <div class="row"><button class="btn main" id="pgNew">NOUVELLE PARTIE</button><button class="btn" id="pgFs">PLEIN ÉCRAN</button></div>
      <div class="hint">Des limaces, escargots, corbeaux, taupes et sangliers traversent le jardin de droite à gauche. Plante avec tes graines : le trèfle en donne, le radis et le piment tirent, le chou bloque le passage et l'ortie pique ce qui marche dessus. Ramasse les graines qui tombent en cliquant dessus. Les corbeaux volent au-dessus des plantes, les taupes creusent dessous jusqu'au milieu. Un chat garde chaque rangée, une seule fois. 10 niveaux, et trois mini-jeux aux règles différentes.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.pgMinis{display:grid;gap:6px}
.pgMinis .btn{flex-direction:column;align-items:flex-start;text-align:left;height:auto;padding:4px 10px 8px}
.pgMinis .btn small{font-size:13px;opacity:.85}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:1 1 360px;min-width:min(100%,320px);position:relative}
.gameBox:fullscreen{padding:0}
.gameBox:fullscreen canvas{width:min(100vw,calc(100vh * 276 / 160))}
.gameBox canvas{width:min(100%,max(280px,calc((100vh - 170px) * 276 / 160)));height:auto;aspect-ratio:276/160;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "POTAGER", T: {"k": "#0c0a12", "k2": "#16121e", "fill": "#221c2c", "fillOn": "#2e263a", "hl": "#3a3046", "line": "#62566e", "acc": "#7ae05a", "accL": "#d8f8c8", "accS": "#3a8a2a", "accD": "#14280a", "rivet": "#f0f0f8", "btn": "#3a3046", "btnHi": "#62566e", "btnLo": "#16121e", "btnHov": "#443852", "btnHovHi": "#82768e", "text": "#f4f0f8", "muted": "#c0b8cc", "acc2": "#7ee07a", "gold": "#ffd84a", "orange": "#ff8a3a", "red": "#ff4a3a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#100c16", "bgDot": "#221c2c", "bgDot2": "#16121e", "spark": "#14280a", "spark2": "#7ae05a", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["....kk..kk..", "...knNkknNk.", "...knnNknNk.", "....kknNkk..", ".....kkNkk..", "....krrrrrk.", "...krwrrrrrk", "..krwrrrrrrk", "..krrrrrrrrk", "...krrrrrrk.", "....krrrrk..", ".....kkkk..."],
  icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown'], [/^PLEIN/, 'full']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (v > (b ?? 0)) {  // un score nul n'est jamais un record
    games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
  // les trophées de NeoDex (3.4.8 et plus) : succès et records déclarés dans plugin.json ; sur un NeoDex plus ancien, rien ne se passe
  const trophy = id => { ctx.games?.unlock(id).catch(() => {}); };
  const trophyRecord = (id, v) => { if (v != null && Number.isFinite(+v)) ctx.games?.record(id, +v).catch(() => {}); };
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

/* ---------- Potager : des légumes défendent le jardin contre les nuisibles, sur 5 rangées. On plante avec les graines,
   le trèfle en donne, le radis et le piment tirent, le chou bloque, l'ortie pique. 10 niveaux ; un chat par rangée en dernier recours ---------- */
const PG = {W: 276, H: 160, X0: 20, Y0: 36, C: 24, COLS: 9, ROWS: 5, MAX: 20, CX: 31, CW: 25};
// les saisons : l'été jusqu'au niveau 10, l'automne de 11 à 15, l'hiver de 16 à 20
const pgSeason = L => L <= 10 ? 0 : L <= 15 ? 1 : 2, PG_SEASONS = ['Été', 'Automne', 'Hiver'];
// une nouvelle partie garde le même objet : la boucle du jeu (gameLoop) continue de tourner dessus
const renew = (old, o) => { if (!old) return o; for (const k of Object.keys(old)) if (k !== 'raf') delete old[k]; return Object.assign(old, o); };
const pgs = gstore('potager', {level: 1, wins: 0, games: 0, kills: 0});
if ((games.best.potager || 0) >= 10 && pgs.level < 11) pgs.level = 11;  // qui avait fini les 10 premiers niveaux passe à l'automne
let pg = null, pgac = null, pgMute = false;
function pgBeep(f, d, type = 'square', slide = 0, vol = .03) { if (pgMute) return; try { pgac ??= new AudioContext(); const o = pgac.createOscillator(), g = pgac.createGain(), t = pgac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(pgac.destination); o.start(t); o.stop(t + d); } catch {} }
const PG_SPR = {"trefle": {"pal": {"k": "#1a1408", "g": "#5ac03a", "G": "#3a8a2a", "l": "#a8f070", "s": "#2a6a1a", "w": "#ffffff"}, "f": [["................", ".....kk..kk.....", "....klgkkglk....", "....kgggggGk....", ".....kggwGk.....", ".kk...kGGk...kk.", "klgkk..ks..kkglk", "kgggGk.ks.kGgggk", ".kggGGkksskGGgk.", "..kkkk.ks.kkkk..", ".......ks.......", "......kks.......", "......ks........", "......ks........", ".....kssk.......", "................"], ["................", "......kk..kk....", ".....klgkkglk...", ".....kgggggGk...", "......kggwGk....", "..kk...kGGk..kk.", ".klgkk.ks..kkglk", ".kgggGkks.kGgggk", "..kggGGksskGGgk.", "...kkkk.s.kkkk..", ".......ks.......", "......kks.......", "......ks........", "......ks........", ".....kssk.......", "................"]]}, "radis": {"pal": {"k": "#1a1408", "g": "#5ac03a", "G": "#3a8a2a", "r": "#e8406a", "R": "#a82a4a", "w": "#ffd0e0", "e": "#1a1408", "o": "#5a2a1a"}, "f": [["....kk..kk......", "...kgGkkgGk.....", "...kggGkgGk.....", "....kkgGkk......", ".....kkGkk......", "....krrrrrk.....", "...krwrrrrRk....", "..krwrrrrrrRk...", "..krrrrrekrRkkkk", "..krrrrrrrrRkook", "..krrrooorrRkkkk", "...kRrrrrrRk....", "....kRRRRRk.....", ".....kkRkk......", "......kRk.......", ".......k........"], ["....kk..kk......", "...kgGkkgGk.....", "...kggGkgGk.....", "....kkgGkk......", ".....kkGkk......", "....krrrrrk.....", "...krwrrrrRk....", "..krwrrrrrrRk...", "..krrrrrekrRk...", "..krrrrrrrrRkkk.", "..krrrrkkrrRkok.", "...kRrrrrrRkkk..", "....kRRRRRk.....", ".....kkRkk......", "......kRk.......", ".......k........"]]}, "chou": {"pal": {"k": "#1a1408", "g": "#8ad86a", "G": "#5aa84a", "D": "#3a7a3a", "l": "#c8f0a8", "v": "#e8f8d8", "e": "#1a1408"}, "f": [["................", "................", ".....kkkkkk.....", "...kkGgllgGkk...", "..kGglvvvvlgGk..", ".kGglvlllvvlgGk.", ".kGglleklekglGk.", "kDGgllllllllgGDk", "kDGglllkkllglGDk", "kDDGglllllllgGDk", ".kDGGggllggGGDk.", ".kDDGGggggGGDDk.", "..kDDDGGGGDDDk..", "...kkDDDDDDkk...", ".....kkkkkk.....", "................"], ["................", "................", "................", ".....kkkkkk.....", "...kkGgllgGkk...", "..kGglvvvvlgGk..", ".kGglleklekglGk.", "kDGgllllllllgGDk", "kDGglllkkllglGDk", "kDDGglllllllgGDk", ".kDGGggllggGGDk.", ".kDDGGggggGGDDk.", "..kDDDGGGGDDDk..", "...kkDDDDDDkk...", ".....kkkkkk.....", "................"]]}, "piment": {"pal": {"k": "#1a1408", "g": "#5ac03a", "G": "#3a8a2a", "r": "#ff4a2a", "R": "#b82a1a", "y": "#ffd84a", "w": "#ffc8a0", "e": "#1a1408"}, "f": [[".......kk.......", "......kgGk......", ".....kgGGk......", "....kkkGkk......", "...krrrrrrk.....", "..krwrrrrrRk....", "..krwrrekrRkkk..", "..krrrrrrrRkyyk.", "..krrrrkkrRkkk..", "...krrrrrrRk....", "...krrrrrRk.....", "....krrrrRk.....", "....krrrRk......", ".....krRRk......", "......kRk.......", ".......k........"], [".......kk.......", "......kgGk......", ".....kgGGk......", "....kkkGkk......", "...krrrrrrk.....", "..krwrrrrrRk....", "..krwrrekrRk.k..", "..krrrrrrrRkkyk.", "..krrrrkkrRk.k..", "...krrrrrrRk....", "...krrrrrRk.....", "....krrrrRk.....", "....krrrRk......", ".....krRRk......", "......kRk.......", ".......k........"]]}, "ortie": {"pal": {"k": "#1a1408", "g": "#4aa83a", "G": "#2a7a2a", "w": "#e8f8d8"}, "f": [["................", "................", "................", "................", "................", "................", "................", "..k.....k....k..", ".kgk...kgk..kgk.", ".kgGk.kgwGk.kgGk", "kgwGkkgGGGkkgwGk", "kGGGkkGgGGkkGGGk", ".kGkw.kGGk.wkGk.", ".kGk..wkGk..kGk.", "..kG..kGk...Gk..", "..kk...kk...kk.."], ["................", "................", "................", "................", "................", "................", "................", "...k....k...k...", "..kgk..kgk.kgk..", ".kgGk.kgwGkkgGk.", "kgwGkkgGGGkkgwGk", "kGGGkkGgGGkkGGGk", ".kGk.wkGGkw.kGk.", ".kGk..wkGk..kGk.", "..kG..kGk...Gk..", "..kk...kk...kk.."]]}, "limace": {"pal": {"k": "#1a1408", "y": "#d8c84a", "Y": "#a8983a", "w": "#ffffff", "e": "#1a1408", "s": "#c8c8a0"}, "f": [["...k..k.........", "...k..k.........", "..kek.kek.......", "..kyykyyk.......", ".kyyyyyyykkk....", ".kyyyyyyyyyykkk.", "kyyYyyYyyYyyyyyk", "kYYYYYYYYYYYYYYk", ".kkkkkkkkkkkkkk."], ["....k..k........", "....k..k........", "...kek.kek......", "...kyykyyk......", "..kyyyyyyykkkk..", ".kyyyyyyyyyyyykk", ".kyYyyYyyYyyyyyk", "kYYYYYYYYYYYYYYk", ".kkkkkkkkkkkkkk."]]}, "escargot": {"pal": {"k": "#1a1408", "y": "#d8b88a", "Y": "#a8885a", "o": "#c86a2a", "O": "#8a4a1a", "l": "#f0a85a", "e": "#1a1408"}, "f": [[".......kkkkk....", "......kooolok...", "..k..kolOOOlok..", "..k.kolOkkOlok..", ".kekkolOkoOlok..", ".kyykolOOOOlOk..", ".kyyykooolllOk..", "kyyyyykOOOOOkkk.", "kyYyyyyyyyyyyyyk", "kYYYYYYYYYYYYYYk", ".kkkkkkkkkkkkkk."], ["........kkkkk...", ".......kooolok..", "...k..kolOOOlok.", "...k.kolOkkOlok.", "..kekkolOkoOlok.", "..kyykolOOOOlOk.", ".kyyyykooolllOk.", "kyyyyyykOOOOOkk.", "kyYyyyyyyyyyyyyk", "kYYYYYYYYYYYYYYk", ".kkkkkkkkkkkkkk."]]}, "corbeau": {"pal": {"k": "#1a1408", "b": "#3a3450", "B": "#262236", "y": "#ffb02a", "e": "#ff4a3a"}, "f": [["......kk.......", ".....kbbk......", "....kbbbk......", ".kkkbbbbk......", "kyykbebbbkkkkk.", ".kkkbbbbbbbbbbk", "....kbbbbbbBBk.", ".....kkBBBBkk..", ".......k..k....", "......kk.kk...."], ["...............", "...............", "...............", ".kkkkk.........", "kyykbebkkkkkkk.", ".kkkbbbbbbbbbbk", "....kbbbbbbBBk.", ".....kbbbbbbk..", ".....kbbbbk....", "......kkkk....."]]}, "taupe": {"pal": {"k": "#1a1408", "b": "#5a4a5a", "B": "#3a2e3a", "p": "#ff9ab0", "w": "#ffffff", "e": "#1a1408", "c": "#e8d8c8"}, "f": [[".....kkkk.....", "...kkbbbbkk...", "..kbbbbbbbbk..", ".kbbebbbbebbk.", ".kbbbbppbbbbk.", "kbbbbkppkbbbbk", "kbbbbbwwbbbbbk", "kcckbbbbbbkcck", "kcckbbbbbbkcck", ".kkkBBBBBBkkk.", "...kkkkkkkk..."], [".....kkkk.....", "...kkbbbbkk...", "..kbbbbbbbbk..", ".kbbebbbbebbk.", ".kbbbbppbbbbk.", "kbbbbkppkbbbbk", "kcckbbwwbbkcck", "kcckbbbbbbkcck", ".kkkbbbbbbkkk.", "...kBBBBBBk...", "...kkkkkkkk..."]]}, "sanglier": {"pal": {"k": "#1a1408", "b": "#7a5a3a", "B": "#5a3e26", "D": "#3a2614", "w": "#f0f0e0", "e": "#ff4a3a", "p": "#c88a6a"}, "f": [["....k.k.............", "...kbkbk..kkkkkkk...", "..kbbbbbkkDDDDDDDkk.", ".kbebbbbbbBBBBBBBBk.", "kkbbbbbbbbbbbbbbbBk.", "kppbbbbbbbbbbbbbbBkk", "kppkwbbbbbbbbbbbBBk.", ".kkwkbbbbbbbbbbBBk..", "...kbBBBBBBBBBBBk...", "...kBk.kBk..kBk.kBk.", "...kDk..kDk..kDkkDk.", "...kk...kk....kkkk.."], ["....k.k.............", "...kbkbk..kkkkkkk...", "..kbbbbbkkDDDDDDDkk.", ".kbebbbbbbBBBBBBBBk.", "kkbbbbbbbbbbbbbbbBk.", "kppbbbbbbbbbbbbbbBkk", "kppkwbbbbbbbbbbbBBk.", ".kkwkbbbbbbbbbbBBk..", "...kbBBBBBBBBBBBk...", "...kBk..kBkkBk..kBk.", "..kDk..kDk..kDk.kDk.", "..kk...kk...kk..kk.."]]}, "chat": {"pal": {"k": "#1a1408", "o": "#ff9a3a", "O": "#c86a1a", "w": "#ffffff", "e": "#1a1408", "p": "#ff9ab0"}, "f": [["k...k.....", "kokok.....", "kwoowk....", "koeoek..kk", "kowpwk.kok", ".kooookkok", "..kooOOok.", "..kooOOok.", "..kOkkOk..", "..kk.kk..."], ["k...k.....", "kokok.....", "kwoowk....", "koeoek.kk.", "kowpwk.kok", ".kooookkok", "..kooOOok.", "..kooOOok.", "..kOkOk...", "..kk.kk..."]]}, "tournesol": {"pal": {"k": "#1a1408", "y": "#ffd84a", "Y": "#e8a020", "o": "#8a5a2a", "O": "#5a3a1a", "g": "#5ac03a", "G": "#3a8a2a", "e": "#1a1408"}, "f": [[".......kk.......", "....kkkyykkk....", "...kyykyykyyk...", "...kyyyOOyyyk...", "...kkyooooykk...", "..kyyOeooeOyyk..", "..kyyOoooOOyyk..", "...kkyooOOykk...", "...kYYYOOYYYk...", "...kYYkYYkYYk...", "....kkkYYkkk....", "....kkkgGk......", "...kggggGkkk....", "....kgggGGGGk...", ".....kkgGGGk....", "......kgGkk....."], [".......k........", "......kyk.kk....", "....kkkyykyyk...", "...kyyyyyyyyk...", "...kyyOooOykk...", "...kyOooooOyyk..", "..kyyOeooeOyyk..", "..kyyOooOOOyk...", "...kkYOOOOYYk...", "...kYYYYYYYYk...", "...kYYkYYkkk....", "....kgggGk......", "...kggggGkkk....", "....kkkgGGGGk...", "......kgGGGk....", "......kgGkk....."]]}, "citrouille": {"pal": {"k": "#1a1408", "o": "#ff8a2a", "O": "#c85a1a", "l": "#ffb86a", "g": "#5ac03a", "G": "#3a7a2a", "e": "#1a1408", "y": "#ffd84a"}, "f": [["................", ".......kkk......", "......kGGgk.....", "......kGGggk....", "......kGGkk.....", ".....kkGGkk.....", "...kkOooooOkk...", "..kllOooooOook..", ".klleOooooOeook.", "klllleooooeooook", "kooooOooooOooook", "kooooOeyeeOooook", "kooooOooooOooook", ".koooOooooOoook.", "..kooOooooOook..", "...kkOooooOkk..."], ["................", "................", ".......kkk......", "......kGGgk.....", "......kGGggk....", "......kGGkk.....", "....kkkGGkkk....", "..kklOooooOokk..", ".klleOooooOeook.", "klllleooooeooook", "kooooOooooOooook", "kooooOeyeeOooook", "kooooOooooOooook", ".koooOooooOoook.", "..kooOooooOook..", "...kkOooooOkk..."]]}};
const PG_SEED = {"pal": {"k": "#1a1408", "y": "#ffd84a", "Y": "#c89a2a", "w": "#fff8d0"}, "f": ["..kkkk..", ".kywyyk.", "kywyyyYk", "kyyyyyYk", "kyyyyYYk", ".kyyYYk.", "..kYYk..", "...kk..."]};
// les plantes : prix, temps avant de pouvoir en replanter une, vie, et ce qu'elles font ; « from » : le niveau où on la reçoit
const PG_PLANTS = {
  trefle: {name: 'Trèfle', cost: 25, wait: 300, hp: 60, make: 480, from: 1},
  radis: {name: 'Radis', cost: 50, wait: 300, hp: 60, rate: 84, dmg: 10, from: 1},
  chou: {name: 'Chou', cost: 50, wait: 1200, hp: 480, from: 2},
  ortie: {name: 'Ortie', cost: 25, wait: 900, hp: 1e9, sting: .5, from: 3},
  piment: {name: 'Piment', cost: 100, wait: 600, hp: 60, rate: 100, dmg: 28, from: 4},
  tournesol: {name: 'Tournesol', cost: 50, wait: 600, hp: 60, make: 720, seed: 50, from: 11},
  citrouille: {name: 'Citrouille', cost: 125, wait: 1500, hp: 1400, from: 13}};
const PG_KEYS = Object.keys(PG_PLANTS), PG_SHOVEL = PG.CX + PG_KEYS.length * PG.CW + 2;
const PG_SEED_BIG = ['..kkkk..', '.kywyyk.', 'kywyyyYk', 'kyykkyYk', 'kyykkYYk', 'kyyyyYYk', '.kyyYYk.', '..kkkk..'];  // la grosse graine du tournesol, rayée
// les couleurs et le décor de chaque saison : de petites fleurs l'été, feuilles mortes et champignons l'automne, tas de neige et cailloux l'hiver
const pgFlower = c => (g, x, y) => { px(g, '#3a7a2a', x + 1, y + 2, 1, 2); px(g, c, x, y + 1, 3, 1); px(g, c, x + 1, y, 1, 3); px(g, '#ffd84a', x + 1, y + 1, 1, 1); };
const pgLeaf = c => (g, x, y) => { px(g, c, x, y, 3, 1); px(g, c, x + 1, y + 1, 2, 1); };
const PG_THEME = [
  {grass: '#58a840', tuft: '#7ad050', tuft2: '#3a8a2a', soil: ['#7a5634', '#6e4c2c'], furrow: ['#6a4a2c', '#5e4024'], stone: '#a8907a', stone2: '#5a4028', sprout: '#7ae05a', title: '#c8f0a8',
    deco: ['#ff5a6a', '#ffffff', '#ff9ad8', '#8ab8ff', '#ffd84a'].map(pgFlower)},
  {grass: '#8a9a3a', tuft: '#b0b04a', tuft2: '#6a7a2a', soil: ['#6e4a2c', '#624226'], furrow: ['#5e3e22', '#52361e'], stone: '#9a8a7a', stone2: '#4a3420', sprout: '#c8a03a', title: '#ffb86a',
    deco: [...['#e8742a', '#c8402a', '#e8b02a'].map(pgLeaf), (g, x, y) => { px(g, '#c8302a', x, y, 3, 1); px(g, '#ffffff', x + 1, y, 1, 1); px(g, '#e8d8c0', x + 1, y + 1, 1, 2); }]},
  {grass: '#d8e4f0', tuft: '#ffffff', tuft2: '#a8bcd8', soil: ['#6a5650', '#5e4c46'], furrow: ['#56443e', '#4c3c36'], stone: '#c8d0e0', stone2: '#3a2e2a', sprout: '#a8c8a0', title: '#c8e8ff',
    deco: [(g, x, y) => { px(g, '#ffffff', x, y, 4, 2); px(g, '#ffffff', x + 1, y - 1, 2, 1); px(g, '#a8bcd8', x, y + 2, 4, 1); }, (g, x, y) => { px(g, '#8a8a9a', x, y, 3, 2); px(g, '#ffffff', x, y, 3, 1); }]}];
// les nuisibles : vie, vitesse, morsure (par image), et le niveau où ils arrivent
const PG_PESTS = {limace: {hp: 60, spd: .13, bite: .4, from: 1}, escargot: {hp: 150, spd: .09, bite: .4, from: 3}, corbeau: {hp: 45, spd: .32, bite: 0, fly: 1, from: 4},
  taupe: {hp: 90, spd: .26, bite: .5, dig: 1, from: 6}, sanglier: {hp: 340, spd: .17, bite: 1.2, from: 8}};
// les vagues d'un niveau : de plus en plus de nuisibles, de plus en plus serrés, et une grande vague à la fin
const PG_MINI = {  // L : les nuisibles de quel niveau
  bowling: {name: 'Bowling de choux', L: 6, desc: 'lance des choux qui rebondissent', rule: 'Clique une case avant la ligne rouge', rule2: 'Le chou roule et rebondit · rouge : il explose'},
  tapis: {name: 'Tapis de graines', L: 9, desc: 'les plantes arrivent toutes seules', rule: 'Pas de graines : les plantes arrivent au hasard', rule2: 'Choisis-en une sur le tapis, puis une case'},
  nuit: {name: 'Potager la nuit', L: 7, desc: 'il fait noir, rien ne tombe du ciel', rule: 'La nuit : rien ne tombe du ciel', rule2: 'Tu ne vois qu’autour du curseur et des plantes'},
};
const PG_FEED = {radis: 3, chou: 2, piment: 2, ortie: 1, citrouille: 1};  // ce que le tapis apporte (poids)
function pgWaves(L, r, noFly) {
  const n = 6 + L * 3 - (L > 8 ? L - 8 : 0) * 2, types = Object.keys(PG_PESTS).filter(k => PG_PESTS[k].from <= L && !(noFly && PG_PESTS[k].fly)), out = [];
  let t = 1000;
  for (let i = 0; i < n; i++) {
    const big = i >= Math.floor(n * .7);
    if (i === Math.floor(n * .7)) t += 600;
    t += big ? 40 + r() * 60 : Math.max(200, 620 - L * 40) * (.6 + r() * .8);
    const w = types.map(k => k === 'limace' ? 3 : k === 'sanglier' ? .6 : 1), tot = w.reduce((a, b) => a + b); let x = r() * tot, k = 0; while ((x -= w[k]) > 0) k++;
    out.push({t: Math.round(t), type: types[k], row: Math.floor(r() * PG.ROWS), big});
  }
  return out;
}
function pgNew(L = pgs.level, mini = null) {
  const g = pg?.g, rnd = seeded(Date.now() % 1e9 + L);
  pg = renew(pg, {g, mode: 'ready', tick: 0, seen: 0, t: 0, L, rnd, mini, balls: [], rolls: [], cards: [], feed: 60, money: mini === 'nuit' ? 150 : 75, plants: [], pests: [], shots: [], drops: [], fx: [], cats: Array(PG.ROWS).fill(1),
    waves: pgWaves(L, rnd, mini === 'bowling'), wi: 0, sel: 0, cur: [1, 2], wait: {}, sky: mini ? 1e9 : 400, banner: 0, dead: 0, won: 0, kills: 0, shovel: false});
  pgInfo();
}
const pgAt = (c, r) => pg.plants.find(p => p.c === c && p.r === r);
const pgUnlocked = k => PG_PLANTS[k].from <= pg.L;
const pgSelK = () => pg.mini === 'tapis' ? pg.cards[pg.sel] : PG_KEYS[pg.sel];  // la plante choisie (sur le tapis : la carte choisie)
const pgCanPlant = (k, c, r) => (pg.mini === 'tapis' ? !!k && pg.cards[pg.sel] === k : pg.mini !== 'bowling' && pgUnlocked(k) && pg.money >= PG_PLANTS[k].cost && !(pg.wait[k] > 0)) && c >= 0 && c < PG.COLS && r >= 0 && r < PG.ROWS && !pgAt(c, r);
function pgPlant(k, c, r) {
  if (!pgCanPlant(k, c, r)) { pgBeep(140, .08); return false; }
  const P = PG_PLANTS[k]; if (pg.mini === 'tapis') { pg.cards.splice(pg.sel, 1); pg.sel = Math.max(0, Math.min(pg.sel, pg.cards.length - 1)); } else { pg.money -= P.cost; pg.wait[k] = P.wait; }
  pg.plants.push({k, c, r, hp: P.hp, cd: P.make ? 200 : 20, f: pg.rnd() * 30 | 0}); pgBeep(520, .06, 'triangle', 780); return true;
}
function pgRoll(c, r) {  // bowling : lance le premier chou de la file depuis une case avant la ligne rouge
  if (pg.mini !== 'bowling' || !pg.balls.length || c < 0 || c > 2 || r < 0 || r >= PG.ROWS) { pgBeep(140, .08); return false; }
  pg.rolls.push({r, x: pgPx(c) + 12, y: pgPy(r) + 12, boom: pg.balls.shift() === 'boom', hits: 0, a: 0, cool: 0}); pgBeep(330, .08, 'triangle', 200); return true;
}
function pgDig(c, r) { const p = pgAt(c, r); if (p) { pg.plants.splice(pg.plants.indexOf(p), 1); pgBeep(220, .08, 'square', 120); } }
const pgPx = c => PG.X0 + c * PG.C, pgPy = r => PG.Y0 + r * PG.C;
function pgCollect(d) { if (d.got) return; d.got = 1; const v = d.v || 25; pg.money += v; pg.fx.push({k: 'txt', x: d.x, y: d.y, t: 30, s: '+' + v}); pgBeep(1046, .06, 'triangle', 1400, .02); }
function pgUpdate() {
  pg.t++;
  for (const k in pg.wait) if (pg.wait[k] > 0) pg.wait[k]--;
  if (pg.banner) pg.banner--;
  // les nuisibles arrivent par la droite selon le programme du niveau
  while (pg.wi < pg.waves.length && pg.waves[pg.wi].t <= pg.t) {
    const w = pg.waves[pg.wi++], P = PG_PESTS[w.type], hp = P.hp * (1 + pg.L * .03);
    if (w.big && !pg.waves[pg.wi - 2]?.big) { pg.banner = 150; pgBeep(160, .5, 'sawtooth', 320, .05); }
    pg.pests.push({type: w.type, r: w.row, x: PG.W + 4 + pg.rnd() * 8, hp, max: hp, dig: !!P.dig, hit: 0, f: pg.rnd() * 30 | 0, eat: 0});
  }
  // les mini-jeux : la file de choux ou le tapis de plantes se remplit ; les choux roulent, frappent et rebondissent
  if ((pg.mini === 'bowling' || pg.mini === 'tapis') && --pg.feed <= 0) {
    pg.feed = pg.mini === 'bowling' ? 170 : 260; const list = pg.mini === 'bowling' ? pg.balls : pg.cards;
    if (list.length < 7) { if (pg.mini === 'bowling') list.push(pg.rnd() < .17 ? 'boom' : 'chou'); else { const tot = Object.values(PG_FEED).reduce((a, b) => a + b); let x = pg.rnd() * tot; list.push(Object.keys(PG_FEED).find(k => (x -= PG_FEED[k]) < 0) || 'radis'); } }
  }
  for (const b of pg.rolls) {
    b.x += 1.7; b.a++; const ty = pgPy(b.r) + 12; b.y += Math.sign(ty - b.y) * Math.min(1.4, Math.abs(ty - b.y)); if (b.cool > 0) b.cool--;
    const e = !b.cool && pg.pests.find(e => e.r === b.r && !e.gone && !e.dig && !PG_PESTS[e.type].fly && Math.abs(e.x - b.x) < 9);
    if (e && b.boom) { for (const o of pg.pests) if (Math.abs(o.r - b.r) <= 1 && Math.abs(o.x - b.x) < 30 && !o.dig) { o.hp -= 500; o.hit = 5; } pg.fx.push({k: 'puff', x: b.x, y: b.y, t: 14}, {k: 'puff', x: b.x, y: b.y - 14, t: 12}, {k: 'puff', x: b.x, y: b.y + 14, t: 12}); b.gone = 1; pgBeep(120, .3, 'sawtooth', 60, .04); }
    else if (e) { e.hp -= 100; e.hit = 5; b.hits++; b.cool = 10; b.r = b.r === 0 ? 1 : b.r === PG.ROWS - 1 ? b.r - 1 : b.r + (pg.rnd() < .5 ? -1 : 1);  // il rebondit sur une rangée voisine
      if (b.hits > 1) pg.fx.push({k: 'txt', x: b.x, y: b.y - 6, t: 30, s: '×' + b.hits}); pgBeep(400 + b.hits * 80, .06, 'square', 0, .02); }
    if (b.x > PG.W + 12) b.gone = 1;
  }
  pg.rolls = pg.rolls.filter(b => !b.gone);
  // les graines tombent du ciel de temps en temps
  if (--pg.sky <= 0) { pg.sky = 600; pg.drops.push({x: PG.X0 + 10 + pg.rnd() * (PG.COLS * PG.C - 20), y: PG.Y0 - 10, ty: PG.Y0 + 10 + pg.rnd() * (PG.ROWS * PG.C - 24), t: 0}); }
  for (const d of pg.drops) { if (d.y < d.ty) d.y += .5; d.t++; if (d.t > 420) pgCollect(d); }  // ramassées toutes seules au bout de 7 s, plus vite en cliquant
  pg.drops = pg.drops.filter(d => !d.got);
  // les plantes
  for (const p of pg.plants) {
    const P = PG_PLANTS[p.k]; p.f++;
    if (P.make && --p.cd <= 0) { p.cd = P.make; pg.drops.push({x: pgPx(p.c) + 12, y: pgPy(p.r) + 4, ty: pgPy(p.r) + 8, t: 0, v: P.seed}); }
    if (P.rate && --p.cd <= 0) {
      const x0 = pgPx(p.c) + 12;
      if (pg.pests.some(e => e.r === p.r && !e.dig && e.x > x0 && e.x < PG.W + 2)) { p.cd = P.rate; p.shoot = 8; pg.shots.push({r: p.r, x: x0 + 4, y: pgPy(p.r) + 9, dmg: P.dmg, fire: p.k === 'piment'}); pgBeep(p.k === 'piment' ? 300 : 700, .04, 'square', 0, .015); }
      else p.cd = 1;
    }
  }
  // les tirs avancent dans leur rangée et touchent le premier nuisible
  for (const s of pg.shots) {
    s.x += 2.2;
    const e = pg.pests.filter(e => e.r === s.r && !e.dig && Math.abs(e.x - s.x) < 6).sort((a, b) => a.x - b.x)[0];
    if (e) { e.hp -= s.dmg; e.hit = 5; s.gone = 1; pg.fx.push({k: 'pop', x: s.x, y: s.y, t: 8, c: s.fire ? '#ff8a2a' : '#f0f0d0'}); }
    if (s.x > PG.W + 8) s.gone = 1;
  }
  pg.shots = pg.shots.filter(s => !s.gone);
  // les nuisibles avancent, mangent la plante devant eux ; la taupe creuse sous les plantes jusqu'au milieu du jardin ; le corbeau passe par-dessus
  for (const e of pg.pests) {
    const P = PG_PESTS[e.type]; e.f++; if (e.hit) e.hit--;
    if (e.dig && e.x < pgPx(4)) { e.dig = false; pg.fx.push({k: 'dirt', x: e.x, y: pgPy(e.r) + 18, t: 16}); }
    const c = Math.floor((e.x - 6 - PG.X0) / PG.C), p = !P.fly && !e.dig ? pgAt(c, e.r) : null;
    if (p && p.k !== 'ortie' && e.x - 6 < pgPx(c) + 20) { p.hp -= P.bite; e.eat++; if (e.eat % 30 === 0) pgBeep(90, .05, 'square', 0, .015); if (p.hp <= 0) pg.plants.splice(pg.plants.indexOf(p), 1); }
    else { e.x -= P.spd; e.eat = 0; }
    const o = !P.fly && !e.dig ? pgAt(Math.floor((e.x - PG.X0) / PG.C), e.r) : null;
    if (o && o.k === 'ortie') { e.hp -= PG_PLANTS.ortie.sting; if (e.f % 20 === 0) e.hit = 3; }
    if (e.hp <= 0) { e.gone = 1; pg.kills++; pg.fx.push({k: 'puff', x: e.x, y: pgPy(e.r) + 12, t: 14}); pgBeep(260, .08, 'triangle', 130, .02); }
    if (!e.gone && e.x < PG.X0 - 2) {  // au bord du jardin : le chat de la rangée chasse tout le monde, une fois ; sans chat, c'est perdu
      if (pg.cats[e.r] === 1) { pg.cats[e.r] = {x: 4}; pgBeep(880, .3, 'sawtooth', 1200, .03); }
      else if (!pg.cats[e.r]) return pgEnd(false);
    }
  }
  for (let r = 0; r < PG.ROWS; r++) { const cat = pg.cats[r]; if (cat && cat !== 1) { cat.x += 3; for (const e of pg.pests) if (e.r === r && !e.gone && e.x < cat.x + 8 && e.x > cat.x - 12) { e.gone = 1; pg.kills++; pg.fx.push({k: 'puff', x: e.x, y: pgPy(r) + 12, t: 14}); } if (cat.x > PG.W + 10) pg.cats[r] = 0; } }
  pg.pests = pg.pests.filter(e => !e.gone);
  for (const f of pg.fx) f.t--; pg.fx = pg.fx.filter(f => f.t > 0);
  if (pg.wi >= pg.waves.length && !pg.pests.length) pgEnd(true);
}
function pgEnd(win) {
  pg.mode = 'over'; pg.won = win; pg.dead = 0; pgs.games++; pgs.kills += pg.kills;
  if (win && pg.mini) pgs.minis = {...(pgs.minis || {}), [pg.mini]: (pgs.minis?.[pg.mini] || 0) + 1};  // un mini-jeu gagné ne fait pas avancer les niveaux
  else if (win) { pgs.wins++; best('potager', pg.L); if (pg.L >= pgs.level) pgs.level = Math.min(PG.MAX, pg.L + 1); }
  saveGames(); pgInfo();
  (win ? [523, 659, 784, 1047] : [392, 330, 262, 196]).forEach((f, i) => setTimeout(() => pgBeep(f, .16, 'triangle'), i * 130));
}
/* ---------- le dessin ---------- */
function pgSpr(g, key, frame, x, y, pal) { const S = PG_SPR[key]; sprite(g, S.f[frame % S.f.length], Math.round(x), Math.round(y), pal || S.pal); }
const pgWhite = key => Object.fromEntries(Object.keys(PG_SPR[key].pal).map(k => [k, k === 'k' ? PG_SPR[key].pal.k : '#ffffff']));
let pgDark = null;
const PG_RED = Object.fromEntries(Object.entries(PG_SPR.chou.pal).map(([k, v], i) => [k, k === 'k' || k === 'e' ? v : ['#ff8a6a', '#e84a3a', '#a82a1a', '#ffc8b0', '#fff0e8'][i % 5]]));
function pgBall(g, x, y, boom, a) {  // un chou (rouge : il explose), qui roule en sautillant
  pgSpr(g, 'chou', 0, x - 8, y - 9 - (a >> 3) % 2, boom ? PG_RED : null);
  if (boom) { px(g, '#3a2a1a', x, y - 11, 1, 3); px(g, (a >> 2) % 2 ? '#ffd84a' : '#ff6a2a', x, y - 12, 1, 1); }
}
function pgDraw() {
  const g = pg.g, {W, H, X0, Y0, C, COLS, ROWS} = PG;
  for (; pg.seen < pg.tick; pg.seen++) if (pg.mode === 'over') pg.dead++;
  g.imageSmoothingEnabled = false;
  // le jardin selon la saison : l'herbe et ses touffes, des fleurs (l'été), des feuilles mortes et des champignons (l'automne), la neige (l'hiver) ;
  // planches de terre en damier avec leurs sillons, cailloux et petites pousses, la clôture à gauche
  const SE = pgSeason(pg.L), T = PG_THEME[SE], dr = seeded(7);
  px(g, T.grass, 0, 28, W, H - 28);
  for (let i = 0; i < 160; i++) { const x = dr() * W | 0, y = 29 + dr() * (H - 30) | 0; px(g, dr() < .5 ? T.tuft : T.tuft2, x, y, 1, 2); px(g, T.tuft, x + 1, y + 1, 1, 1); }
  for (let i = 0; i < 260; i++) { const x = dr() * W | 0, y = 29 + dr() * (H - 30) | 0, k = dr() * T.deco.length | 0;
    if (x > X0 - 3 && x < X0 + COLS * C && y > Y0 - 3 && y < Y0 + ROWS * C || x < 13) continue;  // sur l'herbe seulement, pas sous les chats
    T.deco[k](g, x, y); }
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const x = pgPx(c), y = pgPy(r), o = (r + c) & 1, h = (r * 7 + c * 13) % 5; px(g, T.soil[o], x, y, C, C);
    px(g, T.furrow[o], x + 2, y + 7, C - 4, 1); px(g, T.furrow[o], x + 2, y + 16, C - 4, 1);
    px(g, T.stone, x + 3 + h * 3, y + 11, 2, 1); px(g, T.stone2, x + 3 + h * 3, y + 12, 2, 1);
    if (h < 2) { px(g, T.sprout, x + 18 - h * 9, y + 19, 1, 2); px(g, T.sprout, x + 17 - h * 9, y + 19, 1, 1); px(g, T.sprout, x + 19 - h * 9, y + 19, 1, 1); }
    if (SE === 2) for (let i = 0; i < 4; i++) px(g, '#e8f0ff', x + (h * 5 + i * 7) % 22 + 1, y + (i * 9 + h) % 22 + 1, 1, 1);  // le givre sur la terre
  }
  for (let y = Y0 - 2; y < Y0 + ROWS * C; y += 6) { px(g, '#c8a070', 14, y, 3, 5); px(g, '#8a6a40', 16, y, 1, 5); }
  px(g, '#a87a4a', 13, Y0 + 2, 5, 1); px(g, '#a87a4a', 13, Y0 + ROWS * C - 6, 5, 1);
  for (let r = 0; r < ROWS; r++) { const cat = pg.cats[r]; if (cat === 1) pgSpr(g, 'chat', (pg.t >> 5) % 2, 2, pgPy(r) + 8); else if (cat) pgSpr(g, 'chat', (pg.t >> 2) % 2, cat.x, pgPy(r) + 8); }
  // la case visée (clavier ou souris)
  if (pg.mode !== 'over') { const [c, r] = pg.cur, x = pgPx(c), y = pgPy(r), ok = pg.shovel ? !!pgAt(c, r) : pg.mini === 'bowling' ? c <= 2 && pg.balls.length > 0 : pgCanPlant(pgSelK(), c, r), col = ok ? '#ffffff' : '#ff6a5a';
    for (let i = 0; i < C; i += 2) { px(g, col, x + i, y, 1, 1); px(g, col, x + i, y + C - 1, 1, 1); px(g, col, x, y + i, 1, 1); px(g, col, x + C - 1, y + i, 1, 1); } }
  const ents = [];
  for (const p of pg.plants) ents.push([p.r, 0, () => { const a = p.f >> 4, flash = p.hpFlash; pgSpr(g, p.k, p.k === 'radis' || p.k === 'piment' ? (p.shoot > 0 ? (p.shoot--, 1) : 0) : a, pgPx(p.c) + 4, pgPy(p.r) + 4);
    const P = PG_PLANTS[p.k]; if (p.hp < P.hp && P.hp < 1e8) { px(g, '#2a1a0a', pgPx(p.c) + 4, pgPy(p.r) + 21, 16, 2); px(g, '#7ae05a', pgPx(p.c) + 4, pgPy(p.r) + 21, Math.round(16 * p.hp / P.hp), 2); } }]);
  for (const e of pg.pests) ents.push([e.r, 1, () => {
    const S = PG_SPR[e.type], w = S.f[0][0].length, h = S.f[0].length, x = e.x - w / 2, y = pgPy(e.r) + C - 2 - h - (PG_PESTS[e.type].fly ? 6 + Math.round(Math.sin(e.f / 10) * 2) : 0);
    if (e.dig) { const mx = Math.round(e.x); px(g, '#5a3e22', mx - 5, pgPy(e.r) + 17, 10, 3); px(g, '#7a5634', mx - 3, pgPy(e.r) + 16, 6, 1); return; }
    if (PG_PESTS[e.type].fly) { px(g, 'rgba(0,0,0,.25)', e.x - 5, pgPy(e.r) + C - 4, 10, 2); }
    pgSpr(g, e.type, e.eat ? (e.f >> 3) : (e.f >> 4), x, y + (e.eat && (e.f >> 3) % 2 ? 1 : 0), e.hit > 2 ? pgWhite(e.type) : null);
  }]);
  for (const [, , fn] of ents.sort((a, b) => a[0] - b[0] || a[1] - b[1])) fn();
  for (const b of pg.rolls) pgBall(g, b.x, b.y, b.boom, b.a);
  if (pg.mini === 'bowling') for (let y = Y0; y < Y0 + ROWS * C; y += 4) px(g, '#e84a3a', pgPx(3), y, 1, 2);  // la ligne rouge : on lance avant
  for (const s of pg.shots) { if (s.fire) { px(g, '#ff4a2a', s.x - 3, s.y - 1, 4, 3); px(g, '#ffd84a', s.x - 1, s.y, 2, 1); px(g, '#ff8a2a', s.x - 6, s.y, 3, 1); } else { px(g, '#1a1408', s.x - 1, s.y - 1, 4, 4); px(g, '#f0f0d0', s.x, s.y, 2, 2); } }
  for (const f of pg.fx) {
    if (f.k === 'pop') { px(g, f.c, f.x - 2, f.y - 2, 1, 1); px(g, f.c, f.x + 2, f.y - 2, 1, 1); px(g, f.c, f.x - 2, f.y + 2, 1, 1); px(g, f.c, f.x + 2, f.y + 2, 1, 1); }
    if (f.k === 'puff') { const r = 14 - f.t; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; px(g, '#e8e0d0', f.x + Math.cos(a) * r, f.y + Math.sin(a) * r * .6, 2, 2); } }
    if (f.k === 'dirt') for (let i = 0; i < 6; i++) px(g, '#5a3e22', f.x - 6 + i * 2, f.y - (16 - f.t) * (i % 3 + 1) * .4, 2, 2);
    if (f.k === 'txt') pxFont(g, f.s, f.x, f.y - (30 - f.t) * .4, '#ffd84a', 8, 'center');
  }
  if (pg.mini === 'nuit') {  // la nuit : du noir partout, sauf autour du curseur, des plantes et des tirs ; les yeux des nuisibles brillent
    pgDark ??= Object.assign(document.createElement('canvas'), {width: W, height: H}); const m = pgDark.getContext('2d');
    m.globalCompositeOperation = 'source-over'; m.clearRect(0, 0, W, H); m.fillStyle = 'rgba(6,8,28,.88)'; m.fillRect(0, 28, W, H - 28); m.globalCompositeOperation = 'destination-out';
    const hole = (x, y, r) => { m.beginPath(); m.arc(x, y, r, 0, Math.PI * 2); m.fill(); };
    hole(pgPx(pg.cur[0]) + 12, pgPy(pg.cur[1]) + 12, 30); for (const p of pg.plants) hole(pgPx(p.c) + 12, pgPy(p.r) + 12, 11); for (const s of pg.shots) hole(s.x, s.y, 7);
    m.globalCompositeOperation = 'source-over'; g.drawImage(pgDark, 0, 0);
    for (const e of pg.pests) if (!e.dig) { const y = pgPy(e.r) + C - 12 - (PG_PESTS[e.type].fly ? 6 : 0); px(g, '#ffe04a', e.x - 4, y, 1, 1); px(g, '#ffe04a', e.x - 1, y, 1, 1); }
    px(g, '#e8e8c0', W - 22, 32, 6, 6); px(g, '#06081c', W - 20, 31, 5, 5);  // la lune
  }
  // ce qui tombe du ciel : des feuilles en automne, des flocons en hiver (sans mémoire : leur place se calcule depuis l'heure du jeu)
  if (SE) for (let i = 0; i < 26; i++) { const v = .25 + (i % 4) * .08, x = ((i * 47 + Math.sin((pg.tick + i * 40) / 30) * 6 - pg.tick * v * (SE === 1 ? .6 : .2)) % W + W) % W, y = (i * 61 + pg.tick * v) % (H - 28) + 28;
    if (SE === 1) { px(g, ['#e8742a', '#c8402a', '#e8b02a', '#a8602a'][i % 4], x, y, 2, 1); px(g, '#6a3a1a', x + (i % 2), y + 1, 1, 1); } else px(g, '#ffffff', x, y, i % 3 ? 1 : 2, i % 3 ? 1 : 2); }
  for (const d of pg.drops) sprite(g, d.v > 25 ? PG_SEED_BIG : PG_SEED.f, Math.round(d.x - 4), Math.round(d.y - 4 + (d.y >= d.ty ? Math.round(Math.sin(d.t / 8)) : 0)), PG_SEED.pal);
  // le haut : les graines et les cartes des plantes
  px(g, '#5a3e22', 0, 0, W, 28); px(g, '#7a5634', 0, 0, W, 1); px(g, '#3a2614', 0, 27, W, 1);
  if (pg.mini !== 'bowling' && pg.mini !== 'tapis') { sprite(g, PG_SEED.f, 4, 4, PG_SEED.pal); pxFont(g, String(pg.money), 18, 20, '#ffd84a', 8, 'center'); }
  if (pg.mini === 'bowling' || pg.mini === 'tapis') {  // la file des choux, ou le tapis des plantes
    const list = pg.mini === 'bowling' ? pg.balls : pg.cards;
    for (let i = 0; i < 7; i++) { const x = PG.CX + i * PG.CW, k = list[i], on = k && i === (pg.mini === 'tapis' ? pg.sel : 0) && !pg.shovel;
      px(g, on ? '#ffd84a' : '#2a1a0a', x, 2, 24, 24); px(g, k ? '#e8d8b0' : '#4a3a2a', x + 1, 3, 22, 22); if (!k) continue;
      if (pg.mini === 'bowling') pgBall(g, x + 12, 22, k === 'boom', 0); else sprite(g, PG_SPR[k].f[0], x + 4, 4, PG_SPR[k].pal); }
    pxFont(g, pg.mini === 'bowling' ? 'choux' : 'tapis', 16, 18, '#e8d8b0', 8, 'center');
  } else PG_KEYS.forEach((k, i) => {
    const x = PG.CX + i * PG.CW, on = pg.sel === i && !pg.shovel, P = PG_PLANTS[k], open = pgUnlocked(k);
    px(g, on ? '#ffd84a' : '#2a1a0a', x, 2, 24, 24); px(g, open ? '#e8d8b0' : '#6a5a4a', x + 1, 3, 22, 22);
    if (!open) { sprite(g, ['..kkk..', '.k...k.', '.k...k.', 'kkkkkkk', 'kyyyyyk', 'kyykyyk', 'kyyyyyk', 'kkkkkkk'], x + 8, 4, {k: '#3a2a1a', y: '#c8a04a'}); pxFont(g, String(P.from), x + 12, 23, '#3a2a1a', 8, 'center'); return; }
    sprite(g, PG_SPR[k].f[0], x + 4, 2, PG_SPR[k].pal);
    const dim = pg.money < P.cost || pg.wait[k] > 0;
    if (pg.wait[k] > 0) px(g, 'rgba(26,20,8,.55)', x + 1, 3, 22, Math.round(22 * pg.wait[k] / P.wait));
    else if (dim) px(g, 'rgba(26,20,8,.35)', x + 1, 3, 22, 22);
    px(g, '#3a2a1a', x + 1, 18, 22, 7); pxFont(g, String(P.cost), x + 12, 24, pg.money >= P.cost ? '#ffd84a' : '#ff6a5a', 8, 'center');
  });
  if (pg.mini !== 'bowling') { const x = PG_SHOVEL, on = pg.shovel; px(g, on ? '#ffd84a' : '#2a1a0a', x, 2, 22, 24); px(g, '#e8d8b0', x + 1, 3, 20, 22);
    sprite(g, ['....kk', '...kBk', '..kBk.', '.kBk..', 'kggk..', 'kgggk.', 'kggk..', '.kk...'].map(r => '..' + r), x + 4, 8, {k: '#1a1408', B: '#8a5a3a', g: '#a8a8b8'}); }
  pxFont(g, 'Niv ' + pg.L, W - 3, 12, '#ffffff', 8, 'right');
  const done = pg.waves.length ? pg.waves.filter((w, i) => i < pg.wi).length / pg.waves.length : 0;
  px(g, '#2a1a0a', W - 38, 17, 35, 5); px(g, '#7ae05a', W - 37, 18, Math.round(33 * done), 3);
  if (pg.banner) gameText(g, W, [['GRANDE VAGUE !', (pg.banner >> 3) % 2 ? '#ff4a3a' : '#ffd84a', 12]], 90);
  if (pg.mode === 'ready' && pg.mini) { const M = PG_MINI[pg.mini]; gameText(g, W, [['MINI-JEU', '#c8f0a8'], [M.name.toUpperCase(), '#ffd84a', 12], [M.rule, '#ffffff'], [M.rule2, '#c8f0a8'], ['Espace : commencer', '#b8b0c8']], 64); }
  else if (pg.mode === 'ready') gameText(g, W, [['POTAGER · NIVEAU ' + pg.L, '#ffd84a', 12], [PG_SEASONS[SE] + (pg.L === 11 ? ' : le tournesol arrive' : pg.L === 13 ? ' : la citrouille arrive' : ''), T.title], ['Choisis une plante, puis une case', '#ffffff'], ['Garde les nuisibles loin de la maison !', '#c8f0a8'], ['Espace : commencer', '#b8b0c8']], 58);
  if (pg.mode === 'pause') gameText(g, W, [['PAUSE', '#ffd84a', 12], ['Entrée : reprendre', '#b8b0c8']], 80);
  if (pg.mode === 'over' && pg.dead > 30 && pg.mini) gameText(g, W, [[pg.won ? 'MINI-JEU GAGNÉ !' : 'LE POTAGER EST ENVAHI', pg.won ? '#7ae05a' : '#ff4a3a', 12], [PG_MINI[pg.mini].name + ', ' + pg.kills + ' nuisibles', '#ffffff'], [pg.dead > 60 ? 'Espace : rejouer' : '', '#b8b0c8']], 72);
  else if (pg.mode === 'over' && pg.dead > 30) gameText(g, W, pg.won ? [['JARDIN SAUVÉ !', '#7ae05a', 12], ['Niveau ' + pg.L + ' fini, ' + pg.kills + ' nuisibles', '#ffffff'], [pg.L < PG.MAX ? (pg.dead > 60 ? 'Espace : niveau suivant' : '') : 'Tous les niveaux sont finis !', '#ffd84a']]
    : [['LE POTAGER EST ENVAHI', '#ff4a3a', 12], ['Niveau ' + pg.L + ', ' + pg.kills + ' nuisibles', '#ffffff'], [pg.dead > 60 ? 'Espace : recommencer' : '', '#b8b0c8']], 72);
  if (pg.tick % 15 === 0) {
    const [c, r] = pg.cur, here = pgAt(c, r);
    g.canvas.setAttribute('aria-label', 'Potager, niveau ' + pg.L + ' : ' + pg.money + ' graines, ' + PG_SEASONS[SE].toLowerCase() + ', plante choisie ' + (pg.shovel ? 'pelle' : pg.mini === 'bowling' ? (pg.balls.length ? pg.balls.length + ' choux' : 'aucun chou') : PG_PLANTS[pgSelK()]?.name || 'aucune') + (pg.mini ? ', mini-jeu ' + PG_MINI[pg.mini].name : '') + ', case colonne ' + (c + 1) + ' rangée ' + (r + 1) + (here ? ' (' + PG_PLANTS[here.k].name + ')' : '') +
      ', ' + pg.plants.length + ' plantes, ' + pg.pests.length + ' nuisibles, ' + pg.kills + ' vaincus' + (pg.mode === 'over' ? (pg.won ? ', gagné' : ', perdu') : '') + '.');
  }
}
function pgInfo() {
  setTimeout(pgTrophies);
  $('pgMinis').replaceChildren(...Object.entries(PG_MINI).map(([k, M]) => { const b = el('button', 'btn' + (pg?.mini === k ? ' main' : '')), n = pgs.minis?.[k] || 0;
    b.append(el('span', '', M.name), el('small', '', M.desc + (n ? ' · gagné ' + n + ' fois' : ''))); b.onclick = () => { pgNew(M.L, k); b.blur(); }; return b; }));
  $('pgStats').replaceChildren(...[['Niveau atteint', pgs.level], ['Niveaux gagnés', pgs.wins], ['Nuisibles vaincus', pgs.kills], ['Parties', pgs.games]].flatMap(([a, c]) => [el('span', '', a), el('b', '', String(c))]));
}
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !pg || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  const k = e.key;
  if (pg.mode === 'over') { if ((k === ' ' || k === 'Enter') && pg.dead > 60) { e.preventDefault(); pg.mini ? pgNew(pg.L, pg.mini) : pgNew(pg.won ? Math.min(PG.MAX, pg.L + 1) : pg.L); } return; }
  if (k === 'p' || k === 'P' || k === 'Escape') { if (pg.mode === 'play') pg.mode = 'pause'; else if (pg.mode === 'pause') pg.mode = 'play'; return; }
  const mv = {ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1]}[k];
  if (mv) { e.preventDefault(); pg.cur = [Math.max(0, Math.min(PG.COLS - 1, pg.cur[0] + mv[0])), Math.max(0, Math.min(PG.ROWS - 1, pg.cur[1] + mv[1]))]; return; }
  if (/^[1-7]$/.test(k)) { pg.sel = +k - 1; pg.shovel = false; return; }
  if (k === 'x' || k === 'X' || k === '0') { pg.shovel = !pg.shovel; return; }
  if (k === 'c' || k === 'C') { const d = pg.drops.find(d => !d.got); if (d) pgCollect(d); return; }
  if (k === ' ' || k === 'Enter') { e.preventDefault(); if (pg.mode !== 'play') { pg.mode = 'play'; return; } if (pg.shovel) { pgDig(...pg.cur); pg.shovel = false; } else if (pg.mini === 'bowling') pgRoll(...pg.cur); else pgPlant(pgSelK(), ...pg.cur); }
});
{ const cv = $('pgCanvas');  // à la souris : une carte, puis une case ; on ramasse les graines en cliquant dessus
  const at = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * PG.W, (e.clientY - r.top) / r.height * PG.H]; };
  cv.onpointermove = e => { if (!pg) return; const [x, y] = at(e), c = Math.floor((x - PG.X0) / PG.C), r = Math.floor((y - PG.Y0) / PG.C); if (c >= 0 && c < PG.COLS && r >= 0 && r < PG.ROWS) pg.cur = [c, r]; };
  cv.onpointerdown = e => { e.preventDefault(); if (!pg) return; const [x, y] = at(e);
    if (pg.mode === 'over') { if (pg.dead > 60) pg.mini ? pgNew(pg.L, pg.mini) : pgNew(pg.won ? Math.min(PG.MAX, pg.L + 1) : pg.L); return; }
    if (pg.mode !== 'play') { pg.mode = 'play'; return; }
    const d = pg.drops.find(d => !d.got && Math.abs(d.x - x) < 8 && Math.abs(d.y - y) < 8); if (d) return pgCollect(d);
    if (y < 28) { const i = Math.floor((x - PG.CX) / PG.CW); if (x >= PG_SHOVEL && x < PG_SHOVEL + 22) pg.shovel = !pg.shovel; else if (i >= 0 && i < (pg.mini === 'tapis' ? pg.cards.length : pg.mini === 'bowling' ? 0 : PG_KEYS.length) && (x - PG.CX) % PG.CW < 24) { pg.sel = i; pg.shovel = false; } return; }
    const c = Math.floor((x - PG.X0) / PG.C), r = Math.floor((y - PG.Y0) / PG.C); if (c < 0 || c >= PG.COLS || r < 0 || r >= PG.ROWS) return;
    pg.cur = [c, r]; if (pg.shovel) { pgDig(c, r); pg.shovel = false; } else if (pg.mini === 'bowling') pgRoll(c, r); else pgPlant(pgSelK(), c, r); };
}
$('pgNew').onclick = () => { pgNew(pg?.mini ? pgs.level : pg?.L || pgs.level); $('pgNew').blur(); };  // depuis un mini-jeu : retour aux niveaux
$('pgFs').onclick = () => { $('pgFs').blur(); try { document.fullscreenElement ? document.exitFullscreen() : $('pgCanvas').parentElement.requestFullscreen?.().catch(() => {}); } catch {} };
$('pgCanvas').__pg = {st: () => pg, nw: (L, m) => pgNew(L, m), roll: (c, r) => pgRoll(c, r)};
// le jardinier automatique de la vérification : des trèfles d'abord, puis des tireurs dans les rangées menacées, des choux devant, des orties, des piments
function pgBot() {
  for (const d of pg.drops) if (d.t > 60) pgCollect(d);
  if (pg.mini === 'bowling') { const t = pg.pests.filter(e => !e.dig && !PG_PESTS[e.type].fly && e.x < PG.W - 4).sort((a, b) => a.x - b.x)[0]; if (t && !pg.rolls.some(b => b.r === t.r && b.x < t.x)) pgRoll(1, t.r); return; }
  if (pg.mini === 'tapis') { const k = pg.cards[0]; if (!k) return; pg.sel = 0;
    const thr = r => pg.pests.filter(e => e.r === r).length, sh = r => pg.plants.filter(p => p.r === r && PG_PLANTS[p.k].rate).length, rows = [0, 1, 2, 3, 4].sort((a, b) => sh(a) - sh(b) || thr(b) - thr(a));
    for (const c of {radis: [1, 2, 3, 0], piment: [2, 3, 4, 1], chou: [6, 7, 5], ortie: [5, 4, 7], citrouille: [7, 6, 8]}[k]) for (const r of rows) if (pgPlant(k, c, r)) return; return; }
  const rows = [2, 1, 3, 0, 4], threat = r => pg.pests.filter(e => e.r === r).length, shooters = r => pg.plants.filter(p => p.r === r && PG_PLANTS[p.k].rate).length;
  const tryP = (k, c, r) => pgCanPlant(k, c, r) && pgPlant(k, c, r);
  for (const r of [...rows].sort((a, b) => threat(b) - threat(a))) if (threat(r) && !shooters(r) && (tryP('radis', 1, r) || tryP('radis', 2, r))) return;
  const clovers = pg.plants.filter(p => p.k === 'trefle').length;
  if (clovers < 3) { for (const r of rows) if (tryP('trefle', 0, r)) return; }
  for (const e of pg.pests) if (e.dig && (tryP('ortie', 3, e.r) || tryP('radis', 2, e.r) || tryP('piment', 4, e.r))) return;  // une taupe sous terre : de l'ortie là où elle ressort
  const plan = [['radis', 1], ['tournesol', 0], ['trefle', 0], ['radis', 2], ['chou', 6], ['citrouille', 6], ['piment', 4], ['ortie', 3], ['ortie', 7], ['piment', 5], ['citrouille', 7], ['radis', 8]];
  for (const [k, c] of plan) for (const r of [...rows].sort((a, b) => threat(b) - threat(a))) if (tryP(k, c, r)) return;
}
{  // vérification : le jardinier automatique gagne les niveaux 1, 5, 10, 15 et 20 ; sans plantes, les chats sauvent une fois puis c'est perdu ; on ne plante pas sans graines
  const bad = [], keep = pg, keepS = JSON.stringify(pgs), keepB = games.best.potager;
  pgMute = true;
  for (const L of [1, 5, 10, 15, 20]) { pg = null; pgNew(L); pg.rnd = seeded(L * 13); pg.waves = pgWaves(L, seeded(L * 13)); pg.mode = 'play'; for (let t = 0; t < 40000 && pg.mode === 'play'; t++) { pgBot(); pgUpdate(); } if (!pg.won) bad.push('niveau ' + L + ' perdu (' + pg.kills + ' vaincus, vague ' + pg.wi + '/' + pg.waves.length + ')'); }
  pg = null; pgNew(1); pg.rnd = seeded(5); pg.waves = pgWaves(1, seeded(5)); pg.mode = 'play'; for (let t = 0; t < 40000 && pg.mode === 'play'; t++) pgUpdate();
  if (pg.won || pg.cats.every(c => c === 1)) bad.push('sans plantes, pas perdu');
  pg = null; pgNew(1); pg.money = 10; if (pgPlant('radis', 1, 1)) bad.push('planté sans graines');
  for (const m of Object.keys(PG_MINI)) { pg = null; pgNew(PG_MINI[m].L, m); pg.rnd = seeded(77); pg.waves = pgWaves(pg.L, seeded(77), m === 'bowling'); pg.mode = 'play'; for (let t = 0; t < 40000 && pg.mode === 'play'; t++) { pgBot(); pgUpdate(); } if (!pg.won) bad.push('mini-jeu ' + m + ' perdu (' + pg.kills + ' vaincus, vague ' + pg.wi + '/' + pg.waves.length + ')'); }
  pg = null; pgNew(6, 'bowling'); if (pgRoll(1, 1)) bad.push('lancé sans chou'); pg.balls = ['chou']; if (pgRoll(4, 1) || !pgRoll(2, 1) || pg.balls.length) bad.push('ligne rouge du bowling');
  pg = null; pgNew(9, 'tapis'); pg.money = 0; pg.cards = ['chou']; if (!pgPlant('chou', 4, 2) || pg.cards.length || pgPlant('chou', 5, 2)) bad.push('tapis de graines');
  console.assert(!bad.length, 'potager', bad);
  Object.assign(pgs, JSON.parse(keepS)); if (keepB === undefined) delete games.best.potager; else games.best.potager = keepB;
  pg = keep; pgMute = false;
}
// les trophées, tirés des statistiques et des records gardés (aussi à l'ouverture : ce qui a été fait avant compte)
function pgTrophies() {
  const b = games.best.potager || 0, sig = [b, pgs.wins, pgs.kills].join(); if (sig === pgTrophies.sig) return; pgTrophies.sig = sig;
  trophyRecord('niveau', b || null);
  if (pgs.wins >= 1) trophy('premier'); if (b >= 5) trophy('n5'); if (b >= 10) trophy('n10'); if (b >= PG.MAX) trophy('n20'); if (pgs.kills >= 500) trophy('nuisibles');
}
ctx.onOpen(() => {
  if (!pg || !pg.g) { pgNew(); pg.g = $('pgCanvas').getContext('2d'); }
  gameLoop(pg, 'potager', pgUpdate, pgDraw); pgInfo();
});
}
