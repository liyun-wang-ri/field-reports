# Econ Speedrun: Macro (prototype)

A class game for H1 Economics macro. Each team steers the **Harbour Republic**, a small, very open, Singapore-like economy, through 20 quarters of real-world shocks. Levers unlock as the game goes on. Teams try to beat the **Autopilot**, a government that never changes policy. At the end the hidden real era is revealed and pinned on a world map.

## Files
| File | What it is |
|---|---|
| `index.html` | Landing page with links to Host and Play |
| `host.html` | Teacher's projector screen: create a game, lobby with code and QR, run quarters (manual or auto), lessons, prediction polls, leaderboard, reveal, delete data |
| `play.html` | Student phone page: join with code and team name, or play solo |
| `engine.js` | The model: deterministic quarterly AD/AS-style economy, levers with lags, unlocks, score, achievements, Autopilot |
| `scenarios.js` | Four hidden eras (Singapore 2007–11, Japan 1990–94, Singapore and the world 2020–24, 1970s oil shocks), news pop-ups, poll answers. **Reveal facts are marked for the teacher to check.** |
| `common.js` | Shared UI helpers: AD/AS diagram, skyline, explanations |
| `sync.js` | Firebase Realtime Database backend plus a same-browser demo backend |
| `firebase-config.js` | Public web config for the `econ-speedrun` Firebase project |
| `database.rules.json` | Security rules (already published in the Firebase console) |
| `worldmap.js` | World map outline (Natural Earth, public domain) |

## How a class game runs
1. The teacher opens `host.html`, picks an era (or "Surprise me") and creates the game. A 5-character code and a QR code appear.
2. Students open `play.html`, enter the code and a team name. No names, emails or accounts are needed (anonymous Firebase sign-in).
3. The teacher starts the game. Each quarter:
   - unlock quarters show a short lesson on every screen;
   - shock quarters open a **prediction poll** (which curve shifts, and which way?) with live class results, then a reveal with an AD/AS diagram;
   - teams read the headline and any news pop-ups, set their levers and lock in;
   - the teacher presses **Run** (or turns on auto-run every N seconds, or when every team has locked in).
4. After 20 quarters the teacher reveals the era. **End and delete all game data** removes the team names, scores and votes.

Every team simulates its own economy on its own device from the same scenario. Only scores go to the database.

## Testing without Firebase
Add `#demo` to the address, for example `host.html#demo`. Host and player tabs in the same browser then talk to each other through local storage.

## Firebase project
- Project `econ-speedrun`, Realtime Database in Singapore (`asia-southeast1`), Spark (free) plan, which allows 100 connections at once.
- Anonymous sign-in is on, with auto clean-up of anonymous accounts after 30 days.
- Authorised domain: `liyun-wang-ri.github.io`.
- The rules let anyone signed in read a game only if they know its code. Only the host can change the game state or delete the game. Each team can only write its own record and its own poll votes.
- Analytics is not loaded.

## Model notes (all numbers are a teaching model)
- Growth = 3 + AD gap − ½ cost gap + capacity. Inflation and unemployment adjust gradually towards targets set by the AD and cost gaps.
- Fiscal policy acts half this quarter and half next. The exchange rate builds up over 2 quarters. Supply-side policy pays off after 4 quarters.
- Score: a living-standard index that grows each quarter with growth, minus penalties for inflation above 3%, deflation, unemployment above 3.5%, overheating above 6%, and overdrawn reserves.
- Balance check (seed 7): a careful player beats Autopilot by about 2–3 points in every era, while a "spend every quarter" player loses by 3–5.

## Act 2: The Economist (AD/AS and the multiplier)

Files: `act2.js` (rounds, scoring, stickers), `adas.js` (animated AD/AS diagram with flat, rising and vertical AS ranges), `act2-host.html`, `act2-play.html`. Theme: `body.theme-lab` in `style.css`.

Eleven rounds in the order of the Year 6 AD/AS notes:

1. Lab 1 · Who is spending? Five real stories sorted into C, I, G, X, M (Thailand, Vietnam, Indonesia, Chile, Mongolia).
2. Lab 2 · Why AD slopes down: wealth, interest rate and international substitution effects.
3. Trap card · Shift or slide (a GPL change is a movement along AD).
4. Call 1 · Mexico 2009: US recession, X − M falls, AD left.
5. Call 2 · Germany 2022: gas price shock, costs rise, AS up.
6. Lab 3 · Spain 2013 vs Japan 2019: the same AD rise on the flat and vertical ranges of AS.
7. Trap card · Productivity shifts AS down and right.
8. Call 3 · Guyana: oil discovery raises capacity, AS right (and AD moves too).
9. Mission · The multiplier race: Ireland vs Brazil, clues on imports and savings, with an illustrative spending chain.
10. Trap card · The leaky bucket (small, open economy, small multiplier).
11. Final call · Harbour Republic: export boom plus oil spike, prices rise, output depends on the sizes.

Scoring: call and mystery rounds give (per × right − per/2 × wrong) × bet; mystery also gives 2 per unspent coin; trap cards as in Act 1. Before class, check the real-world figures against the sources listed in each round's `reveal.sources`.
