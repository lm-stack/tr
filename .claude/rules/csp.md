# Content Security Policy (CSP) — Regles

## Architecture

Les headers CSP sont definis dans `public/_headers` (format Cloudflare Pages).

### Probleme du double CSP (CRITIQUE)

Quand deux headers `Content-Security-Policy` s'appliquent a la meme page, le navigateur applique les **deux**. Le plus restrictif gagne. Cela signifie qu'un CSP global (`/*`) et un CSP specifique (`/admin/*`) ne se **remplacent** pas — ils s'**empilent**.

**Solution** : utiliser `! Content-Security-Policy` pour supprimer le header global avant de le redefinir sur un path specifique.

```
/*
  Content-Security-Policy: ...politique globale...

/admin/*
  ! Content-Security-Policy
  Content-Security-Policy: ...politique admin...
```

Le `!` prefix supprime le header herite du path parent. Sans lui, `/admin/` recoit les deux CSP et le script Sveltia CMS (unpkg.com) est bloque par le CSP global.

## CSP global (`/*`)

Politique restrictive pour le site public :

```
script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' data: https://challenges.cloudflare.com [analytics si besoin]
style-src 'self' 'unsafe-inline'
img-src 'self' data: [analytics si besoin]
font-src 'self'
connect-src 'self' https: [analytics si besoin]
frame-src https://challenges.cloudflare.com [analytics si besoin]
frame-ancestors 'none'
```

### Sources a ajouter selon les services utilises

| Service | script-src | img-src | connect-src | frame-src |
|---------|-----------|---------|-------------|-----------|
| Cloudflare Turnstile | `https://challenges.cloudflare.com` | — | `https://challenges.cloudflare.com` | `https://challenges.cloudflare.com` |
| Google Analytics 4 | `https://www.googletagmanager.com https://www.google-analytics.com` | `https://www.googletagmanager.com https://www.google-analytics.com` | `https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com` | `https://www.googletagmanager.com` |
| Google Ads | `https://googleads.g.doubleclick.net https://www.googleadservices.com` | `https://googleads.g.doubleclick.net https://www.googleadservices.com https://www.google.com https://www.google.ch` | `https://googleads.g.doubleclick.net` | — |

## CSP admin (`/admin/*`)

Politique permissive pour Sveltia CMS :

```
/admin/*
  ! Content-Security-Policy
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://raw.githubusercontent.com; font-src 'self' data:; connect-src 'self' https://api.github.com https://sveltia-cms-auth.hello-cb2.workers.dev https://raw.githubusercontent.com; frame-ancestors 'none'
```

### Pourquoi ces sources

| Source | Raison |
|--------|--------|
| `https://unpkg.com` (script-src) | CDN Sveltia CMS |
| `'unsafe-eval'` (script-src) | Requis par Sveltia CMS |
| `blob:` (img-src) | Preview d'images dans l'editeur |
| `https://raw.githubusercontent.com` (img-src, connect-src) | Chargement des fichiers du repo |
| `https://api.github.com` (connect-src) | API GitHub pour lire/ecrire le contenu |
| `https://sveltia-cms-auth.hello-cb2.workers.dev` (connect-src) | Worker OAuth lm-stack |

## Regles

1. **Toujours `! Content-Security-Policy` avant le CSP `/admin/*`** — sinon le CSP global bloque unpkg.com
2. **Ne jamais ajouter `https://unpkg.com` au CSP global** — le CDN ne doit etre autorise que sur `/admin/`
3. **Tester le CSP apres chaque modification** : `curl -sI https://example.com/admin/ | grep -i content-security`
4. **Un seul header CSP par page** — verifier qu'il n'y a pas de doublon (meta tag + _headers)
5. **Adapter les sources analytics** au projet — ne pas copier les sources Google si le projet n'utilise pas GA

## Debugging

Si l'admin affiche un ecran noir :

1. Ouvrir la console du navigateur (F12 > Console)
2. Chercher les erreurs `Refused to load the script` ou `Blocked by Content-Security-Policy`
3. Verifier les headers : `curl -sI https://example.com/admin/ | grep -i content-security`
4. S'assurer qu'il n'y a qu'**un seul** header CSP (pas de doublon global + specifique)
5. Verifier que `! Content-Security-Policy` est present avant le CSP `/admin/*` dans `_headers`
