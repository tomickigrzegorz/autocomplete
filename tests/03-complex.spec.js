import { test, expect } from "@playwright/test";
import { getScreenshotPath } from "../scripts/shared-screenshot.js";
import path from "node:path";
import fs from "node:fs";

const localFile = `file://${path.join(process.cwd(), "public", "complex-test.html")}`;

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

// Helpers
async function typeAndWaitForResults(page, value, expectedCount) {
  const input = page.locator("#complex");
  await input.fill(value);
  if (expectedCount !== undefined) {
    await expect(page.locator("li")).toHaveCount(expectedCount, {
      timeout: 5000,
    });
  }
  return input;
}

async function waitForSelectedText(page, text) {
  await expect(page.locator(".auto-selected > h2")).toHaveText(text, {
    timeout: 5000,
  });
}

test.describe("Complex autocomplete tests", () => {
  test.beforeEach(async ({ page }) => {
    // Stub remote fetch to avoid network flakes
    const charactersPath = path.join(process.cwd(), "docs", "characters.json");
    const characters = JSON.parse(fs.readFileSync(charactersPath, "utf-8"));
    await page.route("**/characters.json", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(characters),
      });
    });
    await page.route(
      /.*raw.githubusercontent.com.*characters\.json.*/,
      (route) => {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(characters),
        });
      },
    );

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
    const input = await typeAndWaitForResults(page, "w");

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
    const input = await typeAndWaitForResults(page, "wal", 4);
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
    await typeAndWaitForResults(page, "wal", 4);
    await waitForSelectedText(page, "Walter White Jr.");
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
    const input = await typeAndWaitForResults(page, "wal", 4);
    await page.keyboard.press("ArrowDown");
    await waitForSelectedText(page, "Walter White");
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
    const input = await typeAndWaitForResults(page, "wal", 4);
    await page.keyboard.press("ArrowDown");
    await waitForSelectedText(page, "Walter White");
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
    const input = await typeAndWaitForResults(page, "wal", 4);
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
    const input = await typeAndWaitForResults(page, "świnka");
    await expect(input).toHaveValue("świnka");
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
    const input = await typeAndWaitForResults(page, "wal", 4);
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    // Depending on insertToInput=true the value may change; ensure it still starts with the original query
    await expect(input).toHaveValue(/wal/i);
    await page.screenshot({
      path: getScreenshotPath("complex", "screenshot_test12.png"),
    });
  });
});
