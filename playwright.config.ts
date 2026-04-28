import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const isDemoMode = process.env.PLAYWRIGHT_DEMO === "1";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI 
    ? [['github'], ['list']] 
    : [['html'], ['list']],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
    launchOptions: {
      slowMo: isDemoMode ? 500 : 0,
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run build && npm run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    env: {
      ...process.env,
      NEXTAUTH_URL: "http://127.0.0.1:3000",
      // Required for next.config.ts rewrites() to produce a valid URL during build.
      // Tests mock all /api/* calls via Playwright's page.route(), so the real backend
      // URL is irrelevant — but it must be defined or `next build` fails with
      // "Invalid rewrite found".
      NEXT_PUBLIC_BACKEND_URL:
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "test-secret-for-e2e",
    },
    timeout: 300 * 1000,
  },
});