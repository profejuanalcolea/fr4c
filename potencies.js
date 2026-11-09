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

/* =====================================================================
   OBJECTIUS 5, 6 i 7 · OPERACIONS AMB POTÈNCIES DE LA MATEIXA BASE
   5: producte (sumar exponents) · 6: quocient (restar) · 7: potència d'una potència (multiplicar) + barreja
   ===================================================================== */
Object.assign(ETIQ_ERR, {
  multBases: 'multiplica les bases (2³·2⁴ = 4⁷)', multExp: 'multiplica els exponents en el producte (2³·2⁴ = 2¹²)',
  divBases: 'divideix les bases (6⁵ : 6² = 1³)', divExp: 'divideix els exponents (2⁶ : 2² = 2³)', sumaQ: 'suma els exponents en el quocient',
  sumaPP: 'suma els exponents a la potència d\'una potència ((2³)² = 2⁵)', basesDif: 'ajunta potències de bases diferents (2³·3² = 6⁵)',
  exp1: 'oblida que a = a¹ (a · a⁴ = a⁴)', reglaErr: 'aplica una regla que no toca'
});
Object.assign(AVIS_ERR, {
  multBases: 'La <b>base no canvia</b>: es queda igual. Només es <b>sumen els exponents</b>.',
  multExp: 'Al producte els exponents es <b>sumen</b>, no es multipliquen: 2³·2⁴ = 2⁷.',
  divBases: 'La <b>base no canvia</b>: es queda igual. Només es <b>resten els exponents</b>.',
  divExp: 'Al quocient els exponents es <b>resten</b>, no es divideixen: 2⁶ : 2² = 2⁴.',
  sumaQ: 'Al quocient els exponents es <b>resten</b>: el de dalt menys el de baix.',
  sumaPP: 'A la potència d\'una potència els exponents es <b>multipliquen</b>: (2³)² = 2³·2³ = 2⁶.',
  basesDif: 'Només es poden ajuntar potències amb la <b>mateixa base</b>.',
  exp1: 'Recorda que un nombre sol té exponent <b>1</b>: 5 = 5¹.', reglaErr: 'Mira bé l\'operació: <b>producte → sumar</b>, <b>quocient → restar</b>, <b>potència d\'una potència → multiplicar</b>.'
});
document.head.insertAdjacentHTML('beforeend', `<style>
.w5-grups{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;font-size:1.45rem;font-weight:800}
.w5-g{display:inline-flex;gap:4px;padding:6px 8px;border-radius:12px;border:3px solid}.w5-g span{min-width:1.6ch;text-align:center}
.w5-g.a{border-color:var(--taronja);background:#fff3e6}.w5-g.b{border-color:#2a6fd6;background:#eef4ff}.w5-g.c{border-color:#1b9a5a;background:#eafaf1}
.w5-g span.tx{text-decoration:line-through;text-decoration-thickness:3px;color:#c33;opacity:.75}
.w5-g.pop{animation:pop .5s both}.w5-op{font-size:1.6rem;font-weight:900}
.w5-regla{display:grid;gap:8px;min-width:280px}.w5-regla div{display:grid;grid-template-columns:auto 1fr;gap:4px 12px;align-items:center;padding:8px 12px;border-radius:10px;border:2px solid #999;background:#fff;font-size:1.05rem}
.w5-regla b.r{font-size:1.25rem}.w5-regla .on{border-color:var(--taronja);background:#fff3e6;box-shadow:0 0 0 3px #ffd7b0}
.w5-al{display:grid;gap:10px;min-width:280px}.w5-al>div{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:10px 16px;border-radius:12px;border:3px solid;font-size:1.5rem;font-weight:800}.w5-al .ex{display:flex;align-items:center;gap:8px}.w5-al .ex b{font-weight:900}.w5-al .bo{border-color:#1b9a5a;background:#eafaf1}.w5-al .mal{border-color:#d33;background:#fdecec}.w5-al .mal .ex b{text-decoration:line-through;text-decoration-color:#d33}.w5-al em{font-style:normal;font-size:1.6rem}.w5-al .bo em{color:#1b9a5a}.w5-al .mal em{color:#d33}
.w5-frac{display:inline-grid;text-align:center;vertical-align:middle;margin:0 4px}.w5-frac>span:first-child{border-bottom:3px solid #000;padding:0 6px 2px}.w5-frac>span:last-child{padding-top:2px}
</style>`);
const grup = (a, n, cls, { tx = 0, del = 0 } = {}) => `<span class="w5-g ${cls} pop" style="animation-delay:${del}s">${Array.from({ length: n }, (_, i) => `<span class="${i < tx ? 'tx' : ''}">${a}</span>`).join('<i>·</i>')}</span>`;
const pwPP = (a, m, n) => `(${pw(a, m)})${sp(n)}`; // (2³)²
const pwX = (a, m) => m === 1 ? String(a) : pw(a, m); // a¹ s'escriu a
const keyP = (b, e) => `${b}^${e}`;
function errsP(base, exp, cands) { // cands: [[b, e, tag]...] → {"b^e": tag}, sense la bona ni repetits
  const o = {}; for (const [b, e, t] of cands) { if (!Number.isInteger(e) || e < 0 || !Number.isInteger(b)) continue; const k = keyP(b, e); if (b === base && e === exp) continue; if (!(k in o)) o[k] = t; } return o;
}
const reglaHtml = (on) => `<div class="w5-regla">
  <div class="${on === 'p' ? 'on' : ''}"><b class="r">aᵐ · aⁿ = aᵐ⁺ⁿ</b><span>Producte: <b>sumo</b> els exponents</span></div>
  <div class="${on === 'q' ? 'on' : ''}"><b class="r">aᵐ : aⁿ = aᵐ⁻ⁿ</b><span>Quocient: <b>resto</b> els exponents</span></div>
  <div class="${on === 'pp' ? 'on' : ''}"><b class="r">(aᵐ)ⁿ = aᵐ·ⁿ</b><span>Potència d'una potència: <b>multiplico</b></span></div></div>`;
const vfOps = [{ html: 'Vertader', val: 'si' }, { html: 'Fals', val: 'no' }];
const baseP = nv => nv === 1 ? rnd(2, 5) : nv === 2 ? rnd(2, 9) : rnd(2, 12);
function unics(n, fer, clau) { const out = [], vist = new Set(); for (let g = 0; out.length < n && g < 200; g++) { const x = fer(); const k = clau(x); if (vist.has(k)) continue; vist.add(k); out.push(x); } return out; }

/* ---------- OBJECTIU 5 · PRODUCTE ---------- */
const PISTA_W5 = { completa: `Mateixa base: la <b>base es queda igual</b> i els exponents es <b>sumen</b>. ${pw(2, 3)} · ${pw(2, 4)} = 2<sup>3+4</sup> = ${pw(2, 7)}.`, mitja: `Base igual, exponents sumats.` };
const itemProd = (a, ms) => { const s = ms.reduce((x, y) => x + y, 0); const prod = ms.reduce((x, y) => x * y, 1);
  return { tipus: 'pot', html: ms.map(m => pwX(a, m)).join(' · ') + ' =', base: a, exp: s, ms,
    errs: errsP(a, s, [[a ** ms.length, s, 'multBases'], [a, prod, 'multExp'], [a ** ms.length, prod, 'multBases'], ...(ms.includes(1) ? [[a, s - 1, 'exp1']] : [])]) }; };
