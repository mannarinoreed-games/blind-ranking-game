import * as db from './db.js';
import { S } from './state.js';
import { go } from './router.js';
import { render } from './util.js';
import './screens/home.js';
import './screens/create.js';
import './screens/join.js';
import './screens/lobby.js';
import './screens/play.js';
import './screens/results.js';

(async () => {
  if (!db.isConfigured()) {
    return render(`<h1>🎯 Blind Ranking</h1><div class="err">Firebase isn't configured yet. Paste your web app config into <b>js/config.js</b> (see README.md).</div>`);
  }
  try {
    S.me.id = await db.init();
    go('home');
  } catch (e) {
    render(`<h1>🎯 Blind Ranking</h1><div class="err">Couldn't connect: ${e.code || e.message}. Check that Anonymous sign-in is enabled and the config is correct.</div>`);
  }
})();
