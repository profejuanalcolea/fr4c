'use strict';
/* FR-4C · Matemàtiques 4t ESO · Unitat Representació gràfica.
   L'app (index.html) carrega aquest fitxer quan cal. Fa servir les funcions del nucli de l'app.
   Idea: llegir i situar punts (molts exercicis), entendre què explica una gràfica, fer la taula de valors,
   dibuixar rectes, gràfiques de la vida real i, al final, el gràfic de temperatures i el climograma.
   Tot es fa amb clics i fletxes del teclat (els alumnes treballen amb el ratolí tàctil del portàtil).
   En Coma, el gat de FR-4C, acompanya cada graella i reacciona quan es comprova. */
Object.assign(ETIQ_ERR, {
  rSwap: 'gira les coordenades: escriu (y, x)', rSigne: 'equivoca el signe d\'una coordenada', rEscala: 'compta quadrets sense mirar l\'escala',
  rTram: 'no distingeix pujar, aturar-se i tornar', rTaula: 'calcula malament algun valor de la taula', rPunts: 'situa malament algun punt'
});
Object.assign(AVIS_ERR, {
  rSwap: 'Has girat les coordenades. Primer va la <b>x</b> (horitzontal: pel passadís) i després la <b>y</b> (vertical: per l\'escala).',
  rSigne: 'Compte amb el <b>signe</b>: a l\'esquerra del 0 la x és negativa, i a sota del 0 la y és negativa.',
  rEscala: 'Mira l\'<b>escala</b> dels eixos: aquí cada quadret no val 1.',
  rTram: 'Recorda: si la línia <b>puja</b> s\'allunya, si és <b>plana</b> està aturat i si <b>baixa</b> torna cap a casa.'
});
document.head.insertAdjacentHTML('beforeend', `<style>
.gr-g{display:flex;flex-direction:column;gap:6px;align-items:stretch}
.gr-svg{width:100%;height:auto;max-height:min(50vh,calc(100vh - 370px));min-height:190px;background:#fff;border:2px solid var(--tinta);border-radius:12px;display:block;user-select:none;-webkit-user-select:none}
.gr-svg.act{cursor:crosshair}.gr-svg:focus{outline:3px solid var(--taronja);outline-offset:2px}
.gr-fig{transition:transform .32s cubic-bezier(.3,1.45,.5,1)}
.gr-cur{fill:none;stroke:var(--taronja);stroke-width:2.5;stroke-dasharray:4 3;pointer-events:none;opacity:0;transition:opacity .15s}
.gr-svg.act:hover .gr-cur,.gr-svg.act:focus .gr-cur{opacity:1}
.gr-din circle{animation:grPop .25s both}@keyframes grPop{0%{transform:scale(.2);opacity:0}100%{transform:scale(1);opacity:1}}
.gr-din circle,.gr-fin circle{transform-box:fill-box;transform-origin:center}
.gr-ctl{display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap}
.gr-ctl button{min-width:46px;height:42px;padding:0 12px;border-radius:11px;border:2px solid var(--tinta);background:#fff;font-size:1rem;font-weight:800;line-height:1;cursor:pointer}
.gr-ctl button:hover:not(:disabled){background:#fff3e6}.gr-ctl button:active:not(:disabled){transform:translateY(2px)}.gr-ctl button:disabled{opacity:.45;cursor:default}
.gr-nota{margin:0;text-align:center;color:var(--gris);font-size:.82rem}
.gr-coma{display:flex;align-items:center;gap:8px;justify-content:center}
.gr-baf{background:#fff7ee;border:2px solid var(--taronja);border-radius:12px;padding:4px 10px;font-size:.92rem;font-weight:700;max-width:330px}
.gr-gat.salta{animation:grSalt .55s}@keyframes grSalt{0%,100%{transform:translateY(0) rotate(0)}35%{transform:translateY(-10px) rotate(-8deg)}70%{transform:translateY(0) rotate(5deg)}}
.gr-gat.trist{animation:grNo .5s}@keyframes grNo{0%,100%{transform:rotate(0)}25%{transform:rotate(-9deg)}75%{transform:rotate(9deg)}}
.gr-coord{display:flex;align-items:center;justify-content:center;gap:6px;font-size:2.3rem;font-weight:900;line-height:1}
.gr-coord label{display:flex;flex-direction:column;align-items:center;gap:2px}
.gr-coord small{font-size:.8rem;color:var(--gris);font-weight:800}
.gr-coord input{width:86px;height:56px;border:2.5px solid var(--tinta);border-radius:10px;font-size:1.7rem;font-weight:800;text-align:center}
.gr-coord input.be,.gr-taula input.be{border-color:#1d8a4a;background:#e8f6ee}.gr-coord input.mal,.gr-taula input.mal{border-color:#c33;background:#fdecec}
.gr-taula{border-collapse:collapse;margin:0 auto;font-size:1.2rem}
.gr-taula th,.gr-taula td{border:2px solid var(--tinta);padding:5px 8px;text-align:center;min-width:54px;background:#fff}
.gr-taula th{background:#fff3e6;font-weight:800;white-space:nowrap}.gr-taula td.dada{font-weight:800}
.gr-taula input{width:66px;height:42px;border:2px solid var(--tinta);border-radius:8px;font-size:1.25rem;font-weight:800;text-align:center}
.gr-taula.petita{font-size:1rem}.gr-taula.petita th,.gr-taula.petita td{padding:3px 7px;min-width:40px}
.gr-taula td.marca{background:#fff3e6}
.gr-anim{stroke-dasharray:2000;stroke-dashoffset:2000;animation:grDibuixa 1.2s ease-out forwards}@keyframes grDibuixa{to{stroke-dashoffset:0}}
.gr-ple{animation:grApareix .6s .5s both}@keyframes grApareix{from{opacity:0}to{opacity:1}}
.gr-vis{width:100%;max-width:560px;height:auto;max-height:46vh;display:block;margin:0 auto;background:#fff;border:2px solid var(--tinta);border-radius:12px}
.gr-vis.petit{max-height:40vh}
.opcions:has(.gr-mini){display:grid;grid-template-columns:1fr 1fr;gap:8px}.opcions .opcio:has(.gr-mini){margin:0;padding:6px 8px}.opcio .gr-mini{width:190px}
.gr-mini{display:block;width:210px;max-width:100%;height:auto;background:#fff;border:1.5px solid #c9d3e2;border-radius:8px}
.gr-rec{display:flex;align-items:center;gap:10px;background:#fff7ee;border:2px solid var(--taronja);border-radius:12px;padding:8px 12px;font-size:.98rem;line-height:1.45;max-width:440px;margin:8px auto 0}
.gr-rec b{color:#b44f00}
.gr-maq{display:flex;align-items:center;justify-content:center;gap:10px;font-size:1.3rem;font-weight:800;margin:8px 0}
.gr-maq .caixa{border:3px solid var(--tinta);border-radius:12px;padding:8px 14px;background:#fff3e6;font-size:1.25rem}
.gr-maq .num{border:2px dashed #9aa8bd;border-radius:10px;padding:6px 12px;background:#fff}
.gr-llista{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:6px}
.gr-llista span{background:#eaf1fb;border:1px solid #c3d3ec;border-radius:999px;padding:3px 11px;font-weight:800;font-size:1rem}
.gr-llista span.fet{background:#e8f6ee;border-color:#1d8a4a;color:#1d8a4a;text-decoration:line-through}
.gr-dues{display:flex;flex-direction:column;gap:8px;width:100%;align-items:center}.gr-dues>svg{width:100%}
</style>`);

/* ---------- Utilitats ---------- */
const GR_N = '#1b1b1b', GR_T = '#f47b20', GR_B = '#2f6fd1', GR_V = '#1d8a4a', GR_R = '#cc3333', GR_L = '#e4eaf3', GR_L2 = '#b7c4d8';
const grR = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const grRo = v => Math.round(v * 1e6) / 1e6;
const grF = v => (v < 0 ? '−' : '') + fmtDec(Math.abs(grRo(v)));
const grP = ([x, y]) => `(${grF(x)}, ${grF(y)})`;
const grIg = (a, b) => Math.abs(a - b) < 1e-9;
const grPig = (p, q) => !!p && !!q && grIg(p[0], q[0]) && grIg(p[1], q[1]);
const grGiny = (rp, corr) => ({ resposta: { mode: 'giny', ...rp }, correctaHtml: corr, correctaTxt: textPla(corr) });
const grNum = s => { const t = String(s ?? '').trim().replace(/[−–]/g, '-').replace(/\s/g, '').replace(',', '.'); return /^[-+]?\d+(\.\d+)?$/.test(t) ? Number(t) : null; };
const grLletra = i => 'ABCDEFGHIJ'[i];
const grEsc2 = s => s.replace(/&/g, '&amp;');
const grTxt = (x, y, t, { mida = 13, anc = 'middle', col = GR_N, pes = 800, cls = '' } = {}) => `<text x="${grRo(x)}" y="${grRo(y)}" text-anchor="${anc}" font-size="${mida}" font-weight="${pes}" fill="${col}" ${cls ? `class="${cls}"` : ''}>${t}</text>`;
// formula y = ax + b (a, b enters) escrita bonica
function grFormula(a, b, v = 'x', y = 'y') {
  const ta = a === 1 ? v : a === -1 ? `−${v}` : `${grF(a)}${v}`;
  const tb = b === 0 ? '' : b > 0 ? ` + ${b}` : ` − ${-b}`;
  return `${y} = ${a === 0 ? grF(b) : ta + tb}`;
}

/* ---------- L'escena: una graella amb eixos ----------
   x0..x1, y0..y1: rang · sx, sy: cada quant hi ha una línia · lx, ly: cada quant hi ha un número
   cel: píxels per unitat (graelles de coordenades, quadrets quadrats) · si no, W×H fixos (gràfiques de funcions)
   tx, ty: noms dels eixos · cat: etiquetes de l'eix x (mesos, hores…) · y2: segon eix (climograma) */
function grEsc(o) {
  const E = { sx: 1, sy: 1, cel: 0, W: 520, H: 330, tx: '', ty: '', cat: null, y2: null, ...o };
  E.lx = E.lx || E.sx; E.ly = E.ly || E.sy; E.snapX = E.snapX || E.sx; E.snapY = E.snapY || E.sy;
  if (E.cat) { E.x0 = -0.5; E.x1 = E.cat.length - 0.5; E.snapX = 1; E.sx = 1; }
  E.cart = !!E.cel;
  E.ML = E.cart ? 30 : 50; E.MR = E.y2 ? 52 : E.cart ? 26 : 24; E.MT = E.ty ? 34 : 20; E.MB = E.cart ? 26 : 46;
  if (E.cart) { E.W = E.ML + E.MR + (E.x1 - E.x0) * E.cel; E.H = E.MT + E.MB + (E.y1 - E.y0) * E.cel; }
  E.kx = (E.W - E.ML - E.MR) / (E.x1 - E.x0); E.ky = (E.H - E.MT - E.MB) / (E.y1 - E.y0);
  E.px = x => grRo(E.ML + (x - E.x0) * E.kx); E.py = y => grRo(E.H - E.MB - (y - E.y0) * E.ky);
  E.ax = !E.cat && E.x0 <= 0 && E.x1 >= 0 ? 0 : E.x0; E.ay = E.y0 <= 0 && E.y1 >= 0 ? 0 : E.y0;
  return E;
}
const grMultiples = (a, b, s) => { const o = []; for (let k = Math.ceil(a / s - 1e-9); k * s <= b + 1e-9; k++) o.push(grRo(k * s)); return o; };
function grFons(E) {
  const { px, py } = E; let s = `<rect x="0" y="0" width="${E.W}" height="${E.H}" fill="#fff"/>`, l = '';
  const X0 = px(E.x0), X1 = px(E.x1), Y0 = py(E.y0), Y1 = py(E.y1);
  if (!E.cat) for (const x of grMultiples(E.x0, E.x1, E.sx)) l += `M${px(x)} ${Y0}V${Y1}`;
  for (const y of grMultiples(E.y0, E.y1, E.sy)) l += `M${X0} ${py(y)}H${X1}`;
  s += `<path d="${l}" stroke="${GR_L}" stroke-width="1.2" fill="none"/>`;
  let l2 = '';
  if (!E.cat) for (const x of grMultiples(E.x0, E.x1, E.lx)) l2 += `M${px(x)} ${Y0}V${Y1}`;
  for (const y of grMultiples(E.y0, E.y1, E.ly)) l2 += `M${X0} ${py(y)}H${X1}`;
  if (E.lx !== E.sx || E.ly !== E.sy) s += `<path d="${l2}" stroke="${GR_L2}" stroke-width="1.2" fill="none"/>`;
  // eixos amb fletxa
  const AX = px(E.ax), AY = py(E.ay);
  s += `<path d="M${X0 - (E.cart && E.x0 < 0 ? 6 : 0)} ${AY}H${X1 + 12}M${AX} ${Y0 + (E.cart && E.y0 < 0 ? 6 : 0)}V${Y1 - 12}" stroke="${GR_N}" stroke-width="2.4" fill="none"/>`;
  s += `<path d="M${X1 + 14} ${AY}l-9 -5v10Z M${AX} ${Y1 - 14}l-5 9h10Z" fill="${GR_N}"/>`;
  // números
  const f = E.fmt || grF;
  if (E.cat) E.cat.forEach((t, i) => { s += grTxt(px(i), AY + 17, t, { mida: E.cat.length > 8 ? 12 : 13 }); });
  else for (const x of grMultiples(E.x0, E.x1, E.lx)) { if (E.cart && x === 0 && E.ax === 0 && E.ay === 0) continue; s += `<path d="M${px(x)} ${AY - 4}v8" stroke="${GR_N}" stroke-width="2"/>` + grTxt(px(x), AY + 17, f(x)); }
  for (const y of grMultiples(E.y0, E.y1, E.ly)) { if (E.cart && y === 0 && E.ax === 0 && E.ay === 0 && E.x0 < 0) continue; s += `<path d="M${AX - 4} ${py(y)}h8" stroke="${GR_N}" stroke-width="2"/>` + grTxt(AX - 7, py(y) + 4.5, f(y), { anc: 'end' }); }
  if (E.cart && E.ax === 0 && E.ay === 0 && E.x0 < 0) s += grTxt(px(0) - 7, py(0) + 16, '0', { anc: 'end' });
  // noms dels eixos
  if (E.cart || E.xy) { s += grTxt(X1 + 16, AY - 8, 'x', { mida: 16, anc: 'end', col: GR_B }) + grTxt(AX + 9, Y1 - 4, 'y', { mida: 16, anc: 'start', col: GR_B }); }
  if (E.tx) s += grTxt((X0 + X1) / 2, E.H - 6, E.tx, { mida: 13, col: GR_B });
  if (E.ty) s += grTxt(4, 16, E.ty, { mida: 13, anc: 'start', col: GR_B });
  if (E.y2) { // segon eix a la dreta (pluja del climograma)
    const { a, b, l: ly2, t } = E.y2; const q = v => py(E.y0 + (v - a) / (b - a) * (E.y1 - E.y0));
    s += `<path d="M${X1} ${Y0}V${Y1 - 12}" stroke="${GR_N}" stroke-width="2.4"/><path d="M${X1} ${Y1 - 14}l-5 9h10Z" fill="${GR_N}"/>`;
    for (const v of grMultiples(a, b, ly2)) s += `<path d="M${X1 - 4} ${q(v)}h8" stroke="${GR_N}" stroke-width="2"/>` + grTxt(X1 + 7, q(v) + 4.5, f(v), { anc: 'start', col: '#2468b8' });
    if (t) s += grTxt(E.W - 4, 16, t, { mida: 13, anc: 'end', col: '#2468b8' });
  }
  return s;
}
// la recta y = m·x + b retallada dins la graella
function grRectaPts(E, m, b) {
  if (m === 0) return b >= E.y0 && b <= E.y1 ? [[E.x0, b], [E.x1, b]] : null;
  const xa = (E.y0 - b) / m, xb = (E.y1 - b) / m;
  const lo = Math.max(E.x0, Math.min(xa, xb)), hi = Math.min(E.x1, Math.max(xa, xb));
  return lo < hi ? [[lo, m * lo + b], [hi, m * hi + b]] : null;
}
const grFigSvg = (tipus, m) => tipus === 'robot' ? robot(m) : gatComa(m);
const grFigDim = (tipus, m) => tipus === 'robot' ? [m, Math.round(m * 160 / 150)] : [m, Math.round(m * .9)];
function grFigura(E, tipus, at, m = 40, cls = '') { // figura amb els peus al punt
  const [w, h] = grFigDim(tipus, m);
  return `<g class="${cls}" ${at ? `style="transform:translate(${E.px(at[0])}px,${E.py(at[1])}px)"` : ''}>${grFigSvg(tipus, m).replace('<svg ', `<svg x="${-w / 2}" y="${-h + 4}" `)}</g>`;
}
// capes que es dibuixen a sobre de la graella
function grCapes(E, capes = []) {
  const { px, py } = E; let s = '';
  for (const c of capes) {
    if (!c) continue;
    if (c.barres) { const w = Math.min(28, E.kx * (c.amp || .62)); for (const [x, v] of c.barres) { const y0 = py(Math.max(E.y0, c.base ?? E.y0)), y1 = py(v); s += `<rect x="${px(x) - w / 2}" y="${Math.min(y0, y1)}" width="${w}" height="${Math.abs(y0 - y1)}" fill="${c.col || '#6fa8e8'}" stroke="${c.vora || '#2468b8'}" stroke-width="1.5"/>`; } }
    if (c.ple) s += `<path d="M${c.ple.map(p => `${px(p[0])} ${py(p[1])}`).join('L')}Z" fill="${c.col || '#ffd9b8'}" ${c.cls ? `class="${c.cls}"` : ''}/>`;
    if (c.linia) s += `<path d="M${c.linia.map(p => `${px(p[0])} ${py(p[1])}`).join('L')}${c.tanca ? 'Z' : ''}" fill="none" stroke="${c.col || GR_T}" stroke-width="${c.w || 3.2}" stroke-linejoin="round" stroke-linecap="round" ${c.dash ? `stroke-dasharray="${c.dash}"` : ''} ${c.cls ? `class="${c.cls}"` : ''}/>`;
    if (c.recta) { const q = grRectaPts(E, c.recta[0], c.recta[1]); if (q) s += `<path d="M${px(q[0][0])} ${py(q[0][1])}L${px(q[1][0])} ${py(q[1][1])}" stroke="${c.col || GR_B}" stroke-width="${c.w || 3}" fill="none" ${c.dash ? `stroke-dasharray="${c.dash}"` : ''} ${c.cls ? `class="${c.cls}"` : ''}/>`; }
    if (c.cami) { // camí de l'origen fins al punt: primer en horitzontal, després en vertical
      const [x, y] = c.cami, ox = c.des?.[0] ?? E.ax, oy = c.des?.[1] ?? E.ay;
      s += `<path d="M${px(ox)} ${py(oy)}H${px(x)}" stroke="${GR_T}" stroke-width="4" stroke-dasharray="7 5" fill="none"/><path d="M${px(x)} ${py(oy)}V${py(y)}" stroke="${GR_B}" stroke-width="4" stroke-dasharray="7 5" fill="none"/>`;
    }
    if (c.pt) { const [x, y] = c.pt, r = c.r || 6.5; s += `<circle cx="${px(x)}" cy="${py(y)}" r="${r}" fill="${c.buit ? '#fff' : c.col || GR_T}" stroke="${c.buit ? c.col || GR_V : '#fff'}" stroke-width="${c.buit ? 3.5 : 2}" ${c.cls ? `class="${c.cls}"` : ''}/>`;
      if (c.lab) { const dx = c.dx ?? 9, dy = c.dy ?? -9; s += grTxt(px(x) + dx, py(y) + dy, c.lab, { mida: c.mida || 16, anc: dx < 0 ? 'end' : 'start', col: c.colLab || GR_N, pes: 900 }); } }
    if (c.fig) s += grFigura(E, c.fig, c.at, c.m || 40) + `<circle cx="${px(c.at[0])}" cy="${py(c.at[1])}" r="3.5" fill="${GR_N}"/>`;
    if (c.txt) s += grTxt(px(c.at[0]) + (c.dx || 0), py(c.at[1]) + (c.dy || 0), c.txt, { mida: c.mida || 14, anc: c.anc || 'middle', col: c.col || GR_N });
    if (c.bola) { const [x, y] = c.bola, X = px(x) + (c.dx || 0), Y = py(y) + (c.dy || 0); s += `<circle cx="${X}" cy="${Y}" r="13" fill="#fff" stroke="${c.col || GR_N}" stroke-width="2.5"/>` + grTxt(X, Y + 5, c.lab, { mida: 14, col: c.col || GR_N }); }
  }
  return s;
}
const grSvg = (E, capes, cls = 'gr-vis', extra = '') => `<svg class="${cls}" viewBox="0 0 ${E.W} ${E.H}" role="img" aria-label="Gràfica">${grFons(E)}${grCapes(E, capes)}${extra}</svg>`;

