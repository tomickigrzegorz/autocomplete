import { test, expect } from "@playwright/test";
import path from "path";

const localFile =
  "file://" + path.join(process.cwd(), "public", "disable.html");

const styleConsoleLog = (text) => {
  Object.entries(text).forEach(([key, value]) => {
    const description =
      key === "number" ? `\r\nTest: ${value}` : `${value.join("\r\n")}`;
    console.log(
      `\x1b[33m....................................\r\n${description}\x1b[0m`,
    );
  });
};

test.describe("Autocomplete tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(localFile);
  });

  test('test 01: Type "w" and count li elements - 3', async ({ page }) => {
    const description = {
      number: "1",
      text: [
        '- type "w"',
        "- count li elements - 3",
        '- check if button has class "auto-clear" and is visible',
        '- check if input #disable has atribute aria-expanded="true"',
        "- click on first li element",
        "- check if button is not visible",
        '- type "w" again',
        "- check if #auto-disable-results is empty",
        "- refreash page and check if input is empty",
        '- type "w" again',
        "- check if #auto-disable-results has 3 li elements",
      ],
    };
    styleConsoleLog(description);

    const input = page.locator("#disable");
    await input.fill("w");

    const items = page.locator("li");
    await expect(items).toHaveCount(3);

    const button = page.locator("button");
    await expect(button).toHaveClass(/auto-clear/);
    await expect(button).toBeVisible();

    await expect(input).toHaveAttribute("aria-expanded", "true");

    await items.first().click();

    await expect(button).not.toBeVisible();
    await expect(input).toHaveAttribute("aria-expanded", "false");

    await input.fill("w");

    const results = page.locator("#auto-disable-results");
    await expect(results).toBeEmpty();

    await page.reload();
    await expect(input).toHaveValue("");

    await input.fill("w");
    await expect(results.locator("li")).toHaveCount(3);
  });
});
