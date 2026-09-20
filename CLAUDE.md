# CLAUDE.md, levant-noir

Static personal site for Ioannis Valasakis (Levant Noir): electroacoustic composer and multi-instrumentalist. No build step. Plain HTML, one shared `css/site.css`, small JS player. All audio and video is self-hosted (`audio/`, `video/`); there is no SoundCloud or other third-party player, and none should be reintroduced.

Pages: `index.html` (main), `work.html` (full catalogue of recordings, scores and sketches), `writing.html` (critical texts), `wudd.html` (sound/breath project). `brand.html` (Teine Studio identity dossier) stays in the repo as reference but is not part of the website: `.vercelignore` keeps it out of the deploy and nothing links to it. Do not link or publish it.

## Visual identity

Follows the Teine Studio "Rev. C Warm" system. All colour is tokenised in `css/site.css` `:root`: Lime Wash `#F8F8F7` ground, Rowan `#A9382A` as the accent voice, Sea Pink for edges only, Warehouse Green as the sole dark field, Lichen `#5C6B4F` for hairlines on pending or archival items only (never text, never fills). Banned: any brown/ochre/copper/sand/amber, cream grounds, dark screen grounds, decorative gradients. Type: Newsreader (reading + display), Space Grotesk (structure/labels), Space Mono (measurement). Old token names (`--rust`, `--copper`, `--paper`) are kept as aliases so sub-pages inherit the system.

Rules adopted from the September 2026 design review:

- Newsreader carries every sentence (statement, descriptions, bio, captions in italic). Space Grotesk is for labels, nav and button text only. Space Mono is for numbers, dates, places and dossier bodies, never a sentence. Sizes come from the `--fs-*` scale in `:root`.
- Rowan means sound and invitation: the first play button, whatever is sounding, the hand rule, link underlines. Keep it off catalogue marks and secondary controls.
- The hand rule (`.hand-rule`) appears in exactly three places on the homepage: under "Listen first", above the pull-quote, above the footer. Do not add a fourth.
- One shared container: `--page` for padded boxes, `--max-width` for inner content. Homepage, catalogue and writing page must sit in the same box.
- The ground carries a baked grain tile on `body`; panels stay flat.
- Every mark is one set with round caps and joins on a 24-unit grid: a pebble-round play triangle and two-bar pause in a 1.25px ring, a drawn chevron (down, turning up when open) for disclosures, 1.5px arrows. Only the play ring is pure ink. Pictures and films take a 1px `--rule-subtle` hairline, never rounded corners.
- Eyebrow labels (`.label`) are weight 500. This deviates from the Teine brand page's 700, on the reviewer's advice; see the to-do list.

## Copy voice

- **Never use em dashes.** See the workspace CLAUDE.md. Use commas, colons, semicolons, parentheses, or separate sentences.
- Do not lead with a single instrument. He is a composer and multi-instrumentalist; mandolin is the current focus (with modular), lavta is also played. Keep existing song titles and their instruments as they are (e.g. "Blackbirds and a lavta" stays lavta). He also plays the Cretan boulgari, baritone guitar and bodhrán; spell it "boulgari" (never "bulgari", which reads as the jeweller) and "bodhrán" with the accent. His makam and dastgah study was at Ross Daly's Labyrinth Musical Workshop in Crete: say "studied ... at", not "trained by Ross Daly".
- No GPS or coordinate residence pinning. He passes through Cromarty and Crete, does not live there. Place names are fine as photo credit, fieldwork, or project context, not as a "where I am" device.
- Listening-room track descriptions: humble and plain, first-person where it is genuinely personal, keeping a little of the research/method register (granular processing, band-pass sweeps, voltage drift) where it earns its place. Say what the piece is, name the place and instruments, stop. Avoid "interrogates / examines / charts the dialogue" and claims about what the listener will feel.

## Preview

No build. Serve and open in a browser (workspace rule: never bare `python3`):

```
uv venv .venv   # if none exists
.venv/bin/python -m http.server 8137 -d .
```

Bump the `?v=N` on the `css/site.css` link when changing CSS so reloads are not cache-stale.

Seeking in the player needs HTTP Range support, which `http.server` lacks. When testing playback use `npx http-server -p 8137 -c-1 .` instead.

## Homepage selection

The homepage listening room is a selection of four, each with a one or two line description (the full text lives in the catalogue), in this order: LN·01 Blackbirds and a lavta, LN·02 Oud texture (Smyrna), LN·05 Gothenburg port soundscape, SC·01 White Rose. White Rose took the place of EX·03 Voice in grains on the reviewer's advice (third addendum, T1), so that one piece of screen work is on the page a producer lands on; its row carries a still that links to the film in the catalogue. Everything else (L’ambiance, Lean candles, The shearwaters, the other screen work, all the studies) lives only in `work.html`. Rows keep their catalogue numbers, so gaps on the homepage are expected.

## Media

Masters live in `masters/` (git-ignored). Delivery files are made with `tools/encode-audio.sh <master> <slug>` (AAC 160k, one linear gain toward -14 LUFS, -1 dBTP ceiling, never compression) and `tools/encode-video.sh`. File names are versioned (`slug.v1.m4a`) because `vercel.json` caches media as immutable: re-encode under a new version, never the same name. Catalogue numbers: `LN` composition and installation, `SC` screen, `EX` experiments.

