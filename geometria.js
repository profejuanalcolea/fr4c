'use strict';
/* FR-4C · Matemàtiques 4t ESO · Unitat Geometria.
   L'app (index.html) carrega aquest fitxer quan cal. Fa servir les funcions del nucli de l'app.
   Figures amb colors, cotes i altures marcades; geoplà amb clics; en Coma i FR-4C a les explicacions.
   Amb π: es demana 3,14, però també s'accepta el resultat amb la tecla π de la calculadora. */
Object.assign(ETIQ_ERR, {
  gPerim: 'calcula el perímetre en lloc de l\'àrea', gArea: 'calcula l\'àrea en lloc del perímetre', gCostat: 'agafa el costat inclinat com a altura',
  gMeitat: 'oblida dividir entre 2', gDiam: 'confon el radi i el diàmetre', gQuad: 'no eleva al quadrat', gArrel: 'oblida fer l\'arrel quadrada',
  gSumaCat: 'suma els catets per trobar la hipotenusa', gUnitat: 'barreja unitats diferents', gSuma: 'suma les mesures en lloc de multiplicar-les'
});
Object.assign(AVIS_ERR, {
  gPerim: 'Això és el <b>perímetre</b> (la vora). L\'<b>àrea</b> és el que hi ha a dins.',
  gArea: 'Això és l\'<b>àrea</b>. El <b>perímetre</b> és la vora: suma tots els costats.',
  gCostat: 'L\'<b>altura</b> és la línia <b>perpendicular</b> a la base (la discontínua), no el costat inclinat.',
  gMeitat: 'Compte: el triangle és la <b>meitat</b> d\'un rectangle. Has de dividir entre 2.',
  gDiam: 'Compte: el <b>radi</b> és la meitat del diàmetre.',
  gQuad: 'Recorda elevar al <b>quadrat</b>: r² vol dir r · r.',
  gArrel: 'Has trobat c². Encara has de fer l\'<b>arrel quadrada</b>.',
  gSumaCat: 'La hipotenusa <b>no</b> és la suma dels catets: eleva\'ls al quadrat, suma\'ls i fes l\'arrel.',
  gUnitat: 'Abans de calcular, posa totes les mesures en la <b>mateixa unitat</b>.',
  gSuma: 'Per a l\'àrea o el volum es <b>multipliquen</b> les mesures, no se sumen.'
});
document.head.insertAdjacentHTML('beforeend', `<style>
.ge-vis{width:100%;max-width:560px;height:auto;max-height:46vh;display:block;margin:0 auto;border:2px solid var(--tinta);border-radius:14px;background:#fffdf8}
.ge-vis.petit{max-height:30vh}
.ge-dues{display:flex;gap:10px;justify-content:center;align-items:stretch}.ge-dues>div{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:4px;font-weight:900;font-size:1.2rem}
.ge-dues svg{width:100%;height:auto;max-height:34vh;border:2px solid var(--tinta);border-radius:14px;background:#fffdf8}
.ge-g{display:flex;flex-direction:column;gap:6px;align-items:stretch}
.ge-geo{width:100%;height:auto;max-height:min(46vh,calc(100vh - 380px));min-height:180px;border:2px solid var(--tinta);border-radius:14px;background:#fffdf8;cursor:crosshair;user-select:none}
.ge-geo:focus{outline:3px solid var(--taronja);outline-offset:2px}
.ge-ctl{display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap}
.ge-ctl button{height:40px;padding:0 12px;border-radius:11px;border:2px solid var(--tinta);background:#fff;font-weight:800;cursor:pointer}
.ge-ctl button:disabled{opacity:.45}
.ge-nota{margin:0;text-align:center;color:var(--gris);font-size:.82rem}
.ge-coma{display:flex;align-items:center;gap:8px;justify-content:center}.ge-coma .baf{background:#fff7ee;border:2px solid var(--taronja);border-radius:12px;padding:4px 10px;font-weight:700;font-size:.92rem}
.ge-gat.salta{animation:geSalt .55s}@keyframes geSalt{0%,100%{transform:translateY(0)}35%{transform:translateY(-10px) rotate(-8deg)}70%{transform:rotate(5deg)}}
.ge-mou{animation:geMou 2.6s ease-in-out infinite}@keyframes geMou{0%,20%{transform:translateX(0)}50%,80%{transform:translateX(var(--dx))}100%{transform:translateX(0)}}
.ge-gira{transform-box:fill-box;transform-origin:center;animation:geGira 9s linear infinite}@keyframes geGira{to{transform:rotate(360deg)}}
.ge-form{display:inline-block;background:#fff3e6;border:2px solid var(--taronja);border-radius:10px;padding:2px 10px;font-weight:900}
</style>`);

/* ---------- utilitats ---------- */
const GE_N = '#1b1b1b';
const GE_COL = [['#f47b20', '#ffd9b8'], ['#2f6fd1', '#cfe2ff'], ['#1d9a5a', '#c9f0d8'], ['#7c5cd6', '#e3dbff'], ['#e0457b', '#ffd6e4'], ['#d39a00', '#fff1b8'], ['#0f9fb0', '#c8f1f5']];
const geR = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const geRo = v => Math.round(v * 1e6) / 1e6;
const geF = v => fmtDec(Math.round(v * 100) / 100);
const geCol = () => tria(GE_COL);
const geTx = (x, y, t, { mida = 15, anc = 'middle', col = GE_N, pes = 800, fons = false } = {}) => (fons ? `<rect x="${(anc === 'start' ? x : anc === 'end' ? x - t.length * mida * .58 : x - t.length * mida * .29) - 4}" y="${y - mida * .82}" width="${t.length * mida * .58 + 8}" height="${mida * 1.12}" rx="5" fill="#fffdf8" opacity=".92"/>` : '') + `<text x="${geRo(x)}" y="${geRo(y)}" text-anchor="${anc}" font-size="${mida}" font-weight="${pes}" fill="${col}">${t}</text>`;
function geFons(W, H, graella = 0, ox = 0, oy = 0) {
  let s = `<rect width="${W}" height="${H}" fill="#fffdf8"/>`;
  if (graella) { let d = ''; for (let x = ox % graella; x <= W; x += graella) d += `M${x} 0V${H}`; for (let y = oy % graella; y <= H; y += graella) d += `M0 ${y}H${W}`; s += `<path d="${d}" stroke="#eadfcd" stroke-width="1"/>`; }
  else s += `<g fill="#efe5d5">${[...Array(18)].map((_, i) => `<circle cx="${(i * 97) % W}" cy="${(i * 53 + 17) % H}" r="${2 + i % 3}"/>`).join('')}</g>`;
  return s;
}
const geSvg = (W, H, cos, cls = 'ge-vis', graella = 0) => `<svg class="${cls}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Figura">${geFons(W, H, graella)}${cos}</svg>`;
const gePoli = (pts, [c, cl], extra = '') => `<path d="M${pts.map(p => `${geRo(p[0])} ${geRo(p[1])}`).join('L')}Z" fill="${cl}" stroke="${c}" stroke-width="3.5" stroke-linejoin="round" ${extra}/>`;
// cota: línia amb fletxes paral·lela al segment, desplaçada d píxels cap a fora
function geCota(x1, y1, x2, y2, t, { d = 18, col = GE_N, mida = 15 } = {}) {
  const L = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / L * d, ny = (x2 - x1) / L * d;
  const a = [x1 + nx, y1 + ny], b = [x2 + nx, y2 + ny], ux = (x2 - x1) / L * 7, uy = (y2 - y1) / L * 7, vx = -uy * .55, vy = ux * .55;
  return `<g stroke="${col}" stroke-width="1.6" fill="none"><path d="M${x1} ${y1}L${a[0]} ${a[1]}M${x2} ${y2}L${b[0]} ${b[1]}" stroke-dasharray="2 3"/><path d="M${a[0]} ${a[1]}L${b[0]} ${b[1]}"/><path d="M${a[0] + ux + vx} ${a[1] + uy + vy}L${a[0]} ${a[1]}L${a[0] + ux - vx} ${a[1] + uy - vy}M${b[0] - ux + vx} ${b[1] - uy + vy}L${b[0]} ${b[1]}L${b[0] - ux - vx} ${b[1] - uy - vy}"/></g>`
    + geTx((a[0] + b[0]) / 2 + nx * .9, (a[1] + b[1]) / 2 + ny * .9 + 5, t, { mida, col, fons: true });
}
const geRecte = (x, y, dx, dy, m = 11) => `<path d="M${x + dx * m} ${y}L${x + dx * m} ${y + dy * m}L${x} ${y + dy * m}" fill="none" stroke="${GE_N}" stroke-width="1.6"/>`;
const geAlt = (x, yT, yB, t, { col = '#7c5cd6', costat = 1 } = {}) => `<path d="M${x} ${yT}V${yB}" stroke="${col}" stroke-width="2.6" stroke-dasharray="7 5"/>${geRecte(x, yB, costat, -1)}` + (t ? geTx(x + costat * 8, (yT + yB) / 2 + 5, t, { anc: costat > 0 ? 'start' : 'end', col, fons: true }) : '');
const geEsc = (W, H, w, h, m = 46) => Math.min((W - 2 * m) / w, (H - 2 * m) / h);
const geNum = (html, valor, unitat, errs = [], tol = 0) => ({ tipus: 'dec', llarg: true, html, valor: geRo(valor), unitat, errs: errs.filter(([v]) => v > 0 && Math.abs(v - valor) > 1e-9).map(([v, t]) => [geRo(v), t]), ...(tol ? { tol } : {}) });
const geComaHtml = t => `<div class="ge-coma">${gatComa(46, 'ge-gat')}<span class="baf">${t}</span></div>`;
const geU = (v, u) => `${geF(v)}&nbsp;${u}`;

/* ---------- les figures, amb colors ---------- */
const GE_W = 460, GE_H = 300;
function geRectFig(b, h, { u = 'cm', col = geCol(), cotes = true, quadric = false, txtB, txtH } = {}) {
  const k = geEsc(GE_W, GE_H, b, h), w = b * k, hh = h * k, x = (GE_W - w) / 2, y = (GE_H - hh) / 2;
  let s = gePoli([[x, y], [x + w, y], [x + w, y + hh], [x, y + hh]], col);
  if (quadric) { let d = ''; for (let i = 1; i < b; i++) d += `M${x + i * k} ${y}V${y + hh}`; for (let j = 1; j < h; j++) d += `M${x} ${y + j * k}H${x + w}`; s += `<path d="${d}" stroke="${col[0]}" stroke-width="1.2" opacity=".55"/>`; }
  if (cotes) s += geCota(x, y + hh, x + w, y + hh, txtB ?? geU(b, u), { d: 20 }) + geCota(x + w, y + hh, x + w, y, txtH ?? geU(h, u), { d: 20 });
  return geSvg(GE_W, GE_H, s);
}
function geRomboideFig(b, h, s, costat, { u = 'cm', col = geCol(), quadric = false, mou = false, net = false } = {}) {
  const k = geEsc(GE_W, GE_H, b + s, h), x = (GE_W - (b + s) * k) / 2, y = (GE_H - h * k) / 2, B = b * k, S = s * k, H = h * k;
  const P = [[x + S, y], [x + S + B, y], [x + B, y + H], [x, y + H]];
  let t = gePoli(P, col);
  if (quadric) { let d = ''; for (let i = 0; i <= b + s; i++) d += `M${x + i * k} ${y}V${y + H}`; for (let j = 0; j <= h; j++) d += `M${x} ${y + j * k}H${x + (b + s) * k}`; t = `<path d="${d}" stroke="#d8ccb8" stroke-width="1"/>` + t; }
  if (mou) t += `<g class="ge-mou" style="--dx:${B}px">${gePoli([[x, y + H], [x + S, y], [x + S, y + H]], ['#7c5cd6', '#e3dbffcc'], 'stroke-dasharray="6 4"')}</g>`;
  if (!net) t += geAlt(x + S, y, y + H, mou ? '' : geU(h, u), { costat: 1 });
  if (!mou && !net) t += geCota(x, y + H, x + B, y + H, geU(b, u), { d: 20 }) + (costat ? geTx(x + S / 2 - 12, y + H / 2, geU(costat, u), { anc: 'end', col: col[0], fons: true }) : '');
  return geSvg(GE_W, GE_H, t);
}
function geTriFig(b, h, a, { u = 'cm', col = geCol(), costats = null, cotaH = true, cotaB = true, quadric = false, extra = '' } = {}) { // a: on cau l'altura des de l'esquerra (pot ser fora)
  const xmin = Math.min(0, a), xmax = Math.max(b, a), k = geEsc(GE_W, GE_H, xmax - xmin, h), ox = (GE_W - (xmax - xmin) * k) / 2 - xmin * k, oy = (GE_H + h * k) / 2;
  const P = [[ox, oy], [ox + b * k, oy], [ox + a * k, oy - h * k]];
  let s = '';
  if (quadric) { let d = ''; for (let i = Math.floor(xmin); i <= Math.ceil(xmax); i++) d += `M${ox + i * k} ${oy - h * k}V${oy}`; for (let j = 0; j <= h; j++) d += `M${ox + xmin * k} ${oy - j * k}H${ox + xmax * k}`; s += `<path d="${d}" stroke="#d8ccb8" stroke-width="1"/>`; }
  s += gePoli(P, col);
  if (a < 0 || a > b) s += `<path d="M${ox + (a < 0 ? a * k : b * k)} ${oy}H${ox + (a < 0 ? 0 : a * k)}" stroke="${GE_N}" stroke-width="1.6" stroke-dasharray="4 4"/>`;
  if (cotaH) s += geAlt(ox + a * k, oy - h * k, oy, geU(h, u), { costat: a > b / 2 ? -1 : 1 });
  if (cotaB) s += geCota(ox, oy, ox + b * k, oy, geU(b, u), { d: 20 });
  if (costats) { const [l1, l2] = costats; if (l1) s += geTx((P[0][0] + P[2][0]) / 2 - 10, (P[0][1] + P[2][1]) / 2, geU(l1, u), { anc: 'end', col: col[0], fons: true }); if (l2) s += geTx((P[1][0] + P[2][0]) / 2 + 10, (P[1][1] + P[2][1]) / 2, geU(l2, u), { anc: 'start', col: col[0], fons: true }); }
  return geSvg(GE_W, GE_H, s + extra);
}
function geRombeFig(D, d, { u = 'cm', col = geCol(), cotes = true } = {}) {
  const k = geEsc(GE_W, GE_H, D, d), cx = GE_W / 2, cy = GE_H / 2, a = D * k / 2, b = d * k / 2;
  let s = gePoli([[cx - a, cy], [cx, cy - b], [cx + a, cy], [cx, cy + b]], col);
  s += `<path d="M${cx - a} ${cy}H${cx + a}" stroke="#2f6fd1" stroke-width="2.6" stroke-dasharray="7 5"/><path d="M${cx} ${cy - b}V${cy + b}" stroke="#e0457b" stroke-width="2.6" stroke-dasharray="7 5"/>`;
  if (cotes) s += geTx(cx + a * .45, cy - 8, `D = ${geU(D, u)}`, { col: '#2f6fd1', fons: true }) + geTx(cx + 10, cy + b * .55, `d = ${geU(d, u)}`, { anc: 'start', col: '#e0457b', fons: true });
  return geSvg(GE_W, GE_H, s);
}
function geTrapeziFig(B, b, h, off, { u = 'cm', col = geCol(), costat = null, net = false, senseAlt = false } = {}) {
  const k = geEsc(GE_W, GE_H, B, h), x = (GE_W - B * k) / 2, y = (GE_H - h * k) / 2, H = h * k;
  const P = [[x + off * k, y], [x + (off + b) * k, y], [x + B * k, y + H], [x, y + H]];
  let s = gePoli(P, col) + (net || senseAlt ? '' : geAlt(x + off * k, y, y + H, geU(h, u), { costat: 1 }));
  if (!net) s += geCota(x, y + H, x + B * k, y + H, `B = ${geU(B, u)}`, { d: 20 }) + geCota(P[0][0], y, P[1][0], y, `b = ${geU(b, u)}`, { d: -20 });
  if (costat) s += geTx((P[1][0] + P[2][0]) / 2 + 10, y + H / 2, geU(costat, u), { anc: 'start', col: col[0], fons: true });
  return geSvg(GE_W, GE_H, s);
}
function geRegular(n, L, { u = 'cm', col = geCol(), totes = false, net = false, txt = null } = {}) {
  const R = 105, cx = GE_W / 2, cy = GE_H / 2 + 6, P = [...Array(n).keys()].map(i => { const t = -Math.PI / 2 + Math.PI / n + i * 2 * Math.PI / n; return [cx + R * Math.cos(t), cy + R * Math.sin(t)]; });
  let s = gePoli(P, col);
  P.forEach((p, i) => { if (net || (!totes && i !== Math.floor(n / 2))) return; const q = P[(i + 1) % n]; const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2; const dx = mx - cx, dy = my - cy, l = Math.hypot(dx, dy); s += geTx(mx + dx / l * 26, my + dy / l * 26 + 5, txt ?? geU(L, u), { col: col[0], fons: true }); });
  P.forEach((p, i) => { const q = P[(i + 1) % n]; const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy); s += `<path d="M${mx - dy / l * 6} ${my + dx / l * 6}L${mx + dy / l * 6} ${my - dx / l * 6}" stroke="${GE_N}" stroke-width="2"/>`; });
  return geSvg(GE_W, GE_H, s);
}
const GE_NOMPOL = { 3: 'triangle equilàter', 4: 'quadrat', 5: 'pentàgon regular', 6: 'hexàgon regular', 8: 'octàgon regular' };
// cercles «artístics»: pizza, roda, plat de colors, rellotge
function geCercleFig(r, { mostra = 'r', tema = tria(['pizza', 'roda', 'plat', 'sol']), u = 'cm', txt = null, R = 112 } = {}) {
  const cx = GE_W / 2, cy = GE_H / 2; let s = '';
  if (tema === 'pizza') s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#f6c27a" stroke="#b86f1d" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="${R - 12}" fill="#e8503a"/>${[[-40, -30], [35, -45], [10, 30], [-50, 40], [55, 20], [-10, -65], [60, -10]].map(([a, b]) => `<circle cx="${cx + a}" cy="${cy + b}" r="9" fill="#9b2a1a"/>`).join('')}${[[-20, 10], [30, 55], [-60, -5], [20, -20]].map(([a, b]) => `<ellipse cx="${cx + a}" cy="${cy + b}" rx="8" ry="5" fill="#3b8a3a"/>`).join('')}`;
  else if (tema === 'roda') s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#2b2b2b"/><circle cx="${cx}" cy="${cy}" r="${R - 16}" fill="#d9dde3"/><g class="ge-gira">${[0, 45, 90, 135].map(a => `<path d="M${cx + (R - 18) * Math.cos(a * Math.PI / 180)} ${cy + (R - 18) * Math.sin(a * Math.PI / 180)}L${cx - (R - 18) * Math.cos(a * Math.PI / 180)} ${cy - (R - 18) * Math.sin(a * Math.PI / 180)}" stroke="#8a929e" stroke-width="3"/>`).join('')}</g><circle cx="${cx}" cy="${cy}" r="14" fill="#f47b20" stroke="${GE_N}" stroke-width="3"/>`;
  else if (tema === 'plat') s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#cfe2ff" stroke="#2f6fd1" stroke-width="5"/>${[...Array(12).keys()].map(i => `<circle cx="${cx + (R - 14) * Math.cos(i * Math.PI / 6)}" cy="${cy + (R - 14) * Math.sin(i * Math.PI / 6)}" r="6" fill="${GE_COL[i % 7][0]}"/>`).join('')}<circle cx="${cx}" cy="${cy}" r="${R - 32}" fill="#fff" stroke="#2f6fd1" stroke-width="2" stroke-dasharray="6 5"/>`;
  else s += `<g class="ge-gira">${[...Array(12).keys()].map(i => `<path d="M${cx + (R - 6) * Math.cos(i * Math.PI / 6)} ${cy + (R - 6) * Math.sin(i * Math.PI / 6)}L${cx + (R + 10) * Math.cos(i * Math.PI / 6 + .13)} ${cy + (R + 10) * Math.sin(i * Math.PI / 6 + .13)}L${cx + (R - 6) * Math.cos(i * Math.PI / 6 + .26)} ${cy + (R - 6) * Math.sin(i * Math.PI / 6 + .26)}" fill="#f2b705"/>`).join('')}</g><circle cx="${cx}" cy="${cy}" r="${R - 8}" fill="#ffd84d" stroke="#d39a00" stroke-width="5"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="4.5" fill="${GE_N}"/>`;
  const lab = txt ?? geU(r, u);
  if (mostra === 'r') s += `<path d="M${cx} ${cy}L${cx + R} ${cy}" stroke="${GE_N}" stroke-width="3.5"/>` + geTx(cx + R / 2, cy - 10, lab, { fons: true, mida: 17 });
  else if (mostra === 'd') s += `<path d="M${cx - R} ${cy}L${cx + R} ${cy}" stroke="${GE_N}" stroke-width="3.5"/>` + geTx(cx, cy - 10, lab, { fons: true, mida: 17 });
  return geSvg(GE_W, GE_H, s);
}
const geRepte = (t, a) => `<div class="ge-coma" style="margin-top:8px">${a === 'robot' ? robot(52) : gatComa(48, 'ge-gat')}<span class="baf">${t}</span></div>`;
const geFormula = t => `<div style="text-align:center;margin-top:10px"><span class="ge-form">${t}</span></div>`;

