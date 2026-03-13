# Composants réutilisables

Snippets prêts à copier-coller dans les pages `.astro`. Tous utilisent les composants du projet et les classes Tailwind.

## Témoignages (grille de 3)

```astro
---
import Section from '../components/Section.astro';
import Grid from '../components/Grid.astro';
import Card from '../components/Card.astro';
---

<Section class="bg-bg">
  <h2 class="text-center mb-xl">Ce que disent nos clients</h2>
  <Grid cols="3" gap="xl">
    {data.testimonials.map((item: any) => (
      <Card>
        <p class="italic mb-m">"{item.quote}"</p>
        <p class="font-bold">{item.name}</p>
        <p class="text-text-s text-text">{item.role}</p>
      </Card>
    ))}
  </Grid>
</Section>
```

Données YAML :
```yaml
testimonials:
  - quote: "Texte du témoignage"
    name: "Prénom Nom"
    role: "Poste, Entreprise"
```

## FAQ (accordéon)

```astro
---
import Section from '../components/Section.astro';
import { Icon } from 'astro-icon/components';
---

<Section>
  <div class="max-w-[800px] mx-auto">
    <h2 class="text-center mb-xl">Questions fréquentes</h2>
    {data.faq.map((item: any) => (
      <details class="bg-white rounded p-m shadow-card mb-s">
        <summary class="font-bold cursor-pointer">
          <Icon name="ph:caret-right" class="inline w-4 h-4" aria-hidden="true" /> {item.question}
        </summary>
        <p class="text-text mt-s">{item.answer}</p>
      </details>
    ))}
  </div>
</Section>
```

Données YAML :
```yaml
faq:
  - question: "Question ici ?"
    answer: "Réponse ici."
```

## Galerie d'images

```astro
---
import Section from '../components/Section.astro';
import Grid from '../components/Grid.astro';
import { Image } from 'astro:assets';
---

<Section>
  <h2 class="text-center mb-xl">Galerie</h2>
  <Grid cols="3" gap="m">
    {data.gallery.map((item: any) => (
      <div class="rounded-m overflow-hidden">
        <Image src={item.src} alt={item.alt} width={400} height={300} class="w-full h-auto" />
      </div>
    ))}
  </Grid>
</Section>
```

Données YAML :
```yaml
gallery:
  - src: "/images/photo1.jpg"
    alt: "Description de l'image"
```

## Pricing / Tarifs (grille de 3)

```astro
---
import Section from '../components/Section.astro';
import Grid from '../components/Grid.astro';
import Button from '../components/Button.astro';
import { Icon } from 'astro-icon/components';
---

<Section class="bg-bg">
  <h2 class="text-center mb-xl">Nos offres</h2>
  <Grid cols="3" gap="xl">
    {data.pricing.map((plan: any) => (
      <div class={`bg-white rounded p-l shadow-card text-center ${plan.featured ? 'bg-primary text-white' : ''}`}>
        <h3 class="mb-xs">{plan.name}</h3>
        <p class="text-h2 font-bold mb-m">{plan.price}</p>
        <ul class="mb-l">
          {plan.features.map((feature: string) => (
            <li class="mb-xs">
              <Icon name="ph:check" class="inline w-4 h-4" aria-hidden="true" /> {feature}
            </li>
          ))}
        </ul>
        <Button href={plan.url} variant={plan.featured ? 'secondary' : 'outline'}>
          {plan.cta}
        </Button>
      </div>
    ))}
  </Grid>
</Section>
```

Données YAML :
```yaml
pricing:
  - name: "Basic"
    price: "CHF 29/mois"
    features:
      - "Feature 1"
      - "Feature 2"
    url: "/contact/"
    cta: "Choisir"
    featured: false
  - name: "Pro"
    price: "CHF 59/mois"
    features:
      - "Tout Basic +"
      - "Feature 3"
    url: "/contact/"
    cta: "Choisir"
    featured: true
```

## CTA (Call to Action)

