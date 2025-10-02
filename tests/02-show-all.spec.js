import { test, expect } from "@playwright/test";
import { getScreenshotPath } from "../scripts/shared-screenshot.js";
import path from "path";
import fs from "fs";

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

test.describe("Show all results (scenario tests)", () => {
  test.beforeEach(async ({ page }) => {
    const charactersPath = path.join(process.cwd(), "docs", "characters.json");
    const characters = JSON.parse(fs.readFileSync(charactersPath, "utf-8"));
    await page.route(/.*characters\.json.*/, (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(characters),
      });
    });
    await page.goto(localFile);
  });

  test("Scenario 1: initial render and selection", async ({ page }) => {
    styleConsoleLog({
      number: "1",
      text: [
        "- verify initial 63 items",
        "- screenshot before click",
        "- click 11th item (index 10)",
        "- screenshot after click",
        "- assert aria-expanded, selection state, clear button visibility",
      ],
    });

    const items = page.locator("li");
    await expect(items).toHaveCount(63);
    await page.screenshot({
      path: getScreenshotPath("show-all", "01_before_click.png"),
    });
    const input = page.locator("#show-all");
    const target = items.nth(10);
    await target.click();
    await page.screenshot({
      path: getScreenshotPath("show-all", "02_after_click.png"),
    });

    await expect(input).toHaveAttribute("aria-expanded", "true");
    await expect(target).toHaveClass(/auto-selected/);
    await expect(items.nth(5)).toHaveAttribute("aria-setsize", "63");
    await expect(target).toHaveAttribute("aria-selected", "true");

    const clearButton = input.locator("xpath=following-sibling::button[1]");
    await expect(clearButton).toBeVisible();
    await expect(clearButton).not.toHaveClass(/hidden/);
  });

  test("Scenario 2: filtering and clearing (Adam)", async ({ page }) => {
    styleConsoleLog({
      number: "2",
      text: [
        ' - type "Adam"',
        "- expect 1 filtered result & auto-selected",
        "- screenshot after filtering",
        "- clear input",
        "- expect back to 63 results",
      ],
    });

    const input = page.locator("#show-all");
    await input.fill("Adam");
    await expect(input).toHaveValue("Adam");
    const items = page.locator("li");
    await expect(items).toHaveCount(1);
    // In this configuration (no selectFirst) single result is NOT auto-selected
    await expect(page.locator(".auto-selected")).toHaveCount(0);
    await page.screenshot({
      path: getScreenshotPath("show-all", "03_after_type_adam.png"),
    });
    const clearButton = input.locator("xpath=following-sibling::button[1]");
    await clearButton.click();
    await expect(input).toHaveValue("");
    await expect(page.locator("li")).toHaveCount(63);
  });

  test("Scenario 3: selection persists after multiple clicks", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "3",
      text: [
        "- click 3rd item",
        "- click 7th item",
        "- ensure only last clicked has selection class",
      ],
    });
    const items = page.locator("li");
    await expect(items).toHaveCount(63);
    const third = items.nth(2);
    const seventh = items.nth(6);
    await third.click();
    await expect(third).toHaveClass(/auto-selected/);
    await seventh.click();
    await expect(seventh).toHaveClass(/auto-selected/);
    await expect(third).not.toHaveClass(/auto-selected/);
  });
});
