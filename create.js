import * as db from '../db.js';
import { register, go } from '../router.js';
import { S } from '../state.js';
import { render, toast, $ } from '../util.js';
import { settingsUI, validate } from '../settings.js';
import { pushMe, subscribe } from '../session.js';

register('create', () => {
  const cfg = { name: '', spots: 5, secs: 30, items: Array(5).fill('') };
  render(`<h1>Create a game</h1>
    <div class="card"><div id="sets"></div></div>
    <button class="big" id="go">Create game</button>
    <button class="sec full" id="bk">Back</button>`);
  settingsUI($('#sets'), cfg, () => {});
  $('#bk').onclick = () => go('home');

  $('#go').onclick = async () => {
    const err = validate(cfg);
    if (err) return toast(err);
    $('#go').disabled = true;
    try {
      let code;
      for (let t = 0; t < 8; t++) {           // find an unused 6-digit code
        code = String(100000 + Math.floor(Math.random() * 900000));
        if (!(await db.getGame(code))) break;
      }
      const game = {
        name: cfg.name.trim(), spots: cfg.spots, secs: cfg.secs,
        items: cfg.items.slice(0, cfg.spots).map(s => s.trim()),
        hostId: S.me.id, status: 'lobby', order: [], created: Date.now(),
      };
      await db.createGame(code, game);
      S.code = code; S.game = game; S.me.name = S.me.name || 'Host';
      subscribe(); await pushMe(); go('lobby');
    } catch (e) {
      $('#go').disabled = false;
      toast('Could not create game: ' + (e.code || e.message));
    }
  };
});
