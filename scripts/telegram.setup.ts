// telegram.setup.ts
import { chromium } from "@playwright/test";

(async () => {
  const browser = await chromium.launch({ headless: false }); // headless: false = показать браузер
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://web.telegram.org/");

  console.log(
    "Войди вручную в Telegram (через QR или номер). После этого нажми Enter в терминале."
  );
  await new Promise((resolve) => process.stdin.once("data", resolve));

  // Сохраняем авторизованное состояние
  await context.storageState({ path: "auth/telegram.json" });
  console.log("✅ Состояние сохранено в auth/telegram.json");

  await browser.close();
})();
