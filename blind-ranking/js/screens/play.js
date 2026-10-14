import { register, go } from '../router.js';
import { S } from '../state.js';
import { render, esc, $ } from '../util.js';
import { pushMe } from '../session.js';

function drawSlots() {
  const { my, game } = S;
  $('#slots').innerHTML = my.placements.map((k, i) => `
    <button class="slot ${k >= 0 ? 'f' : ''} ${my.sel === i ? 'sel' : ''}" data-i="${i}" ${k >= 0 ? 'disabled' : ''}>
      <b>${i + 1}.</b><span>${k >= 0 ? esc(game.items[k]) : 'Tap to place here'}</span>
    </button>`).join('');
  $('#slots').querySelectorAll('button').forEach(b => (b.onclick = () => {
    my.sel = +b.dataset.i; drawSlots(); $('#lock').disabled = false;
  }));
}

function drawRound() {
  const { my, game } = S;
  render(`<div class="top"><span class="mut">Item ${my.round + 1} of ${game.spots}</span><span class="tm" id="tm">${game.secs}</span></div>
    <div class="bar"><i id="bar"></i></div>
    <div class="card item">${esc(game.items[game.order[my.round]])}</div>
    <div id="slots"></div>
    <button class="big" id="lock" disabled>Lock in</button>`);
  drawSlots();
  $('#lock').onclick = () => { if (my.sel != null) place(my.sel); };
}

function place(slot) {
  const { my, game } = S;
  my.placements[slot] = game.order[my.round];
  my.round++; my.sel = null; my.rs = Date.now();
  if (my.round >= game.spots) { my.done = true; clearInterval(S.timer); pushMe(); go('results'); }
  else { pushMe(); drawRound(); }
}

function tick() {
  if (S.screen !== 'play') return;
  const { my, game } = S;
  const left = game.secs - (Date.now() - my.rs) / 1000;
  const tm = $('#tm');
  if (tm) { tm.textContent = Math.max(0, Math.ceil(left)); $('#bar').style.width = Math.max(0, left / game.secs * 100) + '%'; }
  if (left <= 0) place(my.placements.indexOf(-1));   // auto-place at highest open rank
}

register('play', () => {
  S.my = { placements: Array(S.game.spots).fill(-1), round: 0, done: false, sel: null, rs: Date.now() };
  drawRound();
  clearInterval(S.timer);
  S.timer = setInterval(tick, 200);
});
