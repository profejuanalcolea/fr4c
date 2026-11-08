'use strict';
/* FR-4C · Matemàtiques 4t ESO · Unitat Potències.
   L'app (index.html) carrega aquest fitxer quan cal. Fa servir les funcions del nucli de l'app. */
const pwH = (b, e, cls = '') => `<span class="pw ${cls}">${b}<sup>${e}</sup></span>`;
const NOM_N = ['zero', 'u', 'dos', 'tres', 'quatre', 'cinc', 'sis', 'set', 'vuit', 'nou', 'deu', 'onze', 'dotze'];
const llegeixPot = (b, e) => e === 2 ? `${NOM_N[b]} al quadrat` : e === 3 ? `${NOM_N[b]} al cub` : `${NOM_N[b]} elevat a ${NOM_N[e]}`;
// valors erronis típics d'una potència (només els que no es confonen amb la bona ni entre ells)
function errsPot(b, e) {
  const r = b ** e; const c = { baseExp: b * e, suma: b + e, swap: e ** b, ...(e === 0 ? { exp0: 0 } : {}) };
  const out = {}; const vist = new Map();
  for (const [k, v] of Object.entries(c)) { if (v === r) continue; if (vist.has(v)) { delete out[vist.get(v)]; continue; } vist.set(v, k); out[v] = k; }
  return out;
}

