'use strict';
/* FR-4C · Matemàtiques 4t ESO · Unitat Equacions.
   L'app (index.html) carrega aquest fitxer quan cal. Fa servir les funcions del nucli de l'app.
   Mètode: transposició («el +5 molesta, el passo a l'altra banda restant»), justificada amb la balança. */
Object.assign(ETIQ_ERR, {
  doblePlus: 'confon el doble (2x) amb sumar 2 (x + 2)', dobleQuad: 'confon el doble (2x) amb el quadrat (x²)', ordreResta: 'inverteix una resta (5 − x ↔ x − 5)', parenFrase: 'confon «el doble de la suma» amb «el doble més»',
  signeVal: 'no aplica el signe en substituir un negatiu', quadNeg: 'calcula (−3)² com −9', ordreOp: 'no respecta la prioritat de les operacions',
  barreja: 'suma les x amb els números (2x + 3 = 5x)', signeTerme: 'no té en compte el signe d\'un terme en reduir',
  substit: 'substitueix malament la x', transSigne: 'en passar un terme a l\'altra banda no canvia l\'operació', passaRestant: 'passa el número que multiplica restant (3x = 12 → x = 12 − 3)',
  passaMult: 'passa el número que divideix dividint en lloc de multiplicant', signeDiv: 's\'equivoca de signe en dividir', menysX: 'de −x = 5 dedueix x = 5', ordrePassos: 'divideix abans de passar el número que suma o resta',
  parentesi: 'multiplica només el primer terme del parèntesi', oblidaNeg: 'oblida la solució negativa (x² = 49 → només 7)', divQuad: 'divideix entre 2 en lloc de fer l\'arrel', perdZero: 'perd la solució x = 0'
});
Object.assign(AVIS_ERR, {
  doblePlus: 'El <b>doble</b> vol dir <b>multiplicar per 2</b>: 2x. En canvi, x + 2 és sumar 2.', dobleQuad: 'El doble és 2 · x = 2x. El quadrat seria x · x = x².', ordreResta: 'Compte amb l\'ordre de la resta: «5 menys un nombre» és 5 − x.',
  parenFrase: '«El doble de la suma» vol parèntesi: primer sumes i després fas el doble, 2(x + 3).',
  signeVal: 'Quan la x és negativa, posa-la entre parèntesis: 3 · (−2) = −6.', quadNeg: '(−3)² = (−3) · (−3) = +9: menys per menys fa més.', ordreOp: 'Primer les multiplicacions i després les sumes i restes.',
  barreja: 'Les x només es sumen amb les x, i els números amb els números: 2x + 3 no es pot ajuntar.', signeTerme: 'Cada terme porta el signe que té <b>davant</b>: a 7x − 3x, el 3x resta.',
  substit: 'Canvia la x pel número i calcula: si x = 3, 2x + 1 = 2 · 3 + 1 = 7.', transSigne: 'El que suma passa <b>restant</b>, i el que resta passa <b>sumant</b>.', passaRestant: 'A 3x el 3 <b>multiplica</b>: passa a l\'altra banda <b>dividint</b>.',
  passaMult: 'A x/3 el 3 <b>divideix</b>: passa a l\'altra banda <b>multiplicant</b>.', signeDiv: 'Si divideixes entre un negatiu, el signe del resultat canvia: 12 : (−3) = −4.', menysX: 'Si −x = 5, llavors x = −5 (canvia el signe als dos costats).',
  ordrePassos: 'Primer passa el número que <b>suma o resta</b> i després el que <b>multiplica</b>.', parentesi: 'El número de fora multiplica <b>tots</b> els termes del parèntesi: 3(x − 2) = 3x − 6.',
  oblidaNeg: 'x² = 49 té <b>dues</b> solucions: 7 i −7, perquè (−7)² també fa 49.', divQuad: 'x² vol dir x · x: per desfer-ho fas l\'<b>arrel</b>, no la meitat.', perdZero: 'Si x · (x − 5) = 0, també és solució x = 0.'
});
document.head.insertAdjacentHTML('beforeend', `<style>
.q-col{display:inline-grid;grid-template-columns:auto auto auto auto;column-gap:.4em;row-gap:.18em;font-size:1.75rem;font-weight:800;align-items:baseline;text-align:left;line-height:1.3}
.q-col>div{display:contents}.q-col .e{text-align:right;white-space:nowrap}.q-col .d{white-space:nowrap}.q-col .m{color:var(--taronja)}.q-col .b{color:#2a6fd6}
.q-col .nota{font-size:.9rem;font-weight:800;color:#555;padding-left:1em;white-space:nowrap}.q-col .vell>span{opacity:.4}.q-col .nou>span{animation:msPopQ .35s both}
.q-col.petita{font-size:1.12rem;row-gap:.05em}.q-col.petita .nota{font-size:.74rem}
@keyframes msPopQ{0%{opacity:0;transform:translateY(-8px)}100%{opacity:1;transform:none}}
.costat:has(.q-col.petita) .sol-pas{display:inline-block;vertical-align:top;margin:0 22px 10px 0}
.q-xeq{float:right;font-weight:900;font-size:1.25em;padding-left:14px}.ap-text:has(.q-xeq),.ap-expr:has(.q-xeq){flex:1;display:flex;justify-content:space-between;align-items:center;gap:10px}.ap-text:has(.q-xeq) .q-xeq,.ap-expr:has(.q-xeq) .q-xeq{float:none}
.ap-text:has(.q-xeq)>b{font-size:1.3em;font-weight:800;white-space:nowrap}
.q-eq{font-size:1.9rem;font-weight:800;text-align:center;line-height:1.5}.q-eq .m{color:var(--taronja)}.q-eq .b{color:#2a6fd6}.q-eq s{color:#c33;text-decoration-thickness:3px}
.q-passos{display:grid;gap:8px;font-size:1.25rem}.q-passos div{display:grid;grid-template-columns:2.2em 1fr;gap:10px;align-items:center;padding:8px 12px;border-radius:10px;background:#fff;border:2px solid #ddd}.q-passos b.n{display:inline-flex;align-items:center;justify-content:center;width:1.9em;height:1.9em;border-radius:50%;background:var(--taronja);color:#fff}
.q-passos .on{border-color:var(--taronja);background:#fff3e6}
.q-taula{border-collapse:collapse;font-size:1.15rem;margin:0 auto}.q-taula td,.q-taula th{border:2px solid #ccc;padding:6px 14px;text-align:center}.q-taula th{background:#fff3e6}
.q-frase{display:grid;grid-template-columns:1fr auto 1fr;gap:10px 14px;align-items:center;font-size:1.15rem}.q-frase b{font-size:1.4rem;color:var(--taronja)}
</style>`);
const qR = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const qNz = v => v < 0 ? `−${-v}` : String(v); // sense +
const qP = v => v < 0 ? `(−${-v})` : String(v); // negatius entre parèntesis
const qL = (a, b, v = 'x') => fmtLin(a, b, v);
const qEq = (a, b, c, d) => `${qL(a, b)} = ${qL(c, d)}`; // ax + b = cx + d
const qEtiq = ops => Object.fromEntries(ops.filter(o => o.tag).map(o => [o.val, o.tag]));
function qUnics(n, fer, clau) { const out = [], vist = new Set(); for (let g = 0; out.length < n && g < 300; g++) { const x = fer(); if (!x) continue; const k = clau(x); if (vist.has(k)) continue; vist.add(k); out.push(x); } return out; }
const qOps = (bo, mals) => { const vist = new Set([bo.html]); const o = [{ ...bo, val: 'b' }]; mals.forEach((m, i) => { if (!vist.has(m.html) && o.length < 4) { vist.add(m.html); o.push({ ...m, val: 'm' + i }); } }); return barreja(o); };
const qX = (v, x) => ({ tipus: 'enter', escrit: true, senseMes: true, llarg: true, html: v, valor: x });
/* ---------- resolució en columna ----------
   Sempre cap avall: una equació a cada línia, alineades pel signe =. El terme que canvia de costat es pinta del mateix
   color a la línia d'on surt i a la línia on arriba. El resultat de l'operació s'escriu A SOTA, mai al costat (res de «2x = 11 − 3 = 8»). */
const qM = t => `<span class="m">${t}</span>`, qBl = t => `<span class="b">${t}</span>`;
const qCol = (lin, { petita = false, nou = 0 } = {}) => `<div class="q-col${petita ? ' petita' : ''}">${lin.map(([e, d, nota], i) => `<div class="${nou ? (i < lin.length - nou ? 'vell' : 'nou') : ''}"><span class="e">${e}</span><span class="ig">=</span><span class="d">${d}</span><span class="nota">${nota ? '← ' + nota : ''}</span></div>`).join('')}</div>`;
const qSg = b => b < 0 ? `− ${-b}` : `+ ${b}`; // el terme tal com és
const qOp = b => b < 0 ? `+ ${-b}` : `− ${b}`; // el terme quan canvia de costat
const qAx = a => a === 1 ? 'x' : a === -1 ? '−x' : `${qNz(a)}x`;
// ax + b = c: primer passa el que suma o resta, després el que multiplica
function qLinPassos(a, b, c, x) {
  const L = [];
  if (b) { L.push([`${qAx(a)} ${qM(qSg(b))}`, qNz(c)]); L.push([qAx(a), `${qNz(c)} ${qM(qOp(b))}`, b > 0 ? 'passa restant' : 'passa sumant']); }
  const r = c - b;
  if (a === 1) { L.push(['x', qNz(r)]); return L; }
  if (a === -1) { L.push(['−x', qNz(r)]); L.push(['x', qNz(-r), 'canvio el signe als dos costats']); return L; }
  L.push([`${qBl(qNz(a))}x`, qNz(r)]); L.push(['x', `${qNz(r)} ${qBl(': ' + qP(a))}`, 'passa dividint']); L.push(['x', qNz(x)]); return L;
}
// ax + b = cx + d: les x a l'esquerra, els números a la dreta
function qDosCostatsPassos(a, b, c, d, x) {
  const cx = qAx(c), L = [[`${qAx(a)}${b ? ' ' + qBl(qSg(b)) : ''}`, `${qM(cx)}${d ? ' ' + qSg(d) : ''}`]];
  const dre = d ? `${qNz(d)}${b ? ' ' + qBl(qOp(b)) : ''}` : (b ? qBl(qNz(-b)) : '0');
  L.push([`${qAx(a)} ${qM((c < 0 ? '+ ' : '− ') + qAx(Math.abs(c)))}`, dre, 'les x a l\'esquerra, els números a la dreta']);
  return [...L, ...qLinPassos(a - c, 0, d - b, x)];
}
// k(x + p) + m = r
function qParenPassos({ k, p, m, r, x }) {
  const L = [[`${qBl(k)}(x ${qSg(p)})${m ? ' ' + qSg(m) : ''}`, qNz(r)]]; const R = qLinPassos(k, k * p + m, r, x);
  if (m) { L.push([`${k}x ${qSg(k * p)} ${qSg(m)}`, qNz(r), `trec el parèntesi: ${k} · x i ${k} · ${qP(p)}`]); R[0][2] = 'ajunto els números'; } else R[0][2] = `trec el parèntesi: ${k} · x i ${k} · ${qP(p)}`;
  return [...L, ...R];
}
// ax² + b = c, amb solucions r i −r
function qQuadPassos(a, b, c, r) {
  const L = [], ax = `${a === 1 ? '' : a}x²`;
  if (b) { L.push([`${ax} ${qM(qSg(b))}`, c]); L.push([ax, `${c} ${qM(qOp(b))}`, 'passa restant']); }
  if (a !== 1) { L.push([`${qBl(a)}x²`, c - b]); L.push(['x²', `${c - b} ${qBl(': ' + a)}`, 'passa dividint']); }
  L.push(['x²', r * r]); L.push(['x', `${qM('±')}√${r * r}`, 'arrel quadrada: dues solucions']); L.push(['x', `${r} &nbsp;i&nbsp; x = −${r}`]); return L;
}
// ax² − a·s·x = 0, amb solucions 0 i s
const qFactorPassos = (a, s) => { const dins = `${a === 1 ? '' : a}x ${qSg(-a * s)}`; return [[`${a === 1 ? '' : a}x² ${qSg(-a * s)}x`, '0'], [`${qM('x')} · (${dins})`, '0', 'trec la x factor comú'], ['x', '0', 'el primer factor val 0'], [dins, '0', 'o el segon factor val 0'], ['x', qNz(s)]]; };
const qErrs = (bo, cands) => { const o = {}; for (const [v, t] of cands) if (Number.isInteger(v) && v !== bo && !(v in o)) o[v] = t; return o; };

