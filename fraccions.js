'use strict';
/* FR-4C · Matemàtiques 4t ESO · Unitat Fraccions.
   L'app (index.html) carrega aquest fitxer quan cal. Fa servir les funcions del nucli de l'app. */

/* =====================================================================
   TEMA 1 · QUÈ ÉS UNA FRACCIÓ
   ===================================================================== */
function distractors(n, d, cands, quants = 2) {
  const valors = [n / d]; const out = [];
  // els primers candidats són els errors típics; després, de reserva
  const reserva = [[n, d + 1], [n + 1, d], [Math.max(1, n - 1), d + 1], [n, d + 2]];
  const prova = llista => {
    for (const [a, b] of llista) {
      if (out.length === quants) return;
      if (b <= 0 || a <= 0) continue;
      if (valors.some(v => Math.abs(a / b - v) < 1e-9)) continue;
      valors.push(a / b); out.push([a, b]);
    }
  };
  prova(barreja(cands)); prova(reserva);
  return out;
}
function opcionsFrac(n, d, cands) {
  const ds = distractors(n, d, cands);
  const ops = barreja([[n, d], ...ds]).map(([a, b]) => ({ html: frac(a, b, 'mitja'), val: ftxt(a, b), txt: ftxt(a, b) }));
  return { mode: 'opcions', opcions: ops, correcta: ftxt(n, d) };
}

