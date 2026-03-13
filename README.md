# Site Blueprint

Template de site web avec **Astro 5**, **Tailwind CSS v4** et **Sveltia CMS**.

## Quick start

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Builder le site
npm run build
```

## Structure

```
src/
├── components/            # Composants Astro (Button, Card, Grid, Hero, Section...)
├── content/
│   ├── pages/*.yml        # Contenu des pages (éditable via CMS)
│   └── settings/*.json    # Config globale (site, coordonnées, social)
├── layouts/               # Layouts (Base, Bare)
├── lib/data.ts            # Helper getSiteData() + toIconName()
├── pages/                 # Pages Astro (index, a-propos, contact, recherche, ds, 404)
├── scripts/main.ts        # Menu mobile, sticky header, formulaires
└── styles/                # global.css (Tailwind) + fonts.css
public/
├── admin/                 # Sveltia CMS (index.html + config.yml)
├── fonts/                 # Polices web self-hosted (.woff2)
└── images/                # Images
```

## Sveltia CMS

Interface d'édition accessible à `/admin/`. Les clients peuvent modifier le contenu des pages sans toucher au code.

**Configuration OAuth** : décommenter et configurer `base_url` dans `public/admin/config.yml`.

## Déploiement

Le workflow GitHub Actions (`.github/workflows/deploy.yml`) build automatiquement le site et le déploie sur GitHub Pages à chaque push sur `main`.

**Activer** : Settings > Pages > Source: GitHub Actions.
