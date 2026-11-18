/* Econ Speedrun: shared "juice" — themes, Griffles, sounds (host only), confetti, team identity and career card.
   Everything respects prefers-reduced-motion, and no effect delays the game by more than about a second. */
(function (root) {
  'use strict';
  const reduced = () => !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // ---------- team identity ----------
  const COLOURS = ['#2ec4b6', '#ff8a3d', '#ffd166', '#6aa8ff', '#b69cff', '#ff6b6b', '#7bd389', '#f78fb3'];
  const EMBLEMS = ['🦁', '🐉', '🦅', '🐺', '🦊', '🐙', '🦉', '🐢', '🚀', '⚓', '🌋', '🛰️'];
  const RANKS = [
    { act: 1, title: 'Junior Analyst', next: 'Economist' },
    { act: 2, title: 'Economist', next: 'Crisis Doctor' },
    { act: 3, title: 'Crisis Doctor', next: 'Minister' },
    { act: 4, title: 'Minister', next: null }
  ];
  const PKEY = 'speedrun-profile';
  function profile() { try { return JSON.parse(localStorage.getItem(PKEY) || 'null') || {}; } catch (e) { return {}; } }
  function saveProfile(p) { try { localStorage.setItem(PKEY, JSON.stringify(p)); } catch (e) {} return p; }
  function updateProfile(patch) { const p = Object.assign(profile(), patch); return saveProfile(p); }
  function addExplored(names) { const p = profile(); p.explored = Array.from(new Set((p.explored || []).concat(names))); saveProfile(p); }
  function addStickers(list) { const p = profile(); p.stickers = Object.assign(p.stickers || {}, list); saveProfile(p); }

  function identityPicker(cur) {
    cur = cur || {};
    return `<label>Team colour</label><div class="pick" id="pickCol">${COLOURS.map(c => `<button type="button" data-col="${c}" class="sw ${cur.colour === c ? 'on' : ''}" style="background:${c}" aria-label="colour ${c}"></button>`).join('')}</div>
      <label>Team emblem</label><div class="pick" id="pickEm">${EMBLEMS.map(e => `<button type="button" data-em="${e}" class="em ${cur.emblem === e ? 'on' : ''}">${e}</button>`).join('')}</div>`;
  }
  function bindPicker(state) {
    document.querySelectorAll('[data-col]').forEach(b => b.onclick = () => { state.colour = b.dataset.col; document.querySelectorAll('[data-col]').forEach(x => x.classList.toggle('on', x === b)); });
    document.querySelectorAll('[data-em]').forEach(b => b.onclick = () => { state.emblem = b.dataset.em; document.querySelectorAll('[data-em]').forEach(x => x.classList.toggle('on', x === b)); });
  }
  function chip(t) { // team chip: emblem in its colour + name
    const c = (t && t.colour) || '#2ec4b6', e = (t && t.emblem) || '⭐';
    return `<span class="tchip" style="--tc:${c}"><span class="te">${e}</span>${esc((t && t.name) || '')}</span>`;
  }

  // ---------- career ID card ----------
  function careerCard(p, opts) {
    opts = opts || {};
    const act = opts.act || 1, rank = RANKS.find(r => r.act === act) || RANKS[0];
    const st = p.stickers || {};
    const stickerDefs = opts.stickerDefs || {};
    const keys = Object.keys(stickerDefs);
    return `<div class="idcard" style="--tc:${p.colour || '#2ec4b6'}">
      <div class="idtop"><span>CAREER RECORD</span><span>${opts.promoted ? 'PROMOTED' : 'ACTIVE'}</span></div>
      <div class="idbody"><div class="idem">${p.emblem || '⭐'}</div>
        <div><div class="idname">${esc(p.name || 'Your team')}</div>
          <div class="idrank">${opts.promoted && rank.next ? `<s>${rank.title}</s> → <b>${rank.next}</b>` : `<b>${rank.title}</b>`}</div>
          ${p.formulaCode ? `<div class="idcode">Formula ${esc(p.formulaCode)}</div>` : ''}</div></div>
      ${keys.length ? `<div class="stickers">${keys.map(k => `<span class="stk ${st[k] ? 'got' : ''}" title="${esc(stickerDefs[k].d)}"><span>${stickerDefs[k].i}</span>${esc(stickerDefs[k].t)}</span>`).join('')}</div>` : ''}
    </div>`;
  }

  // ---------- Griffles (face redrawn from the school artwork, as in the Griffles engine) ----------
  function face(mood) {
    const O = '#4A3B2C';
    const eyes = {
      pleased: '<path d="M17 27 Q21 22 25 27 M39 27 Q43 22 47 27" stroke="' + O + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>',
      curious: '<ellipse cx="21" cy="26" rx="2.4" ry="3" fill="' + O + '"/><ellipse cx="43" cy="26" rx="2.4" ry="3" fill="' + O + '"/>',
      guessing: '<ellipse cx="22" cy="25" rx="2.4" ry="3" fill="' + O + '"/><ellipse cx="44" cy="25" rx="2.4" ry="3" fill="' + O + '"/><path d="M16 20 Q20 17 25 19 M39 19 Q44 16 48 19" stroke="' + O + '" stroke-width="2" fill="none" stroke-linecap="round"/>',
      skeptical: '<path d="M17 27 L25 27" stroke="' + O + '" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="43" cy="26" rx="2.4" ry="3" fill="' + O + '"/><path d="M38 18 Q43 14 48 18" stroke="' + O + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>',
      surprised: '<circle cx="21" cy="26" r="3.6" fill="' + O + '"/><circle cx="43" cy="26" r="3.6" fill="' + O + '"/><circle cx="22.2" cy="24.8" r="1.1" fill="#fff"/><circle cx="44.2" cy="24.8" r="1.1" fill="#fff"/><path d="M16 18 Q21 14 26 18 M38 18 Q43 14 48 18" stroke="' + O + '" stroke-width="2" fill="none" stroke-linecap="round"/>'
    }[mood] || '';
    return '<svg viewBox="0 0 64 64" role="img" aria-label="Griffles, ' + mood + '">' +
      '<path d="M12 22 Q11 6 18 3 Q22 4 23 14Z M52 22 Q53 6 46 3 Q42 4 41 14Z" fill="#fff" stroke="' + O + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M15 16 Q15 9 18 7 Q20 9 20 14Z M49 16 Q49 9 46 7 Q44 9 44 14Z" fill="#EA9693"/>' +
      '<path d="M32 9 C49 9 59 21 58 36 C57 46 54 50 53 56 C44 59 38 58 32 61 C26 58 20 59 11 56 C10 50 7 46 6 36 C5 21 15 9 32 9Z" fill="#fff" stroke="' + O + '" stroke-width="2.4"/>' +
      '<path d="M8 41 C14 45 22 44 27 40 L32 47 L37 40 C42 44 50 45 56 41 C55 47 54 51 53 56 C44 59 38 58 32 61 C26 58 20 59 11 56 C10 51 9 47 8 41Z" fill="#D6E9F8"/>' +
      eyes +
      '<path d="M32 30 C38 31 42 36 41 41 L32 49 L23 41 C22 36 26 31 32 30Z" fill="#F9E197" stroke="' + O + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<ellipse cx="33.5" cy="36" rx="1.3" ry="2.6" fill="#fff"/>' +
      '<path d="M32 9 C49 9 59 21 58 36 C57 46 54 50 53 56 C44 59 38 58 32 61 C26 58 20 59 11 56 C10 50 7 46 6 36 C5 21 15 9 32 9Z" fill="none" stroke="' + O + '" stroke-width="2.4"/></svg>';
  }
  function griffles(mood, html, anim) {
    return `<div class="grif ${anim ? 'g-' + anim : ''}"><div class="gface">${face(mood)}</div><div class="gbub"><small>Griffles</small>${html}</div></div>`;
  }
  // Pick a line without repeating the last one.
  const lastLine = {};
  function pick(key, lines) { let i = Math.floor(Math.random() * lines.length); if (lines.length > 1 && i === lastLine[key]) i = (i + 1) % lines.length; lastLine[key] = i; return lines[i]; }

  // ---------- effects ----------
  function confetti(n) {
    if (reduced()) return;
    const cv = document.createElement('canvas'); cv.className = 'confetti'; document.body.appendChild(cv);
    const W = cv.width = innerWidth, H = cv.height = innerHeight, x = cv.getContext('2d');
    const cols = COLOURS, P = Array.from({ length: n || 90 }, () => ({ x: W / 2 + (Math.random() - .5) * W * .3, y: H * .35, vx: (Math.random() - .5) * 9, vy: -Math.random() * 9 - 3, r: Math.random() * 6 + 3, c: cols[Math.floor(Math.random() * cols.length)], a: Math.random() * 6 }));
    let t = 0;
    (function f() { x.clearRect(0, 0, W, H); P.forEach(p => { p.vy += .28; p.x += p.vx; p.y += p.vy; p.a += .2; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); x.restore(); }); if (++t < 110) requestAnimationFrame(f); else cv.remove(); })();
  }
  function shake(el) { if (reduced() || !el) return; el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
  function countUp(el, from, to, ms) {
    if (!el) return; if (reduced() || from === to) { el.textContent = to; return; }
    const t0 = performance.now(); ms = ms || 700;
    (function f(t) { const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(from + (to - from) * e); if (k < 1) requestAnimationFrame(f); })(t0);
  }
  function coinFly(fromEl, toEl, n) {
    if (reduced() || !fromEl || !toEl) return;
    const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    for (let i = 0; i < Math.min(n || 1, 5); i++) {
      const c = document.createElement('div'); c.className = 'flycoin'; c.textContent = '🪙';
      c.style.left = (b.left + b.width / 2) + 'px'; c.style.top = (b.top + b.height / 2) + 'px'; document.body.appendChild(c);
      const dx = a.left + a.width / 2 - (b.left + b.width / 2), dy = a.top + a.height / 2 - (b.top + b.height / 2);
      c.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${dx}px,${dy}px) scale(.6)`, opacity: .2 }], { duration: 450 + i * 80, easing: 'cubic-bezier(.3,.7,.4,1)' }).onfinish = () => c.remove();
    }
  }

  // ---------- sound (synthesised, host screen only, can be muted) ----------
  let AC = null;
  const SKEY = 'speedrun-sound';
  function soundOn() { try { return localStorage.getItem(SKEY) !== 'off'; } catch (e) { return true; } }
  function setSound(on) { try { localStorage.setItem(SKEY, on ? 'on' : 'off'); } catch (e) {} }
  function ac() { if (!AC) { try { AC = new (root.AudioContext || root.webkitAudioContext)(); } catch (e) { AC = null; } } if (AC && AC.state === 'suspended') AC.resume(); return AC; }
  function tone(f, d, type, vol, when, slide) {
    const a = ac(); if (!a) return; const t = a.currentTime + (when || 0);
    const o = a.createOscillator(), g = a.createGain(); o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
    g.gain.setValueAtTime(vol || .2, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + d + .02);
  }
  function noise(d, vol, when) {
    const a = ac(); if (!a) return; const t = a.currentTime + (when || 0);
    const b = a.createBuffer(1, a.sampleRate * d, a.sampleRate), ch = b.getChannelData(0); for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / ch.length);
    const s = a.createBufferSource(), g = a.createGain(), fl = a.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = 900;
    s.buffer = b; g.gain.value = vol || .25; s.connect(fl); fl.connect(g); g.connect(a.destination); s.start(t);
  }
  const SFX = {
    stamp: () => { noise(.12, .5); tone(90, .15, 'square', .25); },
    coin: () => { tone(1320, .08, 'triangle', .15); tone(1760, .12, 'triangle', .12, .06); },
    drumroll: (ms) => { const n = Math.round((ms || 1100) / 55); for (let i = 0; i < n; i++) noise(.05, .12 + .1 * i / n, i * .055); },
    reveal: () => { tone(523, .14, 'triangle', .2); tone(659, .14, 'triangle', .2, .1); tone(784, .3, 'triangle', .22, .2); },
    tick: () => tone(1000, .03, 'square', .06),
    fanfare: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, .25, 'sawtooth', .09, i * .12)); tone(1047, .6, 'triangle', .15, .5); },
    fail: () => tone(220, .35, 'sawtooth', .12, 0, 110)
  };
  function play(name, arg) { if (!soundOn()) return; try { SFX[name] && SFX[name](arg); } catch (e) {} }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  root.FX = { reduced, COLOURS, EMBLEMS, RANKS, profile, saveProfile, updateProfile, addExplored, addStickers, identityPicker, bindPicker, chip, careerCard,
    face, griffles, pick, confetti, shake, countUp, coinFly, play, soundOn, setSound };
})(typeof self !== 'undefined' ? self : this);
