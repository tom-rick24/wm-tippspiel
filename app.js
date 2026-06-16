// =============================================================
// APP.JS – WM Tippspiel EA-515
// Datenbank: Firebase Realtime Database (kostenlos, kein Server nötig)
// =============================================================

'use strict';

// ── FIREBASE CONFIG ───────────────────────────────────────────
// !! Diese Werte nach dem Erstellen des Firebase-Projekts eintragen !!
const firebaseConfig = {
  apiKey: "AIzaSyAQDQOEKPorhuKdF8tL5k08ND3jbV1X-S4",
  authDomain: "tippspiel-ea-515.firebaseapp.com",
  databaseURL: "https://tippspiel-ea-515-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tippspiel-ea-515",
  storageBucket: "tippspiel-ea-515.firebasestorage.app",
  messagingSenderId: "612314853333",
  appId: "1:612314853333:web:9fff2122290adc71bd575c",
  measurementId: "G-XBYKS9C6M9"
};

firebase.initializeApp(firebaseConfig);
const _fbdb = firebase.database();
const REF   = _fbdb.ref('wm26');

// ── STATE ─────────────────────────────────────────────────────
const S = {
  user:        null,
  tips:        {},
  results:     {},
  names:       {},
  champTips:   {},
  champResult: null,
  adminOpen:   false,
  view:        'dashboard',
  fRound:      'all',
  fStatus:     'all',
};

// ── DATABASE LAYER (Firebase Realtime Database) ───────────────
// Alle Änderungen werden sofort bei allen Nutzern sichtbar!
const DB = {
  // Echtzeit-Listener: feuert bei jedem Update (auch von anderen Nutzern)
  startListening(onUpdate) {
    REF.on('value', snap => {
      const d = snap.val() || {};
      S.tips        = d.tips        || {};
      S.results     = d.results     || {};
      S.names       = d.names       || {};
      S.champTips   = d.champTips   || {};
      S.champResult = d.champResult || null;
      onUpdate();
    }, err => {
      console.error('Firebase Verbindungsfehler:', err);
    });
  },

  async saveTip(gameId, playerName, home, away) {
    await REF.child(`tips/${gameId}/${playerName}`).set({ home, away });
    if (!S.tips[gameId]) S.tips[gameId] = {};
    S.tips[gameId][playerName] = { home, away };
  },

  async saveResult(gameId, home, away) {
    await REF.child(`results/${gameId}`).set({ home, away });
    S.results[gameId] = { home, away };
  },

  async deleteResult(gameId) {
    await REF.child(`results/${gameId}`).remove();
    delete S.results[gameId];
  },

  async saveNames(gameId, homeName, awayName) {
    await REF.child(`names/${gameId}`).set({ home: homeName, away: awayName });
    S.names[gameId] = { home: homeName, away: awayName };
  },

  async saveChampTip(playerName, champion, vice) {
    await REF.child(`champTips/${playerName}`).set({ champion, vice });
    S.champTips[playerName] = { champion, vice };
  },

  async saveChampResult(champion, vice) {
    await REF.child('champResult').set({ champion, vice });
    S.champResult = { champion, vice };
  },

  async deleteChampResult() {
    await REF.child('champResult').remove();
    S.champResult = null;
  },

  async resetAll() {
    await REF.set({ tips: {}, results: {}, names: {}, champTips: {}, champResult: null });
    S.tips = {}; S.results = {}; S.names = {};
    S.champTips = {}; S.champResult = null;
  },
};

// ── WELTMEISTER-TIPP KONSTANTEN ───────────────────────────────
const CHAMP_DEADLINE = new Date('2026-06-17T10:00').getTime();
const ALL_TEAMS = Object.values(GROUPS).flat().sort((a, b) => a.localeCompare(b));

// ── GAME LOGIC ────────────────────────────────────────────────
function isLocked(game)  { return Date.now() >= new Date(game.kickoff).getTime(); }
function hasResult(game) { return S.results[game.id] != null; }

function getStatus(game) {
  if (hasResult(game)) return 'finished';
  if (isLocked(game))  return 'locked';
  return 'open';
}

function getTip(id, name)  { return S.tips[id]?.[name] ?? null; }

async function setTip(id, home, away) {
  const game = GAMES.find(g => g.id === id);
  if (!game || !S.user || isLocked(game)) return false;
  await DB.saveTip(id, S.user, home, away);
  return true;
}

async function setResult(id, home, away) { await DB.saveResult(id, home, away); }
async function clearResult(id)           { await DB.deleteResult(id); }

function getTeamName(game, side) {
  return S.names[game.id]?.[side] || game[side];
}
async function setTeamName(id, home, away) {
  const g = GAMES.find(g => g.id === id);
  const h = home.trim() || g.home;
  const a = away.trim() || g.away;
  await DB.saveNames(id, h, a);
}

function tendency(h, a) {
  return h > a ? 'H' : h < a ? 'A' : 'D';
}
function calcScore(tip, result) {
  if (!tip || !result) return 0;
  if (tip.home === result.home && tip.away === result.away) return 5;
  if ((tip.home - tip.away) === (result.home - result.away)) return 3;
  if (tendency(tip.home, tip.away) === tendency(result.home, result.away)) return 2;
  return 0;
}

