import { test, expect } from "@playwright/test";
import { getScreenshotPath } from "../scripts/shared-screenshot.js";
import path from "path";

const localFile =
  "file://" + path.join(process.cwd(), "public", "show-all.html");

const styleConsoleLog = (text) => {
  Object.entries(text).forEach(([key, value]) => {
    const description =
      key === "number" ? `\r\nTest: ${value}` : `${value.join("\r\n")}`;
    console.log(
      `\x1b[33m....................................\r\n${description}\x1b[0m`,
    );
  });
};

test.describe("Show all results tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(localFile);
  });

  test("test 01: count li elements - 63", async ({ page }) => {
    const description = { number: "1", text: ["- count li elements - 63"] };
    styleConsoleLog(description);

    const items = page.locator("li");
    await expect(items).toHaveCount(63);
  });

  test("test 02: click 10th element, check attributes and screenshot", async ({
    page,
  }) => {
    const description = {
      number: "2",
      text: [
        "- take screenshot",
        "- click on 10 elements",
        "- take screenshot",
        '- check if input has attribute "aria-expanded" and is true',
        '- check if 10 element has class "auto-selected"',
        "- check if 5 element has aria-setsize is 63",
        "- check if 10 element has aria-selected is true",
        "- if button auto-clear is visible",
        '- if button auto-clear don\'t have class "hidden"',
      ],
    };
    styleConsoleLog(description);

    const input = page.locator("#show-all");

    await page.screenshot({
      path: getScreenshotPath("show-all", "before_click.png"),
    });
    await page.locator("li").nth(10).click();
    await page.screenshot({
      path: getScreenshotPath("show-all", "after_click.png"),
    });

    await expect(input).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("li").nth(10)).toHaveClass(/auto-selected/);
    await expect(page.locator("li").nth(5)).toHaveAttribute(
      "aria-setsize",
      "63",
    );
    await expect(page.locator("li").nth(10)).toHaveAttribute(
      "aria-selected",
      "true",
    );

    const clearButton = input.locator("xpath=following-sibling::button[1]");
    await expect(clearButton).toBeVisible();
    await expect(clearButton).not.toHaveClass(/hidden/);
  });

  test('test 03: type "Adam", check input, clear and results', async ({
    page,
  }) => {
    const description = {
      number: "3",
      text: [
        "- take screenshot",
        '- type "Adam"',
        '- check if root value is "Adam"',
        '- check if result has 1 element with class "auto-selected"',
        "- take screenshot",
        "- click on button to clear input",
        '- check if root value is ""',
        "- wait 3s",
        "- check if results has 63 elements",
      ],
    };
    styleConsoleLog(description);

    const input = page.locator("#show-all");

    await page.screenshot({
      path: getScreenshotPath("show-all", "before_type.png"),
    });
    await input.fill("Adam");
    await expect(input).toHaveValue("Adam");
    await expect(page.locator("li")).toHaveCount(1);
    await page.screenshot({
      path: getScreenshotPath("show-all", "after_type.png"),
    });

    const clearButton = input.locator("xpath=following-sibling::button[1]");
    await clearButton.click();
    await expect(input).toHaveValue("");

    await page.waitForTimeout(3000);
    await expect(page.locator("li")).toHaveCount(63);
  });
});
