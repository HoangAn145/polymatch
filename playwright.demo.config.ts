import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser-demo",
  timeout: 60000,
  use: {
    baseURL: "http://127.0.0.1:4175",
    headless: true,
    launchOptions: {
      executablePath:
        process.env.CHROMIUM_PATH ||
        (process.env.CI ? undefined : "/usr/bin/chromium"),
      args: ["--no-sandbox"],
    },
  },
  webServer: {
    command: "npm run dev -- --port 4175",
    url: "http://127.0.0.1:4175",
    env: {
      VITE_DEMO_MODE: "true",
      VITE_SUPABASE_URL: "",
      VITE_SUPABASE_ANON_KEY: "",
    },
  },
});
