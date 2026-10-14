import * as db from '../db.js';
import { register, go } from '../router.js';
import { S } from '../state.js';
import { render, toast, $ } from '../util.js';
import { pushMe, subscribe } from '../session.js';

register('join', () => {
  render(`<h1>Join a game</h1>
    <div class="card"><input id="jc" class="codein" inputmode="numeric" maxlength="6" placeholder="6-digit code"></div>
    <button class="big" id="go">Join game</button>
    <button class="sec full" id="bk">Back</button>`);
  $('#bk').onclick = () => go('home');

  const join = async () => {
    const code = $('#jc').value.replace(/\D/g, '');
    if (code.length !== 6) return toast('Enter the 6-digit code.');
    try {
      const game = await db.getGame(code);
      if (!game) return toast('No game with that code.');
      if (game.status !== 'lobby') return toast('That game has already started.');
      S.code = code; S.game = game; S.me.name = S.me.name || 'Player';
      subscribe(); await pushMe(); go('lobby');
    } catch (e) { toast('Could not join: ' + (e.code || e.message)); }
  };
  $('#go').onclick = join;
  $('#jc').onkeydown = e => { if (e.key === 'Enter') join(); };
});
