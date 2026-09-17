# levantnoir.scot

The personal portfolio and sound archive of **Ioannis Valasakis** (**Levant Noir**), composer, performer and sound artist in Glasgow. *Wudd*, a sound and breath practice for pregnancy in development, is maintained as a separate standalone page (`wudd.html`).

The site is built with vanilla static assets: HTML, one stylesheet, one script, no build step. It is deployed on Vercel from this repository.

## Structure

```text
index.html          the main portfolio: hero, statement, listening room, performance, writing chamber, about, enquiries
writing.html        dedicated reading page for critical miniatures, acoustic philosophy and lineage
wudd.html           standalone project page for Wudd (sound and breath practice)
brand.html          studio brand identity & material specification by Teine Studio (Eilidh Morrison)
css/site.css        design tokens and layout (GSA tactility, Tokyo/Seoul spaciousness, London improv energy)
js/player.js        listening-room player: one SoundCloud widget created on first play, persistent bar
images/             responsive JPEG + WebP renditions (location data stripped) and the Open Graph image
favicon.svg
vercel.json         cache headers for images, CSS and JS
original-photos/    camera originals, kept out of git (see .gitignore)
```

## Editing content

- **Recordings** live in the `ol.tracks` list in `index.html`. Each `li` carries `data-track` (an id), `data-url` (the SoundCloud track URL) and `data-title`. Any `button[data-play]` with the same id plays it, so the "Listen first" block at the top can point at any track. Technical dossiers use native `<details class="track__tech">` elements.
- **Writing** is curated as a distinct nocturnal chamber on `index.html` with full essays and lineage hosted on `writing.html`.
- **Photographs** are used only beside the sound or the story they belong to. To add one, export renditions at three widths in JPEG and WebP with EXIF removed (the originals carry GPS), then reference them with `<picture>` as the existing two do.
- **Wudd** is hosted on its own standalone page (`wudd.html`) to preserve portfolio curatorial focus.
- **Enquiries** are direct `mailto:` links to `hello@levantnoir.scot`.

## Sound behaviour

Nothing plays until a visitor presses play. The small SoundCloud API script is fetched when a play button is first hovered, focused or touched, so that the press itself can start sound inside the browser's gesture window; the player iframe is created only on the press. One off-screen widget then drives every play button and the bar at the foot of the page. If the API or a track cannot load, the bar says so and offers the track on SoundCloud. Playback continues while the visitor reads and can be paused or stopped from the bar anywhere on the page; Escape pauses; Stop returns focus to the track's play button.

## Local preview

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