/* ---------- En Coma, al costat de cada graella ---------- */
const grComaHtml = txt => `<div class="gr-coma">${gatComa(46, 'gr-gat')}<span class="gr-baf">${txt}</span></div>`;
function grComaDiu(z, txt, estat) {
  const g = $('.gr-gat', z), b = $('.gr-baf', z); if (b) b.innerHTML = txt;
  if (g && estat) { g.classList.remove('salta', 'trist'); void g.getBoundingClientRect(); g.classList.add(estat === 'ok' ? 'salta' : 'trist'); }
  if (estat === 'ok') setTimeout(() => so('meu'), 380);
}
const GR_OK = ['Meu! Perfecte!', 'Meu, meu! Molt bé!', 'Ronc, ronc… Genial!', 'Meu! Així es fa!'];

/* ---------- Activitat: situar punts a la graella ----------
   mode 'un': un sol punt (FR-4C o una marca que es mou) · 'conjunt': diversos punts en qualsevol ordre (clic = posa / treu)
   'ordre': punts en ordre, units amb una línia (dibuixos) · 'columna': un punt per columna (gràfic de temperatures) */
function grPosa(o) {
  const { E, capes = [], mode = 'conjunt', fig = null, ini = null, obj, nota = '', coma = '', fi = null, lletres = false } = o;
  const n = obj.length;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  const snp = (v, s, a, b) => grRo(cl(Math.round(v / s) * s, Math.ceil(a / s - 1e-9) * s, Math.floor(b / s + 1e-9) * s));
  const nus = (x, y) => [E.cat ? cl(Math.round(x), 0, E.cat.length - 1) : snp(x, E.snapX, E.x0, E.x1), snp(y, E.snapY, E.y0, E.y1)];
  const pts = G => mode === 'columna' ? G.pts.map((y, i) => y == null ? null : [i, y]).filter(Boolean) : G.pts;
  const din = G => {
    let s = ''; const q = pts(G);
    if ((mode === 'ordre' || mode === 'columna') && q.length > 1) s += `<path d="M${q.map(p => `${E.px(p[0])} ${E.py(p[1])}`).join('L')}" fill="none" stroke="${GR_T}" stroke-width="3.2" stroke-linejoin="round"/>`;
    if (mode === 'un' && fig) return s;
    q.forEach((p, i) => { s += `<circle cx="${E.px(p[0])}" cy="${E.py(p[1])}" r="7.5" fill="${GR_T}" stroke="#fff" stroke-width="2"/>`; if (mode === 'ordre') s += grTxt(E.px(p[0]) + 10, E.py(p[1]) - 9, grLletra(i), { mida: 15, anc: 'start', pes: 900 }); });
    return s;
  };
  const inici = () => ({ pts: mode === 'columna' ? obj.map(() => null) : [], cur: E.cat ? [0, snp((E.y0 + E.y1) / 2, E.snapY, E.y0, E.y1)] : (ini ? ini.slice() : [E.ax, E.ay]), mog: false });
  const notaTxt = G => mode === 'un' ? (nota || 'Clica a la graella, o mou-te amb les fletxes del teclat.')
    : mode === 'columna' ? `Clica a cada columna a l'altura bona (o fletxes i Enter). Punts: <b>${pts(G).length} de ${n}</b>.`
    : `Clica per posar un punt; clica'l una altra vegada per treure'l. Punts: <b>${G.pts.length} de ${n}</b>.`;
  const etiq = G => {
    const q = pts(G); const T = mode === 'columna' ? obj : obj;
    for (const p of q) { if (T.some(t => grPig(p, t))) continue;
      if (T.some(t => !grIg(t[0], t[1]) && grPig(p, [t[1], t[0]]))) return 'rSwap';
      if (T.some(t => grPig(p, [-t[0], t[1]]) || grPig(p, [t[0], -t[1]]) || grPig(p, [-t[0], -t[1]]))) return 'rSigne';
      if ((E.sx !== 1 || E.sy !== 1) && E.cart && T.some(t => grPig(p, [t[0] / E.sx, t[1] / E.sy]))) return 'rEscala';
    }
    return mode === 'un' ? null : 'rPunts';
  };
  const okF = G => mode === 'un' ? grPig(G.pts[0], obj[0]) : mode === 'ordre' ? G.pts.length === n && obj.every((t, i) => grPig(G.pts[i], t))
    : mode === 'columna' ? obj.every((t, i) => G.pts[i] != null && grIg(G.pts[i], t[1])) : G.pts.length === n && obj.every(t => G.pts.some(p => grPig(p, t)));
  const fin = ok => { // capa final: solució i, si està bé, el premi (la recta, el dibuix…)
    let s = '';
    if (ok && fi) s += grCapes(E, fi);
    return s;
  };
  return {
    inici,
    munta(z, G, ctx) {
      const figHtml = mode === 'un' && fig ? grFigura(E, fig, G.pts[0] || ini || [E.ax, E.ay], 42, 'gr-fig') : '';
      z.innerHTML = `<div class="gr-g"><svg class="gr-svg act" viewBox="0 0 ${E.W} ${E.H}" tabindex="0" role="application" aria-label="Graella: clica o fes servir les fletxes i Enter">${grFons(E)}${grCapes(E, capes)}<g class="gr-din">${din(G)}</g><g class="gr-fin"></g>${figHtml}<circle class="gr-cur" r="12" cx="${E.px(G.cur[0])}" cy="${E.py(G.cur[1])}"/></svg>
        <div class="gr-ctl">${mode === 'un' ? `<button data-mou="-1,0" title="Esquerra">◀</button><button data-mou="0,1" title="Amunt">▲</button><button data-mou="0,-1" title="Avall">▼</button><button data-mou="1,0" title="Dreta">▶</button>` : `<button data-gr="desfes" title="Treu l'últim punt">↩ Desfés</button><button data-gr="esborra">Esborra-ho tot</button>`}<span style="flex:0 0 12px"></span>${grComaHtml(coma || (mode === 'ordre' ? 'Uneix els punts en ordre. Què sortirà?' : 'Meu! Jo t\'ajudo.'))}</div>
        <p class="gr-nota">${notaTxt(G)}</p></div>`;
      const svg = $('.gr-svg', z);
      const pinta = () => {
        $('.gr-din', svg).innerHTML = din(G);
        const f = $('.gr-fig', svg); const at = G.pts[0] || ini || [E.ax, E.ay]; if (f) f.style.transform = `translate(${E.px(at[0])}px,${E.py(at[1])}px)`;
        const c = $('.gr-cur', svg); c.setAttribute('cx', E.px(G.cur[0])); c.setAttribute('cy', E.py(G.cur[1]));
        $('.gr-nota', z).innerHTML = notaTxt(G); ctx.canvi();
      };
      G.pinta = pinta;
      const acc = (x, y) => {
        if (mode === 'un') { G.pts = [[x, y]]; G.mog = true; so('to', 520 + 30 * (x - E.x0)); }
        else if (mode === 'columna') { G.pts[x] = G.pts[x] != null && grIg(G.pts[x], y) ? null : y; so(G.pts[x] == null ? 'treu' : 'pas'); }
        else {
          const k = G.pts.findIndex(p => grPig(p, [x, y]));
          if (mode === 'ordre') { if (k >= 0 && k === G.pts.length - 1) { G.pts.pop(); so('treu'); } else if (k >= 0) { so('ko'); return; } else if (G.pts.length < n) { G.pts.push([x, y]); so('to', 440 + 40 * G.pts.length); } }
          else if (k >= 0) { G.pts.splice(k, 1); so('treu'); }
          else if (G.pts.length < n) { G.pts.push([x, y]); so('pas'); }
          else { grComaDiu(z, `Ja hi ha ${n} punts. Clica'n un per treure'l.`, 'ko'); return; }
        }
        pinta();
      };
      G.acc = acc;
      const coord = e => { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const q = pt.matrixTransform(svg.getScreenCTM().inverse()); return nus(E.x0 + (q.x - E.ML) / E.kx, E.y0 + (E.H - E.MB - q.y) / E.ky); };
      svg.onclick = e => { if (!ctx.actiu()) return; const [x, y] = coord(e); G.cur = [x, y]; acc(x, y); svg.focus(); };
      svg.onmousemove = e => { if (!ctx.actiu()) return; G.cur = coord(e); const c = $('.gr-cur', svg); c.setAttribute('cx', E.px(G.cur[0])); c.setAttribute('cy', E.py(G.cur[1])); };
      const mou = (dx, dy) => { const [x, y] = nus(G.cur[0] + dx * (E.cat ? 1 : E.snapX), G.cur[1] + dy * E.snapY); G.cur = [x, y]; if (mode === 'un') acc(x, y); else pinta(); };
      svg.onkeydown = e => {
        if (!ctx.actiu()) return;
        const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
        if (d) { e.preventDefault(); e.stopPropagation(); mou(...d); return; }
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); if (mode === 'un' && e.key === 'Enter') { if (G.mog) ctx.envia(); else acc(...G.cur); } else acc(...G.cur); }
      };
      $('.gr-ctl', z).onclick = e => {
        const b = e.target.closest('button'); if (!b || !ctx.actiu()) return;
        if (b.dataset.mou) { const [dx, dy] = b.dataset.mou.split(',').map(Number); mou(dx, dy); return; }
        if (b.dataset.gr === 'desfes') { if (mode === 'columna') { const i = G.pts.map((v, k) => v == null ? -1 : k).filter(k => k >= 0).pop(); if (i != null) G.pts[i] = null; } else G.pts.pop(); so('treu'); pinta(); }
        if (b.dataset.gr === 'esborra') { G.pts = mode === 'columna' ? obj.map(() => null) : []; so('treu'); pinta(); }
      };
      svg.focus({ preventScroll: true });
    },
    fet: G => mode === 'un' ? G.mog && G.pts.length === 1 : mode === 'columna' ? G.pts.every(v => v != null) : G.pts.length === n,
    ok: okF,
    txt: G => mode === 'un' ? `punt ${textPla(grP(G.pts[0]))}` : pts(G).map(p => textPla(grP(p))).join(' '),
    etiq,
    tanca(z, G, ok) {
      const svg = $('.gr-svg', z); svg.classList.remove('act'); svg.removeAttribute('tabindex');
      $$('.gr-ctl button', z).forEach(b => b.disabled = true); $('.gr-nota', z)?.remove();
      let s = '';
      if (!ok) { // punts mal posats en vermell i els bons, en verd
        for (const p of pts(G)) if (!obj.some(t => grPig(p, t))) s += `<circle cx="${E.px(p[0])}" cy="${E.py(p[1])}" r="8" fill="${GR_R}" stroke="#fff" stroke-width="2"/>`;
        for (const t of obj) if (!pts(G).some(p => grPig(p, t))) s += `<circle cx="${E.px(t[0])}" cy="${E.py(t[1])}" r="9" fill="none" stroke="${GR_V}" stroke-width="3.5"/>`;
        if (mode === 'columna' || mode === 'ordre') s += `<path d="M${obj.map(p => `${E.px(p[0])} ${E.py(p[1])}`).join('L')}${mode === 'ordre' && o.tancat ? 'Z' : ''}" fill="none" stroke="${GR_V}" stroke-width="2.5" stroke-dasharray="6 5"/>`;
        if (mode === 'un' && o.revela) s += grFigura(E, o.revela, obj[0], 40);
      } else s += fin(true);
      $('.gr-fin', svg).innerHTML = s;
      grComaDiu(z, ok ? (o.premi || tria(GR_OK)) : 'Mira on anaven: en <b style="color:#1d8a4a">verd</b>.', ok ? 'ok' : 'ko');
    },
    demo: resolt => grSvg(E, [...capes, ...(resolt ? (mode === 'un' && fig ? [{ fig, at: obj[0], m: 40 }] : obj.map(p => ({ pt: p }))) : (mode === 'un' && fig && ini ? [{ fig, at: ini, m: 40 }] : [])), ...(resolt && (mode === 'ordre' || mode === 'columna') ? [{ linia: obj, tanca: !!o.tancat }] : []), ...(resolt && fi ? fi : [])]),
    resol(z, G, be) {
      const dolent = t => { const c = [[t[1], t[0]], [t[0] + E.snapX, t[1]], [t[0] - E.snapX, t[1]], [t[0], t[1] + E.snapY], [t[0], t[1] - E.snapY]]; return c.find(p => !grPig(p, t) && p[0] >= E.x0 && p[0] <= E.x1 && p[1] >= E.y0 && p[1] <= E.y1 && !obj.some(q => grPig(q, p))); };
      if (mode === 'columna') { G.pts = obj.map(t => t[1]); if (!be) G.pts[0] = G.pts[0] + E.snapY <= E.y1 ? G.pts[0] + E.snapY : G.pts[0] - E.snapY; }
      else { G.pts = obj.map(p => p.slice()); if (!be) G.pts[G.pts.length - 1] = dolent(obj[obj.length - 1]); }
      if (mode === 'un') G.mog = true;
      G.pinta();
    }
  };
}

/* ---------- Activitat: llegir les coordenades d'un punt ---------- */
function grLlegeix({ E, capes, obj, coma = '' }) {
  return {
    inici: () => ({ x: '', y: '' }),
    munta(z, G, ctx) {
      z.innerHTML = `<div class="gr-g">${grSvg(E, capes, 'gr-svg')}<div class="gr-coord">(<label><input data-c="x" inputmode="text" maxlength="5" autocomplete="off" aria-label="Coordenada x"><small>x</small></label>,<label><input data-c="y" inputmode="text" maxlength="5" autocomplete="off" aria-label="Coordenada y"><small>y</small></label>)</div>
        <div class="gr-ctl">${grComaHtml(coma || 'Primer la <b>x</b>, després la <b>y</b>. Si és negatiu, escriu el signe −.')}</div></div>`;
      const [ix, iy] = $$('.gr-coord input', z);
      [ix, iy].forEach(inp => {
        inp.oninput = () => { inp.value = inp.value.replace(/[^0-9\-−–,.]/g, ''); G[inp.dataset.c] = inp.value; ctx.canvi(); };
        inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); if (inp === ix && grNum(G.y) == null) iy.focus(); else ctx.envia(); } };
      });
      ix.focus();
    },
    fet: G => grNum(G.x) != null && grNum(G.y) != null,
    ok: G => grPig([grNum(G.x), grNum(G.y)], obj),
    txt: G => textPla(grP([grNum(G.x), grNum(G.y)])),
    etiq: G => { const p = [grNum(G.x), grNum(G.y)], [x, y] = obj;
      if (!grIg(x, y) && grPig(p, [y, x])) return 'rSwap';
      if (grPig(p, [-x, y]) || grPig(p, [x, -y]) || grPig(p, [-x, -y]) || grPig(p, [-y, x]) || grPig(p, [y, -x])) return 'rSigne';
      if ((E.sx !== 1 || E.sy !== 1) && grPig(p, [x / E.sx, y / E.sy])) return 'rEscala';
      return null; },
    tanca(z, G, ok) {
      const p = [grNum(G.x), grNum(G.y)];
      $$('.gr-coord input', z).forEach((inp, k) => { inp.disabled = true; inp.classList.add(grIg(p[k], obj[k]) ? 'be' : 'mal'); });
      if (!ok) { const svg = $('.gr-svg', z); svg.insertAdjacentHTML('beforeend', grCapes(E, [{ cami: obj }, { pt: obj, col: GR_V, lab: textPla(grP(obj)), colLab: GR_V, dx: 10, dy: 22 }])); }
      grComaDiu(z, ok ? tria(GR_OK) : `És el <b>${grP(obj)}</b>: primer ${grF(obj[0])} en horitzontal, després ${grF(obj[1])} en vertical.`, ok ? 'ok' : 'ko');
    },
    demo: resolt => grSvg(E, [...capes, ...(resolt ? [{ cami: obj }, { pt: obj, lab: textPla(grP(obj)), dx: 10, dy: 22 }] : [])]),
    resol(z, G, be) { const [ix, iy] = $$('.gr-coord input', z); const v = be ? obj : [obj[1] === obj[0] ? obj[0] + 1 : obj[1], obj[0]]; ix.value = grF(v[0]).replace('−', '-'); iy.value = grF(v[1]).replace('−', '-'); ix.oninput(); iy.oninput(); }
  };
}

