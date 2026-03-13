---
name: validate-before-deploy
description: Use before deploying to production — runs automated checks for security, SEO, accessibility, build, and configuration consistency. Reports issues and proposes fixes.
---

# Validation pré-déploiement

Exécute tous les checks, présente un rapport structuré, et propose des corrections automatiques pour les problèmes simples.

**Lire les fichiers nécessaires, exécuter les commandes, puis présenter le rapport complet.**

---

## 1. Configuration (valeurs par défaut non remplacées)

Lire `src/content/settings/site.json`, `astro.config.mjs`, `public/admin/config.yml` et vérifier :

| Check | Fichier | Valeur interdite |
|-------|---------|-----------------|
| `site` | `astro.config.mjs` | `https://example.com` |
| `url` | `site.json` | `https://example.com` |
| `site` = `url` | les deux | valeurs différentes |
| `name` | `site.json` | `"Nom du site"` |
| `email` | `site.json` | `email@example.com` |
| `logoText` | `site.json` | `"Blueprint"` |
| `copyright` | `site.json` | `"Blueprint"` |
| `repo` | `admin/config.yml` | `lm-stack/site-blueprint` |

## 2. Sécurité

Lire `site.json` et vérifier :

| Check | Critère |
|-------|---------|
| `webhookToken` défini | non vide, non null |
| `webhookToken` robuste | >= 32 caractères, format hex |
| `webhookUrl` défini | URL valide (https://) |
| `turnstileSiteKey` défini | non vide |
| Pas de secrets dans les YAML | scanner `src/content/` pour des patterns type `sk-`, `secret`, `password` |

Vérifier aussi que `base_url` est configuré dans `admin/config.yml` (OAuth activé).

## 3. SEO

Pour chaque page, lire le fichier `.astro` et le YAML associé :

| Page | Fichier .astro | Fichier YAML |
|------|---------------|-------------|
| Homepage | `index.astro` | `pages/home.yml` |
| À propos | `a-propos.astro` | `pages/a-propos.yml` |
| Contact | `contact.astro` | `pages/contact.yml` |
| Custom pages | — | `custom-pages/*.yml` |

**Vérifier pour chaque page :**
- `seo.title` défini et non vide
- `seo.description` entre 150 et 160 caractères (compter précisément)
- `seo.title` ne contient pas de séparateur (`|`, `—`, `-`) ni le nom du site
- `breadcrumb` présent (sauf homepage)

**Vérifier globalement :**
- `og-image.jpg` existe dans `public/`
- `favicon.ico` et `favicon.svg` existent dans `public/`
- `site.json` → `description` est définie

## 4. Accessibilité

Scanner les fichiers `.astro` dans `src/components/` et `src/pages/` :

| Check | Règle |
|-------|-------|
| Icônes décoratives | `<Icon>` sans texte adjacent → doit avoir `aria-hidden="true"` |
| Nav avec label | `<nav>` → doit avoir `aria-label` |
| Main landmark | `<main id="main-content">` présent dans le layout |
| Formulaires | champs obligatoires → `aria-required="true"` |
| Formulaires | `<form>` → `novalidate` (validation JS) |
| Images | `<Image>` et `<CmsImage>` → `alt` non vide (sauf `alt=""` décoratives) |

## 5. Build & CI

Exécuter :
- `npm audit --audit-level=high` → signaler les vulnérabilités
- `npm run build` → doit passer sans erreur

Vérifier :
- `launch.md` n'existe plus (devrait être supprimé après setup)
- `.github/workflows/deploy.yml` et `ci.yml` sont présents

## 6. Cohérence

| Check | Détail |
|-------|--------|
| Nav vs pages | Chaque URL dans `site.json` → `nav` a une page correspondante |
| Polices | Chaque police dans `fontFamily` a un `@font-face` dans `fonts.css` |
| Preload | Chaque police dans `fontsPreload` existe dans `public/fonts/` |
| Design System | `ds.astro` reflète les tokens actuels (couleurs, polices) |

---

## Rapport

Présenter sous forme de tableau récapitulatif :

```
| Catégorie      | Status | Détails                              |
|----------------|--------|--------------------------------------|
| Configuration  | ✅ / ❌ | X checks passés, Y échoués          |
| Sécurité       | ✅ / ❌ | ...                                  |
| SEO            | ✅ / ❌ | ...                                  |
| Accessibilité  | ✅ / ❌ | ...                                  |
| Build          | ✅ / ❌ | ...                                  |
| Cohérence      | ✅ / ❌ | ...                                  |
```

Pour chaque ❌ : indiquer le fichier, le problème exact, et la correction.

**Proposer de corriger automatiquement** les problèmes simples (descriptions SEO trop courtes, attributs ARIA manquants, valeurs par défaut). Demander confirmation avant chaque correction.
