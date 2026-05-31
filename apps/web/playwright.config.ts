import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "cd ../../apps/worker && pip install -q -r requirements.txt && uvicorn typstbox_worker.main:app --port 8080",
      url: "http://127.0.0.1:8080/health",
      reuseExistingServer: true,
      timeout: 120000,
    },
    {
      command: "pnpm dev",
      url: "http://127.0.0.1:3000",
      reuseExistingServer: true,
      env: { WORKER_URL: "http://127.0.0.1:8080" },
    },
  ],
});