/* ---------- dibuix de la balança ---------- */
function qBalanca(esq, dre, { inclina = 0, ratlla = [] } = {}) {
  // esq / dre: llista de peces: 'x' (caixa) o un número (pes)
  const peca = (p, i, costat) => { const tx = ratlla.includes(costat + i); const x = p === 'x';
    return `<g transform="translate(${i * 34} 0)"><rect x="0" y="${x ? -34 : -28}" width="30" height="${x ? 34 : 28}" rx="${x ? 4 : 14}" fill="${x ? '#ffe2c9' : '#dbe8ff'}" stroke="#1b1b1b" stroke-width="2.5" opacity="${tx ? .3 : 1}"/><text x="15" y="${x ? -11 : -9}" text-anchor="middle" font-size="16" font-weight="900" fill="#1b1b1b" opacity="${tx ? .3 : 1}">${x ? 'x' : p}</text>${tx ? '<line x1="-2" y1="-36" x2="32" y2="2" stroke="#c33" stroke-width="4"/>' : ''}</g>`; };
  const fila = (ps, costat) => ps.map((p, i) => peca(p, i, costat)).join('');
  const wE = esq.length * 34, wD = dre.length * 34, ang = inclina * 6;
  return `<svg viewBox="35 45 350 175" style="width:100%;max-width:520px">
    <polygon points="210,200 185,215 235,215" fill="#1b1b1b"/><rect x="205" y="70" width="10" height="135" fill="#1b1b1b"/>
    <g transform="rotate(${ang} 210 70)"><rect x="40" y="64" width="340" height="10" rx="5" fill="#1b1b1b"/>
      <g transform="translate(${110 - wE / 2} 120)">${fila(esq, 'e')}</g><line x1="70" y1="74" x2="70" y2="120" stroke="#1b1b1b" stroke-width="2"/><line x1="150" y1="74" x2="150" y2="120" stroke="#1b1b1b" stroke-width="2"/><rect x="60" y="120" width="100" height="6" rx="3" fill="#1b1b1b"/>
      <g transform="translate(${310 - wD / 2} 120)">${fila(dre, 'd')}</g><line x1="270" y1="74" x2="270" y2="120" stroke="#1b1b1b" stroke-width="2"/><line x1="350" y1="74" x2="350" y2="120" stroke="#1b1b1b" stroke-width="2"/><rect x="260" y="120" width="100" height="6" rx="3" fill="#1b1b1b"/></g>
  </svg>`;
}
const qPassos = (on = 0) => `<div class="q-passos">${['<b>Què molesta?</b> El número que acompanya la x.', '<b>El passo</b> a l\'altra banda amb l\'operació <b>contrària</b>.', '<b>Opero</b> el que queda.', '<b>Comprovo</b>: canvio la x per la solució.'].map((t, i) => `<div class="${on === i + 1 ? 'on' : ''}"><b class="n">${i + 1}</b><span>${t}</span></div>`).join('')}</div>`;
const qContraria = `<table class="q-taula"><tr><th>Si a la x...</th><th>passa...</th></tr><tr><td>+ suma</td><td>− restant</td></tr><tr><td>− resta</td><td>+ sumant</td></tr><tr><td>· multiplica</td><td>: dividint</td></tr><tr><td>: divideix</td><td>· multiplicant</td></tr></table>`;

/* =====================================================================
   OBJECTIU 1 · LLENGUATGE ALGEBRAIC
   ===================================================================== */
const Q_FRASES = [
  ['el doble d\'un nombre', '2x', [['x + 2', 'doblePlus'], ['x²', 'dobleQuad'], ['2 + x', 'doblePlus']]],
  ['el triple d\'un nombre', '3x', [['x + 3', 'doblePlus'], ['x³', 'dobleQuad'], ['x − 3', null]]],
  ['un nombre més 5', 'x + 5', [['5x', 'doblePlus'], ['x − 5', null], ['5 − x', null]]],
  ['un nombre menys 4', 'x − 4', [['4 − x', 'ordreResta'], ['4x', null], ['x + 4', null]]],
  ['7 menys un nombre', '7 − x', [['x − 7', 'ordreResta'], ['7x', null], ['x + 7', null]]],
  ['la meitat d\'un nombre', 'x : 2', [['2x', null], ['x − 2', null], ['x²', null]]],
  ['la quarta part d\'un nombre', 'x : 4', [['4x', null], ['x − 4', null], ['x⁴', null]]],
  ['un nombre al quadrat', 'x²', [['2x', 'dobleQuad'], ['x + 2', null], ['x · 2', 'dobleQuad']]],
  ['el següent d\'un nombre', 'x + 1', [['x − 1', null], ['2x', null], ['1x', null]]],
  ['l\'anterior d\'un nombre', 'x − 1', [['x + 1', null], ['1 − x', 'ordreResta'], ['x : 1', null]]],
  ['el doble d\'un nombre més 3', '2x + 3', [['2(x + 3)', 'parenFrase'], ['3x + 2', null], ['x + 2 + 3', 'doblePlus']]],
  ['el triple d\'un nombre menys 1', '3x − 1', [['3(x − 1)', 'parenFrase'], ['1 − 3x', 'ordreResta'], ['x + 3 − 1', 'doblePlus']]],
  ['el doble de la suma d\'un nombre i 3', '2(x + 3)', [['2x + 3', 'parenFrase'], ['2 + x + 3', 'doblePlus'], ['2x · 3', null]]],
  ['la meitat d\'un nombre més 5', 'x : 2 + 5', [['(x + 5) : 2', 'parenFrase'], ['2x + 5', null], ['x + 5 : 2', null]]],
  ['el quadrat d\'un nombre menys 4', 'x² − 4', [['2x − 4', 'dobleQuad'], ['(x − 4)²', 'parenFrase'], ['4 − x²', 'ordreResta']]]
];
const Q_CTX = [
  () => { const k = qR(2, 9); return { t: `En Pol té <b>x</b> anys. Quants en tindrà d'aquí a ${k} anys?`, bo: `x + ${k}`, mals: [[`x − ${k}`, null], [`${k}x`, 'doblePlus'], [`x · ${k}`, null]] }; },
  () => ({ t: 'La mare d\'en Pol té el <b>triple</b> de la seva edat (x). Quants anys té?', bo: '3x', mals: [['x + 3', 'doblePlus'], ['x³', 'dobleQuad'], ['3 + x', 'doblePlus']] }),
  () => { const p = qR(3, 9); return { t: `Una entrada costa ${p} €. Quant costen <b>x</b> entrades?`, bo: `${p}x`, mals: [[`x + ${p}`, 'doblePlus'], [`x${'⁰¹²³⁴⁵⁶⁷⁸⁹'[p]}`, 'dobleQuad'], [`${p} − x`, null]] }; },
  () => { const p = qR(2, 4); return { t: `Pagues amb un bitllet de 20 € <b>x</b> llibretes de ${p} €. Quant et tornen?`, bo: `20 − ${p}x`, mals: [[`${p}x − 20`, 'ordreResta'], [`20 − x`, null], [`20 + ${p}x`, null]] }; },
  () => { const a = qR(3, 8); return { t: `Un rectangle fa <b>x</b> cm de llarg i ${a} cm d'ample. Quin és el perímetre?`, bo: `2x + ${2 * a}`, mals: [[`x + ${a}`, null], [`${a}x`, null], [`2x + ${a}`, 'parenFrase']] }; },
  () => { const f = qR(10, 30), h = qR(5, 15); return { t: `Un lampista cobra ${f} € fixos i ${h} € per cada hora (<b>x</b> hores). Quant cobra?`, bo: `${f} + ${h}x`, mals: [[`${f}x + ${h}`, null], [`${f + h}x`, 'barreja'], [`(${f} + ${h})x`, 'parenFrase']] }; }
];
const PISTA_Q1 = { completa: `Paraules clau: <b>doble</b> → 2x · <b>triple</b> → 3x · <b>meitat</b> → x : 2 · <b>quadrat</b> → x² · <b>més</b> → + · <b>menys</b> → −. «El doble <b>de la suma</b>» porta parèntesi.`, mitja: `Doble = multiplicar per 2. Quadrat = x · x.` };
const Q1 = {};
Q1.frase = (nv, { n = 3 } = {}) => {
  const pool = nv === 1 ? Q_FRASES.slice(0, 10) : Q_FRASES;
  const its = barreja(pool).slice(0, n).map(([f, bo, mals]) => { const ops = qOps({ html: bo }, mals.map(([h, t]) => ({ html: h, tag: t || undefined }))); return { tipus: 'tria', llarg: true, html: `«${f}»`, opcions: ops, correcta: 'b', etiq: qEtiq(ops), bo }; });
  return { sig: `a1-${its.map(i => i.html).join('|')}`, enunciat: `Tria l'expressió algebraica. <b>x</b> és el nombre que no coneixem.`, visual: nv === 1 ? () => qTaulaParaules() : null, pista: PISTA_Q1, ...apartats(its),
    explicacio: `Tradueix paraula per paraula.`, solucio: its.map(it => `${it.html} → <b>${it.bo}</b>`) };
};
Q1.invers = (nv, { n = 3 } = {}) => {
  const tria4 = barreja(Q_FRASES.slice(0, nv === 1 ? 10 : 15)).slice(0, n);
  const its = tria4.map(([f, bo]) => { const altres = barreja(Q_FRASES.filter(q => q[0] !== f)).slice(0, 2).map(q => q[0]);
    const ops = barreja([{ html: f, val: 'b' }, ...altres.map((a, i) => ({ html: a, val: 'm' + i }))]); return { tipus: 'tria', llarg: true, html: `<b>${bo}</b> vol dir…`, opcions: ops, correcta: 'b', etiq: {}, f, bo }; });
  return { sig: `a2-${its.map(i => i.bo).join('|')}`, enunciat: `De l'expressió a les paraules.`, visual: null, pista: PISTA_Q1, ...apartats(its),
    explicacio: `Llegeix l'expressió en veu alta.`, solucio: its.map(it => `${it.bo}: <b>${it.f}</b>`) };
};
Q1.context = (nv, { n = 2 } = {}) => {
  const fs = barreja(Q_CTX).slice(0, n).map(f => f());
  const its = fs.map(f => { const ops = qOps({ html: f.bo }, f.mals.map(([h, t]) => ({ html: h, tag: t || undefined }))); return { tipus: 'tria', llarg: true, html: f.t, opcions: ops, correcta: 'b', etiq: qEtiq(ops), bo: f.bo }; });
  return { sig: `a3-${fs.map(f => f.t.slice(0, 18)).join('|')}`, enunciat: `Situacions de la vida real: escriu-les amb x.`, visual: null, pista: PISTA_Q1, ...apartats(its),
    explicacio: `Pensa què faries si en lloc de x hi hagués un número.`, solucio: its.map(it => `<b>${it.bo}</b>`) };
};
const qTaulaParaules = () => `<div class="q-frase"><span>el doble</span>→<b>2x</b><span>el triple</span>→<b>3x</b><span>la meitat</span>→<b>x : 2</b><span>el quadrat</span>→<b>x²</b><span>més 5</span>→<b>+ 5</b><span>menys 5</span>→<b>− 5</b></div>`;
TEMES.q1 = {
  gen: Q1,
  sequencia: {
    1: [['frase', { n: 3 }], ['frase', { n: 3 }], ['invers', { n: 2 }], ['frase', { n: 4 }], ['context', { n: 2 }], ['invers', { n: 3 }], ['frase', { n: 4 }], ['context', { n: 2 }]],
    2: [['frase', { n: 4 }], ['invers', { n: 3 }], ['context', { n: 2 }], ['frase', { n: 4 }], ['context', { n: 3 }], ['invers', { n: 3 }], ['frase', { n: 4 }], ['context', { n: 3 }]],
    3: [['frase', { n: 4 }], ['context', { n: 3 }], ['invers', { n: 4 }], ['frase', { n: 5 }], ['context', { n: 3 }], ['frase', { n: 5 }], ['invers', { n: 4 }], ['context', { n: 3 }]]
  },
  explicacio: [
    { text: `<p>Quan no sabem un nombre, li posem una <b class="parpelleja">lletra</b>: normalment la <b>x</b>.</p><p class="petit">«Penso un nombre i li sumo 5» s'escriu <b>x + 5</b>.</p>`, vis: () => `<div class="q-eq">penso un nombre <span class="m">→ x</span><br>li sumo 5 <span class="m">→ x + 5</span></div>` },
    { text: `<p>Les paraules clau es tradueixen sempre igual.</p><p class="petit"><b class="parpelleja">Doble</b> vol dir multiplicar per 2: 2x (no x + 2!).</p>`, vis: () => qTaulaParaules() },
    { text: `<p>Entre el número i la x no s'escriu el punt: <b>2 · x = 2x</b>.</p><p class="petit">I <b>x : 2</b> també es pot escriure com una fracció, x/2.</p>`, vis: () => `<div class="q-eq">2 · x = <span class="m">2x</span><br>x : 2 = <span class="m">x/2</span></div>` },
    { text: `<p><b class="parpelleja">Alerta</b> amb l'ordre:</p><p class="petit">«el doble d'un nombre més 3» → <b>2x + 3</b><br>«el doble <b>de la suma</b> d'un nombre i 3» → <b>2(x + 3)</b></p>`, vis: () => `<div class="q-eq">2x + 3 <span class="b">≠</span> 2(x + 3)</div>` }
  ],
  exemple: (nv) => {
    if (nv === 1) return { enunciat: `Escriu «el triple d'un nombre».`, passos: [
      { text: `El nombre que no sabem és la <b>x</b>.`, vis: `<div class="q-eq">un nombre → <span class="m">x</span></div>` },
      { text: `Triple = multiplicar per 3: <b>3x</b>. <span class="marca-ok">✓</span>`, vis: `<div class="q-eq">3 · x = <span class="m">3x</span></div>` }] };
    if (nv === 2) return { enunciat: `Escriu «el doble d'un nombre menys 7».`, passos: [
      { text: `El doble d'un nombre: 2x.`, vis: `<div class="q-eq"><span class="m">2x</span></div>` },
      { text: `Menys 7: <b>2x − 7</b>. <span class="marca-ok">✓</span>`, vis: `<div class="q-eq"><span class="m">2x − 7</span></div>` }] };
    return { enunciat: `Un taxi cobra 3 € per baixar bandera i 2 € per quilòmetre. Quant costa un viatge de x km?`, passos: [
      { text: `Pels quilòmetres: 2 € cada un → 2x.`, vis: `<div class="q-eq"><span class="m">2x</span></div>` },
      { text: `Més els 3 € fixos: <b>2x + 3</b>. <span class="marca-ok">✓</span>`, vis: `<div class="q-eq"><span class="m">2x + 3</span></div>` }] };
  }
};

