export const $ = s => document.querySelector(s);
export const esc = s => String(s ?? '').replace(/[&<>"']/g,
  c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const ANIMALS = [...'🦊🐼🐨🦁🐯🐸🐵🐧🦉🐙🦄🐢🦋🐬🦒🦘🐘🦔🐰🐻'];
export const rnd = a => a[Math.floor(Math.random() * a.length)];

export function shuffle(n) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Replaces the page content, keeping a hidden error banner at the top. */
export function render(html) {
  $('#app').innerHTML = '<div id="msg" class="err" hidden></div>' + html;
}
export function toast(msg) {
  const e = $('#msg');
  if (!e) return;
  e.textContent = msg;
  e.hidden = false;
  setTimeout(() => (e.hidden = true), 4500);
}
