/* Econ Speedrun: sync layer.
   Two backends with the same API:
   - Firebase Realtime Database (class games across devices; anonymous sign-in, no student accounts)
   - Local demo (same browser, several tabs; for testing without the internet)
   Data per game: games/{CODE} = { host, meta:{scenario, created}, state:{...}, teams:{uid:{...}}, polls:{pollId:{uid:choice}} } */
(function (root) {
  'use strict';
  const FB = 'https://www.gstatic.com/firebasejs/10.12.2/';
  const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const newCode = () => Array.from({ length: 5 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');

  // ---------- Firebase ----------
  async function firebaseBackend(config) {
    const [{ initializeApp }, A, D] = await Promise.all([
      import(FB + 'firebase-app.js'), import(FB + 'firebase-auth.js'), import(FB + 'firebase-database.js')]);
    const app = initializeApp(config);
    const auth = A.getAuth(app);
    const cred = await A.signInAnonymously(auth);
    const uid = cred.user.uid;
    const db = D.getDatabase(app);
    const R = p => D.ref(db, p);
    return {
      kind: 'firebase', uid,
      async createGame(meta) {
        for (let i = 0; i < 6; i++) {
          const code = newCode();
          try {
            await D.update(R('games/' + code), { host: uid, meta: Object.assign({ created: Date.now() }, meta), state: { phase: 'lobby', q: 0 } });
            return code;
          } catch (e) { if (i === 5) throw e; } // code taken: try another
        }
      },
      watchGame(code, cb) { return D.onValue(R('games/' + code), s => cb(s.val())); },
      async exists(code) { const s = await D.get(R('games/' + code + '/meta')); return s.exists(); },
      setState(code, state) { return D.set(R('games/' + code + '/state'), state); },
      setTeam(code, data) { return D.set(R('games/' + code + '/teams/' + uid), data); },
      vote(code, pollId, choice) { return D.set(R('games/' + code + '/polls/' + pollId + '/' + uid), choice); },
      deleteGame(code) { return D.remove(R('games/' + code)); }
    };
  }

  // ---------- Local demo (same browser) ----------
  function localBackend() {
    const KEY = c => 'speedrun-demo:' + c;
    let uid = null;
    try { uid = sessionStorage.getItem('speedrun-uid'); } catch (e) {}
    if (!uid) { uid = 'u' + Math.random().toString(36).slice(2, 10); try { sessionStorage.setItem('speedrun-uid', uid); } catch (e) {} }
    const bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('speedrun-demo') : null;
    const watchers = {};
    const read = c => { try { return JSON.parse(localStorage.getItem(KEY(c)) || 'null'); } catch (e) { return null; } };
    const fire = c => (watchers[c] || []).forEach(cb => cb(read(c)));
    const write = (c, fn) => { const g = read(c) || {}; fn(g); localStorage.setItem(KEY(c), JSON.stringify(g)); fire(c); if (bc) bc.postMessage(c); };
    if (bc) bc.onmessage = e => fire(e.data);
    window.addEventListener('storage', e => { if (e.key && e.key.startsWith('speedrun-demo:')) fire(e.key.slice(14)); });
    return {
      kind: 'local', uid,
      async createGame(meta) { const code = newCode(); write(code, g => { g.host = uid; g.meta = Object.assign({ created: Date.now() }, meta); g.state = { phase: 'lobby', q: 0 }; }); return code; },
      watchGame(code, cb) { (watchers[code] = watchers[code] || []).push(cb); setTimeout(() => cb(read(code)), 0); return () => { watchers[code] = watchers[code].filter(x => x !== cb); }; },
      async exists(code) { return !!read(code); },
      async setState(code, state) { write(code, g => { g.state = state; }); },
      async setTeam(code, data) { write(code, g => { (g.teams = g.teams || {})[uid] = data; }); },
      async vote(code, pollId, choice) { write(code, g => { g.polls = g.polls || {}; (g.polls[pollId] = g.polls[pollId] || {})[uid] = choice; }); },
      async deleteGame(code) { localStorage.removeItem(KEY(code)); fire(code); if (bc) bc.postMessage(code); }
    };
  }

  // Demo mode when the URL has #demo / ?demo, or when no Firebase config is present.
  async function connect() {
    const demo = /[?#&]demo\b/.test(location.search + location.hash) || !root.SPEEDRUN_FIREBASE;
    if (demo) return localBackend();
    return firebaseBackend(root.SPEEDRUN_FIREBASE);
  }

  root.Sync = { connect, localBackend, newCode };
})(typeof self !== 'undefined' ? self : this);