const W5 = {};
W5.agrupa = (nv) => {
  const a = rnd(2, nv === 1 ? 5 : 9), m = rnd(2, 4), n = rnd(2, nv === 1 ? 3 : 4);
  const it = itemProd(a, [m, n]);
  return { sig: `p0-${a}-${m}-${n}`, enunciat: `Desplega i compta: quantes vegades surt el ${a}?`, visual: () => `<div class="w5-grups">${grup(a, m, 'a')}<span class="w5-op">·</span>${grup(a, n, 'b', { del: .3 })}</div>`,
    pista: PISTA_W5, ...apartats([it]), explicacio: `${pw(a, m)} · ${pw(a, n)}: ${m} vegades més ${n} vegades = ${m + n} vegades.`, solucio: [`${it.html} <b>${pw(a, m + n)}</b> (${m} + ${n} = ${m + n})`] };
};
W5.pot = (nv, { n = 3, tres = false } = {}) => {
  const its = unics(n, () => { const a = baseP(nv); const k = tres ? 3 : 2; const ms = Array.from({ length: k }, () => rnd(nv === 2 && Math.random() < .25 ? 1 : 2, nv === 1 ? 4 : 7)); return itemProd(a, ms); }, it => it.html);
  return { sig: `p1-${its.map(i => i.html).join('|')}`, enunciat: `Escriu com una sola potència.`, visual: nv === 1 ? () => reglaHtml('p') : null, pista: PISTA_W5, ...apartats(its),
    explicacio: `Base igual i exponents sumats.`, solucio: its.map(it => `${it.html} ${it.base}<sup>${it.ms.join('+')}</sup> = <b>${pw(it.base, it.exp)}</b>`) };
};
W5.tria = (nv, { n = 3 } = {}) => {
  const its = unics(n, () => { const a = baseP(nv), m = rnd(2, 6), k = rnd(2, 6); const s = m + k;
    const ops = barreja([{ html: pw(a, s), val: 'b' }, { html: pw(a * a, s), val: 'mb', tag: 'multBases' }, { html: pw(a, m * k === s ? s + 1 : m * k), val: 'me', tag: 'multExp' }, { html: pw(a * a, m * k), val: 'x', tag: 'multBases' }].filter((o, i, v) => v.findIndex(y => y.html === o.html) === i));
    return { tipus: 'tria', html: `${pw(a, m)} · ${pw(a, k)} =`, opcions: ops, correcta: 'b', etiq: etiqDe(ops), s, a, m, k }; }, it => it.html);
  return { sig: `p2-${its.map(i => i.html).join('|')}`, enunciat: `Tria el resultat correcte.`, visual: null, pista: PISTA_W5, ...apartats(its),
    explicacio: `La base no canvia; els exponents se sumen.`, solucio: its.map(it => `${it.html} <b>${pw(it.a, it.s)}</b>`) };
};
W5.falta = (nv, { n = 3 } = {}) => {
  const its = unics(n, () => { const a = baseP(nv), m = rnd(2, 6), f = rnd(2, 6); const t = m + f;
    return { tipus: 'num', llarg: true, html: `${pw(a, m)} · ${a}<sup>?</sup> = ${pw(a, t)} &nbsp;→&nbsp; l'exponent que falta és:`, valor: f, errs: { [t + m]: 'reglaErr' }, a, m, t }; }, it => it.html);
  return { sig: `p3-${its.map(i => i.html).join('|')}`, enunciat: `Troba l'exponent que falta.`, visual: null, pista: { completa: `Quant he de sumar a ${its[0].m} per arribar a ${its[0].t}?`, mitja: `Pensa en una suma: ${its[0].m} + ? = ${its[0].t}.` }, ...apartats(its),
    explicacio: `Com que els exponents se sumen, l'exponent que falta és la diferència.`, solucio: its.map(it => `${it.m} + <b>${it.valor}</b> = ${it.t}`) };
};
W5.valor = (nv, { n = 3 } = {}) => {
  const its = unics(n, () => { const a = rnd(2, 3), m = rnd(1, 3), k = rnd(1, a === 2 ? 4 : 2); const v = a ** (m + k);
    return { tipus: 'num', html: `${pwX(a, m)} · ${pwX(a, k)}`, valor: v, errs: { [(a * a) ** (m + k)]: 'multBases', [a ** (m * k)]: 'multExp' }, a, m, k }; }, it => it.html);
  its.forEach(it => { delete it.errs[it.valor]; });
  return { sig: `p4-${its.map(i => i.html).join('|')}`, enunciat: `Primer ajunta-ho en una sola potència i després calcula.`, visual: null, pista: PISTA_W5, ...apartats(its),
    explicacio: `Ajunta-ho (sumant exponents) i calcula la potència.`, solucio: its.map(it => `${it.html} = ${pw(it.a, it.m + it.k)} = <b>${it.valor}</b>`) };
};
const VF_W5 = [
  () => { const a = rnd(2, 7), m = rnd(2, 5), k = rnd(2, 5); return { h: `${pw(a, m)} · ${pw(a, k)} = ${pw(a, m + k)}`, ok: true, s: `Base igual, ${m} + ${k} = ${m + k}.` }; },
  () => { const a = rnd(2, 5), m = rnd(2, 5), k = rnd(2, 5); return { h: `${pw(a, m)} · ${pw(a, k)} = ${pw(a * a, m + k)}`, ok: false, etiq: { si: 'multBases' }, s: `La base no es multiplica: és ${pw(a, m + k)}.` }; },
  () => { const a = rnd(2, 7), m = rnd(3, 5), k = rnd(3, 5); return { h: `${pw(a, m)} · ${pw(a, k)} = ${pw(a, m * k)}`, ok: false, etiq: { si: 'multExp' }, s: `Els exponents se sumen: ${pw(a, m + k)}.` }; },
  () => { const a = rnd(2, 4), b = a + rnd(1, 3), m = rnd(2, 4), k = rnd(2, 4); return { h: `${pw(a, m)} · ${pw(b, k)} = ${pw(a * b, m + k)}`, ok: false, etiq: { si: 'basesDif' }, s: `Les bases són diferents: no es poden ajuntar així.` }; },
  () => { const a = rnd(2, 9), k = rnd(2, 6); return { h: `${a} · ${pw(a, k)} = ${pw(a, k + 1)}`, ok: true, s: `${a} = ${a}¹, i 1 + ${k} = ${k + 1}.` }; },
  () => { const a = rnd(2, 9), k = rnd(2, 6); return { h: `${a} · ${pw(a, k)} = ${pw(a, k)}`, ok: false, etiq: { si: 'exp1' }, s: `${a} = ${a}¹: el resultat és ${pw(a, k + 1)}.` }; }
];
W5.vf = (nv, { n = 3 } = {}) => {
  const ds = barreja(VF_W5).slice(0, n).map(f => f());
  const its = ds.map(d => ({ tipus: 'tria', html: d.h, opcions: vfOps, correcta: d.ok ? 'si' : 'no', etiq: d.etiq || {}, llarg: true }));
  return { sig: `p5-${ds.map(d => d.h).join('|')}`, enunciat: `Vertader o fals?`, visual: null, pista: PISTA_W5, ...apartats(its),
    explicacio: `Mira la base (ha de ser la mateixa) i els exponents (se sumen).`, solucio: ds.map(d => `${d.h}: <b>${d.ok ? 'vertader' : 'fals'}</b>. ${d.s}`) };
};
W5.lletres = (nv, { n = 3 } = {}) => {
  const L = ['x', 'a', 'm'];
  const its = unics(n, () => { const x = tria(L), m = rnd(2, 6), k = rnd(1, 6), s = m + k;
    const ops = barreja([{ html: `${x}${sp(s)}`, val: 'b' }, { html: `${x}${sp(m * k === s ? s + 2 : m * k)}`, val: 'me', tag: 'multExp' }, { html: `2${x}${sp(s)}`, val: 'd', tag: 'multBases' }]);
    return { tipus: 'tria', html: `${x}${sp(m)} · ${k === 1 ? x : x + sp(k)} =`, opcions: ops, correcta: 'b', etiq: etiqDe(ops), s, x }; }, it => it.html);
  return { sig: `p6-${its.map(i => i.html).join('|')}`, enunciat: `La regla també funciona amb lletres. Tria el resultat.`, visual: null, pista: PISTA_W5, ...apartats(its),
    explicacio: `x³ · x⁴ = x⁷: la regla és la mateixa encara que la base sigui una lletra.`, solucio: its.map(it => `${it.html} <b>${it.x}${sp(it.s)}</b>`) };
};
W5.esPot = (nv, { n = 4 } = {}) => {
  const its = unics(n, () => { const si = Math.random() < .5; const a = rnd(2, 6), b = si ? a : a + rnd(1, 3), m = rnd(2, 5), k = rnd(2, 5);
    return { tipus: 'tria', html: `${pw(a, m)} · ${pw(b, k)}`, opcions: [{ html: 'Sí', val: 'si' }, { html: 'No', val: 'no' }], correcta: si ? 'si' : 'no', etiq: si ? {} : { si: 'basesDif' }, a, b, m, k }; }, it => it.html);
  return { sig: `p7-${its.map(i => i.html).join('|')}`, enunciat: `Es pot escriure com <b>una sola potència</b>?`, visual: null, pista: { completa: `Només si les dues potències tenen la <b>mateixa base</b>.`, mitja: `Mira les bases.` }, ...apartats(its),
    explicacio: `La regla només val per a la mateixa base.`, solucio: its.map(it => `${it.html}: <b>${it.correcta === 'si' ? `sí, ${pw(it.a, it.m + it.k)}` : 'no (bases diferents)'}</b>`) };
};
TEMES.w5 = {
  gen: W5, senseCalc: true,
  sequencia: {
    1: [['agrupa'], ['pot', { n: 3 }], ['tria', { n: 3 }], ['agrupa'], ['valor', { n: 3 }], ['vf', { n: 3 }], ['pot', { n: 4 }], ['falta', { n: 2 }]],
    2: [['pot', { n: 4 }], ['tria', { n: 3 }], ['falta', { n: 3 }], ['vf', { n: 4 }], ['pot', { n: 3, tres: true }], ['esPot', { n: 4 }], ['valor', { n: 3 }], ['pot', { n: 4 }]],
    3: [['pot', { n: 4 }], ['pot', { n: 3, tres: true }], ['falta', { n: 3 }], ['vf', { n: 4 }], ['lletres', { n: 3 }], ['esPot', { n: 4 }], ['pot', { n: 3, tres: true }], ['lletres', { n: 3 }]]
  },
  explicacio: [
    { text: `<p>Volem fer <b>${pw(2, 3)} · ${pw(2, 4)}</b>. Desplegem cada potència:</p><p class="petit">${pw(2, 3)} = 2 · 2 · 2 &nbsp;i&nbsp; ${pw(2, 4)} = 2 · 2 · 2 · 2</p>`,
      vis: () => `<div class="w5-grups">${grup(2, 3, 'a')}<span class="w5-op">·</span>${grup(2, 4, 'b', { del: .4 })}</div>` },
    { text: `<p>Ajuntem-ho tot: el 2 surt <b class="parpelleja">3 + 4 = 7 vegades</b>.</p><p>${pw(2, 3)} · ${pw(2, 4)} = <b>${pw(2, 7)}</b></p>`,
      vis: () => `<div style="display:flex;flex-direction:column;align-items:center;gap:10px"><div class="w5-grups">${grup(2, 3, 'a')}${grup(2, 4, 'b', { del: .2 })}</div><div>${pwH(2, 7, 'gran')}</div></div>` },
    { text: `<p>La regla: amb la <b>mateixa base</b>, la base <b class="parpelleja">es queda igual</b> i els exponents <b class="parpelleja-2">es sumen</b>.</p><p class="expr-gran" style="margin:6px 0">aᵐ · aⁿ = aᵐ⁺ⁿ</p>`, vis: () => reglaHtml('p') },
    { text: `<p><b class="parpelleja">Alerta</b> amb dos errors molt típics:</p><p class="petit">${pw(2, 3)} · ${pw(2, 4)} <b>no</b> és ${pw(4, 7)} (la base no es multiplica) ni ${pw(2, 12)} (els exponents no es multipliquen).</p><p class="petit">I ${pw(2, 3)} · ${pw(3, 2)} no es pot ajuntar: les bases són diferents.</p>`,
      vis: () => `<div class="w5-al"><div class="bo"><span class="ex">${pwH(2, 3)} · ${pwH(2, 4)}<span>=</span><b>${pwH(2, 7)}</b></span><em>✓</em></div><div class="mal"><span class="ex">${pwH(2, 3)} · ${pwH(2, 4)}<span>=</span><b>${pwH(4, 7)}</b></span><em>✗</em></div><div class="mal"><span class="ex">${pwH(2, 3)} · ${pwH(2, 4)}<span>=</span><b>${pwH(2, 12)}</b></span><em>✗</em></div></div>` }
  ],
  exemple: (nv) => {
    if (nv === 1) return { enunciat: `Escriu <b>${pw(3, 2)} · ${pw(3, 4)}</b> com una sola potència.`, passos: [
      { text: `Desplego: el 3 surt 2 vegades i després 4 vegades.`, vis: `<div class="w5-grups">${grup(3, 2, 'a')}<span class="w5-op">·</span>${grup(3, 4, 'b')}</div>` },
      { text: `En total, 2 + 4 = <b>6</b> vegades: <b>${pw(3, 6)}</b>. <span class="marca-ok">✓</span>`, vis: `<div>${pwH(3, 6, 'gran')}</div>` }] };
    if (nv === 2) return { enunciat: `Escriu <b>${pw(5, 2)} · 5 · ${pw(5, 3)}</b> com una sola potència.`, passos: [
      { text: `El 5 sol és ${pw(5, 1)}.`, vis: `<div class="expr-gran">${pw(5, 2)} · ${pw(5, 1)} · ${pw(5, 3)}</div>` },
      { text: `Sumo els exponents: 2 + 1 + 3 = 6 → <b>${pw(5, 6)}</b>. <span class="marca-ok">✓</span>`, vis: `<div>${pwH(5, 6, 'gran')}</div>` }] };
    return { enunciat: `Troba l'exponent: <b>${pw(7, 4)} · 7<sup>?</sup> = ${pw(7, 11)}</b>.`, passos: [
      { text: `Els exponents se sumen: 4 + ? = 11.`, vis: `<div class="expr-gran">4 + ? = 11</div>` },
      { text: `? = 11 − 4 = <b>7</b>. Comprovo: ${pw(7, 4)} · ${pw(7, 7)} = ${pw(7, 11)}. <span class="marca-ok">✓</span>`, vis: `<div class="expr-gran">? = 7</div>` }] };
  }
};

