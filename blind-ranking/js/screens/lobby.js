import * as db from '../db.js';
import { register } from '../router.js';
import { S, isHost, others, save } from '../state.js';
import { render, esc, rnd, ANIMALS, shuffle, toast, $ } from '../util.js';
import { settingsUI, validate } from '../settings.js';
import { pushMe } from '../session.js';

function drawPlayers() {
  const e = Object.entries(S.players);
  $('#pc').textContent = e.length;
  $('#pl').innerHTML = e.map(([id, p]) =>
    `<div class="pl"><span>${p.avatar}</span><span>${esc(p.name)}${p.host ? ' 👑' : ''}${id === S.me.id ? ' (you)' : ''}</span></div>`).join('');
}

function refresh() {
  if (!isHost()) {
    const g = S.game;
    $('#sets').innerHTML = `<p><b>${esc(g.name)}</b></p><p class="mut">${g.spots} ranking spots · ${g.secs}s per item</p>`;
  }
  drawPlayers();
}

register('lobby', () => {
  const host = isHost();
  render(`<h1>Lobby</h1>
    <div class="card"><div class="code">${S.code}</div><div class="mut center">Game code. Players join with this.</div></div>
    <div class="card">
      <div class="row"><div class="av" id="av">${S.me.avatar}</div><button class="sec" id="shuf">🎲 New animal</button></div>
      <input id="nm" maxlength="16" placeholder="Your name" value="${esc(S.me.name)}">
    </div>
    <div class="card"><h3>Game settings ${host ? '' : '<span class="mut">(host only)</span>'}</h3><div id="sets"></div></div>
    <div class="card"><h3>Players (<span id="pc"></span>)</h3><div id="pl"></div></div>
    ${host ? '<button class="big" id="go">Start game</button>' : '<p class="mut center">Waiting for the host to start…</p>'}`);

  $('#shuf').onclick = () => { S.me.avatar = rnd(ANIMALS); $('#av').textContent = S.me.avatar; pushMe(); };
  let t;
  $('#nm').oninput = e => {
    S.me.name = e.target.value.trim() || 'Player'; save('br_name', S.me.name);
    clearTimeout(t); t = setTimeout(pushMe, 400);
  };

  if (host) {
    const g = S.game;
    const cfg = { name: g.name, spots: g.spots, secs: g.secs, items: [...g.items] };
    const saveCfg = () => db.updateGame(S.code, {
      name: cfg.name.trim() || 'Untitled', spots: cfg.spots, secs: cfg.secs,
      items: cfg.items.slice(0, cfg.spots).map(s => s.trim()),
    }).catch(e => toast('Save failed: ' + e.code));
    settingsUI($('#sets'), cfg, saveCfg);

    $('#go').onclick = async () => {
      const err = validate(cfg);
      if (err) return toast(err);
      if (!others().length) return toast('Wait for at least one player to join.');
      await saveCfg();
      db.updateGame(S.code, { status: 'playing', order: shuffle(cfg.spots), startedAt: Date.now() });
    };
  }
  refresh();
}, refresh);
