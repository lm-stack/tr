# OAuth — Sveltia CMS

**Setup guidé : `/project:configure-cms-oauth`**

## Infra partagée lm-stack

- **Worker OAuth** : `https://sveltia-cms-auth.hello-cb2.workers.dev`
- **GitHub OAuth App** : `Sveltia CMS` (une seule pour tous les projets)
- **Variables Cloudflare** : `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `ALLOWED_DOMAINS`

## Config CMS

```yaml
# public/admin/config.yml
backend:
  name: github
  repo: org/repo
  branch: main
  base_url: https://sveltia-cms-auth.hello-cb2.workers.dev
```

## Ajouter un nouveau projet

1. Ajouter le domaine dans `ALLOWED_DOMAINS` sur le Worker Cloudflare
2. Configurer `repo` et `base_url` dans `admin/config.yml`
3. Ajouter les collaborateurs (accès write) sur le repo GitHub

## Mode local (développement)

```bash
npx @sveltia/cms-proxy
```
Accéder à `/admin/` — le CMS se connecte au proxy local.
