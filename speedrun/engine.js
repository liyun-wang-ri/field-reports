/* Econ Speedrun: Macro engine.
   A deterministic quarterly model of a small, very open, Singapore-like economy ("Harbour Republic").
   Same scenario + same decisions => same results, so every team can simulate locally and only report scores.
   All numbers are a simplified teaching model, not a forecast. Rates are annualised %. */
(function (root) {
  'use strict';

  const TARGETS = {
    growth: { lo: 2, hi: 5, label: '2–5%' },
    inflation: { lo: 0, hi: 3, label: '0–3%' },
    unemployment: { hi: 3.5, label: '≤ 3.5%' }
  };

  // Levers. ad / cost are effects on the AD and cost-push gaps (in model units).
  const LEVERS = {
    fiscal: {
      name: 'Fiscal policy', lagNote: 'works next quarter',
      options: [
        { k: 'tight', t: 'Tighten', s: 'save +1 reserve', ad: -1, res: +1 },
        { k: 'neutral', t: 'Neutral', s: '', ad: 0, res: 0 },
        { k: 'expand', t: 'Expand', s: '−1 reserve', ad: 1, res: -1 },
        { k: 'big', t: 'Big stimulus', s: '−3 reserves', ad: 2.2, res: -3, unlock: 'big' }
      ]
    },
    er: {
      name: 'Exchange-rate policy', lagNote: 'builds up over 2 quarters',
      options: [
        { k: 'app', t: 'Stronger $', s: 'appreciate', ad: -0.6, cost: -1.0 },
        { k: 'steady', t: 'Hold steady', s: '', ad: 0, cost: 0 },
        { k: 'dep', t: 'Weaker $', s: 'depreciate', ad: 0.6, cost: 1.0 }
      ]
    },
    supply: {
      name: 'Supply-side policy', lagNote: 'pays off after 4 quarters',
      options: [
        { k: 'none', t: 'None', s: '', res: 0 },
        { k: 'skills', t: 'Skills', s: 'retraining · −1', res: -1 },
        { k: 'infra', t: 'Infrastructure', s: 'ports, energy · −1', res: -1 }
      ]
    }
  };
  const DEFAULT_POLICY = { fiscal: 'neutral', er: 'steady', supply: 'none' };

  // What unlocks when (quarter index, 0-based). Each unlock pauses the class for a short lesson.
  const UNLOCKS = [
    { q: 0, k: 'growth', title: 'Economic growth + fiscal policy', aims: ['growth'], levers: ['fiscal'],
      lesson: ['Real GDP growth shows how fast output is rising. Your target: 2–5% a year.',
               'Your first lever is fiscal policy: government spending and taxes. Expanding raises AD, but it uses up your reserves.',
               'Your score is the living standard of your citizens. It rises with growth and falls when prices or jobs go wrong.'] },
    { q: 2, k: 'inflation', title: 'Inflation', aims: ['inflation'],
      lesson: ['Inflation is the rate at which the general price level rises. Target: 0–3%.',
               'Too much demand pulls prices up (demand-pull). Higher costs push them up (cost-push).',
               'High inflation now cuts your citizens\' living standard, and so does falling prices (deflation).'] },
    { q: 4, k: 'er', title: 'Exchange-rate policy', levers: ['er'],
      lesson: ['Like Singapore\'s MAS, your central bank does not set interest rates. It manages the exchange rate.',
               'A stronger dollar makes imports cheaper, so imported inflation falls. But exports get dearer, so X and AD fall too.',
               'It takes about two quarters to work fully.'] },
    { q: 7, k: 'unemployment', title: 'Unemployment + Big stimulus', aims: ['unemployment'], levers: ['big'],
      lesson: ['Unemployment is the share of the labour force who want work but cannot find it. Target: 3.5% or less.',
               'When AD falls, firms cut jobs. That is demand-deficient (cyclical) unemployment.',
               'You can now use Big stimulus. Singapore\'s government drew on its past reserves for support packages in 2009 and 2020.'] },
    { q: 11, k: 'supply', title: 'Supply-side policy', levers: ['supply'],
      lesson: ['Supply-side policies raise productive capacity, so AS shifts right. They work slowly: about 4 quarters here.',
               'Skills cut structural unemployment. Infrastructure raises capacity and eases costs.',
               'Each one costs 1 reserve point. Think long term.'] }
  ];

  const AIM_ORDER = ['growth', 'inflation', 'unemployment'];

  // Scenarios may move an unlock earlier or later (e.g. Covid needs Big stimulus at once).
  function unlockQ(u, scenario) { return scenario && scenario.unlockAt && scenario.unlockAt[u.k] !== undefined ? scenario.unlockAt[u.k] : u.q; }
  function unlocksFor(scenario) { return UNLOCKS.map(u => Object.assign({}, u, { q: unlockQ(u, scenario) })).sort((a, b) => a.q - b.q); }
  function unlockedAt(q, scenario) {
    const aims = new Set(), levers = new Set();
    UNLOCKS.forEach(u => { if (unlockQ(u, scenario) <= q) { (u.aims || []).forEach(a => aims.add(a)); (u.levers || []).forEach(l => levers.add(l)); } });
    return { aims, levers };
  }

  // ---------- deterministic RNG ----------
  function rng(seed) {
    let s = (seed >>> 0) || 1;
    return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  }

  // ---------- model ----------
  function newRun(scenario, opts) {
    opts = opts || {};
    return {
      scenarioId: scenario.id, q: 0, seed: opts.seed || 7,
      d: 0, c: 0, cap: 0, struct: 0,
      fisPipe: 0, erPipe: { ad: 0, cost: 0 }, supplyQueue: [],
      reserves: 6, index: 100,
      g: 3, pi: 2, u: 2.8,
      hist: [{ q: -1, g: 3, pi: 2, u: 2.8, index: 100, reserves: 6 }],
      newsDone: {}, // id -> choice
      flags: {},
      ach: {}, streak: { pi: 0, all: 0 },
      log: []
    };
  }

  function optionOf(lever, k) { return LEVERS[lever].options.find(o => o.k === k) || LEVERS[lever].options.find(o => o.k === DEFAULT_POLICY[lever]); }

  // Advance one quarter. policy = {fiscal, er, supply}; newsChoices = {newsId: choiceKey}
  function step(run, scenario, policy, newsChoices) {
    const q = run.q;
    const unl = unlockedAt(q, scenario);
    policy = Object.assign({}, DEFAULT_POLICY, policy || {});
    if (!unl.levers.has('fiscal')) policy.fiscal = 'neutral';
    if (!unl.levers.has('er')) policy.er = 'steady';
    if (!unl.levers.has('supply')) policy.supply = 'none';
    if (policy.fiscal === 'big' && !unl.levers.has('big')) policy.fiscal = 'expand';
    const notes = [];

    // 1. scenario shocks for this quarter (impulses into persistent gaps)
    run.d *= 0.7; run.c *= 0.6;
    const ev = (scenario.events || []).filter(e => e.q === q);
    const K = scenario.shockScale || 1.6; // scenario shocks hit harder than one policy step
    ev.forEach(e => { run.d += K * (e.ad || 0); run.c += K * (e.cost || 0); run.cap += e.cap || 0; run.struct += e.struct || 0; });

    // 2. news items (choices or automatic)
    (scenario.news || []).filter(n => n.q === q).forEach(n => {
      const choice = (newsChoices && newsChoices[n.id]) || (n.choices ? n.choices[n.default || 0].k : 'auto');
      const eff = n.choices ? n.choices.find(x => x.k === choice) || n.choices[0] : n;
      run.newsDone[n.id] = choice;
      run.d += eff.ad || 0; run.c += eff.cost || 0; run.cap += eff.cap || 0; run.struct += eff.struct || 0;
      run.reserves += eff.res || 0;
      if (eff.later) run.supplyQueue.push({ due: q + eff.later.after, ad: eff.later.ad || 0, cap: eff.later.cap || 0, struct: eff.later.struct || 0, cost: eff.later.cost || 0, res: eff.later.res || 0, note: eff.later.note });
    });

    // 3. policy, with lags: fiscal acts 50% now, 50% next quarter; ER builds over two quarters.
    const f = optionOf('fiscal', policy.fiscal), e = optionOf('er', policy.er), sp = optionOf('supply', policy.supply);
    const fisNow = 0.5 * f.ad + run.fisPipe; run.fisPipe = 0.5 * f.ad;
    run.erPipe.ad = 0.5 * run.erPipe.ad + 0.5 * e.ad; run.erPipe.cost = 0.5 * run.erPipe.cost + 0.5 * e.cost;
    run.reserves += f.res + sp.res;
    if (sp.k === 'skills') run.supplyQueue.push({ due: q + 4, struct: -0.35, cap: 0.15, note: 'A skills programme from a year ago pays off: structural unemployment falls.' });
    if (sp.k === 'infra') run.supplyQueue.push({ due: q + 4, cap: 0.35, cost: -0.15, note: 'Infrastructure from a year ago is ready: capacity rises and costs ease.' });
    run.supplyQueue = run.supplyQueue.filter(x => {
      if (x.due !== q) return true;
      run.cap += x.cap || 0; run.struct = Math.max(0, run.struct + (x.struct || 0)); run.c += x.cost || 0; run.d += x.ad || 0; run.reserves += x.res || 0;
      if (x.note) notes.push(x.note);
      return false;
    });

    // 4. outcomes
    const R = rng(run.seed * 1009 + q * 7919);
    const noise = () => (R() - 0.5) * 0.4;
    const AD = run.d + fisNow + run.erPipe.ad;
    const cost = run.c + run.erPipe.cost;
    const overdrawn = run.reserves < 0 ? Math.min(2, -run.reserves * 0.3) : 0; // borrowing scares investors
    const g = 3 + 1.0 * AD - 0.5 * cost + run.cap - overdrawn + noise();
    const piTarget = 2 + 0.55 * AD + 0.9 * cost - 0.3 * run.cap;
    const pi = 0.45 * run.pi + 0.55 * piTarget + noise() * 0.5;
    const uTarget = Math.max(1.5, 2.8 - 0.5 * AD + 0.15 * cost + run.struct - 0.1 * run.cap);
    const u = run.u + 0.55 * (uTarget - run.u) + noise() * 0.3;

    run.g = round1(g); run.pi = round1(pi); run.u = round1(Math.max(1.2, u));

    // 5. score: living-standard index grows with growth, minus pain from unlocked aims
    const aimsNow = unl.aims;
    let pain = 0;
    if (aimsNow.has('inflation')) pain += 0.9 * Math.max(0, run.pi - 3) + 1.2 * Math.max(0, -run.pi);
    if (aimsNow.has('unemployment')) pain += 1.0 * Math.max(0, run.u - 3.5);
    if (aimsNow.has('growth')) pain += 0.5 * Math.max(0, run.g - 6); // overheating
    if (run.reserves < 0) pain += 0.5;
    const w = run.g - pain;
    run.index = +(run.index * (1 + w / 400)).toFixed(2);

    // 6. achievements
    const met = aimMet(run, aimsNow);
    run.streak.pi = aimsNow.has('inflation') && met.inflation ? run.streak.pi + 1 : 0;
    run.streak.all = met.count === aimsNow.size ? run.streak.all + 1 : 0;
    const got = [];
    const award = (k) => { if (!run.ach[k]) { run.ach[k] = q; got.push(k); } };
    if (run.streak.pi >= 6) award('steady');
    if (run.reserves >= 10) award('rainy');
    if (run.streak.all >= 4 && aimsNow.size === 3) award('balanced');
    if (ev.some(x => (x.ad || 0) <= -2) && run.u <= 3.5 && aimsNow.has('unemployment')) award('cushion');
    if (run.supplyQueue.length >= 3) award('builder');

    run.hist.push({ q, g: run.g, pi: run.pi, u: run.u, index: run.index, reserves: run.reserves, policy: Object.assign({}, policy), AD: +AD.toFixed(2), cost: +cost.toFixed(2) });
    run.q = q + 1;
    return { q, g: run.g, pi: run.pi, u: run.u, index: run.index, reserves: run.reserves, met, notes, events: ev, achievements: got, AD, cost };
  }

  function aimMet(run, aims) {
    const r = { count: 0 };
    AIM_ORDER.forEach(k => {
      if (!aims.has(k)) return;
      const v = k === 'growth' ? run.g : k === 'inflation' ? run.pi : run.u, t = TARGETS[k];
      r[k] = (t.lo === undefined || v >= t.lo) && v <= t.hi; if (r[k]) r.count++;
    });
    return r;
  }
  function round1(x) { return Math.round(x * 10) / 10; }

  // The Autopilot rival: never improvises. Neutral budget, steady exchange rate, no supply-side,
  // and it accepts the default option on every news item.
  function autopilotRun(scenario, seed) {
    const r = newRun(scenario, { seed: seed || 7 });
    for (let i = 0; i < scenario.quarters; i++) step(r, scenario, DEFAULT_POLICY, {});
    return r;
  }

  const ACHIEVEMENTS = {
    steady: { t: 'Steady Hand', d: 'Inflation on target for 6 quarters in a row' },
    rainy: { t: 'Rainy-Day Fund', d: 'Built reserves up to 10' },
    balanced: { t: 'Triple Balance', d: 'All three aims on target for 4 quarters running' },
    cushion: { t: 'Soft Landing', d: 'Kept unemployment on target in the quarter a big demand shock hit' },
    builder: { t: 'Nation Builder', d: 'Three supply-side projects in the pipeline at once' }
  };

  const api = { TARGETS, LEVERS, DEFAULT_POLICY, UNLOCKS, AIM_ORDER, ACHIEVEMENTS, unlockedAt, unlocksFor, newRun, step, autopilotRun, aimMet, rng };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Engine = api;
})(typeof self !== 'undefined' ? self : this);