/* =====================================================================
   OBJECTIU 2 · VALOR NUMÈRIC
   ===================================================================== */
const PISTA_Q2 = { completa: `Canvia la x pel número (si és negatiu, entre parèntesis) i calcula: primer les multiplicacions i després les sumes i restes. Si x = −2: 3x + 1 = 3 · (−2) + 1 = −6 + 1 = −5.`, mitja: `Substitueix i calcula.` };
const qValLin = (a, b, x) => { const v = a * x + b; return { tipus: 'enter', escrit: true, html: `${qL(a, b)} &nbsp;si&nbsp; x = ${qNz(x)}`, valor: v, errs: qErrs(v, [[a * Math.abs(x) + b, 'signeVal'], [(a + b) * x, 'ordreOp'], [a + x + b, 'substit'], [-(v), 'signeVal']]), llarg: false, a, b, x }; };
const Q2 = {};
Q2.lin = (nv, { n = 3 } = {}) => {
  const its = qUnics(n, () => { const a = nv === 1 ? qR(2, 6) : (Math.random() < .3 ? -qR(2, 5) : qR(2, 7)); const b = (Math.random() < .5 ? -1 : 1) * qR(1, 9); const x = nv === 1 ? qR(1, 6) : (Math.random() < .6 ? -qR(1, 6) : qR(1, 6)); return qValLin(a, b, x); }, it => it.html);
  return { sig: `b1-${its.map(i => i.html).join('|')}`, enunciat: `Calcula el valor de cada expressió.`, visual: nv === 1 ? () => `<div class="q-eq">2x + 1 &nbsp;si x = 3<br>2 · <span class="m">3</span> + 1<br>= 6 + 1<br>= <span class="m">7</span></div>` : null, pista: PISTA_Q2, ...apartats(its),
    explicacio: `Substitueix la x i calcula.`, solucio: its.map(it => `${qNz(it.a)} · ${qP(it.x)} ${it.b < 0 ? '−' : '+'} ${Math.abs(it.b)} = <b>${qNz(it.valor)}</b>`) };
};
Q2.taula = (nv) => {
  const a = qR(2, 5) * (nv === 3 && Math.random() < .5 ? -1 : 1), b = (Math.random() < .5 ? -1 : 1) * qR(1, 6);
  const xs = nv === 1 ? [0, 1, 2, 3] : barreja([-2, -1, 0, 1, 2, 3]).slice(0, 4).sort((p, q) => p - q);
  const its = xs.map(x => { const it = qValLin(a, b, x); it.html = `x = ${qNz(x)}`; return it; });
  return { sig: `b2-${a}_${b}_${xs.join('_')}`, enunciat: `Completa la taula de valors de <b>${qL(a, b)}</b>.`, visual: () => `<table class="q-taula"><tr><th>x</th>${xs.map(x => `<td>${qNz(x)}</td>`).join('')}</tr><tr><th>${qL(a, b)}</th>${xs.map(() => '<td>?</td>').join('')}</tr></table>`, pista: PISTA_Q2, ...apartats(its),
    explicacio: `Fes el mateix càlcul per a cada valor de x.`, solucio: its.map(it => `x = ${qNz(it.x)}: ${it.a} · ${qP(it.x)} ${it.b < 0 ? '−' : '+'} ${Math.abs(it.b)} = <b>${qNz(it.valor)}</b>`) };
};
Q2.quad = (nv, { n = 3 } = {}) => {
  const its = qUnics(n, () => { const b = (Math.random() < .5 ? -1 : 1) * qR(1, 9); const x = (Math.random() < .5 ? -1 : 1) * qR(1, 5); const v = x * x + b;
    return { tipus: 'enter', escrit: true, html: `x² ${b < 0 ? '−' : '+'} ${Math.abs(b)} &nbsp;si&nbsp; x = ${qNz(x)}`, valor: v, errs: qErrs(v, [[-x * x + b, 'quadNeg'], [2 * x + b, 'dobleQuad']]), x, b }; }, it => it.html);
  return { sig: `b3-${its.map(i => i.html).join('|')}`, enunciat: `Calcula. Compte amb el quadrat dels negatius!`, visual: () => `<div class="q-eq">(−3)² = (−3) · (−3) = <span class="m">+9</span></div>`, pista: { completa: `x² = x · x. Si x = −3, x² = (−3) · (−3) = +9.`, mitja: `Menys per menys fa més.` }, ...apartats(its),
    explicacio: `El quadrat d'un negatiu sempre és positiu.`, solucio: its.map(it => `${qP(it.x)}² ${it.b < 0 ? '−' : '+'} ${Math.abs(it.b)} = ${it.x * it.x} ${it.b < 0 ? '−' : '+'} ${Math.abs(it.b)} = <b>${qNz(it.valor)}</b>`) };
};
Q2.context = (nv, { n = 2 } = {}) => {
  const C = [
    () => { const f = qR(2, 5), h = qR(10, 20), x = qR(2, 6); return { t: `Un lampista cobra ${f * 5} € fixos més ${h} € per hora: <b>${h}x + ${f * 5}</b>. Quant cobra per ${x} hores?`, v: h * x + f * 5, u: '€' }; },
    () => { const p = qR(4, 9), x = qR(3, 8); return { t: `Les entrades del cinema costen ${p} € i hi ha 2 € de despeses: <b>${p}x + 2</b>. Quant pagues per ${x} entrades?`, v: p * x + 2, u: '€' }; },
    () => { const x = qR(5, 15); return { t: `El perímetre d'un rectangle de x cm per 4 cm és <b>2x + 8</b>. Quant fa si x = ${x}?`, v: 2 * x + 8, u: 'cm' }; },
    () => { const x = qR(2, 9); return { t: `La temperatura d'un congelador, x hores després d'endollar-lo, és <b>20 − 5x</b> graus. Quina temperatura fa a les ${x} hores?`, v: 20 - 5 * x, u: '°C' }; }
  ];
  const fs = barreja(C).slice(0, n).map(f => f());
  const its = fs.map(f => ({ tipus: 'enter', escrit: true, llarg: true, html: f.t, valor: f.v, unitat: f.u }));
  return { sig: `b4-${fs.map(f => f.t.slice(0, 20) + f.v).join('|')}`, enunciat: `Fórmules de la vida real.`, visual: null, pista: PISTA_Q2, ...apartats(its),
    explicacio: `Substitueix la x pel valor que et donen.`, solucio: its.map(it => `<b>${qNz(it.valor)} ${it.unitat}</b>`) };
};
TEMES.q2 = {
  gen: Q2, signeEscrit: true,
  sequencia: {
    1: [['lin', { n: 3 }], ['taula'], ['lin', { n: 3 }], ['context', { n: 2 }], ['taula'], ['lin', { n: 4 }], ['context', { n: 2 }], ['taula']],
    2: [['lin', { n: 4 }], ['taula'], ['quad', { n: 3 }], ['context', { n: 2 }], ['lin', { n: 4 }], ['taula'], ['quad', { n: 3 }], ['context', { n: 2 }]],
    3: [['lin', { n: 4 }], ['quad', { n: 3 }], ['taula'], ['context', { n: 3 }], ['quad', { n: 4 }], ['lin', { n: 4 }], ['taula'], ['context', { n: 3 }]]
  },
  explicacio: [
    { text: `<p>Si sabem quant val la x, podem calcular l'expressió: és el <b class="parpelleja">valor numèric</b>.</p><p class="petit">2x + 1 si x = 3 → 2 · 3 + 1 = <b>7</b></p>`, vis: () => `<div class="q-eq">2x + 1<br><span class="m">x = 3</span> ↓<br>2 · 3 + 1 = 7</div>` },
    { text: `<p>Recorda la <b class="parpelleja">prioritat</b>: primer multipliquem i després sumem.</p><p class="petit">2 · 3 + 1 = 6 + 1 = 7 (no 2 · 4 = 8!)</p>`, vis: () => `<div class="q-eq">2 · 3 + 1<br>= <span class="m">6</span> + 1<br>= 7</div>` },
    { text: `<p>Si la x és <b class="parpelleja">negativa</b>, posa-la entre parèntesis.</p><p class="petit">3x − 2 si x = −4 → 3 · (−4) − 2 = −12 − 2 = <b>−14</b></p>`, vis: () => `<div class="q-eq">3 · <span class="b">(−4)</span> − 2<br>= −12 − 2 = −14</div>` },
    { text: `<p>Les fórmules de la vida real funcionen igual.</p><p class="petit">Un taxi: 2x + 3 euros per x km. Per 10 km: 2 · 10 + 3 = <b>23 €</b>.</p>`, vis: () => `<div class="q-eq">🚕 2x + 3<br>x = 10 → <span class="m">23 €</span></div>` }
  ],
  exemple: (nv) => {
    if (nv === 1) return { enunciat: `Calcula 4x − 3 si x = 2.`, passos: [
      { text: `Canvio la x per 2: 4 · 2 − 3.`, vis: `<div class="q-eq">4 · <span class="m">2</span> − 3</div>` },
      { text: `8 − 3 = <b>5</b>. <span class="marca-ok">✓</span>`, vis: `<div class="q-eq">4 · 2 − 3<br>= 8 − 3<br>= <span class="m">5</span></div>` }] };
    if (nv === 2) return { enunciat: `Calcula 5x + 4 si x = −2.`, passos: [
      { text: `x és negativa: la poso entre parèntesis. 5 · (−2) + 4.`, vis: `<div class="q-eq">5 · <span class="b">(−2)</span> + 4</div>` },
      { text: `−10 + 4 = <b>−6</b>. <span class="marca-ok">✓</span>`, vis: `<div class="q-eq">5 · (−2) + 4<br>= −10 + 4<br>= <span class="m">−6</span></div>` }] };
    return { enunciat: `Calcula x² − 3x si x = −2.`, passos: [
      { text: `(−2)² − 3 · (−2).`, vis: `<div class="q-eq">(−2)² − 3 · (−2)</div>` },
      { text: `4 + 6 = <b>10</b>. <span class="marca-ok">✓</span>`, vis: `<div class="q-eq">(−2)² − 3 · (−2)<br>= 4 + 6<br>= <span class="m">10</span></div>` }] };
  }
};

/* =====================================================================
   OBJECTIU 3 · TERMES SEMBLANTS
   ===================================================================== */
