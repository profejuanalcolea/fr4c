'use strict';
/* FR-4C · Matemàtiques 4t ESO · Unitat Mesura.
   L'app (index.html) carrega aquest fitxer quan cal. Fa servir les funcions del nucli de l'app.
   Idea: primer el SENTIT de la mesura (quina mida és raonable), després llegir instruments i, al final,
   els canvis d'unitat amb els salts de la xuleta del dossier (×10 cap a la dreta, ÷10 cap a l'esquerra).
   Tot es fa amb clics, botons i fletxes del teclat (els alumnes treballen amb el ratolí tàctil del portàtil). */
Object.assign(ETIQ_ERR, {
  mGran: 'tria una mesura massa gran', mPetit: 'tria una mesura massa petita', mMagnitud: 'confon la magnitud (longitud, massa, capacitat)',
  mNoZero: 'no posa el 0 del regle a l\'inici de l\'objecte', mNoResta: 'llegeix només el final i no resta l\'inici', mMmCm: 'confon mil·límetres i centímetres',
  mRatlla: 'no mira quant val cada ratlleta de l\'escala', mSentit: 'multiplica quan toca dividir (o al revés)', mSalt: 'fa un salt de més o de menys',
  mNumeros: 'compara els números sense mirar les unitats'
});
Object.assign(AVIS_ERR, {
  mGran: 'Aquesta mesura és <b>massa gran</b>.',
  mPetit: 'Aquesta mesura és <b>massa petita</b>.',
  mMagnitud: 'Compte amb la <b>magnitud</b>: la llargada es mesura en metres, el pes en grams o quilos i els líquids en litres.',
  mNoZero: 'Has llegit on acaba, però el <b>0 del regle</b> no era a l\'inici de l\'objecte. Sempre es comença a comptar des del 0.',
  mNoResta: 'Aquest regle no comença al 0: has de <b>restar</b> on acaba menys on comença.', mMmCm: 'Compte: <b>1 cm són 10 mm</b>. Mira en quina unitat et demanen la resposta.',
  mRatlla: 'Abans de llegir, mira <b>quant val cada ratlleta</b>: compta quantes n\'hi ha entre dos números.',
  mSentit: 'Has anat en el sentit contrari. Cap a una unitat <b>més petita</b> en calen més: <b>multiplica</b>. Cap a una de <b>més gran</b> en calen menys: <b>divideix</b>.',
  mSalt: 'T\'has deixat un salt o n\'has fet un de més: <b>compta els salts</b> a la xuleta, un per cada unitat.', mNumeros: 'No comparis només els números: primer passa les dues mesures a la <b>mateixa unitat</b>.'
});
document.head.insertAdjacentHTML('beforeend', `<style>
.ms-g{display:flex;flex-direction:column;gap:8px;align-items:stretch}
.ms-esc{width:100%;height:auto;max-height:37vh;background:#fff;border:2px solid var(--tinta);border-radius:12px;display:block}
.ms-ob{transform-origin:0 0;transition:transform .32s cubic-bezier(.3,1.45,.5,1)}
.ms-ctl{display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap}
.ms-ctl button{min-width:52px;height:46px;padding:0 14px;border-radius:11px;border:2px solid var(--tinta);background:#fff;font-size:1.15rem;font-weight:800;line-height:1;cursor:pointer}
.ms-ctl button:hover:not(:disabled){background:#fff3e6}.ms-ctl button:active:not(:disabled){transform:translateY(2px)}.ms-ctl button:disabled{opacity:.45;cursor:default}
.ms-ctl button.fort{background:var(--taronja);color:#fff;min-width:150px}.ms-ctl button.fort:hover:not(:disabled){background:var(--taronja);filter:brightness(1.08)}
.ms-ctl button.obert,.ms-ctl button.obert:hover:not(:disabled){background:var(--tinta);color:#fff;filter:none}
.ms-ctl input[type=range]{flex:1;min-width:120px;accent-color:var(--taronja);height:28px}
.ms-nota{margin:0;text-align:center;color:var(--gris);font-size:.82rem}
.ms-ops{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.ms-ops button{min-width:110px;padding:10px 16px;border-radius:12px;border:2px solid var(--tinta);background:#fff;font-size:1.3rem;font-weight:800;cursor:pointer}
.ms-ops button:hover:not(:disabled){background:#fff3e6}.ms-ops button.triat,.ms-ops button.triat:hover:not(:disabled){background:var(--tinta);color:#fff}.ms-ops button.bona{background:#1d8a4a;border-color:#1d8a4a;color:#fff}.ms-ops button.dolenta{background:#c33;border-color:#c33;color:#fff}
.ms-ent{display:flex;gap:8px;align-items:center;justify-content:center;font-size:1.25rem;font-weight:700;flex-wrap:wrap}
.ms-ent input{width:150px;height:46px;border:2px solid var(--tinta);border-radius:10px;font-size:1.4rem;font-weight:800;text-align:center}
.ms-ent input.be{border-color:#1d8a4a;background:#e8f6ee}.ms-ent input.mal{border-color:#c33;background:#fdecec}
.ms-pila{background:#fff;border:2px solid var(--tinta);border-radius:12px;padding:12px;min-height:190px;display:flex;flex-direction:column;gap:8px;align-items:center;justify-content:center}
.ms-pila .cap{font-size:1.05rem;font-weight:700;text-align:center}.ms-pila .cap b{color:var(--taronja);font-size:1.3rem}
.ms-pila .graella{display:flex;flex-wrap:wrap;gap:4px;justify-content:center;max-width:430px}.ms-pila .graella svg{animation:msPop .3s both}
.ms-pila .mes{font-size:1.5rem;font-weight:900;color:var(--taronja);animation:msPop .4s both}
.ms-pila .ob{font-size:2.6rem;line-height:1}
@keyframes msPop{0%{transform:scale(.3);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
.ms-agulla{transition:transform .55s cubic-bezier(.3,1.7,.5,1)}
.ms-reg{transition:transform .25s ease-out}
.ms-raig{transition:opacity .12s}
.ms-s-eq{text-align:center;font-size:1.7rem;font-weight:800;min-height:2.3rem}.ms-s-eq b{color:var(--taronja)}.ms-s-eq .pop{display:inline-block;animation:msPop .3s both}
.ms-pista{width:100%;height:auto;display:block;background:#fff;border:2px solid var(--tinta);border-radius:12px}
.ms-pista:focus{outline:3px solid var(--taronja);outline-offset:2px}
.ms-s-bot{transition:transform .34s cubic-bezier(.4,0,.3,1)}
.ms-pedra{cursor:pointer}.ms-pedra:hover rect{stroke-width:4}
.ms-pista.anima .ms-s-bot{animation:msVa 3.2s ease-in-out infinite}.ms-pista.anima .ms-s-hop{animation:msHop 3.2s ease-in-out infinite}
@keyframes msVa{0%,12%{transform:translateX(var(--xa))}38%,62%{transform:translateX(var(--xb))}88%,100%{transform:translateX(var(--xa))}}
@keyframes msHop{0%,12%,38%,62%,88%,100%{transform:translateY(0)}25%,75%{transform:translateY(-5px)}}
.ms-taula{border-collapse:separate;border-spacing:4px;margin:10px auto 0}.ms-taula caption{caption-side:top;font-size:.84rem;color:var(--gris);font-weight:700;padding-bottom:2px}
.ms-taula th{font-size:1.05rem;font-weight:900;padding:1px 0}.ms-taula th.gris{color:#999}.ms-taula th.lletra{color:var(--gris);padding-right:4px}
.ms-taula input{width:54px;height:46px;border:2px solid var(--tinta);border-radius:8px;text-align:center;font-size:1.3rem;font-weight:800;font-family:inherit;background:#fff}
.ms-taula.k2 input{width:58px}.ms-taula.k3 input{width:64px;font-size:1.15rem}.ms-taula th input{height:32px;font-size:.92rem;border-style:dashed}.ms-taula input.pre{color:var(--taronja)}
.ms-taula input:focus{outline:3px solid var(--taronja);outline-offset:1px}
.ms-refs{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:100%;max-width:520px}
.ms-refs div{background:#fff;border:2px solid var(--tinta);border-radius:12px;padding:8px 6px;text-align:center;font-size:.95rem;line-height:1.25}
.ms-refs div svg{display:block;margin:0 auto 2px}.ms-refs div i{font-style:normal;font-size:2rem;display:block;line-height:1.1}.ms-refs div b{display:block;color:var(--taronja);font-size:1.2rem}
.ms-ico{display:inline-flex;align-items:center;gap:7px;font-size:.95rem;font-weight:800;white-space:nowrap}.ms-ico svg{display:block}
.ms-sit{font-size:1.5rem;margin-right:4px}
.ms-creix-anim .ms-ob{animation:msCreix 3.4s ease-in-out infinite}
@keyframes msCreix{0%,10%{transform:translate(156px,208px) scale(var(--k0))}45%,65%{transform:translate(156px,208px) scale(var(--k1))}100%{transform:translate(156px,208px) scale(var(--k0))}}
</style>`);

/* ---------- Utilitats ---------- */
const MS_N = '#1b1b1b';
const msR = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const msS = `stroke="${MS_N}" stroke-width="2.5" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"`;
const msU = (v, u) => `${fmtDec(v)}&nbsp;${u}`;
const msUt = (v, u) => `${fmtDec(v)} ${u}`;
const msV = (n, e) => Number(`${n}e${e}`); // n · 10^e sense errors d'arrodoniment
const msGiny = (rp, corr) => ({ resposta: { mode: 'giny', ...rp }, correctaHtml: corr, correctaTxt: textPla(corr) });
// casella de resposta dins d'una activitat manipulable
const msEntrada = (abans, uni) => `<label class="ms-ent">${abans}<input data-ms-n inputmode="decimal" maxlength="10" autocomplete="off" aria-label="Resposta"><span>${uni}</span></label>`;
function msEnllacaEnt(z, G, ctx) {
  const inp = $('[data-ms-n]', z); if (!inp) return null;
  inp.oninput = () => { inp.value = netejaDec(inp.value); G.n = inp.value; ctx.canvi(); };
  inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); ctx.envia(); } };
  return inp;
}
const msTancaEnt = (z, ok) => { $('.ms-nota', z)?.remove(); const inp = $('[data-ms-n]', z); if (inp) { inp.disabled = true; inp.classList.add(ok ? 'be' : 'mal'); } $$('.ms-ctl button, .ms-ctl input, .ms-ops button', z).forEach(b => b.disabled = true); };

/* =====================================================================
   DIBUIXOS · objectes (caixa w × h, amb el terra a y = 0 i cap amunt en negatiu)
   ===================================================================== */
const MS_DIB = {
  porta: { w: 46, h: 100, d: `<rect x="0" y="-100" width="46" height="100" rx="1.5" fill="#f6c08a" ${msS}/><rect x="6" y="-92" width="34" height="38" fill="none" ${msS}/><rect x="6" y="-46" width="34" height="38" fill="none" ${msS}/><circle cx="38" cy="-50" r="2.6" fill="${MS_N}"/>` },
  persona: { w: 34, h: 100, d: `<rect x="8" y="-42" width="8" height="42" rx="3" fill="${MS_N}"/><rect x="18" y="-42" width="8" height="42" rx="3" fill="${MS_N}"/><rect x="5" y="-80" width="24" height="42" rx="8" fill="${T}" ${msS}/><path d="M5 -72 L0 -48 M29 -72 L34 -48" fill="none" ${msS}/><circle cx="17" cy="-90" r="9.5" fill="#fff" ${msS}/>` },
  cotxe: { w: 280, h: 100, d: `<path d="M62 -58 L92 -98 L188 -98 L226 -58 Z" fill="#fff" ${msS}/><path d="M140 -98 L140 -58" ${msS}/><rect x="0" y="-60" width="280" height="42" rx="13" fill="${T}" ${msS}/><circle cx="64" cy="-19" r="19" fill="${MS_N}"/><circle cx="64" cy="-19" r="7" fill="#fff"/><circle cx="216" cy="-19" r="19" fill="${MS_N}"/><circle cx="216" cy="-19" r="7" fill="#fff"/>` },
  autobus: { w: 360, h: 100, d: `<rect x="0" y="-100" width="360" height="84" rx="10" fill="${T}" ${msS}/>${[14, 70, 126, 182, 238].map(x => `<rect x="${x}" y="-88" width="46" height="30" rx="3" fill="#fff" ${msS}/>`).join('')}<rect x="300" y="-88" width="46" height="66" rx="3" fill="#fff" ${msS}/><circle cx="72" cy="-16" r="16" fill="${MS_N}"/><circle cx="72" cy="-16" r="6" fill="#fff"/><circle cx="262" cy="-16" r="16" fill="${MS_N}"/><circle cx="262" cy="-16" r="6" fill="#fff"/>` },
  nevera: { w: 42, h: 100, d: `<rect x="0" y="-100" width="42" height="100" rx="3" fill="#fff" ${msS}/><path d="M0 -64 L42 -64 M34 -90 L34 -74 M34 -54 L34 -30" fill="none" ${msS}/>` },
  taula: { w: 160, h: 100, d: `<rect x="12" y="-90" width="9" height="90" fill="#fff" ${msS}/><rect x="139" y="-90" width="9" height="90" fill="#fff" ${msS}/><rect x="0" y="-100" width="160" height="13" rx="3" fill="${T}" ${msS}/>` },
  llit: { w: 250, h: 100, d: `<rect x="8" y="-22" width="8" height="22" fill="${MS_N}"/><rect x="234" y="-22" width="8" height="22" fill="${MS_N}"/><rect x="0" y="-100" width="14" height="80" rx="4" fill="${T}" ${msS}/><rect x="236" y="-68" width="14" height="48" rx="4" fill="${T}" ${msS}/><rect x="12" y="-56" width="226" height="34" rx="6" fill="#fff" ${msS}/><rect x="20" y="-70" width="52" height="16" rx="7" fill="#fff" ${msS}/><path d="M90 -56 L90 -22" ${msS}/>` },
  gos: { w: 130, h: 100, d: `<path d="M26 -62 Q8 -80 14 -96" fill="none" ${msS}/><rect x="32" y="-36" width="11" height="36" rx="4" fill="${T}" ${msS}/><rect x="86" y="-36" width="11" height="36" rx="4" fill="${T}" ${msS}/><rect x="22" y="-72" width="84" height="40" rx="17" fill="${T}" ${msS}/><circle cx="108" cy="-78" r="20" fill="${T}" ${msS}/><path d="M96 -94 L92 -70 L104 -80 Z" fill="${MS_N}"/><circle cx="114" cy="-82" r="3" fill="${MS_N}"/><circle cx="127" cy="-74" r="3.4" fill="${MS_N}"/>` },
  bici: { w: 170, h: 100, d: `<circle cx="31" cy="-31" r="29" fill="none" ${msS}/><circle cx="139" cy="-31" r="29" fill="none" ${msS}/><path d="M31 -31 L68 -76 L120 -76 L139 -31 M68 -76 L84 -31 L31 -31 M84 -31 L120 -76 M113 -96 L122 -72 M102 -97 L124 -95 M58 -84 L78 -84" fill="none" stroke="${T}" stroke-width="4" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/><circle cx="84" cy="-31" r="5" fill="${MS_N}"/>` },
  llapis: { w: 300, h: 26, d: `<rect x="0" y="-26" width="22" height="26" rx="4" fill="#fff" ${msS}/><rect x="22" y="-26" width="228" height="26" fill="${T}" ${msS}/><path d="M250 -26 L300 -13 L250 0 Z" fill="#f3d9b1" ${msS}/><path d="M284 -17 L300 -13 L284 -9 Z" fill="${MS_N}"/>` },
  mobil: { w: 50, h: 100, d: `<rect x="0" y="-100" width="50" height="100" rx="8" fill="${MS_N}"/><rect x="4" y="-93" width="42" height="82" rx="4" fill="#fff"/><circle cx="25" cy="-5.5" r="2.5" fill="#fff"/>` },
  clau: { w: 120, h: 46, d: `<rect x="40" y="-29" width="80" height="12" rx="2" fill="${T}" ${msS}/><rect x="92" y="-17" width="8" height="10" fill="${T}" ${msS}/><rect x="106" y="-17" width="8" height="7" fill="${T}" ${msS}/><circle cx="23" cy="-23" r="21.5" fill="${T}" ${msS}/><circle cx="18" cy="-23" r="6.5" fill="#fff" ${msS}/>` },
  llauna: { w: 56, h: 100, d: `<rect x="0" y="-100" width="56" height="100" rx="9" fill="${T}" ${msS}/><rect x="0" y="-70" width="56" height="34" fill="#fff" ${msS}/><path d="M8 -92 L48 -92" ${msS}/>` },
  full: { w: 70.7, h: 100, d: `<rect x="0" y="-100" width="70.7" height="100" fill="#fff" ${msS}/><path d="M10 -84 L60 -84 M10 -70 L60 -70 M10 -56 L60 -56 M10 -42 L44 -42" stroke="#bbb" stroke-width="1.5" vector-effect="non-scaling-stroke" fill="none"/>` },
  ampolla: { w: 30, h: 100, d: `<rect x="10" y="-100" width="10" height="8" rx="2" fill="${T}" ${msS}/><path d="M11 -92 L11 -82 Q0 -76 0 -66 L0 -6 Q0 0 6 0 L24 0 Q30 0 30 -6 L30 -66 Q30 -76 19 -82 L19 -92 Z" fill="#dff0fb" ${msS}/><rect x="0" y="-56" width="30" height="24" fill="#fff" ${msS}/>` },
  goma: { w: 100, h: 46, d: `<rect x="0" y="-46" width="100" height="46" rx="8" fill="#fff" ${msS}/><path d="M0 -38 Q0 -46 8 -46 L46 -46 L46 0 L8 0 Q0 0 0 -8 Z" fill="${T}" ${msS}/>` },
  moneda: { w: 100, h: 100, d: `<circle cx="50" cy="-50" r="49" fill="#f1c75b" ${msS}/><circle cx="50" cy="-50" r="35" fill="#e9e9e9" ${msS}/><text x="50" y="-36" text-anchor="middle" font-size="40" font-weight="900" fill="${MS_N}" font-family="system-ui,sans-serif">1</text>` }
};
// mà (un pam = 20 cm), caixa 62 × 100
const MS_MA = `<rect x="2" y="-58" width="12" height="34" rx="6" fill="#f3d9b1" ${msS} transform="rotate(-28 8 -30)"/><rect x="12" y="-92" width="10" height="50" rx="5" fill="#f3d9b1" ${msS}/><rect x="24" y="-100" width="10" height="58" rx="5" fill="#f3d9b1" ${msS}/><rect x="36" y="-96" width="10" height="54" rx="5" fill="#f3d9b1" ${msS}/><rect x="48" y="-84" width="10" height="44" rx="5" fill="#f3d9b1" ${msS}/><rect x="10" y="-52" width="50" height="52" rx="12" fill="#f3d9b1" ${msS}/>`;
/* Objectes amb una mida que tothom coneix. u: unitat de l'escena · real: valor per a les frases · ok: marge acceptat · max: fins on pot créixer */
const MS_OBJ = [
  { id: 'porta', nom: 'una porta', de: 'la porta', dim: 'd\'alçada', eix: 'y', u: 'm', real: 2, ok: [1.9, 2.2], max: 3.2, pas: .1, ref: 'robot' },
  { id: 'persona', nom: 'una persona adulta', de: 'la persona', dim: 'd\'alçada', eix: 'y', u: 'm', real: 1.7, ok: [1.5, 1.95], max: 2.8, pas: .05, ref: 'robot' },
  { id: 'nevera', nom: 'una nevera', de: 'la nevera', dim: 'd\'alçada', eix: 'y', u: 'm', real: 1.8, ok: [1.6, 2.05], max: 3, pas: .1, ref: 'robot' },
  { id: 'taula', nom: 'una taula', de: 'la taula', dim: 'd\'alçada', eix: 'y', u: 'm', real: .75, ok: [.65, .85], max: 1.5, pas: .05, ref: 'robot' },
  { id: 'gos', nom: 'un gos mitjà', de: 'el gos', dim: 'd\'alçada', eix: 'y', u: 'm', real: .5, ok: [.35, .7], max: 1.3, pas: .05, ref: 'robot' },
  { id: 'cotxe', nom: 'un cotxe', de: 'el cotxe', dim: 'de llargada', eix: 'x', u: 'm', real: 4, ok: [3.5, 5], max: 7, pas: .1, ref: 'robot' },
  { id: 'llit', nom: 'un llit', de: 'el llit', dim: 'de llargada', eix: 'x', u: 'm', real: 2, ok: [1.8, 2.2], max: 3.6, pas: .1, ref: 'robot' },
  { id: 'bici', nom: 'una bicicleta', de: 'la bicicleta', dim: 'de llargada', eix: 'x', u: 'm', real: 1.7, ok: [1.5, 2], max: 3.2, pas: .1, ref: 'robot' },
  { id: 'autobus', nom: 'un autobús', de: 'l\'autobús', dim: 'de llargada', eix: 'x', u: 'm', real: 12, ok: [10, 14], max: 18, pas: .5, ref: 'robot' },
  { id: 'llapis', nom: 'un llapis nou', de: 'el llapis', dim: 'de llargada', eix: 'x', u: 'cm', real: 17, ok: [14, 20], max: 50, pas: 1, ref: 'ma' },
  { id: 'mobil', nom: 'un mòbil', de: 'el mòbil', dim: 'd\'alçada', eix: 'y', u: 'cm', real: 15, ok: [13, 17], max: 36, pas: 1, ref: 'ma' },
  { id: 'llauna', nom: 'una llauna de refresc', de: 'la llauna', dim: 'd\'alçada', eix: 'y', u: 'cm', real: 12, ok: [10, 14], max: 30, pas: 1, ref: 'ma' },
  { id: 'full', nom: 'un full DIN A4', de: 'el full', dim: 'd\'alçada', eix: 'y', u: 'cm', real: 30, ok: [27, 32], max: 56, pas: 1, ref: 'ma' },
  { id: 'ampolla', nom: 'una ampolla d\'aigua d\'1,5 L', de: 'l\'ampolla', dim: 'd\'alçada', eix: 'y', u: 'cm', real: 32, ok: [28, 36], max: 60, pas: 1, ref: 'ma' },
  { id: 'clau', nom: 'una clau de casa', de: 'la clau', dim: 'de llargada', eix: 'x', u: 'cm', real: 6, ok: [5, 7], max: 45, pas: .5, ref: 'ma' },
  { id: 'goma', nom: 'una goma d\'esborrar', de: 'la goma', dim: 'de llargada', eix: 'x', u: 'cm', real: 4, ok: [3, 6], max: 45, pas: .5, ref: 'ma' },
  { id: 'moneda', nom: 'una moneda d\'1 €', de: 'la moneda', dim: 'd\'amplada', eix: 'x', u: 'mm', real: 23, ok: [20, 26], max: 250, pas: 1, ref: 'ma' }
].map(o => ({ ...o, box: MS_DIB[o.id], dib: MS_DIB[o.id].d }));
const msObjs = cond => MS_OBJ.filter(cond);
const MS_E = { W: 520, H: 252, TERRA: 208, X0: 156 };
const msRefVal = ob => ob.ref === 'ma' ? (ob.u === 'mm' ? 200 : 20) : 1; // el referent: FR-4C fa 1 m i un pam, 20 cm
const msPpu = ob => Math.min(ob.eix === 'x' ? Math.min(346 / ob.max, 168 * ob.box.w / (ob.box.h * ob.max)) : Math.min(168 / ob.max, 340 * ob.box.h / (ob.box.w * ob.max)), 160 / msRefVal(ob));
function msGeo(ob, v) { const ppu = msPpu(ob); const k = v * ppu / (ob.eix === 'x' ? ob.box.w : ob.box.h); return { ppu, k, wpx: ob.box.w * k, hpx: ob.box.h * k }; }
function msDimSvg(ob, v, txt) { // cota amb la mida, al costat de l'objecte
  const E = MS_E, g = msGeo(ob, v); const fora = g.hpx > E.TERRA - 6 || g.wpx > E.W - E.X0 - 4;
  const avis = fora ? `<text x="${E.W - 12}" y="24" text-anchor="end" font-size="17" font-weight="900" fill="${T}" paint-order="stroke" stroke="#fff" stroke-width="5">No hi cap a la pantalla!</text>` : '';
  if (ob.eix === 'y') { const x = Math.min(E.X0 + g.wpx + 16, E.W - 96), y1 = Math.max(E.TERRA - g.hpx, -20);
    return `<path d="M${x} ${y1} L${x} ${E.TERRA} M${x - 6} ${y1} L${x + 6} ${y1} M${x - 6} ${E.TERRA} L${x + 6} ${E.TERRA}" stroke="${T}" stroke-width="3" fill="none"/><text x="${x + 10}" y="${Math.max(40, Math.min(E.TERRA - 8, (y1 + E.TERRA) / 2 + 7))}" font-size="22" font-weight="900" fill="${MS_N}" paint-order="stroke" stroke="#fff" stroke-width="5">${txt}</text>${avis}`; }
  const x2 = Math.min(E.X0 + g.wpx, E.W + 20), y = E.TERRA + 13;
  return `<path d="M${E.X0} ${y} L${x2} ${y} M${E.X0} ${y - 6} L${E.X0} ${y + 6} M${x2} ${y - 6} L${x2} ${y + 6}" stroke="${T}" stroke-width="3" fill="none"/><text x="${Math.min((E.X0 + x2) / 2, E.W - 70)}" y="${y + 25}" text-anchor="middle" font-size="22" font-weight="900" fill="${MS_N}">${txt}</text>${avis}`;
}
function msEscenaSvg(ob, v, txt, extra = '') {
  const E = MS_E, g = msGeo(ob, v); const hr = msRefVal(ob) * g.ppu;
  const ref = ob.ref === 'ma' ? `<g transform="translate(${70 - hr * .31},${E.TERRA}) scale(${hr / 100})">${MS_MA}</g>` : robot(hr * 150 / 160).replace('<svg ', `<svg x="${70 - hr * 150 / 320}" y="${E.TERRA - hr}" `);
  return `<svg class="ms-esc ${extra}" viewBox="0 0 ${E.W} ${E.H}" role="img" aria-label="${esc(ob.nom)} al costat de ${ob.ref === 'ma' ? 'un pam' : 'FR-4C'}">
    <line x1="0" y1="${E.TERRA}" x2="${E.W}" y2="${E.TERRA}" stroke="${MS_N}" stroke-width="3"/>${ref}
    <text x="70" y="${E.TERRA + 19}" text-anchor="middle" font-size="14" font-weight="800" fill="${MS_N}">${ob.ref === 'ma' ? 'un pam: 20 cm' : 'FR-4C: 1 m'}</text>
    <g class="ms-ob" style="transform:translate(${E.X0}px,${E.TERRA}px) scale(${g.k})">${ob.dib}</g><g class="ms-dim">${msDimSvg(ob, v, txt ?? msU(v, ob.u))}</g></svg>`;
}
function msEscenaPosa(z, ob, v, txt) { const g = msGeo(ob, v); const o = $('.ms-ob', z); if (o) o.style.transform = `translate(${MS_E.X0}px,${MS_E.TERRA}px) scale(${g.k})`; const d = $('.ms-dim', z); if (d) d.innerHTML = msDimSvg(ob, v, txt ?? msU(v, ob.u)); }
/* icones d'instruments */
const msIco = (t, m = 44) => t === 'L'
  ? `<svg width="${m * 1.5}" height="${m * .6}" viewBox="0 0 66 26"><rect x="1.5" y="3" width="63" height="20" rx="3" fill="#ffe3b8" stroke="${MS_N}" stroke-width="2.5"/><path d="M9 3v9M17 3v6M25 3v9M33 3v6M41 3v9M49 3v6M57 3v9" stroke="${MS_N}" stroke-width="2"/></svg>`
  : t === 'M' ? `<svg width="${m}" height="${m}" viewBox="0 0 44 44"><rect x="7" y="3" width="30" height="5" rx="2" fill="${MS_N}"/><rect x="20" y="8" width="4" height="5" fill="${MS_N}"/><rect x="4" y="13" width="36" height="28" rx="6" fill="#fff" stroke="${MS_N}" stroke-width="2.5"/><circle cx="22" cy="27" r="9" fill="#ffe3b8" stroke="${MS_N}" stroke-width="2"/><path d="M22 27L27 21" stroke="${T}" stroke-width="2.5" stroke-linecap="round"/></svg>`
  : `<svg width="${m}" height="${m}" viewBox="0 0 44 44"><path d="M9 5L7 9L9 9L9 37Q9 41 13 41L29 41Q33 41 33 37L33 5Z" fill="#fff" stroke="${MS_N}" stroke-width="2.5" stroke-linejoin="round"/><path d="M10.5 22L31.5 22L31.5 37Q31.5 39.5 29 39.5L13 39.5Q10.5 39.5 10.5 37Z" fill="#f7a23b"/><path d="M33 12Q42 12 42 21Q42 30 33 30" fill="none" stroke="${MS_N}" stroke-width="2.5"/><path d="M9 14h6M9 22h9M9 30h6" stroke="${MS_N}" stroke-width="2"/></svg>`;
