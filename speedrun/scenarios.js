/* Econ Speedrun: Macro scenarios.
   Each scenario is a hidden real country-and-era. Students play the Harbour Republic through the SEQUENCE of shocks
   that era brought (compressed into 20 quarters); the era is revealed at the end and pinned on the world map.
   Shock sizes are model numbers, not data. Every "reveal" fact is marked for the teacher to check before class. */
(function (root) {
  'use strict';

  const OPTS = {
    adL: 'AD shifts left: spending falls',
    adR: 'AD shifts right: spending rises',
    asCost: 'AS shifts left: costs of production rise',
    asCapL: 'AS shifts left: productive capacity falls',
    asCapR: 'AS shifts right: productive capacity rises',
    both: 'AD left and AS left at the same time'
  };

  // Fun, specific news pop-ups. Some need a decision now; some are chained.
  const NEWS = {
    concert: { head: 'A global pop superstar wants six extra stadium shows', body: 'Her team will make your country the only stop in the region if the government chips in.',
      choices: [{ k: 'pay', t: 'Chip in (−1 reserve)', res: -1, ad: 0.5 }, { k: 'pass', t: 'Pass', ad: 0 }], default: 1 },
    fab: { head: 'A chip giant wants to build a new wafer fab here', body: 'It wants cheap land and a tax break. The fab would take a year to build.',
      choices: [{ k: 'yes', t: 'Offer the deal (−1 reserve)', res: -1, later: { after: 4, cap: 0.4, note: 'The new chip fab opens: capacity rises.' } }, { k: 'no', t: 'Say no' }], default: 1 },
    haze: { head: 'Haze from regional forest fires blankets the city', body: 'Tourists cancel trips and people stay home instead of shopping.', ad: -0.5 },
    hawker: { head: 'Your hawker food goes viral worldwide', body: 'A food video hits 80 million views. Food tourists start booking flights.', ad: 0.4 },
    cable: { head: 'An undersea internet cable is cut', body: 'Ships re-route data and firms pay more for slower connections while it is repaired.', cost: 0.4 },
    durian: { head: 'Bumper durian season', body: 'Imported fruit is cheap and plentiful. Small, but it nudges prices down.', cost: -0.2 },
    bonus: { head: 'Election-year idea: a cash bonus for every citizen', body: 'Popular! But it costs money and adds to spending right now.',
      choices: [{ k: 'give', t: 'Pay the bonus (−2 reserves)', res: -2, ad: 0.9 }, { k: 'skip', t: 'Keep the reserves' }], default: 1 },
    cyber: { head: 'Hackers probe your banks', body: 'Experts say a proper cyber-defence upgrade would stop a bigger attack later.',
      choices: [{ k: 'defend', t: 'Fund the upgrade (−1 reserve)', res: -1 },
                { k: 'risk', t: 'Save the money', later: { after: 3, ad: -0.9, note: 'The hackers return: a bank outage freezes payments for days and spending drops.' } }], default: 1 },
    expo: { head: 'You can host the next World Expo', body: 'Building the site costs a lot now, but the new transport links stay afterwards.',
      choices: [{ k: 'host', t: 'Host it (−2 reserves)', res: -2, ad: 0.6, later: { after: 4, cap: 0.25, note: 'The Expo is over, but its new rail line keeps paying off.' } }, { k: 'decline', t: 'Decline' }], default: 1 },
    workers: { head: 'Business groups want easier rules on foreign workers', body: 'Firms say they cannot fill jobs. Some citizens worry about competition for work.',
      choices: [{ k: 'ease', t: 'Ease the rules', cap: 0.3, struct: 0.15 }, { k: 'keep', t: 'Keep the rules' }], default: 1 },
    port: { head: 'A rival port cuts its fees in half', body: 'Some shipping lines move their regional hub away from you.', ad: -0.4 },
    rating: { head: 'Rating agency praises your reserves', body: 'Investors feel safer here. A small boost to investment.', ad: 0.2 }
  };

  function news(id, q) { return Object.assign({ id: id + '-' + q, q }, NEWS[id]); }

  const SCENARIOS = [
    {
      id: 'sg0711', quarters: 20, startLabel: 'Year 1',
      reveal: { title: 'Singapore and the world, 2007–2011', when: '2007 to 2011',
        pins: [{ name: 'Singapore', lat: 1.35, lon: 103.8 }, { name: 'New York (Lehman Brothers)', lat: 40.7, lon: -74 }],
        story: 'You played through a boom, an oil-price spike, the Global Financial Crisis, a record rebound and then rising costs.',
        facts: ['Lehman Brothers collapsed in September 2008, and world trade fell sharply in the months after.',
                'In January 2009 Singapore\'s Resilience Package was paid for partly by drawing on past reserves, for the first time.',
                'Singapore\'s economy grew by around 15% in 2010, helped by an electronics rebound and its two new integrated resorts.',
                'In 2011 Singapore faced rising inflation, driven by housing, car and imported food costs.'],
        check: true },
      events: [
        { q: 1, ad: 1.2, head: 'Boom time: exports and construction are flying', body: 'Orders pour in and cranes fill the skyline.' },
        { q: 3, cost: 0.8, head: 'Food and oil prices creep up worldwide', body: 'Rice, wheat and fuel all cost more to import.' },
        { q: 5, cost: 1.4, head: 'Oil hits a record high', body: 'Fuel costs for power stations, airlines and factories soar.', poll: 'asCost' },
        { q: 7, ad: -2.6, head: 'A giant US bank collapses. Panic spreads', body: 'Lending freezes worldwide and export orders crash.', poll: 'adL' },
        { q: 8, ad: -2.0, cost: -1.6, head: 'World trade in free fall; oil prices crash too', body: 'Factories idle. Fuel is suddenly cheap.' },
        { q: 10, ad: 1.4, head: 'Green shoots: orders start to return', body: 'China\'s huge stimulus lifts demand across Asia.' },
        { q: 12, ad: 2.0, head: 'Two giant casino resorts open; electronics rebound', body: 'Tourists flood in and chip orders surge.', poll: 'adR' },
        { q: 13, ad: 0.8, head: 'Rebound continues', body: 'Firms hire again and investment picks up.' },
        { q: 16, cost: 1.3, head: 'Rents, car prices and food costs climb', body: 'Firms face higher costs across the board.', poll: 'asCost' },
        { q: 18, ad: -1.0, head: 'Europe\'s debt crisis deepens', body: 'European buyers cut orders for your goods.' }
      ],
      news: [news('hawker', 2), news('fab', 4), news('cyber', 9), news('concert', 11), news('haze', 14), news('bonus', 15), news('workers', 17), news('durian', 19)]
    },
    {
      id: 'jp9094', quarters: 20, startLabel: 'Year 1',
      unlockAt: { inflation: 2, er: 4, unemployment: 7, big: 7, supply: 11 },
      reveal: { title: 'Japan, 1990–1994: the bubble bursts', when: '1990 to 1994',
        pins: [{ name: 'Tokyo', lat: 35.7, lon: 139.7 }, { name: 'Kuwait', lat: 29.4, lon: 47.9 }],
        story: 'You played through the end of a huge asset bubble: an oil spike, then years of weak spending, a credit crunch and a soaring currency.',
        facts: ['Japan\'s stock market peaked at the end of 1989, and land prices fell for years afterwards.',
                'Iraq invaded Kuwait in August 1990, and oil prices jumped.',
                'Japanese banks were left with large bad loans and cut back lending.',
                'The yen rose strongly in 1993–95, which made Japanese exports dearer.'],
        check: true },
      events: [
        { q: 1, ad: -0.8, head: 'Share prices tumble from their peak', body: 'Households feel poorer and spend a little less.' },
        { q: 2, cost: 1.5, head: 'War in the Gulf: oil prices jump', body: 'Iraq invades Kuwait and fuel costs spike.', poll: 'asCost' },
        { q: 5, ad: -1.8, head: 'Land prices start to fall. Firms stop investing', body: 'Nobody wants to build when property is losing value.', poll: 'adL' },
        { q: 6, cost: -1.0, head: 'Oil prices fall back', body: 'The Gulf War ends quickly.' },
        { q: 8, ad: -1.2, head: 'Consumers tighten their belts', body: 'Job worries mean people save rather than spend.' },
        { q: 11, ad: -1.6, head: 'Banks drowning in bad loans stop lending', body: 'Firms cannot borrow to invest or expand.', poll: 'adL' },
        { q: 14, ad: -1.0, cost: -0.8, head: 'Your currency soars', body: 'Imports get cheaper, but exporters lose orders.' },
        { q: 17, ad: -0.6, head: 'Prices start to fall', body: 'Shoppers wait for things to get cheaper, so they delay spending.' }
      ],
      news: [news('expo', 3), news('rating', 6), news('bonus', 9), news('cable', 12), news('workers', 15), news('hawker', 18)]
    },
    {
      id: 'w2024', quarters: 20, startLabel: 'Year 1',
      unlockAt: { unemployment: 1, big: 1, inflation: 4, er: 6, supply: 10 },
      reveal: { title: 'Singapore and the world, 2020–2024', when: '2020 to 2024',
        pins: [{ name: 'Singapore', lat: 1.35, lon: 103.8 }, { name: 'Ukraine', lat: 50.4, lon: 30.5 }, { name: 'Suez Canal', lat: 30.0, lon: 32.5 }],
        story: 'You played through Covid-19 lockdowns, a reopening boom, supply-chain chaos, an energy shock after the war in Ukraine, and an AI-chip upswing.',
        facts: ['Singapore\'s "circuit breaker" lockdown ran from April to June 2020.',
                'The government drew on past reserves to pay for its 2020 Covid-19 support budgets.',
                'A container ship blocked the Suez Canal for six days in March 2021.',
                'Russia\'s invasion of Ukraine in February 2022 sent energy and food prices sharply higher.'],
        check: true },
      events: [
        { q: 0, ad: -1.0, head: 'A new virus spreads. Tourists vanish', body: 'Flights are cancelled and hotels empty.' },
        { q: 1, ad: -3.4, cap: -0.2, head: 'Lockdown: shops and offices close', body: 'Spending collapses almost overnight.', poll: 'adL' },
        { q: 2, ad: 2.2, head: 'Reopening: people rush back to the shops', body: 'Pent-up spending comes back fast.' },
        { q: 5, ad: 1.6, head: 'Big stimulus abroad: world demand surges', body: 'US households spend stimulus cheques on goods made in Asia.', poll: 'adR' },
        { q: 6, cost: 1.1, head: 'A ship blocks the Suez Canal; containers run short', body: 'Freight costs soar and parts arrive late.' },
        { q: 8, cost: 2.0, head: 'War in Ukraine: energy and food prices explode', body: 'Gas, oil and wheat all jump in price.', poll: 'asCost' },
        { q: 9, cost: 0.8, head: 'Energy stays expensive', body: 'Power bills keep climbing.' },
        { q: 10, ad: -0.9, head: 'Central banks abroad raise interest rates fast', body: 'World spending cools.' },
        { q: 12, ad: -1.2, head: 'Electronics slump', body: 'The world has bought its laptops. Chip orders fall.', poll: 'adL' },
        { q: 16, cost: -0.6, head: 'Energy prices ease', body: 'Fuel and shipping costs come down.' },
        { q: 17, ad: 1.1, head: 'AI boom: everyone wants chips and data centres', body: 'Your fabs and servers are in hot demand.' }
      ],
      news: [news('bonus', 3), news('cyber', 4), news('concert', 7), news('fab', 11), news('haze', 13), news('workers', 15), news('rating', 18)]
    },
    {
      id: 'oil7377', quarters: 20, startLabel: 'Year 1',
      reveal: { title: 'The 1970s oil shocks, 1973–1977', when: '1973 to 1977',
        pins: [{ name: 'Gulf oil producers', lat: 24.7, lon: 46.7 }, { name: 'Singapore', lat: 1.35, lon: 103.8 }],
        story: 'You played through the first oil shock: oil prices jumped, the world fell into recession, and prices and unemployment rose together. That is stagflation.',
        facts: ['In October 1973 Arab oil producers cut supplies, and oil prices roughly quadrupled within a few months.',
                'Many rich economies went into recession in 1974–75 while inflation stayed high: stagflation.',
                'Singapore, which imports all its oil, saw inflation jump in 1973–74.'],
        check: true },
      events: [
        { q: 1, ad: 0.8, head: 'The world economy is booming', body: 'Factories everywhere run flat out.' },
        { q: 3, cost: 2.6, head: 'Oil producers cut supplies. Oil prices soar', body: 'Petrol queues, shocked firms, higher costs everywhere.', poll: 'asCost' },
        { q: 4, cost: 1.4, ad: -0.8, head: 'Oil quadruples. The world slows', body: 'Costs keep rising while export orders fall.', poll: 'both' },
        { q: 6, ad: -1.6, head: 'Global recession', body: 'Rich countries cut spending and imports.' },
        { q: 8, ad: -0.9, head: 'Recession drags on', body: 'Firms hold back on hiring.' },
        { q: 11, ad: 1.2, head: 'Recovery begins', body: 'World trade starts growing again.', poll: 'adR' },
        { q: 14, cost: 0.6, head: 'Wages chase prices', body: 'Workers push for raises to keep up with inflation.' },
        { q: 17, ad: 0.6, head: 'Steady growth returns', body: 'A calmer world economy.' }
      ],
      news: [news('port', 2), news('expo', 5), news('workers', 9), news('durian', 12), news('cable', 15), news('rating', 18)]
    }
  ];

  const QUIET = ['A quiet quarter. Ships come and go.', 'Nothing dramatic. Firms carry on as usual.', 'A calm quarter in the markets.',
                 'Steady trading at the port.', 'No big news. A chance to plan ahead.'];

  const api = { SCENARIOS, OPTS, NEWS, QUIET, byId: id => SCENARIOS.find(s => s.id === id) };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Scenarios = api;
})(typeof self !== 'undefined' ? self : this);
