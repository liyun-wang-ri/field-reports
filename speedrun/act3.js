/* Econ Speedrun · Act 3: The Crisis Doctor (Macroeconomic Aims and Issues).
   Follows the Year 6 macro aims notes in order: growth (actual, potential, recession, inclusive growth),
   unemployment (cyclical, structural, frictional, full employment, hysteresis), inflation (demand-pull,
   cost-push, who gains and who loses) and deflation. Ends by adding a sixth "jobs & prices" dimension
   to each team's Act 1 Living Standard formula, ready for Act 4.
   Round types: call (news cards + questions, optional pairing of each card with its own question),
   quick (trap card), mystery (two unnamed patients, clues bought with coins), formula (jobs & prices).
   Every real-world figure carries its source. Check before any public release. */
(function (root) {
  'use strict';

  const PINS = {
    Germany: { lat: 51.52, lon: 6.93, left: true }, 'South Africa': { lat: -25.75, lon: 28.19 },
    'Sri Lanka': { lat: 6.93, lon: 79.85 }, 'United States': { lat: 38.9, lon: -77.04 },
    Argentina: { lat: -34.6, lon: -58.38, left: true }, 'Hong Kong': { lat: 22.3, lon: 114.17 },
    Estonia: { lat: 59.4, lon: 24.75 }, Albania: { lat: 41.33, lon: 19.82, left: true }
  };
  const BETS = [{ k: 1, t: 'Hunch', s: '×1' }, { k: 2, t: 'Fairly sure', s: '×2' }, { k: 3, t: 'All in', s: '×3' }];
  const GROWTH = [['actual', 'Actual growth'], ['potential', 'Potential growth'], ['none', 'No growth: only prices rise']];
  const UNEMP = [['cyc', 'Cyclical (demand-deficient)'], ['str', 'Structural'], ['fri', 'Frictional']];
  const WINLOSE = [['gain', '📈 Gains'], ['lose', '📉 Loses']];

  const ROUNDS = [
    { id: 'g1', type: 'call', pair: true, tab: 'Triage', title: 'Triage 1 · What kind of growth?',
      intro: 'Four things happen in the Harbour Republic. Which kind of growth does each one bring: actual growth (more output now), potential growth (more capacity to produce), or none at all?',
      gut: 'More stuff is more stuff. It\'s all just "growth". Why does it need three names?',
      per: 4,
      cards: [
        { head: 'Story 1 · The new port', body: 'A new deep-water port doubles how much cargo the Harbour Republic can handle, and a training scheme makes workers more productive.' },
        { head: 'Story 2 · Shoppers are back', body: 'The economy is in a slump with many idle workers. Then shoppers regain confidence, shops reorder and factories call their workers back.' },
        { head: 'Story 3 · Spending at full stretch', body: 'Every worker and machine is already in use. The government keeps spending more anyway, but firms can\'t find anyone or anything to make more with.' },
        { head: 'Story 4 · Cheaper oil', body: 'The world price of oil falls. Firms\' costs drop, so they are willing to produce more at every price level.' }
      ],
      questions: [
        { id: 'a', q: 'Story 1 brings…', opts: GROWTH, correct: 'potential' },
        { id: 'b', q: 'Story 2 brings…', opts: GROWTH, correct: 'actual' },
        { id: 'c', q: 'Story 3 brings…', opts: GROWTH, correct: 'none' },
        { id: 'd', q: 'Story 4 brings…', opts: GROWTH, correct: 'actual' }
      ],
      reveal: {
        text: '<b>Potential growth</b> is a rise in productive capacity: more or better resources, so AS shifts right and Yf rises (story 1). <b>Actual growth</b> is a rise in real output, from a rise in AD with spare capacity (story 2) or a fall in costs that shifts AS down (story 4). At full employment, more AD only raises <b>prices</b> (story 3): the economy is <b>overheating</b>.',
        lesson: '<b>Sustained</b> growth needs both: AD keeps rising <i>and</i> AS keeps shifting right, so output can grow without inflation.' } },

    { id: 't1', type: 'quick', tab: 'Trap card', title: 'Trap card 1 · Slowdown or recession?',
      gut: 'Growth fell from 5% to 2%. Growth fell! That\'s a recession. Sound the alarm.',
      q: 'Growth in the Harbour Republic slows from 5% to 2% a year. Is the economy in recession?',
      opts: [['yes', 'Yes: growth has fallen'], ['no', 'No: real GDP is still rising, just more slowly'], ['cant', 'Can\'t tell without the inflation rate']], correct: 'no',
      explain: 'A <b>recession</b> is at least two quarters in a row of <b>falling</b> real GDP. Slower growth means real GDP is still rising, only by less. That\'s a <b>slowdown</b>, and it can still cost jobs, but it isn\'t a recession.' },

    { id: 'u1', type: 'call', pair: true, tab: 'Triage', title: 'Triage 2 · What kind of unemployment?',
      intro: 'Four people out of work. Each needs a different cure, so first name the kind of unemployment.',
      gut: 'No job is no job. Unemployment is unemployment. Next patient, please.',
      per: 4,
      cards: [
        { pin: 'Germany', head: 'The last coal mine in the Ruhr closes', body: 'In December 2018 Germany closed Prosper-Haniel, its last hard-coal mine, because imported coal was cheaper. Its last 1,500 miners clocked off for good.' },
        { head: 'Mira, fresh graduate', body: 'Mira has just finished university. She has two job offers and spends two months choosing between them.' },
        { head: 'The furniture factory', body: 'In a recession, households stop buying sofas. A Harbour furniture maker lays off half its workers.' },
        { head: 'Three years later', body: 'Workers who lost their jobs in a recession have been out of work for three years. Their skills are out of date, so even after the economy recovers, firms won\'t hire them.' }
      ],
      questions: [
        { id: 'a', q: 'The Ruhr miners face…', opts: UNEMP, correct: 'str' },
        { id: 'b', q: 'Mira is…', opts: UNEMP, correct: 'fri' },
        { id: 'c', q: 'The furniture workers face…', opts: UNEMP, correct: 'cyc' },
        { id: 'd', q: 'Three years later, those workers face…', opts: UNEMP, correct: 'str' }
      ],
      reveal: { names: ['Germany'],
        text: '<b>Structural:</b> demand for coal miners fell for good, and their skills don\'t match the jobs on offer. German hard-coal mines employed 600,000 people in the 1950s; by 2017 only 4,500 were left. <b>Frictional:</b> Mira is between jobs while she searches. It\'s short and voluntary. <b>Cyclical:</b> the furniture workers lost their jobs because AD fell. <b>Hysteresis:</b> cyclical unemployment that lasts too long turns <b>structural</b>, as skills fade. That cuts productive capacity, so AS shifts left.',
        lesson: 'Different causes, different cures: more AD helps cyclical unemployment, but structural unemployment needs retraining or help to move.',
        sources: 'Dawn and AFP (closure date, 1,500 workers, cheaper imports); Clean Energy Wire (600,000 miners in the 1950s, 4,500 in 2017).' } },

    { id: 't2', type: 'quick', tab: 'Trap card', title: 'Trap card 2 · Full employment',
      gut: 'Full employment means everyone has a job. Zero unemployment. It\'s right there in the name.',
      q: 'Harbour Republic unemployment is 2%. Everyone counted is either between jobs or retraining for a new industry. Has it reached full employment?',
      opts: [['zero', 'No: full employment means 0% unemployment'], ['five', 'No: it needs to reach 5% first'], ['yes', 'Yes: full employment still has some frictional and structural unemployment']], correct: 'yes',
      explain: '<b>Full employment</b> means there is no <b>cyclical</b> (demand-deficient) unemployment. Some frictional unemployment is unavoidable, and even useful, because people need time to find the right job. The notes put the natural rate at about 2%.' },

    { id: 'p1', type: 'call', tab: 'Patient file', title: 'Patient 1 · South Africa',
      intro: 'Read the patient\'s chart, then make the diagnosis.',
      gut: 'Lots of unemployment? Easy: the economy needs more spending. Boost AD and everyone gets a job.',
      per: 5,
      cards: [
        { pin: 'South Africa', head: 'Jobless for a generation', body: 'Official unemployment was 32.1% at the end of 2023, and it hasn\'t fallen below 20% since 2000, through booms and slumps alike. Among 15 to 24-year-olds it was 58%.' },
        { head: 'Growth, but not for everyone', body: 'The economy grew 0.6% in 2023. Its Gini coefficient is about 0.62, one of the highest in the world.' }
      ],
      questions: [
        { id: 'type', q: 'Unemployment stays high through booms and slumps. The main type is…', opts: UNEMP, correct: 'str' },
        { id: 'incl', q: 'Is South Africa\'s growth inclusive?', opts: [['no', 'No: the gains are not widely shared and many are shut out of work'], ['yes', 'Yes: any growth helps everyone']], correct: 'no' },
        { id: 'cure', q: 'Which treatment best fits this kind of unemployment?', opts: [['ad', 'Boost AD with more spending'], ['wait', 'Wait: it will fix itself'], ['skills', 'Education and skills training']], correct: 'skills' },
        { id: 'hys', q: 'If young people stay jobless for years, the long-run risk is…', opts: [['hys', 'Skills fade, so AS shifts left (hysteresis)'], ['pi', 'Prices fall'], ['x', 'Exports rise']], correct: 'hys' }
      ],
      reveal: { names: ['South Africa'],
        text: 'Unemployment that stays high in good years and bad isn\'t mainly <b>cyclical</b>. Many job-seekers lack the skills, or live too far from, the jobs that exist: that\'s <b>structural</b> unemployment. With a Gini near 0.62 and so many young people out of work, growth isn\'t <b>inclusive</b>. Boosting AD alone would mostly help people who already have the right skills.',
        lesson: 'Inclusive growth needs sustained growth <b>and</b> falling inequality. The notes\' cures: skills upgrading, better public education, and support for those left behind.',
        sources: 'Stats SA Quarterly Labour Force Survey Q4 2023 and GDP Q4 2023 (unemployment 32.1%, growth 0.6%); GroundUp, from Stats SA (above 20% since 2000; youth 58% in 2023); OECD Economic Survey of South Africa 2025 (Gini 0.618, 2017 data).' } },

    { id: 'm1', type: 'mystery', tab: 'Case file', title: 'Patients 2 and 3 · Same fever, different causes', year: '2022',
      per: 8, budget: 6,
      intro: 'Two patients, both running a high inflation fever in 2022. Buy clues to work out <b>what is causing it</b> in each. Coins you don\'t spend are worth 2 points each.',
      gut: 'Prices up is prices up. Same disease, same cure. Let\'s just give them both the same medicine.',
      clues: [
        { k: 'pi', group: 'Vital signs', label: 'Peak inflation in 2022', unit: '', cost: 1, v: ['69.8% (September)', '9.1% (June)'] },
        { k: 'y', group: 'Vital signs', label: 'Output and jobs in 2022', unit: '', cost: 2, v: ['GDP fell 7.8%, the deepest fall on record', 'Still growing: 372,000 jobs added in June alone'] },
        { k: 'dem', group: 'Demand side', label: 'What happened to spending?', unit: '', cost: 2, v: ['Shoppers squeezed; firms shut by shortages', 'Three pandemic relief packages, including cheques paid straight to households'] },
        { k: 'sup', group: 'Supply side', label: 'What happened to costs?', unit: '', cost: 2, v: ['Currency collapsed, so imported fuel, food and medicine cost far more; fuel queues and power cuts', 'Snarled global supply chains; petrol above $5 a gallon'] }
      ],
      questions: [
        { id: 'a', q: 'Country A\'s inflation is mainly…', opts: [['dp', 'Demand-pull'], ['cp', 'Cost-push'], ['both', 'Both, about equally']], correct: 'cp' },
        { id: 'b', q: 'Country B\'s inflation is mainly…', opts: [['dp', 'Demand-pull'], ['cp', 'Cost-push'], ['both', 'Both, about equally']], correct: 'both' },
        { id: 'stag', q: 'Which patient has stagflation (rising prices and falling output)?', opts: [['A', 'Country A'], ['B', 'Country B']], correct: 'A' },
        { id: 'whoA', q: 'Country A is…', opts: [['pk', 'Pakistan'], ['eg', 'Egypt'], ['lk', 'Sri Lanka'], ['gh', 'Ghana']], correct: 'lk',
          desc: { pk: 'Floods covered about a third of the country in 2022, yet its economy still grew that year.', eg: 'Its pound lost about half its value against the US dollar from early 2022 to early 2023, but the economy kept growing.', lk: 'An island nation that defaulted on its foreign debt in 2022 and ran short of dollars to pay for imports.', gh: 'West Africa\'s gold and cocoa giant. It defaulted on its foreign debt in December 2022, but its economy still grew that year.' } },
        { id: 'whoB', q: 'Country B is…', opts: [['uk', 'United Kingdom'], ['us', 'United States'], ['ca', 'Canada'], ['au', 'Australia']], correct: 'us',
          desc: { uk: 'Inflation peaked at 11.1% in October 2022.', us: 'The world\'s biggest economy, where petrol prices are quoted per gallon.', ca: 'Inflation peaked at 8.1% in June 2022.', au: 'Inflation peaked at 7.8% at the end of 2022.' } }
      ],
      reveal: { names: ['Sri Lanka', 'United States'], diagrams: [['🇱🇰 Sri Lanka: costs rise (AS up)', 'asUp'], ['🇺🇸 United States: AD right and AS up', 'combo']],
        text: 'A is <b>Sri Lanka</b>. A collapsing rupee, fuel shortages and power cuts pushed up costs: <b>cost-push</b> and <b>import-induced</b> inflation, with output falling at the same time, which is <b>stagflation</b>. B is the <b>United States</b>. Pandemic relief money and a fast reopening pushed AD up (<b>demand-pull</b>), while snarled supply chains and petrol prices pushed costs up (<b>cost-push</b>). Its jobs market kept growing.',
        lesson: 'In real economies demand-pull and cost-push often <b>interact</b>, and the cure depends on the cause. Squeezing AD fights demand-pull inflation, but against cost-push inflation it deepens the fall in output.',
        sources: 'Central Bank of Sri Lanka Annual Report 2022 (inflation 69.8% in September 2022; GDP −7.8%; rupee depreciation, supply shortages); Sri Lanka Department of Census and Statistics via news reports (fuel shortages and power cuts); US Bureau of Labor Statistics via Reuters (CPI 9.1% in June 2022, 372,000 jobs); The Guardian (stimulus packages); AAA via Reuters (petrol above $5). Country descriptions: ONS (UK peak 11.1%), Statistics Canada (8.1%), Australian Bureau of Statistics (7.8%); news reports of the 2022 defaults in Sri Lanka and Ghana, Pakistan\'s 2022 floods and Egypt\'s currency.' } },

    { id: 'c1', type: 'call', pair: true, tab: 'Patient file', title: 'Patient 4 · Argentina, 2023: who wins, who loses?',
      intro: 'Prices in Argentina rose 211.4% in 2023, the highest rate in 32 years. Inflation doesn\'t hurt everyone equally. Who gains and who loses?',
      gut: 'Inflation is bad. So it\'s bad for everyone. Everyone loses. Sad face for all four.',
      // Short versions for the phone's story mode (each screen readable in a few seconds)
      story: { line: 'Prices more than tripled in a year. Four people. Who wins, who loses?', tiles: [['🇦🇷', '211%', 'inflation in 2023']], gut: 'Inflation is bad, so everyone loses. Right?' },
      per: 4,
      cards: [
        { pin: 'Argentina', emo: '👵', head: 'Señora Paz, retired', body: 'She lives on a fixed pension that is only raised a few times a year.', short: 'Lives on a fixed pension, raised only a few times a year.' },
        { emo: '🏠', head: 'The Gómez family', body: 'They took out a large loan in pesos, at a fixed interest rate, to buy their flat.', short: 'Owe a big fixed-rate loan in pesos for their flat.' },
        { emo: '🏦', head: 'Diego, the saver', body: 'He keeps his savings in pesos in a bank account that pays far less interest than the inflation rate.', short: 'Keeps his savings in pesos, earning far less than inflation.' },
        { emo: '🏪', head: 'Carla\'s corner shop', body: 'She raises her prices every week, faster than her own costs go up.', short: 'Raises her prices every week, faster than her costs rise.' }
      ],
      questions: [
        { id: 'a', q: 'Señora Paz…', short: 'Gain or lose?', opts: WINLOSE, correct: 'lose', why: 'Her pension stays the same while prices more than triple, so each payment buys far less. Fixed-income earners lose.' },
        { id: 'b', q: 'The Gómez family…', short: 'Gain or lose?', opts: WINLOSE, correct: 'gain', why: 'Their loan is fixed in pesos. As prices and wages rise, the same debt is worth much less in real terms. Debtors gain; their bank loses.' },
        { id: 'c', q: 'Diego…', short: 'Gain or lose?', opts: WINLOSE, correct: 'lose', why: 'His interest is far below inflation, so his savings buy less every month. Savers and lenders lose.' },
        { id: 'd', q: 'Carla…', short: 'Gain or lose?', opts: WINLOSE, correct: 'gain', why: 'Her prices rise faster than her costs, so her profit grows, at least until her suppliers and staff catch up. Variable-income earners can gain.' }
      ],
      reveal: { names: ['Argentina'],
        takeaway: 'Inflation quietly moves money from lenders and fixed incomes to borrowers and fast price-raisers.',
        why: ['Fixed incomes buy less each month.', 'Debts shrink in real terms, so borrowers gain and lenders lose.', 'Prices rising faster than costs means more profit, for a while.'],
        text: 'Inflation <b>redistributes income arbitrarily</b>. <b>Fixed-income earners</b> like pensioners lose, because their money buys less each month. <b>Debtors</b> with fixed-rate loans gain, because they repay with money that is worth less; their <b>creditors</b>, and savers like Diego, lose. Sellers whose prices rise faster than their costs can gain, at least for a while. In Argentina, wages tended to catch up with prices only later, and some people even swapped goods directly instead of using pesos.',
        lesson: 'High and unstable inflation also brings shoe-leather and menu costs, and in the worst cases people stop trusting money altogether, which is the breakdown of the functions of money.',
        sources: 'INDEC via AP and Buenos Aires Times (211.4% in 2023, highest in 32 years); AFP via Kuwait Times (wages catching up later); Philippine Daily Inquirer (bartering in Argentina).' } },

    { id: 't3', type: 'quick', tab: 'Trap card', title: 'Trap card 3 · Falling inflation',
      gut: 'Inflation fell from 6% to 2%, so prices fell. Things are cheaper now. Hooray!',
      q: 'Inflation in the Harbour Republic falls from 6% to 2%. What happened to prices?',
      opts: [['slower', 'They still rose, just more slowly'], ['fell', 'They fell'], ['same', 'They stayed the same']], correct: 'slower',
      explain: 'A lower but positive inflation rate is <b>disinflation</b>: prices are still rising, only more slowly. Prices only fall when inflation is <b>negative</b>, which is <b>deflation</b>.' },

    { id: 'p2', type: 'call', tab: 'Patient file', title: 'Patient 5 · Hong Kong, 1998 to 2004', diagram: 'adL',
      intro: 'Falling prices sound like good news. Read this chart before you decide.',
      gut: 'Prices falling for five years? That\'s a shopper\'s paradise. Where\'s the problem?',
      per: 5,
      cards: [
        { pin: 'Hong Kong', head: 'The bubble bursts', body: 'After the 1997 Asian financial crisis, property prices fell by about 60% from their peak. The economy shrank 5.1% in 1998.' },
        { head: 'Five years of falling prices', body: 'Consumer prices fell for 68 months in a row, from November 1998 to June 2004, about 14% in total. Unemployment peaked at 8.6% in 2003.' }
      ],
      questions: [
        { id: 'cause', q: 'What started this deflation?', opts: [['as', 'AS rose: costs fell and capacity grew'], ['ad', 'AD fell: spending collapsed']], correct: 'ad' },
        { id: 'shift', q: 'On the AD/AS diagram, that\'s…', opts: [['asR', 'AS shifts right'], ['adR', 'AD shifts right'], ['adL', 'AD shifts left']], correct: 'adL' },
        { id: 'why', q: 'Why is this kind of deflation harmful?', opts: [['rich', 'Money buys more, so everyone is better off'], ['spiral', 'People wait for lower prices, so spending falls further'], ['x', 'It makes exports dearer']], correct: 'spiral' },
        { id: 'debt', q: 'For a family with a big mortgage, falling prices and wages make the debt…', opts: [['lighter', 'Lighter in real terms'], ['same', 'No different'], ['heavier', 'Heavier in real terms']], correct: 'heavier' }
      ],
      reveal: { names: ['Hong Kong'],
        text: 'Hong Kong\'s deflation came from a collapse in <b>AD</b>: the property crash wiped out wealth, so households and firms cut spending. Output fell and unemployment rose. Falling prices can then feed a <b>deflationary spiral</b>: people delay buying, firms cut jobs, and spending falls again. Debts fixed in money terms become <b>heavier</b> as incomes fall.',
        lesson: 'Deflation is mostly bad news when it comes from falling <b>AD</b>. The next trap card shows a kind that isn\'t.',
        sources: 'HKMA (property prices down about 60%); HKU working paper (GDP −5.1% in 1998); Hong Kong Institute for Monetary Research (68 months of deflation, 13.9% cumulative fall); Hong Kong Yearbook 2004 (unemployment 8.6% in Q2 2003).' } },

    { id: 't4', type: 'quick', tab: 'Trap card', title: 'Trap card 4 · Good deflation?',
      gut: 'We just learned deflation is a disaster. So all falling prices are a disaster. Panic!',
      q: 'Prices of TVs and phones keep falling because factories use better technology, and more are sold than ever. If this happened across the whole economy, would the falling price level be a worry?',
      opts: [['spiral', 'Yes: falling prices always cause a spiral'], ['debt', 'Yes: it always makes debts heavier'], ['benign', 'Not really: AS is rising, so output rises too']], correct: 'benign',
      explain: 'When deflation comes from <b>rising AS</b> (better technology, cheaper inputs), the AS curve shifts down and right: prices fall <b>and</b> real output rises. That\'s benign deflation. The danger is the AD-led kind, like Hong Kong\'s.' },

    { id: 'f1', type: 'formula', tab: 'Final chart', title: 'Final chart · Add jobs and prices to your formula',
      intro: 'In Act 1 your team built a Living Standard formula from five parts. Now that you know what unemployment and inflation do to people, add a sixth: <b>jobs and prices</b>. In Act 4 your country is scored with this formula.',
      steps: ['Check your Act 1 formula below. If it\'s missing (new phone or cleared browser), type in your Act 1 formula code.',
              'Set how much <b>jobs and prices</b> should count, from <b>0</b> (not at all) to <b>5</b> (matters most).',
              'See how Estonia and Albania compare, then save. Your team gets a new six-digit formula code.'],
      sources: 'Act 1 data (UNDP HDR 2025, World Bank, EDGAR/JRC); inflation and unemployment 2023: Estonia from World Bank, Albania from INSTAT via the Bank of Albania and ALTAX.' }
  ];

  // ---------- jobs & prices dimension ----------
  // The Act 1 dimensions plus "jobs & prices": a misery-index style score, 1 − (unemployment + distance of inflation from 2%) / 30.
  const DIM_JOBS = { k: 'jobs', t: 'Jobs & prices', s: 'low unemployment, inflation near 2%', f: d => (30 - (d.u + Math.abs(d.pi - 2))) / 30 };
  const BASE_DIMS = [
    { k: 'income', t: 'Income', s: 'GNI per capita (PPP)', f: d => (Math.log(d.gni) - Math.log(1000)) / (Math.log(150000) - Math.log(1000)) },
    { k: 'health', t: 'Health', s: 'life expectancy', f: d => (d.le - 50) / 35 },
    { k: 'edu', t: 'Education', s: 'mean years of schooling', f: d => d.sch / 15 },
    { k: 'air', t: 'Clean air', s: 'low PM2.5 pollution', f: d => (50 - d.pm) / 50 },
    { k: 'carbon', t: 'Low carbon', s: 'low CO₂ per person', f: d => (20 - d.co2) / 20 }
  ];
  const DIMS = BASE_DIMS.concat([DIM_JOBS]);
  const FORMULA_COUNTRIES = [
    { name: 'Estonia', gni: 40881, le: 79.2, sch: 13.6, pm: 6.7, co2: 8.9, u: 6.4, pi: 9.2 },
    { name: 'Albania', gni: 17627, le: 79.6, sch: 10.2, pm: 18.2, co2: 1.4, u: 10.7, pi: 4.8 }
  ];
  const FORMULA_TABLE = [
    ['GNI per capita (PPP, 2021 int. $)', 'gni', v => v.toLocaleString('en')], ['Life expectancy (years)', 'le'], ['Mean years of schooling', 'sch'],
    ['PM2.5 air pollution (µg/m³, 2017)', 'pm'], ['CO₂ per person (tonnes, 2023)', 'co2'], ['Unemployment rate (%, 2023)', 'u'], ['Inflation rate (%, 2023)', 'pi']
  ];
  const clamp01 = x => Math.max(0, Math.min(1, x));
  function indexFor(w, d) { let sw = 0, s = 0; DIMS.forEach(x => { const v = +((w || {})[x.k]) || 0; sw += v; s += v * clamp01(x.f(d)); }); return sw ? s / sw : 0; }
  function dimScore(k, d) { return clamp01(DIMS.find(x => x.k === k).f(d)); }
  // Codes: 5 digits (Act 1) or 6 digits (from Act 3 on). The code IS the formula.
  function formulaCode(w) { return DIMS.map(d => Math.max(0, Math.min(5, Math.round(+((w || {})[d.k] ?? 3))))).join('-'); }
  function parseFormulaCode(code) {
    const digits = String(code || '').replace(/[^0-5]/g, '');
    if (digits.length !== 5 && digits.length !== 6) return null;
    const w = Object.fromEntries(BASE_DIMS.map((d, i) => [d.k, +digits[i]]));
    if (digits.length === 6) w.jobs = +digits[5];
    return w;
  }

  // ---------- scoring ----------
  const isRight = (q, v) => v === q.correct || (q.also || []).includes(v);
  function scoreRound(round, ans) {
    if (!ans || !ans.locked) return { pts: 0, right: 0, of: round.questions ? round.questions.length : 1 };
    if (round.type === 'call' || round.type === 'mystery') {
      let right = 0, wrong = 0;
      round.questions.forEach(q => { const v = ans.a && ans.a[q.id]; if (v) { if (isRight(q, v)) right++; else wrong++; } });
      const per = round.per || 5, bet = ans.bet || 1;
      let pts = (per * right - per / 2 * wrong) * bet, coins;
      if (round.type === 'mystery') {
        const spent = (ans.bought || []).reduce((s, k) => s + (round.clues.find(c => c.k === k) || { cost: 0 }).cost, 0);
        coins = Math.max(0, round.budget - spent); pts += 2 * coins;
      }
      return { pts, right, of: round.questions.length, coins };
    }
    if (round.type === 'quick') {
      const ok = ans.a === round.correct, bet = ans.bet || 1;
      return { pts: ok ? 10 * bet : -5 * (bet - 1), right: ok ? 1 : 0, of: 1 };
    }
    if (round.type === 'formula') return { pts: 15, right: 1, of: 1 };
    return { pts: 0, right: 0, of: 0 };
  }
  function totalScore(answers, upTo) { const last = upTo === undefined ? ROUNDS.length - 1 : upTo; return ROUNDS.reduce((s, r, i) => s + (i <= last ? scoreRound(r, (answers || {})[r.id]).pts : 0), 0); }
  function namesOf(r) { return ((r.reveal && r.reveal.names) || []).concat((r.cards || []).map(c => c.pin).filter(Boolean)); }
  function pinsUpTo(i) { const out = []; ROUNDS.slice(0, i + 1).forEach(r => namesOf(r).forEach(n => { if (PINS[n] && !out.includes(n)) out.push(n); })); return out; }

  const STICKERS = {
    triage: { i: '🩺', t: 'Sharp Triage', d: 'Got both triage rounds completely right' },
    trap3: { i: '🪤', t: 'Trap Dodger III', d: 'Got every Act 3 trap card right' },
    diag: { i: '🔬', t: 'Diagnostician', d: 'Cracked the two-patient inflation case' },
    fair: { i: '⚖️', t: 'Fair Judge', d: 'Spotted every winner and loser from inflation' },
    roller3: { i: '🎲', t: 'Cool Hands', d: 'Went All in and got everything right' }
  };
  function stickersFrom(answers) {
    answers = answers || {}; const got = {};
    const res = ROUNDS.map(r => ({ r, a: answers[r.id], s: scoreRound(r, answers[r.id]) }));
    const all = id => { const x = res.find(z => z.r.id === id); return x && x.a && x.a.locked && x.s.right === x.s.of; };
    if (all('g1') && all('u1')) got.triage = true;
    if (res.filter(x => x.r.type === 'quick').every(x => x.s.right === 1)) got.trap3 = true;
    if (all('m1')) got.diag = true;
    if (all('c1')) got.fair = true;
    if (res.some(x => x.r.type !== 'formula' && x.a && x.a.locked && (x.a.bet || 1) === 3 && x.s.right === x.s.of)) got.roller3 = true;
    return got;
  }

  const api = { ROUNDS, BETS, PINS, STICKERS, DIMS, BASE_DIMS, DIM_JOBS, FORMULA_COUNTRIES, FORMULA_TABLE, indexFor, dimScore, formulaCode, parseFormulaCode,
    isRight, stickersFrom, scoreRound, totalScore, pinsUpTo, namesOf };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Act3 = api;
})(typeof self !== 'undefined' ? self : this);
