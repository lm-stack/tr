---
name: configure-cms-oauth
description: Use when setting up OAuth authentication for Sveltia CMS — guides through CMS config, Cloudflare Worker domain, collaborator access, and admin widget customization.
---

# Configurer OAuth pour le CMS

Guide pas à pas pour activer l'accès CMS multi-utilisateurs via OAuth GitHub. Coordonne le CMS, le Cloudflare Worker et les accès GitHub.

---

## Pré-requis

Vérifier avant de commencer :
- Le site est déployé (GitHub Pages actif)
- Le domaine est connu (final ou temporaire `*.lausanne.marketing`)
- L'utilisateur a accès au [dashboard Cloudflare](https://dash.cloudflare.com/)

**Infra partagée lm-stack :**
- Worker OAuth : `https://sveltia-cms-auth.hello-cb2.workers.dev`
- GitHub OAuth App : `Sveltia CMS` (une seule pour tous les projets)
- Variables Cloudflare : `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `ALLOWED_DOMAINS`

---

## 1. Collecter les informations

**Demander :**
- Domaine du site (ex : `chateauvaumarcus.ch` ou `projet.lausanne.marketing`)
- Organisation/repo GitHub (ex : `lm-stack/nouveau-repo`)
- Utilisateurs GitHub qui doivent accéder au CMS

## 2. Configurer le CMS

**Modifier `public/admin/config.yml`** — section `backend` :

```yaml
backend:
  name: github
  repo: organisation/nouveau-repo
  branch: main
  base_url: https://sveltia-cms-auth.hello-cb2.workers.dev
```

S'assurer que `base_url` est décommenté.

## 3. Ajouter le domaine au Cloudflare Worker

**Instruction pour l'utilisateur** (action manuelle sur le dashboard) :

1. Aller sur [Cloudflare Workers](https://dash.cloudflare.com/) > Workers & Pages
2. Ouvrir le Worker `sveltia-cms-auth`
3. Settings > Variables and Secrets
4. Modifier `ALLOWED_DOMAINS` : ajouter le nouveau domaine séparé par une virgule
   - Ex : `vaumarcus.lausanne.marketing,nouveau-domaine.ch`
5. Save and Deploy

**Si le site utilise un domaine temporaire `*.lausanne.marketing` avant le domaine final :** ajouter les deux domaines.

## 4. Ajouter les collaborateurs GitHub

Pour chaque utilisateur CMS, l'ajouter comme collaborateur avec accès **write** :

Via le dashboard :
- Repo > Settings > Collaborators > Add people

Via CLI :
```bash
gh api repos/{org}/{repo}/collaborators/{username} -X PUT -f permission=push
```

## 5. Personnaliser le widget "Besoin d'aide ?"

**Modifier `public/admin/index.html`** — le bouton flottant `?` en bas à droite :

| Élément | Valeur par défaut | À remplacer par |
|---------|-------------------|----------------|
| Logo | Favicon Lausanne Marketing (base64) | Favicon du projet |
| Nom | Lausanne Marketing | Nom du client |
| Email | hello@lausanne.marketing | Email de support |
| URL | lausanne.marketing | URL du site/support |

## 6. Vérifier

Checklist de validation :

- [ ] Accéder à `https://domaine.ch/admin/`
- [ ] "Login with GitHub" → redirection OAuth → retour au CMS connecté
- [ ] Collections visibles et éditables
- [ ] Test : modifier un champ, sauvegarder → commit visible sur GitHub
- [ ] Chaque collaborateur peut se connecter

## Dépannage

| Problème | Cause probable | Solution |
|----------|---------------|----------|
| "Not allowed" à la connexion | Domaine absent de `ALLOWED_DOMAINS` | L'ajouter sur le Worker Cloudflare |
| Erreur 404 sur le callback | `base_url` incorrect | Vérifier l'URL du Worker dans `config.yml` |
| "Permission denied" | Utilisateur pas collaborateur | L'ajouter avec accès write sur le repo |
| Login OK mais collections vides | `repo` incorrect | Vérifier `org/repo` dans `config.yml` |
| Redirect loop | Domaine final pas encore actif | Utiliser le domaine temporaire d'abord |
