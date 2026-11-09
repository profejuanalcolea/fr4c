'use strict';
/* FR-4C · Matemàtiques 4t ESO · Unitat Enters.
   L'app (index.html) carrega aquest fitxer quan cal. Fa servir les funcions del nucli de l'app. */
const fzT = v => `${fz(v)} °C`;
const NUMS = ['zero', 'un', 'dos', 'tres', 'quatre', 'cinc', 'sis', 'set', 'vuit', 'nou', 'deu', 'onze', 'dotze', 'tretze', 'catorze', 'quinze', 'setze', 'disset', 'divuit', 'dinou', 'vint'];
const ORD_F = ['', 'primera', 'segona', 'tercera', 'quarta', 'cinquena', 'sisena', 'setena'];
const ORD_M = ['', 'primer', 'segon', 'tercer', 'quart', 'cinquè', 'sisè', 'setè'];
const graus = (n, paraules) => `${paraules && n <= 20 ? NUMS[n] : n} ${n === 1 ? 'grau' : 'graus'}`;

function edificiSVG({ min = -3, max = 3, pis = 0, de = null, robotOn = true, colors = false, marcaPis = null }) {
  const FH = 40, W = 190, x0 = 70, top = 16, n = max - min + 1, H = n * FH;
  const y = f => top + (max - f) * FH;
  let s = '';
  for (let f = max; f >= min; f--) {
    const yy = y(f), sota = f < 0;
    s += `<rect x="${x0}" y="${yy}" width="${W}" height="${FH}" fill="${sota ? '#e8dccb' : '#f4f2ee'}" stroke="#1b1b1b" stroke-width="2"/>`;
    if (!sota && f !== 0) for (let k = 0; k < 2; k++) s += `<rect x="${x0 + 14 + k * 46}" y="${yy + 9}" width="30" height="${FH - 18}" rx="3" fill="#cfe0f5" stroke="#1b1b1b" stroke-width="1.5"/>`;
    if (f === 0) s += `<rect x="${x0 + 14}" y="${yy + 8}" width="22" height="${FH - 8}" rx="2" fill="#a6927a" stroke="#1b1b1b" stroke-width="1.5"/>`;
    if (sota) s += `<text x="${x0 + 50}" y="${yy + FH / 2 + 7}" text-anchor="middle" font-size="18" font-weight="800" fill="#a08a6a">P</text>`;
    const lc = colors ? colZ(f) : '#1b1b1b';
    s += `<text x="${x0 - 12}" y="${yy + FH / 2 + 7}" text-anchor="end" font-size="20" font-weight="800" fill="${lc}">${f === 0 ? '0' : fz(f)}</text>`;
    if (f === 0) s += `<text x="${x0 + 44}" y="${yy + FH / 2 + 5}" font-size="11" font-weight="800" fill="#8f8a82">PLANTA BAIXA</text>`;
    if (marcaPis === f) s += `<rect x="${x0 - 52}" y="${yy + 4}" width="44" height="${FH - 8}" rx="8" fill="none" stroke="${T}" stroke-width="3"/>`;
  }
  const yg = y(-1);
  s += `<line x1="${x0 - 60}" y1="${yg}" x2="${x0 + W + 60}" y2="${yg}" stroke="#5b8f3a" stroke-width="5"/><text x="${x0 + W + 8}" y="${yg - 18}" font-size="11" font-weight="700" fill="#5b8f3a">nivell</text><text x="${x0 + W + 8}" y="${yg - 6}" font-size="11" font-weight="700" fill="#5b8f3a">del carrer</text>`;
  const xs = x0 + W - 58; s += `<rect x="${xs}" y="${top}" width="46" height="${H}" fill="#fff" stroke="#1b1b1b" stroke-width="2"/>`;
  if (robotOn) {
    const cy = y(pis); const dy = de != null ? y(de) - y(pis) : 0;
    s += `<g><rect x="${xs + 3}" y="${cy + 3}" width="40" height="${FH - 6}" rx="4" fill="${T}" stroke="#1b1b1b" stroke-width="2"/>
      <rect x="${xs + 9}" y="${cy + 8}" width="28" height="22" rx="5" fill="#fff" stroke="#1b1b1b" stroke-width="2"/><rect x="${xs + 13}" y="${cy + 12}" width="20" height="14" rx="3" fill="#1b1b1b"/>
      <circle cx="${xs + 19}" cy="${cy + 18}" r="2.4" fill="${T}"/><circle cx="${xs + 27}" cy="${cy + 18}" r="2.4" fill="${T}"/><path d="M${xs + 19} ${cy + 22} q4 3 8 0" stroke="${T}" stroke-width="1.6" fill="none"/>
      ${dy ? `<animateTransform attributeName="transform" type="translate" from="0 ${dy}" to="0 0" dur="${Math.min(2.4, .45 * Math.abs(de - pis) + .4)}s" begin="0.3s" fill="freeze" calcMode="spline" keySplines=".45 0 .25 1" keyTimes="0;1"/>` : ''}</g>`;
    if (dy) s = s.replace(`<g><rect x="${xs + 3}"`, `<g transform="translate(0 ${dy})"><rect x="${xs + 3}"`);
  }
  return `<svg class="dib edifici" viewBox="0 0 340 ${H + top + 10}" width="${Math.round(340 * Math.min(1, 330 / (H + top + 10)))}">${s}</svg>`;
}
function termometreSVG({ v = 0, min = -10, max = 10, lab = 2, anim = true, ample = 150 }) {
  const top = 18, L = 260, x = 74, k = L / (max - min), y = t => top + (max - t) * k, yb = top + L + 26;
  let s = `<rect x="${x - 9}" y="${top - 10}" width="18" height="${L + 28}" rx="9" fill="#fff" stroke="#1b1b1b" stroke-width="2.5"/>`;
  for (let t = min; t <= max; t++) {
    const yy = y(t), gran = t % lab === 0;
    s += `<line x1="${x + 10}" y1="${yy}" x2="${x + 10 + (gran ? 16 : 8)}" y2="${yy}" stroke="#1b1b1b" stroke-width="${t === 0 ? 3 : gran ? 2 : 1.2}"/>`;
    if (gran) s += `<text x="${x + 32}" y="${yy + 6}" font-size="${t === 0 ? 17 : 15}" font-weight="${t === 0 ? 900 : 700}" fill="${t < 0 ? BLAU : t > 0 ? '#1b1b1b' : '#1b1b1b'}">${t === 0 ? '0' : fz(t)}</text>`;
  }
  s += `<line x1="${x - 30}" y1="${y(0)}" x2="${x - 11}" y2="${y(0)}" stroke="#1b1b1b" stroke-width="2" stroke-dasharray="3 3"/>`;
  const yv = y(v), hFi = yb - yv;
  s += `<rect x="${x - 4.5}" y="${yv}" width="9" height="${hFi}" fill="#e23b3b">${anim ? `<animate attributeName="y" from="${yb}" to="${yv}" dur="1.2s" fill="freeze"/><animate attributeName="height" from="0" to="${hFi}" dur="1.2s" fill="freeze"/>` : ''}</rect>`;
  s += `<circle cx="${x}" cy="${yb}" r="17" fill="#e23b3b" stroke="#1b1b1b" stroke-width="2.5"/><text x="${x}" y="${yb + 5}" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">°C</text>`;
  return `<svg class="dib" viewBox="0 0 150 ${yb + 22}" width="${ample}">${s}</svg>`;
}
function marSVG({ elems = [], maxAbs = 200, anim = true }) {
  const W = 460, H = 320, y0 = 150, k = 125 / maxAbs; const y = v => y0 - Math.sign(v) * Math.min(125, Math.abs(v) * k);
  // fons marí: costa (x=380) → plataforma continental en suau pendent → talús → plana abissal
  const fons = `M380 ${y0} C 340 ${y0 + 8}, 290 ${y0 + 26}, 250 ${y0 + 36} C 228 ${y0 + 42}, 212 ${y0 + 90}, 192 ${y0 + 132} C 182 ${y0 + 142}, 150 ${y0 + 145}, 0 ${y0 + 148} L0 ${H} L${W} ${H} L${W} ${y0} Z`;
  let s = `<rect x="0" y="0" width="${W}" height="${y0}" fill="#e9f3fd"/>
    <rect x="0" y="${y0}" width="${W}" height="${H - y0}" fill="#bcd8f2"/>
    <rect x="0" y="${y0 + 60}" width="${W}" height="${H - y0 - 60}" fill="#a9cbec" opacity=".6"/>
    <path d="${fons}" fill="#dcc79c" stroke="#1b1b1b" stroke-width="2"/>
    <path d="M380 ${y0} L392 ${y0 - 6} C 405 ${y0 - 22}, 420 ${y0 - 58}, 440 ${y0 - 70} L${W} ${y0 - 74} L${W} ${y0} Z" fill="#9dbb6b" stroke="#1b1b1b" stroke-width="2"/>
    <path d="M372 ${y0 + 1} L392 ${y0 - 6} L392 ${y0 + 1} Z" fill="#efe0b8"/>
    ${[[300, y0 + 25], [272, y0 + 32], [326, y0 + 19]].map(([ax, ay]) => `<path d="M${ax} ${ay} q -4 -5 0 -9 q 4 -4 0 -8" fill="none" stroke="#4f9a53" stroke-width="2.5" stroke-linecap="round"/>`).join('')}
    ${[[60, y0 + 146], [128, y0 + 144], [168, y0 + 140]].map(([rx, ry]) => `<ellipse cx="${rx}" cy="${ry}" rx="9" ry="5" fill="#b59f78" stroke="#1b1b1b" stroke-width="1.2"/>`).join('')}
    <path d="M0 ${y0} q 15 -6 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0" fill="none" stroke="${BLAU}" stroke-width="2.5"/>
    <text x="8" y="${y0 - 6}" font-size="12" font-weight="800" fill="${BLAU}">nivell del mar: 0 m</text>
    <text x="306" y="${y0 + 52}" font-size="10" font-weight="700" fill="#7a6640" transform="rotate(14 306 ${y0 + 52})">plataforma</text>
    <text x="12" y="${H - 8}" font-size="10" font-weight="700" fill="#7a6640">fons marí</text>`;
  const negs = elems.filter(e => e.v < 0), pos = elems.filter(e => e.v > 0), zer = elems.filter(e => e.v === 0);
  const xs = new Map(); negs.forEach((e, i) => xs.set(e, 85 + i * 75)); zer.forEach((e, i) => xs.set(e, 215 + i * 40)); pos.forEach((e, i) => xs.set(e, 240 + i * 75));
  elems.forEach((e, i) => {
    const x = xs.get(e), yy = e.v === 0 ? y0 : y(e.v);
    let ic = '';
    if (e.t === 'avio') ic = `<path d="M${x - 26} ${yy} h44 l12 -4 l-12 -4 h-14 l-12 -12 h-6 l6 12 h-12 l-6 -6 h-4 l3 10 z" fill="#fff" stroke="#1b1b1b" stroke-width="2"/>`;
    else if (e.t === 'gavina') ic = `<path d="M${x - 16} ${yy - 4} q8 -10 16 0 q8 -10 16 0" fill="none" stroke="#1b1b1b" stroke-width="3" stroke-linecap="round"/>`;
    else if (e.t === 'submari') ic = `<rect x="${x - 26}" y="${yy - 9}" width="52" height="18" rx="9" fill="#f2c94c" stroke="#1b1b1b" stroke-width="2"/><rect x="${x - 6}" y="${yy - 18}" width="12" height="10" rx="2" fill="#f2c94c" stroke="#1b1b1b" stroke-width="2"/><circle cx="${x + 12}" cy="${yy}" r="3.5" fill="#cfe0f5" stroke="#1b1b1b" stroke-width="1.5"/>`;
    else if (e.t === 'peix') ic = `<path d="M${x - 14} ${yy} q14 -12 26 0 q-12 12 -26 0 z M${x + 12} ${yy} l8 -7 v14 z" fill="${T}" stroke="#1b1b1b" stroke-width="1.8"/>`;
    else if (e.t === 'boia') ic = `<circle cx="${x}" cy="${yy}" r="12" fill="none" stroke="#e23b3b" stroke-width="7"/><circle cx="${x}" cy="${yy}" r="12" fill="none" stroke="#fff" stroke-width="7" stroke-dasharray="6 6.5"/>`;
    const ty = e.v > 0 ? yy - 18 : yy + 30;
    s += `<g ${anim ? `class="pop" style="animation-delay:${.2 + i * .35}s"` : ''}>${ic}<text x="${x}" y="${ty}" text-anchor="middle" font-size="16" font-weight="900" fill="${colZ(e.v)}" stroke="#fff" stroke-width="4" paint-order="stroke">${fz(e.v)} m</text></g>`;
  });
  return `<svg class="dib" viewBox="0 0 ${W} ${H}" width="${W}">${s}</svg>`;
}
const compteHtml = (v, nom = 'El meu compte') => `<div class="compte"><div class="compte-cap">🏦 ${nom}</div><div class="compte-saldo" style="color:${v < 0 ? '#d64242' : '#2c9a58'}">${fz(v)} €</div><div class="compte-peu">${v < 0 ? 'En números vermells: deus diners' : 'Saldo positiu: tens diners'}</div></div>`;

const CAT_POLI = [[0.66, 42.84], [0.95, 42.80], [1.35, 42.70], [1.45, 42.60], [1.73, 42.50], [1.98, 42.45], [2.35, 42.40], [2.68, 42.40], [3.05, 42.45], [3.17, 42.43], [3.32, 42.32], [3.15, 42.10], [3.22, 41.95], [2.95, 41.70], [2.55, 41.55], [2.20, 41.40], [1.90, 41.27], [1.45, 41.15], [1.05, 41.05], [0.88, 40.88], [0.72, 40.70], [0.52, 40.55], [0.30, 40.62], [0.18, 40.75], [0.27, 40.95], [0.22, 41.20], [0.35, 41.45], [0.33, 41.68], [0.48, 41.93], [0.62, 42.13], [0.72, 42.40], [0.65, 42.65]];
const CIUTATS_CAT = { Vielha: [0.80, 42.70, 'pir'], 'Puigcerdà': [1.93, 42.43, 'pir'], "La Seu d'Urgell": [1.46, 42.36, 'pir'], Berga: [1.85, 42.10, 'int'], Vic: [2.25, 41.93, 'int'], Lleida: [0.62, 41.62, 'int'], Manresa: [1.83, 41.73, 'int'], Girona: [2.82, 41.98, 'int'], Figueres: [2.96, 42.27, 'cos'], Badalona: [2.25, 41.45, 'cos'], Tarragona: [1.25, 41.12, 'cos'], Tortosa: [0.52, 40.81, 'cos'] };
const RANG_CAT = { pir: [-9, -1], int: [-4, 4], cos: [3, 11] };
function tempsCat(quantes = 7) {
  const noms = barreja(Object.keys(CIUTATS_CAT)).slice(0, quantes);
  if (!noms.includes('Badalona')) noms[0] = 'Badalona';
  return noms.map(n => { const [a, b] = RANG_CAT[CIUTATS_CAT[n][2]]; return { nom: n, t: rnd(a, b) }; });
}
function mapaCatSVG(ciutats) {
  const px = ([lo, la]) => [(lo - 0.1) * 150, (42.95 - la) * 200];
  const pts = CAT_POLI.map(px).map(p => p.map(v => v.toFixed(1)).join(',')).join(' ');
  let s = `<polygon points="${pts}" fill="#f3efe6" stroke="#1b1b1b" stroke-width="3" stroke-linejoin="round"/><text x="430" y="420" text-anchor="end" font-size="15" font-weight="800" fill="${BLAU}" opacity=".7">Mar Mediterrani</text>`;
  ciutats.forEach(c => {
    const [x, y] = px(CIUTATS_CAT[c.nom]);
    const w = 52;
    s += `<circle cx="${x}" cy="${y}" r="4" fill="#1b1b1b"/><rect x="${x - w / 2}" y="${y - 40}" width="${w}" height="26" rx="8" fill="${colZ(c.t)}" stroke="#1b1b1b" stroke-width="1.5"/><text x="${x}" y="${y - 21}" text-anchor="middle" font-size="16" font-weight="900" fill="#fff">${fz(c.t)}°</text>
      <text x="${x}" y="${y + 18}" text-anchor="middle" font-size="13" font-weight="700" fill="#1b1b1b" stroke="#f3efe6" stroke-width="4" paint-order="stroke">${esc(c.nom)}</text>`;
  });
  return `<div class="mapa-t"><div class="mapa-t-cap">El temps a Catalunya · matinada</div><svg class="dib mapa" viewBox="-10 -10 520 500" width="380">${s}</svg><div class="mapa-t-peu">Mapa esquemàtic</div></div>`;
}
const EUROPA = { Moscou: [-16, -5], Oslo: [-11, -2], Estocolm: [-9, -1], 'Varsòvia': [-8, 0], 'Berlín': [-5, 3], Viena: [-4, 3], 'París': [0, 6], Londres: [2, 8], Roma: [5, 12], Atenes: [8, 14], Lisboa: [9, 15], Badalona: [6, 12] };
function tempsEuropa(q = 8) { const n = barreja(Object.keys(EUROPA)).slice(0, q); return n.map(c => ({ nom: c, t: rnd(...EUROPA[c]) })); }
const panellTemps = (titol, ll) => `<div class="mapa-t"><div class="mapa-t-cap">${titol}</div><div class="panell-t">${ll.map(c => `<div class="pt-c"><span>${esc(c.nom)}</span><b style="background:${colZ(c.t)}">${fz(c.t)}°</b></div>`).join('')}</div></div>`;
const DIES = ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte', 'Diumenge'];

/* ---------- SITUACIONS (dossier p. 16-17) ---------- */
const SITS = [
  { k: 'soterrani', sg: -1, r: [1, 4], d: 'edifici', f: (n, w) => w ? `El cotxe és aparcat al ${ORD_M[n]} soterrani.` : `El cotxe és aparcat al soterrani ${n}.` },
  { k: 'planta', sg: 1, r: [1, 5], d: 'edifici', f: (n, w) => w ? `La secció de roba és a la ${ORD_F[n]} planta.` : `La secció de roba és a la planta ${n}.` },
  { k: 'pb', sg: 0, d: 'edifici', f: () => `T'espero a la planta baixa.` },
  { k: 'fred', sg: -1, r: [1, 12], d: 'termo', f: (n, w) => `Fa una temperatura de ${graus(n, w)} sota zero.` },
  { k: 'calor', sg: 1, r: [2, 9], d: 'termo', f: (n, w) => `Quina calor! Estem a ${graus(n, w)} sobre zero.` },
  { k: 'zerog', sg: 0, d: 'termo', f: () => `El termòmetre marca zero graus.` },
  { k: 'submari', sg: -1, r: [2, 18], m: 10, d: 'mar', f: n => `El submarí és a ${n} metres sota el nivell del mar.` },
  { k: 'gavina', sg: 1, r: [2, 9], m: 10, d: 'mar', f: n => `La gavina vola a ${n} metres sobre el nivell del mar.` },
  { k: 'surant', sg: 0, d: 'mar', f: () => `Estic surant al mar.` },
  { k: 'cova', sg: -1, r: [2, 9], m: 10, f: n => `La cova és a ${n} metres de profunditat.` },
  { k: 'tinc', sg: 1, r: [2, 30], m: 10, d: 'compte', f: n => `Tinc ${n} € al banc.` },
  { k: 'deute', sg: -1, r: [2, 30], m: 10, d: 'compte', f: n => tria([`Tens el compte en números vermells: deus ${n} €.`, `L'Anna té un deute de ${n} €.`]) },
  { k: 'avio', sg: 1, r: [2, 18], m: 500, f: n => `L'avió vola a ${n} metres d'altura.` },
  { k: 'peix', sg: -1, r: [2, 9], m: 5, d: 'mar', f: n => `El peix neda a ${n} metres de fondària.` }
];
const SITS_DIF = [
  { k: 'aC', sg: -1, f: () => { const n = tria([287, 212, 490, 753, 323]); return [`Un personatge històric va néixer l'any ${n} abans de Crist.`, n]; } },
  { k: 'dC', sg: 1, f: () => { const n = tria([1492, 1714, 1888, 1969, 2008]); return [`Un fet històric va passar l'any ${n} després de Crist.`, n]; } },
  { k: 'mortmar', sg: -1, f: () => [`La riba del Mar Mort és a uns 430 metres sota el nivell del mar.`, 430] },
  { k: 'pica', sg: 1, f: () => [`La Pica d'Estats, el cim més alt de Catalunya, fa 3.143 metres d'altitud.`, 3143] },
  { k: 'perdre', sg: -1, f: () => { const n = rnd(3, 12); return [`A les rebaixes, una samarreta ha baixat ${n} € de preu.`, n]; } },
  { k: 'gols', sg: -1, f: () => { const n = rnd(2, 9); return [`El Badalona té una diferència de gols de ${n} en contra.`, n]; } },
  { k: 'guany', sg: 1, f: () => { const n = rnd(2, 9) * 10; return [`Has guanyat ${n} € fent de cangur.`, n]; } },
  { k: 'baixa', sg: -1, f: () => { const n = rnd(3, 9); return [`La temperatura ha baixat ${n} graus durant la nit.`, n]; } }
];
function genSit(nv, { dib = null, w = false, sense0 = false } = {}) {
  let c; do { c = tria(SITS); } while ((dib && c.d !== dib) || (sense0 && c.sg === 0) || (nv >= 2 && !dib && c.sg === 0 && Math.random() < .6));
  const n = c.sg === 0 ? 0 : rnd(c.r[0], c.r[1]) * (c.m || 1);
  const words = w && n <= 20;
  return { c, n, v: c.sg * n, text: c.f(n, words) };
}
function visSit(c, v) {
  if (c.d === 'edifici') return () => edificiSVG({ min: Math.min(-3, v - 1), max: Math.max(3, v + 1), pis: v, robotOn: true });
  if (c.d === 'termo') { const lim = Math.max(10, Math.ceil((Math.abs(v) + 1) / 2) * 2); return () => termometreSVG({ v, min: -lim, max: lim, lab: 2, anim: false }); }
  if (c.d === 'mar') return () => marSVG({ elems: [{ t: c.k === 'surant' ? 'boia' : c.k === 'gavina' ? 'gavina' : c.k === 'peix' ? 'peix' : 'submari', v }], maxAbs: Math.max(50, Math.abs(v) * 1.2), anim: false });
  if (c.d === 'compte') return () => compteHtml(v);
  return null;
}
const PISTA_SIGNE = { completa: `Paraules com <b>sota</b>, <b>soterrani</b>, <b>deure</b> o <b>profunditat</b> volen dir negatiu (−). <b>Sobre</b>, <b>planta</b>, <b>tinc</b> o <b>altura</b> volen dir positiu (+).`, mitja: `Està per sota o per sobre del zero?` };

