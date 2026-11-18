/* Econ Speedrun · animated AD/AS diagram, drawn the way the Year 6 notes draw it:
   an AS curve with a flat (Keynesian) range, an upward-sloping range and a vertical range at full employment (Yf),
   and a straight, downward-sloping AD curve.
   ADAS.svg(shift, opts) returns the finished diagram as an SVG string.
   ADAS.animate(el, shift, opts) draws it into el and slides the curves from the old to the new position.
   shift: 'adR' | 'adL' | 'asUp' | 'asDown' | 'asLeft' | 'asRight' | 'asDR' | 'combo' (AD right + AS up) | null */
(function (root) {
  'use strict';
  const W = 340, H = 250, X0 = 46, Y0 = 212, TOP = 18, RIGHT = 326;
  const SHIFTS = {
    adR: { ad: 46 }, adL: { ad: -46 },
    asUp: { up: 34 }, asDown: { up: -26 },
    asLeft: { cap: -44 }, asRight: { cap: 44 },
    asDR: { up: -22, cap: 40 },
    combo: { ad: 40, up: 30 }
  };
  // AS: flat at price `flat` (y coordinate) until x1, then rises ever more steeply, vertical at xf.
  function asY(x, as) {
    if (x <= as.x1) return as.flat;
    const t = Math.min(1, (x - as.x1) / (as.xf - as.x1));
    return as.flat - (as.flat - TOP) * (0.15 * t * t / (1 - 0.85 * t)); // reaches the top exactly at Yf
  }
  function asPath(as) {
    let d = `M${X0 + 4},${as.flat.toFixed(1)} L${as.x1},${as.flat.toFixed(1)}`;
    for (let x = as.x1; x <= as.xf; x += 2) d += ` L${x},${asY(x, as).toFixed(1)}`;
    return d + ` L${as.xf},${TOP}`;
  }
  // AD: straight line through (cx + s, cy) with slope SL (screen y grows downwards, so it slopes down)
  const SL = 0.9;
  const adY = (x, ad) => ad.cy + SL * (x - ad.cx - ad.s);
  const adX1 = ad => Math.max(X0 + 4, ad.cx + ad.s - (ad.cy - TOP) / SL), adX2 = ad => Math.min(RIGHT - 6, ad.cx + ad.s + (Y0 - 6 - ad.cy) / SL);
  const adPath = ad => { const x1 = adX1(ad), x2 = adX2(ad); return `M${x1.toFixed(1)},${adY(x1, ad).toFixed(1)} L${x2.toFixed(1)},${adY(x2, ad).toFixed(1)}`; };
  function equilibrium(ad, as) {
    for (let x = X0 + 4; x <= as.xf; x += 0.5) if (adY(x, ad) >= asY(x, as)) return [x, asY(x, as)];
    return [as.xf, adY(as.xf, ad)]; // AD meets the vertical range
  }
  function base(opts) {
    const o = opts || {};
    // where the economy starts: 'flat' (lots of spare capacity), 'mid' (default) or 'full' (near full employment)
    const start = o.start || 'mid';
    const as = { flat: 150, x1: 140, xf: 270 };
    const ad = start === 'flat' ? { cx: 105, cy: 150, s: 0 } : start === 'full' ? { cx: 261, cy: 68, s: 0 } : { cx: 247, cy: 106, s: 0 };
    return { ad, as };
  }
  function moved(b, shift, k) {
    const s = SHIFTS[shift] || {};
    return {
      ad: { cx: b.ad.cx, cy: b.ad.cy, s: b.ad.s + (s.ad || 0) * k },
      as: { flat: b.as.flat - (s.up || 0) * k, x1: b.as.x1 + (s.cap || 0) * k, xf: b.as.xf + (s.cap || 0) * k }
    };
  }
  function draw(shift, k, opts) {
    const o = opts || {}, b = base(o), n = moved(b, shift, k), s = SHIFTS[shift] || {};
    const e0 = equilibrium(b.ad, b.as), e1 = equilibrium(n.ad, n.as);
    const adMoved = !!s.ad, asMoved = !!(s.up || s.cap);
    const lab = (x, y, t, cls) => `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" class="${cls}">${t}</text>`;
    // AD labels sit just past the lower end of each line, which stops short of the axis to leave room
    const adEnd = ad => { const x = Math.min(RIGHT - 34, ad.cx + ad.s + (Y0 - 34 - ad.cy) / SL); return [x, adY(x, ad)]; };
    const adShort = ad => { const x1 = adX1(ad), x2 = adEnd(ad)[0]; return `M${x1.toFixed(1)},${adY(x1, ad).toFixed(1)} L${x2.toFixed(1)},${adY(x2, ad).toFixed(1)}`; };
    const [ax0, ay0] = adEnd(b.ad), [ax1, ay1] = adEnd(n.ad);
    const guides = (e, cls) => `<line x1="${X0}" y1="${e[1].toFixed(1)}" x2="${e[0].toFixed(1)}" y2="${e[1].toFixed(1)}" class="${cls}"/><line x1="${e[0].toFixed(1)}" y1="${e[1].toFixed(1)}" x2="${e[0].toFixed(1)}" y2="${Y0}" class="${cls}"/>`;
    const moving = shift && k > 0.02, done = k > 0.98;
    // price and output labels: nudge the new ones apart from the old ones when they are close
    const pGap = e1[1] - e0[1], yGap = e1[0] - e0[0];
    const p1y = Math.abs(pGap) < 12 ? e0[1] + (pGap < 0 ? -9 : 15) : e1[1] + 4;
    const y1x = Math.abs(yGap) < 16 ? e0[0] + (yGap < 0 ? -16 : 16) : e1[0];
    return `<svg class="adas" viewBox="0 0 ${W} ${H}" role="img" aria-label="AD/AS diagram${shift ? ': ' + (o.label || shift) : ''}">
      <line x1="${X0}" y1="${TOP - 6}" x2="${X0}" y2="${Y0}" class="ax"/><line x1="${X0}" y1="${Y0}" x2="${RIGHT}" y2="${Y0}" class="ax"/>
      <text x="6" y="${TOP}" class="axl">GPL</text><text x="${RIGHT}" y="${H - 4}" class="axl" text-anchor="end">Real national income</text>
      ${o.showYf !== false ? `<line x1="${b.as.xf}" y1="${Y0 - 4}" x2="${b.as.xf}" y2="${Y0 + 4}" class="ax"/>${lab(b.as.xf + 4, Y0 - 5, 'Yf', 'tick')}` : ''}
      ${guides(e0, moving ? 'guide old' : 'guide')}
      <path d="${asPath(b.as)}" class="as ${asMoved && moving ? 'old' : ''}"/><path d="${adShort(b.ad)}" class="ad ${adMoved && moving ? 'old' : ''}"/>
      ${lab(b.as.xf + 4, TOP + 10, 'AS₀', 'asl')}${lab(ax0 + 4, ay0 + 10, 'AD₀', 'adl')}
      ${moving && asMoved ? `<path d="${asPath(n.as)}" class="as new"/>${lab(Math.min(W - 24, n.as.xf + 4), TOP + 24, 'AS₁', 'asl b')}` : ''}
      ${moving && adMoved ? `<path d="${adShort(n.ad)}" class="ad new"/>${lab(ax1 + 4, ay1 + 10, 'AD₁', 'adl b')}` : ''}
      <circle cx="${e0[0].toFixed(1)}" cy="${e0[1].toFixed(1)}" r="4" class="e0"/>
      ${lab(X0 - 22, e0[1] + 4, 'P₀', 'tick')}${lab(e0[0] - 6, Y0 + 15, 'Y₀', 'tick')}
      ${moving ? `${guides(e1, 'guide')}<circle cx="${e1[0].toFixed(1)}" cy="${e1[1].toFixed(1)}" r="5.5" class="e1"/>${done ? lab(X0 - 22, p1y, 'P₁', 'tick b') + lab(y1x - 6, Y0 + 15, 'Y₁', 'tick b') : ''}` : ''}
    </svg>`;
  }
  function svg(shift, opts) { return draw(shift, 1, opts); }
  function animate(el, shift, opts) {
    if (!el) return;
    const reduced = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !shift) { el.innerHTML = draw(shift, shift ? 1 : 0, opts); return; }
    el.innerHTML = draw(shift, 0, opts);
    const delay = (opts && opts.delay) || 300, ms = (opts && opts.ms) || 1100;
    setTimeout(() => {
      const t0 = performance.now();
      (function f(t) { const p = Math.min(1, (t - t0) / ms), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; el.innerHTML = draw(shift, e, opts); if (p < 1) requestAnimationFrame(f); })(t0);
    }, delay);
  }
  // Which way do the price level and real output move? Used to check the drawn answer matches the model.
  function outcome(shift, opts) {
    const b = base(opts), n = moved(b, shift, 1), e0 = equilibrium(b.ad, b.as), e1 = equilibrium(n.ad, n.as);
    const dy = e0[1] - e1[1], dx = e1[0] - e0[0];
    return { gpl: Math.abs(dy) < 1 ? 'same' : dy > 0 ? 'up' : 'down', rny: Math.abs(dx) < 1 ? 'same' : dx > 0 ? 'up' : 'down', dGPL: dy, dRNY: dx };
  }
  root.ADAS = { svg, animate, outcome, SHIFTS };
})(typeof self !== 'undefined' ? self : this);