const MS_EINA = { L: 'Regle o cinta mètrica', M: 'Bàscula', C: 'Gerra graduada' };
const msEina = t => `<span class="ms-ico">${msIco(t, 28)}<span>${MS_EINA[t]}</span></span>`;
/* referents de massa i capacitat: paquet de sucre (1 kg) i bric de llet (1 L) */
const msPaquet = (m = 34, ple = 1) => `<svg width="${m}" height="${m * 1.25}" viewBox="0 0 40 50"><rect x="3" y="6" width="34" height="42" rx="3" fill="#fff" stroke="${MS_N}" stroke-width="2.5"/><rect x="4.5" y="${7.5 + 39 * (1 - ple)}" width="31" height="${39 * ple}" fill="#ffd9a3"/><path d="M3 6L8 1L32 1L37 6" fill="#fff" stroke="${MS_N}" stroke-width="2.5" stroke-linejoin="round"/><text x="20" y="32" text-anchor="middle" font-size="11" font-weight="900" fill="${MS_N}" font-family="system-ui,sans-serif">1 kg</text></svg>`;
const msBric = (m = 34, ple = 1) => `<svg width="${m}" height="${m * 1.25}" viewBox="0 0 40 50"><path d="M5 12L5 46Q5 48 7 48L33 48Q35 48 35 46L35 12L28 2L12 2Z" fill="#fff" stroke="${MS_N}" stroke-width="2.5" stroke-linejoin="round"/><rect x="6.5" y="${13 + 33.5 * (1 - ple)}" width="27" height="${33.5 * ple}" fill="#cfe6f7"/><path d="M5 12L35 12" stroke="${MS_N}" stroke-width="2.5"/><text x="20" y="34" text-anchor="middle" font-size="12" font-weight="900" fill="${MS_N}" font-family="system-ui,sans-serif">1 L</text></svg>`;
// quants paquets (o brics) són: es veu d'un cop d'ull si la mesura té sentit
function msPilaHtml(mag, v, ob, txt) {
  const ico = mag === 'M' ? msPaquet : msBric, un = mag === 'M' ? ['paquet de sucre', 'paquets de sucre'] : ['bric de llet', 'brics de llet'];
  let cos, cap;
  if (v >= 1) { const n = Math.round(v), mostra = Math.min(n, 24);
    cap = `${txt}: com <b>${fmtDec(n)}</b> ${n === 1 ? un[0] : un[1]}`;
    cos = `<div class="graella">${Array.from({ length: mostra }, (_, i) => ico(n > 12 ? 26 : 34).replace('<svg ', `<svg style="animation-delay:${i * 18}ms" `)).join('')}</div>${n > mostra ? `<div class="mes">… i així fins a ${fmtDec(n)}!</div>` : ''}`;
  } else { cap = `${txt}: <b>menys d'1</b> ${un[0]}`; cos = `<div class="graella">${ico(64, Math.max(.03, v))}</div><div style="color:var(--gris);font-weight:700">${v < .02 ? 'gairebé res: ni es veu' : v < .2 ? 'només una mica del fons' : v < .45 ? 'menys de la meitat' : v < .55 ? 'la meitat' : 'més de la meitat'}</div>`; }
  return `<div class="ob">${ob.ico}</div><div class="cap">${cap}</div>${cos}`;
}

/* =====================================================================
   OBJECTIU 1 · TÉ SENTIT AQUESTA MESURA?
   ===================================================================== */
const PISTA_M1 = { completa: `Compara amb el que coneixes: <b>FR-4C fa 1 m</b> i una porta, 2 m. Un pam fa 20 cm. Un paquet de sucre pesa 1 kg i un bric de llet fa 1 L.`, mitja: `Pensa en una cosa que coneguis i compara-la.` };
/* mides en text natural: tria la unitat perquè el número sigui còmode */
const MS_NAT = { L: [['mm', .001], ['cm', .01], ['m', 1], ['km', 1000]], M: [['g', .001], ['kg', 1]], C: [['mL', .001], ['L', 1]] };
function msNat(mag, vBase) { const us = MS_NAT[mag]; let tr = us[0]; for (const u of us) if (vBase / u[1] >= .999) tr = u; return { t: `${fmtDec(Math.round(vBase / tr[1] * 1000) / 1000)}&nbsp;${tr[0]}`, v: vBase }; }
const MS_BASE = { m: 1, cm: .01, mm: .001, km: 1000, kg: 1, g: .001, L: 1, mL: .001, cL: .01 };
// massa i capacitat de coses conegudes (valor en kg o en L)
const MS_COSES = [
  { mag: 'M', nom: 'un mòbil', ico: '📱', v: .18 }, { mag: 'M', nom: 'una poma', ico: '🍎', v: .2 }, { mag: 'M', nom: 'una persona adulta', ico: '🧍', v: 70 }, { mag: 'M', nom: 'un gos mitjà', ico: '🐕', v: 15 },
  { mag: 'M', nom: 'una síndria', ico: '🍉', v: 5 }, { mag: 'M', nom: 'una motxilla plena de llibres', ico: '🎒', v: 6 }, { mag: 'M', nom: 'un ou', ico: '🥚', v: .06 }, { mag: 'M', nom: 'un entrepà', ico: '🥪', v: .25 },
  { mag: 'M', nom: 'un cotxe', ico: '🚗', v: 1200 }, { mag: 'M', nom: 'un nadó acabat de néixer', ico: '👶', v: 3 }, { mag: 'M', nom: 'una barra de pa', ico: '🥖', v: .25 },
  { mag: 'C', nom: 'una llauna de refresc', ico: '🥫', v: .33 }, { mag: 'C', nom: 'un got d\'aigua', ico: '🥛', v: .2 }, { mag: 'C', nom: 'una ampolla gran d\'aigua', ico: '🍶', v: 1.5 }, { mag: 'C', nom: 'una cullerada de xarop', ico: '🥄', v: .005 },
  { mag: 'C', nom: 'una galleda', ico: '🪣', v: 10 }, { mag: 'C', nom: 'una banyera plena', ico: '🛁', v: 150 }, { mag: 'C', nom: 'el dipòsit de benzina d\'un cotxe', ico: '⛽', v: 50 }, { mag: 'C', nom: 'una tassa de cafè', ico: '☕', v: .1 }, { mag: 'C', nom: 'una garrafa d\'aigua', ico: '💧', v: 8 }
];
const M1 = {};
/* A · Fes-ho créixer: deixa l'objecte a la mida real, al costat de FR-4C (o d'un pam) */
M1.creix = (nv, { petit = false } = {}) => {
  const ob = tria(msObjs(o => petit ? (o.ref === 'ma' && (nv === 3 || o.u !== 'mm')) : o.ref === 'robot'));
  const N = Math.round(ob.max / ob.pas), val = i => Math.round(i * ob.pas * 1000) / 1000;
  const iReal = Math.round(ob.real / ob.pas);
  const i0 = Math.max(1, Math.min(N, Math.round(iReal * (Math.random() < .5 ? .3 + Math.random() * .2 : Math.min(ob.max / ob.real * .95, 1.8 + Math.random() * .5)))));
  const dins = v => v >= ob.ok[0] - 1e-9 && v <= ob.ok[1] + 1e-9; const gran = Math.max(2, Math.round(N / 14));
  return { sig: `c-${ob.id}`, enunciat: `Fes ${ob.id === 'porta' || ob.id === 'nevera' || ob.id === 'taula' ? 'créixer o encongir' : 'més gran o més petit'} <b>${ob.de}</b> fins que tingui la <b>mida de veritat</b>.`, visual: nv === 1 ? () => msRefsHtml(ob.ref === 'ma') : null, pista: PISTA_M1,
    ...msGiny({
      inici: () => ({ i: i0, mogut: false }),
      munta(z, G, ctx) {
        z.innerHTML = `<div class="ms-g"><div class="ms-zona">${msEscenaSvg(ob, val(G.i))}</div>
          <div class="ms-ctl"><button data-d="${-gran}" title="Molt més petit">−−</button><button data-d="-1" title="Una mica més petit">−</button><input type="range" min="1" max="${N}" step="1" value="${G.i}" aria-label="Mida"><button data-d="1" title="Una mica més gran">+</button><button data-d="${gran}" title="Molt més gran">++</button></div>
          <p class="ms-nota">Clica els botons, o bé la barra i les fletxes ← → del teclat.</p></div>`;
        const rg = $('input[type=range]', z);
        const posa = (i, forca) => { i = Math.max(1, Math.min(N, i)); if (i === G.i && !forca) return; so('to', 220 + 660 * i / N); G.i = i; G.mogut = true; rg.value = i; msEscenaPosa(z, ob, val(i)); ctx.canvi(); };
        z.onclick = e => { const b = e.target.closest('[data-d]'); if (b && ctx.actiu()) posa(G.i + Number(b.dataset.d)); };
        rg.oninput = () => { if (ctx.actiu()) posa(Number(rg.value)); };
        G.posa = posa;
      },
      fet: G => G.mogut, ok: G => dins(val(G.i)), txt: G => `${ob.nom}: ${msUt(val(G.i), ob.u)}`, etiq: G => val(G.i) > ob.ok[1] ? 'mGran' : 'mPetit',
      tanca(z, G, ok) { msTancaEnt(z, ok); if (!ok) setTimeout(() => { if (z.isConnected) msEscenaPosa(z, ob, ob.real, `✓ ${msU(ob.real, ob.u)}`); }, 700); },
      demo: resolt => msEscenaSvg(ob, resolt ? ob.real : val(i0)),
      resol(z, G, be) { G.posa(be ? iReal : (iReal * 2 <= N ? iReal * 2 : Math.max(1, Math.round(iReal / 3))), true); }
    }, `uns <b>${msU(ob.real, ob.u)}</b> (val entre ${fmtDec(ob.ok[0])} i ${msU(ob.ok[1], ob.u)})`),
    explicacio: ob.ref === 'ma' ? `Un pam fa uns 20 cm: ${ob.nom} fa uns ${msU(ob.real, ob.u)}.` : `FR-4C fa 1 m: ${ob.nom} fa uns ${msU(ob.real, ob.u)} ${ob.dim}.`,
    solucio: [`${ob.ref === 'ma' ? 'Un pam fa uns 20 cm' : 'FR-4C fa 1 m'}: fes-lo servir per comparar.`, `${ob.nom[0].toUpperCase() + ob.nom.slice(1)} fa uns <b>${msU(ob.real, ob.u)}</b> ${ob.dim}.`] };
};
/* B · El robot s'ha equivocat: una mesura absurda que es VEU, i cal triar la bona */
function msOpcionsAbs(mag, vBase) { // la bona i quatre de dolentes (×10, ×100, ÷10, ÷100)
  const bona = msNat(mag, vBase); const mals = [10, 100, .1, .01].map(f => msNat(mag, vBase * f)).filter(m => m.t !== bona.t);
  return { bona, mals: barreja(mals) };
}
M1.absurd = (nv, { mag = 'L' } = {}) => {
  let ob, vBase, escena;
  if (mag === 'L') { const o = tria(msObjs(x => nv === 1 ? x.ref === 'robot' : nv === 2 ? x.u !== 'mm' : true)); ob = { nom: o.nom, de: o.de, dim: o.dim, o }; vBase = o.real * MS_BASE[o.u]; escena = true; }
  else { const c = tria(MS_COSES.filter(x => x.mag === mag)); ob = { nom: c.nom, de: c.nom, dim: mag === 'M' ? 'de pes' : 'de capacitat', ico: c.ico }; vBase = c.v; }
  const { bona, mals } = msOpcionsAbs(mag, vBase); const dit = mals.sort((a, b) => Math.abs(Math.log(b.v / vBase)) - Math.abs(Math.log(a.v / vBase)))[0]; // la més exagerada
  const ops = barreja([{ ...bona, val: 'b' }, ...barreja(mals.filter(m => m !== dit)).slice(0, 2).map((m, i) => ({ ...m, val: 'm' + i }))]);
  const vDib = o => Math.min(o.v / MS_BASE[ob.o.u], ob.o.max * 2.6);
  const pinta = (z, o) => { if (escena) msEscenaPosa(z, ob.o, vDib(o), o.t); else $('.ms-pila', z).innerHTML = msPilaHtml(mag, o.v, ob, o.t); };
  const vista0 = o => escena ? msEscenaSvg(ob.o, vDib(o), o.t) : `<div class="ms-pila">${msPilaHtml(mag, o.v, ob, o.t)}</div>`;
  const verb = mag === 'L' ? `fa ${dit.t} ${ob.dim}` : mag === 'M' ? `pesa ${dit.t}` : `té ${dit.t}`;
  return { sig: `a-${mag}-${ob.nom}`, enunciat: `FR-4C diu: «${ob.nom[0].toUpperCase() + ob.nom.slice(1)} <b>${verb}</b>». Mira el dibuix: no pot ser! Tria la mesura bona.`, visual: nv === 1 ? () => msRefsHtml(false) : null, pista: PISTA_M1,
    ...msGiny({
      inici: () => ({ sel: null }),
      munta(z, G, ctx) {
        z.innerHTML = `<div class="ms-g"><div class="ms-zona">${vista0(dit)}</div><div class="ms-ops">${ops.map(o => `<button data-v="${o.val}">${o.t}</button>`).join('')}</div><p class="ms-nota">Clica una mesura i mira com queda.</p></div>`;
        z.onclick = e => { const b = e.target.closest('[data-v]'); if (!b || !ctx.actiu()) return; const o = ops.find(x => x.val === b.dataset.v); G.sel = o.val;
          $$('.ms-ops button', z).forEach(x => x.classList.toggle('triat', x === b)); so('to', Math.max(180, Math.min(1400, 520 + 150 * Math.log10(o.v / vBase)))); pinta(z, o); ctx.canvi(); };
        setTimeout(() => { if (z.isConnected && G.sel == null) so('absurd'); }, 350);
      },
      fet: G => G.sel != null, ok: G => G.sel === 'b', txt: G => `${ob.nom}: ${textPla(ops.find(o => o.val === G.sel).t)}`, etiq: G => ops.find(o => o.val === G.sel).v > vBase ? 'mGran' : 'mPetit',
      tanca(z, G, ok) { $$('.ms-ops button', z).forEach(b => { b.disabled = true; if (b.dataset.v === 'b') b.classList.add('bona'); else if (b.dataset.v === G.sel) b.classList.add('dolenta'); }); if (!ok) setTimeout(() => { if (z.isConnected) pinta(z, bona); }, 700); },
      demo: resolt => `${vista0(resolt ? bona : dit)}<div class="ms-ops" style="margin-top:8px">${ops.map(o => `<button disabled class="${resolt && o.val === 'b' ? 'bona' : ''}">${o.t}</button>`).join('')}</div>`,
      resol(z, G, be) { $(`[data-v="${be ? 'b' : 'm0'}"]`, z).click(); }
    }, `<b>${bona.t}</b>`),
    explicacio: `${ob.nom[0].toUpperCase() + ob.nom.slice(1)} ${mag === 'L' ? 'fa' : mag === 'M' ? 'pesa' : 'té'} uns ${bona.t}.`,
    solucio: [`${dit.t} no pot ser: ${dit.v > vBase ? 'és moltíssim' : 'és massa poc'}.`, `La mesura que té sentit és <b>${bona.t}</b>.`] };
};
/* C · Quina eina i quina unitat */
const MS_SIT = [ // [frase, magnitud, unitat, icona]
  ['la llargada d\'un llapis', 'L', 'cm', '✏️'], ['el gruix d\'un mòbil', 'L', 'mm', '📱'], ['la distància de Badalona a Barcelona', 'L', 'km', '🚆'], ['l\'alçada d\'una porta', 'L', 'm', '🚪'],
  ['el gruix d\'una moneda', 'L', 'mm', '🪙'], ['la llargada d\'un autobús', 'L', 'm', '🚌'], ['la distància d\'una marató', 'L', 'km', '🏃'], ['l\'amplada d\'un full', 'L', 'cm', '📄'], ['la llargada d\'una piscina', 'L', 'm', '🏊'],
  ['el pes d\'una poma', 'M', 'g', '🍎'], ['el pes d\'una persona', 'M', 'kg', '🧍'], ['el pes d\'un mòbil', 'M', 'g', '📱'], ['el pes d\'una síndria', 'M', 'kg', '🍉'], ['el pes d\'un sobre de sucre', 'M', 'g', '🧂'], ['el pes d\'una motxilla plena', 'M', 'kg', '🎒'],
  ['l\'aigua d\'una ampolla gran', 'C', 'L', '🍶'], ['el xarop d\'una cullera', 'C', 'mL', '🥄'], ['l\'aigua d\'una banyera', 'C', 'L', '🛁'], ['la benzina del dipòsit d\'un cotxe', 'C', 'L', '⛽'], ['la llet d\'un got', 'C', 'mL', '🥛'], ['la colònia d\'un flascó petit', 'C', 'mL', '🧴']
];
const MS_UNI = { L: ['mm', 'cm', 'm', 'km'], M: ['g', 'kg'], C: ['mL', 'L'] };
const msMagDe = u => Object.keys(MS_UNI).find(k => MS_UNI[k].includes(u));
M1.eina = (nv, { n = 3 } = {}) => {
  const sits = barreja(MS_SIT).slice(0, n);
  const its = sits.map(([f, mg, , ic]) => ({ tipus: 'tria', llarg: true, html: `<span class="ms-sit">${ic}</span> Per saber <b>${f}</b>, faig servir…`, opcions: ['L', 'M', 'C'].map(k => ({ html: msEina(k), val: k })), correcta: mg, etiq: Object.fromEntries(['L', 'M', 'C'].filter(k => k !== mg).map(k => [k, 'mMagnitud'])), f, mg }));
  return { sig: `e-${sits.map(s => s[0]).join('|')}`, enunciat: `Quina eina fas servir per mesurar cada cosa?`, visual: null, pista: { completa: `El <b>regle</b> mesura llargades. La <b>bàscula</b> diu quant pesa una cosa. La <b>gerra graduada</b> mesura líquids.`, mitja: `Llargada, pes o líquid?` }, ...apartats(its),
    explicacio: `Regle per a les llargades, bàscula per al pes i gerra per als líquids.`, solucio: its.map(it => `${it.f[0].toUpperCase() + it.f.slice(1)}: <b>${MS_EINA[it.mg].toLowerCase()}</b>.`) };
};
M1.unitat = (nv, { n = 3 } = {}) => {
  const sits = barreja(MS_SIT).slice(0, n);
  const its = sits.map(([f, mg, u, ic]) => {
    const meves = MS_UNI[mg]; let ops;
    if (nv === 3) ops = [u, ...barreja(meves.filter(x => x !== u)).slice(0, 1), ...barreja(Object.keys(MS_UNI).filter(k => k !== mg).map(k => tria(MS_UNI[k])))].slice(0, 4);
    else if (mg === 'L') { const i = meves.indexOf(u); const lluny = meves.filter((_, j) => Math.abs(j - i) >= 2), prop = meves.filter((_, j) => Math.abs(j - i) === 1); ops = nv === 1 ? [u, ...barreja(lluny).slice(0, 1), ...barreja(prop).slice(0, 1)] : [u, ...prop, ...barreja(lluny).slice(0, 1)]; }
    else ops = [...meves, tria(MS_UNI[mg === 'M' ? 'C' : 'M'])];
    ops = [...new Set(ops)].sort((a, b) => (msMagDe(a) + String(MS_BASE[a]).padStart(8)).localeCompare(msMagDe(b) + String(MS_BASE[b]).padStart(8)));
    return { tipus: 'tria', llarg: true, html: `<span class="ms-sit">${ic}</span> ${f[0].toUpperCase() + f.slice(1)} es mesura en…`, opcions: ops.map(x => ({ html: `<b>${x}</b>`, val: x })), correcta: u,
      etiq: Object.fromEntries(ops.filter(x => x !== u).map(x => [x, msMagDe(x) !== mg ? 'mMagnitud' : MS_BASE[x] > MS_BASE[u] ? 'mGran' : 'mPetit'])), f, u };
  });
  return { sig: `u-${sits.map(s => s[0]).join('|')}`, enunciat: `Tria la unitat que té més sentit.`, visual: nv === 1 ? () => msUnitatsHtml() : null, pista: { completa: `Coses petites: mm i cm, grams, mil·lilitres. Coses grans: metres i quilòmetres, quilos, litres.`, mitja: `És una cosa petita o gran?` }, ...apartats(its),
    explicacio: `Tria la unitat que dona un número còmode: ni milers ni zero coma zero.`, solucio: its.map(it => `${it.f[0].toUpperCase() + it.f.slice(1)}: <b>${it.u}</b>.`) };
};
/* D · Sense dibuix: quina mesura és raonable? */
M1.raonable = (nv, { n = 3 } = {}) => {
  const llargs = msObjs(x => nv === 1 ? x.ref === 'robot' : true).map(o => ({ mag: 'L', f: `${o.nom[0].toUpperCase() + o.nom.slice(1)} fa ${o.dim}…`, v: o.real * MS_BASE[o.u], nom: o.nom }));
  const coses = MS_COSES.map(c => ({ mag: c.mag, f: `<span class="ms-sit">${c.ico}</span> ${c.nom[0].toUpperCase() + c.nom.slice(1)} ${c.mag === 'M' ? 'pesa' : 'té'}…`, v: c.v, nom: c.nom }));
  const tr = barreja([...barreja(llargs).slice(0, 2), ...barreja(coses).slice(0, 3)]).slice(0, n);
  const its = tr.map(x => { const { bona, mals } = msOpcionsAbs(x.mag, x.v); const ops = [bona, ...mals.slice(0, 2)].sort((a, b) => a.v - b.v);
    return { tipus: 'tria', llarg: true, html: x.f, opcions: ops.map(o => ({ html: `<b>${o.t}</b>`, val: o.t })), correcta: bona.t, etiq: Object.fromEntries(ops.filter(o => o !== bona).map(o => [o.t, o.v > x.v ? 'mGran' : 'mPetit'])), nom: x.nom, bo: bona.t }; });
  return { sig: `r-${tr.map(x => x.nom).join('|')}`, enunciat: `Ara sense dibuix: quina mesura té sentit?`, visual: null, pista: PISTA_M1, ...apartats(its),
    explicacio: `Imagina't la cosa al costat d'un referent que coneixes.`, solucio: its.map(it => `${it.nom[0].toUpperCase() + it.nom.slice(1)}: <b>${it.bo}</b>.`) };
};
const msRefsHtml = petit => petit
  ? `<div class="ms-refs"><div><i>✋</i>un pam<b>20 cm</b></div><div><i>☝️</i>l'ample d'un dit<b>1 cm</b></div><div><i>📄</i>un full (alt)<b>30 cm</b></div></div>`
  : `<div class="ms-refs"><div>${robot(46)}FR-4C<b>1 m</b></div><div><i>🚪</i>una porta<b>2 m</b></div><div><i>✋</i>un pam<b>20 cm</b></div><div>${msPaquet(30)}paquet de sucre<b>1 kg</b></div><div>${msBric(30)}bric de llet<b>1 L</b></div><div><i>🥫</i>una llauna<b>33 cL</b></div></div>`;
const msUnitatsHtml = () => `<div class="ms-refs"><div>${msIco('L')}llargada<b>mm · cm · m · km</b></div><div>${msIco('M')}pes (massa)<b>g · kg</b></div><div>${msIco('C')}líquids<b>mL · L</b></div></div>`;
const msEscenaAnim = (ob, v0, v1) => msEscenaSvg(ob, v0, '', 'ms-creix-anim').replace('<svg ', `<svg style="--k0:${msGeo(ob, v0).k};--k1:${msGeo(ob, v1).k}" `).replace(/<g class="ms-dim">.*?<\/g><\/svg>/s, '</svg>');
TEMES.m1 = {
  gen: M1,
  sequencia: {
    1: [['creix'], ['absurd', { mag: 'L' }], ['eina', { n: 3 }], ['creix'], ['absurd', { mag: 'M' }], ['unitat', { n: 3 }], ['absurd', { mag: 'C' }], ['raonable', { n: 3 }]],
    2: [['creix'], ['absurd', { mag: 'M' }], ['creix', { petit: true }], ['unitat', { n: 3 }], ['absurd', { mag: 'L' }], ['creix', { petit: true }], ['absurd', { mag: 'C' }], ['raonable', { n: 4 }]],
    3: [['creix', { petit: true }], ['absurd', { mag: 'C' }], ['unitat', { n: 4 }], ['creix'], ['absurd', { mag: 'M' }], ['creix', { petit: true }], ['raonable', { n: 4 }], ['raonable', { n: 4 }]]
  },
  explicacio: [
    { text: `<p>Abans de mesurar res, pregunta't: <b class="parpelleja">quina mida té sentit?</b></p><p class="petit">Una porta de 20 m? Impossible! Seria com un edifici de sis pisos.</p>`, vis: () => msEscenaAnim(MS_OBJ[0], 2, 7) },
    { text: `<p>Per saber-ho necessites <b class="parpelleja">referents</b>: coses que ja coneixes.</p><p class="petit">FR-4C fa <b>1 m</b>. Una porta fa <b>2 m</b>. Un pam teu, uns <b>20 cm</b>.</p>`, vis: () => msRefsHtml(false) },
    { text: `<p>Per al pes i els líquids, pensa en el súper.</p><p class="petit">Un paquet de sucre pesa <b>1 kg</b>. Un bric de llet fa <b>1 L</b>. Un mòbil pesa uns 200 g.</p>`, vis: () => `<div class="ms-pila">${msPilaHtml('M', 5, { ico: '🍉' }, 'Una síndria de 5&nbsp;kg')}</div>` },
    { text: `<p>Cada cosa, amb la seva <b class="parpelleja">unitat</b>.</p><p class="petit">Coses petites: mm, cm, g, mL. Coses grans: m, km, kg, L.</p>`, vis: () => msUnitatsHtml() }
  ],
  exemple: nv => {
    const ob = MS_OBJ.find(o => o.id === (nv === 1 ? 'porta' : nv === 2 ? 'llapis' : 'cotxe'));
    if (nv === 1) return { enunciat: `FR-4C diu que una porta fa 20 cm d'alçada. Pot ser?`, passos: [
      { text: `Mira-la al costat de FR-4C, que fa <b>1 m</b>: una porta de 20 cm li arribaria als peus!`, vis: msEscenaSvg(ob, .2, '20&nbsp;cm') },
      { text: `Per una porta hi ha de passar una persona: ha de fer el doble que FR-4C. Són <b>2 m</b>. <span class="marca-ok">✓</span>`, vis: msEscenaSvg(ob, 2) }] };
    if (nv === 2) return { enunciat: `Quant fa de llarg un llapis nou: 17 mm, 17 cm o 17 m?`, passos: [
      { text: `Compara'l amb un <b>pam</b>, que fa uns 20 cm. Un llapis és una mica més curt que un pam.`, vis: msEscenaSvg(ob, 17) },
      { text: `17 mm seria com una ungla, i 17 m, com un autobús. La bona és <b>17 cm</b>. <span class="marca-ok">✓</span>`, vis: msRefsHtml(true) }] };
    return { enunciat: `Un cotxe fa 4 m o 40 m de llargada?`, passos: [
      { text: `Posa FR-4C (1 m) al costat: en un cotxe hi caben uns 4 robots estirats.`, vis: msEscenaSvg(ob, 4) },
      { text: `40 m seria com quatre autobusos en fila. La mesura que té sentit és <b>4 m</b>. <span class="marca-ok">✓</span>`, vis: msEscenaSvg(ob, 15, '40&nbsp;m?') }] };
  }
};

/* =====================================================================
   OBJECTIU 2 · LLEGIR INSTRUMENTS (regle, gerra graduada i bàscula d'agulla)
   ===================================================================== */
