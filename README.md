# levantnoir.scot

The personal site of **Ioannis Valasakis**, composer, performer and sound artist in Glasgow. *Levant Noir* is the performance identity; *Wudd*, a sound and breath practice for pregnancy, is presented as a project in development.

The site is one static page: HTML, one stylesheet, one script, no build step. It is deployed on Vercel from this repository.

## Structure

```text
index.html          the page: hero, statement, listening room, performance, Wudd, writing, about, enquiries
css/site.css        design tokens and layout (direction B, "Shore")
js/player.js        listening-room player: one SoundCloud widget created on first play, persistent bar
images/             responsive JPEG + WebP renditions (location data stripped) and the Open Graph image
favicon.svg
vercel.json         cache headers for images, CSS and JS
original-photos/    camera originals, kept out of git (see .gitignore)
```

## Editing content

- **Recordings** live in the `ol.tracks` list in `index.html`. Each `li` carries `data-track` (an id), `data-url` (the SoundCloud track URL) and `data-title`. Any `button[data-play]` with the same id plays it, so the "Listen first" block at the top can point at any track.
- **Photographs** are used only beside the sound or the story they belong to. To add one, export renditions at three widths in JPEG and WebP with EXIF removed (the originals carry GPS), then reference them with `<picture>` as the existing two do.
- **Wudd** is deliberately labelled as in development; do not add tiers, prices, partners or claims until they are real.
- **Enquiries** are `mailto:` links with pre-filled subjects; there is no form and no backend.

## Sound behaviour

Nothing loads from SoundCloud until a visitor presses play. The player script then loads the SoundCloud Widget API once, creates a single off-screen widget, and drives the play buttons and the bar at the foot of the page from it. If the API cannot load, the bar offers the track on SoundCloud instead. Playback continues while the visitor reads and can be paused or stopped from the bar anywhere on the page.

## Local preview

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