/* ---------- EXERCICIS · OBJECTIU 1 ---------- */
const E1 = {};
E1.signe = (nv, { dib = true } = {}) => {
  const { c, v, text } = genSit(nv, { dib: dib ? tria(['edifici', 'termo', 'mar', 'compte']) : null });
  const ops = v === 0 ? [0, 1, -1] : [v, -v, v > 0 ? v + (c.m || 1) : v - (c.m || 1)];
  return {
    sig: `sg-${c.k}-${v}`, enunciat: `${text} Quin nombre enter ho representa?`,
    visual: dib ? visSit(c, v) : null, pista: PISTA_SIGNE,
    resposta: { mode: 'opcions', opcions: barreja(ops).map(x => ({ html: enterGran(x), val: String(x), txt: fz(x) })), correcta: String(v) },
    correctaHtml: `<b>${fz(v)}</b>`, correctaTxt: fz(v),
    explicacio: v === 0 ? `És el punt de referència: el <b>zero</b>.` : `${v < 0 ? 'Està per <b>sota</b> del zero: negatiu' : 'Està per <b>sobre</b> del zero: positiu'}. S'escriu <b>${fz(v)}</b>.`,
    solucio: [v === 0 ? `És el punt de partida: ni a sobre ni a sota.` : `Busco la paraula clau: és ${v < 0 ? '<b>negatiu</b> (−)' : '<b>positiu</b> (+)'}.`, `El número és <b>${Math.abs(v)}</b>.`, `Resultat: <b>${fz(v)}</b>.`]
  };
};
E1.ascensor = (nv) => {
  let p; do { p = rnd(-3, 3); } while (p === 0 && Math.random() < .7);
  const ops = p === 0 ? [0, 1, -1] : [p, -p, p > 0 ? p + 1 : p - 1];
  return {
    sig: `as-${p}`, enunciat: `A quina planta és l'ascensor d'en FR-4C?`,
    visual: pista => edificiSVG({ pis: p, colors: pista }), pista: { completa: `Les plantes de sota el carrer (soterranis) són <b>negatives</b>. La planta baixa és el <b>0</b>.`, mitja: `Està per sota o per sobre de la planta baixa?` },
    resposta: { mode: 'opcions', opcions: barreja(ops).map(x => ({ html: enterGran(x), val: String(x), txt: fz(x) })), correcta: String(p) },
    correctaHtml: `<b>la planta ${fz(p)}</b>`, correctaTxt: fz(p),
    explicacio: p === 0 ? `És a la planta baixa: la planta <b>0</b>.` : p < 0 ? `És al ${ORD_M[-p]} soterrani, sota el carrer: planta <b>${fz(p)}</b>.` : `És a la ${ORD_F[p]} planta, sobre la planta baixa: planta <b>${fz(p)}</b>.`,
    solucio: [`La planta baixa és el 0.`, p === 0 ? `L'ascensor és a la planta baixa.` : `L'ascensor és ${Math.abs(p)} ${Math.abs(p) === 1 ? 'planta' : 'plantes'} per ${p < 0 ? 'sota' : 'sobre'} de la planta baixa.`, `Planta <b>${fz(p)}</b>.`]
  };
};
E1.llegeix = (nv) => {
  let v; do { v = rnd(-12, 12); } while (v === 0);
  const n = Math.abs(v), w = n <= 20 ? NUMS[n] : n;
  const ops = [{ v: `${v < 0 ? 'menys' : 'més'} ${w}` }, { v: `${v < 0 ? 'més' : 'menys'} ${w}` }, { v: `${v < 0 ? 'menys' : 'més'} ${NUMS[Math.min(20, n + 1)]}` }];
  return {
    sig: `ll-${v}`, enunciat: `Com es llegeix el nombre ${enterGran(v)}?`, visual: null,
    pista: { completa: `El signe <b>−</b> es llegeix «menys» i el signe <b>+</b> es llegeix «més».`, mitja: `Fixa't en el signe.` },
    resposta: { mode: 'opcions', opcions: barreja(ops).map(o => ({ html: `«${o.v}»`, val: o.v, txt: o.v })), correcta: ops[0].v },
    correctaHtml: `«${ops[0].v}»`, correctaTxt: ops[0].v,
    explicacio: `${fz(v)} es llegeix «${ops[0].v}».`,
    solucio: [`El signe és <b>${v < 0 ? '−' : '+'}</b>: es llegeix «${v < 0 ? 'menys' : 'més'}».`, `Es llegeix «${ops[0].v}».`]
  };
};
E1.termoTria = (nv) => {
  let v; do { v = rnd(-9, 9); } while (v === 0);
  const ops = [v, -v, v + (v > 0 ? 1 : -1)];
  return {
    sig: `tt-${v}`, enunciat: `Quina temperatura marca el termòmetre?`,
    visual: () => termometreSVG({ v, min: -10, max: 10, lab: 2, anim: false }), pista: { completa: `Mira on acaba el vermell. Per sota del 0, les temperatures són <b>negatives</b>.`, mitja: `Està per sota o per sobre del 0?` },
    resposta: { mode: 'opcions', opcions: barreja(ops).map(x => ({ html: `<span class="enter-gran" style="color:${colZ(x)}">${fzT(x)}</span>`, val: String(x), txt: fzT(x) })), correcta: String(v) },
    correctaHtml: `<b>${fzT(v)}</b>`, correctaTxt: fzT(v),
    explicacio: `El vermell arriba al ${fz(v)}: ${graus(Math.abs(v))} ${v < 0 ? 'sota' : 'sobre'} zero.`,
    solucio: [`Miro on acaba el vermell.`, `Arriba ${Math.abs(v)} ratlletes per ${v < 0 ? 'sota' : 'sobre'} del 0.`, `Marca <b>${fzT(v)}</b>.`]
  };
};
E1.classifica = (nv) => {
  const r = Math.random(); const v = r < .2 ? 0 : r < .6 ? -rnd(1, 30) : rnd(1, 30);
  const ops = [{ html: 'Positiu', val: 'pos' }, { html: 'Negatiu', val: 'neg' }, { html: 'Ni positiu ni negatiu', val: 'zero' }];
  const c = v > 0 ? 'pos' : v < 0 ? 'neg' : 'zero';
  return {
    sig: `cl-${v}`, enunciat: `El nombre ${enterGran(v)} és…`, visual: null,
    pista: { completa: `Els negatius porten el signe <b>−</b>. Els positius, el signe <b>+</b>. El zero no porta signe.`, mitja: `Mira el signe.` },
    resposta: { mode: 'opcions', opcions: ops.map(o => ({ ...o, txt: o.html })), correcta: c },
    correctaHtml: `<b>${ops.find(o => o.val === c).html.toLowerCase()}</b>`, correctaTxt: ops.find(o => o.val === c).html,
    explicacio: v === 0 ? `El <b>0</b> no és ni positiu ni negatiu: és el punt de separació.` : `Porta el signe <b>${v < 0 ? '−' : '+'}</b>: és ${v < 0 ? 'negatiu, més petit que zero' : 'positiu, més gran que zero'}.`,
    solucio: [v === 0 ? `És el zero.` : `Té el signe ${v < 0 ? '−' : '+'}.`, v === 0 ? `El zero no és ni positiu ni negatiu.` : `És <b>${v < 0 ? 'negatiu' : 'positiu'}</b>.`]
  };
};
E1.escriu = (nv, { dib = false, dif = false } = {}) => {
  let text, v, k, vis = null;
  if (dif && Math.random() < .7) { const c = tria(SITS_DIF); const [t, n] = c.f(); text = t; v = c.sg * n; k = c.k; }
  else { const g = genSit(nv, { dib: dib ? tria(['edifici', 'termo', 'mar', 'compte']) : null, w: nv >= 2 }); text = g.text; v = g.v; k = g.c.k; if (dib) vis = visSit(g.c, v); }
  return {
    sig: `es-${k}-${v}`, enunciat: `${text} Expressa-ho amb un nombre enter.`, visual: vis, pista: PISTA_SIGNE,
    resposta: { mode: 'enter', valor: v },
    correctaHtml: `<b>${fz(v)}</b>`, correctaTxt: fz(v),
    explicacio: v === 0 ? `És el punt de referència: <b>0</b>.` : `És ${v < 0 ? 'negatiu' : 'positiu'}: <b>${fz(v)}</b>.`,
    solucio: [v === 0 ? `No està ni per sobre ni per sota: és el zero.` : `Paraula clau: ${v < 0 ? 'per <b>sota</b> o en contra → negatiu' : 'per <b>sobre</b> o a favor → positiu'}.`, `Resultat: <b>${fz(v)}</b>.`]
  };
};
E1.termoEscriu = (nv, { dif = false } = {}) => {
  const lim = dif ? 20 : 10; let v; do { v = rnd(-lim + 1, lim - 1); } while (v === 0 || (dif && v % 2 === 0 && Math.random() < .5));
  const lab = dif ? 5 : 2;
  return {
    sig: `te-${v}-${dif ? 1 : 0}`, enunciat: `Escriu la temperatura que marca el termòmetre${dif ? '. Compte: no tots els números estan escrits' : ''}.`,
    visual: () => termometreSVG({ v, min: -lim, max: lim, lab, anim: false }), pista: { completa: `Cada ratlleta és 1 grau. Compta des del 0 fins on acaba el vermell.`, mitja: `Compta les ratlletes des del 0.` },
    resposta: { mode: 'enter', valor: v, unitat: '°C' },
    correctaHtml: `<b>${fzT(v)}</b>`, correctaTxt: fzT(v),
    explicacio: `El vermell acaba ${Math.abs(v)} ratlletes per ${v < 0 ? 'sota' : 'sobre'} del 0: ${fzT(v)}.`,
    solucio: [`Cada ratlleta és 1 grau.`, `Del 0 fins on acaba el vermell hi ha ${Math.abs(v)} ratlletes cap ${v < 0 ? 'avall' : 'amunt'}.`, `<b>${fzT(v)}</b>.`]
  };
};
E1.situacio = (nv) => {
  let g; do { g = genSit(nv, { sense0: true, w: true }); } while (!g.c.d && Math.random() < .5);
  const { c, n, v } = g;
  const oposada = SITS.find(x => x.d === c.d && x.sg === -c.sg && x.r) || SITS.find(x => x.sg === -c.sg && x.r);
  const nOp = Math.min(oposada.r[1], Math.max(oposada.r[0], n / (c.m || 1))) * (oposada.m || 1);
  const altra = SITS.filter(x => x.sg === c.sg && x.k !== c.k && x.r);
  const a2 = tria(altra); const n2 = Math.max(a2.r[0], Math.min(a2.r[1], n / (c.m || 1) + 1)) * (a2.m || 1);
  const ops = [{ html: c.f(n, true), val: 'b' }, { html: oposada.f(nOp, true), val: 'o' }, { html: a2.f(n2 === n ? n2 + (a2.m || 1) : n2, true), val: 'a' }];
  return {
    sig: `si-${c.k}-${v}`, enunciat: `Quina situació representa el nombre ${enterGran(v)}${c.d === 'termo' ? ' (en °C)' : c.d === 'mar' || c.k === 'cova' ? ' (en metres)' : c.d === 'compte' ? ' (en €)' : ''}?`, visual: null, pista: PISTA_SIGNE,
    resposta: { mode: 'opcions', opcions: barreja(ops).map(o => ({ ...o, txt: textPla(o.html) })), correcta: 'b' },
    correctaHtml: `«${c.f(n, true)}»`, correctaTxt: textPla(c.f(n, true)),
    explicacio: `${fz(v)} és ${v < 0 ? 'negatiu: per sota, sota zero o deure' : 'positiu: per sobre, sobre zero o tenir'}, i el número ha de ser ${n}.`,
    solucio: [`${fz(v)} és ${v < 0 ? '<b>negatiu</b>' : '<b>positiu</b>'} i val ${n}.`, `Busco la situació amb la paraula clau i el número correctes.`]
  };
};
const PARAULES = { neg: ['sota zero', 'soterrani', 'deure diners', 'sota el nivell del mar', 'profunditat', 'perdre', 'baixar'], pos: ['sobre zero', 'planta', 'tenir diners', "d'altura", 'altitud', 'guanyar', 'pujar'] };
E1.paraula = (nv) => {
  const q = tria(['neg', 'pos']), al = q === 'neg' ? 'pos' : 'neg';
  const bona = tria(PARAULES[q]); const dolentes = barreja(PARAULES[al]).slice(0, 2);
  return {
    sig: `pa-${q}-${bona}`, enunciat: `Quina d'aquestes expressions fa pensar en un nombre <b>${q === 'neg' ? 'negatiu' : 'positiu'}</b>?`, visual: null,
    pista: PISTA_SIGNE,
    resposta: { mode: 'opcions', opcions: barreja([bona, ...dolentes]).map(x => ({ html: `«${x}»`, val: x, txt: x })), correcta: bona },
    correctaHtml: `«${bona}»`, correctaTxt: bona,
    explicacio: `«${bona}» indica un valor ${q === 'neg' ? 'per sota del zero: negatiu' : 'per sobre del zero: positiu'}.`,
    solucio: [`Negatiu: ${PARAULES.neg.slice(0, 4).join(', ')}…`, `Positiu: ${PARAULES.pos.slice(0, 4).join(', ')}…`, `La resposta és «${bona}».`]
  };
};
E1.mapaCiutat = (nv) => {
  let cs, objectiu;
  for (let k = 0; k < 50; k++) {
    cs = tempsCat(7); const negs = cs.filter(c => c.t < 0);
    if (!negs.length) continue; objectiu = tria(negs);
    if (cs.filter(c => c.t === objectiu.t).length === 1) break;
  }
  const n = -objectiu.t;
  const op = cs.find(c => c.t === n) || cs.find(c => c.t > 0); if (op && op.t !== n && !cs.some(c => c.t === n)) op.t = n;
  const dist = barreja(cs.filter(c => c.nom !== objectiu.nom)).sort((a, b) => (b.t === n) - (a.t === n)).slice(0, 2);
  return {
    sig: `mc-${objectiu.nom}-${objectiu.t}-${cs.map(c => c.t).join('')}`, enunciat: `A quina ciutat fa <b>${graus(n, true)} sota zero</b>?`,
    visual: () => mapaCatSVG(cs), pista: { completa: `«Sota zero» vol dir una temperatura <b>negativa</b>: busca el <b>${fz(-n)}</b>.`, mitja: `Sota zero → signe −.` },
    resposta: { mode: 'opcions', opcions: barreja([objectiu, ...dist]).map(c => ({ html: esc(c.nom), val: c.nom, txt: c.nom })), correcta: objectiu.nom },
    correctaHtml: `<b>${esc(objectiu.nom)}</b> (${fzT(objectiu.t)})`, correctaTxt: objectiu.nom,
    explicacio: `${graus(n)} sota zero és <b>${fzT(-n)}</b>: és la temperatura de ${esc(objectiu.nom)}.`,
    solucio: [`«Sota zero» → negatiu: ${fzT(-n)}.`, `Busco al mapa el ${fz(-n)}: <b>${esc(objectiu.nom)}</b>.`]
  };
};
E1.compta = (nv) => {
  const europa = Math.random() < .5; const cs = europa ? tempsEuropa(8) : tempsCat(8);
  if (!cs.some(c => c.t === 0) && Math.random() < .4) cs[rnd(0, cs.length - 1)].t = 0;
  const q = tria(['neg', 'pos']); const n = cs.filter(c => q === 'neg' ? c.t < 0 : c.t > 0).length;
  return {
    sig: `ct-${europa ? 'e' : 'c'}-${q}-${cs.map(c => c.t).join('_')}`, enunciat: `En quantes ciutats fa una temperatura <b>${q === 'neg' ? 'sota zero' : 'sobre zero'}</b>?`,
    visual: () => europa ? panellTemps('El temps a Europa · matinada d\'hivern', cs) : mapaCatSVG(cs),
    pista: { completa: `Compta les temperatures amb signe <b>${q === 'neg' ? '−' : '+'}</b>. El 0 no compta.`, mitja: `El 0 no és ni positiu ni negatiu.` },
    resposta: { mode: 'numero', valor: n, unitat: n === 1 ? 'ciutat' : 'ciutats' },
    correctaHtml: `<b>${n}</b>`, correctaTxt: String(n),
    explicacio: `Hi ha ${n} temperatures amb signe ${q === 'neg' ? '−' : '+'}${cs.some(c => c.t === 0) ? ' (el 0 no compta)' : ''}.`,
    solucio: [`${q === 'neg' ? 'Sota' : 'Sobre'} zero → signe ${q === 'neg' ? '−' : '+'}.`, `Les compto: ${cs.filter(c => q === 'neg' ? c.t < 0 : c.t > 0).map(c => `${esc(c.nom)} (${fz(c.t)})`).join(', ') || 'cap'}.`, `En total: <b>${n}</b>.`]
  };
};
const OPOSATS = [
  [a => `${a} metres sobre el nivell del mar`, a => `${a} metres sota el nivell del mar`, a => `${a} metres sobre la platja`, 'm', [20, 300]],
  [a => `ingressar ${a} € al banc`, a => `deure (o treure) ${a} € del banc`, a => `ingressar ${a * 2} €`, '€', [10, 200]],
  [a => `pujar ${a} plantes amb l'ascensor`, a => `baixar ${a} plantes amb l'ascensor`, a => `quedar-se a la planta ${a}`, 'plantes', [1, 5]],
  [a => `${a} graus sobre zero`, a => `${a} graus sota zero`, a => `${a * 2} graus sobre zero`, '°C', [2, 15]],
  [a => `guanyar ${a} punts`, a => `perdre ${a} punts`, a => `guanyar ${a + 1} punts`, 'punts', [2, 10]]
];
E1.oposat = (nv) => {
  const i = rnd(0, OPOSATS.length - 1); const [pos, neg, alt, u, r] = OPOSATS[i]; let a = rnd(r[0], r[1]); if (r[1] > 50) a = Math.round(a / 10) * 10;
  return {
    sig: `op-${i}-${a}`, enunciat: `Si <b>${fz(a)}</b> vol dir «${pos(a)}», què vol dir <b>${fz(-a)}</b>?`, visual: null,
    pista: { completa: `El signe contrari vol dir la situació <b>contrària</b>.`, mitja: `Pensa en el contrari.` },
    resposta: { mode: 'opcions', opcions: barreja([neg(a), alt(a), pos(a)]).map(x => ({ html: `«${x}»`, val: x, txt: x })), correcta: neg(a) },
    correctaHtml: `«${neg(a)}»`, correctaTxt: neg(a),
    explicacio: `El signe − indica la situació contrària: «${neg(a)}».`,
    solucio: [`${fz(a)} i ${fz(-a)} tenen el mateix número i signe contrari.`, `Volen dir situacions contràries: «${neg(a)}».`]
  };
};
E1.botons = (nv) => {
  const P = rnd(3, 9), Sot = rnd(1, 5); const q = tria(['baix', 'alt', 'quants']);
  const v = q === 'baix' ? -Sot : q === 'alt' ? P : P + Sot + 1;
  return {
    sig: `bo-${P}-${Sot}-${q}`, enunciat: `Un edifici té <b>${P} plantes</b>, una <b>planta baixa</b> i <b>${Sot} ${Sot === 1 ? 'planta' : 'plantes'} per aparcar</b> sota el carrer. ${q === 'baix' ? 'Quin número té el botó més baix de l\'ascensor?' : q === 'alt' ? 'Quin número té el botó més alt?' : 'Quants botons té l\'ascensor (un per planta)?'}`,
    visual: null, pista: { completa: `Fes un esquema: la planta baixa és el 0, les de sobre són positives i les d'aparcar, negatives.`, mitja: `Fes servir l'esborrany.` },
    resposta: q === 'quants' ? { mode: 'numero', valor: v, unitat: 'botons' } : { mode: 'enter', valor: v },
    correctaHtml: q === 'quants' ? `<b>${v}</b> botons` : `<b>${fz(v)}</b>`, correctaTxt: q === 'quants' ? String(v) : fz(v),
    explicacio: q === 'quants' ? `${P} plantes + la planta baixa + ${Sot} d'aparcar = ${v} botons.` : q === 'baix' ? `L'últim soterrani és el ${fz(-Sot)}.` : `L'última planta és la ${fz(P)}.`,
    solucio: [`Botons: ${fz(-Sot)}, …, −1, 0, +1, …, ${fz(P)}.`, q === 'quants' ? `${Sot} + 1 + ${P} = <b>${v}</b>.` : `El ${q === 'baix' ? 'més baix' : 'més alt'} és <b>${fz(v)}</b>.`]
  };
};
E1.setmana = (nv) => {
  const ts = DIES.map(() => rnd(-6, 8)); const i = rnd(0, 6); if (ts[i] === 0) ts[i] = -rnd(1, 6);
  const txt = t => t === 0 ? 'Zero graus' : `${NUMS[Math.abs(t)][0].toUpperCase() + NUMS[Math.abs(t)].slice(1)} ${t < 0 ? 'sota' : 'sobre'} zero`;
  return {
    sig: `sm-${ts.join('_')}-${i}`, enunciat: `Un termòmetre ha marcat aquestes temperatures durant una setmana. Escriu la del <b>${DIES[i].toLowerCase()}</b> amb un nombre enter.`,
    visual: () => `<table class="taula-set"><tr>${DIES.map(d => `<th>${d.slice(0, 3)}</th>`).join('')}</tr><tr>${ts.map((t, k) => `<td class="${k === i ? 'marcat' : ''}">${txt(t)}</td>`).join('')}</tr></table>`,
    pista: PISTA_SIGNE, resposta: { mode: 'enter', valor: ts[i], unitat: '°C' },
    correctaHtml: `<b>${fzT(ts[i])}</b>`, correctaTxt: fzT(ts[i]),
    explicacio: `«${txt(ts[i])}» és <b>${fzT(ts[i])}</b>.`,
    solucio: [`El ${DIES[i].toLowerCase()}: «${txt(ts[i])}».`, `${ts[i] < 0 ? 'Sota zero → negatiu' : 'Sobre zero → positiu'}: <b>${fzT(ts[i])}</b>.`]
  };
};

TEMES.e1 = {
  gen: E1,
  sequencia: {
    1: [['signe'], ['ascensor'], ['llegeix'], ['termoTria'], ['classifica'], ['signe'], ['ascensor'], ['termoTria']],
    2: [['escriu', { dib: true }], ['termoEscriu'], ['situacio'], ['paraula'], ['mapaCiutat'], ['escriu', { dib: false }], ['situacio'], ['escriu', { dib: true }]],
    3: [['escriu', { dif: true }], ['botons'], ['oposat'], ['compta'], ['setmana'], ['escriu', { dif: true }], ['termoEscriu', { dif: true }], ['oposat']]
  },
  explicacio: [
    { text: `<p>Hola! Visc en aquest edifici. La <b>planta baixa</b> és el <b class="parpelleja">zero</b>.</p><p class="petit">És el punt de partida.</p>`,
      vis: () => edificiSVG({ pis: 0 }) },
    { text: `<p>Baixo al <b>segon soterrani</b>, sota el carrer.</p><p>És la planta <b class="parpelleja" style="color:${BLAU}">−2</b>. Es llegeix «menys dos».</p>`,
      vis: () => edificiSVG({ pis: -2, de: 0, colors: true }) },
    { text: `<p>Ara pujo a la <b>tercera planta</b>.</p><p>És la planta <b class="parpelleja">+3</b>. Es llegeix «més tres».</p>`,
      vis: () => edificiSVG({ pis: 3, de: -2, colors: true }) },
    { text: `<p>Per <b>sota</b> del zero: nombres <b style="color:${BLAU}">negatius (−)</b>.</p><p>Per <b>sobre</b> del zero: nombres <b style="color:${T}">positius (+)</b>.</p><p class="petit">El 0 no és ni positiu ni negatiu.</p>`,
      vis: () => edificiSVG({ pis: 0, robotOn: false, colors: true }) },
    { text: `<p>Al termòmetre passa el mateix.</p><p>Quatre graus <b>sota zero</b>: <b class="parpelleja" style="color:${BLAU}">−4 °C</b>.</p>`,
      vis: () => termometreSVG({ v: -4 }) },
    { text: `<p>Al <b class="parpelleja">mapa del temps</b> hi veiem temperatures negatives i positives.</p><p class="petit">Al Pirineu fa més fred que a la costa.</p>`,
      vis: () => mapaCatSVG([{ nom: 'Vielha', t: -6 }, { nom: 'Puigcerdà', t: -4 }, { nom: 'Lleida', t: 1 }, { nom: 'Vic', t: -1 }, { nom: 'Girona', t: 3 }, { nom: 'Badalona', t: 8 }, { nom: 'Tarragona', t: 9 }]) },
    { text: `<p>El <b>nivell del mar</b> també és un <b class="parpelleja">zero</b>.</p><p class="petit">L'avió i la gavina són a sobre (+). El submarí, a sota (−).</p>`,
      vis: () => marSVG({ elems: [{ t: 'gavina', v: 50 }, { t: 'avio', v: 150 }, { t: 'submari', v: -120 }], maxAbs: 160 }) },
    { text: `<p>I amb els <b>diners</b>: si <b>tinc</b> 160 €, és <b style="color:#2c9a58">+160</b>.</p><p>Si <b>dec</b> 160 €, és <b class="parpelleja" style="color:#d64242">−160</b>.</p>`,
      vis: () => `<div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center">${compteHtml(160)}${compteHtml(-160)}</div>` },
    { text: `<p><b>Resum</b>: paraules que ens diuen el <b class="parpelleja">signe</b>.</p>`,
      vis: () => `<div class="resum-sg"><div class="neg"><h4>Negatiu (−)</h4><p>sota zero · soterrani · deure · sota el nivell del mar · profunditat · perdre · baixar</p></div><div class="pos"><h4>Positiu (+)</h4><p>sobre zero · planta · tenir · sobre el nivell del mar · altura · guanyar · pujar</p></div><div class="zer"><h4>Zero (0)</h4><p>planta baixa · zero graus · nivell del mar</p></div></div>` }
  ],
  exemple: (nv) => {
    if (nv === 1) return {
      enunciat: `En FR-4C és al <b>tercer soterrani</b>. Quin nombre enter és?`,
      passos: [
        { text: `Mirem l'edifici: la planta baixa és el 0.`, vis: edificiSVG({ pis: 0, min: -4 }) },
        { text: `«Soterrani» vol dir <b>sota el carrer</b>: és <b>negatiu</b>.`, vis: edificiSVG({ pis: -3, de: 0, min: -4, colors: true }) },
        { text: `És el tercer: el número és el <b>3</b>.`, vis: edificiSVG({ pis: -3, min: -4, colors: true, marcaPis: -3 }) },
        { text: `Resultat: <b style="color:${BLAU}">−3</b>. Es llegeix «menys tres». <span class="marca-ok">✓</span>`, vis: `<div>${enterGran(-3)}</div>` }
      ]
    };
    if (nv === 2) return {
      enunciat: `Fa <b>quatre graus sota zero</b>. Expressa-ho amb un nombre enter.`,
      passos: [
        { text: `Busquem la paraula clau: <b>sota</b> zero.`, vis: termometreSVG({ v: 0, anim: false }) },
        { text: `«Sota zero» vol dir <b>negatiu</b>: signe −.`, vis: termometreSVG({ v: -4 }) },
        { text: `El número és el <b>4</b>. Resultat: <b style="color:${BLAU}">−4 °C</b>. <span class="marca-ok">✓</span>`, vis: `<div>${enterGran(-4)}</div>` }
      ]
    };
    return {
      enunciat: `L'Anna té un <b>deute de 46 €</b>. Expressa-ho amb un nombre enter.`,
      passos: [
        { text: `Paraula clau: <b>deute</b>. Vol dir que <b>deu</b> diners.`, vis: compteHtml(-46, 'Compte de l\'Anna') },
        { text: `Deure diners és <b>negatiu</b>: signe −.`, vis: compteHtml(-46, 'Compte de l\'Anna') },
        { text: `Resultat: <b style="color:${BLAU}">−46</b>. <span class="marca-ok">✓</span>`, vis: `<div>${enterGran(-46)}</div>` }
      ]
    };
  }
};
const rectaZSVG = o => `<svg class="dib rectaz" viewBox="0 ${o.dalt ? -30 : 0} ${RZ.W} ${(o.claus ? 160 : 116) + (o.dalt ? 30 : 0)}" width="${RZ.W}">${rectaZCos(o)}</svg>`;
const nz = v => v < 0 ? `−${-v}` : String(v);
const natGran = v => `<span class="enter-gran" style="color:${colZ(v)}">${nz(v)}</span>`;
const xips = ll => `<div class="xips-z">${ll.map(v => `<span style="color:${colZ(v)}">${fz(v)}</span>`).join('')}</div>`;
const diferents = (n, gen) => { const s = new Set(); let g = 0; while (s.size < n && g++ < 400) s.add(gen()); return [...s]; };

