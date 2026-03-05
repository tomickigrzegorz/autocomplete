import { test, expect } from "@playwright/test";
import path from "node:path";

const localFile = `file://${path.join(process.cwd(), "public", "dropdown-parent.html")}`;

const styleConsoleLog = (text) => {
  Object.entries(text).forEach(([key, value]) => {
    const description =
      key === "number" ? `\r\nTest: ${value}` : `${value.join("\r\n")}`;
    console.log(
      `\x1b[33m....................................\r\n${description}\x1b[0m`,
    );
  });
};

test.describe("dropdownParent option tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(localFile);
  });

  test("01: dropdown is appended to body, not to wrapper", async ({ page }) => {
    styleConsoleLog({
      number: "1",
      text: [
        '- type "w"',
        "- expect results visible",
        "- expect result list is child of body, not of .overflow-box",
      ],
    });
    const input = page.locator("#dropdown-parent");
    await input.fill("w");

    await expect(page.locator("li")).toHaveCount(3, { timeout: 5000 });

    // result wrapper should be a direct child of body
    const resultWrap = page.locator("body > .auto-is-active");
    await expect(resultWrap).toBeAttached();
  });

  test("02: typing shows correct results", async ({ page }) => {
    styleConsoleLog({
      number: "2",
      text: ['- type "w"', "- expect 3 results (Walter White, Walter Jr., Skyler White)"],
    });
    const input = page.locator("#dropdown-parent");
    await input.fill("w");

    await expect(page.locator("li")).toHaveCount(3, { timeout: 5000 });
  });

  test("03: selecting item sets input value", async ({ page }) => {
    styleConsoleLog({
      number: "3",
      text: [
        '- type "jesse"',
        "- expect 1 result",
        "- press Enter",
        '- expect input value "Jesse Pinkman"',
      ],
    });
    const input = page.locator("#dropdown-parent");
    await input.fill("jesse");

    await expect(page.locator("li")).toHaveCount(1, { timeout: 5000 });

    await page.keyboard.press("Enter");
    await expect(input).toHaveValue("Jesse Pinkman");
  });

  test("04: dropdown closes on outside click", async ({ page }) => {
    styleConsoleLog({
      number: "4",
      text: [
        '- type "w"',
        "- expect dropdown open",
        "- click outside",
        "- expect dropdown closed",
      ],
    });
    const input = page.locator("#dropdown-parent");
    await input.fill("w");

    await expect(page.locator("li")).toHaveCount(3, { timeout: 5000 });
    await expect(input).toHaveAttribute("aria-expanded", "true");

    await page.click("body", { position: { x: 10, y: 10 } });

    await expect(input).toHaveAttribute("aria-expanded", "false");
  });

  test("05: keyboard navigation works", async ({ page }) => {
    styleConsoleLog({
      number: "5",
      text: [
        '- type "w"',
        "- ArrowDown x2",
        '- expect second item "Skyler White" highlighted',
        "- Enter to select",
      ],
    });
    const input = page.locator("#dropdown-parent");
    await input.fill("w");

    await expect(page.locator("li")).toHaveCount(3, { timeout: 5000 });

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");

    const selected = page.locator(".auto-selected p");
    await expect(selected).toHaveText("Skyler White");

    await page.keyboard.press("Enter");
    await expect(input).toHaveValue("Skyler White");
  });
});