function calcLeaderboard() {
  const rows = PARTICIPANTS.map(name => ({ name, points: 0, exact: 0, diff: 0, tend: 0, games: 0, champPts: 0 }));
  for (const g of GAMES) {
    const r = S.results[g.id];
    if (!r) continue;
    for (const row of rows) {
      const tip = getTip(g.id, row.name);
      if (!tip) continue;
      row.games++;
      const pts = calcScore(tip, r);
      row.points += pts;
      if (pts === 5) row.exact++;
      else if (pts === 3) row.diff++;
      else if (pts === 2) row.tend++;
    }
  }
  // Weltmeister/Vize-Punkte einrechnen
  if (S.champResult) {
    for (const row of rows) {
      const ct = S.champTips[row.name];
      if (!ct) continue;
      let cp = 0;
      if (ct.champion === S.champResult.champion) cp += 15;
      if (ct.vice     === S.champResult.vice)     cp += 5;
      row.champPts = cp;
      row.points  += cp;
    }
  }
  rows.sort((a, b) =>
    b.points - a.points || b.exact - a.exact || b.diff - a.diff || b.tend - a.tend
  );
  return rows;
}

// ── HELPERS ───────────────────────────────────────────────────
const DAYS = ['So','Mo','Di','Mi','Do','Fr','Sa'];

function fmtDate(kickoff) {
  const d = new Date(kickoff);
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  return `${DAYS[d.getDay()]}, ${dd}.${mm}.`;
}
function fmtTime(kickoff) {
  const d = new Date(kickoff);
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}
function fmtFull(kickoff) { return `${fmtDate(kickoff)} ${fmtTime(kickoff)}`; }

// Minimal HTML-Escaping für Admin-Eingaben
function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function flagOf(name) { return ''; }

function statusBadge(status) {
  const labels = { open:'Offen', locked:'Gesperrt', finished:'Beendet' };
  return `<span class="badge badge-${status}">${labels[status]}</span>`;
}

// ── RENDER: DASHBOARD ─────────────────────────────────────────
function renderDashboard() {
  renderWidgetOpenTips();
  renderWidgetRecentResults();
  renderWidgetUpcoming();
  renderWidgetMiniBoard();
  renderWidgetChampion();
}

function renderWidgetOpenTips() {
  const el = document.getElementById('w-open');
  if (!S.user) {
    el.innerHTML = `<div class="card">
      <div class="card-hdr"><span class="card-title">📝 Offene Tipps</span></div>
      <div class="card-body"><div class="welcome-box" style="padding:20px 12px;border:none">
        <p>Wähle oben deinen Namen aus, um Tipps abzugeben.</p>
      </div></div></div>`;
    return;
  }
  const now = Date.now();
  const openGames = GAMES.filter(g => {
    const ko = new Date(g.kickoff).getTime();
    return ko > now && ko < now + 14*86400e3 && !getTip(g.id, S.user);
  }).slice(0, 10);
  const urgentCount = GAMES.filter(g => {
    const d = new Date(g.kickoff).getTime() - now;
    return d > 0 && d < 86400e3 && !getTip(g.id, S.user);
  }).length;

  el.innerHTML = `<div class="card">
    <div class="card-hdr">
      <span class="card-title">📝 Offene Tipps (nächste 14 Tage)</span>
      ${urgentCount ? `<span class="badge badge-locked">⚠ ${urgentCount} heute!</span>` : ''}
    </div>
    <div class="card-body">
      ${openGames.length === 0
        ? '<div class="empty">✓ Alle aktuellen Tipps abgegeben!</div>'
        : openGames.map(g => {
          const urgent = new Date(g.kickoff).getTime() - now < 86400e3;
          const hn = getTeamName(g,'home'), an = getTeamName(g,'away');
          return `<div class="otip-row">
            <div class="otip-info">
              <div class="otip-game">${flagOf(hn)}${hn} – ${an}${flagOf(an)}</div>
              <div class="otip-meta">${fmtFull(g.kickoff)} · ${g.venue.split(',').pop().trim()}</div>
            </div>
            <button class="btn btn-sm btn-primary" onclick="jumpToGame(${g.id})">Tippen →</button>
          </div>`;
        }).join('')}
    </div></div>`;
}

function renderWidgetRecentResults() {
  const el = document.getElementById('w-results');
  const now = Date.now();
  const upcoming = GAMES.filter(g => new Date(g.kickoff).getTime() > now).slice(0, 8);

  el.innerHTML = `<div class="card">
    <div class="card-hdr">
      <span class="card-title">📅 Nächste Spiele</span>
      <span style="font-size:12px;color:var(--text-muted)">${upcoming.length} Spiele</span>
    </div>
    <div class="card-body">
      ${upcoming.length === 0
        ? '<div class="empty">Keine weiteren Spiele.</div>'
        : upcoming.map(g => {
          const hn = getTeamName(g,'home'), an = getTeamName(g,'away');
          const hasTip = S.user && getTip(g.id, S.user);
          return `<div class="fix-row">
            <div class="fix-time"><strong>${fmtTime(g.kickoff)}</strong><br>${fmtDate(g.kickoff)}</div>
            <div class="fix-teams">
              ${hn} vs ${an}
              <small>${g.group ? 'Gruppe '+g.group : g.round}</small>
            </div>
            <div class="fix-right">
              ${hasTip
                ? `<span class="badge badge-open" title="Tipp: ${getTip(g.id,S.user).home}:${getTip(g.id,S.user).away}">✓</span>`
                : S.user ? `<span class="badge badge-locked">!</span>` : ''}
            </div>
          </div>`;
        }).join('')}
    </div></div>`;
}

