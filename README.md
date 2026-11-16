<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/f2dfb3c2-e7a3-4a93-9821-5f5b247e38e0

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Connected platform (P0 + P1)

The default app now uses the connected Supabase portal. See [setup, verified status and limitations](docs/PLATFORM.md) and [chatbot data](data/chatbot/README.md). Use `VITE_APP_MODE=demo` only to inspect the original localStorage demo; it is not production authentication.