/* ---------- el geoplà: rectangles (2 clics) o triangles (3 clics) ---------- */
const GEO = { C: 10, F: 7, P: 42, M: 26 };
const geoPx = ([x, y]) => [GEO.M + x * GEO.P, GEO.M + (GEO.F - y) * GEO.P];
const geoArea = p => Math.abs(p.reduce((s, q, i) => s + q[0] * p[(i + 1) % p.length][1] - p[(i + 1) % p.length][0] * q[1], 0)) / 2;
const geoRect = (a, b) => [[a[0], a[1]], [b[0], a[1]], [b[0], b[1]], [a[0], b[1]]];
function geoGiny({ forma, comprova, txtObj, coma, exemple }) { // forma: 'rect' | 'tri' · comprova(punts) → true/false
  const W = 2 * GEO.M + GEO.C * GEO.P, H = 2 * GEO.M + GEO.F * GEO.P, n = forma === 'rect' ? 2 : 3;
  const punts = G => forma === 'rect' && G.p.length === 2 ? geoRect(G.p[0], G.p[1]) : G.p;
  const dibuix = (G, col = ['#f47b20', '#ffd9b8']) => { const q = punts(G); let s = '';
    if (q.length >= 3 || (forma === 'tri' && q.length === 3)) s += gePoli(q.map(geoPx), col);
    else if (q.length === 2) s += `<path d="M${geoPx(q[0]).join(' ')}L${geoPx(q[1]).join(' ')}" stroke="${col[0]}" stroke-width="3"/>`;
    G.p.forEach(p => { const [x, y] = geoPx(p); s += `<circle cx="${x}" cy="${y}" r="8" fill="${col[0]}" stroke="#fff" stroke-width="2"/>`; });
    return s; };
  const fons = () => { let s = geFons(W, H); for (let x = 0; x <= GEO.C; x++) for (let y = 0; y <= GEO.F; y++) { const [a, b] = geoPx([x, y]); s += `<circle cx="${a}" cy="${b}" r="4" fill="#8a7a63"/>`; } return s; };
  return {
    inici: () => ({ p: [], cur: [5, 3] }),
    munta(z, G, ctx) {
      z.innerHTML = `<div class="ge-g"><svg class="ge-geo" viewBox="0 0 ${W} ${H}" tabindex="0" role="application" aria-label="Geoplà">${fons()}<g class="geo-din"></g><circle class="geo-cur" r="13" fill="none" stroke="#f47b20" stroke-width="2.5" stroke-dasharray="4 3"/></svg>
        <div class="ge-ctl"><button data-g="esborra">Esborra</button>${geComaHtml(coma || (forma === 'rect' ? 'Clica dos vèrtexs oposats del rectangle.' : 'Clica els tres vèrtexs del triangle.'))}</div>
        <p class="ge-nota">Cada quadret del geoplà val 1 u². Clica els punts (o fletxes i Enter).</p></div>`;
      const svg = $('.ge-geo', z);
      const pinta = () => { $('.geo-din', svg).innerHTML = dibuix(G); const [x, y] = geoPx(G.cur); const c = $('.geo-cur', svg); c.setAttribute('cx', x); c.setAttribute('cy', y); ctx.canvi(); };
      G.pinta = pinta;
      const acc = ([x, y]) => { if (G.p.length >= n) G.p = []; if (G.p.some(q => q[0] === x && q[1] === y)) return; if (forma === 'rect' && G.p.length === 1 && (G.p[0][0] === x || G.p[0][1] === y)) { so('ko'); return; } G.p.push([x, y]); so(G.p.length === n ? 'ok' : 'pas'); pinta(); };
      const pt = e => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const q = p.matrixTransform(svg.getScreenCTM().inverse()); return [Math.max(0, Math.min(GEO.C, Math.round((q.x - GEO.M) / GEO.P))), Math.max(0, Math.min(GEO.F, GEO.F - Math.round((q.y - GEO.M) / GEO.P)))]; };
      svg.onclick = e => { if (!ctx.actiu()) return; G.cur = pt(e); acc(G.cur); svg.focus(); };
      svg.onmousemove = e => { if (!ctx.actiu()) return; G.cur = pt(e); const [x, y] = geoPx(G.cur); const c = $('.geo-cur', svg); c.setAttribute('cx', x); c.setAttribute('cy', y); };
      svg.onkeydown = e => { if (!ctx.actiu()) return; const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
        if (d) { e.preventDefault(); G.cur = [Math.max(0, Math.min(GEO.C, G.cur[0] + d[0])), Math.max(0, Math.min(GEO.F, G.cur[1] + d[1]))]; pinta(); }
        else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (G.p.length === n && e.key === 'Enter') ctx.envia(); else acc(G.cur); } };
      $('.ge-ctl', z).onclick = e => { if (e.target.closest('[data-g="esborra"]') && ctx.actiu()) { G.p = []; so('treu'); pinta(); } };
      pinta(); svg.focus({ preventScroll: true });
    },
    fet: G => G.p.length === n && (forma === 'rect' || geoArea(G.p) > 0),
    ok: G => comprova(punts(G)),
    txt: G => `${forma === 'rect' ? 'rectangle' : 'triangle'} ${punts(G).map(p => `(${p[0]},${p[1]})`).join(' ')}`,
    etiq: G => null,
    tanca(z, G, ok) {
      const svg = $('.ge-geo', z); svg.removeAttribute('tabindex'); $$('.ge-ctl button', z).forEach(b => b.disabled = true);
      const q = punts(G); const a = geoArea(q); const per = forma === 'rect' ? 2 * (Math.abs(q[1][0] - q[0][0]) + Math.abs(q[2][1] - q[1][1])) : null;
      $('.ge-nota', z).innerHTML = `La teva figura: àrea <b>${geF(a)} u²</b>${per != null ? `, perímetre <b>${per} u</b>` : ''}.`;
      if (!ok && exemple) svg.insertAdjacentHTML('beforeend', gePoli(exemple.map(geoPx), ['#1d9a5a', '#c9f0d855'], 'stroke-dasharray="7 5"'));
      const g = $('.ge-gat', z); if (g && ok) { g.classList.remove('salta'); void g.getBoundingClientRect(); g.classList.add('salta'); setTimeout(() => so('meu'), 350); }
      const b = $('.ge-coma .baf', z); if (b) b.innerHTML = ok ? 'Meu! Perfecte!' : (exemple ? 'Una que sí: la verda.' : 'Aquesta no compleix la condició.');
    },
    demo: resolt => `<svg class="ge-geo" viewBox="0 0 ${W} ${H}">${fons()}${resolt && exemple ? gePoli(exemple.map(geoPx), ['#1d9a5a', '#c9f0d8']) : ''}</svg>`,
    resol(z, G, be) { G.p = be ? (forma === 'rect' ? [exemple[0], exemple[2]] : exemple.slice()) : (forma === 'rect' ? [[0, 0], [1, 1]] : [[0, 0], [1, 0], [0, 1]]); if (!be && comprova(punts(G))) G.p = forma === 'rect' ? [[0, 0], [10, 7]] : [[0, 0], [10, 0], [0, 7]]; G.pinta(); }
  };
}
const geGiny = (rp, corr) => ({ resposta: { mode: 'giny', ...rp }, correctaHtml: corr, correctaTxt: textPla(corr) });

/* =====================================================================
   OBJECTIU 1 · LES FIGURES I LES SEVES MESURES
   ===================================================================== */
const GE_FIGS = {
  quadrat: () => geRectFig(4, 4, { cotes: false }), rectangle: () => geRectFig(6, 3, { cotes: false }),
  romboide: () => geRomboideFig(5, 3, 2, 0, { net: true }),
  rombe: () => geRombeFig(6, 4, { cotes: false }), trapezi: () => geTrapeziFig(7, 4, 3, 1.5, { net: true }),
  triangle: () => geTriFig(6, 4, 2, { cotaH: false, cotaB: false }), cercle: () => geCercleFig(3, { mostra: '', tema: 'plat' }),
  'pentàgon': () => geRegular(5, 3, { net: true }), 'hexàgon': () => geRegular(6, 3, { net: true })
};
const PISTA_GE1 = { completa: `L'<b>altura</b> sempre és <b>perpendicular</b> a la base (fa un angle recte, com una L) i va fins al punt més alt. No és el costat inclinat. El <b>diàmetre</b> travessa el cercle pel centre: fa el doble del <b>radi</b>.`, mitja: 'L\'altura fa angle recte amb la base.' };
const GE1 = {};
GE1.nom = nv => {
  const noms = Object.keys(GE_FIGS); const [a, b] = barreja(noms).slice(0, 2);
  const ops = n => barreja([n, ...barreja(noms.filter(x => x !== n)).slice(0, 3)]).map(x => ({ html: x, val: x }));
  return { sig: `nm-${a}-${b}`, enunciat: `Com es diu cada figura?`, visual: () => `<div class="ge-dues"><div>A${GE_FIGS[a]()}</div><div>B${GE_FIGS[b]()}</div></div>`, pista: { completa: `Fixa't en els costats: quants n'hi ha, si són iguals i si són paral·lels. Romboide: com un rectangle «tombat». Rombe: 4 costats iguals, com un diamant. Trapezi: només dos costats paral·lels.`, mitja: 'Compta els costats i mira si són iguals.' },
    ...apartats([{ tipus: 'tria', html: 'La figura <b>A</b> és un…', opcions: ops(a), correcta: a, etiq: {} }, { tipus: 'tria', html: 'La figura <b>B</b> és un…', opcions: ops(b), correcta: b, etiq: {} }]),
    explicacio: `A: ${a} · B: ${b}.`, solucio: [`La figura A és un <b>${a}</b>.`, `La figura B és un <b>${b}</b>.`] };
};
GE1.altura = nv => {
  const tipus = tria(nv === 3 ? ['triangle', 'obtus', 'romboide', 'trapezi'] : ['triangle', 'romboide', 'trapezi']);
  const k = 38, ox = 70, oy = 250; let fig = '', seg = [];
  const col = geCol();
  if (tipus === 'triangle' || tipus === 'obtus') {
    const b = 6, h = 4, a = tipus === 'obtus' ? 7.6 : geR(1, 2) + .5; const P = [[ox, oy], [ox + b * k, oy], [ox + a * k, oy - h * k]];
    fig = gePoli(P, col) + (tipus === 'obtus' ? `<path d="M${ox + b * k} ${oy}H${ox + a * k}" stroke="${GE_N}" stroke-width="1.6" stroke-dasharray="4 4"/>` : '');
    seg = [{ d: `M${P[2][0]} ${P[2][1]}V${oy}`, bo: true, recte: [P[2][0], oy] }, { d: `M${P[2][0]} ${P[2][1]}L${P[1][0]} ${P[1][1]}`, costat: true }, { d: `M${P[2][0]} ${P[2][1]}L${ox + b * k / 2} ${oy}`, bo: false }];
    if (tipus === 'obtus') seg[2] = { d: `M${P[2][0]} ${P[2][1]}L${P[0][0]} ${P[0][1]}`, costat: true };
  } else if (tipus === 'romboide') {
    const b = 6, h = 4, s = 2; const P = [[ox + s * k, oy - h * k], [ox + (s + b) * k, oy - h * k], [ox + b * k, oy], [ox, oy]];
    fig = gePoli(P, col); seg = [{ d: `M${ox + (s + 2) * k} ${oy - h * k}V${oy}`, bo: true, recte: [ox + (s + 2) * k, oy] }, { d: `M${P[3][0]} ${P[3][1]}L${P[0][0]} ${P[0][1]}`, costat: true }, { d: `M${ox + (s + 3.5) * k} ${oy - h * k}L${ox + 4.5 * k} ${oy}`, bo: false }];
  } else {
    const B = 8, b = 4, h = 4, off = 1.5; const P = [[ox + off * k, oy - h * k], [ox + (off + b) * k, oy - h * k], [ox + B * k, oy], [ox, oy]];
    fig = gePoli(P, col); seg = [{ d: `M${ox + (off + 1.5) * k} ${oy - h * k}V${oy}`, bo: true, recte: [ox + (off + 1.5) * k, oy] }, { d: `M${P[1][0]} ${P[1][1]}L${P[2][0]} ${P[2][1]}`, costat: true }, { d: `M${P[0][0]} ${P[0][1]}L${P[2][0]} ${P[2][1]}`, bo: false }];
  }
  const ord = barreja(seg); const cols = ['#2f6fd1', '#e0457b', '#1d9a5a'];
  let s = fig; ord.forEach((g, i) => { s += `<path d="${g.d}" stroke="${cols[i]}" stroke-width="4" stroke-dasharray="${g.costat ? '0' : '8 5'}" fill="none"/>`; });
  const mig = d => { const nums = d.match(/-?[\d.]+/g).map(Number); const v = d.includes('V'); return [(nums[0] + (v ? nums[0] : nums[2])) / 2, (nums[1] + (v ? nums[2] : nums[3])) / 2]; };
  const lab = ord.map((g, i) => { const [mx, my] = mig(g.d); return geTx(mx + 12, my + 5 + (i - 1) * 14, grLletraG(i), { col: cols[i], mida: 18, fons: true, anc: 'start' }); }).join('');
  const k2 = ord.findIndex(g => g.bo); const et = {}; ord.forEach((g, i) => { if (g.costat) et[grLletraG(i)] = 'gCostat'; });
  return { sig: `al-${tipus}-${ord.map(g => g.bo ? 1 : g.costat ? 2 : 3).join('')}`, enunciat: `Quina línia és l'<b>altura</b> d'aquest ${tipus === 'obtus' ? 'triangle' : tipus}${tipus === 'obtus' ? ' (compte: aquí l\'altura cau fora!)' : ''}? La base és el costat de baix.`,
    visual: () => geSvg(GE_W, GE_H, s + lab), pista: PISTA_GE1,
    ...apartats([{ tipus: 'tria', html: 'L\'altura és la línia…', opcions: ord.map((_, i) => ({ html: `<b style="color:${cols[i]}">${grLletraG(i)}</b>`, val: grLletraG(i) })), correcta: grLletraG(k2), etiq: et }]),
    explicacio: `L'altura és la ${grLletraG(k2)}: va des de dalt fins a la base fent un angle recte.`, solucio: [`L'altura ha de fer un <b>angle recte</b> amb la base.`, `Només la línia <b>${grLletraG(k2)}</b> és perpendicular a la base.`] };
};
const grLletraG = i => 'ABCDE'[i];
GE1.radi = nv => {
  const tema = tria(['pizza', 'roda', 'plat', 'sol']); const r = nv === 3 ? geR(5, 40) / 2 : geR(2, 15); const dona = nv === 1 ? 'r' : tria(['r', 'd']);
  const its = dona === 'r' ? [geNum(`El <b>radi</b> fa ${geU(r, 'cm')}. Quant fa el <b>diàmetre</b>?`, 2 * r, 'cm', [[r / 2, 'gDiam'], [r, 'gDiam']])] : [geNum(`El <b>diàmetre</b> fa ${geU(2 * r, 'cm')}. Quant fa el <b>radi</b>?`, r, 'cm', [[4 * r, 'gDiam'], [2 * r, 'gDiam']])];
  return { sig: `rd-${r}-${dona}`, enunciat: dona === 'r' ? `Aquí tens el radi d'aquest cercle.` : `Aquí tens el diàmetre d'aquest cercle.`, visual: () => geCercleFig(r, { mostra: dona, tema, txt: dona === 'd' ? geU(2 * r, 'cm') : geU(r, 'cm') }), pista: PISTA_GE1, ...apartats(its),
    explicacio: `El diàmetre és el doble del radi.`, solucio: dona === 'r' ? [`Diàmetre = 2 · radi`, `2 · ${geF(r)} = <b>${geF(2 * r)} cm</b>`] : [`Radi = diàmetre ÷ 2`, `${geF(2 * r)} ÷ 2 = <b>${geF(r)} cm</b>`] };
};
GE1.elements = nv => {
  if (Math.random() < .5) { const D = geR(6, 10), d = geR(3, D - 2);
    return { sig: `el-r-${D}-${d}`, enunciat: `En aquest rombe, quina és la <b>diagonal major</b>?`, visual: () => geRombeFig(D, d, { cotes: false }).replace('</svg>', geTx(GE_W / 2 + 70, GE_H / 2 - 10, 'A', { col: '#2f6fd1', mida: 20, fons: true }) + geTx(GE_W / 2 + 14, GE_H / 2 + 60, 'B', { col: '#e0457b', mida: 20, fons: true, anc: 'start' }) + '</svg>'), pista: { completa: 'Les diagonals uneixen vèrtexs oposats. La major és la més llarga.', mitja: 'La més llarga.' },
      ...apartats([{ tipus: 'tria', html: 'La diagonal major és la…', opcions: [{ html: '<b style="color:#2f6fd1">A</b>', val: 'A' }, { html: '<b style="color:#e0457b">B</b>', val: 'B' }], correcta: 'A', etiq: {} }, geNum(`Si la diagonal major fa ${D} cm i la menor ${d} cm, quant sumen?`, D + d, 'cm')]),
      explicacio: `La diagonal major (D) és la llarga i la menor (d), la curta.`, solucio: [`La diagonal major és la <b>A</b>.`, `${D} + ${d} = <b>${D + d} cm</b>`] }; }
  const B = geR(7, 10), b = geR(3, B - 3), h = geR(3, 5);
  return { sig: `el-t-${B}-${b}-${h}`, enunciat: `En un <b>trapezi</b>, les dues <b>bases</b> són els costats paral·lels. Mira'l i respon.`, visual: () => geTrapeziFig(B, b, h, (B - b) / 2), pista: { completa: 'Les bases del trapezi són els dos costats paral·lels: la gran (B) a baix i la petita (b) a dalt. L\'altura és la distància entre les bases.', mitja: 'B és la base gran; b, la petita.' },
    ...apartats([geNum('Quant fa la base gran (B)?', B, 'cm', [[b, 'gCostat']]), geNum('Quant fa l\'altura?', h, 'cm', [[b, 'gCostat']])]),
    explicacio: `B = ${B} cm, b = ${b} cm i l'altura ${h} cm.`, solucio: [`La base gran és la de baix: <b>${B} cm</b>.`, `L'altura és la línia discontínua: <b>${h} cm</b>.`] };
};
TEMES.g1 = {
  gen: GE1,
  sequencia: { 1: [['nom'], ['altura'], ['radi'], ['altura'], ['nom'], ['elements'], ['altura'], ['radi']], 2: [['nom'], ['altura'], ['radi'], ['elements'], ['altura'], ['nom'], ['altura'], ['radi']], 3: [['altura'], ['nom'], ['radi'], ['altura'], ['elements'], ['altura'], ['nom'], ['radi']] },
  explicacio: [
    { text: `<p>Cada figura té un nom segons els seus <b>costats</b>.</p><p class="petit">Quadrat, rectangle, romboide, rombe, trapezi, triangle… i el cercle, que no en té!</p>`, vis: () => `<div class="ge-dues"><div>${GE_FIGS.romboide()}romboide</div><div>${GE_FIGS.trapezi()}trapezi</div></div>` },
    { text: `<p>L'<b class="parpelleja">altura</b> va de dalt fins a la base fent un <b>angle recte</b>.</p><p class="petit">No és el costat inclinat! És la línia discontínua lila.</p>`, vis: () => geTriFig(6, 4, 1.5, { costats: [4.3, 4.7] }) },
    { text: `<p>Al cercle: el <b>radi</b> va del centre a la vora. El <b class="parpelleja">diàmetre</b> el travessa: és el doble.</p><p class="petit">En Coma ho sap: la pizza de 30 cm de diàmetre té 15 cm de radi.</p>`, vis: () => `${geCercleFig(15, { mostra: 'd', tema: 'pizza', txt: '30 cm' })}${geRepte('Meu! Radi = diàmetre ÷ 2')}` }
  ],
  exemple: nv => ({ enunciat: `Quina és l'altura del triangle?`, passos: [
    { text: `Busco la línia que va de dalt fins a la base i fa un angle recte.`, vis: geTriFig(6, 4, 2, { costats: [4.5, 5.7] }) },
    { text: `És la discontínua: <b>4 cm</b>. Els costats inclinats no són l'altura. <span class="marca-ok">✓</span>`, vis: geTriFig(6, 4, 2, { costats: [4.5, 5.7] }) }] })
};

