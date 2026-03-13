---
name: sync-design-system
description: Use after modifying design tokens in tailwind.config.mjs — compares current tokens with ds.astro and updates the design system page to reflect actual values.
---

# Synchroniser le Design System

Met à jour `src/pages/ds.astro` pour qu'il reflète les tokens actuels de `tailwind.config.mjs`. À lancer après toute modification de couleurs, polices, spacing ou autres tokens.

---

## 1. Lire les tokens actuels

Lire `tailwind.config.mjs` et extraire tous les tokens :

| Catégorie | Clé dans le config | Exemple |
|-----------|-------------------|---------|
| Couleurs | `colors` | `primary: "#235265"` |
| Typographie | `fontSize` | `h1: "clamp(2.441rem, ...)"` |
| Spacing | `spacing` | `m: "24px"` |
| Border-radius | `borderRadius` | `DEFAULT: "12px"` |
| Shadows | `boxShadow` | `card: "0 4px 12px ..."` |
| Fonts | `fontFamily` | `primary: ["Font Name", ...]` |
| Max-width | `maxWidth` | `container: "1100px"` |

## 2. Lire ds.astro

Lire `src/pages/ds.astro` et identifier les sections affichant les tokens :
- **Couleurs** : swatches avec pastille colorée, nom, HEX, classe Tailwind
- **Typographie** : exemples de chaque taille avec valeur
- **Spacing** : liste des tokens avec valeurs
- **Composants** : Button (toutes variantes), Card, Grid

## 3. Comparer et identifier les écarts

Pour chaque catégorie, comparer config vs ds.astro :
- Token dans le config mais absent de ds.astro → **ajouter**
- Token dans ds.astro mais absent du config → **retirer**
- Token avec valeur différente (HEX, taille, etc.) → **mettre à jour**

**Présenter un résumé des écarts** à l'utilisateur sous forme de tableau avant de modifier.

## 4. Appliquer les modifications

Mettre à jour `ds.astro` en préservant :
- La structure HTML et le layout (sidebar + main)
- Les classes Tailwind du layout
- Les sections Composants (ne modifier que si un variant Button a changé)
- Le `noindex` et le layout `Bare`

Ne modifier que les **données** : noms de tokens, valeurs HEX, tailles, exemples.

**Valeurs HEX toujours en MAJUSCULES.**

## 5. Valider

- `npm run build` pour vérifier la compilation
- Résumer les changements effectués dans un tableau
