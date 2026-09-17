# Compunnel Digital: Accelerators page

The full page: header, sub-nav, breadcrumb, hero, AI search, and below it the interactive accelerators propeller section.

## Run
Open `index.html` in a browser. `standalone.html` is the same page in one file.

## Structure
```
index.html              header, hero, search, accelerators section, dialog
css/site.css            header, sub-nav, mobile drawer, hero art, AI search, chips
css/accelerators.css    propeller section (tokens, leaves, panel, values, dialog)
js/data.js              ACCELERATORS + VALUES content and URLs
js/icons.js             24x24 stroke icons
js/config.js            geometry, state, DOM refs
js/render.js            section rendering
js/animation.js         clockwise rotation, panel transition, accent colour
js/interaction.js       leaf selection, keyboard nav, detail dialog
js/intro.js             first-view clockwise spin
js/site-search.js       search matching, chips, voice input, mobile menu
js/hero-video.js        hero video pause/play, reduced motion, save-data
media/hero.mp4          hero background video (1080p, muted, 5.9 MB)
media/hero-poster.jpg   first frame shown before the video loads
media/accelerators/     sub-accelerator diagrams (717x525 GIFs)
js/main.js              init
```

## AI search (prototype)
The search runs entirely in the browser. It scores the query against `KEYWORDS` (in `js/site-search.js`) and the sub-accelerator names. It then selects the best-matching domain, rotates the propeller and scrolls to the section. A sub-accelerator name such as "DataPulse" matches most strongly. To connect a real AI or search backend, replace `runSearch()`.

The microphone button appears only in browsers that support the Web Speech API.

## Sub-accelerator accordion and diagrams
Each sub-accelerator in the right panel is an accordion item, and only one is open at a time. The open item shows its diagram at the full width of the panel, plus a "Learn more" link.
- The expand button at the top-right of the diagram opens it in a large popup. Close it with the close button, Esc, or a click outside.
- Diagrams load only the first time their item is opened.
- To add a diagram, set `media` on the sub-accelerator in `js/data.js`:
  ```js
  media:{ src:"media/accelerators/cloudforge.gif", alt:"CloudForge diagram: ..." }
  ```
- Items with `media:null` (Data-to-Insight, Cloud & Platform, Quality Engineering) already open as accordions and show a "Diagram coming soon" placeholder until an image is added.
- `tm:true` adds ™ after the name. A search for a sub-accelerator name opens its item automatically.

## Not wired yet
The header dropdowns, region picker and theme button are visual only. Their links point to `#`.

## Hero video and fonts
Montserrat is loaded from Google Fonts. The hero background is `media/hero.mp4`: a muted, looping 1080p version of the supplied clip with the audio removed.
- A pause/play button sits at the bottom-right of the hero.
- The video starts paused for visitors with reduced motion or data saver on, and it pauses while the tab is hidden.
- `standalone.html` embeds a lighter 720p copy so the page works as a single file.
- For production, serve the video from a CDN and consider adding a `.webm` source.

## Logo
The header still uses the placeholder CSS mark. To add the real logo, replace the `<span>` inside `.logo` in `index.html` with the logo `<img>` or SVG, and remove the `.logo::before` and `.logo::after` rules in `css/site.css`.