const PISTA_Q3 = { completa: `Ajunta les <b>x amb les x</b> i els <b>números amb els números</b>, cadascun amb el seu signe. 7x + 4 − 3x − 1 = (7x − 3x) + (4 − 1) = 4x + 3.`, mitja: `x amb x, números amb números.` };
const qTermes = (ts) => ts.map((t, i) => { const [c, isx] = t; const txt = isx ? (Math.abs(c) === 1 ? 'x' : Math.abs(c) + 'x') : String(Math.abs(c)); return i === 0 ? (c < 0 ? '−' : '') + txt : (c < 0 ? ' − ' : ' + ') + txt; }).join('');
const Q3 = {};
Q3.semblants = (nv, { n = 4 } = {}) => {
  const P = [['3x', '5x', true], ['2x', '−x', true], ['4x', 'x²', false], ['7', '−2', true], ['3x', '3', false], ['x', '6x', true], ['2x²', 'x²', true], ['5', '5x', false], ['−4x', '9x', true], ['x²', '2x', false]];
  const ds = barreja(P).slice(0, n);
  const its = ds.map(([a, b, si]) => ({ tipus: 'tria', html: `<b>${a}</b> i <b>${b}</b>`, opcions: [{ html: 'Semblants', val: 'si' }, { html: 'No semblants', val: 'no' }], correcta: si ? 'si' : 'no', etiq: si ? {} : { si: 'barreja' }, a, b, si }));
  return { sig: `c1-${ds.map(d => d[0] + d[1]).join('|')}`, enunciat: `Són <b>termes semblants</b> (es poden ajuntar)?`, visual: () => `<div class="q-eq"><span class="m">3x</span> i <span class="m">5x</span> → sí<br>3x i <span class="b">x²</span> → no<br>4 i <span class="b">4x</span> → no</div>`, pista: { completa: `Són semblants si tenen la <b>mateixa part de lletra</b>: x amb x, x² amb x², números sols amb números sols.`, mitja: `Mira la part de la lletra.` }, ...apartats(its),
    explicacio: `Només s'ajunten els termes amb la mateixa lletra.`, solucio: its.map(it => `${it.a} i ${it.b}: <b>${it.si ? 'sí' : 'no'}</b>`) };
};
Q3.nomesX = (nv, { n = 3 } = {}) => {
  const its = qUnics(n, () => { const k = nv === 1 ? 2 : qR(2, 3); const cs = Array.from({ length: k }, (_, i) => i === 0 ? qR(2, 8) : (Math.random() < .4 ? -1 : 1) * qR(1, 6)); const s = cs.reduce((p, q) => p + q, 0); if (s === 0) return null;
    const ops = qOps({ html: qL(s, 0) }, [{ html: qL(cs.reduce((p, q) => p + Math.abs(q), 0), 0), tag: 'signeTerme' }, { html: `${s}x${'²'}`, tag: 'barreja' }, { html: qL(s + 1, 0) }]);
    return { tipus: 'tria', html: qTermes(cs.map(c => [c, true])) + ' =', opcions: ops, correcta: 'b', etiq: qEtiq(ops), s }; }, it => it.html);
  return { sig: `c2-${its.map(i => i.html).join('|')}`, enunciat: `Redueix: ajunta les x.`, visual: nv === 1 ? () => `<div class="q-eq">3x + 2x = (3 + 2)x = <span class="m">5x</span></div>` : null, pista: PISTA_Q3, ...apartats(its),
    explicacio: `Suma els números que porten les x, amb el seu signe.`, solucio: its.map(it => `${it.html} <b>${qL(it.s, 0)}</b>`) };
};
Q3.reduir = (nv, { n = 3 } = {}) => {
  const its = qUnics(n, () => { const nx = nv === 1 ? 2 : 3, nn = 2; const xs = Array.from({ length: nx }, (_, i) => i === 0 ? qR(2, 9) : (Math.random() < .5 ? -1 : 1) * qR(1, 6)); const ns = Array.from({ length: nn }, () => (Math.random() < .5 ? -1 : 1) * qR(1, 9));
    const a = xs.reduce((p, q) => p + q, 0), b = ns.reduce((p, q) => p + q, 0); if (a === 0) return null;
    const ts = barreja([...xs.map(c => [c, true]), ...ns.map(c => [c, false])]); if (!ts[0][1] && ts[0][0] < 0) ts.reverse();
    const errs = { [`${a + b}|0`]: 'barreja', [`${xs.reduce((p, q) => p + Math.abs(q), 0)}|${b}`]: 'signeTerme', [`${a}|${ns.reduce((p, q) => p + Math.abs(q), 0)}`]: 'signeTerme' }; delete errs[`${a}|${b}`];
    return { tipus: 'lin', html: qTermes(ts) + ' =', a, b, errs }; }, it => it.html);
  return { sig: `c3-${its.map(i => i.html).join('|')}`, enunciat: `Redueix cada expressió: <b>□x □</b>.`, visual: nv === 1 ? () => `<div class="q-eq"><span class="m">7x</span> + <span class="b">4</span> <span class="m">− 3x</span> <span class="b">− 1</span><br>= <span class="m">4x</span> <span class="b">+ 3</span></div>` : null, pista: PISTA_Q3, ...apartats(its),
    explicacio: `Primer les x i després els números.`, solucio: its.map(it => `${it.html} <b>${qL(it.a, it.b)}</b>`) };
};
TEMES.q3 = {
  gen: Q3,
  sequencia: {
    1: [['semblants', { n: 4 }], ['nomesX', { n: 3 }], ['nomesX', { n: 3 }], ['semblants', { n: 4 }], ['reduir', { n: 2 }], ['nomesX', { n: 3 }], ['reduir', { n: 2 }], ['reduir', { n: 3 }]],
    2: [['semblants', { n: 4 }], ['nomesX', { n: 3 }], ['reduir', { n: 3 }], ['semblants', { n: 5 }], ['reduir', { n: 3 }], ['nomesX', { n: 4 }], ['reduir', { n: 3 }], ['reduir', { n: 4 }]],
    3: [['reduir', { n: 3 }], ['semblants', { n: 5 }], ['reduir', { n: 4 }], ['nomesX', { n: 4 }], ['reduir', { n: 4 }], ['semblants', { n: 5 }], ['reduir', { n: 4 }], ['reduir', { n: 4 }]]
  },
  explicacio: [
    { text: `<p>Imagina que <b>x</b> és una poma 🍎. Llavors 3x + 2x són 3 pomes i 2 pomes: <b class="parpelleja">5 pomes</b>, 5x.</p>`, vis: () => `<div class="q-eq">🍎🍎🍎 + 🍎🍎 = 🍎🍎🍎🍎🍎<br><span class="m">3x + 2x = 5x</span></div>` },
    { text: `<p>Però pomes i peres no s'ajunten! 🍎 + 🍐: <b>3x + 2</b> ja no es pot fer més curt.</p><p class="petit">Les x amb les x, els números amb els números: són <b class="parpelleja">termes semblants</b>.</p>`, vis: () => `<div class="q-eq">3x + 2 <span class="b">≠</span> 5x</div>` },
    { text: `<p>Cada terme porta el <b class="parpelleja">signe de davant</b>.</p><p class="petit">7x − 3x = 4x, perquè el 3x resta.</p>`, vis: () => `<div class="q-eq">7x <span class="m">− 3x</span> = 4x</div>` },
    { text: `<p>Per reduir: <b>1r</b> les x, <b>2n</b> els números.</p><p class="petit">7x + 4 − 3x − 1 = <span>(7 − 3)x</span> + (4 − 1) = <b>4x + 3</b></p>`, vis: () => `<div class="q-eq"><span class="m">7x</span> + <span class="b">4</span> <span class="m">− 3x</span> <span class="b">− 1</span><br>= <span class="m">4x</span> <span class="b">+ 3</span></div>` }
  ],
  exemple: (nv) => {
    if (nv === 1) return { enunciat: `Redueix 5x + 3x − x.`, passos: [
      { text: `Totes són x: 5 + 3 − 1 = 7.`, vis: `<div class="q-eq">(5 + 3 − 1)x</div>` },
      { text: `El resultat és <b>7x</b>. <span class="marca-ok">✓</span>`, vis: `<div class="q-eq"><span class="m">7x</span></div>` }] };
    if (nv === 2) return { enunciat: `Redueix 6x − 2 + x + 9.`, passos: [
      { text: `Les x: 6x + x = 7x.`, vis: `<div class="q-eq"><span class="m">6x + x = 7x</span></div>` },
      { text: `Els números: −2 + 9 = 7. Resultat: <b>7x + 7</b>. <span class="marca-ok">✓</span>`, vis: `<div class="q-eq">7x <span class="b">+ 7</span></div>` }] };
    return { enunciat: `Redueix 4x − 5 − 6x + 2.`, passos: [
      { text: `Les x: 4x − 6x = −2x.`, vis: `<div class="q-eq"><span class="m">−2x</span></div>` },
      { text: `Els números: −5 + 2 = −3. Resultat: <b>−2x − 3</b>. <span class="marca-ok">✓</span>`, vis: `<div class="q-eq">−2x <span class="b">− 3</span></div>` }] };
  }
};

/* =====================================================================
   OBJECTIU 4 · EQUACIÓ I SOLUCIÓ
   ===================================================================== */
const PISTA_Q4 = { completa: `Una solució fa que les dues bandes de l'igual donin <b>el mateix</b>. Canvia la x pel número i calcula cada banda.`, mitja: `Substitueix i compara les dues bandes.` };
const Q4 = {};
Q4.esSol = (nv, { n = 3 } = {}) => {
  const its = qUnics(n, () => { const a = qR(1, nv === 1 ? 4 : 6), b = (Math.random() < .5 ? -1 : 1) * qR(1, 9), x = nv === 1 ? qR(1, 6) : qR(-4, 6); const c = a * x + b;
    const prova = Math.random() < .5 ? x : x + (Math.random() < .5 ? 1 : -1) * qR(1, 2); const si = prova === x;
    return { tipus: 'tria', llarg: true, html: `x = ${qNz(prova)} és solució de <b>${qL(a, b)} = ${qNz(c)}</b>?`, opcions: [{ html: 'Sí', val: 'si' }, { html: 'No', val: 'no' }], correcta: si ? 'si' : 'no', etiq: { [si ? 'no' : 'si']: 'substit' }, a, b, c, prova }; }, it => it.html);
  return { sig: `d1-${its.map(i => i.html).join('|')}`, enunciat: `Comprova si el número és solució de l'equació.`, visual: () => `<div class="q-eq">2x + 1 = 7 &nbsp;x = 3?<br>2 · 3 + 1 = <span class="m">7</span> ✓</div>`, pista: PISTA_Q4, ...apartats(its),
    explicacio: `Substitueix i mira si dona el mateix a les dues bandes.`, solucio: its.map(it => `${it.a === 1 ? '' : it.a + ' · '}${qP(it.prova)} ${it.b < 0 ? '−' : '+'} ${Math.abs(it.b)} = ${qNz(it.a * it.prova + it.b)} ${it.a * it.prova + it.b === it.c ? '= ' : '≠ '}${qNz(it.c)}: <b>${it.correcta === 'si' ? 'sí' : 'no'}</b>`) };
};
Q4.tempteig = (nv, { n = 3 } = {}) => {
  const fer = () => { const t = qR(0, nv === 1 ? 2 : 3); const x = qR(2, 9);
    if (t === 0) { const a = qR(2, 9); return { ...qX(`<b>x + ${a} = ${x + a}</b> <span class="q-xeq">x =</span>`, x), errs: qErrs(x, [[2 * x + a, 'transSigne']]), q: `Quin nombre més ${a} fa ${x + a}?`, e: `x + ${a} = ${x + a}` }; }
    if (t === 1) { const a = qR(1, x - 1); return { ...qX(`<b>x − ${a} = ${x - a}</b> <span class="q-xeq">x =</span>`, x), errs: qErrs(x, [[x - 2 * a, 'transSigne']]), q: `Quin nombre menys ${a} fa ${x - a}?`, e: `x − ${a} = ${x - a}` }; }
    if (t === 2) { const a = qR(2, 6); return { ...qX(`<b>${a}x = ${a * x}</b> <span class="q-xeq">x =</span>`, x), errs: qErrs(x, [[a * x - a, 'passaRestant'], [a * a * x, 'passaMult']]), q: `Quin nombre per ${a} fa ${a * x}?`, e: `${a}x = ${a * x}` }; }
    const a = qR(2, 5); return { ...qX(`<b>x : ${a} = ${x}</b> <span class="q-xeq">x =</span>`, a * x), errs: qErrs(a * x, [[x + a, 'passaRestant']]), q: `Quin nombre dividit entre ${a} fa ${x}?`, e: `x : ${a} = ${x}` }; };
  const its = qUnics(n, fer, it => it.e);
  return { sig: `d2-${its.map(i => i.e).join('|')}`, enunciat: `Troba la solució <b>pensant</b> (per tempteig).`, visual: () => `<div class="q-eq">x + 5 = 12<br><span class="m">Quin nombre més 5 fa 12?</span></div>`, pista: { completa: its.map(i => i.q).join('<br>'), mitja: `Fes-te la pregunta: quin nombre…?` }, ...apartats(its),
    explicacio: `Pregunta't quin nombre fa que l'igualtat sigui certa.`, solucio: its.map(it => `${it.e}: <b>x = ${it.valor}</b>`) };
};
Q4.tipus = (nv, { n = 3 } = {}) => {
  const P = [['5 + 2 = 7', 'ig'], ['3 + x = 10', 'eq'], ['x + x = 2x', 'id'], ['8 − 3 = 6', 'ig'], ['2x = 14', 'eq'], ['a + b = b + a', 'id'], ['4 · 3 = 12', 'ig'], ['x − 1 = 9', 'eq'], ['3x − x = 2x', 'id']];
  const ds = barreja(P).slice(0, n); const OPS = [{ html: 'Igualtat numèrica', val: 'ig' }, { html: 'Identitat (certa sempre)', val: 'id' }, { html: 'Equació (només per a un valor)', val: 'eq' }];
  const its = ds.map(([h, t]) => ({ tipus: 'tria', llarg: true, html: `<b>${h}</b>`, opcions: OPS, correcta: t, etiq: {}, t }));
  return { sig: `d3-${ds.map(d => d[0]).join('|')}`, enunciat: `Què és cada expressió?`, visual: () => `<div class="q-frase"><span>només números</span>→<b>igualtat</b><span>certa per a tot x</span>→<b>identitat</b><span>només per a un x</span>→<b>equació</b></div>`, pista: { completa: `Si no té lletres, és una igualtat numèrica. Si és certa doni el valor que doni a la x, és una identitat. Si només és certa per a un valor, és una equació.`, mitja: `Prova-ho amb x = 1 i amb x = 2.` }, ...apartats(its),
    explicacio: `Una equació només és certa per a la solució.`, solucio: ds.map(([h, t]) => `${h}: <b>${t === 'ig' ? 'igualtat' : t === 'id' ? 'identitat' : 'equació'}</b>`) };
};
TEMES.q4 = {
  gen: Q4, signeEscrit: true,
  sequencia: {
    1: [['tempteig', { n: 3 }], ['esSol', { n: 3 }], ['tempteig', { n: 3 }], ['esSol', { n: 3 }], ['tempteig', { n: 4 }], ['esSol', { n: 3 }], ['tempteig', { n: 4 }], ['esSol', { n: 4 }]],
    2: [['esSol', { n: 3 }], ['tempteig', { n: 4 }], ['tipus', { n: 3 }], ['esSol', { n: 4 }], ['tempteig', { n: 4 }], ['tipus', { n: 4 }], ['esSol', { n: 4 }], ['tempteig', { n: 4 }]],
    3: [['esSol', { n: 4 }], ['tipus', { n: 4 }], ['tempteig', { n: 4 }], ['esSol', { n: 4 }], ['tipus', { n: 4 }], ['tempteig', { n: 4 }], ['esSol', { n: 4 }], ['tipus', { n: 4 }]]
  },
  explicacio: [
    { text: `<p>Una <b class="parpelleja">equació</b> és una igualtat amb una lletra que no sabem.</p><p class="petit">x + 5 = 12 → a l'esquerra hi ha el <b>primer membre</b> i a la dreta, el <b>segon</b>.</p>`, vis: () => `<div class="q-eq"><span class="m">x + 5</span> = <span class="b">12</span></div>` },
    { text: `<p>Resoldre una equació és trobar la <b class="parpelleja">solució</b>: el valor de x que fa que les dues bandes donin el mateix.</p><p class="petit">x + 5 = 12 → x = 7, perquè 7 + 5 = 12.</p>`, vis: () => qBalanca(['x', 5], [12]) },
    { text: `<p>Les equacions fàcils es resolen <b class="parpelleja">pensant</b> (per tempteig).</p><p class="petit">3x = 15 → quin nombre per 3 fa 15? <b>5</b>.</p>`, vis: () => `<div class="q-eq">3x = 15<br><span class="m">3 · ? = 15</span> → x = 5</div>` },
    { text: `<p>Sempre podem <b class="parpelleja">comprovar</b> la solució: canviem la x pel número.</p><p class="petit">2x + 1 = 9, x = 4? → 2 · 4 + 1 = 9 ✓</p>`, vis: () => `<div class="q-eq">2 · <span class="m">4</span> + 1 = 9 ✓</div>` }
  ],
  exemple: (nv) => {
    if (nv === 1) return { enunciat: `Resol x − 3 = 5 pensant.`, passos: [
      { text: `Quin nombre menys 3 fa 5?`, vis: `<div class="q-eq">? − 3 = 5</div>` },
      { text: `8 − 3 = 5 → <b>x = 8</b>. <span class="marca-ok">✓</span>`, vis: `<div class="q-eq"><span class="m">x = 8</span></div>` }] };
    if (nv === 2) return { enunciat: `x = 2 és solució de 3x − 1 = 5?`, passos: [
      { text: `Substitueixo: 3 · 2 − 1 = 6 − 1 = 5.`, vis: `<div class="q-eq">3 · 2 − 1 = 5</div>` },
      { text: `Dona 5, igual que l'altra banda: <b>sí</b> és solució. <span class="marca-ok">✓</span>`, vis: `<div class="q-eq">5 = 5 ✓</div>` }] };
    return { enunciat: `x + x = 2x és una equació?`, passos: [
      { text: `Provo x = 1: 1 + 1 = 2 ✓. Provo x = 5: 5 + 5 = 10 ✓.`, vis: `<div class="q-eq">sempre és certa</div>` },
      { text: `És certa per a tots els valors: és una <b>identitat</b>, no una equació. <span class="marca-ok">✓</span>`, vis: `<div class="q-eq"><span class="m">identitat</span></div>` }] };
  }
};

