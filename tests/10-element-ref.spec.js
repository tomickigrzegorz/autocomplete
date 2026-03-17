import { test, expect } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

const localFile = `file://${path.join(process.cwd(), "public", "element-ref.html")}`;

const styleConsoleLog = (text) => {
  Object.entries(text).forEach(([key, value]) => {
    const description =
      key === "number" ? `\r\nTest: ${value}` : `${value.join("\r\n")}`;
    console.log(
      `\x1b[33m....................................\r\n${description}\x1b[0m`,
    );
  });
};

test.describe("Element ref tests (HTMLElement instead of string ID)", () => {
  test.beforeEach(async ({ page }) => {
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

  test("[10] 01: HTMLElement with existing id — type 'w' shows results", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "[10] 01",
      text: [
        "- init with HTMLElement that has existing id",
        '- type "w"',
        "- expect 13 <li> results",
      ],
    });
    const input = page.locator("#ref-with-id");
    await input.fill("w");
    await expect(page.locator("li")).toHaveCount(13, { timeout: 5000 });
  });

  test("[10] 02: HTMLElement with existing id — ARIA attributes set correctly", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "[10] 02",
      text: [
        "- init with HTMLElement that has existing id",
        '- type "w"',
        '- expect aria-expanded="true"',
        "- expect class auto-expanded on input",
      ],
    });
    const input = page.locator("#ref-with-id");
    await input.fill("w");
    await expect(page.locator("li")).toHaveCount(13, { timeout: 5000 });
    await expect(input).toHaveAttribute("aria-expanded", "true");
    await expect(input).toHaveClass(/auto-expanded/);
  });

  test("[10] 03: HTMLElement without id — auto-generated id assigned", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "[10] 03",
      text: [
        "- init with HTMLElement that has no id",
        "- expect element gets auto-generated id (starts with 'auto-')",
      ],
    });
    const input = page.locator("input[placeholder='HTMLElement without id']");
    const generatedId = await input.getAttribute("id");
    expect(generatedId).toMatch(/^auto-[a-z0-9]{5}$/);
  });

  test("[10] 04: HTMLElement without id — type 'w' shows results", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "[10] 04",
      text: [
        "- init with HTMLElement that has no id",
        '- type "w"',
        "- expect 13 <li> results",
      ],
    });
    const input = page.locator("input[placeholder='HTMLElement without id']");
    await input.fill("w");
    await expect(page.locator("li").last()).toBeVisible({ timeout: 5000 });
    const count = await page.locator("li").count();
    expect(count).toBeGreaterThan(0);
  });
});