```astro
---
import Section from '../components/Section.astro';
import Button from '../components/Button.astro';
---

<Section class="bg-primary">
  <div class="text-center">
    <h2 class="text-white mb-s">{data.cta.title}</h2>
    <p class="text-white mb-l opacity-80">{data.cta.text}</p>
    <Button href="/contact/" variant="secondary" icon="arrow-right">
      {data.cta.button}
    </Button>
  </div>
</Section>
```

## Équipe (grille de 4)

```astro
---
import Section from '../components/Section.astro';
import Grid from '../components/Grid.astro';
import { Image } from 'astro:assets';
---

<Section>
  <h2 class="text-center mb-xl">Notre équipe</h2>
  <Grid cols="4" gap="xl">
    {data.team.map((member: any) => (
      <div class="text-center">
        <div class="rounded-full overflow-hidden aspect-square w-40 mx-auto mb-m">
          <Image src={member.photo} alt={member.name} width={160} height={160} class="w-full h-full object-cover" />
        </div>
        <h4 class="mb-2xs">{member.name}</h4>
        <p class="text-text-s text-text">{member.role}</p>
      </div>
    ))}
  </Grid>
</Section>
```

## Chiffres clés (grille de 4)

```astro
---
import Section from '../components/Section.astro';
import Grid from '../components/Grid.astro';
---

<Section class="bg-bg">
  <Grid cols="4" gap="xl">
    {data.stats.map((stat: any) => (
      <div class="text-center">
        <p class="text-h1 font-bold text-primary">{stat.value}</p>
        <p class="text-text-s text-text">{stat.label}</p>
      </div>
    ))}
  </Grid>
</Section>
```

Données YAML :
```yaml
stats:
  - value: "150+"
    label: "Clients satisfaits"
  - value: "10 ans"
    label: "D'expérience"
```

## Hero simple

Le composant `<Hero>` du blueprint est une bannière minimaliste (titre + sous-titre sur fond primary). Pour un hero plus élaboré avec image de fond et CTA :

```astro
---
import Button from '../components/Button.astro';
---

<section class="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
  <div class="absolute inset-0 bg-cover bg-center" style={`background-image:url('${data.hero.image}')`}></div>
  <div class="absolute inset-0 bg-black/50"></div>
  <div class="relative text-center text-white px-m max-w-container mx-auto">
    {data.hero.tagline && <p class="text-text-l uppercase tracking-wider mb-s opacity-80">{data.hero.tagline}</p>}
    <h1 class="text-white mb-s">{data.hero.title}</h1>
    {data.hero.description && <p class="text-text-xl mb-l opacity-90 max-w-[600px] mx-auto">{data.hero.description}</p>}
    {data.hero.buttons && (
      <div class="flex gap-m justify-center flex-wrap">
        {data.hero.buttons.map((btn: any) => (
          <Button href={btn.url} variant={btn.variant || 'primary'}>{btn.label}</Button>
        ))}
      </div>
    )}
  </div>
</section>
```

Données YAML :
```yaml
hero:
  tagline: "Sous-titre"
  title: "Titre principal"
  description: "Description du hero"
  image: "/images/hero.jpg"
  buttons:
    - label: "Découvrir"
      url: "/a-propos/"
      variant: "primary"
```

## Voucher / Bon cadeau

```astro
---
import Section from '../components/Section.astro';
import Grid from '../components/Grid.astro';
import Button from '../components/Button.astro';
---

<Section class="bg-black">
  <Grid cols="2" gap="xl">
    <div>
      <h2 class="text-white mb-m">{data.voucher.title}</h2>
      <p class="text-white opacity-80">{data.voucher.description}</p>
    </div>
    <div class="bg-white/10 rounded-m p-l text-center">
      <p class="text-white/70 text-text-s uppercase tracking-wider mb-xs">{data.voucher.label}</p>
      <p class="text-white text-h2 font-bold mb-m">{data.voucher.price}</p>
      <Button href={data.voucher.url} variant="outline-white">{data.voucher.cta}</Button>
    </div>
  </Grid>
</Section>
```

## Services grid (icônes)

