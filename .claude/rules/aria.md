# Règles d'accessibilité (ARIA)

## Icônes décoratives

Les icônes Phosphor via `astro-icon` (`<Icon name="ph:xxx" />`) sont des SVG inline. Ajouter `aria-hidden="true"` quand l'icône est purement décorative (le texte adjacent porte le sens).

```astro
<Icon name="ph:arrow-right" class="w-4 h-4" aria-hidden="true" />
```

## Landmarks

- `<header>` : `role="banner"`
- `<footer>` : `role="contentinfo"`
- `<main>` : toujours wrapper le contenu principal dans `<main id="main-content">`
- `<nav>` : toujours ajouter `aria-label` pour distinguer les navigations (ex: "Navigation principale", "Navigation footer", "Menu mobile")

## Navigation

- Lien actif : ajouter `aria-current="page"` en plus de la classe active
- Logo : ajouter `aria-label={`Accueil — ${site.name}`}` sur le lien logo

## Menu mobile

- Le burger doit porter `aria-expanded="false"` (mis à jour en JS) et `aria-controls="mobile-menu"`
- Le conteneur mobile-menu doit porter `aria-hidden="true"` (mis à jour en JS) et `role="dialog"`
- À l'ouverture : focus sur le bouton fermer
- À la fermeture : focus retourné sur le burger

## Formulaires

- Chaque champ obligatoire doit porter `aria-required="true"`
- Ajouter `autocomplete` sur les champs standards (`name`, `email`)
- Ajouter `novalidate` sur le `<form>` (validation gérée en JS)
- Chaque champ doit avoir un `<span class="form-error" role="alert">` associé pour les erreurs
- En cas d'erreur : ajouter `aria-invalid="true"` et `aria-describedby="<id>-error"` sur le champ
- Le feedback global (`#form-feedback`) doit porter `role="status"` et `aria-live="polite"`
