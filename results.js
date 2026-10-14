import * as db from '../db.js';
import { register, go } from '../router.js';
import { S, isHost, others, score } from '../state.js';
import { render, esc, $ } from '../util.js';

function table(list, live) {
  const n = S.game.spots, items = S.game.items;
  let h = '<table><tr><th></th><th>👑 Creator</th>' + list.map(([, p]) =>
    `<th>${p.avatar} ${esc(p.name)}<small>${live ? Math.min(p.round || 0, n) + '/' + n + ' placed' : score(p) + '/' + n + ' match'}</small></th>`).join('') + '</tr>';
  for (let i = 0; i < n; i++) {
    h += `<tr><th>${i + 1}</th><td>${esc(items[i])}</td>` + list.map(([, p]) => {
      const k = (p.placements || [])[i], has = k >= 0;
      return `<td class="${has && k === i ? 'ok' : ''}">${has ? esc(items[k]) : '—'}</td>`;
    }).join('') + '</tr>';
  }
  return h + '</table>';
}

// Host's live view while players are ranking
register('watch', () => {
  render(`<h1>${esc(S.game.name)}</h1><p class="mut center">Live view. Players are ranking now.</p>
    <div class="card scroll" id="tb"></div>
    <button class="sec full" id="end">End game now</button>`);
  $('#end').onclick = () => db.updateGame(S.code, { status: 'done' });
  $('#tb').innerHTML = table(others(), true);
}, () => { const t = $('#tb'); if (t) t.innerHTML = table(others(), true); });

// Final side-by-side screen
function results() {
  const list = isHost()
    ? others().sort((a, b) => score(b[1]) - score(a[1]))
    : [[S.me.id, { ...S.me, placements: S.my.placements, round: S.my.round }]];
  render(`<h1>Results</h1><p class="mut center">${esc(S.game.name)} · green = same spot as the creator</p>
    <div class="card scroll">${table(list, false)}</div>
    <button class="big" id="hm">Home</button>`);
  $('#hm').onclick = () => go('home');
}
register('results', results, () => { if (isHost()) results(); });
