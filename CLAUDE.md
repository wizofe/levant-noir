# CLAUDE.md, levant-noir

Static personal site for Ioannis Valasakis (Levant Noir): electroacoustic composer and multi-instrumentalist. No build step. Plain HTML, one shared `css/site.css`, small JS player.

Pages: `index.html` (main), `writing.html` (critical texts), `brand.html` (Teine Studio identity dossier), `wudd.html` (sound/breath project).

## Visual identity

Follows the Teine Studio "Rev. C Warm" system. All colour is tokenised in `css/site.css` `:root`: Lime Wash `#F8F8F7` ground, Rowan `#A9382A` as the accent voice, Sea Pink for edges only, Warehouse Green as the sole dark field. Banned: any brown/ochre/copper/sand/amber, cream grounds, dark screen grounds, decorative gradients. Type: Newsreader (reading + display), Space Grotesk (structure/labels), Space Mono (measurement). Old token names (`--rust`, `--copper`, `--paper`) are kept as aliases so sub-pages inherit the system.

## Copy voice

- **Never use em dashes.** See the workspace CLAUDE.md. Use commas, colons, semicolons, parentheses, or separate sentences.
- Do not lead with a single instrument. He is a composer and multi-instrumentalist; mandolin is the current focus (with modular), lavta is also played. Keep existing song titles and their instruments as they are (e.g. "Blackbirds and a lavta" stays lavta).
- No GPS or coordinate residence pinning. He passes through Cromarty and Crete, does not live there. Place names are fine as photo credit, fieldwork, or project context, not as a "where I am" device.
- Listening-room track descriptions: humble and plain, first-person where it is genuinely personal, keeping a little of the research/method register (granular processing, band-pass sweeps, voltage drift) where it earns its place. Say what the piece is, name the place and instruments, stop. Avoid "interrogates / examines / charts the dialogue" and claims about what the listener will feel.

## Preview

No build. Serve and open in a browser (workspace rule: never bare `python3`):

```
uv venv .venv   # if none exists
.venv/bin/python -m http.server 8137 -d .
```

Bump the `?v=N` on the `css/site.css` link when changing CSS so reloads are not cache-stale.

## Pushing (requirement)

**Always push this repo with `git pushw`. Never use plain `git push`.**

```
git pushw            # or: git pushw origin master
```

Why: the repo belongs to the `wizofe` GitHub account, but the local SSH key authenticates as `depolarised`, and a global `url.git@github.com:.insteadOf https://github.com/` rewrite forces HTTPS back to SSH, so a plain `git push` is denied. The `pushw` alias switches the active `gh` account to `wizofe`, pushes over HTTPS (via the `gh` credential helper, bypassing the SSH rewrite), then switches back to `depolarised`. The remote is HTTPS for this reason. A fully native `git push` would need a dedicated `wizofe` SSH key added to that account (a browser auth step to grant `gh` the key-add scope), which has not been done.
