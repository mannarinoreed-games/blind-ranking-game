// The ONLY file that knows about Firebase. To switch to Supabase, rewrite this file
// and keep the same exported function names.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, doc, collection, getDoc, setDoc, updateDoc, onSnapshot }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { firebaseConfig } from './config.js';

let fs;
export const isConfigured = () => !String(firebaseConfig.apiKey).startsWith('YOUR_');

/** Connects and signs in anonymously. Resolves to this player's stable uid. */
export async function init() {
  const app = initializeApp(firebaseConfig);
  fs = getFirestore(app);
  const cred = await signInAnonymously(getAuth(app));
  return cred.user.uid;
}

export async function getGame(code) {
  const s = await getDoc(doc(fs, 'games', code));
  return s.exists() ? s.data() : null;
}
export const createGame = (code, game) => setDoc(doc(fs, 'games', code), game);
export const updateGame = (code, patch) => updateDoc(doc(fs, 'games', code), patch);
export const setPlayer = (code, id, p) => setDoc(doc(fs, 'games', code, 'players', id), p);

export const watchGame = (code, cb, onErr) =>
  onSnapshot(doc(fs, 'games', code), s => s.exists() && cb(s.data()), onErr);

export const watchPlayers = (code, cb, onErr) =>
  onSnapshot(collection(fs, 'games', code, 'players'), q => {
    const out = {};
    q.forEach(d => (out[d.id] = d.data()));
    cb(out);
  }, onErr);