/* ---------- OBJECTIU 6 · QUOCIENT ---------- */
const PISTA_W6 = { completa: `Mateixa base: la <b>base es queda igual</b> i els exponents es <b>resten</b> (el de dalt menys el de baix). ${pw(2, 6)} : ${pw(2, 2)} = 2<sup>6−2</sup> = ${pw(2, 4)}.`, mitja: `Base igual, exponents restats.` };
const fracP = (dalt, baix) => `<span class="w5-frac"><span>${dalt}</span><span>${baix}</span></span>`;
const itemQuoc = (a, m, k, { frac = false } = {}) => { const d = m - k;
  return { tipus: 'pot', html: (frac ? fracP(pw(a, m), pw(a, k)) : `${pw(a, m)} : ${pw(a, k)}`) + ' =', base: a, exp: d, m, k, a,
    errs: errsP(a, d, [[1, d, 'divBases'], ...(m % k === 0 ? [[a, m / k, 'divExp']] : []), [a, m + k, 'sumaQ'], [1, m / k, 'divBases'], [a, k - m, 'sumaQ']]) }; };
const parellaQ = nv => { const m = rnd(3, nv === 1 ? 7 : 12); const k = rnd(1, m - 1); return [m, k]; };
const W6 = {};
W6.ratlla = (nv) => {
  const a = rnd(2, nv === 1 ? 5 : 9); const m = rnd(4, 6), k = rnd(2, m - 2); const it = itemQuoc(a, m, k);
  return { sig: `q0-${a}-${m}-${k}`, enunciat: `Ratlla els que es van i compta els que queden.`, visual: () => `<div style="display:flex;flex-direction:column;align-items:center;gap:4px">${grup(a, m, 'a', { tx: k })}<div style="width:100%;max-width:340px;border-top:4px solid #000"></div>${grup(a, k, 'b', { tx: k, del: .3 })}</div>`,
    pista: PISTA_W6, ...apartats([it]), explicacio: `De dalt i de baix se'n van ${k}: en queden ${m} − ${k} = ${m - k}.`, solucio: [`${it.html} <b>${pw(a, m - k)}</b> (${m} − ${k} = ${m - k})`] };
};
W6.pot = (nv, { n = 3, frac = false } = {}) => {
  const its = unics(n, () => { const [m, k] = parellaQ(nv); return itemQuoc(baseP(nv), m, k, { frac: frac && Math.random() < .5 }); }, it => it.html);
  return { sig: `q1-${its.map(i => i.html).join('|')}`, enunciat: `Escriu com una sola potència.${frac ? ' Una fracció també és una divisió.' : ''}`, visual: nv === 1 ? () => reglaHtml('q') : null, pista: PISTA_W6, ...apartats(its),
    explicacio: `Base igual i exponents restats.`, solucio: its.map(it => `${it.html} ${it.a}<sup>${it.m}−${it.k}</sup> = <b>${pw(it.a, it.exp)}</b>`) };
};
W6.tria = (nv, { n = 3 } = {}) => {
  const its = unics(n, () => { const a = baseP(nv); let m, k; do { [m, k] = parellaQ(nv); } while (m % k !== 0 || m / k === m - k || k === 1);
    const ops = barreja([{ html: pw(a, m - k), val: 'b' }, { html: pw(1, m - k), val: 'db', tag: 'divBases' }, { html: pw(a, m / k), val: 'de', tag: 'divExp' }, { html: pw(a, m + k), val: 's', tag: 'sumaQ' }]);
    return { tipus: 'tria', html: `${pw(a, m)} : ${pw(a, k)} =`, opcions: ops, correcta: 'b', etiq: etiqDe(ops), a, m, k }; }, it => it.html);
  return { sig: `q2-${its.map(i => i.html).join('|')}`, enunciat: `Tria el resultat correcte.`, visual: null, pista: PISTA_W6, ...apartats(its),
    explicacio: `La base no canvia; els exponents es resten.`, solucio: its.map(it => `${it.html} <b>${pw(it.a, it.m - it.k)}</b> (${it.m} − ${it.k})`) };
};
W6.falta = (nv, { n = 3 } = {}) => {
  const its = unics(n, () => { const a = baseP(nv), [m, k] = parellaQ(nv); const d = m - k; const quin = Math.random() < .5 ? 'baix' : 'dalt';
    return quin === 'baix'
      ? { tipus: 'num', llarg: true, html: `${pw(a, m)} : ${a}<sup>?</sup> = ${pw(a, d)} &nbsp;→&nbsp; l'exponent que falta és:`, valor: k, errs: { [m + d]: 'sumaQ' }, m, d, k, quin }
      : { tipus: 'num', llarg: true, html: `${a}<sup>?</sup> : ${pw(a, k)} = ${pw(a, d)} &nbsp;→&nbsp; l'exponent que falta és:`, valor: m, errs: { [Math.abs(d - k) || -1]: 'sumaQ' }, m, d, k, quin }; }, it => it.html);
  return { sig: `q3-${its.map(i => i.html).join('|')}`, enunciat: `Troba l'exponent que falta.`, visual: null, pista: { completa: `Els exponents es resten: dalt − baix = resultat. Pensa quin nombre fa que la resta surti bé.`, mitja: `Fes la resta al revés.` }, ...apartats(its),
    explicacio: `Al quocient, exponent de dalt − exponent de baix = exponent del resultat.`, solucio: its.map(it => `${it.m} − ${it.k} = ${it.d}: falta el <b>${it.valor}</b>`) };
};
W6.igual = (nv, { n = 3 } = {}) => {
  const its = unics(n, () => { const a = baseP(nv), m = rnd(2, 8); return { tipus: 'num', html: `${pw(a, m)} : ${pw(a, m)}`, valor: 1, errs: { 0: 'exp0' }, a, m }; }, it => it.html);
  return { sig: `q4-${its.map(i => i.html).join('|')}`, enunciat: `Calcula. Compte: el resultat és un nombre, no una potència.`, visual: () => `<div class="w5-al"><div class="bo"><span class="ex">${pwH(5, 3)} : ${pwH(5, 3)}<span>= ${pwH(5, 0)} =</span><b>1</b></span><em>✓</em></div><div class="mal"><span class="ex">${pwH(5, 3)} : ${pwH(5, 3)}<span>=</span><b>0</b></span><em>✗</em></div></div>`,
    pista: { completa: `Un nombre dividit entre ell mateix fa <b>1</b>. I amb la regla: 3 − 3 = 0, i a⁰ = 1.`, mitja: `Qualsevol nombre dividit per ell mateix…` }, ...apartats(its),
    explicacio: `aᵐ : aᵐ = a⁰ = 1. Per això l'exponent 0 dona 1!`, solucio: its.map(it => `${it.html} = ${pw(it.a, 0)} = <b>1</b>`) };
};
W6.valor = (nv, { n = 3 } = {}) => {
  const its = unics(n, () => { const a = rnd(2, 3), d = rnd(1, a === 2 ? 5 : 3), k = rnd(2, 6), m = d + k;
    const errs = { [a ** (m + k)]: 'sumaQ', ...(m % k === 0 ? { [a ** (m / k)]: 'divExp' } : {}), 1: 'divBases' }; delete errs[a ** d];
    return { tipus: 'num', html: `${pw(a, m)} : ${pw(a, k)}`, valor: a ** d, errs, a, m, k, d }; }, it => it.html);
  return { sig: `q5-${its.map(i => i.html).join('|')}`, enunciat: `Primer fes-ne una sola potència i després calcula.`, visual: null, pista: PISTA_W6, ...apartats(its),
    explicacio: `Sense la regla seria molt llarg: ${pw(2, 9)} = 512! Amb la regla és fàcil.`, solucio: its.map(it => `${it.html} = ${pw(it.a, it.d)} = <b>${it.valor}</b>`) };
};
const VF_W6 = [
  () => { const a = rnd(2, 9), m = rnd(5, 9), k = rnd(2, m - 2); return { h: `${pw(a, m)} : ${pw(a, k)} = ${pw(a, m - k)}`, ok: true, s: `${m} − ${k} = ${m - k}.` }; },
  () => { const a = rnd(2, 9), m = rnd(5, 9), k = rnd(2, m - 2); return { h: `${pw(a, m)} : ${pw(a, k)} = ${pw(1, m - k)}`, ok: false, etiq: { si: 'divBases' }, s: `La base no es divideix: és ${pw(a, m - k)}.` }; },
  () => { const a = rnd(2, 9); const [m, k] = tria([[8, 2], [9, 3], [6, 3], [10, 2], [12, 4]]); return { h: `${pw(a, m)} : ${pw(a, k)} = ${pw(a, m / k)}`, ok: false, etiq: { si: 'divExp' }, s: `Els exponents es resten: ${pw(a, m - k)}.` }; },
  () => { const a = rnd(2, 9), m = rnd(2, 7); return { h: `${pw(a, m)} : ${pw(a, m)} = 1`, ok: true, s: `${pw(a, 0)} = 1.` }; },
  () => { const a = rnd(2, 9), m = rnd(2, 7); return { h: `${pw(a, m)} : ${pw(a, m)} = 0`, ok: false, etiq: { si: 'exp0' }, s: `És ${pw(a, 0)}, que val 1.` }; },
  () => { const a = rnd(2, 9), m = rnd(4, 8); return { h: `${pw(a, m)} : ${a} = ${pw(a, m - 1)}`, ok: true, s: `${a} = ${a}¹: ${m} − 1 = ${m - 1}.` }; }
];
W6.vf = (nv, { n = 3 } = {}) => {
  const ds = barreja(VF_W6).slice(0, n).map(f => f());
  const its = ds.map(d => ({ tipus: 'tria', html: d.h, opcions: vfOps, correcta: d.ok ? 'si' : 'no', etiq: d.etiq || {}, llarg: true }));
  return { sig: `q6-${ds.map(d => d.h).join('|')}`, enunciat: `Vertader o fals?`, visual: null, pista: PISTA_W6, ...apartats(its),
    explicacio: `Base igual i exponents restats.`, solucio: ds.map(d => `${d.h}: <b>${d.ok ? 'vertader' : 'fals'}</b>. ${d.s}`) };
};
TEMES.w6 = {
  gen: W6, senseCalc: true,
  sequencia: {
    1: [['ratlla'], ['pot', { n: 3 }], ['tria', { n: 3 }], ['ratlla'], ['igual', { n: 2 }], ['valor', { n: 3 }], ['vf', { n: 3 }], ['pot', { n: 4 }]],
    2: [['pot', { n: 4 }], ['tria', { n: 3 }], ['igual', { n: 3 }], ['falta', { n: 3 }], ['vf', { n: 4 }], ['pot', { n: 4, frac: true }], ['valor', { n: 3 }], ['falta', { n: 3 }]],
    3: [['pot', { n: 4, frac: true }], ['falta', { n: 3 }], ['vf', { n: 4 }], ['igual', { n: 3 }], ['tria', { n: 3 }], ['pot', { n: 4, frac: true }], ['falta', { n: 3 }], ['valor', { n: 3 }]]
  },
  explicacio: [
    { text: `<p>Volem fer <b>${pw(2, 5)} : ${pw(2, 2)}</b>. Una divisió és com una fracció:</p><p class="petit">a dalt hi ha cinc 2 i a baix, dos 2.</p>`,
      vis: () => `<div style="display:flex;flex-direction:column;align-items:center;gap:4px">${grup(2, 5, 'a')}<div style="width:100%;max-width:340px;border-top:4px solid #000"></div>${grup(2, 2, 'b')}</div>` },
    { text: `<p>Els que estan a dalt i a baix <b class="parpelleja">es van</b> (2 : 2 = 1).</p><p>En queden <b>5 − 2 = 3</b>: ${pw(2, 5)} : ${pw(2, 2)} = <b>${pw(2, 3)}</b>.</p>`,
      vis: () => `<div style="display:flex;flex-direction:column;align-items:center;gap:4px">${grup(2, 5, 'a', { tx: 2 })}<div style="width:100%;max-width:340px;border-top:4px solid #000"></div>${grup(2, 2, 'b', { tx: 2 })}<div style="margin-top:8px">${pwH(2, 3, 'gran')}</div></div>` },
    { text: `<p>La regla: amb la <b>mateixa base</b>, la base <b class="parpelleja">es queda igual</b> i els exponents <b class="parpelleja-2">es resten</b>.</p><p class="expr-gran" style="margin:6px 0">aᵐ : aⁿ = aᵐ⁻ⁿ</p>`, vis: () => reglaHtml('q') },
    { text: `<p>I si són iguals? ${pw(5, 3)} : ${pw(5, 3)} = 5<sup>3−3</sup> = ${pw(5, 0)} = <b class="parpelleja">1</b>.</p><p class="petit">Un nombre dividit per ell mateix fa 1. Per això a⁰ = 1!</p><p class="petit"><b>Alerta:</b> ${pw(6, 5)} : ${pw(6, 2)} no és ${pw(1, 3)}: la base <b>no</b> es divideix.</p>`,
      vis: () => `<div class="w5-al"><div class="bo"><span class="ex">${pwH(5, 3)} : ${pwH(5, 3)}<span>=</span><b>1</b></span><em>✓</em></div><div class="mal"><span class="ex">${pwH(6, 5)} : ${pwH(6, 2)}<span>=</span><b>${pwH(1, 3)}</b></span><em>✗</em></div></div>` }
  ],
  exemple: (nv) => {
    if (nv === 1) return { enunciat: `Escriu <b>${pw(3, 6)} : ${pw(3, 2)}</b> com una sola potència.`, passos: [
      { text: `A dalt sis 3, a baix dos 3. Ratllo els que es van.`, vis: `<div style="display:flex;flex-direction:column;align-items:center;gap:4px">${grup(3, 6, 'a', { tx: 2 })}<div style="width:100%;max-width:340px;border-top:4px solid #000"></div>${grup(3, 2, 'b', { tx: 2 })}</div>` },
      { text: `En queden 6 − 2 = <b>4</b>: <b>${pw(3, 4)}</b>. <span class="marca-ok">✓</span>`, vis: `<div>${pwH(3, 4, 'gran')}</div>` }] };
    if (nv === 2) return { enunciat: `Calcula <b>${pw(2, 9)} : ${pw(2, 6)}</b>.`, passos: [
      { text: `Resto els exponents: 9 − 6 = 3 → ${pw(2, 3)}.`, vis: `<div class="expr-gran">${pw(2, 9)} : ${pw(2, 6)} = ${pw(2, 3)}</div>` },
      { text: `${pw(2, 3)} = 2 · 2 · 2 = <b>8</b>. <span class="marca-ok">✓</span>`, vis: `<div class="expr-gran">8</div>` }] };
    return { enunciat: `Troba l'exponent: <b>5<sup>?</sup> : ${pw(5, 4)} = ${pw(5, 3)}</b>.`, passos: [
      { text: `? − 4 = 3.`, vis: `<div class="expr-gran">? − 4 = 3</div>` },
      { text: `? = 3 + 4 = <b>7</b>. Comprovo: ${pw(5, 7)} : ${pw(5, 4)} = ${pw(5, 3)}. <span class="marca-ok">✓</span>`, vis: `<div class="expr-gran">? = 7</div>` }] };
  }
};

