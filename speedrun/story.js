/* Econ Speedrun · story mode for phones: one short screen at a time.
   Used by every act's play page. Rounds keep their full text for the projector; the short versions
   (round.story, card.short/emo, question.short/why, reveal.takeaway/why, round.qs/take for trap cards)
   come from each act's STORY overlay (see Story.apply).
   Screens: cover → stories and questions (one per screen) → confidence bet → locked summary.
   Reveal: score, a one-line takeaway, one tappable row per question (explanation inside), extras (diagram),
   and "Why? Read more" with the full explanation and sources. Every expander starts closed.
   ?ui=classic in the address switches a phone back to the long-page layout. */
(function (root) {
  'use strict';
  const params = new URLSearchParams(root.location ? root.location.search : '');
  const on = () => params.get('ui') !== 'classic';
  const handles = round => round.type === 'call' || round.type === 'quick' || round.type === 'mystery';

  // Merge an act's short-form overlay into its rounds. Cards are matched by position, questions by id.
  function apply(rounds, overlay) {
    rounds.forEach(r => {
      const o = overlay[r.id]; if (!o) return;
      const def = x => Object.fromEntries(Object.entries(x).filter(([, v]) => v !== undefined));
      r.story = Object.assign({}, r.story || {}, def({ line: o.line, tiles: o.tiles, gut: o.gut }));
      if (o.qs) r.qs = o.qs;
      if (o.take || o.why) r.reveal = Object.assign({}, r.reveal || {}, o.take ? { takeaway: o.take } : {}, o.why ? { why: o.why } : {});
      if (o.take && r.type === 'quick') r.take = o.take;
      (o.cards || []).forEach((c, i) => { if (r.cards && r.cards[i]) Object.assign(r.cards[i], c); });
      Object.entries(o.q || {}).forEach(([id, x]) => { const q = (r.questions || []).find(z => z.id === id); if (q) Object.assign(q, x); });
      Object.entries(o.clues || {}).forEach(([k, label]) => { const c = (r.clues || []).find(z => z.k === k); if (c) c.short = label; });
    });
  }

  function steps(round) {
    if (round.type === 'quick') return [{ quick: true }, { bet: true }];
    if (round.type === 'mystery') return [{ cover: true }, { preview: true }, { shop: true }].concat(round.questions.map(q => ({ q })), [{ bet: true }]);
    const items = round.pair ? round.cards.map((c, i) => ({ card: c, q: round.questions[i] })) : [{ cards: round.cards }].concat(round.questions.map(q => ({ q })));
    return [{ cover: true }].concat(items, [{ bet: true }]);
  }

  function view(round, reveal, X) {
    const { esc, A } = X, a = X.ans(round.id);
    X.G.step = X.G.step || {};
    const head = `<div class="stitle"><span class="stab">${esc(round.tab || ({ quick: 'Trap card', mystery: 'Case file' })[round.type] || 'Round')}</span>${esc(round.title)}</div>`;
    if (reveal) return head + revealView(round, X);
    if (X.locked(round)) return head + summary(round, X);
    const S = steps(round), i = Math.min(X.G.step[round.id] || 0, S.length - 1), st = S[i];
    const dots = S.length > 2 ? `<div class="sdots">${S.map((x, j) => `<i class="${j < i ? 'done' : j === i ? 'on' : ''}"></i>`).join('')}</div>` : '';
    const back = i > 0 ? `<button class="sback" data-go="${i - 1}">‹ Back</button>` : '';
    let body = '';
    const sto = round.story || {};
    if (st.cover) {
      body = `<div class="scover">${tiles(round, X)}<p class="sline">${esc(sto.line || stripTags(round.intro || ''))}</p>${X.FX.griffles('guessing', esc(sto.gut || round.gut || ''), 'pop')}
        <button class="btn sbig" data-go="1">Start ▶</button></div>`;
    } else if (st.preview) {
      body = `<div class="sq">First, read the questions</div><p class="small" style="text-align:center;margin:-4px 0 2px">You'll answer these after shopping. Which clues would help you tell the options apart?</p>
        ${qList(round, X)}${X.FX.griffles('curious', 'Look at the country options. What would you need to know to tell them apart?', 'pop')}
        <button class="btn sbig" data-go="${i + 1}">Go to the clue shop ▶</button>`;
    } else if (st.shop) {
      body = shop(round, X) + `<details class="smore dark"><summary>The questions you'll answer</summary>${qList(round, X)}</details>` + `<button class="btn sbig" data-go="${i + 1}">Answer the questions ▶</button>`;
    } else if (st.quick) {
      const mine = a.a;
      body = `<div class="sq big">${esc(round.qs || round.q)}</div>${round.qs && round.qs !== round.q ? `<details class="smore dark"><summary>Full question</summary><div>${esc(round.q)}</div></details>` : ''}
        <div class="sopts col">${round.opts.map(([k, t]) => `<button data-sp="${k}" class="${k === mine ? 'sel' : ''}">${esc(t)}</button>`).join('')}</div>
        ${X.FX.griffles('guessing', `<i>My gut says:</i> ${esc(sto.gut || round.gut || '')}`)}`;
    } else if (st.bet) {
      const done = round.type === 'quick' ? !!a.a : round.questions.every(q => (a.a || {})[q.id]);
      const missing = round.type === 'quick' ? 0 : round.questions.findIndex(q => !(a.a || {})[q.id]);
      body = `<div class="sq">How sure is your team?</div><div class="sbets">${A.BETS.map(b => `<button data-bet="${b.k}" class="${(a.bet || 1) === b.k ? 'sel' : ''}"><b>${b.t}</b><small>${b.s} points</small></button>`).join('')}</div>
        ${done ? `<button class="btn sbig" id="slock">Lock in ✓</button>` : `<p class="small mute" style="text-align:center">Answer every question first. <button class="linkbtn" data-go="${S.findIndex(x => x.q && x.q.id === (round.questions[missing] || {}).id)}">Go to the one you missed</button></p>`}`;
    } else {
      const c = st.card, q = st.q, mine = q ? (a.a || {})[q.id] : null;
      if (st.cards) body = `<p class="sline sm">${esc(sto.line || '')}</p>` + st.cards.map(cc => card(cc, X)).join('') + `<button class="btn sbig" data-go="${i + 1}">Next ▶</button>`;
      else {
        const recap = round.type === 'mystery' ? cluesRecap(round, X) : (!c && round.cards && round.cards.length ? `<details class="smore dark"><summary>Re-read the story</summary>${round.cards.map(cc => card(cc, X, true)).join('')}</details>` : '');
        const tiny = q.opts.every(([, t]) => t.length <= 3), tight = q.opts.every(([, t]) => t.length <= 14) && q.opts.length <= 4;
        body = (c ? card(c, X) : '') + `<div class="sq">${esc(q.short || q.q)}</div>${!c && q.short && q.short !== q.q ? `<div class="small mute" style="text-align:center;margin-top:-6px">${esc(q.q)}</div>` : ''}
          ${q.desc ? `<p class="tiny mute" style="text-align:center;margin:-4px 0 0">Read each description and check it against your clues.</p>` : ''}
          <div class="sopts ${q.desc ? 'col desc' : tiny ? 'tiny' : tight ? '' : 'col'}" ${tiny && !q.desc ? `style="grid-template-columns:repeat(${q.opts.length},1fr)"` : ''}>${q.opts.map(([k, t]) => `<button data-sq="${q.id}" data-k="${k}" class="${k === mine ? 'sel' : ''}">${q.desc && q.desc[k] ? `<b>${esc(t)}</b><small>${esc(q.desc[k])}</small>` : esc(t)}</button>`).join('')}</div>${recap}`;
      }
    }
    return head + `<div class="story">${dots}<div class="sscreen">${body}</div>${back}</div>`;
  }
  const stripTags = s => String(s).replace(/<[^>]+>/g, '');
  function tiles(round, X) {
    const t = (round.story && round.story.tiles) || [];
    return t.map(([e, n, l]) => `<div class="stile"><span class="se">${e}</span><b>${X.esc(n)}</b><span>${X.esc(l)}</span></div>`).join('');
  }
  // Short line by default; "More about this" opens the full situation.
  function card(c, X, compact) {
    const more = c.short && c.body && c.short !== c.body;
    return `<div class="scard ${compact ? 'compact' : ''}">${c.emo ? `<span class="semo">${c.emo}</span>` : ''}<div style="flex:1">${c.pin ? `<div class="np">📍 ${X.esc(c.pin)}</div>` : ''}<div class="nh">${X.esc(c.head)}</div><div class="nb">${X.esc(c.short || c.body)}</div>
      ${more ? `<details class="smore"><summary>More about this</summary><div>${X.esc(c.body)}</div></details>` : ''}</div></div>`;
  }
  function coinsLeft(round, a) { return round.budget - (a.bought || []).reduce((s, k) => s + (round.clues.find(c => c.k === k) || { cost: 0 }).cost, 0); }
  function shop(round, X) {
    const { esc } = X, a = X.ans(round.id), bought = a.bought || [], left = coinsLeft(round, a);
    return `<div class="shoptop"><span>Buy clues</span><span class="coins" id="coins">🪙 ${left}</span></div><p class="small mute" style="margin:-4px 0 4px">Every coin you don't spend is worth 2 points.</p>
      <div class="sclues">${round.clues.map(c => { const open = bought.includes(c.k), fresh = X.G.justBought === c.k ? 'declass' : '';
        return `<div class="sclue ${open ? 'open' : ''}"><div class="sclab">${esc(c.short || c.label)}</div>${open ? `<div class="scv ${fresh}"><span><small>A</small>${esc(c.v[0])}${c.unit || ''}</span><span><small>B</small>${esc(c.v[1])}${c.unit || ''}</span></div>` : `<button class="buy" data-buy="${c.k}" ${c.cost > left ? 'disabled' : ''}>🪙 ${c.cost}</button>`}</div>`; }).join('')}</div>`;
  }
  // The questions a mystery round will ask, with each country option's description, shown before shopping.
  function qList(round, X) {
    const { esc } = X;
    return `<div class="sqlist">${round.questions.map((q, n) => `<div class="sqi"><b>${n + 1}. ${esc(q.short || q.q)}</b>${q.desc ? `<ul>${q.opts.map(([k, t]) => `<li><b>${esc(t)}</b>: ${esc(q.desc[k] || '')}</li>`).join('')}</ul>` : `<div class="tiny mute">${q.opts.map(o => esc(o[1])).join(' · ')}</div>`}</div>`).join('')}</div>`;
  }
  function cluesRecap(round, X) {
    const a = X.ans(round.id), b = (a.bought || []).map(k => round.clues.find(c => c.k === k)).filter(Boolean);
    if (!b.length) return `<p class="tiny mute" style="text-align:center">No clues bought. <button class="linkbtn" data-go="2">Back to the clue shop</button></p>`;
    return `<details class="smore dark"><summary>Your clues (${b.length})</summary>${b.map(c => `<div class="srec"><b>${X.esc(c.short || c.label)}</b><span>A: ${X.esc(c.v[0])}${c.unit || ''}</span><span>B: ${X.esc(c.v[1])}${c.unit || ''}</span></div>`).join('')}</details>`;
  }
  function optText(q, v) { return (q.opts.find(o => o[0] === v) || [, '—'])[1]; }
  function rowLabel(round, q, i, X) {
    const c = round.pair && round.cards ? round.cards[i] : null;
    return { c, label: c ? c.head : (q.short || q.q) };
  }
  function summary(round, X) {
    const { esc, A } = X, a = X.ans(round.id);
    let rows;
    if (round.type === 'quick') rows = `<div class="srow"><span>${esc(round.qs || round.q)}</span><span class="spacer"></span><b>${esc(optText(round, a.a))}</b></div>`;
    else rows = round.questions.map((q, i) => { const { c, label } = rowLabel(round, q, i, X);
      return `<details class="srow"><summary>${c && c.emo ? `<span class="semo sm">${c.emo}</span>` : ''}<span>${esc(label)}</span><span class="spacer"></span><b>${esc(optText(q, (a.a || {})[q.id]))}</b><span class="chev">›</span></summary>${c ? `<div class="sdet"><p class="small">${esc(c.body)}</p></div>` : `<div class="sdet"><p class="small">${esc(q.q)}</p></div>`}</details>`; }).join('');
    return `<div class="story"><div class="slocked">🔒 Locked in · ${A.BETS.find(b => b.k === (a.bet || 1)).t}</div>${rows}
      <p class="small mute" style="text-align:center;margin:10px 0 4px">${X.G.mode === 'solo' ? 'Ready to see the answers?' : 'Waiting for your teacher to reveal…'}</p>
      <div class="row" style="justify-content:center">${X.G.mode === 'solo' ? `<button class="btn alt" id="reveal">Reveal</button>` : ''}<button class="btn ghost" id="sunlock">Change answers</button></div></div>`;
  }
  function revealView(round, X) {
    const { esc, A } = X, a = X.ans(round.id), s = A.scoreRound(round, a), rv = round.reveal || {};
    const isRight = A.isRight || ((q, v) => v === q.correct);
    let rows = '', take, full, lesson, sources;
    if (round.type === 'quick') {
      const ok = a.a === round.correct;
      take = round.take || ''; full = round.explain;
      rows = `<div class="srow ${ok ? 'ok' : 'bad'}"><span>Answer</span><span class="spacer"></span><b>${ok ? '✓' : '✗'} ${esc(optText(round, round.correct))}</b></div>${!ok && a.a ? `<div class="tiny mute" style="padding:4px">You said: ${esc(optText(round, a.a))}</div>` : ''}`;
    } else {
      take = rv.takeaway || ''; full = rv.text; lesson = rv.lesson; sources = rv.sources;
      rows = round.questions.map((q, i) => { const { c, label } = rowLabel(round, q, i, X), v = (a.a || {})[q.id], ok = isRight(q, v);
        const det = `${q.why ? `<p>${esc(q.why)}</p>` : ''}${q.desc && q.desc[q.correct] ? `<p class="tiny mute">The clue in the description: ${esc(q.desc[q.correct])}</p>` : ''}${!ok && v ? `<p class="tiny mute">You said: ${esc(optText(q, v))}</p>` : ''}${c ? `<p class="tiny mute">The situation: ${esc(c.body)}</p>` : ''}`;
        return `<details class="srow ${ok ? 'ok' : 'bad'}"><summary>${c && c.emo ? `<span class="semo sm">${c.emo}</span>` : ''}<span>${esc(label)}</span><span class="spacer"></span><b>${ok ? '✓' : '✗'} ${esc(optText(q, q.correct))}</b><span class="chev">›</span></summary>${det ? `<div class="sdet">${det}</div>` : ''}</details>`; }).join('');
    }
    const extra = X.extra ? X.extra(round) : '';
    return `<div class="story sreveal"><div class="sverdict"><div class="sbigscore">${s.right === s.of ? '✅' : s.right ? '🟡' : '❌'} ${s.right} of ${s.of}</div><div class="spts" style="color:${s.pts >= 0 ? 'var(--teal)' : 'var(--red)'}">${s.pts >= 0 ? '+' : ''}${s.pts}</div></div>
      ${s.coins !== undefined ? `<div class="tiny mute">including ${s.coins} unspent coins × 2</div>` : ''}
      ${take ? `<p class="stake">${esc(take)}</p>` : ''}${round.type !== 'quick' ? `<p class="tiny mute" style="margin:0 0 4px">Tap a row to see why.</p>` : ''}${rows}${extra}
      <details class="swhy"><summary>Why? Read more</summary>${rv.why ? `<ul>${rv.why.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}${full ? `<p class="small">${full}</p>` : ''}${lesson ? `<p class="small" style="color:var(--yellow)">💡 ${lesson}</p>` : ''}${sources ? `<p class="tiny mute">Sources: ${sources}</p>` : ''}</details></div>`;
  }
  function bind(round, reveal, X) {
    const a = X.ans(round.id), $ = s => document.querySelector(s);
    const go = i => { X.G.step[round.id] = i; X.render(); root.scrollTo({ top: 0 }); };
    const next = () => setTimeout(() => go((X.G.step[round.id] || 0) + 1), X.FX.reduced() ? 0 : 280);
    const mark = b => { b.parentNode.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b)); };
    document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => go(+b.dataset.go));
    document.querySelectorAll('[data-sq]').forEach(b => b.onclick = () => { (a.a = a.a || {})[b.dataset.sq] = b.dataset.k; X.save(); mark(b); next(); });
    document.querySelectorAll('[data-sp]').forEach(b => b.onclick = () => { a.a = b.dataset.sp; X.save(); mark(b); next(); });
    const lk = $('#slock'); if (lk) lk.onclick = () => { a.locked = true; a.bet = a.bet || 1; X.save(); X.push(); X.render(); };
    const ul = $('#sunlock'); if (ul) ul.onclick = () => { a.locked = false; X.G.step[round.id] = round.type === 'quick' ? 0 : 1; X.save(); X.push(); X.render(); };
  }
  root.Story = { on, handles, apply, view, bind };
})(typeof self !== 'undefined' ? self : this);
