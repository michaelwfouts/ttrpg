# ttrpg

Personal TTRPG notes site built with Vue 3, Vite and TypeScript, hosted on GitHub Pages at https://michaelwfouts.github.io/ttrpg/.

## Adding content

Add a markdown file to the matching folder under `content/` (`one-shots/`, `combats/`, `dungeons/`) and push to `main`. The filename becomes the URL slug.

Frontmatter is optional:

```yaml
---
title: The Hollow Season        # falls back to the first H1, then the filename
description: One-sentence hook shown on cards
system: Old Gods of Appalachia
duration: 3-4 hours
players: 3-5
tags: [horror, winter]
---
```

The first `# H1` is used as the page title. `##` and `###` headings form the section sidebar. Don't write your own table of contents; the sidebar replaces it.

Monsters and NPCs with stats go in a ` ```creature <system> ` fenced block, which renders as a Nimble-style stat card (`src/content/parseCreature.ts`). The full format is in the `creature-statblock` skill (`.claude/skills/creature-statblock/SKILL.md`):

````
```creature cypher
Frost Wisp
Level 2
Health: 6 | Armor: 0 | Movement: Short

> **Dispersal.** Passive traits and conditions become ribbon banners.

- **Damage.** Actions are bullets.
```
````

An empty ` ```creature-index ` block is replaced by every creature card in the same file, in page order, for an end-of-module reference.

## Adding a new category

1. Create `content/<id>/`.
2. Add an entry to `src/content/categories.ts` (id, label, lucide icon, description).

Routes, home cards, header nav and search pick it up automatically.

## Development

```
npm install
npm run dev      # local dev server
npm test         # unit tests
npm run build    # production build into dist/ + type-check
```

## Deployment

In the GitHub repo settings, set **Pages > Source** to **GitHub Actions**. Pushes to `main` deploy automatically. The base path is `/ttrpg/` (the repo name); change it in `vite.config.ts` or set `VITE_BASE` if the repo name differs.

## Layout

- `content/` markdown, one folder per category
- `src/content/` category registry, markdown parsing and loading (the only code that knows the file format)
- `src/composables/` search and content lookup
- `src/components/`, `src/views/` UI
- `src/styles/main.css` theme and rendered-markdown styles
