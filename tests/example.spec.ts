// test.describe("Последовательные тесты", () => {
//   test("Проверяем, запущен ли бот", async ({ page }) => {
//     const mainPage = new BasePage(page);
//     await mainPage.goto();

//     await mainPage.maybeStartBot();
//   });

//   test("Переход к Telegram-боту через сайт", async ({ page }) => {
//     const mainPage = new MainPage(page);
//     await mainPage.goto();

//     await mainPage.clickTelegramBotLink(); // Переход по ссылке

//     await page.waitForLoadState("domcontentloaded");

//     // Проверяем URL
//     expect(page.url()).toContain("t.me");
//   });

//   test.use({
//     storageState: "auth/telegram.json",
//   });
//   test("Переход к Telegram-боту через прямую ссылку", async ({ page }) => {
//     const mainBotPage = new MainBotPage(page);
//     await mainBotPage.goto();
//     await mainBotPage.clickMenu();
//     await mainBotPage.clickButtonByText("Мои витрины");
//   });

//   test("QR код магазина", async ({ page }) => {
//     const mainBotPage = new MainBotPage(page);
//     await mainBotPage.goto();

//     await mainBotPage.openMiniApp("QR код магазина");
//     await page.screenshot({ path: "screenshots/QR.png" });
//   });
// });
