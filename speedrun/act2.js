/* Econ Speedrun · Act 2: The Economist (Introduction to Macroeconomic Analysis: the AD/AS model and the multiplier).
   Follows the Year 6 AD/AS notes in order: the four sectors and AD = C + I + G + (X − M); why AD slopes down;
   shifts in AD; the shape of AS; shifts in AS (costs vs capacity); the multiplier and its size.
   Round types:
   - call:    one or more real-world news cards and a set of questions with the same bet as Act 1.
              Optional diagram: the reveal animates the AD/AS shift (adas.js).
   - quick:   one trap card on a common misconception, with a bet (as in Act 1)
   - mystery: two unnamed economies; teams buy clues with coins (as in Act 1)
   Every real-world figure carries its source. Check before any public release. */
(function (root) {
  'use strict';

  const PINS = {
    Thailand: { lat: 13.75, lon: 100.5 }, Vietnam: { lat: 21.03, lon: 105.85 }, Indonesia: { lat: -0.9, lon: 116.7 },
    Chile: { lat: -33.45, lon: -70.67, left: true }, Mongolia: { lat: 47.9, lon: 106.9 },
    Mexico: { lat: 19.43, lon: -99.13, left: true }, Germany: { lat: 52.52, lon: 13.4 },
    Spain: { lat: 40.42, lon: -3.7, left: true }, Japan: { lat: 35.68, lon: 139.69 },
    Guyana: { lat: 6.8, lon: -58.16 }, Ireland: { lat: 53.35, lon: -6.26, left: true }, Brazil: { lat: -15.8, lon: -47.9 }
  };
  const BETS = [{ k: 1, t: 'Hunch', s: '×1' }, { k: 2, t: 'Fairly sure', s: '×2' }, { k: 3, t: 'All in', s: '×3' }];

  // Answer sets used by several rounds
  const PART = [['C', 'C · consumption'], ['I', 'I · investment'], ['G', 'G · government spending'], ['XM', 'X − M · net exports'], ['cost', 'Firms\' costs of production'], ['cap', 'Productive capacity']];
  const SHIFT = [['adR', 'AD shifts right'], ['adL', 'AD shifts left'], ['asUp', 'AS shifts up (costs rise)'], ['asDown', 'AS shifts down (costs fall)'],
    ['asLeft', 'AS shifts left (capacity falls)'], ['asRight', 'AS shifts right (capacity rises)'], ['asDR', 'AS shifts down and right']];
  const GPL = [['up', 'Rises'], ['down', 'Falls, or rises more slowly']];
  const RNY = [['up', 'Rises'], ['down', 'Falls, or grows more slowly']];

  const ROUNDS = [
    { id: 's1', type: 'call', tab: 'Lab test', title: 'Lab 1 · Who is spending?', pair: true,
      intro: 'AD = C + I + G + (X − M). Five real stories from five economies. Which part of AD does each one show up in?',
      gut: 'A government building a city? That\'s investment, surely. It\'s a <i>huge</i> investment.',
      per: 4,
      cards: [
        { pin: 'Chile', head: 'Chile ships its copper to China', body: 'Chile is the world\'s largest copper producer, and China is its biggest buyer.' },
        { pin: 'Thailand', head: 'Thai families rush to buy their first car', body: 'A government tax rebate of up to 100,000 baht for first-time buyers of locally built cars runs from late 2011 to the end of 2012.' },
        { pin: 'Mongolia', head: 'Mongolian drivers fill up with Russian fuel', body: 'Mongolia has no oil refinery of its own, so almost all its petrol and diesel comes from Russia.' },
        { pin: 'Indonesia', head: 'Indonesia builds a brand-new capital city', body: 'Nusantara, on the island of Borneo, is being built to replace Jakarta as the seat of government.' },
        { pin: 'Vietnam', head: 'Samsung keeps building factories in Vietnam', body: 'The Korean firm has built smartphone and display plants in Bac Ninh and Thai Nguyen since 2009.' }
      ],
      questions: [
        { id: 'cl', q: '🇨🇱 Chile\'s copper sold to China shows up in Chile\'s…', opts: [['C', 'C'], ['I', 'I'], ['G', 'G'], ['X', 'X'], ['M', 'M']], correct: 'X' },
        { id: 'th', q: '🇹🇭 Thailand\'s first-car rush shows up in…', opts: [['C', 'C'], ['I', 'I'], ['G', 'G'], ['X', 'X'], ['M', 'M']], correct: 'C' },
        { id: 'mn', q: '🇲🇳 Mongolia\'s Russian fuel shows up in Mongolia\'s…', opts: [['C', 'C'], ['I', 'I'], ['G', 'G'], ['X', 'X'], ['M', 'M']], correct: 'M' },
        { id: 'id', q: '🇮🇩 Indonesia\'s new capital shows up in…', opts: [['C', 'C'], ['I', 'I'], ['G', 'G'], ['X', 'X'], ['M', 'M']], correct: 'G' },
        { id: 'vn', q: '🇻🇳 Samsung\'s new factories in Vietnam show up in…', opts: [['C', 'C'], ['I', 'I'], ['G', 'G'], ['X', 'X'], ['M', 'M']], correct: 'I' }
      ],
      reveal: {
        text: '<b>C:</b> households buying cars is consumer spending. Thai vehicle sales jumped about 81% to a record of about 1.44 million in 2012 (partly a rebound after the 2011 floods). <b>I:</b> firms buying new factories and machines is investment, and it counts even when the firm is foreign (FDI). Samsung\'s investment in Vietnam reached about US$23 billion by 2024. <b>G:</b> the government building roads, offices and a palace is government spending, not "investment" in the AD sense. <b>X:</b> copper sold abroad earns Chile export revenue. <b>M:</b> fuel bought from Russia is Mongolian spending that leaks out of Mongolia\'s AD.',
        lesson: 'M is <b>subtracted</b> in AD = C + I + G + (X − M) because it is spending on goods made in <i>other</i> countries. One country\'s X is another country\'s M.',
        sources: 'Wards Auto and just-auto (Thai vehicle sales 2012 and the first-car scheme); Hanoi Times and Vietnam Government News (Samsung investment); Jakarta Post and Bloomberg (Nusantara); GlobalData and UNCTAD (Chile copper and China\'s share); Oxford Business Group and TASS (Mongolia fuel imports).'
      } },

    { id: 's2', type: 'call', tab: 'Lab test', title: 'Lab 2 · Why does AD slope downwards?', pair: true,
      intro: 'The general price level (GPL) in the Harbour Republic <b>falls</b>. People buy more. But why? Match each story to the effect behind it.',
      gut: 'Things got cheaper, so people buy more. That\'s it. That\'s the whole reason. Three effects is two too many.',
      per: 4,
      cards: [
        { head: 'Story 1 · Harbour bicycles', body: 'Harbour-made bicycles are now cheaper than foreign ones. Tourists and foreign shops buy more of them, and locals import fewer.' },
        { head: 'Story 2 · Mei\'s pay packet', body: 'Prices fall but Mei\'s pay stays the same. Her salary now stretches further, so she finally buys the phone she wanted.' },
        { head: 'Story 3 · The Tans\' car loan', body: 'People need less money for their shopping, so banks have more to lend and interest rates fall. The Tans borrow to buy a car, and a firm borrows to build a warehouse.' }
      ],
      questions: [
        { id: 'c', q: 'Story 1 is the…', opts: [['w', 'Wealth effect'], ['ir', 'Interest rate effect'], ['is', 'International substitution effect']], correct: 'is' },
        { id: 'a', q: 'Story 2 is the…', opts: [['w', 'Wealth effect'], ['ir', 'Interest rate effect'], ['is', 'International substitution effect']], correct: 'w' },
        { id: 'b', q: 'Story 3 is the…', opts: [['w', 'Wealth effect'], ['ir', 'Interest rate effect'], ['is', 'International substitution effect']], correct: 'ir' }
      ],
      reveal: {
        text: '<b>Wealth effect:</b> the same income buys more, so households feel richer and spend more (C rises). <b>Interest rate effect:</b> less money is needed for the same shopping, so interest rates fall and borrowing for big-ticket items and factories rises (C and I rise). <b>International substitution effect:</b> home goods become cheaper than foreign substitutes, so exports rise and imports fall (X − M rises).',
        lesson: 'All three explain a <b>movement along</b> the AD curve when the GPL changes. The next trap card is about what that means.' } },

    { id: 'q1', type: 'quick', tab: 'Trap card', title: 'Trap card 1 · Shift or slide?',
      gut: 'Prices fell and people bought more, so AD went up. So AD shifts right. Easy.',
      q: 'The general price level falls and people buy more goods and services. What happens to the AD curve?',
      opts: [['right', 'It shifts right'], ['along', 'Nothing shifts: we move down along the AD curve'], ['left', 'It shifts left']], correct: 'along',
      explain: 'A change in the GPL causes a <b>movement along</b> the AD curve. AD only <b>shifts</b> when something other than the price level changes C, I, G or (X − M): confidence, interest rates set by the central bank, taxes, incomes abroad, the exchange rate…' },

    { id: 'c1', type: 'call', tab: 'Big call', title: 'Call 1 · Mexico, 2009', diagram: 'adL',
      intro: 'Use the AD/AS model to make the call. Think about this shock <b>on its own</b>, other things being equal.',
      gut: 'The US is in trouble, not Mexico. Mexico should be fine. Maybe even better off?',
      per: 5,
      cards: [{ pin: 'Mexico', head: 'The United States falls into a deep recession', body: 'Around 80% of Mexico\'s exports go to the US. American households and firms stop buying as many Mexican cars, TVs and parts.' }],
      questions: [
        { id: 'part', q: 'Which part of Mexico\'s economy is hit first?', opts: PART, correct: 'XM' },
        { id: 'shift', q: 'Which way does the curve shift?', opts: SHIFT, correct: 'adL' },
        { id: 'gpl', q: 'Mexico\'s general price level…', opts: GPL, correct: 'down' },
        { id: 'rny', q: 'Mexico\'s real national income…', opts: RNY, correct: 'down' }
      ],
      reveal: { names: ['Mexico'],
        text: 'When trading partners\' incomes fall, they buy fewer of our exports, so <b>X − M falls and AD shifts left</b>. Firms cut output and jobs, and real national income falls. In 2009 Mexico\'s real GDP shrank by about 6.5%, and unemployment rose from 4.0% in 2008 to 5.5% in 2009.',
        lesson: 'A recession can be <b>imported</b>: the more a country depends on one export market, the harder that market\'s slump hits it.',
        sources: 'ILO, G20 Mexico statistical update (GDP and unemployment, from INEGI); Industry Week (share of exports going to the US).' } },

    { id: 'c2', type: 'call', tab: 'Big call', title: 'Call 2 · Germany, 2022', diagram: 'asUp',
      intro: 'Same drill. One shock, other things being equal.',
      gut: 'Energy got pricier, so people spend less on other things. That\'s an AD shift. I\'m pretty sure. Fairly sure. Hunch.',
      per: 5,
      cards: [{ pin: 'Germany', head: 'Russia cuts gas supplies to Germany', body: 'German industry had relied heavily on Russian gas. Energy prices in Germany\'s consumer price index rose by about 30% in 2022, and chemical and metal works were among the hardest hit.' }],
      questions: [
        { id: 'part', q: 'What is hit first?', opts: PART, correct: 'cost' },
        { id: 'shift', q: 'Which way does the curve shift?', opts: SHIFT, correct: 'asUp' },
        { id: 'gpl', q: 'Germany\'s general price level…', opts: GPL, correct: 'up' },
        { id: 'rny', q: 'Germany\'s real national income…', opts: RNY, correct: 'down' }
      ],
      reveal: { names: ['Germany'],
        text: 'Energy is an input for almost every firm, so <b>unit costs of production rise and AS shifts up</b>. Prices rise <i>and</i> output falls. German inflation hit 6.9% in 2022, its highest since reunification, and real GDP shrank by 0.3% in 2023, with energy-intensive industries falling hardest.',
        lesson: 'A rise in costs shifts AS <b>up</b>, but it doesn\'t destroy factories or workers, so capacity (Yf) stays the same. That\'s the difference from a leftward shift.',
        sources: 'Destatis via GMK Center (inflation 2022 and 2023, energy prices +29.7% in 2022); Bundesbank and Destatis (GDP −0.3% in 2023, energy-intensive industries).' } },

    { id: 'r1', type: 'call', tab: 'Lab test', title: 'Lab 3 · Same push, different results', diagram: 'ranges',
      intro: 'Two economies get the <b>same</b> boost to AD. Where they start on the AS curve decides what happens next.',
      gut: 'Same push, same result. Economics is fair like that. Right?',
      per: 5,
      cards: [
        { pin: 'Spain', head: 'Spain, 2013', body: 'Unemployment is 26.1%. More than one in four people who want a job can\'t find one.' },
        { pin: 'Japan', head: 'Japan, 2019', body: 'Unemployment is 2.4%, one of the lowest rates of any rich economy.' }
      ],
      questions: [
        { id: 'es', q: 'Spain 2013 is on which part of its AS curve?', opts: [['flat', 'Flat part: lots of spare capacity'], ['rise', 'Rising part: spare capacity running out'], ['vert', 'Vertical, or close to it: full employment']], correct: 'flat' },
        { id: 'jp', q: 'Japan 2019 is on which part of its AS curve?', opts: [['flat', 'Flat part: lots of spare capacity'], ['rise', 'Rising part: spare capacity running out'], ['vert', 'Vertical, or close to it: full employment']], correct: 'vert' },
        { id: 'p', q: 'Where would the same AD boost raise prices more?', opts: [['es', 'Spain 2013'], ['jp', 'Japan 2019']], correct: 'jp' },
        { id: 'y', q: 'Where would it raise real output more?', opts: [['es', 'Spain 2013'], ['jp', 'Japan 2019']], correct: 'es' }
      ],
      reveal: { names: ['Spain', 'Japan'],
        text: 'With lots of idle workers and machines, Spain could produce more <b>without bidding up costs</b>: output rises, prices barely move. Japan has almost no spare capacity, so extra spending mostly <b>bids up prices</b>: firms compete for scarce workers and materials.',
        lesson: 'The AS curve has three ranges: flat (spare capacity), rising (bottlenecks) and vertical at full employment (Yf). The same rise in AD gives mostly growth in the first and mostly inflation in the last.',
        sources: 'UN DESA World Economic Situation and Prospects, from Eurostat and OECD (unemployment rates: Spain 2013, Japan 2019).' } },

    { id: 'q2', type: 'quick', tab: 'Trap card', title: 'Trap card 2 · Up, right, or both?',
      gut: 'Better workers means the economy can make more. So AS shifts right. Done. Next.',
      q: 'Training lets Harbour Republic workers make far more per hour, and their pay stays the same. How does the AS curve move?',
      opts: [['right', 'Right only: capacity rises'], ['down', 'Down only: unit costs fall'], ['both', 'Down and right: both']], correct: 'both',
      explain: 'Higher labour productivity raises what the economy can produce at full employment, so AS shifts <b>right</b> (Yf rises). And if pay stays the same, each unit costs less to make, so AS also shifts <b>down</b>. Better technology works the same way.' },

    { id: 'c3', type: 'call', tab: 'Big call', title: 'Call 3 · Guyana, 2015 to 2022', diagram: 'asRight',
      intro: 'A small country, a very big discovery. Make the call for the <b>supply side</b>.',
      gut: 'Oil! Rich! Everything goes up! Prices, output, my hopes and dreams…',
      per: 5,
      cards: [{ pin: 'Guyana', head: 'ExxonMobil strikes oil off the coast of Guyana', body: 'The first big find comes in 2015, and production starts in December 2019, in a country of about 800,000 people.' }],
      questions: [
        { id: 'part', q: 'On the supply side, what changes?', opts: PART, correct: 'cap' },
        { id: 'shift', q: 'Which way does the AS curve shift?', opts: SHIFT, correct: 'asRight', also: ['asDR'] },
        { id: 'gpl', q: 'From this shift alone, Guyana\'s general price level…', opts: GPL, correct: 'down' },
        { id: 'rny', q: 'Guyana\'s real national income…', opts: RNY, correct: 'up' }
      ],
      reveal: { names: ['Guyana'],
        text: 'New oil fields increase the <b>quantity of resources</b>, so productive capacity rises and <b>AS shifts right</b>. <b>Down and right</b> also scores: once the oil flows, cheaper local energy can cut firms\' costs too (though Guyana sells most of its oil abroad at world prices, so the cost effect is smaller than the capacity effect). Guyana\'s real GDP grew by 62.3% in 2022, the fastest in the world. But real life rarely moves one curve: oil money also brought a wave of investment and exports, shifting <b>AD right</b> too, and inflation reached 7.2% in 2022.',
        lesson: 'One real-world event can shift <b>both</b> curves. When you analyse a case, ask: what happens to costs, to capacity, and to each part of AD?',
        sources: 'IMF Article IV Consultation for Guyana, 2023 (growth 62.3% in 2022, population, production start); Guyana Budget 2023 via Stabroek News (inflation 7.2%); news reports of the 2015 discovery.' } },

    { id: 'm1', type: 'mystery', tab: 'Case file', title: 'Mission · The multiplier race', year: '2023',
      per: 8, budget: 6,
      intro: 'Both governments spend an extra US$1 billion building hospitals. In which country does that billion grow into more national income? Buy clues about the <b>leakages</b>. Coins you don\'t spend are worth 2 points each.',
      gut: 'The richer, more open one will get the bigger boost. Money attracts money!',
      clues: [
        { k: 'pop', group: 'Basics', label: 'Population', unit: '', cost: 1, v: ['about 5 million', 'about 211 million'] },
        { k: 'exp', group: 'Basics', label: 'Famous exports', unit: '', cost: 2, v: ['medicines, software services', 'soybeans, iron ore, crude oil'] },
        { k: 'imp', group: 'Leakages', label: 'Imports (% of GDP)', unit: '', cost: 2, v: ['102%', '16%'] },
        { k: 'sav', group: 'Leakages', label: 'Gross savings (% of national income)', unit: '', cost: 2, v: ['34%', '15%'] }
      ],
      questions: [
        { id: 'big', q: 'Which country has the bigger multiplier?', opts: [['A', 'Country A'], ['B', 'Country B']], correct: 'B' },
        { id: 'leak', q: 'What is Country A\'s biggest leakage?', opts: [['s', 'Savings'], ['t', 'Taxes'], ['m', 'Imports']], correct: 'm' },
        { id: 'whoA', q: 'Country A is…', opts: [['nl', 'Netherlands'], ['dk', 'Denmark'], ['ire', 'Ireland'], ['be', 'Belgium']], correct: 'ire',
          desc: { nl: 'Home to Rotterdam, Europe\'s busiest port, and about 18 million people.', dk: 'A Nordic country best known for wind turbines and LEGO, with about as many people as Singapore.', ire: 'Hosts the European headquarters of many big US tech and drug companies.', be: 'Home to the EU\'s main institutions in Brussels, and about 12 million people.' } },
        { id: 'whoB', q: 'Country B is…', opts: [['ar', 'Argentina'], ['br', 'Brazil'], ['co', 'Colombia'], ['pe', 'Peru']], correct: 'br',
          desc: { ar: 'South America\'s second-largest country by area, with about 46 million people.', br: 'Latin America\'s most populous country, and the world\'s biggest soybean exporter.', co: 'About 52 million people; famous for coffee and flowers.', pe: 'About 34 million people; one of the world\'s top copper producers.' } }
      ],
      reveal: { names: ['Ireland', 'Brazil'], chain: [[ 'Ireland', 0.75 ], [ 'Brazil', 0.45 ]],
        text: 'A is <b>Ireland</b>, B is <b>Brazil</b>. Each round of the multiplier, part of the new income leaks out as savings, taxes and imports. Ireland\'s imports are worth about as much as its whole GDP, so much of every extra euro is spent on foreign goods and leaks abroad straight away. Brazil buys far less from abroad and saves less, so more of each extra real stays at home and is spent again.',
        lesson: 'The <b>smaller the leakages</b> (savings, taxes, imports), the more rounds of spending, and the <b>bigger the multiplier</b>. A small, very open economy has a small multiplier. The chain below is an illustration, not a measured figure.',
        sources: 'World Bank WITS and World Development Indicators (imports % of GDP and gross savings % of GNI, 2023; population); OECD (Ireland trade); main exports from WITS trade summaries. Country descriptions: World Bank population estimates; USDA (Brazil the largest soybean exporter); USGS (Peru among the top copper producers).' } },

    { id: 'q3', type: 'quick', tab: 'Trap card', title: 'Trap card 3 · The leaky bucket',
      gut: 'The government spends $1 billion, and the multiplier makes it… way more than $1 billion. Like, $5 billion. Multipliers are great.',
      q: 'The Harbour Republic imports most of what it consumes, and its people save a lot. The government spends an extra $1 billion on a new hospital. What happens to real national income?',
      opts: [['much', 'It rises by much more than $1 billion: big multiplier'], ['little', 'It rises by a bit more than $1 billion: small multiplier'], ['same', 'It rises by exactly $1 billion: no multiplier']], correct: 'little',
      explain: 'The first $1 billion becomes someone\'s income, and part of that is spent again, so income rises by <b>more</b> than $1 billion. But with large leakages into imports and savings, each round shrinks fast, so the multiplier is <b>small</b>. That is why a small, open economy like the Harbour Republic gets less bang for each dollar of extra spending.' },

    { id: 'f1', type: 'call', tab: 'Final call', title: 'Final call · The Harbour Republic forecast desk', diagram: 'combo',
      intro: 'Your first forecast for the Harbour Republic, the economy you\'ll run as Minister in Act 4. Two things happen in the same quarter.',
      gut: 'Both shocks are big news, so both numbers go up. Or down. One of those.',
      per: 6,
      cards: [
        { head: 'Export boom', body: 'A neighbouring economy is booming and buys far more Harbour-made electronics.' },
        { head: 'Oil price spike', body: 'The world price of oil jumps. The Harbour Republic imports all of its oil.' }
      ],
      questions: [
        { id: 'ex', q: 'The export boom shifts…', opts: SHIFT, correct: 'adR' },
        { id: 'oil', q: 'The oil price spike shifts…', opts: SHIFT, correct: 'asUp' },
        { id: 'gpl', q: 'Together, the general price level…', opts: [['up', 'Rises'], ['down', 'Falls'], ['dep', 'Can\'t tell']], correct: 'up' },
        { id: 'rny', q: 'Together, real national income…', opts: [['up', 'Rises'], ['down', 'Falls'], ['dep', 'Can\'t tell: it depends which shift is bigger']], correct: 'dep' }
      ],
      reveal: {
        text: 'Both shifts push the <b>price level up</b>, so inflation is certain. But AD right pushes output up while AS up pushes it down, so the net effect on <b>real national income depends on which shift is bigger</b>. The diagram shows one possible outcome.',
        lesson: 'When two shocks hit at once, start with what they <b>agree</b> on. Where they disagree, the honest answer is "it depends on the size", and then you say what it depends on. As Minister in Act 4, you\'ll have to decide what to do about it.' } }
  ];

  // A question can accept more than one answer (q.also), e.g. when two readings of a case are both defensible.
  const isRight = (q, v) => v === q.correct || (q.also || []).includes(v);

  // ---------- scoring ----------
  // call and mystery: (per × right − per/2 × wrong) × bet; mystery also earns 2 per unspent coin.
  // quick: +10 × bet if right; −5 × (bet − 1) if wrong.
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
    return { pts: 0, right: 0, of: 0 };
  }
  // upTo: index of the last REVEALED round, so no unrevealed answer leaks into the score
  function totalScore(answers, upTo) { const last = upTo === undefined ? ROUNDS.length - 1 : upTo; return ROUNDS.reduce((s, r, i) => s + (i <= last ? scoreRound(r, (answers || {})[r.id]).pts : 0), 0); }
  function namesOf(r) { return ((r.reveal && r.reveal.names) || []).concat((r.cards || []).map(c => c.pin).filter(Boolean)); }
  function pinsUpTo(i) {
    const out = [];
    ROUNDS.slice(0, i + 1).forEach(r => namesOf(r).forEach(n => { if (PINS[n] && !out.includes(n)) out.push(n); }));
    return out;
  }

  // Stickers: habits worth having
  const STICKERS = {
    sleuth: { i: '🧾', t: 'Spending Sleuth', d: 'Sorted all five stories into C, I, G, X and M' },
    curve: { i: '📈', t: 'Curve Whisperer', d: 'Called the right shift in all three Big Calls' },
    trap2: { i: '🪤', t: 'Trap Dodger II', d: 'Got every Act 2 trap card right' },
    leak: { i: '🚰', t: 'Leak Detective', d: 'Got the whole multiplier race right' },
    roller2: { i: '🎲', t: 'Steady Nerves', d: 'Went All in and got everything right' }
  };
  function stickersFrom(answers) {
    answers = answers || {}; const got = {};
    const res = ROUNDS.map(r => ({ r, a: answers[r.id], s: scoreRound(r, answers[r.id]) }));
    const all = id => { const x = res.find(z => z.r.id === id); return x && x.a && x.a.locked && x.s.right === x.s.of; };
    if (all('s1')) got.sleuth = true;
    if (['c1', 'c2', 'c3'].every(id => { const a = answers[id], r = ROUNDS.find(z => z.id === id); return a && a.locked && a.a && isRight(r.questions.find(q => q.id === 'shift'), a.a.shift); })) got.curve = true;
    const quick = res.filter(x => x.r.type === 'quick'); if (quick.every(x => x.s.right === 1)) got.trap2 = true;
    if (all('m1')) got.leak = true;
    if (res.some(x => x.a && x.a.locked && (x.a.bet || 1) === 3 && x.s.right === x.s.of)) got.roller2 = true;
    return got;
  }

  const api = { isRight, ROUNDS, BETS, PINS, PART, SHIFT, STICKERS, stickersFrom, scoreRound, totalScore, pinsUpTo, namesOf };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Act2 = api;
})(typeof self !== 'undefined' ? self : this);
