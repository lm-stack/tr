# Site Blueprint

## Projet

Template de site web avec **Astro 5**, **Tailwind CSS v4** et **Sveltia CMS**. Génère un site statique depuis des données YAML/JSON éditables via une interface CMS.

## Stack

- **Astro 5** : framework de composants avec génération statique (`package.json` : `astro ^5.5.0`)
- **Tailwind CSS v4** : classes utilitaires, via `@tailwindcss/vite` (pas de PostCSS)
- **astro-icon** : icônes Phosphor via Iconify (`@iconify-json/ph`)
- **Sveltia CMS** : interface d'édition de contenu, chargé via CDN (version épinglée)
- **Pagefind** : recherche statique côté client, indexation au build
- **GitHub Pages** : hébergement via GitHub Actions (`.github/workflows/deploy.yml`)

## Architecture

### Séparation données / composants

```
src/content/pages/*.yml       → Contenu (CMS-managed, éditable par les clients)
src/content/settings/*.json   → Config globale (dev-managed)
src/pages/*.astro             → Pages (structure, SEO via layout props)
src/components/*.astro        → Composants UI (props typées)
src/layouts/*.astro           → Layouts partagés (Base, Bare)
src/lib/data.ts               → Helper getSiteData() (fusionne settings)
```

- Les **données YAML/JSON** dans `src/content/` contiennent le contenu éditable (titres, textes, icônes)
- Les **composants Astro** définissent la structure HTML avec des props typées TypeScript
- Les **settings JSON** centralisent la config : `site.json` (url, name, nav, logo), `coordonnees.json` (email, phone, address), `social.json` (réseaux sociaux)

### Structure des fichiers

```
site-blueprint/
├── src/
│   ├── components/
│   │   ├── Breadcrumb.astro      # Fil d'Ariane visible (Accueil / Page)
│   │   ├── Button.astro          # Bouton multi-variantes (primary, secondary, outline...)
│   │   ├── Card.astro            # Carte avec titre, icône et slot
│   │   ├── CmsImage.astro        # Image CMS avec lazy loading et dimensions explicites
│   │   ├── Grid.astro            # Grille responsive (1-4 cols + asymétriques)
│   │   ├── Faq.astro              # FAQ standalone avec JSON-LD FAQPage
│   │   ├── FormField.astro       # Champ de formulaire réutilisable (input/textarea)
│   │   ├── Hero.astro            # Hero avec titre, sous-titre et taille (default/compact)
│   │   ├── Section.astro         # Section avec container centré
│   │   ├── Header.astro          # Header fixe + nav desktop + burger
│   │   ├── MobileMenu.astro      # Menu mobile plein écran
│   │   ├── Footer.astro          # Footer (logo, nav, contact, social)
│   │   ├── JsonLd.astro          # Schemas JSON-LD (BreadcrumbList, Organization, WebSite, LocalBusiness)
│   │   └── sections/
│   │       ├── TextSection.astro     # Section texte (titre + paragraphes)
│   │       ├── CardsSection.astro    # Section cartes (grille de Card)
│   │       ├── CtaSection.astro      # Section Call to Action
│   │       ├── FaqSection.astro      # Section FAQ (accordéon details)
│   │       ├── StatsSection.astro    # Section chiffres clés
│   │       └── SectionRenderer.astro # Switch dynamique sur le type de section
│   ├── content/
│   │   ├── config.ts             # Définition des collections (pages, settings)
│   │   ├── pages/
│   │   │   ├── home.yml          # Contenu homepage
│   │   │   ├── a-propos.yml      # Contenu à propos
│   │   │   ├── contact.yml       # Contenu contact
│   │   │   └── recherche.yml     # Contenu recherche
│   │   ├── custom-pages/         # Pages libres créées via le CMS (section builder)
│   │   └── settings/
│   │       ├── site.json         # Config globale (url, name, nav, logo, webhook)
│   │       ├── coordonnees.json  # Coordonnées (email, phone, address)
│   │       └── social.json       # Réseaux sociaux
│   ├── layouts/
│   │   ├── Base.astro            # Layout principal (head SEO, header, footer, JSON-LD)
│   │   └── Bare.astro            # Layout nu (head minimal, sans header/footer)
│   ├── lib/
│   │   └── data.ts               # getSiteData() : fusionne site + coordonnées + social
│   ├── pages/
│   │   ├── index.astro           # Homepage
│   │   ├── a-propos.astro        # Page À propos
│   │   ├── contact.astro         # Page Contact
│   │   ├── recherche.astro       # Page Recherche (Pagefind)
│   │   ├── ds.astro              # Design System (/ds/)
│   │   ├── 404.astro             # Page 404
│   │   ├── robots.txt.ts         # robots.txt généré via endpoint Astro
│   │   ├── manifest.json.ts      # Web App Manifest dynamique (lit site.name)
│   │   └── [...slug].astro       # Route catch-all pour les pages libres (custom-pages)
│   ├── scripts/
│   │   └── main.ts               # Menu mobile, sticky header, dropdown, smooth scroll, forms
│   ├── styles/
│   │   ├── global.css            # @import tailwindcss + base layer + Pagefind overrides + form feedback
│   │   └── fonts.css             # @font-face des polices self-hosted
│   └── env.d.ts                  # Types Astro
├── public/
│   ├── admin/
│   │   ├── index.html            # Loader Sveltia CMS (CDN)
│   │   └── config.yml            # Collections CMS
│   ├── fonts/                    # Polices web self-hosted (.woff2)
│   ├── images/                   # Images (CMS uploads)
│   ├── favicon.ico               # Favicon
│   ├── favicon.svg               # Favicon SVG
│   ├── apple-touch-icon.png      # Icône iOS
│   ├── android-chrome-*.png      # Icônes Android
│   └── og-image.jpg              # Image Open Graph par défaut
├── astro.config.mjs              # Config Astro (site, integrations, Tailwind vite plugin)
├── tailwind.config.mjs           # Config Tailwind (couleurs, spacing, typo, tokens)
├── tsconfig.json                 # TypeScript config
├── package.json                  # type: module, scripts dev/build/preview
├── .htmltest.yml                 # Config htmltest (validation HTML)
├── .github/workflows/deploy.yml  # Build Astro + deploy GitHub Pages
├── .github/workflows/ci.yml      # CI : htmltest (validation HTML)
└── .gitignore                    # dist/, .astro/, node_modules/, public/pagefind/
```

