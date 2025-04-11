import { Frame } from "@playwright/test";

export { fillForm };
async function fillForm(frame: Frame) {
  try {
    const formData = [
      {
        label: "Короткое имя страницы",
        type: "text",
        value: "my_craftistry_pro_123",
      },
      // {
      //   label: "Фото / Логотип",
      //   type: "file",
      //   value: "tests/files/avatar.png",
      // },
      { label: "Ссылка на канал", type: "text", value: "@my_channel" },
      {
        label: "Контакт для связи",
        type: "text",
        value: "https://t.me/my_username",
      }, // Добавляем префикс https://t.me/
      {
        label: "Название магазина",
        type: "text",
        value: "Мой уникальный магазин",
      },
      {
        label: "Описание",
        type: "textarea",
        value: "Описание магазина и его уникальных преимуществ",
      },
      { label: "Название Юр. лица", type: "text", value: "ООО 'COMPANY'" },
      { label: "ИНН", type: "text", value: "1234567890" },
      { label: "КПП", type: "text", value: "987654321" },
      { label: "ОГРН", type: "text", value: "1234567890123" },
      { label: "Адрес", type: "text", value: "г. Москва, ул. Пушкина, д. 10" },
      { label: "Телефон", type: "text", value: "+7 (999) 123-45-67" },
      { label: "Email", type: "text", value: "contact@example.com" },
    ];

    const inputs = frame.locator("input, textarea");
    for (let i = 0; i < formData.length; i++) {
      const field = formData[i];
      const inputLocator = inputs.nth(i);

      // Проверяем, что поле найдено
      if ((await inputLocator.count()) === 0) {
        console.warn(`Поле номер ${i + 1} не найдено`);
        continue;
      }

      // Заполняем поле
      if (field.type === "file") {
        await inputLocator.setInputFiles(field.value);
      } else {
        await inputLocator.fill(field.value);
      }
    }

    // Проверяем наличие модального окна
    const modal = frame.locator(".ant-modal-wrap");
    if (await modal.isVisible()) {
      console.log("Модальное окно найдено. Пытаемся закрыть...");

      // Ищем кнопку закрытия в модальном окне
      const closeButton = modal.locator("button[aria-label='Close']");
      if (await closeButton.isVisible()) {
        await closeButton.click();
        console.log("Модальное окно закрыто.");
      }
    }

    // Ждем появления кнопки "Сохранить"
    await frame.waitForSelector('button:has-text("Сохранить")', {
      state: "visible",
      timeout: 30000,
    });

    // Кликаем по кнопке "Сохранить"
    await frame.click('button:has-text("Сохранить")');
  } catch (error) {
    console.error("Ошибка заполнения формы:", error);

    // Скриншот при ошибке
    if (frame) {
      await frame.page().screenshot({ path: "form-error.png" });
    }

    throw error; // Перебрасываем ошибку для завершения теста
  }
}
