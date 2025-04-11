import { defineConfig } from "@playwright/test";

export default defineConfig({
  retries: 3, // Кол-во попыток теста
  testDir: "./tests",
  fullyParallel: false,
  reporter: "html",
  workers: 1,
  use: {
    storageState: "auth/telegram.json",
    baseURL: "",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
});