function renderWidgetUpcoming() {
  const el = document.getElementById('w-upcoming');
  const finished = GAMES.filter(g => hasResult(g))
    .sort((a,b) => new Date(b.kickoff) - new Date(a.kickoff))
    .slice(0, 8);

  el.innerHTML = `<div class="card">
    <div class="card-hdr">
      <span class="card-title">🏁 Letzte Ergebnisse</span>
      <span style="font-size:12px;color:var(--text-muted)">${finished.length} Spiele</span>
    </div>
    <div class="card-body">
      ${finished.length === 0
        ? '<div class="empty">Noch keine Ergebnisse eingetragen.</div>'
        : finished.map(g => {
          const r = S.results[g.id];
          const myTip = S.user ? getTip(g.id, S.user) : null;
          const pts   = myTip ? calcScore(myTip, r) : null;
          const hn = getTeamName(g,'home'), an = getTeamName(g,'away');
          return `<div class="fix-row">
            <div class="fix-time">${fmtDate(g.kickoff)}<br><small>${g.group ? 'Gr. '+g.group : g.round}</small></div>
            <div class="fix-teams">
              ${hn} <strong>${r.home}:${r.away}</strong> ${an}
            </div>
            <div class="fix-right">
              ${pts !== null ? `<span class="pts-badge ${pts===5?'pts-exact':pts===3?'pts-diff':pts===2?'pts-tend':'pts-wrong'}">+${pts}</span>` : ''}
              ${myTip ? `<small style="color:var(--text-muted)">(${myTip.home}:${myTip.away})</small>` : ''}
            </div>
          </div>`;
        }).join('')}
    </div></div>`;
}

function renderWidgetMiniBoard() {
  const el = document.getElementById('w-board');
  const board = calcLeaderboard().slice(0, 6);
  const medals = ['🥇','🥈','🥉'];
  el.innerHTML = `<div class="card">
    <div class="card-hdr">
      <span class="card-title">🏆 Rangliste (Top 6)</span>
      <button class="btn btn-ghost btn-sm" onclick="showView('rangliste')">Alle →</button>
    </div>
    <div class="card-body" style="padding:8px 18px">
      ${board.map((p,i) => `
        <div class="fix-row ${p.name===S.user?'':''}">
          <div style="min-width:26px;font-weight:700;color:${i<3?'var(--accent)':'var(--text-muted)'}">${medals[i]||`${i+1}.`}</div>
          <div style="flex:1;font-weight:${p.name===S.user?700:400};${p.name===S.user?'color:var(--accent)':''}">${p.name===S.user?'⭐ ':''}${p.name}</div>
          <div style="font-weight:800;font-size:16px;color:var(--accent)">${p.points}</div>
        </div>`).join('')}
    </div></div>`;
}

// ── RENDER: WELTMEISTER-TIPP ───────────────────────────────────
function renderWidgetChampion() {
  const el = document.getElementById('w-champion');
  if (!el) return;
  const locked  = Date.now() >= CHAMP_DEADLINE;
  const myTip   = S.user ? (S.champTips[S.user] || null) : null;
  const result  = S.champResult;
  const dDate   = new Date(CHAMP_DEADLINE);
  const deadline = `Mi. ${String(dDate.getDate()).padStart(2,'0')}.${String(dDate.getMonth()+1).padStart(2,'0')}. 10:00 Uhr`;
  const opts  = () => ALL_TEAMS.map(n => `<option value="${esc(n)}"${myTip?.champion===n?' selected':''}>${esc(n)}</option>`).join('');
  const opts2 = () => ALL_TEAMS.map(n => `<option value="${esc(n)}"${myTip?.vice===n?' selected':''}>${esc(n)}</option>`).join('');

  // Alle Tipps – nur nach Deadline sichtbar
  const allChampTips = locked ? `
    <div class="all-tips" style="margin-top:14px">
      <div class="at-hdr">
        Alle Tipps
        <span style="background:var(--border);padding:2px 7px;border-radius:10px;font-size:10px">${Object.keys(S.champTips).length}/${PARTICIPANTS.length}</span>
      </div>
      <div class="tips-grid">
        ${PARTICIPANTS.map(name => {
          const ct = S.champTips[name];
          if (!ct) return `<div class="tip-chip"><span class="tc-name">${esc(name)}</span><span class="tc-none">–</span></div>`;
          let cls = '';
          if (result) {
            const pts = (ct.champion===result.champion?15:0)+(ct.vice===result.vice?5:0);
            cls = pts>=20?'tc-exact':pts>0?'tc-tend':'tc-wrong';
          }
          const meClass = name===S.user ? 'tc-me' : '';
          return `<div class="tip-chip ${cls} ${meClass}">
            <span class="tc-name">${name===S.user?'★ ':''}<b>${esc(name)}</b></span>
            <span style="font-size:11px">🥇 ${esc(ct.champion)}<br>🥈 ${esc(ct.vice)}</span>
          </div>`;
        }).join('')}
      </div>
    </div>` : '';

  let body;
  if (result) {
    const champPts = myTip && myTip.champion === result.champion ? 15 : 0;
    const vicePts  = myTip && myTip.vice     === result.vice     ?  5 : 0;
    const total    = champPts + vicePts;
    body = `
      <div class="champ-result-row"><span>🥇 Weltmeister</span><strong>${esc(result.champion)}</strong></div>
      <div class="champ-result-row" style="border-bottom:none"><span>🥈 Vize-Weltmeister</span><strong>${esc(result.vice)}</strong></div>
      ${myTip
        ? `<div style="margin-top:12px;padding:10px;background:var(--bg);border-radius:6px;border:1px solid var(--border)">
             <div style="font-size:11px;color:var(--text-muted);margin-bottom:6px">Mein Tipp:</div>
             <div style="display:flex;justify-content:space-between;align-items:center">
               <span>${esc(myTip.champion)} / ${esc(myTip.vice)}</span>
               <span class="pts-badge ${total>0?'pts-exact':'pts-wrong'}">+${total} Pkt</span>
             </div>
           </div>`
        : `<div style="margin-top:10px;color:var(--text-subtle);font-size:12px">Kein Tipp abgegeben.</div>`}
      ${allChampTips}`;
  } else if (locked) {
    const myTipBlock = myTip
      ? `<div class="champ-locked">
           <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px">✓ Tipp gesperrt – Ergebnis ausstehend</div>
           <div>🥇 Weltmeister: <strong>${esc(myTip.champion)}</strong></div>
           <div style="margin-top:4px">🥈 Vize: <strong>${esc(myTip.vice)}</strong></div>
         </div>`
      : `<div style="color:var(--text-subtle);font-size:13px">Kein Tipp abgegeben – Frist abgelaufen.</div>`;
    body = myTipBlock + allChampTips;
  } else {
    body = !S.user
      ? `<div style="color:var(--text-muted);font-size:13px">← Spieler-Namen auswählen um zu tippen.</div>`
      : `<div class="champ-form">
           <div style="font-size:11px;color:var(--text-muted)">
             Offen bis <strong>${deadline}</strong> &nbsp;·&nbsp;
             Weltmeister richtig = <b style="color:var(--green)">15 Pkt</b> &nbsp;·&nbsp;
             Vize richtig = <b style="color:var(--green)">5 Pkt</b>
           </div>
           <label style="font-size:12px;color:var(--text-muted)">🥇 Weltmeister</label>
           <select id="champ-sel" class="champ-sel">
             <option value="">– Weltmeister wählen –</option>${opts()}
           </select>
           <label style="font-size:12px;color:var(--text-muted)">🥈 Vize-Weltmeister</label>
           <select id="vice-sel" class="champ-sel">
             <option value="">– Vize-Weltmeister wählen –</option>${opts2()}
           </select>
           <button class="btn btn-primary btn-sm" onclick="saveChampTip()" style="align-self:flex-start">
             ${myTip ? '✓ Tipp aktualisieren' : '💾 Tipp speichern'}
           </button>
           ${myTip ? `<div style="font-size:11px;color:var(--text-muted)">Aktueller Tipp: <b>${esc(myTip.champion)}</b> / <b>${esc(myTip.vice)}</b></div>` : ''}
         </div>`;
  }

  el.innerHTML = `<div class="card">
    <div class="card-hdr">
      <span class="card-title">🌍 Weltmeister-Tipp</span>
      ${result ? '<span class="badge badge-finished">Ausgewertet</span>' : locked ? '<span class="badge badge-locked">Gesperrt</span>' : '<span class="badge badge-open">Offen</span>'}
    </div>
    <div class="card-body">${body}</div>
  </div>`;
}

