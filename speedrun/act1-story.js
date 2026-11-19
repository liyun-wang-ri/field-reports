/* Act 1 short versions for phone story mode. The full text stays in act1.js for the projector and for "Read more". */
Story.apply(Act1.ROUNDS, {
  m1: { line: 'Two mystery economies. Read the questions, buy the clues that test each description, then name them.', tiles: [['🪙', '8', 'coins for clues'], ['🔎', '10', 'clues for sale']],
    gut: 'Whoever grows fastest must be richest. Obviously.',
    clues: { gni: 'Income per person (GNI, PPP)', pm: 'Air pollution (PM2.5)', sch: 'Years of schooling', co2: 'CO₂ per person', rem: 'Money sent home from abroad (% of GDP)' },
    q: { grow: { short: 'Who grew faster in 2023?', why: 'B grew 6.0%; A shrank 2.7%.' },
         mat: { short: 'Higher material standard of living?', why: 'A\'s income per person is more than four times B\'s.' },
         air: { short: 'Cleaner air?', why: 'A\'s PM2.5 is 6.7, B\'s is 28.5.' },
         whoA: { short: 'Country A is…', why: 'Estonia: oil shale power gives it high CO₂ per person (8.9 t). New Zealand (life expectancy over 82), Ireland (income about 90,000) and Singapore (unemployment about 2%) don\'t fit A\'s clues.' },
         whoB: { short: 'Country B is…', why: 'Uzbekistan: money sent home is about 18% of GDP. Vietnam (inflation about 3%), Ethiopia (2 to 3 years of school) and Bangladesh (very polluted air) don\'t fit B\'s clues.' } },
    take: 'Fast growth isn\'t a high living standard: Estonia shrank but is still far richer than Uzbekistan.' },

  q1: { qs: 'Nominal GDP rose 10%. Prices rose 12%. Did the economy produce more?', take: 'No. Take away the price rise and real GDP fell about 2%.' },
  q2: { qs: 'Real GDP grew 5%. The population grew 10%. What happened to material SOL?', take: 'It fell: there is less output per person.' },
  q3: { qs: 'Same GDP per person. Gini 0.25 or 0.60: where is a typical person better off?', take: 'Gini 0.25. A lower Gini means income is shared more evenly.' },
  q4: { qs: 'GDP rose because the government bought fighter jets. Are households better off?', take: 'Not directly: you can\'t consume a jet. They may gain later through the multiplier or greater security.' },
  q5: { qs: 'Unemployment fell from 6% to 5% because job-seekers gave up. Is labour being used better?', take: 'No. They left the labour force; no extra work is being done.' },

  m2: { line: 'A rich country and a very different one. Is the usual way of comparing incomes fair?', tiles: [['🪙', '7', 'coins for clues'], ['🔎', '7', 'clues for sale']],
    gut: 'Just compare their incomes in US dollars. Simple.',
    clues: { exp: 'Main exports', g: 'Real GDP growth', pi: 'Inflation', mkt: 'GDP per person (market rates)', ppp: 'GDP per person (PPP)', mac: 'Price of a Big Mac', temp: 'January temperature' },
    q: { under: { why: 'Understates: prices are much lower in B, so each dollar buys more there than the exchange rate suggests.' },
         why: { short: 'Which clue best shows why?', why: 'The Big Mac: $2.59 in B against $7.14 in A. Cheaper prices mean a dollar goes further in B.' },
         gap: { short: 'After PPP, the gap between A and B…', why: 'Shrinks: about 35 times at market rates, about 10 times at PPP.' },
         heat: { why: 'Overstate: heating and winter clothes add to A\'s GDP, but they only offset the cold. People in B get that comfort almost free. (This is the "different consumption patterns" limit of PPP.)' },
         whoA: { short: 'Country A is…', why: 'Norway: oil and gas exports. Switzerland and Denmark export other things, and Luxembourg\'s GDP per person (over $130,000) is far above A\'s.' },
         whoB: { short: 'Country B is…', why: 'India: growth of about 9%. Nigeria exports mostly crude oil, Indonesia\'s GDP per person is nearly twice B\'s, and Pakistan\'s inflation passed 30%.' } },
    take: 'Market exchange rates understate living standards where things are cheap. PPP fixes much of that, but not everything.' },

  q6: { qs: 'Food and fuel prices jump 20%. They are a bigger part of the typical basket in Tonga than in Norway. Whose inflation rises more?', take: 'Tonga\'s. The bigger an item\'s weight in the CPI, the more its price rise counts.' },
  q7: { qs: 'A S$10 hawker meal in Singapore costs about S$3.40 in Malaysia. Comparing incomes at market exchange rates will…', take: 'Understate Malaysian living standards: each ringgit buys more at home. PPP fixes this.' }
});