/* ---------- OBJECTIU 7 · POTÈNCIA D'UNA POTÈNCIA + BARREJA ---------- */
const PISTA_W7 = { completa: `Potència d'una potència: la base es queda igual i els exponents es <b>multipliquen</b>. (${pw(2, 3)})² = ${pw(2, 3)} · ${pw(2, 3)} = ${pw(2, 6)}.`, mitja: `Exponents multiplicats.` };
const PISTA_MIX = { completa: `Primer mira l'operació: <b>producte → sumo</b>, <b>quocient → resto</b>, <b>potència d'una potència → multiplico</b>.`, mitja: `Quina operació és?` };
const itemPP = (a, m, k) => ({ tipus: 'pot', html: `${pwPP(a, m, k)} =`, base: a, exp: m * k, a, m, k, regla: 'pp',
  errs: errsP(a, m * k, [[a, m + k, 'sumaPP'], [a * k, m, 'baseExp'], [a, m ** k, 'reglaErr']]) });
function itemMix(nv, quina = tria(['p', 'q', 'pp'])) {
  const a = baseP(nv);
  if (quina === 'p') { const m = rnd(2, 6), k = rnd(2, 6); return { ...itemProd(a, [m, k]), errs: errsP(a, m + k, [[a * a, m + k, 'multBases'], [a, m * k, 'reglaErr'], [a, Math.abs(m - k), 'reglaErr']]), regla: 'p', sol: `${m} + ${k}` }; }
  if (quina === 'q') { const m = rnd(5, 10), k = rnd(2, m - 2); return { ...itemQuoc(a, m, k), errs: errsP(a, m - k, [[1, m - k, 'divBases'], [a, m + k, 'reglaErr'], [a, m * k, 'reglaErr'], ...(m % k === 0 ? [[a, m / k, 'divExp']] : [])]), regla: 'q', sol: `${m} − ${k}` }; }
  const m = rnd(2, 4), k = rnd(2, 4); return { ...itemPP(a, m, k), errs: errsP(a, m * k, [[a, m + k, 'sumaPP'], [a, Math.abs(m - k), 'reglaErr']]), sol: `${m} · ${k}` };
}
const W7 = {};
W7.desplega = (nv) => {
  const a = rnd(2, nv === 1 ? 5 : 9), m = rnd(2, 4), k = rnd(2, 3); const it = itemPP(a, m, k);
  return { sig: `r0-${a}-${m}-${k}`, enunciat: `${pwPP(a, m, k)} vol dir ${pw(a, m)} multiplicat ${k} vegades. Compta quantes vegades surt el ${a}.`,
    visual: () => `<div class="w5-grups">${Array.from({ length: k }, (_, i) => grup(a, m, ['a', 'b', 'c'][i % 3], { del: i * .3 })).join('<span class="w5-op">·</span>')}</div>`,
    pista: PISTA_W7, ...apartats([it]), explicacio: `${k} grups de ${m}: ${m} · ${k} = ${m * k} vegades.`, solucio: [`${it.html} ${Array(k).fill(pw(a, m)).join(' · ')} = <b>${pw(a, m * k)}</b>`] };
};
W7.pot = (nv, { n = 3 } = {}) => {
  const its = unics(n, () => itemPP(baseP(nv), rnd(2, nv === 1 ? 3 : 5), rnd(2, nv === 1 ? 3 : 5)), it => it.html);
  return { sig: `r1-${its.map(i => i.html).join('|')}`, enunciat: `Escriu com una sola potència.`, visual: nv === 1 ? () => reglaHtml('pp') : null, pista: PISTA_W7, ...apartats(its),
    explicacio: `Base igual i exponents multiplicats.`, solucio: its.map(it => `${it.html} ${it.a}<sup>${it.m}·${it.k}</sup> = <b>${pw(it.a, it.exp)}</b>`) };
};
W7.tria = (nv, { n = 3 } = {}) => {
  const its = unics(n, () => { const a = baseP(nv); let m, k; do { m = rnd(2, 5); k = rnd(2, 5); } while (m * k === m + k);
    const ops = barreja([{ html: pw(a, m * k), val: 'b' }, { html: pw(a, m + k), val: 's', tag: 'sumaPP' }, { html: pw(a * k, m), val: 'x', tag: 'baseExp' }]);
    return { tipus: 'tria', html: `${pwPP(a, m, k)} =`, opcions: ops, correcta: 'b', etiq: etiqDe(ops), a, m, k }; }, it => it.html);
  return { sig: `r2-${its.map(i => i.html).join('|')}`, enunciat: `Tria el resultat correcte.`, visual: null, pista: PISTA_W7, ...apartats(its),
    explicacio: `Els exponents es multipliquen.`, solucio: its.map(it => `${it.html} <b>${pw(it.a, it.m * it.k)}</b>`) };
};
const OPS_REGLA = [{ html: '➕ Sumo els exponents', val: 'p' }, { html: '➖ Resto els exponents', val: 'q' }, { html: '✖️ Multiplico els exponents', val: 'pp' }];
W7.regla = (nv, { n = 3 } = {}) => {
  const quines = barreja(['p', 'q', 'pp', tria(['p', 'q', 'pp'])]).slice(0, n);
  const its = quines.map(q => { const it = itemMix(nv, q); return { tipus: 'tria', html: it.html.replace(/ =$/, ''), opcions: OPS_REGLA, correcta: q, etiq: Object.fromEntries(OPS_REGLA.filter(o => o.val !== q).map(o => [o.val, 'reglaErr'])), llarg: true }; });
  return { sig: `r3-${its.map(i => i.html).join('|')}`, enunciat: `Què he de fer amb els <b>exponents</b>?`, visual: () => reglaHtml(), pista: PISTA_MIX, ...apartats(its),
    explicacio: `Producte → sumar · Quocient → restar · Potència d'una potència → multiplicar.`, solucio: its.map(it => `${it.html}: <b>${OPS_REGLA.find(o => o.val === it.correcta).html}</b>`) };
};
W7.barreja = (nv, { n = 4 } = {}) => {
  const quines = barreja(['p', 'q', 'pp', ...Array.from({ length: Math.max(0, n - 3) }, () => tria(['p', 'q', 'pp']))]).slice(0, n);
  const its = quines.map(q => itemMix(nv, q));
  return { sig: `r4-${its.map(i => i.html).join('|')}`, enunciat: `Barreja de regles: escriu cada una com una sola potència.`, visual: nv === 1 ? () => reglaHtml() : null, pista: PISTA_MIX, ...apartats(its),
    explicacio: `Primer decideix quina regla toca i després aplica-la.`, solucio: its.map(it => `${it.html} ${it.base}<sup>${it.sol}</sup> = <b>${pw(it.base, it.exp)}</b>`) };
};
W7.combina = (nv, { n = 3 } = {}) => {
  const fer = () => { const a = rnd(2, 7), m = rnd(2, 4), k = rnd(2, 3), p = rnd(1, 5);
    const t = tria([0, 1, 2]);
    if (t === 0) return { tipus: 'pot', html: `${pwPP(a, m, k)} · ${pwX(a, p)} =`, base: a, exp: m * k + p, a, sol: `${m}·${k} + ${p}`, errs: errsP(a, m * k + p, [[a, m + k + p, 'sumaPP'], [a, m * k * p, 'reglaErr']]) };
    if (t === 1) { const q = rnd(1, m * k - 1); return { tipus: 'pot', html: `${pwPP(a, m, k)} : ${pwX(a, q)} =`, base: a, exp: m * k - q, a, sol: `${m}·${k} − ${q}`, errs: errsP(a, m * k - q, [[a, m + k - q, 'sumaPP'], [a, m * k + q, 'sumaQ']]) }; }
    const r = rnd(2, 4); return { tipus: 'pot', html: `(${pw(a, m)} · ${pw(a, p)})${sp(r)} =`, base: a, exp: (m + p) * r, a, sol: `(${m} + ${p})·${r}`, errs: errsP(a, (m + p) * r, [[a, m + p + r, 'sumaPP'], [a, m * p * r, 'multExp'], [a * a, (m + p) * r, 'multBases']]) };
  };
  const its = unics(n, fer, it => it.html);
  return { sig: `r5-${its.map(i => i.html).join('|')}`, enunciat: `Dues regles seguides: escriu cada una com una sola potència.`, visual: () => reglaHtml(), pista: { completa: `Fes-ho per passos: primer el parèntesi o la potència d'una potència, i després el producte o el quocient.`, mitja: `Pas a pas.` }, ...apartats(its),
    explicacio: `Pas a pas, aplicant una regla cada vegada.`, solucio: its.map(it => `${it.html} ${it.a}<sup>${it.sol}</sup> = <b>${pw(it.a, it.exp)}</b>`) };
};
const VF_W7 = [
  () => { const a = rnd(2, 9), m = rnd(2, 5), k = rnd(2, 4); return { h: `${pwPP(a, m, k)} = ${pw(a, m * k)}`, ok: true, s: `${m} · ${k} = ${m * k}.` }; },
  () => { const a = rnd(2, 9); const [m, k] = tria([[3, 4], [2, 5], [4, 3], [5, 2], [3, 3]]); return { h: `${pwPP(a, m, k)} = ${pw(a, m + k)}`, ok: false, etiq: { si: 'sumaPP' }, s: `Es multipliquen: ${pw(a, m * k)}.` }; },
  () => { const a = rnd(2, 9), m = rnd(2, 5), k = rnd(2, 5); return { h: `${pw(a, m)} · ${pw(a, k)} = ${pw(a, m * k === m + k ? m * k + 1 : m * k)}`, ok: false, etiq: { si: 'reglaErr' }, s: `És un producte: se sumen, ${pw(a, m + k)}.` }; },
  () => { const a = rnd(2, 9), m = rnd(6, 9), k = rnd(2, 4); return { h: `${pw(a, m)} : ${pw(a, k)} = ${pw(a, m - k)}`, ok: true, s: `Quocient: ${m} − ${k}.` }; },
  () => { const a = rnd(2, 9), m = rnd(2, 4), k = rnd(2, 3); return { h: `${pwPP(a, m, k)} = ${Array(k).fill(pw(a, m)).join(' · ')}`, ok: true, s: `És la definició: ${pw(a, m)} multiplicat ${k} vegades.` }; }
];
W7.vf = (nv, { n = 4 } = {}) => {
  const ds = barreja(VF_W7).slice(0, n).map(f => f());
  const its = ds.map(d => ({ tipus: 'tria', html: d.h, opcions: vfOps, correcta: d.ok ? 'si' : 'no', etiq: d.etiq || {}, llarg: true }));
  return { sig: `r6-${ds.map(d => d.h).join('|')}`, enunciat: `Vertader o fals?`, visual: null, pista: PISTA_MIX, ...apartats(its),
    explicacio: `Mira quina operació és abans d'aplicar la regla.`, solucio: ds.map(d => `${d.h}: <b>${d.ok ? 'vertader' : 'fals'}</b>. ${d.s}`) };
};
TEMES.w7 = {
  gen: W7, senseCalc: true,
  sequencia: {
    1: [['desplega'], ['pot', { n: 3 }], ['tria', { n: 3 }], ['regla', { n: 3 }], ['desplega'], ['barreja', { n: 3 }], ['vf', { n: 3 }], ['barreja', { n: 4 }]],
    2: [['pot', { n: 4 }], ['tria', { n: 3 }], ['regla', { n: 4 }], ['barreja', { n: 4 }], ['vf', { n: 4 }], ['barreja', { n: 4 }], ['combina', { n: 2 }], ['barreja', { n: 4 }]],
    3: [['pot', { n: 4 }], ['regla', { n: 4 }], ['barreja', { n: 4 }], ['combina', { n: 3 }], ['vf', { n: 4 }], ['barreja', { n: 5 }], ['combina', { n: 3 }], ['barreja', { n: 5 }]]
  },
  explicacio: [
    { text: `<p>Què vol dir <b>(${pw(2, 3)})²</b>? Que ${pw(2, 3)} està <b class="parpelleja">al quadrat</b>: el multipliquem per ell mateix.</p><p class="petit">(${pw(2, 3)})² = ${pw(2, 3)} · ${pw(2, 3)}</p>`,
      vis: () => `<div class="w5-grups">${grup(2, 3, 'a')}<span class="w5-op">·</span>${grup(2, 3, 'b', { del: .4 })}</div>` },
    { text: `<p>Són <b>2 grups de 3</b>: el 2 surt <b class="parpelleja">3 · 2 = 6 vegades</b>.</p><p>(${pw(2, 3)})² = <b>${pw(2, 6)}</b></p>`,
      vis: () => `<div style="display:flex;flex-direction:column;align-items:center;gap:10px"><div class="w5-grups">${grup(2, 3, 'a')}${grup(2, 3, 'b', { del: .2 })}</div><div>${pwH(2, 6, 'gran')}</div></div>` },
    { text: `<p>La regla: la base es queda igual i els exponents <b class="parpelleja">es multipliquen</b>.</p><p class="expr-gran" style="margin:6px 0">(aᵐ)ⁿ = aᵐ·ⁿ</p><p class="petit"><b>Alerta:</b> (${pw(2, 3)})² <b>no</b> és ${pw(2, 5)}.</p>`, vis: () => reglaHtml('pp') },
    { text: `<p>Ara ja tens <b>tres regles</b>. El truc és <b class="parpelleja">mirar l'operació</b> abans de fer res:</p><p class="petit">${pw(3, 4)} · ${pw(3, 2)} → sumo → ${pw(3, 6)} &nbsp;·&nbsp; ${pw(3, 4)} : ${pw(3, 2)} → resto → ${pw(3, 2)} &nbsp;·&nbsp; (${pw(3, 4)})² → multiplico → ${pw(3, 8)}</p>`, vis: () => reglaHtml() }
  ],
  exemple: (nv) => {
    if (nv === 1) return { enunciat: `Escriu <b>(${pw(5, 2)})³</b> com una sola potència.`, passos: [
      { text: `(${pw(5, 2)})³ = ${pw(5, 2)} · ${pw(5, 2)} · ${pw(5, 2)}: tres grups de 2.`, vis: `<div class="w5-grups">${grup(5, 2, 'a')}${grup(5, 2, 'b')}${grup(5, 2, 'c')}</div>` },
      { text: `2 · 3 = <b>6</b>: <b>${pw(5, 6)}</b>. <span class="marca-ok">✓</span>`, vis: `<div>${pwH(5, 6, 'gran')}</div>` }] };
    if (nv === 2) return { enunciat: `Escriu com una sola potència: <b>${pw(7, 8)} : ${pw(7, 3)}</b> i <b>(${pw(7, 4)})²</b>.`, passos: [
      { text: `El primer és un <b>quocient</b>: resto, 8 − 3 = 5 → ${pw(7, 5)}.`, vis: reglaHtml('q') },
      { text: `El segon és una <b>potència d'una potència</b>: multiplico, 4 · 2 = 8 → ${pw(7, 8)}. <span class="marca-ok">✓</span>`, vis: reglaHtml('pp') }] };
    return { enunciat: `Escriu com una sola potència: <b>(${pw(2, 3)})⁴ · ${pw(2, 5)}</b>.`, passos: [
      { text: `Primer la potència d'una potència: (${pw(2, 3)})⁴ = ${pw(2, 12)}.`, vis: `<div class="expr-gran">${pw(2, 12)} · ${pw(2, 5)}</div>` },
      { text: `Ara el producte: 12 + 5 = 17 → <b>${pw(2, 17)}</b>. <span class="marca-ok">✓</span>`, vis: `<div>${pwH(2, 17, 'gran')}</div>` }] };
  }
};