/* =====================================================================
   OBJECTIU 5 · EQUACIONS D'UN PAS (transposició)
   ===================================================================== */
const PISTA_Q5 = { completa: `Què <b>molesta</b> a la x? Passa-ho a l'altra banda amb l'operació <b>contrària</b>: el que suma passa restant, el que resta passa sumant, el que multiplica passa dividint i el que divideix passa multiplicant.`, mitja: `Operació contrària a l'altra banda.` };
function qUnPas(nv) {
  const t = qR(0, 4); const neg = nv >= 2; const x = neg ? qR(-8, 9) || 3 : qR(1, 12);
  if (t === 0) { const a = qR(1, 12); const b = x + a; return { e: `x + ${a} = ${qNz(b)}`, x, errs: qErrs(x, [[b + a, 'transSigne']]), col: [[`x ${qM('+ ' + a)}`, qNz(b)], ['x', `${qNz(b)} ${qM('− ' + a)}`, 'passa restant'], ['x', qNz(x)]] }; }
  if (t === 1) { const a = qR(1, 12); const b = x - a; return { e: `x − ${a} = ${qNz(b)}`, x, errs: qErrs(x, [[b - a, 'transSigne']]), col: [[`x ${qM('− ' + a)}`, qNz(b)], ['x', `${qNz(b)} ${qM('+ ' + a)}`, 'passa sumant'], ['x', qNz(x)]] }; }
  if (t === 2) { const a = qR(2, 9) * (nv === 3 && Math.random() < .4 ? -1 : 1); const b = a * x; return { e: `${qNz(a)}x = ${qNz(b)}`, x, errs: qErrs(x, [[b - a, 'passaRestant'], [-x, 'signeDiv'], [b * a, 'passaMult']]), col: [[`${qM(qNz(a))}x`, qNz(b)], ['x', `${qNz(b)} ${qM(': ' + qP(a))}`, 'passa dividint'], ['x', qNz(x)]] }; }
  if (t === 3) { const a = qR(2, 6); const q = neg ? qR(-6, 8) || 2 : qR(1, 8); return { e: `x : ${a} = ${qNz(q)}`, x: q * a, errs: qErrs(q * a, [[a === 0 ? 0 : Math.trunc(q / a), 'passaMult'], [q - a, 'passaRestant'], [q + a, 'passaRestant']]), col: [[`x ${qM(': ' + a)}`, qNz(q)], ['x', `${qNz(q)} ${qM('· ' + a)}`, 'passa multiplicant'], ['x', qNz(q * a)]] }; }
  if (nv === 1) { const a = qR(1, 9); return { e: `${a} + x = ${x + a}`, x, errs: qErrs(x, [[x + 2 * a, 'transSigne']]), col: [[`${qM(a + ' +')} x`, x + a], ['x', `${x + a} ${qM('− ' + a)}`, 'passa restant'], ['x', x]] }; }
  const b = qR(1, 9) * (Math.random() < .5 ? -1 : 1); return { e: `−x = ${qNz(b)}`, x: -b, errs: qErrs(-b, [[b, 'menysX']]), col: [['−x', qNz(b)], ['x', qNz(-b), 'canvio el signe als dos costats']] };
}
const Q5 = {};
Q5.resol = (nv, { n = 4, tipus = null } = {}) => {
  const its = qUnics(n, () => { const q = qUnPas(nv); return { ...qX(`<b>${q.e}</b> <span class="q-xeq">x =</span>`, q.x), errs: q.errs, q }; }, it => it.html);
  return { sig: `e1-${its.map(i => i.html).join('|')}`, enunciat: `Resol: deixa la x sola.`, visual: nv === 1 ? () => qContraria : null, pista: PISTA_Q5, ...apartats(its),
    explicacio: `El que molesta passa a l'altra banda amb l'operació contrària.`, solucio: its.map(it => qCol(it.q.col, { petita: true })) };
};
Q5.balanca = (nv) => {
  const a = qR(2, 5), x = qR(1, 5);
  const it = { ...qX(`<b>x + ${a} = ${x + a}</b> <span class="q-xeq">x =</span>`, x), errs: qErrs(x, [[x + 2 * a, 'transSigne']]) };
  return { sig: `e2-${a}-${x}`, enunciat: `La balança està equilibrada. Si traiem ${a} de cada plat, què queda?`, visual: () => `<div style="display:flex;flex-direction:column;align-items:center;gap:4px">${qBalanca(['x', a], [x + a])}<div class="petit">A l'esquerra: una caixa x i un pes de ${a}. A la dreta: un pes de ${x + a}.</div></div>`, pista: { completa: `Treu ${a} de cada plat: a l'esquerra queda la x i a la dreta, ${x + a} − ${a}. És el mateix que «el +${a} passa restant».`, mitja: `Treu el mateix dels dos plats.` }, ...apartats([it]),
    explicacio: `Treure ${a} dels dos plats = passar el +${a} a l'altra banda restant.`, solucio: [qCol([[`x ${qM('+ ' + a)}`, x + a], ['x', `${x + a} ${qM('− ' + a)}`, `trec ${a} de cada plat`], ['x', x]], { petita: true })] };
};
Q5.quinaOp = (nv, { n = 3 } = {}) => {
  const OPS = [{ html: 'Restant', val: '-' }, { html: 'Sumant', val: '+' }, { html: 'Dividint', val: ':' }, { html: 'Multiplicant', val: '·' }];
  const C = [['x + 7 = 10', 'el 7', '-'], ['x − 4 = 9', 'el 4', '+'], ['5x = 20', 'el 5', ':'], ['x : 3 = 6', 'el 3', '·'], ['x + 12 = 4', 'el 12', '-'], ['8x = 40', 'el 8', ':'], ['x − 9 = −2', 'el 9', '+'], ['x : 5 = 2', 'el 5', '·']];
  const ds = barreja(C).slice(0, n);
  const its = ds.map(([e, q, op]) => ({ tipus: 'tria', llarg: true, html: `<b>${e}</b>: ${q} passa a l'altra banda…`, opcions: OPS, correcta: op, etiq: Object.fromEntries(OPS.filter(o => o.val !== op).map(o => [o.val, op === ':' && o.val === '-' ? 'passaRestant' : op === '·' && o.val === ':' ? 'passaMult' : 'transSigne'])), e, op }));
  return { sig: `e3-${ds.map(d => d[0]).join('|')}`, enunciat: `Com passa cada número a l'altra banda?`, visual: () => qContraria, pista: PISTA_Q5, ...apartats(its),
    explicacio: `Sempre l'operació contrària.`, solucio: its.map(it => `${it.e}: <b>${OPS.find(o => o.val === it.op).html.toLowerCase()}</b>`) };
};
TEMES.q5 = {
  gen: Q5, signeEscrit: true,
  sequencia: {
    1: [['balanca'], ['quinaOp', { n: 3 }], ['resol', { n: 3 }], ['balanca'], ['resol', { n: 4 }], ['quinaOp', { n: 4 }], ['resol', { n: 4 }], ['resol', { n: 4 }]],
    2: [['quinaOp', { n: 4 }], ['resol', { n: 4 }], ['resol', { n: 4 }], ['balanca'], ['resol', { n: 4 }], ['quinaOp', { n: 4 }], ['resol', { n: 4 }], ['resol', { n: 4 }]],
    3: [['resol', { n: 4 }], ['quinaOp', { n: 4 }], ['resol', { n: 4 }], ['resol', { n: 5 }], ['resol', { n: 4 }], ['resol', { n: 5 }], ['quinaOp', { n: 4 }], ['resol', { n: 5 }]]
  },
  explicacio: [
    { text: `<p>Una equació és com una <b class="parpelleja">balança equilibrada</b>: les dues bandes pesen el mateix.</p><p class="petit">x + 3 = 8: una caixa x i 3 quilos pesen igual que 8 quilos.</p>`, vis: () => qBalanca(['x', 3], [8]) },
    { text: `<p>Si traiem 3 de <b>cada plat</b>, la balança continua equilibrada i la x es queda sola.</p><p class="petit">Per això diem que el +3 <b class="parpelleja">passa a l'altra banda restant</b>.</p>`, vis: () => qBalanca(['x', 3], [8], { ratlla: ['e1'] }) },
    { text: `<p>La regla curta: el que <b class="parpelleja">molesta</b> passa a l'altra banda amb l'operació <b>contrària</b>.</p>`, vis: () => qContraria },
    { text: `<p>Si el número <b>multiplica</b> la x, passa <b class="parpelleja">dividint</b> (no restant!).</p><p class="petit">Fixa't com s'escriu: primer el número canvia de costat, i <b>a sota</b>, el resultat.</p>`, vis: () => qCol([[`${qM('3')}x`, '12'], ['x', `12 ${qM(': 3')}`, 'passa dividint'], ['x', '4']]) }
  ],
  exemple: (nv) => {
    const ex = (enun, C, t1, t2) => ({ enunciat: enun, passos: [{ text: t1, vis: qCol(C.slice(0, 2), { nou: 1 }) }, { text: t2 + ' <span class="marca-ok">✓</span>', vis: qCol(C, { nou: 1 }) }] });
    if (nv === 1) return ex(`Resol x + 5 = 12.`, [[`x ${qM('+ 5')}`, '12'], ['x', `12 ${qM('− 5')}`, 'passa restant'], ['x', '7']], `El <b>+5</b> molesta. El passo a l'altra banda <b>restant</b>.`, `Faig la resta i escric el resultat <b>a sota</b>: x = 7. Comprovo: 7 + 5 = 12.`);
    if (nv === 2) return ex(`Resol 4x = −20.`, [[`${qM('4')}x`, '−20'], ['x', `−20 ${qM(': 4')}`, 'passa dividint'], ['x', '−5']], `El <b>4</b> multiplica la x: passa a l'altra banda <b>dividint</b>.`, `Faig la divisió i escric el resultat <b>a sota</b>: x = −5. Comprovo: 4 · (−5) = −20.`);
    return ex(`Resol x : 3 = −4.`, [[`x ${qM(': 3')}`, '−4'], ['x', `−4 ${qM('· 3')}`, 'passa multiplicant'], ['x', '−12']], `El <b>3</b> divideix la x: passa a l'altra banda <b>multiplicant</b>.`, `Faig la multiplicació i escric el resultat <b>a sota</b>: x = −12. Comprovo: −12 : 3 = −4.`);
  }
};