window.saveChampTip = async function() {
  if (!S.user) { toast('Bitte zuerst Namen auswählen!', 'err'); return; }
  if (Date.now() >= CHAMP_DEADLINE) { toast('Tipp-Frist abgelaufen!', 'err'); return; }
  const champ = document.getElementById('champ-sel')?.value;
  const vice  = document.getElementById('vice-sel')?.value;
  if (!champ) { toast('Bitte Weltmeister auswählen!', 'err'); return; }
  if (!vice)  { toast('Bitte Vize-Weltmeister auswählen!', 'err'); return; }
  if (champ === vice) { toast('Weltmeister und Vize müssen verschieden sein!', 'err'); return; }
  try {
    await DB.saveChampTip(S.user, champ, vice);
    toast('Weltmeister-Tipp gespeichert! 🏆', 'ok');
    renderWidgetChampion();
  } catch(e) { toast('Fehler beim Speichern!', 'err'); }
};

// ── RENDER: GAMES ─────────────────────────────────────────────
function renderGames() {
  const el = document.getElementById('games-list');
  const games = GAMES.filter(g => {
    if (S.fRound !== 'all' && g.round !== S.fRound) return false;
    if (S.fStatus !== 'all' && getStatus(g) !== S.fStatus) return false;
    return true;
  });

  if (games.length === 0) {
    el.innerHTML = '<div class="empty" style="padding:48px">Keine Spiele in dieser Filterauswahl.</div>';
    return;
  }

  // Gruppe nach Runde
  const byRound = {};
  for (const g of games) {
    (byRound[g.round] = byRound[g.round] || []).push(g);
  }

  el.innerHTML = Object.entries(byRound).map(([round, gs]) => `
    <div class="round-hdr">${round} <span style="font-weight:400;font-size:10px;color:var(--text-subtle)">(${gs.length} Spiele)</span></div>
    <div class="games-block">${gs.map(g => renderGameCard(g)).join('')}</div>
  `).join('');

  // Event-Listener für Enter-Taste in Tipp-Inputs
  el.querySelectorAll('.tip-in').forEach(inp => {
    inp.addEventListener('keydown', e => { if(e.key==='Enter') submitTip(+inp.dataset.id); });
    inp.addEventListener('focus', () => inp.select());
  });
}

