import { Page } from "@playwright/test";

export class BasePage {
  constructor(protected page: Page) {}

  async goto(url: string) {
    await this.page.goto(url);
  }

  async screenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  async getFrame() {
    const iframeElementHandle = await this.page.waitForSelector("iframe");
    const frame = await iframeElementHandle.contentFrame();
    return frame;
  }

  async clickButtonInFrame(selector: string) {
    const frame = await this.getFrame();

    if (frame) {
      await frame.click(selector);
    }
  }
}