/* =====================================================================
   OBJECTIU 6 · EQUACIONS DE DOS PASSOS
   ===================================================================== */
const PISTA_Q6 = { completa: `Primer passa el número que <b>suma o resta</b>, i després el que <b>multiplica</b>. Escriu cada pas <b>a sota</b> de l'anterior:<br>${qCol(qLinPassos(3, 4, 19, 5), { petita: true })}`, mitja: `1r el que suma o resta, 2n el que multiplica.` };
function qDosPassos(nv) {
  const a = qR(2, nv === 1 ? 6 : 9) * (nv === 3 && Math.random() < .3 ? -1 : 1); const x = nv === 1 ? qR(1, 9) : qR(-6, 9) || 2; const b = (Math.random() < .5 ? -1 : 1) * qR(1, 12); const c = a * x + b;
  const errs = qErrs(x, [[(c + b) / a, 'transSigne'], [c / a - b, 'ordrePassos'], [c - b - a, 'passaRestant'], [-x, 'signeDiv']]);
  return { e: `${qL(a, b)} = ${qNz(c)}`, x, a, b, c, errs };
}
const Q6 = {};
Q6.resol = (nv, { n = 3 } = {}) => {
  const its = qUnics(n, () => { const q = qDosPassos(nv); return { ...qX(`<b>${q.e}</b> <span class="q-xeq">x =</span>`, q.x), errs: q.errs, q }; }, it => it.html);
  return { sig: `f1-${its.map(i => i.html).join('|')}`, enunciat: `Resol les equacions.`, visual: nv === 1 ? () => qPassos() : null, pista: PISTA_Q6, ...apartats(its),
    explicacio: `Dos passos: primer el que suma o resta, després el que multiplica.`, solucio: its.map(({ q }) => qCol(qLinPassos(q.a, q.b, q.c, q.x), { petita: true })) };
};
Q6.pasAPas = (nv) => {
  const q = qDosPassos(nv); const OPS = [{ html: `el ${q.b < 0 ? '−' : '+'}${Math.abs(q.b)}`, val: 'b' }, { html: `el ${qNz(q.a)} que multiplica`, val: 'a' }];
  const its = [
    { tipus: 'tria', llarg: true, html: `<b>${q.e}</b>: què passo primer?`, opcions: OPS, correcta: 'b', etiq: { a: 'ordrePassos' } },
    { tipus: 'enter', escrit: true, senseMes: true, llarg: true, html: `Després de passar-lo: ${qNz(q.a)}x =`, valor: q.c - q.b, errs: qErrs(q.c - q.b, [[q.c + q.b, 'transSigne']]) },
    { ...qX(`Ara passo el ${qNz(q.a)} dividint: x =`, q.x), errs: qErrs(q.x, [[q.c - q.b - q.a, 'passaRestant'], [-q.x, 'signeDiv']]) }
  ];
  return { sig: `f2-${q.e}`, enunciat: `Resol pas a pas.`, visual: () => qPassos(1), pista: PISTA_Q6, ...apartats(its),
    explicacio: `Primer el que suma o resta.`, solucio: [`Primer, el ${q.b < 0 ? '−' : '+'}${Math.abs(q.b)}.`, qCol(qLinPassos(q.a, q.b, q.c, q.x).slice(0, 3), { petita: true }), qCol(qLinPassos(q.a, q.b, q.c, q.x).slice(2), { petita: true })] };
};
Q6.problema = (nv, { n = 2 } = {}) => {
  const C = [
    () => { const p = qR(3, 8), f = qR(2, 9), x = qR(3, 10); return { t: `Una entrada costa ${p} € i les despeses de gestió són ${f} €. Has pagat ${p * x + f} €. Quantes entrades has comprat?`, e: `${p}x + ${f} = ${p * x + f}`, x }; },
    () => { const x = qR(4, 15); return { t: `Penso un nombre, el multiplico per 3 i li sumo 5. Em dona ${3 * x + 5}. Quin nombre he pensat?`, e: `3x + 5 = ${3 * x + 5}`, x }; },
    () => { const x = qR(3, 12), a = qR(5, 12); return { t: `Un rectangle fa x cm de llarg i ${a} cm d'ample. El perímetre és ${2 * x + 2 * a} cm. Quant fa de llarg?`, e: `2x + ${2 * a} = ${2 * x + 2 * a}`, x }; },
    () => { const h = qR(10, 20), f = qR(15, 30), x = qR(2, 6); return { t: `Un lampista cobra ${f} € fixos i ${h} € per hora. Una factura és de ${f + h * x} €. Quantes hores ha treballat?`, e: `${h}x + ${f} = ${f + h * x}`, x }; },
    () => { const x = qR(3, 9); return { t: `La Laia té el doble de cromos que en Marc, i 4 més. La Laia en té ${2 * x + 4}. Quants en té en Marc?`, e: `2x + 4 = ${2 * x + 4}`, x }; }
  ];
  const fs = barreja(C).slice(0, n).map(f => f());
  const its = fs.map(f => ({ ...qX(f.t + ' <span class="q-xeq">x =</span>', f.x), e: f.e }));
  return { sig: `f3-${fs.map(f => f.e).join('|')}`, enunciat: `Problemes: escriu l'equació (mentalment o al paper) i resol-la.`, visual: null, pista: { completa: `Equacions: ${fs.map(f => '<b>' + f.e + '</b>').join(' · ')}`, mitja: `Escriu primer l'equació amb x.` }, ...apartats(its),
    explicacio: `Primer l'equació, després els dos passos.`, solucio: its.map(it => { const m = it.e.match(/^(\d+)x \+ (\d+) = (\d+)$/); return m ? qCol(qLinPassos(+m[1], +m[2], +m[3], it.valor), { petita: true }) : `${it.e}: <b>x = ${it.valor}</b>`; }) };
};
TEMES.q6 = {
  gen: Q6, signeEscrit: true,
  sequencia: {
    1: [['pasAPas'], ['pasAPas'], ['resol', { n: 2 }], ['pasAPas'], ['resol', { n: 3 }], ['problema', { n: 1 }], ['resol', { n: 3 }], ['resol', { n: 3 }]],
    2: [['pasAPas'], ['resol', { n: 3 }], ['resol', { n: 3 }], ['problema', { n: 2 }], ['resol', { n: 4 }], ['pasAPas'], ['problema', { n: 2 }], ['resol', { n: 4 }]],
    3: [['resol', { n: 3 }], ['problema', { n: 2 }], ['resol', { n: 4 }], ['resol', { n: 4 }], ['problema', { n: 2 }], ['resol', { n: 4 }], ['problema', { n: 2 }], ['resol', { n: 4 }]]
  },
  explicacio: [
    { text: `<p>A <b>3x + 4 = 19</b> molesten <b>dues</b> coses: el +4 i el 3.</p><p class="petit">Primer traiem el que <b class="parpelleja">suma o resta</b>, i després el que multiplica.</p>`, vis: () => qCol([[`${qBl('3')}x ${qM('+ 4')}`, '19']]) },
    { text: `<p><b>Pas 1:</b> el +4 passa a l'altra banda <b class="parpelleja">restant</b>.</p><p class="petit">I <b>a sota</b>, tornem a escriure l'equació amb la resta feta: 3x = 15.</p>`, vis: () => qCol(qLinPassos(3, 4, 19, 5).slice(0, 3)) },
    { text: `<p><b>Pas 2:</b> el 3 multiplica: passa a l'altra banda <b class="parpelleja">dividint</b>.</p><p class="petit">I <b>a sota</b>, la divisió feta: x = 5. Sempre cap avall, un pas a cada línia.</p>`, vis: () => qCol(qLinPassos(3, 4, 19, 5), { nou: 3 }) },
    { text: `<p>I sempre <b class="parpelleja">comprovem</b>: 3 · 5 + 4 = 19 ✓</p><p class="petit">El guió de cada equació:</p>`, vis: () => qPassos() }
  ],
  exemple: (nv) => {
    const ex = (enun, a, b, c, x, intro) => { const C = qLinPassos(a, b, c, x); const t = b > 0 ? 'restant' : 'sumant';
      return { enunciat: enun, passos: [...(intro ? [{ text: intro, vis: qCol([[`${qAx(a)} ${qSg(b)}`, qNz(c)]]) }] : []),
        { text: `Primer el <b>${b > 0 ? '+' : '−'}${Math.abs(b)}</b>: passa a l'altra banda <b>${t}</b>.`, vis: qCol(C.slice(0, 2), { nou: 1 }) },
        { text: `Faig l'operació i escric el resultat <b>a sota</b>: ${qAx(a)} = ${qNz(c - b)}.`, vis: qCol(C.slice(0, 3), { nou: 1 }) },
        { text: `Ara el <b>${a}</b>, que multiplica: passa <b>dividint</b>.`, vis: qCol(C.slice(0, 4), { nou: 1 }) },
        { text: `Faig la divisió, a sota: <b>x = ${qNz(x)}</b>. Comprovo: ${a} · ${qP(x)} ${qSg(b)} = ${qNz(c)}. <span class="marca-ok">✓</span>`, vis: qCol(C, { nou: 1 }) }] }; };
    if (nv === 1) return ex(`Resol 2x + 3 = 11.`, 2, 3, 11, 4);
    if (nv === 2) return ex(`Resol 5x − 7 = −22.`, 5, -7, -22, -3);
    return ex(`Penso un nombre, el multiplico per 4 i li resto 6. Dona 30. Quin és?`, 4, -6, 30, 9, `El nombre és la x. L'equació: <b>4x − 6 = 30</b>.`);
  }
};

/* =====================================================================
   OBJECTIU 7 · LA X ALS DOS COSTATS I PARÈNTESIS (N3: denominadors)
   ===================================================================== */
