---
name: create-new-site
description: Use when setting up a new site from the site-blueprint template. Guides through identity, creative direction, design system, page creation, security, and deployment — combines configuration with frontend design for a complete, distinctive site.
---

# Nouveau site depuis site-blueprint

Tu accompagnes l'utilisateur de A à Z : de la configuration du repo jusqu'à la création de pages visuellement distinctives et production-ready. Chaque étape est interactive — demande les informations, propose des choix créatifs, implémente, montre le résultat.

**Ne saute aucune phase. Ne passe à la suivante qu'après validation de l'utilisateur.**

---

## Phase 0 — Pré-requis

Vérifie silencieusement :
1. Présence de `astro.config.mjs`, `src/content/settings/site.json`, `public/admin/config.yml`
2. `git remote -v` pointe vers le nouveau repo (pas `lm-stack/site-blueprint`)
3. `node --version` >= 20
4. `npm install` si `node_modules/` absent

Si le remote est encore site-blueprint → demander le nouveau repo et corriger avec `git remote set-url origin`.

---

## Phase 1 — Découverte & direction créative

**C'est la phase la plus importante.** Elle détermine toutes les décisions design qui suivent.

### 1.1 Identité du projet

**Demander :**
- Nom du site, URL de production, email de contact
- Téléphone, adresse postale (optionnel)
- Description en 1-2 phrases (pour la meta description, 150-160 caractères)
- Réseaux sociaux (URLs Facebook, Instagram, LinkedIn, etc.)
- Le site représente-t-il un lieu physique ? (pour le schema LocalBusiness)

### 1.2 Comprendre le contexte

**Demander :**
- Quel est le but du site ? Qui est le public cible ?
- Y a-t-il un site existant à remplacer ou une référence visuelle ?
- Y a-t-il une charte graphique, des couleurs imposées, un logo ?
- Quel ton/ambiance ? (luxe, chaleureux, professionnel, créatif, minimaliste…)
- Des sites qu'il aime visuellement ? (pour comprendre ses goûts)

### 1.3 Direction artistique

À partir des réponses, **proposer une direction créative avec conviction.** Ne pas demander "vous préférez A ou B" — proposer UNE direction forte, argumentée, et ajuster si l'utilisateur veut des changements.

**Définir :**

| Élément | Décision |
|---------|----------|
| **Tonalité** | Ex : "élégant et chaleureux", "brutalement minimaliste", "organique et naturel" |
| **Palette** | Primary, secondary, accent + couleurs de fond/texte — cohérente avec le ton |
| **Typographie** | Police display (titres) + police body (texte) — distinctives, jamais génériques |
| **Atmosphère** | Textures, ombres, arrondis, densité — ce qui rend le site mémorable |
| **Signature** | L'élément qu'on retient — un détail, un mouvement, un contraste |

**INTERDITS créatifs :**
- Polices génériques (Inter, Roboto, Arial, system-ui)
- Dégradés violets sur fond blanc
- Layouts prévisibles sans caractère
- Design "template AI" sans personnalité

**Contraintes techniques à respecter :**
- Le design passe par les tokens Tailwind (`tailwind.config.mjs`) — pas de valeurs hardcodées
- Les composants existants (`Section`, `Grid`, `Card`, `Button`, `Hero`) sont la base — les enrichir plutôt que les contourner
- Mobile-first, responsive OK à 375px
- Polices self-hosted uniquement (woff2, pas de CDN Google Fonts — RGPD)

---

## Phase 2 — Mise en place du design system

Appliquer la direction créative dans les fichiers de config.

### 2.1 Couleurs

**Modifier `tailwind.config.mjs` :**
- `primary`, `secondary`, `third`, `accent` — couleurs de marque
- `bg` — fond principal
- `text` — couleur de texte par défaut
- `border`, `shadow` — subtils, cohérents avec la palette

Valeurs HEX en MAJUSCULES (`#F0816B`). Créer des tokens supplémentaires si le design l'exige (ex : `primary-dark`, `bg-alt`).

### 2.2 Typographie

1. Télécharger les `.woff2` (latin + latin-ext) dans `public/fonts/`
2. Déclarer les `@font-face` dans `src/styles/fonts.css` avec `font-display: swap`
3. Mettre à jour `fontFamily.primary` / `fontFamily.secondary` dans `tailwind.config.mjs`
4. Ajouter les URLs dans `fontsPreload` de `site.json`

