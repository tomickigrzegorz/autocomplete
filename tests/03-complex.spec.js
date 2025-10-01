import { test, expect } from "@playwright/test";
import { getScreenshotPath } from "../scripts/shared-screenshot.js";
import path from "path";

const localFile =
  "file://" + path.join(process.cwd(), "public", "complex-test.html");

const styleConsoleLog = (text) => {
  Object.entries(text).forEach(([key, value]) => {
    const description =
      key === "number" ? `\r\nTest: ${value}` : `${value.join("\r\n")}`;
    console.log(
      `\x1b[33m....................................\r\n${description}\x1b[0m`,
    );
  });
};

const openAccountDropdown = async (page) => {
  await page.evaluate(() => {
    const element = document.querySelector("#show-object");
    if (element) element.className = "show-object";
  });
};

test.describe("Complex autocomplete tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(localFile);
  });

  test('Test 01: Type "w" and check no auto-expanded class', async ({
    page,
  }) => {
    styleConsoleLog({
      number: "1",
      text: [
        '- type "w"',
        '- check that input does NOT have class "auto-expanded"',
        '- check that aria-expanded is still "false"',
      ],
    });
    const input = page.locator("#complex");
    await input.fill("w");

    // brak auto-expanded
    await expect(input).not.toHaveClass(/auto-expanded/);

    // atrybut aria-expanded wciąż "false"
    await expect(input).toHaveAttribute("aria-expanded", "false");

    await page.screenshot({
      path: getScreenshotPath("complex", "screenshot_test01.png"),
    });
  });

  test('Test 02: Type "wal" and count li elements', async ({ page }) => {
    styleConsoleLog({
      number: "2",
      text: [
        '- type "wal"',
        "- count li elements",
        '- check if root input has class "auto-expanded"',
      ],
    });
    const input = page.locator("#complex");
    await input.fill("wal");
    await expect(page.locator("li")).toHaveCount(4);
    await expect(input).toHaveClass(/auto-expanded/);
  });

  test("Test 03: First element is Walter White Jr.", async ({ page }) => {
    styleConsoleLog({
      number: "3",
      text: [
        '- type "wal"',
        "- check if selected element is Walter White Jr. inside h2",
      ],
    });
    const input = page.locator("#complex");
    await input.fill("wal");
    await expect(page.locator(".auto-selected > h2")).toHaveText(
      "Walter White Jr.",
    );
    await page.screenshot({
      path: getScreenshotPath("complex", "screenshot_test03.png"),
    });
  });

  test("Test 04: Key press down to Walter White", async ({ page }) => {
    styleConsoleLog({
      number: "4",
      text: [
        '- type "wal"',
        '- press key "down"',
        "- check selected element",
        "- check input value",
      ],
    });
    const input = page.locator("#complex");
    await input.fill("wal");
    await page.waitForTimeout(2000);
    await page.keyboard.press("ArrowDown");
    await expect(page.locator(".auto-selected > h2")).toHaveText(
      "Walter White",
    );
    await expect(input).toHaveValue("Walter White");
    await page.screenshot({
      path: getScreenshotPath("complex", "screenshot_test04.png"),
    });
  });

  test("Test 05: Press down and clear input", async ({ page }) => {
    styleConsoleLog({
      number: "5",
      text: [
        '- type "wal"',
        "- press down",
        "- check selected",
        "- clear input",
      ],
    });
    const input = page.locator("#complex");
    await input.fill("wal");
    await page.waitForTimeout(2000);
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(2000);
    await expect(page.locator(".auto-selected > h2")).toHaveText(
      "Walter White",
    );
    await expect(input).toHaveValue("Walter White");
    await page.screenshot({
      path: getScreenshotPath("complex", "screenshot_test05_before_clear.png"),
    });
    await input.locator("xpath=following-sibling::button[1]").click();
    await expect(input).toHaveValue("");
    await page.screenshot({
      path: getScreenshotPath("complex", "screenshot_test05_after_clear.png"),
    });
  });

  test('Test 06: Count ".group-by" and check texts', async ({ page }) => {
    styleConsoleLog({
      number: "6",
      text: [
        '- type "wal"',
        '- count ".group-by"',
        "- check first and third element texts",
      ],
    });
    const input = page.locator("#complex");
    await input.fill("wal");
    await page.waitForTimeout(1000);
    await expect(page.locator(".group-by")).toHaveCount(2);
    await expect(page.locator(".group-by:nth-child(1)")).toHaveText(
      "Alive 1 items",
    );
    await expect(page.locator("li:nth-child(3)")).toHaveText(
      "Presumed dead 1 items",
    );
    await page.screenshot({
      path: getScreenshotPath("complex", "screenshot_test06.png"),
    });
  });

  test("Test 07: No results", async ({ page }) => {
    styleConsoleLog({
      number: "7",
      text: ['- type "świnka"', "- check no results", "- clear input"],
    });
    const input = page.locator("#complex");
    await input.fill("świnka");
    await page.waitForTimeout(1000);
    await expect(input).toHaveValue("świnka");
    await page.waitForTimeout(1000);
    await expect(page.locator(".auto-selected")).toHaveText(
      'No results found: "świnka"',
    );
    await page.screenshot({
      path: getScreenshotPath("complex", "screenshot_test07_no_results.png"),
    });
    await page.keyboard.press("Escape");
    await page.screenshot({
      path: getScreenshotPath("complex", "screenshot_test07_after_esc.png"),
    });
    await input.locator("xpath=following-sibling::button[1]").click();
    await expect(input).toHaveValue("");
    await page.screenshot({
      path: getScreenshotPath("complex", "screenshot_test07_cleared.png"),
    });
  });

  test("Test 12: Check console.log messages", async ({ page }) => {
    styleConsoleLog({
      number: "12",
      text: [
        "- open account dropdown",
        '- type "wal"',
        "- press down x2",
        "- check console messages",
      ],
    });
    page.on("console", (msg) => {
      console.log(msg.text());
    });
    await openAccountDropdown(page);
    const input = page.locator("#complex");
    await input.fill("wal");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await expect(input).toHaveValue("wal");
    await page.screenshot({
      path: getScreenshotPath("complex", "screenshot_test12.png"),
    });
  });
});