/* =====================================================================
   OBJECTIU 2 · EL PERÍMETRE
   ===================================================================== */
const PISTA_GE2 = { completa: `El <b>perímetre</b> és la longitud de la <b>vora</b>: suma <b>tots</b> els costats. Al rectangle hi ha dos costats de cada mida. Al polígon regular, tots els costats són iguals: costat × nombre de costats.`, mitja: 'Suma tots els costats de la vora.' };
const GE2 = {};
GE2.poligon = nv => {
  const tipus = tria(['rect', 'tri', 'trap']); const dec = nv === 3 ? (v => geR(v * 2, v * 2 + 1) / 2) : (v => v);
  if (tipus === 'rect') { const b = dec(geR(4, 12)), h = dec(geR(2, Math.min(9, b - 1)));
    return { sig: `pr-${b}-${h}`, enunciat: `Quin és el <b>perímetre</b> d'aquest rectangle?`, visual: () => geRectFig(b, h, {}), pista: PISTA_GE2, ...apartats([geNum('Perímetre =', 2 * (b + h), 'cm', [[b * h, 'gArea'], [b + h, 'gArea']])]),
      explicacio: `Dos costats de ${geF(b)} i dos de ${geF(h)}.`, solucio: [`${geF(b)} + ${geF(h)} + ${geF(b)} + ${geF(h)}`, `= <b>${geF(2 * (b + h))} cm</b>`] }; }
  if (tipus === 'tri') { const l = [dec(geR(4, 9)), dec(geR(4, 9)), dec(geR(5, 10))]; const b = l[2], h = 4, a = 2;
    return { sig: `pt-${l}`, enunciat: `Quin és el <b>perímetre</b> d'aquest triangle?`, visual: () => geTriFig(b, h, a, { cotaH: false, costats: [l[0], l[1]] }), pista: PISTA_GE2, ...apartats([geNum('Perímetre =', l[0] + l[1] + l[2], 'cm', [[b * h / 2, 'gArea']])]),
      explicacio: `Suma els tres costats.`, solucio: [`${l.map(geF).join(' + ')}`, `= <b>${geF(l[0] + l[1] + l[2])} cm</b>`] }; }
  const B = dec(geR(8, 12)), b = dec(geR(3, 6)), c = dec(geR(4, 7)), d = dec(geR(4, 7)), h = 4;
  return { sig: `pz-${B}-${b}-${c}-${d}`, enunciat: `Quin és el <b>perímetre</b> d'aquest trapezi? (Els costats inclinats fan ${geU(c, 'cm')} i ${geU(d, 'cm')}.)`, visual: () => geTrapeziFig(B, b, h, 1.5, { senseAlt: true }), pista: PISTA_GE2, ...apartats([geNum('Perímetre =', B + b + c + d, 'cm', [[(B + b) * h / 2, 'gArea'], [B + b, 'gArea']])]),
    explicacio: `Els quatre costats: ${geF(B)} + ${geF(b)} + ${geF(c)} + ${geF(d)}.`, solucio: [`${geF(B)} + ${geF(b)} + ${geF(c)} + ${geF(d)}`, `= <b>${geF(B + b + c + d)} cm</b>`] };
};
GE2.regular = nv => {
  const n = tria([3, 5, 6, 8, 4]), L = nv === 3 ? geR(5, 30) / 2 : geR(2, 9); const inv = nv === 3 && Math.random() < .5;
  const it = inv ? geNum(`El perímetre fa ${geU(n * L, 'cm')}. Quant fa cada costat?`, L, 'cm', [[n * n * L, 'gArea']]) : geNum('Perímetre =', n * L, 'cm', [[L * L, 'gArea'], [L + n, 'gSuma']]);
  return { sig: `rg-${n}-${L}-${inv}`, enunciat: `Aquest és un <b>${GE_NOMPOL[n]}</b>: tots els costats són iguals.${inv ? '' : ' Quin és el seu perímetre?'}`, visual: () => geRegular(n, L, { txt: inv ? '?' : null }), pista: PISTA_GE2, ...apartats([it]),
    explicacio: `${n} costats iguals: ${n} × costat.`, solucio: inv ? [`Costat = perímetre ÷ ${n}`, `${geF(n * L)} ÷ ${n} = <b>${geF(L)} cm</b>`] : [`${n} costats de ${geF(L)} cm`, `${n} × ${geF(L)} = <b>${geF(n * L)} cm</b>`] };
};
GE2.falta = nv => {
  const b = geR(4, 12), h = geR(2, b - 1), P = 2 * (b + h);
  return { sig: `fl-${b}-${h}`, enunciat: `Un rectangle té un perímetre de <b>${P} cm</b> i la base fa <b>${b} cm</b>. Quant fa l'altura?`, visual: () => geRectFig(b, h, { txtH: '?' }), pista: { completa: `Les dues bases fan ${2 * b} cm. El que queda del perímetre és per a les dues altures: divideix-ho entre 2.`, mitja: 'Resta les dues bases i divideix entre 2.' },
    ...apartats([geNum('Altura =', h, 'cm', [[P - b, 'gArea'], [P - 2 * b, 'gArea']])]), explicacio: `${P} − 2 · ${b} = ${P - 2 * b}; ÷ 2 = ${h}.`, solucio: [`Les dues bases: 2 · ${b} = ${2 * b}`, `Queden ${P} − ${2 * b} = ${P - 2 * b} cm per a les dues altures`, `${P - 2 * b} ÷ 2 = <b>${h} cm</b>`] };
};
GE2.problema = nv => {
  const ctx = tria(['hort', 'socol', 'foto']); const b = geR(5, 12), h = geR(3, b - 1);
  if (ctx === 'hort') { const p = 1; return { sig: `ph-${b}-${h}`, enunciat: `Volem envoltar un hort rectangular de <b>${b} m</b> × <b>${h} m</b> amb una tanca. Hi deixem una porta d'<b>1 m</b> sense tanca. Quants metres de tanca necessitem?`, visual: () => geRectFig(b, h, { u: 'm', col: ['#1d9a5a', '#c9f0d8'] }) + geRepte('En Coma vigila que no entrin els conills!'), pista: PISTA_GE2,
    ...apartats([geNum('Tanca =', 2 * (b + h) - p, 'm', [[2 * (b + h), 'gArea'], [b * h, 'gArea']])]), explicacio: `Perímetre ${2 * (b + h)} m menys 1 m de porta.`, solucio: [`Perímetre: 2 · (${b} + ${h}) = ${2 * (b + h)} m`, `Sense la porta: ${2 * (b + h)} − 1 = <b>${2 * (b + h) - 1} m</b>`] }; }
  if (ctx === 'socol') { const p = 1; return { sig: `ps-${b}-${h}`, enunciat: `Posarem sòcol a una habitació de <b>${b} m</b> × <b>${h} m</b>. La porta fa <b>1 m</b> i allà no n'hi va. Quants metres de sòcol calen?`, visual: () => geRectFig(b, h, { u: 'm', col: ['#7c5cd6', '#e3dbff'] }), pista: PISTA_GE2,
    ...apartats([geNum('Sòcol =', 2 * (b + h) - p, 'm', [[2 * (b + h), 'gArea'], [b * h, 'gArea']])]), explicacio: `Perímetre ${2 * (b + h)} m menys la porta.`, solucio: [`Perímetre: 2 · (${b} + ${h}) = ${2 * (b + h)} m`, `Sense la porta: ${2 * (b + h)} − 1 = <b>${2 * (b + h) - 1} m</b>`] }; }
  return { sig: `pf-${b}-${h}`, enunciat: `Un marc per a una foto de <b>${b * 2} cm</b> × <b>${h * 2} cm</b>. Quants centímetres de llistó calen per fer tot el marc?`, visual: () => geRectFig(b * 2, h * 2, { col: ['#d39a00', '#fff1b8'] }), pista: PISTA_GE2,
    ...apartats([geNum('Llistó =', 4 * (b + h), 'cm', [[4 * b * h, 'gArea']])]), explicacio: `És el perímetre de la foto.`, solucio: [`2 · (${2 * b} + ${2 * h})`, `= <b>${4 * (b + h)} cm</b>`] };
};
GE2.geopla = nv => {
  const P = tria(nv === 1 ? [10, 12, 14, 16] : [12, 14, 16, 18, 20]); const A = nv > 1 ? (() => { const ops = []; for (let b = 1; b <= 10; b++) { const h = P / 2 - b; if (h >= 1 && h <= 7) ops.push(b * h); } return tria(ops); })() : null;
  let ex = null; for (let b = 1; b <= 10 && !ex; b++) { const h = P / 2 - b; if (h >= 1 && h <= 7 && (A == null || b * h === A)) ex = geoRect([1, 0], [1 + b, h]); }
  return { sig: `gp-${P}-${A}`, enunciat: `Dibuixa al geoplà un rectangle de <b>perímetre ${P}</b>${A ? ` i <b>àrea ${A}</b>` : ''}. (Cada costat de quadret fa 1.)`, visual: null, pista: { completa: `El perímetre és base + altura + base + altura. Si P = ${P}, base + altura = ${P / 2}. Prova parelles: ${P / 2 - 2} i 2, ${P / 2 - 3} i 3…`, mitja: `Base + altura = ${P / 2}.` },
    ...geGiny(geoGiny({ forma: 'rect', comprova: q => { const b = Math.abs(q[1][0] - q[0][0]), h = Math.abs(q[2][1] - q[1][1]); return 2 * (b + h) === P && (A == null || b * h === A); }, exemple: ex, coma: `Perímetre ${P}${A ? `, àrea ${A}` : ''}. Clica dos vèrtexs oposats!` }), `un rectangle de perímetre ${P}${A ? ` i àrea ${A}` : ''}`),
    explicacio: `La base i l'altura sumen ${P / 2}.`, solucio: [`Base + altura = ${P} ÷ 2 = ${P / 2}`, `Per exemple, ${Math.abs(ex[1][0] - ex[0][0])} i ${Math.abs(ex[2][1] - ex[1][1])}`] };
};
TEMES.g2 = {
  gen: GE2,
  sequencia: { 1: [['poligon'], ['regular'], ['geopla'], ['poligon'], ['problema'], ['regular'], ['geopla'], ['problema']], 2: [['poligon'], ['regular'], ['geopla'], ['falta'], ['problema'], ['poligon'], ['geopla'], ['problema']], 3: [['poligon'], ['falta'], ['geopla'], ['regular'], ['problema'], ['poligon'], ['falta'], ['problema']] },
  explicacio: [
    { text: `<p>El <b>perímetre</b> és la longitud de la <b class="parpelleja">vora</b> d'una figura.</p><p class="petit">Com si en Coma caminés per tot el contorn: suma tots els costats.</p>`, vis: () => `${geRectFig(6, 4, {})}${geRepte('6 + 4 + 6 + 4 = 20 cm')}` },
    { text: `<p>Al <b>polígon regular</b>, tots els costats són iguals.</p><p class="petit">Hexàgon de 5 cm de costat: 6 × 5 = <b>30 cm</b>.</p>`, vis: () => geRegular(6, 5, { totes: true }) }
  ],
  exemple: nv => ({ enunciat: `Perímetre d'un rectangle de 7 cm × 3 cm.`, passos: [
    { text: `Hi ha dos costats de 7 i dos de 3.`, vis: geRectFig(7, 3, {}) },
    { text: `7 + 3 + 7 + 3 = <b>20 cm</b>. <span class="marca-ok">✓</span>`, vis: geRectFig(7, 3, {}) }] })
};

/* =====================================================================
   OBJECTIU 3 · ÀREA DEL RECTANGLE, EL QUADRAT I EL ROMBOIDE
   ===================================================================== */