const T1 = {};
T1.llegirTria = (nv, { forma } = {}) => {
  const d = tria([2, 3, 4, 5, 6, 8]); const n = rnd(1, d - 1); const f = forma || tria(['barra', 'cercle']);
  const vis = p => f === 'barra' ? barraSVG({ d, n, numeros: p ? 'totes' : null }) : cercleSVG({ d, n, numeros: p ? 'totes' : null });
  return {
    sig: `lt-${f}-${n}-${d}`,
    enunciat: `Quina fracció ${f === 'barra' ? 'de la barra' : 'del cercle'} està pintada?`,
    visual: vis,
    pista: { completa: `Compta <b>totes</b> les parts: aquest número va <b>a baix</b>. Després compta les <b>pintades</b>: van <b>a dalt</b>.`, mitja: `Recorda: a baix, <b>totes</b> les parts. A dalt, les <b>pintades</b>.` },
    resposta: opcionsFrac(n, d, [[d, n], [d - n, d], [n, d - n], [n, d + 1], [n + 1, d]]),
    correctaHtml: frac(n, d), correctaTxt: ftxt(n, d),
    explicacio: `Hi ha <b>${d}</b> parts en total (a baix) i <b>${n}</b> de pintades (a dalt).`,
    solucio: [`Compto totes les parts: <b>${d}</b>. Va a baix.`, `Compto les parts pintades: <b>${n}</b>. Va a dalt.`, `La fracció és ${frac(n, d)}.`]
  };
};
T1.parts = (nv) => {
  let d, n; do { d = tria([3, 4, 5, 6, 8]); n = rnd(1, d - 1); } while (n === d - n);
  const quin = tria(['baix', 'dalt']);
  const ops = [
    { html: 'En quantes parts iguals hem dividit la unitat', val: 'baix', txt: 'En quantes parts dividim' },
    { html: 'Quantes parts hem agafat (pintat)', val: 'dalt', txt: 'Quantes parts agafem' },
    { html: 'Quantes parts queden sense pintar', val: 'resta', txt: 'Quantes queden' }
  ];
  const num = quin === 'baix' ? d : n;
  return {
    sig: `pt-${quin}-${n}-${d}`,
    enunciat: `A la fracció ${frac(n, d, 'mitja')}, què ens diu el número <b>${num}</b> ${quin === 'baix' ? 'de baix' : 'de dalt'}?`,
    visual: p => barraSVG({ d, n, numeros: p ? (quin === 'baix' ? 'totes' : 'pintades') : null }),
    pista: { completa: `Mira el dibuix i compta. ${quin === 'baix' ? 'Quantes parts hi ha en total?' : 'Quantes parts estan pintades?'}`, mitja: `Compara el número amb el dibuix.` },
    resposta: { mode: 'opcions', opcions: barreja(ops), correcta: quin },
    correctaHtml: quin === 'baix' ? 'En quantes parts iguals hem dividit la unitat' : 'Quantes parts hem agafat',
    correctaTxt: quin === 'baix' ? 'En quantes parts dividim' : 'Quantes parts agafem',
    explicacio: quin === 'baix' ? `El número de baix (<b>denominador</b>) diu en quantes parts iguals dividim la unitat.` : `El número de dalt (<b>numerador</b>) diu quantes parts agafem.`,
    solucio: [quin === 'baix' ? `El ${d} és el <b>denominador</b>.` : `El ${n} és el <b>numerador</b>.`, quin === 'baix' ? `Diu en quantes parts iguals està dividida la unitat.` : `Diu quantes parts agafem (les pintades).`]
  };
};
function pesosDesiguals(d, subtil) {
  if (subtil) { const p = Array(d).fill(1); const i = rnd(0, d - 1); p[i] = 1.75; let j = i; while (j === i) j = rnd(0, d - 1); p[j] = .7; return p; }
  let p; do { p = Array.from({ length: d }, () => rnd(1, 3)); } while (Math.max(...p) < 2 * Math.min(...p));
  return p;
}
T1.iguals = (nv) => {
  const d = tria([3, 4, 5, 6]); const n = rnd(1, d - 1); const eq = Math.random() < .5; const f = tria(['barra', 'cercle']);
  const pesos = eq ? null : pesosDesiguals(d, nv >= 2);
  const vis = () => f === 'barra' ? barraSVG({ d, n, pesos }) : cercleSVG({ d, n, pesos });
  return {
    sig: `ig-${f}-${n}-${d}-${eq ? 1 : 0}-${pesos ? pesos.join('') : ''}`,
    enunciat: `Aquest dibuix representa la fracció ${frac(n, d, 'mitja')}?`,
    visual: vis,
    pista: { completa: `Fixa't bé: <b>totes</b> les parts han de ser <b>iguals</b>.`, mitja: `Mira la mida de les parts.` },
    resposta: { mode: 'sino', correcta: eq ? 'si' : 'no' },
    correctaHtml: eq ? 'Sí' : 'No', correctaTxt: eq ? 'Sí' : 'No',
    explicacio: eq ? `Sí: està dividit en ${d} parts <b>iguals</b> i n'hi ha ${n} de pintades.` : `No: les parts <b>no són iguals</b>. Per escriure una fracció, totes les parts han de tenir la mateixa mida.`,
    solucio: [`Miro si totes les parts són iguals: <b>${eq ? 'sí que ho són' : 'no ho són'}</b>.`, eq ? `Per tant, sí que representa ${frac(n, d)}.` : `Per tant, <b>no</b> representa ${frac(n, d)}.`]
  };
};
T1.impropiaTria = (nv) => {
  const d = tria([2, 3, 4]); const n = d + rnd(1, d - 1);
  return {
    sig: `it-${n}-${d}`,
    enunciat: `Tenim dues pizzes iguals. Quina fracció de pizza està pintada?`,
    visual: p => unitatsSVG({ d, n, forma: 'cercle', numeros: p }),
    pistaSempre: true,
    pista: { completa: `Cada pizza és <b>una unitat</b> partida en ${d} trossos: a baix va el <b>${d}</b>. A dalt van <b>tots</b> els trossos pintats, comptant les dues pizzes.` },
    resposta: opcionsFrac(n, d, [[n - d, d], [n, 2 * d], [d, n]]),
    correctaHtml: frac(n, d), correctaTxt: ftxt(n, d),
    explicacio: `Cada pizza té ${d} trossos (a baix) i n'hi ha ${n} de pintats en total (a dalt). És <b>més d'una pizza sencera</b>!`,
    solucio: [`Cada pizza està partida en <b>${d}</b> trossos: va a baix.`, `Compto tots els trossos pintats: <b>${n}</b>. Va a dalt.`, `La fracció és ${frac(n, d)}: més d'una unitat.`]
  };
};
T1.llegirEscriu = (nv, { forma } = {}) => {
  const d = tria(nv >= 3 ? [5, 6, 8, 10, 12] : [3, 4, 5, 6, 8, 10]); const n = rnd(1, d - 1); const f = forma || tria(['barra', 'cercle']);
  const vis = p => f === 'barra' ? barraSVG({ d, n, numeros: p ? 'totes' : null }) : cercleSVG({ d, n, numeros: p ? 'totes' : null });
  return {
    sig: `le-${f}-${n}-${d}`,
    enunciat: `Escriu la fracció ${f === 'barra' ? 'de la barra' : 'del cercle'} que està pintada.`,
    visual: vis,
    pista: { completa: `Compta <b>totes</b> les parts (a baix) i les <b>pintades</b> (a dalt).`, mitja: `A baix, totes les parts. A dalt, les pintades.` },
    resposta: { mode: 'fraccio', valor: [n, d], equiv: true },
    correctaHtml: frac(n, d), correctaTxt: ftxt(n, d),
    explicacio: `${d} parts en total i ${n} de pintades: ${frac(n, d)}.`,
    solucio: [`Totes les parts: <b>${d}</b> (a baix).`, `Parts pintades: <b>${n}</b> (a dalt).`, `Resultat: ${frac(n, d)}.`]
  };
};
const CONTEXTOS = {
  pizza: { inici: (d, n) => `Una pizza està tallada en <b>${d} trossos</b> iguals. Te'n menges <b>${n}</b>.`, menjat: `Quina fracció de pizza t'has menjat?`, queda: `Quina fracció de pizza queda?`, forma: 'cercle', unitat: 'trossos' },
  pastis: { inici: (d, n) => `Un pastís té <b>${d} porcions</b> iguals. Se'n mengen <b>${n}</b>.`, menjat: `Quina fracció del pastís s'han menjat?`, queda: `Quina fracció del pastís queda?`, forma: 'cercle', unitat: 'porcions' },
  xoco: { inici: (d, n) => `Una rajola de xocolata té <b>${d} trossets</b> iguals. Te'n menges <b>${n}</b>.`, menjat: `Quina fracció de la rajola t'has menjat?`, queda: `Quina fracció de la rajola queda?`, forma: 'barra', unitat: 'trossets' }
};
T1.pizza = (nv, { q = 'menjat' } = {}) => {
  const ctxK = tria(Object.keys(CONTEXTOS)); const c = CONTEXTOS[ctxK];
  const d = tria(nv >= 3 ? [6, 8, 10, 12] : [4, 6, 8]); const n = rnd(1, d - 1);
  const [an, ad] = q === 'menjat' ? [n, d] : [d - n, d];
  const ambDibuix = nv < 3;
  return {
    sig: `pz-${ctxK}-${q}-${n}-${d}`,
    enunciat: `${c.inici(d, n)} ${c[q]}`,
    visual: ambDibuix ? (p => c.forma === 'cercle' ? cercleSVG({ d, n: d, menjades: n, numeros: p ? 'totes' : null }) : barraSVG({ d, n: d, menjades: n, numeros: p ? 'totes' : null })) : null,
    pista: { completa: `A baix van <b>tots</b> els ${c.unitat} (${d}). A dalt, els que ${q === 'menjat' ? 'us heu menjat' : 'queden'}.`, mitja: `A baix, el total de ${c.unitat}.` },
    resposta: { mode: 'fraccio', valor: [an, ad], equiv: true },
    correctaHtml: frac(an, ad), correctaTxt: ftxt(an, ad),
    explicacio: q === 'menjat' ? `${d} ${c.unitat} en total i ${n} de menjats: ${frac(an, ad)}.` : `${d} ${c.unitat} en total; si se'n mengen ${n}, en queden ${d - n}: ${frac(an, ad)}.`,
    solucio: [`Total de ${c.unitat}: <b>${d}</b>. Va a baix.`, q === 'menjat' ? `Menjats: <b>${n}</b>. Va a dalt.` : `En queden: ${d} − ${n} = <b>${d - n}</b>. Va a dalt.`, `Resultat: ${frac(an, ad)}.`]
  };
};
T1.conjunt = (nv, { neg = false } = {}) => {
  const t = nv >= 3 ? rnd(6, 12) : rnd(4, 8); const n = rnd(1, t - 1);
  const [an, ad] = neg ? [t - n, t] : [n, t];
  return {
    sig: `cj-${neg ? 1 : 0}-${n}-${t}`,
    enunciat: neg ? `Quina fracció de les pilotes <b>no</b> són taronges?` : `Quina fracció de les pilotes són <b>taronges</b>?`,
    visual: () => conjuntSVG({ total: t, n }),
    pista: { completa: `Compta <b>totes</b> les pilotes (a baix) i les ${neg ? 'blanques' : 'taronges'} (a dalt).`, mitja: `A baix, el total de pilotes.` },
    resposta: { mode: 'fraccio', valor: [an, ad], equiv: true },
    correctaHtml: frac(an, ad), correctaTxt: ftxt(an, ad),
    explicacio: `Hi ha ${t} pilotes en total i ${an} ${neg ? 'que no són taronges' : 'de taronges'}: ${frac(an, ad)}.`,
    solucio: [`Total de pilotes: <b>${t}</b> (a baix).`, `Pilotes ${neg ? 'que no són taronges' : 'taronges'}: <b>${an}</b> (a dalt).`, `Resultat: ${frac(an, ad)}.`]
  };
};
T1.impropiaEscriu = (nv) => {
  const d = tria(nv >= 3 ? [3, 4, 5, 6] : [2, 3, 4, 5]); const k = nv >= 3 ? tria([2, 3]) : 2;
  let n; do { n = rnd(d + 1, k * d - 1); } while (n % d === 0);
  return {
    sig: `ie-${n}-${d}`,
    enunciat: `Cada barra és <b>una unitat</b>. Escriu la fracció que està pintada.`,
    visual: p => unitatsSVG({ d, n, forma: 'barra', numeros: p }),
    pista: { completa: `Cada barra té ${d} parts: a baix va el <b>${d}</b>. A dalt, <b>totes</b> les parts pintades.`, mitja: `A baix, les parts d'<b>una</b> barra.` },
    resposta: { mode: 'fraccio', valor: [n, d], equiv: true },
    correctaHtml: frac(n, d), correctaTxt: ftxt(n, d),
    explicacio: `Cada unitat té ${d} parts (a baix) i n'hi ha ${n} de pintades (a dalt): ${frac(n, d)}, més d'una unitat.`,
    solucio: [`Cada barra (unitat) té <b>${d}</b> parts: va a baix.`, `Compto totes les parts pintades: <b>${n}</b>. Va a dalt.`, `Resultat: ${frac(n, d)}.`]
  };
};
const CTX_Q = [
  (n, d, Q) => [`Una classe té <b>${Q} alumnes</b>. Els ${frac(n, d)} van d'excursió. Quants alumnes hi van?`, 'alumnes'],
  (n, d, Q) => [`Tens <b>${Q} cromos</b> i en regales els ${frac(n, d)}. Quants cromos regales?`, 'cromos'],
  (n, d, Q) => [`Quant és ${frac(n, d)} de <b>${Q}</b>?`, '']
];
T1.quantitat = (nv) => {
  const d = tria([2, 3, 4, 5, 6, 8, 10]); const n = rnd(1, d - 1); const k = rnd(2, d >= 8 ? 5 : 8); const Q = d * k;
  const ci = rnd(0, CTX_Q.length - 1); const [txt, u] = CTX_Q[ci](n, d, Q);
  return {
    sig: `qt-${ci}-${n}-${d}-${Q}`,
    enunciat: txt, visual: null,
    pista: { completa: `Primer divideix ${Q} entre ${d}. Després multiplica per ${n}.`, mitja: `Divideix entre el número de baix.` },
    resposta: { mode: 'numero', valor: n * k, unitat: u },
    correctaHtml: `<b>${n * k}</b> ${u}`, correctaTxt: String(n * k),
    explicacio: `${Q} : ${d} = ${k} (cada part). I ${n} × ${k} = <b>${n * k}</b>.`,
    solucio: [`El denominador diu en quantes parts repartim: ${Q} : ${d} = <b>${k}</b>.`, `El numerador diu quantes parts agafem: ${n} × ${k} = <b>${n * k}</b>.`, `${frac(n, d)} de ${Q} = <b>${n * k}</b>.`]
  };
};
T1.subdivisio = (nv) => {
  let a, b; do { a = tria([2, 3, 4]); b = tria([2, 3]); } while (a * b > 12);
  const mode = tria([1, 2]); const j = rnd(0, a - 1); let w = j; if (mode === 2) while (w === j) w = rnd(0, a - 1);
  const tot = a * b; const pint = mode === 1 ? 1 : b + 1;
  return {
    sig: `sd-${a}-${b}-${mode}-${j}-${w}`,
    enunciat: `Quina fracció de la barra està pintada?`,
    visual: p => subdivisioSVG({ a, b, j, w, mode, numeros: p }),
    pista: { completa: `Imagina que totes les parts es divideixen com la part petita. Quants trossets hi hauria?`, mitja: `Pensa en trossets petits.` },
    resposta: { mode: 'fraccio', valor: [pint, tot], equiv: true },
    correctaHtml: frac(pint, tot), correctaTxt: ftxt(pint, tot),
    explicacio: `Si totes les parts fossin com la petita, hi hauria ${a} × ${b} = ${tot} trossets. N'hi ha ${pint} de pintats: ${frac(pint, tot)}.`,
    solucio: [`Si divideixo totes les parts com la petita: ${a} × ${b} = <b>${tot}</b> trossets (a baix).`, mode === 1 ? `Pintat: <b>1</b> trosset.` : `Pintat: una part gran (${b} trossets) + 1 trosset = <b>${pint}</b>.`, `Resultat: ${frac(pint, tot)}.`]
  };
};
T1.invers = (nv) => {
  const d = tria([3, 4, 5, 6]); const n = rnd(1, d - 1); const k = rnd(2, 5); const V = n * k; const tot = d * k;
  const etiq = (xs, y0, H) => {
    const x1 = xs[0][0], x2 = xs[n - 1][0] + xs[n - 1][1], xe = xs[d - 1][0] + xs[d - 1][1];
    return `<path d="M ${x1} ${y0 - 6} v -8 H ${x2} v 8" fill="none" stroke="#1b1b1b" stroke-width="2"/><text x="${(x1 + x2) / 2}" y="${y0 - 20}" text-anchor="middle" font-size="20" font-weight="800">${V} caramels</text>
      <path d="M ${x1} ${y0 + H + 6} v 8 H ${xe} v -8" fill="none" stroke="#1b1b1b" stroke-width="2"/><text x="${(x1 + xe) / 2}" y="${y0 + H + 40}" text-anchor="middle" font-size="22" font-weight="800">?</text>`;
  };
  return {
    sig: `iv-${n}-${d}-${k}`,
    enunciat: `Els ${frac(n, d)} dels caramels d'una bossa són <b>${V} caramels</b>. Quants caramels hi ha a la bossa?`,
    visual: () => `<svg class="dib" viewBox="0 -40 480 160" width="480">${svgBarra({ d, n, etiquetes: etiq })}</svg>`,
    pista: { completa: `Si ${n} parts són ${V}, quant val <b>una</b> part?`, mitja: `Busca primer quant val una part.` },
    resposta: { mode: 'numero', valor: tot, unitat: 'caramels' },
    correctaHtml: `<b>${tot}</b> caramels`, correctaTxt: String(tot),
    explicacio: `Una part: ${V} : ${n} = ${k}. Totes les parts: ${d} × ${k} = <b>${tot}</b>.`,
    solucio: [`${n} parts són ${V}: una part val ${V} : ${n} = <b>${k}</b>.`, `La bossa té ${d} parts: ${d} × ${k} = <b>${tot}</b> caramels.`]
  };
};
TEMES.o1 = {
    gen: T1,
    sequencia: {
      1: [['llegirTria', { forma: 'barra' }], ['llegirTria', { forma: 'cercle' }], ['parts'], ['iguals'], ['llegirTria'], ['parts'], ['iguals'], ['impropiaTria']],
      2: [['llegirEscriu', { forma: 'barra' }], ['pizza', { q: 'menjat' }], ['conjunt'], ['iguals'], ['llegirEscriu', { forma: 'cercle' }], ['pizza', { q: 'queda' }], ['conjunt'], ['impropiaEscriu']],
      3: [['quantitat'], ['subdivisio'], ['pizza', { q: 'queda' }], ['conjunt', { neg: true }], ['quantitat'], ['subdivisio'], ['invers'], ['impropiaEscriu']]
    },
    explicacio: [
      { text: `<p>Una <b class="parpelleja">fracció</b> ens diu quina <b>part</b> d'una cosa agafem.</p><p class="petit">Aquesta barra és <b>una unitat</b>: una cosa sencera.</p>`,
        vis: () => barraSVG({ d: 1, n: 0 }) + `<div class="apareix" style="font-size:1.3rem;font-weight:800">1 unitat</div>` },
      { text: `<p>Primer, <b>dividim</b> la unitat en parts <b class="parpelleja">IGUALS</b>.</p>`,
        vis: () => barraSVG({ d: 4, n: 0, animDiv: true }) },
      { text: `<p>Comptem les parts: n'hi ha <b>4</b>.</p><p>Aquest número va <b class="parpelleja">a baix</b>. Es diu <b>denominador</b>.</p>`,
        vis: () => barraSVG({ d: 4, n: 0, numeros: 'totes', animNum: true }) + `<div class="apareix" style="animation-delay:1.4s">${frac('?', 4, 'gran')}</div>` },
      { text: `<p>Ara <b class="parpelleja">pintem</b> les parts que agafem.</p>`,
        vis: () => barraSVG({ d: 4, n: 3, animOmple: true, retard: .2 }) },
      { text: `<p>Comptem les pintades: <b>3</b>.</p><p>Aquest número va <b class="parpelleja">a dalt</b>. Es diu <b>numerador</b>.</p>`,
        vis: () => barraSVG({ d: 4, n: 3, numeros: 'pintades', animNum: true }) + `<div class="apareix" style="animation-delay:1.1s;display:flex;align-items:center;gap:18px">${frac(3, 4, 'gran')}<div style="text-align:left;font-size:1rem;line-height:2.2"><div>← <b>numerador</b>: quantes agafem</div><div>← <b>denominador</b>: en quantes parts dividim</div></div></div>` },
      { text: `<p>Amb un <b class="parpelleja">cercle</b> (una pizza) funciona igual.</p><p class="petit">4 parts iguals, 3 de pintades: també és ${frac(3, 4)}.</p>`,
        vis: () => cercleSVG({ d: 4, n: 3, animOmple: true, retard: .3 }) },
      { text: `<p><b class="parpelleja">Compte!</b> Si les parts <b>no</b> són iguals, no podem escriure la fracció.</p>`,
        vis: () => `<div style="display:flex;align-items:center;gap:14px">${barraSVG({ d: 4, n: 1, pesos: [1, 3, 1.5, 2], W: 360 })}<span class="marca-ko" style="font-size:2rem">✗</span></div><div class="apareix" style="animation-delay:.6s;display:flex;align-items:center;gap:14px">${barraSVG({ d: 4, n: 1, W: 360 })}<span class="marca-ok" style="font-size:2rem">✓</span></div>` },
      { text: `<p>De vegades agafem <b class="parpelleja">més d'una unitat</b>.</p><p class="petit">A baix: les parts d'<b>una</b> barra (4). A dalt: <b>totes</b> les pintades (5).</p>`,
        vis: () => unitatsSVG({ d: 4, n: 5, forma: 'barra', animOmple: true }) + `<div class="apareix" style="animation-delay:2s">${frac(5, 4, 'gran')}</div>` }
    ],
    exemple: (nv) => {
      if (nv === 3) {
        const [n, d, Q] = tria([[3, 4, 20], [2, 5, 15], [2, 3, 12]]); const k = Q / d;
        const dots = () => {
          let s = ''; for (let g = 0; g < d; g++) for (let i = 0; i < k; i++) { const x = 20 + g * (k * 26 + 22) + i * 26; s += `<circle cx="${x}" cy="30" r="10" fill="#fff" stroke="#1b1b1b" stroke-width="2.5"/>`; }
          return s;
        };
        const W = 20 + d * (k * 26 + 22);
        const grups = (pintats) => { let s = ''; for (let g = 0; g < d; g++) { const x = 6 + g * (k * 26 + 22); s += `<rect x="${x}" y="12" width="${k * 26 + 2}" height="36" rx="10" fill="${g < pintats ? 'var(--taronja-suau)' : 'none'}" stroke="${g < pintats ? T : '#aaa'}" stroke-width="2.5" class="pop" style="animation-delay:${g * .2}s"/>`; } return s; };
        return {
          enunciat: `Quant és ${frac(n, d, 'mitja')} de <b>${Q}</b>?`,
          passos: [
            { text: `Tenim ${Q} coses.`, vis: `<svg class="dib" viewBox="0 0 ${W} 60" width="${Math.min(W, 520)}">${dots()}</svg>` },
            { text: `El <b>denominador</b> (${d}) diu en quants grups iguals repartim: ${Q} : ${d} = <b>${k}</b>.`, vis: `<svg class="dib" viewBox="0 0 ${W} 60" width="${Math.min(W, 520)}">${grups(0)}${dots()}</svg>` },
            { text: `El <b>numerador</b> (${n}) diu quants grups agafem: ${n} × ${k} = <b>${n * k}</b>.`, vis: `<svg class="dib" viewBox="0 0 ${W} 60" width="${Math.min(W, 520)}">${grups(n)}${dots()}</svg>` },
            { text: `Resultat: ${frac(n, d)} de ${Q} = <b>${n * k}</b>. <span class="marca-ok">✓</span>`, vis: `<svg class="dib" viewBox="0 0 ${W} 60" width="${Math.min(W, 520)}">${grups(n)}${dots()}</svg>` }
          ]
        };
      }
      const [n, d] = tria([[2, 6], [3, 8], [3, 5], [5, 6]]);
      return {
        enunciat: `Quina fracció de la pizza està pintada?`,
        passos: [
          { text: `Mirem la pizza.`, vis: cercleSVG({ d, n }) },
          { text: `Comptem <b>totes</b> les parts: 1, 2, 3… n'hi ha <b>${d}</b>.`, vis: cercleSVG({ d, n, numeros: 'totes', animNum: true }) },
          { text: `El total va <b>a baix</b>.`, vis: cercleSVG({ d, n }) + `<div class="apareix">${frac('?', d, 'gran')}</div>` },
          { text: `Comptem les <b>pintades</b>: n'hi ha <b>${n}</b>.`, vis: cercleSVG({ d, n, numeros: 'pintades', animNum: true }) + `<div>${frac('?', d, 'gran')}</div>` },
          { text: `Les pintades van <b>a dalt</b>. La fracció és ${frac(n, d)}. <span class="marca-ok">✓</span>`, vis: cercleSVG({ d, n }) + `<div class="apareix">${frac(n, d, 'gran')}</div>` }
        ]
      };
    }
};
const dibuixFrac = (n, d) => n <= d ? barraSVG({ d, n }) : unitatsSVG({ d, n });
const pintaResp = (n, d, o = {}) => ({ mode: 'pintar', valor: [n, d], d, unitatsInicials: 1, potAfegir: !!o.potAfegir, triaD: !!o.triaD });
const fracGran = (n, d, pista, textD = 'en quantes parts dividim cada unitat') => `<div style="display:flex;align-items:center;gap:20px">${frac(n, d, 'gran')}${pista ? `<div class="etiq-frac"><div>← pinta'n <b>${n}</b></div><div>← ${textD}: <b>${d}</b></div></div>` : ''}</div>`;
const OPS_PROP = [
  { html: `<span><b>Pròpia</b> · menys d'una unitat</span>`, val: 'propia', txt: 'Pròpia' },
  { html: `<span><b>Impròpia</b> · més d'una unitat</span>`, val: 'impropia', txt: 'Impròpia' }
];
const T2 = {};
T2.pintaPropia = (nv) => {
  const d = tria([3, 4, 5, 6, 8]); const n = rnd(1, d - 1);
  return {
    sig: `pp-${n}-${d}`,
    enunciat: `Pinta ${frac(n, d, 'mitja')} de la barra. Toca les parts per pintar-les.`,
    visual: p => fracGran(n, d, p, 'parts de la barra'),
    pista: { completa: `La barra ja està dividida en <b>${d}</b> parts (el número de baix). Pinta'n <b>${n}</b> (el de dalt).`, mitja: `Pinta tantes parts com diu el número de <b>dalt</b>.` },
    resposta: pintaResp(n, d),
    correctaHtml: frac(n, d), correctaTxt: ftxt(n, d), dibuixSolucio: dibuixFrac(n, d),
    explicacio: `La barra té ${d} parts i n'hem de pintar ${n}.`,
    solucio: [`El denominador (${d}) diu en quantes parts està dividida la barra.`, `El numerador (${n}) diu quantes parts pintem: <b>${n}</b>.`]
  };
};
T2.classifica = (nv, { dib = false } = {}) => {
  let d, n; do { d = tria([2, 3, 4, 5, 6, 8]); n = rnd(1, 2 * d - 1); } while (n === d);
  const prop = n < d;
  return {
    sig: `cl-${n}-${d}-${dib ? 1 : 0}`,
    enunciat: `La fracció ${frac(n, d, 'mitja')} és pròpia o impròpia?`,
    visual: dib ? (() => dibuixFrac(n, d)) : null,
    pista: { completa: `Compara: el número de dalt (<b>${n}</b>) és més petit o més gran que el de baix (<b>${d}</b>)?`, mitja: `Mira si el de dalt és més gran que el de baix.` },
    resposta: { mode: 'opcions', opcions: OPS_PROP, correcta: prop ? 'propia' : 'impropia' },
    correctaHtml: prop ? 'pròpia' : 'impròpia', correctaTxt: prop ? 'Pròpia' : 'Impròpia', dibuixSolucio: dibuixFrac(n, d),
    explicacio: prop ? `${n} és més petit que ${d}: és <b>pròpia</b>, menys d'una unitat.` : `${n} és més gran que ${d}: és <b>impròpia</b>, més d'una unitat.`,
    solucio: [`Comparo el numerador (${n}) amb el denominador (${d}).`, prop ? `${n} &lt; ${d}: és <b>pròpia</b> (menys d'una unitat).` : `${n} &gt; ${d}: és <b>impròpia</b> (més d'una unitat).`]
  };
};
T2.impropiaTria = (nv) => {
  const d = tria([2, 3, 4, 5]); const n = d + rnd(1, d - 1);
  return {
    sig: `itb-${n}-${d}`,
    enunciat: `Cada barra és <b>una unitat</b>. Quina fracció està pintada?`,
    visual: p => unitatsSVG({ d, n, numeros: p }),
    pista: { completa: `Cada barra té <b>${d}</b> parts: a baix va el ${d}. A dalt, <b>totes</b> les parts pintades.`, mitja: `A baix, les parts d'<b>una</b> barra.` },
    resposta: opcionsFrac(n, d, [[n - d, d], [n, 2 * d], [d, n]]),
    correctaHtml: frac(n, d), correctaTxt: ftxt(n, d),
    explicacio: `Cada unitat té ${d} parts (a baix) i n'hi ha ${n} de pintades (a dalt). És impròpia: més d'una unitat.`,
    solucio: [`Cada barra (unitat) té <b>${d}</b> parts: va a baix.`, `Totes les parts pintades: <b>${n}</b>. Va a dalt.`, `Resultat: ${frac(n, d)}.`]
  };
};
T2.pintaUnitats = (nv, { imp = true } = {}) => {
  const d = tria([2, 3, 4, 5, 6]);
  let n; if (!imp) n = rnd(1, d - 1); else do { n = rnd(d + 1, d <= 3 ? 3 * d - 1 : 2 * d - 1); } while (n % d === 0);
  const u = Math.ceil(n / d);
  return {
    sig: `pu-${n}-${d}`,
    enunciat: `Representa ${frac(n, d, 'mitja')}. Si et cal més d'una unitat, prem <b>+ unitat</b>.`,
    visual: p => fracGran(n, d, p),
    pista: { completa: `Cada unitat té ${d} parts. Has de pintar ${n} parts: ${n > d ? 'amb una unitat <b>no n\'hi ha prou</b>.' : 'en tens prou amb una unitat.'}`, mitja: `Omple primer una unitat sencera.` },
    resposta: pintaResp(n, d, { potAfegir: true }),
    correctaHtml: frac(n, d), correctaTxt: ftxt(n, d), dibuixSolucio: dibuixFrac(n, d),
    explicacio: n > d ? `Calen ${u} unitats: ${pl(Math.floor(n / d), 'de sencera', 'de senceres')} (${Math.floor(n / d) * d} parts) i ${pl(n % d, 'part', 'parts')} més.` : `És pròpia: n'hi ha prou amb una unitat i ${n} parts pintades.`,
    solucio: [`Cada unitat es divideix en <b>${d}</b> parts (el denominador).`, `He de pintar <b>${n}</b> parts (el numerador).`, n > d ? `Una unitat només té ${d} parts: necessito <b>${u} unitats</b>. Omplo primer les senceres.` : `Amb una unitat en tinc prou.`]
  };
};
T2.compara1 = (nv) => {
  const d = tria(nv >= 3 ? [5, 6, 8, 10, 12] : [2, 3, 4, 5, 6, 8]); const r = Math.random();
  const n = r < .2 ? d : r < .6 ? rnd(1, d - 1) : rnd(d + 1, 2 * d);
  const c = n < d ? 'menor' : n === d ? 'igual' : 'major';
  const noms = { menor: 'Més petita que 1', igual: 'Igual a 1', major: 'Més gran que 1' };
  return {
    sig: `c1-${n}-${d}`,
    enunciat: `La fracció ${frac(n, d, 'mitja')} és…`,
    visual: null,
    pista: { completa: `Una unitat sencera són ${frac(d, d)}. Tens més o menys de ${d} parts?`, mitja: `Compara el número de dalt amb el de baix.` },
    resposta: { mode: 'opcions', opcions: ['menor', 'igual', 'major'].map(k => ({ html: noms[k], val: k, txt: noms[k] })), correcta: c },
    correctaHtml: noms[c].toLowerCase(), correctaTxt: noms[c], dibuixSolucio: dibuixFrac(n, d),
    explicacio: c === 'igual' ? `${n} parts de ${d}: és una unitat sencera, ${frac(n, d)} = 1.` : c === 'menor' ? `${n} és més petit que ${d}: no arriba a una unitat.` : `${n} és més gran que ${d}: passa d'una unitat.`,
    solucio: [`Una unitat sencera són ${d} parts (${frac(d, d)} = 1).`, `Tinc ${n} parts: ${c === 'igual' ? 'exactament una unitat' : c === 'menor' ? 'menys d\'una unitat' : 'més d\'una unitat'}.`]
  };
};
T2.pintaSenseDividir = (nv, { imp = false } = {}) => {
  const d = tria([3, 4, 5, 6]); const n = imp ? d + rnd(1, d - 1) : rnd(1, d - 1);
  return {
    sig: `psd-${n}-${d}`,
    enunciat: `Representa ${frac(n, d, 'mitja')}. Primer tria en quantes parts divideixes cada unitat.`,
    visual: p => fracGran(n, d, p),
    pista: { completa: `El denominador (${d}) diu en quantes parts divideixes cada unitat.`, mitja: `Mira el número de baix.` },
    resposta: pintaResp(n, d, { potAfegir: true, triaD: true }),
    correctaHtml: frac(n, d), correctaTxt: ftxt(n, d), dibuixSolucio: dibuixFrac(n, d),
    explicacio: `Cada unitat es divideix en ${d} parts i se'n pinten ${n}${n > d ? ': calen dues unitats' : ''}.`,
    solucio: [`Divideixo cada unitat en <b>${d}</b> parts (el denominador).`, `Pinto <b>${n}</b> parts (el numerador).`, n > d ? `Com que ${n} &gt; ${d}, necessito una segona unitat.` : `Amb una unitat en tinc prou.`]
  };
};
T2.pintaGran = (nv) => {
  const d = tria([3, 4, 5, 6]); let n;
  do { n = d <= 4 ? rnd(2 * d + 1, 3 * d - 1) : rnd(d + 1, 2 * d - 1); } while (n % d === 0);
  const u = Math.ceil(n / d);
  return {
    sig: `pg-${n}-${d}`,
    enunciat: `Representa ${frac(n, d, 'mitja')}. Afegeix totes les unitats que et calguin.`,
    visual: p => fracGran(n, d, p),
    pista: { completa: `Quantes vegades cap ${d} dins de ${n}?`, mitja: `Omple unitats senceres.` },
    resposta: pintaResp(n, d, { potAfegir: true }),
    correctaHtml: frac(n, d), correctaTxt: ftxt(n, d), dibuixSolucio: dibuixFrac(n, d),
    explicacio: `${n} parts de ${d}: ${pl(Math.floor(n / d), 'unitat sencera', 'unitats senceres')} i ${pl(n % d, 'part', 'parts')} més. Calen ${u} unitats.`,
    solucio: [`Cada unitat té <b>${d}</b> parts.`, `${n} parts = ${pl(Math.floor(n / d), 'unitat sencera', 'unitats senceres')} (${Math.floor(n / d) * d} parts) + ${pl(n % d, 'part', 'parts')}.`, `Necessito <b>${u} unitats</b>.`]
  };
};
const NOMS = ['En Pau', 'La Júlia', 'En Nil', 'La Martina', 'L\'Èric'];
T2.trobaError = (nv) => {
  const d = tria([2, 3, 4, 5]); const n = d + rnd(1, d - 1); const tipus = tria(['be', 'divisio', 'compte']); const qui = tria(NOMS);
  const vis = tipus === 'be' ? unitatsSVG({ d, n }) : tipus === 'divisio' ? barraSVG({ d: n, n: d }) : unitatsSVG({ d, n: n + tria([-1, 1]) });
  const ops = [
    { html: 'Està ben representada', val: 'be', txt: 'Ben representada' },
    { html: 'Les unitats no estan dividides en les parts correctes', val: 'divisio', txt: 'Mal dividida' },
    { html: 'No hi ha el número correcte de parts pintades', val: 'compte', txt: 'Mal pintada' }
  ];
  const expl = { be: `Cada unitat té ${d} parts i n'hi ha ${n} de pintades: està bé.`, divisio: `Cada unitat s'havia de dividir en <b>${d}</b> parts (el denominador) i pintar-ne <b>${n}</b>. S'han confós els dos números.`, compte: `Les unitats estan ben dividides, però s'havien de pintar <b>${n}</b> parts.` };
  return {
    sig: `te-${tipus}-${n}-${d}`,
    enunciat: `${qui} diu que aquest dibuix representa ${frac(n, d, 'mitja')}. Té raó?`,
    visual: () => vis,
    pista: { completa: `Comprova dues coses: en quantes parts està dividida cada unitat i quantes n'hi ha de pintades.`, mitja: `Compta les parts.` },
    resposta: { mode: 'opcions', opcions: ops, correcta: tipus },
    correctaHtml: ops.find(o => o.val === tipus).html.toLowerCase(), correctaTxt: ops.find(o => o.val === tipus).txt, dibuixSolucio: unitatsSVG({ d, n }),
    explicacio: expl[tipus],
    solucio: [`Cada unitat s'ha de dividir en <b>${d}</b> parts i s'han de pintar <b>${n}</b> parts.`, `Comparo amb el dibuix: ${expl[tipus]}`]
  };
};