const PISTA_M2 = { completa: `Abans de llegir, mira <b>quant val cada ratlleta</b>: compta quantes n'hi ha entre dos números seguits. Al regle, cada ratlleta petita és 1 mm i cada número, 1 cm (10 mm).`, mitja: `Quant val cada ratlleta?` };
/* ---------- Regle ---------- */
const MS_RG = { X: 26, PPC: 32, Y: 96, W: 540, H: 168 };
const MS_COSA = { llapis: ['el llapis', 'El llapis'], cargol: ['el cargol', 'El cargol'], tira: ['la tira de paper', 'La tira de paper'] };
function msCosaSvg(tipus, xa, xb) {
  if (tipus === 'cargol') { let rosca = ''; for (let x = xa + 16; x < xb - 12; x += 7) rosca += `M${x} 55L${x + 4} 67`;
    return `<rect x="${xa + 10}" y="55" width="${xb - xa - 20}" height="12" fill="#ddd" stroke="${MS_N}" stroke-width="2.5"/><path d="${rosca}" stroke="${MS_N}" stroke-width="1.5"/><path d="M${xb - 10} 55L${xb} 61L${xb - 10} 67Z" fill="#ddd" stroke="${MS_N}" stroke-width="2.5" stroke-linejoin="round"/><rect x="${xa}" y="46" width="10" height="30" rx="2.5" fill="${T}" stroke="${MS_N}" stroke-width="2.5"/>`; }
  if (tipus === 'tira') return `<rect x="${xa}" y="50" width="${xb - xa}" height="22" fill="#ffe3b8" stroke="${MS_N}" stroke-width="2.5"/>`;
  return `<rect x="${xa}" y="50" width="12" height="22" rx="3" fill="#fff" stroke="${MS_N}" stroke-width="2.5"/><rect x="${xa + 12}" y="50" width="${Math.max(2, xb - xa - 32)}" height="22" fill="${T}" stroke="${MS_N}" stroke-width="2.5"/><path d="M${xb - 20} 50L${xb} 61L${xb - 20} 72Z" fill="#f3d9b1" stroke="${MS_N}" stroke-width="2.5" stroke-linejoin="round"/><path d="M${xb - 7} 57.2L${xb} 61L${xb - 7} 64.8Z" fill="${MS_N}"/>`;
}
function msReglaSvg({ r0 = 0, n = 15, xa, xb, tipus = 'llapis', off = 0 }) {
  const R = MS_RG; let t = '';
  for (let mm = 0; mm <= n * 10; mm++) t += `M${R.X + mm * R.PPC / 10} ${R.Y}v${mm % 10 === 0 ? 20 : mm % 5 === 0 ? 14 : 8}`;
  const nums = Array.from({ length: n + 1 }, (_, c) => `<text x="${R.X + c * R.PPC}" y="${R.Y + 38}" text-anchor="middle" font-size="15" font-weight="800" fill="${MS_N}">${r0 + c}</text>`).join('');
  const xf = R.X + n * R.PPC + 16, yb = R.Y + 56;
  const cos = r0 > 0 ? `<path d="M${R.X - 8} ${R.Y}l7 9l-7 9l7 10l-7 9l7 10l-7 9L${xf} ${yb}L${xf} ${R.Y}Z" fill="#ffe3b8" stroke="${MS_N}" stroke-width="2.5" stroke-linejoin="round"/>` : `<rect x="${R.X - 14}" y="${R.Y}" width="${xf - R.X + 14}" height="56" rx="4" fill="#ffe3b8" stroke="${MS_N}" stroke-width="2.5"/>`;
  return `<svg class="ms-esc" viewBox="0 0 ${R.W} ${R.H}" role="img" aria-label="Un regle i ${MS_COSA[tipus][0]}"><path d="M${xa} 78V${R.Y + 22}M${xb} 78V${R.Y + 22}" stroke="${T}" stroke-width="2" stroke-dasharray="4 4" fill="none"/>
    <g class="ms-reg" style="transform:translateX(${off}px)">${cos}<path d="${t}" stroke="${MS_N}" stroke-width="1.6" fill="none"/>${nums}<text x="${xf - 6}" y="${yb - 5}" text-anchor="end" font-size="12" font-weight="800" fill="${MS_N}">cm</text></g>
    <path d="M${xa} 78V${R.Y + 22}M${xb} 78V${R.Y + 22}" stroke="${T}" stroke-width="2" stroke-dasharray="4 4" fill="none" opacity=".55"/>${msCosaSvg(tipus, xa, xb)}</svg>`;
}
const M2 = {};
M2.regla = (nv, { mode = 'zero' } = {}) => {
  const R = MS_RG, tipus = tria(['llapis', 'cargol', 'tira']), [nomc, Nomc] = MS_COSA[tipus];
  let r0 = 0, aC = 0, Lmm, s = 0, uni = 'cm';
  if (mode === 'mou') { s = msR(3, 8) / 2; Lmm = msR(3, 9) * 10; } // el regle està mal posat: cal moure'l (passos de mig centímetre)
  else if (mode === 'trencat') { r0 = msR(2, 5); aC = r0 + (nv === 3 ? msR(11, 34) / 10 : msR(1, 3)); do Lmm = msR(23, 84); while (Lmm % 10 === 0 || (Math.round(aC * 10) + Lmm) % 10 === 0); if (nv === 3) uni = 'mm'; }
  else { if (nv === 1) Lmm = msR(3, 13) * 10; else { do Lmm = msR(24, 137); while (Lmm % 10 === 0); if (nv === 3) uni = 'mm'; } }
  const val = uni === 'mm' ? Lmm : Lmm / 10; const finalC = aC + Lmm / 10; // lectura on acaba, en cm
  const xa = R.X + (mode === 'mou' ? s : aC - r0) * R.PPC, xb = xa + Lmm * R.PPC / 10;
  const n = mode === 'trencat' ? 14 : 15, mig = R.PPC / 2;
  const lectura = G => mode === 'mou' ? s + Lmm / 10 - (G.off || 0) / 2 : finalC;
  const enun = mode === 'mou' ? `El regle està mal posat. Mou-lo fins que el <b>0</b> quedi a l'inici i mesura <b>${nomc}</b>.` : mode === 'trencat' ? `El regle està trencat i no comença al 0. Quant fa <b>${nomc}</b>${uni === 'mm' ? ', en <b>mil·límetres</b>' : ''}?` : `Quant fa <b>${nomc}</b>${uni === 'mm' ? ', en <b>mil·límetres</b>' : nv > 1 ? ' (amb decimals, si cal)' : ''}?`;
  const sol = mode === 'trencat' ? [`Comença al ${fmtDec(aC)} i acaba al ${fmtDec(finalC)}.`, `${fmtDec(finalC)} − ${fmtDec(aC)} = ${fmtDec(Lmm / 10)} cm${uni === 'mm' ? ` = <b>${Lmm} mm</b>` : ''}.`] : mode === 'mou' ? [`Mou el regle fins que el 0 quedi just a l'inici.`, `Ara ${nomc} acaba al <b>${Lmm / 10}</b>: fa ${Lmm / 10} cm.`] : [`Comença al 0 i acaba al ${fmtDec(Lmm / 10)}.`, uni === 'mm' ? `${fmtDec(Lmm / 10)} cm són <b>${Lmm} mm</b> (cada ratlleta és 1 mm).` : `Fa <b>${fmtDec(Lmm / 10)} cm</b>.`];
  return { sig: `g-${mode}-${tipus}-${r0}-${aC}-${Lmm}-${s}`, enunciat: enun, visual: null, pista: PISTA_M2,
    ...msGiny({
      inici: () => ({ off: 0, n: '' }),
      munta(z, G, ctx) {
        z.innerHTML = `<div class="ms-g">${msReglaSvg({ r0, n, xa, xb, tipus })}
          ${mode === 'mou' ? `<div class="ms-ctl"><button data-m="-1">◀ Mou el regle</button><button data-m="1">Mou el regle ▶</button></div>` : ''}
          ${msEntrada(`${Nomc} fa`, uni)}<p class="ms-nota">${mode === 'mou' ? 'Clica els botons per moure el regle. ' : ''}Els decimals, amb coma: 4,5.</p></div>`;
        const inp = msEnllacaEnt(z, G, ctx);
        G.mou = d => { const o = Math.max(0, Math.min(12, G.off + d)); if (o === G.off) return; G.off = o; so('clic'); $('.ms-reg', z).style.transform = `translateX(${o * mig}px)`; };
        z.onclick = e => { const b = e.target.closest('[data-m]'); if (b && ctx.actiu()) G.mou(Number(b.dataset.m)); };
        if (mode !== 'mou') inp.focus();
      },
      fet: G => llegeixDec(G.n) != null, ok: G => decIgual(llegeixDec(G.n), val), txt: G => `${nomc}: ${G.n} ${uni}`,
      etiq: G => { const x = llegeixDec(G.n); const fin = lectura(G) * (uni === 'mm' ? 10 : 1);
        return decIgual(x, fin) ? (mode === 'mou' ? 'mNoZero' : 'mNoResta') : decIgual(x, val * 10) || decIgual(x, val / 10) ? 'mMmCm' : null; },
      tanca(z, G, ok) { msTancaEnt(z, ok); if (!ok && mode === 'mou') setTimeout(() => { if (z.isConnected) $('.ms-reg', z).style.transform = `translateX(${s * R.PPC}px)`; }, 600); },
      demo: resolt => msReglaSvg({ r0, n, xa, xb, tipus, off: resolt && mode === 'mou' ? s * R.PPC : 0 }),
      resol(z, G, be) { if (mode === 'mou' && be) G.mou(s * 2); const inp = $('[data-ms-n]', z); inp.value = fmtDec(be ? val : mode === 'zero' ? val + 1 : lectura(G) * (uni === 'mm' ? 10 : 1)).replace(/\s/g, ''); inp.oninput(); }
    }, `<b>${msU(val, uni)}</b>`),
    explicacio: mode === 'trencat' ? `On acaba menys on comença: ${fmtDec(finalC)} − ${fmtDec(aC)} = ${fmtDec(Lmm / 10)} cm.` : `Amb el 0 a l'inici, es llegeix on acaba: ${msU(val, uni)}.`, solucio: sol };
};
/* ---------- Gerra graduada (plena de suc de taronja) ---------- */
const MS_GE = { yB: 282, hM: 214 };
const msGy = (v, max) => MS_GE.yB - v / max * MS_GE.hM;
const msGLab = (v, uni) => uni === 'L' ? fmtDec(v / 1000) : String(v);
function msGerraSvg({ max, maj, min, uni, v = 0, marca = null }) {
  let t = '', labs = '';
  for (let x = min; x <= max; x += min) { const y = msGy(x, max), gran = x % maj === 0; t += `M88 ${y}h${gran ? 30 : 15}`; if (gran) labs += `<text x="124" y="${y + 5}" font-size="14" font-weight="800" fill="${MS_N}">${msGLab(x, uni)}</text>`; }
  const y = msGy(v, max);
  return `<svg class="ms-esc ms-gerra" viewBox="0 0 300 296" role="img" aria-label="Una gerra graduada en ${uni === 'L' ? 'litres' : 'mil·lilitres'}">
    <rect x="132" y="0" width="36" height="12" rx="3" fill="${MS_N}"/><rect x="143" y="12" width="14" height="9" fill="${MS_N}"/>
    <rect class="ms-raig" x="146" y="21" width="8" height="${Math.max(0, y - 21)}" fill="#f7a23b" style="opacity:0"/>
    <rect class="ms-liq" x="88" y="${y}" width="124" height="${MS_GE.yB - y}" fill="#f7a23b"/>
    <path d="${t}" stroke="${MS_N}" stroke-width="2" fill="none"/>${labs}<text x="206" y="56" text-anchor="end" font-size="15" font-weight="900" fill="${MS_N}">${uni}</text>
    <path d="M214 84Q268 84 268 142Q268 200 214 200" fill="none" stroke="${MS_N}" stroke-width="7"/>
    <path d="M74 26L86 36L86 270Q86 284 100 284L200 284Q214 284 214 270L214 30" fill="none" stroke="${MS_N}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
    ${marca != null ? `<path d="M60 ${msGy(marca, max)}H222" stroke="#1d8a4a" stroke-width="3" stroke-dasharray="6 4"/><text x="58" y="${msGy(marca, max) + 5}" text-anchor="end" font-size="13" font-weight="900" fill="#1d8a4a">aquí</text>` : ''}</svg>`;
}
const msGerraPosa = (z, max, v) => { const y = msGy(v, max); const l = $('.ms-liq', z); l.setAttribute('y', y); l.setAttribute('height', MS_GE.yB - y); $('.ms-raig', z).setAttribute('height', Math.max(0, y - 21)); };
// escales segons el nivell (tot en mL per dins) i objectius escrits com a la vida real
function msEscalaGerra(nv) {
  const A = { max: 1000, maj: 100, min: 50, uni: 'mL', fi: 10 }, B = { max: 1000, maj: 250, min: 50, uni: 'mL', fi: 10 }, C = { max: 2000, maj: 500, min: 100, uni: 'L', fi: 20 };
  const E = nv === 1 ? A : tria([B, C]); let obj, txt;
  if (nv === 1) { obj = msR(3, 19) * 50; txt = `${obj} mL`; }
  else if (nv === 2) { do obj = msR(2, 19) * E.min; while (obj % E.maj === 0); txt = E.uni === 'L' ? `${fmtDec(obj / 1000)} L` : `${obj} mL`; }
  else if (E.uni === 'mL') { const op = tria([[250, 'un quart de litre'], [500, 'mig litre'], [750, 'tres quarts de litre'], [400, '0,4 L'], [650, '0,65 L'], [350, '35 cL'], [850, '85 cL'], [150, '0,15 L']]); obj = op[0]; txt = op[1]; }
  else { const op = tria([[1200, '1200 mL'], [700, '700 mL'], [1500, '150 cL'], [900, '90 cL'], [1800, '1800 mL'], [300, '30 cL']]); obj = op[0]; txt = op[1]; }
  return { E, obj, txt };
}
M2.gerra = nv => {
  const { E, obj, txt } = msEscalaGerra(nv); const vel = E.max / 5.5; // mL per segon
  return { sig: `j-${E.max}-${E.maj}-${obj}`, enunciat: `Obre l'aixeta i omple la gerra amb <b>${txt}</b> de suc de taronja.`, visual: null, pista: PISTA_M2,
    ...msGiny({
      inici: () => ({ v: 0, obert: false, mogut: false }),
      munta(z, G, ctx) {
        z.innerHTML = `<div class="ms-g">${msGerraSvg(E)}<div class="ms-ctl"><button class="fort" data-a="aixeta">Obre l'aixeta</button><button data-a="-1" title="Treu-ne una mica">− una mica</button><button data-a="1" title="Afegeix-ne una mica">+ una mica</button><button data-a="buida">Buida-la</button></div>
          <p class="ms-nota">Clica per obrir l'aixeta i torna a clicar per tancar-la. Afina amb «una mica».</p></div>`;
        const ba = $('[data-a=aixeta]', z); let t0 = 0, tSo = 0;
        const pinta = () => { msGerraPosa(z, E.max, G.v); $('.ms-raig', z).style.opacity = G.obert ? 1 : 0; ba.textContent = G.obert ? 'Tanca l\'aixeta' : 'Obre l\'aixeta'; ba.classList.toggle('obert', G.obert); ctx.canvi(); };
        const tanca = () => { G.obert = false; G.v = Math.min(E.max, Math.round(G.v / E.fi) * E.fi); pinta(); };
        const pas = t => { if (!G.obert || !z.isConnected || !ctx.actiu()) { if (G.obert) tanca(); return; }
          G.v = Math.min(E.max, G.v + vel * (t - t0) / 1000); t0 = t; if (t - tSo > 170) { tSo = t; so('gota', 420 + 900 * G.v / E.max); }
          if (G.v >= E.max) return tanca(); msGerraPosa(z, E.max, G.v); requestAnimationFrame(pas); };
        z.onclick = e => { const b = e.target.closest('[data-a]'); if (!b || !ctx.actiu()) return; const a = b.dataset.a; G.mogut = true;
          if (a === 'aixeta') { if (G.obert) return tanca(); if (G.v >= E.max) return; G.obert = true; t0 = tSo = performance.now(); pinta(); requestAnimationFrame(pas); return; }
          if (G.obert) tanca();
          if (a === 'buida') { G.v = 0; so('treu'); } else { G.v = Math.max(0, Math.min(E.max, G.v + Number(a) * E.fi)); so('gota', 420 + 900 * G.v / E.max); }
          pinta(); };
        G.posa = v => { G.v = v; G.obert = false; G.mogut = true; pinta(); };
      },
      fet: G => G.mogut && !G.obert && G.v > 0, ok: G => Math.abs(G.v - obj) <= E.fi + 1e-9, txt: G => `omple fins a ${msGLab(Math.round(G.v), E.uni)} ${E.uni} (calia ${txt})`,
      etiq: G => Math.abs(G.v - obj) > E.min * .9 ? 'mRatlla' : null,
      tanca(z, G, ok) { msTancaEnt(z, ok); if (!ok) $('.ms-gerra', z).outerHTML = msGerraSvg({ ...E, v: G.v, marca: obj }); },
      demo: resolt => msGerraSvg({ ...E, v: resolt ? obj : 0 }),
      resol(z, G, be) { G.posa(be ? obj : (obj + 3 * E.min <= E.max ? obj + 3 * E.min : obj - 3 * E.min)); }
    }, `<b>${txt}</b> (${E.uni === 'L' ? `la ratlla de ${fmtDec(obj / 1000)}` : `la ratlla de ${obj}`}: cada ratlleta val ${E.uni === 'L' ? `${fmtDec(E.min / 1000)} L` : `${E.min} mL`})`),
    explicacio: `Cada ratlleta d'aquesta gerra val ${E.uni === 'L' ? `${fmtDec(E.min / 1000)} L` : `${E.min} mL`}.`,
    solucio: [`Entre dos números hi ha ${E.maj / E.min} ratlletes: cada una val ${E.uni === 'L' ? `${fmtDec(E.min / 1000)} L` : `${E.min} mL`}.`, `Cal arribar a <b>${txt}</b>${txt.includes(' mL') && E.uni === 'mL' || txt.includes(' L') && E.uni === 'L' ? '' : `, que són ${E.uni === 'L' ? `${fmtDec(obj / 1000)} L` : `${obj} mL`}`}.`] };
};
// lectures equivocades típiques: comptar cada ratlleta com si valgués 1, 10, 100…
function msErrsLectura(v, maj, min, conv) { const base = Math.floor(v / maj) * maj, k = Math.round((v - base) / min); if (!k) return [];
  return [1, 10, 25, 50, 100, 200, 250, 500].filter(m => m !== min).map(m => [conv(base + k * m), 'mRatlla']); }
M2.llegeixGerra = nv => {
  const { E } = msEscalaGerra(nv === 1 ? 1 : 2); let v; do v = msR(2, Math.round(E.max / E.min) - 1) * E.min; while (nv > 1 && v % E.maj === 0);
  const uni = nv === 3 ? (E.uni === 'L' ? 'mL' : 'L') : E.uni; const conv = x => uni === 'L' ? x / 1000 : x; const val = conv(v);
  const it = { tipus: 'dec', llarg: true, html: `A la gerra hi ha…`, valor: val, unitat: uni, errs: [...msErrsLectura(v, E.maj, E.min, conv), ...(nv === 3 ? [[uni === 'L' ? v : v / 1000, 'mSentit']] : [])] };
  return { sig: `lj-${E.max}-${E.maj}-${v}-${uni}`, enunciat: `Quant suc hi ha a la gerra? Escriu-ho en <b>${uni === 'L' ? 'litres' : 'mil·lilitres'}</b>.`, visual: () => msGerraSvg({ ...E, v }), pista: PISTA_M2, ...apartats([it]),
    explicacio: `Cada ratlleta val ${E.uni === 'L' ? `${fmtDec(E.min / 1000)} L` : `${E.min} mL`}: hi ha ${msU(val, uni)}.`,
    solucio: [`Entre dos números hi ha ${E.maj / E.min} ratlletes: cada una val ${E.uni === 'L' ? `${fmtDec(E.min / 1000)} L` : `${E.min} mL`}.`, `El suc arriba a <b>${msGLab(v, E.uni)} ${E.uni}</b>${uni !== E.uni ? `, que són <b>${msU(val, uni)}</b>` : ''}.`] };
};
/* ---------- Bàscula d'agulla ---------- */
const MS_BA = { cx: 150, cy: 180, R: 94 };
const msBang = (v, max) => -125 + 250 * v / max;
function msBasculaSvg({ max, maj, min, v = 0, fruita = '', uniTxt = 'kg' }) {
  const B = MS_BA, p = (a, r) => { const t = a * Math.PI / 180; return [B.cx + r * Math.sin(t), B.cy - r * Math.cos(t)]; };
  let t = '', labs = '';
  for (let x = 0; x <= max; x += min) { const a = msBang(x, max), gran = x % maj === 0, mitja = !gran && x % (maj / 2) === 0 && maj / min > 5; const [x1, y1] = p(a, B.R - 4), [x2, y2] = p(a, B.R - (gran ? 20 : mitja ? 15 : 10)); t += `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
    if (gran) { const [lx, ly] = p(a, B.R - 34); labs += `<text x="${lx.toFixed(1)}" y="${(ly + 5).toFixed(1)}" text-anchor="middle" font-size="${max / maj > 6 ? 13 : 15}" font-weight="800" fill="${MS_N}">${fmtDec(x / 1000)}</text>`; } }
  return `<svg class="ms-esc ms-bascula" viewBox="0 0 300 290" role="img" aria-label="Una bàscula d'agulla en quilos">
    <text class="ms-fruita" x="150" y="50" text-anchor="middle" font-size="22">${fruita}</text><rect x="52" y="56" width="196" height="11" rx="5.5" fill="${MS_N}"/><rect x="142" y="66" width="16" height="16" fill="${MS_N}"/>
    <circle cx="${B.cx}" cy="${B.cy}" r="${B.R + 6}" fill="#fff" stroke="${MS_N}" stroke-width="5"/><path d="${t}" stroke="${MS_N}" stroke-width="2" fill="none"/>${labs}
    <text x="${B.cx}" y="${B.cy + 52}" text-anchor="middle" font-size="17" font-weight="900" fill="${MS_N}">${uniTxt}</text>
    <g class="ms-agulla" style="transform-origin:${B.cx}px ${B.cy}px;transform:rotate(${msBang(v, max)}deg)"><path d="M${B.cx} ${B.cy + 14}L${B.cx} ${B.cy - B.R + 16}" stroke="${T}" stroke-width="5" stroke-linecap="round"/></g><circle cx="${B.cx}" cy="${B.cy}" r="8" fill="${MS_N}"/></svg>`;
}
function msEscalaBascula(nv) {
  if (nv === 1) return { max: 10000, maj: 1000, min: 500, fr: [['🍉', 1000], ['🍍', 500]] };
  if (nv === 2) return { max: 5000, maj: 1000, min: 100, fr: [['🍉', 1000], ['🍍', 500], ['🍎', 100]] };
  return { max: 2000, maj: 500, min: 50, fr: [['🍍', 500], ['🍎', 100], ['🍓', 50]] };
}
const msKg = g => `${fmtDec(g / 1000)}&nbsp;kg`;
M2.bascula = nv => {
  const E = msEscalaBascula(nv); let obj; do obj = msR(2, E.max / E.min - 2) * E.min; while (nv > 1 && obj % (nv === 2 ? 500 : 100) === 0);
  const txt = nv === 3 ? `${obj}&nbsp;g` : msKg(obj); const fruites = G => G.its.slice(-13).map(i => E.fr[i][0]).join('') + (G.its.length > 13 ? '…' : '');
  return { sig: `b-${E.max}-${obj}`, enunciat: `Posa fruita a la bàscula fins que marqui <b>${txt}</b>.`, visual: null, pista: PISTA_M2,
    ...msGiny({
      inici: () => ({ its: [], v: 0 }),
      munta(z, G, ctx) {
        z.innerHTML = `<div class="ms-g">${msBasculaSvg(E)}<div class="ms-ctl">${E.fr.map((f, i) => `<button data-f="${i}" title="Afegeix-ne una">＋ ${f[0]}</button>`).join('')}<button data-f="treu" title="Treu l'última">↩ Treu</button><button data-f="buida">Buida</button></div>
          <p class="ms-nota">Cada fruita pesa diferent: afegeix-ne i mira l'agulla.</p></div>`;
        const pinta = () => { $('.ms-agulla', z).style.transform = `rotate(${msBang(G.v, E.max)}deg)`; $('.ms-fruita', z).textContent = fruites(G); ctx.canvi(); };
        G.fes = a => { if (a === 'buida') { if (!G.its.length) return; G.its = []; so('treu'); } else if (a === 'treu') { if (!G.its.length) return; G.its.pop(); so('treu'); }
          else { if (G.v + E.fr[a][1] > E.max) return so('ko'); G.its.push(Number(a)); so('pes'); }
          G.v = G.its.reduce((s, i) => s + E.fr[i][1], 0); pinta(); };
        z.onclick = e => { const b = e.target.closest('[data-f]'); if (b && ctx.actiu()) G.fes(b.dataset.f); };
      },
      fet: G => G.v > 0, ok: G => G.v === obj, txt: G => `posa ${textPla(nv === 3 ? `${G.v} g` : msKg(G.v))} (calia ${textPla(txt)})`, etiq: () => 'mRatlla',
      tanca(z, G, ok) { msTancaEnt(z, ok); },
      demo: resolt => msBasculaSvg({ ...E, v: resolt ? obj : 0 }),
      resol(z, G, be) { let falta = be ? obj : obj + E.min; for (let i = 0; i < E.fr.length; i++) while (falta >= E.fr[i][1]) { G.fes(i); falta -= E.fr[i][1]; } }
    }, `<b>${txt}</b>${nv === 3 ? ` (${msKg(obj)})` : ''}: cada ratlleta val ${E.min >= 1000 ? msKg(E.min) : `${E.min}&nbsp;g`}`),
    explicacio: `Cada ratlleta d'aquesta bàscula val ${E.min} g.`,
    solucio: [`Entre dos números hi ha ${E.maj / E.min} ratlletes: cada una val ${E.min} g.`, `L'agulla ha de quedar a <b>${msKg(obj)}</b>${nv === 3 ? `, que són ${obj} g` : ''}.`] };
};
M2.llegeixBascula = nv => {
  const E = msEscalaBascula(nv); let v; do v = msR(2, E.max / E.min - 2) * E.min; while (nv > 1 && v % E.maj === 0);
  const uni = nv === 3 ? 'g' : 'kg', conv = x => uni === 'g' ? x : x / 1000;
  const it = { tipus: 'dec', llarg: true, html: `La bàscula marca…`, valor: conv(v), unitat: uni, errs: [...msErrsLectura(v, E.maj, E.min, conv), ...(nv === 3 ? [[v / 1000, 'mSentit']] : [])] };
  return { sig: `lb-${E.max}-${v}`, enunciat: `Quant pesa la fruita? Escriu-ho en <b>${uni === 'g' ? 'grams' : 'quilos'}</b>.`, visual: () => msBasculaSvg({ ...E, v, fruita: '🍊🍎🍐' }), pista: PISTA_M2, ...apartats([it]),
    explicacio: `Cada ratlleta val ${E.min} g: marca ${msKg(v)}.`, solucio: [`Entre dos números hi ha ${E.maj / E.min} ratlletes: cada una val ${E.min} g.`, `L'agulla marca <b>${msKg(v)}</b>${uni === 'g' ? `, que són <b>${v} g</b>` : ''}.`] };
};
TEMES.m2 = {
  gen: M2,
  sequencia: {
    1: [['regla', { mode: 'mou' }], ['gerra'], ['bascula'], ['regla', { mode: 'zero' }], ['gerra'], ['bascula'], ['llegeixGerra'], ['llegeixBascula']],
    2: [['regla', { mode: 'trencat' }], ['gerra'], ['bascula'], ['regla', { mode: 'zero' }], ['llegeixGerra'], ['regla', { mode: 'trencat' }], ['bascula'], ['llegeixBascula']],
    3: [['regla', { mode: 'trencat' }], ['gerra'], ['bascula'], ['regla', { mode: 'zero' }], ['llegeixGerra'], ['gerra'], ['llegeixBascula'], ['regla', { mode: 'trencat' }]]
  },
  explicacio: [
    { text: `<p>Per mesurar amb el regle, posa el <b class="parpelleja">0</b> just on comença l'objecte.</p><p class="petit">Si comences a l'1, et sobrarà un centímetre!</p>`, vis: () => msReglaSvg({ xa: MS_RG.X, xb: MS_RG.X + 6 * MS_RG.PPC }) },
    { text: `<p>Cada número és <b>1 cm</b>. Cada ratlleta petita és <b class="parpelleja">1 mm</b>.</p><p class="petit">1 cm = 10 mm. Aquest cargol fa 4 cm i 7 mm: 4,7 cm, o 47 mm.</p>`, vis: () => msReglaSvg({ xa: MS_RG.X, xb: MS_RG.X + 4.7 * MS_RG.PPC, tipus: 'cargol' }) },
    { text: `<p>A la gerra i a la bàscula, primer mira <b class="parpelleja">quant val cada ratlleta</b>.</p><p class="petit">Aquí, de 500 a 750 hi ha 5 ratlletes: cada una val 50 mL. El suc arriba a 600 mL.</p>`, vis: () => msGerraSvg({ max: 1000, maj: 250, min: 50, uni: 'mL', v: 600 }) },
    { text: `<p>A la bàscula, l'agulla assenyala el pes.</p><p class="petit">Entre l'1 i el 2 hi ha 10 ratlletes: cada una val 100 g. L'agulla marca <b>1,3 kg</b>.</p>`, vis: () => msBasculaSvg({ ...msEscalaBascula(2), v: 1300, fruita: '🍉🍎🍎🍎' }) }
  ],
  exemple: nv => {
    if (nv === 1) return { enunciat: `Quant fa el llapis?`, passos: [
      { text: `El 0 del regle és a l'inici del llapis. Bé!`, vis: msReglaSvg({ xa: MS_RG.X, xb: MS_RG.X + 7 * MS_RG.PPC }) },
      { text: `La punta arriba al 7: el llapis fa <b>7 cm</b>. <span class="marca-ok">✓</span>`, vis: msReglaSvg({ xa: MS_RG.X, xb: MS_RG.X + 7 * MS_RG.PPC }) }] };
    if (nv === 2) return { enunciat: `El regle està trencat. Quant fa la tira?`, passos: [
      { text: `Comença al <b>4</b> i acaba al <b>9,3</b>.`, vis: msReglaSvg({ r0: 3, n: 14, xa: MS_RG.X + MS_RG.PPC, xb: MS_RG.X + 6.3 * MS_RG.PPC, tipus: 'tira' }) },
      { text: `Resta: 9,3 − 4 = <b>5,3 cm</b>. <span class="marca-ok">✓</span>`, vis: msReglaSvg({ r0: 3, n: 14, xa: MS_RG.X + MS_RG.PPC, xb: MS_RG.X + 6.3 * MS_RG.PPC, tipus: 'tira' }) }] };
    return { enunciat: `Omple la gerra amb 35 cL.`, passos: [
      { text: `La gerra va en mL: 35 cL són <b>350 mL</b>.`, vis: msGerraSvg({ max: 1000, maj: 250, min: 50, uni: 'mL', v: 0 }) },
      { text: `Cada ratlleta val 50 mL: 350 és dues ratlletes després del 250. <span class="marca-ok">✓</span>`, vis: msGerraSvg({ max: 1000, maj: 250, min: 50, uni: 'mL', v: 350 }) }] };
  }
};

