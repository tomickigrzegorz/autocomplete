import { test, expect } from "@playwright/test";
import path from "node:path";

const localFile = `file://${path.join(process.cwd(), "public", "stale-search.html")}`;

const styleConsoleLog = (text) => {
  Object.entries(text).forEach(([key, value]) => {
    const description =
      key === "number" ? `\r\nTest: ${value}` : `${value.join("\r\n")}`;
    console.log(
      `\x1b[33m....................................\r\n${description}\x1b[0m`,
    );
  });
};

test.describe("stale search tests", () => {
  let pageErrors;

  test.beforeEach(async ({ page }) => {
    pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto(localFile);
  });

  test("[12] 01: out-of-order responses - only the latest search is rendered", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "[12] 01",
      text: [
        '- type "w" (answer after 800ms), then "walter" (answer after 100ms)',
        '- expect results for "walter" to stay after the slow answer arrives',
      ],
    });
    const input = page.locator("#stale-slow");
    await input.fill("w");
    await expect.poll(() => page.evaluate(() => window.searchCalls)).toBe(1);
    await input.fill("walter");
    await expect(page.locator("#wrap-slow li")).toHaveCount(1);

    await page.waitForTimeout(1000);

    await expect(page.locator("#wrap-slow li")).toHaveCount(1);
    await expect(page.locator("#wrap-slow li")).toHaveText("Walter White");
    await expect(page.locator("#wrap-slow")).not.toHaveClass(/auto-is-loading/);
    expect(pageErrors).toEqual([]);
  });

  test("[12] 02: reset() while a search is in flight - late result is ignored", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "[12] 02",
      text: [
        '- type "w" with slow onSearch',
        "- call reset() before the answer arrives",
        "- expect no results, closed dropdown and no loading class",
      ],
    });
    const input = page.locator("#stale-slow");
    await input.fill("w");
    await expect.poll(() => page.evaluate(() => window.searchCalls)).toBe(1);

    const loadingAfterReset = await page.evaluate(() => {
      window.acSlow.reset();
      return document
        .getElementById("wrap-slow")
        .classList.contains("auto-is-loading");
    });
    expect(loadingAfterReset).toBe(false);

    await page.waitForTimeout(1000);

    await expect(page.locator("#wrap-slow li")).toHaveCount(0);
    await expect(input).toHaveAttribute("aria-expanded", "false");
    await expect(input).toHaveValue("");
    expect(pageErrors).toEqual([]);
  });

  test("[12] 03: disable() while a search is in flight - results do not reopen", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "[12] 03",
      text: [
        '- type "w" with slow onSearch',
        "- call disable() before the answer arrives",
        "- expect no results and closed dropdown",
      ],
    });
    const input = page.locator("#stale-slow");
    await input.fill("w");
    await expect.poll(() => page.evaluate(() => window.searchCalls)).toBe(1);
    await page.evaluate(() => window.acSlow.disable());

    await page.waitForTimeout(1000);

    await expect(page.locator("#wrap-slow li")).toHaveCount(0);
    await expect(input).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#wrap-slow")).not.toHaveClass(/auto-is-loading/);
    expect(pageErrors).toEqual([]);
  });

  test("[12] 04: destroy() while a search is in flight - results do not reopen", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "[12] 04",
      text: [
        '- type "w" with slow onSearch',
        "- call destroy() before the answer arrives",
        "- expect no results and closed dropdown",
      ],
    });
    const input = page.locator("#stale-slow");
    await input.fill("w");
    await expect.poll(() => page.evaluate(() => window.searchCalls)).toBe(1);
    await page.evaluate(() => window.acSlow.destroy());

    await page.waitForTimeout(1000);

    await expect(page.locator("#wrap-slow li")).toHaveCount(0);
    await expect(input).toHaveAttribute("aria-expanded", "false");
    expect(pageErrors).toEqual([]);
  });

  test("[12] 05: reset() during debounce - search does not fire", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "[12] 05",
      text: [
        '- type "white" (delay 300ms)',
        "- call reset() before the delay ends",
        "- expect onSearch never called",
      ],
    });
    await page.locator("#stale-debounce").fill("white");
    await page.evaluate(() => window.acDebounce.reset());
    await page.waitForTimeout(600);

    expect(await page.evaluate(() => window.searchCalls)).toBe(0);
    await expect(page.locator("#wrap-debounce li")).toHaveCount(0);
    expect(pageErrors).toEqual([]);
  });

  test("[12] 06: disable() during debounce - search does not fire", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "[12] 06",
      text: [
        '- type "white" (delay 300ms)',
        "- call disable() before the delay ends",
        "- expect onSearch never called",
      ],
    });
    await page.locator("#stale-debounce").fill("white");
    await page.evaluate(() => window.acDebounce.disable());
    await page.waitForTimeout(600);

    expect(await page.evaluate(() => window.searchCalls)).toBe(0);
    await expect(page.locator("#wrap-debounce li")).toHaveCount(0);
    expect(pageErrors).toEqual([]);
  });

  test("[12] 07: classPrefix - expanded class is removed on close", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "[12] 07",
      text: [
        '- type "white" in input with classPrefix "pre"',
        "- expect class pre-auto-expanded on input",
        "- press Escape",
        "- expect class pre-auto-expanded removed",
      ],
    });
    const input = page.locator("#stale-prefix");
    await input.fill("white");
    await expect(page.locator("#wrap-prefix li")).toHaveCount(2);
    await expect(input).toHaveClass(/pre-auto-expanded/);

    await input.press("Escape");

    await expect(input).toHaveAttribute("aria-expanded", "false");
    await expect(input).not.toHaveClass(/pre-auto-expanded/);
    expect(pageErrors).toEqual([]);
  });

  test("[12] 08: enable() before the first search - keyboard does not throw", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "[12] 08",
      text: [
        "- call disable() and enable() before any search",
        "- press ArrowDown, ArrowUp and Enter",
        "- expect no errors",
      ],
    });
    await page.evaluate(() => {
      window.acEnable.disable();
      window.acEnable.enable();
    });
    const input = page.locator("#stale-enable");
    await input.focus();
    await input.press("ArrowDown");
    await input.press("ArrowUp");
    await input.press("Enter");

    expect(pageErrors).toEqual([]);
  });

  test("[12] 09: onSearch throws synchronously - loading state is cleared", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "[12] 09",
      text: [
        '- type "w" in input whose onSearch throws',
        "- expect no loading class and no uncaught errors",
      ],
    });
    await page.locator("#stale-throw").fill("w");
    await page.waitForTimeout(300);

    await expect(page.locator("#wrap-throw")).not.toHaveClass(
      /auto-is-loading/,
    );
    expect(pageErrors).toEqual([]);
  });
});
