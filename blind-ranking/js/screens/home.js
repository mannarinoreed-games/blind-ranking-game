import { register, go } from '../router.js';
import { resetGame } from '../state.js';
import { render, $ } from '../util.js';

register('home', () => {
  resetGame();
  render(`<h1>🎯 Blind Ranking</h1>
    <div class="menu">
      <button class="big" id="c">Create a game</button>
      <button class="big" id="j">Join a game</button>
    </div>`);
  $('#c').onclick = () => go('create');
  $('#j').onclick = () => go('join');
});
