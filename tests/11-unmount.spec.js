import { test, expect } from "@playwright/test";
import path from "node:path";

const localFile = `file://${path.join(process.cwd(), "public", "unmount.html")}`;

const styleConsoleLog = (text) => {
  Object.entries(text).forEach(([key, value]) => {
    const description =
      key === "number" ? `\r\nTest: ${value}` : `${value.join("\r\n")}`;
    console.log(
      `\x1b[33m....................................\r\n${description}\x1b[0m`,
    );
  });
};

test.describe("unmount() tests", () => {
  let pageErrors;

  test.beforeEach(async ({ page }) => {
    pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto(localFile);
  });

  test("[11] 01: default mode — removes created nodes, keeps input value", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "[11] 01",
      text: [
        '- type "white", wait for results',
        "- call unmount()",
        "- expect results wrapper and clear button removed",
        "- expect input value kept and onReset not called",
      ],
    });
    const input = page.locator("#unmount-default");
    await input.fill("white");
    await expect(page.locator("#wrap-default li")).toHaveCount(2);

    await page.evaluate(() => window.acDefault.unmount());

    await expect(
      page.locator("#wrap-default .auto-results-wrapper"),
    ).toHaveCount(0);
    await expect(page.locator("#wrap-default .auto-clear")).toHaveCount(0);
    await expect(input).toHaveValue("white");
    expect(await page.evaluate(() => window.resets)).toBe(0);
    expect(pageErrors).toEqual([]);
  });

  test("[11] 02: dropdownParent mode — removes dropdown from parent", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "[11] 02",
      text: [
        '- type "white" in dropdownParent input',
        "- call unmount()",
        "- expect dropdown removed from body",
      ],
    });
    await page.locator("#unmount-parent").fill("white");
    await expect(page.locator("#auto-unmount-parent-results li")).toHaveCount(
      2,
    );

    await page.evaluate(() => window.acParent.unmount());

    await expect(page.locator("#auto-unmount-parent-results")).toHaveCount(0);
    await expect(page.locator("#wrap-parent .auto-clear")).toHaveCount(0);
    expect(pageErrors).toEqual([]);
  });

  test("[11] 03: pending debounce — search does not fire after unmount", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "[11] 03",
      text: [
        '- type "white" (delay 300ms)',
        "- unmount and remove input from DOM before delay ends",
        "- expect onSearch never called and no errors",
      ],
    });
    await page.locator("#unmount-default").fill("white");
    await page.evaluate(() => {
      window.acDefault.unmount();
      document.getElementById("wrap-default").remove();
    });
    await page.waitForTimeout(600);

    expect(await page.evaluate(() => window.searchCalls)).toBe(0);
    expect(pageErrors).toEqual([]);
  });

  test("[11] 04: in-flight search — late result is ignored after unmount", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "[11] 04",
      text: [
        '- type "white" with slow onSearch (1s)',
        "- unmount and remove input while search is in flight",
        "- expect no dropdown re-created, no loading class, no errors",
      ],
    });
    await page.locator("#unmount-slow").fill("white");
    await expect.poll(() => page.evaluate(() => window.searchCalls)).toBe(1);
    await expect(page.locator("#wrap-slow")).toHaveClass(/auto-is-loading/);

    // checked synchronously — the late promise would remove the class by itself
    const loadingAfterUnmount = await page.evaluate(() => {
      window.acSlow.unmount();
      return document
        .getElementById("wrap-slow")
        .classList.contains("auto-is-loading");
    });
    expect(loadingAfterUnmount).toBe(false);

    await page.evaluate(() => {
      window.slowInput = document.getElementById("unmount-slow");
      document.getElementById("wrap-slow").remove();
    });
    await page.waitForTimeout(1300);

    await expect(page.locator("#auto-unmount-slow-results")).toHaveCount(0);
    expect(
      await page.evaluate(() => window.slowInput.getAttribute("aria-expanded")),
    ).not.toBe("true");
    expect(pageErrors).toEqual([]);
  });
});
