# Nexus Portfolio

Personal portfolio site. Built React + Framer Motion + D3. Not template — custom loading screen, cursor, 3 themes (dark/light/x-ray), interactive tech graph, 5 mini-games, live terminal.

**Live:** https://divyankportfolio.vercel.app/

## Features

- Boot-sequence loading screen (matrix rain + terminal lines)
- 3 themes: dark, light, x-ray (x-ray shows "architecture" overlay on projects + custom transition)
- Custom cursor (dot + lag ring)
- Project list, click to expand, tech tags, live/GitHub links
- D3 force-graph of skills, draggable nodes, domain filter
- Vision section: goal tracker w/ progress bars
- Arcade: tic-tac-toe, RPS, snake, memory, reaction-speed — 5 games, no deps beyond React
- Contact form wired to EmailJS
- Build-log terminal widget, fake shell commands (`ls`, `cat`, `whoami`, etc), real history + tab-complete

## Stack

```
React 18
Framer Motion — animation
D3.js — force-directed skill graph
EmailJS — contact form send
```

Tailwind css. Inline styles + CSS vars for theming.

## Setup

```bash
npm install
npm run dev
```

Needs `VITE_EMAILJS_PUBLIC_KEY` (or hardcode in `Contact` component) + EmailJS service/template IDs set in `Contact.jsx`'s `send()` fn.

## Structure

Single `App.jsx`, sectioned by comment blocks:

```
ME                  → personal data, edit this first
THEMES / G          → theme vars + global CSS
LoadingScreen        → boot animation
Cursor / NoiseBG / GridLines
Nav                  → header + theme switcher
Hero → About → Stats → Projects → TechGraph → Vision → Ticker → GamesSection → Contact
BuildLog             → floating terminal widget
MusicPlayer          → floating ambient player
Footer
App (root)           → wires sections + loading state
```

## Customize

- Edit `ME` object top of file: name, bio, links
- `PROJECTS` array: each entry = name, tags, desc, tech, live/gh links, x-ray node map
- `STATS`, `GOALS`, `NODES`/`LINKS` (tech graph) — swap for your own numbers
- Music player expects mp3s at `/music/*.mp3` — swap or remove component if unused

## License

MIT (or your choice)