TEMES.o2 = {
  gen: { ...T2, impropiaEscriu: T1.impropiaEscriu },
  sequencia: {
    1: [['pintaPropia'], ['classifica', { dib: true }], ['impropiaTria'], ['pintaPropia'], ['classifica', { dib: true }], ['impropiaTria'], ['pintaPropia'], ['classifica', { dib: true }]],
    2: [['pintaUnitats', { imp: true }], ['impropiaEscriu'], ['compara1'], ['pintaUnitats', { imp: false }], ['classifica'], ['impropiaEscriu'], ['pintaUnitats', { imp: true }], ['compara1']],
    3: [['pintaSenseDividir', { imp: false }], ['pintaGran'], ['trobaError'], ['compara1'], ['pintaSenseDividir', { imp: true }], ['impropiaEscriu'], ['trobaError'], ['pintaGran']]
  },
  explicacio: [
    { text: `<p>Una fracció és <b class="parpelleja">pròpia</b> quan el número de dalt és <b>més petit</b> que el de baix.</p><p class="petit">3 és més petit que 4: agafem <b>menys d'una unitat</b>.</p>`,
      vis: () => barraSVG({ d: 4, n: 3, animOmple: true, retard: .2 }) + `<div class="apareix" style="animation-delay:1.3s;display:flex;align-items:center;gap:16px">${frac(3, 4, 'gran')}<b style="font-size:1.6rem">3 &lt; 4</b></div>` },
    { text: `<p>Per <b>representar-la</b>, dividim la unitat en tantes parts com diu el número de <b class="parpelleja">baix</b>…</p>`,
      vis: () => barraSVG({ d: 5, n: 0, animDiv: true }) + `<div class="apareix" style="animation-delay:1.2s">${frac(3, 5, 'gran')}</div>` },
    { text: `<p>…i <b>pintem</b> tantes parts com diu el número de <b class="parpelleja">dalt</b>.</p>`,
      vis: () => barraSVG({ d: 5, n: 3, numeros: 'pintades', animOmple: true, retard: .2 }) + `<div>${frac(3, 5, 'gran')}</div>` },
    { text: `<p>Una fracció és <b class="parpelleja">impròpia</b> quan el número de dalt és <b>més gran</b> que el de baix.</p><p class="petit">7 és més gran que 4: agafem <b>més d'una unitat</b>.</p>`,
      vis: () => `<div style="display:flex;align-items:center;gap:16px">${frac(7, 4, 'gran')}<b style="font-size:1.6rem">7 &gt; 4</b></div>` },
    { text: `<p>Pintem 7 parts, però una unitat només en té <b>4</b>.</p><p>Necessitem <b class="parpelleja">una altra unitat</b>!</p>`,
      vis: () => `<div>${barraSVG({ d: 4, n: 4, numeros: 'pintades', animOmple: true, retard: .2 })}</div><div class="apareix" style="animation-delay:1.8s">${barraSVG({ d: 4, n: 0 })}</div>` },
    { text: `<p>Omplim primer la unitat <b>sencera</b> i continuem a la següent.</p><p class="petit">4 + 3 = 7 parts pintades.</p>`,
      vis: () => unitatsSVG({ d: 4, n: 7, numeros: true, animOmple: true }) + `<div class="apareix" style="animation-delay:2.6s">${frac(7, 4, 'gran')}</div>` },
    { text: `<p>I si els dos números són <b class="parpelleja">iguals</b>? Tenim una unitat <b>sencera</b>.</p>`,
      vis: () => barraSVG({ d: 4, n: 4, animOmple: true, retard: .2 }) + `<div class="apareix" style="animation-delay:1.6s;display:flex;align-items:center;gap:14px">${frac(4, 4, 'gran')}<b style="font-size:2rem">= 1</b></div>` },
    { text: `<p><b>Resum</b></p><p class="petit"><b>Pròpia</b>: dalt més petit → menys d'1.<br><b>Impròpia</b>: dalt més gran → més d'1.</p>`,
      vis: () => `<div style="display:flex;gap:26px;align-items:center;flex-wrap:wrap;justify-content:center"><div style="text-align:center">${barraSVG({ d: 3, n: 2, W: 220, H: 54 })}<div style="font-weight:800">${frac(2, 3, 'mitja')} pròpia</div></div><div style="text-align:center">${unitatsSVG({ d: 3, n: 5 }).replace('width="480"', 'width="240"')}<div style="font-weight:800">${frac(5, 3, 'mitja')} impròpia</div></div></div>` }
  ],
  exemple: (nv) => {
    if (nv === 1) {
      const [n, d] = tria([[3, 5], [2, 3], [5, 8], [3, 4]]);
      return {
        enunciat: `Pinta ${frac(n, d, 'mitja')} de la barra.`,
        passos: [
          { text: `La barra ja està dividida en <b>${d}</b> parts: és el número de baix.`, vis: barraSVG({ d, n: 0, numeros: 'totes', animNum: true }) },
          { text: `El número de dalt és <b>${n}</b>: pintem ${n} parts.`, vis: barraSVG({ d, n, numeros: 'pintades', animOmple: true }) },
          { text: `Ja tenim ${frac(n, d)}. <span class="marca-ok">✓</span>`, vis: barraSVG({ d, n }) + `<div class="apareix">${frac(n, d, 'gran')}</div>` }
        ]
      };
    }
    if (nv === 2) {
      const [n, d] = tria([[7, 4], [5, 3], [8, 5]]);
      return {
        enunciat: `Representa ${frac(n, d, 'mitja')}.`,
        passos: [
          { text: `Cada unitat es divideix en <b>${d}</b> parts.`, vis: barraSVG({ d, n: 0, animDiv: true }) },
          { text: `Hem de pintar <b>${n}</b> parts, però una unitat només en té ${d}: <b>afegim una unitat</b> (+ unitat).`, vis: unitatsSVG({ d, n: 0 }) },
          { text: `Omplim la primera unitat sencera: ${d} parts.`, vis: unitatsSVG({ d, n: d, numeros: true, animOmple: true }) },
          { text: `Continuem a la segona fins arribar a ${n}.`, vis: unitatsSVG({ d, n, numeros: true }) },
          { text: `Ja tenim ${frac(n, d)}. <span class="marca-ok">✓</span>`, vis: unitatsSVG({ d, n }) + `<div class="apareix">${frac(n, d, 'gran')}</div>` }
        ]
      };
    }
    const [n, d] = tria([[5, 3], [7, 5], [9, 4]]);
    return {
      enunciat: `Representa ${frac(n, d, 'mitja')}. La unitat no està dividida.`,
      passos: [
        { text: `Tenim una unitat sense dividir.`, vis: barraSVG({ d: 1, n: 0 }) },
        { text: `El denominador és <b>${d}</b>: la dividim en ${d} parts.`, vis: barraSVG({ d, n: 0, animDiv: true }) },
        { text: `Hem de pintar <b>${n}</b> parts: ${n} &gt; ${d}, necessitem ${Math.ceil(n / d)} unitats.`, vis: unitatsSVG({ d, n: 0 }) },
        { text: `Pintem les ${n} parts, omplint primer les unitats senceres. <span class="marca-ok">✓</span>`, vis: unitatsSVG({ d, n, numeros: true, animOmple: true }) }
      ]
    };
  }
};

/* =====================================================================
   TEMA 3a · NOMBRES MIXTOS   ·   TEMA 3b · LA RECTA NUMÈRICA
   ===================================================================== */
