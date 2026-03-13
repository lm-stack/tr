---
name: add-custom-page
description: Use when adding a new page to the site — creates the YAML content file, adds navigation link, validates SEO, and updates CMS config if needed.
---

# Ajouter une page

Guide interactif pour ajouter une nouvelle page au site. Synchronise automatiquement les fichiers concernés (YAML, navigation, CMS).

**Ne pas créer de fichier `.astro` dédié** — les pages custom passent par la route catch-all `[...slug].astro` et le section builder.

---

## 1. Définir la page

**Demander :**
- Nom de la page (ex : "Nos services", "Galerie", "Tarifs")
- Auto-générer le slug en kebab-case (ex : `nos-services`)
- Position dans la navigation : après quelle page ?
- Sous-menu d'une page existante ? (dropdown dans `children`)

## 2. SEO

**Demander :**
- Titre SEO (50-60 caractères max, sans séparateur ni nom du site)
- Meta description (valider : 150-160 caractères exactement)
- Image OG spécifique ? (optionnel, sinon image par défaut)

## 3. Hero (optionnel)

**Demander :**
- La page a-t-elle un hero ? (bandeau titre en haut, fond primary)
- Si oui : titre du hero (et sous-titre optionnel)

## 4. Sections

**Demander quelles sections composer.** Types disponibles :

| Type | Champs | Rendu |
|------|--------|-------|
| `text` | `title?`, `paragraphs[]` | Blocs de texte |
| `cards` | `title?`, `cols?` (2-4), `items[{icon?, title, text}]` | Grille de cartes |
| `cta` | `title`, `text?`, `buttonLabel`, `buttonUrl`, `buttonVariant?` | Call to Action centré |
| `faq` | `title?`, `items[{question, answer}]` | Accordéon Q&A |
| `stats` | `items[{value, label}]` | Chiffres clés en grille |

Chaque section accepte un `background` optionnel : `"light"` (bg-bg), `"primary"` (bg-primary text-white), `"dark"` (bg-black text-white).

**Demander le contenu** de chaque section choisie. Pour les icônes : format `ph-xxx` (voir phosphoricons.com).

## 5. Créer le fichier YAML

**Créer `src/content/custom-pages/{slug}.yml` :**

```yaml
seo:
  title: "Titre SEO"
  description: "Description 150-160 caractères."
hero:
  title: "Titre du hero"
breadcrumb: "Nom de la page"
sections:
  - type: text
    title: "Section titre"
    paragraphs:
      - "Premier paragraphe."
      - "Deuxième paragraphe."
  - type: cards
    title: "Nos offres"
    cols: "3"
    items:
      - icon: "ph-lightning"
        title: "Titre carte"
        text: "Description."
```

## 6. Ajouter à la navigation

**Modifier `src/content/settings/site.json`** → tableau `nav` :

**Page de premier niveau :**
```json
{ "url": "/{slug}/", "label": "Nom de la page" }
```

**Sous-menu (dans le `children` d'un parent existant) :**
```json
{ "url": "/{slug}/", "label": "Nom de la page" }
```

Insérer à la position demandée par l'utilisateur.

## 7. Mettre à jour le CMS (si nécessaire)

Vérifier dans `public/admin/config.yml` que la collection `custom-pages` couvre bien tous les types de sections utilisés. Normalement rien à changer — le section builder est déjà configuré pour tous les types. Vérifier quand même si de nouveaux champs ont été ajoutés au schema `src/content/config.ts`.

## 8. Valider

- Lancer `npm run build` pour vérifier la compilation
- Afficher l'URL finale : `/{slug}/`
- Rappeler que la page est éditable via le CMS à `/admin/` (collection "Pages libres")
