import { test } from "@playwright/test";
import { BotPage } from "../pages/BotPage";
import * as dotenv from "dotenv";
import { fillForm } from "../scripts/form";

dotenv.config();

// Constants
const MENU_BUTTONS = [
  "Мои витрины",
  "Как это работает",
  "Создать витрину",
  "Служба поддержки",
  "Подписка",
  "Ссылка для друзей",
];
const DEFAULT_MENU_BUTTON_SELECTOR = ".btn-icon.toggle-reply-markup.float.show";
const DEFAULT_BOT_URL = "https://web.telegram.org/k/#@Craftistrybot";

test.describe("Бот", () => {
  test("Проверяем, запущен ли бот", async ({ page }) => {
    const botPage = new BotPage(page);
    await botPage.goto(DEFAULT_BOT_URL);
    await botPage.maybeStartBot();
    await botPage.screenshot("Старт"); // Скриншот страницы
  });

  test("Тест кейс: Проверка всех кнопок меню", async ({ page }) => {
    const botPage = new BotPage(page);
    await botPage.goto(DEFAULT_BOT_URL);
    for (const buttonText of MENU_BUTTONS) {
      await botPage.clickMenu(DEFAULT_MENU_BUTTON_SELECTOR);
      await botPage.clickButtonByText(buttonText);
      await page.waitForTimeout(1000); // Ждем 1 секунду для загрузки контента
      await botPage.screenshot(buttonText); // Делаем скриншот с названием кнопки
    }
  });

  test("Тест кейс: Проверка редактирования в 'Мои витрины'", async ({
    page,
  }) => {
    const botPage = new BotPage(page);
    await botPage.goto(DEFAULT_BOT_URL);
    await botPage.openEditor();
    await page.waitForTimeout(5000);
    let frame = await botPage.getFrame();
    await page.waitForTimeout(5000);
    if (!frame) throw new Error("Frame not found");
    await botPage.clickButtonInFrame('button[aria-label="Edit block"]');
    await page.waitForTimeout(5000);
    frame = await botPage.getFrame();
    await page.waitForTimeout(3000);
    if (!frame) throw new Error("Frame not found");
    await fillForm(frame);
  });
});