function renderGameCard(game) {
  const status  = getStatus(game);
  const locked  = isLocked(game);
  const result  = S.results[game.id];
  const myTip   = S.user ? getTip(game.id, S.user) : null;
  const myScore = (myTip && result) ? calcScore(myTip, result) : null;
  const hn = getTeamName(game,'home');
  const an = getTeamName(game,'away');

  // Mitte: Ergebnis, Eingabe oder Platzhalter
  let mid;
  if (result) {
    mid = `<div class="score-area"><span class="score-val">${result.home}:${result.away}</span></div>`;
  } else if (locked) {
    mid = `<div class="score-area"><span class="score-val score-pending">–:–</span></div>`;
  } else {
    const vh = myTip != null ? myTip.home : '';
    const va = myTip != null ? myTip.away : '';
    mid = `<div class="tip-inputs">
      <input type="number" class="tip-in" data-id="${game.id}" data-side="home"
        value="${vh}" min="0" max="99" placeholder="–" ${!S.user ? 'disabled title="Spieler auswählen"' : ''}>
      <span class="tip-sep">:</span>
      <input type="number" class="tip-in" data-id="${game.id}" data-side="away"
        value="${va}" min="0" max="99" placeholder="–" ${!S.user ? 'disabled title="Spieler auswählen"' : ''}>
    </div>`;
  }

  // Rechts: mein Tipp + Speichern
  let actions = '';
  if (!locked && S.user) {
    const lbl = myTip != null ? '✓ Aktualisieren' : '💾 Speichern';
    actions = `<button class="btn btn-sm btn-primary" id="save-btn-${game.id}" onclick="submitTip(${game.id})">${lbl}</button>`;
    if (myTip != null) {
      actions = `<span class="my-tip-txt">Tipp: <span class="my-tip-val">${myTip.home}:${myTip.away}</span></span>` + actions;
    }
  } else if (locked && myTip) {
    if (myScore !== null) {
      const cls = myScore===5?'pts-exact':myScore===3?'pts-diff':myScore===2?'pts-tend':'pts-wrong';
      actions = `<span class="pts-badge ${cls}">+${myScore} Pkt</span>
        <span class="my-tip-txt">(${myTip.home}:${myTip.away})</span>`;
    } else {
      actions = `<span class="my-tip-txt">Tipp: <span class="my-tip-val">${myTip.home}:${myTip.away}</span></span>`;
    }
  } else if (locked && !myTip && S.user) {
    actions = `<span style="font-size:11px;color:var(--text-subtle)">Kein Tipp</span>`;
  } else if (!S.user && !locked) {
    actions = `<span style="font-size:11px;color:var(--text-subtle)">← Name wählen</span>`;
  }

  // Alle Tipps (nach Anstoß sichtbar)
  let allTips = '';
  if (locked) {
    const gameTips = S.tips[game.id] || {};
    const chips = PARTICIPANTS.map(name => {
      const tip = gameTips[name];
      if (!tip) return `<div class="tip-chip"><span class="tc-name">${name}</span><span class="tc-none">–</span></div>`;
      const pts = result ? calcScore(tip, result) : null;
      const cls = pts===5?'tc-exact':pts===3?'tc-diff':pts===2?'tc-tend':result?'tc-wrong':'';
      const meClass = name===S.user ? 'tc-me' : '';
      return `<div class="tip-chip ${cls} ${meClass}">
        <span class="tc-name">${name===S.user?'★ ':''}<b>${name}</b></span>
        <span>
          <span class="tc-score">${tip.home}:${tip.away}</span>
          ${pts!==null ? `<span class="tc-pts">+${pts}</span>` : ''}
        </span>
      </div>`;
    });
    const withTip = Object.keys(gameTips).length;
    allTips = `<div class="all-tips">
      <div class="at-hdr">
        Alle Tipps
        <span style="background:var(--border);padding:2px 7px;border-radius:10px;font-size:10px">${withTip}/${PARTICIPANTS.length}</span>
      </div>
      <div class="tips-grid">${chips.join('')}</div>
    </div>`;
  }

  return `<div class="game-card" id="game-${game.id}">
    <div class="game-main">
      <div class="team-home"><span class="team-name"><span class="team-flag">${flagOf(hn)}</span> ${esc(hn)}</span></div>
      ${mid}
      <div class="team-away"><span class="team-name">${esc(an)} <span class="team-flag">${flagOf(an)}</span></span></div>
      <div class="game-meta">
        <span class="gm-time">${fmtFull(game.kickoff)}</span>
        <span class="gm-venue">${esc(game.venue.split(',').pop().trim())}</span>
        <div class="gm-badges">
          ${statusBadge(status)}
          ${game.group ? `<span class="badge badge-group">Gr. ${game.group}</span>` : `<span class="badge badge-group">${game.round}</span>`}
        </div>
      </div>
      <div class="game-actions">${actions}</div>
    </div>
    ${allTips}
  </div>`;
}

// Tipp speichern (öffentlich für onclick)
window.submitTip = async function(id) {
  if (!S.user) { toast('Bitte zuerst Namen auswählen!', 'err'); return; }
  const game = GAMES.find(g => g.id === id);
  if (!game || isLocked(game)) { toast('Dieses Spiel ist bereits gesperrt.', 'err'); return; }

  const hi = document.querySelector(`.tip-in[data-id="${id}"][data-side="home"]`);
  const ai = document.querySelector(`.tip-in[data-id="${id}"][data-side="away"]`);
  if (!hi || !ai) return;

  const home = Math.max(0, parseInt(hi.value, 10));
  const away = Math.max(0, parseInt(ai.value, 10));
  if (isNaN(home) || isNaN(away)) { toast('Bitte gültige Tore eingeben (z.B. 2:1)', 'err'); return; }

  const btn = document.getElementById(`save-btn-${id}`);
  if (btn) btn.disabled = true;
  toast('Wird gespeichert…', '');
  try {
    await setTip(id, home, away);
    toast(`✓ Tipp für ${getTeamName(game,'home')} – ${getTeamName(game,'away')} gespeichert!`, 'ok');
  } catch(e) {
    toast('Fehler beim Speichern. Bitte erneut versuchen.', 'err');
    if (btn) btn.disabled = false;
    return;
  }
  if (btn) btn.disabled = false;

  // Karte neu rendern
  const card = document.getElementById(`game-${id}`);
  if (card) {
    card.outerHTML = renderGameCard(game);
    document.getElementById(`game-${id}`)?.querySelectorAll('.tip-in').forEach(inp => {
      inp.addEventListener('keydown', e => { if(e.key==='Enter') submitTip(+inp.dataset.id); });
      inp.addEventListener('focus', () => inp.select());
    });
  }
  renderWidgetOpenTips();
  renderWidgetUpcoming();
  renderWidgetMiniBoard();
};

