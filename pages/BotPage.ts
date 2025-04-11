import { expect, Locator, Page, Frame } from "@playwright/test";
import { BasePage } from "./BasePage";

const MENU_BUTTONS = [
  "Мои витрины",
  "Как это работает",
  "Создать витрину",
  "Служба поддержки",
  "Подписка",
  "Ссылка для друзей",
];

const DEFAULT_MENU_BUTTON_SELECTOR = ".btn-icon.toggle-reply-markup.float.show";

export class BotPage extends BasePage {
  constructor(protected page: Page) {
    super(page);
  }

  private async getVisibleButtonByText(name: string) {
    return this.page
      .getByRole("button", { name })
      .filter({ hasText: name })
      .first();
  }

  async openEditor() {
    await this.clickMenu(DEFAULT_MENU_BUTTON_SELECTOR);
    await this.clickButtonByText(MENU_BUTTONS[0]);
    await this.page.waitForTimeout(1000);
    await this.openMiniApp("Редактировать");
  }

  async expectQRCodeVisible() {
    await this.page.waitForFunction(
      () => !!document.querySelector("#qr-code")?.clientWidth
    );
  }

  async retryOperation(operation: () => Promise<void>, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        await operation();
        return;
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  async maybeStartBot() {
    try {
      // 1. Ждем появления кнопки с таймаутом
      const startButton = this.page.getByRole("button", {
        name: "СТАРТ",
        exact: true, // Точное соответствие текста
      });

      // 2. Дополнительная проверка для англоязычной версии
      const englishStartButton = this.page.getByRole("button", {
        name: "START",
        exact: true,
      });

      // 3. Объединяем локаторы и ждем хотя бы один из них
      const combinedLocator = startButton.or(englishStartButton);

      await combinedLocator.waitFor({
        state: "visible",
        timeout: 5000,
      });

      // 4. Кликаем только если действительно видим элемент
      if (await combinedLocator.isVisible()) {
        await combinedLocator.click();
        console.log("[SUCCESS] Бот успешно запущен");

        // 5. Дожидаемся скрытия кнопки после клика
        await combinedLocator.waitFor({
          state: "hidden",
          timeout: 5000,
        });
      }
    } catch (error) {
      console.log(
        '[INFO] Кнопка "СТАРТ" не найдена, предполагаем что бот уже запущен'
      );
      // Можно добавить дополнительную проверку состояния бота
    }
  }

  async clickMenu(selector: string) {
    await this.page.locator(selector).click();
  }

  async clickButtonByText(text: string) {
    const button = await this.getVisibleButtonByText(text);
    await button.click();
  }

  async openMiniApp(text: string): Promise<Frame> {
    const button = await this.getVisibleButtonByText(text);

    await button.click();

    const launchButton = this.page.getByRole("button", { name: "LAUNCH" });
    await expect(launchButton).toBeVisible();
    await launchButton.click();

    const iframeElement = await this.page.waitForSelector("iframe", {
      timeout: 5000,
    });

    const frame = await iframeElement.contentFrame();
    if (!frame) {
      throw new Error(
        "Не удалось получить контент iframe — возможно, он ещё не загрузился."
      );
    }

    await frame.waitForLoadState("domcontentloaded");
    return frame;
  }
}