/* ---------- Activitat: omplir una taula de valors ----------
   cols: [{x, y, bx (x buida), by (y buida)}] · capX, capY: capçaleres */
function grTaula({ cols, capX = 'x', capY = 'y', coma = '' }) {
  const cel = (c, k, eix) => (eix === 'x' ? c.bx : c.by) ? `<td><input data-k="${k}" data-e="${eix}" inputmode="text" maxlength="6" autocomplete="off" aria-label="${eix} de la columna ${k + 1}"></td>` : `<td class="dada">${grF(eix === 'x' ? c.x : c.y)}</td>`;
  const buides = []; cols.forEach((c, k) => { if (c.bx) buides.push([k, 'x']); if (c.by) buides.push([k, 'y']); });
  const val = (c, e) => e === 'x' ? c.x : c.y;
  const taula = (resolt) => `<table class="gr-taula"><tr><th>${capX}</th>${cols.map((c, k) => resolt && c.bx ? `<td class="marca">${grF(c.x)}</td>` : cel(c, k, 'x')).join('')}</tr><tr><th>${capY}</th>${cols.map((c, k) => resolt && c.by ? `<td class="marca">${grF(c.y)}</td>` : cel(c, k, 'y')).join('')}</tr></table>`;
  return {
    inici: () => ({ v: {} }),
    munta(z, G, ctx) {
      z.innerHTML = `<div class="gr-g">${taula(false)}<p class="gr-nota">Si el resultat és negatiu, escriu el signe −. Amb Enter passes a la casella següent.</p><div class="gr-ctl">${grComaHtml(coma || 'Calcula cada casella amb la regla. Meu!')}</div></div>`;
      const ins = $$('.gr-taula input', z);
      ins.forEach((inp, i) => {
        inp.oninput = () => { inp.value = inp.value.replace(/[^0-9\-−–,.]/g, ''); G.v[inp.dataset.k + inp.dataset.e] = inp.value; ctx.canvi(); };
        inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); const nx = ins.slice(i + 1).concat(ins.slice(0, i)).find(x => grNum(x.value) == null); if (nx) nx.focus(); else ctx.envia(); } };
      });
      ins[0]?.focus();
    },
    fet: G => buides.every(([k, e]) => grNum(G.v[k + e]) != null),
    ok: G => buides.every(([k, e]) => grIg(grNum(G.v[k + e]), val(cols[k], e))),
    txt: G => buides.map(([k, e]) => `${e}=${G.v[k + e]}`).join(' '),
    etiq: G => buides.some(([k, e]) => { const v = grNum(G.v[k + e]), t = val(cols[k], e); return !grIg(v, t) && grIg(v, -t); }) ? 'rSigne' : 'rTaula',
    tanca(z, G, ok) {
      $$('.gr-taula input', z).forEach(inp => { const t = val(cols[+inp.dataset.k], inp.dataset.e); const b = grIg(grNum(inp.value), t); inp.disabled = true; inp.classList.add(b ? 'be' : 'mal'); if (!b) inp.insertAdjacentHTML('afterend', `<div style="color:#1d8a4a;font-weight:900;font-size:1rem">${grF(t)}</div>`); });
      $('.gr-nota', z)?.remove();
      grComaDiu(z, ok ? tria(GR_OK) : 'Les bones són les verdes.', ok ? 'ok' : 'ko');
    },
    demo: resolt => taula(resolt),
    resol(z, G, be) { $$('.gr-taula input', z).forEach((inp, i) => { const t = val(cols[+inp.dataset.k], inp.dataset.e); inp.value = grF(!be && i === 0 ? t + 1 : t).replace('−', '-'); inp.oninput(); }); }
  };
}
// taula estàtica per als enunciats
const grTaulaHtml = (cols, capX = 'x', capY = 'y', cls = 'petita') => `<table class="gr-taula ${cls}"><tr><th>${capX}</th>${cols.map(c => `<td class="dada">${c[0]}</td>`).join('')}</tr><tr><th>${capY}</th>${cols.map(c => `<td class="dada">${c[1]}</td>`).join('')}</tr></table>`;

/* ---------- recordatori de les coordenades (amb en Coma) ---------- */
const grRecord = () => `<div class="gr-rec">${gatComa(48)}<div><b>(x, y)</b> · primer la <b>x</b>: camina pel passadís ↔<br>després la <b>y</b>: puja o baixa per l'escala ↕</div></div>`;

/* =====================================================================
   OBJECTIUS 1 i 2 · LLEGIR I SITUAR PUNTS
   N1: només el primer quadrant (0 a 8) · N2: els quatre quadrants · N3: cada quadret val 2
   ===================================================================== */
const grEscR1 = nv => nv === 1 ? grEsc({ x0: 0, x1: 8, y0: 0, y1: 8, cel: 34 })
  : nv === 2 ? grEsc({ x0: -6, x1: 6, y0: -5, y1: 5, cel: 30 })
  : grEsc({ x0: -12, x1: 12, y0: -10, y1: 10, sx: 2, sy: 2, lx: 4, ly: 4, cel: 15 });
function grPuntEsc(E, { eix = false, evita = [], alt = false, dist = 2 } = {}) { // un punt de la graella (no a l'origen)
  const xs = grMultiples(E.x0 + E.sx, E.x1 - E.sx, E.sx), ys = grMultiples(E.y0 + E.sy, E.y1 - (alt ? 2 : 1) * E.sy, E.sy);
  for (let k = 0; k < 300; k++) {
    let x = tria(xs), y = tria(ys);
    if (eix) { if (Math.random() < .5) x = 0; else y = 0; if (x === 0 && y === 0) continue; }
    else if (x === 0 || y === 0) continue;
    if (evita.some(p => Math.abs(p[0] - x) < dist * E.sx && Math.abs(p[1] - y) < dist * E.sy)) continue;
    return [x, y];
  }
  return [xs[0], ys[0]];
}
const grEscalaNota = E => E.sx !== 1 ? ' Compte amb l\'<b>escala</b>: cada quadret val ' + grF(E.sx) + '.' : '';
const grVisRec = (c, x) => !x?.prova && (x?.nivell === 1 || c) ? grRecord() : '';
const PISTA_GR1 = { completa: `Surt del <b>0</b>. Primer la <b>x</b>: quant camines cap a la dreta (+) o cap a l'esquerra (−). Després la <b>y</b>: quant puges (+) o baixes (−).`, mitja: 'Primer la x (horitzontal) i després la y (vertical).' };
const PISTA_GR2 = { completa: `Surt del <b>0</b>. Primer la <b>x</b>: camina cap a la dreta si és positiva, o cap a l'esquerra si és negativa. Després la <b>y</b>: puja si és positiva, baixa si és negativa.`, mitja: 'Primer la x (camina), després la y (puja o baixa).' };
const grSolPunt = (p, E) => [`Des del 0, camina en horitzontal: <b>x = ${grF(p[0])}</b>${p[0] < 0 ? ' (cap a l\'esquerra)' : p[0] === 0 ? ' (no et mous)' : ''}.`, `Després puja o baixa: <b>y = ${grF(p[1])}</b>${p[1] < 0 ? ' (avall)' : p[1] === 0 ? ' (no et mous)' : ''}.${E.sx !== 1 ? ' Cada quadret val ' + grF(E.sx) + '.' : ''}`, `El punt és <b>${grP(p)}</b>.`];

const GR1 = {};
GR1.llegeix = (nv, { fig = 'punt', eix = false } = {}) => {
  const E = grEscR1(nv); const p = grPuntEsc(E, { eix: eix && fig === 'punt', alt: fig !== 'punt' });
  const capes = fig === 'punt' ? [{ pt: p, lab: 'P' }] : [{ fig, at: p, m: 40 }];
  const enun = fig === 'robot' ? `On és <b>FR-4C</b>? Escriu les coordenades del punt on té els peus.` : fig === 'coma' ? `En <b>Coma</b> s'ha amagat a la graella. Escriu les coordenades d'on és (el punt negre, als peus).` : `Escriu les coordenades del punt <b>P</b>.`;
  return { sig: `ll-${fig}-${p}`, enunciat: enun + grEscalaNota(E), visual: grVisRec, pista: PISTA_GR1,
    ...grGiny(grLlegeix({ E, capes, obj: p, coma: fig === 'coma' ? 'Meu! On sóc? Primer la x, després la y.' : '' }), `<b>${grP(p)}</b>`),
    explicacio: `${grF(p[0])} en horitzontal i ${grF(p[1])} en vertical: <b>${grP(p)}</b>.`, solucio: grSolPunt(p, E) };
};
GR1.quin = nv => { // diversos punts amb lletra: quin és el (a, b)?
  const E = grEscR1(nv); const pts = [];
  let a; for (let k = 0; k < 200; k++) { a = grPuntEsc(E); if (!grIg(a[0], a[1]) && a[1] >= E.x0 && a[1] <= E.x1 && a[0] >= E.y0 && a[0] <= E.y1 && Math.abs(a[0] - a[1]) >= 2 * E.sx) break; }
  pts.push(a, [a[1], a[0]]);
  while (pts.length < 5) pts.push(grPuntEsc(E, { evita: pts }));
  const ord = barreja(pts); const L = p => grLletra(ord.findIndex(q => grPig(q, p)));
  const c = tria(pts.slice(2));
  const item = p => { const et = {}; const sw = ord.find(q => grPig(q, [p[1], p[0]])); if (sw && !grPig(sw, p)) et[L(sw)] = 'rSwap'; ord.forEach(q => { if (!et[L(q)] && (grPig(q, [-p[0], p[1]]) || grPig(q, [p[0], -p[1]]))) et[L(q)] = 'rSigne'; });
    return { tipus: 'tria', html: `El punt <b>${grP(p)}</b> és el…`, opcions: ord.map((_, i) => ({ html: `<b>${grLletra(i)}</b>`, val: grLletra(i) })), correcta: L(p), etiq: et }; };
  const its = barreja([item(a), item(c)]);
  return { sig: `qn-${ord.join('|')}`, enunciat: `Mira la graella. Quina lletra té cada punt?${grEscalaNota(E)}`, visual: () => grSvg(E, ord.map((p, i) => ({ pt: p, lab: grLletra(i) }))), pista: PISTA_GR1, ...apartats(its),
    explicacio: `Primer la x i després la y. Compte amb els punts girats, com ${grP(a)} i ${grP([a[1], a[0]])}: no són el mateix!`, solucio: [a, c].map(p => `${grP(p)}: ${grF(p[0])} en horitzontal i ${grF(p[1])} en vertical → punt <b>${L(p)}</b>.`) };
};
const GR_QUAD = [{ val: '1', html: '1r quadrant' }, { val: '2', html: '2n quadrant' }, { val: '3', html: '3r quadrant' }, { val: '4', html: '4t quadrant' }, { val: 'e', html: 'Sobre un eix' }];
const grQuadDe = ([x, y]) => x === 0 || y === 0 ? 'e' : x > 0 ? (y > 0 ? '1' : '4') : (y > 0 ? '2' : '3');
GR1.quadrant = nv => {
  const E = grEscR1(nv); const pts = []; const usats = new Set();
  const vol = barreja(nv === 3 ? ['1', '2', '3', '4', 'e'] : ['1', '2', '3', '4']).slice(0, 3);
  for (const q of vol) { let p; for (let k = 0; k < 300; k++) { p = grPuntEsc(E, { eix: q === 'e', evita: pts }); if (grQuadDe(p) === q) break; } pts.push(p); usats.add(q); }
  const noms = ['P', 'Q', 'R'];
  const its = pts.map((p, i) => ({ tipus: 'tria', html: `El punt <b>${noms[i]}</b> és al…`, opcions: GR_QUAD.filter(o => nv === 3 || o.val !== 'e'), correcta: grQuadDe(p), etiq: {} }));
  return { sig: `qd-${pts.join('|')}`, enunciat: `En quin <b>quadrant</b> és cada punt?`, visual: () => grSvg(E, pts.map((p, i) => ({ pt: p, lab: noms[i] }))), pista: { completa: `Els quadrants es compten començant per <b>dalt a la dreta</b> (1r) i girant cap a l'esquerra: dalt a l'esquerra (2n), baix a l'esquerra (3r) i baix a la dreta (4t).`, mitja: 'El 1r quadrant és el de dalt a la dreta.' }, ...apartats(its),
    explicacio: `1r: dalt a la dreta · 2n: dalt a l'esquerra · 3r: baix a l'esquerra · 4t: baix a la dreta.`, solucio: pts.map((p, i) => `${noms[i]} ${grP(p)}: ${GR_QUAD.find(o => o.val === grQuadDe(p)).html}.`) };
};
const grEscQuad = () => grSvg(grEscR1(2), [{ txt: '1r', at: [3, 2.5], mida: 30, col: '#c9d3e2' }, { txt: '2n', at: [-3, 2.5], mida: 30, col: '#c9d3e2' }, { txt: '3r', at: [-3, -3], mida: 30, col: '#c9d3e2' }, { txt: '4t', at: [3, -3], mida: 30, col: '#c9d3e2' }]);
TEMES.r1 = {
  gen: GR1,
  sequencia: {
    1: [['llegeix', { fig: 'coma' }], ['llegeix', { fig: 'robot' }], ['quin'], ['llegeix'], ['llegeix', { fig: 'coma' }], ['quin'], ['llegeix', { eix: true }], ['llegeix', { fig: 'robot' }], ['quin'], ['llegeix'], ['llegeix', { fig: 'coma' }], ['quin']],
    2: [['llegeix', { fig: 'coma' }], ['quin'], ['quadrant'], ['llegeix', { fig: 'robot' }], ['llegeix', { eix: true }], ['quin'], ['quadrant'], ['llegeix'], ['llegeix', { fig: 'coma' }], ['quin'], ['llegeix', { eix: true }], ['quadrant']],
    3: [['llegeix', { fig: 'coma' }], ['quin'], ['quadrant'], ['llegeix', { fig: 'robot' }], ['llegeix', { eix: true }], ['quin'], ['quadrant'], ['llegeix'], ['llegeix', { fig: 'coma' }], ['quin'], ['llegeix', { eix: true }], ['quadrant']]
  },
  explicacio: [
    { text: `<p>Una graella té dos <b>eixos</b>: l'eix <b class="parpelleja">x</b> (horitzontal) i l'eix <b>y</b> (vertical).</p><p class="petit">Es creuen al punt (0, 0), que es diu <b>origen</b>.</p>`, vis: () => grSvg(grEscR1(1), [{ pt: [0, 0], lab: 'origen (0, 0)', dx: 10, dy: -10 }]) },
    { text: `<p>Per arribar al punt <b>(4, 3)</b>: primer <b class="parpelleja">4 pel passadís</b> → i després <b>3 per l'escala</b> ↑.</p><p class="petit">Sempre primer la x i després la y. En Coma ja hi és!</p>`, vis: () => grSvg(grEscR1(1), [{ cami: [4, 3] }, { fig: 'coma', at: [4, 3] }]) },
    { text: `<p>A l'<b>esquerra</b> del 0, la x és <b class="parpelleja">negativa</b>. A <b>sota</b> del 0, la y és negativa.</p><p class="petit">El punt (−3, −2): 3 cap a l'esquerra i 2 avall.</p>`, vis: () => grSvg(grEscR1(2), [{ cami: [-3, -2] }, { pt: [-3, -2], lab: '(−3, −2)', dx: -10, dy: 20 }]) },
    { text: `<p>Els eixos parteixen la graella en <b>4 quadrants</b>.</p><p class="petit">Es compten començant per dalt a la dreta i girant cap a l'esquerra.</p>`, vis: grEscQuad }
  ],
  exemple: nv => {
    const E = grEscR1(nv), p = nv === 1 ? [5, 2] : nv === 2 ? [-4, 3] : [6, -8];
    return { enunciat: `Quines coordenades té el punt P?${grEscalaNota(E)}`, passos: [
      { text: `Surto del 0 i camino en horitzontal fins a sota (o sobre) del punt: <b>${grF(p[0])}</b>${p[0] < 0 ? ', cap a l\'esquerra' : ''}.${nv === 3 ? ' Cada quadret val 2: 3 quadrets són 6.' : ''}`, vis: grSvg(E, [{ pt: p, lab: 'P' }, { linia: [[0, 0], [p[0], 0]], dash: '7 5', w: 4 }]) },
      { text: `Ara ${p[1] > 0 ? 'pujo' : 'baixo'} fins al punt: <b>${grF(p[1])}</b>. El punt és <b>${grP(p)}</b>. <span class="marca-ok">✓</span>`, vis: grSvg(E, [{ pt: p, lab: 'P' }, { cami: p }]) }] };
  }
};

