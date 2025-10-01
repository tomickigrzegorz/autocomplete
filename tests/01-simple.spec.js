import { test, expect } from "@playwright/test";
import path from "path";

const localFile = "file://" + path.join(process.cwd(), "public", "simple.html");

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

  test('test 01: Type "w" and count li elements - 13', async ({ page }) => {
    const description = {
      number: "1",
      text: ['- type "w"', "- count li elements - 13"],
    };
    styleConsoleLog(description);

    const input = page.locator("#simple");
    await input.fill("w");

    const items = page.locator("li");
    await expect(items).toHaveCount(13);
  });

  test("test 02: Check if exist aria and class", async ({ page }) => {
    const description = {
      number: "2",
      text: [
        '- type "w"',
        '- check if root has atribute "aria-expanded" with value "true"',
        '- check if root has class "auto-expanded"',
        '- check if root nextSibling div has class "auto-is-active"',
      ],
    };
    styleConsoleLog(description);

    const input = page.locator("#simple");
    await input.fill("w");

    await expect(input).toHaveAttribute("aria-expanded", "true");
    await expect(input).toHaveClass(/auto-expanded/);
    await expect(input.locator("xpath=following-sibling::div[1]")).toHaveClass(
      /auto-is-active/,
    );
  });

  test("test 03: Press 3x down and check selected element", async ({
    page,
  }) => {
    const description = {
      number: "3",
      text: [
        '- type "w"',
        "- wait 2 seconds",
        '- press key "down" 3x',
        '- check if selected element has text "Duane Chow"',
        "- press enter",
        "- wait 2 seconds",
        '- check if root value is "Duane Chow"',
        "- click on root nextSibling div (x button)",
        "- check if root value is empty",
      ],
    };
    styleConsoleLog(description);

    const input = page.locator("#simple");
    await input.fill("w");
    await page.waitForTimeout(2000);

    // 3x arrow down
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");

    const selected = page.locator(".auto-selected");
    await expect(selected).toHaveText("Duane Chow");

    // press enter
    await page.keyboard.press("Enter");
    await page.waitForTimeout(2000);

    await expect(input).toHaveValue("Duane Chow");

    // click clear button
    await input.locator("xpath=following-sibling::button[1]").click();
    await expect(input).toHaveValue("");
  });
});
