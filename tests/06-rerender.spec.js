import { test, expect } from "@playwright/test";
import path from "node:path";

const localFile = `file://${path.join(process.cwd(), "public", "rerender.html")}`;

const styleConsoleLog = (text) => {
  Object.entries(text).forEach(([key, value]) => {
    const description =
      key === "number" ? `\r\nTest: ${value}` : `${value.join("\r\n")}`;
    console.log(
      `\x1b[33m....................................\r\n${description}\x1b[0m`,
    );
  });
};

async function typeAndWaitForResults(page, value, expectedCount) {
  const input = page.locator("#rerender");
  await input.fill(value);
  if (typeof expectedCount === "number") {
    await expect(page.locator("#auto-rerender-results > li")).toHaveCount(
      expectedCount,
      { timeout: 5000 },
    );
  }
  return input;
}

test.describe("Autocomplete rerender() method tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(localFile);
  });

  test("01: type 'w' shows 3 results", async ({ page }) => {
    styleConsoleLog({
      number: "1",
      text: [
        '- type "w"',
        "- expect 3 results (Walter White, Walter White Jr., Skyler White)",
      ],
    });
    await typeAndWaitForResults(page, "w", 3);
  });

  test("02: rerender(string) sets input value and searches", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "2",
      text: [
        '- type "jesse"',
        "- expect 1 result",
        '- click rerender "Walter" button',
        "- input should change to Walter",
        "- results should show 2 items",
      ],
    });
    // First type jesse
    const input = await typeAndWaitForResults(page, "jesse", 1);
    await expect(input).toHaveValue("jesse");

    // Click rerender with "Walter"
    await page.locator("#btn-rerender-walter").click();

    // Input should now be "Walter" and show 2 results
    await expect(input).toHaveValue("Walter");
    await expect(page.locator("#auto-rerender-results > li")).toHaveCount(2);
  });

  test("03: rerender(string) without prior input triggers search", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "3",
      text: [
        "- do not type anything",
        '- click rerender "Walter" button',
        "- input should be Walter",
        "- results should appear",
      ],
    });
    const input = page.locator("#rerender");

    // Click rerender with "Walter" without typing first
    await page.locator("#btn-rerender-walter").click();

    // Input should now be "Walter" and show 2 results
    await expect(input).toHaveValue("Walter");
    await expect(page.locator("#auto-rerender-results > li")).toHaveCount(2);
  });

  test("04: rerender(string) shows correct result content", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "4",
      text: [
        '- click rerender "marie" button equivalent',
        "- expect 1 result (Marie Schrader)",
        "- verify result text",
      ],
    });
    // Use evaluate to call rerender directly
    await page.evaluate(() => {
      // @ts-ignore
      window.autocomplete.rerender("marie");
    });

    await expect(page.locator("#auto-rerender-results > li")).toHaveCount(1);
    const firstResult = page.locator("#auto-rerender-results > li").first();
    await expect(firstResult).toHaveText("Marie Schrader");
  });

  test("05: rerender() uses current input value", async ({ page }) => {
    styleConsoleLog({
      number: "5",
      text: [
        '- type "hank"',
        "- call rerender() via JS",
        "- results should refresh with same query",
      ],
    });
    const input = await typeAndWaitForResults(page, "hank", 1);

    // Call rerender() directly via evaluate to avoid focus issues
    await page.evaluate(() => {
      // @ts-ignore
      window.autocomplete.rerender();
    });

    // Should still show 1 result for "hank"
    await expect(page.locator("#auto-rerender-results > li")).toHaveCount(1);
    await expect(input).toHaveValue("hank");
  });

  test("06: keyboard navigation works after rerender", async ({ page }) => {
    styleConsoleLog({
      number: "6",
      text: [
        '- call rerender "Walter"',
        "- focus input",
        "- press ArrowDown",
        "- first item should be selected",
        "- press Enter",
        "- input should have selected value",
      ],
    });
    const input = page.locator("#rerender");

    // Rerender with Walter via evaluate
    await page.evaluate(() => {
      // @ts-ignore
      window.autocomplete.rerender("Walter");
    });

    await expect(page.locator("#auto-rerender-results > li")).toHaveCount(2);

    // Focus input for keyboard navigation
    await input.focus();

    // Navigate with keyboard
    await page.keyboard.press("ArrowDown");

    // Check selection
    const selected = page.locator(".auto-selected");
    await expect(selected).toHaveCount(1);

    // Press Enter to select
    await page.keyboard.press("Enter");

    // Input should have the selected value
    const inputValue = await input.inputValue();
    expect(inputValue.length).toBeGreaterThan(0);
  });

  test("07: rerender changes results when called with different value", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "7",
      text: [
        '- rerender "walter" - expect 2',
        '- rerender "jesse" - expect 1',
        "- verify result changes",
      ],
    });
    // First rerender with "walter"
    await page.evaluate(() => {
      // @ts-ignore
      window.autocomplete.rerender("walter");
    });
    await expect(page.locator("#auto-rerender-results > li")).toHaveCount(2);

    // Then rerender with "jesse"
    await page.evaluate(() => {
      // @ts-ignore
      window.autocomplete.rerender("jesse");
    });
    await expect(page.locator("#auto-rerender-results > li")).toHaveCount(1);

    const firstResult = page.locator("#auto-rerender-results > li").first();
    await expect(firstResult).toHaveText("Jesse Pinkman");
  });

  test("08: rerender with whitespace-only string uses current value", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "8",
      text: [
        '- type "skyler"',
        '- rerender with "   " (spaces)',
        "- should use current input value",
      ],
    });
    const input = await typeAndWaitForResults(page, "skyler", 1);

    // Rerender with whitespace - should fallback to current value
    await page.evaluate(() => {
      // @ts-ignore
      window.autocomplete.rerender("   ");
    });

    // Should still show result for "skyler"
    await expect(page.locator("#auto-rerender-results > li")).toHaveCount(1);
    await expect(input).toHaveValue("skyler");
  });
});
