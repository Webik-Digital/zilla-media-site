# Deploying

There are two Base44 apps. They are separate hosted sites; deploying to one has
no effect on the other.

| | App id | URL |
|---|---|---|
| **Production** | `6a7ce728a921c6d7121626c7` | **zillamedia.co** (custom domain) and `zilla-media-121626c7.base44.app` |
| **Staging** | `6a8f07cd5aadc307c9854738` | `zilla-media-staging-…base44.app` |

```bash
npm run deploy:staging
```

```bash
npm run deploy:prod
```

Both build first, then deploy that exact build — no rebuild inside the deploy
step, so what you reviewed is what ships.

## Why the app id is pinned in both scripts

Base44 has no environment or preview-deploy concept. `base44 site deploy` pushes
to whichever single app the project is linked to via `base44/.app.jsonc`, and
the only way to override it is `--app-id`. Both scripts name their target
explicitly so neither depends on what happens to be linked.

The local project is linked to **staging**, deliberately. If anyone runs a bare
`base44 site deploy` with no flags, it lands on staging rather than the live
site — the harmless failure.

## The trap this replaces

`zillamedia.co` is a custom domain attached to the production app, not a
separate host. Before staging existed, the `.base44.app` URL and `zillamedia.co`
served byte-identical files — one deployment, two addresses — so every deploy
went straight to the public site. If you ever need to confirm which build a URL
is serving:

```bash
curl -s https://zillamedia.co/ | grep -o 'assets/index-[A-Za-z0-9_-]*\.js'
```

Compare that hash between the two URLs. Different hashes means the environments
are genuinely separate; identical means you are looking at the same deployment
twice.

## Promoting

Staging and production build from the same source tree, so promoting is just
running `deploy:prod` on the commit you already reviewed on staging. There is no
artifact copy step and nothing to keep in sync.

Visibility is per-app: staging can stay workspace-only so only the team sees it,
while production is public.
