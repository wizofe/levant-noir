# Levant Noir

> Composer · Multi-instrumentalist · Researcher of Eastern Mediterranean traditions  
> Exploring the resonance between ancient modal traditions and modular sound — weaving Persian, Mediterranean, and electronic worlds.

Levant Noir is the artist website and sonic portfolio of **Ioannis Valasakis**. The site presents his musical works, aesthetic manifesto, live modular synthesis practice, and artistic influences. It also features a real-time, browser-native generative soundscape.

---

## Site Content Overview

The website is structured into seven thematic sections:

1. **Hero & Ambient Synthesizer**  
   An evocative opening introducing Levant Noir alongside an interactive ambient sound generator running in real time directly in the browser.

2. **About / Manifesto**  
   Explores Ioannis Valasakis's musical lineage — from classical guitar at the Hellenic Conservatory to studies at the Royal Conservatoire of Scotland, Guildhall, and Berklee. Traces the intersection of *mākam*, *dastgāh*, Byzantine chant, uneven Aegean and Balkan rhythms (7s, 9s), modular synthesis, and the Japanese aesthetic concepts of *mono no aware* (物の哀れ) and *ma* (間).

3. **Music & Works**  
   Curated recordings with embedded SoundCloud players, contextual background, and hardware/modular patch notes:
   - *L'Ambiance* — Minimal ambient piece for the *Espacio Liminal* installation (Berlin), sculpted with wavetable synthesis, granular processing of melting ice recordings, and filtered resonance sweeps.
   - *Lean Candles* — Theme for the Armenian documentary *Անցումի Ժամանակ*, merging trip-hop rhythms, Moog Sub37 bass, granular Armenian duduk, and vinyl textures.
   - *Oud Texture* — Granular Mediterranean percussion, spectral delays, and improvised oud captured in a Turkish bath in Smyrna.

4. **Influences & Constellations**  
   A relational constellation of artists and seminal works across Eastern Mediterranean avant-folk, Japanese ambient minimalism, and experimental contemporary music.

5. **Live / Modular Setup**  
   An exploration of the modular synthesizer as a living acoustic-electronic instrument and ritual architecture.

6. **Journal & Reflections**  
   Short essays on sound philosophy:
   - *On Imperfection* — Microtonality, fret placement, voltage sag, and thermal drift.
   - *Field Recording as Memory* — Tape saturation, granular stretching via Morphagene, and evocative geography.
   - *間 (Ma) – The Space Between* — Silence, negative space, and ornamentation across traditions.

7. **Contact & Social**  
   Direct contact form, collaboration inquiries for choreographers, dancers, and visual artists, email link, and Instagram profile.

---

## Technologies Used

- **Web Audio API**  
  A custom, client-side generative synthesizer synthesizing a live, microtonal ambient drone in the **Uşşak mākam**:
  - Microtonal cent-to-frequency tuning calculation: `[0, 90, 294, 498, 702, 792, 996, 1200]` cents.
  - Multi-voice polyphonic scheduling with randomized waveform generation (sine/triangle).
  - Dynamic Low-Pass Biquad Filters modulated by Low-Frequency Oscillators (LFOs).
  - Non-repeating generative voice lifecycles with randomised attack, sustain, and release envelopes via `AudioParam.linearRampToValueAtTime`.

- **HTML5 & Accessibility (ARIA)**  
  - Semantic elements (`<section>`, `<header>`, `<footer>`, `<form>`, `<iframe>`).
  - Accessible audio controls with live status announcements (`aria-pressed`, `aria-label`, `aria-live="polite"`, `role="region"`).

- **Vanilla CSS3**  
  - **Color Palette & Design Tokens**: Custom CSS variables (`--black`, `--sand`, `--copper`, `--sea-green`, `--off-white`).
  - **Fluid Typography & Responsive Layouts**: Built with `clamp()`, `min()`, Flexbox, and CSS Grid.
  - **Visual Styling**: Glassmorphism (`backdrop-filter: blur()`), custom scanline/linen overlay gradient patterns, and atmospheric vignettes.
  - Smooth page transitions and native `scroll-behavior: smooth`.

- **Intersection Observer API**  
  Lightweight scroll-driven fade-and-rise animations triggering as sections enter the viewport, without third-party animation libraries.

- **Typography & Third-Party Embeds**  
  - Google Fonts: *Cormorant Garamond* (display/headings) & *Fira Sans* (body).
  - SoundCloud Embedded Widget API for high-fidelity audio playback.

- **Architecture**  
  - **Zero Build / Zero Dependencies**: Pure static front-end requiring no bundlers, compilation steps, or runtime package managers.

---

## Project Structure

```text
levant-noir/
├── README.md        # Project documentation
├── index.html       # Single-page website (HTML, CSS, Web Audio engine)
└── images/          # Visual assets and photography
    ├── mail.jpg     # Contact section background
    ├── persian.jpg  # Hero section backdrop
    └── synth.jpg    # Modular synthesis visual backdrop
```

---

## Local Development & Preview

Because the site is built with vanilla web standards, no installation or build step is required.

To run locally with any static HTTP server:

```bash
# Using Python 3
python3 -m http.server 8000
```

Then navigate to `http://localhost:8000` in your web browser.
