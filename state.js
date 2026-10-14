import { ANIMALS, rnd } from './util.js';

const load = k => { try { return localStorage.getItem(k) || ''; } catch { return ''; } };
export const save = (k, v) => { try { localStorage.setItem(k, v); } catch {} };

/** Single shared mutable state for the whole app. */
export const S = {
  me: { id: null, name: load('br_name'), avatar: rnd(ANIMALS) },
  code: null,      // current game code
  game: null,      // live game doc
  players: {},     // live players map {uid: {...}}
  my: null,        // local play state while ranking
  screen: 'home',
  unsubs: [],
  timer: null,
  ending: false,
};

export const isHost = () => !!S.game && S.game.hostId === S.me.id;
export const others = () => Object.entries(S.players).filter(([, p]) => !p.host);
export const score = p => (p.placements || []).filter((k, i) => k === i).length;

export function resetGame() {
  S.unsubs.forEach(u => u());
  clearInterval(S.timer);
  Object.assign(S, { code: null, game: null, players: {}, my: null, unsubs: [], timer: null, ending: false });
}
