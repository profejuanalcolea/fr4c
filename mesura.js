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
const MS_ESC = {
  L: { nom: 'longitud', u: ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'], us: [0, 3, 5, 6] },
  M: { nom: 'massa', u: ['kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg'], us: [0, 3] },
  C: { nom: 'capacitat', u: ['kL', 'hL', 'daL', 'L', 'dL', 'cL', 'mL'], us: [3, 5, 6] }
};
const MS_P = { W: 556, H: 198, X: 44, D: 78 };
const msPx = i => MS_P.X + i * MS_P.D;
/* la xuleta del dossier: pedres amb les unitats, fletxes ×10 a dalt i ÷10 a baix, i FR-4C que hi salta */
function msPistaSvg({ mag, or = null, de = null, pos = null, etiq = true, anima = null, tab = false }) {
  const S = MS_ESC[mag]; let arcs = '';
  for (let i = 0; i < 6; i++) { const a = msPx(i) + 14, b = msPx(i + 1) - 14, m = (a + b) / 2;
    arcs += `<path d="M${a} 112Q${m} 84 ${b} 112" fill="none" stroke="${MS_N}" stroke-width="2" marker-end="url(#ms-fl)"/><path d="M${b} 156Q${m} 184 ${a} 156" fill="none" stroke="#888" stroke-width="2" marker-end="url(#ms-fl2)"/>`;
    if (etiq) arcs += `<text x="${m}" y="91" text-anchor="middle" font-size="13" font-weight="900" fill="${T}">×10</text><text x="${m}" y="189" text-anchor="middle" font-size="13" font-weight="900" fill="#2a6fd6">÷10</text>`; }
  const pedres = S.u.map((u, i) => { const gris = !S.us.includes(i) && i !== or && i !== de;
    return `<g class="ms-pedra" data-i="${i}"><rect x="${msPx(i) - 29}" y="117" width="58" height="34" rx="10" fill="${i === de ? T : gris ? '#efefef' : '#fff'}" stroke="${i === or ? T : gris ? '#aaa' : MS_N}" stroke-width="${i === or ? 4 : 2.5}" ${i === or ? 'stroke-dasharray="6 3"' : ''}/><text x="${msPx(i)}" y="140" text-anchor="middle" font-size="17" font-weight="900" fill="${i === de ? '#fff' : gris ? '#999' : MS_N}">${u}</text></g>`; }).join('');
  const bot = pos == null && !anima ? '' : `<g class="ms-s-bot" style="transform:translateX(${msPx(pos ?? 0)}px)"><g class="ms-s-hop">${robot(62).replace('<svg ', '<svg x="-31" y="6" ')}</g></g>`;
  return `<svg class="ms-pista ${anima ? 'anima' : ''}" viewBox="0 0 ${MS_P.W} ${MS_P.H}" ${tab ? 'tabindex="0"' : ''} ${anima ? `style="--xa:${msPx(anima[0])}px;--xb:${msPx(anima[1])}px"` : ''} role="img" aria-label="Escala d'unitats de ${S.nom}">
    <defs><marker id="ms-fl" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="${MS_N}"/></marker><marker id="ms-fl2" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="#888"/></marker></defs>
    ${arcs}${pedres}${bot}</svg>`;
}
/* una conversió: origen n·10^e a la unitat or → unitat de (d salts) */
function msConv(nv, mag) {
  const S = MS_ESC[mag], P = [2, 3, 4, 5, 6, 7, 8, 9, 12, 15, 25];
  for (let g = 0; g < 200; g++) {
    let or, de; if (nv === 3) { or = msR(0, 6); de = msR(0, 6); } else { or = tria(S.us); de = tria(S.us); }
    const d = de - or; if (!d || Math.abs(d) > (nv === 1 ? 3 : 4)) continue;
    let n, e;
    if (nv === 1) { n = tria(P); e = d > 0 ? 0 : -d; } // tot amb nombres enters
    else if (d > 0) { n = tria([15, 25, 35, 45, 75, 12, 24, 5, 8, 125, 6, 105]); e = -tria(d === 1 ? [1] : [1, 2]); if (nv === 3 && Math.random() < .35) e = 0; }
    else { n = tria(Math.abs(d) === 1 ? [3, 8, 15, 25, 47, 6] : Math.abs(d) === 2 ? [5, 35, 85, 120, 250, 8] : [250, 500, 750, 1500, 2500, 80, 330, 1200]); e = nv === 3 && Math.random() < .3 ? -1 : 0; }
    const v0 = msV(n, e), v1 = msV(n, e + d); if (v1 >= 1e6 || v0 >= 1e5 || e + d < -3 || e < -3) continue;
    if (nv === 2 && Number.isInteger(v0) && Number.isInteger(v1)) continue; // al nivell 2 sempre hi ha algun decimal
    return { mag, or, de, d, n, e, v0, v1, uo: S.u[or], ud: S.u[de],
      errs: [[msV(n, e - d), 'mSentit'], [msV(n, e + d + 1), 'mSalt'], [msV(n, e + d - 1), 'mSalt']] };
  }
}
const msOpTxt = d => `${d > 0 ? '×' : '÷'} ${fmtDec(10 ** Math.abs(d))}`;
const msSolConv = c => [`De ${c.uo} a ${c.ud} hi ha <b>${Math.abs(c.d)} ${Math.abs(c.d) === 1 ? 'salt' : 'salts'}</b> cap a ${c.d > 0 ? 'la dreta' : 'l\'esquerra'}: ${msOpTxt(c.d)}.`, `${msU(c.v0, c.uo)} ${msOpTxt(c.d)} = <b>${msU(c.v1, c.ud)}</b>.`];
const M3 = {};
/* A · FR-4C salta per la xuleta. auto: el número es calcula sol a cada salt (nivell 1). Sense auto: l'alumne escriu el resultat. */
M3.salts = (nv, { mag = null, auto = nv === 1 } = {}) => {
  const c = msConv(nv, mag || tria(['L', 'M', 'C'])), S = MS_ESC[c.mag]; const etiq = nv === 1;
  const a = p => msV(c.n, c.e + (p - c.or));
  const eq = G => auto ? (G.pos === c.or ? `${msU(c.v0, c.uo)} = <b>?</b> ${c.ud}` : `${msU(c.v0, c.uo)} = <b class="pop">${fmtDec(a(G.pos))}</b> ${S.u[G.pos]}`)
    : (G.pos === c.or ? `${msU(c.v0, c.uo)} = <b>?</b> ${c.ud}` : `<span class="pop" style="font-size:1.15rem">${Math.abs(G.pos - c.or)} ${Math.abs(G.pos - c.or) === 1 ? 'salt' : 'salts'} cap a ${G.pos > c.or ? 'la dreta →' : 'l\'esquerra ←'}</span>`);
  return { sig: `s-${auto ? 'a' : 'e'}-${c.mag}-${c.or}-${c.de}-${c.n}-${c.e}`, enunciat: auto ? `Fes saltar FR-4C des de <b>${c.uo}</b> fins a <b>${c.ud}</b> (la casella taronja) i mira com canvia el número.` : `Passa <b>${msU(c.v0, c.uo)}</b> a <b>${c.ud}</b>. Fes saltar FR-4C per comptar els salts i escriu el resultat.`, visual: null, pista: PISTA_M3,
    ...msGiny({
      inici: () => ({ pos: c.or, mogut: false, n: '' }),
      munta(z, G, ctx) {
        z.innerHTML = `<div class="ms-g"><div class="ms-s-eq">${eq(G)}</div>${msPistaSvg({ mag: c.mag, or: c.or, de: c.de, pos: c.or, etiq, tab: true })}
          <div class="ms-ctl"><button data-s="-1">◀ ${etiq ? '÷10' : 'salta'}</button><button data-s="1">${etiq ? '×10' : 'salta'} ▶</button><button data-s="0" title="Torna a la sortida">↺ Torna</button></div>
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
      resol(z, G, be) { if (auto) return G.va(be ? c.de : [c.de + 1, c.de - 1, c.de + 2, c.de - 2].find(p => p >= 0 && p <= 6 && p !== c.or)); G.va(c.de); const inp = $('[data-ms-n]', z); inp.value = fmtDec(be ? c.v1 : msV(c.n, c.e - c.d)).replace(/\s/g, ''); inp.oninput(); }
    }, `<b>${msU(c.v1, c.ud)}</b>`),
    explicacio: `${Math.abs(c.d)} ${Math.abs(c.d) === 1 ? 'salt' : 'salts'} cap a ${c.d > 0 ? 'la dreta' : 'l\'esquerra'}: ${msOpTxt(c.d)}.`, solucio: msSolConv(c) };
};
/* B · Escriure el resultat, amb la xuleta a la vista (nivell 1) o només com a pista */
M3.escriu = (nv, { n = 3, mag = null } = {}) => {
  const mg = mag || tria(['L', 'M', 'C']); const cs = []; const vist = new Set();
  for (let g = 0; cs.length < n && g < 80; g++) { const c = msConv(nv, mg); const k = `${c.or}-${c.de}-${c.n}-${c.e}`; if (vist.has(k) || cs.some(x => x.or === c.or && x.de === c.de && n <= 3 && MS_ESC[mg].us.length > 2)) continue; vist.add(k); cs.push(c); }
  const its = cs.map(c => ({ tipus: 'dec', html: msU(c.v0, c.uo), valor: c.v1, unitat: c.ud, errs: c.errs, c }));
  return { sig: `w-${mg}-${cs.map(c => `${c.or}${c.de}${c.n}e${c.e}`).join('|')}`, enunciat: `Canvia d'unitat${nv === 1 ? ' amb l\'ajuda de la xuleta' : ''}.`, visual: nv === 1 ? () => msPistaSvg({ mag: mg }) : (completa => completa ? msPistaSvg({ mag: mg }) : ''), pista: PISTA_M3, ...apartats(its),
    explicacio: `Compta els salts: dreta ×10, esquerra ÷10.`, solucio: its.map(it => msSolConv(it.c)[1]) };
};
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
  return { sig: `k-${its.map(i => i.ta + i.tb).join('|')}`, enunciat: `Quina mesura és més gran? Posa <b>&lt;</b>, <b>&gt;</b> o <b>=</b>.`, visual: completa => completa ? msPistaSvg({ mag: 'L' }) : '', pista: { completa: `No comparis només els números! Passa les dues mesures a la <b>mateixa unitat</b> (la més petita va bé) i després compara.`, mitja: `Passa-les a la mateixa unitat.` }, ...apartats(its),
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
  return { sig: `x-${fs.map(f => textPla(f.t).slice(0, 26) + f.v).join('|')}`, enunciat: `Mesures de cada dia.`, visual: nv === 1 ? () => msPistaSvg({ mag: 'L' }) : null, pista: PISTA_M3, ...apartats(its),
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
UNITATS.m.carregada = true;