Ajuster les tokens de taille (`h1`→`h4`, `text-xl`→`text-xs`) si l'échelle typographique du design le justifie.

### 2.3 Spacing, border-radius, shadows

Ajuster dans `tailwind.config.mjs` si la direction artistique le demande :
- `borderRadius` — arrondis plus doux ou plus nets selon le ton
- `boxShadow` — ombres plus marquées ou plus subtiles
- Tokens de spacing — rarement à changer, mais possible

### 2.4 Styles globaux

Adapter `src/styles/global.css` si nécessaire :
- Couleurs des liens (hover, visited)
- Styles du header au scroll (`.scrolled`)
- Overrides Pagefind si la recherche est activée

### 2.5 Favicons et images

Demander le logo et l'image OG. Fichiers à remplacer dans `public/` :
- `favicon.ico` (32x32), `favicon.svg`
- `apple-touch-icon.png` (180x180)
- `android-chrome-192x192.png`, `android-chrome-512x512.png`
- `og-image.jpg` (1200x630)

Modifier `site.json` → `logoIcon` (icône Phosphor pour le header).

### 2.6 Mettre à jour le Design System

**Mettre à jour `src/pages/ds.astro`** pour refléter les nouveaux tokens (couleurs, polices, spacing, composants). Cette page sert de référence visuelle.

---

## Phase 3 — Configuration technique

### 3.1 Settings

**Modifier avec les infos de la Phase 1 :**
- `src/content/settings/site.json` : `url`, `name`, `description`, `email`, `logoText`, `copyright`, `logoIcon`
- `src/content/settings/coordonnees.json` : `email`, `phone`, `address`
- `src/content/settings/social.json` : réseaux sociaux
- `astro.config.mjs` : champ `site` (URL de production)

### 3.2 Navigation

**Demander :** quelles pages au-delà de Accueil / À propos / Contact ? Sous-menus ?

**Modifier :**
- `site.json` → tableau `nav`
- Créer les fichiers YAML dans `src/content/custom-pages/` pour les nouvelles pages

### 3.3 Recherche (Pagefind)

**Demander :** la recherche doit-elle être activée ?
- **Oui** : vérifier `searchUrl: "/recherche/"` dans `site.json`
- **Non** : retirer `searchUrl` de `site.json`

### 3.4 LocalBusiness (si lieu physique)

Si identifié en Phase 1, ajouter dans `site.json` :
```json
"localBusiness": {
  "type": "LodgingBusiness",
  "address": { "street": "...", "locality": "...", "postalCode": "...", "country": "CH" },
  "geo": { "lat": 46.5, "lng": 6.6 }
}
```

### 3.5 CMS (Sveltia CMS)

**Modifier `public/admin/config.yml` :**
- `repo` → `organisation/nouveau-repo`
- `base_url` → `https://sveltia-cms-auth.hello-cb2.workers.dev`

**OAuth :**
- Ajouter le domaine dans `ALLOWED_DOMAINS` sur le Cloudflare Worker
- Ajouter les collaborateurs (write) sur le repo GitHub

**Widget "Besoin d'aide ?"** dans `public/admin/index.html` : personnaliser logo, nom, email, URL.

---

## Phase 4 — Création des pages

**C'est ici que le design prend vie.** Construire chaque page avec la direction artistique définie en Phase 1. Utiliser les composants du blueprint comme base, les enrichir avec du CSS Tailwind créatif.

### Principes de design par page

Pour chaque page :
1. **Comprendre le rôle** — que doit accomplir cette page ?
2. **Composer** — choisir les sections, leur ordre, leur rythme (alternance fond clair/sombre, densité/respiration)
3. **Implémenter** — code Astro production-ready avec attention aux détails
4. **Raffiner** — micro-détails qui font la différence (spacing, hover states, transitions)

### Boîte à outils

**Composants existants** (toujours les utiliser en priorité) :
- `<Section>`, `<Grid>`, `<Card>`, `<Button>`, `<Hero>`, `<CmsImage>`, `<Breadcrumb>`
- Sections builder : `TextSection`, `CardsSection`, `CtaSection`, `FaqSection`, `StatsSection`
- Snippets réutilisables : voir `.claude/rules/components.md`

