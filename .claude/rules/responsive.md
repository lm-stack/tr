# Règles responsive

## Grilles avec le composant `<Grid>`

- **Toujours utiliser le composant `<Grid>`** pour les grilles à colonnes égales ou asymétriques
- Le composant gère automatiquement les breakpoints responsives (collapse en 1 colonne sur mobile)

```astro
<Grid cols="3" gap="xl">...</Grid>
```

## Colonnes disponibles

| `cols` | Mobile | `md:` (768px) | `lg:` (1024px) |
|--------|--------|---------------|----------------|
| `1` | 1col | 1col | 1col |
| `2` | 1col | 2col | 2col |
| `3` | 1col | 2col | 3col |
| `4` | 1col | 2col | 4col |
| `1-2` | 1col | 1fr 2fr | 1fr 2fr |
| `2-1` | 1col | 2fr 1fr | 2fr 1fr |
| `1-3` | 1col | 1fr 3fr | 1fr 3fr |
| `3-1` | 1col | 3fr 1fr | 3fr 1fr |

## Grilles projet-spécifiques

Pour des proportions non couvertes par `<Grid>` (ex: `2fr 1fr 1fr 1fr`), utiliser directement les classes Tailwind responsive :

```astro
<div class="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-xl">...</div>
```

## Breakpoints Tailwind

| Préfixe | Largeur min |
|---------|-------------|
| `md:` | 768px |
| `lg:` | 1024px |

## Interdictions

- **Jamais de scroll horizontal** sur aucune page, à aucun breakpoint — c'est un bug critique
- **Tester à 375px** de largeur — vérifier qu'aucun contenu ne dépasse le viewport