const PISTA_Q7 = { completa: `1r treu els parèntesis (el de fora multiplica <b>tots</b> els de dins). 2n les x a un costat i els números a l'altre (cada terme que canvia de costat canvia l'operació). 3r redueix. 4t passa el número que multiplica.`, mitja: `x a un costat, números a l'altre.` };
function qDosCostats(nv) {
  let a, c; do { a = qR(2, 9); c = qR(1, 8); } while (a === c || (nv === 1 && a < c));
  const x = nv === 1 ? qR(1, 8) : qR(-5, 8) || 3; const b = (Math.random() < .5 ? -1 : 1) * qR(1, 12); const d = (a - c) * x + b;
  const errs = qErrs(x, [[(d + b) / (a - c), 'transSigne'], [(d - b) / (a + c), 'transSigne'], [-x, 'signeDiv']]);
  return { e: qEq(a, b, c, d), x, a, b, c, d, errs };
}
function qParen(nv) {
  const k = qR(2, 5), p = (Math.random() < .5 ? -1 : 1) * qR(1, 6), m = (Math.random() < .5 ? -1 : 1) * qR(1, 9); // k(x + p) + m = r
  const x = nv === 2 ? qR(1, 8) : qR(-4, 8) || 2; const r = k * (x + p) + m;
  const errs = qErrs(x, [[(r - m - p) / k, 'parentesi'], [(r + m - k * p) / k, 'transSigne']]);
  return { e: `${k}(x ${p < 0 ? '−' : '+'} ${Math.abs(p)}) ${m < 0 ? '−' : '+'} ${Math.abs(m)} = ${qNz(r)}`, x, k, p, m, r, errs };
}
const Q7 = {};
Q7.dosCostats = (nv, { n = 3 } = {}) => {
  const its = qUnics(n, () => { const q = qDosCostats(nv); return { ...qX(`<b>${q.e}</b> <span class="q-xeq">x =</span>`, q.x), errs: q.errs, q }; }, it => it.html);
  return { sig: `g1-${its.map(i => i.html).join('|')}`, enunciat: `Resol: les x a l'esquerra i els números a la dreta.`, visual: nv === 1 ? () => qCol(qDosCostatsPassos(5, -3, 2, 9, 4)) : null, pista: PISTA_Q7, ...apartats(its),
    explicacio: `Les x a un costat, els números a l'altre.`, solucio: its.map(({ q }) => qCol(qDosCostatsPassos(q.a, q.b, q.c, q.d, q.x), { petita: true })) };
};
Q7.treuParen = (nv, { n = 3 } = {}) => {
  const its = qUnics(n, () => { const k = (nv === 3 && Math.random() < .3 ? -1 : 1) * qR(2, 6), p = (Math.random() < .5 ? -1 : 1) * qR(1, 9);
    const errs = { [`${k}|${p}`]: 'parentesi', [`${k}|${-k * p}`]: 'signeTerme' }; delete errs[`${k}|${k * p}`];
    return { tipus: 'lin', html: `${qNz(k)}(x ${p < 0 ? '−' : '+'} ${Math.abs(p)}) =`, a: k, b: k * p, errs }; }, it => it.html);
  return { sig: `g2-${its.map(i => i.html).join('|')}`, enunciat: `Treu els parèntesis: el de fora multiplica <b>tots</b> els de dins.`, visual: () => qCol([[`${qM('3')}(x − 2)`, `${qM('3')} · x ${qM('− 3')} · 2`, 'el 3 multiplica la x i el 2'], ['', '3x − 6']]), pista: PISTA_Q7, ...apartats(its),
    explicacio: `Multiplica el número de fora per cada terme de dins.`, solucio: its.map(it => `${it.html} <b>${qL(it.a, it.b)}</b>`) };
};
Q7.paren = (nv, { n = 3 } = {}) => {
  const its = qUnics(n, () => { const q = qParen(nv); return { ...qX(`<b>${q.e}</b> <span class="q-xeq">x =</span>`, q.x), errs: q.errs, q }; }, it => it.html);
  return { sig: `g3-${its.map(i => i.html).join('|')}`, enunciat: `Resol: primer treu els parèntesis.`, visual: null, pista: PISTA_Q7, ...apartats(its),
    explicacio: `Parèntesis, reduir, passar i dividir.`, solucio: its.map(({ q }) => qCol(qParenPassos(q), { petita: true })) };
};
Q7.denom = (nv, { n = 2 } = {}) => {
  const its = qUnics(n, () => { const [p, q] = tria([[2, 3], [2, 4], [3, 4], [2, 5], [3, 6], [4, 6]]); const m = p * q / mcdQ(p, q); const x = m * qR(1, 4) * (Math.random() < .3 ? -1 : 1); const b = qR(1, 9);
    const d = x / p + b - x / q; if (!Number.isInteger(d)) return null;
    return { ...qX(`<b>x/${p} + ${b} = x/${q} ${d < 0 ? '−' : '+'} ${Math.abs(d)}</b> <span class="q-xeq">x =</span>`, x), errs: qErrs(x, [[-x, 'signeDiv']]), p, q, b, d, m }; }, it => it.html);
  return { sig: `g4-${its.map(i => i.html).join('|')}`, enunciat: `Equacions amb denominadors (ampliació): multiplica-ho tot pel <b>mcm</b> dels denominadors.`, visual: () => qCol([['x/2 + 1', 'x/3 + 2'], [`${qM('6 ·')} x/2 + ${qM('6 ·')} 1`, `${qM('6 ·')} x/3 + ${qM('6 ·')} 2`, 'multiplico tot per 6 (el mcm)'], ...qDosCostatsPassos(3, 6, 2, 12, 6)]), pista: { completa: `Calcula el mcm dels denominadors i multiplica <b>tots</b> els termes per aquest número. Així desapareixen les fraccions.`, mitja: `Multiplica-ho tot pel mcm.` }, ...apartats(its),
    explicacio: `Amb el mcm les fraccions desapareixen i queda una equació com les d'abans.`, solucio: its.map(it => { const D = qDosCostatsPassos(it.m / it.p, it.m * it.b, it.m / it.q, it.m * it.d, it.valor); D[0][2] = `multiplico tot per ${it.m} (el mcm)`; return qCol([[`x/${it.p} + ${it.b}`, `x/${it.q} ${qSg(it.d)}`], ...D], { petita: true }); }) };
};
const mcdQ = (a, b) => b ? mcdQ(b, a % b) : a;
TEMES.q7 = {
  gen: Q7, signeEscrit: true,
  sequencia: {
    1: [['dosCostats', { n: 2 }], ['treuParen', { n: 3 }], ['dosCostats', { n: 3 }], ['treuParen', { n: 3 }], ['dosCostats', { n: 3 }], ['treuParen', { n: 3 }], ['dosCostats', { n: 3 }], ['dosCostats', { n: 3 }]],
    2: [['dosCostats', { n: 3 }], ['treuParen', { n: 3 }], ['paren', { n: 2 }], ['dosCostats', { n: 3 }], ['paren', { n: 3 }], ['treuParen', { n: 4 }], ['dosCostats', { n: 3 }], ['paren', { n: 3 }]],
    3: [['dosCostats', { n: 3 }], ['paren', { n: 3 }], ['treuParen', { n: 4 }], ['denom', { n: 2 }], ['paren', { n: 3 }], ['dosCostats', { n: 3 }], ['denom', { n: 2 }], ['paren', { n: 3 }]]
  },
  explicacio: [
    { text: `<p>A <b>5x − 3 = 2x + 9</b> hi ha x a les <b>dues</b> bandes.</p><p class="petit">Passem les x a l'esquerra i els números a la dreta: el <b>2x</b> passa <b class="parpelleja">restant</b> i el <b>−3</b> passa <b>sumant</b>. Cada terme que es mou va del mateix color.</p>`, vis: () => qCol(qDosCostatsPassos(5, -3, 2, 9, 4).slice(0, 2)) },
    { text: `<p>Reduïm cada costat i acabem com sempre, <b class="parpelleja">cap avall</b>.</p><p class="petit">A sota: 3x = 12. El 3 passa dividint i, a sota, x = 4.</p>`, vis: () => qCol(qDosCostatsPassos(5, -3, 2, 9, 4), { nou: 3 }) },
    { text: `<p>Si hi ha <b class="parpelleja">parèntesis</b>, primer els traiem: el número de fora multiplica <b>tots</b> els de dins.</p><p class="petit">3(x − 2) = 3x − 6 (no 3x − 2!)</p>`, vis: () => `<div class="q-eq"><span class="m">3</span>(x − 2) = 3x − 6</div>` },
    { text: `<p>L'ordre de feina:</p><p class="petit">1. Parèntesis → 2. x a un costat, números a l'altre → 3. Reduir → 4. Passar el que multiplica → 5. Comprovar.</p>`, vis: () => qPassos() }
  ],
  exemple: (nv) => {
    const pas = (text, C, k, nou = 1) => ({ text, vis: qCol(C.slice(0, k), { nou }) });
    if (nv === 1) { const C = qDosCostatsPassos(4, 1, 1, 10, 3); return { enunciat: `Resol 4x + 1 = x + 10.`, passos: [
      pas(`La <b>x</b> de la dreta passa a l'esquerra <b>restant</b>, i el <b>+1</b> passa a la dreta <b>restant</b>.`, C, 2),
      pas(`Redueixo cada costat i ho escric <b>a sota</b>: 3x = 9.`, C, 3),
      pas(`El <b>3</b> passa dividint i, a sota, <b>x = 3</b>. Comprovo: 4 · 3 + 1 = 13 i 3 + 10 = 13. <span class="marca-ok">✓</span>`, C, 5, 2)] }; }
    if (nv === 2) { const C = qParenPassos({ k: 2, p: 3, m: 0, r: 14, x: 4 }); return { enunciat: `Resol 2(x + 3) = 14.`, passos: [
      pas(`Trec el parèntesi: el 2 multiplica la <b>x</b> i també el <b>3</b>.`, C, 2),
      pas(`El <b>+6</b> passa restant i, a sota, el resultat: 2x = 8.`, C, 4, 2),
      pas(`El <b>2</b> passa dividint i, a sota, <b>x = 4</b>. <span class="marca-ok">✓</span>`, C, 6, 2)] }; }
    const C = [[`${qBl('3')}(x − 2) + 4`, `${qBl('2')}(x + 3)`], ['3x − 6 + 4', '2x + 6', 'trec els parèntesis'], ...(() => { const D = qDosCostatsPassos(3, -2, 2, 6, 8); D[0][2] = 'ajunto els números'; return D; })()];
    return { enunciat: `Resol 3(x − 2) + 4 = 2(x + 3).`, passos: [
      pas(`Trec els parèntesis dels dos costats i ajunto els números.`, C, 3, 2),
      pas(`Les x a l'esquerra i els números a la dreta: el <b>2x</b> passa restant i el <b>−2</b>, sumant.`, C, 4),
      pas(`Redueixo, a sota: <b>x = 8</b>. <span class="marca-ok">✓</span>`, C, C.length)] };
  }
};

/* =====================================================================
   OBJECTIU 8 · SEGON GRAU INCOMPLETES (x² = c, ax² = c; N3: ax² + bx = 0)
   ===================================================================== */
const PISTA_Q8 = { completa: `Deixa el x² sol i fes l'<b>arrel quadrada</b>. Hi ha <b>dues</b> solucions: una positiva i una negativa (x² = 49 → x = 7 i x = −7).`, mitja: `Arrel quadrada, i no t'oblidis del negatiu.` };
const Q8 = {};
Q8.quadrat = (nv, { n = 3 } = {}) => {
  const its = qUnics(n, () => { const r = qR(2, nv === 1 ? 10 : 12); const a = nv === 1 ? 1 : (Math.random() < .5 ? 1 : qR(2, 5)); const b = nv === 3 && Math.random() < .5 ? qR(1, 20) : 0; const c = a * r * r + b;
    const e = `${a === 1 ? '' : a}x² ${b ? '+ ' + b + ' ' : ''}= ${c}`;
    const ops = qOps({ html: `x = ${r} i x = −${r}` }, [{ html: `x = ${r}`, tag: 'oblidaNeg' }, { html: `x = ${(c - b) / a / 2}`, tag: 'divQuad' }, { html: `x = ${(c - b) / a}`, tag: 'divQuad' }]);
    return { tipus: 'tria', llarg: true, html: `<b>${e}</b>`, opcions: ops, correcta: 'b', etiq: qEtiq(ops), a, b, c, r, e }; }, it => it.html);
  return { sig: `h1-${its.map(i => i.html).join('|')}`, enunciat: `Tria les solucions de cada equació.`, visual: () => qCol(qQuadPassos(1, 0, 49, 7)), pista: PISTA_Q8, ...apartats(its),
    explicacio: `Deixa x² sol i fes l'arrel. Dues solucions!`, solucio: its.map(it => qCol(qQuadPassos(it.a, it.b, it.c, it.r), { petita: true })) };
};
Q8.arrel = (nv, { n = 3 } = {}) => {
  const its = qUnics(n, () => { const r = qR(2, 12); return { tipus: 'num', llarg: true, html: `x² = ${r * r} &nbsp;→&nbsp; la solució positiva és x =`, valor: r, errs: { [r * r / 2]: 'divQuad', [r * r]: 'divQuad' } }; }, it => it.html);
  return { sig: `h2-${its.map(i => i.html).join('|')}`, enunciat: `Quin nombre al quadrat fa…? (l'altra solució és la negativa)`, visual: nv === 1 ? () => qCol([['x²', '36'], ['? · ?', '36', 'quin nombre per ell mateix?'], ['x', `${qM('6')} &nbsp;(i també −6)`]]) : null, pista: PISTA_Q8, ...apartats(its),
    explicacio: `Busca el nombre que multiplicat per ell mateix dona el de la dreta.`, solucio: its.map(it => `<b>${it.valor}</b> (i també −${it.valor})`) };
};
Q8.pasAPas = (nv) => {
  const a = qR(2, 5), r = qR(2, 8), c = a * r * r;
  const its = [
    { tipus: 'num', llarg: true, html: `<b>${a}x² = ${c}</b>: el ${a} passa dividint, x² =`, valor: r * r, errs: { [c - a]: 'passaRestant' } },
    { tipus: 'num', llarg: true, html: `Fes l'arrel: la solució positiva és x =`, valor: r, errs: { [r * r / 2]: 'divQuad' } },
    { tipus: 'tria', llarg: true, html: `I la negativa?`, opcions: [{ html: `x = −${r}`, val: 'b' }, { html: 'No n\'hi ha', val: 'n' }], correcta: 'b', etiq: { n: 'oblidaNeg' } }
  ];
  return { sig: `h3-${a}-${r}`, enunciat: `Resol pas a pas.`, visual: () => qCol(qQuadPassos(2, 0, 50, 5)), pista: PISTA_Q8, ...apartats(its),
    explicacio: `Primer deixa x² sol, després l'arrel.`, solucio: [qCol(qQuadPassos(a, 0, c, r).slice(0, 3), { petita: true }), qCol(qQuadPassos(a, 0, c, r).slice(2), { petita: true }), `No t'oblidis de la negativa: <b>x = −${r}</b>`] };
};
Q8.factor = (nv, { n = 2 } = {}) => {
  const its = qUnics(n, () => { const a = Math.random() < .6 ? 1 : qR(2, 3); const s = qR(1, 9) * (Math.random() < .3 ? -1 : 1); const b = -a * s; // ax² + bx = 0 → x = 0 i x = s
    const e = `${a === 1 ? '' : a}x² ${b < 0 ? '−' : '+'} ${Math.abs(b)}x = 0`;
    const ops = qOps({ html: `x = 0 i x = ${qNz(s)}` }, [{ html: `x = ${qNz(s)}`, tag: 'perdZero' }, { html: `x = 0 i x = ${qNz(-s)}`, tag: 'transSigne' }, { html: `x = ${qNz(s)} i x = ${qNz(-s)}`, tag: 'perdZero' }]);
    return { tipus: 'tria', llarg: true, html: `<b>${e}</b>`, opcions: ops, correcta: 'b', etiq: qEtiq(ops), e, a, s }; }, it => it.html);
  return { sig: `h4-${its.map(i => i.html).join('|')}`, enunciat: `Ampliació: treu la x <b>factor comú</b>. Si un producte fa 0, algun dels factors és 0.`, visual: () => qCol(qFactorPassos(1, 5)), pista: { completa: `x² − 5x = x · (x − 5). Perquè el producte doni 0: o bé x = 0, o bé x − 5 = 0.`, mitja: `Una de les solucions sempre és 0.` }, ...apartats(its),
    explicacio: `Factor comú i cada factor igual a 0.`, solucio: its.map(it => qCol(qFactorPassos(it.a, it.s), { petita: true })) };
};
TEMES.q8 = {
  gen: Q8,
  sequencia: {
    1: [['arrel', { n: 3 }], ['quadrat', { n: 2 }], ['arrel', { n: 3 }], ['quadrat', { n: 3 }], ['pasAPas'], ['quadrat', { n: 3 }], ['arrel', { n: 4 }], ['quadrat', { n: 3 }]],
    2: [['quadrat', { n: 3 }], ['pasAPas'], ['quadrat', { n: 3 }], ['arrel', { n: 3 }], ['pasAPas'], ['quadrat', { n: 4 }], ['pasAPas'], ['quadrat', { n: 4 }]],
    3: [['quadrat', { n: 3 }], ['pasAPas'], ['factor', { n: 2 }], ['quadrat', { n: 4 }], ['factor', { n: 3 }], ['pasAPas'], ['quadrat', { n: 4 }], ['factor', { n: 3 }]]
  },
  explicacio: [
    { text: `<p>A <b>x² = 49</b> la x està <b class="parpelleja">al quadrat</b>.</p><p class="petit">Busquem un nombre que per ell mateix faci 49: 7 · 7 = 49.</p>`, vis: () => `<div class="q-eq">x · x = 49<br><span class="m">7 · 7 = 49</span></div>` },
    { text: `<p>Però també (−7) · (−7) = 49! Hi ha <b class="parpelleja">dues solucions</b>:</p><p class="petit">x = 7 i x = −7. S'escriu <b>x = ±7</b>.</p>`, vis: () => `<div class="q-eq">x = ±√49<br>x = <span class="m">7</span> &nbsp;i&nbsp; x = <span class="b">−7</span></div>` },
    { text: `<p>Si el x² porta un número, primer el passem <b class="parpelleja">dividint</b>.</p><p class="petit">Cada pas, a sota de l'anterior: primer x² sol, i després l'arrel.</p>`, vis: () => qCol(qQuadPassos(2, 0, 50, 5)) },
    { text: `<p><b>Alerta:</b> l'arrel <b class="parpelleja">no és la meitat</b>.</p><p class="petit">x² = 16 → x = ±4 (no 8!)</p>`, vis: () => `<div class="q-eq">√16 = 4 <span class="b">≠</span> 16 : 2</div>` }
  ],
  exemple: (nv) => {
    const pas = (text, C, k, nou = 1) => ({ text, vis: qCol(C.slice(0, k), { nou }) });
    if (nv === 1) { const C = qQuadPassos(1, 0, 81, 9); return { enunciat: `Resol x² = 81.`, passos: [
      pas(`Quin nombre per ell mateix fa 81? Faig l'<b>arrel quadrada</b>: 9 · 9 = 81.`, C, 2),
      pas(`I també el negatiu, perquè (−9) · (−9) = 81: <b>x = 9 i x = −9</b>. <span class="marca-ok">✓</span>`, C, 3)] }; }
    if (nv === 2) { const C = qQuadPassos(3, 0, 75, 5); return { enunciat: `Resol 3x² = 75.`, passos: [
      pas(`El <b>3</b> multiplica: passa <b>dividint</b>. A sota, el resultat: x² = 25.`, C, 3, 2),
      pas(`Ara l'arrel quadrada, amb les dues solucions: <b>x = 5 i x = −5</b>. <span class="marca-ok">✓</span>`, C, 5, 2)] }; }
    const C = qFactorPassos(1, 6); return { enunciat: `Resol x² − 6x = 0.`, passos: [
      pas(`Trec la <b>x</b> factor comú.`, C, 2),
      pas(`Si un producte fa 0, un dels factors és 0: o bé x = 0, o bé x − 6 = 0. <b>x = 0 i x = 6</b>. <span class="marca-ok">✓</span>`, C, 5, 3)] };
  }
};
/* =====================================================================
   PROVA DE COMPETÈNCIES · EQUACIONS (petita: 2 activitats, 10 preguntes, 10 punts)
   Activitat 1 inspirada en l'ítem 21 de la CB 2024-25 (les cartes). Activitat 2: funció de cost (CB 2011-13).
   ===================================================================== */