// Zu Spiel in Games-View springen
window.jumpToGame = function(id) {
  showView('spiele');piel
  S.fRound = 'all'; S.fStatus = 'all';
  updateFilterBtns();
  renderGames();
  setTimeout(() => {
    const el = document.getElementById(`game-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.style.boxShadow = '0 0 0 2px var(--accent)';
      setTimeout(() => { el.style.boxShadow = ''; }, 2000);
    }
  }, 80);
};

// ── RENDER: LEADERBOARD ───────────────────────────────────────
function renderLeaderboard() {
  const el = document.getElementById('leaderboard');
  const board = calcLeaderboard();
  const done  = GAMES.filter(g => hasResult(g)).length;

  el.innerHTML = `<div class="card">
    <div class="card-hdr">
      <span class="card-title">🏆 Gesamtrangliste</span>
      <span style="font-size:12px;color:var(--text-muted)">${done} / ${GAMES.length} Spiele ausgewertet</span>
    </div>
    <div class="board-note">
      Punkte: <b style="color:#81C4FF">Exakt = 5 Pkt</b> &nbsp;·&nbsp;
      <b style="color:#16588E">Richtige Tordifferenz = 3 Pkt</b> &nbsp;·&nbsp;
      <b style="color:#E7222E">Tendenz richtig = 2 Pkt</b> &nbsp;·&nbsp;
      <b style="color:var(--text-muted)">Falsch = 0 Pkt</b>
    </div>
    <div class="tbl-wrap">
      <table>
        <thead><tr>
          <th style="width:50px;text-align:center">#</th>
          <th>Spieler</th>
          <th class="td-center">Spiele</th>
          <th class="td-center" style="color:var(--green)">Punkte</th>
          <th class="td-center" style="color:#81C4FF">Exakt (5)</th>
          <th class="td-center" style="color:#16588E">Tordiff (3)</th>
          <th class="td-center" style="color:#E7222E">Tendenz (2)</th>
          <th class="td-center" style="color:var(--accent)">WM-Tipp</th>
        </tr></thead>
        <tbody>
          ${board.map((p, i) => {
            const rank = i + 1;
            const rCls = rank===1?'rank-1':rank===2?'rank-2':rank===3?'rank-3':'rank-other';
            const isMe = p.name === S.user;
            const tippedCount = GAMES.filter(g => getTip(g.id, p.name) !== null).length;
            const quote = p.games > 0 ? Math.round((p.points - p.champPts) / (p.games * 5) * 100) : 0;
            const champVisible = Date.now() >= new Date('2026-06-15T00:00').getTime();
            const champTip = S.champTips[p.name];
            const champCell = !champVisible
              ? '<span style="color:var(--text-subtle);font-size:11px">ab Mo.</span>'
              : S.champResult
                ? `<span class="pts-badge ${p.champPts>0?'pts-exact':'pts-wrong'}">+${p.champPts}</span>`
                : champTip ? `<span style="font-size:11px;color:var(--text-muted)">${esc(champTip.champion)}</span>` : '<span style="color:var(--text-subtle)">–</span>';
            return `<tr class="${isMe ? 'td-me' : ''}">
              <td class="td-rank ${rCls}">${rank}</td>
              <td style="font-weight:${isMe?700:400};${isMe?'color:var(--accent)':''}">${isMe?'⭐ ':''}${esc(p.name)}</td>
              <td class="td-center" style="color:var(--text-muted)">${p.games}</td>
              <td class="td-pts" style="color:var(--green)">${p.points}</td>
              <td class="td-center" style="font-weight:700;color:#81C4FF">${p.exact}</td>
              <td class="td-center" style="font-weight:700;color:#16588E">${p.diff}</td>
              <td class="td-center" style="font-weight:700;color:#E7222E">${p.tend}</td>
              <td class="td-center">${champCell}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

// ── RENDER: ADMIN PANEL ───────────────────────────────────────
function renderAdmin() {
  const el = document.getElementById('admin-list');

  // ─ Weltmeister-Sektion ─
  const champOpts  = ALL_TEAMS.map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join('');
  let champSection = `<div class="adm-row" style="border-left:3px solid var(--accent)">
    <div class="adm-teams" style="color:var(--accent)">🌍 Weltmeister &amp; Vize-Weltmeister</div>
    <div class="adm-meta">Weltmeister richtig = 15 Pkt &nbsp;·&nbsp; Vize richtig = 5 Pkt</div>
    <div class="adm-result-line">
      ${S.champResult
        ? `<span class="adm-saved">🥇 ${esc(S.champResult.champion)} &nbsp;/&nbsp; 🥈 ${esc(S.champResult.vice)}</span>
           <button class="btn btn-ghost btn-sm" onclick="adminEditChamp()">✎ Ändern</button>
           <button class="btn btn-danger btn-sm" onclick="adminDeleteChamp()">✕ Löschen</button>`
        : `<select id="adm-champ" class="adm-name-in" style="width:160px">
             <option value="">– Weltmeister –</option>${champOpts}
           </select>
           <select id="adm-vice" class="adm-name-in" style="width:160px">
             <option value="">– Vize-Weltmeister –</option>${champOpts}
           </select>
           <button class="btn btn-primary btn-sm" onclick="adminSaveChamp()">✓ Eintragen</button>`}
    </div>
  </div>`;

  const lockedGames = GAMES.filter(g => isLocked(g));
  const koGames     = GAMES.filter(g => !g.group && !isLocked(g));

  // ─ K.O.-Team-Namen vorab eintragen (noch nicht gesperrt) ─
  const koNamesHtml = koGames.length === 0 ? '' : `
    <div class="adm-row" style="border-left:3px solid var(--accent-muted)">
      <div class="adm-teams" style="color:var(--text-muted)">⚽ K.O.-Team-Namen vorab eintragen</div>
      <div class="adm-meta">Diese Spiele sind noch offen – Namen werden sofort in der Spielansicht angezeigt.</div>
      ${koGames.map(g => {
        const hn = getTeamName(g,'home');
        const an = getTeamName(g,'away');
        return `<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border-light)">
          <div style="font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:6px">${g.round} · ${fmtDate(g.kickoff)} · #${g.id}</div>
          <div class="adm-names-row">
            <input class="adm-name-in" id="an-h-${g.id}" value="${esc(hn)}" placeholder="Heim-Team">
            <span class="adm-sep">vs</span>
            <input class="adm-name-in" id="an-a-${g.id}" value="${esc(an)}" placeholder="Auswärts-Team">
            <button class="btn btn-ghost btn-sm" onclick="adminSaveNames(${g.id})">✎ Speichern</button>
          </div>
        </div>`;
      }).join('')}
    </div>`;

  const gamesHtml = lockedGames.length === 0
    ? '<div class="empty">Noch keine Spiele gesperrt.</div>'
    : lockedGames.map(g => {
    const r = S.results[g.id];
    const hn = getTeamName(g,'home');
    const an = getTeamName(g,'away');
    const isKO = !g.group;
    return `<div class="adm-row">
      <div class="adm-teams">${esc(hn)} vs ${esc(an)}</div>
      <div class="adm-meta">${fmtFull(g.kickoff)} · ${g.group ? 'Gruppe '+g.group : g.round} · #${g.id}</div>

      ${isKO ? `
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Team-Namen anpassen:</div>
        <div class="adm-names-row">
          <input class="adm-name-in" id="an-h-${g.id}" value="${esc(hn)}" placeholder="Heim-Team">
          <span class="adm-sep">vs</span>
          <input class="adm-name-in" id="an-a-${g.id}" value="${esc(an)}" placeholder="Auswärts-Team">
          <button class="btn btn-ghost btn-sm" onclick="adminSaveNames(${g.id})">✎ Speichern</button>
        </div>` : ''}

      <div class="adm-result-line">
        ${r
          ? `<span class="adm-saved">Ergebnis: ${r.home}:${r.away}</span>
             <button class="btn btn-ghost btn-sm" onclick="adminEditResult(${g.id})">✎ Ändern</button>
             <button class="btn btn-danger btn-sm" onclick="adminDeleteResult(${g.id})">✕ Löschen</button>`
          : `<input type="number" class="adm-in" id="ar-h-${g.id}" min="0" max="99" placeholder="0">
             <span class="adm-sep">:</span>
             <input type="number" class="adm-in" id="ar-a-${g.id}" min="0" max="99" placeholder="0">
             <button class="btn btn-primary btn-sm" onclick="adminSaveResult(${g.id})">✓ Ergebnis eintragen</button>`}
      </div>
    </div>`;
    }).join('');

  el.innerHTML = champSection + koNamesHtml + gamesHtml;
}

window.adminResetAll = async function() {
  if (!confirm('Wirklich ALLE Tipps, Ergebnisse, Team-Namen und Weltmeister-Tipps löschen? Das kann nicht rückgängig gemacht werden!')) return;
  toast('Wird gelöscht…', '');
  try {
    await DB.resetAll();
    toast('Alle Tipps & Ergebnisse gelöscht.', 'ok');
    renderAdmin();
    refreshView();
  } catch(e) { toast('Fehler beim Löschen!', 'err'); }
};

window.adminSaveChamp = async function() {
  const champ = document.getElementById('adm-champ')?.value;
  const vice  = document.getElementById('adm-vice')?.value;
  if (!champ) { toast('Bitte Weltmeister auswählen!', 'err'); return; }
  if (!vice)  { toast('Bitte Vize-Weltmeister auswählen!', 'err'); return; }
  if (champ === vice) { toast('Weltmeister und Vize müssen verschieden sein!', 'err'); return; }
  toast('Wird gespeichert…', '');
  try {
    await DB.saveChampResult(champ, vice);
    toast(`Weltmeister eingetragen: ${champ} / ${vice}`, 'ok');
    renderAdmin();
    refreshView();
  } catch(e) { toast('Fehler beim Speichern!', 'err'); }
};

window.adminEditChamp = async function() {
  try { await DB.deleteChampResult(); renderAdmin(); } catch(e) { toast('Fehler!', 'err'); }
};

window.adminDeleteChamp = async function() {
  if (!confirm('Weltmeister-Ergebnis wirklich löschen?')) return;
  try {
    await DB.deleteChampResult();
    toast('Weltmeister-Ergebnis gelöscht.', 'ok');
    renderAdmin();
    refreshView();
  } catch(e) { toast('Fehler beim Löschen!', 'err'); }
};

window.adminSaveResult = async function(id) {
  const hi = document.getElementById(`ar-h-${id}`);
  const ai = document.getElementById(`ar-a-${id}`);
  const home = Math.max(0, parseInt(hi?.value, 10));
  const away = Math.max(0, parseInt(ai?.value, 10));
  if (isNaN(home) || isNaN(away)) { toast('Bitte gültige Tore eingeben!', 'err'); return; }
  toast('Wird gespeichert…', '');
  try {
    await setResult(id, home, away);
    toast(`Ergebnis gespeichert: ${home}:${away}`, 'ok');
    renderAdmin();
    refreshView();
  } catch(e) { toast('Fehler beim Speichern!', 'err'); }
};

window.adminDeleteResult = async function(id) {
  if (!confirm('Ergebnis wirklich löschen?')) return;
  try {
    await clearResult(id);
    toast('Ergebnis gelöscht.', 'ok');
    renderAdmin();
    refreshView();
  } catch(e) { toast('Fehler beim Löschen!', 'err'); }
};

window.adminEditResult = async function(id) {
  try { await clearResult(id); renderAdmin(); } catch(e) { toast('Fehler!', 'err'); }
};

window.adminSaveNames = async function(id) {
  const hi = document.getElementById(`an-h-${id}`);
  const ai = document.getElementById(`an-a-${id}`);
  if (!hi || !ai) return;
  try {
    await setTeamName(id, hi.value, ai.value);
    toast('Team-Namen gespeichert.', 'ok');
    renderAdmin();
    refreshView();
  } catch(e) { toast('Fehler beim Speichern!', 'err'); }
};

// ── NAVIGATION ────────────────────────────────────────────────
function showView(name) {
  S.view = name;
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(`sec-${name}`).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === name));
  if (name === 'dashboard') renderDashboard();
  if (name === 'spiele')    { renderRoundFilters(); renderGames(); }
  if (name === 'rangliste') renderLeaderboard();
}

function refreshView() { showView(S.view); }

function updateFilterBtns() {
  document.querySelectorAll('.flt-btn[data-status]').forEach(b => b.classList.toggle('active', b.dataset.status===S.fStatus));
  document.querySelectorAll('.flt-btn[data-round]').forEach(b => b.classList.toggle('active', b.dataset.round===S.fRound));
}

function renderRoundFilters() {
  const rounds = ['all', ...new Set(GAMES.map(g => g.round))];
  const labels = { all:'Alle', Gruppenphase:'Gruppenphase', 'Runde der 32':'R. der 32',
    Achtelfinale:'Achtelfinale', Viertelfinale:'Viertelfinale', Halbfinale:'Halbfinale',
    'Spiel um Platz 3':'Platz 3', Finale:'Finale' };
  document.getElementById('round-filters').innerHTML = rounds.map(r =>
    `<button class="flt-btn ${r===S.fRound?'active':''}" data-round="${r}">${labels[r]||r}</button>`
  ).join('');
}

// ── TOAST ─────────────────────────────────────────────────────
let toastTimer;
function toast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `show${type ? ' t-'+type : ''}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.className = ''; }, 2800);
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Spieler-Dropdown befüllen (sofort, ohne Wartezeit)
  const sel = document.getElementById('userSelect');
  S.user = localStorage.getItem('wm26_user') || null;
  PARTICIPANTS.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name; opt.textContent = name;
    if (name === S.user) opt.selected = true;
    sel.appendChild(opt);
  });
  sel.addEventListener('change', () => {
    S.user = sel.value || null;
    localStorage.setItem('wm26_user', S.user || '');
    refreshView();
  });

  // Navigation
  document.querySelectorAll('.nav-btn[data-view]').forEach(btn => {
    btn.addEventListener('click', () => showView(btn.dataset.view));
  });

  // Status-Filter (Event Delegation)
  document.addEventListener('click', e => {
    if (e.target.matches('.flt-btn[data-status]')) {
      S.fStatus = e.target.dataset.status;
      updateFilterBtns(); renderGames();
    }
    if (e.target.matches('.flt-btn[data-round]')) {
      S.fRound = e.target.dataset.round;
      updateFilterBtns(); renderGames();
    }
  });

  // Admin-Panel öffnen / schließen
  const adminPanel = document.getElementById('admin-panel');
  const overlay    = document.getElementById('overlay');
  document.getElementById('adminBtn').addEventListener('click', () => {
    S.adminOpen = !S.adminOpen;
    adminPanel.classList.toggle('open', S.adminOpen);
    overlay.classList.toggle('show', S.adminOpen);
    document.getElementById('adminBtn').textContent = S.adminOpen ? '✕ Admin' : '⚙ Admin';
    if (S.adminOpen) renderAdmin();
  });
  document.getElementById('adminClose').addEventListener('click', closeAdmin);
  overlay.addEventListener('click', closeAdmin);
  function closeAdmin() {
    S.adminOpen = false;
    adminPanel.classList.remove('open');
    overlay.classList.remove('show');
    document.getElementById('adminBtn').textContent = '⚙ Admin';
  }

  renderRoundFilters();

  // Firebase Echtzeit-Listener starten
  // Feuert sofort beim ersten Laden UND bei jeder Änderung von anderen Nutzern
  let _firstLoad = true;
  DB.startListening(() => {
    if (_firstLoad) {
      _firstLoad = false;
      showView('dashboard');
    } else {
      refreshView();
      if (S.adminOpen) renderAdmin();
    }
  });
});
