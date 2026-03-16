import { test, expect } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

const localFile = `file://${path.join(process.cwd(), "public", "loading.html")}`;

const styleConsoleLog = (text) => {
  Object.entries(text).forEach(([key, value]) => {
    const description =
      key === "number" ? `\r\nTest: ${value}` : `${value.join("\r\n")}`;
    console.log(
      `\x1b[33m....................................\r\n${description}\x1b[0m`,
    );
  });
};

test.describe("onLoading callback tests", () => {
  test.beforeEach(async ({ page }) => {
    const charactersPath = path.join(process.cwd(), "docs", "characters.json");
    const characters = JSON.parse(fs.readFileSync(charactersPath, "utf-8"));

    // Intercept with a 400ms delay so we can observe the loading state
    await page.route(
      /.*raw.githubusercontent.com.*characters\.json.*/,
      async (route) => {
        await new Promise((r) => setTimeout(r, 400));
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(characters),
        });
      },
    );

    await page.goto(localFile);
  });

  test("[09] 01: auto-is-loading class is added to wrapper while fetching", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "[09] 01",
      text: [
        '- type "w"',
        "- check that .auto-search-wrapper has class auto-is-loading before results arrive",
      ],
    });

    const wrapper = page.locator(".auto-search-wrapper");
    await page.locator("#loading").fill("w");

    // loading class should appear immediately (before the delayed response)
    await expect(wrapper).toHaveClass(/auto-is-loading/, { timeout: 1000 });
  });

  test("[09] 02: auto-is-loading class is removed after results arrive", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "[09] 02",
      text: [
        '- type "w"',
        "- wait for results",
        "- check that auto-is-loading class is gone",
      ],
    });

    const wrapper = page.locator(".auto-search-wrapper");
    await page.locator("#loading").fill("w");

    // wait for results to render
    await expect(page.locator("li")).toHaveCount(13, { timeout: 5000 });

    await expect(wrapper).not.toHaveClass(/auto-is-loading/);
  });

  test("[09] 03: onLoading HTML is shown in dropdown while fetching", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "[09] 03",
      text: [
        '- type "wal"',
        "- check that loading HTML (.loading-item) is visible before results",
        "- check text content of loading item",
      ],
    });

    await page.locator("#loading").fill("wal");

    // loading HTML should appear before the delayed response
    const loadingItem = page.locator(".loading-item");
    await expect(loadingItem).toBeVisible({ timeout: 1000 });
    await expect(loadingItem).toContainText('Searching for "wal"');
  });

  test("[09] 04: loading HTML is replaced by actual results", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "[09] 04",
      text: [
        '- type "wal"',
        "- wait for results",
        "- check .loading-item is gone",
        "- check actual results are shown",
      ],
    });

    await page.locator("#loading").fill("wal");

    // wait for real results ("wal" matches 2 characters)
    await expect(page.locator("li")).toHaveCount(2, { timeout: 5000 });

    // loading placeholder must be gone
    await expect(page.locator(".loading-item")).toHaveCount(0);
  });
});
