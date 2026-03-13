import { getEntry } from 'astro:content';

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
  localBusiness?: {
    type?: string;
    address?: {
      street?: string;
      locality: string;
      postalCode: string;
      country: string;
    };
    geo?: {
      lat: number;
      lng: number;
    };
  };
  nav: Array<{
    url: string;
    label: string;
    icon?: string;
    children?: Array<{
      url: string;
      label: string;
    }>;
  }>;
  email: string;
  phone?: string;
  address?: string;
  social?: Array<{
    label: string;
    url: string;
    icon: string;
  }>;
}

/** Convert icon from CMS format (ph-house) to astro-icon format (ph:house). */
export function toIconName(name: string): string {
  return name.startsWith('ph-') ? `ph:${name.slice(3)}` : name;
}

// --- Page data types ---

export interface SeoData {
  title: string;
  description: string;
  ogImage?: string;
}

export interface HomePageData {
  seo: SeoData;
  hero: { title: string; subtitle?: string };
  content: { title: string; cards: Array<{ icon: string; title: string; text: string }> };
  footer: { description: string };
}

export interface ContactPageData {
  seo: SeoData;
  hero: { title: string };
  form: { title: string; icon: string };
  info: Array<{ icon: string; title: string; text: string }>;
}

export interface AProposPageData {
  seo: SeoData;
  hero: { title: string };
  story: { title: string; icon: string; paragraphs: string[] };
  sidebar: { title: string; icon: string; text: string };
}

export interface RecherchePageData {
  seo: SeoData;
  title: string;
  subtitle: string;
}

// --- Section types ---

type BackgroundOption = 'light' | 'primary' | 'dark';

export interface TextSectionData {
  type: 'text';
  title?: string;
  paragraphs: string[];
  background?: BackgroundOption;
}

export interface CardsSectionData {
  type: 'cards';
  title?: string;
  cols?: '2' | '3' | '4';
  items: Array<{ icon?: string; title: string; text: string }>;
  background?: BackgroundOption;
}

export interface CtaSectionData {
  type: 'cta';
  title: string;
  text?: string;
  buttonLabel: string;
  buttonUrl: string;
  buttonVariant?: 'primary' | 'secondary' | 'outline' | 'outline-white' | 'dark';
  background?: BackgroundOption;
}

export interface FaqSectionData {
  type: 'faq';
  title?: string;
  items: Array<{ question: string; answer: string }>;
  background?: BackgroundOption;
}

export interface StatsSectionData {
  type: 'stats';
  items: Array<{ value: string; label: string }>;
  background?: BackgroundOption;
}

export type Section = TextSectionData | CardsSectionData | CtaSectionData | FaqSectionData | StatsSectionData;

// --- Custom page data ---

export interface CustomPageData {
  seo: SeoData;
  hero?: { title: string; subtitle?: string };
  breadcrumb: string;
  sections: Section[];
}

export async function getSiteData(): Promise<SiteData> {
  const siteEntry = await getEntry('settings', 'site');
  const coordonneesEntry = await getEntry('settings', 'coordonnees');
  const socialEntry = await getEntry('settings', 'social');

  return {
    ...siteEntry!.data,
    ...coordonneesEntry!.data,
    ...socialEntry!.data,
  } as SiteData;
}
