// Settings editor shared by "Create game" and the host's lobby.
// Mutates `cfg` as the user types; calls onChange() when a change is committed.
import { esc } from './util.js';

export function settingsUI(el, cfg, onChange) {
  const draw = () => {
    el.innerHTML = `
      <input id="gn" maxlength="40" placeholder="Name your ranking list (e.g. Best pizza toppings)" value="${esc(cfg.name)}">
      <div class="seg">${[5, 10].map(n => `<button data-n="${n}" class="${cfg.spots === n ? 'on' : ''}">${n} spots</button>`).join('')}</div>
      <select id="gt">${[15, 20, 30, 45, 60].map(s => `<option value="${s}" ${s === cfg.secs ? 'selected' : ''}>${s} seconds per item</option>`).join('')}</select>
      <p class="mut">Type your choices in order: #1 is your top pick.</p>
      ${Array.from({ length: cfg.spots }, (_, i) => `
        <div class="irow"><b>${i + 1}</b>
          <input data-i="${i}" maxlength="40" placeholder="${i ? 'Choice #' + (i + 1) : 'Your #1 (best)'}" value="${esc(cfg.items[i] || '')}">
        </div>`).join('')}`;

    const gn = el.querySelector('#gn');
    gn.oninput = () => (cfg.name = gn.value);
    gn.onchange = () => onChange();

    el.querySelectorAll('.seg button').forEach(b => (b.onclick = () => {
      cfg.spots = +b.dataset.n;
      cfg.items = Array.from({ length: cfg.spots }, (_, i) => cfg.items[i] || '');
      draw(); onChange();
    }));

    const gt = el.querySelector('#gt');
    gt.onchange = () => { cfg.secs = +gt.value; onChange(); };

    el.querySelectorAll('input[data-i]').forEach(inp => {
      inp.oninput = () => (cfg.items[+inp.dataset.i] = inp.value);
      inp.onchange = () => onChange();
    });
  };
  draw();
}

export function validate(cfg) {
  if (!cfg.name.trim()) return 'Give your ranking list a name.';
  const it = cfg.items.slice(0, cfg.spots).map(s => s.trim());
  if (it.some(s => !s)) return `Fill in all ${cfg.spots} choices.`;
  if (new Set(it.map(s => s.toLowerCase())).size < it.length) return 'Two choices are identical. Make each one unique.';
  return null;
}