const PC_Q = { id: 'pcq', unitat: 'q', provaKey: 'provaCQ', titol: 'Prova de competències · Equacions' };
const CB_ACTS_Q = [
  { t: 'Cartes i cromos', max: 5, ctx: L => `<p>La <b>Carla</b> i en <b>Joan</b> juguen a cartes. Al final de la partida, entre els dos han fet <b>120 punts</b>. La Carla n'ha fet <b>32 més</b> que en Joan.</p><p>Després, la <b>Laia</b> i en <b>Pau</b> comparen els seus cromos: la Laia en té el <b>triple</b> que en Pau, i entre els dos en tenen <b>48</b>.</p><div class="cb-chips"><span>Diem <b>x</b> al nombre que no sabem</span><span>«32 més que x» → x + 32</span><span>«el triple de x» → 3x</span></div>${L === 'basic' ? '<p class="petit">💡 Per comprovar una solució, canvia la x pel número i mira si surt el total.</p>' : ''}` },
  { t: 'El pressupost de la sortida', max: 5, ctx: L => `<p>Per a la sortida de final de curs, l'autocar costa <b>300 €</b> i l'entrada al parc d'aventures costa <b>15 €</b> per alumne.</p><p>El cost total per a <b>x</b> alumnes és:</p><div class="cb-chips" style="font-size:1.1rem"><span><b>C = 15x + 300</b> (en euros)</span></div>${L === 'basic' ? '<table class="cb-tbl"><thead><tr><th>Alumnes (x)</th><th>10</th><th>20</th><th>30</th></tr></thead><tbody><tr><td>Cost (€)</td><td>450</td><td>?</td><td>?</td></tr></tbody></table>' : ''}` }];
const CB_ITEMS_Q = [
  { n: 1, act: 0, type: 'mc', pts: 1, q: 'Si <b>x</b> són els punts d\'en Joan, quina expressió dona els punts de la Carla?', opts: { a: 'x + 32', b: 'x − 32', c: '32x', d: '120 − x' }, ans: 'a',
    hb: ['La Carla té <b>més</b> punts que en Joan.', '«32 més que x» és sumar 32 a x.'], hi: 'La Carla en té 32 més que en Joan.' },
  { n: 2, act: 0, type: 'mc', pts: 1, q: 'Quina equació permet calcular els punts d\'en Joan?', opts: { a: 'x + (x + 32) = 120', b: 'x + 32 = 120', c: 'x − (x + 32) = 120', d: '2x = 120 + 32' }, ans: 'a',
    hb: ['Entre els dos fan 120: punts d\'en Joan + punts de la Carla = 120.', 'En Joan té x i la Carla x + 32. Suma-ho.'], hi: 'Escriu la suma dels punts dels dos.' },
  { n: 3, act: 0, type: 'mc', pts: 1, q: 'Quants punts ha fet en Joan?', opts: { a: '44 punts', b: '76 punts', c: '88 punts', d: '60 punts' }, ans: 'a',
    hb: ['Resol x + x + 32 = 120: ajunta les x, 2x + 32 = 120.', 'El +32 passa restant: 2x = 120 − 32. A sota: 2x = 88. Ara el 2 passa dividint.'], hi: 'Resol l\'equació de la pregunta anterior.' },
  { n: 4, act: 0, type: 'mc', pts: 1, q: 'Si <b>x</b> són els cromos d\'en Pau, quina equació permet trobar-los?', opts: { a: 'x + 3x = 48', b: '3x = 48', c: 'x + 3 = 48', d: 'x + x + 3 = 48' }, ans: 'a',
    hb: ['En Pau en té x. La Laia en té el triple: 3x.', 'Entre els dos en tenen 48: cromos d\'en Pau + cromos de la Laia = 48.'], hi: 'Suma els cromos dels dos.' },
  { n: 5, act: 0, type: 'open', pts: 1, q: 'En Pau diu: «Jo tinc 16 cromos.» Té raó?',
    fields: [{ pre: 'Cromos d\'en Pau (x):', ans: 12, suf: '' }, { pre: 'Cromos de la Laia:', ans: 36, suf: '' }],
    choice: { lab: 'Té raó en Pau?', opts: ['Sí, en té 16.', 'No, en té menys de 16.', 'No, en té més de 16.'], ans: 1 },
    grade: (v, c) => { const r = v[0] === 12; if (c === 1) return r ? 2 : 1; return r ? 1 : 0; },
    hb: ['Resol x + 3x = 48: ajunta les x.', 'Queda 4x = 48. El 4 passa dividint: x = 48 : 4. La Laia en té el triple.'], hi: 'Resol l\'equació i comprova el total.' },
  { n: 6, act: 1, type: 'mc', pts: 1, q: 'Quant costa la sortida si hi van 20 alumnes?', opts: { a: '600 €', b: '315 €', c: '6.300 €', d: '335 €' }, ans: 'a',
    hb: ['Canvia la x per 20 a la fórmula C = 15x + 300.', '15 · 20 = 300. Ara suma-hi els 300 € de l\'autocar.'], hi: 'Substitueix x = 20.' },
  { n: 7, act: 1, type: 'mc', pts: 1, q: 'La sortida ha costat 750 €. Quina equació permet saber quants alumnes hi han anat?', opts: { a: '15x + 300 = 750', b: '15x = 750', c: '300x + 15 = 750', d: '15 + 300x = 750' }, ans: 'a',
    hb: ['El cost és C = 15x + 300 i ara sabem que C = 750.', 'Posa 750 a l\'altra banda de l\'igual.'], hi: 'Iguala la fórmula a 750.' },
  { n: 8, act: 1, type: 'mc', pts: 1, q: 'Quants alumnes hi han anat?', opts: { a: '30 alumnes', b: '50 alumnes', c: '70 alumnes', d: '21 alumnes' }, ans: 'a',
    hb: ['Resol 15x + 300 = 750. Primer el +300 passa restant.', '15x = 450. Ara el 15 passa dividint.'], hi: 'Resol l\'equació de la pregunta anterior.' },
  { n: 9, act: 1, type: 'mc', pts: 1, q: 'Cada alumne paga 25 €. Quants alumnes han d\'anar perquè els diners recollits paguin exactament la sortida? (25x = 15x + 300)', opts: { a: '30 alumnes', b: '12 alumnes', c: '20 alumnes', d: '7 alumnes' }, ans: 'a',
    hb: ['Passa el 15x a l\'esquerra restant: 25x − 15x = 300.', 'Queda 10x = 300. El 10 passa dividint: x = 300 : 10.'], hi: 'Les x a un costat i els números a l\'altre.' },
  { n: 10, act: 1, type: 'open', pts: 1, q: 'La tutora diu: «Si som el doble d\'alumnes, la sortida costarà el doble.» Comprova-ho amb 20 i amb 40 alumnes.',
    fields: [{ pre: 'Cost amb 20 alumnes:', ans: 600, suf: '€' }, { pre: 'Cost amb 40 alumnes:', ans: 900, suf: '€' }],
    choice: { lab: 'Té raó la tutora?', opts: ['Sí, costa el doble.', 'No, costa menys del doble.', 'No, costa més del doble.'], ans: 1 },
    grade: (v, c) => { const ok = v[0] === 600 && v[1] === 900; if (c === 1) return ok ? 2 : 1; return ok ? 1 : 0; },
    hb: ['Calcula C amb x = 20 i amb x = 40.', 'C(20) = 600 €. C(40) = 15 · 40 + 300. El doble de 600 seria 1.200.'], hi: 'Calcula els dos costos i compara\'ls.' }];
const CB_INFO_Q = `<h3>ⓘ Prova de competències · Equacions</h3>
  <p><b>Què és.</b> Una prova <b>breu</b> en format de competències bàsiques: 2 activitats amb context (cartes i cromos, el pressupost de la sortida) i 10 preguntes (8 de resposta tancada i 2 d'obertes). Compta com a <b>examen a part</b>: no toca els objectius ni l'AS de la unitat.</p>
  <p><b>D'on surt.</b> A les CB les equacions gairebé només surten com «quina equació representa la situació» (cartes, CB 2024-25) i com a funcions de cost (CB 2011-13). Per això la prova és petita.</p>
  <p><b>Obertura.</b> Està tancada fins que l'obres (llibreta d'Equacions o Configuració). Cada alumne la fa <b>una vegada</b>; des de la seva casella li pots deixar fer un altre intent.</p>
  <p><b>Nivell.</b> Surt del nivell general de l'alumne: N1 → bàsic (3 intents, 2 pistes per pregunta, recordatori per comprovar i taula de costos), N2 → intermedi (1 intent, 1 pista que fa valer la pregunta el 75 %), N3 → repte (sense pistes).</p>
  <p><b>Puntuació (sobre 10).</b> Cada pregunta val 1 punt. Les obertes tenen puntuació parcial: conclusió i càlcul bons, 1 punt; només una de les dues coses, mig punt.</p>`;
CB_PROVES.q = { PC: PC_Q, acts: CB_ACTS_Q, items: CB_ITEMS_Q, info: CB_INFO_Q };

UNITATS.q.carregada = true;