const mix = (e, n, d, cls = '') => `<span class="mix ${cls}"><span class="mix-e">${e}</span>${frac(n, d)}</span>`;
const mixTxt = (e, n, d) => `${e} ${n}/${d}`;
const divisioHtml = (a, b, q = '', r = '') => `<span class="divisio"><span>${a}</span><span class="dd">${b}</span><span class="r">${r}</span><span class="q">${q}</span></span>`;
const mixGran = (e, r, d, p) => `<div style="display:flex;align-items:center;gap:20px">${mix(e, r, d, 'gran')}${p ? `<div class="etiq-frac"><div>← <b>${e}</b> ${e === 1 ? 'unitat sencera' : 'unitats senceres'}</div><div>← i ${frac(r, d)} més</div></div>` : ''}</div>`;
function opcionsMix(e, r, d, cands) {
  const val = e + r / d, vals = [val], out = [[e, r, d]];
  for (const [a, b, c] of [...barreja(cands), [e + 1, r, d], [e, r, d + 1]]) {
    if (out.length === 3) break; if (a < 0 || b <= 0 || b >= c) continue;
    const v = a + b / c; if (vals.some(x => Math.abs(x - v) < 1e-9)) continue; vals.push(v); out.push([a, b, c]);
  }
  return { mode: 'opcions', opcions: barreja(out).map(([a, b, c]) => ({ html: mix(a, b, c, 'mitja'), val: `${a}_${b}_${c}`, txt: mixTxt(a, b, c) })), correcta: `${e}_${r}_${d}` };
}
const T3a = {};
T3a.dibuixMixtTria = (nv) => {
  const d = tria([2, 3, 4]), e = rnd(1, 2), r = rnd(1, d - 1), n = e * d + r;
  return {
    sig: `dmt-${e}-${r}-${d}`,
    enunciat: `Cada barra és una unitat. Quin nombre mixt està pintat?`,
    visual: () => unitatsSVG({ d, n }),
    pista: { completa: `Compta les barres <b>senceres</b> pintades: és la part entera. Després mira quina fracció queda a la barra incompleta.`, mitja: `Primer, les barres senceres.` },
    resposta: opcionsMix(e, r, d, [[e, d - r, d], [e + 1, r, d], [Math.max(0, e - 1), r, d], [r, e, d]]),
    correctaHtml: mix(e, r, d), correctaTxt: mixTxt(e, r, d),
    explicacio: `Hi ha ${pl(e, 'barra sencera', 'barres senceres')} i ${frac(r, d)} d'una altra: ${mix(e, r, d)}.`,
    solucio: [`Barres senceres: <b>${e}</b>. És la part entera.`, `A la barra incompleta hi ha ${r} de ${d} parts: ${frac(r, d)}.`, `Resultat: ${mix(e, r, d)}.`]
  };
};
T3a.unitatsSenceres = (nv) => {
  const d = tria([2, 3, 4, 5]), e = rnd(1, 2), r = rnd(1, d - 1), n = e * d + r;
  const ops = barreja([e - 1, e, e + 1]).map(k => ({ html: `<span style="font-size:1.4em">${k}</span>`, val: String(k), txt: String(k) }));
  return {
    sig: `us-${n}-${d}`,
    enunciat: `Quantes unitats <b>senceres</b> hi ha a ${frac(n, d, 'mitja')}?`,
    visual: () => unitatsSVG({ d, n }),
    pista: { completa: `Compta només les barres que estan <b>pintades del tot</b>.`, mitja: `Només les barres plenes.` },
    resposta: { mode: 'opcions', opcions: ops, correcta: String(e) },
    correctaHtml: `<b>${e}</b>`, correctaTxt: String(e),
    explicacio: `Hi ha ${pl(e, 'barra plena', 'barres plenes')}: ${frac(n, d)} = ${mix(e, r, d)}.`,
    solucio: [`Cada unitat té ${d} parts. Compto les barres plenes: <b>${e}</b>.`, `${frac(n, d)} = ${mix(e, r, d)}.`]
  };
};
T3a.pintaMixt = (nv) => {
  const d = tria([2, 3, 4, 5]), e = rnd(1, 2), r = rnd(1, d - 1), n = e * d + r;
  return {
    sig: `pm-${e}-${r}-${d}`,
    enunciat: `Pinta ${mix(e, r, d, 'mitja')}. Afegeix les unitats que et calguin.`,
    visual: p => mixGran(e, r, d, p),
    pista: { completa: `Pinta ${pl(e, 'unitat sencera', 'unitats senceres')} i després ${r} ${r === 1 ? 'part' : 'parts'} d'una altra.`, mitja: `Primer, les unitats senceres.` },
    resposta: pintaResp(n, d, { potAfegir: true }),
    correctaHtml: mix(e, r, d), correctaTxt: mixTxt(e, r, d), dibuixSolucio: unitatsSVG({ d, n }),
    explicacio: `${pl(e, 'unitat sencera', 'unitats senceres')} i ${frac(r, d)} més: en total ${n} parts de ${d}.`,
    solucio: [`Pinto <b>${e}</b> ${e === 1 ? 'unitat sencera' : 'unitats senceres'}.`, `A la següent unitat, pinto ${r} de ${d} parts.`]
  };
};
T3a.impAMixt = (nv, { dib = false } = {}) => {
  const d = tria(nv >= 3 ? [3, 4, 5, 6, 8] : [2, 3, 4, 5]), e = nv >= 3 ? rnd(2, 5) : rnd(1, 3), r = rnd(1, d - 1), n = e * d + r;
  return {
    sig: `im-${n}-${d}`,
    enunciat: `Escriu ${frac(n, d, 'mitja')} com a nombre mixt.`,
    visual: dib ? (() => unitatsSVG({ d, n })) : (p => p ? divisioHtml(n, d) : null),
    pista: { completa: `Divideix ${n} entre ${d}. El resultat és la part entera i el que sobra va a dalt.`, mitja: `Divideix el de dalt entre el de baix.` },
    resposta: { mode: 'mixt', valor: [n, d] },
    correctaHtml: mix(e, r, d), correctaTxt: mixTxt(e, r, d),
    explicacio: `${n} : ${d} = ${e} i sobren ${r}. Per tant, ${frac(n, d)} = ${mix(e, r, d)}.`,
    solucio: [`Divideixo: ${n} : ${d} = <b>${e}</b> i sobren <b>${r}</b>.`, `El quocient (${e}) és la part entera. El residu (${r}) va a dalt. El denominador no canvia.`, `Resultat: ${mix(e, r, d)}.`]
  };
};
T3a.mixtAImp = (nv, { dib = false } = {}) => {
  const d = tria(nv >= 3 ? [3, 4, 5, 6, 8] : [2, 3, 4, 5]), e = nv >= 3 ? rnd(2, 5) : rnd(1, 3), r = rnd(1, d - 1), n = e * d + r;
  return {
    sig: `mi-${e}-${r}-${d}`,
    enunciat: `Escriu ${mix(e, r, d, 'mitja')} com a fracció impròpia.`,
    visual: dib ? (p => unitatsSVG({ d, n, numeros: p })) : null,
    pista: { completa: `Multiplica ${e} × ${d} i suma-hi ${r}. El denominador no canvia.`, mitja: `Multiplica i suma.` },
    resposta: { mode: 'fraccio', valor: [n, d], equiv: true },
    correctaHtml: frac(n, d), correctaTxt: ftxt(n, d),
    explicacio: `${e} × ${d} + ${r} = ${n}. Per tant, ${mix(e, r, d)} = ${frac(n, d)}.`,
    solucio: [`Les ${e} unitats senceres tenen ${e} × ${d} = <b>${e * d}</b> parts.`, `Hi sumo les ${r} parts: ${e * d} + ${r} = <b>${n}</b>.`, `Resultat: ${frac(n, d)}.`]
  };
};
T3a.context = (nv) => {
  const d = tria([4, 6, 8]), e = rnd(2, 4), r = rnd(1, d - 1), n = e * d + r; const c = tria([['porcions de pizza', 'pizza', 'pizzes'], ['trossos de pastís', 'pastís', 'pastissos']]);
  return {
    sig: `cx-${n}-${d}-${c[1]}`,
    enunciat: `Tens <b>${n} ${c[0]}</b>. Cada ${c[1]} té ${d} trossos iguals. Quants ${c[2]} tens? Escriu-ho com a nombre mixt.`,
    visual: null,
    pista: { completa: `Divideix ${n} entre ${d}.`, mitja: `Divideix.` },
    resposta: { mode: 'mixt', valor: [n, d] },
    correctaHtml: mix(e, r, d), correctaTxt: mixTxt(e, r, d),
    explicacio: `${n} : ${d} = ${e} i sobren ${r}: ${e} ${c[2]} senceres i ${frac(r, d)} d'una altra.`,
    solucio: [`${n} trossos de ${d} en ${d}: ${n} : ${d} = <b>${e}</b> i sobren <b>${r}</b>.`, `${e} ${c[2]} senceres i ${frac(r, d)} més: ${mix(e, r, d)}.`]
  };
};
T3a.compara = (nv) => {
  const d = tria([3, 4, 5, 6]), e = rnd(1, 3), r = rnd(1, d - 1), n = e * d + r;
  let m; const t = tria(['a', 'b', 'iguals']);
  if (t === 'iguals') m = n; else if (t === 'a') m = n - rnd(1, 2); else m = n + rnd(1, 2);
  const ops = [{ html: mix(e, r, d, 'mitja'), val: 'a', txt: mixTxt(e, r, d) }, { html: frac(m, d, 'mitja'), val: 'b', txt: ftxt(m, d) }, { html: 'Són iguals', val: 'iguals', txt: 'Iguals' }];
  return {
    sig: `cm-${e}-${r}-${d}-${m}`,
    enunciat: `Quin és més gran: ${mix(e, r, d, 'mitja')} o ${frac(m, d, 'mitja')}?`,
    visual: null,
    pista: { completa: `Passa el nombre mixt a fracció i compara els numeradors.`, mitja: `Passa'ls al mateix format.` },
    resposta: { mode: 'opcions', opcions: ops, correcta: t },
    correctaHtml: t === 'iguals' ? 'són iguals' : t === 'a' ? mix(e, r, d) : frac(m, d), correctaTxt: t,
    explicacio: `${mix(e, r, d)} = ${frac(n, d)}. Comparem ${n} amb ${m}: ${t === 'iguals' ? 'són iguals' : t === 'a' ? `és més gran ${mix(e, r, d)}` : `és més gran ${frac(m, d)}`}.`,
    solucio: [`Passo el mixt a fracció: ${e} × ${d} + ${r} = ${n} → ${frac(n, d)}.`, `Comparo ${frac(n, d)} amb ${frac(m, d)}: ${n} ${n > m ? '&gt;' : n < m ? '&lt;' : '='} ${m}.`]
  };
};

TEMES.o3a = {
  gen: T3a,
  sequencia: {
    1: [['dibuixMixtTria'], ['unitatsSenceres'], ['pintaMixt'], ['dibuixMixtTria'], ['unitatsSenceres'], ['dibuixMixtTria'], ['pintaMixt'], ['dibuixMixtTria']],
    2: [['impAMixt', { dib: true }], ['mixtAImp', { dib: true }], ['pintaMixt'], ['impAMixt', { dib: true }], ['mixtAImp', { dib: true }], ['impAMixt', { dib: true }], ['impAMixt'], ['mixtAImp']],
    3: [['impAMixt'], ['mixtAImp'], ['context'], ['compara'], ['impAMixt'], ['mixtAImp'], ['context'], ['compara']]
  },
  explicacio: [
    { text: `<p>Un <b class="parpelleja">nombre mixt</b> té una part <b>entera</b> i una <b>fracció</b>.</p><p class="petit">Es llegeix «dos i tres quarts».</p>`,
      vis: () => mixGran(2, 3, 4, true) },
    { text: `<p>Mira ${frac(7, 4)} dibuixada.</p><p>Hi ha <b>1 unitat sencera</b> i ${frac(3, 4)} <b class="parpelleja">més</b>.</p>`,
      vis: () => unitatsSVG({ d: 4, n: 7, animOmple: true }) },
    { text: `<p>Per tant, ${frac(7, 4)} i ${mix(1, 3, 4)} són el <b class="parpelleja">mateix</b> número.</p>`,
      vis: () => unitatsSVG({ d: 4, n: 7 }) + `<div class="apareix" style="font-size:1rem;display:flex;align-items:center;gap:14px">${frac(7, 4, 'gran')}<b style="font-size:2.4rem">=</b>${mix(1, 3, 4, 'gran')}</div>` },
    { text: `<p>Sense dibuix, <b class="parpelleja">dividim</b>: 7 entre 4.</p><p class="petit">El 4 cap <b>1</b> vegada dins del 7 i en <b>sobren 3</b>.</p>`,
      vis: () => `<div class="apareix">${divisioHtml(7, 4, 1, 3)}</div>` },
    { text: `<p>El <b>quocient</b> és la part entera.</p><p>El <b>residu</b> va a dalt.</p><p>El denominador <b class="parpelleja">no canvia</b>.</p>`,
      vis: () => `<div style="display:flex;align-items:center;gap:22px">${divisioHtml(7, 4, 1, 3)}<b style="font-size:2rem">→</b><span class="apareix" style="animation-delay:.5s">${mix(1, 3, 4, 'gran')}</span></div>` },
    { text: `<p>I al revés? <b class="parpelleja">Multipliquem i sumem</b>.</p><p class="petit">${mix(2, 1, 3)}: 2 × 3 + 1 = 7 → ${frac(7, 3)}</p>`,
      vis: () => unitatsSVG({ d: 3, n: 7, numeros: true, animOmple: true }) + `<div class="apareix" style="animation-delay:2.4s;display:flex;align-items:center;gap:14px">${mix(2, 1, 3, 'gran')}<b style="font-size:2.4rem">=</b>${frac(7, 3, 'gran')}</div>` }
  ],
  exemple: (nv) => {
    if (nv === 1) {
      const [d, e, r] = tria([[4, 2, 1], [3, 1, 2], [2, 2, 1]]); const n = e * d + r;
      return {
        enunciat: `Quin nombre mixt està pintat?`,
        passos: [
          { text: `Cada barra és una unitat de ${d} parts.`, vis: unitatsSVG({ d, n }) },
          { text: `Compto les barres <b>senceres</b>: ${e}. És la part entera.`, vis: unitatsSVG({ d, n: e * d, animOmple: true }) },
          { text: `A l'última barra n'hi ha ${r} de ${d}: ${frac(r, d)}.`, vis: unitatsSVG({ d, n }) },
          { text: `Resultat: ${mix(e, r, d)}. <span class="marca-ok">✓</span>`, vis: unitatsSVG({ d, n }) + `<div class="apareix">${mix(e, r, d, 'gran')}</div>` }
        ]
      };
    }
    const [d, e, r] = nv === 2 ? tria([[3, 3, 2], [4, 2, 3], [5, 2, 1]]) : tria([[5, 3, 2], [6, 4, 1], [4, 5, 3]]); const n = e * d + r;
    return {
      enunciat: `Escriu ${frac(n, d, 'mitja')} com a nombre mixt.`,
      passos: [
        { text: `Divideixo el de dalt entre el de baix: ${n} : ${d}.`, vis: divisioHtml(n, d) },
        { text: `El ${d} cap <b>${e}</b> vegades dins del ${n} (${e} × ${d} = ${e * d}) i en sobren <b>${r}</b>.`, vis: divisioHtml(n, d, e, r) },
        { text: `Quocient → part entera. Residu → a dalt. El ${d} es queda a baix.`, vis: `<div style="display:flex;align-items:center;gap:22px">${divisioHtml(n, d, e, r)}<b style="font-size:2rem">→</b>${mix(e, r, d, 'gran')}</div>` },
        { text: `Resultat: ${frac(n, d)} = ${mix(e, r, d)}. <span class="marca-ok">✓</span>`, vis: nv === 2 ? unitatsSVG({ d, n }) + `<div>${mix(e, r, d, 'gran')}</div>` : `<div>${mix(e, r, d, 'gran')}</div>` }
      ]
    };
  }
};
const rectaSVG = o => `<svg class="dib" viewBox="0 0 530 ${o.h || 116}" width="530">${rectaCos(o)}</svg>`;
const T3b = {};
T3b.situa = (nv, { imp = false } = {}) => {
  let M, d, n;
  if (nv === 1) { M = 1; d = tria([2, 3, 4, 5, 6, 8]); n = rnd(1, d - 1); }
  else { M = imp ? tria([2, 3]) : 2; d = tria(nv >= 3 ? [3, 4, 5, 6] : [2, 3, 4, 5]); if (imp) do { n = rnd(d + 1, M * d - 1); } while (n % d === 0); else n = rnd(1, d - 1); }
  const triaD = nv >= 3;
  return {
    sig: `rs-${n}-${d}-${M}-${triaD ? 1 : 0}`,
    enunciat: triaD ? `Situa ${frac(n, d, 'mitja')} a la recta. Primer tria en quantes parts divideixes cada unitat.` : `Situa ${frac(n, d, 'mitja')} a la recta. Toca el lloc on va.`,
    visual: p => `<div style="display:flex;align-items:center;gap:20px">${frac(n, d, 'gran')}${p ? `<div class="etiq-frac"><div>← salts des del 0: <b>${n}</b></div><div>← parts de cada unitat: <b>${d}</b></div></div>` : ''}</div>`,
    pista: { completa: `Cada unitat està dividida en <b>${d}</b> parts. Des del 0, compta <b>${n}</b> salts.`, mitja: `Compta els salts des del 0.` },
    resposta: { mode: 'recta', valor: [n, d], M, d, triaD },
    correctaHtml: frac(n, d), correctaTxt: ftxt(n, d), dibuixSolucio: rectaSVG({ M, d, salts: n, punts: [{ v: n / d }] }),
    explicacio: `Cada unitat es divideix en ${d} parts i des del 0 es fan ${n} salts.`,
    solucio: [`Divideixo cada unitat en <b>${d}</b> parts (el denominador).`, `Des del 0, faig <b>${n}</b> salts (el numerador).`, n > d ? `Com que ${n} &gt; ${d}, passo de l'1: ${frac(n, d)} = ${mix(Math.floor(n / d), n % d, d)}.` : `Arribo a ${frac(n, d)}.`]
  };
};
T3b.situaMixt = (nv) => {
  const d = tria(nv >= 3 ? [3, 4, 5, 6] : [2, 3, 4, 5]), e = rnd(1, 2), r = rnd(1, d - 1), n = e * d + r, M = e + 1, triaD = nv >= 3;
  return {
    sig: `rm-${e}-${r}-${d}-${triaD ? 1 : 0}`,
    enunciat: `Situa ${mix(e, r, d, 'mitja')} a la recta.${triaD ? ' Primer tria en quantes parts divideixes cada unitat.' : ''}`,
    visual: p => mixGran(e, r, d, p),
    pista: { completa: `Ves fins al <b>${e}</b> i des d'allà fes ${r} ${r === 1 ? 'salt' : 'salts'} més.`, mitja: `Comença des del ${e}.` },
    resposta: { mode: 'recta', valor: [n, d], M, d, triaD },
    correctaHtml: mix(e, r, d), correctaTxt: mixTxt(e, r, d), dibuixSolucio: rectaSVG({ M, d, punts: [{ v: n / d, label: '' }] }),
    explicacio: `${mix(e, r, d)} està entre el ${e} i el ${e + 1}: ${r} ${r === 1 ? 'salt' : 'salts'} després del ${e}.`,
    solucio: [`La part entera és <b>${e}</b>: vaig fins al ${e}.`, `Cada unitat té ${d} parts: des del ${e} faig <b>${r}</b> ${r === 1 ? 'salt' : 'salts'} més.`]
  };
};
T3b.llegirTria = (nv) => {
  const d = tria([3, 4, 5, 6, 8]), n = rnd(1, d - 1);
  return {
    sig: `rl-${n}-${d}`,
    enunciat: `Quina fracció marca el punt taronja?`,
    visual: p => rectaSVG({ M: 1, d, salts: p ? n : 0, numSalts: p, punts: [{ v: n / d }] }),
    pista: { completa: `Compta en quantes parts està dividida la unitat (a baix) i quants salts hi ha del 0 al punt (a dalt).`, mitja: `Compta els salts, no les ratlles.` },
    resposta: opcionsFrac(n, d, [[n + 1, d], [n, d + 1], [n, d - 1], [d - n, d]]),
    correctaHtml: frac(n, d), correctaTxt: ftxt(n, d),
    explicacio: `La unitat està dividida en ${d} parts i el punt és a ${n} ${n === 1 ? 'salt' : 'salts'} del 0.`,
    solucio: [`La unitat està dividida en <b>${d}</b> parts.`, `Del 0 al punt hi ha <b>${n}</b> salts.`, `És ${frac(n, d)}.`]
  };
};
T3b.llegirEscriu = (nv) => {
  const M = nv >= 3 ? 3 : 2, d = tria(nv >= 3 ? [3, 4, 5, 6, 8] : [2, 3, 4, 5]); let n; do { n = rnd(1, M * d - 1); } while (n % d === 0);
  return {
    sig: `rw-${n}-${d}-${M}`,
    enunciat: `Escriu la fracció que marca el punt taronja.`,
    visual: p => rectaSVG({ M, d, salts: p ? n : 0, punts: [{ v: n / d }] }),
    pista: { completa: `A baix, les parts de <b>cada unitat</b>. A dalt, tots els salts des del 0.`, mitja: `Compta els salts des del 0.` },
    resposta: { mode: 'fraccio', valor: [n, d], equiv: true },
    correctaHtml: frac(n, d), correctaTxt: ftxt(n, d),
    explicacio: `Cada unitat té ${d} parts i del 0 al punt hi ha ${n} salts: ${frac(n, d)}.`,
    solucio: [`Cada unitat està dividida en <b>${d}</b> parts.`, `Del 0 al punt hi ha <b>${n}</b> salts.`, `És ${frac(n, d)}${n > d ? ` = ${mix(Math.floor(n / d), n % d, d)}` : ''}.`]
  };
};
T3b.entre = (nv) => {
  const d = tria(nv >= 3 ? [3, 4, 5, 6, 8] : [2, 3, 4, 5]), e = nv === 1 ? 1 : nv === 2 ? rnd(1, 2) : rnd(2, 4), r = rnd(1, d - 1), n = e * d + r;
  const ops = barreja([e - 1, e, e + 1]).map(a => ({ html: `entre el <b>${a}</b> i el <b>${a + 1}</b>`, val: `${a}`, txt: `${a} i ${a + 1}` }));
  return {
    sig: `re-${n}-${d}`,
    enunciat: `Entre quins dos nombres enters està ${frac(n, d, 'mitja')}?`,
    visual: nv === 1 ? (p => rectaSVG({ M: 3, d, salts: p ? n : 0 })) : nv === 2 ? (() => rectaSVG({ M: e + 2 > 4 ? 4 : e + 2 })) : null,
    pista: { completa: `Divideix ${n} entre ${d}: quantes unitats senceres hi ha?`, mitja: `Passa-la a nombre mixt.` },
    resposta: { mode: 'opcions', opcions: ops, correcta: String(e) },
    correctaHtml: `entre el ${e} i el ${e + 1}`, correctaTxt: `${e} i ${e + 1}`,
    explicacio: `${frac(n, d)} = ${mix(e, r, d)}: passa del ${e} però no arriba al ${e + 1}.`,
    solucio: [`${n} : ${d} = ${e} i sobren ${r}: ${frac(n, d)} = ${mix(e, r, d)}.`, `Està entre el <b>${e}</b> i el <b>${e + 1}</b>.`]
  };
};
TEMES.o3b = {
  gen: T3b,
  sequencia: {
    1: [['situa'], ['llegirTria'], ['entre'], ['situa'], ['llegirTria'], ['situa'], ['entre'], ['llegirTria']],
    2: [['situa', { imp: true }], ['llegirEscriu'], ['situaMixt'], ['situa', { imp: true }], ['llegirEscriu'], ['entre'], ['situaMixt'], ['situa', { imp: false }]],
    3: [['situa', { imp: false }], ['llegirEscriu'], ['entre'], ['situa', { imp: true }], ['llegirEscriu'], ['situaMixt'], ['entre'], ['situa', { imp: true }]]
  },
  explicacio: [
    { text: `<p>A la <b class="parpelleja">recta numèrica</b>, els números estan ordenats i a la <b>mateixa distància</b>.</p>`,
      vis: () => rectaSVG({ M: 3 }) },
    { text: `<p>Per situar ${frac(3, 4)}, dividim la unitat en <b class="parpelleja">4 parts</b>: el denominador.</p>`,
      vis: () => rectaSVG({ M: 1, d: 4, animTicks: true }) },
    { text: `<p>Des del 0, fem <b class="parpelleja">3 salts</b>: el numerador.</p>`,
      vis: () => rectaSVG({ M: 1, d: 4, salts: 3, animSalts: true, numSalts: true, punts: [{ v: .75, label: '3/4', anim: 1.2 }] }) },
    { text: `<p><b class="parpelleja">Compte!</b> Comptem els <b>salts</b>, no les ratlles.</p><p class="petit">El 0 és el punt de sortida: no compta.</p>`,
      vis: () => rectaSVG({ M: 1, d: 4, salts: 3, numSalts: true, punts: [{ v: .75, label: '3/4' }] }) },
    { text: `<p>Les fraccions <b>impròpies</b> passen de l'1.</p><p class="petit">${frac(5, 4)}: 5 salts de quart.</p>`,
      vis: () => rectaSVG({ M: 2, d: 4, salts: 5, animSalts: true, numSalts: true, punts: [{ v: 1.25, label: '5/4', anim: 1.9 }] }) },
    { text: `<p>${frac(5, 4)} = ${mix(1, 1, 4)}: està <b class="parpelleja">entre l'1 i el 2</b>.</p>`,
      vis: () => rectaSVG({ M: 2, d: 4, punts: [{ v: 1.25, label: '5/4' }] }) + `<div class="apareix" style="display:flex;align-items:center;gap:14px">${frac(5, 4, 'gran')}<b style="font-size:2.4rem">=</b>${mix(1, 1, 4, 'gran')}</div>` }
  ],
  exemple: (nv) => {
    const [n, d, M] = nv === 1 ? tria([[2, 5, 1], [3, 8, 1], [1, 3, 1]]) : tria([[7, 3, 3], [5, 2, 3], [9, 4, 3]]);
    const passos = [];
    if (nv === 3) passos.push({ text: `La recta no està dividida. Mirem el denominador: <b>${d}</b>.`, vis: rectaSVG({ M }) });
    passos.push({ text: `Dividim cada unitat en <b>${d}</b> parts.`, vis: rectaSVG({ M, d, animTicks: true }) });
    passos.push({ text: `Des del 0, fem <b>${n}</b> salts.`, vis: rectaSVG({ M, d, salts: n, animSalts: true, numSalts: true }) });
    passos.push({ text: `Hi marquem el punt: ${frac(n, d)}${n > d ? ` = ${mix(Math.floor(n / d), n % d, d)}` : ''}. <span class="marca-ok">✓</span>`, vis: rectaSVG({ M, d, salts: n, punts: [{ v: n / d, label: `${n}/${d}`, anim: .1 }] }) });
    return { enunciat: `Situa ${frac(n, d, 'mitja')} a la recta.`, passos };
  }
};

