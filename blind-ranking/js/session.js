// Glue between the database and the UI: syncing, subscriptions, game-state transitions.
import * as db from './db.js';
import { S, isHost, others } from './state.js';
import { go, refresh } from './router.js';
import { toast } from './util.js';

export const pushMe = () =>
  db.setPlayer(S.code, S.me.id, {
    name: S.me.name || 'Player', avatar: S.me.avatar, host: isHost(),
    placements: S.my ? S.my.placements : [], round: S.my ? S.my.round : 0, done: !!(S.my && S.my.done),
  }).catch(e => toast('Sync problem: ' + (e.message || e.code)));

export function subscribe() {
  const err = e => toast('Connection problem: ' + (e.code || e.message));
  S.unsubs.push(db.watchGame(S.code, g => { S.game = g; onGame(); }, err));
  S.unsubs.push(db.watchPlayers(S.code, p => { S.players = p; onPlayers(); }, err));
}

function onGame() {
  const { game } = S;
  if (game.status === 'playing' && S.screen === 'lobby') return go(isHost() ? 'watch' : 'play');
  if (game.status === 'done') {
    if (S.screen === 'watch') return go('results');
    if (S.screen === 'play') { clearInterval(S.timer); S.my.done = true; return go('results'); }
  }
  refresh();
}

function onPlayers() {
  refresh();
  // Host closes the game once every non-host player has finished.
  if (isHost() && S.game.status === 'playing' && !S.ending) {
    const o = others();
    if (o.length && o.every(([, p]) => p.done)) { S.ending = true; db.updateGame(S.code, { status: 'done' }); }
  }
}