/* =====================================================================
   OBJECTIU 3 · CANVIAR D'UNITAT: ELS SALTS DE LA XULETA
   Cap a la dreta (unitats més petites) cada salt és ×10; cap a l'esquerra, ÷10.
   ===================================================================== */
const PISTA_M3 = { completa: `Busca les dues unitats a la xuleta i <b>compta els salts</b>. Cap a la dreta, cada salt és <b>×10</b>; cap a l'esquerra, <b>÷10</b>. De m a cm hi ha 2 salts: ×100.`, mitja: `Compta els salts. Dreta: ×10. Esquerra: ÷10.` };
const MS_ESC = { // k: zeros de cada salt (1: ×10 · 2: ×100 · 3: ×1000) · us: unitats que es fan servir de debò
  L: { nom: 'longitud', u: ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'], us: [0, 3, 5, 6], k: 1 },
  M: { nom: 'massa', u: ['kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg'], us: [0, 3], k: 1 },
  C: { nom: 'capacitat', u: ['kL', 'hL', 'daL', 'L', 'dL', 'cL', 'mL'], us: [3, 5, 6], k: 1 },
  S: { nom: 'superfície', u: ['km²', 'hm²', 'dam²', 'm²', 'dm²', 'cm²', 'mm²'], us: [3, 4, 5], k: 2, sota: { 1: 'ha' } },
  V: { nom: 'volum', u: ['km³', 'hm³', 'dam³', 'm³', 'dm³', 'cm³', 'mm³'], us: [3, 4, 5], k: 3, sota: { 3: 'kL', 4: 'L', 5: 'mL' } }
};
const MS_P = { W: 556, H: 198, X: 44, D: 78 };
const msPx = i => MS_P.X + i * MS_P.D;
/* la xuleta del dossier: pedres amb les unitats, fletxes × a dalt i ÷ a baix, i FR-4C que hi salta */
function msPistaSvg({ mag, or = null, de = null, pos = null, etiq = true, anima = null, tab = false }) {
  const S = MS_ESC[mag], f = 10 ** S.k; let arcs = '';
  for (let i = 0; i < 6; i++) { const a = msPx(i) + 14, b = msPx(i + 1) - 14, m = (a + b) / 2;
    arcs += `<path d="M${a} 112Q${m} 84 ${b} 112" fill="none" stroke="${MS_N}" stroke-width="2" marker-end="url(#ms-fl)"/><path d="M${b} 156Q${m} 184 ${a} 156" fill="none" stroke="#888" stroke-width="2" marker-end="url(#ms-fl2)"/>`;
    if (etiq) arcs += `<text x="${m}" y="91" text-anchor="middle" font-size="${S.k === 3 ? 11.5 : 13}" font-weight="900" fill="${T}">×${f}</text><text x="${m}" y="189" text-anchor="middle" font-size="${S.k === 3 ? 11.5 : 13}" font-weight="900" fill="#2a6fd6">÷${f}</text>`; }
  const pedres = S.u.map((u, i) => { const gris = !S.us.includes(i) && i !== or && i !== de; const st = S.sota?.[i];
    return `<g class="ms-pedra" data-i="${i}"><rect x="${msPx(i) - 29}" y="117" width="58" height="34" rx="10" fill="${i === de ? T : gris ? '#efefef' : '#fff'}" stroke="${i === or ? T : gris ? '#aaa' : MS_N}" stroke-width="${i === or ? 4 : 2.5}" ${i === or ? 'stroke-dasharray="6 3"' : ''}/><text x="${msPx(i)}" y="140" text-anchor="middle" font-size="${u.length > 3 ? 15 : 17}" font-weight="900" fill="${i === de ? '#fff' : gris ? '#999' : MS_N}">${u}</text>${st ? `<rect x="${msPx(i) - 15}" y="155" width="30" height="17" rx="5" fill="#ffd84a"/><text x="${msPx(i)}" y="168" text-anchor="middle" font-size="12" font-weight="900" fill="${MS_N}">${st}</text>` : ''}</g>`; }).join('');
  const bot = pos == null && !anima ? '' : `<g class="ms-s-bot" style="transform:translateX(${msPx(pos ?? 0)}px)"><g class="ms-s-hop">${robot(62).replace('<svg ', '<svg x="-31" y="6" ')}</g></g>`;
  return `<svg class="ms-pista ${anima ? 'anima' : ''}" viewBox="0 0 ${MS_P.W} ${MS_P.H}" ${tab ? 'tabindex="0"' : ''} ${anima ? `style="--xa:${msPx(anima[0])}px;--xb:${msPx(anima[1])}px"` : ''} role="img" aria-label="Escala d'unitats de ${S.nom}">
    <defs><marker id="ms-fl" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="${MS_N}"/></marker><marker id="ms-fl2" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="#888"/></marker></defs>
    ${arcs}${pedres}${bot}</svg>`;
}
/* una conversió: origen n·10^e a la unitat or → unitat de (d salts de k zeros cadascun) */
function msConv(nv, mag) {
  const S = MS_ESC[mag], k = S.k, P = [2, 3, 4, 5, 6, 7, 8, 9, 12, 15, 25];
  const maxD = k === 1 ? (nv === 1 ? 3 : 4) : k === 2 ? 2 : (nv === 3 ? 2 : 1);
  const tots = k === 3 ? [3, 4, 5, 6] : [0, 1, 2, 3, 4, 5, 6];
  for (let g = 0; g < 400; g++) {
    const or = tria(nv === 3 ? tots : S.us), de = tria(nv === 3 ? tots : S.us);
    const d = de - or; if (!d || Math.abs(d) > maxD) continue;
    let n, e;
    if (nv === 1) { n = tria(P); e = d > 0 ? 0 : -d * k; } // tot amb nombres enters
    else if (d > 0) { n = tria([15, 25, 35, 45, 75, 12, 24, 5, 8, 125, 6, 105]); e = -tria([1, 1, 2]); if (nv === 3 && Math.random() < .35) e = 0; }
    else { n = tria([3, 5, 8, 15, 35, 47, 80, 85, 120, 250, 330, 500, 750, 1200, 1500, 2500, 4000, 12000, 45000]); e = nv === 3 && Math.random() < .3 ? -1 : 0; }
    const v0 = msV(n, e), v1 = msV(n, e + d * k); if (v1 >= 1e6 || v0 >= 1e5 || e + d * k < -3 || e < -3 || v1 < .001) continue;
    if (nv === 2 && Number.isInteger(v0) && Number.isInteger(v1)) continue; // al nivell 2 sempre hi ha algun decimal
    const errs = [[msV(n, e - d * k), 'mSentit'], [msV(n, e + (d + 1) * k), 'mSalt'], [msV(n, e + (d - 1) * k), 'mSalt']]; if (k > 1) errs.unshift([msV(n, e + d), 'mFactor']);
    return { mag, k, or, de, d, n, e, v0, v1, uo: S.u[or], ud: S.u[de], errs: errs.filter(([v]) => !decIgual(v, v1)) };
  }
}
const msOpTxt = (d, k = 1) => `${d > 0 ? '×' : '÷'} ${fmtDec(10 ** (Math.abs(d) * k))}`;
const msSolConv = c => [`De ${c.uo} a ${c.ud} hi ha <b>${Math.abs(c.d)} ${Math.abs(c.d) === 1 ? 'salt' : 'salts'}</b> cap a ${c.d > 0 ? 'la dreta' : 'l\'esquerra'}${c.k > 1 ? ` (cada salt, ${c.d > 0 ? '×' : '÷'}${10 ** c.k})` : ''}: ${msOpTxt(c.d, c.k)}.`, `${msU(c.v0, c.uo)} ${msOpTxt(c.d, c.k)} = <b>${msU(c.v1, c.ud)}</b>.`];
const msPistaDe = k => k === 1 ? PISTA_M3 : { completa: `Busca les dues unitats a la xuleta i <b>compta els salts</b>. Aquí cada salt és <b>×${10 ** k}</b> cap a la dreta i <b>÷${10 ** k}</b> cap a l'esquerra${k === 2 ? ': un quadrat de 10 × 10' : ': un cub de 10 × 10 × 10'}.`, mitja: `Compta els salts: cada un és ×${10 ** k} o ÷${10 ** k}.` };
/* ---------- taula d'unitats: una casella buida sota de cada unitat per fer el canvi pas a pas ----------
   Nivells 1 i 2: amb els noms de les unitats (al nivell 1, a més, amb el número ja col·locat). Nivell 3: tota buida, i l'alumne hi escriu també les unitats. */
const MS_TAULA = {}; // el que l'alumne hi escriu es conserva mentre fa l'exercici
document.addEventListener('input', e => { const i = e.target.closest ? e.target.closest('.ms-taula input') : null; if (!i) return;
  if (!i.dataset.cap) i.value = i.value.replace(/[^0-9]/g, ''); MS_TAULA[i.dataset.t] = i.value; i.classList.remove('pre');
  if (!i.dataset.cap && i.maxLength <= 3 && i.value.length >= i.maxLength) { const seg = i.closest('td').nextElementSibling; seg && $('input', seg) && $('input', seg).focus(); } });
const msNetejaTaula = clau => { for (const k of Object.keys(MS_TAULA)) if (k.startsWith(clau + ':')) delete MS_TAULA[k]; };
function msPreTaula(c) { // col·loca el número de sortida: les unitats, sota de la seva unitat
  const cel = Array(7).fill(''), k = c.k; const [ent, dec = ''] = String(c.v0).split('.');
  let i = c.or; for (let f = ent.length; f > 0; f -= k, i--) { if (i <= 0) { cel[0] = ent.slice(0, f); break; } cel[i] = ent.slice(Math.max(0, f - k), f); } // el que no hi cap queda a la primera casella
  const d = dec.padEnd(Math.ceil(dec.length / k) * k, '0'); i = c.or + 1; for (let f = 0; f < d.length; f += k, i++) { if (i > 6) return null; cel[i] = d.slice(f, f + k); }
  return cel;
}
function msTaulaHtml({ clau, mag = null, files = 1, caps = true, pre = [] }) {
  const S = mag ? MS_ESC[mag] : null, k = S ? S.k : 1, us = S ? S.u : ['k', 'h', 'da', 'unitat', 'd', 'c', 'm'];
  const val = (t, p) => MS_TAULA[t] != null ? [MS_TAULA[t], ''] : [p || '', p ? 'pre' : ''];
  const cap = us.map((u, i) => caps ? `<th class="${S && !S.us.includes(i) ? 'gris' : ''}">${u}</th>` : `<th><input data-cap="1" data-t="${clau}:h:${i}" maxlength="5" autocomplete="off" value="${esc(MS_TAULA[`${clau}:h:${i}`] || '')}" aria-label="Unitat ${i + 1}"></th>`).join('');
  const fila = r => `<tr>${files > 1 ? `<th class="lletra">${'abcdefgh'[r]})</th>` : ''}${us.map((_, i) => { const [v, cl] = val(`${clau}:${r}:${i}`, pre[r] && pre[r][i]); return `<td><input class="${cl}" data-t="${clau}:${r}:${i}" inputmode="numeric" maxlength="${i ? k : k + 3}" autocomplete="off" value="${esc(v)}" aria-label="Casella ${us[i]}"></td>`; }).join('')}</tr>`;
  return `<table class="ms-taula k${k}"><caption>${caps ? 'Taula per fer el canvi pas a pas' : 'Taula buida: escriu-hi tu les unitats, de la més gran a la més petita'}: ${k === 1 ? 'una xifra' : k === 2 ? 'dues xifres' : 'tres xifres'} a cada casella.</caption><thead><tr>${files > 1 ? '<th></th>' : ''}${cap}</tr></thead><tbody>${Array.from({ length: files }, (_, r) => fila(r)).join('')}</tbody></table>`;
}
const M3 = {};
/* A · FR-4C salta per la xuleta. auto: el número es calcula sol a cada salt (nivell 1). Sense auto: l'alumne escriu el resultat. */
function msSaltsEx(nv, { mag, auto = nv === 1 } = {}) {
  const c = msConv(nv, mag), S = MS_ESC[c.mag], f = 10 ** c.k; const etiq = nv === 1;
  const a = p => msV(c.n, c.e + (p - c.or) * c.k);
  const eq = G => auto ? (G.pos === c.or ? `${msU(c.v0, c.uo)} = <b>?</b> ${c.ud}` : `${msU(c.v0, c.uo)} = <b class="pop">${fmtDec(a(G.pos))}</b> ${S.u[G.pos]}`)
    : (G.pos === c.or ? `${msU(c.v0, c.uo)} = <b>?</b> ${c.ud}` : `<span class="pop" style="font-size:1.15rem">${Math.abs(G.pos - c.or)} ${Math.abs(G.pos - c.or) === 1 ? 'salt' : 'salts'} cap a ${G.pos > c.or ? 'la dreta →' : 'l\'esquerra ←'}</span>`);
  const sig = `s-${auto ? 'a' : 'e'}-${c.mag}-${c.or}-${c.de}-${c.n}-${c.e}`; msNetejaTaula(sig);
  return { sig, enunciat: auto ? `Fes saltar FR-4C des de <b>${c.uo}</b> fins a <b>${c.ud}</b> (la casella taronja) i mira com canvia el número.` : `Passa <b>${msU(c.v0, c.uo)}</b> a <b>${c.ud}</b>. Fes saltar FR-4C per comptar els salts i escriu el resultat.`, visual: () => msTaulaHtml({ clau: sig, mag: c.mag, caps: nv < 3, pre: nv === 1 ? [msPreTaula(c)] : [] }), pista: msPistaDe(c.k),
    ...msGiny({
      inici: () => ({ pos: c.or, mogut: false, n: '' }),
      munta(z, G, ctx) {
        z.innerHTML = `<div class="ms-g"><div class="ms-s-eq">${eq(G)}</div>${msPistaSvg({ mag: c.mag, or: c.or, de: c.de, pos: c.or, etiq, tab: true })}
          <div class="ms-ctl"><button data-s="-1">◀ ${etiq ? '÷' + f : 'salta'}</button><button data-s="1">${etiq ? '×' + f : 'salta'} ▶</button><button data-s="0" title="Torna a la sortida">↺ Torna</button></div>
          ${auto ? '' : msEntrada(`${msU(c.v0, c.uo)} =`, c.ud)}<p class="ms-nota">Clica els botons o una casella. També van les fletxes ← → del teclat.</p></div>`;
        const bot = $('.ms-s-bot', z), hop = $('.ms-s-hop', z), svg = $('.ms-pista', z); let cua = null;
        const pinta = () => { bot.style.transform = `translateX(${msPx(G.pos)}px)`; $('.ms-s-eq', z).innerHTML = eq(G); ctx.canvi(); };
        const salta = d => { const p = G.pos + d; if (p < 0 || p > 6) return false; G.pos = p; G.mogut = true; so(d > 0 ? 'salt' : 'saltE');
          try { hop.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-6px) rotate(-8deg)' }, { transform: 'translateY(0)' }], { duration: 330, easing: 'ease-out' }); } catch (e) { } pinta(); return true; };
        const vesA = p => { clearInterval(cua); if (p === G.pos) return; salta(Math.sign(p - G.pos)); cua = setInterval(() => { if (!z.isConnected || !ctx.actiu() || G.pos === p || !salta(Math.sign(p - G.pos))) clearInterval(cua); }, 360); };
        G.va = p => { clearInterval(cua); G.pos = p; G.mogut = true; pinta(); };
        z.onclick = e => { if (!ctx.actiu()) return; const b = e.target.closest('[data-s]'), pd = e.target.closest('.ms-pedra');
          if (b) { clearInterval(cua); const d = Number(b.dataset.s); if (d) salta(d); else if (G.pos !== c.or) { so('treu'); G.pos = c.or; pinta(); } } else if (pd) vesA(Number(pd.dataset.i)); };
        svg.onkeydown = e => { if (!ctx.actiu() || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return; e.preventDefault(); clearInterval(cua); salta(e.key === 'ArrowRight' ? 1 : -1); };
        if (!auto) msEnllacaEnt(z, G, ctx);
      },
      fet: G => auto ? G.mogut && G.pos !== c.or : llegeixDec(G.n) != null,
      ok: G => auto ? G.pos === c.de : decIgual(llegeixDec(G.n), c.v1),
      txt: G => auto ? `${msUt(c.v0, c.uo)} → s'atura a ${S.u[G.pos]} (${msUt(a(G.pos), S.u[G.pos])})` : `${msUt(c.v0, c.uo)} = ${G.n} ${c.ud}`,
      etiq: G => auto ? 'mSalt' : (c.errs.find(([v]) => decIgual(llegeixDec(G.n), v))?.[1] || null),
      tanca(z, G, ok) { msTancaEnt(z, ok); if (!ok || !auto) setTimeout(() => { if (!z.isConnected) return; $('.ms-s-bot', z).style.transform = `translateX(${msPx(c.de)}px)`; $('.ms-s-eq', z).innerHTML = `${msU(c.v0, c.uo)} = <b>${fmtDec(c.v1)}</b> ${c.ud}`; }, 500); },
      demo: resolt => `<div class="ms-s-eq">${msU(c.v0, c.uo)} = <b>${resolt ? fmtDec(c.v1) : '?'}</b> ${c.ud}</div>${msPistaSvg({ mag: c.mag, or: c.or, de: c.de, pos: resolt ? c.de : c.or, etiq })}`,
      resol(z, G, be) { if (auto) return G.va(be ? c.de : [c.de + 1, c.de - 1, c.de + 2, c.de - 2].find(p => p >= 0 && p <= 6 && p !== c.or)); G.va(c.de); const inp = $('[data-ms-n]', z); inp.value = fmtDec(be ? c.v1 : msV(c.n, c.e - c.d * c.k)).replace(/\s/g, ''); inp.oninput(); }
    }, `<b>${msU(c.v1, c.ud)}</b>`),
    explicacio: `${Math.abs(c.d)} ${Math.abs(c.d) === 1 ? 'salt' : 'salts'} cap a ${c.d > 0 ? 'la dreta' : 'l\'esquerra'}: ${msOpTxt(c.d, c.k)}.`, solucio: msSolConv(c) };
}
M3.salts = (nv, { mag = null, auto = nv === 1 } = {}) => msSaltsEx(nv, { mag: mag || tria(['L', 'M', 'C']), auto });
/* B · Escriure el resultat, amb la xuleta a la vista (nivell 1) o només com a pista */
function msEscriuEx(nv, { n = 3, mag }) {
  const mg = mag; const cs = []; const vist = new Set();
  for (let g = 0; cs.length < n && g < 80; g++) { const c = msConv(nv, mg); const k = `${c.or}-${c.de}-${c.n}-${c.e}`; if (vist.has(k) || cs.some(x => x.or === c.or && x.de === c.de && n <= 3 && MS_ESC[mg].us.length > 2 && nv < 3)) continue; vist.add(k); cs.push(c); }
  const its = cs.map(c => ({ tipus: 'dec', html: msU(c.v0, c.uo), valor: c.v1, unitat: c.ud, errs: c.errs, c }));
  const sig = `w-${mg}-${cs.map(c => `${c.or}${c.de}${c.n}e${c.e}`).join('|')}`; msNetejaTaula(sig); const taula = () => msTaulaHtml({ clau: sig, mag: mg, files: cs.length, caps: nv < 3, pre: nv === 1 ? cs.map(msPreTaula) : [] });
  return { sig, enunciat: `Canvia d'unitat amb l'ajuda de la ${nv === 1 ? 'xuleta i de la taula' : 'taula'}.`, visual: nv === 1 ? () => msPistaSvg({ mag: mg }) + taula() : (completa => (completa ? msPistaSvg({ mag: mg }) : '') + taula()), pista: msPistaDe(MS_ESC[mg].k), ...apartats(its),
    explicacio: MS_ESC[mg].k === 1 ? `Compta els salts: dreta ×10, esquerra ÷10.` : `Compta els salts: aquí cada un és ×${10 ** MS_ESC[mg].k} o ÷${10 ** MS_ESC[mg].k}.`, solucio: its.map(it => msSolConv(it.c)[1]) };
}
M3.escriu = (nv, { n = 3, mag = null } = {}) => msEscriuEx(nv, { n, mag: mag || tria(['L', 'M', 'C']) });
/* C · Comparar dues mesures que estan en unitats diferents */
M3.compara = (nv, { n = 3 } = {}) => {
  const its = []; const vist = new Set();
  for (let g = 0; its.length < n && g < 100; g++) {
    const mag = tria(['L', 'M', 'C']), S = MS_ESC[mag]; let i, j; if (nv === 3) { i = msR(0, 5); j = msR(i + 1, Math.min(6, i + 3)); } else { const p = barreja(S.us).slice(0, 2).sort((x, y) => x - y); [i, j] = p; }
    const F = 10 ** (j - i); if (F > 1000) continue;
    const a = tria([.5, .8, 1.2, 1.5, 2, .25, .75, 3, 2.5, .6, 1.8]); // en la unitat gran
    const r = Math.random(); let b = r < .25 ? a * F : a * F * tria([.5, .6, .9, 1.1, 1.5, 2]); b = Math.round(b * 100) / 100; if (b < 1 && F > 1) b = Math.round(b * 10) / 10 || 1; // en la unitat petita
    if (String(b).replace('.', '').length > 4) continue;
    const dif = a * F - b; const gira = Math.random() < .5;
    const A = { t: msU(a, S.u[i]), v: a * F, raw: a }, B = { t: msU(b, S.u[j]), v: b, raw: b }; const [E, D] = gira ? [B, A] : [A, B];
    const corr = Math.abs(dif) < 1e-9 ? '=' : (E.v > D.v ? '>' : '<'); const cru = E.raw > D.raw ? '>' : E.raw < D.raw ? '<' : '=';
    const k = `${E.t}|${D.t}`; if (vist.has(k)) continue; vist.add(k);
    its.push({ tipus: 'signe', ha: `<b>${E.t}</b>`, hb: `<b>${D.t}</b>`, ta: textPla(E.t), tb: textPla(D.t), correcta: corr, etiq: cru !== corr ? { [cru]: 'mNumeros' } : {}, sol: `${a * 1} ${S.u[i]} = ${fmtDec(a * F)} ${S.u[j]}, i per tant ${textPla(E.t)} <b>${corr}</b> ${textPla(D.t)}` });
  }
  const sig = `k-${its.map(i => i.ta + i.tb).join('|')}`; msNetejaTaula(sig);
  return { sig, enunciat: `Quina mesura és més gran? Posa <b>&lt;</b>, <b>&gt;</b> o <b>=</b>.`, visual: completa => (completa ? msPistaSvg({ mag: 'L' }) : '') + msTaulaHtml({ clau: sig, files: its.length, caps: nv < 3 }), pista: { completa: `No comparis només els números! Passa les dues mesures a la <b>mateixa unitat</b> (la més petita va bé) i després compara.`, mitja: `Passa-les a la mateixa unitat.` }, ...apartats(its),
    explicacio: `Primer a la mateixa unitat, i després es compara.`, solucio: its.map(it => it.sol.replace(/(\d)\.(\d)/g, '$1,$2')) };
};
/* D · Etiquetes i situacions de cada dia */
const MS_CTX = {
  1: [
    () => { const n = tria([1, 2, 5]); return { t: `Una garrafa d'aigua fa ${n} L. Quants <b>mL</b> són?`, v: n * 1000, u: 'mL', alt: n / 1000, s: `${n} L × 1000 = <b>${fmtDec(n * 1000)} mL</b>` }; },
    () => { const n = tria([3, 5, 10]); return { t: `Una cursa popular fa ${n} km. Quants <b>metres</b> són?`, v: n * 1000, u: 'm', alt: n / 1000, s: `${n} km × 1000 = <b>${fmtDec(n * 1000)} m</b>` }; },
    () => { const n = tria([1, 2, 5]); return { t: `Un paquet d'arròs pesa ${n} kg. Quants <b>grams</b> són?`, v: n * 1000, u: 'g', alt: n / 1000, s: `${n} kg × 1000 = <b>${fmtDec(n * 1000)} g</b>` }; },
    () => { const n = tria([2, 3, 4]); return { t: `Una taula fa ${n} m de llargada. Quants <b>cm</b> són?`, v: n * 100, u: 'cm', alt: n / 100, s: `${n} m × 100 = <b>${n * 100} cm</b>` }; },
    () => { const n = tria([2, 4, 6]); return { t: `Un cargol fa ${n} cm. Quants <b>mm</b> són?`, v: n * 10, u: 'mm', alt: n / 10, s: `${n} cm × 10 = <b>${n * 10} mm</b>` }; },
    () => { const n = tria([2, 3, 4]); return { t: `De casa a l'institut hi ha ${n * 1000} m. Quants <b>km</b> són?`, v: n, u: 'km', alt: n * 1e6, s: `${n * 1000} m ÷ 1000 = <b>${n} km</b>` }; },
    () => { const n = tria([3, 4, 6]); return { t: `Una síndria pesa ${n * 1000} g. Quants <b>kg</b> són?`, v: n, u: 'kg', alt: n * 1e6, s: `${n * 1000} g ÷ 1000 = <b>${n} kg</b>` }; }
  ],
  2: [
    () => ({ t: `Una ampolla d'aigua fa 1,5 L. Quants <b>mL</b> són?`, v: 1500, u: 'mL', alt: .0015, s: `1,5 L × 1000 = <b>1500 mL</b>` }),
    () => ({ t: `Una llauna de refresc fa 33 cL. Quants <b>mL</b> són?`, v: 330, u: 'mL', alt: 3.3, s: `33 cL × 10 = <b>330 mL</b>` }),
    () => { const n = tria([250, 150, 400, 750]); return { t: `La recepta demana ${n} g de farina. Quants <b>kg</b> són?`, v: n / 1000, u: 'kg', alt: n * 1000, s: `${n} g ÷ 1000 = <b>${fmtDec(n / 1000)} kg</b>` }; },
    () => { const n = tria([165, 172, 158, 180]); return { t: `La Júlia fa ${fmtDec(n / 100)} m d'alçada. Quants <b>cm</b> són?`, v: n, u: 'cm', alt: n / 10000, s: `${fmtDec(n / 100)} m × 100 = <b>${n} cm</b>` }; },
    () => { const n = tria([200, 250, 330]); return { t: `En un got hi caben ${n} mL. Quants <b>litres</b> són?`, v: n / 1000, u: 'L', alt: n * 1000, s: `${n} mL ÷ 1000 = <b>${fmtDec(n / 1000)} L</b>` }; },
    () => { const n = tria([180, 195, 210]); return { t: `Un mòbil pesa ${n} g. Quants <b>kg</b> són?`, v: n / 1000, u: 'kg', alt: n * 1000, s: `${n} g ÷ 1000 = <b>${fmtDec(n / 1000)} kg</b>` }; },
    () => { const n = tria([120, 85, 160]); return { t: `Una taula fa ${n} cm de llargada. Quants <b>metres</b> són?`, v: n / 100, u: 'm', alt: n * 100, s: `${n} cm ÷ 100 = <b>${fmtDec(n / 100)} m</b>` }; },
    () => { const n = tria([2500, 1500, 800]); return { t: `He corregut ${n} m. Quants <b>km</b> són?`, v: n / 1000, u: 'km', alt: n * 1000, s: `${n} m ÷ 1000 = <b>${fmtDec(n / 1000)} km</b>` }; },
    () => { const n = tria([8, 6, 15]); return { t: `Un cargol fa ${n} mm. Quants <b>cm</b> són?`, v: n / 10, u: 'cm', alt: n * 10, s: `${n} mm ÷ 10 = <b>${fmtDec(n / 10)} cm</b>` }; },
    () => { const n = tria([75, 35, 5]); return { t: `Compro ${fmtDec(n / 100)} kg de formatge. Quants <b>grams</b> són?`, v: n * 10, u: 'g', alt: n / 100000, s: `${fmtDec(n / 100)} kg × 1000 = <b>${n * 10} g</b>` }; }
  ],
  3: [
    () => { const g = tria([200, 250]), L = tria([2, 5]); return { t: `Tinc una garrafa de ${L} L. Quants gots de ${g} mL puc omplir?`, v: L * 1000 / g, u: 'gots', s: `${L} L = ${L * 1000} mL, i ${L * 1000} ÷ ${g} = <b>${L * 1000 / g} gots</b>` }; },
    () => { const r = tria([125, 100, 250]); return { t: `D'un paquet d'1 kg de pasta, quantes racions de ${r} g en surten?`, v: 1000 / r, u: 'racions', s: `1 kg = 1000 g, i 1000 ÷ ${r} = <b>${1000 / r} racions</b>` }; },
    () => { const k = tria([3, 4, 6]); return { t: `Compro ${k} ampolles d'1,5 L. Quants <b>mL</b> tinc en total?`, v: k * 1500, u: 'mL', s: `${k} × 1,5 L = ${fmtDec(k * 1.5)} L = <b>${fmtDec(k * 1500)} mL</b>` }; },
    () => { const k = tria([5, 10, 15]); return { t: `Cada volta a la pista fa 400 m. Quants <b>km</b> faig amb ${k} voltes?`, v: k * .4, u: 'km', s: `${k} × 400 m = ${k * 400} m = <b>${fmtDec(k * .4)} km</b>` }; },
    () => { const t = tria([25, 40, 50]); return { t: `Tallo una cinta de 2 m en trossos de ${t} cm. Quants trossos en surten?`, v: 200 / t, u: 'trossos', s: `2 m = 200 cm, i 200 ÷ ${t} = <b>${200 / t} trossos</b>` }; },
    () => { const p = tria([[150, 5], [120, 10], [200, 5]]); return { t: `Un xarop porta ${p[0]} mL i cada dosi és de ${p[1]} mL. Per a quantes dosis n'hi ha?`, v: p[0] / p[1], u: 'dosis', s: `${p[0]} ÷ ${p[1]} = <b>${p[0] / p[1]} dosis</b>` }; },
    () => { const a = tria([12, 15, 18]), b = tria([800, 500, 700]); return { t: `Porto ${fmtDec(a / 10)} kg de taronges i ${b} g de pomes. Quants <b>kg</b> porto en total?`, v: (a * 100 + b) / 1000, u: 'kg', s: `${b} g = ${fmtDec(b / 1000)} kg, i ${fmtDec(a / 10)} + ${fmtDec(b / 1000)} = <b>${fmtDec((a * 100 + b) / 1000)} kg</b>` }; }
  ]
};
M3.context = (nv, { n = 2 } = {}) => {
  const fs = barreja(MS_CTX[nv]).slice(0, n).map(f => f());
  const its = fs.map(f => ({ tipus: 'dec', llarg: true, html: f.t, valor: f.v, unitat: f.u, errs: f.alt != null ? [[f.alt, 'mSentit']] : [], s: f.s }));
  const sig = `x-${fs.map(f => textPla(f.t).slice(0, 26) + f.v).join('|')}`; msNetejaTaula(sig);
  return { sig, enunciat: `Mesures de cada dia.`, visual: () => (nv === 1 ? msPistaSvg({ mag: 'L' }) : '') + msTaulaHtml({ clau: sig, files: its.length, caps: nv < 3 }), pista: PISTA_M3, ...apartats(its),
    explicacio: `Cap a una unitat més petita, multiplica. Cap a una de més gran, divideix.`, solucio: its.map(it => it.s) };
};
TEMES.m3 = {
  gen: M3,
  sequencia: {
    1: [['salts', { mag: 'L' }], ['salts', { mag: 'M' }], ['escriu', { n: 2, mag: 'L' }], ['salts', { mag: 'C' }], ['escriu', { n: 3, mag: 'C' }], ['context', { n: 2 }], ['escriu', { n: 3, mag: 'L' }], ['context', { n: 2 }]],
    2: [['salts', { mag: 'L' }], ['salts', { mag: 'C' }], ['escriu', { n: 3, mag: 'L' }], ['salts', { mag: 'M' }], ['compara', { n: 3 }], ['context', { n: 2 }], ['escriu', { n: 3 }], ['context', { n: 3 }]],
    3: [['salts', { auto: false }], ['escriu', { n: 3 }], ['compara', { n: 3 }], ['context', { n: 2 }], ['escriu', { n: 4 }], ['compara', { n: 4 }], ['context', { n: 2 }], ['escriu', { n: 4 }]]
  },
  explicacio: [
    { text: `<p>Per canviar d'unitat, FR-4C <b class="parpelleja">salta</b> per la xuleta.</p><p class="petit">Cada casella és una unitat. Les grises es fan servir poc, però compten com un salt.</p>`, vis: () => msPistaSvg({ mag: 'L', anima: [3, 5] }) },
    { text: `<p>Cap a la <b>dreta</b>, les unitats són més petites i en calen més: cada salt és <b class="parpelleja">×10</b>.</p><p class="petit">De m a cm hi ha 2 salts: ×10 i ×10, que és ×100. Per això 3 m = 300 cm.</p>`, vis: () => `<div class="ms-s-eq">3 m = <b>300</b> cm</div>${msPistaSvg({ mag: 'L', or: 3, de: 5, anima: [3, 5] })}` },
    { text: `<p>Cap a l'<b>esquerra</b>, les unitats són més grans i en calen menys: cada salt és <b class="parpelleja">÷10</b>.</p><p class="petit">De g a kg hi ha 3 salts: ÷1000. Per això 2000 g = 2 kg.</p>`, vis: () => `<div class="ms-s-eq">2000 g = <b>2</b> kg</div>${msPistaSvg({ mag: 'M', or: 3, de: 0, anima: [3, 0] })}` },
    { text: `<p>Amb decimals és igual: la coma es mou un lloc a cada salt.</p><p class="petit">1,5 L → 15 dL → 150 cL → <b>1500 mL</b>.</p>`, vis: () => `<div class="ms-s-eq">1,5 L = <b>1500</b> mL</div>${msPistaSvg({ mag: 'C', or: 3, de: 6, anima: [3, 6] })}` },
    { text: `<p>I després, comprova si <b class="parpelleja">té sentit</b>.</p><p class="petit">Una ampolla d'1,5 L no pot ser 0,0015 mL: si passo a una unitat més petita, el número ha de ser més gran.</p>`, vis: () => msRefsHtml(false) }
  ],
  exemple: nv => {
    if (nv === 1) return { enunciat: `Passa 3 m a cm.`, passos: [
      { text: `Busca <b>m</b> i <b>cm</b> a la xuleta: hi ha <b>2 salts</b> cap a la dreta.`, vis: msPistaSvg({ mag: 'L', or: 3, de: 5, pos: 3 }) },
      { text: `Cada salt és ×10: 3 → 30 → 300. Per tant, <b>3 m = 300 cm</b>. <span class="marca-ok">✓</span>`, vis: `<div class="ms-s-eq">3 m = <b>300</b> cm</div>${msPistaSvg({ mag: 'L', or: 3, de: 5, pos: 5 })}` }] };
    if (nv === 2) return { enunciat: `Passa 250 g a kg.`, passos: [
      { text: `De <b>g</b> a <b>kg</b> hi ha <b>3 salts</b> cap a l'esquerra: ÷1000.`, vis: msPistaSvg({ mag: 'M', or: 3, de: 0, pos: 3 }) },
      { text: `250 → 25 → 2,5 → 0,25. Per tant, <b>250 g = 0,25 kg</b>: un quart de quilo. <span class="marca-ok">✓</span>`, vis: `<div class="ms-s-eq">250 g = <b>0,25</b> kg</div>${msPistaSvg({ mag: 'M', or: 3, de: 0, pos: 0 })}` }] };
    return { enunciat: `Què pesa més: 0,8 kg o 750 g?`, passos: [
      { text: `No comparis 0,8 amb 750! Primer, a la mateixa unitat: 0,8 kg × 1000 = <b>800 g</b>.`, vis: `<div class="ms-s-eq">0,8 kg = <b>800</b> g</div>${msPistaSvg({ mag: 'M', or: 0, de: 3, pos: 3 })}` },
      { text: `Ara sí: 800 g &gt; 750 g. Per tant, <b>0,8 kg &gt; 750 g</b>. <span class="marca-ok">✓</span>`, vis: `<div class="ms-s-eq">0,8 kg <b>&gt;</b> 750 g</div>` }] };
  }
};
/* =====================================================================
   OBJECTIU 4 · SUPERFÍCIE (quant ocupa una cosa: quadrets, base × altura i salts de ×100)
   ===================================================================== */
Object.assign(ETIQ_ERR, {
  mFactor: 'fa servir ×10 per salt en unitats de superfície o de volum', mPerim: 'calcula el perímetre (o suma els costats) en lloc de l\'àrea', mUnitMix: 'multiplica mesures en unitats diferents sense passar-les a la mateixa',
  mSuma: 'suma les tres mides en lloc de multiplicar-les', mCares: 'compta només els cubs que es veuen', mLitre: 'no recorda que 1 dm³ = 1 L i 1 cm³ = 1 mL',
  mAgulles: 'confon l\'agulla de les hores amb la dels minuts', mMinuts: 'llegeix el número de l\'esfera com si fossin minuts', mHoraSeg: 'diu l\'hora següent quan l\'agulla curta encara no hi ha arribat',
  mBase60: 'tracta l\'hora com si tingués 100 minuts', mResta60: 'resta hores i minuts per separat sense fer el pont a l\'hora en punt', mArrod: 'no arrodoneix cap amunt quan cal comprar unitats senceres',
  mPreuUnitat: 'compara el preu del paquet en lloc del preu per quilo o per litre', mSuperf: 'divideix les llargades en lloc de les superfícies'
});
Object.assign(AVIS_ERR, {
  mFactor: 'Compte: en <b>superfícies</b> cada salt és <b>×100</b>, i en <b>volums</b>, <b>×1000</b>. No és ×10!', mPerim: 'Has sumat els costats: això és la <b>vora</b> (el perímetre). La superfície és el que hi ha <b>a dins</b>: base × altura.',
  mUnitMix: 'Abans de multiplicar, passa les dues mides a la <b>mateixa unitat</b>.', mSuma: 'El volum no es suma: és <b>llarg × ample × alt</b>.', mCares: 'També compten els cubs que <b>no es veuen</b>, els de dins i els de darrere: multiplica llarg × ample × alt.',
  mLitre: 'Recorda: <b>1 dm³ = 1 L</b> i <b>1 cm³ = 1 mL</b>. I en 1 m³ hi caben 1000 L.', mAgulles: 'L\'agulla <b>curta</b> marca les hores i la <b>llarga</b>, els minuts.',
  mMinuts: 'Els números de l\'esfera són hores. Per als minuts, cada número val <b>5</b>: el 3 són 15 minuts, el 6 són 30…', mHoraSeg: 'Si l\'agulla curta encara no ha arribat al número, l\'hora és l\'<b>anterior</b>.',
  mBase60: 'Una hora té <b>60 minuts</b>, no 100. Mitja hora són 30 minuts, i 1,5 h és 1 h 30 min.', mResta60: 'No restis hores i minuts per separat. Fes un <b>pont</b>: primer fins a l\'hora en punt, i després la resta.',
  mArrod: 'No es pot comprar un tros de pot o d\'ampolla: cal <b>arrodonir cap amunt</b>.', mPreuUnitat: 'Per comparar, mira el preu <b>per quilo</b> o <b>per litre</b>, no el preu del paquet.', mSuperf: 'Compara <b>superfícies</b>: calcula primer l\'àrea de cada cosa.'
});
document.head.insertAdjacentHTML('beforeend', `<style>
.ms-cel{animation:msPop .22s both}
.ms-compte{text-align:center;font-size:1.25rem;font-weight:800}.ms-compte b{color:var(--taronja);font-size:1.5rem}
.ms-ctl .grup{display:inline-flex;align-items:center;gap:5px;font-weight:800;font-size:.95rem;border:2px dashed #bbb;border-radius:12px;padding:4px 8px}.ms-ctl .grup button{min-width:44px;height:40px;padding:0 10px}
.ms-hm{display:flex;gap:7px;align-items:center;justify-content:center;font-size:1.3rem;font-weight:800;flex-wrap:wrap}
.ms-hm input{width:70px;height:46px;border:2px solid var(--tinta);border-radius:10px;font-size:1.4rem;font-weight:800;text-align:center}.ms-hm input.be{border-color:#1d8a4a;background:#e8f6ee}.ms-hm input.mal{border-color:#c33;background:#fdecec}
.ms-tiq{background:#fff;border:2px solid var(--tinta);border-radius:12px;padding:10px 14px;font-size:1.05rem;line-height:1.45;min-width:150px}
.ms-tiq h5{margin:0 0 4px;font-size:1.1rem;display:flex;gap:8px;align-items:center}.ms-tiq h5 i{font-style:normal;font-size:1.7rem}.ms-tiq .preu{font-size:1.5rem;font-weight:900;color:var(--taronja)}
.ms-tiq ul{margin:0;padding-left:18px}.ms-tiqs{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;align-items:stretch}
.ms-tiq .lletra{display:inline-flex;width:1.7em;height:1.7em;border-radius:50%;background:var(--tinta);color:#fff;align-items:center;justify-content:center;font-weight:900;font-size:.95rem}
.ap-text .ms-mini{vertical-align:middle;margin-right:8px}
</style>`);
const PISTA_M4 = { completa: `La superfície és el que ocupa una figura: <b>quants quadrets hi caben</b>. En un rectangle no cal comptar-los d'un en un: <b>base × altura</b>.`, mitja: `Base × altura.` };
const MS_GR = { X0: 62, C: 40 };
/* quadrícula amb quadrets pintats; cada quadret és 1 unitat quadrada. FR-4C fa de referent d'1 m */
function msGraellaSvg({ cols, rows, ple, cotes = '', ref = true, c = MS_GR.C }) {
  const X0 = ref ? MS_GR.X0 : 12, Y0 = 14, W = X0 + cols * c + 64, H = Y0 + rows * c + 40; let cel = '';
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const p = ple(i, j); cel += `<rect ${p ? 'class="ms-cel"' : ''} x="${X0 + i * c}" y="${Y0 + (rows - 1 - j) * c}" width="${c}" height="${c}" fill="${p ? '#ffb469' : '#fff'}" stroke="${p ? MS_N : '#ccc'}" stroke-width="${p ? 2 : 1}"/>`; }
  return `<svg class="ms-esc" viewBox="0 0 ${W} ${H}" role="img" aria-label="Quadrícula">${cel}${ref ? robot(c * 150 / 160).replace('<svg ', `<svg x="${(X0 - c) / 2}" y="${Y0 + (rows - 1) * c}" `) + `<text x="${X0 / 2}" y="${Y0 + rows * c + 16}" text-anchor="middle" font-size="12" font-weight="800" fill="${MS_N}">1 m</text>` : ''}${cotes}</svg>`;
}
const msCota = (x, y, t, anc = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anc}" font-size="19" font-weight="900" fill="${MS_N}" paint-order="stroke" stroke="#fff" stroke-width="4">${t}</text>`;
const msRectGraella = (b, h, cols = 10, rows = 6) => msGraellaSvg({ cols, rows, ple: (i, j) => i < b && j < h, cotes: msCota(MS_GR.X0 + b * MS_GR.C / 2, 14 + rows * MS_GR.C + 22, `${b} m`) + msCota(MS_GR.X0 + b * MS_GR.C + 8, 14 + (rows - h / 2) * MS_GR.C + 6, `${h} m`, 'start') });
const M4 = {};
/* A · Construeix un rectangle amb la superfície que et demanen */
M4.fesRect = nv => {
  let B, H; do { B = msR(2, 9); H = msR(2, 5); } while (B === H && Math.random() < .7);
  const A = B * H, P = 2 * (B + H);
  const enun = nv === 1 ? `Fes un rectangle que ocupi <b>${A} m²</b> (${A} quadrets).` : nv === 2 ? `Fes un rectangle de <b>${A} m²</b> que tingui <b>${B} m de base</b>.` : `Fes un rectangle de <b>${A} m²</b> de superfície i <b>${P} m</b> de perímetre (la volta sencera).`;
  const bo = G => G.b * G.h === A && (nv === 1 || (nv === 2 ? G.b === B : 2 * (G.b + G.h) === P));
  return { sig: `fr-${nv}-${B}-${H}`, enunciat: enun, visual: null, pista: PISTA_M4,
    ...msGiny({
      inici: () => ({ b: 1, h: 1, mogut: false }),
      munta(z, G, ctx) {
        const pinta = () => { $('.ms-zona', z).innerHTML = msRectGraella(G.b, G.h); const cp = $('.ms-compte', z); if (cp) cp.innerHTML = `Quadrets: <b>${G.b * G.h}</b>`; ctx.canvi(); };
        z.innerHTML = `<div class="ms-g"><div class="ms-zona"></div>${nv === 1 ? '<div class="ms-compte"></div>' : ''}<div class="ms-ctl"><span class="grup">Base <button data-e="b" data-d="-1">−</button><button data-e="b" data-d="1">+</button></span><span class="grup">Altura <button data-e="h" data-d="-1">−</button><button data-e="h" data-d="1">+</button></span></div></div>`;
        G.posa = (b, h) => { G.b = Math.max(1, Math.min(10, b)); G.h = Math.max(1, Math.min(6, h)); G.mogut = true; pinta(); };
        z.onclick = e => { const bt = e.target.closest('[data-e]'); if (!bt || !ctx.actiu()) return; const d = Number(bt.dataset.d); const ab = G.b, ah = G.h; if (bt.dataset.e === 'b') G.posa(G.b + d, G.h); else G.posa(G.b, G.h + d); if (ab !== G.b || ah !== G.h) so('to', 300 + 18 * G.b * G.h); };
        pinta();
      },
      fet: G => G.mogut && G.b * G.h > 1, ok: bo, txt: G => `rectangle de ${G.b} × ${G.h} = ${G.b * G.h} m²`, etiq: G => 2 * (G.b + G.h) === A || G.b + G.h === A ? 'mPerim' : null,
      tanca(z, G, ok) { msTancaEnt(z, ok); }, demo: resolt => resolt ? msRectGraella(B, H) : msRectGraella(1, 1),
      resol(z, G, be) { G.posa(be ? B : (B < 10 ? B + 1 : B - 1), H); }
    }, nv === 1 ? `per exemple, <b>${B} × ${H}</b> (${A} quadrets)` : `<b>${B} m de base i ${H} m d'altura</b>`),
    explicacio: `${B} × ${H} = ${A} quadrets d'1 m²: ${A} m².`, solucio: [`La superfície d'un rectangle és base × altura.`, `${B} × ${H} = <b>${A} m²</b>${nv === 3 ? `, i la volta fa ${B} + ${H} + ${B} + ${H} = ${P} m` : ''}.`] };
};
/* B · Comptar quadrets d'una figura feta amb dos rectangles */
function msFiguraL(nv) { // rectangle de baix w1×h1 i, a sobre, un de w2×h2 (arrenglerat a l'esquerra o a la dreta)
  const w1 = msR(nv === 1 ? 3 : 4, nv === 1 ? 5 : 8), h1 = msR(1, 3), w2 = msR(1, w1 - 1), h2 = msR(1, nv === 1 ? 2 : 3), dreta = Math.random() < .5;
  return { w1, h1, w2, h2, dreta, A: w1 * h1 + w2 * h2, ple: (i, j) => j < h1 ? i < w1 : j < h1 + h2 && (dreta ? i >= w1 - w2 && i < w1 : i < w2) };
}
function msFiguraCotes(f, c, u) { // sense quadrícula: només el contorn i les mides
  const X = 40, Y = 30, H = (f.h1 + f.h2) * c, x2 = f.dreta ? X + (f.w1 - f.w2) * c : X;
  const pts = f.dreta ? [[X, Y + H], [X + f.w1 * c, Y + H], [X + f.w1 * c, Y], [x2, Y], [x2, Y + f.h2 * c], [X, Y + f.h2 * c]] : [[X, Y + H], [X + f.w1 * c, Y + H], [X + f.w1 * c, Y + f.h2 * c], [X + f.w2 * c, Y + f.h2 * c], [X + f.w2 * c, Y], [X, Y]];
  const alt = f.dreta ? msCota(X + f.w1 * c + 8, Y + H / 2 + 6, `${f.h1 + f.h2} ${u}`, 'start') + msCota(X - 8, Y + f.h2 * c + f.h1 * c / 2 + 6, `${f.h1} ${u}`, 'end') : msCota(X - 8, Y + H / 2 + 6, `${f.h1 + f.h2} ${u}`, 'end') + msCota(X + f.w1 * c + 8, Y + f.h2 * c + f.h1 * c / 2 + 6, `${f.h1} ${u}`, 'start');
  return `<svg class="ms-esc" viewBox="0 0 ${f.w1 * c + 140} ${H + 70}" role="img" aria-label="Figura amb mides"><polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="#ffb469" stroke="${MS_N}" stroke-width="3" stroke-linejoin="round"/>${msCota(X + f.w1 * c / 2, Y + H + 24, `${f.w1} ${u}`)}${msCota(x2 + f.w2 * c / 2, Y - 8, `${f.w2} ${u}`)}${alt}</svg>`;
}
M4.comptar = nv => {
  const f = msFiguraL(nv), u = nv === 1 ? 'cm' : 'm';
  const vis = nv === 3 ? () => msFiguraCotes(f, 34, u) : () => msGraellaSvg({ cols: Math.max(6, f.w1 + 1), rows: Math.max(4, f.h1 + f.h2 + 1), ple: f.ple, ref: false, c: 38 });
  const per = 2 * (f.w1 + f.h1 + f.h2);
  const it = { tipus: 'num', llarg: true, html: `La figura ocupa…`, valor: f.A, errs: { [per]: 'mPerim', [f.w1 * (f.h1 + f.h2)]: null } };
  delete it.errs[f.A];
  return { sig: `cp-${nv}-${f.w1}${f.h1}${f.w2}${f.h2}${f.dreta ? 'd' : 'e'}`, enunciat: nv === 3 ? `Quina superfície té aquesta figura, en <b>${u}²</b>? Parteix-la en dos rectangles.` : `Cada quadret fa <b>1 ${u}²</b>. Quina superfície té la figura taronja?`, visual: vis, pista: nv === 3 ? { completa: `Parteix la figura en <b>dos rectangles</b>, calcula la superfície de cada un (base × altura) i suma-les. L'altura que falta la trobes restant.`, mitja: `Dos rectangles: calcula'ls i suma.` } : PISTA_M4,
    ...apartats([{ ...it, html: `La figura ocupa… <span style="color:var(--gris)">(en ${u}²)</span>` }]),
    explicacio: `${f.w1} × ${f.h1} + ${f.w2} × ${f.h2} = ${f.A} ${u}².`, solucio: [`El rectangle de baix: ${f.w1} × ${f.h1} = ${f.w1 * f.h1}.`, `El de dalt: ${f.w2} × ${f.h2} = ${f.w2 * f.h2}. En total, <b>${f.A} ${u}²</b>.`] };
};
/* C · Àrea de rectangles amb les mides escrites */
function msRectsSvg(rs) { // rs: [{b, h, tb, th, nom, grid}] amb b i h en unitats de dibuix
  const esc = Math.min(34, 200 / Math.max(...rs.map(r => r.h)), 380 / rs.reduce((s, r) => s + r.b, 0)); let x = 50, out = ''; const H = Math.max(...rs.map(r => r.h)) * esc;
  for (const r of rs) { const w = r.b * esc, h = r.h * esc, y = 20 + H - h; let g = '';
    if (r.grid) { for (let i = 1; i < r.b; i++) g += `M${x + i * esc} ${y}v${h}`; for (let j = 1; j < r.h; j++) g += `M${x} ${y + j * esc}h${w}`; }
    out += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ffb469" stroke="${MS_N}" stroke-width="3"/><path d="${g}" stroke="${MS_N}" stroke-width="1" opacity=".45"/><text x="${x + w / 2}" y="${y + h / 2 + 8}" text-anchor="middle" font-size="24" font-weight="900" fill="${MS_N}">${r.nom}</text>${msCota(x + w / 2, 20 + H + 24, r.tb)}${msCota(x - 7, y + h / 2 + 6, r.th, 'end')}`; x += w + 96; }
  return `<svg class="ms-esc" viewBox="0 0 ${x - 30} ${H + 60}" role="img" aria-label="Rectangles amb les mides">${out}</svg>`;
}
M4.rect = (nv, { n = 2 } = {}) => {
  const rs = []; const vist = new Set();
  for (let g = 0; rs.length < n && g < 60; g++) {
    let b, h, tb, th, val, errs, sol;
    if (nv === 1) { b = msR(3, 8); h = msR(2, 5); tb = `${b} m`; th = `${h} m`; val = b * h; errs = [[2 * (b + h), 'mPerim'], [b + h, 'mPerim']]; sol = `${b} × ${h} = <b>${val} m²</b>`; }
    else if (nv === 2 || Math.random() < .4) { b = msR(2, 9) + tria([0, .5, .5]); h = msR(2, 6) + (Number.isInteger(b) ? .5 : 0); tb = `${fmtDec(b)} m`; th = `${fmtDec(h)} m`; val = Math.round(b * h * 100) / 100; errs = [[2 * (b + h), 'mPerim'], [b + h, 'mPerim']]; sol = `${fmtDec(b)} × ${fmtDec(h)} = <b>${fmtDec(val)} m²</b>`; }
    else { b = msR(2, 6); const cm = tria([50, 20, 25, 80, 150]); h = cm / 100; tb = `${b} m`; th = `${cm} cm`; val = Math.round(b * h * 100) / 100; errs = [[b * cm, 'mUnitMix'], [2 * (b + h), 'mPerim']]; sol = `${cm} cm = ${fmtDec(h)} m, i ${b} × ${fmtDec(h)} = <b>${fmtDec(val)} m²</b>`; }
    const k = `${tb}${th}`; if (vist.has(k) || b === h) continue; vist.add(k);
    rs.push({ b: Math.max(b, 1.5), h: Math.max(h, 1.2), tb, th, nom: 'AB'[rs.length], grid: nv === 1, val, errs: errs.filter(([v]) => !decIgual(v, val)), sol });
  }
  const its = rs.map(r => ({ tipus: 'dec', html: `Superfície de <b>${r.nom}</b>`, valor: r.val, unitat: 'm²', errs: r.errs }));
  return { sig: `rc-${rs.map(r => r.tb + r.th).join('|')}`, enunciat: nv === 3 ? `Calcula la superfície de cada rectangle, en <b>m²</b>. Compte amb les unitats!` : `Calcula la superfície de cada rectangle.`, visual: () => msRectsSvg(rs), pista: PISTA_M4, ...apartats(its),
    explicacio: `Superfície del rectangle = base × altura.`, solucio: rs.map(r => `${r.nom}: ${r.sol}`) };
};
/* D · Quina superfície té sentit */
const MS_SUP = [ // [cosa, número, unitat bona, icona]
  ['Un pis', 80, 'm²', '🏠'], ['Un full DIN A4', 600, 'cm²', '📄'], ['Una habitació', 12, 'm²', '🛏️'], ['Un camp de futbol', 7000, 'm²', '⚽'], ['La pantalla d\'un mòbil', 100, 'cm²', '📱'],
  ['Catalunya', 32000, 'km²', '🗺️'], ['Una pista de bàsquet', 420, 'm²', '🏀'], ['Una targeta de crèdit', 46, 'cm²', '💳'], ['L\'ungla d\'un dit', 1, 'cm²', '☝️'], ['El terra d\'una aula', 50, 'm²', '🏫'],
  ['Una tovallola de platja', 2, 'm²', '🏖️'], ['Un segell', 6, 'cm²', '✉️'], ['La ciutat de Badalona', 21, 'km²', '🏙️'], ['Una rajola de cuina', 400, 'cm²', '🔲']
];
M4.sentit = (nv, { n = 3 } = {}) => {
  const U = ['mm²', 'cm²', 'm²', 'km²']; const tr = barreja(MS_SUP).slice(0, n);
  const its = tr.map(([c, num, u, ic]) => { const i = U.indexOf(u); const ops = (nv === 1 ? [u, U[i >= 2 ? i - 1 : i + 1], U[i >= 2 ? 0 : 3]] : [u, ...U.filter(x => x !== u)].slice(0, nv === 2 ? 3 : 4)).sort((a, b) => U.indexOf(a) - U.indexOf(b));
    return { tipus: 'tria', llarg: true, html: `<span class="ms-sit">${ic}</span> ${c} ocupa…`, opcions: ops.map(x => ({ html: `<b>${fmtDec(num)} ${x}</b>`, val: x })), correcta: u, etiq: Object.fromEntries(ops.filter(x => x !== u).map(x => [x, U.indexOf(x) > i ? 'mGran' : 'mPetit'])), c, bo: `${fmtDec(num)} ${u}` }; });
  return { sig: `ss-${tr.map(t => t[0]).join('|')}`, enunciat: `Quina superfície té sentit?`, visual: nv === 1 ? () => msSupRefs() : null, pista: { completa: `Un <b>m²</b> és un quadrat d'1 m de costat: hi cap FR-4C estirat. Un <b>cm²</b> és com l'ungla d'un dit. Un <b>km²</b> és com cent camps de futbol.`, mitja: `Imagina't el quadrat: d'1 cm, d'1 m o d'1 km de costat?` }, ...apartats(its),
    explicacio: `Imagina't quants quadrats d'aquella mida hi caben.`, solucio: its.map(it => `${it.c}: <b>${it.bo}</b>.`) };
};
const msSupRefs = () => `<div class="ms-refs"><div><i>☝️</i>una ungla<b>1 cm²</b></div><div>${robot(40)}un quadrat d'1 m<b>1 m²</b></div><div><i>⚽</i>mig camp de futbol<b>uns 3500 m²</b></div></div>`;
M4.salts = (nv, { auto = nv === 1 } = {}) => msSaltsEx(nv, { mag: 'S', auto });
M4.escriu = (nv, { n = 3 } = {}) => msEscriuEx(nv, { n, mag: 'S' });
const MS_CTX4 = {
  1: [
    () => { const b = msR(3, 6), h = msR(2, 3); return { t: `Vull pintar una paret de ${b} m de llargada i ${h} m d'alçada. Quina superfície he de pintar?`, v: b * h, u: 'm²', alt: 2 * (b + h), s: `${b} × ${h} = <b>${b * h} m²</b>` }; },
    () => { const b = msR(4, 9), h = msR(3, 6); return { t: `Un hort rectangular fa ${b} m per ${h} m. Quina superfície té?`, v: b * h, u: 'm²', alt: 2 * (b + h), s: `${b} × ${h} = <b>${b * h} m²</b>` }; },
    () => { const c = msR(3, 9); return { t: `Una habitació quadrada fa ${c} m de costat. Quina superfície té el terra?`, v: c * c, u: 'm²', alt: 4 * c, s: `${c} × ${c} = <b>${c * c} m²</b>` }; },
    () => { const b = msR(2, 4), h = msR(1, 2); return { t: `Una catifa fa ${b} m per ${h} m. Quants m² ocupa?`, v: b * h, u: 'm²', alt: 2 * (b + h), s: `${b} × ${h} = <b>${b * h} m²</b>` }; }
  ],
  2: [
    () => { const b = msR(3, 6) + .5, h = tria([2, 3]); return { t: `Una paret fa ${fmtDec(b)} m de llargada i ${h} m d'alçada. Quina superfície té?`, v: b * h, u: 'm²', alt: 2 * (b + h), s: `${fmtDec(b)} × ${h} = <b>${fmtDec(b * h)} m²</b>` }; },
    () => { const b = tria([20, 25, 30]), h = tria([12, 15, 18]); return { t: `El pati fa ${b} m per ${h} m. Quina superfície té?`, v: b * h, u: 'm²', alt: 2 * (b + h), s: `${b} × ${h} = <b>${b * h} m²</b>` }; },
    () => { const b = tria([120, 150, 80]), h = tria([60, 50, 70]); return { t: `Una taula fa ${b} cm per ${h} cm. Quina superfície té, en <b>cm²</b>?`, v: b * h, u: 'cm²', alt: 2 * (b + h), s: `${b} × ${h} = <b>${fmtDec(b * h)} cm²</b>` }; },
    () => { const m = tria([3, 5, 12]); return { t: `Un vidre fa ${m} m². Quants <b>dm²</b> són?`, v: m * 100, u: 'dm²', alt: m * 10, s: `${m} m² × 100 = <b>${m * 100} dm²</b>` }; }
  ],
  3: [
    () => { const b = tria([100, 105, 90]), h = tria([70, 60, 50]); return { t: `Un camp de futbol fa ${b} m per ${h} m. Quantes <b>hectàrees</b> ocupa? (1 ha = 10 000 m²)`, v: b * h / 10000, u: 'ha', alt: b * h, s: `${b} × ${h} = ${fmtDec(b * h)} m², i ${fmtDec(b * h)} ÷ 10 000 = <b>${fmtDec(b * h / 10000)} ha</b>` }; },
    () => { const b = tria([3, 4, 5]), h = tria([2, 3]); return { t: `Vull enrajolar un terra de ${b} m per ${h} m amb rajoles quadrades de 50 cm de costat. Quantes rajoles necessito?`, v: b * h * 4, u: 'rajoles', alt: b * h * 2, s: `Cada rajola fa 0,5 × 0,5 = 0,25 m². ${b * h} ÷ 0,25 = <b>${b * h * 4} rajoles</b>` }; },
    () => ({ t: `Un full DIN A4 fa 21 cm per 30 cm. Quina superfície té, en <b>cm²</b>?`, v: 630, u: 'cm²', alt: 102, s: `21 × 30 = <b>630 cm²</b>` }),
    () => { const b = tria([150, 200, 250]), h = tria([80, 120]); return { t: `Una taula fa ${b} cm per ${h} cm. Quina superfície té, en <b>m²</b>?`, v: b * h / 10000, u: 'm²', alt: b * h, s: `${fmtDec(b / 100)} m × ${fmtDec(h / 100)} m = <b>${fmtDec(b * h / 10000)} m²</b>` }; }
  ]
};
const msContextEx = (nv, n, llista, pref, enun, pista) => { const fs = barreja(llista[nv]).slice(0, n).map(f => f());
  const its = fs.map(f => ({ tipus: 'dec', llarg: true, html: f.t, valor: f.v, unitat: f.u, errs: f.alt != null && !decIgual(f.alt, f.v) ? [[f.alt, f.tag || (pref === 'x4' ? (f.u === 'dm²' ? 'mFactor' : f.u === 'rajoles' ? 'mSuperf' : f.u === 'ha' || (f.u === 'm²' && /cm/.test(f.t)) ? 'mUnitMix' : 'mPerim') : 'mSentit')]] : [], s: f.s }));
  return { sig: `${pref}-${fs.map(f => textPla(f.t).slice(0, 26) + f.v).join('|')}`, enunciat: enun, visual: null, pista, ...apartats(its), explicacio: `Llegeix bé què et demanen i en quina unitat.`, solucio: its.map(it => it.s) }; };
M4.context = (nv, { n = 2 } = {}) => msContextEx(nv, n, MS_CTX4, 'x4', `Superfícies de cada dia.`, PISTA_M4);
TEMES.m4 = {
  gen: M4,
  sequencia: {
    1: [['fesRect'], ['comptar'], ['fesRect'], ['rect', { n: 2 }], ['sentit', { n: 3 }], ['salts'], ['comptar'], ['context', { n: 2 }]],
    2: [['fesRect'], ['rect', { n: 2 }], ['comptar'], ['salts'], ['sentit', { n: 3 }], ['escriu', { n: 3 }], ['context', { n: 2 }], ['rect', { n: 2 }]],
    3: [['fesRect'], ['rect', { n: 2 }], ['comptar'], ['salts'], ['escriu', { n: 3 }], ['context', { n: 2 }], ['sentit', { n: 4 }], ['comptar']]
  },
  explicacio: [
    { text: `<p>La <b class="parpelleja">superfície</b> és el que ocupa una cosa plana: un terra, una paret, un full.</p><p class="petit">Es mesura en quadrats. Un quadrat d'1 m de costat és <b>1 m²</b>.</p>`, vis: () => msRectGraella(1, 1, 6, 4) },
    { text: `<p>En un rectangle no cal comptar els quadrets d'un en un.</p><p class="petit">4 columnes i 3 files: <b class="parpelleja">base × altura</b> = 4 × 3 = <b>12 m²</b>.</p>`, vis: () => msRectGraella(4, 3, 6, 4) },
    { text: `<p>No la confonguis amb el <b>perímetre</b>, que és la vora: la volta sencera.</p><p class="petit">La vora d'aquest rectangle fa 4 + 3 + 4 + 3 = 14 m. La superfície, 12 m².</p>`, vis: () => msRectsSvg([{ b: 4, h: 3, tb: '4 m', th: '3 m', nom: '12 m²', grid: true }]) },
    { text: `<p>Per canviar d'unitat, cada salt és <b class="parpelleja">×100</b>, no ×10.</p><p class="petit">En 1 m² hi caben 10 files de 10 quadrets d'1 dm²: 100 dm².</p>`, vis: () => `<div class="ms-s-eq">1 m² = <b>100</b> dm²</div>${msPistaSvg({ mag: 'S', or: 3, de: 4, anima: [3, 4] })}` }
  ],
  exemple: nv => {
    if (nv === 1) return { enunciat: `Quina superfície té un rectangle de 5 m de base i 3 m d'altura?`, passos: [
      { text: `Hi ha <b>3 files</b> de <b>5 quadrets</b>.`, vis: msRectGraella(5, 3, 7, 4) },
      { text: `Base × altura: 5 × 3 = <b>15 m²</b>. <span class="marca-ok">✓</span>`, vis: msRectGraella(5, 3, 7, 4) }] };
    if (nv === 2) return { enunciat: `Passa 2,5 m² a dm².`, passos: [
      { text: `De m² a dm² hi ha <b>1 salt</b> cap a la dreta. En superfícies, cada salt és <b>×100</b>.`, vis: msPistaSvg({ mag: 'S', or: 3, de: 4, pos: 3 }) },
      { text: `2,5 × 100 = 250. Per tant, <b>2,5 m² = 250 dm²</b>. <span class="marca-ok">✓</span>`, vis: `<div class="ms-s-eq">2,5 m² = <b>250</b> dm²</div>${msPistaSvg({ mag: 'S', or: 3, de: 4, pos: 4 })}` }] };
    return { enunciat: `Quina superfície té un rectangle de 2 m per 50 cm, en m²?`, passos: [
      { text: `Les mides estan en unitats diferents! Primer, a la mateixa: 50 cm = <b>0,5 m</b>.`, vis: msRectsSvg([{ b: 4, h: 1.2, tb: '2 m', th: '50 cm', nom: '?' }]) },
      { text: `Ara sí: 2 × 0,5 = <b>1 m²</b>. <span class="marca-ok">✓</span>`, vis: msRectsSvg([{ b: 4, h: 1.2, tb: '2 m', th: '0,5 m', nom: '1 m²' }]) }] };
  }
};

/* =====================================================================
   OBJECTIU 5 · VOLUM I CAPACITAT (cubs, llarg × ample × alt i l'equivalència 1 dm³ = 1 L)
   ===================================================================== */
const PISTA_M5 = { completa: `El volum és l'espai que ocupa una cosa: <b>quants cubs hi caben</b>. En una caixa: <b>llarg × ample × alt</b>. I recorda: <b>1 dm³ = 1 L</b>.`, mitja: `Llarg × ample × alt.` };
/* caixa feta de cubs, en perspectiva */
function msPrismaSvg(a, b, c, { W = 420, H = 250, etq = null } = {}) {
  const C = .866, s = Math.min(38, (W - 110) / ((a + b) * C), (H - 46) / ((a + b) * .5 + c)); const ox = (W - (a - b) * s * C) / 2, oy = 16 + c * s + (H - 40 - ((a + b) * .5 + c) * s) / 2;
  const P = (i, j, k) => `${(ox + (i - j) * s * C).toFixed(1)},${(oy + (i + j) * s * .5 - k * s).toFixed(1)}`; let out = '';
  const cara = (pts, f) => `<polygon points="${pts.join(' ')}" fill="${f}" stroke="${MS_N}" stroke-width="1.6" stroke-linejoin="round"/>`;
  for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) out += cara([P(i, j, c), P(i + 1, j, c), P(i + 1, j + 1, c), P(i, j + 1, c)], '#ffe0bd');
  for (let j = 0; j < b; j++) for (let k = 0; k < c; k++) out += cara([P(a, j, k), P(a, j + 1, k), P(a, j + 1, k + 1), P(a, j, k + 1)], '#f39a3d');
  for (let i = 0; i < a; i++) for (let k = 0; k < c; k++) out += cara([P(i, b, k), P(i + 1, b, k), P(i + 1, b, k + 1), P(i, b, k + 1)], '#ffb469');
  let cotes = '';
  if (etq) { const p = (i, j, k) => P(i, j, k).split(',').map(Number); const [x1, y1] = p(a / 2, b, 0), [x2, y2] = p(a, b / 2, 0), [x3, y3] = p(0, b, c / 2);
    cotes = msCota(x1 - 14, y1 + 22, etq[0]) + msCota(x2 + 18, y2 + 22, etq[1]) + msCota(x3 - 10, y3 + 6, etq[2], 'end'); }
  return `<svg class="ms-esc" viewBox="0 0 ${W} ${H}" role="img" aria-label="Caixa de ${a} per ${b} per ${c} cubs">${out}${cotes}</svg>`;
}
const M5 = {};
/* A · Construeix una caixa amb el volum que et demanen */
M5.fesPrisma = nv => {
  const A = msR(2, 4), B = msR(2, 3), C = msR(nv === 1 ? 1 : 2, 3), V = A * B * C;
  const enun = nv === 1 ? `Construeix una caixa de <b>${V} cubs</b>.` : nv === 2 ? `Construeix una caixa de <b>${V} cubs</b> que tingui una base de <b>${A} × ${B}</b>.` : `Construeix una caixa de <b>${V} cubs</b> que faci <b>${C} d'alt</b> i <b>${A} de llarg</b>.`;
  const bo = G => G.a * G.b * G.c === V && (nv === 1 || (nv === 2 ? ((G.a === A && G.b === B) || (G.a === B && G.b === A)) : G.c === C && G.a === A));
  return { sig: `fp-${nv}-${A}-${B}-${C}`, enunciat: enun, visual: null, pista: PISTA_M5,
    ...msGiny({
      inici: () => ({ a: 1, b: 1, c: 1, mogut: false }),
      munta(z, G, ctx) {
        const pinta = () => { $('.ms-zona', z).innerHTML = msPrismaSvg(G.a, G.b, G.c); const cp = $('.ms-compte', z); if (cp) cp.innerHTML = nv === 1 ? `Cubs: <b>${G.a * G.b * G.c}</b>` : `${G.a} de llarg · ${G.b} d'ample · ${G.c} d'alt`; ctx.canvi(); };
        z.innerHTML = `<div class="ms-g"><div class="ms-zona"></div><div class="ms-compte"></div><div class="ms-ctl">${[['a', 'Llarg'], ['b', 'Ample'], ['c', 'Alt']].map(([e, t]) => `<span class="grup">${t} <button data-e="${e}" data-d="-1">−</button><button data-e="${e}" data-d="1">+</button></span>`).join('')}</div></div>`;
        G.posa = (a, b, c) => { G.a = Math.max(1, Math.min(5, a)); G.b = Math.max(1, Math.min(4, b)); G.c = Math.max(1, Math.min(4, c)); G.mogut = true; pinta(); };
        z.onclick = e => { const bt = e.target.closest('[data-e]'); if (!bt || !ctx.actiu()) return; const d = Number(bt.dataset.d), k = bt.dataset.e, ab = G.a * G.b * G.c; G.posa(G.a + (k === 'a' ? d : 0), G.b + (k === 'b' ? d : 0), G.c + (k === 'c' ? d : 0)); if (ab !== G.a * G.b * G.c) so(d > 0 ? 'pes' : 'treu'); };
        pinta();
      },
      fet: G => G.mogut && G.a * G.b * G.c > 1, ok: bo, txt: G => `caixa de ${G.a} × ${G.b} × ${G.c} = ${G.a * G.b * G.c} cubs`, etiq: G => G.a + G.b + G.c === V ? 'mSuma' : null,
      tanca(z, G, ok) { msTancaEnt(z, ok); }, demo: resolt => resolt ? msPrismaSvg(A, B, C) : msPrismaSvg(1, 1, 1),
      resol(z, G, be) { G.posa(A, B, be ? C : (C < 4 ? C + 1 : C - 1)); }
    }, `per exemple, <b>${A} × ${B} × ${C}</b> (${V} cubs)`),
    explicacio: `${A} × ${B} × ${C} = ${V} cubs.`, solucio: [`El volum d'una caixa és llarg × ample × alt.`, `${A} × ${B} × ${C} = <b>${V} cubs</b>.`] };
};
/* B · Quants cubs hi ha (també els que no es veuen) */
M5.cubs = nv => {
  const a = msR(2, nv === 1 ? 3 : 5), b = msR(2, nv === 1 ? 3 : 4), c = msR(nv === 1 ? 1 : 2, nv === 1 ? 2 : 4), V = a * b * c; const vis = a * b + a * c + b * c - a - b - c + 1;
  const errs = { [vis]: 'mCares', [a + b + c]: 'mSuma', [a * b + a * c + b * c]: 'mCares' }; delete errs[V];
  const it = { tipus: 'num', llarg: true, html: nv === 3 ? `Hi caben… <span style="color:var(--gris)">(en litres)</span>` : nv === 2 ? `El volum és… <span style="color:var(--gris)">(en cm³)</span>` : `Hi ha… <span style="color:var(--gris)">(cubs)</span>`, valor: V, errs };
  return { sig: `cb-${nv}-${a}${b}${c}`, enunciat: nv === 3 ? `Aquest dipòsit fa <b>${a} dm × ${b} dm × ${c} dm</b>. Quants <b>litres</b> hi caben?` : nv === 2 ? `Cada cub fa <b>1 cm³</b>. Quin volum té la caixa? Compta també els cubs que no es veuen!` : `Quants cubs té aquesta caixa? Compta també els que no es veuen!`,
    visual: () => msPrismaSvg(a, b, c, nv === 3 ? { etq: [`${a} dm`, `${b} dm`, `${c} dm`] } : {}), pista: PISTA_M5, ...apartats([it]),
    explicacio: `${a} × ${b} × ${c} = ${V}${nv === 3 ? ' dm³, i 1 dm³ = 1 L' : ''}.`, solucio: [`A cada pis hi ha ${a} × ${b} = ${a * b} cubs, i hi ha ${c} ${c === 1 ? 'pis' : 'pisos'}.`, `${a * b} × ${c} = <b>${V} ${nv === 3 ? 'dm³ = ' + V + ' L' : nv === 2 ? 'cm³' : 'cubs'}</b>.`] };
};
/* C · L'equivalència entre volum i capacitat */
const msVolRefs = () => `<div class="ms-refs"><div><i>🧊</i>1 m³ (un cub d'1 m)<b>1000 L</b></div><div>${msBric(30)}1 dm³<b>1 L</b></div><div><i>🎲</i>1 cm³ (un dau)<b>1 mL</b></div></div>`;
M5.litre = (nv, { n = 3 } = {}) => {
  const P1 = [() => { const x = msR(2, 9); return [`${x} dm³`, x, 'L', [[x * 1000, 'mLitre'], [x / 1000, 'mLitre']], `1 dm³ = 1 L: <b>${x} L</b>`]; }, () => { const x = msR(2, 9) * 10; return [`${x} cm³`, x, 'mL', [[x * 1000, 'mLitre'], [x / 1000, 'mLitre']], `1 cm³ = 1 mL: <b>${x} mL</b>`]; },
    () => { const x = msR(2, 6); return [`${x} m³`, x * 1000, 'L', [[x, 'mLitre'], [x * 100, 'mFactor'], [x * 10, 'mFactor']], `1 m³ = 1000 L: <b>${fmtDec(x * 1000)} L</b>`]; }, () => { const x = msR(2, 9); return [`${x} L`, x, 'dm³', [[x * 1000, 'mLitre']], `1 L = 1 dm³: <b>${x} dm³</b>`]; }];
  const P2 = [() => { const x = tria([1.5, 2.5, .5, .25, 3.5]); return [`${fmtDec(x)} m³`, x * 1000, 'L', [[x, 'mLitre'], [x * 100, 'mFactor']], `${fmtDec(x)} × 1000 = <b>${fmtDec(x * 1000)} L</b>`]; }, () => { const x = tria([500, 2500, 750, 4000]); return [`${x} L`, x / 1000, 'm³', [[x * 1000, 'mSentit'], [x, 'mLitre']], `${x} ÷ 1000 = <b>${fmtDec(x / 1000)} m³</b>`]; },
    () => { const x = tria([250, 330, 500, 75]); return [`${x} mL`, x, 'cm³', [[x / 1000, 'mLitre']], `1 mL = 1 cm³: <b>${x} cm³</b>`]; }, () => { const x = tria([1.5, 2, .5, .33]); return [`${fmtDec(x)} L`, x * 1000, 'cm³', [[x, 'mLitre'], [x / 1000, 'mSentit']], `${fmtDec(x)} L = ${fmtDec(x * 1000)} mL = <b>${fmtDec(x * 1000)} cm³</b>`]; },
    () => { const x = tria([2000, 500, 1500, 750]); return [`${x} cm³`, x / 1000, 'L', [[x, 'mLitre'], [x * 1000, 'mSentit']], `${x} cm³ = ${x} mL = <b>${fmtDec(x / 1000)} L</b>`]; }];
  const tr = barreja(nv === 1 ? P1 : nv === 2 ? [...P1.slice(2), ...P2] : P2).slice(0, n).map(f => f());
  const its = tr.map(([h, v, u, errs, s]) => ({ tipus: 'dec', html: h, valor: v, unitat: u, errs: errs.filter(([x]) => !decIgual(x, v)), s }));
  return { sig: `lt-${tr.map(t => t[0] + t[2]).join('|')}`, enunciat: `Del volum a la capacitat, i al revés.`, visual: nv === 3 ? (completa => completa ? msVolRefs() : '') : () => msVolRefs(), pista: PISTA_M5, ...apartats(its),
    explicacio: `1 dm³ = 1 L · 1 cm³ = 1 mL · 1 m³ = 1000 L.`, solucio: its.map(it => `${it.html}: ${it.s}`) };
};
const MS_VOL = [ // [cosa, número, unitat bona, icona, opcions]
  ['Una nevera', 300, 'L', '🧊', ['mL', 'L', 'm³']], ['Una habitació', 30, 'm³', '🛏️', ['cm³', 'dm³', 'm³']], ['Un dau', 1, 'cm³', '🎲', ['cm³', 'dm³', 'm³']], ['Una caixa de sabates', 10, 'dm³', '👟', ['cm³', 'dm³', 'm³']],
  ['Una banyera', 150, 'L', '🛁', ['mL', 'L', 'm³']], ['Una piscina olímpica', 2500, 'm³', '🏊', ['L', 'dm³', 'm³']], ['Una motxilla', 20, 'L', '🎒', ['mL', 'L', 'm³']], ['El maleter d\'un cotxe', 400, 'L', '🚗', ['mL', 'L', 'm³']],
  ['Un got', 200, 'cm³', '🥛', ['cm³', 'dm³', 'm³']], ['Un camió cisterna', 30, 'm³', '🚛', ['cm³', 'L', 'm³']], ['Una xeringa', 5, 'mL', '💉', ['mL', 'L', 'm³']], ['Un contenidor d\'escombraries', 1, 'm³', '🗑️', ['cm³', 'dm³', 'm³']]
];
M5.sentit = (nv, { n = 3 } = {}) => {
  const tr = barreja(MS_VOL).slice(0, n);
  const its = tr.map(([c, num, u, ic, ops]) => ({ tipus: 'tria', llarg: true, html: `<span class="ms-sit">${ic}</span> ${c} fa…`, opcions: ops.map(x => ({ html: `<b>${fmtDec(num)} ${x}</b>`, val: x })), correcta: u, etiq: Object.fromEntries(ops.filter(x => x !== u).map(x => [x, ops.indexOf(x) > ops.indexOf(u) ? 'mGran' : 'mPetit'])), c, bo: `${fmtDec(num)} ${u}` }));
  return { sig: `sv-${tr.map(t => t[0]).join('|')}`, enunciat: `Quin volum té sentit?`, visual: nv < 3 ? () => msVolRefs() : null, pista: { completa: `Un <b>cm³</b> és com un dau. Un <b>dm³</b> és un bric de llet: 1 L. Un <b>m³</b> és un cub d'1 m de costat: hi caben 1000 brics.`, mitja: `Un dau, un bric o un cub d'un metre?` }, ...apartats(its),
    explicacio: `Compara amb un dau (1 cm³), un bric (1 L) o un cub d'1 m (1000 L).`, solucio: its.map(it => `${it.c}: <b>${it.bo}</b>.`) };
};
M5.salts = (nv, { auto = nv === 1 } = {}) => msSaltsEx(nv, { mag: 'V', auto });
M5.escriu = (nv, { n = 3 } = {}) => msEscriuEx(nv, { n, mag: 'V' });
const MS_CTX5 = {
  1: [
    () => { const a = msR(2, 5), b = msR(2, 3), c = msR(2, 3); return { t: `Una caixa fa ${a} dm × ${b} dm × ${c} dm. Quants <b>litres</b> hi caben?`, v: a * b * c, u: 'L', alt: a + b + c, tag: 'mSuma', s: `${a} × ${b} × ${c} = ${a * b * c} dm³ = <b>${a * b * c} L</b>` }; },
    () => { const x = msR(2, 5); return { t: `Una piscina inflable fa ${x} m³. Quants <b>litres</b> d'aigua hi caben?`, v: x * 1000, u: 'L', alt: x * 100, tag: 'mFactor', s: `${x} × 1000 = <b>${x * 1000} L</b>` }; },
    () => { const x = tria([2, 5, 8]); return { t: `Una garrafa fa ${x} L. Quants <b>dm³</b> són?`, v: x, u: 'dm³', alt: x * 1000, tag: 'mLitre', s: `1 L = 1 dm³: <b>${x} dm³</b>` }; },
    () => { const x = tria([5, 10, 20]); return { t: `Una xeringa té ${x} mL. Quants <b>cm³</b> són?`, v: x, u: 'cm³', alt: x * 1000, tag: 'mLitre', s: `1 mL = 1 cm³: <b>${x} cm³</b>` }; }
  ],
  2: [
    () => { const a = msR(4, 8), b = msR(2, 4), c = msR(3, 5); return { t: `Un aquari fa ${a} dm × ${b} dm × ${c} dm. Quants <b>litres</b> hi caben?`, v: a * b * c, u: 'L', alt: a + b + c, tag: 'mSuma', s: `${a} × ${b} × ${c} = ${a * b * c} dm³ = <b>${a * b * c} L</b>` }; },
    () => { const x = tria([1.5, 2.5, .5]); return { t: `Un dipòsit d'aigua fa ${fmtDec(x)} m³. Quants <b>litres</b> són?`, v: x * 1000, u: 'L', alt: x * 100, tag: 'mFactor', s: `${fmtDec(x)} × 1000 = <b>${fmtDec(x * 1000)} L</b>` }; },
    () => { const x = tria([8, 5, 2]); return { t: `Una garrafa fa ${x} L. Quants <b>cm³</b> són?`, v: x * 1000, u: 'cm³', alt: x, tag: 'mLitre', s: `${x} L = ${x} dm³ = <b>${x * 1000} cm³</b>` }; },
    () => { const x = tria([330, 500, 250]); return { t: `Una llauna fa ${x} cm³. Quants <b>litres</b> són?`, v: x / 1000, u: 'L', alt: x, tag: 'mLitre', s: `${x} cm³ = ${x} mL = <b>${fmtDec(x / 1000)} L</b>` }; }
  ],
  3: [
    () => { const a = tria([50, 60, 80]), b = tria([30, 40]), c = tria([30, 40, 50]); return { t: `Un aquari fa ${a} cm × ${b} cm × ${c} cm. Quants <b>litres</b> hi caben?`, v: a * b * c / 1000, u: 'L', alt: a * b * c, tag: 'mLitre', s: `${a} × ${b} × ${c} = ${fmtDec(a * b * c)} cm³, i ÷ 1000 = <b>${fmtDec(a * b * c / 1000)} L</b>` }; },
    () => { const a = tria([5, 6, 8]), b = tria([3, 4]), c = tria([1.5, 2]); return { t: `Una piscina fa ${a} m × ${b} m × ${fmtDec(c)} m. Quants <b>litres</b> d'aigua hi caben?`, v: a * b * c * 1000, u: 'L', alt: a * b * c, tag: 'mLitre', s: `${a} × ${b} × ${fmtDec(c)} = ${fmtDec(a * b * c)} m³, i × 1000 = <b>${fmtDec(a * b * c * 1000)} L</b>` }; },
    () => { const L = tria([2, 3]), g = tria([200, 250]); return { t: `Tinc ${L} L de suc. Quants gots de ${g} cm³ puc omplir?`, v: L * 1000 / g, u: 'gots', alt: L / g, tag: 'mLitre', s: `${L} L = ${L * 1000} cm³, i ${L * 1000} ÷ ${g} = <b>${L * 1000 / g} gots</b>` }; },
    () => { const p = tria([4, 5]), d = tria([150, 200]); return { t: `Una família de ${p} persones gasta ${d} L d'aigua per persona cada dia. Quants <b>m³</b> gasta en 10 dies?`, v: p * d * 10 / 1000, u: 'm³', alt: p * d * 10, tag: 'mLitre', s: `${p} × ${d} × 10 = ${fmtDec(p * d * 10)} L, i ÷ 1000 = <b>${fmtDec(p * d * 10 / 1000)} m³</b>` }; }
  ]
};
M5.context = (nv, { n = 2 } = {}) => msContextEx(nv, n, MS_CTX5, 'x5', `Volums i capacitats de cada dia.`, PISTA_M5);
TEMES.m5 = {
  gen: M5,
  sequencia: {
    1: [['fesPrisma'], ['cubs'], ['fesPrisma'], ['litre', { n: 2 }], ['sentit', { n: 3 }], ['cubs'], ['salts'], ['context', { n: 2 }]],
    2: [['fesPrisma'], ['cubs'], ['litre', { n: 3 }], ['salts'], ['sentit', { n: 3 }], ['cubs'], ['escriu', { n: 3 }], ['context', { n: 2 }]],
    3: [['fesPrisma'], ['cubs'], ['litre', { n: 3 }], ['salts'], ['escriu', { n: 3 }], ['context', { n: 2 }], ['sentit', { n: 4 }], ['cubs']]
  },
  explicacio: [
    { text: `<p>El <b class="parpelleja">volum</b> és l'espai que ocupa una cosa.</p><p class="petit">Es mesura en cubs. Aquesta caixa en té 3 de llarg, 2 d'ample i 2 d'alt.</p>`, vis: () => msPrismaSvg(3, 2, 2) },
    { text: `<p>No cal comptar-los d'un en un (i alguns no es veuen!).</p><p class="petit"><b class="parpelleja">Llarg × ample × alt</b>: 3 × 2 × 2 = <b>12 cubs</b>.</p>`, vis: () => msPrismaSvg(3, 2, 2, { etq: ['3', '2', '2'] }) },
    { text: `<p>El volum i la capacitat van junts.</p><p class="petit">En un cub d'1 dm de costat hi cap exactament <b class="parpelleja">1 litre</b>: 1 dm³ = 1 L.</p>`, vis: () => msVolRefs() },
    { text: `<p>Per canviar d'unitat, cada salt és <b class="parpelleja">×1000</b>.</p><p class="petit">En 1 m³ hi caben 10 × 10 × 10 cubs d'1 dm³: 1000 dm³, que són 1000 L.</p>`, vis: () => `<div class="ms-s-eq">1 m³ = <b>1000</b> dm³</div>${msPistaSvg({ mag: 'V', or: 3, de: 4, anima: [3, 4] })}` }
  ],
  exemple: nv => {
    if (nv === 1) return { enunciat: `Quants cubs té una caixa de 4 de llarg, 2 d'ample i 3 d'alt?`, passos: [
      { text: `A cada pis hi ha 4 × 2 = <b>8 cubs</b>.`, vis: msPrismaSvg(4, 2, 1) },
      { text: `Hi ha 3 pisos: 8 × 3 = <b>24 cubs</b>. <span class="marca-ok">✓</span>`, vis: msPrismaSvg(4, 2, 3) }] };
    if (nv === 2) return { enunciat: `Un dipòsit fa 2,5 m³. Quants litres són?`, passos: [
      { text: `En 1 m³ hi caben <b>1000 L</b>.`, vis: msVolRefs() },
      { text: `2,5 × 1000 = <b>2500 L</b>. <span class="marca-ok">✓</span>`, vis: `<div class="ms-s-eq">2,5 m³ = <b>2500</b> L</div>${msPistaSvg({ mag: 'V', or: 3, de: 4, pos: 4 })}` }] };
    return { enunciat: `Un aquari fa 50 cm × 30 cm × 40 cm. Quants litres hi caben?`, passos: [
      { text: `Volum: 50 × 30 × 40 = <b>60 000 cm³</b>.`, vis: msPrismaSvg(5, 3, 4, { etq: ['50 cm', '30 cm', '40 cm'] }) },
      { text: `1000 cm³ fan 1 L: 60 000 ÷ 1000 = <b>60 L</b>. <span class="marca-ok">✓</span>`, vis: `<div class="ms-s-eq">60 000 cm³ = <b>60</b> L</div>${msPistaSvg({ mag: 'V', or: 5, de: 4, pos: 4 })}` }] };
  }
};

/* =====================================================================
   OBJECTIU 6 · EL TEMPS (rellotge d'agulles, hores i minuts, durades)
   ===================================================================== */
const PISTA_M6 = { completa: `L'agulla <b>curta</b> marca les hores i la <b>llarga</b>, els minuts. Per als minuts, cada número val 5: el 3 són 15, el 6 són 30 i el 9 són 45. I una hora té <b>60 minuts</b>.`, mitja: `Curta: hores. Llarga: minuts (cada número, 5). 1 h = 60 min.` };
const msHora = t => { const x = ((t % 1440) + 1440) % 1440; return `${Math.floor(x / 60)}:${String(x % 60).padStart(2, '0')}`; };
const msDur = min => `${Math.floor(min / 60) ? Math.floor(min / 60) + ' h' : ''}${min % 60 ? (Math.floor(min / 60) ? ' ' : '') + (min % 60) + ' min' : ''}` || '0 min';
/* rellotge d'agulles; t en minuts (pot créixer sense límit: les agulles giren seguit) */
function msRellotgeSvg(t, mida = 0, cls = '') {
  let marques = '', nums = '';
  for (let i = 0; i < 60; i++) { const a = i * 6 * Math.PI / 180, r1 = i % 5 ? 88 : 82; marques += `M${(100 + 92 * Math.sin(a)).toFixed(1)} ${(100 - 92 * Math.cos(a)).toFixed(1)}L${(100 + r1 * Math.sin(a)).toFixed(1)} ${(100 - r1 * Math.cos(a)).toFixed(1)}`; }
  for (let h = 1; h <= 12; h++) { const a = h * 30 * Math.PI / 180; nums += `<text x="${(100 + 69 * Math.sin(a)).toFixed(1)}" y="${(100 - 69 * Math.cos(a) + 7).toFixed(1)}" text-anchor="middle" font-size="19" font-weight="900" fill="${MS_N}" font-family="system-ui,sans-serif">${h}</text>`; }
  return `<svg class="${mida ? 'ms-mini' : 'ms-esc'} ms-rell ${cls}" ${mida ? `width="${mida}" height="${mida}"` : ''} viewBox="0 0 200 200" role="img" aria-label="Rellotge d'agulles"><circle cx="100" cy="100" r="95" fill="#fff" stroke="${MS_N}" stroke-width="5"/><path d="${marques}" stroke="${MS_N}" stroke-width="1.6"/>${nums}
    <g class="ms-agulla ms-ah" style="transform-origin:100px 100px;transform:rotate(${t * .5}deg)"><path d="M100 108L100 54" stroke="${MS_N}" stroke-width="8" stroke-linecap="round"/></g>
    <g class="ms-agulla ms-am" style="transform-origin:100px 100px;transform:rotate(${t * 6}deg)"><path d="M100 112L100 22" stroke="${T}" stroke-width="5" stroke-linecap="round"/></g><circle cx="100" cy="100" r="6" fill="${MS_N}"/></svg>`;
}
const msSwap = t => { const h = Math.floor(t / 60) % 12, m = t % 60; return ((Math.round(m / 5) % 12) || 12) * 60 % 720 + (h % 12) * 5; }; // agulles intercanviades
const msT12 = t => { const x = ((t % 720) + 720) % 720; return `${Math.floor(x / 60) || 12}:${String(x % 60).padStart(2, '0')}`; };
const M6 = {};
/* A · Posa el rellotge a l'hora */
M6.posaHora = nv => {
  let h, m; do { h = msR(1, 12); m = nv === 1 ? tria([0, 15, 30, 45]) : msR(1, 11) * 5; } while (h === 12 && m === 0); const obj = (h % 12) * 60 + m;
  const txt = nv === 3 ? msHora(obj + 720) : msT12(obj); const base = 7200; // comença a les 12:00
  return { sig: `ph-${nv}-${obj}`, enunciat: `Posa el rellotge a les <b>${txt}</b>${nv === 3 ? ' (de la tarda)' : ''}.`, visual: null, pista: PISTA_M6,
    ...msGiny({
      inici: () => ({ t: base, mogut: false }),
      munta(z, G, ctx) {
        z.innerHTML = `<div class="ms-g">${msRellotgeSvg(G.t)}<div class="ms-ctl"><span class="grup">Hores <button data-d="-60">−</button><button data-d="60">+</button></span><span class="grup">Minuts <button data-d="-5">−5</button><button data-d="5">+5</button></span></div><p class="ms-nota">L'agulla negra i curta és la de les hores. La taronja, la dels minuts.</p></div>`;
        G.posa = t => { G.t = t; G.mogut = true; $('.ms-ah', z).style.transform = `rotate(${t * .5}deg)`; $('.ms-am', z).style.transform = `rotate(${t * 6}deg)`; ctx.canvi(); };
        z.onclick = e => { const b = e.target.closest('[data-d]'); if (!b || !ctx.actiu()) return; so('clic'); G.posa(G.t + Number(b.dataset.d)); };
      },
      fet: G => G.mogut && G.t !== base, ok: G => ((G.t % 720) + 720) % 720 === obj, txt: G => `posa les ${msT12(G.t)} (calia ${txt})`, etiq: G => ((G.t % 720) + 720) % 720 === msSwap(obj) ? 'mAgulles' : null,
      tanca(z, G, ok) { msTancaEnt(z, ok); if (!ok) setTimeout(() => { if (z.isConnected) { const t = Math.round((G.t - obj) / 720) * 720 + obj; $('.ms-ah', z).style.transform = `rotate(${t * .5}deg)`; $('.ms-am', z).style.transform = `rotate(${t * 6}deg)`; } }, 700); },
      demo: resolt => msRellotgeSvg(resolt ? obj : 0),
      resol(z, G, be) { G.posa(base + obj + (be ? 0 : 65)); }
    }, `les <b>${txt}</b>: l'agulla curta ${m ? (m < 30 ? `una mica passat el ${h}` : m === 30 ? `entre el ${h} i el ${h % 12 + 1}` : `a prop del ${h % 12 + 1}`) : `al ${h}`} i la llarga al ${m / 5 || 12}`),
    explicacio: `La llarga al ${m / 5 || 12} vol dir ${m} minuts.`, solucio: [`Hores: l'agulla curta ${m ? `ha passat el ${h}` : `és al ${h}`}.`, `Minuts: ${m} minuts és el número ${m / 5 || 12} (${m / 5 || 12} × 5 = ${m || 60}).`] };
};
/* B · Quina hora marca */
M6.llegeixHora = (nv, { n = 3 } = {}) => {
  const its = []; const vist = new Set();
  for (let g = 0; its.length < n && g < 60; g++) {
    const h = msR(1, 12), m = nv === 1 ? tria([0, 15, 30, 45]) : nv === 2 ? msR(0, 11) * 5 : msR(1, 58); const t = (h % 12) * 60 + m; if (vist.has(t)) continue; vist.add(t);
    const bo = msT12(t); const mals = [[msT12(msSwap(t)), 'mAgulles'], [`${h}:${String(Math.round(m / 5)).padStart(2, '0')}`, 'mMinuts'], [msT12(t + 60), 'mHoraSeg'], [msT12(t - 60), null], [msT12(t + 30), null]].filter(([x], i, l) => x !== bo && l.findIndex(y => y[0] === x) === i).slice(0, 2);
    const ops = barreja([[bo, null], ...mals]);
    its.push({ tipus: 'tria', llarg: true, html: `${msRellotgeSvg(t, 84)} Quina hora és?`, opcions: ops.map(([x]) => ({ html: `<b>${x}</b>`, val: x })), correcta: bo, etiq: Object.fromEntries(mals.filter(x => x[1]).map(([x, tg]) => [x, tg])), bo });
  }
  return { sig: `lh-${its.map(i => i.bo).join('|')}`, enunciat: `Llegeix cada rellotge.`, visual: null, pista: PISTA_M6, ...apartats(its),
    explicacio: `Primer les hores (agulla curta) i després els minuts (agulla llarga).`, solucio: its.map(it => `<b>${it.bo}</b>`) };
};
/* C · Hores, minuts i segons */
M6.conv = (nv, { n = 3 } = {}) => {
  const P = {
    1: [() => { const x = msR(2, 5); return [`${x} h`, x * 60, 'min', [[x * 100, 'mBase60']], `${x} × 60 = <b>${x * 60} min</b>`]; }, () => { const x = msR(2, 4); return [`${x * 60} min`, x, 'h', [], `${x * 60} ÷ 60 = <b>${x} h</b>`]; },
      () => { const x = msR(2, 5); return [`${x} min`, x * 60, 's', [[x * 100, 'mBase60']], `${x} × 60 = <b>${x * 60} s</b>`]; }, () => [`Mitja hora`, 30, 'min', [[50, 'mBase60']], `60 ÷ 2 = <b>30 min</b>`], () => [`Un quart d'hora`, 15, 'min', [[25, 'mBase60']], `60 ÷ 4 = <b>15 min</b>`],
      () => { const x = msR(2, 3); return [`${x} dies`, x * 24, 'h', [], `${x} × 24 = <b>${x * 24} h</b>`]; }],
    2: [() => { const x = tria([1.5, 2.5, .5, 3.5]); return [`${fmtDec(x)} h`, x * 60, 'min', [[x * 100, 'mBase60']], `${fmtDec(x)} × 60 = <b>${x * 60} min</b>`]; }, () => { const h = msR(1, 3), m = tria([15, 20, 45, 10]); return [`${h} h ${m} min`, h * 60 + m, 'min', [[h * 100 + m, 'mBase60']], `${h * 60} + ${m} = <b>${h * 60 + m} min</b>`]; },
      () => [`Tres quarts d'hora`, 45, 'min', [[75, 'mBase60']], `3 × 15 = <b>45 min</b>`], () => { const x = tria([90, 150, 30, 210]); return [`${x} min`, x / 60, 'h', [[x / 100, 'mBase60']], `${x} ÷ 60 = <b>${fmtDec(x / 60)} h</b>`]; },
      () => { const x = tria([2, 5, 10]); return [`${x} min`, x * 60, 's', [[x * 100, 'mBase60']], `${x} × 60 = <b>${x * 60} s</b>`]; }],
    3: [() => [`1 h`, 3600, 's', [[60, null], [6000, 'mBase60']], `60 × 60 = <b>3600 s</b>`], () => { const x = tria([1.25, 2.75, .75, .25]); return [`${fmtDec(x)} h`, x * 60, 'min', [[x * 100, 'mBase60']], `${fmtDec(x)} × 60 = <b>${x * 60} min</b>`]; },
      () => { const x = tria([.1, .2, 1.1]); return [`${fmtDec(x)} h`, Math.round(x * 60), 'min', [[x * 100, 'mBase60']], `${fmtDec(x)} × 60 = <b>${Math.round(x * 60)} min</b>`]; }, () => { const x = tria([7200, 5400, 1800]); return [`${x} s`, x / 3600, 'h', [[x / 60, null]], `${x} ÷ 3600 = <b>${fmtDec(x / 3600)} h</b>`]; },
      () => { const x = tria([45, 15, 75, 105]); return [`${x} min`, x / 60, 'h', [[x / 100, 'mBase60']], `${x} ÷ 60 = <b>${fmtDec(x / 60)} h</b>`]; }, () => { const x = msR(2, 4); return [`${x} setmanes`, x * 7, 'dies', [], `${x} × 7 = <b>${x * 7} dies</b>`]; }]
  };
  const tr = barreja(P[nv]).slice(0, n).map(f => f());
  const its = tr.map(([h, v, u, errs, s]) => ({ tipus: 'dec', html: h, valor: v, unitat: u, errs: errs.filter(([x]) => !decIgual(x, v)), s }));
  return { sig: `tc-${tr.map(t => t[0] + t[2]).join('|')}`, enunciat: `Canvia d'unitat de temps. Compte: una hora té 60 minuts!`, visual: nv === 1 ? () => msTempsRefs() : null, pista: { completa: `<b>1 h = 60 min</b> i <b>1 min = 60 s</b>. D'hores a minuts, multiplica per 60. De minuts a hores, divideix entre 60. Mitja hora són 30 min, no 50!`, mitja: `1 h = 60 min. 1 min = 60 s.` }, ...apartats(its),
    explicacio: `El temps va de 60 en 60, no de 10 en 10.`, solucio: its.map(it => `${it.html}: ${it.s}`) };
};
const msTempsRefs = () => `<div class="ms-refs"><div><i>🕐</i>1 hora<b>60 min</b></div><div><i>⏱️</i>1 minut<b>60 s</b></div><div><i>📅</i>1 dia<b>24 h</b></div><div><i>🕧</i>mitja hora<b>30 min</b></div><div><i>🕒</i>un quart d'hora<b>15 min</b></div><div><i>🕘</i>tres quarts<b>45 min</b></div></div>`;
/* resposta amb hores i minuts: una durada («1 h 35 min») o una hora del rellotge («9:22») */
function msHM({ vis, abans, tipus, total, errs = [], sol }) {
  const H = Math.floor(total / 60), Mn = total % 60; const val = G => Number(G.h) * 60 + Number(G.m);
  return msGiny({
    inici: () => ({ h: '', m: '' }),
    munta(z, G, ctx) {
      z.innerHTML = `<div class="ms-g">${vis}<div class="ms-hm">${abans}<input data-c="h" inputmode="numeric" maxlength="2" autocomplete="off" aria-label="Hores">${tipus === 'dur' ? 'h' : ':'}<input data-c="m" inputmode="numeric" maxlength="2" autocomplete="off" aria-label="Minuts">${tipus === 'dur' ? 'min' : ''}</div><p class="ms-nota">${tipus === 'dur' ? 'Si no hi ha hores o minuts, posa-hi un 0.' : 'Escriu l\'hora i els minuts.'}</p></div>`;
      const ins = $$('.ms-hm input', z);
      ins.forEach((inp, i) => { inp.oninput = () => { inp.value = inp.value.replace(/[^0-9]/g, ''); G[inp.dataset.c] = inp.value; ctx.canvi(); }; inp.onkeydown = e => { if (e.key === 'Enter' || e.key === ':') { e.preventDefault(); if (i === 0) ins[1].focus(); else ctx.envia(); } }; });
      ins[0].focus();
    },
    fet: G => G.h !== '' && G.m !== '', ok: G => tipus === 'dur' ? val(G) === total : Number(G.h) % 24 === H % 24 && Number(G.m) === Mn,
    txt: G => tipus === 'dur' ? `${Number(G.h)} h ${Number(G.m)} min` : `${Number(G.h)}:${String(G.m).padStart(2, '0')}`,
    etiq: G => errs.find(([h, m]) => Number(G.h) === h && Number(G.m) === m)?.[2] || null,
    tanca(z, G, ok) { $('.ms-nota', z)?.remove(); $$('.ms-hm input', z).forEach(i => { i.disabled = true; i.classList.add(ok ? 'be' : 'mal'); }); },
    demo: resolt => `${vis}<div class="ms-s-eq">${resolt ? `<b>${sol}</b>` : '?'}</div>`,
    resol(z, G, be) { const ins = $$('.ms-hm input', z); ins[0].value = String(H); ins[1].value = String(be ? Mn : (Mn + 7) % 60); ins.forEach(i => i.oninput()); }
  }, `<b>${sol}</b>`);
}
// línia del temps amb un pont a cada hora en punt
function msLiniaTemps(t1, t2) {
  const W = 520, X1 = 50, X2 = 470, esc = (X2 - X1) / (t2 - t1), x = t => X1 + (t - t1) * esc; let m = '';
  for (let h = Math.ceil((t1 + 1) / 60) * 60; h < t2; h += 60) m += `<path d="M${x(h)} 62v26" stroke="${MS_N}" stroke-width="2"/><text x="${x(h)}" y="106" text-anchor="middle" font-size="13" font-weight="800" fill="${MS_N}">${msHora(h)}</text>`;
  const caixa = (xx, t, c) => `<rect x="${xx - 38}" y="14" width="76" height="34" rx="8" fill="${c}" stroke="${MS_N}" stroke-width="2.5"/><text x="${xx}" y="38" text-anchor="middle" font-size="19" font-weight="900" fill="${c === '#fff' ? MS_N : '#fff'}">${msHora(t)}</text><path d="M${xx} 48V75" stroke="${MS_N}" stroke-width="2.5"/>`;
  return `<svg class="ms-esc" viewBox="0 0 ${W} 118" role="img" aria-label="Línia del temps de ${msHora(t1)} a ${msHora(t2)}"><path d="M${X1} 75H${X2}" stroke="${T}" stroke-width="8" stroke-linecap="round"/>${m}${caixa(X1, t1, '#fff')}${caixa(X2, t2, MS_N)}</svg>`;
}
const MS_DUR = [['La pel·lícula', 'comença', 'acaba', '🎬'], ['El partit', 'comença', 'acaba', '⚽'], ['El tren', 'surt', 'arriba', '🚆'], ['L\'excursió', 'comença', 'acaba', '🥾'], ['L\'entrenament', 'comença', 'acaba', '🏀'], ['El concert', 'comença', 'acaba', '🎤']];
M6.durada = nv => {
  let t1, d;
  if (nv === 1) { t1 = msR(8, 17) * 60 + tria([0, 30]); d = msR(1, 3) * 60 + tria([0, 30, 30]); if (d === 60 && Math.random() < .5) d = 90; }
  else if (nv === 2) { do { t1 = msR(8, 18) * 60 + msR(1, 11) * 5; d = msR(0, 2) * 60 + msR(2, 11) * 5; } while ((t1 % 60) + (d % 60) < 60 || d < 30); } // cal passar per l'hora en punt
  else { do { t1 = msR(7, 21) * 60 + msR(3, 57); d = msR(1, 4) * 60 + msR(7, 56); } while ((t1 % 60) + (d % 60) < 60); }
  const t2 = t1 + d, [que, v1, v2, ic] = tria(MS_DUR); const pont = Math.ceil((t1 + 1) / 60) * 60;
  const malH = Math.abs(Math.floor(t2 / 60) - Math.floor(t1 / 60)), malM = Math.abs(t2 % 60 - t1 % 60);
  const sol = t1 % 60 === 0 ? [`De ${msHora(t1)} a ${msHora(t2)}: <b>${msDur(d)}</b>.`] : [`De ${msHora(t1)} a ${msHora(pont)}: ${pont - t1} min.`, `De ${msHora(pont)} a ${msHora(t2)}: ${msDur(t2 - pont)}. En total, <b>${msDur(d)}</b>.`];
  return { sig: `du-${t1}-${d}`, enunciat: `<span class="ms-sit">${ic}</span> ${que} ${v1} a les <b>${msHora(t1)}</b> i ${v2} a les <b>${msHora(t2)}</b>. Quant dura?`, visual: null, pista: { completa: `Fes un <b>pont</b>: primer compta fins a l'hora en punt, i després la resta. De 9:40 a 10:00 són 20 min; de 10:00 a 11:15, 1 h 15 min. En total, 1 h 35 min.`, mitja: `Fes un pont a l'hora en punt.` },
    ...msHM({ vis: msLiniaTemps(t1, t2), abans: 'Dura', tipus: 'dur', total: d, errs: malH * 60 + malM !== d ? [[malH, malM, 'mResta60']] : [], sol: msDur(d) }),
    explicacio: `Amb un pont a l'hora en punt: ${msDur(d)}.`, solucio: sol };
};
/* D · A quina hora arriba (o a quina hora ha de sortir) */
M6.arribada = nv => {
  let t1, d; const enrere = nv === 3 && Math.random() < .5;
  if (nv === 1) { t1 = msR(7, 19) * 60 + tria([0, 10, 15, 20, 30]); d = tria([10, 15, 20, 25]); }
  else { do { t1 = msR(7, 21) * 60 + (nv === 2 ? msR(5, 11) * 5 : msR(21, 58)); d = nv === 2 ? msR(3, 11) * 5 : msR(18, 95); } while ((t1 % 60) + (d % 60) < 60); }
  const t2 = t1 + d; const que = tria([['🚌', 'L\'autobús'], ['🚆', 'El tren'], ['🚇', 'El metro']]);
  if (enrere) return { sig: `ar-e-${t2}-${d}`, enunciat: `<span class="ms-sit">🏫</span> Vull arribar a l'institut a les <b>${msHora(t2)}</b> i trigo <b>${msDur(d)}</b>. A quina hora he de sortir de casa?`, visual: null, pista: PISTA_M6,
    ...msHM({ vis: msRellotgeSvg(t2), abans: 'He de sortir a les', tipus: 'hora', total: t1, errs: [[Math.floor((t2 + d) / 60), (t2 + d) % 60, 'mSentit']], sol: msHora(t1) }),
    explicacio: `Per sortir abans, es resta: ${msHora(t2)} menys ${msDur(d)} = ${msHora(t1)}.`, solucio: [`He de sortir <b>abans</b>: cal restar ${msDur(d)}.`, `${msHora(t2)} − ${msDur(d)} = <b>${msHora(t1)}</b>.`] };
  const sumaM = (t1 % 60) + d;
  return { sig: `ar-${t1}-${d}`, enunciat: `<span class="ms-sit">${que[0]}</span> ${que[1]} surt a les <b>${msHora(t1)}</b> i triga <b>${msDur(d)}</b>. A quina hora arriba?`, visual: null, pista: { completa: `Suma els minuts. Si passen de 60, has fet una hora més: 8:47 + 35 min → 47 + 35 = 82 min = 1 h i 22 min → <b>9:22</b>.`, mitja: `Si els minuts passen de 60, és una hora més.` },
    ...msHM({ vis: msRellotgeSvg(t1), abans: 'Arriba a les', tipus: 'hora', total: t2, errs: sumaM >= 60 && sumaM < 100 ? [[Math.floor(t1 / 60), sumaM, 'mBase60'], [Math.floor(t1 / 60), sumaM - 60, 'mBase60']] : [], sol: msHora(t2) }),
    explicacio: `${msHora(t1)} més ${msDur(d)}: ${msHora(t2)}.`, solucio: sumaM >= 60 ? [`Minuts: ${t1 % 60} + ${d % 60} = ${(t1 % 60) + (d % 60)}, que és 1 h i ${((t1 % 60) + (d % 60)) - 60} min.`, `Arriba a les <b>${msHora(t2)}</b>.`] : [`Minuts: ${t1 % 60} + ${d} = ${sumaM}.`, `Arriba a les <b>${msHora(t2)}</b>.`] };
};
TEMES.m6 = {
  gen: M6,
  sequencia: {
    1: [['posaHora'], ['llegeixHora', { n: 3 }], ['conv', { n: 3 }], ['posaHora'], ['durada'], ['arribada'], ['llegeixHora', { n: 3 }], ['conv', { n: 3 }]],
    2: [['posaHora'], ['llegeixHora', { n: 3 }], ['durada'], ['conv', { n: 3 }], ['arribada'], ['durada'], ['posaHora'], ['arribada']],
    3: [['posaHora'], ['durada'], ['arribada'], ['conv', { n: 3 }], ['llegeixHora', { n: 3 }], ['durada'], ['arribada'], ['conv', { n: 3 }]]
  },
  explicacio: [
    { text: `<p>En un rellotge d'agulles, la <b>curta</b> marca les <b class="parpelleja">hores</b> i la <b>llarga</b>, els <b>minuts</b>.</p><p class="petit">Aquí la curta és al 4 i la llarga, a dalt de tot: són les 4:00.</p>`, vis: () => msRellotgeSvg(240) },
    { text: `<p>Per als minuts, cada número val <b class="parpelleja">5</b>.</p><p class="petit">La llarga al 7 són 7 × 5 = 35 minuts. La curta ja ha passat el 4: són les <b>4:35</b>.</p>`, vis: () => msRellotgeSvg(275) },
    { text: `<p>El temps va de <b class="parpelleja">60 en 60</b>, no de 10 en 10.</p><p class="petit">1 h = 60 min. Mitja hora són 30 min (no 50!). I 1,5 h és 1 h i 30 min: 90 min.</p>`, vis: () => msTempsRefs() },
    { text: `<p>Per saber quant dura una cosa, fes un <b class="parpelleja">pont</b> a l'hora en punt.</p><p class="petit">De 9:40 a 10:00, 20 min. De 10:00 a 11:15, 1 h 15 min. En total, <b>1 h 35 min</b>.</p>`, vis: () => msLiniaTemps(580, 675) }
  ],
  exemple: nv => {
    if (nv === 1) return { enunciat: `Quina hora marca el rellotge?`, passos: [
      { text: `L'agulla <b>curta</b> és entre el 4 i el 5: són les 4 i escaig.`, vis: msRellotgeSvg(270) },
      { text: `La <b>llarga</b> és al 6: 6 × 5 = 30 minuts. Són les <b>4:30</b>. <span class="marca-ok">✓</span>`, vis: msRellotgeSvg(270) }] };
    if (nv === 2) return { enunciat: `El tren surt a les 9:40 i arriba a les 11:15. Quant dura el viatge?`, passos: [
      { text: `Pont fins a l'hora en punt: de 9:40 a 10:00 són <b>20 min</b>.`, vis: msLiniaTemps(580, 675) },
      { text: `De 10:00 a 11:15, 1 h 15 min. En total: 20 min + 1 h 15 min = <b>1 h 35 min</b>. <span class="marca-ok">✓</span>`, vis: msLiniaTemps(580, 675) }] };
    return { enunciat: `L'autobús surt a les 8:47 i triga 35 min. A quina hora arriba?`, passos: [
      { text: `Suma els minuts: 47 + 35 = <b>82 min</b>. Passen de 60!`, vis: msRellotgeSvg(527) },
      { text: `82 min són 1 h i 22 min: arriba a les <b>9:22</b> (no a les 8:82!). <span class="marca-ok">✓</span>`, vis: msRellotgeSvg(562) }] };
  }
};

/* =====================================================================
   OBJECTIU 7 · PROBLEMES DE LA VIDA REAL (súper, cuina, pintura, horaris)
   ===================================================================== */
const PISTA_M7 = { completa: `Tres passos: 1) passa-ho tot a la <b>mateixa unitat</b>; 2) fes el càlcul; 3) mira si el resultat <b>té sentit</b>.`, mitja: `Mateixa unitat, càlcul i comprova si té sentit.` };
const msEur = v => `${v.toFixed(2).replace('.', ',')}&nbsp;€`;
const msTiq = (lletra, ico, nom, mida, preu) => `<div class="ms-tiq"><h5>${lletra ? `<span class="lletra">${lletra}</span>` : ''}<i>${ico}</i>${nom}</h5>${mida}<div class="preu">${msEur(preu)}</div></div>`;
const MS_PROD = [['Arròs', '🍚', 'kg'], ['Pasta', '🍝', 'kg'], ['Formatge', '🧀', 'kg'], ['Galetes', '🍪', 'kg'], ['Cafè', '☕', 'kg'], ['Suc de taronja', '🧃', 'L'], ['Oli', '🫒', 'L'], ['Llet', '🥛', 'L'], ['Sabó', '🧴', 'L']];
const M7 = {};
/* A · Quina oferta surt més a compte: el preu per quilo o per litre */
M7.oferta = nv => {
  const [nom, ico, u] = tria(MS_PROD); const petit = u === 'kg' ? 'g' : 'mL';
  const PK = [1.2, 1.6, 2, 2.4, 2.8, 3.2, 3.6, 4, 4.8, 6, 8]; let pa, pb; do { pa = tria(PK); pb = tria(PK); } while (pa === pb || Math.max(pa, pb) / Math.min(pa, pb) > 2.1);
  const mides = nv === 1 ? [tria([.5, .25]), 1] : nv === 2 ? [tria([.25, .5]), tria([.75, 1.5, 2])] : [tria([.2, .4]), tria([.75, 1.5])];
  const A = { l: 'A', m: mides[0], pk: pa, p: Math.round(pa * mides[0] * 100) / 100 }, B = { l: 'B', m: mides[1], pk: pb, p: Math.round(pb * mides[1] * 100) / 100 };
  const tm = x => x.m < 1 ? `${x.m * 1000} ${petit}` : `${fmtDec(x.m)} ${u}`; const bo = pa < pb ? 'A' : 'B', barat = A.p < B.p ? 'A' : 'B';
  const preg = x => ({ tipus: 'dec', llarg: true, html: `Quant costa <b>1 ${u}</b> del paquet ${x.l}?`, valor: x.pk, unitat: `€/${u}`, errs: [[x.p, 'mPreuUnitat'], [Math.round(x.p * x.m * 100) / 100, 'mSentit']].filter(([v]) => !decIgual(v, x.pk)), s: `${x.l}: ${msEur(x.p)} ÷ ${fmtDec(x.m)} = <b>${msEur(x.pk)}</b> per ${u}` });
  const its = [...(nv === 1 ? [preg(A)] : [preg(A), preg(B)]), { tipus: 'tria', llarg: true, html: `Quin surt més a compte?`, opcions: [{ html: '<b>A</b>', val: 'A' }, { html: '<b>B</b>', val: 'B' }], correcta: bo, etiq: barat !== bo ? { [barat]: 'mPreuUnitat' } : {}, s: `Surt més a compte el <b>${bo}</b>: ${msEur(Math.min(pa, pb))} per ${u}` }];
  return { sig: `of-${nom}-${A.m}-${B.m}-${pa}-${pb}`, enunciat: `Al súper hi ha dos paquets de <b>${nom.toLowerCase()}</b>. Compara'ls pel preu per ${u === 'kg' ? 'quilo' : 'litre'}.`, visual: () => `<div class="ms-tiqs">${msTiq('A', ico, nom, tm(A), A.p)}${msTiq('B', ico, nom, tm(B), B.p)}</div>`,
    pista: { completa: `Per comparar, calcula quant costa <b>1 ${u}</b> de cada paquet: preu ÷ ${u === 'kg' ? 'quilos' : 'litres'}. Recorda: 500 ${petit} = 0,5 ${u}.`, mitja: `Preu ÷ ${u === 'kg' ? 'quilos' : 'litres'}.` }, ...apartats(its),
    explicacio: `El paquet gran no sempre surt més a compte: cal mirar el preu per ${u}.`, solucio: its.map(it => it.s) };
};
/* B · Adaptar una recepta */
const MS_REC = [
  { nom: 'Creps', ico: '🥞', p: 4, ing: [['farina', 250, 'g'], ['llet', 500, 'mL'], ['mantega', 50, 'g']] },
  { nom: 'Pizza', ico: '🍕', p: 2, ing: [['farina', 200, 'g'], ['aigua', 120, 'mL'], ['formatge', 150, 'g']] },
  { nom: 'Pastís de iogurt', ico: '🍰', p: 6, ing: [['farina', 300, 'g'], ['sucre', 200, 'g'], ['oli', 100, 'mL']] },
  { nom: 'Macarrons', ico: '🍝', p: 4, ing: [['macarrons', 400, 'g'], ['tomàquet', 300, 'g'], ['formatge', 100, 'g']] },
  { nom: 'Batut de fruita', ico: '🥤', p: 2, ing: [['llet', 400, 'mL'], ['maduixes', 250, 'g'], ['iogurt', 125, 'g']] }
];
M7.recepta = nv => {
  const r = tria(MS_REC); const f = nv === 1 ? tria([2, .5]) : nv === 2 ? tria([3, 1.5]) : tria([2.5, 5]); const per = r.p * f;
  const ings = barreja(r.ing).slice(0, nv === 1 ? 2 : 3);
  const its = ings.map(([n, q, u], i) => { const v = q * f; const gran = nv > 1 && i === ings.length - 1 && v >= 100; const uu = gran ? (u === 'g' ? 'kg' : 'L') : u, val = gran ? v / 1000 : v;
    return { tipus: 'dec', html: `${n[0].toUpperCase() + n.slice(1)}${gran ? `, en <b>${uu}</b>` : ''}`, valor: val, unitat: uu, errs: [[gran ? v : null, 'mSentit'], [q, null]].filter(([x]) => x != null && !decIgual(x, val)), s: `${n}: ${q} × ${fmtDec(f)} = ${fmtDec(v)} ${u}${gran ? ` = <b>${fmtDec(val)} ${uu}</b>` : ''}` }; });
  return { sig: `re-${r.nom}-${f}-${ings.map(i => i[0]).join('')}`, enunciat: `La recepta és per a ${r.p} persones, però sereu <b>${per}</b>. Quina quantitat cal de cada ingredient?`,
    visual: () => `<div class="ms-tiqs"><div class="ms-tiq"><h5><i>${r.ico}</i>${r.nom} · ${r.p} persones</h5><ul>${r.ing.map(([n, q, u]) => `<li>${q} ${u} de ${n}</li>`).join('')}</ul></div></div>`,
    pista: { completa: `${per} persones és ${f > 1 ? `<b>${fmtDec(f)} vegades</b> més que ${r.p}` : `la <b>meitat</b> de ${r.p}`}: ${f > 1 ? `multiplica cada quantitat per ${fmtDec(f)}` : 'divideix cada quantitat entre 2'}.`, mitja: f > 1 ? `Multiplica per ${fmtDec(f)}.` : `Divideix entre 2.` }, ...apartats(its),
    explicacio: `${per} ÷ ${r.p} = ${fmtDec(f)}: totes les quantitats es multipliquen per ${fmtDec(f)}.`, solucio: its.map(it => it.s) };
};
/* C · Pintar una paret: superfície i pots de pintura (cal arrodonir cap amunt) */
function msParetSvg(b, h) { const e = Math.min(60, 340 / b, 150 / h), w = b * e, hh = h * e, x = 110, y = 196 - hh; const hr = 1 * e;
  return `<svg class="ms-esc" viewBox="0 0 520 236" role="img" aria-label="Paret de ${b} per ${h} metres"><line x1="0" y1="196" x2="520" y2="196" stroke="${MS_N}" stroke-width="3"/><rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="#ffe3b8" stroke="${MS_N}" stroke-width="3"/>${robot(hr * 150 / 160).replace('<svg ', `<svg x="${50 - hr * 150 / 320}" y="${196 - hr}" `)}${msCota(x + w / 2, 220, `${fmtDec(b)} m`)}${msCota(x + w + 8, y + hh / 2 + 6, `${fmtDec(h)} m`, 'start')}</svg>`; }
M7.pintura = nv => {
  let b, h, cob; const capes = nv === 3 ? 2 : 1;
  do { b = nv === 1 ? msR(4, 8) : msR(3, 7) + .5; h = nv === 1 ? tria([2, 3]) : tria([2.5, 3, 2]); cob = tria(nv === 1 ? [4, 5, 6, 8] : [5, 6, 8, 10]); } while (nv === 1 ? (b * h) % cob !== 0 : Number.isInteger(b * h * capes / cob));
  const A = b * h, tot = A * capes, pots = Math.ceil(tot / cob - 1e-9);
  const its = [{ tipus: 'dec', llarg: true, html: `Quina superfície té la paret?`, valor: A, unitat: 'm²', errs: [[2 * (b + h), 'mPerim'], [b + h, 'mPerim']].filter(([v]) => !decIgual(v, A)), s: `${fmtDec(b)} × ${fmtDec(h)} = <b>${fmtDec(A)} m²</b>` },
    { tipus: 'num', llarg: true, html: `Quants pots de pintura he de comprar${capes === 2 ? ' per fer-hi <b>dues capes</b>' : ''}?`, valor: pots, errs: Object.fromEntries([[Math.floor(tot / cob), 'mArrod'], [Math.ceil(A / cob - 1e-9), null]].filter(([v]) => v !== pots && v > 0)), s: `${capes === 2 ? `Dues capes: ${fmtDec(tot)} m². ` : ''}${fmtDec(tot)} ÷ ${cob} = ${fmtDec(Math.round(tot / cob * 100) / 100)}${Number.isInteger(tot / cob) ? '' : `: cal arrodonir cap amunt`}, <b>${pots} pots</b>` }];
  return { sig: `pi-${b}-${h}-${cob}-${capes}`, enunciat: `Vull pintar aquesta paret. Cada pot de pintura cobreix <b>${cob} m²</b>.`, visual: () => msParetSvg(b, h), pista: { completa: `Primer la superfície: base × altura. Després divideix-la entre els m² que cobreix cada pot. Si no dona exacte, cal un pot més: <b>arrodoneix cap amunt</b>.`, mitja: `Superfície ÷ m² de cada pot, arrodonint cap amunt.` }, ...apartats(its),
    explicacio: `No es pot comprar mig pot: sempre cap amunt.`, solucio: its.map(it => it.s) };
};
/* D · Horaris: arribar a l'hora */
M7.horari = nv => {
  const surt = msR(7, 8) * 60 + msR(1, 11) * 5, a = tria([5, 10, 15]), bus = tria(nv === 1 ? [10, 15, 20] : [25, 35, 40, 45]), c = nv === 1 ? 0 : tria([5, 10]);
  const tot = a + bus + c, arr = surt + tot;
  return { sig: `ho-${surt}-${a}-${bus}-${c}`, enunciat: `Surto de casa a les <b>${msHora(surt)}</b>. Camino ${a} min fins a la parada, l'autobús triga ${bus} min${c ? ` i després camino ${c} min més` : ''}. A quina hora arribo?`, visual: null, pista: { completa: `Suma primer tots els minuts del trajecte i després afegeix-los a l'hora de sortida. Si els minuts passen de 60, és una hora més.`, mitja: `Suma els minuts del trajecte.` },
    ...msHM({ vis: `<div class="ms-tiqs"><div class="ms-tiq"><h5><i>🚶</i>${a} min</h5>a peu</div><div class="ms-tiq"><h5><i>🚌</i>${bus} min</h5>en autobús</div>${c ? `<div class="ms-tiq"><h5><i>🚶</i>${c} min</h5>a peu</div>` : ''}</div>`, abans: 'Arribo a les', tipus: 'hora', total: arr, errs: (surt % 60) + tot >= 60 && (surt % 60) + tot < 100 ? [[Math.floor(surt / 60), (surt % 60) + tot, 'mBase60']] : [], sol: msHora(arr) }),
    explicacio: `El trajecte dura ${tot} min: ${msHora(surt)} + ${msDur(tot)} = ${msHora(arr)}.`, solucio: [`Trajecte: ${a} + ${bus}${c ? ` + ${c}` : ''} = ${tot} min${tot >= 60 ? ` (${msDur(tot)})` : ''}.`, `${msHora(surt)} + ${msDur(tot)} = <b>${msHora(arr)}</b>.`] };
};
/* E · El pes de la motxilla */
M7.motxilla = nv => {
  const coses = barreja([['📚', 'llibres', [450, 600, 800]], ['💻', 'el portàtil', [1200, 1500]], ['🥪', 'l\'esmorzar', [250, 300]], ['🧴', 'una ampolla d\'aigua', [500, 750]], ['👟', 'les bambes', [700, 900]], ['📓', 'les llibretes', [400, 350]]]).slice(0, 3).map(([ic, n, ps]) => { const g = tria(ps); return { ic, n, g }; });
  const tot = coses.reduce((s, c) => s + c.g, 0); const txt = c => nv > 1 && c.g >= 1000 ? `${fmtDec(c.g / 1000)} kg` : nv === 3 && c.g % 250 === 0 ? `${fmtDec(c.g / 1000)} kg` : `${c.g} g`;
  const lim = Math.ceil((tot + 300) / 500) * 500;
  const its = [...(nv === 1 ? [{ tipus: 'num', llarg: true, html: `Quant pesa tot plegat? <span style="color:var(--gris)">(en grams)</span>`, valor: tot, errs: {}, s: `${coses.map(c => c.g).join(' + ')} = <b>${tot} g</b>` }] : []),
    { tipus: 'dec', llarg: true, html: nv === 1 ? `I en <b>quilos</b>?` : `Quant pesa tot plegat, en <b>quilos</b>?`, valor: tot / 1000, unitat: 'kg', errs: [[tot, 'mUnitMix'], [coses.reduce((s, c) => s + (txt(c).includes('kg') ? c.g / 1000 : c.g), 0), 'mUnitMix']].filter(([v]) => !decIgual(v, tot / 1000)), s: `${nv === 1 ? '' : coses.map(c => fmtDec(c.g / 1000)).join(' + ') + ' = '}${tot} g = <b>${fmtDec(tot / 1000)} kg</b>` },
    ...(nv === 3 ? [{ tipus: 'num', llarg: true, html: `La motxilla aguanta ${fmtDec(lim / 1000)} kg. Quants <b>grams</b> més hi puc posar?`, valor: lim - tot, errs: {}, s: `${lim} − ${tot} = <b>${lim - tot} g</b>` }] : [])];
  return { sig: `mo-${coses.map(c => c.n + c.g).join('|')}`, enunciat: `A la motxilla hi porto això. Quant pesa?`, visual: () => `<div class="ms-tiqs">${coses.map(c => `<div class="ms-tiq"><h5><i>${c.ic}</i>${txt(c)}</h5>${c.n}</div>`).join('')}</div>`, pista: PISTA_M7, ...apartats(its),
    explicacio: `Tot a la mateixa unitat abans de sumar.`, solucio: its.map(it => it.s) };
};
/* F · Beguda per a una festa */
M7.beguda = nv => {
  let P, got, amp; do { P = nv === 1 ? tria([4, 8, 12]) : msR(7, 18); got = tria([200, 250]) * (nv === 1 ? 1 : tria([2, 3])); amp = nv === 1 ? 1 : tria([1.5, 2]); } while (nv > 1 && Number.isInteger(P * got / 1000 / amp));
  const L = P * got / 1000, n = Math.ceil(L / amp - 1e-9);
  const its = [{ tipus: 'dec', llarg: true, html: `Quants <b>litres</b> de suc calen en total?`, valor: L, unitat: 'L', errs: [[P * got, 'mUnitMix']], s: `${P} × ${got} mL = ${fmtDec(P * got)} mL = <b>${fmtDec(L)} L</b>` },
    { tipus: 'num', llarg: true, html: `Quantes ampolles de ${fmtDec(amp)} L he de comprar?`, valor: n, errs: Object.fromEntries([[Math.floor(L / amp), 'mArrod']].filter(([v]) => v !== n && v > 0)), s: `${fmtDec(L)} ÷ ${fmtDec(amp)} = ${fmtDec(Math.round(L / amp * 100) / 100)}${Number.isInteger(L / amp) ? '' : ': cap amunt'}, <b>${n} ampolles</b>` }];
  return { sig: `be-${P}-${got}-${amp}`, enunciat: `A la festa serem <b>${P} persones</b> i calculo <b>${got} mL</b> de suc per a cadascú.`, visual: () => `<div class="ms-tiqs"><div class="ms-tiq"><h5><i>🧑‍🤝‍🧑</i>${P} persones</h5>${got} mL cadascú</div><div class="ms-tiq"><h5><i>🧃</i>Ampolla</h5>${fmtDec(amp)} L</div></div>`, pista: PISTA_M7, ...apartats(its),
    explicacio: `Primer el total en mL, després a litres, i les ampolles sempre cap amunt.`, solucio: its.map(it => it.s) };
};
/* G · Caminar cada dia / enrajolar un terra */
M7.passeig = nv => {
  const m = tria(nv === 1 ? [500, 1000, 1500] : [800, 1200, 650, 900]), dies = tria([5, 4, 6]); const tot = m * 2 * dies;
  const its = [{ tipus: 'num', llarg: true, html: `Quants <b>metres</b> camino cada dia, entre anar i tornar?`, valor: m * 2, errs: {}, s: `${m} × 2 = <b>${m * 2} m</b>` }, { tipus: 'dec', llarg: true, html: `Quants <b>quilòmetres</b> camino en ${dies} dies?`, valor: tot / 1000, unitat: 'km', errs: [[tot, 'mUnitMix'], [m * dies / 1000, null]], s: `${m * 2} × ${dies} = ${fmtDec(tot)} m = <b>${fmtDec(tot / 1000)} km</b>` }];
  return { sig: `pa-${m}-${dies}`, enunciat: `De casa a l'institut hi ha <b>${m} m</b>. Hi vaig i en torno a peu cada dia.`, visual: () => `<div class="ms-tiqs"><div class="ms-tiq"><h5><i>🏠</i>Casa</h5></div><div class="ms-tiq"><h5><i>🚶</i>${m} m</h5>anar i tornar</div><div class="ms-tiq"><h5><i>🏫</i>Institut</h5></div></div>`, pista: PISTA_M7, ...apartats(its),
    explicacio: `Compte amb l'anada i la tornada, i passa els metres a quilòmetres.`, solucio: its.map(it => it.s) };
};
M7.rajoles = nv => {
  const b = msR(3, 6), h = msR(2, 4), c = tria([50, 25, 20]); const perM2 = (100 / c) ** 2, n = b * h * perM2;
  const its = [{ tipus: 'dec', llarg: true, html: `Quina superfície té el terra?`, valor: b * h, unitat: 'm²', errs: [[2 * (b + h), 'mPerim']].filter(([v]) => v !== b * h), s: `${b} × ${h} = <b>${b * h} m²</b>` }, { tipus: 'num', llarg: true, html: `Quantes rajoles caben en <b>1 m²</b>?`, valor: perM2, errs: { [100 / c]: 'mSuperf' }, s: `En 1 m de costat n'hi caben ${100 / c}: ${100 / c} × ${100 / c} = <b>${perM2} rajoles</b>` },
    { tipus: 'num', llarg: true, html: `Quantes rajoles necessito per a tot el terra?`, valor: n, errs: { [b * h * 100 / c]: 'mSuperf' }, s: `${b * h} × ${perM2} = <b>${n} rajoles</b>` }];
  return { sig: `ra-${b}-${h}-${c}`, enunciat: `Vull enrajolar un terra de <b>${b} m per ${h} m</b> amb rajoles quadrades de <b>${c} cm</b> de costat.`, visual: () => msRectsSvg([{ b, h, tb: `${b} m`, th: `${h} m`, nom: '', grid: true }]), pista: PISTA_M7, ...apartats(its),
    explicacio: `Es comparen superfícies, no llargades.`, solucio: its.map(it => it.s) };
};
TEMES.m7 = {
  gen: M7,
  sequencia: {
    1: [['oferta'], ['recepta'], ['pintura'], ['horari'], ['motxilla'], ['beguda'], ['passeig'], ['oferta']],
    2: [['oferta'], ['recepta'], ['pintura'], ['horari'], ['motxilla'], ['beguda'], ['passeig'], ['oferta']],
    3: [['oferta'], ['recepta'], ['pintura'], ['horari'], ['motxilla'], ['beguda'], ['rajoles'], ['oferta']]
  },
  explicacio: [
    { text: `<p>Als problemes de cada dia les mesures venen barrejades: grams i quilos, mL i litres…</p><p class="petit">Primer pas, sempre: passa-ho tot a la <b class="parpelleja">mateixa unitat</b>.</p>`, vis: () => `<div class="ms-tiqs"><div class="ms-tiq"><h5><i>💻</i>1,2 kg</h5>el portàtil</div><div class="ms-tiq"><h5><i>📚</i>800 g</h5>llibres</div><div class="ms-tiq"><h5><i>⚖️</i>1200 + 800</h5><b>2000 g = 2 kg</b></div></div>` },
    { text: `<p>Al súper, el paquet gran no sempre surt més a compte.</p><p class="petit">Mira el <b class="parpelleja">preu per quilo</b> (o per litre): preu ÷ quilos.</p>`, vis: () => `<div class="ms-tiqs">${msTiq('A', '🍚', 'Arròs', '500 g', 1.2)}${msTiq('B', '🍚', 'Arròs', '1 kg', 2)}</div><div class="ms-s-eq" style="font-size:1.2rem">A: 1,20 ÷ 0,5 = <b>2,40 €/kg</b> · B: <b>2,00 €/kg</b></div>` },
    { text: `<p>Quan compres coses senceres, <b class="parpelleja">arrodoneix cap amunt</b>.</p><p class="petit">Si calen 2,3 pots de pintura, n'has de comprar 3: amb 2 no arribes.</p>`, vis: () => msParetSvg(5, 2.5) },
    { text: `<p>I al final, pregunta't sempre: <b class="parpelleja">té sentit?</b></p><p class="petit">Si et surt que una motxilla pesa 2000 kg, has oblidat de canviar la unitat.</p>`, vis: () => msRefsHtml(false) }
  ],
  exemple: nv => {
    if (nv === 1) return { enunciat: `Arròs: A, 500 g per 1,20 €. B, 1 kg per 2,00 €. Quin surt més a compte?`, passos: [
      { text: `El paquet A té mig quilo: 1 kg costaria el doble, 1,20 × 2 = <b>2,40 €</b>.`, vis: `<div class="ms-tiqs">${msTiq('A', '🍚', 'Arròs', '500 g', 1.2)}${msTiq('B', '🍚', 'Arròs', '1 kg', 2)}</div>` },
      { text: `El B costa 2,00 € el quilo. Surt més a compte el <b>B</b>. <span class="marca-ok">✓</span>`, vis: `<div class="ms-s-eq" style="font-size:1.3rem">A: <b>2,40 €/kg</b> · B: <b>2,00 €/kg</b></div>` }] };
    if (nv === 2) return { enunciat: `Una paret fa 5,5 m per 2,5 m. Cada pot cobreix 5 m². Quants pots calen?`, passos: [
      { text: `Superfície: 5,5 × 2,5 = <b>13,75 m²</b>.`, vis: msParetSvg(5.5, 2.5) },
      { text: `13,75 ÷ 5 = 2,75. No es poden comprar 2,75 pots: en calen <b>3</b>. <span class="marca-ok">✓</span>`, vis: `<div class="ms-s-eq">2,75 → <b>3 pots</b></div>` }] };
    return { enunciat: `Un terra de 4 m per 3 m amb rajoles de 50 cm de costat. Quantes en calen?`, passos: [
      { text: `El terra fa 4 × 3 = <b>12 m²</b>. En 1 m² hi caben 2 × 2 = <b>4 rajoles</b>.`, vis: msRectsSvg([{ b: 4, h: 3, tb: '4 m', th: '3 m', nom: '', grid: true }]) },
      { text: `12 × 4 = <b>48 rajoles</b> (no 24: es comparen superfícies!). <span class="marca-ok">✓</span>`, vis: `<div class="ms-s-eq">12 m² × 4 = <b>48</b> rajoles</div>` }] };
  }
};
UNITATS.m.carregada = true;