const GR2 = {};
GR2.porta = nv => {
  const E = grEscR1(nv); const p = grPuntEsc(E, { alt: true, evita: [[0, 0]] });
  return { sig: `po-${p}`, enunciat: `Porta <b>FR-4C</b> al punt <b>${grP(p)}</b>.${grEscalaNota(E)}`, visual: grVisRec, pista: PISTA_GR2,
    ...grGiny(grPosa({ E, mode: 'un', fig: 'robot', ini: [E.ax, E.ay], obj: [p], nota: 'Mou-lo amb les fletxes del teclat (o els botons) o clica on ha d\'anar. Enter per comprovar.', coma: `Porta'l al <b>${grP(p)}</b>!`, premi: 'Meu! FR-4C ha arribat!' }), `<b>${grP(p)}</b>`),
    explicacio: `Primer ${grF(p[0])} en horitzontal i després ${grF(p[1])} en vertical.`, solucio: grSolPunt(p, E) };
};
GR2.amaga = nv => {
  const E = grEscR1(nv); const p = grPuntEsc(E, { alt: true });
  return { sig: `am-${p}`, enunciat: `En <b>Coma</b> s'ha amagat al punt <b>${grP(p)}</b>. Clica on és per trobar-lo.${grEscalaNota(E)}`, visual: grVisRec, pista: PISTA_GR2,
    ...grGiny(grPosa({ E, mode: 'un', obj: [p], nota: 'Clica el punt de la graella (o fletxes i Enter). Després, Comprova.', coma: 'On sóc? Meu…', fi: [{ fig: 'coma', at: p, m: 40 }], revela: 'coma', premi: 'Meu! M\'has trobat!' }), `<b>${grP(p)}</b>`),
    explicacio: `En Coma era al ${grP(p)}.`, solucio: grSolPunt(p, E) };
};
GR2.mou = nv => {
  const E = grEscR1(nv); let s, t, d;
  for (let k = 0; k < 300; k++) { s = grPuntEsc(E, { alt: true }); d = [grR(-4, 4) * E.sx, grR(-4, 4) * E.sy]; if (nv === 1) d = [grR(1, 4), grR(-3, 4)]; t = [s[0] + d[0], s[1] + d[1]];
    if (d[0] && d[1] && t[0] > E.x0 && t[0] < E.x1 && t[1] > E.y0 && t[1] < E.y1 - E.sy && Math.abs(d[0]) + Math.abs(d[1]) >= 3 * E.sx) break; }
  const pas = (v, a, b) => `<b>${grF(Math.abs(v))} ${v > 0 ? a : b}</b>`;
  return { sig: `mo-${s}-${d}`, enunciat: `FR-4C és al punt <b>${grP(s)}</b>. Camina ${pas(d[0], 'cap a la dreta', 'cap a l\'esquerra')} i després ${pas(d[1], 'amunt', 'avall')}. Porta'l on arriba.${grEscalaNota(E)}`, visual: grVisRec,
    pista: { completa: `Compta des de FR-4C, no des del 0. ${d[0] > 0 ? 'Cap a la dreta la x augmenta' : 'Cap a l\'esquerra la x disminueix'} i ${d[1] > 0 ? 'amunt la y augmenta' : 'avall la y disminueix'}.`, mitja: 'Compta els passos des d\'on és FR-4C.' },
    ...grGiny(grPosa({ E, mode: 'un', fig: 'robot', ini: s, obj: [t], capes: [{ pt: s, col: '#c9d3e2', r: 5 }], nota: 'Mou-lo amb les fletxes del teclat (o els botons) o clica on arriba. Enter per comprovar.', coma: 'Compta els passos des d\'on és ara.', premi: 'Meu! Hi has arribat!' }), `<b>${grP(t)}</b>`),
    explicacio: `x: ${grF(s[0])} ${d[0] > 0 ? '+' : '−'} ${grF(Math.abs(d[0]))} = ${grF(t[0])} · y: ${grF(s[1])} ${d[1] > 0 ? '+' : '−'} ${grF(Math.abs(d[1]))} = ${grF(t[1])}.`,
    solucio: [`Surt de ${grP(s)}.`, `En horitzontal: ${grF(s[0])} ${d[0] > 0 ? '+' : '−'} ${grF(Math.abs(d[0]))} = <b>${grF(t[0])}</b>.`, `En vertical: ${grF(s[1])} ${d[1] > 0 ? '+' : '−'} ${grF(Math.abs(d[1]))} = <b>${grF(t[1])}</b>.`, `Arriba al <b>${grP(t)}</b>.`] };
};
GR2.varis = nv => {
  const E = grEscR1(nv); const n = nv === 1 ? 3 : 4; const pts = [];
  while (pts.length < n) pts.push(grPuntEsc(E, { evita: pts, eix: nv > 1 && pts.length === n - 1 && Math.random() < .5 }));
  const chips = `<div class="gr-llista">${pts.map((p, i) => `<span>${grLletra(i)} ${grP(p)}</span>`).join('')}</div>`;
  return { sig: `va-${pts.join('|')}`, enunciat: `Situa aquests ${n} punts a la graella:${chips}${grEscalaNota(E)}`, visual: grVisRec, pista: PISTA_GR2,
    ...grGiny(grPosa({ E, mode: 'conjunt', obj: pts, coma: 'Clica cada punt. Si t\'equivoques, torna\'l a clicar.', fi: pts.map((p, i) => ({ pt: p, lab: grLletra(i) })) }), pts.map((p, i) => `${grLletra(i)} <b>${grP(p)}</b>`).join(' · ')),
    explicacio: `Cada punt: primer la x i després la y.`, solucio: pts.map((p, i) => `${grLletra(i)} ${grP(p)}: ${grF(p[0])} en horitzontal i ${grF(p[1])} en vertical.`) };
};
const GR_DIBUIXOS = [
  { nom: 'una casa', p: [[1, 1], [7, 1], [7, 5], [4, 8], [1, 5]] },
  { nom: 'una fletxa', p: [[1, 3], [4, 3], [4, 1], [7, 4], [4, 7], [4, 5], [1, 5]] },
  { nom: 'un vaixell', p: [[1, 3], [3, 3], [3, 7], [6, 3], [7, 3], [6, 1], [2, 1]] },
  { nom: 'un peix', p: [[1, 4], [3, 6], [5, 5], [7, 7], [7, 1], [5, 3], [3, 2]] },
  { nom: 'un arbre', p: [[3, 1], [5, 1], [5, 3], [7, 3], [4, 7], [1, 3], [3, 3]] },
  { nom: 'el cap d\'en Coma', p: [[1, 1], [7, 1], [7, 5], [6, 7], [5, 5], [3, 5], [2, 7], [1, 5]] },
  { nom: 'un diamant', p: [[2, 5], [3, 7], [5, 7], [6, 5], [4, 1]] }
];
GR2.dibuix = nv => {
  const E = grEscR1(nv); const D = tria(GR_DIBUIXOS);
  const pts = D.p.map(([x, y]) => nv === 1 ? [x, y] : nv === 2 ? [x - 4, y - 4] : [2 * x - 8, 2 * y - 8]);
  const chips = `<div class="gr-llista">${pts.map((p, i) => `<span>${grLletra(i)} ${grP(p)}</span>`).join('')}</div>`;
  return { sig: `di-${D.nom}`, enunciat: `Situa els punts <b>en ordre</b> (A, B, C…) i descobriràs un dibuix. L'últim s'uneix amb el primer.${chips}${grEscalaNota(E)}`, visual: grVisRec, pista: PISTA_GR2,
    ...grGiny(grPosa({ E, mode: 'ordre', tancat: true, obj: pts, coma: 'Uneix els punts en ordre. Què sortirà?', fi: [{ ple: pts, col: 'rgba(244,123,32,.28)', cls: 'gr-ple' }, { linia: pts, tanca: true, col: GR_T, w: 4 }], premi: `Meu! És ${D.nom}!` }), `${D.nom}: ${pts.map(p => grP(p)).join(' → ')}`),
    explicacio: `És ${D.nom}!`, solucio: pts.map((p, i) => `${grLletra(i)} ${grP(p)}`).concat([`Uneix l'últim amb el primer: surt <b>${D.nom}</b>.`]) };
};
TEMES.r2 = {
  gen: GR2,
  sequencia: {
    1: [['porta'], ['amaga'], ['varis'], ['dibuix'], ['porta'], ['mou'], ['amaga'], ['dibuix'], ['varis'], ['mou'], ['porta'], ['dibuix']],
    2: [['porta'], ['amaga'], ['varis'], ['dibuix'], ['mou'], ['amaga'], ['porta'], ['dibuix'], ['varis'], ['mou'], ['amaga'], ['dibuix']],
    3: [['amaga'], ['porta'], ['varis'], ['dibuix'], ['mou'], ['amaga'], ['varis'], ['dibuix'], ['porta'], ['mou'], ['amaga'], ['dibuix']]
  },
  explicacio: [
    { text: `<p>Per situar el punt <b>(3, 5)</b>: surt del 0, camina <b class="parpelleja">3 cap a la dreta</b> i puja <b>5</b>.</p><p class="petit">FR-4C ho fa així: primer pel passadís, després per l'escala.</p>`, vis: () => grSvg(grEscR1(1), [{ cami: [3, 5] }, { fig: 'robot', at: [3, 5] }]) },
    { text: `<p>Si la x és negativa, camina cap a l'<b class="parpelleja">esquerra</b>. Si la y és negativa, <b>baixa</b>.</p><p class="petit">El punt (−2, −4): 2 cap a l'esquerra i 4 avall.</p>`, vis: () => grSvg(grEscR1(2), [{ cami: [-2, -4] }, { pt: [-2, -4], lab: '(−2, −4)', dx: 10, dy: 6 }]) },
    { text: `<p>A l'app: <b>clica</b> el lloc de la graella, o mou-te amb les <b class="parpelleja">fletxes</b> del teclat i prem <b>Enter</b>.</p><p class="petit">Si t'equivoques, torna a clicar el punt per treure'l, o prem «Desfés».</p>`, vis: () => `<div class="gr-coma" style="flex-direction:column">${gatComa(110, 'gr-gat')}<span class="gr-baf" style="font-size:1.4rem">← ↑ ↓ → i Enter</span></div>` }
  ],
  exemple: nv => {
    const E = grEscR1(nv), p = nv === 1 ? [3, 5] : nv === 2 ? [-2, 4] : [6, -4];
    return { enunciat: `Porta FR-4C al punt ${grP(p)}.${grEscalaNota(E)}`, passos: [
      { text: `Surto del 0 i camino <b>${grF(Math.abs(p[0]))}</b> ${p[0] > 0 ? 'cap a la dreta' : 'cap a l\'esquerra'}.${nv === 3 ? ' Cada quadret val 2: són 3 quadrets.' : ''}`, vis: grSvg(E, [{ linia: [[0, 0], [p[0], 0]], dash: '7 5', w: 4 }, { fig: 'robot', at: [p[0], 0] }]) },
      { text: `Ara ${p[1] > 0 ? 'pujo' : 'baixo'} <b>${grF(Math.abs(p[1]))}</b>. FR-4C és al <b>${grP(p)}</b>. <span class="marca-ok">✓</span>`, vis: grSvg(E, [{ cami: p }, { fig: 'robot', at: p }]) }] };
  }
};

/* =====================================================================
   OBJECTIU 3 · QUÈ EXPLICA UNA GRÀFICA (distància a casa i temps)
   Puja = s'allunya · plana = aturat · baixa = torna. Com més inclinada, més de pressa.
   ===================================================================== */
const GR3_CTX = [
  { qui: 'La Laia', verb: 'va a l\'institut caminant', ux: 'min', uy: 'm', tx: 'Temps (min)', ty: 'Distància de casa (m)', dt: 5, dd: 100, atura: 'espera una amiga' },
  { qui: 'En Pau', verb: 'surt a fer una volta amb bicicleta', ux: 'min', uy: 'km', tx: 'Temps (min)', ty: 'Distància de casa (km)', dt: 5, dd: 1, atura: 'para a beure aigua' },
  { qui: 'La família Puig', verb: 'fa una excursió a la muntanya', ux: 'h', uy: 'km', tx: 'Temps (h)', ty: 'Distància de casa (km)', dt: 1, dd: 2, atura: 'para a dinar' },
  { qui: 'L\'Arnau', verb: 'va a comprar el pa', ux: 'min', uy: 'm', tx: 'Temps (min)', ty: 'Distància de casa (m)', dt: 2, dd: 100, atura: 'fa cua a la fleca' }
];
const GR3_PAT = { 1: ['u0u', 'u0d', 'u0d'], 2: ['u0ud', 'uu0d', 'u0uu'], 3: ['uu0ud', 'u0uud', 'uu0d'] };
function gr3Gen(nv) {
  const C = tria(GR3_CTX), pat = tria(GR3_PAT[nv]);
  for (let k = 0; k < 400; k++) {
    let t = 0, d = 0; const pts = [[0, 0]], trams = [];
    for (let i = 0; i < pat.length; i++) {
      const c = pat[i]; const dur = (c === '0' ? grR(1, 2) : grR(1, C.ux === 'h' ? 2 : 3)) * C.dt;
      let nd = d;
      if (c === 'u') nd = d + grR(1, 4) * C.dd;
      else if (c === 'd') nd = i === pat.length - 1 ? 0 : d - grR(1, Math.max(1, d / C.dd - 1)) * C.dd;
      trams.push({ c, t0: t, t1: t + dur, d0: d, d1: nd, v: (nd - d) / dur }); t += dur; d = nd; pts.push([t, d]);
    }
    if (trams.some(x => x.c === 'd' && x.d1 >= x.d0)) continue;
    const ups = trams.filter(x => x.c === 'u'); const vs = ups.map(x => x.v).sort((a, b) => b - a);
    if (ups.length > 1 && vs[0] < vs[1] * 1.5) continue;
    const Dmax = Math.max(...pts.map(p => p[1])); if (Dmax > 9 * C.dd || Dmax < 3 * C.dd) continue;
    const T = t; const x1 = Math.ceil((T + C.dt * .01) / (2 * C.dt)) * 2 * C.dt, y1 = Math.ceil((Dmax + C.dd * .5) / C.dd) * C.dd;
    const E = grEsc({ x0: 0, x1, y0: 0, y1, sx: C.dt, lx: x1 / C.dt > 10 ? 2 * C.dt : C.dt, sy: C.dd, ly: y1 / C.dd > 7 ? 2 * C.dd : C.dd, tx: C.tx, ty: C.ty, W: 540, H: 330 });
    trams.forEach((x, i) => { x.lab = grLletra(i); });
    return { C, pat, pts, trams, E, T, Dmax };
  }
}
const gr3Svg = (H, cls = 'gr-vis') => grSvg(H.E, [{ linia: H.pts, col: GR_T, w: 4 }, ...H.pts.map(p => ({ pt: p, r: 4.5, col: GR_N })), ...H.trams.map(x => ({ bola: [(x.t0 + x.t1) / 2, (x.d0 + x.d1) / 2], lab: x.lab, dy: x.c === '0' ? -20 : x.c === 'u' ? -16 : -16, dx: x.c === 'u' ? -12 : x.c === 'd' ? 12 : 0 }))], cls);
const gr3Context = H => `<b>${H.C.qui}</b> ${H.C.verb}. La gràfica diu a quina distància de casa és a cada moment.`;
const PISTA_GR3 = { completa: `Mira cap on va la línia: si <b>puja</b>, s'allunya de casa; si és <b>plana</b>, està aturat; si <b>baixa</b>, torna cap a casa. Per llegir un valor, puja des de l'eix del temps fins a la línia i mira a l'esquerra.`, mitja: 'Puja = s\'allunya · plana = aturat · baixa = torna.' };
const GR3 = {};
GR3.trams = nv => {
  const H = gr3Gen(nv), { trams, C } = H; const lls = trams.map(x => x.lab);
  const opc = () => lls.map(l => ({ html: `<b>${l}</b>`, val: l }));
  const qs = [];
  const flat = trams.filter(x => x.c === '0'), down = trams.filter(x => x.c === 'd'), ups = trams.filter(x => x.c === 'u');
  if (flat.length === 1) qs.push({ tipus: 'tria', html: `En quin tram està <b>aturat</b> (${C.atura})?`, opcions: opc(), correcta: flat[0].lab, etiq: Object.fromEntries(lls.filter(l => l !== flat[0].lab).map(l => [l, 'rTram'])) });
  if (down.length === 1) qs.push({ tipus: 'tria', html: `En quin tram <b>torna</b> cap a casa?`, opcions: opc(), correcta: down[0].lab, etiq: Object.fromEntries(lls.filter(l => l !== down[0].lab).map(l => [l, 'rTram'])) });
  if (ups.length > 1) { const f = ups.reduce((a, b) => b.v > a.v ? b : a); qs.push({ tipus: 'tria', html: `En quin tram va <b>més de pressa</b>?`, opcions: opc(), correcta: f.lab, etiq: Object.fromEntries(lls.filter(l => l !== f.lab).map(l => [l, 'rTram'])) }); }
  const its = qs.slice(0, nv === 1 ? 2 : 3);
  const desc = x => x.c === '0' ? 'és plana: està aturat' : x.c === 'u' ? 'puja: s\'allunya de casa' : 'baixa: torna cap a casa';
  return { sig: `tr-${H.pat}-${H.pts.join('|')}`, enunciat: gr3Context(H), visual: () => gr3Svg(H), pista: PISTA_GR3, ...apartats(its),
    explicacio: `Plana = aturat · puja = s'allunya · baixa = torna. Com més inclinada, més de pressa.`, solucio: trams.map(x => `Tram <b>${x.lab}</b>: la línia ${desc(x)}.`) };
};
GR3.valors = nv => {
  const H = gr3Gen(nv), { trams, C, pts } = H; const its = [];
  const flat = trams.find(x => x.c === '0');
  const p = tria(pts.slice(1).filter(q => q[1] > 0 && q[0] < H.T)) || pts[1];
  its.push({ tipus: 'num', llarg: true, html: `A quina distància de casa és ${C.ux === 'h' ? 'a les' : 'al minut'} <b>${grF(p[0])}${C.ux === 'h' ? ' h' : ''}</b>? (${C.uy})`, valor: p[1], errs: { [p[0]]: 'rSwap' } });
  if (flat) its.push({ tipus: 'num', llarg: true, html: `Quant temps està aturat? (${C.ux})`, valor: flat.t1 - flat.t0, errs: { [flat.t1]: 'rTram', [flat.t0]: 'rTram' } });
  its.push({ tipus: 'num', llarg: true, html: `Quina és la distància més gran a què arriba? (${C.uy})`, valor: H.Dmax, errs: {} });
  if (nv > 1) its.push({ tipus: 'num', llarg: true, html: `Quant dura tot el recorregut? (${C.ux})`, valor: H.T, errs: {} });
  const usa = nv === 1 ? its.slice(0, 2) : its.slice(0, 3);
  return { sig: `vl-${H.pat}-${H.pts.join('|')}`, enunciat: gr3Context(H), visual: () => gr3Svg(H), pista: PISTA_GR3, ...apartats(usa),
    explicacio: `Per llegir la gràfica: busca el temps a l'eix de baix, puja fins a la línia i mira la distància a l'esquerra.`,
    solucio: [`Al ${grF(p[0])} ${C.ux} la línia és a <b>${grF(p[1])} ${C.uy}</b>.`, ...(flat ? [`Aturat del ${grF(flat.t0)} al ${grF(flat.t1)}: <b>${grF(flat.t1 - flat.t0)} ${C.ux}</b>.`] : []), `El punt més alt és a <b>${grF(H.Dmax)} ${C.uy}</b>.`] };
};
const GR_HIST = {
  u0d: { t: 'surt de casa, camina una estona, <b>s\'atura</b> i després <b>torna a casa</b>.', p: [[0, 0], [3, 4], [5, 4], [8, 0]] },
  u0u: { t: 'surt de casa, camina, <b>s\'atura</b> una estona i després <b>continua</b> allunyant-se de casa.', p: [[0, 0], [3, 3], [5, 3], [8, 6]] },
  '0ud': { t: 'primer <b>s\'està a casa</b> una estona. Després surt i, al final, <b>torna a casa</b>.', p: [[0, 0], [3, 0], [5, 5], [8, 0]] },
  ud0: { t: 'surt de casa, de seguida <b>torna</b> i després <b>es queda a casa</b>.', p: [[0, 0], [2, 4], [4, 0], [8, 0]] },
  uU: { t: 'surt de casa caminant <b>a poc a poc</b> i després <b>corre</b>, sense aturar-se.', p: [[0, 0], [5, 2], [8, 7]] },
  Uu: { t: 'surt de casa <b>corrent</b> i després <b>camina a poc a poc</b>, sense aturar-se.', p: [[0, 0], [3, 5], [8, 7]] }
};
const grMini = p => { const E = grEsc({ x0: 0, x1: 8.6, y0: 0, y1: 7.6, sx: 100, sy: 100, W: 210, H: 128 }); E.ML = 18; E.MB = 18; E.MT = 10; E.MR = 12; E.kx = (E.W - 30) / 8.6; E.ky = (E.H - 28) / 7.6; E.px = x => grRo(18 + x * E.kx); E.py = y => grRo(E.H - 18 - y * E.ky);
  return `<svg class="gr-mini" viewBox="0 0 210 128" role="img" aria-label="Gràfica petita"><rect width="210" height="128" fill="#fff"/><path d="M18 110H202M18 110V6" stroke="${GR_N}" stroke-width="2"/>${grTxt(200, 124, 'temps', { mida: 10, anc: 'end', col: GR_B })}${grTxt(22, 12, 'distància', { mida: 10, anc: 'start', col: GR_B })}${grCapes(E, [{ linia: p, col: GR_T, w: 4 }])}</svg>`; };
