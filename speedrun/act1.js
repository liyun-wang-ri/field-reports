/* Econ Speedrun · Act 1: The Analyst (Standard of Living and Key Economic Indicators).
   Students know nothing about any economy yet. They read, compare and judge economies from indicators.
   Round types:
   - mystery: two unnamed economies; teams buy clues with limited coins, answer questions, and bet on their confidence
   - quick:   one trap card on a common misconception, with a bet
   - formula: teams weight six dimensions to build their own standard-of-living index (kept for later acts)
   Data: figures are those quoted in the Year 6 SOL & KEI notes and tutorial package (World Bank, UNDP, SingStat).
   Check before any public release. */
(function (root) {
  'use strict';

  const PINS = {
    Singapore: { lat: 1.35, lon: 103.8 }, 'Costa Rica': { lat: 9.9, lon: -84.1 }, Estonia: { lat: 59.4, lon: 24.75 }, Uzbekistan: { lat: 41.3, lon: 69.24 }, Norway: { lat: 59.9, lon: 10.75, left: true },
    India: { lat: 28.6, lon: 77.2 }, Tonga: { lat: -21.1, lon: -175.2 }, Malaysia: { lat: 3.1, lon: 101.7, left: true }, Albania: { lat: 41.33, lon: 19.82, left: true }
  };

  const BETS = [{ k: 1, t: 'Hunch', s: '×1' }, { k: 2, t: 'Fairly sure', s: '×2' }, { k: 3, t: 'All in', s: '×3' }];

  const ROUNDS = [
    { id: 'm1', type: 'mystery', title: 'Mission 1 · Two mystery economies', year: '2023',
      per: 6,
      intro: 'Two real economies, names hidden. You have 8 coins to buy clues. Read the questions first: each country description points to a clue that can rule it in or out. Coins you don\'t spend are worth 2 points each, so information has a price.',
      budget: 8,
      clues: [
        { k: 'g', group: 'Economic performance', label: 'Real GDP growth', unit: '%', cost: 1, v: [-2.7, 6.0] },
        { k: 'pi', group: 'Economic performance', label: 'Inflation rate', unit: '%', cost: 1, v: [9.2, 10.0] },
        { k: 'u', group: 'Economic performance', label: 'Unemployment rate', unit: '%', cost: 1, v: [6.4, 8.1] },
        { k: 'rem', group: 'Income from abroad', label: 'Money sent home by workers abroad (% of GDP)', unit: '', cost: 1, v: ['1.2%', 'about 18%'] },
        { k: 'gni', group: 'Material SOL', label: 'GNI per capita (PPP, 2021 int. $)', unit: '', cost: 3, v: ['40,881', '8,826'] },
        { k: 'le', group: 'Non-material SOL', label: 'Life expectancy', unit: ' yrs', cost: 2, v: [79.2, 72.4] },
        { k: 'sch', group: 'Non-material SOL', label: 'Mean years of schooling', unit: ' yrs', cost: 1, v: [13.6, 11.9] },
        { k: 'pm', group: 'Non-material SOL', label: 'PM2.5 air pollution (µg/m³, 2017)', unit: '', cost: 2, v: [6.7, 28.5] },
        { k: 'co2', group: 'Non-material SOL', label: 'CO₂ per person (tonnes)', unit: '', cost: 1, v: [8.9, 3.9] },
        { k: 'hdi', group: 'Composite', label: 'Human Development Index', unit: '', cost: 4, v: [0.905, 0.740] }
      ],
      questions: [
        { id: 'grow', q: 'Which economy grew faster in 2023?', opts: [['A', 'Country A'], ['B', 'Country B']], correct: 'B' },
        { id: 'mat', q: 'Which has the higher material standard of living?', opts: [['A', 'Country A'], ['B', 'Country B']], correct: 'A' },
        { id: 'air', q: 'Which has cleaner air?', opts: [['A', 'Country A'], ['B', 'Country B']], correct: 'A' },
        { id: 'whoA', q: 'Country A is…', opts: [['nz', 'New Zealand'], ['ire', 'Ireland'], ['est', 'Estonia'], ['sg', 'Singapore']], correct: 'est',
          desc: { nz: 'People here live longer than almost anywhere: life expectancy is over 82 years.', ire: 'Profits of big foreign firms push its income per person (GNI per capita, PPP) to about 90,000 a year, among the highest in the world.', est: 'Burns oil shale, a very carbon-heavy rock, to make much of its electricity.', sg: 'Almost everyone who wants a job has one: unemployment was about 2% in 2023.' } },
        { id: 'whoB', q: 'Country B is…', opts: [['vn', 'Vietnam'], ['uz', 'Uzbekistan'], ['eth', 'Ethiopia'], ['bd', 'Bangladesh']], correct: 'uz',
          desc: { vn: 'Kept prices fairly steady in 2023: inflation was only about 3%.', uz: 'Millions of its people work abroad, mostly in Russia, and send part of their wages home.', eth: 'Adults have spent only about 2 to 3 years in school, on average.', bd: 'Its air is among the most polluted in the world.' } }
      ],
      reveal: { names: ['Estonia', 'Uzbekistan'],
        text: 'A is <b>Estonia</b>, a small EU economy. B is <b>Uzbekistan</b>, a fast-growing Central Asian economy where money sent home by workers abroad is worth about 18% of GDP. In 2023 Uzbekistan grew 6% while Estonia <b>shrank</b>, yet Estonia\'s income per person is more than four times higher, people live about 7 years longer and the air is far cleaner. Estonia does emit more CO₂ per person, though, because it burns oil shale for power. Clean air and low CO₂ are different indicators.',
        lesson: 'Growth, inflation and unemployment measure <b>economic performance this year</b>. Living standards depend on the <b>level</b> of income and well-being. A fast-growing economy can still be much poorer. Each wrong option was ruled out by a <b>different</b> clue: New Zealand by life expectancy, Ireland by income per person, Singapore by unemployment; Vietnam by inflation, Ethiopia by schooling, Bangladesh by air pollution.',
        sources: 'UNDP Human Development Report 2025 (HDI, life expectancy, schooling, GNI per capita, 2023, also for New Zealand, Ireland and Ethiopia); World Bank (growth, inflation, unemployment; PM2.5 for 2017, also for Bangladesh; remittances: Uzbekistan about 18% of GDP in 2023, World Bank estimate, Estonia 1.2%); EDGAR/JRC (CO₂, 2023). Descriptions: OECD and EEA on Estonia\'s oil shale power; Singapore Ministry of Manpower (unemployment 1.9% in 2023); Vietnam General Statistics Office (CPI +3.25% in 2023); World Bank on Uzbek migrant workers in Russia.' } },

    { id: 'q1', type: 'quick', gut: 'Easy. GDP went up 10%, so the economy grew 10%. Right? …Right?', title: 'Trap card 1 · Nominal vs real',
      q: 'The Harbour Republic\'s nominal GDP rose by 10% this year. Prices rose by 12%. Did the economy produce more?',
      opts: [['yes', 'Yes, GDP rose by 10%'], ['no', 'No, real output actually fell'], ['same', 'Output stayed exactly the same']], correct: 'no',
      explain: 'Nominal GDP counts both price changes and quantity changes. Take away the 12% price rise and <b>real GDP fell by about 2%</b>. That\'s why growth is always measured with <b>real</b> GDP.' },

    { id: 'q2', type: 'quick', gut: "The economy grew 5%! Surely everyone's a bit better off?", title: 'Trap card 2 · Per capita',
      q: 'Real GDP grew by 5%, but the population grew by 10%. What happened to material standard of living?',
      opts: [['up', 'It rose: the economy grew'], ['down', 'It fell: less output per person'], ['nc', 'You can\'t tell without inflation data']], correct: 'down',
      explain: 'Output grew more slowly than the number of people sharing it, so <b>real GDP per capita fell</b>. The average person has fewer goods and services than before.' },

    { id: 'q3', type: 'quick', gut: "Same GDP per capita means same life. That's what 'per capita' means… isn't it?", title: 'Trap card 3 · Averages hide things',
      q: 'Two countries have the same real GDP per capita. One has a Gini coefficient of 0.25, the other 0.60. Where is the typical citizen likely to be better off?',
      opts: [['low', 'Gini 0.25'], ['high', 'Gini 0.60'], ['same', 'The same: their GDP per capita is equal']], correct: 'low',
      explain: 'Real GDP per capita is an <b>average</b>. With a Gini of 0.60, income is much more concentrated at the top, so most people get far less than the average suggests.' },

    { id: 'q4', type: 'quick', gut: "New jets, more GDP, richer people. I don't see the catch.", title: 'Trap card 4 · What is GDP made of?',
      q: 'GDP rose this year mainly because the government bought a new fleet of fighter jets. Did households\' material standard of living rise?',
      opts: [['yes', 'Yes: GDP per capita rose'], ['notnec', 'Not necessarily: households can\'t consume fighter jets'], ['fell', 'No, it must have fallen']], correct: 'notnec',
      explain: 'Jets raise G, so GDP rises, but households can\'t consume them, so material SOL doesn\'t <b>directly</b> rise. That\'s the trap. Households may still gain in two ways:<br>• <b>Multiplier:</b> workers who build and service the jets spend their income, which becomes others\' income, so C rises later. This is weaker if the jets are imported.<br>• <b>Security:</b> a safer, more stable country can raise <b>non-material</b> SOL in the long run.' },

    { id: 'q5', type: 'quick', gut: 'Fewer unemployed people is always good news. Pop the champagne.', title: 'Trap card 5 · The vanishing jobless',
      q: 'Unemployment fell from 6% to 5%. But it happened because discouraged job-seekers stopped looking for work. Is labour being used better?',
      opts: [['yes', 'Yes, fewer people are unemployed'], ['no', 'No: they simply left the labour force'], ['more', 'Yes, and output must have risen']], correct: 'no',
      explain: 'People who stop looking leave the labour force, so both the top and bottom of the fraction shrink. <b>The rate falls, but no extra labour is being used.</b> Always check what happened to the labour force.' },

    { id: 'm2', type: 'mystery', title: 'Mission 2 · How much richer, really?', year: '2023',
      per: 8,
      intro: 'Two very different economies. Buy clues to name them, then decide whether the usual way of comparing incomes makes the gap look too big or too small. You have 7 coins, so you can\'t buy everything.',
      budget: 7,
      clues: [
        { k: 'exp', group: 'Economy', label: 'Main exports', unit: '', cost: 2, v: ['crude oil and natural gas', 'refined petroleum, medicines, diamonds, IT services'] },
        { k: 'g', group: 'Economic performance', label: 'Real GDP growth', unit: '%', cost: 1, v: [0.1, 9.2] },
        { k: 'pi', group: 'Economic performance', label: 'Inflation rate', unit: '%', cost: 1, v: [5.5, 5.7] },
        { k: 'mkt', group: 'Material SOL', label: 'GDP per capita at market exchange rates (US$)', unit: '', cost: 2, v: ['87,497', '2,530'] },
        { k: 'ppp', group: 'Material SOL', label: 'GDP per capita at PPP (international $)', unit: '', cost: 3, v: ['100,437', '10,323'] },
        { k: 'mac', group: 'Prices', label: 'Price of a Big Mac in US$ (Jan 2024)', unit: '', cost: 1, v: ['$7.14', '$2.59'] },
        { k: 'temp', group: 'Climate', label: 'Average January temperature in the capital', unit: '', cost: 1, v: ['about −2°C', 'about 15°C'] }
      ],
      questions: [
        { id: 'under', q: 'At market exchange rates, does Country B\'s GDP per capita overstate or understate how much people in B can actually buy?', opts: [['over', 'Overstates'], ['under', 'Understates'], ['exact', 'Gets it about right']], correct: 'under' },
        { id: 'why', q: 'Which clue best shows why?', opts: [['mac', 'The price of a Big Mac'], ['g', 'Real GDP growth'], ['exp', 'Main exports']], correct: 'mac' },
        { id: 'gap', q: 'After adjusting for cost of living (PPP), the gap in GDP per capita between A and B…', opts: [['shrink', 'Shrinks'], ['widen', 'Widens'], ['same', 'Stays about the same']], correct: 'shrink' },
        { id: 'heat', q: 'People in A must spend far more than people in B on heating and winter clothing just to stay comfortable. Does this make A\'s GDP per capita, even after PPP, overstate or understate how well off people in A are compared with people in B?', opts: [['over', 'Overstate'], ['under', 'Understate']], correct: 'over' },
        { id: 'whoA', q: 'Country A is…', opts: [['swi', 'Switzerland'], ['lux', 'Luxembourg'], ['nor', 'Norway'], ['den', 'Denmark']], correct: 'nor',
          desc: { swi: 'Its biggest exports are gold, medicines and luxury watches.', lux: 'Has the highest GDP per person in the world, partly because many of its workers live in neighbouring countries and commute in.', nor: 'Earns much of its export income from selling oil and gas, and saves the government\'s share in a national savings fund, the largest in the world.', den: 'Its biggest exports include medicines (such as weight-loss drugs) and wind turbines.' } },
        { id: 'whoB', q: 'Country B is…', opts: [['idn', 'Indonesia'], ['pak', 'Pakistan'], ['ind', 'India'], ['nga', 'Nigeria']], correct: 'ind',
          desc: { idn: 'Its GDP per person is close to US$5,000 a year.', pak: 'Its prices rose more than 30% in a year in 2023, and it needed an emergency loan from the IMF.', ind: 'Its real GDP grew faster than any other large economy\'s in 2023.', nga: 'Crude oil makes up most of what it sells to other countries.' } }
      ],
      reveal: { names: ['Norway', 'India'],
        text: 'A is <b>Norway</b>, B is <b>India</b>. At market exchange rates Norway\'s GDP per person is about <b>35 times</b> India\'s. But a Big Mac costs about $2.59 in India (there it is a chicken burger) against $7.14 in Norway: most things cost far less in India, so each dollar goes further. Adjusted for cost of living (<b>purchasing power parity</b>), the gap shrinks to about <b>10 times</b>. Still huge, but more realistic. Even the PPP figure flatters Norway a little: Norwegians must spend on heating and winter clothing just to stay comfortable. That spending adds to GDP, but it only offsets the cold.',
        lesson: 'Market exchange rates <b>understate</b> living standards where the cost of living is low, so cross-country comparisons use <b>PPP-adjusted real GDP per capita</b>. PPP has limits too: different needs (heating), different baskets (a chicken "Big Mac") and data quality. Your notes use older figures (about 65× and 17×); the 2023 data tells the same story. Each wrong option was ruled out by a different clue: Switzerland and Denmark by exports, Luxembourg by GDP per person; Nigeria by exports, Indonesia by GDP per person, Pakistan by inflation.',
        sources: 'World Bank (GDP per capita at market rates and PPP, real GDP growth and inflation, 2023, as published September 2025); The Economist Big Mac Index, January 2024 (via Visual Capitalist); OEC and WITS (India\'s and Switzerland\'s main exports, 2023); Norwegian Petroleum Directorate and Oslo kommune (oil and gas exports); NBIM (Government Pension Fund Global, the largest sovereign wealth fund); STATEC and ADEM (47% of Luxembourg\'s workers commute from abroad); Nigeria NBS (crude oil about 81% of exports, 2023); IMF (US$3 billion Stand-By Arrangement for Pakistan, July 2023) and Pakistan Bureau of Statistics (inflation 38% in May 2023); World Bank India Development Update, September 2024 (fastest-growing major economy); Norwegian Meteorological Institute (Oslo January normal about −2°C). Exact figures vary by source and year.' } },

    { id: 'q6', type: 'quick', gut: 'A 20% price jump is a 20% price jump. It should hit everyone the same.', title: 'Trap card 6 · Weights in the CPI',
      q: 'World fuel and food prices jump by 20%. Food and fuel make up a much bigger share of the typical basket in Tonga than in Norway. Whose inflation rate rises more?',
      opts: [['tonga', 'Tonga'], ['norway', 'Norway'], ['same', 'The same: prices rose 20% in both']], correct: 'tonga',
      explain: 'The CPI is a <b>weighted</b> basket. The bigger the weight on food and fuel, the more a rise in their prices pushes up the CPI, and so the inflation rate.', pins: ['Tonga'] },

    { id: 'q7', type: 'quick', gut: "S$10 is S$10 wherever you go. Market exchange rates don't lie.", title: 'Trap card 7 · Market exchange rates',
      q: 'A hawker meal costs S$10 in Singapore. A similar meal in Malaysia costs about S$3.40 at market exchange rates. If you compare incomes using market exchange rates, you will…',
      opts: [['over', 'overstate Malaysian living standards'], ['under', 'understate Malaysian living standards'], ['exact', 'get it exactly right']], correct: 'under',
      explain: 'Each ringgit buys more at home than the market exchange rate suggests, because the cost of living is lower. So market-rate comparisons <b>understate</b> Malaysian living standards, and PPP corrects for this.', pins: ['Malaysia'] },

    { id: 'f1', type: 'formula', pins: ['Estonia', 'Albania'], title: 'Final mission · Build your Living Standard formula',
      intro: 'A composite indicator like HDI turns several indicators into <b>one score</b>. But someone has to decide how much each part counts. Now that\'s your team\'s job.',
      steps: ['Each slider is one part of living standards. Set how much it should count: <b>0 = not at all</b>, <b>5 = matters most</b>.',
              'The bars show how <b>Estonia</b> and <b>Albania</b> score out of 100 under your formula. The real data is in the table below.',
              'Agree on a formula your team can <b>defend</b> in class, then save it. There is no right answer, only reasons.'],
      after: 'Your formula is saved. In later acts it becomes how your team\'s country is scored.',
      sources: 'UNDP Human Development Report 2025 (life expectancy, schooling, GNI per capita, 2023); World Bank (PM2.5, 2017); EDGAR/JRC (CO₂, 2023).' }
  ];

  // Build-your-own index: five dimensions, normalised on fixed ranges (income on a log scale, like the HDI).
  const DIMS = [
    { k: 'income', t: 'Income', s: 'GNI per capita (PPP)', f: d => (Math.log(d.gni) - Math.log(1000)) / (Math.log(150000) - Math.log(1000)) },
    { k: 'health', t: 'Health', s: 'life expectancy', f: d => (d.le - 50) / 35 },
    { k: 'edu', t: 'Education', s: 'mean years of schooling', f: d => d.sch / 15 },
    { k: 'air', t: 'Clean air', s: 'low PM2.5 pollution', f: d => (50 - d.pm) / 50 },
    { k: 'carbon', t: 'Low carbon', s: 'low CO₂ per person', f: d => (20 - d.co2) / 20 }
  ];
  const FORMULA_COUNTRIES = [
    { name: 'Estonia', gni: 40881, le: 79.2, sch: 13.6, pm: 6.7, co2: 8.9 },
    { name: 'Albania', gni: 17627, le: 79.6, sch: 10.2, pm: 18.2, co2: 1.4 }
  ];
  const FORMULA_TABLE = [
    ['GNI per capita (PPP, 2021 int. $)', 'gni', v => v.toLocaleString('en')], ['Life expectancy (years)', 'le'], ['Mean years of schooling', 'sch'],
    ['PM2.5 air pollution (µg/m³, 2017)', 'pm'], ['CO₂ per person (tonnes, 2023)', 'co2']
  ];
  // Formula code: one digit (0-5) per dimension, in DIMS order, e.g. "3-4-2-3-5". The code IS the formula,
  // so a team can restore it on any device after clearing their browser data.
  function formulaCode(w) { return DIMS.map(d => Math.max(0, Math.min(5, Math.round(+((w || {})[d.k] ?? 3))))).join('-'); }
  function parseFormulaCode(code) {
    const digits = String(code || '').replace(/[^0-5]/g, '');
    if (digits.length !== DIMS.length) return null;
    return Object.fromEntries(DIMS.map((d, i) => [d.k, +digits[i]]));
  }
  function indexFor(weights, d) {
    let sw = 0, s = 0;
    DIMS.forEach(x => { const w = +weights[x.k] || 0; sw += w; s += w * Math.max(0, Math.min(1, x.f(d))); });
    return sw ? s / sw : 0;
  }

  // ---------- scoring ----------
  // mystery: (10 per right answer − 5 per wrong, or the round's own 'per') × bet, plus 2 per unspent coin (only if the team answered)
  // quick:   +10 × bet if right; −5 × (bet − 1) if wrong
  // formula: +15 for submitting a formula
  function scoreRound(round, ans) {
    if (!ans || !ans.locked) return { pts: 0, right: 0, of: round.questions ? round.questions.length : 1 };
    if (round.type === 'mystery') {
      let right = 0, wrong = 0;
      round.questions.forEach(q => { if (ans.a && ans.a[q.id]) { if (ans.a[q.id] === q.correct) right++; else wrong++; } });
      const spent = (ans.bought || []).reduce((s, k) => s + (round.clues.find(c => c.k === k) || { cost: 0 }).cost, 0);
      const coins = Math.max(0, round.budget - spent);
      const per = round.per || 10;
      const pts = (per * right - per / 2 * wrong) * (ans.bet || 1) + 2 * coins;
      return { pts, right, of: round.questions.length, coins };
    }
    if (round.type === 'quick') {
      const ok = ans.a === round.correct, bet = ans.bet || 1;
      return { pts: ok ? 10 * bet : -5 * (bet - 1), right: ok ? 1 : 0, of: 1 };
    }
    if (round.type === 'formula') return { pts: 15, right: 1, of: 1 };
    return { pts: 0, right: 0, of: 0 };
  }
  // upTo: index of the last REVEALED round (scores never include an unrevealed answer, so nothing leaks before the reveal)
  function totalScore(answers, upTo) { const last = upTo === undefined ? ROUNDS.length - 1 : upTo; return ROUNDS.reduce((s, r, i) => s + (i <= last ? scoreRound(r, (answers || {})[r.id]).pts : 0), 0); }
  function pinsUpTo(i) {
    const out = [];
    ROUNDS.slice(0, i + 1).forEach(r => { ((r.reveal && r.reveal.names) || r.pins || []).forEach(n => { if (PINS[n] && !out.includes(n)) out.push(n); }); });
    return out;
  }

  // Stickers for the career card. Each one rewards a habit worth having, not just a high score.
  const STICKERS = {
    founder: { i: '📜', t: 'Formula Founder', d: 'Saved a Living Standard formula' },
    trap: { i: '🪤', t: 'Trap Dodger', d: 'Got every trap card right' },
    bargain: { i: '🧾', t: 'Bargain Hunter', d: 'Got a whole mission right with 4 or more coins left' },
    roller: { i: '🎲', t: 'High Roller', d: 'Went All in and got everything right' },
    globe: { i: '🧭', t: 'Globetrotter', d: 'Named all four mystery countries' }
  };
  function stickersFrom(answers, formula) {
    answers = answers || {}; const got = {};
    const res = ROUNDS.map(r => ({ r, a: answers[r.id], s: scoreRound(r, answers[r.id]) }));
    if (formula && answers.f1 && answers.f1.locked) got.founder = true;
    const quick = res.filter(x => x.r.type === 'quick');
    if (quick.length && quick.every(x => x.s.right === 1)) got.trap = true;
    if (res.some(x => x.r.type === 'mystery' && x.s.right === x.s.of && (x.s.coins || 0) >= 4)) got.bargain = true;
    if (res.some(x => x.a && x.a.locked && (x.a.bet || 1) === 3 && x.s.right === x.s.of && x.r.type !== 'formula')) got.roller = true;
    const m1 = answers.m1 && answers.m1.a || {}, m2 = answers.m2 && answers.m2.a || {};
    if (m1.whoA === 'est' && m1.whoB === 'uz' && m2.whoA === 'nor' && m2.whoB === 'ind') got.globe = true;
    return got;
  }

  const api = { STICKERS, stickersFrom, formulaCode, parseFormulaCode, ROUNDS, BETS, DIMS, FORMULA_COUNTRIES, FORMULA_TABLE, PINS, indexFor, scoreRound, totalScore, pinsUpTo };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Act1 = api;
})(typeof self !== 'undefined' ? self : this);
