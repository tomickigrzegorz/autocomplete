import { test, expect } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

const localFile = `file://${path.join(process.cwd(), "public", "simple.html")}`;

// Styled console helper (kept for consistency with other specs)
const styleConsoleLog = (text) => {
  Object.entries(text).forEach(([key, value]) => {
    const description =
      key === "number" ? `\r\nTest: ${value}` : `${value.join("\r\n")}`;
    console.log(
      `\x1b[33m....................................\r\n${description}\x1b[0m`,
    );
  });
};

// Helper to type and (optionally) wait for results count
async function typeAndWaitForResults(page, value, expectedCount) {
  const input = page.locator("#simple");
  await input.fill(value);
  if (typeof expectedCount === "number") {
    await expect(page.locator("li")).toHaveCount(expectedCount, {
      timeout: 5000,
    });
  }
  return input;
}

test.describe("Simple autocomplete tests", () => {
  test.beforeEach(async ({ page }) => {
    // Stub remote fetch to eliminate network flakiness
    const charactersPath = path.join(process.cwd(), "docs", "characters.json");
    const characters = JSON.parse(fs.readFileSync(charactersPath, "utf-8"));
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

  test('Test 01: Type "w" and count li elements (13)', async ({ page }) => {
    styleConsoleLog({
      number: "1",
      text: ['- type "w"', "- expect 13 <li> results"],
    });
    await typeAndWaitForResults(page, "w", 13);
  });

  test('Test 02: Aria & classes after typing "w"', async ({ page }) => {
    styleConsoleLog({
      number: "2",
      text: [
        '- type "w"',
        '- expect aria-expanded="true"',
        "- expect class auto-expanded on input",
        "- expect sibling div has class auto-is-active",
      ],
    });
    const input = await typeAndWaitForResults(page, "w", 13);
    await expect(input).toHaveAttribute("aria-expanded", "true");
    await expect(input).toHaveClass(/auto-expanded/);
    await expect(input.locator("xpath=following-sibling::div[1]")).toHaveClass(
      /auto-is-active/,
    );
  });

  test('Test 03: Navigate results and clear (select "Duane Chow")', async ({
    page,
  }) => {
    styleConsoleLog({
      number: "3",
      text: [
        '- type "w"',
        "- ensure 13 results loaded",
        "- press ArrowDown 3x",
        '- expect selected item text "Duane Chow"',
        "- press Enter to apply",
        '- expect input value "Duane Chow"',
        "- click clear button",
        "- expect input cleared",
      ],
    });
    const input = await typeAndWaitForResults(page, "w", 13);
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    const selected = page.locator(".auto-selected p");
    await expect(selected).toHaveText("Duane Chow");
    await page.keyboard.press("Enter");
    await expect(input).toHaveValue("Duane Chow");
    await input.locator("xpath=following-sibling::button[1]").click();
    await expect(input).toHaveValue("");
  });
});