/* ---------- dibuixos ---------- */
function graellaSVG(n, { anim = true, mida = 260, color = 'var(--taronja)' } = {}) {
  const c = Math.min(40, Math.floor(mida / n)); let s = '';
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) s += `<rect x="${4 + j * c}" y="${4 + i * c}" width="${c - 3}" height="${c - 3}" rx="4" fill="${color}" opacity=".85" stroke="#1b1b1b" stroke-width="1.5" ${anim ? `class="pop" style="animation-delay:${(i * n + j) * .03}s"` : ''}/>`;
  return `<svg class="dib" viewBox="0 0 ${n * c + 8} ${n * c + 8}" width="${n * c + 8}">${s}</svg>`;
}
// cub isomètric de n×n×n cubets (rubik: cares de colors)
function cubSVG(n, { rubik = false, mida = 230 } = {}) {
  const u = Math.min(36, Math.floor(mida / (n * 1.9))); const cx = 0.866 * u, cy = 0.5 * u;
  const P = (x, y, z) => [n * cx + (x - y) * cx + 6, (x + y) * cy - z * u + n * u + 6];
  const pol = (pts, fill) => `<polygon points="${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="${fill}" stroke="#1b1b1b" stroke-width="1.6" stroke-linejoin="round"/>`;
  const RC = ['#ffffff', '#f2c94c', '#e23b3b', '#2c9a58', '#2a6fd6', '#f26b1d'];
  const col = (f, i, j) => rubik ? RC[(f * 2 + i + j * 2) % 6] : f === 0 ? '#ffb27a' : f === 1 ? '#f26b1d' : '#c9520f';
  let s = '';
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) s += pol([P(i, j, n), P(i + 1, j, n), P(i + 1, j + 1, n), P(i, j + 1, n)], col(0, i, j)); // dalt
  for (let i = 0; i < n; i++) for (let k = 0; k < n; k++) s += pol([P(i, n, k), P(i + 1, n, k), P(i + 1, n, k + 1), P(i, n, k + 1)], col(1, i, k)); // esquerra
  for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) s += pol([P(n, j, k), P(n, j + 1, k), P(n, j + 1, k + 1), P(n, j, k + 1)], col(2, j, k)); // dreta
  const W = 2 * n * cx + 12, H = n * u + 2 * n * cy + 12;
  return `<svg class="dib pop" viewBox="0 0 ${W} ${H}" width="${Math.round(W)}">${s}</svg>`;
}
// arbre de missatges: cada persona n'envia a k
function arbreSVG(k, nivells, { anim = true } = {}) {
  const W = 520, H = 70 + nivells * 70; let s = ''; let prev = [[W / 2, 30]];
  s += `<circle cx="${W / 2}" cy="30" r="14" fill="var(--taronja)" stroke="#1b1b1b" stroke-width="2"/><text x="${W / 2}" y="35" text-anchor="middle" font-size="14">📱</text>`;
  for (let l = 1; l <= nivells; l++) {
    const n = k ** l, y = 30 + l * 70, pas = W / n, r = Math.max(4, Math.min(12, pas / 2.8)); const nous = [];
    for (let i = 0; i < n; i++) { const x = pas * (i + .5), [px, py] = prev[Math.floor(i / k)];
      s += `<line x1="${px}" y1="${py + 12}" x2="${x}" y2="${y - r}" stroke="#8f8a82" stroke-width="1.5" ${anim ? `class="traca" style="animation-delay:${l * .5}s"` : ''}/>`;
      s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${l % 2 ? '#2a6fd6' : '#2c9a58'}" stroke="#1b1b1b" stroke-width="1.5" ${anim ? `class="pop" style="animation-delay:${l * .5 + .3}s"` : ''}/>`; nous.push([x, y]); }
    s += `<text x="${W - 4}" y="${y - 16}" text-anchor="end" font-size="13" font-weight="800" fill="#8f8a82">ronda ${l}: ${n}</text>`;
    prev = nous;
  }
  return `<svg class="dib" viewBox="0 0 ${W} ${H}" width="${W}">${s}</svg>`;
}
const cadenaPot = (b, e, fins = e) => `<div class="cad-pot">${Array.from({ length: e }, (_, i) => `<span class="${i < fins ? 'parpelleja-1' : ''}" style="animation-delay:${i * .5}s"><b>${b ** (i + 1)}</b>${i < e - 1 ? `<i>× ${b}</i>` : ''}</span>`).join('')}</div>`;
/* ---------- generadors de l'objectiu 1 ---------- */
function parellaPot(nv, { minE = 2 } = {}) {
  const bm = nv === 1 ? 5 : nv === 2 ? 9 : 10, em = nv === 1 ? 5 : nv === 2 ? 6 : 7;
  let b, e, g = 0; do { b = rnd(2, bm); e = rnd(minE, em); } while ((b === e || b ** e > 100000) && g++ < 50);
  return [b, e];
}
const opsPot = (b, e) => { // opcions per triar la potència d'una multiplicació repetida
  const o = [{ html: pw(b, e), val: 'b' }, { html: pw(e, b), val: 'swap', tag: 'swap' }, { html: `${b} · ${e}`, val: 'be', tag: 'baseExp' }, { html: pw(b, e + 1), val: 'e1' }];
  return barreja(o.filter((x, i, a) => a.findIndex(y => y.html === x.html) === i));
};
const etiqDe = ops => Object.fromEntries(ops.filter(o => o.tag).map(o => [o.val, o.tag]));
const PISTA_W1 = { completa: `La <b>base</b> és el nombre que es repeteix. L'<b>exponent</b> diu quantes vegades es multiplica. ${pw(3, 4)} = 3 · 3 · 3 · 3, <b>no</b> 3 · 4.`, mitja: `Base: el que es repeteix. Exponent: quantes vegades.` };
const W1 = {};
W1.multAPot = (nv, { n = 3 } = {}) => {
  const items = []; const vist = new Set();
  for (let k = 0; k < n; k++) {
    let b, e, g = 0; do { [b, e] = parellaPot(nv); } while (vist.has(b + '_' + e) && g++ < 40); vist.add(b + '_' + e);
    if (nv === 1) { const ops = opsPot(b, e); items.push({ tipus: 'tria', html: `${repeteix(b, e)} =`, opcions: ops, correcta: 'b', etiq: etiqDe(ops) }); }
    else items.push({ tipus: 'pot', html: `${repeteix(b, e)} =`, base: b, exp: e });
  }
  return { sig: `wm-${items.map(i => i.html).join('|')}`, enunciat: `Escriu cada multiplicació com una <b>potència</b>.`, visual: null, pista: PISTA_W1, ...apartats(items),
    explicacio: `La base és el nombre que es repeteix i l'exponent, quantes vegades.`,
    solucio: items.map(it => `${it.html} <b>${it.tipus === 'pot' ? pw(it.base, it.exp) : it.opcions.find(o => o.val === 'b').html}</b>`) };
};
W1.desplega = (nv, { n = 3 } = {}) => {
  const items = []; const vist = new Set();
  for (let k = 0; k < n; k++) {
    let b, e, g = 0; do { [b, e] = parellaPot(Math.min(nv, 2)); } while ((vist.has(b + '_' + e) || e > 6) && g++ < 40); vist.add(b + '_' + e);
    if (nv === 1) { const ops = barreja([{ html: repeteix(b, e), val: 'b' }, { html: `${b} · ${e}`, val: 'be', tag: 'baseExp' }, { html: repeteix(e, b), val: 'sw', tag: 'swap' }, { html: repeteix(b, e, '+'), val: 'sm', tag: 'sumaRep' }].filter((x, i, a) => a.findIndex(y => y.html === x.html) === i));
      items.push({ tipus: 'tria', html: `${pw(b, e)} =`, opcions: ops, correcta: 'b', etiq: etiqDe(ops), llarg: true }); }
    else items.push({ tipus: 'factors', html: `${pw(b, e)} =`, base: b, exp: e, pool: barreja([b, e, ...(b * e <= 30 ? [b * e] : [b + 1])]) });
  }
  return { sig: `wd-${items.map(i => i.html).join('|')}`, enunciat: nv === 1 ? `Tria com es desplega cada potència.` : `<b>Desplega</b> cada potència: toca (o arrossega) els factors que calen. Si t'equivoques, toca un factor per treure'l.`, visual: null, pista: PISTA_W1, ...apartats(items),
    explicacio: `Desplegar una potència és escriure la base tantes vegades com diu l'exponent.`,
    solucio: items.map(it => `${it.html} <b>${it.tipus === 'factors' ? repeteix(it.base, it.exp) : it.opcions.find(o => o.val === 'b').html}</b>`) };
};
W1.baseExp = (nv, { n = 2 } = {}) => {
  const items = []; const vist = new Set();
  for (let k = 0; k < n; k++) {
    let b, e, g = 0; do { [b, e] = parellaPot(nv); } while (vist.has(b + '_' + e) && g++ < 40); vist.add(b + '_' + e);
    const p = pwH(b, e, 'mitja');
    if (nv === 1) {
      const ops = barreja([{ html: String(b), val: 'b' }, { html: String(e), val: 'e' }, { html: String(b * e), val: 'x' }]);
      items.push({ tipus: 'tria', html: `A ${p}, quina és la <b>base</b>?`, opcions: ops, correcta: 'b', etiq: { e: 'swap' }, llarg: true });
      items.push({ tipus: 'tria', html: `A ${p}, quin és l'<b>exponent</b>?`, opcions: barreja(ops), correcta: 'e', etiq: { b: 'swap' }, llarg: true });
    } else {
      items.push({ tipus: 'num', llarg: true, html: `A ${p}, la <b>base</b> és:`, valor: b, errs: { [e]: 'swap' } });
      items.push({ tipus: 'num', llarg: true, html: `A ${p}, l'<b>exponent</b> és:`, valor: e, errs: { [b]: 'swap' } });
    }
  }
  return { sig: `wb-${items.map(i => i.html).join('|')}`, enunciat: `Identifica la base i l'exponent.`, visual: null, pista: PISTA_W1, ...apartats(items),
    explicacio: `La base és el número gran; l'exponent és el petit de dalt a la dreta.`, solucio: items.map(it => `${it.html.replace(/<[^>]+>/g, '')} <b>${it.valor ?? it.opcions.find(o => o.val === it.correcta).html}</b>`) };
};
W1.paraules = (nv, { n = 3 } = {}) => {
  const items = []; const vist = new Set();
  for (let k = 0; k < n; k++) {
    let b, e, g = 0; do { [b, e] = parellaPot(Math.min(nv, 2)); } while ((vist.has(b + '_' + e) || b > 12 || e > 12) && g++ < 40); vist.add(b + '_' + e);
    if (k % 2 === 0) { // paraules → símbol
      if (nv === 1) { const ops = opsPot(b, e); items.push({ tipus: 'tria', html: `«${llegeixPot(b, e)}» s'escriu:`, opcions: ops, correcta: 'b', etiq: etiqDe(ops), llarg: true }); }
      else items.push({ tipus: 'pot', html: `«${llegeixPot(b, e)}» =`, base: b, exp: e, llarg: true });
    } else { // símbol → paraules
      const ops = barreja([{ html: llegeixPot(b, e), val: 'b' }, { html: llegeixPot(e, b), val: 'sw', tag: 'swap' }, { html: `${NOM_N[b]} per ${NOM_N[e]}`, val: 'be', tag: 'baseExp' }].filter((x, i, a) => a.findIndex(y => y.html === x.html) === i));
      items.push({ tipus: 'tria', html: `Com es llegeix ${pwH(b, e, 'mitja')}?`, opcions: ops, correcta: 'b', etiq: etiqDe(ops), llarg: true });
    }
  }
  return { sig: `wp-${items.map(i => i.html).join('|')}`, enunciat: `Les potències també es llegeixen. Exponent 2: <b>al quadrat</b>. Exponent 3: <b>al cub</b>.`, visual: null, pista: { completa: `${pw(5, 2)}: cinc al quadrat · ${pw(5, 3)}: cinc al cub · ${pw(5, 4)}: cinc elevat a quatre. Primer es diu la <b>base</b>.`, mitja: `Primer la base, després l'exponent.` }, ...apartats(items),
    explicacio: `Primer es llegeix la base i després l'exponent.`, solucio: items.map(it => it.tipus === 'pot' ? `${it.html} <b>${pw(it.base, it.exp)}</b>` : `${it.html.replace(/<[^>]+>/g, '')} <b>${it.opcions.find(o => o.val === 'b').html}</b>`) };
};
const VF_W1 = [
  () => { const [b, e] = [rnd(3, 6), rnd(2, 4)]; return { html: `${pw(b, e)} = ${b} · ${e}`, ok: false, etiq: { si: 'baseExp' }, sol: `${pw(b, e)} = ${repeteix(b, e)} = ${b ** e}, no ${b * e}.` }; },
  () => { const [b, e] = [rnd(2, 9), rnd(2, 4)]; return { html: `${pw(b, e)} = ${repeteix(b, e)}`, ok: true, sol: `Correcte: el ${b} es repeteix ${e} vegades.` }; },
  () => { const [b, e] = [rnd(3, 6), rnd(3, 4)]; return { html: `${pw(b, e)} = ${repeteix(b, e, '+')}`, ok: false, etiq: { si: 'sumaRep' }, sol: `És una multiplicació, no una suma: ${repeteix(b, e)}.` }; },
  () => { const [b, e] = tria([[2, 3], [2, 5], [3, 4], [2, 6]]); return { html: `${pw(b, e)} = ${pw(e, b)}`, ok: false, etiq: { si: 'swap' }, sol: `${pw(b, e)} = ${b ** e} i ${pw(e, b)} = ${e ** b}: no són iguals.` }; },
  () => { const e = rnd(2, 9); return { html: `${pw(1, e)} = 1`, ok: true, sol: `1 per 1 per 1… sempre fa 1.` }; },
  () => { const b = rnd(2, 9); return { html: `${pw(b, 2)} es llegeix «${NOM_N[b]} al quadrat»`, ok: true, sol: `Exponent 2: al quadrat.` }; },
  () => { const b = rnd(2, 9); return { html: `${pw(b, 3)} es llegeix «${NOM_N[b]} al quadrat»`, ok: false, sol: `Exponent 3: «${NOM_N[b]} al cub».` }; },
  () => ({ html: `${pw(2, 4)} = ${pw(4, 2)}`, ok: true, sol: `Casualitat! ${pw(2, 4)} = 16 i ${pw(4, 2)} = 16. Però normalment no passa: ${pw(2, 3)} ≠ ${pw(3, 2)}.` })
];
W1.vf = (nv, { n = 3 } = {}) => {
  const fs = barreja(nv === 3 ? VF_W1 : VF_W1.slice(0, 7)).slice(0, n); const ds = fs.map(f => f());
  const items = ds.map(d => ({ tipus: 'tria', html: `${d.html}`, opcions: [{ html: 'Vertader', val: 'si' }, { html: 'Fals', val: 'no' }], correcta: d.ok ? 'si' : 'no', etiq: d.etiq || {}, llarg: true }));
  return { sig: `wv-${ds.map(d => d.html).join('|')}`, enunciat: `Vertader o fals? ${nv === 3 ? 'Compte amb les trampes!' : ''}`, visual: null, pista: PISTA_W1, ...apartats(items),
    explicacio: `Una potència és una multiplicació repetida.`, solucio: ds.map(d => `${d.html}: <b>${d.ok ? 'vertader' : 'fals'}</b>. ${d.sol}`) };
};
W1.arbre = (nv) => {
  const [k, l] = tria([[2, 3], [2, 4], [2, 5], [3, 2], [3, 3], [4, 2]]); const nom = tria(['La Laia', 'En Bilal', 'La Mei', 'En Pol']);
  const items = [
    { tipus: 'num', llarg: true, html: `Quantes persones reben el missatge a la <b>ronda ${l}</b>?`, valor: k ** l, errs: errsPot(k, l) },
    { tipus: 'pot', llarg: true, html: `Escriu-ho com una potència:`, base: k, exp: l }
  ];
  return { sig: `wa-${k}-${l}`, enunciat: `${nom} envia un missatge a ${k} amics. Cada amic el reenvia a ${k} persones noves, i així successivament.`, visual: () => arbreSVG(k, l), pista: { completa: `A cada ronda, cada persona n'envia a ${k}: es multiplica per ${k} cada vegada.`, mitja: `Quantes vegades es multiplica per ${k}?` }, ...apartats(items),
    explicacio: `Ronda ${l}: ${repeteix(k, l)} = ${pw(k, l)} = ${k ** l} persones.`, solucio: [`${repeteix(k, l)} = <b>${k ** l}</b>`, `<b>${pw(k, l)}</b>`] };
};
TEMES.w1 = {
  gen: W1,
  sequencia: {
    1: [['multAPot', { n: 3 }], ['baseExp', { n: 1 }], ['desplega', { n: 3 }], ['paraules', { n: 3 }], ['vf', { n: 3 }], ['multAPot', { n: 3 }], ['baseExp', { n: 2 }], ['paraules', { n: 3 }]],
    2: [['multAPot', { n: 3 }], ['desplega', { n: 2 }], ['baseExp', { n: 2 }], ['paraules', { n: 3 }], ['vf', { n: 4 }], ['multAPot', { n: 3 }], ['desplega', { n: 2 }], ['paraules', { n: 4 }]],
    3: [['multAPot', { n: 3 }], ['desplega', { n: 3 }], ['arbre'], ['vf', { n: 4 }], ['paraules', { n: 4 }], ['baseExp', { n: 2 }], ['arbre'], ['vf', { n: 4 }]]
  },
  explicacio: [
    { text: `<p>Mira aquesta multiplicació:</p><p class="expr-gran" style="margin:6px 0">3 · 3 · 3 · 3</p><p>En FR-4C protesta: «<b class="parpelleja">Massa feina d'escriure!</b>»</p>`,
      vis: () => `<div class="w-queixa">${robot(110, 'pensa')}<div class="bafarada-w">Massa feina d'escriure! 😩<br><small>I si fossin 20 treses?</small></div></div>` },
    { text: `<p>Ho escrivim més curt: <b>3⁴</b>.</p><p>La <b class="parpelleja">base</b> és el nombre que es repeteix. L'<b class="parpelleja-2">exponent</b> diu quantes vegades.</p>`,
      vis: () => `<div class="w-agrupa"><div class="w-factors">${[0, 1, 2, 3].map(i => `<span style="animation-delay:${i * .15}s">3</span>`).join('<i>·</i>')}</div><div class="w-fletxa">⬇</div>
        <div class="w-pot">${pwH(3, 4, 'gran')}<div class="w-etq base">BASE<small>el nombre que es repeteix</small></div><div class="w-etq exp">EXPONENT<small>quantes vegades</small></div></div></div>` },
    { text: `<p>Com es <b class="parpelleja">llegeix</b>?</p><p>${pw(3, 4)}: «tres elevat a quatre»</p><p class="petit">Amb exponent 2 diem <b>al quadrat</b>, i amb exponent 3, <b>al cub</b>.</p>`,
      vis: () => `<div class="taula-signes" style="grid-template-columns:auto 1fr;font-size:1.35rem"><div>${pwH(3, 4)}</div><div>tres elevat a quatre</div><div>${pwH(5, 2)}</div><div>cinc <b>al quadrat</b></div><div>${pwH(5, 3)}</div><div>cinc <b>al cub</b></div></div>` },
    { text: `<p><b class="parpelleja">Alerta!</b> ${pw(3, 4)} <b>no</b> és 3 · 4.</p><p class="petit">${pw(3, 4)} = 3 · 3 · 3 · 3 = <b>81</b>. En canvi, 3 · 4 = 12.</p>`,
      vis: () => `<div class="w-alerta"><div class="bo">${pwH(3, 4)}<span>= 3 · 3 · 3 · 3</span><b>81</b><em>✓</em></div><div class="mal">3 · 4<span>&nbsp;</span><b>12</b><em>✗</em></div></div>` }
  ],
  exemple: (nv) => {
    if (nv === 1) return { enunciat: `Escriu <b>2 · 2 · 2 · 2 · 2</b> com una potència.`, passos: [
      { text: `Quin nombre es repeteix? El <b>2</b>: és la <b>base</b>.`, vis: `<div class="expr-gran"><span style="color:var(--taronja)">2</span> · <span style="color:var(--taronja)">2</span> · <span style="color:var(--taronja)">2</span> · <span style="color:var(--taronja)">2</span> · <span style="color:var(--taronja)">2</span></div>` },
      { text: `Quantes vegades? Comptem: <b>5</b>. És l'<b>exponent</b>.`, vis: `<div class="expr-gran">2¹ 2² 2³ 2⁴ 2⁵</div>`.replace(/2([¹²³⁴⁵])/g, (m, x) => `<span class="w-comp">${'¹²³⁴⁵'.indexOf(x) + 1}</span>`) },
      { text: `2 · 2 · 2 · 2 · 2 = <b>${pw(2, 5)}</b>. <span class="marca-ok">✓</span>`, vis: `<div>${pwH(2, 5, 'gran')}</div>` }] };
    if (nv === 2) return { enunciat: `Fixa't en <b>${pw(5, 3)}</b>.`, passos: [
      { text: `La base és <b>5</b> i l'exponent és <b>3</b>.`, vis: `<div>${pwH(5, 3, 'gran')}</div>` },
      { text: `Es llegeix «<b>cinc al cub</b>».`, vis: `<div class="conj-txt">cinc al cub</div>` },
      { text: `Es desplega així: <b>5 · 5 · 5</b> (no 5 · 3!). <span class="marca-ok">✓</span>`, vis: `<div class="expr-gran">5 · 5 · 5</div>` }] };
    return { enunciat: `En Pol envia un missatge a 3 amics, i cadascun el reenvia a 3 més. Quants el reben a la ronda 3?`, passos: [
      { text: `Ronda 1: 3. Ronda 2: 3 · 3. Ronda 3: 3 · 3 · 3.`, vis: arbreSVG(3, 3, { anim: false }) },
      { text: `És una potència: <b>${pw(3, 3)}</b>.`, vis: `<div>${pwH(3, 3, 'gran')}</div>` },
      { text: `3 · 3 · 3 = <b>27</b> persones. <span class="marca-ok">✓</span>`, vis: `<div class="expr-gran">27</div>` }] };
  }
};
/* ---------- generadors de l'objectiu 2 ---------- */
const PISTA_W2 = { completa: `Multiplica la base per ella mateixa tantes vegades com diu l'exponent: ${pw(2, 4)} = 2 · 2 · 2 · 2 → 2, 4, 8, 16. Recorda: x¹ = x i x⁰ = 1.`, mitja: `Ves multiplicant pas a pas.` };
const itemPot = (b, e) => ({ tipus: 'num', html: pw(b, e), valor: b ** e, errs: errsPot(b, e), b, e });
const W2 = {};
W2.calc = (nv, { n = 4, tipus = 'mix' } = {}) => {
  const items = []; const vist = new Set();
  for (let k = 0; k < n; k++) {
    let b, e, g = 0;
    do {
      const t = tipus === 'quad' ? 'q' : tipus === 'cub' ? 'c' : tria(nv === 1 ? ['q', 'q', 'c'] : ['q', 'c', 'a']);
      if (t === 'q') { b = rnd(2, nv === 1 ? 10 : nv === 2 ? 12 : 20); e = 2; }
      else if (t === 'c') { b = rnd(2, nv === 1 ? 4 : nv === 2 ? 6 : 10); e = 3; }
      else { [b, e] = tria(nv === 2 ? [[2, 4], [2, 5], [3, 4], [2, 6], [5, 4], [10, 4]] : [[2, 7], [2, 8], [3, 5], [4, 4], [5, 4], [2, 10], [6, 4], [10, 5]]); }
    } while ((vist.has(b + '_' + e) || (b === 2 && e === 2)) && g++ < 60);
    vist.add(b + '_' + e); items.push(itemPot(b, e));
  }
  return { sig: `wc-${items.map(i => i.html).join('|')}`, enunciat: `Calcula. ${nv === 1 ? 'Desplega-la si et cal.' : ''}`, visual: null, pista: PISTA_W2, ...apartats(items),
    explicacio: `${pw(3, 4)} = 3 · 3 · 3 · 3: ves multiplicant pas a pas.`, solucio: items.map(it => `${it.html} = ${repeteix(it.b, it.e)} = <b>${it.valor}</b>`) };
};
W2.graella = (nv) => {
  const n = rnd(3, nv === 1 ? 6 : 8);
  const items = [{ tipus: 'num', llarg: true, html: `Quants quadradets hi ha?`, valor: n * n, errs: { [n * 2]: 'baseExp', [n + 2]: 'suma' } }, { tipus: 'pot', llarg: true, html: `Escriu-ho com una potència:`, base: n, exp: 2 }];
  return { sig: `wg-${n}`, enunciat: `Aquest quadrat té ${n} quadradets per costat.`, visual: () => graellaSVG(n), pista: { completa: `Són ${n} files de ${n}: ${n} · ${n}. Per això ${pw(n, 2)} es diu «${NOM_N[n] || n} <b>al quadrat</b>».`, mitja: `Files × columnes.` }, ...apartats(items),
    explicacio: `${n} · ${n} = ${pw(n, 2)} = ${n * n}. Per això l'exponent 2 es diu «al quadrat».`, solucio: [`${n} files de ${n}: <b>${n * n}</b>`, `<b>${pw(n, 2)}</b>`] };
};
W2.cub = (nv) => {
  const n = rnd(2, nv === 1 ? 3 : 4); const rubik = n === 3;
  const items = [{ tipus: 'num', llarg: true, html: `Quants cubets té en total (també els que no es veuen)?`, valor: n ** 3, errs: { [n * 3]: 'baseExp', [n + 3]: 'suma' } }, { tipus: 'pot', llarg: true, html: `Escriu-ho com una potència:`, base: n, exp: 3 }];
  return { sig: `wk-${n}`, enunciat: `${rubik ? 'Un cub de Rubik' : 'Aquest cub'} té ${n} cubets d'ample, ${n} de llarg i ${n} d'alt.`, visual: () => cubSVG(n, { rubik }), pista: { completa: `Cada pis té ${n} · ${n} = ${n * n} cubets, i hi ha ${n} pisos: ${n} · ${n} · ${n}.`, mitja: `Quants cubets té cada pis? I quants pisos hi ha?` }, ...apartats(items),
    explicacio: `${n} · ${n} · ${n} = ${pw(n, 3)} = ${n ** 3}. Per això l'exponent 3 es diu «al cub».`, solucio: [`${n} · ${n} · ${n} = <b>${n ** 3}</b>`, `<b>${pw(n, 3)}</b>`] };
};
W2.taula = (nv, { n = 4 } = {}) => {
  const ks = barreja([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, n).sort((a, b) => a - b);
  const items = ks.map(k => ({ ...itemPot(k, 2), errs: k === 2 ? {} : errsPot(k, 2) }));
  const taula = () => `<table class="taula-q"><tr><th>n</th>${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(k => `<td>${k}</td>`).join('')}</tr><tr><th>n²</th>${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(k => `<td class="${ks.includes(k) ? 'forat-q' : ''}">${ks.includes(k) ? LLETRES_AP[ks.indexOf(k)] + ')' : k * k}</td>`).join('')}</tr></table>`;
  return { sig: `wt-${ks.join('_')}`, enunciat: `Completa la taula dels quadrats de l'1 al 10.`, visual: taula, pista: { completa: `Un nombre al quadrat és el nombre multiplicat per ell mateix: ${pw(7, 2)} = 7 · 7 = 49.`, mitja: `n² = n · n` }, ...apartats(items),
    explicacio: `Els quadrats de l'1 al 10: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100. Val la pena saber-los de memòria!`, solucio: items.map(it => `${it.html} = ${it.b} · ${it.b} = <b>${it.valor}</b>`) };
};
W2.exp01 = (nv, { n = 4 } = {}) => {
  const items = []; const vist = new Set();
  const forms = barreja(['b0', 'b1', 'b0', 'b1', '1n', nv === 3 ? '00' : 'b0']).slice(0, n);
  for (const f of forms) {
    let b, e, g = 0;
    do { if (f === 'b0') { b = rnd(2, nv === 3 ? 99 : 20); e = 0; } else if (f === 'b1') { b = rnd(2, nv === 3 ? 99 : 20); e = 1; } else if (f === '1n') { b = 1; e = rnd(2, 9); } else { b = 0; e = rnd(2, 6); } } while (vist.has(b + '_' + e) && g++ < 40);
    vist.add(b + '_' + e);
    const errs = b === 0 ? {} : e === 0 ? { 0: 'exp0', [b]: 'exp0' } : e === 1 ? { 1: 'exp1', [b + 1]: 'suma' } : b === 1 ? { [e]: 'baseExp', [1 + e]: 'suma' } : { [b * e]: 'baseExp' };
    if (e === 0 && b === 0) continue;
    items.push({ tipus: 'num', html: pw(b, e), valor: b ** e, errs, b, e });
  }
  return { sig: `w0-${items.map(i => i.html).join('|')}`, enunciat: `Compte amb els exponents <b>0</b> i <b>1</b>!`, visual: null, pista: { completa: `Qualsevol nombre elevat a <b>1</b> és ell mateix: 7¹ = 7. Qualsevol nombre (que no sigui 0) elevat a <b>0</b> és <b>1</b>: 7⁰ = 1, no 0!`, mitja: `x¹ = x · x⁰ = 1` }, ...apartats(items),
    explicacio: `x¹ = x i x⁰ = 1. Recorda el patró: 2³ = 8, 2² = 4, 2¹ = 2, 2⁰ = 1 (cada cop dividim entre 2).`, solucio: items.map(it => `${it.html} = <b>${it.valor}</b>${it.e === 0 ? ' (exponent 0 → 1)' : it.e === 1 ? ' (exponent 1 → el mateix nombre)' : ''}`) };
};
W2.compara = (nv, { n = 3 } = {}) => {
  const parells = barreja(nv === 1 ? [[[2, 3], [3, 2]], [[2, 4], [4, 2]], [[3, 2], [2, 3]], [[4, 2], [3, 2]], [[2, 5], [5, 2]], [[3, 3], [5, 2]]] : [[[2, 3], [3, 2]], [[2, 4], [4, 2]], [[2, 5], [5, 2]], [[3, 3], [5, 2]], [[2, 6], [6, 2]], [[3, 4], [4, 3]], [[10, 2], [2, 7]], [[2, 10], [10, 3]], [[5, 3], [3, 5]]]).slice(0, n);
  const items = parells.map(([[a, x], [b, y]]) => { const va = a ** x, vb = b ** y; return { tipus: 'signe', a: va, b: vb, ha: pwH(a, x, 'mitja'), hb: pwH(b, y, 'mitja'), ta: pw(a, x), tb: pw(b, y), correcta: va < vb ? '<' : va > vb ? '>' : '=', etiq: a === y && b === x && va !== vb ? { '=': 'swap' } : {} }; });
  return { sig: `wq-${items.map(i => i.ta + i.tb).join('|')}`, enunciat: `Compara: posa <b>&lt;</b>, <b>&gt;</b> o <b>=</b>. Primer calcula cada potència!`, visual: null, pista: { completa: `Calcula les dues potències abans de comparar. ${pw(2, 3)} = 8 i ${pw(3, 2)} = 9: canviar la base i l'exponent <b>no</b> dona el mateix.`, mitja: `Calcula-les primer.` }, ...apartats(items),
    explicacio: `Canviar la base i l'exponent normalment canvia el resultat: ${pw(2, 3)} = 8 però ${pw(3, 2)} = 9.`, solucio: items.map(it => `${it.ta} = ${it.a} i ${it.tb} = ${it.b}: <b>${it.ta} ${it.correcta} ${it.tb}</b>`) };
};
W2.falta = (nv, { n = 3 } = {}) => {
  const items = []; const vist = new Set();
  for (let k = 0; k < n; k++) {
    let b, e, g = 0; do { b = tria([2, 2, 3, 4, 5, 10]); e = rnd(2, b === 2 ? 7 : b === 10 ? 5 : 4); } while ((vist.has(b + '_' + e) || b ** e > 1000) && g++ < 40); vist.add(b + '_' + e);
    const er = {}; if ((b ** e) % b === 0 && b ** e / b !== e) er[b ** e / b] = 'baseExp';
    items.push({ tipus: 'num', llarg: true, html: `${b}<sup>?</sup> = ${b ** e}. L'exponent és:`, valor: e, errs: er, b, e });
  }
  return { sig: `wf-${items.map(i => i.html).join('|')}`, enunciat: `Troba l'exponent que falta.`, visual: null, pista: { completa: `Multiplica la base per ella mateixa i compta quantes vegades necessites: 2 → 4 → 8 → 16 són <b>4</b> passos, per tant 2⁴ = 16.`, mitja: `Compta quantes vegades multipliques.` }, ...apartats(items),
    explicacio: `Ves multiplicant per la base i compta els passos.`, solucio: items.map(it => `${it.b} → ${Array.from({ length: it.e - 1 }, (_, i) => it.b ** (i + 2)).join(' → ')}: <b>${it.e}</b> vegades, ${pw(it.b, it.e)} = ${it.b ** it.e}`) };
};
TEMES.w2 = {
  gen: W2, senseCalc: true,
  sequencia: {
    1: [['calc', { n: 4, tipus: 'quad' }], ['graella'], ['calc', { n: 3, tipus: 'cub' }], ['exp01', { n: 4 }], ['taula', { n: 4 }], ['cub'], ['compara', { n: 3 }], ['calc', { n: 4 }]],
    2: [['calc', { n: 4 }], ['graella'], ['cub'], ['exp01', { n: 4 }], ['taula', { n: 5 }], ['compara', { n: 4 }], ['calc', { n: 4 }], ['exp01', { n: 4 }]],
    3: [['calc', { n: 4 }], ['cub'], ['falta', { n: 3 }], ['compara', { n: 4 }], ['exp01', { n: 4 }], ['taula', { n: 6 }], ['falta', { n: 3 }], ['calc', { n: 4 }]]
  },
  explicacio: [
    { text: `<p>Per calcular ${pw(2, 5)} anem <b class="parpelleja">multiplicant en cadena</b>:</p><p class="petit">2 → 4 → 8 → 16 → <b>32</b>: cada vegada multipliquem per 2, i ho fem 5 vegades.</p>`, vis: () => cadenaPot(2, 5) },
    { text: `<p>Un nombre <b class="parpelleja">al quadrat</b> és un quadrat de quadradets.</p><p>${pw(4, 2)} = 4 · 4 = <b>16</b> quadradets.</p>`, vis: () => graellaSVG(4) },
    { text: `<p>Un nombre <b class="parpelleja">al cub</b> és un cub de cubets, com un cub de Rubik.</p><p>${pw(3, 3)} = 3 · 3 · 3 = <b>27</b> cubets.</p>`, vis: () => cubSVG(3, { rubik: true }) },
    { text: `<p>I l'exponent <b>1</b> i el <b>0</b>? Mira el patró: cada cop <b class="parpelleja">dividim entre 2</b>.</p><p class="petit">${pw(2, 1)} = 2 i ${pw(2, 0)} = <b>1</b>. Tot nombre elevat a 0 val 1 (no 0!).</p>`,
      vis: () => `<div class="w-patro">${[[3, 8], [2, 4], [1, 2], [0, 1]].map(([e, v], i) => `<div class="pop" style="animation-delay:${i * .5}s">${pwH(2, e)}<span>=</span><b>${v}</b>${i < 3 ? '<i>: 2 ⬇</i>' : ''}</div>`).join('')}</div>` }
  ],
  exemple: (nv) => {
    if (nv === 1) return { enunciat: `Calcula <b>${pw(6, 2)}</b>.`, passos: [
      { text: `${pw(6, 2)} vol dir 6 · 6: un quadrat de 6 per 6.`, vis: graellaSVG(6, { anim: false }) },
      { text: `6 · 6 = <b>36</b>. <span class="marca-ok">✓</span>`, vis: `<div class="expr-gran">${pw(6, 2)} = 36</div>` }] };
    if (nv === 2) return { enunciat: `Calcula <b>${pw(3, 4)}</b>.`, passos: [
      { text: `Desplego: 3 · 3 · 3 · 3 (no 3 · 4!).`, vis: `<div class="expr-gran">3 · 3 · 3 · 3</div>` },
      { text: `Multiplico en cadena: 3 → 9 → 27 → 81.`, vis: cadenaPot(3, 4) },
      { text: `${pw(3, 4)} = <b>81</b>. <span class="marca-ok">✓</span>`, vis: `<div class="expr-gran">81</div>` }] };
    return { enunciat: `Troba l'exponent: <b>2<sup>?</sup> = 32</b>.`, passos: [
      { text: `Multiplico per 2 fins arribar a 32: 2 → 4 → 8 → 16 → 32.`, vis: cadenaPot(2, 5) },
      { text: `He fet servir el 2 <b>5</b> vegades: ${pw(2, 5)} = 32. <span class="marca-ok">✓</span>`, vis: `<div>${pwH(2, 5, 'gran')}</div>` }] };
  }
};

/* ---------- OBJECTIU 3 · POTÈNCIES DE 10 ---------- */
const nG = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); // 100 000 amb espai fi
const MOTS10 = { 1: 'deu', 2: 'cent', 3: 'mil', 4: 'deu mil', 5: 'cent mil', 6: 'un milió', 9: 'mil milions' };
const zerosHtml = (n, anim = true) => `<div class="w10"><span class="u">1</span>${Array.from({ length: n }, (_, i) => `<span class="z ${anim ? 'pop' : ''}" style="animation-delay:${.2 + i * .35}s">0</span>`).join('')}</div>`;
const errs10 = n => { const r = 10 ** n, o = { [10 * n]: 'baseExp', [10 + n]: 'suma', ...(n >= 1 ? { [10 ** (n - 1)]: 'zeros' } : {}), [10 ** (n + 1)]: 'zeros', ...(n === 0 ? { 0: 'exp0', 10: 'exp0' } : {}) }; delete o[r]; return o; };
const PISTA_W3 = { completa: `A les potències de 10, l'<b>exponent</b> diu quants <b>zeros</b> hi ha darrere de l'1: 10⁴ = 1 0000 → 10 000. I 10⁰ = 1 (cap zero).`, mitja: `Exponent = nombre de zeros.` };
const W3 = {};
W3.calc = (nv, { n = 4 } = {}) => {
  const max = nv === 1 ? 4 : nv === 2 ? 6 : 9; const es = barreja(Array.from({ length: max + 1 }, (_, i) => i)).slice(0, n).sort((a, b) => a - b);
  const items = es.map(e => ({ tipus: 'num', html: pw(10, e), valor: 10 ** e, errs: errs10(e), e }));
  return { sig: `x1-${es.join('_')}`, enunciat: `Calcula. ${nv === 1 ? 'Compta els zeros!' : ''}`, visual: null, pista: PISTA_W3, ...apartats(items),
    explicacio: `L'exponent és el nombre de zeros: 10⁵ = 100 000.`, solucio: items.map(it => `${it.html} = <b>${nG(it.valor)}</b> (${it.e} ${it.e === 1 ? 'zero' : 'zeros'})`) };
};
W3.zeros = (nv, { n = 3 } = {}) => {
  const es = barreja([2, 3, 4, 5, 6, 7, 8].slice(0, nv === 1 ? 4 : 7)).slice(0, n);
  const items = es.map((e, k) => k % 2 === 0 ? { tipus: 'num', llarg: true, html: `Quants zeros té ${pwH(10, e, 'mitja')}?`, valor: e, errs: { [e + 1]: 'zeros', [e - 1]: 'zeros' } }
    : { tipus: 'num', llarg: true, html: `Quants zeros té <b>${nG(10 ** e)}</b>? Per tant, és 10 elevat a…`, valor: e, errs: { [e + 1]: 'zeros', [e - 1]: 'zeros' } });
  return { sig: `x2-${es.join('_')}`, enunciat: `Compta els zeros.`, visual: null, pista: PISTA_W3, ...apartats(items),
    explicacio: `Comptar zeros = trobar l'exponent.`, solucio: items.map(it => `${it.html.replace(/<[^>]+>/g, '')} <b>${it.valor}</b>`) };
};
W3.aPot = (nv, { n = 3 } = {}) => {
  const es = barreja([1, 2, 3, 4, 5, 6, ...(nv === 3 ? [7, 8, 9] : [])]).slice(0, n);
  const items = es.map(e => {
    if (nv === 1) { const ops = barreja([{ html: pw(10, e), val: 'b' }, { html: pw(10, e + 1), val: 'm', tag: 'zeros' }, { html: pw(e, 10), val: 's', tag: 'swap' }, { html: `10 · ${e}`, val: 'x', tag: 'baseExp' }]);
      return { tipus: 'tria', html: `<b>${nG(10 ** e)}</b> =`, opcions: ops, correcta: 'b', etiq: etiqDe(ops) }; }
    return { tipus: 'pot', html: `<b>${nG(10 ** e)}</b> =`, base: 10, exp: e };
  });
  return { sig: `x3-${es.join('_')}`, enunciat: `Escriu cada nombre com una potència de 10.`, visual: null, pista: PISTA_W3, ...apartats(items),
    explicacio: `Compta els zeros: aquest és l'exponent.`, solucio: items.map((it, k) => `${nG(10 ** es[k])} = <b>${pw(10, es[k])}</b>`) };
};
W3.paraules = (nv, { n = 3 } = {}) => {
  const es = barreja(nv === 3 ? [2, 3, 4, 5, 6, 9] : [1, 2, 3, 4, 5, 6]).slice(0, n);
  const items = es.map(e => nv === 1
    ? (() => { const ops = barreja([{ html: pw(10, e), val: 'b' }, { html: pw(10, e === 9 ? 6 : e + 1), val: 'm', tag: 'zeros' }, { html: pw(10, Math.max(0, e - 1)), val: 'n', tag: 'zeros' }].filter((x, i, a) => a.findIndex(y => y.html === x.html) === i)); return { tipus: 'tria', html: `«${majus(MOTS10[e])}» =`, opcions: ops, correcta: 'b', etiq: etiqDe(ops), llarg: true }; })()
    : { tipus: 'num', llarg: true, html: `«${majus(MOTS10[e])}» és 10 elevat a:`, valor: e, errs: { [e + 1]: 'zeros', [e - 1]: 'zeros' } });
  return { sig: `x4-${es.join('_')}`, enunciat: `De paraules a potències de 10.`, visual: null, pista: { completa: `Escriu primer el nombre amb xifres i compta els zeros: mil = 1 000 → 3 zeros → 10³.`, mitja: `Escriu-lo amb xifres.` }, ...apartats(items),
    explicacio: `Mil = 10³, un milió = 10⁶, mil milions = 10⁹.`, solucio: es.map(e => `${majus(MOTS10[e])} = ${nG(10 ** e)} = <b>${pw(10, e)}</b>`) };
};
W3.compara = (nv, { n = 3 } = {}) => {
  const cands = [[[10, 3], 1000], [[10, 4], 1000], [[10, 2], 1000], [[10, 5], 100000], [[10, 0], 10], [[10, 1], 10], [[10, 6], 100000], [[10, 3], 10000]];
  const tria3 = barreja(cands).slice(0, n);
  const items = tria3.map(([[b, e], x], k) => { const va = 10 ** e; const rev = k % 2 === 1; const it = { tipus: 'signe', a: rev ? x : va, b: rev ? va : x, ha: rev ? `<b>${nG(x)}</b>` : pwH(10, e, 'mitja'), hb: rev ? pwH(10, e, 'mitja') : `<b>${nG(x)}</b>`, ta: rev ? nG(x) : pw(10, e), tb: rev ? pw(10, e) : nG(x) }; it.correcta = it.a < it.b ? '<' : it.a > it.b ? '>' : '='; it.etiq = {}; return it; });
  if (nv === 3) { const a = rnd(2, 9), e = rnd(3, 5); const v = a * 10 ** e, w = 10 ** (e + 1); items.push({ tipus: 'signe', a: v, b: w, ha: `<b>${a} · ${pw(10, e)}</b>`, hb: pwH(10, e + 1, 'mitja'), ta: `${a}·${pw(10, e)}`, tb: pw(10, e + 1), correcta: '<', etiq: {} }); }
  return { sig: `x5-${items.map(i => i.ta + i.tb).join('|')}`, enunciat: `Compara: posa <b>&lt;</b>, <b>&gt;</b> o <b>=</b>.`, visual: null, pista: PISTA_W3, ...apartats(items),
    explicacio: `Escriu les potències de 10 amb xifres i compara.`, solucio: items.map(it => `${it.ta} = ${nG(it.a)} i ${it.tb} = ${nG(it.b)}: <b>${it.correcta}</b>`) };
};
W3.notacio = (nv, { n = 3 } = {}) => {
  const items = []; const vist = new Set();
  for (let k = 0; k < n; k++) {
    let a, e, g = 0; do { a = rnd(2, 9); e = rnd(2, 6); } while (vist.has(a + '_' + e) && g++ < 30); vist.add(a + '_' + e);
    if (k % 2 === 0) items.push({ tipus: 'num', llarg: true, html: `${a} · ${pwH(10, e)} =`, valor: a * 10 ** e, errs: { [a * 10 * e]: 'baseExp', [a * 10 ** (e + 1)]: 'zeros', [a * 10 ** (e - 1)]: 'zeros', [10 ** e]: 'oblida' } });
    else items.push({ tipus: 'num', llarg: true, html: `<b>${nG(a * 10 ** e)}</b> = ${a} · 10 elevat a:`, valor: e, errs: { [e + 1]: 'zeros', [e - 1]: 'zeros' } });
  }
  return { sig: `x6-${items.map(i => i.html).join('|')}`, enunciat: `Un nombre per una potència de 10: escriu el nombre i afegeix els zeros.`, visual: null, pista: { completa: `3 · 10⁴ = 3 · 10 000 = <b>30 000</b>: escrius el 3 i hi afegeixes 4 zeros.`, mitja: `El nombre i després els zeros.` }, ...apartats(items),
    explicacio: `a · 10ⁿ: escrius el nombre a i hi afegeixes n zeros.`, solucio: items.map(it => `${it.html.replace(/<[^>]+>/g, '')} <b>${nG(it.valor)}</b>`) };
};
const CTX10 = [
  () => ({ t: `La distància de la Terra a la Lluna és d'uns <b>400 000 km</b>. Escriu-la com 4 · 10 elevat a…`, v: 5 }),
  () => ({ t: `Al món hi ha uns <b>8 000 000 000</b> habitants. Escriu-ho com 8 · 10 elevat a…`, v: 9 }),
  () => ({ t: `Un estadi té <b>90 000</b> seients. Escriu-ho com 9 · 10 elevat a…`, v: 4 }),
  () => ({ t: `El Sol és a uns <b>150 000 000 km</b> de la Terra. Escriu-ho com 15 · 10 elevat a…`, v: 7 }),
  () => ({ t: `En un litre d'aigua de mar hi pot haver <b>1 000 000</b> de bacteris. És 10 elevat a…`, v: 6 }),
  () => ({ t: `Un ordinador fa uns <b>3 000 000 000</b> càlculs per segon. Escriu-ho com 3 · 10 elevat a…`, v: 9 })
];
W3.context = (nv, { n = 2 } = {}) => {
  const fs = barreja(CTX10).slice(0, n).map(f => f());
  const items = fs.map(f => ({ tipus: 'num', llarg: true, html: f.t.replace(/ 000/g, ' 000'), valor: f.v, errs: { [f.v + 1]: 'zeros', [f.v - 1]: 'zeros' } }));
  return { sig: `x7-${fs.map(f => f.v + f.t.slice(0, 12)).join('|')}`, enunciat: `Nombres molt grans de la vida real.`, visual: null, pista: { completa: `Compta els zeros que hi ha <b>darrere</b> del nombre del davant.`, mitja: `Compta els zeros.` }, ...apartats(items),
    explicacio: `Les potències de 10 serveixen per escriure nombres molt grans de manera curta.`, solucio: items.map(it => `<b>${it.valor}</b>`) };
};
TEMES.w3 = {
  gen: W3, senseCalc: true,
  sequencia: {
    1: [['calc', { n: 4 }], ['zeros', { n: 3 }], ['aPot', { n: 3 }], ['paraules', { n: 3 }], ['compara', { n: 3 }], ['calc', { n: 4 }], ['aPot', { n: 3 }], ['paraules', { n: 3 }]],
    2: [['calc', { n: 4 }], ['aPot', { n: 3 }], ['paraules', { n: 3 }], ['zeros', { n: 3 }], ['compara', { n: 4 }], ['calc', { n: 4 }], ['aPot', { n: 3 }], ['paraules', { n: 3 }]],
    3: [['calc', { n: 4 }], ['notacio', { n: 3 }], ['aPot', { n: 3 }], ['context', { n: 2 }], ['compara', { n: 3 }], ['notacio', { n: 3 }], ['paraules', { n: 3 }], ['context', { n: 2 }]]
  },
  explicacio: [
    { text: `<p>Les potències de 10 són les més fàcils: l'<b class="parpelleja">exponent</b> diu quants <b>zeros</b> hi ha darrere de l'1.</p><p class="petit">10¹ = 10 · 10² = 100 · 10³ = 1 000 · 10⁴ = 10 000</p>`, vis: () => `<div style="display:flex;flex-direction:column;gap:6px;align-items:center">${pwH(10, 4, 'gran')}${zerosHtml(4)}</div>` },
    { text: `<p>I <b>10⁰</b>? Cada vegada que l'exponent baixa 1, <b class="parpelleja">dividim entre 10</b>.</p><p class="petit">10² = 100 → 10¹ = 10 → 10⁰ = <b>1</b> (cap zero).</p>`,
      vis: () => `<div class="w-patro">${[[3, 1000], [2, 100], [1, 10], [0, 1]].map(([e, v], i) => `<div class="pop" style="animation-delay:${i * .5}s">${pwH(10, e)}<span>=</span><b>${nG(v)}</b>${i < 3 ? '<i>: 10 ⬇</i>' : ''}</div>`).join('')}</div>` },
    { text: `<p>Al revés: per escriure un nombre gran com a potència, <b class="parpelleja">compta els zeros</b>.</p><p>1 000 000 (un milió) té 6 zeros: <b>10⁶</b>.</p>`, vis: () => `<div style="display:flex;flex-direction:column;gap:10px;align-items:center">${zerosHtml(6)}<div>${pwH(10, 6, 'gran')}</div></div>` },
    { text: `<p>Nombres com <b>3 · 10⁴</b>: escrius el 3 i hi <b class="parpelleja">afegeixes 4 zeros</b>.</p><p>3 · 10⁴ = 3 · 10 000 = <b>30 000</b></p><p class="petit">Així s'escriuen distàncies i quantitats molt grans.</p>`, vis: () => `<div class="w10"><span class="u" style="background:var(--taronja);color:#fff">3</span>${Array.from({ length: 4 }, (_, i) => `<span class="z pop" style="animation-delay:${.3 + i * .35}s">0</span>`).join('')}</div>` }
  ],
  exemple: (nv) => {
    if (nv === 1) return { enunciat: `Calcula <b>${pw(10, 5)}</b>.`, passos: [
      { text: `L'exponent és 5: hi ha <b>5 zeros</b> darrere de l'1.`, vis: zerosHtml(5) },
      { text: `${pw(10, 5)} = <b>100 000</b>. <span class="marca-ok">✓</span>`, vis: `<div class="expr-gran">100 000</div>` }] };
    if (nv === 2) return { enunciat: `Escriu <b>10 000 000</b> com una potència de 10.`, passos: [
      { text: `Compto els zeros: <b>7</b>.`, vis: zerosHtml(7, false) },
      { text: `10 000 000 = <b>${pw(10, 7)}</b>. <span class="marca-ok">✓</span>`, vis: `<div>${pwH(10, 7, 'gran')}</div>` }] };
    return { enunciat: `Calcula <b>6 · ${pw(10, 5)}</b>.`, passos: [
      { text: `${pw(10, 5)} = 100 000.`, vis: zerosHtml(5, false) },
      { text: `6 · 100 000 = <b>600 000</b>: escric el 6 i 5 zeros. <span class="marca-ok">✓</span>`, vis: `<div class="expr-gran">600 000</div>` }] };
  }
};
/* ---------- OBJECTIU 4 · POTÈNCIES DE BASE NEGATIVA ---------- */
const pz4 = v => `(${v < 0 ? '−' + (-v) : '+' + v})`;
const pwN = (b, e) => `(−${-b})${sp(e)}`; // (−2)⁴
const pwM = (b, e) => `−${b}${sp(e)}`; // −2⁴ (sense parèntesi)
const PISTA_W4 = { completa: `Base negativa i exponent <b>parell</b> → resultat <b>positiu</b>. Exponent <b>senar</b> → <b>negatiu</b>. Compte: <b>−2⁴</b> (sense parèntesi) és −(2⁴) = −16.`, mitja: `Parell → +, senar → −. Mira si hi ha parèntesi!` };
const OPS_SG4 = [{ html: '<b style="color:var(--taronja)">+</b> positiu', val: '+' }, { html: '<b style="color:#2a6fd6">−</b> negatiu', val: '-' }];
const errsNeg = (b, e) => { const r = b ** e, o = { [-r]: 'signePot', [b * e]: 'baseExp', [-(b * e)]: 'baseExp' }; delete o[r]; return o; };
const W4 = {};
W4.signe = (nv, { n = 4 } = {}) => {
  const items = []; const vist = new Set();
  for (let k = 0; k < n; k++) {
    let b, e, g = 0; do { b = -rnd(2, nv === 3 ? 12 : 6); e = nv === 3 ? rnd(5, 40) : rnd(2, nv === 1 ? 5 : 9); if (k % 2) e += e % 2 ? 0 : 1; else e += e % 2; } while (vist.has(b + '_' + e) && g++ < 40); vist.add(b + '_' + e);
    items.push({ tipus: 'tria', html: `${pwN(b, e)} serà…`, opcions: OPS_SG4, correcta: e % 2 ? '-' : '+', etiq: { [e % 2 ? '+' : '-']: 'signePot' }, b, e });
  }
  const its = barreja(items);
  return { sig: `y1-${its.map(i => i.html).join('|')}`, enunciat: `<b>Sense calcular</b>: el resultat és positiu o negatiu?`, visual: () => paritatHtml(), pista: PISTA_W4, ...apartats(its),
    explicacio: `Exponent parell → +; exponent senar → −.`, solucio: its.map(it => `${it.html.replace(' serà…', '')}: exponent ${it.e} ${it.e % 2 ? 'senar → <b>−</b>' : 'parell → <b>+</b>'}`) };
};
const paritatHtml = () => `<div class="w4-taula"><div class="cap">Base negativa</div><div class="p"><b>Exponent parell</b><span>(−2)² = +4 · (−2)⁴ = +16</span><em>+</em></div><div class="s"><b>Exponent senar</b><span>(−2)³ = −8 · (−2)⁵ = −32</span><em>−</em></div></div>`;
W4.calc = (nv, { n = 3, uns = false } = {}) => {
  const items = []; const vist = new Set();
  for (let k = 0; k < n; k++) {
    let b, e, g = 0;
    do { if (uns && k === n - 1) { b = tria([-1, -10]); e = b === -1 ? rnd(5, 99) : rnd(2, 3); } else { b = -rnd(2, nv === 1 ? 3 : nv === 2 ? 5 : 6); e = rnd(2, nv === 1 ? 3 : b === -2 ? 6 : 4); } } while ((vist.has(b + '_' + e) || Math.abs(b ** e) > 9999) && g++ < 40);
    vist.add(b + '_' + e); items.push({ tipus: 'enter', html: pwN(b, e), valor: b ** e, errs: errsNeg(b, e), b, e });
  }
  return { sig: `y2-${items.map(i => i.html).join('|')}`, enunciat: `Calcula. Primer el número i després el signe.`, visual: nv === 1 ? () => paritatHtml() : null, pista: PISTA_W4, ...apartats(items),
    explicacio: `Calcula la potència sense signe i després decideix el signe amb l'exponent.`, solucio: items.map(it => `${it.html} = ${it.e <= 6 ? Array(it.e).fill(pz4(it.b)).join(' · ') + ' = ' : ''}<b>${fz(it.valor)}</b> (exponent ${it.e % 2 ? 'senar → −' : 'parell → +'})`) };
};
W4.parentesi = (nv, { n = 2 } = {}) => {
  const items = []; const vist = new Set();
  for (let k = 0; k < n; k++) {
    let a, e, g = 0; do { a = rnd(2, nv === 1 ? 4 : 6); e = k % 2 ? 3 : (nv === 1 ? 2 : tria([2, 4])); } while ((vist.has(a + '_' + e) || a ** e > 9999) && g++ < 40); vist.add(a + '_' + e);
    const ps = barreja([{ tipus: 'enter', html: pwN(-a, e), valor: (-a) ** e, errs: { [-((-a) ** e)]: e % 2 ? 'signePot' : 'parentesi' }, a, e, par: true }, { tipus: 'enter', html: pwM(a, e), valor: -(a ** e), errs: { [a ** e]: 'parentesi' }, a, e, par: false }]);
    items.push(...ps);
  }
  return { sig: `y3-${items.map(i => i.html).join('|')}`, enunciat: `<b>Compte amb els parèntesis!</b> Sense parèntesi, la potència només afecta el número, no el signe.`, visual: () => `<div class="w4-alerta"><div><b>(−2)⁴</b> = (−2)·(−2)·(−2)·(−2) = <b style="color:var(--taronja)">+16</b></div><div><b>−2⁴</b> = −(2·2·2·2) = <b style="color:#2a6fd6">−16</b></div></div>`, pista: PISTA_W4, ...apartats(items),
    explicacio: `(−a)ⁿ: el signe entra a la potència. −aⁿ: primer la potència i després el signe −.`, solucio: items.map(it => it.par ? `${it.html} = <b>${fz(it.valor)}</b> (el − entra a la potència)` : `${it.html} = −(${it.a}${sp(it.e)}) = <b>${fz(it.valor)}</b> (el − queda fora)`) };
};
W4.desplega = (nv, { n = 3 } = {}) => {
  const items = []; const vist = new Set();
  for (let k = 0; k < n; k++) {
    let a, e, g = 0; do { a = rnd(2, 5); e = rnd(2, 4); } while (vist.has(a + '_' + e) && g++ < 30); vist.add(a + '_' + e);
    const par = k % 2 === 0; const bo = par ? Array(e).fill(`(−${a})`).join(' · ') : `−(${Array(e).fill(a).join(' · ')})`;
    const ops = barreja([{ html: bo, val: 'b' }, { html: par ? `−(${Array(e).fill(a).join(' · ')})` : Array(e).fill(`(−${a})`).join(' · '), val: 'p', tag: 'parentesi' }, { html: `(−${a}) · ${e}`, val: 'x', tag: 'baseExp' }]);
    items.push({ tipus: 'tria', html: `${par ? pwN(-a, e) : pwM(a, e)} =`, opcions: ops, correcta: 'b', etiq: etiqDe(ops), llarg: true });
  }
  return { sig: `y4-${items.map(i => i.html).join('|')}`, enunciat: `Tria com es desplega cada potència.`, visual: null, pista: PISTA_W4, ...apartats(items),
    explicacio: `Amb parèntesi es repeteix el nombre negatiu; sense parèntesi, el − queda fora.`, solucio: items.map(it => `${it.html} <b>${it.opcions.find(o => o.val === 'b').html}</b>`) };
};
const VF_W4 = [
  () => { const a = rnd(2, 5); return { h: `${pwN(-a, 2)} = ${a * a}`, ok: true, s: `Exponent parell: positiu.` }; },
  () => { const a = rnd(2, 4); return { h: `${pwN(-a, 3)} = ${a ** 3}`, ok: false, etiq: { si: 'signePot' }, s: `Exponent senar: el resultat és negatiu, −${a ** 3}.` }; },
  () => { const a = rnd(2, 6); return { h: `${pwM(a, 2)} = ${a * a}`, ok: false, etiq: { si: 'parentesi' }, s: `Sense parèntesi: −${a}² = −(${a}·${a}) = −${a * a}.` }; },
  () => { const e = rnd(10, 99); return { h: `(−1)${sp(e)} = ${e % 2 ? '−1' : '1'}`, ok: true, s: `L'exponent ${e} és ${e % 2 ? 'senar' : 'parell'}.` }; },
  () => { const e = 2 * rnd(5, 49) + 1; return { h: `(−1)${sp(e)} = 1`, ok: false, etiq: { si: 'signePot' }, s: `${e} és senar: (−1)${sp(e)} = −1.` }; },
  () => { const a = rnd(2, 4); return { h: `${pwN(-a, 4)} = ${pwM(a, 4)}`, ok: false, etiq: { si: 'parentesi' }, s: `${pwN(-a, 4)} = +${a ** 4} però ${pwM(a, 4)} = −${a ** 4}.` }; },
  () => { const a = rnd(2, 4); return { h: `${pwN(-a, 3)} = ${pwM(a, 3)}`, ok: true, s: `Amb exponent senar tots dos donen −${a ** 3}.` }; }
];
W4.vf = (nv, { n = 3 } = {}) => {
  const ds = barreja(nv === 1 ? VF_W4.slice(0, 5) : VF_W4).slice(0, n).map(f => f());
  const items = ds.map(d => ({ tipus: 'tria', html: d.h, opcions: [{ html: 'Vertader', val: 'si' }, { html: 'Fals', val: 'no' }], correcta: d.ok ? 'si' : 'no', etiq: d.etiq || {}, llarg: true }));
  return { sig: `y5-${ds.map(d => d.h).join('|')}`, enunciat: `Vertader o fals?`, visual: null, pista: PISTA_W4, ...apartats(items),
    explicacio: `Mira l'exponent (parell o senar) i si hi ha parèntesi.`, solucio: ds.map(d => `${d.h}: <b>${d.ok ? 'vertader' : 'fals'}</b>. ${d.s}`) };
};
W4.compara = (nv, { n = 3 } = {}) => {
  const items = []; const vist = new Set();
  for (let k = 0; k < n; k++) {
    let a, e, c, f, g = 0; do { a = -rnd(2, 4); e = rnd(2, 4); c = -rnd(2, 4); f = rnd(2, 4); } while ((vist.has(`${a}${e}${c}${f}`) || (a === c && e === f)) && g++ < 40); vist.add(`${a}${e}${c}${f}`);
    const va = a ** e, vb = c ** f; const ta = pwN(a, e), tb = k === 2 && nv > 1 ? pwM(-c, f) : pwN(c, f); const vb2 = k === 2 && nv > 1 ? -((-c) ** f) : vb;
    items.push({ tipus: 'signe', a: va, b: vb2, ha: `<b>${ta}</b>`, hb: `<b>${tb}</b>`, ta, tb, correcta: va < vb2 ? '<' : va > vb2 ? '>' : '=', etiq: {} });
  }
  return { sig: `y6-${items.map(i => i.ta + i.tb).join('|')}`, enunciat: `Compara: posa <b>&lt;</b>, <b>&gt;</b> o <b>=</b>. Calcula primer cada potència.`, visual: null, pista: PISTA_W4, ...apartats(items),
    explicacio: `Calcula cada potència amb el seu signe i després compara (com a la recta).`, solucio: items.map(it => `${it.ta} = ${fz(it.a)} i ${it.tb} = ${fz(it.b)}: <b>${it.correcta}</b>`) };
};
TEMES.w4 = {
  gen: W4, senseCalc: true, signeEscrit: true,
  sequencia: {
    1: [['signe', { n: 4 }], ['desplega', { n: 3 }], ['calc', { n: 3 }], ['parentesi', { n: 1 }], ['signe', { n: 4 }], ['vf', { n: 3 }], ['calc', { n: 3 }], ['compara', { n: 3 }]],
    2: [['calc', { n: 4 }], ['signe', { n: 4 }], ['parentesi', { n: 2 }], ['vf', { n: 4 }], ['calc', { n: 4, uns: true }], ['compara', { n: 3 }], ['desplega', { n: 3 }], ['parentesi', { n: 2 }]],
    3: [['signe', { n: 4 }], ['calc', { n: 4, uns: true }], ['parentesi', { n: 2 }], ['vf', { n: 4 }], ['compara', { n: 3 }], ['calc', { n: 4 }], ['parentesi', { n: 2 }], ['calc', { n: 4, uns: true }]]
  },
  explicacio: [
    { text: `<p><b>(−2)⁴</b>: el −2 es multiplica 4 vegades.</p><p class="petit">(−2)·(−2)·(−2)·(−2): hi ha <b>4</b> negatius, un nombre <b class="parpelleja">parell</b> → el resultat és <b>positiu</b>: <b>+16</b>.</p>`,
      vis: () => `<div class="w4-cadena"><span>(−2)</span><i>·</i><span>(−2)</span><i>·</i><span>(−2)</span><i>·</i><span>(−2)</span><b>= +16</b></div>` },
    { text: `<p><b>(−2)³</b> = (−2)·(−2)·(−2)</p><p class="petit">Hi ha <b>3</b> negatius, un nombre <b class="parpelleja">senar</b> → el resultat és <b>negatiu</b>: <b>−8</b>.</p>`,
      vis: () => `<div class="w4-cadena"><span>(−2)</span><i>·</i><span>(−2)</span><i>·</i><span>(−2)</span><b class="n">= −8</b></div>` },
    { text: `<p>La regla: base negativa i <b class="parpelleja">exponent parell → +</b>; <b>exponent senar → −</b>.</p><p class="petit">És la regla dels signes de la multiplicació, repetida.</p>`, vis: () => paritatHtml() },
    { text: `<p><b class="parpelleja">Alerta amb els parèntesis!</b></p><p><b>(−2)⁴</b> = +16, però <b>−2⁴</b> = −16.</p><p class="petit">Sense parèntesi, la potència només afecta el 2: −2⁴ = −(2·2·2·2).</p>`,
      vis: () => `<div class="w4-alerta"><div><b>(−2)⁴</b> = (−2)·(−2)·(−2)·(−2) = <b style="color:var(--taronja)">+16</b></div><div><b>−2⁴</b> = −(2·2·2·2) = <b style="color:#2a6fd6">−16</b></div></div>` }
  ],
  exemple: (nv) => {
    if (nv === 1) return { enunciat: `Calcula <b>(−3)²</b>.`, passos: [
      { text: `Primer el número: 3² = 9.`, vis: `<div class="expr-gran">3 · 3 = 9</div>` },
      { text: `Exponent 2, <b>parell</b> → positiu: <b>(−3)² = +9</b>. <span class="marca-ok">✓</span>`, vis: paritatHtml() }] };
    if (nv === 2) return { enunciat: `Calcula <b>(−2)⁵</b> i <b>−2⁴</b>.`, passos: [
      { text: `(−2)⁵: 2⁵ = 32; exponent 5, senar → <b>−32</b>.`, vis: `<div class="expr-gran">(−2)⁵ = −32</div>` },
      { text: `−2⁴: no hi ha parèntesi, el − queda fora: −(2⁴) = <b>−16</b>. <span class="marca-ok">✓</span>`, vis: `<div class="expr-gran">−2⁴ = −16</div>` }] };
    return { enunciat: `Calcula <b>(−1)⁷⁵</b>.`, passos: [
      { text: `1 per 1 per 1… sempre fa 1. Només cal saber el signe.`, vis: `<div class="expr-gran">1⁷⁵ = 1</div>` },
      { text: `75 és <b>senar</b> → negatiu: (−1)⁷⁵ = <b>−1</b>. <span class="marca-ok">✓</span>`, vis: `<div class="expr-gran">(−1)⁷⁵ = −1</div>` }] };
  }
};

UNITATS.p.carregada = true;