**Enrichissements créatifs possibles** (Tailwind uniquement, pas de CSS custom sauf nécessité) :
- Backgrounds atmosphériques (gradients, overlays sur images)
- Asymétrie avec les grilles `1-2`, `2-1`, `1-3`, `3-1`
- Hover states expressifs sur les cards et boutons
- Espacement généreux ou densité contrôlée selon le ton
- Icônes Phosphor (`<Icon name="ph:xxx" />`) pour ponctuer le contenu

**Données = YAML.** Le contenu va dans `src/content/pages/*.yml` ou `src/content/custom-pages/*.yml`. Les composants lisent les données via props. Ne jamais hardcoder du contenu dans les `.astro`.

### 4.1 Homepage (`index.astro` + `home.yml`)

La page la plus importante. Elle donne le ton du site entier.

**Structure type :**
- Hero (première impression — doit être mémorable)
- Section de valeur / proposition (ce que fait le client)
- Grille de services/offres (Cards)
- Social proof / témoignages (si applicable)
- CTA final

Modifier `home.yml` (hero, cards, footer description) + `index.astro` (seo, structure).

### 4.2 À propos (`a-propos.astro` + `a-propos.yml`)

**Structure type :**
- Hero
- Histoire / présentation (grille asymétrique texte + image/sidebar)
- Équipe (si applicable)
- Valeurs / chiffres clés

Modifier `a-propos.yml` (hero, story, sidebar) + `a-propos.astro` (seo).

### 4.3 Contact (`contact.astro` + `contact.yml`)

- Hero
- Grille : formulaire + coordonnées/carte
- Le formulaire est déjà fonctionnel (webhook + Turnstile)

Modifier `contact.yml` (coordonnées) + `contact.astro` (seo).

### 4.4 Pages supplémentaires

Pour chaque page custom identifiée en Phase 3 :
1. Créer le fichier YAML dans `src/content/custom-pages/`
2. Définir les sections (section builder : text, cards, cta, faq, stats)
3. La route `[...slug].astro` les rend automatiquement

Si une page nécessite une structure non couverte par le section builder → créer une route `.astro` dédiée dans `src/pages/`.

### 4.5 SEO de chaque page

Pour chaque fichier `.astro`, vérifier les props du layout :
```astro
<Base
  seo={{ title: "Titre", description: "Description 150-160 caractères." }}
  breadcrumb="Nom page"
>
```

Si une page a besoin d'une image OG spécifique : `ogImage: "/images/page-og.jpg"`.

### 4.6 Mettre à jour le CMS

Si de nouveaux champs ou collections ont été ajoutés → mettre à jour `public/admin/config.yml` pour que le client puisse tout éditer.

---

## Phase 5 — Sécurité

### 5.1 Webhook token

1. Générer : `openssl rand -hex 32`
2. Configurer dans `site.json` → `webhookToken`
3. Configurer dans `site.json` → `webhookUrl` (URL du webhook n8n)
4. Configurer le même token côté n8n (Header Auth ou vérification Bearer)

### 5.2 Cloudflare Turnstile

1. Créer un site sur le [dashboard Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
2. Site Key → `site.json` → `turnstileSiteKey`
3. Secret Key → workflow n8n (POST `https://challenges.cloudflare.com/turnstile/v0/siteverify`)

---

## Phase 6 — Déploiement

### 6.1 GitHub Pages

1. Settings > Pages > Source : **GitHub Actions**
2. Push vers `main` → premier déploiement
3. Vérifier que `deploy.yml` et `ci.yml` passent

### 6.2 Custom domain (si applicable)

1. CNAME dans le DNS → `<org>.github.io`
2. Settings > Pages > Custom domain
3. Activer "Enforce HTTPS"
4. Retirer `ELEVENTY_PATH_PREFIX` du `deploy.yml` si présent

---

## Phase 7 — Vérifications finales

- [ ] `npm run build` passe sans erreur
- [ ] Site OK en local (`npm run preview`)
- [ ] Formulaire de contact → webhook n8n fonctionne
- [ ] CMS accessible à `/admin/`, connexion GitHub OK
- [ ] Favicons visibles (navigateur + onglet)
- [ ] Image OG correcte
- [ ] Page `/ds/` reflète les bons tokens
- [ ] CI passe (`npm audit` + `htmltest`)
- [ ] Responsive OK à 375px — zéro scroll horizontal
- [ ] Chaque page a un `seo.description` de 150-160 caractères
- [ ] Supprimer `launch.md`

---

## Fin

Proposer de supprimer `launch.md` et de faire un commit avec tous les changements. Résumer ce qui a été configuré et créé.