## What is left to do

Keep this list current: whenever work finishes or new work is agreed, update it in the same change. Last updated 20 September 2026 (after the final review of the night: first sound stand-in, invented synopses removed, catalogue invitation, screen and sound design named in the hero and metadata, writing and Wudd pages aligned).

Waiting on Ioannis:

- Master for "Blackbirds and a lavta" (LN·01). "Listen first" on the homepage points at Oud texture as a stand-in so the first sound works; when the master arrives, restore it: `data-play="blackbirds"`, title "Blackbirds and a lavta", voice line "Start here: two minutes, a lavta and the birds outside.", meta "A Cretan kontyliá at a Glasgow window" with "June 2025 · 2:06". Until `audio/blackbirds-and-a-lavta.v1.m4a` exists its play button reports that the recording could not load. Encode with `tools/encode-audio.sh`. Last resort is the lossy SoundCloud stream.
- His own brush stroke, inked and scanned, to trace into `.hand-rule` in `css/site.css` (the current path is the reviewer's placeholder).
- Real credits for the screen series: film titles, directors and years for the two reel cues (SC·04, whose invented synopses were removed on 20 September 2026) and for Lean candles (LN·04, an un-named documentary). Never invent synopses or credits. Confirm the "distorted bass" in EX·03 and the three EX titles (Limestone aksak, The piano turns, Voice in grains).
- One photograph of the instrument or the person for About (review #26).
- The brand of the Czech stereo microphone used on Gothenburg port soundscape (LN·05); the dossier currently says "stereo microphone pair". Add the name when he remembers it.
- Bio checks: optionally the names of his makam and dastgah teachers at Labyrinth (the convention among Labyrinth musicians is "studied X with [name]"); whether his PhD concerned memory, which would let the bio link the science to the archive work directly.
- Decision on the printed condensed wordmark versus the web Newsreader wordmark (review #29).
- Decision on eyebrow labels at weight 500 (review S4): keep, or return to the brand page's 700.
- Once the hand rule is his own stroke: optionally draw the six marks (play, pause, plus, cross, two arrows) with the same pen and use them as masks, replacing the one-stroke SVG set.

Waiting on Teine Studio:

- A provenance line for lichen `#5c6b4f` in the Found Palette (review #30). Ioannis approved using it on 20 September 2026 on the reviewer's recommendation; it is in `:root` as `--lichen` and used only on the pending-track circle. The studio's document (`brand.html`, repo only) does not list it yet.

To build later (placeholders in place):

- Live section facts as plain text: the set's duration (two versions if they exist), what he brings, what the room must provide. Needs his facts (final review, item 5).

- Bookers' one-page PDF for Between Two Shores (description, two durations, ensemble options, rider table, stage plan) at `press/between-two-shores.pdf`, and a press kit (60-word and 200-word third-person bios, two photographs, logotype) at `press/levant-noir-press-kit.zip` (review #25, #27). The Live section currently says both are available on request; replace that sentence with links, and add a "For bookers" row to Enquiries. Needs the set's duration and technical requirements from Ioannis.

- Podcast and radio category in the catalogue, once he supplies the work (excerpts cleared with clients).

- In `work.html`, the meta line of Lean candles still reads "Documentary score · 2022"; the review wants a place there, city unknown.

- Move `audio/` and `video/` to a bucket (Cloudflare R2) when the archive outgrows the repo; only `AUDIO_BASE` in `js/player.js` and the video paths change.

- Recreate the `git pushw` alias on this machine (see below); pushes currently use the equivalent one-off HTTPS command.

## Film rights

The three Guildhall films (White Rose, The Boxer, Waves) are cleared for display on this website only, copyright reserved (confirmed by Ioannis, 20 September 2026). Never upload them, or clips of them, anywhere else (YouTube, Vimeo, social posts, press kits), keep `controlslist="nodownload"` on the `<video>` elements, and keep the rights sentence under the "Music for screen" heading in `work.html`.

## Pushing (requirement)

**Always push this repo with `git pushw`. Never use plain `git push`.**

```
git pushw            # or: git pushw origin master
```

Why: the repo belongs to the `wizofe` GitHub account, but the local SSH key authenticates as `depolarised`, and a global `url.git@github.com:.insteadOf https://github.com/` rewrite forces HTTPS back to SSH, so a plain `git push` is denied. The `pushw` alias switches the active `gh` account to `wizofe`, pushes over HTTPS (via the `gh` credential helper, bypassing the SSH rewrite), then switches back to `depolarised`. The remote is HTTPS for this reason. If the alias is missing on a machine (it was on 20 September 2026), the equivalent is `git -c credential.helper= -c credential.helper='!gh auth git-credential' push https://github.com/wizofe/levant-noir.git master` with the `wizofe` gh account active. A fully native `git push` would need a dedicated `wizofe` SSH key added to that account (a browser auth step to grant `gh` the key-add scope), which has not been done.