/* ---------- OBJECTIU 2 · NATURALS, ENTERS I OPOSATS ---------- */
const PISTA_NAT = { completa: `Els <b>naturals</b> són els nombres per comptar: <b>0, 1, 2, 3…</b> Els <b>negatius</b> (amb signe −) no són naturals, però sí que són <b>enters</b>.`, mitja: `Porta el signe −?` };
const PISTA_OP = { completa: `L'<b>oposat</b> té el mateix número però el <b>signe contrari</b>. És a la mateixa distància del 0, a l'altra banda de la recta.`, mitja: `Canvia el signe.` };
const EN = {};
EN.esNatural = (nv) => {
  const v = rnd(0, nv === 1 ? 10 : 25);
  const negs = diferents(2, () => -rnd(1, nv === 1 ? 10 : 25));
  return {
    sig: `en-nat-${v}-${negs.join('_')}`, enunciat: `Quin d'aquests nombres és un nombre <b>natural</b>?`, visual: null, pista: PISTA_NAT,
    resposta: { mode: 'opcions', opcions: barreja([v, ...negs]).map(x => ({ html: natGran(x), val: String(x), txt: nz(x) })), correcta: String(v) },
    correctaHtml: `<b>${nz(v)}</b>`, correctaTxt: nz(v),
    explicacio: v === 0 ? `El <b>0</b> és natural: és el que compten quan no hi ha res. Els altres porten signe −.` : `El <b>${v}</b> serveix per comptar: és natural. Els altres porten signe − i no són naturals.`,
    solucio: [`Els naturals són 0, 1, 2, 3…`, `Els que porten signe − no són naturals.`, `El natural és el <b>${nz(v)}</b>.`]
  };
};
EN.siNo = (nv, { t = 'nat' } = {}) => {
  const tipus = t === 'mix' ? tria(['nat', 'ent']) : t;
  const r = Math.random(); const v = r < .15 ? 0 : r < .6 ? -rnd(1, nv === 1 ? 9 : 40) : rnd(1, nv === 1 ? 9 : 40);
  const si = tipus === 'ent' ? true : v >= 0;
  const quin = tipus === 'ent' ? 'enter' : 'natural';
  return {
    sig: `en-sn-${tipus}-${v}`, enunciat: `El nombre ${natGran(v)} és un nombre <b>${quin}</b>?`, visual: null, pista: PISTA_NAT,
    resposta: { mode: 'sino', correcta: si ? 'si' : 'no' },
    correctaHtml: `<b>${si ? 'Sí' : 'No'}</b>`, correctaTxt: si ? 'Sí' : 'No',
    explicacio: tipus === 'ent' ? `<b>Sí.</b> Tots els naturals i els seus oposats són enters: ${nz(v)} és enter.` : v >= 0 ? `<b>Sí.</b> ${nz(v)} és un nombre per comptar${v === 0 ? ' (el zero també compta com a natural)' : ''}.` : `<b>No.</b> ${nz(v)} porta signe −: és enter, però no natural.`,
    solucio: tipus === 'ent' ? [`Els enters són tots: els negatius, el 0 i els positius.`, `${nz(v)} hi és: <b>Sí</b>.`] : [`Els naturals són 0, 1, 2, 3…`, v >= 0 ? `${nz(v)} hi és: <b>Sí</b>.` : `${nz(v)} porta signe −: <b>No</b>.`]
  };
};
EN.classifica = (nv) => {
  const r = Math.random(); const v = r < .12 ? 0 : r < .58 ? -rnd(1, 30) : rnd(1, 30);
  const ops = [{ html: 'Natural i enter', val: 'ne' }, { html: 'Enter, però no natural', val: 'e' }, { html: 'Natural, però no enter', val: 'n' }];
  const c = v >= 0 ? 'ne' : 'e';
  return {
    sig: `en-cl-${v}`, enunciat: `El nombre ${natGran(v)} és…`, visual: null, pista: PISTA_NAT,
    resposta: { mode: 'opcions', opcions: ops.map(o => ({ ...o, txt: o.html })), correcta: c },
    correctaHtml: `<b>${ops.find(o => o.val === c).html.toLowerCase()}</b>`, correctaTxt: ops.find(o => o.val === c).html,
    explicacio: v >= 0 ? `${nz(v)} és natural, i tots els naturals també són enters.` : `${nz(v)} és negatiu: és enter, però no natural. <i>Cap</i> natural deixa de ser enter.`,
    solucio: [`Els enters inclouen tots els naturals.`, v >= 0 ? `${nz(v)} no porta signe −: és natural.` : `${nz(v)} porta signe −: no és natural.`, `És <b>${ops.find(o => o.val === c).html.toLowerCase()}</b>.`]
  };
};
EN.oposat = (nv, { vis = false } = {}) => {
  const lim = nv === 1 ? 8 : nv === 2 ? 30 : 150; let a = rnd(1, lim) * (Math.random() < .5 ? -1 : 1);
  if (nv === 3 && Math.random() < .12) a = 0;
  const pot = vis && Math.abs(a) <= 8;
  return {
    sig: `en-op-${a}`, enunciat: `Quin és l'<b>oposat</b> de ${enterGran(a)}?`,
    visual: pot ? (p => rectaZSVG({ min: -9, max: 9, labels: 'totes', punts: [{ v: a, etiq: fz(a) }], fletxes: p ? [{ de: 0, a: -a, col: '#2c9a58' }] : [], dalt: true })) : null,
    pista: PISTA_OP, resposta: { mode: 'enter', valor: -a },
    correctaHtml: `<b>${fz(-a)}</b>`, correctaTxt: fz(-a),
    explicacio: a === 0 ? `El 0 és el seu propi oposat: no té signe.` : `Mateix número, signe contrari: l'oposat de ${fz(a)} és <b>${fz(-a)}</b>.`,
    solucio: a === 0 ? [`El 0 no té signe.`, `L'oposat del 0 és el <b>0</b>.`] : [`Mantinc el número: <b>${Math.abs(a)}</b>.`, `Canvio el signe: ${a > 0 ? '+ → −' : '− → +'}.`, `L'oposat és <b>${fz(-a)}</b>.`]
  };
};
EN.oposatRecta = (nv) => {
  let v; do { v = rnd(-7, 7); } while (v === 0);
  const labels = nv === 1 ? 'totes' : nv === 2 ? 'parells' : 'cinc';
  const ops = [-v, v, -v + (v > 0 ? -1 : 1)];
  return {
    sig: `en-or-${v}-${labels}`, enunciat: `Quin nombre és l'<b>oposat</b> del punt marcat a la recta?`,
    visual: p => rectaZSVG({ min: -8, max: 8, labels, punts: [{ v }], fletxes: p ? [{ de: 0, a: v, col: '#8f8a82' }] : [], dalt: true }), pista: PISTA_OP,
    resposta: { mode: 'opcions', opcions: barreja(ops).map(x => ({ html: enterGran(x), val: String(x), txt: fz(x) })), correcta: String(-v) },
    correctaHtml: `<b>${fz(-v)}</b>`, correctaTxt: fz(-v),
    explicacio: `El punt marcat és el ${fz(v)}. El seu oposat és a la mateixa distància del 0, a l'altra banda: <b>${fz(-v)}</b>.`,
    solucio: [`Llegeixo el punt: és el <b>${fz(v)}</b>.`, `Està a ${Math.abs(v)} unitats del 0, a la ${v > 0 ? 'dreta' : 'esquerra'}.`, `L'oposat és a ${Math.abs(v)} unitats a la ${v > 0 ? 'esquerra' : 'dreta'}: <b>${fz(-v)}</b>.`],
    dibuixSolucio: rectaZSVG({ min: -8, max: 8, labels: 'totes', punts: [{ v }, { v: -v, col: '#2c9a58' }] })
  };
};
EN.quantsNat = (nv, { llarg = false } = {}) => {
  const n = llarg ? 7 : 5, lim = nv === 1 ? 9 : 20;
  let ll; do { ll = diferents(n, () => rnd(-lim, lim)); } while (ll.filter(x => x >= 0).length === 0 || ll.filter(x => x < 0).length === 0);
  if (llarg && !ll.includes(0)) ll[rnd(0, n - 1)] = 0;
  const q = ll.filter(x => x >= 0).length;
  return {
    sig: `en-qn-${ll.join('_')}`, enunciat: `Quants d'aquests nombres són <b>naturals</b>?`, visual: () => `<div class="xips-z">${ll.map(v => `<span style="color:${colZ(v)}">${nz(v)}</span>`).join('')}</div>`, pista: PISTA_NAT,
    resposta: { mode: 'numero', valor: q },
    correctaHtml: `<b>${q}</b>`, correctaTxt: String(q),
    explicacio: `Són naturals: ${ll.filter(x => x >= 0).map(nz).join(', ')}${ll.includes(0) ? ' (el 0 també compta)' : ''}.`,
    solucio: [`Trec els que porten signe −: ${ll.filter(x => x < 0).map(nz).join(', ')}.`, `Queden ${ll.filter(x => x >= 0).map(nz).join(', ')}.`, `En total: <b>${q}</b>.`]
  };
};
EN.parella = (nv) => {
  const a = rnd(2, nv === 2 ? 15 : 60) * (Math.random() < .5 ? -1 : 1);
  const bona = [a, -a], d1 = [a, a], d2 = [a, -(a + Math.sign(a))];
  const p = q => `${fz(q[0])} i ${fz(q[1])}`;
  return {
    sig: `en-pa-${a}`, enunciat: `Quina parella està formada per dos nombres <b>oposats</b>?`, visual: null, pista: PISTA_OP,
    resposta: { mode: 'opcions', opcions: barreja([bona, d1, d2]).map(q => ({ html: `<span style="font-size:1.25rem;font-weight:800">${p(q)}</span>`, val: p(q), txt: p(q) })), correcta: p(bona) },
    correctaHtml: `<b>${p(bona)}</b>`, correctaTxt: p(bona),
    explicacio: `${p(bona)}: mateix número i signe contrari.`,
    solucio: [`Els oposats tenen el <b>mateix número</b>…`, `…i el <b>signe contrari</b>.`, `És <b>${p(bona)}</b>.`]
  };
};
EN.simbol = (nv) => {
  const q = tria(['ent', 'nat']);
  const ops = [{ html: '<span class="lletra-conj">ℕ</span>', val: 'N', txt: 'ℕ' }, { html: '<span class="lletra-conj">ℤ</span>', val: 'Z', txt: 'ℤ' }, { html: '<span class="lletra-conj">ℰ</span>', val: 'E', txt: 'ℰ' }];
  const c = q === 'ent' ? 'Z' : 'N';
  return {
    sig: `en-sb-${q}`, enunciat: `Amb quina lletra es representa el conjunt dels nombres <b>${q === 'ent' ? 'enters' : 'naturals'}</b>?`, visual: null,
    pista: { completa: `Els naturals es diuen amb la <b>ℕ</b> i els enters, amb la <b>ℤ</b> (de l'alemany <i>Zahlen</i>, «nombres»).`, mitja: `Els enters no fan servir la E.` },
    resposta: { mode: 'opcions', opcions: ops, correcta: c },
    correctaHtml: `<b>${c === 'Z' ? 'ℤ' : 'ℕ'}</b>`, correctaTxt: c === 'Z' ? 'ℤ' : 'ℕ',
    explicacio: q === 'ent' ? `Els enters es representen amb la <b>ℤ</b>, de l'alemany <i>Zahlen</i>. No és la E de «enters».` : `Els naturals es representen amb la <b>ℕ</b>.`,
    solucio: [`ℕ: naturals (0, 1, 2, 3…).`, `ℤ: enters (…, −2, −1, 0, +1, +2, …).`, `La resposta és <b>${c === 'Z' ? 'ℤ' : 'ℕ'}</b>.`]
  };
};
EN.oposatOposat = (nv) => {
  const a = rnd(2, 40) * (Math.random() < .5 ? -1 : 1);
  return {
    sig: `en-oo-${a}`, enunciat: `Quin és l'oposat de l'<b>oposat</b> de ${enterGran(a)}?`, visual: null,
    pista: { completa: `Fes-ho en dos passos: primer l'oposat de ${fz(a)} i després l'oposat d'aquest resultat.`, mitja: `Canvia el signe dues vegades.` },
    resposta: { mode: 'enter', valor: a },
    correctaHtml: `<b>${fz(a)}</b>`, correctaTxt: fz(a),
    explicacio: `L'oposat de ${fz(a)} és ${fz(-a)}, i l'oposat de ${fz(-a)} torna a ser <b>${fz(a)}</b>.`,
    solucio: [`Oposat de ${fz(a)}: ${fz(-a)}.`, `Oposat de ${fz(-a)}: <b>${fz(a)}</b>.`, `Canviar el signe dues vegades ens torna al nombre inicial.`]
  };
};
EN.distOrigen = (nv) => {
  const a = rnd(3, 25) * (Math.random() < .5 ? -1 : 1);
  return {
    sig: `en-do-${a}`, enunciat: `Quin altre nombre enter està a la <b>mateixa distància del 0</b> que ${enterGran(a)}?`, visual: null, pista: PISTA_OP,
    resposta: { mode: 'enter', valor: -a },
    correctaHtml: `<b>${fz(-a)}</b>`, correctaTxt: fz(-a),
    explicacio: `${fz(a)} és a ${Math.abs(a)} unitats del 0. A l'altra banda, també a ${Math.abs(a)} unitats, hi ha el seu oposat: <b>${fz(-a)}</b>.`,
    solucio: [`${fz(a)} és a ${Math.abs(a)} unitats del 0.`, `L'altre nombre a ${Math.abs(a)} unitats és a l'altra banda.`, `És l'oposat: <b>${fz(-a)}</b>.`]
  };
};
EN.comptaEnters = (nv) => {
  const a = -rnd(2, 5), b = rnd(1, 4), q = b - a + 1;
  return {
    sig: `en-ce-${a}-${b}`, enunciat: `Quants nombres enters hi ha des del ${fz(a)} fins al ${fz(b)}, comptant-los tots dos?`,
    visual: p => p ? rectaZSVG({ min: -6, max: 6, labels: 'totes', banda: { de: a, a: b } }) : null,
    pista: { completa: `Escriu-los tots en ordre: ${fz(a)}, ${fz(a + 1)}, … fins al ${fz(b)}. No t'oblidis del 0!`, mitja: `No t'oblidis del 0.` },
    resposta: { mode: 'numero', valor: q },
    correctaHtml: `<b>${q}</b>`, correctaTxt: String(q),
    explicacio: `${Array.from({ length: q }, (_, i) => fz(a + i)).join(', ')}: en total <b>${q}</b>.`,
    solucio: [`Els escric en ordre: ${Array.from({ length: q }, (_, i) => fz(a + i)).join(', ')}.`, `Compte: el <b>0</b> també hi és.`, `En total: <b>${q}</b>.`]
  };
};
TEMES.eN = {
  gen: EN,
  sequencia: {
    1: [['esNatural'], ['oposat', { vis: true }], ['siNo', { t: 'nat' }], ['classifica'], ['oposatRecta'], ['quantsNat'], ['siNo', { t: 'ent' }], ['oposat', { vis: true }]],
    2: [['classifica'], ['oposat'], ['siNo', { t: 'ent' }], ['quantsNat'], ['simbol'], ['oposatRecta'], ['parella'], ['siNo', { t: 'nat' }]],
    3: [['classifica'], ['distOrigen'], ['oposatOposat'], ['quantsNat', { llarg: true }], ['comptaEnters'], ['simbol'], ['parella'], ['siNo', { t: 'mix' }]]
  },
  explicacio: [
    { text: `<p>Per <b class="parpelleja">comptar</b> coses fem servir els nombres <b>naturals</b>.</p><p class="petit">Una ovella, dues ovelles, tres ovelles…</p>`,
      vis: () => `<div class="ovelles">${[1, 2, 3, 4, 5].map((n, i) => `<div class="ov pop" style="animation-delay:${i * .45}s"><span>🐑</span><b>${n}</b></div>`).join('')}</div>` },
    { text: `<p>Si no hi ha cap ovella, en tenim <b class="parpelleja">0</b>.</p><p>El <b>0</b> també és un nombre natural.</p><p class="petit">Naturals: 0, 1, 2, 3, 4… i no s'acaben mai.</p>`,
      vis: () => `<div class="ovelles"><div class="ov buit"><span>🌾</span><b>0</b></div></div><div class="conj-txt">ℕ = { 0, 1, 2, 3, 4, … }</div>` },
    { text: `<p>Però ha nevat i la temperatura ha baixat <b>per sota del zero</b>.</p><p>Per explicar-ho ens calen els nombres <b class="parpelleja" style="color:${BLAU}">negatius</b>: −3 °C.</p>`,
      vis: () => termometreSVG({ v: -3, min: -6, max: 6 }) },
    { text: `<p>Cada nombre té el seu <b class="parpelleja">oposat</b>: el mateix número amb el signe contrari.</p><p>L'oposat de <b style="color:${T}">+3</b> és <b style="color:${BLAU}">−3</b>. Estan a la mateixa distància del 0.</p>`,
      vis: () => rectaZSVG({ min: -6, max: 6, labels: 'totes', punts: [{ v: 3, anim: .2 }, { v: -3, anim: 1 }], fletxes: [{ de: 0, a: 3, delay: .2 }, { de: 0, a: -3, delay: 1 }], anim: true, dalt: true }) },
    { text: `<p>Els <b>naturals</b> i els seus <b>oposats</b> formen els nombres <b class="parpelleja">enters</b>.</p><p>Es representen amb la lletra <b class="lletra-conj">ℤ</b>.</p>`,
      vis: () => rectaZSVG({ min: -6, max: 6, labels: 'totes', claus: true, anim: true }) + `<div class="conj-txt">ℤ = { …, −3, −2, −1, 0, +1, +2, +3, … }</div>` },
    { text: `<p><b>Resum</b>: tots els naturals són enters, però <b class="parpelleja">no</b> tots els enters són naturals.</p><p class="petit">Els negatius són enters, però no naturals.</p>`,
      vis: () => conjuntsSVG() }
  ],
  exemple: (nv) => {
    if (nv === 1) return {
      enunciat: `El nombre <b>−4</b> és un nombre natural?`,
      passos: [
        { text: `Els naturals són els nombres per comptar: 0, 1, 2, 3…`, vis: `<div class="conj-txt">ℕ = { 0, 1, 2, 3, 4, … }</div>` },
        { text: `El −4 porta el signe <b>−</b>: és negatiu.`, vis: `<div>${enterGran(-4)}</div>` },
        { text: `Resposta: <b>No</b>, no és natural. Però sí que és un nombre <b>enter</b>. <span class="marca-ok">✓</span>`, vis: conjuntsSVG(-4) }
      ]
    };
    if (nv === 2) return {
      enunciat: `Quin és l'oposat de <b>+7</b>?`,
      passos: [
        { text: `Busco el +7 a la recta: és a 7 unitats a la dreta del 0.`, vis: rectaZSVG({ min: -8, max: 8, labels: 'totes', punts: [{ v: 7, etiq: '+7' }], dalt: true }) },
        { text: `L'oposat és a la mateixa distància, a l'<b>altra banda</b>.`, vis: rectaZSVG({ min: -8, max: 8, labels: 'totes', punts: [{ v: 7 }, { v: -7, etiq: '−7', col: '#2c9a58' }], fletxes: [{ de: 0, a: 7 }, { de: 0, a: -7, col: '#2c9a58' }], dalt: true }) },
        { text: `Mateix número i signe contrari: <b style="color:${BLAU}">−7</b>. <span class="marca-ok">✓</span>`, vis: `<div>${enterGran(-7)}</div>` }
      ]
    };
    return {
      enunciat: `Quants nombres naturals hi ha en aquesta llista: −2, 0, 5, −7, 3?`,
      passos: [
        { text: `Trec els que porten signe −: −2 i −7.`, vis: `<div class="xips-z"><span style="color:${BLAU};text-decoration:line-through">−2</span><span>0</span><span style="color:${T}">5</span><span style="color:${BLAU};text-decoration:line-through">−7</span><span style="color:${T}">3</span></div>` },
        { text: `Queden el 0, el 5 i el 3. El 0 també és natural.`, vis: `<div class="xips-z"><span>0</span><span style="color:${T}">5</span><span style="color:${T}">3</span></div>` },
        { text: `Resultat: <b>3</b> naturals. <span class="marca-ok">✓</span>`, vis: `<div class="enter-gran">3</div>` }
      ]
    };
  }
};
function conjuntsSVG(marca = null) {
  const pos = [[170, 132, '0'], [215, 128, '1'], [260, 142, '2'], [196, 176, '3'], [252, 186, '25']];
  const neg = [[72, 118, '−1'], [84, 192, '−5'], [338, 92, '−12'], [348, 196, '−3'], [214, 246, '−40']];
  let s = `<ellipse cx="200" cy="148" rx="185" ry="118" fill="#eaf1fc" stroke="${BLAU}" stroke-width="3"/><text x="14" y="36" font-size="30" font-weight="900" fill="${BLAU}">ℤ</text><text x="40" y="34" font-size="15" font-weight="800" fill="${BLAU}">enters</text>`;
  s += `<ellipse cx="210" cy="140" rx="98" ry="66" fill="#fff1e4" stroke="${T}" stroke-width="3"/><text x="156" y="104" font-size="24" font-weight="900" fill="${T}">ℕ</text><text x="178" y="101" font-size="13" font-weight="800" fill="${T}">naturals</text>`;
  pos.forEach(([x, y, t]) => s += `<text x="${x}" y="${y}" text-anchor="middle" font-size="22" font-weight="800" fill="#1b1b1b">${t}</text>`);
  neg.forEach(([x, y, t]) => s += `<text x="${x}" y="${y}" text-anchor="middle" font-size="22" font-weight="800" fill="${BLAU}">${t}</text>`);
  if (marca != null) { const p = neg.find(q => q[2] === nz(marca)); if (p) s += `<circle cx="${p[0]}" cy="${p[1] - 8}" r="22" fill="none" stroke="${T}" stroke-width="4"/>`; }
  return `<svg class="dib" viewBox="0 0 400 275" width="400">${s}</svg>`;
}

/* ---------- OBJECTIU 3 · ELS ENTERS A LA RECTA NUMÈRICA (dossier p. 18) ---------- */
const PISTA_RZ = { completa: `Els <b>positius</b> van a la <b>dreta</b> del 0 i els <b>negatius</b>, a l'<b>esquerra</b>. Compta les marques des del 0.`, mitja: `Compta des del 0.` };
const rangRZ = nv => nv === 1 ? { min: -6, max: 6, labels: 'parells' } : nv === 2 ? { min: -10, max: 10, labels: 'cinc' } : { min: -12, max: 12, labels: 'zero' };
function valorRZ(nv) {
  const { min, max, labels } = rangRZ(nv); let v;
  do { v = rnd(min + 1, max - 1); } while (v === 0 || (rzEtiqueta(labels, v) && Math.random() < .85));
  return v;
}
const ER = {};
ER.costat = (nv) => {
  const r = Math.random(); const v = r < .1 ? 0 : r < .55 ? -rnd(1, 9) : rnd(1, 9);
  const ops = [{ html: 'A la <b>dreta</b> del 0', val: 'd' }, { html: 'A l\'<b>esquerra</b> del 0', val: 'e' }, { html: 'Just al 0', val: 'z' }];
  const c = v > 0 ? 'd' : v < 0 ? 'e' : 'z';
  return {
    sig: `rz-co-${v}`, enunciat: `On va el ${enterGran(v)} a la recta numèrica?`, visual: p => p ? rectaZSVG({ min: -9, max: 9, labels: 'zero', claus: true }) : null, pista: PISTA_RZ,
    resposta: { mode: 'opcions', opcions: ops.map(o => ({ ...o, txt: textPla(o.html) })), correcta: c },
    correctaHtml: `<b>${textPla(ops.find(o => o.val === c).html)}</b>`, correctaTxt: textPla(ops.find(o => o.val === c).html),
    explicacio: v === 0 ? `El 0 és l'origen de la recta.` : `${fz(v)} és ${v > 0 ? 'positiu: va a la <b>dreta</b>' : 'negatiu: va a l\'<b>esquerra</b>'} del 0.`,
    solucio: [`Positius → dreta. Negatius → esquerra.`, v === 0 ? `És el 0: l'origen.` : `${fz(v)} és ${v > 0 ? 'positiu' : 'negatiu'}.`, `Va ${textPla(ops.find(o => o.val === c).html).toLowerCase()}.`],
    dibuixSolucio: rectaZSVG({ min: -9, max: 9, labels: 'zero', punts: [{ v, col: '#2c9a58', etiq: fz(v) }] })
  };
};
ER.marca = (nv) => {
  const R = rangRZ(nv), v = valorRZ(nv);
  return {
    sig: `rz-ma-${v}-${nv}`, enunciat: `Marca el ${enterGran(v)} a la recta.`, visual: null, pista: PISTA_RZ,
    resposta: { mode: 'rectaZ', ...R, valor: v },
    correctaHtml: `<b>${fz(v)}</b>`, correctaTxt: `punt a ${fz(v)}`,
    explicacio: `${fz(v)} és ${v > 0 ? 'positiu' : 'negatiu'}: des del 0, ${Math.abs(v)} ${Math.abs(v) === 1 ? 'salt' : 'salts'} cap a la ${v > 0 ? 'dreta' : 'esquerra'}.`,
    solucio: [`Començo al 0.`, `${fz(v)} és ${v > 0 ? 'positiu → dreta' : 'negatiu → esquerra'}.`, `Faig ${Math.abs(v)} ${Math.abs(v) === 1 ? 'salt' : 'salts'} i marco el punt.`],
    dibuixSolucio: rectaZSVG({ ...R, salts: { de: 0, a: v }, punts: [{ v, col: '#2c9a58', etiq: fz(v) }], dalt: true })
  };
};
ER.llegeix = (nv) => {
  const R = rangRZ(nv), v = valorRZ(nv);
  return {
    sig: `rz-ll-${v}-${nv}`, enunciat: `Quin nombre enter hi ha marcat a la recta?`,
    visual: p => rectaZSVG({ ...R, punts: [{ v }], salts: p ? { de: 0, a: v, num: true } : null, dalt: true }), pista: PISTA_RZ,
    resposta: { mode: 'enter', valor: v },
    correctaHtml: `<b>${fz(v)}</b>`, correctaTxt: fz(v),
    explicacio: `El punt és a ${Math.abs(v)} ${Math.abs(v) === 1 ? 'marca' : 'marques'} a la ${v > 0 ? 'dreta' : 'esquerra'} del 0: <b>${fz(v)}</b>.`,
    solucio: [`Començo al 0.`, `Compto les marques fins al punt: ${Math.abs(v)} cap a la ${v > 0 ? 'dreta' : 'esquerra'}.`, `És el <b>${fz(v)}</b>.`],
    dibuixSolucio: rectaZSVG({ ...R, salts: { de: 0, a: v }, punts: [{ v, col: '#2c9a58', etiq: fz(v) }], dalt: true })
  };
};
ER.seguent = (nv) => {
  const dreta = Math.random() < .55; let v = nv === 1 ? rnd(-6, 2) : rnd(-15, 3); if (!dreta && v === 0 && Math.random() < .5) v = -rnd(1, 5);
  const r = dreta ? v + 1 : v - 1;
  return {
    sig: `rz-se-${v}-${dreta ? 'd' : 'e'}`, enunciat: `Quin nombre enter hi ha <b>just a la ${dreta ? 'dreta' : 'esquerra'}</b> del ${enterGran(v)} a la recta?`,
    visual: p => p && Math.abs(v) <= 9 ? rectaZSVG({ min: Math.min(-9, v - 2), max: Math.max(9, v + 2), labels: 'totes', punts: [{ v }], dalt: true }) : null,
    pista: { completa: `A la recta, cap a la <b>dreta</b> els nombres es fan més grans: −3, −2, −1, 0, +1… Cap a l'<b>esquerra</b>, més petits.`, mitja: `Pensa en la recta: −3, −2, −1, 0…` },
    resposta: { mode: 'enter', valor: r },
    correctaHtml: `<b>${fz(r)}</b>`, correctaTxt: fz(r),
    explicacio: `Just a la ${dreta ? 'dreta' : 'esquerra'} del ${fz(v)} hi ha el <b>${fz(r)}</b>${v < 0 && dreta ? `. Compte: a la dreta del ${fz(v)} ve el ${fz(r)}, no el ${fz(v - 1)}` : ''}.`,
    solucio: [`A la recta: …, ${fz(v - 1)}, <b>${fz(v)}</b>, ${fz(v + 1)}, …`, `Un pas a la ${dreta ? 'dreta' : 'esquerra'}.`, `És el <b>${fz(r)}</b>.`]
  };
};
ER.entre = (nv) => {
  let a, b;
  if (nv === 2) { const k = rnd(3, 7); [a, b] = Math.random() < .5 ? [-k, 0] : [0, k]; } else { a = -rnd(2, 6); b = rnd(2, 6); }
  const q = b - a - 1;
  return {
    sig: `rz-en-${a}-${b}`, enunciat: `Quants nombres enters hi ha <b>entre</b> el ${enterGran(a)} i el ${enterGran(b)}? <span class="petit">(Sense comptar-los a ells.)</span>`,
    visual: p => p ? rectaZSVG({ min: -8, max: 8, labels: 'totes', punts: [{ v: a, col: '#fff' }, { v: b, col: '#fff' }], banda: { de: a + 1, a: b - 1 } }) : null,
    pista: { completa: `Escriu-los en ordre entre els dos, sense comptar el ${fz(a)} ni el ${fz(b)}.${a < 0 && b > 0 ? ' I no t\'oblidis del 0!' : ''}`, mitja: `No comptis els extrems.` },
    resposta: { mode: 'numero', valor: q },
    correctaHtml: `<b>${q}</b>`, correctaTxt: String(q),
    explicacio: `Entre ${fz(a)} i ${fz(b)} hi ha ${Array.from({ length: q }, (_, i) => fz(a + 1 + i)).join(', ')}: <b>${q}</b>.`,
    solucio: [`No compto el ${fz(a)} ni el ${fz(b)}.`, `Entre els dos: ${Array.from({ length: q }, (_, i) => fz(a + 1 + i)).join(', ')}.`, `En total: <b>${q}</b>.`]
  };
};
ER.lluny = (nv, { proper = false } = {}) => {
  let ll, obj;
  for (let k = 0; k < 200; k++) {
    ll = diferents(4, () => rnd(-12, 12)).filter(x => x !== 0).slice(0, 3); if (ll.length < 3) continue;
    const ab = ll.map(Math.abs); const ext = proper ? Math.min(...ab) : Math.max(...ab);
    if (ab.filter(x => x === ext).length !== 1) continue;
    obj = ll[ab.indexOf(ext)];
    if (!proper && obj > 0 && Math.random() < .7) continue;   // sovint el més llunyà és un negatiu (no és el «més gran»)
    break;
  }
  return {
    sig: `rz-ll${proper ? 'p' : 'l'}-${ll.join('_')}`, enunciat: `Quin d'aquests nombres està més <b>${proper ? 'a prop' : 'lluny'}</b> de l'origen (el 0)?`, visual: null,
    pista: { completa: `La distància al 0 és el número sense el signe: el −9 és a 9 unitats del 0, i el +4 és a 4 unitats.`, mitja: `Mira el número sense el signe.` },
    resposta: { mode: 'opcions', opcions: barreja(ll).map(x => ({ html: enterGran(x), val: String(x), txt: fz(x) })), correcta: String(obj) },
    correctaHtml: `<b>${fz(obj)}</b>`, correctaTxt: fz(obj),
    explicacio: `Distàncies al 0: ${ll.map(x => `${fz(x)} → ${Math.abs(x)}`).join(', ')}. El més ${proper ? 'a prop' : 'lluny'} és el <b>${fz(obj)}</b>.`,
    solucio: [`Miro cada número sense el signe: ${ll.map(x => `${fz(x)} → ${Math.abs(x)}`).join(', ')}.`, `El ${proper ? 'més petit' : 'més gran'} d'aquests és el de ${fz(obj)}.`, `El més ${proper ? 'a prop' : 'lluny'} del 0 és el <b>${fz(obj)}</b>.`],
    dibuixSolucio: rectaZSVG({ min: -13, max: 13, labels: 'zero', punts: ll.map(x => ({ v: x, col: x === obj ? '#2c9a58' : '#bbb', etiq: fz(x) })), dalt: true })
  };
};
ER.termo = (nv) => {
  const mn = -rnd(2, 8), mx = rnd(1, 8);
  let x; const r = Math.random();
  if (r < .45) x = rnd(mn, mx); else if (r < .75) x = mn - rnd(1, 3); else x = mx + rnd(1, 3);
  const si = x >= mn && x <= mx;
  return {
    sig: `rz-te-${mn}-${mx}-${x}`, enunciat: `Un dia, la temperatura <b>mínima</b> va ser de ${fzT(mn)} i la <b>màxima</b>, de ${fzT(mx)}. Es va poder marcar <b>${fzT(x)}</b>?`,
    visual: p => p ? rectaZSVG({ min: -11, max: 11, labels: v => v === mn || v === mx || v === 0, banda: { de: mn, a: mx }, punts: [{ v: mn, col: BLAU }, { v: mx, col: '#e23b3b' }] }) : null,
    pista: { completa: `Totes les temperatures entre la mínima i la màxima s'han pogut marcar. Mira si ${fzT(x)} hi és.`, mitja: `Està entre la mínima i la màxima?` },
    resposta: { mode: 'sino', correcta: si ? 'si' : 'no' },
    correctaHtml: `<b>${si ? 'Sí' : 'No'}</b>`, correctaTxt: si ? 'Sí' : 'No',
    explicacio: si ? `<b>Sí</b>: ${fzT(x)} està entre ${fzT(mn)} i ${fzT(mx)}.` : `<b>No</b>: ${fzT(x)} és ${x < mn ? 'més fred que la mínima' : 'més calent que la màxima'}.`,
    solucio: [`La temperatura va anar de ${fzT(mn)} a ${fzT(mx)}.`, `${fzT(x)} ${si ? 'hi és' : 'queda fora'}.`, `Resposta: <b>${si ? 'Sí' : 'No'}</b>.`],
    dibuixSolucio: rectaZSVG({ min: -11, max: 11, labels: v => v === mn || v === mx || v === 0 || v === x, banda: { de: mn, a: mx }, punts: [{ v: x, col: si ? '#2c9a58' : '#d64242' }] })
  };
};
ER.distancia = (nv) => {
  const a = -rnd(1, 6), b = rnd(1, 6), d = b - a;
  return {
    sig: `rz-di-${a}-${b}`, enunciat: `Quantes unitats hi ha del ${enterGran(a)} al ${enterGran(b)} a la recta?`,
    visual: p => p ? rectaZSVG({ min: -7, max: 7, labels: 'totes', punts: [{ v: a }, { v: b }], salts: { de: a, a: b }, dalt: true }) : rectaZSVG({ min: -7, max: 7, labels: 'zero', punts: [{ v: a, etiq: fz(a) }, { v: b, etiq: fz(b) }], dalt: true }),
    pista: { completa: `Compta els salts: primer del ${fz(a)} fins al 0, i després del 0 fins al ${fz(b)}.`, mitja: `Passa pel 0.` },
    resposta: { mode: 'numero', valor: d, unitat: 'unitats' },
    correctaHtml: `<b>${d}</b> unitats`, correctaTxt: String(d),
    explicacio: `Del ${fz(a)} al 0 hi ha ${-a} i del 0 al ${fz(b)} hi ha ${b}: ${-a} + ${b} = <b>${d}</b>.`,
    solucio: [`Del ${fz(a)} al 0: ${-a} ${-a === 1 ? 'salt' : 'salts'}.`, `Del 0 al ${fz(b)}: ${b} ${b === 1 ? 'salt' : 'salts'}.`, `En total: ${-a} + ${b} = <b>${d}</b>.`],
    dibuixSolucio: rectaZSVG({ min: -7, max: 7, labels: 'totes', salts: { de: a, a: b }, dalt: true })
  };
};
TEMES.e2 = {
  gen: ER,
  sequencia: {
    1: [['costat'], ['marca'], ['llegeix'], ['seguent'], ['marca'], ['costat'], ['llegeix'], ['marca']],
    2: [['marca'], ['llegeix'], ['seguent'], ['entre'], ['lluny'], ['marca'], ['termo'], ['llegeix']],
    3: [['marca'], ['llegeix'], ['lluny', { proper: true }], ['distancia'], ['termo'], ['seguent'], ['entre'], ['marca']]
  },
  explicacio: [
    { text: `<p>Ja coneixem la recta dels naturals. Ara hi posarem <b class="parpelleja">tots els enters</b>.</p><p><b>1r</b> Dibuixem una recta.</p>`,
      vis: () => rectaZSVG({ min: -6, max: 6, ticks: false, zero: false }) },
    { text: `<p><b>2n</b> Marquem l'<b class="parpelleja">origen</b>: el <b>0</b>.</p>`,
      vis: () => rectaZSVG({ min: -6, max: 6, ticks: false }) },
    { text: `<p><b>3r</b> Dividim la recta en <b class="parpelleja">trossos iguals</b> (unitats), a la dreta i a l'esquerra del 0.</p>`,
      vis: () => rectaZSVG({ min: -6, max: 6, labels: 'cap', anim: true }) },
    { text: `<p><b>4t</b> A la <b class="parpelleja">dreta</b> del 0 hi posem els <b style="color:${T}">positius</b>.</p>`,
      vis: () => rectaZSVG({ min: -6, max: 6, labels: 'pos' }) },
    { text: `<p><b>5è</b> A l'<b class="parpelleja">esquerra</b> del 0 hi posem els <b style="color:${BLAU}">negatius</b>.</p>`,
      vis: () => rectaZSVG({ min: -6, max: 6, labels: 'totes', claus: true }) },
    { text: `<p>Per situar el <b style="color:${BLAU}">−4</b>: des del 0, fem <b class="parpelleja">4 salts</b> cap a l'esquerra.</p>`,
      vis: () => rectaZSVG({ min: -6, max: 6, labels: 'totes', salts: { de: 0, a: -4, col: BLAU }, punts: [{ v: -4, col: BLAU, anim: 1.5 }], anim: true, dalt: true }) },
    { text: `<p>La <b class="parpelleja">distància al 0</b> és el número sense el signe.</p><p class="petit">El −4 i el +4 estan tots dos a 4 unitats del 0.</p>`,
      vis: () => rectaZSVG({ min: -6, max: 6, labels: 'totes', salts: { de: 0, a: 4 }, punts: [{ v: 4 }, { v: -4, col: BLAU }], dalt: true }) }
  ],
  exemple: (nv) => {
    if (nv === 1) return {
      enunciat: `Marca el <b>−3</b> a la recta.`,
      passos: [
        { text: `Començo a l'origen, el 0.`, vis: rectaZSVG({ min: -6, max: 6, labels: 'parells', punts: [{ v: 0, col: '#fff' }] }) },
        { text: `El −3 és <b>negatiu</b>: va a l'<b>esquerra</b> del 0.`, vis: rectaZSVG({ min: -6, max: 6, labels: 'parells', claus: true }) },
        { text: `Faig <b>3 salts</b> cap a l'esquerra i marco el punt. <span class="marca-ok">✓</span>`, vis: rectaZSVG({ min: -6, max: 6, labels: 'parells', salts: { de: 0, a: -3 }, punts: [{ v: -3, col: '#2c9a58', etiq: '−3' }], dalt: true }) }
      ]
    };
    if (nv === 2) return {
      enunciat: `Quin nombre hi ha marcat a la recta?`,
      passos: [
        { text: `Només hi ha escrits el 0 i els de 5 en 5.`, vis: rectaZSVG({ min: -10, max: 10, labels: 'cinc', punts: [{ v: -7 }] }) },
        { text: `El punt és a l'<b>esquerra</b> del −5: compto 2 marques més.`, vis: rectaZSVG({ min: -10, max: 10, labels: 'cinc', punts: [{ v: -7 }], salts: { de: -5, a: -7 }, dalt: true }) },
        { text: `−5 i 2 més cap a l'esquerra: <b style="color:${BLAU}">−7</b>. <span class="marca-ok">✓</span>`, vis: `<div>${enterGran(-7)}</div>` }
      ]
    };
    return {
      enunciat: `Quantes unitats hi ha del <b>−3</b> al <b>+4</b>?`,
      passos: [
        { text: `Del −3 al 0: <b>3</b> salts.`, vis: rectaZSVG({ min: -6, max: 6, labels: 'totes', salts: { de: -3, a: 0 }, punts: [{ v: -3 }, { v: 4 }], dalt: true }) },
        { text: `Del 0 al +4: <b>4</b> salts més.`, vis: rectaZSVG({ min: -6, max: 6, labels: 'totes', salts: { de: -3, a: 4 }, punts: [{ v: -3 }, { v: 4 }], dalt: true }) },
        { text: `En total: 3 + 4 = <b>7 unitats</b>. <span class="marca-ok">✓</span>`, vis: `<div class="enter-gran">7</div>` }
      ]
    };
  }
};