GR3.historia = nv => {
  const ks = Object.keys(GR_HIST); const bo = tria(ks); const dis = barreja(ks.filter(k => k !== bo)).slice(0, nv === 1 ? 2 : 3);
  const nom = tria(['En Marc', 'La Júlia', 'L\'Ivan', 'La Nora', 'En Biel', 'La Fàtima']);
  const ops = barreja([bo, ...dis]).map(k => ({ html: grMini(GR_HIST[k].p), val: k }));
  return { sig: `hi-${bo}-${dis.join('')}`, enunciat: `<b>${nom}</b> ${GR_HIST[bo].t}<br>Quina gràfica explica aquesta història? (distància a casa i temps)`, visual: null, pista: PISTA_GR3,
    resposta: { mode: 'opcions', opcions: ops, correcta: bo }, correctaHtml: `<span style="display:inline-block;vertical-align:middle">${grMini(GR_HIST[bo].p)}</span>`, correctaTxt: GR_HIST[bo].t.replace(/<[^>]+>/g, ''),
    explicacio: `Cada tros de la història és un tram: s'allunya (puja), s'atura (plana) o torna (baixa).`, solucio: [`La història: ${GR_HIST[bo].t}`, `La gràfica bona fa el mateix, tram a tram.`] };
};
const gr3Ex = { C: GR3_CTX[0], pts: [[0, 0], [10, 600], [15, 600], [25, 1200]], trams: [{ c: 'u', lab: 'A', t0: 0, t1: 10, d0: 0, d1: 600 }, { c: '0', lab: 'B', t0: 10, t1: 15, d0: 600, d1: 600 }, { c: 'u', lab: 'C', t0: 15, t1: 25, d0: 600, d1: 1200 }] };
gr3Ex.E = grEsc({ x0: 0, x1: 30, y0: 0, y1: 1300, sx: 5, lx: 5, sy: 100, ly: 200, tx: 'Temps (min)', ty: 'Distància de casa (m)', W: 540, H: 330 });
const gr3Ex2 = { ...gr3Ex, pts: [[0, 0], [10, 600], [15, 600], [25, 0]], trams: [gr3Ex.trams[0], gr3Ex.trams[1], { c: 'd', lab: 'C', t0: 15, t1: 25, d0: 600, d1: 0 }] };
TEMES.r3 = {
  gen: GR3,
  sequencia: {
    1: [['trams'], ['valors'], ['historia'], ['trams'], ['valors'], ['historia'], ['trams'], ['valors'], ['historia'], ['valors']],
    2: [['trams'], ['valors'], ['historia'], ['trams'], ['valors'], ['historia'], ['trams'], ['valors'], ['historia'], ['trams']],
    3: [['trams'], ['valors'], ['historia'], ['valors'], ['trams'], ['historia'], ['trams'], ['valors'], ['historia'], ['trams']]
  },
  explicacio: [
    { text: `<p>Aquesta gràfica explica el camí de la Laia a l'institut: a cada <b>minut</b>, a quina <b>distància de casa</b> és.</p><p class="petit">Si la línia <b class="parpelleja">puja</b>, s'allunya de casa.</p>`, vis: () => gr3Svg(gr3Ex) },
    { text: `<p>Si la línia és <b class="parpelleja">plana</b>, està <b>aturada</b>: el temps passa, però no s'allunya.</p><p class="petit">Al tram B espera una amiga 5 minuts (del 10 al 15).</p>`, vis: () => grSvg(gr3Ex.E, [{ linia: gr3Ex.pts, col: '#f6c39a', w: 4 }, { linia: [[10, 600], [15, 600]], col: GR_T, w: 7 }, { bola: [12.5, 600], lab: 'B', dy: -20 }]) },
    { text: `<p>Si la línia <b class="parpelleja">baixa</b>, <b>torna</b> cap a casa. Quan arriba al 0, és a casa.</p><p class="petit">Com més inclinada és la línia, <b>més de pressa</b> va.</p>`, vis: () => `<div class="gr-dues">${gr3Svg(gr3Ex2, 'gr-vis petit')}${grComaHtml('Meu! Puja, plana, baixa.')}</div>` }
  ],
  exemple: nv => ({ enunciat: `La Laia va a l'institut. En quin tram s'atura? Quant temps?`, passos: [
    { text: `Busco el tram <b>pla</b>: és el B.`, vis: grSvg(gr3Ex.E, [{ linia: gr3Ex.pts, col: '#f6c39a', w: 4 }, { linia: [[10, 600], [15, 600]], col: GR_T, w: 7 }, { bola: [12.5, 600], lab: 'B', dy: -20 }]) },
    { text: `Comença al minut 10 i acaba al 15: s'atura <b>5 minuts</b>. <span class="marca-ok">✓</span>`, vis: grSvg(gr3Ex.E, [{ linia: gr3Ex.pts, col: '#f6c39a', w: 4 }, { linia: [[10, 600], [15, 600]], col: GR_T, w: 7 }, { linia: [[10, 0], [10, 600]], col: GR_B, dash: '6 5', w: 2.5 }, { linia: [[15, 0], [15, 600]], col: GR_B, dash: '6 5', w: 2.5 }]) }] })
};

/* =====================================================================
   OBJECTIU 4 · LA TAULA DE VALORS
   La «màquina de FR-4C»: hi entra una x, en surt una y.
   ===================================================================== */