const PISTA_GE3 = { completa: `L'<b>àrea</b> és el que hi ha a dins. Rectangle i romboide: <b>base × altura</b>. Quadrat: costat × costat. Al romboide, l'altura és la discontínua, no el costat inclinat.`, mitja: 'Àrea = base × altura.' };
const GE3 = {};
GE3.compta = nv => {
  const rom = nv > 1 && Math.random() < .6; const b = geR(3, 7), h = geR(2, 5), s = rom ? geR(1, 2) : 0;
  return { sig: `ct-${b}-${h}-${s}`, enunciat: `Cada quadret fa 1 cm². Quina és l'<b>àrea</b> d'aquest ${rom ? 'romboide' : 'rectangle'}?`, visual: (c) => rom ? geRomboideFig(b, h, s, 0, { quadric: true, mou: c }) : geRectFig(b, h, { quadric: true, cotes: false }), pista: { completa: rom ? `Si talles el triangle de l'esquerra i el poses a la dreta, el romboide es converteix en un rectangle de ${b} × ${h}.` : `No cal comptar d'un en un: ${b} columnes de ${h} quadrets.`, mitja: 'Files × columnes.' },
    ...apartats([geNum('Àrea =', b * h, 'cm²', [[2 * (b + h), 'gPerim'], [b + h, 'gSuma']])]), explicacio: `${b} × ${h} = ${b * h} cm².`, solucio: [rom ? `El triangle de l'esquerra encaixa a la dreta: queda un rectangle.` : `${b} columnes i ${h} files.`, `${b} × ${h} = <b>${b * h} cm²</b>`] };
};
GE3.rectangle = nv => {
  const d = nv === 1 ? 1 : 2; const b = geR(3 * d, 12 * d) / d, h = geR(2 * d, 8 * d) / d; const u = tria(['cm', 'm']);
  return { sig: `rc-${b}-${h}`, enunciat: `Quina és l'<b>àrea</b> d'aquest rectangle?`, visual: () => geRectFig(b, h, { u }), pista: PISTA_GE3, ...apartats([geNum('Àrea =', b * h, `${u}²`, [[2 * (b + h), 'gPerim'], [b + h, 'gSuma']])]),
    explicacio: `Base × altura.`, solucio: [`Base × altura`, `${geF(b)} × ${geF(h)} = <b>${geF(b * h)} ${u}²</b>`] };
};
GE3.quadrat = nv => {
  const L = nv === 3 ? geR(3, 15) : geR(2, 12); const inv = nv === 3 && Math.random() < .5;
  return { sig: `qd-${L}-${inv}`, enunciat: inv ? `Un quadrat té una àrea de <b>${L * L} m²</b>. Quant fa el costat?` : `Quina és l'<b>àrea</b> d'aquest quadrat?`, visual: () => geRectFig(L, L, { u: 'm', txtB: inv ? '?' : undefined, txtH: inv ? '?' : '' }), pista: { completa: inv ? `Busca el nombre que, multiplicat per ell mateix, fa ${L * L} (l'arrel quadrada).` : `Al quadrat, base i altura són iguals: costat × costat.`, mitja: inv ? 'Arrel quadrada.' : 'Costat × costat.' },
    ...apartats([inv ? geNum('Costat =', L, 'm', [[L * L / 2, 'gArrel'], [L * L / 4, 'gPerim']]) : geNum('Àrea =', L * L, 'm²', [[4 * L, 'gPerim'], [2 * L, 'gQuad']])]),
    explicacio: inv ? `${L} · ${L} = ${L * L}.` : `${L} · ${L} = ${L * L} m².`, solucio: inv ? [`Costat = √${L * L}`, `= <b>${L} m</b>, perquè ${L} · ${L} = ${L * L}`] : [`Costat × costat`, `${L} × ${L} = <b>${L * L} m²</b>`] };
};
GE3.romboide = nv => {
  const b = geR(4, 10), h = geR(2, 6), s = geR(1, 3), c = geRo(Math.round(Math.hypot(s, h) * 10) / 10);
  return { sig: `rm-${b}-${h}-${s}`, enunciat: `Quina és l'<b>àrea</b> d'aquest romboide?`, visual: (cpl) => geRomboideFig(b, h, s, c, {}), pista: PISTA_GE3,
    ...apartats([geNum('Àrea =', b * h, 'cm²', [[b * c, 'gCostat'], [2 * (b + c), 'gPerim'], [b * h / 2, 'gMeitat']])]), explicacio: `Base × altura (la discontínua): ${b} × ${h}.`, solucio: [`L'altura és la discontínua (${h} cm), no el costat inclinat (${geF(c)} cm).`, `${b} × ${h} = <b>${b * h} cm²</b>`] };
};
GE3.geopla = nv => {
  const A = tria(nv === 1 ? [6, 8, 10, 12] : [12, 15, 18, 20, 24]); const P = nv === 3 ? (() => { const ps = []; for (let b = 1; b <= 10; b++) if (A % b === 0 && A / b <= 7) ps.push(2 * (b + A / b)); return tria(ps); })() : null;
  let ex = null; for (let b = 1; b <= 10 && !ex; b++) if (A % b === 0 && A / b <= 7 && (P == null || 2 * (b + A / b) === P)) ex = geoRect([0, 0], [b, A / b]);
  return { sig: `ga-${A}-${P}`, enunciat: `Dibuixa al geoplà un rectangle d'<b>àrea ${A} u²</b>${P ? ` i <b>perímetre ${P}</b>` : ''}.`, visual: null, pista: { completa: `Busca dos nombres que multiplicats facin ${A}: ${[...Array(10).keys()].map(i => i + 1).filter(b => A % b === 0 && A / b <= 7).map(b => `${b} × ${A / b}`).join(', ')}…`, mitja: `Base × altura = ${A}.` },
    ...geGiny(geoGiny({ forma: 'rect', comprova: q => { const b = Math.abs(q[1][0] - q[0][0]), h = Math.abs(q[2][1] - q[1][1]); return b * h === A && (P == null || 2 * (b + h) === P); }, exemple: ex, coma: `Àrea ${A}! Base × altura = ${A}.` }), `un rectangle d'àrea ${A}${P ? ` i perímetre ${P}` : ''}`),
    explicacio: `Base × altura = ${A}.`, solucio: [`Per exemple, ${Math.abs(ex[1][0] - ex[0][0])} × ${Math.abs(ex[2][1] - ex[1][1])} = ${A}`] };
};
GE3.unitats = nv => {
  const b = geR(2, 6), hc = geR(3, 9) * 10;
  return { sig: `un-${b}-${hc}`, enunciat: `Una catifa fa <b>${b} m</b> de llarg i <b>${hc} cm</b> d'ample. Quina és la seva àrea en <b>m²</b>?`, visual: () => geRectFig(b, hc / 100, { u: 'm', txtH: `${hc} cm`, col: ['#e0457b', '#ffd6e4'] }), pista: { completa: `Primer passa els ${hc} cm a metres (÷ 100). Després, base × altura.`, mitja: 'Tot en metres!' },
    ...apartats([geNum('Àrea =', b * hc / 100, 'm²', [[b * hc, 'gUnitat']])]), explicacio: `${hc} cm = ${geF(hc / 100)} m.`, solucio: [`${hc} cm = ${geF(hc / 100)} m`, `${b} × ${geF(hc / 100)} = <b>${geF(b * hc / 100)} m²</b>`] };
};
TEMES.g3 = {
  gen: GE3,
  sequencia: { 1: [['compta'], ['rectangle'], ['geopla'], ['quadrat'], ['compta'], ['rectangle'], ['geopla'], ['quadrat']], 2: [['compta'], ['rectangle'], ['romboide'], ['geopla'], ['quadrat'], ['romboide'], ['compta'], ['rectangle']], 3: [['romboide'], ['rectangle'], ['geopla'], ['quadrat'], ['unitats'], ['romboide'], ['quadrat'], ['unitats']] },
  explicacio: [
    { text: `<p>L'<b>àrea</b> és el que ocupa una figura per <b>dins</b>. Es mesura en quadrets: cm², m²…</p><p class="petit">Aquest rectangle té 5 columnes de 3: <b class="parpelleja">5 × 3 = 15 cm²</b>.</p>`, vis: () => geRectFig(5, 3, { quadric: true }) },
    { text: `<p>El <b>romboide</b> és un rectangle «tombat». Si talles el triangle i el mous, és un rectangle!</p><p class="petit">Per això també és <b>base × altura</b> (l'altura és la discontínua).</p>`, vis: () => geRomboideFig(5, 3, 2, 0, { quadric: true, mou: true }) },
    { text: `<p>Compte: l'àrea <b>no</b> és el perímetre.</p><p class="petit">Perímetre: la vora (cm). Àrea: l'interior (cm²). FR-4C sempre mira la unitat!</p>`, vis: () => `${geRectFig(4, 3, { quadric: true })}${geRepte('Perímetre 14 cm · àrea 12 cm²', 'robot')}` }
  ],
  exemple: nv => nv === 1 ? { enunciat: `Àrea d'un rectangle de 6 cm × 4 cm.`, passos: [{ text: `Base × altura.`, vis: geRectFig(6, 4, { quadric: true }) }, { text: `6 × 4 = <b>24 cm²</b>. <span class="marca-ok">✓</span>`, vis: geRectFig(6, 4, { quadric: true }) }] }
    : { enunciat: `Àrea d'un romboide de base 7 cm i altura 3 cm.`, passos: [{ text: `L'altura és la discontínua: 3 cm (no el costat inclinat).`, vis: geRomboideFig(7, 3, 2, 3.6, {}) }, { text: `7 × 3 = <b>21 cm²</b>. <span class="marca-ok">✓</span>`, vis: geRomboideFig(7, 3, 2, 3.6, {}) }] }
};

/* =====================================================================
   OBJECTIU 4 · ÀREA DEL TRIANGLE, EL ROMBE I EL TRAPEZI
   ===================================================================== */
const PISTA_GE4 = { completa: `Triangle: <b>base × altura ÷ 2</b> (és la meitat d'un rectangle). Rombe: <b>D × d ÷ 2</b>. Trapezi: <b>(B + b) × altura ÷ 2</b>. Sempre amb l'altura perpendicular, no el costat inclinat.`, mitja: 'No t\'oblidis del ÷ 2.' };
const GE4 = {};
GE4.triangle = nv => {
  const b = geR(4, 12), h = geR(3, 9), a = geR(1, b - 1); const parell = (b * h) % 2 === 0 || nv > 1; if (!parell) return GE4.triangle(nv);
  const l1 = geRo(Math.round(Math.hypot(a, h) * 10) / 10), l2 = geRo(Math.round(Math.hypot(b - a, h) * 10) / 10);
  return { sig: `tr-${b}-${h}-${a}`, enunciat: `Quina és l'<b>àrea</b> d'aquest triangle?`, visual: () => geTriFig(b, h, a, { costats: nv > 1 ? [l1, l2] : null }), pista: PISTA_GE4,
    ...apartats([geNum('Àrea =', b * h / 2, 'cm²', [[b * h, 'gMeitat'], [b * l1 / 2, 'gCostat'], [b * l2 / 2, 'gCostat'], [b + l1 + l2, 'gPerim']])]), explicacio: `${b} × ${h} ÷ 2 = ${geF(b * h / 2)} cm².`, solucio: [`Base × altura ÷ 2`, `${b} × ${h} = ${b * h}`, `${b * h} ÷ 2 = <b>${geF(b * h / 2)} cm²</b>`] };
};
GE4.quadricula = nv => {
  const b = geR(2, 6) * 2, h = geR(2, 5), a = geR(0, b);
  return { sig: `tq-${b}-${h}-${a}`, enunciat: `Cada quadret fa 1 cm². Quina és l'<b>àrea</b> del triangle?`, visual: (c) => geTriFig(b, h, a, { quadric: true, cotaH: false, cotaB: false, extra: c ? '' : '' }), pista: { completa: `El triangle és la meitat del rectangle de ${b} × ${h} que l'envolta: ${b * h} ÷ 2.`, mitja: 'La meitat del rectangle.' },
    ...apartats([geNum('Àrea =', b * h / 2, 'cm²', [[b * h, 'gMeitat']])]), explicacio: `La meitat de ${b} × ${h}.`, solucio: [`Base ${b}, altura ${h}`, `${b} × ${h} ÷ 2 = <b>${b * h / 2} cm²</b>`] };
};
GE4.rombe = nv => {
  const D = geR(6, 14), d = geR(3, D - 2); if ((D * d) % 2 && nv === 1) return GE4.rombe(nv);
  return { sig: `rb-${D}-${d}`, enunciat: `Quina és l'<b>àrea</b> d'aquest rombe?`, visual: () => geRombeFig(D, d), pista: PISTA_GE4,
    ...apartats([geNum('Àrea =', D * d / 2, 'cm²', [[D * d, 'gMeitat'], [D + d, 'gSuma']])]), explicacio: `D × d ÷ 2.`, solucio: [`Diagonal major × diagonal menor ÷ 2`, `${D} × ${d} = ${D * d}`, `${D * d} ÷ 2 = <b>${geF(D * d / 2)} cm²</b>`] };
};
GE4.trapezi = nv => {
  const B = geR(7, 14), b = geR(3, B - 3), h = geR(2, 7); if (((B + b) * h) % 2 && nv === 1) return GE4.trapezi(nv);
  const c = geRo(Math.round(Math.hypot((B - b) / 2, h) * 10) / 10);
  return { sig: `tz-${B}-${b}-${h}`, enunciat: `Quina és l'<b>àrea</b> d'aquest trapezi?`, visual: () => geTrapeziFig(B, b, h, (B - b) / 2, { costat: nv > 1 ? c : null }), pista: PISTA_GE4,
    ...apartats([geNum('Àrea =', (B + b) * h / 2, 'cm²', [[(B + b) * h, 'gMeitat'], [B * b * h / 2, 'gSuma'], [(B + b) * c / 2, 'gCostat']])]), explicacio: `(B + b) × h ÷ 2.`, solucio: [`(B + b) × altura ÷ 2`, `${B} + ${b} = ${B + b}`, `${B + b} × ${h} = ${(B + b) * h}`, `${(B + b) * h} ÷ 2 = <b>${geF((B + b) * h / 2)} cm²</b>`] };
};
GE4.geopla = nv => {
  const A = tria(nv === 1 ? [3, 4, 6, 8] : [5, 6, 7.5, 9, 10, 12]);
  let ex = null; for (let b = 1; b <= 10 && !ex; b++) for (let h = 1; h <= 7 && !ex; h++) if (b * h / 2 === A) ex = [[1, 0], [1 + b, 0], [1, h]];
  return { sig: `gt-${A}`, enunciat: `Dibuixa al geoplà un <b>triangle</b> d'àrea <b>${geF(A)} u²</b>.`, visual: null, pista: { completa: `Base × altura ÷ 2 = ${geF(A)}. Per tant, base × altura = ${geF(2 * A)}. Fes la base a baix i puja l'altura.`, mitja: `Base × altura = ${geF(2 * A)}.` },
    ...geGiny(geoGiny({ forma: 'tri', comprova: q => Math.abs(geoArea(q) - A) < 1e-9, exemple: ex, coma: `Àrea ${geF(A)}. Recorda el ÷ 2!` }), `un triangle d'àrea ${geF(A)}`),
    explicacio: `Base × altura = ${geF(2 * A)}.`, solucio: [`Base × altura ÷ 2 = ${geF(A)}`, `Base × altura = ${geF(2 * A)}`, `Per exemple, base ${ex[1][0] - ex[0][0]} i altura ${ex[2][1]}`] };
};
TEMES.g4 = {
  gen: GE4,
  sequencia: { 1: [['quadricula'], ['triangle'], ['rombe'], ['geopla'], ['triangle'], ['trapezi'], ['quadricula'], ['rombe']], 2: [['triangle'], ['quadricula'], ['rombe'], ['trapezi'], ['geopla'], ['triangle'], ['trapezi'], ['rombe']], 3: [['triangle'], ['trapezi'], ['geopla'], ['rombe'], ['triangle'], ['trapezi'], ['geopla'], ['rombe']] },
  explicacio: [
    { text: `<p>Un triangle és la <b class="parpelleja">meitat</b> d'un rectangle.</p><p class="petit">Per això: àrea = <b>base × altura ÷ 2</b>.</p>`, vis: () => geTriFig(6, 4, 3, { quadric: true }) },
    { text: `<p>El <b>rombe</b>: diagonal major × diagonal menor ÷ 2.</p><p class="petit">És la meitat del rectangle que el conté.</p>`, vis: () => geRombeFig(8, 5) },
    { text: `<p>El <b>trapezi</b>: (base gran + base petita) × altura ÷ 2.</p><p class="petit">En Coma ho recorda així: «sumo les bases, per l'altura, i la meitat».</p>`, vis: () => `${geTrapeziFig(9, 5, 4, 2)}${geRepte('(B + b) × h ÷ 2')}` }
  ],
  exemple: nv => ({ enunciat: `Àrea d'un triangle de base 8 cm i altura 5 cm.`, passos: [
    { text: `Base × altura`, vis: geTriFig(8, 5, 3, {}) },
    { text: `8 × 5 = 40<br>40 ÷ 2 = <b>20 cm²</b> <span class="marca-ok">✓</span>`, vis: geTriFig(8, 5, 3, { quadric: true }) }] })
};

Object.assign(ETIQ_ERR, { gRestaCat: 'suma en lloc de restar per trobar un catet' });
Object.assign(AVIS_ERR, { gRestaCat: 'Per trobar un <b>catet</b>, a la hipotenusa al quadrat se li <b>resta</b> l\'altre catet al quadrat.' });
/* resultat amb π: el valor amb 3,14 i, com a tolerància, la diferència amb la tecla π (més una mica per arrodonir) */
const gePiNum = (html, f, u, errs = []) => { const v = geRo(Math.round(f(3.14) * 100) / 100), e = f(Math.PI); return geNum(html, v, u, errs, Math.abs(e - v) + 0.06); };

/* =====================================================================
   OBJECTIU 5 · EL CERCLE
   ===================================================================== */