/* ---------- OBJECTIU 4 · COMPARAR NOMBRES ENTERS (dossier p. 19) ---------- */
const limC = nv => nv === 1 ? 10 : nv === 2 ? 20 : 50;
const signeDe = (a, b) => a < b ? '<' : a > b ? '>' : '=';
const nzR = (lim, min = 1) => rnd(min, lim);
function parellC(nv, tipus) {
  const L = limC(nv); let a, b;
  if (tipus === 'pn') { a = nzR(L); b = -nzR(L); }
  else if (tipus === 'nn') { do { a = -nzR(L); b = -nzR(L); } while (a === b); }
  else if (tipus === 'np') { a = -nzR(Math.min(L, 9)); b = a - rnd(1, 3); if (Math.random() < .5) b = a + rnd(1, Math.min(3, -a - 1) || 1); if (b >= 0) b = a - 1; }
  else if (tipus === 'pp') { do { a = nzR(L); b = nzR(L); } while (a === b); }
  else if (tipus === 'n0') { a = -nzR(L); b = 0; }
  else if (tipus === 'p0') { a = nzR(L); b = 0; }
  else { a = rnd(-L, L); b = a; }
  if (tipus === 'np' && nv === 3) { a = -rnd(10, 50); b = a + (Math.random() < .5 ? -1 : 1) * rnd(1, 3); }
  return Math.random() < .5 ? [a, b] : [b, a];
}
function raoC(a, b) {
  if (a === b) return `són iguals`;
  if (a === 0 || b === 0) { const x = a === 0 ? b : a; return x < 0 ? `el 0 és més gran que qualsevol negatiu` : `qualsevol positiu és més gran que el 0`; }
  if ((a > 0) !== (b > 0)) return `un positiu sempre és més gran que un negatiu`;
  if (a < 0) { const g = Math.max(a, b); return `entre negatius, és més gran el que està més a prop del 0: ${fz(g)}`; }
  return `el ${fz(Math.max(a, b))} està més a la dreta`;
}
const PISTA_C = { completa: `És <b>més gran</b> el que està <b>més a la dreta</b> de la recta. Entre dos negatius, és més gran el que està <b>més a prop del 0</b>: −3 &gt; −8 (a −3 °C fa menys fred que a −8 °C).`, mitja: `Pensa en la recta: més a la dreta, més gran.` };
C.signes = (nv, { n = 3 } = {}) => {
  const tipus = nv === 1 ? barreja(['pn', 'n0', 'pp', 'nn', 'pn']).slice(0, n) : nv === 2 ? barreja(['nn', 'nn', 'pn', 'n0', 'pp', 'np', 'eq']).slice(0, n) : barreja(['nn', 'np', 'nn', 'pn', 'np', 'eq', 'nn', 'p0']).slice(0, n);
  const items = []; const vist = new Set();
  for (const t of tipus) { let p, g = 0; do { p = parellC(nv, t); } while (vist.has(p.join()) && g++ < 30); vist.add(p.join()); items.push({ tipus: 'signe', a: p[0], b: p[1], correcta: signeDe(p[0], p[1]) }); }
  return {
    sig: `cs-${items.map(i => i.a + '_' + i.b).join('-')}`, enunciat: `Posa el signe que hi va entre cada parella: <b>&lt;</b>, <b>&gt;</b> o <b>=</b>.`,
    visual: p => p && nv === 1 ? rectaZSVG({ min: -10, max: 10, labels: 'parells' }) : null, pista: PISTA_C, ...apartats(items),
    explicacio: `Més a la dreta de la recta, més gran. Entre negatius, guanya el que està més a prop del 0.`,
    solucio: items.map(it => `${fz(it.a)} ${esc(it.correcta)} ${fz(it.b)}: ${raoC(it.a, it.b)}.`)
  };
};
C.ordena = (nv, { desc = null } = {}) => {
  const q = nv === 1 ? 4 : nv === 2 ? 5 : 6, L = limC(nv) / (nv === 3 ? 2 : 1);
  let nums; do { nums = diferents(q, () => rnd(-L, L)); } while (nums.filter(x => x < 0).length < (nv === 1 ? 2 : 3) || nums.filter(x => x > 0).length < 1);
  if (nv >= 2 && !nums.includes(0) && Math.random() < .4) nums[nums.findIndex(x => x > 0)] = 0;
  const ordre = desc ?? (nv === 1 ? 'asc' : nv === 2 ? tria(['asc', 'desc']) : tria(['desc', 'desc', 'asc'])) ;
  const it = { tipus: 'ordena', nums, ordre: desc === true ? 'desc' : desc === false ? 'asc' : ordre };
  const o = ordenats(it);
  return {
    sig: `co-${it.ordre}-${nums.join('_')}`, enunciat: `Ordena aquests nombres de més <b>${it.ordre === 'asc' ? 'petit a més gran' : 'gran a més petit'}</b>. Toca'ls en ordre; si t'equivoques, toca'l a la fila per treure'l.`,
    visual: p => p ? rectaZSVG({ min: -Math.ceil(L), max: Math.ceil(L), labels: 'zero', punts: nums.map(v => ({ v, col: colZ(v) })) }) : null, pista: PISTA_C, ...apartats([it]),
    explicacio: `${o.map(fz).join(it.ordre === 'asc' ? ' &lt; ' : ' &gt; ')}`,
    solucio: [`Els negatius són els més petits: el més lluny del 0 és el més petit (${fz(Math.min(...nums))}).`, nums.includes(0) ? `Després ve el 0, i després els positius.` : `Després venen els positius.`, `Ordenats: <b>${o.map(fz).join(it.ordre === 'asc' ? ' &lt; ' : ' &gt; ')}</b>.`]
  };
};
C.extrem = (nv, { n = 2 } = {}) => {
  const L = limC(nv) / (nv === 3 ? 2 : 1); const items = [];
  for (let k = 0; k < n; k++) {
    let t; do { t = diferents(3, () => rnd(-L, L)); } while (t.filter(x => x < 0).length < (nv === 1 ? 1 : 2));
    const gran = k % 2 === 0; const c = gran ? Math.max(...t) : Math.min(...t);
    items.push({ tipus: 'tria', html: `El més <b>${gran ? 'gran' : 'petit'}</b>:`, opcions: barreja(t).map(v => ({ html: `<span style="color:${colZ(v)}">${fz(v)}</span>`, val: String(v) })), correcta: String(c) });
  }
  return {
    sig: `ce-${items.map(i => i.opcions.map(o => o.val).join('_')).join('-')}`, enunciat: `Tria, a cada apartat, el nombre que et demanen.`, visual: null, pista: PISTA_C, ...apartats(items),
    explicacio: `El més gran és el que està més a la dreta; el més petit, el que està més a l'esquerra.`,
    solucio: items.map(it => `${textPla(it.html)} ${fz(Number(it.correcta))}.`)
  };
};
C.certFals = (nv, { n = 3 } = {}) => {
  const tipus = nv === 1 ? ['pn', 'nn', 'n0', 'pp'] : ['nn', 'nn', 'np', 'pn', 'n0'];
  const items = barreja(tipus).slice(0, n).map(t => {
    const [a, b] = parellC(nv, t); const s = tria(['<', '>']); const cert = signeDe(a, b) === s;
    return { tipus: 'tria', html: `<span class="ap-expr">${fz(a)} ${esc(s)} ${fz(b)}</span>`, opcions: [{ html: 'Cert', val: 'c' }, { html: 'Fals', val: 'f' }], correcta: cert ? 'c' : 'f', a, b, s };
  });
  return {
    sig: `cf-${items.map(i => `${i.a}${i.s}${i.b}`).join('-')}`, enunciat: `Cert o fals?`, visual: null, pista: PISTA_C, ...apartats(items),
    explicacio: `Pensa sempre en la recta: més a la dreta, més gran.`,
    solucio: items.map(it => `${fz(it.a)} ${esc(it.s)} ${fz(it.b)} és <b>${it.correcta === 'c' ? 'cert' : 'fals'}</b>: ${raoC(it.a, it.b)}.`)
  };
};
C.marca = (nv, { entre = false } = {}) => {
  const L = nv === 1 ? 9 : 15; let nums, bons, html, g = 0;
  do {
    nums = diferents(nv === 1 ? 6 : 8, () => rnd(-L, L));
    if (entre) { const a = -rnd(3, 6), b = rnd(1, 4); bons = nums.map((v, i) => v > a && v < b ? i : -1).filter(i => i >= 0); html = `Toca tots els nombres <b>més grans que ${fz(a)}</b> i <b>més petits que ${fz(b)}</b>:`; }
    else { const x = nv === 1 ? tria([0, 2, -1]) : -rnd(2, 6); const mes = nv === 1 ? Math.random() < .5 : tria([true, true, false]); bons = nums.map((v, i) => (mes ? v > x : v < x) ? i : -1).filter(i => i >= 0); html = `Toca tots els nombres <b>més ${mes ? 'grans' : 'petits'} que ${fz(x)}</b>:`; }
  } while ((bons.length < 2 || bons.length > nums.length - 2) && g++ < 100);
  const it = { tipus: 'marca', nums, bons, html };
  return {
    sig: `cm-${nums.join('_')}-${textPla(html)}`, enunciat: `Fixa't bé en la condició i toca tots els nombres que la compleixen.`, visual: p => p ? rectaZSVG({ min: -L - 1, max: L + 1, labels: 'cinc' }) : null, pista: PISTA_C, ...apartats([it]),
    explicacio: `Compleixen la condició: ${bons.map(i => fz(nums[i])).join(', ')}.`,
    solucio: [`Llegeixo la condició: ${textPla(html).replace(':', '')}.`, `Miro on queda cada nombre a la recta.`, `Són: <b>${bons.map(i => fz(nums[i])).join(', ')}</b>.`]
  };
};
const VEINS = [['l\'Aisha', 'f'], ['en Pol', 'm'], ['la Mei', 'f'], ['en Bilal', 'm'], ['la Laia', 'f'], ['l\'Andrei', 'm'], ['la Yasmin', 'f'], ['en Wei', 'm'], ['la Núria', 'f'], ['en Hamza', 'm']];
C.context = (nv) => {
  const tipus = nv === 1 ? tria(['temps', 'edifici']) : tria(['temps', 'edifici', 'diners']);
  let items = [], vis = null, txt = '', sig;
  if (tipus === 'temps') {
    let cs; do { cs = tempsCat(5); } while (new Set(cs.map(c => c.t)).size < 5);
    const fred = cs.reduce((a, b) => b.t < a.t ? b : a), calor = cs.reduce((a, b) => b.t > a.t ? b : a);
    const ops = cs.map(c => ({ html: esc(c.nom), val: c.nom }));
    items = [{ tipus: 'tria', html: 'On fa <b>més fred</b>?', opcions: ops, correcta: fred.nom }, { tipus: 'tria', html: 'On fa <b>més calor</b>?', opcions: ops, correcta: calor.nom }];
    if (nv >= 2) { const [x, y] = barreja(cs.filter(c => c.t < 1)).slice(0, 2); if (x && y) items.push({ tipus: 'signe', a: x.t, b: y.t, correcta: signeDe(x.t, y.t), nota: `${x.nom} i ${y.nom}` }); }
    vis = () => mapaCatSVG(cs); txt = `Mira el mapa del temps.`; sig = `cx-t-${cs.map(c => c.nom + c.t).join('_')}`;
  } else if (tipus === 'edifici') {
    const vs = barreja(VEINS).slice(0, nv === 1 ? 3 : 4); let ps; do { ps = diferents(vs.length, () => rnd(-5, 6)); } while (ps.filter(x => x < 0).length < 2);
    const nom = i => vs[i][0]; const baix = ps.indexOf(Math.min(...ps)), dalt = ps.indexOf(Math.max(...ps));
    const ops = vs.map((v, i) => ({ html: majus(v[0].replace(/^(en |la |l')/, '')), val: String(i) }));
    items = [{ tipus: 'tria', html: 'Qui viu <b>més avall</b>?', opcions: ops, correcta: String(baix) }, { tipus: 'tria', html: 'Qui viu <b>més amunt</b>?', opcions: ops, correcta: String(dalt) }];
    txt = `En un edifici, ${vs.map((v, i) => `${nom(i)} viu ${ps[i] < 0 ? `al soterrani <b>${fz(ps[i])}</b>` : ps[i] === 0 ? `a la planta baixa (<b>0</b>)` : `a la planta <b>${fz(ps[i])}</b>`}`).join(', ')}.`;
    vis = p => p ? edificiSVG({ min: -5, max: 6, robotOn: false, colors: true }) : null; sig = `cx-e-${ps.join('_')}`;
  } else {
    const vs = barreja(VEINS).slice(0, 3); let ds; do { ds = diferents(3, () => rnd(-12, 6) * 5); } while (ds.filter(x => x < 0).length < 2 || ds.includes(0));
    const ops = vs.map((v, i) => ({ html: majus(v[0].replace(/^(en |la |l')/, '')), val: String(i) }));
    const mes = ds.indexOf(Math.max(...ds)), deu = ds.indexOf(Math.min(...ds));
    items = [{ tipus: 'tria', html: 'Qui té <b>més diners</b>?', opcions: ops, correcta: String(mes) }, { tipus: 'tria', html: 'Qui <b>deu més</b> diners?', opcions: ops, correcta: String(deu) }];
    txt = `Saldo del compte del banc: ${vs.map((v, i) => `${v[0]}, <b style="color:${ds[i] < 0 ? '#d64242' : '#2c9a58'}">${fz(ds[i])} €</b>`).join('; ')}.`;
    sig = `cx-d-${ds.join('_')}`;
  }
  return {
    sig, enunciat: `${txt} Respon els apartats.`, visual: vis, pista: PISTA_C, ...apartats(items),
    explicacio: tipus === 'diners' ? `Qui deu més té el saldo <b>més petit</b> (el més negatiu).` : tipus === 'temps' ? `Més fred = temperatura més petita. Més calor = la més gran.` : `Més avall = el número més petit. Més amunt = el més gran.`,
    solucio: items.map(it => it.tipus === 'signe' ? `${it.nota}: ${fz(it.a)} ${esc(it.correcta)} ${fz(it.b)}.` : `${textPla(it.html)} → ${textPla(it.opcions.find(o => o.val === it.correcta).html)}.`)
  };
};
const termos2 = (a, b, na = '', nb = '') => `<div style="display:flex;gap:40px;justify-content:center;align-items:flex-end">${[[a, na], [b, nb]].map(([v, n]) => `<div style="text-align:center">${termometreSVG({ v, min: -10, max: 6, lab: 2, ample: 110 })}<div style="font-weight:900;font-size:1.3rem;color:${colZ(v)}">${fz(v)} °C</div>${n ? `<div class="petit">${n}</div>` : ''}</div>`).join('')}</div>`;
TEMES.e3 = {
  gen: C,
  sequencia: {
    1: [['signes', { n: 3 }], ['ordena'], ['extrem', { n: 2 }], ['certFals', { n: 3 }], ['context'], ['signes', { n: 3 }], ['marca'], ['ordena']],
    2: [['signes', { n: 4 }], ['ordena'], ['marca'], ['certFals', { n: 4 }], ['extrem', { n: 3 }], ['context'], ['signes', { n: 4 }], ['ordena']],
    3: [['signes', { n: 5 }], ['ordena'], ['marca', { entre: true }], ['context'], ['certFals', { n: 4 }], ['extrem', { n: 3 }], ['signes', { n: 6 }], ['ordena']]
  },
  explicacio: [
    { text: `<p>A la recta, els enters estan <b class="parpelleja">ordenats</b>.</p><p>Com més a la <b>dreta</b>, més <b>gran</b>. Com més a l'<b>esquerra</b>, més <b>petit</b>.</p>`,
      vis: () => rectaZSVG({ min: -6, max: 6, labels: 'totes', fletxes: [{ de: -5, a: 5, col: T, etiq: 'cada vegada més gran' }], anim: true, dalt: true }) },
    { text: `<p>Qualsevol <b style="color:${T}">positiu</b> és <b class="parpelleja">més gran</b> que qualsevol <b style="color:${BLAU}">negatiu</b>.</p><p class="petit">+1 &gt; −100, encara que 100 sembli molt.</p>`,
      vis: () => rectaZSVG({ min: -6, max: 6, labels: 'totes', claus: true, punts: [{ v: -5, col: BLAU, etiq: '−5' }, { v: 1, etiq: '+1' }], dalt: true }) },
    { text: `<p>I entre dos <b>negatius</b>? Pensa en el termòmetre.</p><p>A <b style="color:${BLAU}">−8 °C</b> fa <b class="parpelleja">més fred</b> que a −3 °C. Per tant, <b>−8 és més petit</b>.</p>`,
      vis: () => termos2(-8, -3, 'més fred', 'menys fred') },
    { text: `<p>Entre dos negatius, és <b>més gran</b> el que està <b class="parpelleja">més a prop del 0</b>.</p><p class="petit">−3 és més a prop del 0 que −8: −3 &gt; −8.</p>`,
      vis: () => rectaZSVG({ min: -9, max: 2, labels: 'totes', punts: [{ v: -8, col: BLAU, etiq: '−8' }, { v: -3, col: BLAU, etiq: '−3' }], salts: { de: 0, a: -3, col: BLAU }, dalt: true }) },
    { text: `<p>Fem servir els símbols <b class="parpelleja">&gt;</b> (més gran que) i <b class="parpelleja">&lt;</b> (més petit que).</p><p>La part <b>oberta</b> del símbol sempre mira el nombre més gran.</p>`,
      vis: () => `<div class="comp-sims"><div><b style="color:${T}">+5</b> <span>&gt;</span> <b style="color:${BLAU}">−3</b></div><div><b style="color:${BLAU}">−6</b> <span>&lt;</span> <b style="color:${BLAU}">−3</b></div><div><b style="color:${T}">+7</b> <span>&lt;</span> <b style="color:${T}">+11</b></div><div><b style="color:${BLAU}">−4</b> <span>&gt;</span> <b style="color:${BLAU}">−8</b></div></div>` },
    { text: `<p><b>Resum</b>: els enters ordenats de més petit a més gran.</p>`,
      vis: () => `<div class="conj-txt" style="font-size:1.25rem">…, −4 &lt; −3 &lt; −2 &lt; −1 &lt; <b>0</b> &lt; +1 &lt; +2 &lt; +3 &lt; +4, …</div>` + rectaZSVG({ min: -6, max: 6, labels: 'totes' }) }
  ],
  exemple: (nv) => {
    if (nv === 1) return {
      enunciat: `Posa el signe: <b>+2 ? −5</b>`,
      passos: [
        { text: `Busco els dos nombres a la recta.`, vis: rectaZSVG({ min: -6, max: 6, labels: 'totes', punts: [{ v: 2, etiq: '+2' }, { v: -5, col: BLAU, etiq: '−5' }], dalt: true }) },
        { text: `El +2 està més a la <b>dreta</b>: és més gran.`, vis: rectaZSVG({ min: -6, max: 6, labels: 'totes', punts: [{ v: 2, col: '#2c9a58', etiq: '+2' }, { v: -5, col: BLAU, etiq: '−5' }], dalt: true }) },
        { text: `Resultat: <b>+2 &gt; −5</b>. <span class="marca-ok">✓</span>`, vis: `<div class="comp-sims"><div><b style="color:${T}">+2</b> <span>&gt;</span> <b style="color:${BLAU}">−5</b></div></div>` }
      ]
    };
    if (nv === 2) return {
      enunciat: `Posa el signe: <b>−8 ? −3</b>`,
      passos: [
        { text: `Tots dos són negatius. Penso en el termòmetre.`, vis: termos2(-8, -3) },
        { text: `A −8 °C fa més fred: <b>−8 és més petit</b>. També: −3 està més a prop del 0.`, vis: rectaZSVG({ min: -9, max: 1, labels: 'totes', punts: [{ v: -8, col: BLAU, etiq: '−8' }, { v: -3, col: '#2c9a58', etiq: '−3' }], dalt: true }) },
        { text: `Resultat: <b>−8 &lt; −3</b>. <span class="marca-ok">✓</span>`, vis: `<div class="comp-sims"><div><b style="color:${BLAU}">−8</b> <span>&lt;</span> <b style="color:${BLAU}">−3</b></div></div>` }
      ]
    };
    return {
      enunciat: `Ordena de més gran a més petit: −4, +3, −9, 0, +1`,
      passos: [
        { text: `Primer els positius, de més gran a més petit: +3, +1.`, vis: `<div class="xips-z"><span style="color:${T}">+3</span><span style="color:${T}">+1</span></div>` },
        { text: `Després el 0, i després els negatius: el que està més a prop del 0 primer (−4) i el més llunyà al final (−9).`, vis: rectaZSVG({ min: -10, max: 4, labels: 'totes', punts: [{ v: -9, col: BLAU }, { v: -4, col: BLAU }, { v: 0, col: '#8f8a82' }, { v: 1 }, { v: 3 }] }) },
        { text: `Resultat: <b>+3 &gt; +1 &gt; 0 &gt; −4 &gt; −9</b>. <span class="marca-ok">✓</span>`, vis: `<div class="conj-txt">+3 &gt; +1 &gt; 0 &gt; −4 &gt; −9</div>` }
      ]
    };
  }
};

/* ---------- OBJECTIU 5 · SUMES I RESTES AMB ENTERS (dossier p. 20) — sense calculadora ---------- */
const exprPla = ts => ts.map((t, i) => i === 0 ? nz(t) : t < 0 ? ` − ${-t}` : ` + ${t}`).join('');
const PISTA_S = { completa: `Pensa en l'<b>ascensor</b>: + puja, − baixa. O fes servir les regles: signes <b>iguals</b> → sumo i poso el mateix signe; signes <b>diferents</b> → resto i poso el signe del número més gran.`, mitja: `Signes iguals: sumo. Diferents: resto.` };
function regla2(a, b) {
  const r = a + b;
  if (Math.sign(a) === Math.sign(b) || a === 0 || b === 0) return `Signes iguals: ${Math.abs(a)} + ${Math.abs(b)} = ${Math.abs(r)}, i poso el signe ${a < 0 || b < 0 ? '−' : '+'}: <b>${fz(r)}</b>`;
  const g = Math.abs(a) > Math.abs(b) ? a : b, p = g === a ? b : a;
  return `Signes diferents: ${Math.abs(g)} − ${Math.abs(p)} = ${Math.abs(r)}, i poso el signe del ${Math.abs(g)} (${g < 0 ? '−' : '+'}): <b>${fz(r)}</b>`;
}
function termesS(nv, { tres = false } = {}) {
  const L = nv === 1 ? 6 : 20; let ts, g = 0;
  do {
    ts = Array.from({ length: tres ? 3 : 2 }, (_, i) => (Math.random() < .5 ? -1 : 1) * rnd(1, L));
    if (!tres && nv === 1 && Math.random() < .3) ts[0] = rnd(1, L);
  } while (g++ < 200 && (Math.abs(ts.reduce((a, b) => a + b, 0)) > (nv === 1 ? 8 : 30)));
  return ts;
}
/* ---------- Fitxes positives i negatives (ajuda del nivell 1 de l'objectiu 5) ----------
   Al principi només hi ha el botó «Ajuda't amb les fitxes». L'alumne toca una fitxa + i una −:
   la parella es tatxa (val 0). Quan ja no es poden fer parelles, s'encerclen les fitxes que queden. */
const FX = new WeakMap();
function fitxesHtml(items) {
  const dades = esc(JSON.stringify(items.map(i => ({ e: i.etiqueta, ts: i.ts }))));
  return `<div class="fitxes" data-fx="${dades}"><button type="button" class="fx-obre" data-fx-act="obre"><span class="fx p mini">+</span><span class="fx n mini">−</span> Ajuda't amb les fitxes</button></div>`;
}
const fxComptes = it => ({ pos: it.ts.filter(t => t > 0).reduce((a, b) => a + b, 0), neg: -it.ts.filter(t => t < 0).reduce((a, b) => a + b, 0) });
function fxEstat(c) {
  let st = FX.get(c); if (st) return st;
  const items = JSON.parse(c.dataset.fx); st = { items, k: 0, e: items.map(() => ({ xp: new Set(), xn: new Set(), sel: null })) }; FX.set(c, st); return st;
}
function fxAcabat(it, e) { const { pos, neg } = fxComptes(it); return e.xp.size === Math.min(pos, neg) && e.xn.size === Math.min(pos, neg); }
function fxPinta(c, msg = '') {
  const st = fxEstat(c), it = st.items[st.k], e = st.e[st.k]; const { pos, neg } = fxComptes(it); const fi = fxAcabat(it, e);
  const fitxa = (cls, i) => { const x = (cls === 'p' ? e.xp : e.xn).has(i), sel = e.sel && e.sel.c === cls && e.sel.i === i;
    return `<button type="button" class="fx ${cls}${x ? ' tatxada' : ''}${sel ? ' sel' : ''}${fi && !x ? ' queda' : ''}" data-fx-c="${cls}" data-fx-i="${i}" ${x || fi ? 'disabled' : ''} aria-label="fitxa ${cls === 'p' ? '+1' : '−1'}">${cls === 'p' ? '+' : '−'}</button>`; };
  const fila = (n, cls) => n ? Array.from({ length: n }, (_, i) => fitxa(cls, i)).join('') : '<span class="fx-cap0">cap</span>';
  const llegenda = it.ts.map(t => `<b style="color:${colZ(t)}">${fz(t)}</b> → ${Math.abs(t)} ${t > 0 ? (Math.abs(t) === 1 ? 'taronja' : 'taronges') : (Math.abs(t) === 1 ? 'blava' : 'blaves')}`).join(' · ');
  const queden = pos + neg - e.xp.size - e.xn.size;
  const txt = msg || (fi ? (queden ? `Ja no pots fer més parelles. <b>Compta les fitxes encerclades</b> i mira de quin color són.` : `Totes les fitxes s'han tatxat: no en queda cap.`)
    : e.sel ? `Ara toca una fitxa <b>${e.sel.c === 'p' ? '−' : '+'}</b> per fer la parella.` : `Toca una fitxa <b>+</b> i una fitxa <b>−</b>: fan 0 i es tatxen.`);
  c.innerHTML = `<div class="fx-cap">Cada <span class="fx p mini">+</span> val <b>+1</b> i cada <span class="fx n mini">−</span> val <b>−1</b>. Una de cada fan <b>0</b>.</div>
    ${st.items.length > 1 ? `<div class="fx-tabs">${st.items.map((x, i) => `<button type="button" data-fx-tab="${i}" class="${i === st.k ? 'activa' : ''}">${LLETRES_AP[i]}) ${x.e}</button>`).join('')}</div>` : ''}
    <div class="fx-tauler"><span class="fx-sg p">+</span><div class="fx-fila">${fila(pos, 'p')}</div><span class="fx-sg n">−</span><div class="fx-fila">${fila(neg, 'n')}</div></div>
    <div class="fx-lleg">${llegenda}</div>
    <div class="fx-msg">${txt}</div>
    <div class="fx-acc"><button type="button" class="boto-petit" data-fx-act="reset">↺ Torna-hi</button><button type="button" class="boto-petit" data-fx-act="tanca">Amaga les fitxes</button></div>`;
}
document.addEventListener('click', ev => {
  const b = ev.target.closest?.('[data-fx-tab],[data-fx-act],[data-fx-c]'); if (!b) return; const c = b.closest('.fitxes'); if (!c) return;
  const st = fxEstat(c);
  if (b.dataset.fxAct === 'obre') { so('pas'); return fxPinta(c); }
  if (b.dataset.fxAct === 'tanca') { so('pas'); c.innerHTML = fitxesHtml([]).replace(/^<div[^>]*>|<\/div>$/g, ''); return; }
  if (b.dataset.fxTab != null) { st.k = Number(b.dataset.fxTab); so('pas'); return fxPinta(c); }
  const e = st.e[st.k];
  if (b.dataset.fxAct === 'reset') { st.e[st.k] = { xp: new Set(), xn: new Set(), sel: null }; so('pas'); return fxPinta(c); }
  const cls = b.dataset.fxC, i = Number(b.dataset.fxI);
  if (!e.sel || (e.sel.c === cls && e.sel.i === i)) { e.sel = e.sel ? null : { c: cls, i }; so('pas'); return fxPinta(c); }
  if (e.sel.c === cls) { // dues del mateix signe: no fan parella
    e.sel = { c: cls, i }; so('ko'); fxPinta(c, `Dues fitxes <b>${cls === 'p' ? '+' : '−'}</b> no fan 0. Una parella ha de ser <b>una + i una −</b>.`);
    $$('.fx.sel', c).forEach(f => f.classList.add('tremola')); return;
  }
  (cls === 'p' ? e.xp : e.xn).add(i); (e.sel.c === 'p' ? e.xp : e.xn).add(e.sel.i); e.sel = null;
  so(fxAcabat(st.items[st.k], e) ? 'ok' : 'pas'); fxPinta(c);
});
const S5 = {};
S5.ops = (nv, { n = 3, par = false, tres = false } = {}) => {
  const items = []; const vist = new Set(); let creua = 0;
  for (let k = 0; k < n; k++) {
    let ts, html, val, g = 0;
    do {
      ts = termesS(nv, { tres }); val = ts.reduce((a, b) => a + b, 0);
      if (par && !tres && k % 2 === 1) { const neg = nv === 3 && Math.random() < .5; const b = neg ? -ts[1] : ts[1]; html = `(${fz(ts[0])}) ${neg ? '−' : '+'} (${fz(b)})`; }
      else html = exprPla(ts);
    } while ((vist.has(html) || (nv === 1 && k === n - 1 && !creua && Math.sign(ts[0]) === Math.sign(val))) && g++ < 80);
    if (Math.sign(ts[0]) !== Math.sign(val) && val !== 0) creua++;
    vist.add(html); items.push({ tipus: 'enter', html, valor: val, ts });
  }
  return {
    sig: `so-${items.map(i => i.html).join('|')}`, enunciat: `Calcula. ${nv === 1 ? 'Si et cal, fes servir les fitxes.' : ''}`,
    visual: nv === 1 ? (() => fitxesHtml(items.map(it => ({ etiqueta: it.html, ts: it.ts })))) : null, fitxes: nv === 1, pista: PISTA_S, ...apartats(items),
    explicacio: `Signes iguals: sumo i poso el mateix signe. Signes diferents: resto i poso el signe del número més gran.`,
    solucio: items.map(it => it.ts.length === 2 ? `${it.html}: ${it.html.startsWith('(') ? `treus els parèntesis → ${exprPla([it.ts[0], it.valor - it.ts[0]])}. ` : ''}${regla2(it.ts[0], it.valor - it.ts[0])}.` : `${it.html}: ${exprPla(it.ts.slice(0, 2))} = ${fz(it.ts[0] + it.ts[1])}, i ${fz(it.ts[0] + it.ts[1])}${it.ts[2] < 0 ? ' − ' + (-it.ts[2]) : ' + ' + it.ts[2]} = <b>${fz(it.valor)}</b>.`)
  };
};
S5.ascensor = (nv, { n = 3 } = {}) => {
  const items = []; const vist = new Set();
  for (let k = 0; k < n; k++) {
    let f, m, g = 0; do { f = rnd(-5, 8); m = (Math.random() < .5 ? -1 : 1) * rnd(1, nv === 1 ? 6 : 9); } while ((f + m < -5 || f + m > 8 || m === 0 || vist.has(f + '_' + m) || (nv === 1 && k === 0 && Math.sign(f) === Math.sign(f + m))) && g++ < 200);
    vist.add(f + '_' + m);
    const on = f < 0 ? `al soterrani ${fz(f)}` : f === 0 ? `a la planta baixa (0)` : `a la planta ${fz(f)}`;
    items.push({ tipus: 'enter', llarg: true, html: `Ets ${on} i ${m > 0 ? 'puges' : 'baixes'} ${Math.abs(m)} ${Math.abs(m) === 1 ? 'planta' : 'plantes'}. On arribes?`, valor: f + m, f, m });
  }
  return {
    sig: `sa-${items.map(i => i.f + '_' + i.m).join('-')}`, enunciat: `L'ascensor de l'edifici. Escriu a quina planta arribes.`,
    visual: () => edificiSVG({ min: -5, max: 8, robotOn: false, colors: true }), pista: { completa: `Puges → sumes. Baixes → restes. Compta les plantes a l'edifici, i recorda que la planta baixa és el 0.`, mitja: `Compta les plantes una a una.` }, ...apartats(items),
    explicacio: `Pujar és sumar i baixar és restar. Quan passes per la planta baixa, canvies de signe.`,
    solucio: items.map(it => `${fz(it.f)} ${it.m > 0 ? '+ ' + it.m : '− ' + (-it.m)} = <b>${fz(it.valor)}</b>.`)
  };
};
const REGLES_S = [{ html: 'Sumo i poso +', val: 's+' }, { html: 'Sumo i poso −', val: 's-' }, { html: 'Resto i poso +', val: 'r+' }, { html: 'Resto i poso −', val: 'r-' }];
S5.regla = (nv) => {
  const items = []; const vist = new Set();
  for (let k = 0; k < 2; k++) {
    let a, b, g = 0; do { a = (Math.random() < .5 ? -1 : 1) * rnd(2, 15); b = (Math.random() < .5 ? -1 : 1) * rnd(2, 15); } while ((Math.abs(a) === Math.abs(b) || vist.has(a + '_' + b) || (k === 1 && Math.sign(a) === Math.sign(items[0].a) && Math.sign(b) === Math.sign(items[0].b))) && g++ < 100);
    vist.add(a + '_' + b); const r = a + b;
    const c = Math.sign(a) === Math.sign(b) ? (a < 0 ? 's-' : 's+') : (r < 0 ? 'r-' : 'r+');
    const html = exprPla([a, b]);
    items.push({ tipus: 'tria', html: `Per fer <b>${html}</b>, què faig?`, opcions: REGLES_S, correcta: c, a, b }, { tipus: 'enter', html: `${html}`, valor: r, a, b });
  }
  return {
    sig: `sr-${items.filter(i => i.tipus === 'enter').map(i => i.html).join('|')}`, enunciat: `Primer tria la regla que fas servir i després escriu el resultat.`, visual: null, pista: PISTA_S, ...apartats(items),
    explicacio: `Signes iguals → sumo i poso el mateix signe. Signes diferents → resto i poso el signe del número més gran.`,
    solucio: items.filter(i => i.tipus === 'enter').map(it => `${it.html}: ${regla2(it.a, it.b)}.`)
  };
};
S5.error = (nv, { n = 2 } = {}) => {
  const items = []; const vist = new Set();
  for (let k = 0; k < n; k++) {
    let a, b, g = 0; do { a = (Math.random() < .6 ? -1 : 1) * rnd(2, nv === 1 ? 8 : 15); b = (Math.random() < .5 ? -1 : 1) * rnd(1, nv === 1 ? 8 : 15); } while ((Math.sign(a) === Math.sign(b) && Math.random() < .6 || vist.has(a + '_' + b)) && g++ < 100);
    vist.add(a + '_' + b); const r = a + b; const qui = VEINS[(k * 3 + rnd(0, 9)) % VEINS.length][0];
    const mal = [Math.sign(a) * (Math.abs(a) + Math.abs(b)), -r, Math.sign(b) * Math.abs(r)].filter(x => x !== r);
    const bona = Math.random() < .4; const diu = bona ? r : tria(mal);
    items.push({ tipus: 'tria', html: `${majus(qui)} diu que <b>${exprPla([a, b])} = ${fz(diu)}</b>. Té raó?`, opcions: [{ html: 'Sí', val: 'si' }, { html: 'No', val: 'no' }], correcta: diu === r ? 'si' : 'no', a, b, diu, r, llarg: true });
  }
  return {
    sig: `se-${items.map(i => `${i.a}_${i.b}_${i.diu}`).join('-')}`, enunciat: `Comprova els càlculs d'aquests companys.`, visual: nv === 1 ? (() => fitxesHtml(items.map(it => ({ etiqueta: exprPla([it.a, it.b]), ts: [it.a, it.b] })))) : null, fitxes: nv === 1, pista: PISTA_S, ...apartats(items),
    explicacio: `Fes tu l'operació i compara-la amb la que diuen.`,
    solucio: items.map(it => `${exprPla([it.a, it.b])} = <b>${fz(it.r)}</b>: ${it.diu === it.r ? 'té raó' : `no té raó (diu ${fz(it.diu)})`}.`)
  };
};
const CTX_S = [
  () => { const a = -rnd(2, 9), m = rnd(3, 12); return { html: `A les 7 del matí hi havia ${fzT(a)}. Al migdia, la temperatura ha pujat ${m} graus. Quina temperatura fa?`, valor: a + m, unitat: '°C', op: [a, m] }; },
  () => { const a = rnd(1, 8), m = rnd(3, 14); return { html: `Hi havia ${fzT(a)} i a la nit la temperatura ha baixat ${m} graus. Quina temperatura fa ara?`, valor: a - m, unitat: '°C', op: [a, -m] }; },
  () => { const a = -rnd(3, 9) * 10, m = rnd(1, 5) * 10; return { html: `Un submarí és a ${-a} metres sota el nivell del mar i puja ${m} metres. On és ara?`, valor: a + m, unitat: 'm', op: [a, m] }; },
  () => { const a = -rnd(2, 6) * 5, m = rnd(1, 8) * 5; return { html: `Al compte tens un deute de ${-a} € i hi ingresses ${m} €. Quin saldo tens?`, valor: a + m, unitat: '€', op: [a, m] }; },
  () => { const a = rnd(2, 8) * 5, m = rnd(3, 12) * 5; return { html: `Tens ${a} € al compte i pagues una compra de ${m} €. Quin saldo et queda?`, valor: a - m, unitat: '€', op: [a, -m] }; },
  () => { const a = -rnd(1, 4), m = rnd(2, 9); return { html: `Ets al soterrani ${fz(a)} i puges ${m} plantes. A quina planta arribes?`, valor: a + m, unitat: '', op: [a, m] }; }
];
S5.temp = (nv, { n = 2 } = {}) => {
  const fs = barreja(CTX_S).slice(0, n); const items = fs.map(f => ({ tipus: 'enter', llarg: true, ...f() }));
  return {
    sig: `st-${items.map(i => i.op.join('_')).join('-')}`, enunciat: `Problemes de la vida quotidiana. Escriu el resultat amb el seu signe.`, visual: null, pista: { completa: `Escriu primer l'operació: puja, ingressa → <b>+</b>; baixa, paga, deu → <b>−</b>.`, mitja: `Quina operació és?` }, ...apartats(items),
    explicacio: `Converteix la història en una operació d'enters i calcula.`,
    solucio: items.map(it => `${exprPla(it.op)} = <b>${fz(it.valor)}</b>${it.unitat ? ' ' + it.unitat : ''}.`)
  };
};
S5.parent = (nv, { n = 4 } = {}) => {
  const items = []; const vist = new Set();
  const forms = barreja(['--', '+-', '-+', '++']).slice(0, Math.min(n - 1, 3));
  for (const f of forms) {
    let a; do { a = rnd(2, 12); } while (vist.has(a)); vist.add(a);
    const dins = f[1] === '-' ? -a : a, val = f[0] === '-' ? -dins : dins;
    items.push({ tipus: 'enter', html: `${f[0] === '-' ? '−' : '+'}(${fz(dins)})`, valor: val, f });
  }
  const a = (Math.random() < .5 ? -1 : 1) * rnd(1, 9), b = -rnd(2, 9);
  items.push({ tipus: 'enter', html: `${nz(a)} − (${fz(b)})`, valor: a - b, comb: [a, b] });
  return {
    sig: `sp-${items.map(i => i.html).join('|')}`, enunciat: `Treu els parèntesis i calcula.`, visual: null,
    pista: { completa: `Signe de fora × signe de dins: <b>+(+)</b> → +, <b>+(−)</b> → −, <b>−(+)</b> → −, <b>−(−)</b> → +.`, mitja: `−(−) es converteix en +.` }, ...apartats(items),
    explicacio: `−(−a) = +a i −(+a) = −a. El signe de davant del parèntesi canvia o manté el de dins.`,
    solucio: items.map(it => it.comb ? `${it.html}: −(${fz(it.comb[1])}) = ${fz(-it.comb[1])}, i ${nz(it.comb[0])} + ${-it.comb[1]} = <b>${fz(it.valor)}</b>.` : `${it.html} = <b>${fz(it.valor)}</b> (${it.f === '--' ? 'menys per menys, més' : it.f === '++' ? 'més per més, més' : 'signes diferents, menys'}).`)
  };
};
TEMES.e4 = {
  gen: S5, senseCalc: true, signeEscrit: true,
  sequencia: {
    1: [['ascensor', { n: 3 }], ['ops', { n: 3 }], ['ops', { n: 3 }], ['temp', { n: 2 }], ['ascensor', { n: 3 }], ['ops', { n: 3 }], ['error', { n: 2 }], ['ops', { n: 3 }]],
    2: [['ops', { n: 4 }], ['regla'], ['ops', { n: 4, par: true }], ['temp', { n: 2 }], ['error', { n: 3 }], ['ops', { n: 4 }], ['ascensor', { n: 3 }], ['ops', { n: 4, par: true }]],
    3: [['ops', { n: 3, tres: true }], ['parent', { n: 4 }], ['ops', { n: 4, par: true }], ['error', { n: 3 }], ['temp', { n: 3 }], ['ops', { n: 4, tres: true }], ['regla'], ['ops', { n: 4, tres: true }]]
  },
  explicacio: [
    { text: `<p>Sumar i restar enters és com anar amb <b class="parpelleja">ascensor</b>.</p><p>Comencem a la planta baixa, el <b>0</b>. <b style="color:${T}">+5</b> vol dir <b>pujar</b> 5 plantes.</p>`,
      vis: () => edificiSVG({ min: -3, max: 6, pis: 5, de: 0, colors: true }) },
    { text: `<p>Ara <b style="color:${BLAU}">−7</b>: <b>baixem</b> 7 plantes.</p><p>Passem per la <b class="parpelleja">planta baixa</b> i arribem al soterrani <b>−2</b>.</p><p class="petit">5 − 7 = −2</p>`,
      vis: () => edificiSVG({ min: -3, max: 6, pis: -2, de: 5, colors: true, marcaPis: 0 }) },
    { text: `<p><b>Regla 1 · Signes iguals</b>: <b class="parpelleja">sumo</b> i poso el mateix signe.</p><p>−7 − 2 = <b style="color:${BLAU}">−9</b> &nbsp;·&nbsp; +3 + 5 = <b style="color:${T}">+8</b></p><p class="petit">Baixo 7 i baixo 2 més: he baixat 9.</p>`,
      vis: () => `<div class="regla-s"><div><b>−7 − 2</b></div><div>7 + 2 = 9</div><div>signe <b style="color:${BLAU}">−</b></div><div class="res" style="color:${BLAU}">−9</div></div>` },
    { text: `<p><b>Regla 2 · Signes diferents</b>: <b class="parpelleja">resto</b> i poso el signe del número <b>més gran</b>.</p><p>+3 − 8 = <b style="color:${BLAU}">−5</b> &nbsp;·&nbsp; −7 + 9 = <b style="color:${T}">+2</b></p><p class="petit">Pujo 3 i baixo 8: acabo 5 plantes per sota.</p>`,
      vis: () => `<div class="regla-s"><div><b>+3 − 8</b></div><div>8 − 3 = 5</div><div>el més gran és el 8, que porta <b style="color:${BLAU}">−</b></div><div class="res" style="color:${BLAU}">−5</div></div>` },
    { text: `<p><b>Parèntesis</b> <span class="petit">(nivells 2 i 3)</span>: el signe de fora i el de dins es fan <b class="parpelleja">un sol signe</b>.</p><p class="petit">(+7) + (−3) = 7 − 3 = <b>+4</b> &nbsp;·&nbsp; −(−5) = <b>+5</b></p>`,
      vis: () => `<div class="taula-signes"><div>+(+a) = <b>+a</b></div><div>+(−a) = <b>−a</b></div><div>−(+a) = <b>−a</b></div><div>−(−a) = <b style="color:${T}">+a</b></div></div>` }
  ],
  exemple: (nv) => {
    if (nv === 1) return {
      enunciat: `Calcula: <b>−3 + 5</b>`,
      passos: [
        { text: `Començo al soterrani <b>−3</b>.`, vis: edificiSVG({ min: -4, max: 4, pis: -3, colors: true }) },
        { text: `<b>+5</b>: pujo 5 plantes. Passo per la planta baixa.`, vis: edificiSVG({ min: -4, max: 4, pis: 2, de: -3, colors: true, marcaPis: 0 }) },
        { text: `Arribo a la planta <b style="color:${T}">+2</b>. −3 + 5 = +2. <span class="marca-ok">✓</span>`, vis: `<div>${enterGran(2)}</div>` }
      ]
    };
    if (nv === 2) return {
      enunciat: `Calcula: <b>(+7) + (−10)</b>`,
      passos: [
        { text: `Treus els parèntesis: +(−10) és −10. Queda <b>7 − 10</b>.`, vis: `<div class="conj-txt">(+7) + (−10) = 7 − 10</div>` },
        { text: `Signes diferents: resto, <b>10 − 7 = 3</b>.`, vis: `<div class="regla-s"><div><b>7 − 10</b></div><div>10 − 7 = 3</div></div>` },
        { text: `El més gran és el 10, que porta −: <b style="color:${BLAU}">−3</b>. <span class="marca-ok">✓</span>`, vis: `<div>${enterGran(-3)}</div>` }
      ]
    };
    return {
      enunciat: `Calcula: <b>−2 − (−6) + 1</b>`,
      passos: [
        { text: `−(−6): menys per menys, més. Queda <b>−2 + 6 + 1</b>.`, vis: `<div class="conj-txt">−2 − (−6) + 1 = −2 + 6 + 1</div>` },
        { text: `−2 + 6: signes diferents, 6 − 2 = 4, signe + → <b>+4</b>.`, vis: `<div class="conj-txt">−2 + 6 = +4</div>` },
        { text: `+4 + 1 = <b style="color:${T}">+5</b>. <span class="marca-ok">✓</span>`, vis: `<div>${enterGran(5)}</div>` }
      ]
    };
  }
};

/* =====================================================================
   ENTERS · OBJECTIU 6 · MULTIPLICACIÓ I DIVISIÓ (dossier p. 21)
   Mètode del dossier: 1r es multipliquen (o divideixen) els números sense signe;
   2n signe + si són del mateix signe, − si són de signes diferents.
   ===================================================================== */
const pz = v => `(${fz(v)})`;
const sgTxt = v => v < 0 ? '−' : '+';
const filaSg = (a, b) => sgTxt(a) + sgTxt(b);
const SG_FILES = [['++', '+'], ['--', '+'], ['+-', '−'], ['-+', '−']].map(([f, r]) => [f.replace(/-/g, '−'), r]);
const xipSg = s => `<span class="tsg-x ${s === '+' ? 'p' : 'n'}">${s}</span>`;
/* Taula de signes «bufona». mode: 'oberta' | 'plegada'. hl: s'il·lumina la fila de l'apartat on escriu l'alumne (nivell 1) */
function taulaSignesHtml(mode = 'oberta', { hl = false, anim = true, marca = null, toca = false } = {}) {
  const tg = toca ? 'button type="button"' : 'div', tgc = toca ? 'button' : 'div';
  const cos = `<div class="tsg ${anim ? 'anim' : ''}" ${hl ? 'data-hl="1"' : ''}>
    <div class="tsg-cap">${robot(44, 'content')}<div><b>Regla dels signes</b><small>multiplicació · i divisió :</small></div></div>
    <div class="tsg-grup ig"><div class="tsg-tit">Signes <b>iguals</b> → <span class="tsg-x p">+</span></div>
      ${SG_FILES.slice(0, 2).map(([f, r], i) => `<${tg} class="tsg-fila${marca === f ? ' hl' : ''}" data-f="${f}" ${toca ? `data-re-norma="${f}"` : ''} style="--d:${i * .25}s">${xipSg(f[0])}<i>·</i>${xipSg(f[1])}<i>=</i>${xipSg(r)}</${tgc}>`).join('')}</div>
    <div class="tsg-grup df"><div class="tsg-tit">Signes <b>diferents</b> → <span class="tsg-x n">−</span></div>
      ${SG_FILES.slice(2).map(([f, r], i) => `<${tg} class="tsg-fila${marca === f ? ' hl' : ''}" data-f="${f}" ${toca ? `data-re-norma="${f}"` : ''} style="--d:${.5 + i * .25}s">${xipSg(f[0])}<i>·</i>${xipSg(f[1])}<i>=</i>${xipSg(r)}</${tgc}>`).join('')}</div>
    <div class="tsg-peu">Amb la divisió és igual: ${xipSg('−')}<i>:</i>${xipSg('−')}<i>=</i>${xipSg('+')}</div></div>`;
  if (mode === 'plegada') return `<div class="tsg-caixa"><button type="button" class="fx-obre" data-tsg-obre="1">${xipSg('+')}${xipSg('−')} Taula de signes</button><template>${cos}</template></div>`;
  return `<div class="tsg-caixa">${cos}</div>`;
}
// quan es mostra la taula: nivell 1 als 3 primers exercicis oberta i després plegada (sempre a mà); nivell 2 només al primer; nivell 3 i prova, mai
function visTaulaSignes(ctx = {}) {
  if (ctx.prova) return '';
  const nv = ctx.nivell || 1, i = ctx.i || 0;
  if (nv === 1) return taulaSignesHtml(i <= 2 ? 'oberta' : 'plegada', { hl: true, anim: i === 0 });
  if (nv === 2 && i === 0) return taulaSignesHtml('oberta');
  return '';
}
document.addEventListener('click', ev => {
  const b = ev.target.closest?.('[data-tsg-obre]'); if (!b) return;
  const c = b.closest('.tsg-caixa'); const t = $('template', c); if (!t) return;
  c.innerHTML = t.innerHTML; so('pas'); marcaFilaSg(document.activeElement);
});
// il·lumina la fila de la taula que correspon als signes de l'apartat on és l'alumne
function marcaFilaSg(el) {
  const tsg = $('.tsg[data-hl]'); if (!tsg) return;
  $$('.tsg-fila', tsg).forEach(f => f.classList.remove('hl'));
  const inp = el?.closest?.('#zona-resp [data-k]'); if (!inp) return;
  const R = S.ronda; const it = R?.exercicis?.[R.i]?.resposta?.items?.[Number(inp.dataset.k)];
  if (it?.fila) $(`.tsg-fila[data-f="${it.fila.replace(/-/g, '−')}"]`, tsg)?.classList.add('hl');
}
document.addEventListener('focusin', ev => marcaFilaSg(ev.target));

const PISTA_M = { completa: `<b>1r</b> multiplica (o divideix) els números sense signe. <b>2n</b> posa el signe: signes <b>iguals</b> → <b>+</b>; signes <b>diferents</b> → <b>−</b>.`, mitja: `Iguals → +. Diferents → −.` };
const ambSigne = () => Math.random() < .5 ? -1 : 1;
// combinacions de signes barrejades perquè dins d'un exercici surtin totes
const combSg = n => { const c = barreja([[1, 1], [-1, -1], [1, -1], [-1, 1]]); return Array.from({ length: n }, (_, k) => c[k % 4]); };
const opM = (a, b, div) => `${pz(a)} ${div ? ':' : '·'} ${pz(b)}`;
const explicaM = (a, b, div) => { const r = div ? a / b : a * b;
  return `${opM(a, b, div)}: ${Math.abs(a)} ${div ? ':' : '·'} ${Math.abs(b)} = ${Math.abs(r)}; ${Math.sign(a) === Math.sign(b) ? 'signes iguals → +' : 'signes diferents → −'}: <b>${fz(r)}</b>.`; };
function parellaM(nv, sg, div) {
  const L = nv === 1 ? 5 : 10;
  const x = rnd(2, L), y = rnd(nv === 1 ? 2 : 2, L);
  if (!div) return { a: sg[0] * x, b: sg[1] * y, r: sg[0] * x * sg[1] * y };
  return { a: sg[0] * x * y, b: sg[1] * y, r: sg[0] * sg[1] * x }; // divisió sempre exacta
}
const S6 = {};
S6.ops = (nv, { n = 3, mode = 'mix', tres = false } = {}) => {
  const items = []; const vist = new Set(); const sgs = combSg(n);
  for (let k = 0; k < n; k++) {
    let it, g = 0;
    do {
      const div = mode === 'div' ? true : mode === 'mult' ? false : (k % 2 === 1);
      if (tres && k % 2 === 0) {
        const f = [ambSigne() * rnd(2, 5), ambSigne() * rnd(2, 5), ambSigne() * rnd(2, nv === 3 ? 4 : 3)];
        if (k === 0) f[0] = -Math.abs(f[0]);
        const r = f[0] * f[1] * f[2];
        it = { tipus: 'enter', html: f.map(pz).join(' · '), valor: r, f, neg: f.filter(v => v < 0).length };
      } else {
        const { a, b, r } = parellaM(nv, sgs[k], div);
        it = { tipus: 'enter', html: opM(a, b, div), valor: r, a, b, div, fila: filaSg(a, b) };
      }
    } while (vist.has(it.html) && g++ < 80);
    vist.add(it.html); items.push(it);
  }
  return {
    sig: `m6-${items.map(i => i.html).join('|')}`, enunciat: `Calcula. Primer els números i després el signe.`,
    visual: (p, ctx) => visTaulaSignes(ctx), pista: PISTA_M, ...apartats(items),
    explicacio: `1r els números sense signe; 2n el signe: iguals → +, diferents → −.`,
    solucio: items.map(it => it.f ? `${it.html}: ${it.f.map(Math.abs).join(' · ')} = ${Math.abs(it.valor)}; hi ha ${it.neg} ${it.neg === 1 ? 'negatiu' : 'negatius'} (${it.neg % 2 ? 'senar → −' : 'parell → +'}): <b>${fz(it.valor)}</b>.` : explicaM(it.a, it.b, it.div))
  };
};
const OPS_SG = [{ html: '<b style="color:var(--taronja)">+</b> positiu', val: '+' }, { html: '<b style="color:#2a6fd6">−</b> negatiu', val: '-' }];
S6.signe = (nv, { n = 4 } = {}) => {
  const items = []; const vist = new Set(); const sgs = combSg(n);
  for (let k = 0; k < n; k++) {
    let it, g = 0;
    do {
      const nf = nv === 1 ? 2 : nv === 2 ? (k % 2 ? 3 : 2) : (k % 2 ? 4 : 3);
      if (nf === 2) {
        const div = k % 2 === 1 && nv > 1; const x = rnd(11, 39), y = rnd(3, 9);
        const a = sgs[k][0] * (div ? x * y : x), b = sgs[k][1] * y;
        it = { tipus: 'tria', html: `${opM(a, b, div)}`, opcions: OPS_SG, correcta: a * b < 0 ? '-' : '+', fs: [a, b], div, fila: filaSg(a, b) };
      } else {
        const f = Array.from({ length: nf }, () => ambSigne() * rnd(3, 19));
        it = { tipus: 'tria', html: f.map(pz).join(' · '), opcions: OPS_SG, correcta: f.filter(v => v < 0).length % 2 ? '-' : '+', fs: f };
      }
    } while (vist.has(it.html) && g++ < 80);
    vist.add(it.html); items.push(it);
  }
  return {
    sig: `s6-${items.map(i => i.html).join('|')}`, enunciat: `<b>Sense calcular</b>: el resultat serà positiu o negatiu?`,
    visual: (p, ctx) => visTaulaSignes(ctx), pista: { completa: `Només has de mirar els signes. Iguals → +, diferents → −. ${nv > 1 ? 'Si n\'hi ha més de dos, compta els negatius: si en són un nombre <b>parell</b>, +; si <b>senar</b>, −.' : ''}`, mitja: `Mira només els signes.` }, ...apartats(items),
    explicacio: `No cal fer el càlcul: el signe només depèn dels signes dels nombres.`,
    solucio: items.map(it => { const ng = it.fs.filter(v => v < 0).length; return it.fs.length === 2 ? `${it.html}: ${Math.sign(it.fs[0]) === Math.sign(it.fs[1]) ? 'signes iguals → <b>+</b>' : 'signes diferents → <b>−</b>'}.` : `${it.html}: ${ng} ${ng === 1 ? 'negatiu' : 'negatius'}, ${ng % 2 ? 'senar → <b>−</b>' : 'parell → <b>+</b>'}.`; })
  };
};
S6.falta = (nv, { n = 3 } = {}) => {
  const items = []; const vist = new Set(); const sgs = combSg(n);
  for (let k = 0; k < n; k++) {
    let it, g = 0;
    do {
      const L = nv === 1 ? 5 : 10; const x = sgs[k][0] * rnd(2, L), y = sgs[k][1] * rnd(2, L);
      const forma = nv === 1 ? 0 : nv === 2 ? k % 2 : k % 3;
      if (forma === 0) it = { tipus: 'enter', llarg: true, html: `${pz(x)} · <span class="forat">?</span> = ${fz(x * y)}`, valor: y, sol: `${fz(x * y)} : ${pz(x)} = <b>${fz(y)}</b>, perquè ${pz(x)} · ${pz(y)} = ${fz(x * y)}` };
      else if (forma === 1) it = { tipus: 'enter', llarg: true, html: `${pz(x * y)} : <span class="forat">?</span> = ${fz(x)}`, valor: y, sol: `<b>${fz(y)}</b>, perquè ${pz(x * y)} : ${pz(y)} = ${fz(x)}` };
      else it = { tipus: 'enter', llarg: true, html: `<span class="forat">?</span> : ${pz(y)} = ${fz(x)}`, valor: x * y, sol: `${pz(x)} · ${pz(y)} = <b>${fz(x * y)}</b>` };
    } while (vist.has(it.html) && g++ < 80);
    vist.add(it.html); items.push(it);
  }
  return {
    sig: `f6-${items.map(i => i.html).join('|')}`, enunciat: `Quin nombre amaga l'interrogant? Escriu-lo amb el seu signe.`,
    visual: (p, ctx) => visTaulaSignes(ctx), pista: { completa: `Pensa-ho al revés: la divisió desfà la multiplicació. Primer busca el número i després pensa quin signe ha de tenir perquè surti el resultat.`, mitja: `Primer el número, després el signe.` }, ...apartats(items),
    explicacio: `La multiplicació i la divisió són operacions inverses.`,
    solucio: items.map(it => `${it.html.replace(/<span class="forat">\?<\/span>/, '▢')}: ${it.sol}.`)
  };
};
// suma o producte? els mateixos nombres amb les dues operacions, un al costat de l'altre
S6.sumaProd = (nv, { n = 4 } = {}) => {
  const items = []; const vist = new Set();
  const parells = barreja([[-1, -1], [1, -1], [-1, 1], [-1, -1]]).slice(0, Math.ceil(n / 2));
  for (const sg of parells) {
    let a, b, g = 0; do { a = sg[0] * rnd(2, nv === 1 ? 6 : 9); b = sg[1] * rnd(2, nv === 1 ? 6 : 9); } while ((Math.abs(a) === Math.abs(b) || vist.has(a + '_' + b)) && g++ < 60);
    vist.add(a + '_' + b);
    const ps = barreja([{ tipus: 'enter', html: `${pz(a)} + ${pz(b)}`, valor: a + b, a, b, op: '+' }, { tipus: 'enter', html: `${pz(a)} · ${pz(b)}`, valor: a * b, a, b, op: '·', fila: filaSg(a, b) }]);
    items.push(...ps);
  }
  return {
    sig: `p6-${items.map(i => i.html).join('|')}`, enunciat: `<b>Compte!</b> Hi ha sumes i multiplicacions. Mira bé quina operació és cada una.`,
    visual: (p, ctx) => visTaulaSignes(ctx), pista: { completa: `<b>Suma</b>: signes iguals → sumo i poso el mateix signe; diferents → resto. <b>Multiplicació</b>: iguals → +, diferents → −.`, mitja: `La regla de la suma i la del producte són diferents!` }, ...apartats(items.slice(0, n)),
    explicacio: `(−2) + (−3) = −5, però (−2) · (−3) = +6. Cada operació té la seva regla.`,
    solucio: items.slice(0, n).map(it => it.op === '·' ? explicaM(it.a, it.b, false) : `${it.html}: ${regla2(it.a, it.b)}.`)
  };
};
S6.error = (nv, { n = 2 } = {}) => {
  const items = []; const vist = new Set(); const sgs = combSg(n);
  for (let k = 0; k < n; k++) {
    let a, b, div, r, g = 0;
    do { div = nv > 1 && k % 2 === 1; ({ a, b, r } = parellaM(nv, sgs[k], div)); } while (vist.has(a + '_' + b) && g++ < 60);
    vist.add(a + '_' + b);
    const qui = VEINS[(k * 3 + rnd(0, 9)) % VEINS.length][0];
    const mal = [-r, ...(div ? [] : [a + b, -(Math.abs(a) + Math.abs(b))])].filter(x => x !== r);
    const bona = Math.random() < .35; const diu = bona ? r : tria(mal);
    items.push({ tipus: 'tria', html: `${majus(qui)} diu que <b>${opM(a, b, div)} = ${fz(diu)}</b>. Té raó?`, opcions: [{ html: 'Sí', val: 'si' }, { html: 'No', val: 'no' }], correcta: diu === r ? 'si' : 'no', a, b, div, diu, r, llarg: true, fila: filaSg(a, b) });
  }
  return {
    sig: `e6-${items.map(i => `${i.a}_${i.b}_${i.diu}`).join('-')}`, enunciat: `Comprova els càlculs d'aquests companys.`,
    visual: (p, ctx) => visTaulaSignes(ctx), pista: PISTA_M, ...apartats(items),
    explicacio: `Fes tu l'operació i compara. Vigila de no fer servir la regla de la suma!`,
    solucio: items.map(it => `${opM(it.a, it.b, it.div)} = <b>${fz(it.r)}</b>: ${it.diu === it.r ? 'té raó' : `no té raó (diu ${fz(it.diu)})`}.`)
  };
};
const CTX_M = [
  () => { const b = rnd(2, 4), h = rnd(3, 6); return { html: `La temperatura baixa ${b} graus cada hora. Quant haurà variat la temperatura al cap de ${h} hores?`, valor: -b * h, unitat: '°C', op: `${h} · ${pz(-b)}` }; },
  () => { const p = rnd(3, 9), s = rnd(3, 6); return { html: `Cada setmana pagues ${p} € de la quota del gimnàs. Com haurà variat el teu saldo al cap de ${s} setmanes?`, valor: -p * s, unitat: '€', op: `${s} · ${pz(-p)}` }; },
  () => { const m = rnd(2, 6) * 5, t = rnd(2, 5); return { html: `Un submarí surt de la superfície del mar i baixa ${m} metres cada minut. A quina altura és al cap de ${t} minuts?`, valor: -m * t, unitat: 'm', op: `${t} · ${pz(-m)}` }; },
  () => { const c = rnd(3, 8), q = rnd(2, 5); return { html: `Un deute de ${c * q} € es reparteix a parts iguals entre ${q} germans. Quin és el saldo de cada germà?`, valor: -c, unitat: '€', op: `${pz(-c * q)} : ${q}` }; },
  () => { const g = rnd(2, 5), d = rnd(3, 6); return { html: `Durant ${d} dies seguits, la temperatura mínima ha baixat ${g} graus cada dia. Quants graus ha baixat en total? Escriu-ho com a variació (amb signe).`, valor: -g * d, unitat: '°C', op: `${d} · ${pz(-g)}` }; },
  () => { const p = rnd(2, 3), v = rnd(2, 4); return { html: `Un ascensor és a la planta baixa i baixa ${p} plantes ${v} vegades seguides. A quina planta arriba?`, valor: -p * v, unitat: '', op: `${v} · ${pz(-p)}` }; },
  () => { const e = rnd(4, 9), s = rnd(2, 4); return { html: `Tens un deute de ${e * s} € i cada setmana en tornes la mateixa quantitat. Si el tornes tot en ${s} setmanes, quants euros tornes cada setmana? (Escriu-ho com a ingrés, amb signe.)`, valor: e, unitat: '€', op: `${pz(-e * s)} : ${pz(-s)}` }; }
];
S6.context = (nv, { n = 2 } = {}) => {
  const fs = barreja(CTX_M).slice(0, n); const items = fs.map(f => ({ tipus: 'enter', llarg: true, ...f() }));
  return {
    sig: `c6-${items.map(i => i.op).join('|')}`, enunciat: `Situacions amb multiplicacions i divisions. Escriu el resultat amb el seu signe.`,
    visual: (p, ctx) => visTaulaSignes(ctx), pista: { completa: `«Cada… durant… vegades» → <b>multiplicació</b>. «Repartir» → <b>divisió</b>. Baixar, pagar o deure → <b>−</b>.`, mitja: `Multiplicació o divisió?` }, ...apartats(items),
    explicacio: `Converteix la història en una multiplicació o una divisió d'enters.`,
    solucio: items.map(it => `${it.op} = <b>${fz(it.valor)}</b>${it.unitat ? ' ' + it.unitat : ''}.`)
  };
};
TEMES.e5 = {
  gen: S6, senseCalc: true, signeEscrit: true,
  sequencia: {
    1: [['signe', { n: 4 }], ['ops', { n: 3, mode: 'mult' }], ['ops', { n: 3, mode: 'div' }], ['sumaProd', { n: 4 }], ['ops', { n: 3 }], ['error', { n: 2 }], ['context', { n: 2 }], ['ops', { n: 4 }]],
    2: [['ops', { n: 4 }], ['signe', { n: 4 }], ['falta', { n: 3 }], ['sumaProd', { n: 4 }], ['error', { n: 3 }], ['ops', { n: 4 }], ['context', { n: 2 }], ['ops', { n: 4, mode: 'div' }]],
    3: [['signe', { n: 4 }], ['ops', { n: 4, tres: true }], ['falta', { n: 3 }], ['error', { n: 3 }], ['sumaProd', { n: 4 }], ['ops', { n: 4 }], ['context', { n: 3 }], ['ops', { n: 4, tres: true }]]
  },
  explicacio: [
    { text: `<p><b class="parpelleja">Multiplicar</b> és sumar moltes vegades el mateix.</p><p><b>3 · (−2)</b> vol dir sumar el −2 tres vegades:</p><p class="petit">(−2) + (−2) + (−2) = <b style="color:${BLAU}">−6</b></p>`,
      vis: () => rectaZSVG({ min: -7, max: 2, dalt: true, fletxes: [{ de: 0, a: -2, etiq: '−2', col: BLAU, delay: .2 }, { de: -2, a: -4, etiq: '−2', col: BLAU, delay: .8 }, { de: -4, a: -6, etiq: '−2', col: BLAU, delay: 1.4 }], punts: [{ v: -6, col: BLAU, etiq: '−6', anim: 1.9 }], anim: true }) },
    { text: `<p>Per tant, <b>positiu · negatiu = negatiu</b>.</p><p>I l'ordre no importa: <b>(−2) · 3 = 3 · (−2) = −6</b>.</p><p class="petit">Negatiu · positiu també és <b class="parpelleja">negatiu</b>.</p>`,
      vis: () => `<div class="regla-s"><div>${xipSg('+')} <i>·</i> ${xipSg('−')} = ${xipSg('−')}</div><div>${xipSg('−')} <i>·</i> ${xipSg('+')} = ${xipSg('−')}</div></div>` },
    { text: `<p>El signe <b>menys</b> vol dir «<b class="parpelleja">l'oposat</b>»: el −6 és el mirall del +6.</p><p><b>(−2) · (−3)</b>: primer 2 · (−3) = −6, i després en fem el mirall: <b style="color:${T}">+6</b>.</p><p class="petit">Per això <b>negatiu · negatiu = positiu</b>.</p>`,
      vis: () => rectaZSVG({ min: -7, max: 7, labels: 'parells', dalt: true, fletxes: [{ de: -6, a: 6, etiq: 'mirall', col: T, delay: .6 }], punts: [{ v: -6, col: BLAU, etiq: '−6', anim: .1 }, { v: 6, col: T, etiq: '+6', anim: 1.4 }], anim: true }) },
    { text: `<p>Tot junt és la <b>regla dels signes</b>:</p><p><b class="parpelleja">Signes iguals → +</b> &nbsp;·&nbsp; <b>Signes diferents → −</b></p><p class="petit compte-sg"><b>Compte!</b> No és la regla de la suma: (−2) <b>+</b> (−3) = −5, però (−2) <b>·</b> (−3) = <b>+6</b>.</p>`,
      vis: () => taulaSignesHtml('oberta') },
    { text: `<p>La <b>divisió</b> segueix la <b class="parpelleja">mateixa regla</b>.</p><p><b>(−6) : (−3) = +2</b>, perquè (+2) · (−3) = −6.</p><p class="petit">Dividir desfà la multiplicació.</p>`,
      vis: () => `<div class="regla-s"><div><b>(−6) : (−3)</b></div><div>6 : 3 = 2</div><div>signes iguals → <b style="color:${T}">+</b></div><div class="res" style="color:${T}">+2</div></div>` },
    { text: `<p>Com ho fem sempre (com al dossier):</p><p><b>1r</b> multiplica o divideix els <b>números sense signe</b>.</p><p><b>2n</b> posa el <b class="parpelleja">signe</b>: iguals → +, diferents → −.</p>`,
      vis: () => `<div class="regla-s"><div><b>(+5) · (−3)</b></div><div>1r: 5 · 3 = 15</div><div>2n: signes diferents → <b style="color:${BLAU}">−</b></div><div class="res" style="color:${BLAU}">−15</div></div>` }
  ],
  exemple: (nv) => {
    if (nv === 1) return {
      enunciat: `Calcula: <b>(−4) · (+5)</b>`,
      passos: [
        { text: `<b>1r</b> els números sense signe: 4 · 5 = <b>20</b>.`, vis: `<div class="conj-txt">4 · 5 = 20</div>` },
        { text: `<b>2n</b> el signe: − i + són <b>diferents</b> → <b style="color:${BLAU}">−</b>.`, vis: taulaSignesHtml('oberta', { anim: false, marca: '−+' }) },
        { text: `(−4) · (+5) = <b style="color:${BLAU}">−20</b>. <span class="marca-ok">✓</span>`, vis: `<div>${enterGran(-20)}</div>` }
      ]
    };
    if (nv === 2) return {
      enunciat: `Calcula: <b>(−18) : (−3)</b>`,
      passos: [
        { text: `<b>1r</b> els números sense signe: 18 : 3 = <b>6</b>.`, vis: `<div class="conj-txt">18 : 3 = 6</div>` },
        { text: `<b>2n</b> el signe: − i − són <b>iguals</b> → <b style="color:${T}">+</b>.`, vis: `<div class="regla-s"><div>${xipSg('−')} <i>:</i> ${xipSg('−')} = ${xipSg('+')}</div></div>` },
        { text: `(−18) : (−3) = <b style="color:${T}">+6</b>. <span class="marca-ok">✓</span>`, vis: `<div>${enterGran(6)}</div>` }
      ]
    };
    return {
      enunciat: `Calcula: <b>(−2) · (+3) · (−5)</b>`,
      passos: [
        { text: `<b>1r</b> els números sense signe: 2 · 3 · 5 = <b>30</b>.`, vis: `<div class="conj-txt">2 · 3 · 5 = 30</div>` },
        { text: `<b>2n</b> compta els negatius: n'hi ha <b>2</b>, que és un nombre <b>parell</b> → <b style="color:${T}">+</b>.`, vis: `<div class="conj-txt"><span style="color:${BLAU}">(−2)</span> · (+3) · <span style="color:${BLAU}">(−5)</span></div>` },
        { text: `(−2) · (+3) · (−5) = <b style="color:${T}">+30</b>. <span class="marca-ok">✓</span>`, vis: `<div>${enterGran(30)}</div>` }
      ]
    };
  }
};

/* =====================================================================
   ENTERS · OBJECTIU 7 · PROBLEMES DE LA VIDA QUOTIDIANA
   Nivell 1: a) quin enter és la dada · b) quina operació · c) resultat
   Nivell 2: b) + c) · Nivell 3: només el resultat (problemes de dos passos)
   Calculadora permesa: aquí es treballa passar del text a l'operació.
   ===================================================================== */
const PROB = {
  variacio: () => {
    const a = -rnd(2, 9), m = rnd(4, 14); const c = tria(Object.keys(CIUTATS_CAT));
    return { text: `A ${c}, a les 7 del matí el termòmetre marcava <b>${graus(-a)} sota zero</b>. Al migdia, la temperatura <b>ha pujat ${m} graus</b>. Quina temperatura fa al migdia?`,
      dada: [`${graus(-a)} sota zero`, a], op: `${pz(a)} + ${m}`, mal: [`${pz(a)} − ${m}`, `${-a} + ${m}`, `${pz(a)} · ${m}`], valor: a + m, unitat: '°C',
      vis: () => termometreSVG({ v: a, min: -10, max: 10, ample: 210 }) };
  },
  baixa: () => {
    const a = rnd(1, 7), m = rnd(a + 2, a + 10);
    return { text: `A la tarda hi havia <b>${graus(a)} sobre zero</b> i a la nit la temperatura <b>ha baixat ${m} graus</b>. Quina temperatura fa a la nit?`,
      dada: [`ha baixat ${m} graus`, -m], op: `${pz(a)} − ${m}`, mal: [`${pz(a)} + ${m}`, `${m} − ${a}`, `${pz(-a)} − ${m}`], valor: a - m, unitat: '°C',
      vis: () => termometreSVG({ v: a, min: -10, max: 10, ample: 210 }) };
  },
  amplitud: () => {
    const mx = rnd(3, 12), mn = -rnd(2, 9); const c = tria(Object.keys(CIUTATS_CAT));
    return { text: `A ${c}, la temperatura <b>màxima</b> d'avui ha estat de <b>${fzT(mx)}</b> i la <b>mínima</b>, de <b>${fzT(mn)}</b>. Quina ha estat la diferència entre la màxima i la mínima (l'amplitud tèrmica)?`,
      dada: [`la mínima de ${fzT(mn)}`, mn], op: `${pz(mx)} − ${pz(mn)}`, mal: [`${mx} − ${-mn}`, `${pz(mn)} − ${pz(mx)}`, `${pz(mx)} + ${pz(mn)}`], valor: mx - mn, unitat: '°C',
      vis: () => termometreSVG({ v: mx, min: -10, max: 14, ample: 210 }), expl: `Diferència = màxima − mínima. Restar un negatiu és sumar: ${mx} + ${-mn}.` };
  },
  saldo: () => {
    const t = rnd(2, 6) * 5, g = t + rnd(2, 6) * 5, c = rnd(1, 4) * 5;
    return { text: `En Pol té <b>${t} €</b> al compte. Paga una compra de <b>${g} €</b> i després cobra <b>${c} €</b> per fer de cangur. Quin saldo li queda?`,
      dada: [`paga ${g} €`, -g], op: `${t} − ${g} + ${c}`, mal: [`${t} + ${g} + ${c}`, `${t} − ${g} − ${c}`, `${g} − ${t} + ${c}`], valor: t - g + c, unitat: '€',
      vis: () => compteHtml(t, 'Compte d\'en Pol') };
  },
  repeticio: () => {
    const p = rnd(3, 9), s = rnd(3, 6);
    return { text: `La Laia paga <b>${p} €</b> cada setmana per la quota de bàsquet. Com haurà variat el seu saldo al cap de <b>${s} setmanes</b>?`,
      dada: [`paga ${p} €`, -p], op: `${s} · ${pz(-p)}`, mal: [`${s} + ${pz(-p)}`, `${pz(-s)} · ${pz(-p)}`, `${s} − ${p}`], valor: -p * s, unitat: '€',
      vis: () => compteHtml(0, 'Compte de la Laia') };
  },
  submari: () => {
    const m = rnd(2, 8) * 5, t = rnd(2, 5);
    return { text: `Un submarí surt de la superfície del mar (0 m) i <b>baixa ${m} metres cada minut</b>. A quina altura és al cap de <b>${t} minuts</b>?`,
      dada: [`baixa ${m} metres`, -m], op: `${t} · ${pz(-m)}`, mal: [`${t} + ${pz(-m)}`, `${t} · ${m}`, `${pz(-m)} : ${t}`], valor: -m * t, unitat: 'm',
      vis: () => marSVG({ elems: [{ t: 'submari', v: 0 }], maxAbs: 200 }) };
  },
  repartiment: () => {
    const c = rnd(3, 9), q = rnd(2, 5);
    return { text: `Uns amics han organitzat una festa i n'ha quedat un <b>deute de ${c * q} €</b>, que es reparteixen a parts iguals entre <b>${q} persones</b>. Quin és el saldo de cada persona?`,
      dada: [`un deute de ${c * q} €`, -c * q], op: `${pz(-c * q)} : ${q}`, mal: [`${c * q} : ${q}`, `${pz(-c * q)} · ${q}`, `${pz(-c * q)} − ${q}`], valor: -c, unitat: '€',
      vis: () => compteHtml(-c * q, 'Deute de la festa') };
  },
  altitud: () => {
    const a = rnd(3, 12) * 100, s = rnd(2, 9) * 10;
    return { text: `Un avió vola a <b>${a} m sobre el nivell del mar</b> just a sobre d'un submarí que és a <b>${s} m sota el nivell del mar</b>. Quina distància vertical hi ha entre tots dos?`,
      dada: [`${s} m sota el nivell del mar`, -s], op: `${pz(a)} − ${pz(-s)}`, mal: [`${a} − ${s}`, `${pz(-s)} − ${pz(a)}`, `${pz(a)} + ${pz(-s)}`], valor: a + s, unitat: 'm',
      vis: () => marSVG({ elems: [{ t: 'avio', v: a }, { t: 'submari', v: -s }], maxAbs: Math.max(a, s) }), expl: `Diferència = el de dalt − el de baix. Restar un negatiu és sumar.` };
  },
  ascensor: () => {
    const f = -rnd(1, 4), m = rnd(3, 8);
    return { text: `Has aparcat el cotxe al <b>soterrani ${-f}</b> i puges <b>${m} plantes</b> amb l'ascensor. A quina planta arribes?`,
      dada: [`el soterrani ${-f}`, f], op: `${pz(f)} + ${m}`, mal: [`${pz(f)} − ${m}`, `${-f} + ${m}`, `${m} − ${pz(f)}`], valor: f + m, unitat: '',
      vis: () => edificiSVG({ min: -5, max: 6, pis: f, robotOn: false, colors: true }) };
  }
};
// problemes de dos passos (nivell 3): multiplicació/divisió i suma
const PROB2 = {
  temp: () => { const a = -rnd(3, 9), p = rnd(2, 4), h = rnd(3, 5);
    return { text: `A les 6 del matí hi havia <b>${fzT(a)}</b>. Cada hora la temperatura <b>puja ${p} graus</b>. Quina temperatura farà al cap de <b>${h} hores</b>?`, op: `${pz(a)} + ${h} · ${p}`, valor: a + h * p, unitat: '°C', vis: () => termometreSVG({ v: a, min: -10, max: 12, ample: 210 }) }; },
  deute: () => { const d = rnd(3, 6) * 5, e = rnd(2, 5) * 2, s = rnd(2, 5);
    return { text: `En Bilal té un <b>deute de ${d} €</b> amb la seva germana i cada setmana li torna <b>${e} €</b>. Quin saldo tindrà amb ella al cap de <b>${s} setmanes</b>?`, op: `${pz(-d)} + ${s} · ${e}`, valor: -d + s * e, unitat: '€', vis: () => compteHtml(-d, 'Deute d\'en Bilal') }; },
  submari: () => { const a = -rnd(8, 15) * 10, m = rnd(2, 4) * 10, t = rnd(2, 3);
    return { text: `Un submarí és a <b>${-a} m sota el nivell del mar</b> i <b>puja ${m} m cada minut</b>. A quina altura serà al cap de <b>${t} minuts</b>?`, op: `${pz(a)} + ${t} · ${m}`, valor: a + t * m, unitat: 'm', vis: () => marSVG({ elems: [{ t: 'submari', v: a }], maxAbs: 160 }) }; },
  nit: () => { const a = rnd(2, 8), b = rnd(2, 3), h = rnd(3, 5);
    return { text: `A mitjanit hi havia <b>${fzT(a)}</b>. La temperatura <b>baixa ${b} graus cada hora</b>. Quina temperatura farà al cap de <b>${h} hores</b>?`, op: `${pz(a)} − ${h} · ${b}`, valor: a - h * b, unitat: '°C', vis: () => termometreSVG({ v: a, min: -10, max: 10, ample: 210 }) }; },
  compra: () => { const t = rnd(4, 8) * 5, q = rnd(3, 5), p = rnd(4, 9) * 2;
    return { text: `La Mei té <b>${t} €</b> al compte i compra <b>${q} entrades</b> de concert que costen <b>${p} €</b> cadascuna. Quin saldo li queda?`, op: `${t} − ${q} · ${p}`, valor: t - q * p, unitat: '€', vis: () => compteHtml(t, 'Compte de la Mei') }; },
  ascensor: () => { const f = -rnd(2, 4), p = rnd(2, 3), v = rnd(2, 3);
    return { text: `Ets al <b>soterrani ${-f}</b>. L'ascensor <b>puja ${p} plantes</b> cada vegada que el crides i el crides <b>${v} vegades</b>. A quina planta arribes?`, op: `${pz(f)} + ${v} · ${p}`, valor: f + v * p, unitat: '', vis: () => edificiSVG({ min: -5, max: 6, pis: f, robotOn: false, colors: true }) }; }
};
const PISTA_P = { completa: `Paraules com <b>sota, baixa, deu, paga</b> → <b>−</b>. <b>Sobre, puja, té, cobra</b> → <b>+</b>. «Cada… durant…» → multiplicació. «Repartir» → divisió. «Diferència» → el més gran menys el més petit.`, mitja: `Primer passa les dades a enters.` };
const unit = u => u ? ' ' + u : '';
const S7 = {};
S7.prob = (nv, { t } = {}) => {
  const P = PROB[t] ? PROB[t]() : PROB[tria(Object.keys(PROB))]();
  const items = [];
  if (nv === 1) items.push({ tipus: 'enter', llarg: true, html: `Quin enter representa «<b>${P.dada[0]}</b>»?`, valor: P.dada[1], dada: true });
  if (nv <= 2) {
    const ops = barreja([{ html: P.op, val: 'b' }, ...P.mal.slice(0, 3).map((m, i) => ({ html: m, val: 'm' + i }))]);
    items.push({ tipus: 'tria', html: `Quina operació has de fer?`, opcions: ops, correcta: 'b', llarg: true });
  }
  items.push({ tipus: 'enter', llarg: true, html: `Resultat${P.unitat ? ` (en ${P.unitat === '' ? 'plantes' : P.unitat})` : ' (planta)'}:`, valor: P.valor, unitat: P.unitat });
  return {
    sig: `p7-${t}-${P.op}`, enunciat: P.text, visual: P.vis, pista: PISTA_P, ...apartats(items),
    explicacio: P.expl || `Passa les dades a enters, tria l'operació i calcula.`,
    solucio: [`Operació: <b>${P.op}</b> = <b>${fz(P.valor)}</b>${unit(P.unitat)}.`, ...(P.expl ? [P.expl] : [])]
  };
};
S7.dos = (nv, { t } = {}) => {
  const P = PROB2[t] ? PROB2[t]() : PROB2[tria(Object.keys(PROB2))]();
  const items = [{ tipus: 'enter', llarg: true, html: `Resultat${P.unitat ? ` (en ${P.unitat})` : ' (planta)'}:`, valor: P.valor, unitat: P.unitat }];
  return {
    sig: `d7-${t}-${P.op}`, enunciat: P.text, visual: P.vis, pista: { completa: `Són dos passos: primer la <b>multiplicació</b> (quant canvia en total) i després la <b>suma</b> amb el valor del principi.`, mitja: `Primer, quant canvia en total?` }, ...apartats(items),
    explicacio: `Primer calcula quant canvia en total (multiplicació) i després suma-ho al valor inicial.`,
    solucio: [`Operació: <b>${P.op}</b>. Primer la multiplicació i després la suma: <b>${fz(P.valor)}</b>${unit(P.unitat)}.`]
  };
};
S7.freda = (nv) => {
  const ll = tempsCat(6); const mn = Math.min(...ll.map(c => c.t)), mx = Math.max(...ll.map(c => c.t));
  const fr = ll.filter(c => c.t === mn), ca = ll.filter(c => c.t === mx);
  const items = [
    { tipus: 'tria', html: `Quina ciutat ha tingut la temperatura <b>més freda</b>?`, opcions: ll.map(c => ({ html: c.nom, val: c.nom })), correcta: fr[0].nom, llarg: true },
    { tipus: 'enter', llarg: true, html: `Quants graus de diferència hi ha entre la ciutat més calenta (${fzT(mx)}) i la més freda (${fzT(mn)})?`, valor: mx - mn, unitat: '°C' }
  ];
  if (fr.length > 1 || ca.length > 1) return S7.freda(nv);
  return {
    sig: `f7-${ll.map(c => c.nom + c.t).join('|')}`, enunciat: `Observa el mapa del temps d'aquesta matinada.`, visual: () => mapaCatSVG(ll), pista: { completa: `La més freda és la que té el nombre <b>més petit</b> (el negatiu més lluny del 0). La diferència és la més calenta <b>menys</b> la més freda.`, mitja: `Màxima − mínima.` }, ...apartats(items),
    explicacio: `El més fred és el nombre més petit. Diferència = màxim − mínim.`,
    solucio: [`La més freda és ${fr[0].nom} (${fzT(mn)}).`, `${pz(mx)} − ${pz(mn)} = <b>${fz(mx - mn)}</b> °C.`]
  };
};
TEMES.e6 = {
  gen: S7, signeEscrit: true,
  sequencia: {
    1: [['prob', { t: 'variacio' }], ['prob', { t: 'repeticio' }], ['prob', { t: 'ascensor' }], ['prob', { t: 'saldo' }], ['prob', { t: 'baixa' }], ['prob', { t: 'repartiment' }], ['freda'], ['prob', { t: 'submari' }]],
    2: [['prob', { t: 'amplitud' }], ['prob', { t: 'saldo' }], ['prob', { t: 'repeticio' }], ['prob', { t: 'altitud' }], ['prob', { t: 'repartiment' }], ['freda'], ['prob', { t: 'baixa' }], ['prob', { t: 'submari' }]],
    3: [['dos', { t: 'temp' }], ['prob', { t: 'amplitud' }], ['dos', { t: 'deute' }], ['prob', { t: 'altitud' }], ['dos', { t: 'submari' }], ['prob', { t: 'saldo' }], ['dos', { t: 'compra' }], ['dos', { t: tria(['nit', 'ascensor']) }]]
  },
  explicacio: [
    { text: `<p>Per resoldre un problema amb enters, fem <b>3 passos</b>.</p><p><b>1r</b> Llegeix i passa les dades a <b class="parpelleja">enters</b>.</p><p class="petit"><b>sota, baixa, deu, paga</b> → <b style="color:${BLAU}">−</b> &nbsp;·&nbsp; <b>sobre, puja, té, cobra</b> → <b style="color:${T}">+</b></p>`,
      vis: () => `<div class="regla-s"><div>«4 graus <b>sota</b> zero» → <b style="color:${BLAU}">−4</b></div><div>«<b>deu</b> 15 €» → <b style="color:${BLAU}">−15</b></div><div>«<b>puja</b> 6 plantes» → <b style="color:${T}">+6</b></div></div>` },
    { text: `<p><b>2n</b> Tria l'<b class="parpelleja">operació</b>:</p><p class="petit">Puja / baixa, cobra / paga → <b>suma o resta</b>.<br>«Cada… durant…» → <b>multiplicació</b>.<br>«Repartir» → <b>divisió</b>.<br>«Diferència» → el més gran <b>menys</b> el més petit.</p>`,
      vis: () => `<div class="taula-signes" style="grid-template-columns:1fr;font-size:1.25rem"><div>➕ ➖ &nbsp;puja, baixa, cobra, paga</div><div>✖️ &nbsp;cada… durant…</div><div>➗ &nbsp;repartir</div><div>↕️ &nbsp;diferència: gran − petit</div></div>` },
    { text: `<p><b>3r</b> Calcula i escriu el resultat amb el seu <b>signe</b> i la <b class="parpelleja">unitat</b> (°C, €, m…).</p><p class="petit">Compte amb la <b>diferència</b>: entre +8 °C i −3 °C hi ha 8 − (−3) = <b>11</b> graus, no 5.</p>`,
      vis: () => termometreSVG({ v: 8, min: -6, max: 10 }) }
  ],
  exemple: (nv) => {
    if (nv === 1) return {
      enunciat: `A les 7 h hi havia <b>4 graus sota zero</b> i al migdia la temperatura ha pujat <b>9 graus</b>. Quina temperatura fa?`,
      passos: [
        { text: `<b>1r</b> Dades: «4 graus sota zero» → <b style="color:${BLAU}">−4</b>; «ha pujat 9» → <b style="color:${T}">+9</b>.`, vis: termometreSVG({ v: -4, min: -6, max: 8 }) },
        { text: `<b>2n</b> Operació: puja → suma. <b>(−4) + 9</b>.`, vis: `<div class="conj-txt">(−4) + 9</div>` },
        { text: `<b>3r</b> Signes diferents: 9 − 4 = 5, signe del 9 → <b style="color:${T}">+5 °C</b>. <span class="marca-ok">✓</span>`, vis: termometreSVG({ v: 5, min: -6, max: 8 }) }
      ]
    };
    if (nv === 2) return {
      enunciat: `Màxima <b>+7 °C</b>, mínima <b>−5 °C</b>. Quina és la diferència?`,
      passos: [
        { text: `<b>1r</b> Dades: <b style="color:${T}">+7</b> i <b style="color:${BLAU}">−5</b>.`, vis: termometreSVG({ v: 7, min: -6, max: 8 }) },
        { text: `<b>2n</b> Diferència = màxima − mínima: <b>(+7) − (−5)</b>.`, vis: `<div class="conj-txt">(+7) − (−5) = 7 + 5</div>` },
        { text: `<b>3r</b> 7 + 5 = <b style="color:${T}">12 °C</b>. Del −5 al +7 hi ha 12 graus. <span class="marca-ok">✓</span>`, vis: `<div>${enterGran(12)}</div>` }
      ]
    };
    return {
      enunciat: `Hi ha <b>−6 °C</b> i la temperatura puja <b>3 graus cada hora</b>. Quina temperatura farà al cap de <b>4 hores</b>?`,
      passos: [
        { text: `<b>1r</b> Quant puja en total: 4 · 3 = <b>12</b> graus.`, vis: `<div class="conj-txt">4 · 3 = 12</div>` },
        { text: `<b>2n</b> Ho sumo al valor inicial: <b>(−6) + 12</b>.`, vis: `<div class="conj-txt">(−6) + 12</div>` },
        { text: `<b>3r</b> Signes diferents: 12 − 6 = 6 → <b style="color:${T}">+6 °C</b>. <span class="marca-ok">✓</span>`, vis: termometreSVG({ v: 6, min: -8, max: 8 }) }
      ]
    };
  }
};

/* =====================================================================
   ENTERS · OBJECTIU 8 · OPERACIONS COMBINADES (síntesi · dossier p. 20, ex. 7 i 8)
   Agrupar positius i negatius · treure parèntesis · les dues maneres · primer · i :
   ===================================================================== */
const exprT = ts => ts.map((t, i) => i === 0 ? nz(t) : t < 0 ? ` − ${-t}` : ` + ${t}`).join('');
const sumP = ts => ts.filter(t => t > 0).reduce((a, b) => a + b, 0);
const sumN = ts => ts.filter(t => t < 0).reduce((a, b) => a + b, 0);
function termesC(n, L) {
  let ts, g = 0;
  do { ts = Array.from({ length: n }, () => ambSigne() * rnd(1, L)); } while (g++ < 200 && (!ts.some(t => t > 0) || !ts.some(t => t < 0) || Math.abs(ts.reduce((a, b) => a + b, 0)) > 25 || ts.reduce((a, b) => a + b, 0) === 0));
  return ts;
}
const PISTA_8 = { completa: `<b>Agrupa</b>: suma tots els positius, suma tots els negatius i després resta. Un <b>−</b> davant d'un parèntesi <b>canvia tots els signes</b> de dins.`, mitja: `Positius per una banda, negatius per l'altra.` };
const colorT = ts => ts.map((t, i) => `<span style="color:${colZ(t)}">${i === 0 ? nz(t) : (t < 0 ? ' − ' + (-t) : ' + ' + t)}</span>`).join('');
const S8 = {};
S8.agrupa = (nv) => {
  const n = nv === 1 ? 4 : nv === 2 ? 6 : 7, L = nv === 1 ? 9 : 20;
  const ts = termesC(n, L); const P = sumP(ts), N = sumN(ts), r = P + N;
  const items = [
    { tipus: 'enter', llarg: true, html: `Suma de tots els <b style="color:${T}">positius</b>:`, valor: P },
    { tipus: 'enter', llarg: true, html: `Suma de tots els <b style="color:${BLAU}">negatius</b>:`, valor: N },
    { tipus: 'enter', llarg: true, html: `<b>Resultat</b> de ${exprT(ts)}:`, valor: r }
  ];
  return {
    sig: `a8-${exprT(ts)}`, enunciat: `Calcula agrupant els positius i els negatius:<div class="expr-gran">${nv === 1 ? colorT(ts) : exprT(ts)}</div>`, visual: null, pista: PISTA_8, ...apartats(items),
    explicacio: `Sumo els positius, sumo els negatius i els ajunto amb la regla de la suma.`,
    solucio: [`Positius: ${ts.filter(t => t > 0).join(' + ')} = <b>${fz(P)}</b>.`, `Negatius: ${ts.filter(t => t < 0).map(t => -t).join(' + ')} = ${-N} → <b>${fz(N)}</b>.`, `${fz(P)} − ${-N} = <b>${fz(r)}</b>.`]
  };
};
// −(a + b − c): tria com queda sense parèntesi i després calcula
function parentesi(nv) {
  const nd = nv === 1 ? 2 : 3; let dins, g = 0;
  do { dins = Array.from({ length: nd }, (_, i) => i === 0 ? rnd(2, 12) : ambSigne() * rnd(2, 12)); } while (g++ < 50 && !dins.slice(1).some(t => t < 0) && nd > 2);
  const fora = nv === 3 ? ambSigne() * rnd(2, 15) : null; // 3: «a − (…)»
  const ok = dins.map(t => -t);
  const html = `${fora != null ? nz(fora) + ' − ' : '−'}(${exprT(dins)})`;
  const sense = ts => (fora != null ? [fora, ...ts] : ts);
  const fmt = ts => { const s = sense(ts); return s.map((t, i) => i === 0 ? nz(t) : t < 0 ? ` − ${-t}` : ` + ${t}`).join(''); };
  const bona = fmt(ok);
  const m1 = fmt([-dins[0], ...dins.slice(1)]); // només canvia el primer
  const m2 = fmt(dins); // no canvia res
  const m3 = fmt(dins.map(t => -Math.abs(t))); // tot negatiu
  const vistes = new Set([bona]); const dist = [];
  for (const [h, v] of [[m1, 'm1'], [m2, 'm2'], [m3, 'm3']]) if (!vistes.has(h)) { vistes.add(h); dist.push({ html: h, val: v }); }
  const opcions = barreja([{ html: bona, val: 'b' }, ...dist]);
  return { html, bona, opcions, valor: sense(ok).reduce((a, b) => a + b, 0), dins, fora };
}
S8.treu = (nv) => {
  const p = parentesi(nv);
  const items = [
    { tipus: 'tria', html: `Com queda <b>${p.html}</b> sense el parèntesi?`, opcions: p.opcions, correcta: 'b', llarg: true },
    { tipus: 'enter', llarg: true, html: `<b>Resultat</b>:`, valor: p.valor }
  ];
  return {
    sig: `t8-${p.html}`, enunciat: `Treu el parèntesi i calcula:<div class="expr-gran">${p.html}</div>`, visual: null,
    pista: { completa: `Un <b>−</b> davant del parèntesi canvia el signe de <b>tots</b> els termes de dins (també el primer, que no porta signe perquè és +).`, mitja: `El − de davant ho canvia tot.` }, ...apartats(items),
    explicacio: `−(${exprT(p.dins)}) = ${exprT(p.dins.map(t => -t))}: tots els signes de dins canvien.`,
    solucio: [`${p.html} = ${p.bona}`, `= <b>${fz(p.valor)}</b>.`]
  };
};
// dossier p. 20 ex. 8: «opera de les dues maneres»
S8.duesManeres = (nv) => {
  let a, b, c, g = 0; do { a = rnd(3, nv === 1 ? 9 : 15); b = rnd(2, nv === 1 ? 9 : 12); c = rnd(2, nv === 1 ? 9 : 12); } while ((b === c || b - c === 0) && g++ < 50);
  const dins = b - c, r = a - dins; const html = `${a} − (${b} − ${c})`;
  const bona = `${a} − ${b} + ${c}`;
  const items = [
    { tipus: 'enter', llarg: true, html: `<b>Manera 1</b> · primer el parèntesi: ${b} − ${c} =`, valor: dins },
    { tipus: 'enter', llarg: true, html: `<b>Manera 1</b> · ara: ${a} − ${pz(dins)} =`, valor: r },
    { tipus: 'tria', html: `<b>Manera 2</b> · trec el parèntesi. Com queda?`, opcions: barreja([{ html: bona, val: 'b' }, { html: `${a} − ${b} − ${c}`, val: 'm1' }, { html: `${a} + ${b} − ${c}`, val: 'm2' }]), correcta: 'b', llarg: true },
    ...(nv === 1 ? [] : [{ tipus: 'enter', llarg: true, html: `<b>Manera 2</b> · ${bona} =`, valor: r }])
  ];
  return {
    sig: `d8-${html}`, enunciat: `Opera de les <b>dues maneres</b> (com al dossier). Ha de sortir el mateix!<div class="expr-gran">${html}</div>`, visual: null,
    pista: { completa: `Manera 1: primer el que hi ha dins del parèntesi. Manera 2: el <b>−</b> de davant canvia tots els signes de dins.`, mitja: `Les dues maneres donen el mateix resultat.` }, ...apartats(items),
    explicacio: `Les dues maneres donen el mateix resultat: ${fz(r)}.`,
    solucio: [`Manera 1: ${b} − ${c} = ${fz(dins)}; ${a} − ${pz(dins)} = <b>${fz(r)}</b>.`, `Manera 2: ${html} = ${bona} = <b>${fz(r)}</b>.`]
  };
};
// primer les multiplicacions i divisions
S8.jerarquia = (nv) => {
  let html, r, primer, ops, sol, g = 0;
  do {
    if (nv === 3 && Math.random() < .5) {
      const x = rnd(2, 5), d = ambSigne() * rnd(2, 5), y = rnd(2, 5), z = ambSigne() * rnd(2, 6);
      const A = d * x * (Math.random() < .5 ? 1 : -1);
      html = `${pz(A)} : ${x} − ${y} · ${pz(z)}`; r = A / x - y * z; primer = 'b';
      ops = [{ html: `${pz(A)} : ${x} i ${y} · ${pz(z)}`, val: 'b' }, { html: `${x} − ${y}`, val: 'm1' }, { html: `D'esquerra a dreta, tot seguit`, val: 'm2' }];
      sol = `${pz(A)} : ${x} = ${fz(A / x)} i ${y} · ${pz(z)} = ${fz(y * z)}; ${fz(A / x)} − ${pz(y * z)} = <b>${fz(r)}</b>.`;
    } else {
      const a = ambSigne() * rnd(2, 12), b = rnd(2, 6), c = ambSigne() * rnd(2, 6); const res = Math.random() < .5;
      html = `${nz(a)} ${res ? '−' : '+'} ${b} · ${pz(c)}`; r = res ? a - b * c : a + b * c;
      ops = [{ html: `${b} · ${pz(c)}`, val: 'b' }, { html: `${nz(a)} ${res ? '−' : '+'} ${b}`, val: 'm1' }];
      sol = `Primer ${b} · ${pz(c)} = ${fz(b * c)}; després ${nz(a)} ${res ? '−' : '+'} ${pz(b * c)} = <b>${fz(r)}</b>.`;
    }
  } while (Math.abs(r) > 40 && g++ < 50);
  const items = [{ tipus: 'tria', html: `Què has de fer <b>primer</b>?`, opcions: barreja(ops), correcta: 'b', llarg: true }, { tipus: 'enter', llarg: true, html: `<b>Resultat</b>:`, valor: r }];
  return {
    sig: `j8-${html}`, enunciat: `Calcula. Recorda l'ordre de les operacions.<div class="expr-gran">${html}</div>`, visual: null,
    pista: { completa: `Primer els <b>parèntesis</b>, després les <b>multiplicacions i divisions</b> i al final les <b>sumes i restes</b>.`, mitja: `Primer · i :` }, ...apartats(items),
    explicacio: `Primer multiplicacions i divisions, després sumes i restes.`, solucio: [sol]
  };
};
// pas a pas, com el dossier p. 20 ex. 8 f): −4 − (4 + 5) − (8 − 9) + 1 + 6
S8.pasapas = (nv) => {
  let a, p1, p2, e, g = 0, r;
  do {
    a = ambSigne() * rnd(1, 9); p1 = [rnd(1, 9), ambSigne() * rnd(1, 9)]; p2 = [rnd(1, 9), ambSigne() * rnd(1, 9)]; e = Array.from({ length: nv === 3 ? 2 : 1 }, () => ambSigne() * rnd(1, 9));
    r = a - (p1[0] + p1[1]) - (p2[0] + p2[1]) + e.reduce((x, y) => x + y, 0);
  } while ((Math.abs(r) > 25 || p1[0] + p1[1] === 0 || p2[0] + p2[1] === 0) && g++ < 80);
  const s1 = p1[0] + p1[1], s2 = p2[0] + p2[1];
  const html = `${nz(a)} − (${exprT(p1)}) − (${exprT(p2)})${e.map(t => t < 0 ? ` − ${-t}` : ` + ${t}`).join('')}`;
  const mig = `${nz(a)} − ${pz(s1)} − ${pz(s2)}${e.map(t => t < 0 ? ` − ${-t}` : ` + ${t}`).join('')}`;
  const items = [
    { tipus: 'enter', llarg: true, html: `Primer parèntesi: ${exprT(p1)} =`, valor: s1 },
    { tipus: 'enter', llarg: true, html: `Segon parèntesi: ${exprT(p2)} =`, valor: s2 },
    { tipus: 'enter', llarg: true, html: `Ara: ${mig} =`, valor: r }
  ];
  return {
    sig: `q8-${html}`, enunciat: `Calcula pas a pas:<div class="expr-gran">${html}</div>`, visual: null,
    pista: { completa: `Primer resol cada parèntesi. Després, un <b>−</b> davant d'un nombre negatiu es converteix en <b>+</b>: −(−1) = +1.`, mitja: `Primer els parèntesis.` }, ...apartats(items),
    explicacio: `Resol els parèntesis i després agrupa.`,
    solucio: [`${exprT(p1)} = ${fz(s1)} i ${exprT(p2)} = ${fz(s2)}.`, `${mig} = <b>${fz(r)}</b>.`]
  };
};
// on és l'error? una resolució de 3 passos amb un pas equivocat
S8.error = (nv) => {
  let a, b, c, d, g = 0, r;
  do { a = ambSigne() * rnd(2, 12); b = rnd(2, 12); c = ambSigne() * rnd(2, 12); d = ambSigne() * rnd(2, 12); r = a - b - c + d; } while ((Math.abs(r) > 25 || c > 0 && Math.random() < .5) && g++ < 80);
  // a − (b + c) + d   ·   pas 1: treure parèntesi · pas 2: agrupar · pas 3: resultat
  const html = `${nz(a)} − (${exprT([b, c])})${d < 0 ? ' − ' + (-d) : ' + ' + d}`;
  const ts = [a, -b, -c, d]; const P = sumP(ts), N = sumN(ts);
  const malPas = nv === 1 ? tria([1, 3]) : tria([1, 2, 3]);
  const tsMal = [a, -b, c, d]; // pas 1 mal fet: el − no canvia el signe del segon terme
  const t1 = malPas === 1 ? tsMal : ts;
  let P2 = sumP(t1), N2 = sumN(t1);
  if (malPas === 2) P2 += tria([2, -2, 1, -1]); // pas 2 mal fet: s'equivoca sumant els positius
  const r3 = malPas === 3 ? (r !== 0 ? -r : 2) : P2 + N2; // pas 3 mal fet: s'equivoca de signe
  const passos = [`= ${exprT(t1)}`, `= ${fz(P2)} − ${-N2}`, `= ${fz(r3)}`];
  const items = [
    { tipus: 'tria', html: `En quin pas hi ha l'error?`, opcions: [{ html: 'Pas 1', val: '1' }, { html: 'Pas 2', val: '2' }, { html: 'Pas 3', val: '3' }], correcta: String(malPas) },
    { tipus: 'enter', llarg: true, html: `Quin és el <b>resultat correcte</b>?`, valor: r }
  ];
  const quiN = VEINS[rnd(0, VEINS.length - 1)][0];
  return {
    sig: `r8-${html}-${malPas}`, enunciat: `${majus(quiN)} ha resolt aquesta operació, però s'ha equivocat en un pas:<div class="resol-pas"><div class="rp-0">${html}</div>${passos.map((p, i) => `<div><b>Pas ${i + 1}</b> ${p}</div>`).join('')}</div>`, visual: null,
    pista: { completa: `Pas 1: el − de davant del parèntesi canvia <b>tots</b> els signes. Pas 2: positius per una banda i negatius per l'altra. Pas 3: la regla de la suma.`, mitja: `Revisa cada pas, un per un.` }, ...apartats(items),
    explicacio: `Revisa els passos un per un: treure el parèntesi, agrupar i calcular.`,
    solucio: [`Correcte: ${html} = ${exprT(ts)} = ${fz(P)} − ${-N} = <b>${fz(r)}</b>.`, `L'error és al <b>pas ${malPas}</b>.`]
  };
};
S8.ops = (nv, { n = 3 } = {}) => {
  const items = []; const vist = new Set();
  for (let k = 0; k < n; k++) {
    let it, g = 0;
    do {
      const tipus = (k + rnd(0, 2)) % 3;
      if (tipus === 0) { const ts = termesC(nv === 1 ? 3 : 4, nv === 1 ? 9 : 15); it = { tipus: 'enter', html: exprT(ts), valor: ts.reduce((a, b) => a + b, 0) }; }
      else if (tipus === 1) { const p = parentesi(Math.min(nv, 2)); it = { tipus: 'enter', html: p.html, valor: p.valor }; }
      else { const a = ambSigne() * rnd(2, 9), b = rnd(2, 5), c = ambSigne() * rnd(2, 5); it = nv === 1 ? { tipus: 'enter', html: `${nz(a)} + ${pz(-b)} − ${pz(c)}`, valor: a - b - c } : { tipus: 'enter', html: `${nz(a)} − ${b} · ${pz(c)}`, valor: a - b * c }; }
    } while ((vist.has(it.html) || Math.abs(it.valor) > 40) && g++ < 80);
    vist.add(it.html); items.push(it);
  }
  return {
    sig: `o8-${items.map(i => i.html).join('|')}`, enunciat: `Calcula.`, visual: null, pista: PISTA_8, ...apartats(items),
    explicacio: `Parèntesis, després · i :, i al final agrupa positius i negatius.`,
    solucio: items.map(it => `${it.html} = <b>${fz(it.valor)}</b>.`)
  };
};
TEMES.e7 = {
  gen: S8, senseCalc: true, signeEscrit: true,
  sequencia: {
    1: [['agrupa'], ['treu'], ['ops', { n: 3 }], ['agrupa'], ['duesManeres'], ['treu'], ['error'], ['ops', { n: 3 }]],
    2: [['agrupa'], ['treu'], ['duesManeres'], ['jerarquia'], ['pasapas'], ['error'], ['ops', { n: 3 }], ['treu']],
    3: [['agrupa'], ['pasapas'], ['jerarquia'], ['duesManeres'], ['error'], ['treu'], ['ops', { n: 4 }], ['pasapas']]
  },
  explicacio: [
    { text: `<p>Operacions llargues amb sumes i restes: <b class="parpelleja">agrupa</b>.</p><p><b>1r</b> suma tots els <b style="color:${T}">positius</b>. <b>2n</b> suma tots els <b style="color:${BLAU}">negatius</b>. <b>3r</b> ajunta'ls.</p>`,
      vis: () => `<div class="regla-s"><div class="expr-gran" style="margin:0">${colorT([5, -7, 19, -20, 4, -3, 10])}</div><div>positius: 5 + 19 + 4 + 10 = <b style="color:${T}">+38</b></div><div>negatius: 7 + 20 + 3 = 30 → <b style="color:${BLAU}">−30</b></div><div class="res" style="color:${T}">+38 − 30 = +8</div></div>` },
    { text: `<p>Un <b>−</b> davant d'un parèntesi <b class="parpelleja">canvia tots els signes</b> de dins.</p><p><b>−(8 + 9 − 11)</b> = −8 − 9 + 11 = <b style="color:${BLAU}">−6</b></p><p class="petit">Un + davant del parèntesi no canvia res.</p>`,
      vis: () => `<div class="regla-s"><div><b>−(8 + 9 − 11)</b></div><div>= <span style="color:${BLAU}">−8 − 9</span> <span style="color:${T}">+ 11</span></div><div class="res" style="color:${BLAU}">−6</div></div>` },
    { text: `<p>Amb parèntesis es pot fer de <b class="parpelleja">dues maneres</b> i surt el mateix:</p><p><b>8 − (4 − 7)</b></p><p class="petit">1) Primer el parèntesi: 8 − (−3) = 8 + 3 = <b>+11</b><br>2) Trec el parèntesi: 8 − 4 + 7 = <b>+11</b></p>`,
      vis: () => `<div class="taula-signes" style="grid-template-columns:1fr;font-size:1.3rem"><div><b>Manera 1</b>: 4 − 7 = −3 → 8 − (−3) = <b style="color:${T}">+11</b></div><div><b>Manera 2</b>: 8 − 4 + 7 = <b style="color:${T}">+11</b></div></div>` },
    { text: `<p>Si hi ha multiplicacions o divisions, <b class="parpelleja">van primer</b>.</p><p class="petit">Ordre: <b>1r</b> parèntesis · <b>2n</b> multiplicacions i divisions · <b>3r</b> sumes i restes.</p><p><b>5 − 3 · (−2)</b> = 5 − (−6) = 5 + 6 = <b style="color:${T}">+11</b></p>`,
      vis: () => `<div class="regla-s"><div><b>5 − 3 · (−2)</b></div><div>3 · (−2) = −6</div><div>5 − (−6) = 5 + 6</div><div class="res" style="color:${T}">+11</div></div>` }
  ],
  exemple: (nv) => {
    if (nv === 1) return {
      enunciat: `Calcula: <b>7 − 9 + 4 − 6</b>`,
      passos: [
        { text: `Positius: 7 + 4 = <b style="color:${T}">+11</b>.`, vis: `<div class="expr-gran">${colorT([7, -9, 4, -6])}</div>` },
        { text: `Negatius: 9 + 6 = 15 → <b style="color:${BLAU}">−15</b>.`, vis: `<div class="conj-txt">+11 − 15</div>` },
        { text: `Signes diferents: 15 − 11 = 4, signe del 15 → <b style="color:${BLAU}">−4</b>. <span class="marca-ok">✓</span>`, vis: `<div>${enterGran(-4)}</div>` }
      ]
    };
    if (nv === 2) return {
      enunciat: `Calcula: <b>6 − (2 − 9) − 5</b>`,
      passos: [
        { text: `Trec el parèntesi: el − canvia els signes → <b>6 − 2 + 9 − 5</b>.`, vis: `<div class="conj-txt">6 − (2 − 9) − 5 = 6 − 2 + 9 − 5</div>` },
        { text: `Positius: 6 + 9 = 15. Negatius: 2 + 5 = 7 → −7.`, vis: `<div class="conj-txt">+15 − 7</div>` },
        { text: `15 − 7 = <b style="color:${T}">+8</b>. <span class="marca-ok">✓</span>`, vis: `<div>${enterGran(8)}</div>` }
      ]
    };
    return {
      enunciat: `Calcula: <b>−4 − (4 + 5) − (8 − 9) + 6</b>`,
      passos: [
        { text: `Primer els parèntesis: 4 + 5 = 9 i 8 − 9 = −1.`, vis: `<div class="conj-txt">−4 − (+9) − (−1) + 6</div>` },
        { text: `Trec els parèntesis: −(+9) = −9 i −(−1) = +1 → <b>−4 − 9 + 1 + 6</b>.`, vis: `<div class="expr-gran">${colorT([-4, -9, 1, 6])}</div>` },
        { text: `Positius 7, negatius −13: 7 − 13 = <b style="color:${BLAU}">−6</b>. <span class="marca-ok">✓</span>`, vis: `<div>${enterGran(-6)}</div>` }
      ]
    };
  }
};
/* =====================================================================
   TALLER DE REFORÇ · REPÀS D'OPERACIONS AMB ENTERS (no compta per a la nota)
   4 estacions × 5 exercicis. Nivell 1: molt guiat (4 passos, fitxes i grups dibuixats).
   Nivell 2: norma + resultat. Nivell 3: només el resultat, números més grans i tres termes.
   Desa a resultats/{alumne}/tre = { est: { s1: { fets, primera, errSigne, errNum, acabada } … }, estat, darrer, vegades }
   ===================================================================== */
const EST_RE = [
  { k: 's1', ic: '➕', titol: 'Sumes i restes', curt: 'Sumes' },
  { k: 's2', ic: '✖️', titol: 'Multiplicacions i divisions', curt: 'Mult. i div.' },
  { k: 's3', ic: '🔀', titol: 'Barreja', curt: 'Barreja' },
  { k: 's4', ic: '🏆', titol: 'Repte final', curt: 'Repte' }
];
const EX_EST = 5;
let RE = null;
const NORMA_S = [
  { f: 'ig', t: `Signes <b>iguals</b> → <b>sumo</b> i poso el mateix signe`, ex: `(−3) + (−4) = −7` },
  { f: 'df', t: `Signes <b>diferents</b> → <b>resto</b> (gran − petit) i poso el signe del <b>més gran</b>`, ex: `(−7) + (+3) = −4` }
];
// targeta de la norma de la suma (les files es poden tocar quan és un pas del nivell 1 i 2)
const normaSumaHtml = (toca = false, marca = null) => `<div class="re-norma ${toca ? 'toca' : ''}"><div class="re-norma-cap">➕➖ <b>Norma de la suma i la resta</b></div>
  ${NORMA_S.map(n => `<${toca ? 'button type="button"' : 'div'} class="re-nf ${marca === n.f ? 'hl' : ''}" data-re-norma="${n.f}"><span>${n.t}</span><small>${n.ex}</small></${toca ? 'button' : 'div'}>`).join('')}
  <div class="re-norma-peu">Un − davant d'un parèntesi canvia el signe: −(−3) = +3 · −(+3) = −3</div></div>`;
const normaProdHtml = (toca = false, marca = null) => taulaSignesHtml('oberta', { anim: false, marca, toca });
/* ---------- generadors ---------- */
const sgN = v => v < 0 ? -1 : 1;
function reSuma(nv) {
  const L = nv === 1 ? 9 : nv === 2 ? 15 : 30;
  let a, b, g = 0; do { a = ambSigne() * rnd(1, L); b = ambSigne() * rnd(1, L); } while ((Math.abs(a) === Math.abs(b) || (nv === 1 && Math.abs(a + b) > 9)) && g++ < 60);
  const par = nv >= 2 && Math.random() < .5;
  // amb parèntesi: (a) − (c), on b = −c
  const html = par ? (Math.random() < .5 ? `${pz(a)} − ${pz(-b)}` : `${pz(a)} + ${pz(b)}`) : (nv === 1 && Math.random() < .35 ? `${pz(a)} + ${pz(b)}` : exprPla([a, b]));
  return { k: 's', html, a, b, valor: a + b, norma: Math.sign(a) === Math.sign(b) ? 'ig' : 'df', mag: Math.sign(a) === Math.sign(b) ? Math.abs(a) + Math.abs(b) : Math.abs(Math.abs(a) - Math.abs(b)), par };
}
function reProd(nv) {
  const L = nv === 1 ? 5 : nv === 2 ? 10 : 12; const div = Math.random() < (nv === 1 ? .3 : .45);
  const x = rnd(2, L), y = rnd(2, L), s1 = ambSigne(), s2 = ambSigne();
  const a = div ? s1 * x * y : s1 * x, b = s2 * y;
  const r = div ? a / b : a * b;
  return { k: 'p', html: opM(a, b, div), a, b, div, valor: r, norma: (a < 0 ? '−' : '+') + (b < 0 ? '−' : '+'), mag: Math.abs(r), op: div ? ':' : '·' };
}
function reLlarg(nv) {
  const t = rnd(0, nv === 3 ? 3 : 1);
  if (t === 0) { const ts = termesC(nv === 3 ? 4 : 3, nv === 3 ? 15 : 9); return { k: 'c', html: exprT(ts), valor: ts.reduce((x, y) => x + y, 0), pista: 'Agrupa: suma els positius, suma els negatius i ajunta\'ls.' }; }
  if (t === 1) { const a = ambSigne() * rnd(2, 12), b = rnd(2, 6), c = ambSigne() * rnd(2, 6); const res = Math.random() < .5;
    return { k: 'c', html: `${nz(a)} ${res ? '−' : '+'} ${b} · ${pz(c)}`, valor: res ? a - b * c : a + b * c, pista: 'Primer la multiplicació, després la suma o la resta.' }; }
  if (t === 2) { const p = parentesi(3); return { k: 'c', html: p.html, valor: p.valor, pista: 'El − de davant del parèntesi canvia tots els signes de dins.' }; }
  const d = rnd(2, 5), q = ambSigne() * rnd(2, 6), c = ambSigne() * rnd(2, 15);
  return { k: 'c', html: `${pz(q * d)} : ${pz(d)} ${c < 0 ? '−' : '+'} ${Math.abs(c)}`, valor: q + c, pista: 'Primer la divisió, després la suma o la resta.' };
}
function genRE(est, nv, i) {
  if (est === 's1') return nv === 3 && i >= 3 ? reLlarg(2) : reSuma(nv);
  if (est === 's2') { if (nv === 3 && i >= 3) { const f = [ambSigne() * rnd(2, 5), ambSigne() * rnd(2, 5), ambSigne() * rnd(2, 4)]; return { k: 'c', html: f.map(pz).join(' · '), valor: f[0] * f[1] * f[2], pista: 'Compta els negatius: parell → +, senar → −.' }; } return reProd(nv); }
  if (est === 's3') return i % 2 === 0 ? reSuma(nv) : reProd(nv);
  return nv === 1 ? (i % 2 ? reProd(1) : reSuma(1)) : reLlarg(nv);
}
// quins passos té un exercici
function passosRE(ex, nv, est) {
  if (ex.k === 'c' || nv === 3) return ['res'];
  if (nv === 2 || est === 's4') return ['norma', 'res'];
  return ['signes', 'norma', 'mag', 'res'];
}
/* ---------- dibuixos del nivell 1 ---------- */
// grups de fitxes per a la multiplicació: |a| grups de |b|; el color apareix quan ja se sap el signe
function grupsSVG(ex, color) {
  const n = Math.abs(ex.div ? ex.valor : ex.a), m = Math.abs(ex.b);
  if (ex.div || n > 5 || m > 5) return '';
  const col = !color ? '#cfcac2' : ex.valor < 0 ? '#2a6fd6' : 'var(--taronja)';
  const W = 56, gw = m * 22 + 14; let s = '';
  for (let g = 0; g < n; g++) { const x0 = 10 + g * (gw + 12); s += `<rect x="${x0}" y="8" width="${gw}" height="40" rx="12" fill="#fff" stroke="#1b1b1b" stroke-width="2"/>`;
    for (let k = 0; k < m; k++) s += `<circle cx="${x0 + 18 + k * 22}" cy="28" r="9" fill="${col}" stroke="#1b1b1b" stroke-width="1.5" class="pop" style="animation-delay:${(g * m + k) * .04}s"/>`; }
  const w = 20 + n * (gw + 12);
  return `<div class="re-grups"><svg viewBox="0 0 ${w} 56" width="${Math.min(520, w)}">${s}</svg><small>${n} ${n === 1 ? 'grup' : 'grups'} de ${m} ${color ? (ex.valor < 0 ? '· negatiu' : '· positiu') : ''}</small></div>`;
}
/* ---------- estat i desament ---------- */
const reRes = () => (S.alumne && S.resMeu?.tre) || {};
async function desaRE(estK, canvi) {
  if (!S.alumne) return;
  const r = reRes(); const e = { fets: 0, primera: 0, errSigne: 0, errNum: 0, ...(r.est?.[estK] || {}) };
  for (const [k, v] of Object.entries(canvi)) e[k] = k === 'acabada' ? v : (e[k] || 0) + v;
  const est = { ...(r.est || {}), [estK]: e };
  const totes = EST_RE.every(x => est[x.k]?.acabada);
  const upd = { est, darrer: Date.now(), estat: totes ? 'fet' : 'proces' };
  if (totes && r.estat !== 'fet') upd.vegades = (r.vegades || 0) + 1;
  S.resMeu = S.resMeu || {}; S.resMeu.tre = { ...r, ...upd };
  try { await DB.update(`${ARREL}/resultats/${S.alumne}/tre`, upd); } catch (er) { console.error(er); }
  marcaDiaTaller(S.alumne, 'tre', !!canvi.acabada || totes);
}
function obreRepas(nivell = null) {
  tancaJoc(true);
  RE = { pantalla: 'menu', nivell: nivell || (S.alumne ? nivellBase(S.alumne) : 1), prova: !S.alumne };
  document.body.insertAdjacentHTML('beforeend', `<div id="joc-capa" class="re-capa"><div id="re"></div></div>`);
  pintaRE();
}
function tancaRepas() { RE = null; $('#joc-capa')?.remove(); document.removeEventListener('keydown', teclaRE); if (S.alumne) mostra('mapa'); }
function comencaEst(k) {
  RE.est = k; RE.i = 0; RE.pantalla = 'recorda'; RE.vist = new Set(); RE.sessio = { primera: 0 }; pintaRE();
}
function nouExRE() {
  let ex, g = 0; do { ex = genRE(RE.est, RE.nivell, RE.i); } while (RE.vist.has(ex.html) && g++ < 50);
  RE.vist.add(ex.html); RE.ex = ex; RE.passos = passosRE(ex, RE.nivell, RE.est); RE.p = 0; RE.intents = 0; RE.errEx = 0; RE.msg = ''; RE.fet = false;
  RE.pantalla = 'ex'; pintaRE();
}
/* ---------- pantalles ---------- */
function capRE(extra = '') {
  return `<div class="re-cap"><span class="re-tit">🔁 Repàs d'operacions amb enters</span>${extra}<span class="re-niv">Nivell ${RE.nivell}${RE.prova ? ' · mode professor (no es desa)' : ''}</span><button class="boto-petit" id="re-surt">✕ Surt</button></div>`;
}
function pintaRE() {
  const c = $('#re'); if (!c || !RE) return;
  if (RE.pantalla === 'menu') {
    const r = reRes();
    c.innerHTML = `${capRE()}<div class="re-menu">${robot(110, 'content', true)}<div class="re-menu-cos"><h2>Tria una estació</h2>
      <p class="ajuda">Cada estació té ${EX_EST} exercicis. Abans de començar, en FR-4C et recorda la norma. ${RE.nivell === 1 ? 'Ho farem <b>pas a pas</b>.' : RE.nivell === 2 ? 'Primer triaràs la norma i després el resultat.' : 'Directament el resultat: tu pots!'}</p>
      ${RE.prova ? `<div class="fila-form" style="margin:6px 0 12px"><b>Nivell:</b><span class="segment petit" id="re-nv">${[1, 2, 3].map(n => `<button data-n="${n}" class="${RE.nivell === n ? 'activa' : ''}">${n}</button>`).join('')}</span></div>` : ''}
      <div class="re-estacions">${EST_RE.map((e, i) => { const x = r.est?.[e.k];
        return `<button class="re-est ${x?.acabada ? 'feta' : ''}" data-est="${e.k}"><span class="re-est-ic">${e.ic}</span><b>${i + 1}. ${e.titol}</b><small>${x?.acabada ? `✓ Feta · ${x.primera || 0} a la primera` : x?.fets ? 'En curs' : 'Per fer'}</small></button>`; }).join('')}</div></div></div>`;
    $$('[data-est]', c).forEach(b => b.onclick = () => { so('pas'); comencaEst(b.dataset.est); });
    $$('#re-nv button', c).forEach(b => b.onclick = () => { RE.nivell = Number(b.dataset.n); pintaRE(); });
  } else if (RE.pantalla === 'recorda') {
    const e = EST_RE.find(x => x.k === RE.est);
    const sum = RE.est !== 's2', prod = RE.est !== 's1';
    c.innerHTML = `${capRE(`<span class="re-est-nom">${e.ic} ${e.titol}</span>`)}<div class="re-recorda"><div class="re-rec-txt">${robot(100, 'content')}<div><h2>Recorda!</h2>
      <p>${sum && prod ? 'Mira bé si és una <b>suma</b> o una <b>multiplicació</b>: cada operació té la seva norma.' : sum ? 'Per sumar i restar enters, mira si els signes són <b>iguals</b> o <b>diferents</b>.' : 'Per multiplicar i dividir: primer els <b>números</b> i després el <b>signe</b>.'}</p>
      ${RE.est === 's4' && RE.nivell > 1 ? `<p class="petit">Ordre de les operacions: <b>1r</b> parèntesis · <b>2n</b> multiplicacions i divisions · <b>3r</b> sumes i restes.</p>` : ''}</div></div>
      <div class="re-rec-normes">${sum ? normaSumaHtml() : ''}${prod ? normaProdHtml() : ''}</div>
      <div class="accions"><button class="boto sec" id="re-menu">← Estacions</button><button class="boto taronja" id="re-go">Som-hi! →</button></div></div>`;
    $('#re-menu').onclick = () => { RE.pantalla = 'menu'; pintaRE(); };
    $('#re-go').onclick = () => nouExRE();
  } else if (RE.pantalla === 'ex') pintaExRE(c);
  else if (RE.pantalla === 'fiEst') {
    const e = EST_RE.find(x => x.k === RE.est); const tot = EST_RE.every(x => reRes().est?.[x.k]?.acabada);
    c.innerHTML = `${capRE(`<span class="re-est-nom">${e.ic} ${e.titol}</span>`)}<div class="re-menu">${robot(130, 'content', true)}<div class="re-menu-cos"><h2>${tot ? 'Has acabat totes les estacions! 🏆' : 'Estació acabada!'}</h2>
      <p style="font-size:1.25rem">Has fet els ${EX_EST} exercicis i <b>${RE.sessio.primera}</b> ${RE.sessio.primera === 1 ? 'l\'has encertat' : 'els has encertat'} a la primera.</p>
      <div class="accions"><button class="boto sec" id="re-menu">← Estacions</button>${!tot ? `<button class="boto taronja" id="re-seg">Següent estació →</button>` : `<button class="boto taronja" id="re-fi">Torna al mapa</button>`}</div></div></div>`;
    $('#re-menu').onclick = () => { RE.pantalla = 'menu'; pintaRE(); };
    const sg = $('#re-seg'); if (sg) sg.onclick = () => { const r = reRes(); const seg = EST_RE.find(x => !r.est?.[x.k]?.acabada && x.k !== RE.est) || EST_RE[(EST_RE.findIndex(x => x.k === RE.est) + 1) % 4]; comencaEst(seg.k); };
    const fi = $('#re-fi'); if (fi) fi.onclick = tancaRepas;
    if (tot) soAsc('fanfara'); else so('ok');
  }
  const s = $('#re-surt'); if (s) s.onclick = tancaRepas;
}
const NOM_PAS_RE = { signes: 'Signes', norma: 'Norma', mag: 'Càlcul sense signe', res: 'Resultat' };
function pintaExRE(c) {
  const ex = RE.ex, pas = RE.passos[RE.p], e = EST_RE.find(x => x.k === RE.est);
  const nv = RE.nivell; const fet = RE.fet;
  const prog = `<div class="punts">${Array.from({ length: EX_EST }, (_, i) => `<i class="${i < RE.i ? 'lila' : i === RE.i ? 'ara' : ''}"></i>`).join('')}</div>`;
  // part esquerra: l'operació i els dibuixos
  const pasIdx = RE.p; const sapSigne = fet || RE.passos.indexOf('norma') < pasIdx && RE.passos.includes('norma');
  let esq = `<div class="re-expr">${ex.html} <span>=</span> <b class="re-q ${fet ? 'fet' : ''}" style="${fet ? `color:${colZ(ex.valor)}` : ''}">${fet ? fz(ex.valor) : '?'}</b></div>`;
  if (nv === 1 && ex.k === 's' && Math.abs(ex.a) <= 9 && Math.abs(ex.b) <= 9) esq += `<div class="visual">${fitxesHtml([{ etiqueta: ex.html, ts: [ex.a, ex.b] }])}</div>`;
  if (nv === 1 && ex.k === 'p') esq += grupsSVG(ex, sapSigne);
  if (nv === 3 && !fet) esq += ex.k === 's' ? `<details class="re-ajuda"><summary>📏 Norma de la suma</summary>${normaSumaHtml()}</details>` : `<div class="visual">${taulaSignesHtml('plegada')}</div>`;
  else if (nv === 2 && pas === 'res' && !fet) esq += ex.k === 'c' ? `<div class="pista"><span class="ico">💡</span><div><b>Recorda:</b> ${ex.pista}</div></div>` : `<div class="visual">${ex.k === 's' ? normaSumaHtml(false, ex.norma) : normaProdHtml(false, ex.norma)}</div>`;
  // part dreta: el pas actual
  const llista = RE.passos.length > 1 ? `<div class="re-passos">${RE.passos.map((p, i) => `<div class="${i < RE.p || fet ? 'fet' : i === RE.p ? 'ara' : ''}"><b>${i < RE.p || fet ? '✓' : i + 1}</b>${NOM_PAS_RE[p]}</div>`).join('')}</div>` : '';
  let dreta = '';
  const sA = fz(ex.a), sB = fz(ex.b);
  if (fet) dreta = `<div class="re-tasca">${RE.errEx ? 'Fet!' : '<b>Perfecte, a la primera!</b> ⭐'}</div>`;
  else if (pas === 'signes') {
    const nums = ex.k === 's' ? `els números són <b style="color:${colZ(ex.a)}">${sA}</b> i <b style="color:${colZ(ex.b)}">${sB}</b>` : `els números són <b style="color:${colZ(ex.a)}">${sA}</b> i <b style="color:${colZ(ex.b)}">${sB}</b>`;
    dreta = `<div class="re-tasca">A ${ex.html}, ${nums}${ex.k === 's' && ex.par ? ' (ja hem tret el parèntesi)' : ''}.<br>Els seus <b>signes</b> són iguals o diferents?</div>
      <div class="opcions fila"><button class="opcio" data-v="ig">Iguals</button><button class="opcio" data-v="df">Diferents</button></div>`;
  } else if (pas === 'norma') {
    dreta = `<div class="re-tasca">${ex.k === 's' ? `És una <b>suma</b>. Toca la <b>norma</b> que has de fer servir.` : `És una <b>${ex.div ? 'divisió' : 'multiplicació'}</b>. Toca la fila de la taula que correspon als signes <b>${sgTxt(ex.a)}</b> i <b>${sgTxt(ex.b)}</b>.`}</div>
      ${RE.est === 's3' || RE.est === 's4' ? `<div class="re-dues">${normaSumaHtml(true)}${normaProdHtml(true)}</div>` : ex.k === 's' ? normaSumaHtml(true) : normaProdHtml(true)}`;
  } else if (pas === 'mag') {
    const q = ex.k === 's' ? (ex.norma === 'ig' ? `${Math.abs(ex.a)} + ${Math.abs(ex.b)}` : `${Math.max(Math.abs(ex.a), Math.abs(ex.b))} − ${Math.min(Math.abs(ex.a), Math.abs(ex.b))}`) : `${Math.abs(ex.a)} ${ex.op} ${Math.abs(ex.b)}`;
    dreta = `<div class="re-tasca">Ara els <b>números sense signe</b>${ex.k === 's' ? (ex.norma === 'ig' ? ' (els sumes)' : ' (el gran menys el petit)') : ''}:</div>
      <div class="re-inp"><span>${q} =</span><input id="re-in" inputmode="numeric" maxlength="4" autocomplete="off"></div>`;
  } else {
    dreta = `<div class="re-tasca">${RE.passos.length > 1 ? `Ara escriu el <b>resultat</b> amb el seu signe.${nv === 1 ? (ex.k === 's' ? (ex.norma === 'ig' ? ` Signes iguals: el signe dels dos.` : ` El signe és el del número més gran (sense mirar el signe).`) : ` El signe ja el saps: és el de la fila que has tocat a la taula.`) : ''}` : `Calcula i escriu el resultat amb el signe.`}</div>
      <div class="re-inp"><span>${ex.html} =</span><input id="re-in" class="escrit" inputmode="text" maxlength="6" autocomplete="off" placeholder="±"></div>`;
  }
  c.innerHTML = `${capRE(`<span class="re-est-nom">${e.ic} ${e.titol}</span>${prog}`)}
    <div class="joc re-joc"><div class="costat pregunta"><div class="etiqueta">Exercici ${RE.i + 1} de ${EX_EST}</div>${esq}</div>
      <div class="costat respostes">${llista}${dreta}<div id="re-msg">${RE.msg || ''}</div>
        <div class="accions">${fet ? `<button class="boto taronja" id="re-seg">${RE.i + 1 >= EX_EST ? 'Acaba l\'estació →' : 'Següent →'}</button>` : (pas === 'mag' || pas === 'res') ? `<button class="boto taronja" id="re-ok" disabled>Comprova</button>` : ''}</div></div></div>`;
  const inp = $('#re-in'), ok = $('#re-ok');
  if (inp) { inp.oninput = () => { inp.value = pas === 'res' ? netejaEnter(inp.value) : inp.value.replace(/[^0-9]/g, ''); ok.disabled = pas === 'res' ? !llegeixEnter(inp.value) : !inp.value; }; inp.focus(); }
  if (ok) ok.onclick = () => comprovaRE(pas, pas === 'res' ? llegeixEnter(inp.value)?.v : Number(inp.value));
  $$('[data-v]', c).forEach(b => b.onclick = () => comprovaRE('signes', b.dataset.v));
  $$('[data-re-norma]', c).forEach(b => b.onclick = () => comprovaRE('norma', b.dataset.reNorma));
  const sg = $('#re-seg'); if (sg) { sg.onclick = seguentRE; sg.focus(); }
}
function teclaRE(ev) { if (ev.key === 'Enter' && RE?.pantalla === 'ex') { const b = $('#re-ok') || $('#re-seg'); if (b && !b.disabled) { ev.preventDefault(); b.click(); } } }
// comprova un pas: si falla, explica què passa i deixa tornar-hi; al segon error del pas, mostra la resposta i continua
function comprovaRE(pas, v) {
  const ex = RE.ex; let ok, tipusErr = 'num', msg = '', bona;
  if (pas === 'signes') { bona = Math.sign(ex.a) === Math.sign(ex.b) ? 'ig' : 'df'; ok = v === bona; tipusErr = 'signe'; msg = ok ? '' : `Fixa't en el color: ${fz(ex.a)} i ${fz(ex.b)} ${bona === 'ig' ? 'tenen el <b>mateix</b> signe' : 'tenen signes <b>diferents</b>'}.`; }
  else if (pas === 'norma') {
    const nn = v.replace(/-/g, '−');
    ok = ex.k === 's' ? v === ex.norma : nn === ex.norma; tipusErr = 'signe';
    const esSuma = v === 'ig' || v === 'df';
    if (!ok) msg = ex.k === 's' && !esSuma ? `Compte! Això és una <b>suma</b>, no una multiplicació. Fes servir la norma de la suma.` : ex.k === 'p' && esSuma ? `Compte! Això és una <b>${ex.div ? 'divisió' : 'multiplicació'}</b>. Fes servir la taula de signes.` : ex.k === 's' ? `Els signes de ${fz(ex.a)} i ${fz(ex.b)} són ${ex.norma === 'ig' ? '<b>iguals</b>' : '<b>diferents</b>'}.` : `Busca la fila amb <b>${sgTxt(ex.a)}</b> primer i <b>${sgTxt(ex.b)}</b> després.`;
    bona = ex.norma;
  } else if (pas === 'mag') { ok = v === ex.mag; msg = ok ? '' : `Revisa el càlcul: no fa ${v}.`; bona = ex.mag; }
  else { ok = v === ex.valor; if (!ok) { if (Math.abs(v) === Math.abs(ex.valor)) { tipusErr = 'signe'; msg = `El número és bo, però el <b>signe</b> no. ${ex.k === 'p' ? 'Mira la taula de signes.' : ex.k === 's' ? (ex.norma === 'ig' ? 'Signes iguals: es queda el mateix signe.' : 'Es posa el signe del número més gran.') : ''}`; } else msg = `No és ${fz(v)}. ${ex.pista || 'Torna-ho a calcular amb calma.'}`; } bona = ex.valor; }
  if (ok) {
    so('ok'); RE.intents = 0; RE.msg = '';
    if (pas === 'norma' && RE.nivell === 1) RE.msg = `<div class="retorn ok"><div><p>${ex.k === 's' ? NORMA_S.find(n => n.f === ex.norma).t : `${sgTxt(ex.a)} ${ex.op} ${sgTxt(ex.b)} = <b>${ex.valor < 0 ? '−' : '+'}</b>`}</p></div></div>`;
    avancaRE(); return;
  }
  so('ko'); RE.errEx++; RE.intents++;
  if (!RE.prova) desaRE(RE.est, tipusErr === 'signe' ? { errSigne: 1 } : { errNum: 1 });
  if (RE.intents >= 2) {
    const sol = pas === 'signes' ? (bona === 'ig' ? 'iguals' : 'diferents') : pas === 'norma' ? (ex.k === 's' ? NORMA_S.find(n => n.f === bona).t : `la fila ${bona.replace(/(.)(.)/, '$1 · $2')}`) : pas === 'mag' ? bona : fz(bona);
    RE.msg = `<div class="retorn ko"><div><p>${msg}</p><p>La resposta era: <b>${sol}</b>. Seguim!</p></div></div>`; RE.intents = 0; avancaRE(); return;
  }
  RE.msg = `<div class="retorn ko"><div><p>${msg} Torna-ho a provar.</p></div></div>`; pintaRE();
}
function avancaRE() {
  if (RE.p < RE.passos.length - 1) { RE.p++; pintaRE(); return; }
  RE.fet = true; const primera = RE.errEx === 0; if (primera) RE.sessio.primera++;
  const acabada = RE.i + 1 >= EX_EST;
  if (!RE.prova) desaRE(RE.est, { fets: 1, primera: primera ? 1 : 0, ...(acabada ? { acabada: true } : {}) });
  pintaRE();
}
function seguentRE() { so('pas'); RE.i++; RE.msg = ''; if (RE.i >= EX_EST) { RE.pantalla = 'fiEst'; if (RE.prova) { RE.provaFetes = RE.provaFetes || {}; RE.provaFetes[RE.est] = true; } pintaRE(); return; } nouExRE(); }
document.addEventListener('keydown', ev => { if (RE) teclaRE(ev); });

UNITATS.e.carregada = true;