/* ---------- OBJECTIU 8 · L'ARREL QUADRADA ---------- */
Object.assign(ETIQ_ERR, { arrelMeitat: 'divideix entre 2 en lloc de fer l\'arrel (√16 = 8)', arrelSuma: 'reparteix l\'arrel en una suma (√(9+16) = 3+4)', arrelAprox: 'tria malament els dos quadrats perfectes del voltant', arrelQuad: 'fa el quadrat en lloc de l\'arrel (√9 = 81)' });
Object.assign(AVIS_ERR, {
  arrelMeitat: 'L\'arrel <b>no és la meitat</b>: busca el nombre que, multiplicat <b>per ell mateix</b>, dona el de dins. √16 = 4, perquè 4 · 4 = 16.',
  arrelSuma: 'Primer fes la suma de dins: √(9 + 16) = √25 = 5, no 3 + 4.',
  arrelAprox: 'Busca els dos <b>quadrats perfectes</b> més propers: un per sota i un per sobre.',
  arrelQuad: 'L\'arrel <b>desfà</b> el quadrat: √9 = 3, perquè 3² = 9.'
});
document.head.insertAdjacentHTML('beforeend', `<style>
.w8r{white-space:nowrap}.w8r>span{border-top:3px solid currentColor;padding:0 3px;margin-left:1px}
.w8-taula{display:grid;grid-template-columns:repeat(4,auto);gap:6px 10px;font-size:1.15rem}.w8-taula div{padding:4px 10px;border-radius:8px;background:#fff;border:2px solid #ddd;text-align:center}.w8-taula b{color:var(--taronja)}
.w8-taula div.on{border-color:var(--taronja);background:#fff3e6}
.w8-recta{display:flex;align-items:flex-end;gap:0;font-weight:800;font-size:1.6rem}.w8-recta div{display:flex;flex-direction:column;align-items:center;min-width:120px}.w8-recta .t{height:22px;border-left:3px solid #000}.w8-recta .l{border-top:3px solid #000;width:100%}
.w8-recta .q{font-size:1rem;color:#777}.w8-recta .x{color:var(--taronja);font-size:1.9rem}
.w8-par{display:flex;align-items:center;gap:16px;font-size:1.6rem;font-weight:900}.w8-par i{font-style:normal;font-size:1.2rem;color:#777}
</style>`);
const rt = n => `<span class="w8r">√<span>${n}</span></span>`; // √49 amb ratlla
const rtT = n => `√${n}`; // en text pla
const QUADS = Array.from({ length: 21 }, (_, i) => i * i);
const errsArrel = r => { const n = r * r, o = { [n / 2]: 'arrelMeitat', [n * n]: 'arrelQuad', [n]: 'arrelQuad' }; delete o[r]; for (const k of Object.keys(o)) if (!Number.isInteger(+k)) delete o[k]; return o; };
const PISTA_W8 = { completa: `L'arrel quadrada busca el nombre que, <b>multiplicat per ell mateix</b>, dona el de dins: √49 = 7, perquè 7 · 7 = 49.`, mitja: `Quin nombre per ell mateix fa el de dins?` };
const taulaQuads = (fins = 12, on = -1) => `<div class="w8-taula">${Array.from({ length: fins }, (_, i) => i + 1).map(k => `<div class="${k === on ? 'on' : ''}">${k}² = <b>${k * k}</b></div>`).join('')}</div>`;
const maxArrel = nv => nv === 1 ? 10 : nv === 2 ? 12 : 20;
const W8 = {};
W8.calc = (nv, { n = 4 } = {}) => {
  const rs = barreja(Array.from({ length: maxArrel(nv) - 1 }, (_, i) => i + 2)).slice(0, n).sort((a, b) => a - b);
  if (nv >= 2 && Math.random() < .5) rs[0] = tria([0, 1]);
  const its = rs.map(r => ({ tipus: 'num', html: rt(r * r), valor: r, errs: errsArrel(r), r }));
  return { sig: `s1-${rs.join('_')}`, enunciat: `Calcula l'arrel quadrada.`, visual: nv === 1 ? () => taulaQuads(10) : null, pista: PISTA_W8, ...apartats(its),
    explicacio: `Busca el nombre que, multiplicat per ell mateix, dona el de dins.`, solucio: its.map(it => `${rtT(it.r * it.r)} = <b>${it.r}</b>, perquè ${it.r} · ${it.r} = ${it.r * it.r}`) };
};
W8.graella = (nv) => {
  const r = rnd(3, nv === 1 ? 6 : 8);
  const it = { tipus: 'num', llarg: true, html: `Aquest quadrat té <b>${r * r}</b> quadradets. Quants n'hi ha a cada costat? &nbsp; ${rt(r * r)} =`, valor: r, errs: errsArrel(r), r };
  return { sig: `s0-${r}`, enunciat: `Arrel quadrada amb un dibuix.`, visual: () => graellaSVG(r), pista: { completa: `Compta els quadradets d'un costat. Ha de ser un nombre que, per ell mateix, faci ${r * r}.`, mitja: `Compta un costat.` }, ...apartats([it]),
    explicacio: `Si un quadrat té ${r * r} quadradets, el costat en té ${rtT(r * r)} = ${r}.`, solucio: [`${rtT(r * r)} = <b>${r}</b>, perquè ${r} · ${r} = ${r * r}`] };
};
W8.inversa = (nv, { n = 3 } = {}) => {
  const rs = barreja(Array.from({ length: maxArrel(nv) - 2 }, (_, i) => i + 3)).slice(0, n);
  const its = rs.map((r, k) => k % 2 === 0
    ? { tipus: 'num', llarg: true, html: `Si ${pw(r, 2)} = ${r * r}, llavors ${rt(r * r)} =`, valor: r, errs: errsArrel(r), r }
    : { tipus: 'num', llarg: true, html: `Si ${rt(r * r)} = ${r}, llavors ${pw(r, 2)} =`, valor: r * r, errs: { [r * 2]: 'baseExp' }, r });
  return { sig: `s2-${rs.join('_')}`, enunciat: `L'arrel <b>desfà</b> el quadrat (i el quadrat desfà l'arrel).`, visual: () => `<div class="w8-par">${pwH(7, 2, 'gran')}<i>= 49</i><span>⇄</span>${rt(49)}<i>= 7</i></div>`, pista: { completa: `El quadrat i l'arrel són operacions <b>inverses</b>: una desfà l'altra.`, mitja: `Mira la igualtat que et donen.` }, ...apartats(its),
    explicacio: `${pw(7, 2)} = 49 i ${rtT(49)} = 7: són operacions inverses.`, solucio: its.map(it => `<b>${it.valor}</b>`) };
};
W8.perfectes = (nv) => {
  const q = barreja([4, 9, 16, 25, 36, 49, 64, 81, 100, ...(nv > 1 ? [121, 144] : [])]).slice(0, 4);
  const no = barreja([8, 12, 18, 20, 24, 27, 32, 40, 45, 50, 60, 72, 80, 90, ...(nv > 1 ? [99, 120] : [])]).slice(0, 4);
  const nums = barreja([...q, ...no]);
  const it = { tipus: 'marca', nat: true, html: 'Toca els <b>quadrats perfectes</b>:', nums, bons: nums.map((v, i) => q.includes(v) ? i : -1).filter(i => i >= 0) };
  return { sig: `s3-${nums.join('_')}`, enunciat: `Un <b>quadrat perfecte</b> té una arrel exacta (és un nombre al quadrat).`, visual: nv === 1 ? () => taulaQuads(10) : null, pista: { completa: `Mira si el nombre surt a la taula dels quadrats: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100…`, mitja: `És algun nombre per ell mateix?` }, ...apartats([it]),
    explicacio: `Els quadrats perfectes són 1, 4, 9, 16, 25… (1², 2², 3², 4², 5²…).`, solucio: [`<b>${q.sort((a, b) => a - b).join(', ')}</b> (${q.map(v => `${Math.sqrt(v)}²`).join(', ')})`] };
};
const VF_W8 = [
  () => { const r = rnd(2, 10); return { h: `${rt(r * r)} = ${r}`, ok: true, s: `${r} · ${r} = ${r * r}.` }; },
  () => { const r = tria([4, 6, 8, 10]); return { h: `${rt(r * r)} = ${r * r / 2}`, ok: false, etiq: { si: 'arrelMeitat' }, s: `L'arrel no és la meitat: ${rtT(r * r)} = ${r}.` }; },
  () => ({ h: `${rt(1)} = 1`, ok: true, s: `1 · 1 = 1.` }),
  () => ({ h: `${rt(0)} = 0`, ok: true, s: `0 · 0 = 0.` }),
  () => { const r = rnd(3, 9); return { h: `${rt(r * r)} = ${r ** 4}`, ok: false, etiq: { si: 'arrelQuad' }, s: `${rtT(r * r)} = ${r}.` }; },
  () => { const [a, b] = tria([[9, 16], [36, 64]]); return { h: `${rt(`${a} + ${b}`)} = ${Math.sqrt(a) + Math.sqrt(b)}`, ok: false, etiq: { si: 'arrelSuma' }, s: `Primer la suma: ${rtT(a + b)} = ${Math.sqrt(a + b)}.` }; }
];
W8.vf = (nv, { n = 3 } = {}) => {
  const ds = barreja(nv === 3 ? VF_W8 : VF_W8.slice(0, 5)).slice(0, n).map(f => f());
  const its = ds.map(d => ({ tipus: 'tria', html: d.h, opcions: vfOps, correcta: d.ok ? 'si' : 'no', etiq: d.etiq || {}, llarg: true }));
  return { sig: `s4-${ds.map(d => d.h).join('|')}`, enunciat: `Vertader o fals?`, visual: null, pista: PISTA_W8, ...apartats(its),
    explicacio: `Comprova-ho multiplicant el resultat per ell mateix.`, solucio: ds.map(d => `${d.h}: <b>${d.ok ? 'vertader' : 'fals'}</b>. ${d.s}`) };
};
W8.context = (nv, { n = 2 } = {}) => {
  const C = [
    r => ({ t: `Un hort quadrat fa <b>${r * r} m²</b>. Quants metres fa cada costat?`, r }),
    r => ({ t: `Una sala quadrada té <b>${r * r}</b> rajoles quadrades iguals. Quantes rajoles hi ha a cada costat?`, r }),
    r => ({ t: `Volem col·locar <b>${r * r}</b> cadires formant un quadrat. Quantes files hi haurà?`, r }),
    r => ({ t: `Un mosaic quadrat té <b>${r * r}</b> peces. Quantes peces té cada costat?`, r })
  ];
  const rs = barreja(Array.from({ length: maxArrel(nv) - 3 }, (_, i) => i + 4)).slice(0, n);
  const fs = barreja(C).slice(0, n).map((f, k) => f(rs[k]));
  const its = fs.map(f => ({ tipus: 'num', llarg: true, html: f.t, valor: f.r, errs: errsArrel(f.r) }));
  return { sig: `s5-${fs.map(f => f.t.slice(0, 10) + f.r).join('|')}`, enunciat: `Problemes amb quadrats.`, visual: null, pista: { completa: `Si el quadrat té <b>N</b> peces o metres quadrats, el costat és ${rtT('N')}.`, mitja: `Fes l'arrel quadrada.` }, ...apartats(its),
    explicacio: `El costat d'un quadrat és l'arrel quadrada de l'àrea.`, solucio: fs.map(f => `${rtT(f.r * f.r)} = <b>${f.r}</b>`) };
};
const rectaAprox = (n) => { const a = Math.floor(Math.sqrt(n)), b = a + 1;
  return `<div class="w8-recta">${[a, null, b].map(v => v === null ? `<div><span class="x">${rt(n)}</span><span class="q">≈ ?</span><span class="t" style="border-color:var(--taronja)"></span><span class="l"></span></div>` : `<div><b>${v}</b><span class="q">${rtT(v * v)}</span><span class="t"></span><span class="l"></span></div>`).join('')}</div>`; };