const PISTA_GE5 = { completa: `<b>Longitud</b> (la vora): 2 · π · r. <b>Àrea</b> (l'interior): π · r · r. Fes servir π = 3,14 (o la tecla π de la calculadora). Si et donen el diàmetre, primer troba el radi: d ÷ 2.`, mitja: 'L = 2 · π · r · A = π · r².' };
const GE5 = {};
GE5.longitud = nv => {
  const r = geR(2, 20), d = nv > 1 && Math.random() < .6; const tema = tria(['roda', 'plat', 'pizza', 'sol']);
  return { sig: `lo-${r}-${d}`, enunciat: `Quina és la <b>longitud</b> de la vora d'aquest cercle? (π = 3,14)`, visual: () => geCercleFig(r, { mostra: d ? 'd' : 'r', tema, txt: geU(d ? 2 * r : r, 'cm') }), pista: PISTA_GE5,
    ...apartats([gePiNum('Longitud =', p => 2 * p * r, 'cm', [[3.14 * r, 'gDiam'], [4 * 3.14 * r, 'gDiam'], [3.14 * r * r, 'gArea']])]),
    explicacio: `2 · 3,14 · ${r} = ${geF(2 * 3.14 * r)} cm.`, solucio: [...(d ? [`Radi = ${2 * r} ÷ 2 = ${r} cm`] : []), `L = 2 · π · r`, `2 · 3,14 · ${r} = <b>${geF(2 * 3.14 * r)} cm</b>`] };
};
GE5.area = nv => {
  const r = geR(2, 15), d = nv > 1 && Math.random() < .5; const tema = tria(['pizza', 'plat', 'sol']);
  return { sig: `ar-${r}-${d}`, enunciat: `Quina és l'<b>àrea</b> d'aquest cercle? (π = 3,14)`, visual: () => geCercleFig(r, { mostra: d ? 'd' : 'r', tema, txt: geU(d ? 2 * r : r, 'cm') }), pista: PISTA_GE5,
    ...apartats([gePiNum('Àrea =', p => p * r * r, 'cm²', [[3.14 * 4 * r * r, 'gDiam'], [2 * 3.14 * r, 'gPerim'], [3.14 * r, 'gQuad'], [3.14 * 2 * r, 'gQuad']])]),
    explicacio: `3,14 · ${r} · ${r} = ${geF(3.14 * r * r)} cm².`, solucio: [...(d ? [`Radi = ${2 * r} ÷ 2 = ${r} cm`] : []), `A = π · r · r`, `3,14 · ${r} · ${r} = <b>${geF(3.14 * r * r)} cm²</b>`] };
};
GE5.roda = nv => {
  const r = geR(25, 40), v = tria([10, 20, 50, 100]);
  const L = 2 * 3.14 * r;
  const its = [gePiNum('En una volta, quants cm avança?', p => 2 * p * r, 'cm', [[3.14 * r, 'gDiam'], [3.14 * r * r, 'gArea']])];
  its.push(nv === 1 ? gePiNum(`I en ${v} voltes? (cm)`, p => 2 * p * r * v, 'cm') : gePiNum(`I en ${v} voltes? (en <b>metres</b>)`, p => 2 * p * r * v / 100, 'm', [[L * v, 'gUnitat']]));
  return { sig: `ro-${r}-${v}`, enunciat: `La roda d'una bicicleta té un radi de <b>${r} cm</b>. Cada volta, la bici avança la longitud de la roda. (π = 3,14)`, visual: () => `${geCercleFig(r, { mostra: 'r', tema: 'roda' })}${geRepte('En Coma pedala… quants metres farà?')}`, pista: PISTA_GE5, ...apartats(its),
    explicacio: `Una volta: ${geF(L)} cm.`, solucio: [`1 volta: 2 · 3,14 · ${r} = ${geF(L)} cm`, `${v} voltes: ${geF(L)} · ${v} = ${geF(L * v)} cm${nv > 1 ? ` = <b>${geF(L * v / 100)} m</b>` : ''}`] };
};
GE5.pizza = nv => {
  if (nv === 1) { const d = tria([20, 26, 30, 40]);
    return { sig: `pz-${d}`, enunciat: `Una pizza fa <b>${d} cm</b> de diàmetre. Quina és la seva àrea? (π = 3,14)`, visual: () => geCercleFig(d / 2, { mostra: 'd', tema: 'pizza', txt: `${d} cm` }), pista: PISTA_GE5,
      ...apartats([gePiNum('Àrea =', p => p * (d / 2) ** 2, 'cm²', [[3.14 * d * d, 'gDiam'], [3.14 * d, 'gPerim']])]), explicacio: `Radi ${d / 2} cm.`, solucio: [`Radi = ${d} ÷ 2 = ${d / 2} cm`, `3,14 · ${d / 2} · ${d / 2} = <b>${geF(3.14 * (d / 2) ** 2)} cm²</b>`] }; }
  for (;;) { const d1 = tria([24, 28, 30]), d2 = tria([36, 40, 44]), p1 = tria([6, 7, 8, 9]), p2 = tria([11, 12, 13, 14, 15, 16]);
    const r1 = p1 / (3.14 * (d1 / 2) ** 2), r2 = p2 / (3.14 * (d2 / 2) ** 2); if (Math.abs(r1 - r2) / Math.min(r1, r2) < .08) continue;
    const bo = r1 < r2 ? 'A' : 'B';
    return { sig: `pc-${d1}-${d2}-${p1}-${p2}`, enunciat: `Dues pizzes: <b>A</b> de ${d1} cm de diàmetre a ${p1} € i <b>B</b> de ${d2} cm a ${p2} €. Quina surt més a compte (menys euros per cm²)?`, visual: () => `<div class="ge-dues"><div>A · ${d1} cm · ${p1} €${geCercleFig(d1 / 2, { mostra: 'd', tema: 'pizza', txt: `${d1} cm`, R: 118 * d1 / d2 })}</div><div>B · ${d2} cm · ${p2} €${geCercleFig(d2 / 2, { mostra: 'd', tema: 'pizza', txt: `${d2} cm`, R: 118 })}</div></div>`,
      pista: { completa: `Calcula l'àrea de cada pizza i divideix el preu entre l'àrea: la que doni menys euros per cm² surt més a compte.`, mitja: 'Preu ÷ àrea.' },
      ...apartats([gePiNum('Àrea de la pizza A =', p => p * (d1 / 2) ** 2, 'cm²', [[3.14 * d1 * d1, 'gDiam']]), { tipus: 'tria', html: 'Surt més a compte la…', opcions: [{ html: '<b>A</b>', val: 'A' }, { html: '<b>B</b>', val: 'B' }], correcta: bo, etiq: {} }]),
      explicacio: `A: ${geF(r1 * 100)} cèntims per cm² · B: ${geF(r2 * 100)}.`, solucio: [`A: àrea ${geF(3.14 * (d1 / 2) ** 2)} cm²; ${p1} ÷ ${geF(3.14 * (d1 / 2) ** 2)} = ${geF(r1 * 100)} cèntims per cm²`, `B: àrea ${geF(3.14 * (d2 / 2) ** 2)} cm²; ${p2} ÷ ${geF(3.14 * (d2 / 2) ** 2)} = ${geF(r2 * 100)} cèntims per cm²`, `Surt més a compte la <b>${bo}</b>.`] }; }
};
GE5.inversa = nv => {
  const r = geR(3, 20), L = geRo(2 * 3.14 * r);
  return { sig: `iv-${r}`, enunciat: `La vora d'una taula rodona fa <b>${geF(L)} cm</b>. Quant fa el radi? (π = 3,14)`, visual: () => geCercleFig(r, { mostra: 'r', tema: 'plat', txt: '?' }), pista: { completa: `L = 2 · 3,14 · r. Per trobar r, divideix la longitud entre 2 · 3,14 = 6,28.`, mitja: 'Divideix entre 6,28.' },
    ...apartats([geNum('Radi =', r, 'cm', [[2 * r, 'gDiam'], [L / 3.14, 'gDiam']], .06)]), explicacio: `${geF(L)} ÷ 6,28 = ${r}.`, solucio: [`2 · 3,14 = 6,28`, `${geF(L)} ÷ 6,28 = <b>${r} cm</b>`] };
};
TEMES.g5 = {
  gen: GE5,
  sequencia: { 1: [['longitud'], ['area'], ['roda'], ['area'], ['longitud'], ['pizza'], ['area'], ['roda']], 2: [['longitud'], ['area'], ['roda'], ['pizza'], ['longitud'], ['area'], ['pizza'], ['roda']], 3: [['area'], ['longitud'], ['inversa'], ['pizza'], ['roda'], ['area'], ['inversa'], ['pizza']] },
  explicacio: [
    { text: `<p>Si «desenrotlles» la vora d'un cercle, fa una mica més de <b class="parpelleja">3 diàmetres</b>: 3,14 vegades. Aquest número és <b>π</b> (pi).</p><p class="petit">Longitud = π · diàmetre = <b>2 · π · r</b>.</p>`, vis: () => `${geCercleFig(5, { mostra: 'd', tema: 'roda', txt: 'd' })}${geRepte('π ≈ 3,14', 'robot')}` },
    { text: `<p>L'<b>àrea</b> del cercle és <b class="parpelleja">π · r · r</b> (π · r²).</p><p class="petit">Pizza de radi 10 cm: 3,14 · 10 · 10 = 314 cm².</p>`, vis: () => geCercleFig(10, { mostra: 'r', tema: 'pizza' }) },
    { text: `<p>Compte amb el <b>diàmetre</b>: si te'l donen, primer divideix entre 2 per tenir el radi.</p><p class="petit">I amb la calculadora pots fer servir la tecla π: també val!</p>`, vis: () => `${geCercleFig(15, { mostra: 'd', tema: 'plat', txt: '30 cm' })}${geRepte('Meu! d = 30 → r = 15')}` }
  ],
  exemple: nv => ({ enunciat: `Àrea d'un plat de 20 cm de diàmetre.`, passos: [
    { text: `Radi = 20 ÷ 2 = 10 cm`, vis: geCercleFig(10, { mostra: 'd', tema: 'plat', txt: '20 cm' }) },
    { text: `A = 3,14 · 10 · 10<br>= <b>314 cm²</b> <span class="marca-ok">✓</span>`, vis: geCercleFig(10, { mostra: 'r', tema: 'plat' }) }] })
};

/* =====================================================================
   OBJECTIU 6 · FIGURES COMPOSTES
   ===================================================================== */
function geCompSvg(polys, { w, h, cotes = [], extra = '', u = 'm' }) { // polys en unitats: [{pts, col, dash}], cotes: [[x1,y1,x2,y2,txt,d]]
  const k = geEsc(GE_W, GE_H, w, h, 50), ox = (GE_W - w * k) / 2, oy = (GE_H + h * k) / 2, P = ([x, y]) => [ox + x * k, oy - y * k];
  let s = '';
  for (const p of polys) { if (p.cercle) { const [cx, cy] = P(p.c); s += p.mig ? `<path d="M${cx - p.r * k} ${cy}A${p.r * k} ${p.r * k} 0 0 1 ${cx + p.r * k} ${cy}Z" fill="${p.col[1]}" stroke="${p.col[0]}" stroke-width="3.5"/>` : `<circle cx="${cx}" cy="${cy}" r="${p.r * k}" fill="${p.col[1]}" stroke="${p.col[0]}" stroke-width="3.5"/>`; continue; }
    s += gePoli(p.pts.map(P), p.col, p.dash ? `stroke-dasharray="${p.dash}"` : ''); }
  for (const [x1, y1, x2, y2, t, d] of cotes) { const a = P([x1, y1]), b = P([x2, y2]); s += geCota(a[0], a[1], b[0], b[1], t, { d: d ?? 20 }); }
  return geSvg(GE_W, GE_H, s + (typeof extra === 'function' ? extra(P, k) : extra));
}
const PISTA_GE6 = { completa: `<b>Descompon</b> la figura en figures que coneguis (rectangles, triangles, mig cercle…). Calcula l'àrea de cada tros i <b>suma-les</b>. Si hi ha un forat, <b>resta'l</b>.`, mitja: 'Trosseja la figura i suma (o resta) les àrees.' };
const GE6 = {};
GE6.L = nv => {
  const W = geR(6, 10), H = geR(5, 8), w2 = geR(2, W - 3), h2 = geR(2, H - 3), A = W * H - w2 * h2;
  const pts = [[0, 0], [W, 0], [W, H - h2], [W - w2, H - h2], [W - w2, H], [0, H]];
  const perim = nv > 1 && Math.random() < .5;
  return { sig: `ll-${W}-${H}-${w2}-${h2}-${perim}`, enunciat: `Aquesta habitació té forma de <b>L</b>. ${perim ? 'Quin és el seu <b>perímetre</b>?' : 'Quina és la seva <b>àrea</b>?'}`,
    visual: (c) => geCompSvg([{ pts, col: ['#7c5cd6', '#e3dbff'] }], { w: W, h: H, cotes: [[0, 0, W, 0, `${W} m`], [W, 0, W, H - h2, `${H - h2} m`], [W - w2, H, 0, H, `${W - w2} m`], [0, H, 0, 0, `${H} m`]], extra: c && !perim ? (P) => { const a = P([W - w2, 0]), b = P([W - w2, H - h2]); return `<path d="M${a[0]} ${a[1]}L${b[0]} ${b[1]}" stroke="#e0457b" stroke-width="3" stroke-dasharray="7 5"/>`; } : '' }),
    pista: perim ? { completa: `Suma tots els costats. Els dos que no tenen número: el de dalt a la dreta fa ${W} − ${W - w2} = ${w2} m i el vertical del mig, ${H} − ${H - h2} = ${h2} m.`, mitja: 'Troba els costats que falten i suma-ho tot.' } : PISTA_GE6,
    ...apartats([perim ? geNum('Perímetre =', 2 * (W + H), 'm', [[A, 'gArea'], [2 * (W + H) - w2 - h2, 'gPerim']]) : geNum('Àrea =', A, 'm²', [[W * H, 'gPerim'], [2 * (W + H), 'gPerim']])]),
    explicacio: perim ? `Els costats que falten fan ${w2} i ${h2} m.` : `Dos rectangles: ${W - w2} × ${H} i ${w2} × ${H - h2}.`,
    solucio: perim ? [`Costats que falten: ${w2} m i ${h2} m`, `${W} + ${H - h2} + ${w2} + ${h2} + ${W - w2} + ${H}`, `= <b>${2 * (W + H)} m</b>`] : [`Rectangle esquerre: ${W - w2} × ${H} = ${(W - w2) * H} m²`, `Rectangle dret: ${w2} × ${H - h2} = ${w2 * (H - h2)} m²`, `${(W - w2) * H} + ${w2 * (H - h2)} = <b>${A} m²</b>`] };
};
GE6.casa = nv => {
  const b = geR(4, 9), h = geR(3, 6), t = geR(2, 4); if ((b * t) % 2 && nv === 1) return GE6.casa(nv); const A = b * h + b * t / 2;
  return { sig: `ca-${b}-${h}-${t}`, enunciat: `Quina és l'<b>àrea</b> de la façana d'aquesta caseta (rectangle + teulada triangular)?`,
    visual: () => geCompSvg([{ pts: [[0, 0], [b, 0], [b, h], [0, h]], col: ['#d39a00', '#fff1b8'] }, { pts: [[0, h], [b, h], [b / 2, h + t]], col: ['#e0457b', '#ffd6e4'] }], { w: b, h: h + t, cotes: [[0, 0, b, 0, `${b} m`], [b, 0, b, h, `${h} m`]], extra: (P) => { const a = P([b / 2, h]), c = P([b / 2, h + t]); return `<path d="M${a[0]} ${a[1]}L${c[0]} ${c[1]}" stroke="#7c5cd6" stroke-width="2.6" stroke-dasharray="7 5"/>` + geTx(a[0] + 8, (a[1] + c[1]) / 2 + 5, `${t} m`, { anc: 'start', col: '#7c5cd6', fons: true }) + `<rect x="${P([b / 2 - .5, 0])[0]}" y="${P([0, 2])[1]}" width="${P([1, 0])[0] - P([0, 0])[0]}" height="${P([0, 0])[1] - P([0, 2])[1]}" fill="#b86f1d" stroke="${GE_N}" stroke-width="2"/>`; } }),
    pista: PISTA_GE6, ...apartats([geNum('Àrea =', A, 'm²', [[b * h + b * t, 'gMeitat'], [b * (h + t), 'gMeitat']])]),
    explicacio: `Rectangle ${b * h} + triangle ${geF(b * t / 2)}.`, solucio: [`Rectangle: ${b} × ${h} = ${b * h} m²`, `Triangle: ${b} × ${t} ÷ 2 = ${geF(b * t / 2)} m²`, `${b * h} + ${geF(b * t / 2)} = <b>${geF(A)} m²</b>`] };
};
GE6.finestra = nv => {
  const b = tria([2, 4, 6]) * (nv === 1 ? 1 : 1), h = geR(2, 5), r = b / 2;
  return { sig: `fi-${b}-${h}`, enunciat: `Una finestra té forma de rectangle amb <b>mig cercle</b> a dalt. Quina és la seva àrea? (π = 3,14)`,
    visual: () => geCompSvg([{ pts: [[0, 0], [b, 0], [b, h], [0, h]], col: ['#2f6fd1', '#cfe2ff'] }, { cercle: true, mig: true, c: [b / 2, h], r, col: ['#0f9fb0', '#c8f1f5'] }], { w: b, h: h + r, cotes: [[0, 0, b, 0, `${b} m`], [b, 0, b, h, `${h} m`]] }),
    pista: { completa: `Rectangle: base × altura. Mig cercle: π · r · r ÷ 2, amb r = ${b} ÷ 2 = ${r}. Després suma.`, mitja: 'Rectangle + mig cercle.' },
    ...apartats([gePiNum('Àrea =', p => b * h + p * r * r / 2, 'm²', [[b * h + 3.14 * r * r, 'gMeitat'], [b * h + 3.14 * b * b / 2, 'gDiam']])]),
    explicacio: `${b * h} + ${geF(3.14 * r * r / 2)} m².`, solucio: [`Rectangle: ${b} × ${h} = ${b * h} m²`, `Mig cercle: 3,14 · ${r} · ${r} ÷ 2 = ${geF(3.14 * r * r / 2)} m²`, `${b * h} + ${geF(3.14 * r * r / 2)} = <b>${geF(b * h + 3.14 * r * r / 2)} m²</b>`] };
};
GE6.forat = nv => {
  const B = geR(8, 14), H = geR(6, 10);
  if (nv === 3 && Math.random() < .6) { const r = geR(1, Math.min(3, Math.floor(H / 2) - 1));
    return { sig: `fc-${B}-${H}-${r}`, enunciat: `Un jardí rectangular té una <b>bassa rodona</b> al mig. Quina àrea queda de gespa? (π = 3,14)`,
      visual: () => geCompSvg([{ pts: [[0, 0], [B, 0], [B, H], [0, H]], col: ['#1d9a5a', '#c9f0d8'] }, { cercle: true, c: [B / 2, H / 2], r, col: ['#2f6fd1', '#9cc9f2'] }], { w: B, h: H, cotes: [[0, 0, B, 0, `${B} m`], [B, 0, B, H, `${H} m`]], extra: (P, k) => { const c = P([B / 2, H / 2]); return `<path d="M${c[0]} ${c[1]}h${r * k}" stroke="${GE_N}" stroke-width="2.5"/>` + geTx(c[0] + r * k / 2, c[1] - 8, `${r} m`, { fons: true }); } }),
      pista: PISTA_GE6, ...apartats([gePiNum('Gespa =', p => B * H - p * r * r, 'm²', [[B * H + 3.14 * r * r, 'gSuma'], [B * H, 'gArea']])]),
      explicacio: `Jardí menys bassa.`, solucio: [`Jardí: ${B} × ${H} = ${B * H} m²`, `Bassa: 3,14 · ${r} · ${r} = ${geF(3.14 * r * r)} m²`, `${B * H} − ${geF(3.14 * r * r)} = <b>${geF(B * H - 3.14 * r * r)} m²</b>`] }; }
  const p = geR(2, B - 4), q = geR(2, H - 3);
  return { sig: `fr-${B}-${H}-${p}-${q}`, enunciat: `Un jardí rectangular té una <b>piscina</b> rectangular al mig. Quina àrea queda de gespa?`,
    visual: () => geCompSvg([{ pts: [[0, 0], [B, 0], [B, H], [0, H]], col: ['#1d9a5a', '#c9f0d8'] }, { pts: [[(B - p) / 2, (H - q) / 2], [(B + p) / 2, (H - q) / 2], [(B + p) / 2, (H + q) / 2], [(B - p) / 2, (H + q) / 2]], col: ['#2f6fd1', '#9cc9f2'] }], { w: B, h: H, cotes: [[0, 0, B, 0, `${B} m`], [B, 0, B, H, `${H} m`], [(B - p) / 2, (H - q) / 2, (B + p) / 2, (H - q) / 2, `${p} m`, -16], [(B + p) / 2, (H - q) / 2, (B + p) / 2, (H + q) / 2, `${q} m`, -16]] }),
    pista: PISTA_GE6, ...apartats([geNum('Gespa =', B * H - p * q, 'm²', [[B * H + p * q, 'gSuma'], [B * H, 'gArea']])]),
    explicacio: `Jardí menys piscina.`, solucio: [`Jardí: ${B} × ${H} = ${B * H} m²`, `Piscina: ${p} × ${q} = ${p * q} m²`, `${B * H} − ${p * q} = <b>${B * H - p * q} m²</b>`] };
};
GE6.pinta = nv => {
  const b = geR(4, 8), h = tria([2.5, 3]), pot = tria([5, 6, 8]); const A = b * h - 2;
  return { sig: `pi-${b}-${h}-${pot}`, enunciat: `Pintarem aquesta paret, que té una <b>porta de 1 m × 2 m</b>. Cada pot cobreix <b>${pot} m²</b>.`,
    visual: () => geCompSvg([{ pts: [[0, 0], [b, 0], [b, h], [0, h]], col: ['#e0457b', '#ffd6e4'] }, { pts: [[1, 0], [2, 0], [2, 2], [1, 2]], col: ['#b86f1d', '#e8c79a'] }], { w: b, h, cotes: [[0, 0, b, 0, `${b} m`], [b, 0, b, h, `${geF(h)} m`]] }),
    pista: { completa: `Àrea de la paret menys la porta. Després divideix entre ${pot} i, si no dona exacte, arrodoneix <b>cap amunt</b>: els pots es compren sencers.`, mitja: 'Paret − porta, i arrodoneix els pots cap amunt.' },
    ...apartats([geNum('Àrea per pintar =', A, 'm²', [[b * h, 'gArea']]), geNum('Pots que cal comprar =', Math.ceil(A / pot - 1e-9), 'pots', [[Math.floor(A / pot), 'gArea']])]),
    explicacio: `${geF(A)} ÷ ${pot} = ${geF(A / pot)} → ${Math.ceil(A / pot - 1e-9)} pots.`, solucio: [`Paret: ${b} × ${geF(h)} = ${geF(b * h)} m²`, `Sense la porta: ${geF(b * h)} − 2 = ${geF(A)} m²`, `${geF(A)} ÷ ${pot} = ${geF(A / pot)}`, `Cal comprar <b>${Math.ceil(A / pot - 1e-9)} pots</b>`] };
};
TEMES.g6 = {
  gen: GE6,
  sequencia: { 1: [['L'], ['casa'], ['forat'], ['L'], ['casa'], ['forat'], ['L'], ['casa']], 2: [['L'], ['casa'], ['forat'], ['finestra'], ['L'], ['casa'], ['forat'], ['finestra']], 3: [['L'], ['finestra'], ['forat'], ['pinta'], ['casa'], ['forat'], ['finestra'], ['pinta']] },
  explicacio: [
    { text: `<p>Una figura <b>composta</b> està feta de figures que ja coneixem.</p><p class="petit">Aquesta L són <b class="parpelleja">dos rectangles</b>: calcula'ls per separat i suma.</p>`, vis: () => geCompSvg([{ pts: [[0, 0], [4, 0], [4, 6], [0, 6]], col: ['#7c5cd6', '#e3dbff'] }, { pts: [[4, 0], [8, 0], [8, 3], [4, 3]], col: ['#e0457b', '#ffd6e4'] }], { w: 8, h: 6, cotes: [[0, 0, 8, 0, '8 m'], [0, 6, 0, 0, '6 m', 20]] }) },
    { text: `<p>Si hi ha un <b>forat</b> (una piscina, una porta…), calcula el gran i <b class="parpelleja">resta</b> el forat.</p><p class="petit">Gespa = jardí − piscina.</p>`, vis: () => `${geCompSvg([{ pts: [[0, 0], [10, 0], [10, 6], [0, 6]], col: ['#1d9a5a', '#c9f0d8'] }, { pts: [[3, 2], [7, 2], [7, 4], [3, 4]], col: ['#2f6fd1', '#9cc9f2'] }], { w: 10, h: 6 })}${geRepte('En Coma no es vol mullar: només gespa!')}` }
  ],
  exemple: nv => ({ enunciat: `Àrea de la caseta: rectangle 6 × 4 m i teulada de 2 m d'alt.`, passos: [
    { text: `Rectangle: 6 × 4 = 24 m²`, vis: geCompSvg([{ pts: [[0, 0], [6, 0], [6, 4], [0, 4]], col: ['#d39a00', '#fff1b8'] }, { pts: [[0, 4], [6, 4], [3, 6]], col: ['#e0457b', '#ffd6e4'] }], { w: 6, h: 6, cotes: [[0, 0, 6, 0, '6 m'], [6, 0, 6, 4, '4 m']] }) },
    { text: `Triangle: 6 × 2 ÷ 2 = 6 m²<br>24 + 6 = <b>30 m²</b> <span class="marca-ok">✓</span>`, vis: geCompSvg([{ pts: [[0, 0], [6, 0], [6, 4], [0, 4]], col: ['#d39a00', '#fff1b8'] }, { pts: [[0, 4], [6, 4], [3, 6]], col: ['#e0457b', '#ffd6e4'] }], { w: 6, h: 6 }) }] })
};

