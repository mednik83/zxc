import { Page } from "@playwright/test";

export class MainPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("https://my.craftistry.pro/fyva");
  }

  async clickTelegramBotLink() {
    await this.page.getByText("Создать свой магазин").click(); // Ищем ссылку на телеграм-бота
  }
}
