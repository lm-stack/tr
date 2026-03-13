# Règles SEO

## Meta title

- Format unique : `{seo.title} | {site.name}` (pipe " | ") — géré par le layout `Base.astro`, jamais par le contenu
- Le `seo.title` ne doit jamais contenir de séparateur (`|`, `—`, `-`) ni le nom du site
- Longueur recommandée : 50-60 caractères max (titre + séparateur + nom du site)

## Props SEO du layout

Chaque page `.astro` doit passer les props SEO au layout `<Base>` :

```astro
<Base
  seo={{ title: 'Titre de la page', description: 'Description 150-160 caractères' }}
  breadcrumb="Nom page"
>
```

Optionnel par page :

```astro
seo={{ title: '...', description: '...', ogImage: '/images/page-specific-og.jpg' }}
```

- `breadcrumb` : obligatoire sur toutes les pages sauf la homepage (utilisé pour le JSON-LD BreadcrumbList)
- `isHome` : uniquement sur la homepage (déclenche les JSON-LD WebSite, Organization enrichi et LocalBusiness si configuré)
- `noindex` : uniquement sur les pages à exclure des moteurs (404, admin, design system)

## Canonical

Généré automatiquement : `${site.url}${Astro.url.pathname}`. Ne jamais hardcoder.

## Open Graph & Twitter Card

Générés automatiquement dans `Base.astro` depuis `seo.title`, `seo.description` et `seo.ogImage` (ou `site.ogImage` par défaut). Inclut `og:locale` (fr_CH). Ne pas dupliquer dans les pages.

## JSON-LD

Schemas générés dans `JsonLd.astro` :

1. **BreadcrumbList** : toutes les pages (conditionnel sur `breadcrumb`)
2. **Organization** : toutes les pages (enrichi avec email, téléphone, adresse, réseaux sociaux si disponibles dans site.json)
3. **WebSite** : homepage uniquement (conditionnel sur `isHome`)
4. **LocalBusiness** : homepage uniquement, optionnel (conditionnel sur `isHome` et `site.localBusiness`)

Les réseaux sociaux avec `url: "#"` sont automatiquement filtrés des schemas (`sameAs`).

Ne jamais ajouter de JSON-LD inline dans les pages — tout passe par le composant `JsonLd.astro` via le layout.

## LocalBusiness (optionnel)

Pour activer le schéma LocalBusiness, ajouter dans `src/content/settings/site.json` :

```json
"localBusiness": {
  "type": "LocalBusiness",
  "address": {
    "street": "Rue Exemple 1",
    "locality": "Ville",
    "postalCode": "1000",
    "country": "CH"
  },
  "geo": {
    "lat": 46.5,
    "lng": 6.6
  }
}
```

Types courants : `LocalBusiness`, `EventVenue`, `LodgingBusiness`, `Restaurant`, `Store`.

## Sitemap & robots.txt

- **Sitemap** : généré automatiquement par `@astrojs/sitemap`. Exclut `/admin/`, `/ds/` et `/recherche/`.
- **robots.txt** : généré par `src/pages/robots.txt.ts` (endpoint Astro).
- Ne jamais les modifier manuellement.

## Images & Favicons

- `og-image.jpg` (1200x630px) dans `public/` — image OG par défaut
- `favicon.ico` et `favicon.svg` dans `public/`
- `apple-touch-icon.png` (180x180px) dans `public/` — icône iOS
- `android-chrome-192x192.png` et `android-chrome-512x512.png` dans `public/` — icônes Android (manifest.json)
- `manifest.json` dans `public/` — Web App Manifest