/* =====================================================================
   OBJECTIU 7 · EL TEOREMA DE PITÀGORES
   ===================================================================== */
const GE_TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [7, 24, 25], [15, 20, 25], [10, 24, 26], [20, 21, 29]];
function geTriRect(a, b, { quadrats = false, labs = [`${a}`, `${b}`, '?'], u = 'cm', area = null } = {}) { // a: catet horitzontal, b: vertical
  // amb quadrats: la figura ocupa x de −b fins a a+b i y de −a fins a a+b (unitats, y cap amunt)
  const k = quadrats ? Math.min((GE_W - 30) / (a + 2 * b), (GE_H - 24) / (2 * a + b)) : geEsc(GE_W, GE_H, a, b, 56);
  const ox = quadrats ? (GE_W - (a + 2 * b) * k) / 2 + b * k : (GE_W - a * k) / 2, oy = quadrats ? (GE_H - (2 * a + b) * k) / 2 + (a + b) * k : (GE_H + b * k) / 2;
  const T = ([x, y]) => [ox + x * k, oy - y * k];
  const A = T([0, 0]), B = T([a, 0]), C = T([0, b]);
  let s = '';
  if (quadrats) {
    const sq = (pts, col, t) => { const P = pts.map(T); const cx = P.reduce((m, p) => m + p[0], 0) / 4, cy = P.reduce((m, p) => m + p[1], 0) / 4; return gePoli(P, col) + geTx(cx, cy + 6, t, { mida: 17 }); };
    s += sq([[0, 0], [a, 0], [a, -a], [0, -a]], ['#2f6fd1', '#cfe2ffcc'], area ? area[0] : `${a * a}`)
      + sq([[0, 0], [0, b], [-b, b], [-b, 0]], ['#1d9a5a', '#c9f0d8cc'], area ? area[1] : `${b * b}`)
      + sq([[a, 0], [0, b], [b, a + b], [a + b, a]], ['#e0457b', '#ffd6e4cc'], area ? area[2] : '?');
  }
  s += gePoli([A, B, C], ['#f47b20', '#ffd9b8']) + geRecte(A[0], A[1], 1, -1, 13);
  if (!quadrats) s += geTx((A[0] + B[0]) / 2, A[1] + 24, labs[0] + (labs[0] !== '?' && u ? ` ${u}` : ''), { fons: true, mida: 17, col: '#2f6fd1' }) + geTx(A[0] - 12, (A[1] + C[1]) / 2 + 5, labs[1] + (labs[1] !== '?' && u ? ` ${u}` : ''), { anc: 'end', fons: true, mida: 17, col: '#1d9a5a' }) + geTx((B[0] + C[0]) / 2 + 12, (B[1] + C[1]) / 2 - 6, labs[2] + (labs[2] !== '?' && u ? ` ${u}` : ''), { anc: 'start', fons: true, mida: 17, col: '#e0457b' });
  return geSvg(GE_W, GE_H, s);
}
const PISTA_GE7 = { completa: `Al triangle <b>rectangle</b>: hipotenusa² = catet² + catet². Per trobar la <b>hipotenusa</b>: eleva els catets al quadrat, <b>suma'ls</b> i fes l'<b>arrel</b>. Per trobar un <b>catet</b>: hipotenusa² <b>menys</b> l'altre catet², i arrel.`, mitja: 'c² = a² + b², i després l\'arrel.' };
const geTriple = nv => { const t = tria(nv === 1 ? GE_TRIPLES.slice(0, 4) : GE_TRIPLES); return Math.random() < .5 ? t : [t[1], t[0], t[2]]; };
const GE7 = {};
GE7.quadrats = nv => {
  const [a, b, c] = tria(GE_TRIPLES.slice(0, nv === 1 ? 2 : 4));
  return { sig: `qu-${a}-${b}`, enunciat: `Sobre cada costat del triangle rectangle hi ha un <b>quadrat</b>. Els números són les seves àrees (cm²).`, visual: () => geTriRect(a, b, { quadrats: true }), pista: { completa: `El quadrat gran (sobre la hipotenusa) té la mateixa àrea que els dos petits junts. El costat d'un quadrat és l'arrel de la seva àrea.`, mitja: 'Gran = petit + petit.' },
    ...apartats([geNum('Àrea del quadrat gran =', c * c, 'cm²', [[a + b, 'gSumaCat']]), geNum('Costat del quadrat gran (la hipotenusa) =', c, 'cm', [[c * c, 'gArrel'], [a + b, 'gSumaCat']])]),
    explicacio: `${a * a} + ${b * b} = ${c * c}, i √${c * c} = ${c}.`, solucio: [`${a * a} + ${b * b} = <b>${c * c} cm²</b>`, `√${c * c} = <b>${c} cm</b>`] };
};
GE7.hipotenusa = nv => {
  let a, b, c, tol = 0;
  if (nv === 3 && Math.random() < .6) { a = geR(2, 12); b = geR(2, 12); c = geRo(Math.round(Math.hypot(a, b) * 10) / 10); if (Number.isInteger(Math.hypot(a, b))) return GE7.hipotenusa(nv); tol = .06; } else [a, b, c] = geTriple(nv);
  return { sig: `hi-${a}-${b}`, enunciat: `Quant fa la <b>hipotenusa</b> d'aquest triangle rectangle?${tol ? ' Arrodoneix a les dècimes.' : ''}`, visual: () => geTriRect(a, b, {}), pista: PISTA_GE7,
    ...apartats([geNum('Hipotenusa =', c, 'cm', [[a + b, 'gSumaCat'], [a * a + b * b, 'gArrel']], tol)]),
    explicacio: `√(${a}² + ${b}²) = ${geF(c)}.`, solucio: [`${a}² + ${b}² = ${a * a} + ${b * b}`, `= ${a * a + b * b}`, `√${a * a + b * b} = <b>${geF(c)} cm</b>`] };
};
GE7.catet = nv => {
  const [a, b, c] = geTriple(nv);
  return { sig: `cc-${a}-${b}`, enunciat: `Quant fa el <b>catet</b> que falta?`, visual: () => geTriRect(a, b, { labs: [`${a}`, '?', `${c}`] }), pista: PISTA_GE7,
    ...apartats([geNum('Catet =', b, 'cm', [[geRo(Math.round(Math.hypot(a, c) * 10) / 10), 'gRestaCat'], [c - a, 'gSumaCat'], [c * c - a * a, 'gArrel']], 0)]),
    explicacio: `√(${c}² − ${a}²) = ${b}.`, solucio: [`${c}² − ${a}² = ${c * c} − ${a * a}`, `= ${c * c - a * a}`, `√${c * c - a * a} = <b>${b} cm</b>`] };
};
function geEscalaSvg(a, b, { labs }) { // escala recolzada: a = distància a la paret (terra), b = altura a la paret
  const k = Math.min((GE_W - 120) / a, (GE_H - 110) / b), ox = (GE_W - a * k) / 2 + 30, oy = GE_H - 48;
  let s = `<rect x="0" y="${oy}" width="${GE_W}" height="48" fill="#e8dcc4"/><path d="M0 ${oy}H${GE_W}" stroke="#8a7a63" stroke-width="3"/><rect x="${ox - 26}" y="${oy - b * k - 30}" width="26" height="${b * k + 30}" fill="#d9d2c5" stroke="${GE_N}" stroke-width="2"/>`;
  const P = [ox + a * k, oy], Q = [ox, oy - b * k];
  s += `<path d="M${P[0]} ${P[1]}L${Q[0]} ${Q[1]}" stroke="#b86f1d" stroke-width="9" stroke-linecap="round"/>`;
  for (let i = 1; i < 8; i++) { const x = P[0] + (Q[0] - P[0]) * i / 8, y = P[1] + (Q[1] - P[1]) * i / 8; s += `<path d="M${x - 9} ${y - 3}l18 6" stroke="#8a4f12" stroke-width="4"/>`; }
  s += geCota(ox, oy, ox + a * k, oy, labs[0], { d: 18 }) + geTx(ox - 34, oy - b * k / 2, labs[1], { anc: 'end', fons: true, mida: 16 }) + geTx((P[0] + Q[0]) / 2 + 16, (P[1] + Q[1]) / 2 - 8, labs[2], { anc: 'start', fons: true, mida: 16, col: '#b86f1d' });
  s += gatComa(44).replace('<svg ', `<svg x="${Q[0] + 2}" y="${Q[1] - 40}" `);
  return geSvg(GE_W, GE_H, s);
}
GE7.escala = nv => {
  const [x, y, z] = tria([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15]]); const sc = nv === 1 ? 1 : .5; const a = Math.min(x, y) * sc, b = Math.max(x, y) * sc, c = z * sc;
  const busca = nv === 1 ? 'c' : tria(['c', 'b']);
  return { sig: `es-${a}-${b}-${busca}`, enunciat: busca === 'c' ? `En Coma vol pujar a la paret. L'escala està a <b>${geF(a)} m</b> de la paret i arriba a <b>${geF(b)} m</b> d'altura. Quant fa l'escala?` : `Una escala de <b>${geF(c)} m</b> està recolzada a la paret, amb el peu a <b>${geF(a)} m</b> de la paret. A quina altura arriba?`,
    visual: () => geEscalaSvg(a, b, { labs: [`${geF(a)} m`, busca === 'b' ? '?' : `${geF(b)} m`, busca === 'c' ? '?' : `${geF(c)} m`] }), pista: PISTA_GE7,
    ...apartats([busca === 'c' ? geNum('Escala =', c, 'm', [[a + b, 'gSumaCat'], [a * a + b * b, 'gArrel']]) : geNum('Altura =', b, 'm', [[geRo(Math.round(Math.hypot(a, c) * 100) / 100), 'gRestaCat'], [c * c - a * a, 'gArrel']])]),
    explicacio: busca === 'c' ? `L'escala és la hipotenusa.` : `L'altura és un catet.`, solucio: busca === 'c' ? [`${geF(a)}² + ${geF(b)}² = ${geF(a * a)} + ${geF(b * b)}`, `= ${geF(a * a + b * b)}`, `√${geF(a * a + b * b)} = <b>${geF(c)} m</b>`] : [`${geF(c)}² − ${geF(a)}² = ${geF(c * c)} − ${geF(a * a)}`, `= ${geF(c * c - a * a)}`, `√${geF(c * c - a * a)} = <b>${geF(b)} m</b>`] };
};
GE7.pantalla = nv => {
  const [w, h, d] = tria([[80, 60, 100], [64, 48, 80], [40, 30, 50], [96, 72, 120], [120, 90, 150]]);
  const vis = () => { const k = 2.6 * (100 / d), W = w * k, H = h * k, x = (GE_W - W) / 2, y = (GE_H - H) / 2 - 6; return geSvg(GE_W, GE_H, `<rect x="${x - 8}" y="${y - 8}" width="${W + 16}" height="${H + 16}" rx="8" fill="#1b1b1b"/><rect x="${x}" y="${y}" width="${W}" height="${H}" fill="#2f6fd1"/><circle cx="${x + W * .3}" cy="${y + H * .35}" r="${H * .18}" fill="#ffd84d"/><path d="M${x} ${y + H}L${x + W * .35} ${y + H * .55}L${x + W * .6} ${y + H}Z" fill="#1d9a5a"/><path d="M${x + W * .4} ${y + H}L${x + W * .7} ${y + H * .45}L${x + W} ${y + H}Z" fill="#0f9fb0"/><path d="M${x} ${y + H}L${x + W} ${y}" stroke="#fff" stroke-width="3" stroke-dasharray="8 6"/>${geTx(x + W / 2 + 14, y + H / 2 - 8, '?', { col: '#fff', mida: 22 })}<rect x="${GE_W / 2 - 30}" y="${y + H + 8}" width="60" height="10" fill="#1b1b1b"/>${geCota(x - 8, y + H + 8, x + W + 8, y + H + 8, `${w} cm`, { d: 22 })}${geTx(x + W + 18, y + H / 2, `${h} cm`, { anc: 'start', fons: true })}`); };
  return { sig: `pn-${w}`, enunciat: `Les pantalles es mesuren per la <b>diagonal</b>. Aquesta fa <b>${w} cm</b> d'ample i <b>${h} cm</b> d'alt. Quant fa la diagonal?`, visual: vis, pista: PISTA_GE7,
    ...apartats([geNum('Diagonal =', d, 'cm', [[w + h, 'gSumaCat'], [w * w + h * h, 'gArrel']])]), explicacio: `√(${w}² + ${h}²) = ${d} cm.`, solucio: [`${w}² + ${h}² = ${w * w} + ${h * h}`, `= ${w * w + h * h}`, `√${w * w + h * h} = <b>${d} cm</b>`] };
};
GE7.esRecte = nv => {
  const si = Math.random() < .5; let [a, b, c] = tria(GE_TRIPLES); if (!si) c = c + tria([-1, 1, 2]);
  return { sig: `er-${a}-${b}-${c}`, enunciat: `Un triangle té costats de <b>${a}</b>, <b>${b}</b> i <b>${c} cm</b>. És un triangle <b>rectangle</b>?`, visual: () => geTriRect(a, b, { labs: [`${a}`, `${b}`, `${c}`] }), pista: { completa: `Comprova si el costat gran al quadrat és igual a la suma dels altres dos al quadrat.`, mitja: `${c}² = ${a}² + ${b}²?` },
    ...apartats([geNum(`${a}² + ${b}² =`, a * a + b * b, ''), { tipus: 'tria', html: 'És rectangle?', opcions: [{ html: 'Sí', val: 's' }, { html: 'No', val: 'n' }], correcta: a * a + b * b === c * c ? 's' : 'n', etiq: {} }]),
    explicacio: `${a * a + b * b} ${a * a + b * b === c * c ? '=' : '≠'} ${c * c}.`, solucio: [`${a}² + ${b}² = ${a * a + b * b}`, `${c}² = ${c * c}`, a * a + b * b === c * c ? `Són iguals: <b>sí</b> és rectangle.` : `No són iguals: <b>no</b> és rectangle.`] };
};
TEMES.g7 = {
  gen: GE7,
  sequencia: { 1: [['quadrats'], ['hipotenusa'], ['escala'], ['quadrats'], ['hipotenusa'], ['pantalla'], ['escala'], ['hipotenusa']], 2: [['quadrats'], ['hipotenusa'], ['catet'], ['escala'], ['pantalla'], ['catet'], ['hipotenusa'], ['escala']], 3: [['hipotenusa'], ['catet'], ['escala'], ['esRecte'], ['pantalla'], ['catet'], ['hipotenusa'], ['esRecte']] },
  explicacio: [
    { text: `<p>Un triangle <b>rectangle</b> té un angle recte. Els costats que el formen són els <b>catets</b>; el llarg, la <b class="parpelleja">hipotenusa</b>.</p>`, vis: () => geTriRect(4, 3, { labs: ['catet', 'catet', 'hipotenusa'], u: '' }) },
    { text: `<p>Si fem un quadrat sobre cada costat, el gran té la mateixa àrea que els dos petits junts: <b class="parpelleja">9 + 16 = 25</b>.</p><p class="petit">Això és el teorema de Pitàgores: c² = a² + b².</p>`, vis: () => geTriRect(4, 3, { quadrats: true, area: ['16', '9', '25'] }) },
    { text: `<p>Per trobar la hipotenusa: eleva al quadrat, suma i fes l'<b>arrel</b>.</p><p class="petit">3² + 4² = 25 → √25 = 5. En Coma ja pot pujar per l'escala!</p>`, vis: () => geEscalaSvg(3, 4, { labs: ['3 m', '4 m', '5 m'] }) }
  ],
  exemple: nv => ({ enunciat: `Catets de 6 cm i 8 cm. Quant fa la hipotenusa?`, passos: [
    { text: `6² + 8² = 36 + 64<br>= 100`, vis: geTriRect(8, 6, { labs: ['8', '6', '?'] }) },
    { text: `√100 = <b>10 cm</b> <span class="marca-ok">✓</span>`, vis: geTriRect(8, 6, { labs: ['8', '6', '10'] }) }] })
};

