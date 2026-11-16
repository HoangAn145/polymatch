# POLYMATCH

React/Vite frontend, Supabase Auth/Postgres/RLS, and Vercel Functions for Diagnostic and CSKH.

The original Buyer, Seller and Admin pages, routes, registration forms and navigation remain in place. New Diagnostic, CSKH, Roadmap/ROI and KPI features extend those pages. `/workspace` is only an email-callback alias that redirects to the authenticated role dashboard. Demo mode is explicitly enabled with `VITE_DEMO_MODE=true`; cloud sign-in uses Supabase profiles and RLS.

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
npm run test:browser:demo
npm run build
```

Browser tests use `/usr/bin/chromium` by default; set `CHROMIUM_PATH` on other systems.

See [implementation status and limitations](docs/IMPLEMENTATION_STATUS.md) before deployment. Supabase migrations must be applied and environment variables configured before production sign-in and server calls can function.
