/* Act 1 short versions for phone story mode. The full text stays in act1.js for the projector and for "Read more". */
Story.apply(Act1.ROUNDS, {
  m1: { line: 'Two mystery economies, one small and one big. Buy clues, then name them.', tiles: [['🪙', '8', 'coins for clues'], ['🔎', '10', 'clues for sale']],
    gut: 'Whoever grows fastest must be richest. Obviously.',
    clues: { gni: 'Income per person (GNI, PPP)', pm: 'Air pollution (PM2.5)', sch: 'Years of schooling', co2: 'CO₂ per person' },
    q: { grow: { short: 'Who grew faster in 2023?', why: 'B grew 6.0%; A shrank 2.7%.' },
         mat: { short: 'Higher material standard of living?', why: 'A\'s income per person is more than four times B\'s.' },
         air: { short: 'Cleaner air?', why: 'A\'s PM2.5 is 6.7, B\'s is 28.5.' },
         whoA: { short: 'Country A is…', why: 'Estonia: 1.4 million people, in the EU.' },
         whoB: { short: 'Country B is…', why: 'Uzbekistan: 36 million people, growing fast.' } },
    take: 'Fast growth isn\'t a high living standard: Estonia shrank but is still far richer than Uzbekistan.' },

  q1: { qs: 'Nominal GDP rose 10%. Prices rose 12%. Did the economy produce more?', take: 'No. Take away the price rise and real GDP fell about 2%.' },
  q2: { qs: 'Real GDP grew 5%. The population grew 10%. What happened to material SOL?', take: 'It fell: there is less output per person.' },
  q3: { qs: 'Same GDP per person. Gini 0.25 or 0.60: where is a typical person better off?', take: 'Gini 0.25. A lower Gini means income is shared more evenly.' },
  q4: { qs: 'GDP rose because the government bought fighter jets. Are households better off?', take: 'Not directly: you can\'t consume a jet. They may gain later through the multiplier or greater security.' },
  q5: { qs: 'Unemployment fell from 6% to 5% because job-seekers gave up. Is labour being used better?', take: 'No. They left the labour force; no extra work is being done.' },

  m2: { line: 'A rich country and a huge one. How big is the gap, really?', tiles: [['🪙', '6', 'coins for clues']],
    gut: 'Just compare their incomes in US dollars. Simple.',
    clues: { mkt: 'GDP per person at market exchange rates', ppp: 'Gap after cost of living (PPP)' },
    q: { whoA: { short: 'Country A is…', why: 'Norway: about 5.5 million people.' },
         whoB: { short: 'Country B is…', why: 'India: about 1.4 billion people.' },
         mkt: { short: 'Gap at market exchange rates?', why: 'US$98,102 against US$1,489: about 65 times.' },
         ppp: { short: 'Gap after cost of living?', why: 'Things cost far less in India, so the real gap is about 17 times.' } },
    take: 'At market rates Norway looks 65× richer. Adjusted for cost of living (PPP), it\'s about 17×.' },

  q6: { qs: 'Food and fuel prices jump 20%. They are a bigger part of the typical basket in Tonga than in Norway. Whose inflation rises more?', take: 'Tonga\'s. The bigger an item\'s weight in the CPI, the more its price rise counts.' },
  q7: { qs: 'A S$10 hawker meal in Singapore costs about S$3.40 in Malaysia. Comparing incomes at market exchange rates will…', take: 'Understate Malaysian living standards: each ringgit buys more at home. PPP fixes this.' }
});
