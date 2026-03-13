# Règles CMS (Sveltia CMS)

## Champs icône Phosphor

Chaque champ `icon` dans `admin/config.yml` doit porter un `hint` pointant vers le site Phosphor Icons :

```yaml
{ label: Icône, name: icon, widget: string, hint: "phosphoricons.com → copier le nom (ex : ph-house)" }
```

Cela s'applique à tous les champs icône, quel que soit leur label :
- `Icône`
- `Logo (icône Phosphor)`
- `Icône Phosphor`

**Règle : à chaque ajout d'un champ icône dans une collection CMS, toujours ajouter le `hint` Phosphor.**

## Ordre des collections

La collection **Paramètres** (`settings`) doit toujours être la **dernière** dans `admin/config.yml`. Lors de l'ajout d'une nouvelle collection, l'insérer avant Paramètres.

**Règle : ne jamais déplacer Paramètres — il reste toujours en dernier dans la sidebar CMS.**

## Icônes Material Symbols (collections)

Chaque collection et chaque page dans `admin/config.yml` doit avoir une propriété `icon` avec un nom d'icône [Material Symbols](https://fonts.google.com/icons) (onglet Android pour copier le nom).

**Règle : à chaque ajout d'une page ou d'une collection, toujours ajouter une `icon` correspondante.**

Icônes courantes :

| Contexte | Icône |
|----------|-------|
| Accueil | `home` |
| À propos / Info | `info` |
| Contact / Email | `mail` |
| Recherche | `search` |
| Paramètres | `settings` |
| Blog / Articles | `article` |
| Événements | `celebration` |
| Hébergement | `hotel` |
| Appartements | `apartment` |
| Business | `business_center` |
| Galerie | `photo_library` |
| Équipe | `group` |
| Pages (collection) | `description` |

## Widget "Besoin d'aide ?"

Bouton flottant `?` en bas à droite de l'admin (`admin/index.html`), affiche un popup avec les informations de contact Lausanne Marketing.

- **Couleur** : jaune LM `#FFD838` (hover : `#FEE487`)
- **Logo** : favicon Lausanne Marketing en base64
- **Texte** : `#191919` (contraste sur fond jaune)

À personnaliser pour chaque projet :
- **Logo** : remplacer l'image base64 par le favicon du projet
- **Nom** : remplacer "Lausanne Marketing"
- **Email** : remplacer `hello@lausanne.marketing`
- **URL** : remplacer `lausanne.marketing`
- **Couleur** : modifier `--help-color` dans le `<style>` (blueprint uniquement)

## Crédit footer Lausanne Marketing

Le footer doit toujours contenir la mention :

```
Fait avec passion par Lausanne Marketing
```

- Le texte "Lausanne Marketing" est un lien vers `https://lausanne.marketing` (`target="_blank" rel="noopener"`)
- Placé sous le copyright, centré, discret (petite taille, opacité réduite)
- Classe CSS : `.footer-credit` (vaumarcus) / classe Tailwind inline (blueprint)

**Règle : ne jamais supprimer cette mention. Elle doit être présente sur tous les projets basés sur le blueprint.**
