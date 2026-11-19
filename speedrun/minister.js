/* Econ Speedrun Act 4 · The Minister: formula briefing, revision penalty and six-part scoring.
   Needs engine.js (Engine.DIMS, formulaScore, revisionPenalty) and fx.js (FX.profile). */
(function (root) {
  'use strict';
  const E = root.Engine, esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const BLURB = {
    income: 'grows with real GDP', health: 'income and clean air', edu: 'skills projects that finish',
    air: 'falls as output grows', carbon: 'falls as output grows', jobs: 'unemployment ≤ 3.5%, inflation 0–3%'
  };

  function code(w) { return E.DIMS.map(d => Math.max(0, Math.min(5, Math.round(+w[d.k] || 0)))).join('-'); }
  function parse(c) {
    const digits = String(c || '').replace(/[^0-5]/g, '');
    if (digits.length !== 5 && digits.length !== 6) return null;
    const w = {}; E.DIMS.slice(0, 5).forEach((d, i) => { w[d.k] = +digits[i]; });
    if (digits.length === 6) w.jobs = +digits[5];
    return w;
  }
  // The formula saved in the student's profile (Act 1 or Act 3), if any.
  function fromProfile() {
    const p = (root.FX && root.FX.profile && root.FX.profile()) || {};
    if (p.formula && E.DIMS.slice(0, 5).every(d => p.formula[d.k] !== undefined)) return Object.assign({}, p.formula);
    if (p.formulaCode) return parse(p.formulaCode);
    return null;
  }
  // F = {w, orig, confirmed}. orig = the saved formula (null if starting fresh).
  function init(saved) {
    if (saved && saved.w) return saved;
    const orig = fromProfile();
    const w = {}; E.DIMS.forEach(d => { w[d.k] = orig && orig[d.k] !== undefined ? orig[d.k] : 3; });
    return { w, orig, confirmed: false };
  }
  const penalty = F => E.revisionPenalty(F.orig, F.w);
  function score(run, ap, F) {
    const me = E.formulaScore(run.dims, F.w), auto = E.formulaScore(ap.dims, F.w), pen = penalty(F);
    return { me, auto, pen, margin: me - auto - pen };
  }

  function briefing(F, msg) {
    const pen = penalty(F);
    const rows = E.DIMS.map(d => {
      const o = F.orig && F.orig[d.k] !== undefined ? F.orig[d.k] : null, v = F.w[d.k];
      const far = o !== null && Math.abs(v - o) > 1;
      return `<div class="mrow ${far ? 'far' : ''}"><div class="mlab"><b>${d.e} ${d.t}</b><span class="tiny mute">${BLURB[d.k]}</span></div>
        <div class="msteps">${[0, 1, 2, 3, 4, 5].map(n => `<button data-w="${d.k}" data-n="${n}" class="${n === v ? 'sel' : ''} ${n === o ? 'was' : ''}">${n}</button>`).join('')}</div></div>`;
    }).join('');
    return `<div class="brief">
      <div class="pill hot">Act 4 · The Minister</div>
      <h1 style="margin-top:10px">Minister's briefing</h1>
      <div class="card"><p style="margin:0">You run the Harbour Republic for 20 quarters. <b>Your score is your own Living Standard formula</b>, applied to your economy and to the Autopilot's. Beat the Autopilot by your own measure.</p></div>
      ${F.orig ? `<div class="card"><b>Your saved formula: <span class="disp">${code(Object.assign({}, F.orig, F.orig.jobs === undefined ? { jobs: F.w.jobs } : {}))}</span></b>
        <p class="small mute" style="margin:6px 0 0">${F.orig.jobs === undefined ? 'Your code has 5 digits, so set Jobs & prices freely. ' : ''}You may revise it. Moving a weight by 1 is free. Every step beyond that costs <b>0.25 points</b>: ministers who rewrite their targets lose some trust.</p></div>`
        : `<div class="card"><p class="small" style="margin:0">No saved formula on this device. Type your formula code from Act 1 or Act 3, or set the weights now (all start at 3).</p></div>`}
      <div class="card"><div class="row"><h3 style="font-size:15px">Weights (0 = ignore, 5 = matters most)</h3><span class="spacer"></span>${F.orig ? `<span class="pill ${pen ? 'hot' : 'ok'}">${pen ? '−' + pen.toFixed(2) + ' pts' : 'no penalty'}</span>` : ''}</div>
        ${rows}${F.orig ? '<p class="tiny mute" style="margin:6px 0 0">The outlined number is your saved weight.</p>' : ''}</div>
      <div class="card"><div class="row"><input id="fcode" class="fcode" maxlength="11" placeholder="e.g. 3-4-2-3-5-4" autocomplete="off"><button class="btn ghost" id="fload">Use this code</button></div>
        <span class="small" id="fmsg" style="color:var(--red)">${esc(msg || '')}</span></div>
      <div class="row" style="margin:14px 0 30px"><button class="btn" id="fok">Confirm formula ${code(F.w)} ✓</button></div></div>`;
  }
  function bindBriefing(el, F, rerender, done) {
    el.querySelectorAll('[data-w]').forEach(b => b.onclick = () => { F.w[b.dataset.w] = +b.dataset.n; rerender(); });
    el.querySelector('#fload').onclick = () => {
      const w = parse(el.querySelector('#fcode').value);
      if (!w) return rerender('Codes have 5 or 6 digits from 0 to 5.');
      F.orig = w; E.DIMS.forEach(d => { F.w[d.k] = w[d.k] !== undefined ? w[d.k] : 3; }); rerender();
    };
    el.querySelector('#fok').onclick = () => {
      if (!E.DIMS.some(d => F.w[d.k] > 0)) return rerender('Give at least one dimension some weight.');
      F.confirmed = true;
      try { if (root.FX) root.FX.updateProfile({ formula: Object.assign({}, F.w), formulaCode: code(F.w) }); } catch (e) {}
      done();
    };
  }

  // Six mini dimension chips: you vs Autopilot.
  function dimChips(run, ap, F) {
    return `<div class="dchips">${E.DIMS.map(d => {
      const v = run.dims[d.k], a = ap.dims[d.k], df = +(v - a).toFixed(1), wt = F.w[d.k];
      return `<div class="dchip ${wt ? '' : 'off'}"><span class="tiny">${d.e} ${d.s} <b class="wt">×${wt}</b></span><b>${v.toFixed(1)}</b><span class="tiny ${df > 0 ? 'up' : df < 0 ? 'dn' : 'mute'}">${df > 0 ? '▲' + df : df < 0 ? '▼' + (-df) : 'level'}</span></div>`;
    }).join('')}</div>`;
  }

  root.Minister = { init, code, parse, fromProfile, penalty, score, briefing, bindBriefing, dimChips, BLURB };
})(typeof self !== 'undefined' ? self : this);