```astro
---
import Section from '../components/Section.astro';
import Grid from '../components/Grid.astro';
import { Icon } from 'astro-icon/components';
import { toIconName } from '../lib/data';
---

<Section>
  <Grid cols="3" gap="xl">
    {data.services.map((service: any) => (
      <div class="text-center">
        <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-m">
          <Icon name={toIconName(service.icon)} class="w-8 h-8 text-primary" aria-hidden="true" />
        </div>
        <h4 class="mb-xs">{service.title}</h4>
        <p class="text-text text-text-s">{service.description}</p>
      </div>
    ))}
  </Grid>
</Section>
```

## Search page (Pagefind)

```astro
---
import Base from '../layouts/Base.astro';
import Section from '../components/Section.astro';
import { getEntry } from 'astro:content';

const page = await getEntry('pages', 'recherche');
const data = page!.data as any;
---

<Base
  seo={{ title: data.title, description: data.subtitle }}
  breadcrumb={data.title}
  noindex
>
  <div data-pagefind-ignore="all">
    <Section>
      <div class="search__inner max-w-[800px] mx-auto">
        <h1 class="mb-s">{data.title}</h1>
        <p class="text-text mb-l">{data.subtitle}</p>
        <div id="search"></div>
      </div>
    </Section>

    <link href="/pagefind/pagefind-ui.css" rel="stylesheet">
    <script is:inline src="/pagefind/pagefind-ui.js"></script>
    <script is:inline>
      window.addEventListener('DOMContentLoaded', function() {
        new PagefindUI({
          element: "#search",
          showSubResults: true,
          showImages: false,
          translations: {
            placeholder: "Rechercher...",
            zero_results: "Aucun résultat pour « [SEARCH_TERM] »",
            many_results: "[COUNT] résultats",
            one_result: "1 résultat",
            searching: "Recherche en cours..."
          }
        });
      });
    </script>
  </div>
</Base>
```

## FormField (champ de formulaire)

```astro
---
import FormField from '../components/FormField.astro';
---

<FormField
  type="text"
  name="firstname"
  label="Prénom"
  required
  icon="user"
  placeholder="Alain"
  maxlength={100}
  autocomplete="given-name"
/>
<FormField
  type="email"
  name="email"
  label="Email"
  required
  icon="at"
  maxlength={254}
  autocomplete="email"
/>
<FormField
  type="textarea"
  name="message"
  label="Message"
  required
  icon="chat-text"
  placeholder="Décrivez votre projet..."
  maxlength={5000}
  rows={6}
/>
```

- Le composant gère le label, l'icône, l'indicateur obligatoire (`*`), le champ et le message d'erreur
- Le `id` du champ = `name`, le `id` de l'erreur = `${name}-error` (compatible avec `validateField()` dans `main.ts`)
- Icône Phosphor sans préfixe : `"user"` (pas `"ph:user"` ni `"ph-user"`)

## FAQ standalone (avec JSON-LD)

```astro
---
import Faq from '../components/Faq.astro';
---

<Faq
  title="Questions fréquentes"
  items={data.faq}
  background="light"
/>
```

Données YAML :
```yaml
faq:
  - question: "Question ici ?"
    answer: "Réponse ici."
```

- Génère automatiquement un schema JSON-LD `FAQPage` (rich results Google)
- Utilisable directement dans les pages `.astro` (contrairement à `FaqSection` réservé au section builder)
- Mêmes props `background` que les autres sections (`light`, `primary`, `dark`)

## Règles

- Toujours utiliser les composants Astro existants (`Section`, `Grid`, `Card`, `Button`, `Hero`, `FormField`, `Faq`) au lieu de recréer des structures ad hoc
- Toujours utiliser les classes Tailwind et les tokens définis dans `tailwind.config.mjs`
- Utiliser `<Icon name="ph:xxx" />` via astro-icon pour les icônes (jamais `<i class="ph ...">`)
- Convertir les noms d'icônes CMS avec `toIconName()` : `ph-house` → `ph:house`
- Les données doivent venir des fichiers YAML/JSON dans `src/content/` (pas hardcodées)
- Pour ajouter un nouveau composant avec des données CMS, mettre à jour `public/admin/config.yml`