**Output** (`dist/`, non versionné) : site statique prêt à déployer.

### Config Astro (`astro.config.mjs`)

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://example.com',
  prefetch: { defaultStrategy: 'hover' },
  integrations: [sitemap({ filter: ... }), icon()],
  vite: { plugins: [tailwindcss()] },
  build: { format: 'directory' },
});
```

- `site` : URL de production (obligatoire pour le sitemap et les canonical)
- `sitemap` : exclut `/admin/`, `/ds/` et `/recherche/`
- `icon` : charge les icônes Phosphor depuis `@iconify-json/ph`
- Tailwind intégré via plugin Vite (pas via intégration Astro)
- `prefetch` : précharge les liens au hover pour des navigations quasi-instantanées
- `build.format: 'directory'` : génère `/page/index.html` (clean URLs)
- **View Transitions** : `<ViewTransitions />` dans `Base.astro` pour des transitions fluides entre pages

## Commandes

```bash
npm run dev      # Serveur local avec hot reload (Vite)
npm run build    # Build dans dist/ puis indexation Pagefind
npm run preview  # Prévisualiser le build local
```

## Content Collections

Les données sont gérées via les Content Collections d'Astro (`src/content/`).

### Collections définies (`config.ts`)

| Collection | Type | Fichiers |
|-----------|------|----------|
| `pages` | `data` | `pages/*.yml` — contenu des pages |
| `settings` | `data` | `settings/*.json` — config globale |
| `custom-pages` | `data` | `custom-pages/*.yml` — pages libres (section builder) |

### Accès aux données

**Settings** (via helper) :

```ts
import { getSiteData } from '../lib/data';
const site = await getSiteData();
// site.url, site.name, site.nav, site.email, site.social, etc.
```

`getSiteData()` fusionne `site.json` + `coordonnees.json` + `social.json` en un seul objet `SiteData`.

**Pages** (via getEntry) :

```ts
import { getEntry } from 'astro:content';
const home = await getEntry('pages', 'home');
const data = home!.data as any;
// data.hero.title, data.content.cards, etc.
```

### Pages libres (custom-pages)

Les pages libres utilisent un **section builder** : chaque page est composée d'un tableau de sections typées.

**Créer une page libre** : ajouter un fichier YAML dans `src/content/custom-pages/` ou via le CMS (collection "Pages libres").

```yaml
# src/content/custom-pages/services.yml
seo:
  title: "Nos services"
  description: "Découvrez nos services..."
hero:
  title: "Nos services"
breadcrumb: "Services"
sections:
  - type: text
    title: "Introduction"
    paragraphs:
      - "Premier paragraphe."
  - type: cards
    title: "Nos offres"
    cols: "3"
    items:
      - icon: "ph-lightning"
        title: "Service 1"
        text: "Description."
  - type: cta
    title: "Contactez-nous"
    buttonLabel: "Contact"
    buttonUrl: "/contact/"
```

**Types de sections disponibles** :

| Type | Champs | Description |
|------|--------|-------------|
| `text` | `title?`, `paragraphs[]` | Texte libre avec paragraphes |
| `cards` | `title?`, `cols?`, `items[{icon?, title, text}]` | Grille de cartes |
| `cta` | `title`, `text?`, `buttonLabel`, `buttonUrl`, `buttonVariant?` | Call to Action centré |
| `faq` | `title?`, `items[{question, answer}]` | FAQ en accordéon |
| `stats` | `items[{value, label}]` | Chiffres clés en grille 4 colonnes |

Toutes les sections acceptent un champ `background` optionnel : `"light"` (bg-bg), `"primary"` (bg-primary text-white), `"dark"` (bg-black text-white).

**Route** : `src/pages/[...slug].astro` — catch-all qui rend les pages libres.

### SEO éditable

Chaque page (fixes et libres) possède un objet `seo` dans ses données YAML, éditable via le CMS :

```yaml
seo:
  title: "Titre de la page"
  description: "Description 150-160 caractères."
  ogImage: "/images/page-og.jpg"  # optionnel
```

Les pages `.astro` passent `seo={data.seo}` au layout `<Base>`.

### Breadcrumbs

Le composant `<Breadcrumb>` affiche un fil d'Ariane visible (`Accueil / Page`) sur toutes les pages intérieures. Il est automatiquement rendu dans `Base.astro` quand la prop `breadcrumb` est fournie.

### CmsImage

Le composant `<CmsImage>` est dédié aux images CMS stockées dans `public/images/`. Il applique les bonnes pratiques (lazy loading, dimensions explicites pour éviter le CLS) :

```astro
import CmsImage from '../components/CmsImage.astro';
<CmsImage src="/images/photo.jpg" alt="Description" width={800} height={600} />
```

### Interface SiteData (`lib/data.ts`)

```ts
export interface SiteData {
  url: string;
  name: string;
  lang: string;
  description: string;
  ogImage: string;
  logoText: string;
  logoIcon: string;
  copyright: string;
  webhookUrl: string;
  webhookToken?: string;
  turnstileSiteKey: string;
  searchUrl?: string;
  fontsPreload?: string[];
  localBusiness?: { type?: string; address?: { ... }; geo?: { ... } };
  nav: Array<{ url: string; label: string; icon?: string; children?: Array<{ url: string; label: string }> }>;
  email: string;
  phone?: string;
  address?: string;
  social?: Array<{ label: string; url: string; icon: string }>;
}
```

## Config Tailwind (`tailwind.config.mjs`)

### Couleurs

| Token | HEX | Usage Tailwind |
|-------|-----|----------------|
| `primary` | `#235265` | `bg-primary`, `text-primary` |
| `secondary` | `#F0816B` | `bg-secondary`, `text-secondary` |
| `third` | `#97BCBB` | `bg-third`, `text-third` |
| `accent` | `#E8A838` | `bg-accent`, `text-accent` |
| `bg` | `#F3F9F9` | `bg-bg` |
| `border` | `#F5F8F9` | `bg-border`, `border-border` |
| `text` | `#828282` | `text-text` |
| `shadow` | `#EEF1F3` | `bg-shadow` |
| `success` | `#2E7D32` | `text-success` |
| `success-bg` | `#E8F5E9` | `bg-success-bg` |
| `success-border` | `#A5D6A7` | `border-success-border` |
| `error` | `#C62828` | `text-error` |
| `error-bg` | `#FBE9E7` | `bg-error-bg` |
| `error-border` | `#EF9A9A` | `border-error-border` |

### Spacing (grille base 4px, fluid `clamp()` pour les grandes valeurs)

| Token | Valeur | Usage |
|-------|--------|-------|
| `3xs` | 4px | `p-3xs`, `gap-3xs` |
| `2xs` | 8px | `p-2xs`, `gap-2xs` |
| `xs` | 12px | `p-xs`, `gap-xs` |
| `s` | 16px | `p-s`, `gap-s` |
| `m` | 24px | `p-m`, `gap-m` |
| `l` | clamp(1.5rem → 2rem) | `p-l`, `gap-l` |
| `xl` | clamp(2rem → 3rem) | `p-xl`, `gap-xl` |
| `2xl` | clamp(2.5rem → 4rem) | `p-2xl`, `gap-2xl` |
| `3xl` | clamp(3.5rem → 6rem) | `p-3xl`, `gap-3xl` |
| `4xl` | clamp(4.5rem → 8rem) | `p-4xl`, `gap-4xl` |
| `container` | 1100px | `max-w-container` |

### Typographie (Major Third 1.25, fluid)

| Token | Valeur | Usage |
|-------|--------|-------|
| `h1` | clamp(2.441rem → 3.052rem) | `text-h1` |
| `h2` | clamp(1.953rem → 2.441rem) | `text-h2` |
| `h3` | clamp(1.563rem → 1.953rem) | `text-h3` |
| `h4` | clamp(1.25rem → 1.563rem) | `text-h4` |
| `text-xl` | clamp(1.125rem → 1.25rem) | `text-text-xl` |
| `text-l` | clamp(1rem → 1.125rem) | `text-text-l` |
| `text-m` | 1rem (fixe) | `text-text-m` |
| `text-s` | 0.875rem (fixe) | `text-text-s` |
| `text-xs` | 0.75rem (fixe) | `text-text-xs` |

### Autres tokens

- `borderRadius` : `DEFAULT` (12px), `m` (16px) — `rounded`, `rounded-m`
- `boxShadow` : `card` (0 4px 12px #EEF1F3) — `shadow-card`, `form` (0 4px 20px rgba(0,0,0,0.05)) — `shadow-form`
- `maxWidth` : `container` (1100px) — `max-w-container`
- `fontFamily` : `primary`, `secondary` — `font-primary`, `font-secondary`

## Composants (référence)

### `<Button>` (`src/components/Button.astro`)

Bouton polymorphe : rendu `<a>` si `href` est fourni, sinon `<button>`.

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `href` | `string?` | — | Si présent, rendu en `<a>` |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'outline-white' \| 'dark'` | `'primary'` | Style visuel |
| `icon` | `string?` | — | Nom d'icône Phosphor (sans préfixe `ph:`) |
| `full` | `boolean` | `false` | Pleine largeur |
| `type` | `'button' \| 'submit'` | `'button'` | Type HTML (mode button) |
| `disabled` | `boolean` | `false` | Désactivé (mode button) |
| `class` | `string?` | — | Classes additionnelles |

```astro
<Button href="/contact/" variant="primary" icon="arrow-right">Contact</Button>
<Button variant="outline">En savoir plus</Button>
<Button type="submit" variant="secondary" full>Envoyer</Button>
```

### `<Card>` (`src/components/Card.astro`)

Carte avec fond blanc, padding, shadow et border-radius. Accepte un slot pour le contenu.

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string?` | Titre affiché en `<h3>` |
| `icon` | `string?` | Icône Phosphor (format `ph-xxx` ou `ph:xxx`, converti automatiquement) |
| `class` | `string?` | Classes additionnelles |

```astro
<Card title="Titre" icon="ph-lightning">
  <p>Contenu de la carte.</p>
</Card>
```

### `<Grid>` (`src/components/Grid.astro`)

Grille responsive avec colonnes et gap configurables.

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `cols` | `'1' \| '2' \| '3' \| '4' \| '1-2' \| '2-1' \| '1-3' \| '3-1'` | — | Nombre de colonnes |
| `gap` | `string` | `'l'` | Token de spacing (3xs → 2xl) |
| `class` | `string?` | — | Classes additionnelles |

Breakpoints responsives :
- `cols="2"` : 1col mobile, 2col `md:` (768px)
- `cols="3"` : 1col mobile, 2col `md:`, 3col `lg:` (1024px)
- `cols="4"` : 1col mobile, 2col `md:`, 4col `lg:`
- Asymétriques (`1-2`, `2-1`, `1-3`, `3-1`) : 1col mobile, proportionnel `md:`

```astro
<Grid cols="3" gap="l">
  <Card title="A"><p>...</p></Card>
  <Card title="B"><p>...</p></Card>
  <Card title="C"><p>...</p></Card>
</Grid>
```

### `<Faq>` (`src/components/Faq.astro`)

FAQ standalone avec accordéon et JSON-LD FAQPage automatique. Utilisable directement dans les pages `.astro` (contrairement à `FaqSection` qui est réservé au section builder).

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string?` | Titre de la section |
| `items` | `Array<{ question: string; answer: string }>` | Questions/réponses |
| `background` | `'light' \| 'primary' \| 'dark'` | Fond optionnel |

```astro
<Faq
  title="Questions fréquentes"
  items={data.faq}
  background="light"
/>
```

### `<FormField>` (`src/components/FormField.astro`)

Champ de formulaire réutilisable avec label, icône Phosphor, validation aria et message d'erreur.

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `type` | `'text' \| 'email' \| 'tel' \| 'textarea'` | `'text'` | Type de champ |
| `name` | `string` | — | Nom et id du champ |
| `label` | `string` | — | Label affiché (ajoute ' *' si required) |
| `required` | `boolean` | `false` | Champ obligatoire |
| `icon` | `string?` | — | Nom Phosphor sans préfixe (ex: "user") |
| `placeholder` | `string?` | — | Placeholder |
| `maxlength` | `number?` | — | Longueur max |
| `autocomplete` | `string?` | — | Valeur autocomplete HTML |
| `rows` | `number` | `6` | Lignes textarea |

```astro
<FormField type="text" name="name" label="Nom" required icon="user" maxlength={100} autocomplete="name" />
<FormField type="textarea" name="message" label="Message" required icon="chat-text" maxlength={5000} />
```

### `<Hero>` (`src/components/Hero.astro`)

Bannière hero avec fond primary et texte centré.

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `title` | `string` | — | Titre principal (H1) |
| `subtitle` | `string?` | — | Sous-titre |
| `size` | `'default' \| 'compact'` | `'default'` | Taille (compact = padding réduit pour pages internes) |

```astro
<Hero title="Bienvenue" subtitle="Description courte" />
<Hero title="Contact" size="compact" />
```

### `<Section>` (`src/components/Section.astro`)

Section avec padding vertical fluid et container centré (max-width 1100px).

| Prop | Type | Description |
|------|------|-------------|
| `class` | `string?` | Classes additionnelles (ex: `bg-bg`, `bg-primary`) |

```astro
<Section class="bg-bg">
  <h2 class="mb-l">Titre</h2>
  <p>Contenu...</p>
</Section>
```

### `<Header>` (`src/components/Header.astro`)

Header fixe avec navigation desktop, sous-menus dropdown et burger mobile.

| Prop | Type | Description |
|------|------|-------------|
| `site` | `SiteData` | Données du site (nav, logo, searchUrl) |
| `currentUrl` | `string` | URL courante pour l'état actif |

- Nav desktop visible `md:` (768px+), burger visible en dessous
- Liens actifs avec `aria-current="page"` et `text-primary font-semibold`
- Sous-menus dropdown au hover/click avec Escape pour fermer
- Icône recherche si `site.searchUrl` est défini
- Classe `.scrolled` ajoutée via JS (shadow + backdrop-filter)

### `<MobileMenu>` (`src/components/MobileMenu.astro`)

Menu mobile plein écran, toggle via JS.

| Prop | Type | Description |
|------|------|-------------|
| `site` | `SiteData` | Données du site (nav) |

- Ouverture : classe `.open` ajoutée par JS, `aria-hidden="false"`
- Fermeture : bouton X, clic lien, touche Escape
- Sous-menus en accordion avec `aria-expanded`

### `<Footer>` (`src/components/Footer.astro`)

Footer avec grille 3-4 colonnes (logo + description, navigation, contact, social optionnel).

| Prop | Type | Description |
|------|------|-------------|
| `site` | `SiteData` | Données du site |

- Children de la nav aplatis dans la liste de liens footer
- Social affiché uniquement si `site.social` est non vide
- Crédit "Lausanne Marketing" obligatoire en bas

### `<JsonLd>` (`src/components/JsonLd.astro`)

Schemas JSON-LD injectés avant `</body>`.

| Prop | Type | Description |
|------|------|-------------|
| `site` | `SiteData` | Données du site |
| `breadcrumb` | `string?` | Nom du breadcrumb (toutes les pages sauf home) |
| `currentUrl` | `string` | URL courante |
| `isHome` | `boolean` | `true` sur la homepage uniquement |

Schemas générés :
1. **BreadcrumbList** : toutes les pages (conditionnel sur `breadcrumb`)
2. **Organization** : toutes les pages (enrichi email, phone, address, sameAs)
3. **WebSite** : homepage uniquement (conditionnel sur `isHome`)
4. **LocalBusiness** : homepage uniquement (conditionnel sur `isHome` + `site.localBusiness`)

## Layouts

### `Base.astro` — Layout principal

Props :

```ts
interface Props {
  seo: { title: string; description: string; ogImage?: string };
  breadcrumb?: string;
  isHome?: boolean;
  noindex?: boolean;
}
```

Génère automatiquement :
- `<title>` : `seo.title | site.name`
- Meta description, canonical (`site.url + currentUrl`)
- Open Graph (7 balises) et Twitter Card (4 balises)
- CSP (Content Security Policy)
- Favicon, apple-touch-icon, manifest
- Preload des polices (via `site.fontsPreload`)
- Header, MobileMenu, Footer, JsonLd

Usage :

```astro
<Base
  seo={{ title: 'Accueil', description: 'Description 150-160 caractères.' }}
  isHome
>
  <!-- contenu -->
</Base>
```

### `Bare.astro` — Layout nu

Props : `seo: { title: string; description: string }`, `noindex?: boolean`.

Sans header, sans footer, sans JSON-LD. Utilisé pour la page Design System `/ds/`.

## Navigation centralisée

`site.nav[]` dans `src/content/settings/site.json` est itéré dans :
- `Header.astro` (nav desktop, avec `aria-current="page"` auto via `currentUrl`)
- `MobileMenu.astro` (nav mobile, avec accordion pour les sous-menus)
- `Footer.astro` (liens footer, avec aplatissement des children)

Pour ajouter une page à la nav : ajouter une entrée dans `site.nav[]`.

### Sous-menus (dropdown)

```json
{ "label": "Location", "children": [
  { "url": "/chambre/", "label": "Chambre d'hôtes" },
  { "url": "/appartements/", "label": "Appartements" }
]}
```

- **Desktop** : dropdown au hover/click avec `aria-expanded`, fermeture Escape
- **Mobile** : accordion avec toggle `max-height` + `aria-expanded`
- **Footer** : les children sont aplatis dans la liste de liens

## SEO

### Props du layout Base.astro

```astro
<Base
  seo={{ title: 'Titre page', description: 'Description 150-160 car.' }}
  breadcrumb="Nom page"
  isHome={false}
  noindex={false}
/>
```

Le layout `Base.astro` génère automatiquement :
- `<title>` : `seo.title | site.name`
- Meta description, canonical (`site.url + page.url`)
- Open Graph (7 balises) et Twitter Card (4 balises)
- JSON-LD BreadcrumbList (conditionnel sur `breadcrumb`)
- JSON-LD Organization (toutes les pages, enrichi si données disponibles)
- JSON-LD WebSite (homepage uniquement, conditionnel sur `isHome`)
- JSON-LD LocalBusiness (homepage, optionnel, conditionnel sur `site.localBusiness`)

### Sitemap

Généré automatiquement par `@astrojs/sitemap`. Exclut `/admin/` et `/ds/`. Ne jamais le modifier.

### robots.txt

Généré par `src/pages/robots.txt.ts` (endpoint Astro). Ne jamais le modifier.

## Icônes (astro-icon + Phosphor)

Les icônes utilisent `astro-icon` avec le set Phosphor Icons (`@iconify-json/ph`).

### Utilisation dans les composants

```astro
---
import { Icon } from 'astro-icon/components';
---
<Icon name="ph:arrow-right" class="w-4 h-4" />
<Icon name="ph:envelope-simple" class="w-5 h-5 text-white" />
```

### Format dans les données CMS

Dans les fichiers YAML/JSON, les icônes sont stockées au format CSS Phosphor (`ph-arrow-right`). La conversion vers le format Iconify (`ph:arrow-right`) est faite par le helper `toIconName()` dans les composants.

```yaml
icon: "ph-lightning"    # Données CMS
```
```ts
// Conversion dans les composants
function toIconName(name: string): string {
  return name.replace(/^ph-/, 'ph:');
}
```

### Règle

Toujours utiliser `<Icon name="ph:xxx" />` dans les composants Astro. Ne jamais utiliser `<i class="ph ph-xxx">` (ancien format CDN).

## Images

Les images sont stockées dans `public/images/` et servies telles quelles.

### Règle : toujours utiliser `<Image />`

**Ne JAMAIS utiliser de balise `<img>` classique.** Toujours utiliser le composant `<Image />` d'Astro qui optimise automatiquement (conversion WebP/AVIF, redimensionnement, width/height automatiques, `decoding="async"`).

```astro
---
import { Image } from 'astro:assets';
---
<Image src="/images/photo.jpg" alt="Description" width={800} height={600} />
```

- **`width`** : toujours passer la taille d'affichage CSS x2 (retina). Sans `width`, l'image source est servie a sa taille originale
- **`loading`** : `lazy` par defaut. Ajouter `loading="eager"` uniquement pour les images au-dessus du fold (hero, etc.)
- **`alt`** : toujours fournir un alt descriptif. Reserver `alt=""` uniquement pour les images purement decoratives

Pour les images dans les styles (hero background, etc.), utiliser `url('/images/...')` directement (seule exception a la regle `<Image />`).

### Images CMS

Pour les images referencees dans les donnees YAML/JSON (chemin dynamique), utiliser le composant `<CmsImage>` qui applique les bonnes pratiques (lazy loading, dimensions explicites) :

```astro
import CmsImage from '../components/CmsImage.astro';
<CmsImage src="/images/photo.jpg" alt="Description" width={800} height={600} />
```

## Polices web (self-hosted)

Les polices sont **toujours hébergées localement**. Ne jamais utiliser Google Fonts via CDN (performance + RGPD).

- **Fichiers font** : `public/fonts/*.woff2` (servis statiquement par Astro)
- **Déclarations** : `src/styles/fonts.css` (importé dans `global.css`)
- **Config** : `fontFamily` dans `tailwind.config.mjs`
- **Preload** : `fontsPreload` dans `site.json` (tableau d'URLs)
- **Format** : woff2 uniquement

### Procédure pour ajouter des polices

1. Télécharger les fichiers `.woff2` (subsets `latin` + `latin-ext`) dans `public/fonts/`
2. Déclarer les `@font-face` dans `src/styles/fonts.css` avec `font-display: swap`
3. Mettre à jour `fontFamily.primary` / `fontFamily.secondary` dans `tailwind.config.mjs`
4. Ajouter les URLs dans `fontsPreload` de `site.json` pour le preload

## Sveltia CMS

Accessible à `/admin/`. Permet aux clients d'éditer le contenu des pages YAML et des settings JSON.

- **Chargé via CDN** (`unpkg.com/@sveltia/cms@x.y.z`) : version épinglée pour la sécurité (supply-chain)
- **Fichiers** : `public/admin/index.html` (loader) + `public/admin/config.yml` (collections)
- **Collections** : `pages` (contenu YAML) + `settings` (paramètres JSON : site, coordonnées, social)
- **Dark mode** : forcé via `data-color-mode="dark"` dans `admin/index.html`
- **Auth OAuth** : Cloudflare Workers via [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth)
  - **Worker URL** : `https://sveltia-cms-auth.hello-cb2.workers.dev` (partagé entre tous les projets lm-stack)
  - **GitHub OAuth App** : `Sveltia CMS` (une seule pour tous les projets)
  - **Variables Cloudflare** : `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `ALLOWED_DOMAINS`
  - Pour un nouveau projet : ajouter le domaine dans `ALLOWED_DOMAINS` sur le worker + décommenter `base_url` dans `admin/config.yml`
  - Pour donner accès à un client : l'ajouter comme collaborateur (write) sur le repo GitHub

### Config CMS (`public/admin/config.yml`)

Options de personnalisation au-delà des collections :

- **`app_title`** : titre affiché sur la page de login et dans l'onglet du navigateur
- **`site_url`** : URL du site publié (active le bouton "Preview")
- **`preview_path`** : chemin de la page sur le site (combiné avec `site_url`)
- **`thumbnail`** : champ image utilisé comme vignette (notation dot pour `files`, champ direct pour `folder`)

Conventions CMS détaillées (icônes Material Symbols, hints Phosphor, widget d'aide) → voir `.claude/rules/cms.md`.

## Déploiement

Le workflow `.github/workflows/deploy.yml` :
1. Déclenché sur push vers `main`
2. `npm ci` + `npm run build` (Astro build + Pagefind indexation)
3. Upload `dist/` via `actions/upload-pages-artifact@v3`
4. Deploy via `actions/deploy-pages@v4`

**Activer** : Settings > Pages > Source: GitHub Actions.

## Styles globaux (`src/styles/global.css`)

Le fichier global.css charge Tailwind et définit les styles de base :

```css
@import "tailwindcss";
@config "../../tailwind.config.mjs";
@import "./fonts.css";
```

### Layer base

- `body` : `padding-top: 60px` (header fixe), `font-family` via variable CSS
- `a` : couleur primary, hover secondary, transition 0.3s
- `h1-h4` : couleur black, tailles fluid `clamp()`
- `ul, ol` : `list-style: none`

### Styles utilitaires (hors Tailwind)

- `.search__inner` : variables Pagefind UI overridées
- `.form-feedback`, `.form-feedback--success`, `.form-feedback--error` : feedback formulaires (couleurs via tokens `success-*` / `error-*` dans `tailwind.config.mjs`, référencés via CSS variables `var(--color-success)` etc.)
- `.form-input--error`, `.form-error` : états d'erreur des champs (couleur `error` tokenisée)
- `.form-card` : carte formulaire avec `shadow-form` (ombre plus large que `shadow-card`)
- `#header.scrolled` : shadow + backdrop-filter au scroll
- `#mobile-menu.open` : affichage du menu mobile

## Mapping ancien framework CSS → Tailwind

| Ancien (CSS custom) | Nouveau (Tailwind) |
|---------------------|-------------------|
| `class="bg--primary"` | `class="bg-primary"` |
| `class="color--white"` | `class="text-white"` |
| `class="grid--3 gap--xl"` | `<Grid cols="3" gap="xl">` |
| `class="card--default"` | `<Card>` composant |
| `class="btn btn--primary"` | `<Button variant="primary">` |
| `class="section"` | `<Section>` composant |
| `class="h--2"` | `class="text-h2"` |
| `class="text--s"` | `class="text-text-s"` |
| `class="weight--bold"` | `class="font-bold"` |
| `class="deco--uppercase"` | `class="uppercase"` |
| `class="align--center"` | `class="text-center"` |
| `class="mb--xl"` | `class="mb-xl"` |
| `class="pad--l"` | `class="p-l"` |
| `class="radius--m"` | `class="rounded-m"` |
| `class="shadow--default"` | `class="shadow-card"` |
| `class="width--container"` | `class="max-w-container mx-auto px-m"` |
| `class="display--1-0-0"` | `class="hidden lg:block"` (ou breakpoints Tailwind) |
| `<i class="ph ph-xxx" aria-hidden="true">` | `<Icon name="ph:xxx" class="w-4 h-4" />` |
| `{% image "path", "alt" %}` | `<Image src="path" alt="alt" />` |
| `{{ site.xxx }}` | `{site.xxx}` (expression JSX) |
| `{{ pages.home.xxx }}` | `{data.xxx}` (via `getEntry`) |
| `{% for item in items %}` | `{items.map((item) => (...))}` |
| `{% if condition %}` | `{condition && (...)}` |
| `class="section-wrap--dark"` | `<Section class="bg-black text-white">` |

## Design System (`ds.astro`)

Page de référence visuelle accessible à `/ds/`. Affiche tous les tokens Tailwind et composants du projet.

- **Layout** : utilise `Bare.astro` (sans header/footer), grid sidebar + main
- **Ne jamais supprimer ce fichier** — il doit être présent dans chaque projet
- **Toujours le mettre à jour** quand on modifie les tokens dans `tailwind.config.mjs` ou quand on ajoute des composants
- **`noindex: true`** — la page n'est pas indexée
- **Non indexée par Pagefind** — `Bare.astro` n'a pas `data-pagefind-body`
- **Sidebar desktop** : sticky à gauche, scroll spy automatique
- **Sidebar mobile** (≤991px) : drawer latéral (bouton sticky)

Sections affichées :
- Couleurs (brand + neutrals) avec HEX et classes Tailwind
- Typographie (headings + textes) avec tailles fluid
- Spacing (tokens avec valeurs)
- Composants (Button variants, Card, Grid layouts)

## Fichiers de règles (`.claude/rules/`)

| Fichier | Contenu |
|---------|---------|
| `aria.md` | Accessibilité : landmarks, aria attributes, icônes, menu mobile, formulaires |
| `seo.md` | SEO : meta title, front matter, canonical, OG, JSON-LD, sitemap, images |
| `oauth.md` | Guide OAuth : setup GitHub OAuth App, providers (Cloudflare Workers, Netlify), config CMS |
| `components.md` | Composants réutilisables (snippets Astro prêts à copier-coller) |
| `responsive.md` | Responsive : grids, breakpoints, interdictions |
| `cms.md` | CMS : hints Phosphor, icônes Material Symbols, widget d'aide, crédit footer |

## Formulaire de contact (webhook n8n)

Le formulaire de contact envoie les soumissions vers un webhook n8n.

- **Config** : `src/content/settings/site.json` → champs `webhookUrl`, `webhookToken`, `turnstileSiteKey`
- **Template** : `contact.astro` — le `<form>` porte `data-webhook` et `data-webhook-token`
- **JS** : `src/scripts/main.ts` — fetch POST en JSON (tous les champs via `FormData`)
- **Anti-spam** : Cloudflare Turnstile (`turnstileSiteKey`) + honeypot (champ `website` caché) + cooldown 10s entre soumissions
- **Auth webhook** : header `Authorization: Bearer {webhookToken}` envoyé à chaque requête (configurable dans `site.json`)
- **Token Turnstile** : le champ `cf-turnstile-response` est inclus dans le payload JSON pour validation côté serveur (dans le workflow n8n)
- **Validation** : côté client, en temps réel (blur + submit), avec `aria-invalid` et messages d'erreur. `maxlength` sur les champs (name: 100, email: 254, message: 5000)
- **CSS** : `.form-feedback--success` / `.form-feedback--error` dans `global.css`

### Sécurité du formulaire — checklist par projet

1. Générer un `webhookToken` aléatoire (`openssl rand -hex 32`) et le configurer dans `site.json`
2. Côté n8n : vérifier le header `Authorization` du webhook (Header Auth ou node code)
3. Côté n8n : valider le token Turnstile via POST `https://challenges.cloudflare.com/turnstile/v0/siteverify` avec `secret` (Turnstile secret key) et `response` (le `cf-turnstile-response` reçu)
4. Côté n8n : valider/sanitiser les inputs (longueur, format email) avant traitement

## Recherche (Pagefind)

- **Installation** : `pagefind` en devDependency, exécuté après Astro dans le script build (`astro build && npx pagefind --site dist`)
- **Index** : généré dans `dist/pagefind/` (non versionné)
- **Balisage** : `data-pagefind-body` sur `<main>` dans `Base.astro`
- `data-pagefind-ignore` sur `<header>`, `<footer>` et les `<script type="application/ld+json">`
- **Pages exclues** : `404.astro`, `recherche.astro` — wrapper `<div data-pagefind-ignore="all">`
- `ds.astro` utilise `Bare.astro` (pas de `data-pagefind-body`) donc n'est pas indexé
- **Config** : `site.searchUrl` dans `site.json` — si présent, affiche l'icône recherche dans le header
- **CSS** : variables Pagefind overridées dans `global.css` (`.search__inner`)
- **Dev** : l'index n'est pas généré avec `npm run dev`. Pour tester la recherche, lancer `npm run build` une fois

## CI — Tests automatisés

Le workflow `.github/workflows/ci.yml` s'exécute sur chaque push et PR vers `main` :

1. **npm audit** : vérifie les vulnérabilités des dépendances (niveau high+)
2. **htmltest** : valide les liens internes, images et scripts (config : `.htmltest.yml`), avec vérification SHA256 du binaire

## Skills (`.claude/commands/`)

Les skills projet guident les workflows multi-étapes. Disponibles via `/project:<nom>` :

| Skill | Usage |
|-------|-------|
| `create-new-site` | Setup complet d'un nouveau site depuis le template (identité, direction créative, design system, pages, sécurité, déploiement) |
| `add-custom-page` | Ajouter une page au site (YAML + nav + SEO + CMS sync) |
| `sync-design-system` | Mettre à jour `ds.astro` après modification des tokens Tailwind |
| `validate-before-deploy` | Checklist automatisée avant mise en production (sécu, SEO, a11y, build) |
| `configure-cms-oauth` | Configurer OAuth Sveltia CMS (GitHub, Cloudflare Worker, collaborateurs) |

## Règles pour Claude

### Général

1. **Utiliser les classes utilitaires Tailwind** — privilégier les classes Tailwind et les tokens définis dans `tailwind.config.mjs`. Ne créer de CSS custom que pour les cas non couverts (Pagefind overrides, form feedback, etc.)
2. **Séparer données et composants** : contenu éditable → YAML/JSON dans `src/content/`, structure → composants `.astro` avec props typées
3. **SEO dans les props du layout** : `seo.title`, `seo.description` passés en props à `<Base>`
4. **Navigation dans `site.json`** : ne jamais hardcoder les liens nav
5. **Ne jamais modifier `dist/`** — c'est le dossier de build auto-généré
6. **Ne jamais modifier `sitemap.xml` ou `robots.txt`** — générés automatiquement
7. **Valeurs HEX toujours en majuscules** — écrire `#F0816B`, jamais `#f0816b`
8. **Images** : toujours utiliser `<Image />` d'Astro (`import { Image } from 'astro:assets'`), jamais `<img>`. Pour les images CMS dynamiques, utiliser `<CmsImage>`
9. **Icônes** : utiliser `<Icon name="ph:xxx" />` via astro-icon, jamais `<i class="ph ...">`
10. **Composants** : utiliser les composants Astro existants (`Button`, `Card`, `Grid`, `Section`, `Hero`) au lieu de recréer des structures HTML ad hoc
11. **Props typées** : tout composant doit avoir une `interface Props` explicite
12. **Crédit footer Lausanne Marketing** : ne jamais supprimer la mention dans le footer
13. **Encodage UTF-8 obligatoire** : tous les fichiers (`.astro`, `.ts`, `.css`, `.yml`, `.json`, `.md`) doivent être encodés en UTF-8. Ne jamais utiliser d'autre encodage

### Tailwind — personnalisation par projet

Les tokens dans `tailwind.config.mjs` sont un **point de départ**. Chaque projet peut et doit les adapter :

13. **Modifier les valeurs des tokens** — couleurs, fonts, spacing et border-radius dans `tailwind.config.mjs`. C'est la première chose à personnaliser
14. **Ajouter de nouveaux tokens** — si le design nécessite des tokens supplémentaires (ex: `primary-dark`, `bg-alt`), les ajouter dans `tailwind.config.mjs`. Les documenter dans le CLAUDE.md du projet
15. **Styles de base dans `global.css`** — pour les styles qui ne relèvent pas de Tailwind (CSS custom pour des composants tiers, overrides de librairies), les ajouter dans `global.css`
16. **Reproduire le design fidèlement** — quand on migre un site existant, respecter exactement les couleurs, border-radius, ombres, spacing et typographie du design original
17. **Documenter les écarts** — tout token ou style ajouté ou modifié par rapport au blueprint doit être documenté dans le CLAUDE.md du projet

### Responsive

Voir `.claude/rules/responsive.md` pour les règles détaillées. Principes clés :
- Utiliser le composant `<Grid>` pour les grilles à colonnes égales
- Les breakpoints Tailwind : `md:` (768px), `lg:` (1024px)
- Jamais de scroll horizontal — tester à 375px
- Jamais de grids en inline style

## Workflow pour un nouveau projet

1. "Use this template" sur GitHub → nouveau repo
2. Cloner le repo et `npm install`
3. Lancer `/project:create-new-site` — le skill guide toutes les étapes :
   - Phase 1 : Identité + direction créative
   - Phase 2 : Design system (couleurs, polices, favicons)
   - Phase 3 : Configuration technique (settings, nav, CMS, recherche)
   - Phase 4 : Création des pages (avec approche frontend-design)
   - Phase 5 : Sécurité (webhook token, Turnstile)
   - Phase 6 : Déploiement (GitHub Pages, custom domain)
   - Phase 7 : Vérifications finales
