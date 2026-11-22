import { defineConfig } from "@playwright/test";
export default defineConfig({
  timeout: 60000,
  testDir: "./tests/browser-configured",
  use: {
    baseURL: "http://127.0.0.1:4174",
    headless: true,
    launchOptions: {
      executablePath:
        process.env.CHROMIUM_PATH ||
        (process.env.CI ? undefined : "/usr/bin/chromium"),
      args: ["--no-sandbox"],
    },
  },
  webServer: {
    command: "npm run dev -- --port 4174",
    url: "http://127.0.0.1:4174",
    env: {
      VITE_SUPABASE_URL: "https://unit.supabase.co",
      VITE_SUPABASE_ANON_KEY: "test-public-key",
      VITE_DEMO_MODE: "false",
    },
  },
});