/* =====================================================================
   OBJECTIU 8 · VOLUM DEL PRISMA I DEL CILINDRE
   ===================================================================== */
function geCubsSvg(l, a, h, { col = geCol() } = {}) { // cubs unitat en perspectiva cavallera
  const s0 = Math.min(48, 300 / (l + a * .55 + 1), 220 / (h + a * .55 + 1)), dx = s0 * .5, dy = -s0 * .38;
  const ox = (GE_W - (l * s0 + a * dx)) / 2, oy = (GE_H + h * s0 - a * dy) / 2;
  let s = '';
  for (let y = a - 1; y >= 0; y--) for (let z = 0; z < h; z++) for (let x = 0; x < l; x++) {
    const X = ox + x * s0 + y * dx, Y = oy - z * s0 + y * dy;
    s += `<path d="M${X} ${Y}h${s0}v${-s0}h${-s0}Z" fill="${col[1]}" stroke="${col[0]}" stroke-width="1.6"/><path d="M${X} ${Y - s0}l${dx} ${dy}h${s0}l${-dx} ${-dy}Z" fill="#fff" stroke="${col[0]}" stroke-width="1.6"/><path d="M${X + s0} ${Y}l${dx} ${dy}v${-s0}l${-dx} ${-dy}Z" fill="${col[0]}55" stroke="${col[0]}" stroke-width="1.6"/>`;
  }
  return geSvg(GE_W, GE_H, s);
}
function gePrismaSvg(l, a, h, { u = 'cm', labs = null, col = geCol(), aigua = false } = {}) {
  const k = Math.min(230 / (l + a * .5), 190 / (h + a * .4)), dx = a * k * .5, dy = -a * k * .38, L = l * k, H = h * k;
  const x = (GE_W - L - dx) / 2, y = (GE_H + H - dy) / 2 + 4;
  const [tl, ta, th] = labs || [geU(l, u), geU(a, u), geU(h, u)];
  let s = `<path d="M${x} ${y - H}l${dx} ${dy}h${L}l${-dx} ${-dy}Z" fill="#fff" stroke="${col[0]}" stroke-width="3"/><path d="M${x + L} ${y}l${dx} ${dy}v${-H}l${-dx} ${-dy}Z" fill="${col[0]}44" stroke="${col[0]}" stroke-width="3"/><rect x="${x}" y="${y - H}" width="${L}" height="${H}" fill="${col[1]}" stroke="${col[0]}" stroke-width="3"/>`;
  if (aigua) s += `<rect x="${x + 3}" y="${y - H * .75}" width="${L - 6}" height="${H * .75 - 3}" fill="#6fb6f2" opacity=".55"/><text x="${x + L / 2}" y="${y - H * .3}" text-anchor="middle" font-size="26">🐠</text>`;
  s += geCota(x, y, x + L, y, tl, { d: 20 }) + geCota(x + L + dx, y + dy, x + L + dx, y + dy - H, th, { d: 20 }) + geTx(x + L + dx / 2 + 10, y + dy / 2 + 12, ta, { anc: 'start', fons: true });
  return geSvg(GE_W, GE_H, s);
}
function geCilSvg(r, h, { u = 'cm', mostra = 'r', col = ['#0f9fb0', '#c8f1f5'], llauna = false } = {}) {
  const k = Math.min(150 / (2 * r), 200 / h), R = r * k, H = h * k, e = R * .32, cx = GE_W / 2, yb = (GE_H + H) / 2 + 6, yt = yb - H;
  let s = `<path d="M${cx - R} ${yt}V${yb}A${R} ${e} 0 0 0 ${cx + R} ${yb}V${yt}" fill="${col[1]}" stroke="${col[0]}" stroke-width="3"/>`;
  if (llauna) s += `<rect x="${cx - R}" y="${yt + H * .3}" width="${2 * R}" height="${H * .4}" fill="#e0457b" opacity=".85"/>${geTx(cx, yt + H * .52, 'SUC', { col: '#fff', mida: 18 })}`;
  s += `<ellipse cx="${cx}" cy="${yt}" rx="${R}" ry="${e}" fill="#fff" stroke="${col[0]}" stroke-width="3"/><circle cx="${cx}" cy="${yt}" r="3" fill="${GE_N}"/>`;
  s += mostra === 'd' ? `<path d="M${cx - R} ${yt}H${cx + R}" stroke="${GE_N}" stroke-width="2.5"/>${geTx(cx, yt - 8, geU(2 * r, u), { fons: true })}` : `<path d="M${cx} ${yt}H${cx + R}" stroke="${GE_N}" stroke-width="2.5"/>${geTx(cx + R / 2, yt - 8, geU(r, u), { fons: true })}`;
  s += geCota(cx + R, yb, cx + R, yt, geU(h, u), { d: 22 });
  return geSvg(GE_W, GE_H, s);
}
const PISTA_GE8 = { completa: `Volum = <b>àrea de la base × altura</b>. Caixa: llarg × ample × alt. Cilindre: π · r · r · altura. Recorda: 1 dm³ = 1 litre i 1 cm³ = 1 mL.`, mitja: 'Base × altura.' };
const GE8 = {};
GE8.cubs = nv => {
  const l = geR(2, 5), a = geR(2, 3), h = geR(2, 4);
  return { sig: `cu-${l}-${a}-${h}`, enunciat: `Quants cubs d'1 cm³ formen aquesta peça? (Alguns no es veuen!)`, visual: () => geCubsSvg(l, a, h), pista: { completa: `Compta els cubs d'un pis (${l} × ${a}) i multiplica pels pisos (${h}).`, mitja: 'Cubs d\'un pis × pisos.' },
    ...apartats([geNum('Volum =', l * a * h, 'cm³', [[l * h, 'gQuad'], [l + a + h, 'gSuma']])]), explicacio: `${l} × ${a} × ${h} = ${l * a * h}.`, solucio: [`Un pis: ${l} × ${a} = ${l * a} cubs`, `${h} pisos: ${l * a} × ${h} = <b>${l * a * h} cm³</b>`] };
};
GE8.prisma = nv => {
  const d = nv === 3 ? 2 : 1; const l = geR(3 * d, 12 * d) / d, a = geR(2, 8), h = geR(2, 9);
  return { sig: `pr-${l}-${a}-${h}`, enunciat: `Quin és el <b>volum</b> d'aquesta caixa?`, visual: () => gePrismaSvg(l, a, h, {}), pista: PISTA_GE8,
    ...apartats([geNum('Volum =', l * a * h, 'cm³', [[l + a + h, 'gSuma'], [l * a, 'gQuad'], [2 * (l * a + l * h + a * h), 'gArea']])]), explicacio: `Llarg × ample × alt.`, solucio: [`Llarg × ample × alt`, `${geF(l)} × ${a} × ${h} = <b>${geF(l * a * h)} cm³</b>`] };
};
GE8.cilindre = nv => {
  const r = geR(1, 6), h = geR(3, 15), d = nv > 1 && Math.random() < .5;
  return { sig: `ci-${r}-${h}-${d}`, enunciat: `Quin és el <b>volum</b> d'aquest cilindre? (π = 3,14)`, visual: () => geCilSvg(r, h, { mostra: d ? 'd' : 'r' }), pista: PISTA_GE8,
    ...apartats([gePiNum('Volum =', p => p * r * r * h, 'cm³', [[3.14 * 4 * r * r * h, 'gDiam'], [2 * 3.14 * r * h, 'gArea'], [3.14 * r * h, 'gQuad']])]),
    explicacio: `3,14 · ${r} · ${r} · ${h}.`, solucio: [...(d ? [`Radi = ${2 * r} ÷ 2 = ${r} cm`] : []), `Base: 3,14 · ${r} · ${r} = ${geF(3.14 * r * r)} cm²`, `Volum: ${geF(3.14 * r * r)} · ${h} = <b>${geF(3.14 * r * r * h)} cm³</b>`] };
};
GE8.capacitat = nv => {
  if (nv === 3 && Math.random() < .5) { const r = geR(3, 4), h = geR(10, 15);
    return { sig: `cl-${r}-${h}`, enunciat: `Una llauna de suc té ${r} cm de radi i ${h} cm d'alçada. Quants <b>mL</b> hi caben? (π = 3,14; 1 cm³ = 1 mL)`, visual: () => geCilSvg(r, h, { llauna: true, col: ['#7c5cd6', '#e3dbff'] }), pista: PISTA_GE8,
      ...apartats([gePiNum('Capacitat =', p => p * r * r * h, 'mL', [[2 * 3.14 * r * h, 'gArea']])]), explicacio: `1 cm³ = 1 mL.`, solucio: [`3,14 · ${r} · ${r} · ${h} = ${geF(3.14 * r * r * h)} cm³`, `= <b>${geF(3.14 * r * r * h)} mL</b>`] }; }
  const l = geR(4, 10), a = geR(2, 5), h = geR(3, 6);
  return { sig: `cq-${l}-${a}-${h}`, enunciat: `Un aquari fa <b>${l} dm</b> de llarg, <b>${a} dm</b> d'ample i <b>${h} dm</b> d'alt. Quants <b>litres</b> d'aigua hi caben ple? (1 dm³ = 1 L)`, visual: () => gePrismaSvg(l, a, h, { u: 'dm', col: ['#2f6fd1', '#e9f3ff'], aigua: true }), pista: PISTA_GE8,
    ...apartats([geNum('Capacitat =', l * a * h, 'L', [[l * a * h * 1000, 'gUnitat'], [l + a + h, 'gSuma']])]), explicacio: `${l * a * h} dm³ = ${l * a * h} L.`, solucio: [`${l} × ${a} × ${h} = ${l * a * h} dm³`, `= <b>${l * a * h} litres</b>`] };
};
GE8.triangular = nv => {
  const b = geR(2, 6) * 2, ht = geR(2, 6), L = geR(4, 12);
  const vis = () => { const k = Math.min(200 / (b + L * .5), 170 / (ht + L * .35)), B = b * k, H = ht * k, dx = L * k * .5, dy = -L * k * .35, x = (GE_W - B - dx) / 2, y = (GE_H + H - dy) / 2;
    return geSvg(GE_W, GE_H, `<path d="M${x + B / 2} ${y - H}l${dx} ${dy}L${x + B + dx} ${y + dy}L${x + B} ${y}Z" fill="#f47b2044" stroke="#f47b20" stroke-width="3"/><path d="M${x} ${y}L${x + B} ${y}L${x + B / 2} ${y - H}Z" fill="#ffd9b8" stroke="#f47b20" stroke-width="3"/>${geAlt(x + B / 2, y - H, y, `${ht} cm`)}${geCota(x, y, x + B, y, `${b} cm`, { d: 20 })}${geTx(x + B + dx / 2 + 10, y + dy / 2 + 10, `${L} cm`, { anc: 'start', fons: true })}<text x="${x + B / 2 + dx}" y="${y - H + dy - 8}" text-anchor="middle" font-size="22">⛺</text>`); };
  return { sig: `tg-${b}-${ht}-${L}`, enunciat: `Aquesta tenda de campanya és un <b>prisma triangular</b>. Quin és el seu volum?`, visual: vis, pista: { completa: `Primer l'àrea del triangle de davant (base × altura ÷ 2) i després multiplica per la llargada.`, mitja: 'Àrea del triangle × llargada.' },
    ...apartats([geNum('Volum =', b * ht / 2 * L, 'cm³', [[b * ht * L, 'gMeitat']])]), explicacio: `${b} × ${ht} ÷ 2 × ${L}.`, solucio: [`Triangle: ${b} × ${ht} ÷ 2 = ${b * ht / 2} cm²`, `Volum: ${b * ht / 2} × ${L} = <b>${b * ht / 2 * L} cm³</b>`] };
};
GE8.compara = nv => {
  for (;;) { const l = geR(4, 10), a = geR(4, 10), h = geR(5, 15), r = geR(2, 6), hc = geR(5, 20); const V1 = l * a * h, V2 = 3.14 * r * r * hc; if (Math.abs(V1 - V2) / Math.min(V1, V2) < .1) continue;
    const bo = V1 > V2 ? 'A' : 'B';
    return { sig: `cm-${l}-${a}-${h}-${r}-${hc}`, enunciat: `Quin recipient hi cap <b>més</b>: la caixa <b>A</b> o el pot <b>B</b>? (π = 3,14)`, visual: () => `<div class="ge-dues"><div>A${gePrismaSvg(l, a, h, {})}</div><div>B${geCilSvg(r, hc, {})}</div></div>`, pista: PISTA_GE8,
      ...apartats([geNum('Volum de la caixa A =', V1, 'cm³', [[l + a + h, 'gSuma']]), { tipus: 'tria', html: 'Hi cap més a…', opcions: [{ html: '<b>A</b>', val: 'A' }, { html: '<b>B</b>', val: 'B' }], correcta: bo, etiq: {} }]),
      explicacio: `A: ${V1} cm³ · B: ${geF(V2)} cm³.`, solucio: [`A: ${l} × ${a} × ${h} = ${V1} cm³`, `B: 3,14 · ${r} · ${r} · ${hc} = ${geF(V2)} cm³`, `Hi cap més a <b>${bo}</b>.`] }; }
};
TEMES.g8 = {
  gen: GE8,
  sequencia: { 1: [['cubs'], ['prisma'], ['cubs'], ['capacitat'], ['prisma'], ['cilindre'], ['cubs'], ['capacitat']], 2: [['prisma'], ['cilindre'], ['capacitat'], ['compara'], ['prisma'], ['cilindre'], ['capacitat'], ['cubs']], 3: [['prisma'], ['cilindre'], ['triangular'], ['capacitat'], ['compara'], ['cilindre'], ['triangular'], ['prisma']] },
  explicacio: [
    { text: `<p>El <b>volum</b> és l'espai que ocupa un cos. Es mesura en cubets: cm³, dm³, m³.</p><p class="petit">Aquesta peça té 4 × 2 = 8 cubs per pis i 3 pisos: <b class="parpelleja">24 cm³</b>.</p>`, vis: () => geCubsSvg(4, 2, 3) },
    { text: `<p>Per a qualsevol prisma o cilindre: <b class="parpelleja">àrea de la base × altura</b>.</p><p class="petit">Caixa: llarg × ample × alt. Cilindre: π · r · r · altura.</p>`, vis: () => `<div class="ge-dues"><div>${gePrismaSvg(5, 3, 4, {})}</div><div>${geCilSvg(3, 8, {})}</div></div>` },
    { text: `<p>I la <b>capacitat</b>: <b>1 dm³ = 1 litre</b> i 1 cm³ = 1 mL.</p><p class="petit">Un aquari de 5 × 3 × 4 dm hi caben 60 litres. Els peixos d'en Coma estan contents!</p>`, vis: () => `${gePrismaSvg(5, 3, 4, { u: 'dm', col: ['#2f6fd1', '#e9f3ff'], aigua: true })}${geRepte('Meu… quins peixets!')}` }
  ],
  exemple: nv => ({ enunciat: `Volum d'un cilindre de radi 2 cm i altura 10 cm.`, passos: [
    { text: `Base: 3,14 · 2 · 2 = 12,56 cm²`, vis: geCilSvg(2, 10, {}) },
    { text: `Volum: 12,56 · 10 = <b>125,6 cm³</b> <span class="marca-ok">✓</span>`, vis: geCilSvg(2, 10, {}) }] })
};

