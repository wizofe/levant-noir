# levantnoir.scot

The personal portfolio and sound archive of **Ioannis Valasakis** (**Levant Noir**), composer, performer and sound artist in Glasgow. *Wudd*, a sound and breath practice for pregnancy in development, is maintained as a separate standalone page (`wudd.html`).

The site is built with vanilla static assets: HTML, one stylesheet, one script, no build step. It is deployed on Vercel from this repository.

## Structure

```text
index.html          the main portfolio: hero, statement, listening room, performance, writing chamber, about, enquiries
work.html           the full catalogue: every recording, score and sketch as a playable row, filterable, deep-linkable
writing.html        dedicated reading page for critical miniatures, acoustic philosophy and lineage
wudd.html           standalone project page for Wudd (sound and breath practice)
brand.html          studio brand identity & material specification by Teine Studio (Eilidh Morrison); kept in the repo only, excluded from the site by .vercelignore
css/site.css        design tokens and layout (GSA tactility, Tokyo/Seoul spaciousness, London improv energy)
js/player.js        the player: one audio element created on first play, persistent bar with seeking
audio/              delivery files, AAC in .m4a, versioned names (slug.v1.m4a)
video/              the scored films (H.264 .mp4) and their poster frames
tools/              encode-audio.sh and encode-video.sh, which make the delivery files from masters/
images/             responsive JPEG + WebP renditions (location data stripped) and the Open Graph image
favicon.svg
vercel.json         cache headers for images, media, CSS and JS
original-photos/    camera originals, kept out of git (see .gitignore)
masters/            audio and film masters, kept out of git
```

## Editing content

- **Recordings** live in `ol.tracks` lists: a curated few in `index.html`, everything in `work.html`. Each `li` carries `data-track` (an id), `data-src` (the file name inside `audio/`), `data-title`, and optionally `data-details` (where the bar's "Details" link goes). Any `button[data-play]` with the same id plays it, so the "Listen first" block at the top can point at any track. Notes and technical dossiers use native `<details>` elements.
- **Catalogue numbers** run per kind: `LN` composition and installation, `SC` music for screen, `EX` experiments. Each row's `id` is its number (`sc-01`), so `work.html#sc-01` links straight to an entry and opens its notes.
- **Adding a recording**: put the master in `masters/`, run `tools/encode-audio.sh masters/<file> <slug>`, then add a row. The script applies one linear gain toward -14 LUFS with a -1 dBTP ceiling (no compression) and writes `audio/<slug>.v1.m4a`. Media is cached as immutable, so a re-encode needs a new version (`VERSION=2`) and the row updated to match.
- **Writing** is curated as a distinct nocturnal chamber on `index.html` with full essays and lineage hosted on `writing.html`.
- **Photographs** are used only beside the sound or the story they belong to. To add one, export renditions at three widths in JPEG and WebP with EXIF removed (the originals carry GPS), then reference them with `<picture>` as the existing two do.
- **Wudd** is hosted on its own standalone page (`wudd.html`) to preserve portfolio curatorial focus.
- **Enquiries** are direct `mailto:` links to `hello@levantnoir.scot`.

## Sound behaviour

Nothing plays, and no audio is fetched, until a visitor presses play. One audio element then drives every play button and the bar at the foot of the page. The recordings are this site's own files in `audio/`; there is no third-party player or request. `AUDIO_BASE` at the top of `js/player.js` is the only thing to change if the files ever move to a bucket. If a file cannot load, the bar says so and the row's play button retries. Playback continues while the visitor reads and can be paused, scrubbed or stopped from the bar anywhere on the page (the scrubber is a real range input, so it works from the keyboard); Escape pauses; Stop returns focus to the track's play button. A film and the bar never sound together: starting one pauses the other. On phones the lock screen shows the title and transport through the Media Session API.

## Local preview

```bash
npx http-server -p 8137 -c-1 .
```

Then open `http://localhost:8137`. Use a server that honours Range requests (this one does): without them the browser cannot seek, and `python -m http.server` does not send them.
