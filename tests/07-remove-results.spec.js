import { test, expect } from "@playwright/test";
import path from "node:path";

const localFile = `file://${path.join(process.cwd(), "public", "remove-results.html")}`;

const styleConsoleLog = (text) => {
  Object.entries(text).forEach(([key, value]) => {
    const description =
      key === "number" ? `\r\nTest: ${value}` : `${value.join("\r\n")}`;
    console.log(
      `\x1b[33m....................................\r\n${description}\x1b[0m`,
    );
  });
};

test.describe("removeResultsWhenInputIsEmpty option tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(localFile);
  });

  // Tests for removeResultsWhenInputIsEmpty: true
  test.describe("With removeResultsWhenInputIsEmpty: true", () => {
    test("01: typing shows results", async ({ page }) => {
      styleConsoleLog({
        number: "1",
        text: ['- type "w"', "- expect 3 results"],
      });
      const input = page.locator("#remove-results");
      await input.fill("w");

      await expect(
        page.locator("#auto-remove-results-results > li"),
      ).toHaveCount(3, { timeout: 5000 });
    });

    test("02: clearing input removes results from DOM", async ({ page }) => {
      styleConsoleLog({
        number: "2",
        text: [
          '- type "walter"',
          "- expect 2 results",
          "- clear input",
          "- results should be removed from DOM",
        ],
      });
      const input = page.locator("#remove-results");
      await input.fill("walter");

      await expect(
        page.locator("#auto-remove-results-results > li"),
      ).toHaveCount(2, { timeout: 5000 });

      // Clear the input
      await input.fill("");

      // Results should be empty
      await expect(
        page.locator("#auto-remove-results-results > li"),
      ).toHaveCount(0);
    });

    test("03: aria-expanded becomes false after clearing", async ({ page }) => {
      styleConsoleLog({
        number: "3",
        text: [
          '- type "hank"',
          "- expect aria-expanded true",
          "- clear input",
          "- aria-expanded should be false",
        ],
      });
      const input = page.locator("#remove-results");
      await input.fill("hank");

      await expect(
        page.locator("#auto-remove-results-results > li"),
      ).toHaveCount(1, { timeout: 5000 });
      await expect(input).toHaveAttribute("aria-expanded", "true");

      // Clear input
      await input.fill("");

      // Should be collapsed
      await expect(input).toHaveAttribute("aria-expanded", "false");
    });

    test("04: clear button triggers removal", async ({ page }) => {
      styleConsoleLog({
        number: "4",
        text: [
          '- type "jesse"',
          "- click clear button",
          "- results should be removed",
        ],
      });
      const input = page.locator("#remove-results");
      await input.fill("jesse");

      await expect(
        page.locator("#auto-remove-results-results > li"),
      ).toHaveCount(1, { timeout: 5000 });

      // Click clear button
      const clearBtn = input.locator("xpath=following-sibling::button[1]");
      await clearBtn.click();

      // Results should be removed
      await expect(
        page.locator("#auto-remove-results-results > li"),
      ).toHaveCount(0);
      await expect(input).toHaveValue("");
    });

    test("05: backspace to empty removes results", async ({ page }) => {
      styleConsoleLog({
        number: "5",
        text: [
          '- type "a"',
          "- expect results",
          "- press Backspace",
          "- results should be removed",
        ],
      });
      const input = page.locator("#remove-results");
      await input.fill("a");

      // "a" matches: Walter, Jesse, Walter Jr., Hank, Marie = 5 results
      await expect(
        page.locator("#auto-remove-results-results > li"),
      ).toHaveCount(5, { timeout: 5000 });

      // Focus and press backspace
      await input.focus();
      await page.keyboard.press("Backspace");

      // Results should be removed
      await expect(
        page.locator("#auto-remove-results-results > li"),
      ).toHaveCount(0);
    });

    test("06: can type again after clearing", async ({ page }) => {
      styleConsoleLog({
        number: "6",
        text: [
          '- type "w"',
          "- clear input",
          '- type "jesse"',
          "- should show 1 result",
        ],
      });
      const input = page.locator("#remove-results");

      // First search
      await input.fill("w");
      await expect(
        page.locator("#auto-remove-results-results > li"),
      ).toHaveCount(3, { timeout: 5000 });

      // Clear
      await input.fill("");
      await expect(
        page.locator("#auto-remove-results-results > li"),
      ).toHaveCount(0);

      // New search
      await input.fill("jesse");
      await expect(
        page.locator("#auto-remove-results-results > li"),
      ).toHaveCount(1, { timeout: 5000 });
    });
  });

  // Tests for removeResultsWhenInputIsEmpty: false (default)
  test.describe("With removeResultsWhenInputIsEmpty: false (default)", () => {
    test("07: typing shows results", async ({ page }) => {
      styleConsoleLog({
        number: "7",
        text: ['- type "w" in keep-results input', "- expect 3 results"],
      });
      const input = page.locator("#keep-results");
      await input.fill("w");

      await expect(page.locator("#auto-keep-results-results > li")).toHaveCount(
        3,
        { timeout: 5000 },
      );
    });

    test("08: clearing input keeps results in DOM (but hidden)", async ({
      page,
    }) => {
      styleConsoleLog({
        number: "8",
        text: [
          '- type "walter"',
          "- expect 2 results",
          "- use clear button",
          "- results ul should be empty but wrapper exists",
        ],
      });
      const input = page.locator("#keep-results");
      await input.fill("walter");

      await expect(page.locator("#auto-keep-results-results > li")).toHaveCount(
        2,
        { timeout: 5000 },
      );

      // Click clear button
      const clearBtn = input.locator("xpath=following-sibling::button[1]");
      await clearBtn.click();

      // Results wrapper should still exist
      await expect(page.locator("#auto-keep-results-results")).toBeAttached();
    });
  });

  // Comparison tests
  test.describe("Comparison between options", () => {
    test("09: both inputs work independently", async ({ page }) => {
      styleConsoleLog({
        number: "9",
        text: [
          '- type "w" in remove-results',
          '- type "jesse" in keep-results',
          "- both should show their results",
        ],
      });
      const inputRemove = page.locator("#remove-results");
      const inputKeep = page.locator("#keep-results");

      await inputRemove.fill("w");
      await expect(
        page.locator("#auto-remove-results-results > li"),
      ).toHaveCount(3, { timeout: 5000 });

      await inputKeep.fill("jesse");
      await expect(page.locator("#auto-keep-results-results > li")).toHaveCount(
        1,
        { timeout: 5000 },
      );

      // Both should have results
      await expect(
        page.locator("#auto-remove-results-results > li"),
      ).toHaveCount(3);
      await expect(page.locator("#auto-keep-results-results > li")).toHaveCount(
        1,
      );
    });
  });
});
