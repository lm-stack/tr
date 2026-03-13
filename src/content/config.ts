import { defineCollection, z } from 'astro:content';

// --- Settings schemas ---

const navChildSchema = z.object({
  url: z.string(),
  label: z.string(),
});

const navItemSchema = z.object({
  url: z.string(),
  label: z.string(),
  icon: z.string().optional(),
  children: z.array(navChildSchema).optional(),
});

const siteSchema = z.object({
  url: z.string(),
  name: z.string(),
  lang: z.string(),
  description: z.string(),
  ogImage: z.string(),
  logoText: z.string(),
  logoIcon: z.string(),
  copyright: z.string(),
  webhookUrl: z.string(),
  webhookToken: z.string().default(''),
  turnstileSiteKey: z.string(),
  searchUrl: z.string().optional(),
  fontsPreload: z.array(z.string()).optional(),
  localBusiness: z.object({
    type: z.string().optional(),
    address: z.object({
      street: z.string().optional(),
      locality: z.string(),
      postalCode: z.string(),
      country: z.string(),
    }).optional(),
    geo: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }).optional(),
  nav: z.array(navItemSchema),
});

const coordonneesSchema = z.object({
  email: z.string(),
  phone: z.string().default(''),
  address: z.string().default(''),
});

const socialSchema = z.object({
  social: z.array(z.object({
    label: z.string(),
    url: z.string(),
    icon: z.string(),
  })),
});

const settingsCollection = defineCollection({
  type: 'data',
  schema: z.union([siteSchema, coordonneesSchema, socialSchema]),
});

const pagesCollection = defineCollection({
  type: 'data',
});

// --- Custom pages schemas ---

const seoSchema = z.object({
  title: z.string(),
  description: z.string(),
  ogImage: z.string().optional(),
});

const backgroundSchema = z.enum(['light', 'primary', 'dark']).optional();

const textSectionSchema = z.object({
  type: z.literal('text'),
  title: z.string().optional(),
  paragraphs: z.array(z.string()),
  background: backgroundSchema,
});

const cardsSectionSchema = z.object({
  type: z.literal('cards'),
  title: z.string().optional(),
  cols: z.enum(['2', '3', '4']).optional(),
  items: z.array(z.object({
    icon: z.string().optional(),
    title: z.string(),
    text: z.string(),
  })),
  background: backgroundSchema,
});

const ctaSectionSchema = z.object({
  type: z.literal('cta'),
  title: z.string(),
  text: z.string().optional(),
  buttonLabel: z.string(),
  buttonUrl: z.string(),
  buttonVariant: z.enum(['primary', 'secondary', 'outline', 'outline-white', 'dark']).optional(),
  background: backgroundSchema,
});

const faqSectionSchema = z.object({
  type: z.literal('faq'),
  title: z.string().optional(),
  items: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })),
  background: backgroundSchema,
});

const statsSectionSchema = z.object({
  type: z.literal('stats'),
  items: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })),
  background: backgroundSchema,
});

const sectionSchema = z.discriminatedUnion('type', [
  textSectionSchema,
  cardsSectionSchema,
  ctaSectionSchema,
  faqSectionSchema,
  statsSectionSchema,
]);

const customPagesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    seo: seoSchema,
    hero: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
    }).optional(),
    breadcrumb: z.string(),
    sections: z.array(sectionSchema),
  }),
});

export const collections = {
  pages: pagesCollection,
  settings: settingsCollection,
  'custom-pages': customPagesCollection,
};
