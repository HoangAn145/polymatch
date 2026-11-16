# POLYMATCH

React/Vite frontend, Supabase Auth/Postgres/RLS, and Vercel Functions for Diagnostic and CSKH.

The production workspace is `/workspace`. Demo workspaces are available only when `VITE_DEMO_MODE=true`. Production never trusts demo users or browser role selection.

## Local development

Use Node 22.12+ (CI uses Node 24).

```sh
npm ci
cp .env.example .env.local
npm run dev
```

`vite` serves the frontend only. Use the Vercel development environment to exercise `/api/chat` and `/api/diagnostic`, with the variables documented in [deployment instructions](docs/DEPLOYMENT.md).

```sh
npm run lint
npm test
npm run test:browser
npm run test:browser:configured
npm run build
```

Browser tests use `/usr/bin/chromium` by default; set `CHROMIUM_PATH` on other systems.

See [implementation status and limitations](docs/IMPLEMENTATION_STATUS.md) before deployment. Supabase migrations must be applied and environment variables configured before production sign-in and server calls can function.