W8.entre = (nv, { n = 3 } = {}) => {
  const its = unics(n, () => { let x; do { x = rnd(5, nv === 3 ? 380 : 140); } while (Number.isInteger(Math.sqrt(x))); const a = Math.floor(Math.sqrt(x));
    const ops = barreja([{ html: `entre ${a} i ${a + 1}`, val: 'b' }, { html: `entre ${a - 1} i ${a}`, val: 'm', tag: 'arrelAprox' }, { html: `entre ${a + 1} i ${a + 2}`, val: 'p', tag: 'arrelAprox' }, ...(x / 2 > a + 3 ? [{ html: `entre ${Math.floor(x / 2)} i ${Math.floor(x / 2) + 1}`, val: 'h', tag: 'arrelMeitat' }] : [])]);
    return { tipus: 'tria', html: `${rt(x)} està…`, opcions: ops, correcta: 'b', etiq: etiqDe(ops), x, a, llarg: true }; }, it => it.x);
  return { sig: `s6-${its.map(i => i.x).join('_')}`, enunciat: `Arrels <b>no exactes</b>: entre quins dos nombres està?`, visual: () => rectaAprox(its[0].x), pista: { completa: `Busca el quadrat perfecte de <b>sota</b> i el de <b>sobre</b>: 25 &lt; 30 &lt; 36, per tant √30 està entre 5 i 6.`, mitja: `Quins quadrats perfectes té a prop?` }, ...apartats(its),
    explicacio: `Els quadrats perfectes del voltant diuen entre quins nombres està l'arrel.`, solucio: its.map(it => `${it.a * it.a} &lt; ${it.x} &lt; ${(it.a + 1) ** 2}, per tant ${rtT(it.x)} està <b>entre ${it.a} i ${it.a + 1}</b>`) };
};
W8.aprox = (nv, { n = 3 } = {}) => {
  const its = unics(n, () => { let x, a, d1, d2; do { x = rnd(10, 300); a = Math.floor(Math.sqrt(x)); d1 = x - a * a; d2 = (a + 1) ** 2 - x; } while (d1 === 0 || d1 === d2);
    const v = d1 < d2 ? a : a + 1; return { tipus: 'num', llarg: true, html: `${rt(x)} ≈ (el nombre enter més proper)`, valor: v, errs: { [v === a ? a + 1 : a]: 'arrelAprox', [Math.round(x / 2)]: 'arrelMeitat' }, x, a, d1, d2 }; }, it => it.x);
  its.forEach(it => delete it.errs[it.valor]);
  return { sig: `s7-${its.map(i => i.x).join('_')}`, enunciat: `Aproxima l'arrel al <b>nombre enter més proper</b>.`, visual: () => rectaAprox(its[0].x), pista: { completa: `Mira de quin quadrat perfecte està més a prop: si ${rtT(30)}, 30 està a 5 de 25 i a 6 de 36, per tant √30 ≈ 5.`, mitja: `Quin quadrat perfecte és més a prop?` }, ...apartats(its),
    explicacio: `L'arrel s'aproxima al nombre del quadrat perfecte més proper.`, solucio: its.map(it => `${it.a * it.a} (a ${it.d1}) i ${(it.a + 1) ** 2} (a ${it.d2}): ${rtT(it.x)} ≈ <b>${it.valor}</b>`) };
};
TEMES.w8 = {
  gen: W8, senseCalc: true,
  sequencia: {
    1: [['graella'], ['calc', { n: 4 }], ['inversa', { n: 2 }], ['perfectes'], ['graella'], ['calc', { n: 4 }], ['vf', { n: 3 }], ['context', { n: 2 }]],
    2: [['calc', { n: 4 }], ['inversa', { n: 3 }], ['perfectes'], ['vf', { n: 4 }], ['context', { n: 2 }], ['entre', { n: 3 }], ['calc', { n: 4 }], ['entre', { n: 3 }]],
    3: [['calc', { n: 4 }], ['vf', { n: 4 }], ['entre', { n: 3 }], ['aprox', { n: 3 }], ['context', { n: 2 }], ['perfectes'], ['aprox', { n: 3 }], ['entre', { n: 3 }]]
  },
  explicacio: [
    { text: `<p>Aquest quadrat té <b>25</b> quadradets. Quants n'hi ha a cada <b class="parpelleja">costat</b>?</p><p class="petit">Busquem un nombre que, multiplicat <b>per ell mateix</b>, faci 25: 5 · 5 = 25. El costat és <b>5</b>.</p>`, vis: () => graellaSVG(5) },
    { text: `<p>Això és l'<b class="parpelleja">arrel quadrada</b>: ${rt(25)} = 5.</p><p class="petit">L'arrel <b>desfà</b> el quadrat: ${pw(5, 2)} = 25 i ${rtT(25)} = 5. Són operacions inverses.</p>`,
      vis: () => `<div class="w8-par">${pwH(5, 2, 'gran')}<i>= 25</i><span>⇄</span><span style="font-size:2.4rem">${rt(25)}</span><i>= 5</i></div>` },
    { text: `<p>Els nombres amb arrel exacta són els <b class="parpelleja">quadrats perfectes</b>: 1, 4, 9, 16, 25, 36…</p><p class="petit"><b>Alerta:</b> ${rtT(16)} <b>no</b> és 8 (la meitat). És 4, perquè 4 · 4 = 16.</p>`, vis: () => taulaQuads(12, 4) },
    { text: `<p>I ${rt(30)}? 30 no és un quadrat perfecte. Està <b class="parpelleja">entre</b> 25 i 36:</p><p class="petit">${rtT(25)} = 5 &lt; ${rtT(30)} &lt; ${rtT(36)} = 6. Per tant, ${rtT(30)} està entre 5 i 6, i més a prop del 5.</p>`, vis: () => rectaAprox(30) }
  ],
  exemple: (nv) => {
    if (nv === 1) return { enunciat: `Calcula <b>${rt(36)}</b>.`, passos: [
      { text: `Busco un nombre que per ell mateix faci 36. Miro la taula.`, vis: taulaQuads(8, 6) },
      { text: `6 · 6 = 36, per tant <b>${rtT(36)} = 6</b>. <span class="marca-ok">✓</span>`, vis: `<div class="expr-gran">${rt(36)} = 6</div>` }] };
    if (nv === 2) return { enunciat: `Un hort quadrat fa <b>81 m²</b>. Quant fa cada costat?`, passos: [
      { text: `El costat és l'arrel de l'àrea: ${rtT(81)}.`, vis: graellaSVG(9, { anim: false }) },
      { text: `9 · 9 = 81, per tant el costat fa <b>9 m</b>. <span class="marca-ok">✓</span>`, vis: `<div class="expr-gran">${rt(81)} = 9</div>` }] };
    return { enunciat: `Aproxima <b>${rt(70)}</b> al nombre enter més proper.`, passos: [
      { text: `Quadrats perfectes del voltant: 64 = 8² i 81 = 9².`, vis: rectaAprox(70) },
      { text: `70 està a 6 de 64 i a 11 de 81: és més a prop del 64. <b>${rtT(70)} ≈ 8</b>. <span class="marca-ok">✓</span>`, vis: `<div class="expr-gran">${rt(70)} ≈ 8</div>` }] };
  }
};

UNITATS.p.carregada = true;
