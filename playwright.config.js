import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  retries: 1,
  use: {
    headless: true, // Set to false if you want to see the browser
    viewport: { width: 1280, height: 720 },
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "Chromium", use: { browserName: "chromium" } },
    // { name: "Firefox", use: { browserName: "firefox" } },
    // { name: "WebKit", use: { browserName: "webkit" } },
  ],
});