const GR4_REGLES = { // regles explicades amb paraules
  1: [{ t: 'el doble', a: 2, b: 0 }, { t: 'el triple', a: 3, b: 0 }, { t: 'sumar 3', a: 1, b: 3 }, { t: 'sumar 5', a: 1, b: 5 }, { t: 'el doble més 1', a: 2, b: 1 }, { t: 'el doble més 3', a: 2, b: 3 }, { t: 'el triple més 2', a: 3, b: 2 }, { t: 'el quàdruple', a: 4, b: 0 }],
  2: [{ t: 'el doble menys 3', a: 2, b: -3 }, { t: 'el triple menys 1', a: 3, b: -1 }, { t: 'el doble més 1', a: 2, b: 1 }, { t: 'restar 4', a: 1, b: -4 }, { t: 'el triple', a: 3, b: 0 }, { t: 'el contrari (canvia el signe)', a: -1, b: 0 }],
  3: [{ t: 'el doble menys 5', a: 2, b: -5 }, { t: 'el triple menys 4', a: 3, b: -4 }, { t: 'el contrari més 2', a: -1, b: 2 }, { t: 'el doble canviat de signe', a: -2, b: 0 }, { t: 'el quàdruple menys 3', a: 4, b: -3 }]
};
const gr4Xs = nv => nv === 1 ? (s => [s, s + 1, s + 2, s + 3, s + 4])(grR(0, 1)) : nv === 2 ? [-2, -1, 0, 1, 2] : barreja([-3, -2, -1, 0, 1, 2, 3, 4]).slice(0, 5).sort((a, b) => a - b);
const gr4Formula = nv => { for (;;) { const a = nv === 2 ? tria([2, 3, -1, -2]) : tria([-3, -2, 2, 3, 4]), b = grR(nv === 2 ? -4 : -5, nv === 2 ? 4 : 5); if (b !== 0) return { a, b }; } };
const grMaq = (regla, x = 'x', y = 'y') => `<div class="gr-maq">${robot(58)}<span class="num">${x}</span>→<span class="caixa">${regla}</span>→<span class="num">${y}</span></div>`;
const PISTA_GR4 = { completa: `Fes la regla amb cada x. Si y = 2x + 1 i x = 3: 2 · 3 + 1 = 7. Primer la <b>multiplicació</b>, després la suma o la resta. Amb x negativa, compte amb els signes: 2 · (−3) = −6.`, mitja: 'Primer multiplica, després suma o resta.' };
const gr4Sol = (a, b, xs) => xs.slice(0, 3).map(x => `x = ${grF(x)}: ${a === 1 ? '' : grF(a) + ' · '}${x < 0 ? `(${grF(x)})` : grF(x)}${b ? (b > 0 ? ' + ' + b : ' − ' + -b) : ''} = <b>${grF(a * x + b)}</b>`);
const GR4 = {};
GR4.regla = nv => {
  const R = tria(GR4_REGLES[nv]), xs = gr4Xs(nv); const cols = xs.map(x => ({ x, y: R.a * x + R.b, by: true }));
  return { sig: `rg-${R.t}-${xs}`, enunciat: `La màquina de FR-4C fa <b>${R.t}</b> del número que hi entra. Omple la taula.`, visual: () => grMaq(R.t), pista: PISTA_GR4,
    ...grGiny(grTaula({ cols, coma: `Regla: <b>${R.t}</b>.` }), cols.map(c => `${grF(c.x)} → <b>${grF(c.y)}</b>`).join(' · ')),
    explicacio: `Regla: ${R.t} (${grFormula(R.a, R.b)}).`, solucio: [`La regla és ${R.t}: <b>${grFormula(R.a, R.b)}</b>.`, ...gr4Sol(R.a, R.b, xs)] };
};
GR4.formula = nv => {
  const { a, b } = gr4Formula(nv), xs = gr4Xs(nv); const cols = xs.map(x => ({ x, y: a * x + b, by: true }));
  return { sig: `fo-${a}-${b}-${xs}`, enunciat: `Omple la taula de valors de <b>${grFormula(a, b)}</b>.`, visual: () => grMaq(grFormula(a, b).replace('y = ', '')), pista: PISTA_GR4,
    ...grGiny(grTaula({ cols, coma: `<b>${grFormula(a, b)}</b>. Compte amb els signes!` }), cols.map(c => `${grF(c.x)} → <b>${grF(c.y)}</b>`).join(' · ')),
    explicacio: `Canvia la x per cada número i calcula.`, solucio: gr4Sol(a, b, xs) };
};
const GR4_CTX = [
  { t: (a, b) => `Una entrada al museu costa <b>${a} €</b>.`, cx: 'Persones', cy: 'Preu (€)', a: [4, 5, 6, 8], b: [0], x0: 1, nv: 1 },
  { t: (a, b) => `Un taxi cobra <b>${b} €</b> en pujar i <b>${a} €</b> per cada quilòmetre.`, cx: 'Km', cy: 'Preu (€)', a: [2, 3], b: [3, 4, 5], x0: 1, nv: 1 },
  { t: (a, b) => `Una planta fa <b>${b} cm</b> i creix <b>${a} cm</b> cada setmana.`, cx: 'Setmanes', cy: 'Alçada (cm)', a: [2, 3, 4], b: [4, 5, 10], x0: 0, nv: 1 },
  { t: (a, b) => `Una piscina té <b>${b} L</b> d'aigua i n'hi entren <b>${a} L</b> cada minut.`, cx: 'Minuts', cy: 'Litres', a: [10, 20, 30], b: [50, 100], x0: 0, nv: 1 },
  { t: (a, b) => `Un submarí és a <b>${grF(b)} m</b> (sota el mar) i puja <b>${a} m</b> cada minut.`, cx: 'Minuts', cy: 'Altura (m)', a: [2, 3, 5], b: [-12, -15, -10], x0: 0, nv: 2 },
  { t: (a, b) => `A les 8 del vespre fa <b>${b} °C</b> i la temperatura baixa <b>${-a} °C</b> cada hora.`, cx: 'Hores', cy: 'Temperatura (°C)', a: [-2, -3], b: [4, 5, 6], x0: 0, nv: 2 }
];
GR4.context = nv => {
  const C = tria(GR4_CTX.filter(c => c.nv <= nv)); const a = tria(C.a), b = tria(C.b); const xs = [0, 1, 2, 3, 4].map(k => k + C.x0);
  const cols = xs.map(x => ({ x, y: a * x + b, by: true }));
  return { sig: `cx-${C.cx}-${a}-${b}`, enunciat: `${C.t(a, b)} Omple la taula.`, visual: () => grMaq(`${b ? grF(b) + (a < 0 ? ' − ' + -a : ' + ' + a) + ' · x' : a + ' · x'}`, C.cx.toLowerCase(), C.cy.replace(/ \(.*/, '').toLowerCase()), pista: PISTA_GR4,
    ...grGiny(grTaula({ cols, capX: C.cx, capY: C.cy, coma: 'Cada columna és un cas. Meu!' }), cols.map(c => `${grF(c.x)} → <b>${grF(c.y)}</b>`).join(' · ')),
    explicacio: `${C.cy}: ${b ? grF(b) + (a < 0 ? ' − ' : ' + ') + Math.abs(a) + ' per cada ' + C.cx.toLowerCase().replace(/s$/, '') : a + ' per cada ' + C.cx.toLowerCase().replace(/s$/, '')}.`,
    solucio: xs.slice(0, 3).map(x => `${C.cx} = ${x}: ${b ? grF(b) + (a < 0 ? ' − ' : ' + ') : ''}${Math.abs(a)} · ${x} = <b>${grF(a * x + b)}</b>`) };
};
GR4.buscaX = nv => {
  const { a, b } = gr4Formula(nv); const xs = gr4Xs(nv); const amaga = barreja([0, 1, 2, 3, 4]).slice(0, 2);
  const cols = xs.map((x, i) => amaga.includes(i) ? { x, y: a * x + b, bx: true } : { x, y: a * x + b, by: true });
  return { sig: `bx-${a}-${b}-${xs}-${amaga}`, enunciat: `Omple la taula de <b>${grFormula(a, b)}</b>. Compte: en dues columnes et donen la <b>y</b> i has de trobar la <b>x</b>.`, visual: () => grMaq(grFormula(a, b).replace('y = ', '')), pista: { completa: `Per trobar la x, pensa quin número fa sortir aquella y. Pots provar números: si y = 2x + 1 i y = 7, prova x = 3: 2 · 3 + 1 = 7.`, mitja: 'Prova números fins que surti la y.' },
    ...grGiny(grTaula({ cols, coma: 'Per trobar la x, prova números!' }), cols.map(c => `${grF(c.x)} → ${grF(c.y)}`).join(' · ')),
    explicacio: `Per trobar la x, busca el número que fa sortir la y (o resol l'equació).`, solucio: amaga.map(i => `Si y = ${grF(xs[i] * a + b)}, la x és <b>${grF(xs[i])}</b>, perquè ${grF(a)} · (${grF(xs[i])})${b > 0 ? ' + ' + b : ' − ' + -b} = ${grF(xs[i] * a + b)}.`) };
};
GR4.quinaRegla = nv => {
  const { a, b } = nv === 1 ? tria(GR4_REGLES[1]) : gr4Formula(nv); const xs = gr4Xs(nv);
  const encaixa = (a2, b2) => xs.every(x => a2 * x + b2 === a * x + b);
  const cands = [[a, b + 1], [a, -b], [b, a], [a + 1, b], [1, a * xs[0] + b - xs[0]], [a * xs[0] + b, 0], [-a, b]].filter(([p, q]) => p !== 0 && !encaixa(p, q));
  const vistos = new Set([`${a}|${b}`]); const dis = [];
  for (const c of barreja(cands)) { const k = c.join('|'); if (vistos.has(k)) continue; vistos.add(k); dis.push(c); if (dis.length === 3) break; }
  const ops = barreja([[a, b], ...dis]).map(([p, q]) => ({ html: grFormula(p, q), val: `${p}|${q}` }));
  return { sig: `qr-${a}-${b}-${xs}`, enunciat: `Quina regla fa aquesta taula?`, visual: () => `<div style="margin-top:10px">${grTaulaHtml(xs.map(x => [grF(x), grF(a * x + b)]), 'x', 'y', '')}</div>`, pista: { completa: `Prova cada regla amb <b>totes</b> les columnes, no només amb la primera. La bona les encerta totes.`, mitja: 'Comprova-la amb totes les columnes.' },
    ...apartats([{ tipus: 'tria', llarg: true, html: 'La regla és…', opcions: ops, correcta: `${a}|${b}`, etiq: {} }]),
    explicacio: `${grFormula(a, b)} encerta totes les columnes.`, solucio: [`Prova ${grFormula(a, b)}:`, ...gr4Sol(a, b, xs)] };
};
TEMES.r4 = {
  gen: GR4,
  sequencia: {
    1: [['regla'], ['context'], ['regla'], ['quinaRegla'], ['context'], ['regla'], ['context'], ['quinaRegla'], ['regla'], ['context']],
    2: [['formula'], ['context'], ['buscaX'], ['regla'], ['quinaRegla'], ['formula'], ['context'], ['buscaX'], ['formula'], ['quinaRegla']],
    3: [['formula'], ['buscaX'], ['context'], ['quinaRegla'], ['formula'], ['buscaX'], ['context'], ['formula'], ['quinaRegla'], ['buscaX']]
  },
  explicacio: [
    { text: `<p>La <b>màquina de FR-4C</b>: hi entra un número (x) i en surt un altre (y).</p><p class="petit">Si la màquina fa «el doble més 1» i hi entra un <b class="parpelleja">3</b>, en surt 2 · 3 + 1 = <b>7</b>.</p>`, vis: () => grMaq('× 2 + 1', '3', '7') },
    { text: `<p>Una <b>taula de valors</b> recull què surt per a cada x.</p><p class="petit">La regla «el doble més 1» s'escriu <b>y = 2x + 1</b>.</p>`, vis: () => `<div style="display:flex;flex-direction:column;gap:12px;align-items:center">${grTaulaHtml([0, 1, 2, 3].map(x => [x, 2 * x + 1]), 'x', 'y', '')}${grComaHtml('0 → 1 · 1 → 3 · 2 → 5 · 3 → 7')}</div>` },
    { text: `<p>Amb x <b>negativa</b>, compte amb els signes.</p><p class="petit">y = 2x + 1 amb x = −3: 2 · (<b class="parpelleja">−3</b>) + 1 = −6 + 1 = <b>−5</b>.</p>`, vis: () => grTaulaHtml([-3, -2, -1, 0].map(x => [grF(x), grF(2 * x + 1)]), 'x', 'y', '') }
  ],
  exemple: nv => { const [a, b] = nv === 1 ? [2, 1] : nv === 2 ? [3, -2] : [-2, 3]; const xs = nv === 1 ? [0, 1, 2] : [-1, 0, 2];
    return { enunciat: `Omple la taula de ${grFormula(a, b)}.`, passos: xs.map((x, i) => ({ text: `x = ${grF(x)}: ${grF(a)} · ${x < 0 ? `(${grF(x)})` : grF(x)} ${b > 0 ? '+ ' + b : '− ' + -b} = <b>${grF(a * x + b)}</b>${i === xs.length - 1 ? ' <span class="marca-ok">✓</span>' : ''}`, vis: grTaulaHtml(xs.map((v, k) => [grF(v), k <= i ? grF(a * v + b) : '?']), 'x', 'y', '') })) };
  }
};

/* =====================================================================
   OBJECTIU 5 · DE LA TAULA A LA GRÀFICA (rectes)
   ===================================================================== */
const grEscR5 = nv => nv === 1 ? grEsc({ x0: 0, x1: 6, y0: 0, y1: 14, ly: 2, W: 430, H: 370, xy: true })
  : nv === 2 ? grEsc({ x0: -4, x1: 4, y0: -8, y1: 8, ly: 2, W: 430, H: 380, xy: true })
  : grEsc({ x0: -4, x1: 4, y0: -10, y1: 10, ly: 2, W: 430, H: 390, xy: true });
function gr5Recta(nv) {
  for (let k = 0; k < 500; k++) {
    const a = nv === 1 ? tria([1, 2, 3]) : nv === 2 ? tria([1, 2, -1, -2, 0]) : tria([-3, -2, -1, 2, 3, 1]);
    const b = nv === 1 ? grR(0, 4) : grR(-3, 3);
    const xs = nv === 1 ? tria([[0, 1, 2, 3, 4], [1, 2, 3, 4, 5], [0, 1, 2, 3, 4]]) : nv === 2 ? [-2, -1, 0, 1, 2] : tria([[-2, -1, 0, 1, 2], [-1, 0, 1, 2, 3], [-3, -2, -1, 0, 1]]);
    if (a === 0 && b === 0) continue;
    const E = grEscR5(nv); const ys = xs.map(x => a * x + b);
    if (ys.some(y => y < E.y0 + 1 || y > E.y1 - 1)) continue;
    return { a, b, xs, ys, E, pts: xs.map((x, i) => [x, ys[i]]) };
  }
}
const gr5Taula = (L, amaga = false) => grTaulaHtml(L.xs.map((x, i) => [grF(x), amaga ? '?' : grF(L.ys[i])]), 'x', 'y', '');
const PISTA_GR5 = { completa: `Cada columna de la taula és un punt: la <b>x</b> de dalt i la <b>y</b> de sota. Situa'ls un per un. Si tot està bé, quedaran en <b>línia recta</b>.`, mitja: 'Cada columna (x, y) és un punt.' };
const GR5 = {};
GR5.dibuixa = nv => {
  const L = gr5Recta(nv);
  return { sig: `dr-${L.a}-${L.b}-${L.xs}`, enunciat: `Dibuixa la gràfica de <b>${grFormula(L.a, L.b)}</b>: situa els ${L.xs.length} punts de la taula.${nv === 3 ? ' Primer calcula la y de cada columna (a l\'esborrany).' : ''}`,
    visual: () => `<div style="margin-top:10px">${gr5Taula(L, nv === 3)}</div>`, pista: PISTA_GR5,
    ...grGiny(grPosa({ E: L.E, mode: 'conjunt', obj: L.pts, coma: 'Cada columna és un punt. Meu!', fi: [{ recta: [L.a, L.b], col: GR_B, w: 3, cls: 'gr-anim' }, ...L.pts.map(p => ({ pt: p }))], premi: 'Meu! Els punts fan una recta!' }), L.pts.map(p => grP(p)).join(' ')),
    explicacio: `Els punts de ${grFormula(L.a, L.b)} queden en línia recta.`, solucio: [`Els punts són: ${L.pts.map(p => `<b>${grP(p)}</b>`).join(', ')}.`, `Units, fan una recta.`] };
};
GR5.falta = nv => {
  const L = gr5Recta(nv); const k = grR(0, L.xs.length - 1); const t = L.pts[k];
  const capes = L.pts.filter((_, i) => i !== k).map(p => ({ pt: p, col: GR_B }));
  return { sig: `fa-${L.a}-${L.b}-${k}`, enunciat: `Hi ha dibuixats els punts de la taula de <b>${grFormula(L.a, L.b)}</b>, però en <b>falta un</b>. Situa'l.`,
    visual: () => `<div style="margin-top:10px">${gr5Taula(L)}</div>`, pista: PISTA_GR5,
    ...grGiny(grPosa({ E: L.E, mode: 'un', obj: [t], capes, nota: 'Clica on va el punt que falta (o fletxes i Enter).', coma: 'Quina columna no hi és?', fi: [{ recta: [L.a, L.b], col: GR_B, w: 3, cls: 'gr-anim' }, { pt: t }], premi: 'Meu! Ara sí que fan una recta!' }), `<b>${grP(t)}</b>`),
    explicacio: `Faltava la columna x = ${grF(t[0])}: el punt ${grP(t)}.`, solucio: [`Mira quina columna de la taula no té punt: x = ${grF(t[0])}, y = ${grF(t[1])}.`, `El punt és <b>${grP(t)}</b>.`] };
};
GR5.malPosat = nv => {
  const L = gr5Recta(nv); const k = grR(0, L.xs.length - 1); let dol;
  for (const d of barreja([1, -1, 2, -2])) { const q = [L.xs[k], L.ys[k] + d]; if (q[1] > L.E.y0 && q[1] < L.E.y1) { dol = q; break; } }
  const sw = [L.ys[k], L.xs[k]]; if (L.xs[k] !== L.ys[k] && sw[0] >= L.E.x0 && sw[0] <= L.E.x1 && sw[1] >= L.E.y0 && sw[1] <= L.E.y1 && !L.pts.some(p => grPig(p, sw)) && Math.random() < .4) dol = sw;
  const pts = L.pts.map((p, i) => i === k ? dol : p);
  const its = [{ tipus: 'tria', html: 'El punt mal posat és el…', opcions: pts.map((_, i) => ({ html: `<b>${grLletra(i)}</b>`, val: grLletra(i) })), correcta: grLletra(k), etiq: {} }];
  return { sig: `mp-${L.a}-${L.b}-${k}-${dol}`, enunciat: `Un company ha dibuixat la taula de <b>${grFormula(L.a, L.b)}</b>, però ha posat <b>un punt malament</b>. Quin?`,
    visual: () => `<div class="gr-dues">${gr5Taula(L)}${grSvg(L.E, pts.map((p, i) => ({ pt: p, lab: grLletra(i) })), 'gr-vis petit')}</div>`, pista: { completa: `Compara cada punt amb la seva columna de la taula. També ajuda mirar quin punt no queda en línia amb els altres.`, mitja: 'Quin punt no queda en línia?' },
    ...apartats(its), explicacio: `El punt ${grLletra(k)} hauria de ser ${grP(L.pts[k])}, no ${grP(dol)}.`, solucio: [`Columna x = ${grF(L.xs[k])}: la y és ${grF(L.ys[k])}.`, `El punt ${grLletra(k)} és a ${grP(dol)}: està <b>mal posat</b>.`] };
};
GR5.quinaRecta = nv => {
  const L = gr5Recta(nv); const alt = []; const prova = [[L.a, L.b + 2], [L.a, L.b - 2], [-L.a, L.b], [L.a + 1, L.b], [L.a - 1, L.b + 1]].filter(([p, q]) => (p !== L.a || q !== L.b) && !(p === -L.a && L.a === 0));
  for (const c of barreja(prova)) { if (!alt.some(x => x[0] === c[0] && x[1] === c[1]) && grRectaPts(L.E, c[0], c[1])) alt.push(c); if (alt.length === 2) break; }
  const rs = barreja([[L.a, L.b], ...alt]); const cols = [GR_B, GR_T, GR_V];
  const capes = rs.flatMap((r, i) => { const q = grRectaPts(L.E, r[0], r[1]); const f = .22 + .28 * i; const e = [q[0][0] + (q[1][0] - q[0][0]) * f, q[0][1] + (q[1][1] - q[0][1]) * f]; return [{ recta: r, col: cols[i], w: 3.5 }, { bola: e, lab: grLletra(i), col: cols[i], dx: 15, dy: r[0] >= 0 ? -6 : 6 }]; });
  const k = rs.findIndex(r => r[0] === L.a && r[1] === L.b);
  return { sig: `qq-${rs.join('|')}`, enunciat: `Quina de les tres rectes és la de la taula?`,
    visual: () => `<div class="gr-dues">${gr5Taula(L)}${grSvg(L.E, capes, 'gr-vis petit')}</div>`, pista: { completa: `Agafa un punt de la taula, per exemple ${grP(L.pts[1])}, i mira quina recta hi passa. Comprova'n un altre.`, mitja: 'Per quina recta passen els punts de la taula?' },
    ...apartats([{ tipus: 'tria', html: 'La recta de la taula és la…', opcions: rs.map((_, i) => ({ html: `<b style="color:${cols[i]}">${grLletra(i)}</b>`, val: grLletra(i) })), correcta: grLletra(k), etiq: {} }]),
    explicacio: `La recta ${grLletra(k)} passa per tots els punts de la taula.`, solucio: [`Els punts ${grP(L.pts[0])} i ${grP(L.pts[L.pts.length - 1])} són de la recta <b>${grLletra(k)}</b>.`] };
};
TEMES.r5 = {
  gen: GR5,
  sequencia: {
    1: [['dibuixa'], ['falta'], ['dibuixa'], ['malPosat'], ['dibuixa'], ['quinaRecta'], ['dibuixa'], ['falta'], ['dibuixa'], ['malPosat']],
    2: [['dibuixa'], ['falta'], ['dibuixa'], ['quinaRecta'], ['dibuixa'], ['malPosat'], ['dibuixa'], ['falta'], ['dibuixa'], ['quinaRecta']],
    3: [['dibuixa'], ['malPosat'], ['dibuixa'], ['quinaRecta'], ['dibuixa'], ['falta'], ['dibuixa'], ['malPosat'], ['dibuixa'], ['quinaRecta']]
  },
  explicacio: [
    { text: `<p>Cada columna de la taula és un <b class="parpelleja">punt</b>: la x de dalt i la y de sota.</p><p class="petit">y = 2x + 1: (0, 1), (1, 3), (2, 5), (3, 7).</p>`, vis: () => `<div class="gr-dues">${grTaulaHtml([0, 1, 2, 3].map(x => [x, 2 * x + 1]), 'x', 'y', '')}${grSvg(grEscR5(1), [0, 1, 2, 3].map(x => ({ pt: [x, 2 * x + 1] })), 'gr-vis petit')}</div>` },
    { text: `<p>Si la regla és com y = 2x + 1, els punts queden en <b class="parpelleja">línia recta</b>.</p><p class="petit">Per això aquestes gràfiques es diuen <b>rectes</b>.</p>`, vis: () => grSvg(grEscR5(1), [{ recta: [2, 1], col: GR_B, cls: 'gr-anim' }, ...[0, 1, 2, 3].map(x => ({ pt: [x, 2 * x + 1] }))]) },
    { text: `<p>Si un punt <b>no</b> queda en línia amb els altres, alguna cosa falla.</p><p class="petit">Revisa la taula o com l'has situat. En Coma ho ha vist de seguida!</p>`, vis: () => `<div class="gr-dues">${grSvg(grEscR5(1), [{ recta: [2, 1], col: '#c9d3e2' }, ...[0, 1, 3].map(x => ({ pt: [x, 2 * x + 1] })), { pt: [2, 7], col: GR_R, lab: '?' }], 'gr-vis petit')}${grComaHtml('Meu! Aquest punt no hi va!')}</div>` }
  ],
  exemple: nv => { const [a, b] = nv === 1 ? [1, 2] : nv === 2 ? [2, -1] : [-2, 1]; const xs = [0, 1, 2].map(x => nv === 1 ? x : x - 1); const E = grEscR5(nv); const pts = xs.map(x => [x, a * x + b]);
    return { enunciat: `Dibuixa ${grFormula(a, b)}.`, passos: [
      { text: `Faig la taula: ${pts.map(p => grP(p)).join(', ')}.`, vis: grTaulaHtml(pts.map(p => [grF(p[0]), grF(p[1])]), 'x', 'y', '') },
      { text: `Situo cada punt: primer la x, després la y.`, vis: grSvg(E, pts.map(p => ({ pt: p }))) },
      { text: `Queden en línia: els uneixo i tinc la recta. <span class="marca-ok">✓</span>`, vis: grSvg(E, [{ recta: [a, b], col: GR_B }, ...pts.map(p => ({ pt: p }))]) }] };
  }
};

/* =====================================================================
   OBJECTIU 6 · GRÀFIQUES DE LA VIDA REAL (preu fix + preu per unitat)
   ===================================================================== */
const GR6_CTX = [
  { id: 'elec', qui: 'Un electricista', f: [20, 30], v: [10, 15], sy: 5, ly: 10, xmax: 6, xn: 'Hores', yn: 'Cost (€)', u: 'hores', u1: 'hora', txt: (f, v) => `cobra <b>${f} €</b> per venir i <b>${v} €</b> per cada hora de feina`, noms: ['Llum Ràpida', 'Electro Badalona'] },
  { id: 'taxi', qui: 'Un taxi', f: [3, 4, 5], v: [2], sy: 1, ly: 2, xmax: 8, xn: 'Quilòmetres', yn: 'Preu (€)', u: 'km', u1: 'km', txt: (f, v) => `cobra <b>${f} €</b> en pujar i <b>${v} €</b> per cada quilòmetre`, noms: ['Taxi Groc', 'Taxi Blau'] },
  { id: 'bici', qui: 'El lloguer de bicis', f: [4, 6], v: [2, 4], sy: 2, ly: 4, xmax: 6, xn: 'Hores', yn: 'Preu (€)', u: 'hores', u1: 'hora', txt: (f, v) => `cobra <b>${f} €</b> per l'assegurança i <b>${v} €</b> per cada hora`, noms: ['BiciMar', 'RodaFàcil'] },
  { id: 'gim', qui: 'El gimnàs', f: [10, 15, 20], v: [5], sy: 5, ly: 10, xmax: 8, xn: 'Sessions', yn: 'Preu al mes (€)', u: 'sessions', u1: 'sessió', txt: (f, v) => `cobra <b>${f} €</b> de quota cada mes i <b>${v} €</b> per cada sessió`, noms: ['GymSol', 'FitMar'] }
];
function gr6E(C, ymax) { const y1 = Math.ceil(ymax / C.ly) * C.ly + (ymax % C.ly === 0 ? C.ly : 0); return grEsc({ x0: 0, x1: C.xmax, y0: 0, y1, sy: C.sy, ly: C.ly, tx: C.xn, ty: C.yn, W: 470, H: 370 }); }
function gr6Gen() { const C = tria(GR6_CTX), f = tria(C.f), v = tria(C.v); return { C, f, v, E: gr6E(C, f + v * C.xmax) }; }
const gr6Linia = (F, col = GR_T) => [{ linia: [[0, F.f], [F.C.xmax, F.f + F.v * F.C.xmax]], col, w: 3.5 }, ...[...Array(F.C.xmax + 1).keys()].map(x => ({ pt: [x, F.f + F.v * x], r: 4.5, col }))];
const PISTA_GR6 = { completa: `El <b>preu fix</b> és on la línia talla l'eix vertical (quan la quantitat és 0). Per llegir un preu, puja des de l'eix de baix fins a la línia i mira a l'esquerra. Per calcular: preu fix + preu per unitat × quantitat.`, mitja: 'Preu fix + preu per unitat × quantitat.' };
const GR6 = {};
GR6.llegeix = nv => {
  const F = gr6Gen(), { C, f, v } = F; const xs = barreja([...Array(C.xmax - 1).keys()].map(k => k + 1));
  const x1 = xs[0], x2 = xs[1]; const its = [
    { tipus: 'num', llarg: true, html: `Quant costa amb <b>${x1} ${x1 === 1 ? C.u1 : C.u}</b>? (€)`, valor: f + v * x1, errs: { [v * x1]: 'rTaula' } },
    { tipus: 'num', llarg: true, html: `Si has pagat <b>${f + v * x2} €</b>, quantes ${C.u} són?`, valor: x2, errs: {} }];
  if (nv > 1) its.push({ tipus: 'num', llarg: true, html: `Quant es paga <b>encara que sigui 0</b> ${C.u}? (el preu fix, €)`, valor: f, errs: {} });
  if (nv === 3) its.push({ tipus: 'num', llarg: true, html: `Quant puja el preu per cada ${C.u1}? (€)`, valor: v, errs: { [f]: 'rTaula' } });
  return { sig: `lg-${C.id}-${f}-${v}-${x1}-${x2}`, enunciat: `${C.qui} ${C.txt(f, v)}. La gràfica mostra el preu.`, visual: () => grSvg(F.E, gr6Linia(F)), pista: PISTA_GR6, ...apartats(nv === 3 ? its.slice(1) : its),
    explicacio: `Preu = ${f} + ${v} × ${C.u}.`, solucio: [`Amb ${x1} ${C.u}: ${f} + ${v} · ${x1} = <b>${f + v * x1} €</b>.`, `${f + v * x2} €: busca'l a l'eix vertical, ves fins a la línia i baixa: <b>${x2} ${C.u}</b>.`, `Amb 0 ${C.u} ja pagues <b>${f} €</b>: és el preu fix.`] };
};
GR6.dibuixa = nv => {
  const F = gr6Gen(), { C, f, v, E } = F; const xs = [0, 1, 2, 3, 4]; const pts = xs.map(x => [x, f + v * x]);
  const taula = grTaulaHtml(pts.map(p => [p[0], nv === 3 ? '?' : p[1]]), C.xn, C.yn, '');
  return { sig: `dv-${C.id}-${f}-${v}`, enunciat: `${C.qui} ${C.txt(f, v)}. Situa a la gràfica els punts de la taula.${nv === 3 ? ' Primer calcula els preus.' : ''}`, visual: () => `<div style="margin-top:10px">${taula}</div>`, pista: PISTA_GR6,
    ...grGiny(grPosa({ E, mode: 'conjunt', obj: pts, coma: `Compte amb l'escala de l'eix vertical: cada quadret val ${C.sy} €.`, fi: [{ linia: [[0, f], [C.xmax, f + v * C.xmax]], col: GR_B, w: 3, cls: 'gr-anim' }, ...pts.map(p => ({ pt: p }))], premi: 'Meu! Una recta que puja!' }), pts.map(p => grP(p)).join(' ')),
    explicacio: `Els punts fan una recta que comença a ${f} € (el preu fix) i puja ${v} € cada ${C.u1}.`, solucio: [`La taula: ${pts.map(p => `${p[0]} → ${p[1]} €`).join(' · ')}.`, `Cada quadret vertical val ${C.sy} €: compta bé abans de clicar.`] };
};
GR6.formula = nv => {
  const F = gr6Gen(), { C, f, v } = F; const fmt = ([a, b]) => a === 0 ? `${b} · x` : b === 1 ? `${a} + x` : `${a} + ${b} · x`; const ok = fmt([f, v]);
  const dis = []; for (const q of barreja([[v, f], [0, f + v], [f, 1], [0, v], [0, f]])) { if ((q[0] === f && q[1] === v) || q[1] === 0 || dis.some(d => d[0] === q[0] && d[1] === q[1])) continue; dis.push(q); if (dis.length === 3) break; }
  const ops = barreja([ok, ...dis.map(fmt)]).map(t => ({ html: `P = ${t}`, val: t }));
  return { sig: `fm-${C.id}-${f}-${v}`, enunciat: `${C.qui} ${C.txt(f, v)}. Si <b>x</b> és el nombre de ${C.u}, quina fórmula dona el preu <b>P</b>?`,
    visual: () => `<div style="margin-top:10px">${grTaulaHtml([0, 1, 2, 3].map(x => [x, f + v * x]), C.xn, C.yn, '')}</div>`, pista: { completa: `El preu fix es paga sempre (és el número sol). El preu per ${C.u1} va multiplicat per la x. Comprova la fórmula amb la taula.`, mitja: 'Quin número va multiplicat per la x?' },
    ...apartats([{ tipus: 'tria', llarg: true, html: 'La fórmula és…', opcions: ops, correcta: ok, etiq: {} }]),
    explicacio: `P = ${ok}: ${f} € fixos i ${v} € per cada ${C.u1}.`, solucio: [`El fix és ${f} € i per cada ${C.u1} se'n sumen ${v}: <b>P = ${ok}</b>.`, `Comprova: amb x = 2, ${f} + ${v} · 2 = ${f + 2 * v} €, com a la taula.`] };
};
GR6.tarifes = nv => {
  for (let k = 0; k < 200; k++) {
    const C = tria(GR6_CTX); const vs = [...new Set([...C.v, ...C.v.map(x => x * 2)])].sort((a, b) => b - a);
    const v1 = tria(vs), v2 = tria(vs.filter(x => x < v1)); if (v2 == null) continue;
    const f1 = tria(C.f), xi = grR(2, C.xmax - 2), f2 = f1 + (v1 - v2) * xi;
    const ymax = Math.max(f1 + v1 * C.xmax, f2 + v2 * C.xmax); if (ymax / C.sy > 24) continue;
    const E = gr6E(C, ymax); const [nA, nB] = C.noms; const yi = f1 + v1 * xi;
    const xa = 1, xb = C.xmax - 1; if (xb === xi || xa === xi) continue;
    const capes = [...gr6Linia({ C, f: f1, v: v1 }, GR_B), ...gr6Linia({ C, f: f2, v: v2 }, GR_T), { bola: [C.xmax, f1 + v1 * C.xmax], lab: 'A', col: GR_B, dx: -16, dy: -14 }, { bola: [C.xmax, f2 + v2 * C.xmax], lab: 'B', col: GR_T, dx: -16, dy: 18 }];
    const opAB = [{ html: `<b style="color:${GR_B}">A</b> ${nA}`, val: 'A' }, { html: `<b style="color:${GR_T}">B</b> ${nB}`, val: 'B' }];
    const its = [
      { tipus: 'tria', html: `Amb <b>${xa} ${C.u1}</b>, quina surt més barata?`, opcions: opAB, correcta: 'A', etiq: {} },
      { tipus: 'tria', html: `Amb <b>${xb} ${C.u}</b>, quina surt més barata?`, opcions: opAB, correcta: 'B', etiq: {} },
      { tipus: 'num', llarg: true, html: `Amb quantes ${C.u} costen <b>igual</b>?`, valor: xi, errs: { [yi]: 'rSwap' } }];
    if (nv === 3) its.push({ tipus: 'num', llarg: true, html: `I quant costen, llavors? (€)`, valor: yi, errs: { [xi]: 'rSwap' } });
    return { sig: `tf-${C.id}-${f1}-${v1}-${f2}-${v2}`, enunciat: `Dues empreses: <b style="color:${GR_B}">A · ${nA}</b> ${C.txt(f1, v1)}; <b style="color:${GR_T}">B · ${nB}</b> ${C.txt(f2, v2)}.`,
      visual: () => grSvg(E, capes), pista: { completa: `Per a cada quantitat, la més barata és la línia que queda <b>més avall</b>. On les dues línies es <b>creuen</b>, costen igual.`, mitja: 'Més avall = més barat. On es creuen, igual.' }, ...apartats(its),
      explicacio: `Fins a ${xi} ${C.u}, A és més barata; a partir de ${xi}, ho és B. Al ${xi} costen igual (${yi} €).`, solucio: [`Amb ${xa}: A = ${f1 + v1 * xa} € i B = ${f2 + v2 * xa} €. Més barata: <b>A</b>.`, `Amb ${xb}: A = ${f1 + v1 * xb} € i B = ${f2 + v2 * xb} €. Més barata: <b>B</b>.`, `Es creuen a <b>${xi} ${C.u}</b>: totes dues costen ${yi} €.`] };
  }
  return GR6.llegeix(nv);
};
TEMES.r6 = {
  gen: GR6,
  sequencia: {
    1: [['llegeix'], ['dibuixa'], ['formula'], ['llegeix'], ['dibuixa'], ['llegeix'], ['dibuixa'], ['formula']],
    2: [['llegeix'], ['dibuixa'], ['tarifes'], ['formula'], ['dibuixa'], ['llegeix'], ['tarifes'], ['dibuixa']],
    3: [['dibuixa'], ['tarifes'], ['llegeix'], ['dibuixa'], ['tarifes'], ['formula'], ['dibuixa'], ['llegeix']]
  },
  explicacio: [
    { text: `<p>Un electricista cobra <b>20 €</b> per venir i <b>15 €</b> per cada hora.</p><p class="petit">Amb 0 hores ja en pagues 20: la línia comença a <b class="parpelleja">20</b>. Cada hora, puja 15.</p>`, vis: () => grSvg(gr6E(GR6_CTX[0], 110), gr6Linia({ C: GR6_CTX[0], f: 20, v: 15 })) },
    { text: `<p>Per saber quant costa <b>3 hores</b>: puja des del 3 fins a la línia i mira a l'esquerra.</p><p class="petit">20 + 15 · 3 = <b>65 €</b>.</p>`, vis: () => grSvg(gr6E(GR6_CTX[0], 110), [...gr6Linia({ C: GR6_CTX[0], f: 20, v: 15 }), { linia: [[3, 0], [3, 65], [0, 65]], col: GR_B, dash: '6 5', w: 2.5 }, { pt: [3, 65], col: GR_B, r: 7 }]) },
    { text: `<p>Amb dues empreses, la més barata és la línia que queda <b class="parpelleja">més avall</b>.</p><p class="petit">On es creuen, costen igual. En Coma sempre mira on es creuen!</p>`, vis: () => `<div class="gr-dues">${grSvg(gr6E(GR6_CTX[0], 110), [...gr6Linia({ C: GR6_CTX[0], f: 20, v: 15 }, GR_B), ...gr6Linia({ C: GR6_CTX[0], f: 50, v: 5 }, GR_T)], 'gr-vis petit')}${grComaHtml('A 3 hores, 65 € totes dues.')}</div>` }
  ],
  exemple: nv => ({ enunciat: `Un taxi cobra 4 € en pujar i 2 € per km. Quant costa un viatge de 5 km?`, passos: [
    { text: `El preu fix és <b>4 €</b>: la línia comença a 4.`, vis: grSvg(gr6E(GR6_CTX[1], 20), gr6Linia({ C: GR6_CTX[1], f: 4, v: 2 })) },
    { text: `Pujo des del 5 fins a la línia: <b>14 €</b>. Ho comprovo: 4 + 2 · 5 = 14. <span class="marca-ok">✓</span>`, vis: grSvg(gr6E(GR6_CTX[1], 20), [...gr6Linia({ C: GR6_CTX[1], f: 4, v: 2 }), { linia: [[5, 0], [5, 14], [0, 14]], col: GR_B, dash: '6 5', w: 2.5 }, { pt: [5, 14], col: GR_B, r: 7 }]) }] })
};

/* =====================================================================
   OBJECTIU 7 · EL GRÀFIC DE TEMPERATURES
   ===================================================================== */
const GR7_TIPUS = {
  dia: { cat: ['0 h', '4 h', '8 h', '12 h', '16 h', '20 h'], perfil: [0, -2, 2, 8, 6, 2], b: [6, 15], txt: 'La temperatura d\'un dia de primavera a Badalona', q: 'A quina hora', qu: 'hora' },
  mesos: { cat: ['gen', 'febr', 'març', 'abr', 'maig', 'juny'], perfil: [0, 1, 3, 5, 8, 12], b: [6, 11], txt: 'La temperatura mitjana de cada mes a Badalona', q: 'Quin mes', qu: 'mes' },
  setmana: { cat: ['dl', 'dt', 'dc', 'dj', 'dv', 'ds', 'dg'], perfil: null, b: [-2, 3], txt: 'La temperatura a les 8 del matí, una setmana d\'hivern a Puigcerdà', q: 'Quin dia', qu: 'dia' },
  hivern: { cat: ['oct', 'nov', 'des', 'gen', 'febr', 'març'], perfil: [10, 4, -1, -3, -1, 3], b: [-1, 1], txt: 'La temperatura mitjana de cada mes a la Molina', q: 'Quin mes', qu: 'mes' }
};
function gr7Dades(nv) {
  for (let k = 0; k < 500; k++) {
    const id = tria(nv === 1 ? ['dia', 'mesos'] : ['dia', 'mesos', 'setmana', 'hivern']); const D = GR7_TIPUS[id];
    let vals;
    if (D.perfil) { const b = grR(...D.b); vals = D.perfil.map(p => p + b + (nv === 1 ? 0 : grR(-1, 1))); if (nv === 1) vals = vals.map(v => Math.round(v / 2) * 2); }
    else { let t = grR(...D.b); vals = D.cat.map(() => { t += grR(-3, 3); return t; }); }
    const mx = Math.max(...vals), mn = Math.min(...vals);
    if (vals.filter(v => v === mx).length > 1 || vals.filter(v => v === mn).length > 1 || mx - mn < 5) continue;
    if (nv === 1 && mn < 0) continue;
    const sy = nv === 3 ? 1 : 2, ly = nv === 1 ? 2 : nv === 2 ? 4 : 5;
    const y0 = Math.min(0, Math.floor((mn - 1) / ly) * ly), y1 = Math.ceil((mx + 1) / ly) * ly;
    const E = grEsc({ cat: D.cat, y0, y1, sy, ly, snapY: nv === 1 ? 2 : 1, ty: 'Temperatura (°C)', W: 470, H: 360 });
    return { id, D, vals, mx, mn, E, pts: vals.map((v, i) => [i, v]) };
  }
}
const gr7Taula = (T, cls = '') => grTaulaHtml(T.D.cat.map((c, i) => [c, grF(T.vals[i])]), T.id === 'dia' ? 'Hora' : T.id === 'setmana' ? 'Dia' : 'Mes', '°C', cls);
const gr7Graf = (T, cls) => grSvg(T.E, [{ linia: T.pts, col: GR_R, w: 3.5 }, ...T.pts.map(p => ({ pt: p, col: GR_R, r: 5.5 }))], cls);
const PISTA_GR7 = { completa: `A baix hi ha les hores (o els dies, o els mesos) i a l'esquerra, els graus. Per a cada columna de la taula, busca l'altura de la temperatura i clica-hi. Mira bé quant val cada quadret!`, mitja: 'Per a cada columna, puja fins a la temperatura de la taula.' };
const GR7 = {};
GR7.construeix = nv => {
  const T = gr7Dades(nv);
  return { sig: `ct-${T.id}-${T.vals}`, enunciat: `${T.D.txt}. Fes el gràfic de temperatures: posa un punt a cada columna.`, visual: () => `<div style="margin-top:10px">${gr7Taula(T)}</div>`, pista: PISTA_GR7,
    ...grGiny(grPosa({ E: T.E, mode: 'columna', obj: T.pts, coma: `Cada quadret val <b>${T.E.sy} °C</b>${T.mn < 0 ? '. Sota el 0, negatius!' : '.'}`, fi: [{ linia: T.pts, col: GR_R, w: 3.5, cls: 'gr-anim' }, ...T.pts.map(p => ({ pt: p, col: GR_R }))], premi: 'Meu! Quin gràfic més ben fet!' }), T.D.cat.map((c, i) => `${c}: ${grF(T.vals[i])} °C`).join(' · ')),
    explicacio: `Cada valor de la taula és un punt; units, fan el gràfic.`, solucio: [`Punts: ${T.D.cat.map((c, i) => `${c} → <b>${grF(T.vals[i])} °C</b>`).join(', ')}.`, `S'uneixen en ordre i surt la línia de la temperatura.`] };
};
GR7.llegeix = nv => {
  const T = gr7Dades(nv); const opc = T.D.cat.map(c => ({ html: c, val: c }));
  const iMx = T.vals.indexOf(T.mx), iMn = T.vals.indexOf(T.mn);
  const its = [
    { tipus: 'enter', escrit: true, llarg: true, html: `Quina és la temperatura <b>més alta</b>? (°C)`, valor: T.mx, errs: {} },
    { tipus: 'tria', llarg: true, html: `${T.D.q} fa <b>més fred</b>?`, opcions: opc, correcta: T.D.cat[iMn], etiq: {} },
    { tipus: 'num', llarg: true, html: `Quants graus de diferència hi ha entre la més alta i la més baixa?`, valor: T.mx - T.mn, errs: { [T.mx + T.mn]: 'rSigne' } }];
  if (nv > 1) { const pujades = T.vals.slice(1).map((v, i) => v - T.vals[i]); const mp = Math.max(...pujades);
    if (mp > 0 && pujades.filter(x => x === mp).length === 1) { const i = pujades.indexOf(mp); its.push({ tipus: 'tria', llarg: true, html: `On <b>puja més</b> la temperatura?`, opcions: T.D.cat.slice(1).map((c, j) => ({ html: `${T.D.cat[j]} → ${c}`, val: String(j) })), correcta: String(i), etiq: {} }); } }
  return { sig: `lt-${T.id}-${T.vals}`, enunciat: `${T.D.txt}. Mira el gràfic.`, visual: () => gr7Graf(T), pista: { completa: `El punt més alt és la temperatura més alta; el més baix, la més baixa. La diferència: la més alta menys la més baixa${T.mn < 0 ? ' (amb negatius, compta els graus que hi ha de l\'una a l\'altra passant pel 0)' : ''}.`, mitja: 'Busca el punt més alt i el més baix.' }, ...apartats(its),
    explicacio: `Màxima ${grF(T.mx)} °C, mínima ${grF(T.mn)} °C: diferència ${T.mx - T.mn} °C.`, solucio: [`El punt més alt: <b>${grF(T.mx)} °C</b> (${T.D.cat[iMx]}).`, `El més baix: ${grF(T.mn)} °C (<b>${T.D.cat[iMn]}</b>).`, `Diferència: ${grF(T.mx)} − (${grF(T.mn)}) = <b>${T.mx - T.mn} °C</b>.`] };
};
GR7.errada = nv => {
  const T = gr7Dades(nv); const k = grR(0, T.vals.length - 1); const d = tria([-4, -3, 3, 4].map(x => x * (nv === 1 ? 1 : 1)));
  let v = T.vals[k] + d; if (nv === 1) v = T.vals[k] + (d > 0 ? 4 : -4); if (v < T.E.y0 || v > T.E.y1) v = T.vals[k] - d;
  const pts = T.pts.map((p, i) => i === k ? [i, v] : p);
  return { sig: `er-${T.id}-${T.vals}-${k}`, enunciat: `${T.D.txt}. La Laia ha fet el gràfic, però s'ha equivocat en <b>un punt</b>. Quin?`,
    visual: () => `<div class="gr-dues">${gr7Taula(T)}${grSvg(T.E, [{ linia: pts, col: GR_R, w: 3 }, ...pts.map(p => ({ pt: p, col: GR_R, r: 5 }))], 'gr-vis petit')}</div>`, pista: { completa: `Compara cada punt amb la taula, un per un.`, mitja: 'Comprova els punts un per un.' },
    ...apartats([{ tipus: 'tria', llarg: true, html: 'El punt equivocat és el de…', opcions: T.D.cat.map(c => ({ html: c, val: c })), correcta: T.D.cat[k], etiq: {} }]),
    explicacio: `A ${T.D.cat[k]} hi havia ${grF(T.vals[k])} °C, no ${grF(v)}.`, solucio: [`${T.D.cat[k]}: la taula diu <b>${grF(T.vals[k])} °C</b>, però el punt és a ${grF(v)} °C.`] };
};
const gr7Ex = (() => { const vals = [10, 8, 12, 18, 16, 12]; const E = grEsc({ cat: GR7_TIPUS.dia.cat, y0: 0, y1: 20, sy: 2, ly: 2, ty: 'Temperatura (°C)', W: 470, H: 340 }); return { vals, E, pts: vals.map((v, i) => [i, v]), D: GR7_TIPUS.dia, id: 'dia' }; })();
TEMES.r7 = {
  gen: GR7,
  sequencia: {
    1: [['construeix'], ['llegeix'], ['construeix'], ['errada'], ['construeix'], ['llegeix'], ['construeix'], ['llegeix']],
    2: [['construeix'], ['llegeix'], ['construeix'], ['errada'], ['construeix'], ['llegeix'], ['construeix'], ['errada']],
    3: [['construeix'], ['llegeix'], ['errada'], ['construeix'], ['llegeix'], ['construeix'], ['errada'], ['construeix']]
  },
  explicacio: [
    { text: `<p>Un <b>gràfic de temperatures</b>: a baix, les hores (o els dies, o els mesos); a l'esquerra, els <b>graus</b>.</p><p class="petit">Mira <b class="parpelleja">quant val cada quadret</b>: aquí, 2 °C.</p>`, vis: () => grSvg(gr7Ex.E, []) },
    { text: `<p>Cada valor de la taula és un <b>punt</b>: a les 12 h fa 18 °C.</p><p class="petit">Després els punts s'uneixen en ordre.</p>`, vis: () => `<div class="gr-dues">${gr7Taula(gr7Ex)}${gr7Graf(gr7Ex, 'gr-vis petit')}</div>` },
    { text: `<p>A la muntanya, a l'hivern, la temperatura pot ser <b class="parpelleja">negativa</b>: els punts van per sota del 0.</p><p class="petit">De −3 °C a 5 °C hi ha 8 graus de diferència.</p>`, vis: () => `<div class="gr-dues">${grSvg(grEsc({ cat: GR7_TIPUS.hivern.cat, y0: -4, y1: 12, sy: 1, ly: 2, ty: 'Temperatura (°C)', W: 470, H: 300 }), [{ linia: [[0, 10], [1, 5], [2, -1], [3, -3], [4, -1], [5, 3]], col: GR_R }, ...[[0, 10], [1, 5], [2, -1], [3, -3], [4, -1], [5, 3]].map(p => ({ pt: p, col: GR_R, r: 5 }))], 'gr-vis petit')}${grComaHtml('Brrr… quin fred, meu!')}</div>` }
  ],
  exemple: nv => ({ enunciat: `Fes el gràfic: 0 h → 10 °C, 4 h → 8 °C, 8 h → 12 °C…`, passos: [
    { text: `A la columna de les <b>0 h</b>, pujo fins al <b>10</b> i hi poso el punt.`, vis: grSvg(gr7Ex.E, [{ pt: [0, 10], col: GR_R }, { linia: [[0, 0], [0, 10]], col: GR_B, dash: '6 5', w: 2.5 }]) },
    { text: `Faig el mateix amb cada columna i els uneixo en ordre. <span class="marca-ok">✓</span>`, vis: gr7Graf(gr7Ex) }] })
};

/* =====================================================================
   OBJECTIU 8 · EL CLIMOGRAMA (barres: pluja en mm · línia: temperatura en °C)
   Dades aproximades (valors mitjans arrodonits).
   ===================================================================== */
const GR8_MESOS = ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'];
const GR8_CAT = ['G', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const grAlMes = i => /^[aeiou]/.test(GR8_MESOS[i]) ? `a l'${GR8_MESOS[i]}` : `al ${GR8_MESOS[i]}`;
const GR8_CIUTATS = [
  { nom: 'Badalona', T: [10, 11, 13, 15, 18, 22, 25, 26, 22, 18, 14, 11], P: [40, 30, 40, 50, 50, 30, 20, 50, 80, 90, 60, 40] },
  { nom: 'Lleida', T: [6, 8, 11, 14, 18, 23, 26, 25, 21, 16, 10, 7], P: [20, 20, 20, 40, 50, 30, 10, 20, 40, 50, 30, 20] },
  { nom: 'Puigcerdà', T: [2, 3, 6, 8, 12, 16, 19, 18, 15, 11, 6, 3], P: [30, 30, 40, 60, 90, 80, 60, 70, 70, 60, 50, 40] },
  { nom: 'Girona', T: [8, 9, 11, 13, 17, 21, 24, 23, 20, 16, 11, 9], P: [60, 50, 50, 70, 80, 50, 30, 60, 80, 100, 70, 60] },
  { nom: 'Tortosa', T: [10, 11, 13, 15, 19, 23, 26, 25, 23, 19, 14, 11], P: [30, 30, 30, 40, 50, 30, 10, 30, 70, 80, 50, 40] }
];
function gr8Clima() { const C = tria(GR8_CIUTATS); return { ...C, T: C.T.map(t => t + grR(-1, 1)), P: C.P.map(p => Math.max(10, p + tria([-10, 0, 0, 10]))) }; }
const gr8Pmax = C => Math.max(120, Math.ceil((Math.max(...C.P) + 1) / 20) * 20);
function gr8Svg(C, nv, cls = 'gr-vis') {
  if (nv === 1) { // dues gràfiques separades
    const Ep = grEsc({ cat: GR8_CAT, y0: 0, y1: gr8Pmax(C), sy: 10, ly: 20, ty: 'Pluja (mm)', W: 540, H: 220 });
    const Et = grEsc({ cat: GR8_CAT, y0: 0, y1: 30, sy: 5, ly: 5, ty: 'Temperatura (°C)', W: 540, H: 200 });
    return `<div class="gr-dues">${grSvg(Ep, [{ barres: C.P.map((p, i) => [i, p]) }], cls + ' petit')}${grSvg(Et, [{ linia: C.T.map((t, i) => [i, t]), col: GR_R, w: 3.5 }, ...C.T.map((t, i) => ({ pt: [i, t], col: GR_R, r: 4.5 }))], cls + ' petit')}</div>`;
  }
  const pm = gr8Pmax(C); const E = grEsc({ cat: GR8_CAT, y0: 0, y1: 30, sy: 5, ly: 5, ty: 'Temperatura (°C)', y2: { a: 0, b: pm, l: 20, t: 'Pluja (mm)' }, W: 560, H: 340 });
  const k = 30 / pm;
  return grSvg(E, [{ barres: C.P.map((p, i) => [i, p * k]) }, { linia: C.T.map((t, i) => [i, t]), col: GR_R, w: 3.5 }, ...C.T.map((t, i) => ({ pt: [i, t], col: GR_R, r: 4.5 }))], cls);
}
const gr8Opcions = (v, pas, u, min = 0) => { const s = new Set([v]); const o = [v]; for (const d of barreja([pas, -pas, 2 * pas, -2 * pas, 3 * pas])) { const x = v + d; if (x >= min && !s.has(x)) { s.add(x); o.push(x); } if (o.length === 4) break; } return o.sort((a, b) => a - b).map(x => ({ html: `${x} ${u}`, val: String(x) })); };
const PISTA_GR8 = { completa: `Les <b>barres</b> són la pluja (mm): es llegeixen a l'eix de la pluja. La <b>línia</b> és la temperatura (°C): es llegeix a l'eix dels graus. No els barregis!`, mitja: 'Barres = pluja (mm) · línia = temperatura (°C).' };
const gr8Unic = (arr, f) => { const m = f(...arr); return arr.filter(x => x === m).length === 1 ? arr.indexOf(m) : -1; };
const GR8 = {};
GR8.llegeix = nv => {
  let C, iP, iT; for (let k = 0; k < 100; k++) { C = gr8Clima(); iP = gr8Unic(C.P, Math.max); iT = gr8Unic(C.T, Math.max); if (iP >= 0 && iT >= 0) break; }
  const altres = (i, n) => barreja([...Array(12).keys()].filter(j => j !== i)).slice(0, n);
  const mesOp = i => [i, ...altres(i, 3)].sort((a, b) => a - b).map(j => ({ html: GR8_MESOS[j], val: String(j) }));
  const m1 = grR(0, 11), m2 = grR(0, 11);
  const its = [
    { tipus: 'tria', llarg: true, html: `Quin mes <b>plou més</b>?`, opcions: mesOp(iP), correcta: String(iP), etiq: {} },
    { tipus: 'tria', llarg: true, html: `Quina temperatura fa ${grAlMes(m1)}?`, opcions: gr8Opcions(C.T[m1], 5, '°C', -5), correcta: String(C.T[m1]), etiq: { [String(C.P[m1])]: 'rEscala' } },
    { tipus: 'tria', llarg: true, html: `Quanta pluja cau ${grAlMes(m2)}?`, opcions: gr8Opcions(C.P[m2], 20, 'mm', 0), correcta: String(C.P[m2]), etiq: {} }];
  if (nv === 3) its.push({ tipus: 'tria', llarg: true, html: `Quin és el mes <b>més calorós</b>?`, opcions: mesOp(iT), correcta: String(iT), etiq: {} });
  return { sig: `cl-${C.nom}-${C.T}-${C.P}-${m1}-${m2}`, enunciat: `${nv === 1 ? 'Les gràfiques del clima' : 'El climograma'} de <b>${C.nom}</b>. ${nv === 1 ? 'A dalt, la pluja de cada mes; a baix, la temperatura.' : 'Barres: pluja (eix de la dreta) · línia: temperatura (eix de l\'esquerra).'}`,
    visual: () => gr8Svg(C, nv), pista: PISTA_GR8, ...apartats(its),
    explicacio: `Barres = pluja, línia = temperatura.`, solucio: [`La barra més alta és ${grAlMes(iP)}: és el mes que <b>plou més</b>.`, `${grAlMes(m1).replace(/^./, c => c.toUpperCase())}, la línia és a <b>${C.T[m1]} °C</b>.`, `${grAlMes(m2).replace(/^./, c => c.toUpperCase())}, la barra arriba a <b>${C.P[m2]} mm</b>.`] };
};
GR8.verifica = nv => {
  let C, iP, iT; for (let k = 0; k < 100; k++) { C = gr8Clima(); iP = gr8Unic(C.P, Math.max); iT = gr8Unic(C.T, Math.max); if (iP >= 0 && iT >= 0) break; }
  const af = [];
  const mm = () => { let a, b; do { a = grR(0, 11); b = grR(0, 11); } while (a === b || C.P[a] === C.P[b]); return [a, b]; };
  { const [a, b] = mm(); af.push({ t: `${grAlMes(a).replace(/^./, c => c.toUpperCase())} plou més que ${grAlMes(b)}.`, v: C.P[a] > C.P[b] }); }
  { const m = Math.random() < .5 ? iT : tria([...Array(12).keys()].filter(j => j !== iT && Math.abs(C.T[j] - C.T[iT]) >= 3)); af.push({ t: `El mes més calorós és el ${GR8_MESOS[m]}.`, v: m === iT }); }
  { const m = grR(0, 11), d = tria([-6, -4, 4, 6]); const k = C.T[m] + d; af.push({ t: `${grAlMes(m).replace(/^./, c => c.toUpperCase())} la temperatura és de més de ${k} °C.`, v: C.T[m] > k }); }
  { const m = grR(0, 11), d = tria([-30, -20, 20, 30]); const k = Math.max(10, C.P[m] + d); if (k !== C.P[m]) af.push({ t: `${grAlMes(m).replace(/^./, c => c.toUpperCase())} plouen menys de ${k} mm.`, v: C.P[m] < k }); }
  const tri = barreja(af).slice(0, 3); if (tri.every(x => x.v) || tri.every(x => !x.v)) return GR8.verifica(nv);
  const its = tri.map(x => ({ tipus: 'tria', llarg: true, html: x.t, opcions: [{ html: 'Cert', val: 'c' }, { html: 'Fals', val: 'f' }], correcta: x.v ? 'c' : 'f', etiq: {} }));
  return { sig: `ve-${C.nom}-${C.T}-${tri.map(x => x.t).join('|')}`, enunciat: `${nv === 1 ? 'Les gràfiques del clima' : 'El climograma'} de <b>${C.nom}</b>. Cada frase, és certa o falsa?`, visual: () => gr8Svg(C, nv), pista: PISTA_GR8, ...apartats(its),
    explicacio: `Per decidir, llegeix cada mes a la gràfica bona: pluja a les barres, temperatura a la línia.`, solucio: tri.map(x => `${x.t} → <b>${x.v ? 'Cert' : 'Fals'}</b>.`) };
};
TEMES.r8 = {
  gen: GR8,
  sequencia: {
    1: [['llegeix'], ['llegeix'], ['verifica'], ['llegeix'], ['verifica'], ['llegeix'], ['llegeix'], ['verifica']],
    2: [['llegeix'], ['verifica'], ['llegeix'], ['verifica'], ['llegeix'], ['llegeix'], ['verifica'], ['llegeix']],
    3: [['llegeix'], ['verifica'], ['llegeix'], ['verifica'], ['llegeix'], ['verifica'], ['llegeix'], ['verifica']]
  },
  explicacio: [
    { text: `<p>Un <b>climograma</b> explica el clima d'un lloc, mes a mes.</p><p class="petit">Les <b class="parpelleja">barres</b> són la <b>pluja</b> (en mm). La <b>línia</b> és la <b>temperatura</b> (en °C).</p>`, vis: () => gr8Svg(GR8_CIUTATS[0], 2) },
    { text: `<p>Cada cosa es llegeix al <b>seu</b> eix: la temperatura a l'esquerra; la pluja a la <b class="parpelleja">dreta</b>.</p><p class="petit">A Badalona, a l'octubre plou 90 mm i fa uns 18 °C.</p>`, vis: () => `<div class="gr-dues">${gr8Svg(GR8_CIUTATS[0], 2, 'gr-vis petit')}${grComaHtml('No barregis els eixos, meu!')}</div>` },
    { text: `<p>Si comparem dues ciutats, veiem si fa més fred o si plou més.</p><p class="petit">A Puigcerdà, al Pirineu, fa molt més fred que a Badalona.</p>`, vis: () => gr8Svg(GR8_CIUTATS[2], 2) }
  ],
  exemple: nv => ({ enunciat: `Climograma de Badalona: quina pluja cau a l'octubre?`, passos: [
    { text: `La pluja són les <b>barres</b>: busco la barra de l'octubre (O).`, vis: gr8Svg(GR8_CIUTATS[0], nv === 1 ? 1 : 2) },
    { text: `La barra arriba a <b>90 mm</b> (a l'eix de la pluja). <span class="marca-ok">✓</span>`, vis: gr8Svg(GR8_CIUTATS[0], nv === 1 ? 1 : 2) }] })
};

UNITATS.r.carregada = true;
