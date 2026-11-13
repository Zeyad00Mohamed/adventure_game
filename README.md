# The Golden Dragon

A storybook port of the Python text adventure. Plain HTML, CSS and JavaScript. No build step, no backend. Includes a visible English/Arabic language switch.

## Deploy on GitHub Pages
1. Upload everything in this folder to a repository (keep `index.html` at the root).
2. Settings, then Pages, then *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. Open `https://<user>.github.io/<repo>/`. All paths are relative, so repository subpaths work.

## Structure
- `js/game.js` rules and story (no DOM), `js/ui.js` book pages and language switching, `js/ar.js` Arabic translations, `css/style.css` theme.
- `assets/images/<scene>.webp` scene art (forest, wolf, river, echo, cave, corridor, tunnel, gate, hall, over, win). Replace a file with the same name to change a scene.
- `assets/fonts/` put `UncialAntiqua-Regular.ttf`, `IMFellEnglish-Regular.ttf`, `IMFellEnglish-Italic.ttf` here (both are free OFL fonts). Without them the site uses a Georgia-style fallback.
