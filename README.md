# 🎯 Blind Ranking

Real-time multiplayer ranking game. Plain HTML/CSS/JS (ES modules), Firebase Firestore for the live data.

## Structure
```
index.html          page shell
css/styles.css      all styling (light + dark)
firestore.rules     database security rules
js/
  config.js         YOUR Firebase config goes here
  db.js             the only file that talks to Firebase
  main.js           startup: connect, sign in, show home
  state.js          shared app state + small helpers
  router.js         screen registry and navigation
  session.js        subscriptions, syncing, game-state transitions
  settings.js       settings editor + validation (create page and lobby)
  util.js           DOM/escape/shuffle helpers
  screens/          home, create, join, lobby, play, results (+ host live view)
```

## Setup (about 5 minutes, free Spark plan)
1. Go to the Firebase console and create a project.
2. **Build → Authentication → Sign-in method:** enable **Anonymous**.
3. **Build → Firestore Database:** create a database (production mode).
4. **Firestore → Rules:** paste the contents of `firestore.rules` and publish.
5. **Project settings → Your apps → Web (`</>`):** register an app, copy the config into `js/config.js`.
6. Serve the folder over HTTP (ES modules don't work from `file://`):
   `npx serve .` or `python3 -m http.server`, then open the printed URL.
7. To go live, deploy the folder to Firebase Hosting, Netlify, GitHub Pages, etc. Add that domain under
   Authentication → Settings → Authorized domains.

## Known limits
- The creator's list lives in the game document, so a player using dev tools could read it. Fine for friends, not for stakes.
- Refreshing mid-game drops that player's local progress.
- Old games are never cleaned up. Add a Firestore TTL policy on the `created` field if you care.
