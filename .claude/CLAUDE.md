# Thomas Rouaud — Personal CV/Portfolio Website

## Projet

Site CV/portfolio personnel de Thomas Rouaud, migré de WordPress vers **Astro 5** + **Tailwind CSS v4** + **Sveltia CMS**. Basé sur le template `site-blueprint`.

## Stack

- **Astro 5** : framework de composants avec génération statique
- **Tailwind CSS v4** : classes utilitaires, via `@tailwindcss/vite`
- **astro-icon** : icônes Phosphor via Iconify (`@iconify-json/ph`)
- **Sveltia CMS** : interface d'édition de contenu
- **GitHub Pages** : hébergement via GitHub Actions

## Architecture spécifique

Ce site utilise un **layout CV** (`CvLayout.astro`) au lieu du layout standard `Base.astro` du blueprint :

- **Sidebar fixe** (28% largeur) : photo profil, infos personnelles, compétences, langues, intérêts, réseaux sociaux
- **Zone principale** (72% largeur) : expérience, éducation, projets
- **Sous-pages** : pages de détail pour conférences et projets humanitaires

### Différences avec le blueprint standard

| Blueprint standard | Ce projet |
|-------------------|-----------|
| Header fixe + nav | Sidebar fixe avec profil |
| Hero banner | Pas de hero (sidebar = identité) |
| `Base.astro` layout | `CvLayout.astro` layout |
| Sections modulaires | Sections CV (timeline, grille projets) |
| Pages YAML-driven | Pages statiques .astro |

## Design

### Couleurs

| Token | HEX | Usage |
|-------|-----|-------|
| `primary` | `#223D72` | Sidebar background, titres liens |
| `secondary` / `accent` | `#D8A46F` | Accents dorés, titres sidebar, timeline dates |
| `third` | `#46E81E` | Vert accent |
| `text` | `#000000` | Texte principal |
| `bg` | `#FFFFFF` | Fond principal |

### Typographie

- **Police** : Quicksand (variable, 400-700)
- **Tailles** : h1=23px uppercase, h2=30px uppercase, h3=22px, body=16px/32px

### Spacing

Tokens fluid identiques au blueprint (3xs → 4xl)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage CV (expérience, éducation, projets) |
| `/contact/` | Formulaire de contact |
| `/hec-et-apres/` | Conférence HEC Lausanne |
| `/how-to-have-an-impact/` | Conférence Africa Summit St. Gallen |
| `/clinton-foundation/` | Projet humanitaire Clinton Foundation |
| `/volunteer-in-kenya/` | Bénévolat au Kenya |

## Commandes

```bash
npm run dev      # Serveur local
npm run build    # Build statique
npm run preview  # Prévisualiser le build
```

## Règles spécifiques

1. La sidebar est définie dans `CvLayout.astro` — les infos personnelles sont hardcodées (pas de CMS pour le CV)
2. Les sous-pages utilisent les classes CSS `.cv-subpage-*` définies dans `global.css`
3. Le footer "Lausanne Marketing" est dans `CvLayout.astro`
4. Les images sont dans `public/images/` et servies directement
5. Le contenu est en anglais (site personnel international)