/* =====================================================================
   PROVA DE COMPETÈNCIES · GEOMETRIA (3 activitats, 18 preguntes, 10 punts)
   Amb calculadora. Es pot deixar a mitges («Plego per avui») i continuar un altre dia.
   ===================================================================== */
const PC_G = { id: 'pcg', unitat: 'g', provaKey: 'provaCG', titol: 'Prova de competències · Geometria' };
const geTol = (v, t, tol = .1) => typeof v === 'number' && Math.abs(v - t) <= tol;
const cbgPati = () => geCompSvg([{ pts: [[0, 0], [30, 0], [30, 20], [0, 20]], col: ['#8a7a63', '#efe6d4'] }, { pts: [[2, 2], [14, 2], [2, 10]], col: ['#1d9a5a', '#c9f0d8'] }, { cercle: true, c: [23, 13], r: 3, col: ['#d39a00', '#fff1b8'] }, { pts: [[20, 2], [24, 2], [24, 5], [20, 5]], col: ['#e0457b', '#ffd6e4'] }],
  { w: 30, h: 20, cotes: [[0, 0, 30, 0, '30 m'], [30, 0, 30, 20, '20 m']], extra: (P, k) => { const g = P([5.5, 4.5]), s = P([23, 13]), z = P([22, 3.5]); return geTx(g[0], g[1], 'gespa', { mida: 12, col: '#1d9a5a' }) + geTx(s[0], s[1] + 4, 'sorral', { mida: 12, col: '#d39a00' }) + geTx(z[0], z[1] + 4, 'rajoles', { mida: 11, col: '#e0457b' }); } }).replace('class="ge-vis"', 'class="ge-vis petit"');
const CB_ACTS_G = [
  { t: 'Reformem el pati', max: 3.5, ctx: L => `<p>L'institut reforma el pati, que és un rectangle de <b>30 m × 20 m</b>. Hi haurà una zona de <b>gespa</b> triangular (base 12 m, altura 8 m), un <b>sorral</b> rodó de 3 m de radi i una zona de <b>rajoles</b> de 4 m × 3 m.</p>${cbgPati()}${L === 'basic' ? '<div class="cb-chips"><span>Perímetre: suma dels costats</span><span>Rectangle: b × h</span><span>Triangle: b × h ÷ 2</span><span>Cercle: π · r · r</span></div>' : ''}` },
  { t: 'Pizzes i rodes', max: 3.5, ctx: L => `<p>Per a la festa de final de trimestre, la classe compara pizzes: la <b>mitjana</b> fa 30 cm de diàmetre i costa 10 €; la <b>familiar</b> fa 40 cm i costa 16 €. Després, en Pau va a buscar-les amb bicicleta: les rodes tenen <b>35 cm de radi</b>.</p><div class="ge-dues" style="max-width:420px;margin:0 auto">${geCercleFig(15, { mostra: 'd', tema: 'pizza', txt: '30 cm', R: 84 })}${geCercleFig(20, { mostra: 'd', tema: 'pizza', txt: '40 cm', R: 112 })}</div>${L === 'basic' ? '<div class="cb-chips"><span>Radi = diàmetre ÷ 2</span><span>Longitud = 2 · π · r</span><span>Àrea = π · r · r</span><span>π = 3,14</span></div>' : ''}` },
  { t: 'Bombers i rampes', max: 3, ctx: L => `<p>Els bombers fan pràctiques al parc. Fan servir escales, una rampa i un dipòsit d'aigua cilíndric.</p>${geEscalaSvg(6, 8, { labs: ['6 m', '8 m', '?'] }).replace('class="ge-vis"', 'class="ge-vis petit"')}${L === 'basic' ? '<div class="cb-chips"><span>Hipotenusa² = catet² + catet²</span><span>Catet² = hipotenusa² − catet²</span><span>Cilindre: π · r · r · h</span><span>1 m³ = 1000 L</span></div>' : ''}` }];
const CB_ITEMS_G = [
  { n: 1, act: 0, type: 'mc', pts: .5, q: 'Volen posar una tanca a tot el voltant del pati. Quants metres de tanca calen?', opts: { a: '100 m', b: '600 m', c: '50 m', d: '1.000 m' }, ans: 'a',
    hb: ['La tanca va per la vora: és el perímetre.', 'Suma els quatre costats: 30 + 20 + 30 + 20.'], hi: 'La tanca va per la vora del pati.' },
  { n: 2, act: 0, type: 'mc', pts: .5, q: 'Quina és l\'àrea de tot el pati?', opts: { a: '600 m²', b: '100 m²', c: '50 m²', d: '1.200 m²' }, ans: 'a',
    hb: ['L\'àrea és el que hi ha a dins: base × altura.', '30 × 20.'], hi: 'Base × altura.' },
  { n: 3, act: 0, type: 'mc', pts: .5, q: 'La tanca es ven en rotlles de <b>25 m</b>. Quants rotlles han de comprar?', opts: { a: '4 rotlles', b: '3 rotlles', c: '5 rotlles', d: '24 rotlles' }, ans: 'a',
    hb: ['Calen 100 m de tanca. Quantes vegades hi cap 25?', '100 ÷ 25.'], hi: 'Divideix els metres entre la llargada d\'un rotlle.' },
  { n: 4, act: 0, type: 'mc', pts: .5, q: 'Quina àrea tindrà la zona de gespa (triangle de base 12 m i altura 8 m)?', opts: { a: '48 m²', b: '96 m²', c: '20 m²', d: '24 m²' }, ans: 'a',
    hb: ['Triangle: base × altura ÷ 2.', '12 × 8 = 96. No t\'oblidis de dividir entre 2.'], hi: 'Base × altura ÷ 2.' },
  { n: 5, act: 0, type: 'mc', pts: .5, q: 'La zona de rajoles fa 4 m × 3 m. Les rajoles són quadrades de <b>50 cm</b> de costat. Quantes rajoles calen?', opts: { a: '48 rajoles', b: '12 rajoles', c: '24 rajoles', d: '600 rajoles' }, ans: 'a',
    hb: ['La zona fa 12 m². Quantes rajoles de 50 cm caben en 1 m²?', 'En 1 m de costat hi caben 2 rajoles: en 1 m², 2 × 2 = 4. I en 12 m²?'], hi: 'Quantes rajoles caben en 1 m²?' },
  { n: 6, act: 0, type: 'open', pts: 1, q: 'El conserge diu: «El sorral rodó, de 3 m de radi, ocupa <b>menys de 30 m²</b>.» Té raó?',
    fields: [{ pre: 'Àrea del sorral:', ans: 28.26, suf: 'm²' }],
    choice: { lab: 'Té raó el conserge?', opts: ['Sí, ocupa menys de 30 m².', 'No, ocupa més de 30 m².', 'Ocupa exactament 30 m².'], ans: 0 },
    grade: (v, c) => { const r = geTol(v[0], 28.26, .1); if (c === 0) return r ? 2 : 1; return r ? 1 : 0; },
    hb: ['Àrea del cercle: π · r · r, amb r = 3.', '3,14 · 3 · 3 = 28,26. És més o menys que 30?'], hi: 'Calcula l\'àrea del cercle i compara-la amb 30.' },
  { n: 7, act: 1, type: 'mc', pts: .5, q: 'Quant fa el <b>radi</b> de la pizza mitjana?', opts: { a: '15 cm', b: '30 cm', c: '60 cm', d: '94,2 cm' }, ans: 'a',
    hb: ['La pizza mitjana fa 30 cm de diàmetre.', 'El radi és la meitat del diàmetre.'], hi: 'Radi = diàmetre ÷ 2.' },
  { n: 8, act: 1, type: 'mc', pts: .5, q: 'Quina és l\'<b>àrea</b> de la pizza mitjana?', opts: { a: '706,5 cm²', b: '94,2 cm²', c: '2.826 cm²', d: '47,1 cm²' }, ans: 'a',
    hb: ['Àrea = π · r · r, amb r = 15.', '3,14 · 15 · 15.'], hi: 'π · r · r.' },
  { n: 9, act: 1, type: 'mc', pts: .5, q: 'Quant fa la <b>vora</b> (la longitud) de la pizza mitjana?', opts: { a: '94,2 cm', b: '706,5 cm', c: '47,1 cm', d: '30 cm' }, ans: 'a',
    hb: ['Longitud = 2 · π · r.', '2 · 3,14 · 15.'], hi: '2 · π · r.' },
  { n: 10, act: 1, type: 'mc', pts: .5, q: 'Quants centímetres avança la bici a cada volta de roda (radi 35 cm)?', opts: { a: '219,8 cm', b: '109,9 cm', c: '3.846,5 cm', d: '70 cm' }, ans: 'a',
    hb: ['A cada volta avança la longitud de la roda.', '2 · 3,14 · 35.'], hi: 'La longitud de la roda.' },
  { n: 11, act: 1, type: 'mc', pts: .5, q: 'La pizzeria és a <b>1 km</b> (100.000 cm). Quantes voltes, aproximadament, fa cada roda?', opts: { a: 'Unes 455 voltes', b: 'Unes 4.550 voltes', c: 'Unes 45 voltes', d: 'Unes 2.857 voltes' }, ans: 'a',
    hb: ['Cada volta són 219,8 cm.', '100.000 ÷ 219,8.'], hi: 'Divideix la distància entre el que avança en una volta.' },
  { n: 12, act: 1, type: 'open', pts: 1, q: 'Quina pizza surt més a compte: la mitjana (30 cm, 10 €) o la familiar (40 cm, 16 €)?',
    fields: [{ pre: 'Àrea de la mitjana:', ans: 706.5, suf: 'cm²' }, { pre: 'Àrea de la familiar:', ans: 1256, suf: 'cm²' }],
    choice: { lab: 'Quina surt més a compte?', opts: ['La mitjana.', 'La familiar.', 'Surten igual.'], ans: 1 },
    grade: (v, c) => { const r = geTol(v[0], 706.5, .5) && geTol(v[1], 1256, .6); if (c === 1) return r ? 2 : 1; return r ? 1 : 0; },
    hb: ['Calcula l\'àrea de cada pizza: π · r · r (radis 15 i 20).', 'Mitjana: 706,5 cm² per 10 €. Familiar: 1.256 cm² per 16 €. Divideix el preu entre l\'àrea.'], hi: 'Compara els euros per cm².' },
  { n: 13, act: 2, type: 'mc', pts: .4, q: 'L\'escala dels bombers té el peu a <b>6 m</b> de la paret i arriba a <b>8 m</b> d\'altura. Quant fa l\'escala?', opts: { a: '10 m', b: '14 m', c: '100 m', d: '48 m' }, ans: 'a',
    hb: ['L\'escala és la hipotenusa del triangle rectangle.', '6² + 8² = 36 + 64 = 100. Ara fes l\'arrel.'], hi: 'Pitàgores: la hipotenusa.' },
  { n: 14, act: 2, type: 'mc', pts: .4, q: 'Una altra escala fa <b>13 m</b> i té el peu a <b>5 m</b> de la paret. A quina altura arriba?', opts: { a: '12 m', b: '18 m', c: '8 m', d: '13,9 m' }, ans: 'a',
    hb: ['Ara busques un catet.', '13² − 5² = 169 − 25 = 144. L\'arrel?'], hi: 'Catet² = hipotenusa² − catet².' },
  { n: 15, act: 2, type: 'mc', pts: .4, q: 'La rampa puja <b>1 m</b> en <b>12 m</b> de recorregut horitzontal. Quant fa la rampa?', opts: { a: 'Uns 12,04 m', b: '13 m', c: '11 m', d: '145 m' }, ans: 'a',
    hb: ['La rampa és la hipotenusa: catets 1 i 12.', '1² + 12² = 145. √145 = ?'], hi: 'Pitàgores amb 1 i 12.' },
  { n: 16, act: 2, type: 'mc', pts: .4, q: 'La pantalla de la sala fa <b>80 cm</b> d\'ample i <b>60 cm</b> d\'alt. Quant fa la diagonal?', opts: { a: '100 cm', b: '140 cm', c: '70 cm', d: '10.000 cm' }, ans: 'a',
    hb: ['La diagonal és la hipotenusa.', '80² + 60² = 6.400 + 3.600 = 10.000. L\'arrel?'], hi: 'Pitàgores amb 80 i 60.' },
  { n: 17, act: 2, type: 'mc', pts: .4, q: 'El dipòsit d\'aigua és un cilindre d\'<b>1 m</b> de radi i <b>2 m</b> d\'alçada. Quants litres hi caben?', opts: { a: '6.280 L', b: '6,28 L', c: '12.560 L', d: '628 L' }, ans: 'a',
    hb: ['Volum = π · r · r · h = 3,14 · 1 · 1 · 2.', 'Són 6,28 m³. I 1 m³ = 1.000 L.'], hi: 'Calcula el volum en m³ i passa\'l a litres.' },
  { n: 18, act: 2, type: 'open', pts: 1, q: 'El camió porta una escala de <b>12 m</b>. Ha d\'arribar a una finestra a <b>11 m</b> d\'altura i el peu de l\'escala ha de quedar a <b>5 m</b> de la paret. Hi arriba?',
    fields: [{ pre: 'Escala que caldria (arrodoneix a les centèsimes):', ans: 12.08, suf: 'm' }],
    choice: { lab: 'Hi arriba?', opts: ['Sí, hi arriba de sobres.', 'No, l\'escala és una mica curta.', 'Hi arriba just.'], ans: 1 },
    grade: (v, c) => { const r = geTol(v[0], 12.08, .02); if (c === 1) return r ? 2 : 1; return r ? 1 : 0; },
    hb: ['L\'escala que caldria és la hipotenusa: catets 5 i 11.', '5² + 11² = 25 + 121 = 146. √146 ≈ 12,08. És més o menys que 12?'], hi: 'Calcula la hipotenusa i compara-la amb 12.' }];
const CB_INFO_G = `<h3>ⓘ Prova de competències · Geometria</h3>
  <p><b>Què és.</b> Una prova en format de competències bàsiques: 3 activitats amb context (reformem el pati, pizzes i rodes, bombers i rampes) i 18 preguntes (15 de resposta tancada i 3 d'obertes). Compta com a <b>examen a part</b>: no toca els objectius ni l'AS de la unitat.</p>
  <p><b>Què avalua.</b> Perímetre (1, 3), àrees de rectangle, triangle i cercle (2, 4, 6, 8, 12), rajoles i unitats (5), radi, diàmetre i longitud (7, 9, 10, 11), Pitàgores (13 a 16, 18) i volum del cilindre en litres (17).</p>
  <p><b>En més d'un dia.</b> L'alumne pot prémer <b>«Plego per avui»</b>: les respostes queden guardades i un altre dia continua on era. Si tanques la prova, ningú no hi pot entrar fins que la tornis a obrir.</p>
  <p><b>Nivell.</b> N1 → bàsic (3 intents, 2 pistes i un recordatori de les fórmules), N2 → intermedi (1 intent, 1 pista que fa valer la pregunta el 75 %), N3 → repte. Les preguntes són les mateixes per a tots.</p>
  <p><b>Puntuació (sobre 10).</b> Activitat 1: 3,5 · Activitat 2: 3,5 · Activitat 3: 3. Les obertes valen 1 punt amb puntuació parcial. Amb π s'accepten 3,14 i la tecla π.</p>
  <p><b>Calculadora.</b> Disponible.</p>`;
CB_PROVES.g = { PC: PC_G, acts: CB_ACTS_G, items: CB_ITEMS_G, info: CB_INFO_G };

UNITATS.g.carregada = true;
