/* Econ Speedrun: shared UI helpers (diagram, explanations, skyline, formatting). */
(function (root) {
  'use strict';
  const E = root.Engine, S = root.Scenarios;

  const EXPLAIN = {
    adL: 'Spending falls (exports, investment or consumption), so <b>AD shifts left</b>. Output falls by more than the first drop because of the multiplier, and firms cut jobs.',
    adR: 'Spending rises, so <b>AD shifts right</b>. Output and jobs rise. Near full capacity, more of the extra demand pulls prices up: demand-pull inflation.',
    asCost: 'Firms\' unit costs of production rise, so <b>AS shifts left</b>. Prices rise (cost-push inflation) while output falls. In an economy that imports almost everything, this is <b>imported</b> inflation.',
    asCapL: 'The economy can produce less, so <b>AS shifts left because capacity falls</b>. Potential growth slows.',
    asCapR: 'The economy can produce more, so <b>AS shifts right</b>. Growth can rise without extra inflation.',
    both: 'Costs rise (AS left) <b>and</b> spending falls (AD left). Output falls on both counts while costs push prices up: <b>stagflation</b>. No lever fixes everything.'
  };
  const SHIFT = { adL: { a: -32, b: 0 }, adR: { a: 32, b: 0 }, asCost: { a: 0, b: -32 }, asCapL: { a: 0, b: -32 }, asCapR: { a: 0, b: 32 }, both: { a: -26, b: -26 } };

  function diagram(key, w) {
    const sh = SHIFT[key] || { a: 0, b: 0 };
    const AD = a => `M${40 + a},30 L${200 + a},150`, AS = b => `M${40 + b},150 L${200 + b},30`;
    const ix = (a, b) => { const x = 120 + (a + b) / 2; return [x, 30 + (x - 40 - a) * 0.75]; };
    const [x1, y1] = ix(0, 0), [x2, y2] = ix(sh.a, sh.b);
    return `<svg class="diag" width="${w || 240}" viewBox="0 0 240 185" role="img" aria-label="AD/AS diagram">
      <line x1="30" y1="15" x2="30" y2="165" class="ax"/><line x1="30" y1="165" x2="228" y2="165" class="ax"/>
      <text x="4" y="12" class="axl">GPL</text><text x="180" y="180" class="axl">Real GDP</text>
      <path d="${AD(0)}" class="ad ${sh.a ? 'old' : ''}"/><path d="${AS(0)}" class="as ${sh.b ? 'old' : ''}"/>
      <text x="203" y="152" class="adl">AD₁</text><text x="203" y="32" class="asl">AS₁</text>
      ${sh.a ? `<path d="${AD(sh.a)}" class="ad new"/><text x="${203 + sh.a}" y="164" class="adl b">AD₂</text>` : ''}
      ${sh.b ? `<path d="${AS(sh.b)}" class="as new"/><text x="${197 + sh.b}" y="24" class="asl b">AS₂</text>` : ''}
      <circle cx="${x1}" cy="${y1}" r="3.5" class="e1"/>
      <line x1="30" y1="${y2}" x2="${x2}" y2="${y2}" class="guide"/><line x1="${x2}" y1="${y2}" x2="${x2}" y2="165" class="guide"/>
      <circle cx="${x2}" cy="${y2}" r="5" class="e2"/></svg>`;
  }

  // City skyline that grows with the living-standard index.
  function skyline(index, w, h) {
    w = w || 360; h = h || 70;
    const scale = Math.max(0.15, Math.min(1.6, (index - 85) / 25));
    const blds = [[0, .35, 28], [30, .55, 22], [54, .8, 26], [82, .45, 18], [102, 1, 30], [134, .6, 20], [156, .9, 24], [182, .5, 26],
                  [210, .7, 22], [234, 1.1, 28], [264, .55, 20], [286, .75, 26], [314, .4, 22], [338, .62, 22]];
    const bars = blds.map(([x, f, bw], i) => {
      const bh = Math.max(6, f * h * 0.85 * scale);
      const lit = Array.from({ length: Math.floor(bh / 9) }, (_, r) => `<rect x="${x + 5}" y="${h - bh + 5 + r * 9}" width="${bw - 10}" height="3" class="win"/>`).join('');
      return `<rect x="${x}" y="${h - bh}" width="${bw}" height="${bh}" rx="2" class="bld b${i % 4}"/>${lit}`;
    }).join('');
    return `<svg class="sky" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">${bars}<rect x="0" y="${h - 2}" width="${w}" height="2" class="ground"/></svg>`;
  }

  function spark(vals, w, h) {
    w = w || 56; h = h || 20; if (vals.length < 2) return '';
    const mn = Math.min(...vals) - 0.3, mx = Math.max(...vals) + 0.3;
    const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * w},${h - ((v - mn) / (mx - mn || 1)) * h}`).join(' ');
    return `<svg width="${w}" height="${h}" class="spark"><polyline points="${pts}"/></svg>`;
  }

  function qLabel(q) { return `Year ${Math.floor(q / 4) + 1} · Q${(q % 4) + 1}`; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  // What happens at the start of quarter q in a scenario.
  function quarterInfo(sc, q) {
    const events = sc.events.filter(e => e.q === q);
    const news = sc.news.filter(n => n.q === q);
    const unlock = E.unlocksFor(sc).find(u => u.q === q) || null;
    const pollEv = events.find(e => e.poll);
    return { events, news, unlock, poll: pollEv ? { id: sc.id + '-q' + q, correct: pollEv.poll, ev: pollEv } : null,
      quiet: events.length ? null : S.QUIET[q % S.QUIET.length] };
  }

  function lessonHTML(u) {
    return `<div class="lesson"><div class="k">🔓 Unlocked</div><h2>${esc(u.title)}</h2>${u.lesson.map(p => `<p>${p}</p>`).join('')}</div>`;
  }

  // A short coaching line after a quarter, judged on the aims that are unlocked.
  function coach(res, run, sc) {
    const u = E.unlockedAt(res.q, sc), T = E.TARGETS, out = [];
    if (u.aims.has('inflation') && res.pi > T.inflation.hi) out.push(res.cost > 0.8 && u.levers.has('er') ? 'Inflation is high and mostly <b>cost-push</b>. A stronger dollar makes imports cheaper.' : 'Inflation is above target. Is demand running too hot?');
    if (u.aims.has('inflation') && res.pi < 0) out.push('Prices are <b>falling</b>. Deflation makes people delay spending.');
    if (res.g < T.growth.lo) out.push('Growth is below target. AD is weak: think about the multiplier.');
    if (res.g > T.growth.hi) out.push('Growth is above 5%. Watch for overheating.');
    if (u.aims.has('unemployment') && res.u > T.unemployment.hi) out.push(run.struct > 0.3 ? 'Some joblessness is <b>structural</b>. Retraining helps more than spending.' : 'Unemployment is above target: <b>demand-deficient</b> unemployment.');
    if (res.reserves < 0) out.push('Your reserves are overdrawn. Investors get nervous, and that drags on growth.');
    if (!out.length) out.push('Every unlocked aim is on target. Nicely steered.');
    return out;
  }

  root.UI = { EXPLAIN, diagram, skyline, spark, qLabel, esc, quarterInfo, lessonHTML, coach };
})(typeof self !== 'undefined' ? self : this);