/* =====================================================================
   TEMA 4 · FRACCIONS EQUIVALENTS
   ===================================================================== */
const transf = (a, b, c, d, op) => `<div class="transf">${frac(a, b, 'gran')}<div class="fl"><span>${op}</span><b>→</b><span>${op}</span></div>${frac(c, d, 'gran')}</div>`;
const dosBarres = (a, b, c, d, p = false) => `<svg class="dib" viewBox="0 0 480 176" width="480">${svgBarra({ d: b, n: a, y0: 8 })}${svgBarra({ d, n: c, y0: 96, numeros: p ? 'pintades' : null })}</svg>`;
const T4 = {};
T4.tapenIgual = (nv) => {
  const b = tria([2, 3, 4]), a = rnd(1, b - 1), k = tria(b <= 3 ? [2, 3] : [2]), d = b * k; const eq = Math.random() < .55;
  let c = a * k; if (!eq) c = c + tria([-1, 1]) || 1; if (!eq && c === a * k) c++;
  if (c >= d) c = d - 1; const realEq = c * b === a * d;
  return {
    sig: `tg-${a}-${b}-${c}-${d}`,
    enunciat: `Les dues barres tenen pintat el <b>mateix tros</b>?`,
    visual: () => dosBarres(a, b, c, d),
    pista: { completa: `Mira on acaba la part pintada de cada barra. Acaben al mateix lloc?`, mitja: `Compara on acaba el taronja.` },
    resposta: { mode: 'sino', correcta: realEq ? 'si' : 'no' },
    correctaHtml: realEq ? 'Sí' : 'No', correctaTxt: realEq ? 'Sí' : 'No',
    explicacio: realEq ? `Sí: ${frac(a, b)} i ${frac(c, d)} tapen el mateix tros. Són <b>equivalents</b>.` : `No: ${frac(a, b)} i ${frac(c, d)} no tapen el mateix tros. No són equivalents.`,
    solucio: [`Comparo on acaba la part pintada de les dues barres.`, realEq ? `Acaben al mateix lloc: ${frac(a, b)} = ${frac(c, d)}.` : `No acaben al mateix lloc: ${frac(a, b)} ≠ ${frac(c, d)}.`]
  };
};
T4.pintaEquiv = (nv) => {
  const b = tria([2, 3, 4]), a = rnd(1, b - 1), k = tria(b === 4 ? [2, 3] : [2, 3, 4]), d = b * k;
  return {
    sig: `pe-${a}-${b}-${d}`,
    enunciat: `Pinta en la barra de ${d} parts el <b>mateix tros</b> que ${frac(a, b, 'mitja')}.`,
    visual: p => barraSVG({ d: b, n: a }) + (p ? `<div class="etiq-frac" style="text-align:center">Cada part d'aquesta barra són <b>${k}</b> parts de la teva.</div>` : ''),
    pista: { completa: `Cada part de la barra de ${b} equival a ${k} parts de la barra de ${d}.`, mitja: `Pinta fins al mateix lloc.` },
    resposta: { mode: 'pintar', valor: [a, b], d, unitatsInicials: 1, potAfegir: false, triaD: false },
    correctaHtml: frac(a * k, d), correctaTxt: ftxt(a * k, d), dibuixSolucio: barraSVG({ d, n: a * k }),
    explicacio: `${frac(a, b)} = ${frac(a * k, d)}: s'han de pintar ${a * k} parts de ${d}.`,
    solucio: [`Cada part de la barra de ${b} són <b>${k}</b> parts de la de ${d}.`, `${a} × ${k} = <b>${a * k}</b> parts.`, `${frac(a, b)} = ${frac(a * k, d)}.`]
  };
};
T4.completaDib = (nv) => {
  const b = tria([2, 3, 4, 5]), a = rnd(1, b - 1), k = tria([2, 3]), d = b * k;
  return {
    sig: `cd-${a}-${b}-${d}`,
    enunciat: `Completa: ${frac(a, b, 'mitja')} <span class="op">=</span> ${frac('?', d, 'mitja')}`,
    visual: p => dosBarres(a, b, p ? a * k : 0, d, p),
    pista: { completa: `Compta quantes parts de la barra de baix queden sota la part pintada de dalt.`, mitja: `Mira la barra de baix.` },
    resposta: { mode: 'numero', valor: a * k },
    correctaHtml: `<b>${a * k}</b>: ${frac(a, b)} = ${frac(a * k, d)}`, correctaTxt: String(a * k),
    explicacio: `${b} × ${k} = ${d}, així que ${a} × ${k} = <b>${a * k}</b>.`,
    solucio: [`El denominador ha passat de ${b} a ${d}: s'ha multiplicat per <b>${k}</b>.`, `Faig el mateix a dalt: ${a} × ${k} = <b>${a * k}</b>.`]
  };
};
T4.creu = (nv) => {
  const b = tria(nv >= 3 ? [3, 4, 5, 6, 7] : [2, 3, 4, 5]), a = rnd(1, b - 1), k = tria(nv >= 3 ? [3, 4, 5] : [2, 3]), eq = Math.random() < .5;
  let c = a * k, d = b * k; if (!eq) { if (Math.random() < .5) c = c + 1; else { c = a + k; d = b + k; } }
  const realEq = a * d === b * c;
  return {
    sig: `cr-${a}-${b}-${c}-${d}`,
    enunciat: `${frac(a, b, 'mitja')} i ${frac(c, d, 'mitja')} són equivalents?`,
    visual: null,
    pista: { completa: `Multiplica en creu: ${a} × ${d} i ${b} × ${c}. Si dona el mateix, són equivalents.`, mitja: `Multiplica en creu.` },
    resposta: { mode: 'sino', correcta: realEq ? 'si' : 'no' },
    correctaHtml: realEq ? 'Sí' : 'No', correctaTxt: realEq ? 'Sí' : 'No',
    explicacio: `${a} × ${d} = ${a * d} i ${b} × ${c} = ${b * c}: ${realEq ? '<b>iguals</b>, són equivalents.' : '<b>diferents</b>, no són equivalents.'}`,
    solucio: [`Multiplico en creu: ${a} × ${d} = <b>${a * d}</b>.`, `${b} × ${c} = <b>${b * c}</b>.`, realEq ? `Dona el mateix: són equivalents.` : `No dona el mateix: no són equivalents.`]
  };
};
T4.completa = (nv, { tipus = 'num' } = {}) => {
  let p, q; do { q = tria([2, 3, 4, 5, 6]); p = rnd(1, q - 1); } while (mcd(p, q) !== 1);
  let a, b, c, d, falta;
  if (tipus === 'dos') { const m = rnd(2, 4); let n2; do { n2 = rnd(2, 5); } while (n2 === m); a = p * m; b = q * m; c = p * n2; d = q * n2; falta = 'd'; }
  else { const k = rnd(2, nv >= 3 ? 5 : 4); a = p; b = q; c = p * k; d = q * k; falta = tipus === 'num' ? 'c' : 'd'; if (tipus === 'simp') { [a, b, c, d] = [c, d, a, b]; falta = 'd'; } }
  const val = falta === 'c' ? c : d;
  return {
    sig: `cp-${tipus}-${a}-${b}-${c}-${d}`,
    enunciat: `Completa: ${frac(a, b, 'mitja')} <span class="op">=</span> ${falta === 'c' ? frac('?', d, 'mitja') : frac(c, '?', 'mitja')}`,
    visual: null,
    pista: { completa: tipus === 'dos' ? `Simplifica primer ${frac(a, b)} i després amplifica.` : `Per quin número s'ha multiplicat (o dividit) el número que tens?`, mitja: `Fes el mateix a dalt i a baix.` },
    resposta: { mode: 'numero', valor: val },
    correctaHtml: `<b>${val}</b>: ${frac(a, b)} = ${frac(c, d)}`, correctaTxt: String(val),
    explicacio: tipus === 'dos' ? `${frac(a, b)} = ${frac(p, q)} = ${frac(c, d)}.` : `${frac(a, b)} = ${frac(c, d)}: dalt i baix s'han ${a < c ? 'multiplicat' : 'dividit'} pel mateix número.`,
    solucio: tipus === 'dos' ? [`Simplifico: ${frac(a, b)} = ${frac(p, q)}.`, `Per arribar a ${c} a dalt, multiplico per ${c / p}: ${q} × ${c / p} = <b>${d}</b>.`] : [`Mira el número que tens a les dues fraccions: ${falta === 'c' ? `${b} → ${d}` : `${a} → ${c}`}.`, `${a < c ? `S'ha multiplicat per ${c / a}` : `S'ha dividit entre ${a / c}`}. Faig el mateix: <b>${val}</b>.`]
  };
};
T4.escriuEquiv = (nv) => {
  let a, b; do { b = tria([2, 3, 4, 5, 6]); a = rnd(1, b - 1); } while (mcd(a, b) !== 1);
  return {
    sig: `ee-${a}-${b}`,
    enunciat: `Escriu una fracció <b>equivalent</b> a ${frac(a, b, 'mitja')} (diferent d'aquesta).`,
    visual: null,
    pista: { completa: `Multiplica el de dalt i el de baix pel mateix número, per exemple per 2.`, mitja: `Multiplica dalt i baix pel mateix número.` },
    resposta: { mode: 'fraccio', valor: [a, b], equiv: true, noIgual: true },
    correctaHtml: `${frac(a * 2, b * 2)}, ${frac(a * 3, b * 3)}…`, correctaTxt: `${a * 2}/${b * 2}`,
    explicacio: `Multiplicant dalt i baix pel mateix número: ${frac(a, b)} = ${frac(a * 2, b * 2)} = ${frac(a * 3, b * 3)}…`,
    solucio: [`Multiplico dalt i baix per 2: ${a} × 2 = ${a * 2}, ${b} × 2 = ${b * 2}.`, `${frac(a, b)} = ${frac(a * 2, b * 2)}.`]
  };
};
T4.simplifica = (nv) => {
  let p, q; do { q = rnd(2, 9); p = rnd(1, q - 1); } while (mcd(p, q) !== 1);
  const m = rnd(2, 6), a = p * m, b = q * m;
  return {
    sig: `sm-${a}-${b}`,
    enunciat: `Simplifica ${frac(a, b, 'mitja')} fins que ja no es pugui més.`,
    visual: null,
    pista: { completa: `Busca un número que divideixi el ${a} i el ${b} alhora.`, mitja: `Divideix dalt i baix pel mateix número.` },
    resposta: { mode: 'fraccio', valor: [p, q], equiv: true, irred: true },
    correctaHtml: frac(p, q), correctaTxt: ftxt(p, q),
    explicacio: `${a} i ${b} es poden dividir entre ${m}: ${frac(a, b)} = ${frac(p, q)}, i ja no es pot simplificar més.`,
    solucio: [`Busco un divisor comú de ${a} i ${b}: el <b>${m}</b>.`, `${a} : ${m} = ${p} i ${b} : ${m} = ${q}.`, `${frac(p, q)} ja no es pot simplificar.`]
  };
};
T4.intrus = (nv) => {
  let p, q; do { q = rnd(2, 6); p = rnd(1, q - 1); } while (mcd(p, q) !== 1);
  const ks = barreja([1, 2, 3, 4, 5]).slice(0, 3); const kk = rnd(2, 4);
  const intr = tria([[p + kk, q + kk], [p * kk + 1, q * kk], [p * kk, q * kk + 1]]);
  const fs = barreja([...ks.map(k => [p * k, q * k]), intr]);
  const ops = fs.map(([a, b]) => ({ html: frac(a, b, 'mitja'), val: ftxt(a, b), txt: ftxt(a, b) }));
  return {
    sig: `in-${p}-${q}-${intr.join('_')}-${ks.join('')}`,
    enunciat: `Tres d'aquestes fraccions són equivalents. Quina és l'<b>intrusa</b>?`,
    visual: null,
    pista: { completa: `Simplifica-les totes. Quina no dona ${frac(p, q)}?`, mitja: `Simplifica-les.` },
    resposta: { mode: 'opcions', opcions: ops, correcta: ftxt(...intr) },
    correctaHtml: frac(...intr), correctaTxt: ftxt(...intr),
    explicacio: `Les altres tres són iguals a ${frac(p, q)}. ${frac(...intr)} no.`,
    solucio: [`Simplifico cada fracció.`, `${ks.map(k => frac(p * k, q * k)).join(', ')} = ${frac(p, q)}.`, `L'intrusa és ${frac(...intr)}.`]
  };
};
TEMES.o4 = {
  gen: T4,
  sequencia: {
    1: [['tapenIgual'], ['pintaEquiv'], ['completaDib'], ['tapenIgual'], ['pintaEquiv'], ['completaDib'], ['tapenIgual'], ['pintaEquiv']],
    2: [['creu'], ['completa', { tipus: 'num' }], ['escriuEquiv'], ['completa', { tipus: 'den' }], ['creu'], ['escriuEquiv'], ['completa', { tipus: 'simp' }], ['creu']],
    3: [['simplifica'], ['intrus'], ['completa', { tipus: 'dos' }], ['creu'], ['simplifica'], ['intrus'], ['completa', { tipus: 'dos' }], ['simplifica']]
  },
  explicacio: [
    { text: `<p>Dues fraccions són <b class="parpelleja">equivalents</b> si valen el <b>mateix</b>: tapen el mateix tros.</p>`,
      vis: () => `<svg class="dib" viewBox="0 0 480 176" width="480">${svgBarra({ d: 2, n: 1, y0: 8, animOmple: true })}${svgBarra({ d: 4, n: 2, y0: 96, animOmple: true, retard: .6 })}</svg><div class="apareix eq" style="animation-delay:1.4s">${frac(1, 2, 'gran')}<span class="op" style="font-size:2.4rem">=</span>${frac(2, 4, 'gran')}</div>` },
    { text: `<p>${frac(1, 2)}, ${frac(2, 4)} i ${frac(4, 8)} pinten <b class="parpelleja">el mateix tros</b>.</p><p class="petit">Les parts són més petites, però n'hi ha més.</p>`,
      vis: () => `<svg class="dib" viewBox="0 0 480 250" width="480">${svgBarra({ d: 2, n: 1, y0: 6, H: 60 })}${svgBarra({ d: 4, n: 2, y0: 88, H: 60 })}${svgBarra({ d: 8, n: 4, y0: 170, H: 60, animOmple: true })}</svg>` },
    { text: `<p>Per trobar-ne una, <b class="parpelleja">multipliquem</b> dalt i baix pel <b>mateix</b> número.</p><p class="petit">Això es diu <b>amplificar</b>.</p>`,
      vis: () => `<div class="apareix">${transf(1, 2, 2, 4, '× 2')}</div><div class="apareix" style="animation-delay:.8s">${transf(2, 3, 6, 9, '× 3')}</div>` },
    { text: `<p>També podem <b class="parpelleja">dividir</b> dalt i baix pel mateix número.</p><p class="petit">Això es diu <b>simplificar</b>.</p>`,
      vis: () => `<div class="apareix">${transf(6, 8, 3, 4, ': 2')}</div>` },
    { text: `<p>Per <b>comprovar</b> si dues fraccions són equivalents, <b class="parpelleja">multipliquem en creu</b>.</p>`,
      vis: () => `<div class="eq">${frac(2, 3, 'gran')}<span class="op" style="font-size:2rem">?</span>${frac(4, 6, 'gran')}</div><div class="apareix" style="animation-delay:.5s;font-size:1.4rem;font-weight:700;text-align:center;line-height:1.8">2 × 6 = <b>12</b><br>3 × 4 = <b>12</b><br><span class="marca-ok">Iguals: són equivalents ✓</span></div>` },
    { text: `<p><b class="parpelleja">Compte!</b> Sumar el mateix número <b>no</b> funciona.</p><p class="petit">${frac(1, 2)} → sumant 1 → ${frac(2, 3)}: no tapen el mateix.</p>`,
      vis: () => `${dosBarres(1, 2, 2, 3)}<div class="marca-ko" style="font-size:1.4rem">${frac(1, 2, 'mitja')} ≠ ${frac(2, 3, 'mitja')} ✗</div>` }
  ],
  exemple: (nv) => {
    if (nv === 1) return {
      enunciat: `Pinta en una barra de 6 parts el mateix tros que ${frac(1, 3, 'mitja')}.`,
      passos: [
        { text: `Aquesta és ${frac(1, 3)}.`, vis: barraSVG({ d: 3, n: 1 }) },
        { text: `La barra de 6 parts té les parts <b>la meitat</b> de grans.`, vis: dosBarres(1, 3, 0, 6) },
        { text: `Cada part de dalt són <b>2</b> parts de baix: en pintem 2.`, vis: dosBarres(1, 3, 2, 6, true) },
        { text: `${frac(1, 3)} = ${frac(2, 6)}. <span class="marca-ok">✓</span>`, vis: dosBarres(1, 3, 2, 6) + `<div class="eq">${frac(1, 3, 'gran')}<span class="op" style="font-size:2.4rem">=</span>${frac(2, 6, 'gran')}</div>` }
      ]
    };
    if (nv === 2) return {
      enunciat: `Completa: ${frac(3, 4, 'mitja')} = ${frac('?', 12, 'mitja')}`,
      passos: [
        { text: `Mirem els denominadors: de 4 a 12.`, vis: `<div class="eq">${frac(3, 4, 'gran')}<span class="op" style="font-size:2.4rem">=</span>${frac('?', 12, 'gran')}</div>` },
        { text: `4 × <b>3</b> = 12: s'ha multiplicat per 3.`, vis: transf(3, 4, '?', 12, '× 3') },
        { text: `Fem el mateix a dalt: 3 × 3 = <b>9</b>. <span class="marca-ok">✓</span>`, vis: transf(3, 4, 9, 12, '× 3') }
      ]
    };
    return {
      enunciat: `Simplifica ${frac(12, 18, 'mitja')} fins al final.`,
      passos: [
        { text: `12 i 18 són parells: dividim entre 2.`, vis: transf(12, 18, 6, 9, ': 2') },
        { text: `6 i 9 es poden dividir entre 3.`, vis: transf(6, 9, 2, 3, ': 3') },
        { text: `2 i 3 ja no tenen cap divisor comú: ${frac(2, 3)} és el final. <span class="marca-ok">✓</span>`, vis: `<div class="eq">${frac(12, 18, 'gran')}<span class="op" style="font-size:2.4rem">=</span>${frac(2, 3, 'gran')}</div>` }
      ]
    };
  }
};
const simpTxt = (n, d) => { const g = mcd(n, d); return g > 1 ? ` = ${frac(n / g, d / g)}` : ''; };
const T5a = {};
function genSumaDib(nv, resta) {
  const d = tria([4, 5, 6, 8]); let a, b;
  if (resta) { a = rnd(2, d - 1); b = rnd(1, a - 1); } else { a = rnd(1, d - 2); b = rnd(1, d - 1 - a); }
  const r = resta ? a - b : a + b; const sg = resta ? '−' : '+';
  const vis = p => resta
    ? `${barraSVG({ d, n: a })}<div style="font-weight:800">Traiem ${b} ${b === 1 ? 'part' : 'parts'}</div>${p ? barraSVG({ d, n: a, menjades: 0, numeros: 'pintades' }) : ''}`
    : `<svg class="dib" viewBox="0 0 480 176" width="480">${svgBarra({ d, n: a, y0: 8 })}${svgBarra({ d, n: b, y0: 96 })}</svg>${p ? `<div style="font-weight:800">Ajunta-les:</div>${barraSVG({ d, n: r, numeros: 'pintades' })}` : ''}`;
  return {
    sig: `${resta ? 'rd' : 'sd'}-${a}-${b}-${d}`,
    enunciat: `Quant fa ${opFr([[a, d], [b, d]], [sg])}?`,
    visual: vis,
    pista: { completa: resta ? `Tens ${a} parts i en treus ${b}. El denominador no canvia.` : `Ajunta les parts pintades. El denominador <b>no canvia</b>.`, mitja: `El denominador no canvia.` },
    resposta: opcionsFrac(r, d, [[r, 2 * d], resta ? [r, 0] : [a + b, d + d], [r + 1, d], [a * b, d]]),
    correctaHtml: frac(r, d), correctaTxt: ftxt(r, d),
    explicacio: `${a} ${sg} ${b} = ${r}, i el denominador es queda ${d}: ${frac(r, d)}.`,
    solucio: [`Tenen el mateix denominador (${d}): les parts són iguals.`, `${resta ? 'Resto' : 'Sumo'} els numeradors: ${a} ${sg} ${b} = <b>${r}</b>.`, `El denominador no canvia: ${frac(r, d)}.`]
  };
}
T5a.sumaDibTria = nv => genSumaDib(nv, false);
T5a.restaDibTria = nv => genSumaDib(nv, true);
T5a.suma = (nv, { resta = false } = {}) => {
  const d = tria(nv >= 3 ? [6, 8, 9, 10, 12] : [3, 4, 5, 6, 7, 8]); let a, b;
  if (resta) { a = rnd(2, d + 2); b = rnd(1, a - 1); } else { a = rnd(1, d - 1); b = rnd(1, d - 1); }
  const r = resta ? a - b : a + b; const sg = resta ? '−' : '+'; const irred = nv >= 3 && mcd(r, d) > 1 && r % d !== 0;
  return {
    sig: `${resta ? 'r' : 's'}-${a}-${b}-${d}`,
    enunciat: `Calcula ${opFr([[a, d], [b, d]], [sg])}${irred ? ' i simplifica el resultat.' : ''}`,
    visual: null,
    pista: { completa: `${resta ? 'Resta' : 'Suma'} els de dalt. El de baix es queda igual.`, mitja: `El denominador no canvia.` },
    resposta: { mode: 'fraccio', valor: [r, d], equiv: true, irred },
    correctaHtml: frac(r, d) + simpTxt(r, d), correctaTxt: ftxt(r, d),
    explicacio: `${a} ${sg} ${b} = ${r}: ${frac(r, d)}${simpTxt(r, d)}.`,
    solucio: [`Mateix denominador: ${resta ? 'resto' : 'sumo'} els numeradors: ${a} ${sg} ${b} = <b>${r}</b>.`, `${frac(r, d)}${simpTxt(r, d)}.`]
  };
};
T5a.sumaMixt = (nv) => {
  const d = tria(nv >= 3 ? [5, 6, 7, 8] : [3, 4, 5]); let a, b; do { a = rnd(1, d - 1); b = rnd(1, d - 1); } while (a + b <= d || (a + b) % d === 0);
  const r = a + b, e = Math.floor(r / d), m = r % d;
  return {
    sig: `sx-${a}-${b}-${d}`,
    enunciat: `Calcula ${opFr([[a, d], [b, d]], ['+'])} i escriu el resultat com a <b>nombre mixt</b>.`,
    visual: nv < 3 ? (p => unitatsSVG({ d, n: r, numeros: p })) : null,
    pista: { completa: `Primer suma: ${frac(r, d)}. Després divideix ${r} entre ${d}.`, mitja: `Suma i després passa-ho a mixt.` },
    resposta: { mode: 'mixt', valor: [r, d] },
    correctaHtml: `${frac(r, d)} = ${mix(e, m, d)}`, correctaTxt: mixTxt(e, m, d),
    explicacio: `${a} + ${b} = ${r}: ${frac(r, d)}. ${r} : ${d} = ${e} i sobren ${m}: ${mix(e, m, d)}.`,
    solucio: [`Sumo els numeradors: ${a} + ${b} = <b>${r}</b> → ${frac(r, d)}.`, `${r} : ${d} = ${e} i sobren ${m}.`, `Resultat: ${mix(e, m, d)}.`]
  };
};
T5a.erroni = (nv) => {
  const d = tria([3, 4, 5, 6, 7]); const a = rnd(1, d - 2), b = rnd(1, d - 1 - a); const be = Math.random() < .4; const qui = tria(NOMS);
  const [rn, rd] = be ? [a + b, d] : [a + b, 2 * d];
  return {
    sig: `er-${a}-${b}-${d}-${be ? 1 : 0}`,
    enunciat: `${qui} diu que ${opFr([[a, d], [b, d], [rn, rd]], ['+', '='])}. Té raó?`,
    visual: null,
    pista: { completa: `Quan el denominador és el mateix, se suma <b>només</b> el de dalt.`, mitja: `Què passa amb el denominador?` },
    resposta: { mode: 'sino', correcta: be ? 'si' : 'no' },
    correctaHtml: be ? 'Sí' : `No, fa ${frac(a + b, d)}`, correctaTxt: be ? 'Sí' : 'No',
    explicacio: be ? `Sí: se sumen els numeradors i el denominador es queda igual.` : `No: ha sumat també els denominadors. El resultat és ${frac(a + b, d)}.`,
    solucio: [`Els denominadors no se sumen.`, `${a} + ${b} = ${a + b}: ${frac(a + b, d)}.`, be ? `Té raó.` : `No té raó.`]
  };
};
T5a.tresTermes = (nv) => {
  let d, a, b, c, r, sg;
  do { d = tria([6, 8, 9, 10, 12]); a = rnd(1, d - 1); b = rnd(1, d - 1); c = rnd(1, d - 1); sg = tria([['+', '−'], ['−', '+'], ['+', '+']]); r = a + (sg[0] === '+' ? b : -b) + (sg[1] === '+' ? c : -c); } while (r <= 0 || (sg[0] === '−' && a - b <= 0) || r % d === 0);
  const g = mcd(r, d);
  return {
    sig: `tt-${a}-${b}-${c}-${d}-${sg.join('')}`,
    enunciat: `Calcula ${opFr([[a, d], [b, d], [c, d]], sg)} i simplifica el resultat si es pot.`,
    visual: null,
    pista: { completa: `Opera els numeradors d'esquerra a dreta. El denominador no canvia.`, mitja: `Només els de dalt.` },
    resposta: { mode: 'fraccio', valor: [r, d], equiv: true, irred: g > 1 },
    correctaHtml: frac(r, d) + simpTxt(r, d), correctaTxt: ftxt(r / g, d / g),
    explicacio: `${a} ${sg[0]} ${b} ${sg[1]} ${c} = ${r}: ${frac(r, d)}${simpTxt(r, d)}.`,
    solucio: [`Opero els numeradors: ${a} ${sg[0]} ${b} ${sg[1]} ${c} = <b>${r}</b>.`, `${frac(r, d)}${g > 1 ? ` i simplifico entre ${g}: ${frac(r / g, d / g)}` : ' (no es pot simplificar)'}.`]
  };
};
T5a.problema = (nv) => {
  let d, a, b, r; do { d = tria([6, 8, 9, 10, 12]); a = rnd(1, d - 2); b = rnd(1, d - 1 - a); r = a + b; } while (mcd(r, d) === 1);
  const g = mcd(r, d);
  const ctx = tria([[`Ahir vas llegir ${frac(a, d)} d'un llibre i avui ${frac(b, d)}. Quina part del llibre has llegit?`, 'llibre'], [`D'una pizza, en Nil se'n menja ${frac(a, d)} i la Júlia ${frac(b, d)}. Quina part de la pizza s'han menjat?`, 'pizza']]);
  return {
    sig: `pb-${ctx[1]}-${a}-${b}-${d}`,
    enunciat: `${ctx[0]} Simplifica el resultat.`,
    visual: null,
    pista: { completa: `Suma les dues fraccions i simplifica.`, mitja: `Suma.` },
    resposta: { mode: 'fraccio', valor: [r, d], equiv: true, irred: true },
    correctaHtml: frac(r, d) + simpTxt(r, d), correctaTxt: ftxt(r / g, d / g),
    explicacio: `${frac(a, d)} + ${frac(b, d)} = ${frac(r, d)} = ${frac(r / g, d / g)}.`,
    solucio: [`Sumo: ${a} + ${b} = ${r} → ${frac(r, d)}.`, `Simplifico entre ${g}: ${frac(r / g, d / g)}.`]
  };
};
TEMES.o5a = {
  gen: T5a,
  sequencia: {
    1: [['sumaDibTria'], ['sumaDibTria'], ['restaDibTria'], ['sumaDibTria'], ['restaDibTria'], ['sumaDibTria'], ['restaDibTria'], ['sumaDibTria']],
    2: [['suma'], ['suma', { resta: true }], ['sumaMixt'], ['erroni'], ['suma'], ['suma', { resta: true }], ['sumaMixt'], ['erroni']],
    3: [['tresTermes'], ['problema'], ['suma', { resta: true }], ['sumaMixt'], ['tresTermes'], ['problema'], ['suma'], ['tresTermes']]
  },
  explicacio: [
    { text: `<p>Quan dues fraccions tenen el <b class="parpelleja">mateix denominador</b>, les parts són de la mateixa mida.</p>`,
      vis: () => `<svg class="dib" viewBox="0 0 480 176" width="480">${svgBarra({ d: 5, n: 2, y0: 8 })}${svgBarra({ d: 5, n: 1, y0: 96 })}</svg><div class="eq">${frac(2, 5, 'mitja')}<span class="op">+</span>${frac(1, 5, 'mitja')}</div>` },
    { text: `<p>Per sumar, <b class="parpelleja">ajuntem</b> les parts pintades: 2 + 1 = 3.</p>`,
      vis: () => barraSVG({ d: 5, n: 3, numeros: 'pintades', animOmple: true, retard: .2 }) },
    { text: `<p>Sumem els <b>numeradors</b>.</p><p>El denominador <b class="parpelleja">no canvia</b>.</p>`,
      vis: () => `<div class="eq" style="font-size:1.6rem">${frac(2, 5, 'mitja')}<span class="op">+</span>${frac(1, 5, 'mitja')}<span class="op">=</span>${frac(3, 5, 'gran')}</div>` },
    { text: `<p><b class="parpelleja">Compte!</b> Els denominadors <b>no</b> se sumen.</p>`,
      vis: () => `<div class="eq marca-ko" style="font-size:1.6rem">${frac(2, 5, 'mitja')}<span class="op">+</span>${frac(1, 5, 'mitja')}<span class="op">≠</span>${frac(3, 10, 'mitja')}<span class="op">✗</span></div>` },
    { text: `<p>Per restar, <b class="parpelleja">traiem</b> parts.</p><p class="petit">${frac(4, 6)} − ${frac(1, 6)} = ${frac(3, 6)}</p>`,
      vis: () => barraSVG({ d: 6, n: 4 }) + `<div class="apareix" style="animation-delay:.6s">${barraSVG({ d: 6, n: 3 })}</div><div class="eq">${frac(4, 6, 'mitja')}<span class="op">−</span>${frac(1, 6, 'mitja')}<span class="op">=</span>${frac(3, 6, 'mitja')}</div>` },
    { text: `<p>Si el resultat passa d'1, el podem escriure com a <b class="parpelleja">nombre mixt</b>.</p><p class="petit">${frac(3, 4)} + ${frac(2, 4)} = ${frac(5, 4)} = ${mix(1, 1, 4)}</p>`,
      vis: () => unitatsSVG({ d: 4, n: 5, numeros: true, animOmple: true }) }
  ],
  exemple: (nv) => {
    if (nv === 1) return {
      enunciat: `Quant fa ${opFr([[2, 6], [3, 6]], ['+'])}?`,
      passos: [
        { text: `Les dues fraccions tenen parts de sisè.`, vis: `<svg class="dib" viewBox="0 0 480 176" width="480">${svgBarra({ d: 6, n: 2, y0: 8 })}${svgBarra({ d: 6, n: 3, y0: 96 })}</svg>` },
        { text: `Ajuntem les parts: 2 + 3 = <b>5</b>.`, vis: barraSVG({ d: 6, n: 5, numeros: 'pintades', animOmple: true }) },
        { text: `El denominador no canvia: ${frac(5, 6)}. <span class="marca-ok">✓</span>`, vis: `<div class="eq" style="font-size:1.5rem">${opFr([[2, 6], [3, 6], [5, 6]], ['+', '='])}</div>` }
      ]
    };
    if (nv === 2) return {
      enunciat: `Calcula ${opFr([[3, 4], [3, 4]], ['+'])} i escriu-ho com a mixt.`,
      passos: [
        { text: `Sumem els numeradors: 3 + 3 = <b>6</b>. → ${frac(6, 4)}`, vis: unitatsSVG({ d: 4, n: 6, numeros: true, animOmple: true }) },
        { text: `6 : 4 = 1 i sobren 2.`, vis: divisioHtml(6, 4, 1, 2) },
        { text: `${frac(6, 4)} = ${mix(1, 2, 4)}. <span class="marca-ok">✓</span>`, vis: `<div class="eq">${frac(6, 4, 'gran')}<span class="op" style="font-size:2.4rem">=</span>${mix(1, 2, 4, 'gran')}</div>` }
      ]
    };
    return {
      enunciat: `Calcula ${opFr([[5, 12], [4, 12], [3, 12]], ['+', '−'])} i simplifica.`,
      passos: [
        { text: `Operem els numeradors: 5 + 4 − 3 = <b>6</b>.`, vis: `<div class="eq" style="font-size:1.4rem">${opFr([[5, 12], [4, 12], [3, 12], [6, 12]], ['+', '−', '='])}</div>` },
        { text: `Simplifiquem: 6 i 12 es divideixen entre 6.`, vis: transf(6, 12, 1, 2, ': 6') },
        { text: `Resultat: ${frac(1, 2)}. <span class="marca-ok">✓</span>`, vis: `<div>${frac(1, 2, 'gran')}</div>` }
      ]
    };
  }
};
const T5b = {};
const cadenaResp = (a, d1, b, d2, sg, r, L, o = {}) => ({ mode: 'cadena', a, d1, b, d2, sg, valor: [r, L], irred: !!o.irred, pasAPas: !!o.pasAPas, taules: { a: d1, b: d2, mode: o.taules || 'toca', mcm: L } });
const cadenaHtml = (a, d1, b, d2, sg, L, r) => `${frac(a * L / d1, L)} ${sg} ${frac(b * L / d2, L)} = ${frac(r, L)}${simpTxt(r, L)}`;
const cadenaTxt = (a, d1, b, d2, sg, L, r) => { const g = mcd(r, L); return `${a * L / d1}/${L} ${sg} ${b * L / d2}/${L} = ${r}/${L}${g > 1 ? ` = ${r / g}/${L / g}` : ''}`; };
T5b.multiple = (nv, { resta = false } = {}) => {
  let d1, k, d2, a, b, r;
  do { d1 = tria([2, 3, 4, 5]); k = tria([2, 3]); d2 = d1 * k; a = rnd(1, d1 - 1); b = rnd(1, d2 - 1); r = resta ? a * k - b : a * k + b; } while (d2 > 12 || r <= 0 || r >= d2);
  const sg = resta ? '−' : '+';
  return {
    sig: `ml-${a}-${d1}-${b}-${d2}-${resta ? 1 : 0}`,
    enunciat: `Quant fa ${opFr([[a, d1], [b, d2]], [sg])}?`,
    visual: p => `<svg class="dib" viewBox="0 0 480 176" width="480">${p ? barraSub(d1, k, a) : svgBarra({ d: d1, n: a, y0: 8, H: 70 })}${svgBarra({ d: d2, n: b, y0: 96, H: 70 })}</svg>${p ? `<div style="font-weight:700">${frac(a, d1)} = ${frac(a * k, d2)}</div>` : ''}`,
    pista: { completa: `Busca a les taules un número que surti a les dues. Fixa't en les línies discontínues: ${frac(a, d1)} es pot partir en trossos més petits.`, mitja: `Primer, el mateix denominador a les dues fraccions.` },
    resposta: cadenaResp(a, d1, b, d2, sg, r, d2, { pasAPas: true }),
    correctaHtml: cadenaHtml(a, d1, b, d2, sg, d2, r), correctaTxt: cadenaTxt(a, d1, b, d2, sg, d2, r),
    explicacio: `Denominador comú: <b>${d2}</b>. ${frac(a, d1)} = ${frac(a * k, d2)}.`,
    solucio: [`El denominador comú és <b>${d2}</b> (surt a les dues taules).`, `${frac(a, d1)} = ${frac(a * k, d2)} (× ${k} dalt i baix).`, `${frac(a * k, d2)} ${sg} ${frac(b, d2)} = ${frac(r, d2)}.`]
  };
};
const PARELLES = { 2: [[2, 3], [3, 4], [2, 5], [4, 6], [3, 5], [4, 5], [2, 7], [3, 2], [6, 4], [5, 3]], 3: [[4, 6], [6, 8], [6, 9], [4, 10], [8, 12], [9, 12], [6, 10], [10, 4], [8, 6], [12, 9]] };
T5b.general = (nv, { resta = false } = {}) => {
  let d1, d2, a, b, L, r;
  do { [d1, d2] = tria(PARELLES[nv >= 3 ? 3 : 2]); a = rnd(1, d1 - 1); b = rnd(1, d2 - 1); L = mcm(d1, d2); r = resta ? a * L / d1 - b * L / d2 : a * L / d1 + b * L / d2; } while (r <= 0 || r % L === 0);
  const sg = resta ? '−' : '+'; const irred = nv >= 3 && mcd(r, L) > 1;
  return {
    sig: `gn-${a}-${d1}-${b}-${d2}-${resta ? 1 : 0}`,
    enunciat: `Calcula ${opFr([[a, d1], [b, d2]], [sg])}${irred ? ' i simplifica el resultat.' : '.'}`,
    visual: null,
    pista: { completa: `Busca a les taules un número que surti a les dues. Passa-hi les dues fraccions i després ${resta ? 'resta' : 'suma'}.`, mitja: `Busca el denominador comú.` },
    resposta: cadenaResp(a, d1, b, d2, sg, r, L, { irred, taules: nv >= 3 ? 'amagat' : 'toca' }),
    correctaHtml: cadenaHtml(a, d1, b, d2, sg, L, r), correctaTxt: cadenaTxt(a, d1, b, d2, sg, L, r),
    explicacio: `Denominador comú: <b>${L}</b>.`,
    solucio: [`Denominador comú (el primer número de les dues taules): <b>${L}</b>.`, `${frac(a, d1)} = ${frac(a * L / d1, L)} i ${frac(b, d2)} = ${frac(b * L / d2, L)}.`, `${a * L / d1} ${sg} ${b * L / d2} = ${r}: ${frac(r, L)}${simpTxt(r, L)}.`]
  };
};
T5b.erroni = (nv) => {
  const [d1, d2] = tria(PARELLES[2]); const a = rnd(1, d1 - 1), b = rnd(1, d2 - 1), L = mcm(d1, d2), r = a * L / d1 + b * L / d2; const be = Math.random() < .4; const qui = tria(NOMS);
  const [rn, rd] = be ? [r, L] : [a + b, d1 + d2];
  return {
    sig: `eb-${a}-${d1}-${b}-${d2}-${be ? 1 : 0}`,
    enunciat: `${qui} diu que ${opFr([[a, d1], [b, d2], [rn, rd]], ['+', '='])}. Té raó?`,
    visual: null,
    pista: { completa: `Amb denominadors diferents, abans s'han de passar al mateix denominador.`, mitja: `Es poden sumar així directament?` },
    resposta: { mode: 'sino', correcta: be ? 'si' : 'no', taules: { a: d1, b: d2, mode: 'toca', mcm: L } },
    correctaHtml: be ? 'Sí' : `No, fa ${frac(r, L)}`, correctaTxt: be ? 'Sí' : 'No',
    explicacio: be ? `Sí: ${frac(a, d1)} = ${frac(a * L / d1, L)}, ${frac(b, d2)} = ${frac(b * L / d2, L)} i la suma és ${frac(r, L)}.` : `No: no es poden sumar els de dalt i els de baix. Cal el denominador comú (${L}): el resultat és ${frac(r, L)}.`,
    solucio: [`Denominador comú: ${L}.`, `${frac(a * L / d1, L)} + ${frac(b * L / d2, L)} = ${frac(r, L)}.`, be ? 'Té raó.' : 'No té raó.']
  };
};
T5b.problema = (nv) => {
  let d1, d2, a, b, L, r; do { [d1, d2] = tria(PARELLES[2].concat(PARELLES[3])); a = rnd(1, d1 - 1); b = rnd(1, d2 - 1); L = mcm(d1, d2); r = a * L / d1 + b * L / d2; } while (r >= L || mcd(r, L) === 1 && Math.random() < .5);
  const g = mcd(r, L);
  const ctx = tria([`Al matí camines ${frac(a, d1)} del camí i a la tarda ${frac(b, d2)}. Quina part del camí has fet?`, `Omples ${frac(a, d1)} d'una ampolla i després hi afegeixes ${frac(b, d2)} més. Quina part de l'ampolla està plena?`]);
  return {
    sig: `pr-${a}-${d1}-${b}-${d2}-${ctx.slice(0, 5)}`,
    enunciat: `${ctx}${g > 1 ? ' Simplifica el resultat.' : ''}`,
    visual: null,
    pista: { completa: `Suma les dues fraccions buscant el denominador comú.`, mitja: `Suma.` },
    resposta: cadenaResp(a, d1, b, d2, '+', r, L, { irred: g > 1, taules: 'amagat' }),
    correctaHtml: cadenaHtml(a, d1, b, d2, '+', L, r), correctaTxt: cadenaTxt(a, d1, b, d2, '+', L, r),
    explicacio: `Denominador comú: <b>${L}</b>.`,
    solucio: [`Denominador comú: ${L}.`, `${frac(a * L / d1, L)} + ${frac(b * L / d2, L)} = ${frac(r, L)}${simpTxt(r, L)}.`]
  };
};
TEMES.o5b = {
  gen: T5b,
  sequencia: {
    1: [['multiple'], ['multiple'], ['multiple', { resta: true }], ['multiple'], ['multiple', { resta: true }], ['multiple'], ['multiple', { resta: true }], ['multiple']],
    2: [['general'], ['general', { resta: true }], ['erroni'], ['general'], ['general'], ['general', { resta: true }], ['erroni'], ['general']],
    3: [['general'], ['problema'], ['general', { resta: true }], ['erroni'], ['general'], ['problema'], ['general', { resta: true }], ['general']]
  },
  explicacio: [
    { text: `<p>${frac(1, 2)} i ${frac(1, 3)} tenen parts de <b class="parpelleja">mida diferent</b>.</p><p class="petit">Així no es poden sumar directament.</p>`,
      vis: () => `<svg class="dib" viewBox="0 0 480 176" width="480">${svgBarra({ d: 2, n: 1, y0: 8, H: 70 })}${svgBarra({ d: 3, n: 1, y0: 96, H: 70 })}</svg>` },
    { text: `<p>Busquem un <b class="parpelleja">denominador comú</b> amb les <b>taules de multiplicar</b>.</p><p class="petit">El primer número que surt a les dues: <b>6</b>.</p>`,
      vis: () => taulesDemo(2, 3, 6, true) },
    { text: `<p>Passem les dues fraccions a <b class="parpelleja">sisens</b>.</p><p class="petit">${frac(1, 2)} = ${frac(3, 6)} i ${frac(1, 3)} = ${frac(2, 6)}</p>`,
      vis: () => `<svg class="dib" viewBox="0 0 480 176" width="480">${barraSub(2, 3, 1)}${barraSub(3, 2, 1, { y0: 96 })}</svg>` },
    { text: `<p>Ara les parts són <b>iguals</b>: ja podem sumar.</p><p class="petit">${frac(3, 6)} + ${frac(2, 6)} = ${frac(5, 6)}</p>`,
      vis: () => barraSVG({ d: 6, n: 5, numeros: 'pintades', animOmple: true }) + `<div class="eq" style="font-size:1.4rem">${opFr([[1, 2], [1, 3], [5, 6]], ['+', '='])}</div>` },
    { text: `<p>Per <b class="parpelleja">restar</b>, igual: primer el denominador comú.</p><p class="petit">${frac(1, 2)} − ${frac(1, 3)} = ${frac(3, 6)} − ${frac(2, 6)} = ${frac(1, 6)}</p>`,
      vis: () => `<div class="eq" style="font-size:1.4rem">${opFr([[3, 6], [2, 6], [1, 6]], ['−', '='])}</div>` }
  ],
  exemple: (nv) => {
    if (nv === 1) return {
      enunciat: `Quant fa ${opFr([[1, 2], [1, 4]], ['+'])}?`,
      passos: [
        { text: `Mirem les taules: el <b>4</b> surt a les dues.`, vis: taulesDemo(2, 4, 4, true) },
        { text: `${frac(1, 2)} = ${frac(2, 4)}: la meitat són dos quarts.`, vis: `<svg class="dib" viewBox="0 0 480 176" width="480">${barraSub(2, 2, 1)}${svgBarra({ d: 4, n: 1, y0: 96, H: 70 })}</svg>` },
        { text: `${frac(2, 4)} + ${frac(1, 4)} = ${frac(3, 4)}. <span class="marca-ok">✓</span>`, vis: barraSVG({ d: 4, n: 3, numeros: 'pintades', animOmple: true }) }
      ]
    };
    const [a, d1, b, d2, sg] = nv === 2 ? [2, 3, 1, 4, '+'] : [5, 6, 3, 8, '−']; const L = mcm(d1, d2); const r = sg === '+' ? a * L / d1 + b * L / d2 : a * L / d1 - b * L / d2;
    return {
      enunciat: `Calcula ${opFr([[a, d1], [b, d2]], [sg])}.`,
      passos: [
        { text: `Busquem a les taules el primer número comú: <b>${L}</b>.`, vis: taulesDemo(d1, d2, L, true) },
        { text: `${frac(a, d1)} = ${frac(a * L / d1, L)} (× ${L / d1}) i ${frac(b, d2)} = ${frac(b * L / d2, L)} (× ${L / d2}).`, vis: `<div>${transf(a, d1, a * L / d1, L, '× ' + L / d1)}</div><div>${transf(b, d2, b * L / d2, L, '× ' + L / d2)}</div>` },
        { text: `${frac(a * L / d1, L)} ${sg} ${frac(b * L / d2, L)} = ${frac(r, L)}${simpTxt(r, L)}. <span class="marca-ok">✓</span>`, vis: `<div class="eq" style="font-size:1.4rem">${opFr([[a * L / d1, L], [b * L / d2, L], [r, L]], [sg, '='])}</div>` }
      ]
    };
  }
};
function opSVG(a, b, c, d, tipus, res = false) {
  const id = 'fl' + (++idFl), creu = tipus === 'div';
  const t = (x, y, v, col = '#1b1b1b') => `<text x="${x}" y="${y}" text-anchor="middle" font-size="36" font-weight="800" fill="${col}" font-family="system-ui,sans-serif">${v}</text>`;
  let s = `<defs><marker id="${id}" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" refX="12" refY="7" orient="auto"><path d="M0 0 L14 7 L0 14 Z" fill="${T}"/></marker><marker id="${id}n" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" refX="12" refY="7" orient="auto"><path d="M0 0 L14 7 L0 14 Z" fill="#1b1b1b"/></marker></defs>`;
  s += t(60, 56, a) + t(60, 122, b) + `<line x1="38" y1="74" x2="82" y2="74" stroke="#1b1b1b" stroke-width="4"/>`;
  const signe = t(150, 92, creu ? ':' : '×').replace('<text ', '<text stroke="#fff" stroke-width="10" paint-order="stroke" ');
  s += t(240, 56, c) + t(240, 122, d) + `<line x1="218" y1="74" x2="262" y2="74" stroke="#1b1b1b" stroke-width="4"/>`;
  if (creu) s += `<line x1="84" y1="50" x2="214" y2="110" stroke="${T}" stroke-width="3.5" marker-end="url(#${id})"/><line x1="84" y1="112" x2="214" y2="52" stroke="#1b1b1b" stroke-width="3.5" stroke-dasharray="7 5" marker-end="url(#${id}n)"/>`;
  else s += `<line x1="86" y1="44" x2="212" y2="44" stroke="${T}" stroke-width="3.5" marker-end="url(#${id})"/><line x1="86" y1="128" x2="212" y2="128" stroke="#1b1b1b" stroke-width="3.5" stroke-dasharray="7 5" marker-end="url(#${id}n)"/>`;
  s += signe;
  if (res) {
    const [nn, dd] = creu ? [`${a}×${d}`, `${b}×${c}`] : [`${a}×${c}`, `${b}×${d}`];
    s += t(306, 88, '=') + `<text x="400" y="56" text-anchor="middle" font-size="30" font-weight="800" fill="${T}">${nn}</text><text x="400" y="124" text-anchor="middle" font-size="30" font-weight="800">${dd}</text><line x1="350" y1="74" x2="450" y2="74" stroke="#1b1b1b" stroke-width="4"/>`;
  }
  return `<svg class="dib" viewBox="0 0 ${res ? 470 : 300} 150" width="${res ? 470 : 300}">${s}</svg>`;
}
const T6 = {};
T6.perEnter = (nv) => {
  const n = rnd(2, 4), b = tria([3, 4, 5, 6]), a = rnd(1, b - 1), r = n * a;
  return {
    sig: `pe6-${n}-${a}-${b}`,
    enunciat: `Quant fa <b style="font-size:1.4em">${n}</b> <span class="op">×</span> ${frac(a, b, 'mitja')}?`,
    visual: p => p ? unitatsSVG({ d: b, n: r, numeros: true }) : `<svg class="dib" viewBox="0 0 480 ${n * 64 + 4}" width="480">${Array.from({ length: n }, (_, i) => svgBarra({ d: b, n: a, y0: 4 + i * 64, H: 52 })).join('')}</svg>`,
    pista: { completa: `És sumar ${frac(a, b)} ${n} vegades: ajunta totes les parts pintades. El denominador no canvia.`, mitja: `És una suma repetida.` },
    resposta: opcionsFrac(r, b, [[r, n * b], [a, n * b], [a + n, b], [r + 1, b]]),
    correctaHtml: frac(r, b), correctaTxt: ftxt(r, b),
    explicacio: `${n} × ${frac(a, b)} = ${Array(n).fill(frac(a, b)).join(' + ')} = ${frac(r, b)}.`,
    solucio: [`És sumar ${frac(a, b)} ${n} vegades.`, `Multiplico només el de dalt: ${n} × ${a} = <b>${r}</b>.`, `El denominador no canvia: ${frac(r, b)}.`]
  };
};
const NOMS_PART = { 2: 'meitats', 3: 'terços', 4: 'quarts' };
T6.quantesCaben = (nv) => {
  const k = tria([2, 3, 4]), w = rnd(1, 4), r = w * k;
  const vals = [...new Set([r, w + k === r ? r + 1 : w + k, w, r - 1 > 0 && r - 1 !== w ? r - 1 : r + 2])].slice(0, 3);
  return {
    sig: `qc-${k}-${w}`,
    enunciat: `Quants <b>${NOMS_PART[k]}</b> caben en <b>${w}</b> ${w === 1 ? 'unitat' : 'unitats'}? <span style="color:var(--gris);font-size:.85em">(${w} : ${frac(1, k)})</span>`,
    visual: p => `<svg class="dib" viewBox="0 0 480 ${w * 64 + 4}" width="480">${Array.from({ length: w }, (_, i) => svgBarra({ d: k, n: 0, y0: 4 + i * 64, H: 52, numeros: p ? 'totes' : null, numInici: i * k + 1 })).join('')}</svg>`,
    pista: { completa: `Cada unitat té ${k} ${NOMS_PART[k]}. Compta'ls tots.`, mitja: `Compta les parts de totes les unitats.` },
    resposta: { mode: 'opcions', opcions: barreja(vals).map(v => ({ html: `<span style="font-size:1.4em">${v}</span>`, val: String(v), txt: String(v) })), correcta: String(r) },
    correctaHtml: `<b>${r}</b>`, correctaTxt: String(r),
    explicacio: `Cada unitat té ${k} ${NOMS_PART[k]}: ${w} × ${k} = ${r}. Per tant, ${w} : ${frac(1, k)} = ${r}.`,
    solucio: [`Cada unitat es divideix en ${k} ${NOMS_PART[k]}.`, `${w} unitats × ${k} = <b>${r}</b> ${NOMS_PART[k]}.`]
  };
};
function genOp(nv, tipus, { simp = false } = {}) {
  let a, b, c, d, rn, rd;
  do {
    b = rnd(2, simp ? 9 : 7); d = rnd(2, simp ? 9 : 7); a = rnd(1, b + (simp ? 3 : 1)); c = rnd(1, d + (simp ? 3 : 1));
    [rn, rd] = tipus === 'mult' ? [a * c, b * d] : [a * d, b * c];
  } while (rd === 0 || (simp ? mcd(rn, rd) === 1 || rn % rd === 0 : rn % rd === 0) || mcd(a, b) > 1 || mcd(c, d) > 1);
  const g = mcd(rn, rd), sg = tipus === 'mult' ? '×' : ':';
  return {
    sig: `${tipus}-${a}-${b}-${c}-${d}`,
    enunciat: `Calcula ${opFr([[a, b], [c, d]], [sg])}${simp ? ' i simplifica el resultat.' : '.'}`,
    visual: p => p ? opSVG(a, b, c, d, tipus, true) : null,
    pista: { completa: tipus === 'mult' ? `Dalt per dalt (${a} × ${c}) i baix per baix (${b} × ${d}).` : `Multiplica en creu: ${a} × ${d} a dalt i ${b} × ${c} a baix.`, mitja: tipus === 'mult' ? 'Dalt per dalt, baix per baix.' : 'En creu!' },
    resposta: { mode: 'fraccio', valor: [rn, rd], equiv: true, irred: simp },
    correctaHtml: frac(rn, rd) + simpTxt(rn, rd), correctaTxt: ftxt(rn / (simp ? g : 1), rd / (simp ? g : 1)),
    explicacio: tipus === 'mult' ? `${a} × ${c} = ${rn} i ${b} × ${d} = ${rd}: ${frac(rn, rd)}${simpTxt(rn, rd)}.` : `En creu: ${a} × ${d} = ${rn} a dalt i ${b} × ${c} = ${rd} a baix: ${frac(rn, rd)}${simpTxt(rn, rd)}.`,
    solucio: [tipus === 'mult' ? `És una multiplicació: dalt per dalt i baix per baix.` : `És una divisió: multiplico <b>en creu</b>.`, tipus === 'mult' ? `${a} × ${c} = <b>${rn}</b>; ${b} × ${d} = <b>${rd}</b>.` : `Dalt: ${a} × ${d} = <b>${rn}</b>. Baix: ${b} × ${c} = <b>${rd}</b>.`, `${frac(rn, rd)}${g > 1 ? ` i simplifico: ${frac(rn / g, rd / g)}` : ''}.`]
  };
}
T6.mult = nv => genOp(nv, 'mult');
T6.div = nv => genOp(nv, 'div');
T6.multSimp = nv => genOp(nv, 'mult', { simp: true });
T6.divSimp = nv => genOp(nv, 'div', { simp: true });
T6.ambMixt = (nv) => {
  let e, r, d, c, f, tipus, n, rn, rd;
  do { d = rnd(2, 5); e = rnd(1, 3); r = rnd(1, d - 1); f = rnd(2, 6); c = rnd(1, f + 1); tipus = tria(['mult', 'div']); n = e * d + r; [rn, rd] = tipus === 'mult' ? [n * c, d * f] : [n * f, d * c]; } while (mcd(c, f) > 1 || rn % rd === 0);
  const g = mcd(rn, rd), sg = tipus === 'mult' ? '×' : ':';
  return {
    sig: `mx6-${e}-${r}-${d}-${c}-${f}-${tipus}`,
    enunciat: `Calcula ${mix(e, r, d, 'mitja')} <span class="op">${sg}</span> ${frac(c, f, 'mitja')}. Dona el resultat com a fracció${g > 1 ? ' simplificada' : ''}.`,
    visual: null,
    pista: { completa: `Primer passa ${mix(e, r, d)} a fracció: ${e} × ${d} + ${r}.`, mitja: `Passa el mixt a fracció.` },
    resposta: { mode: 'fraccio', valor: [rn, rd], equiv: true, irred: g > 1 },
    correctaHtml: frac(rn, rd) + simpTxt(rn, rd), correctaTxt: ftxt(rn / g, rd / g),
    explicacio: `${mix(e, r, d)} = ${frac(n, d)}. ${frac(n, d)} ${sg} ${frac(c, f)} = ${frac(rn, rd)}${simpTxt(rn, rd)}.`,
    solucio: [`Passo el mixt a fracció: ${e} × ${d} + ${r} = ${n} → ${frac(n, d)}.`, tipus === 'mult' ? `Multiplico: ${n} × ${c} = ${rn}, ${d} × ${f} = ${rd}.` : `Divideixo en creu: ${n} × ${f} = ${rn}, ${d} × ${c} = ${rd}.`, `${frac(rn, rd)}${g > 1 ? ` = ${frac(rn / g, rd / g)}` : ''}.`]
  };
};
T6.problema = (nv) => {
  if (Math.random() < .5) {
    const b = tria([2, 3, 4]), a = rnd(1, b - 1) || 1, m = tria([2, 3]), c = b * m, gots = a * m;
    return {
      sig: `pg6-${a}-${b}-${c}`,
      enunciat: `Tens ${frac(a, b, 'mitja')} de litre de suc i omples gots de ${frac(1, c, 'mitja')} de litre. Quants gots omples?`,
      visual: null,
      pista: { completa: `Has de fer ${frac(a, b)} : ${frac(1, c)}.`, mitja: `És una divisió.` },
      resposta: { mode: 'numero', valor: gots, unitat: 'gots' },
      correctaHtml: `<b>${gots}</b> gots`, correctaTxt: String(gots),
      explicacio: `${frac(a, b)} : ${frac(1, c)} = ${frac(a * c, b)} = ${gots} gots.`,
      solucio: [`Divideixo: ${frac(a, b)} : ${frac(1, c)}.`, `En creu: ${a} × ${c} = ${a * c} i ${b} × 1 = ${b}: ${frac(a * c, b)} = <b>${gots}</b>.`]
    };
  }
  let k, a, b, rn, rd; do { k = tria([2, 3, 4]); b = rnd(3, 8); a = rnd(1, b - 1); rn = a; rd = b * k; } while (mcd(rn, rd) === 1 && Math.random() < .6);
  const nomK = { 2: 'la meitat', 3: 'la tercera part', 4: 'la quarta part' }[k]; const g = mcd(rn, rd);
  return {
    sig: `pm6-${k}-${a}-${b}`,
    enunciat: `Queden ${frac(a, b, 'mitja')} d'un pastís i te'n menges <b>${nomK}</b>. Quina part del pastís sencer et menges?${g > 1 ? ' Simplifica el resultat.' : ''}`,
    visual: null,
    pista: { completa: `${nomK[0].toUpperCase() + nomK.slice(1)} de ${frac(a, b)} és ${frac(1, k)} × ${frac(a, b)}.`, mitja: `«De» vol dir multiplicar.` },
    resposta: { mode: 'fraccio', valor: [rn, rd], equiv: true, irred: g > 1 },
    correctaHtml: frac(rn, rd) + simpTxt(rn, rd), correctaTxt: ftxt(rn / g, rd / g),
    explicacio: `${frac(1, k)} × ${frac(a, b)} = ${frac(rn, rd)}${simpTxt(rn, rd)}.`,
    solucio: [`${nomK[0].toUpperCase() + nomK.slice(1)} de ${frac(a, b)}: ${frac(1, k)} × ${frac(a, b)}.`, `1 × ${a} = ${rn}, ${k} × ${b} = ${rd}: ${frac(rn, rd)}${simpTxt(rn, rd)}.`]
  };
};
TEMES.o6 = {
  gen: T6,
  sequencia: {
    1: [['perEnter'], ['quantesCaben'], ['perEnter'], ['quantesCaben'], ['perEnter'], ['quantesCaben'], ['perEnter'], ['perEnter']],
    2: [['mult'], ['div'], ['mult'], ['div'], ['div'], ['mult'], ['div'], ['mult']],
    3: [['multSimp'], ['divSimp'], ['ambMixt'], ['problema'], ['divSimp'], ['multSimp'], ['problema'], ['ambMixt']]
  },
  explicacio: [
    { text: `<p>Multiplicar per un enter és <b class="parpelleja">sumar</b> diverses vegades.</p><p class="petit">3 × ${frac(2, 5)} = ${frac(2, 5)} + ${frac(2, 5)} + ${frac(2, 5)} = ${frac(6, 5)}</p>`,
      vis: () => `<svg class="dib" viewBox="0 0 480 196" width="480">${[0, 1, 2].map(i => svgBarra({ d: 5, n: 2, y0: 4 + i * 64, H: 52 })).join('')}</svg>` },
    { text: `<p>Per <b class="parpelleja">multiplicar</b> fraccions: <b>dalt per dalt</b> i <b>baix per baix</b>.</p>`,
      vis: () => `<div class="apareix">${opSVG(2, 3, 4, 5, 'mult', true)}</div><div class="apareix" style="animation-delay:.6s;font-size:1.4rem;font-weight:800">= ${frac(8, 15, 'mitja')}</div>` },
    { text: `<p>Per <b class="parpelleja">dividir</b> fraccions, multipliquem <b>en creu</b>.</p>`,
      vis: () => `<div class="apareix">${opSVG(2, 3, 4, 5, 'div')}</div>` },
    { text: `<p><b>Dalt</b>: el de dalt de la primera × el de baix de la segona.</p><p><b>Baix</b>: el de baix de la primera × el de dalt de la segona.</p>`,
      vis: () => `<div>${opSVG(2, 3, 4, 5, 'div', true)}</div><div class="apareix" style="animation-delay:.6s;font-size:1.4rem;font-weight:800">= ${frac(10, 12, 'mitja')}</div>` },
    { text: `<p><b class="parpelleja">Compte amb el signe!</b></p><p class="petit"><b>×</b> → recte (dalt amb dalt).<br><b>:</b> → en creu.</p>`,
      vis: () => `<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">${opSVG(1, 2, 3, 4, 'mult').replace('width="300"', 'width="230"')}${opSVG(1, 2, 3, 4, 'div').replace('width="300"', 'width="230"')}</div>` },
    { text: `<p>Al final, <b class="parpelleja">simplifica</b> si es pot.</p><p class="petit">${frac(10, 12)} = ${frac(5, 6)}</p>`,
      vis: () => transf(10, 12, 5, 6, ': 2') }
  ],
  exemple: (nv) => {
    if (nv === 1) return {
      enunciat: `Quant fa <b>3</b> <span class="op">×</span> ${frac(2, 5, 'mitja')}?`,
      passos: [
        { text: `És sumar ${frac(2, 5)} tres vegades.`, vis: `<svg class="dib" viewBox="0 0 480 196" width="480">${[0, 1, 2].map(i => svgBarra({ d: 5, n: 2, y0: 4 + i * 64, H: 52 })).join('')}</svg>` },
        { text: `Ajuntem totes les parts: 2 + 2 + 2 = <b>6</b> cinquens.`, vis: unitatsSVG({ d: 5, n: 6, numeros: true, animOmple: true }) },
        { text: `3 × ${frac(2, 5)} = ${frac(6, 5)}. Només multipliquem el de dalt. <span class="marca-ok">✓</span>`, vis: `<div>${frac(6, 5, 'gran')}</div>` }
      ]
    };
    if (nv === 2) return {
      enunciat: `Calcula ${opFr([[2, 3], [4, 5]], [':'])}.`,
      passos: [
        { text: `És una <b>divisió</b>: multipliquem en creu.`, vis: opSVG(2, 3, 4, 5, 'div') },
        { text: `Dalt: 2 × 5 = <b>10</b>. Baix: 3 × 4 = <b>12</b>.`, vis: opSVG(2, 3, 4, 5, 'div', true) },
        { text: `${frac(10, 12)} = ${frac(5, 6)}. <span class="marca-ok">✓</span>`, vis: transf(10, 12, 5, 6, ': 2') }
      ]
    };
    return {
      enunciat: `Calcula ${mix(1, 1, 2, 'mitja')} <span class="op">×</span> ${frac(4, 5, 'mitja')}.`,
      passos: [
        { text: `Passem el mixt a fracció: 1 × 2 + 1 = 3 → ${frac(3, 2)}.`, vis: `<div class="eq">${mix(1, 1, 2, 'gran')}<span class="op" style="font-size:2.4rem">=</span>${frac(3, 2, 'gran')}</div>` },
        { text: `Multipliquem: dalt per dalt i baix per baix.`, vis: opSVG(3, 2, 4, 5, 'mult', true) },
        { text: `${frac(12, 10)} = ${frac(6, 5)}. <span class="marca-ok">✓</span>`, vis: transf(12, 10, 6, 5, ': 2') }
      ]
    };
  }
};

UNITATS.f.carregada = true;
