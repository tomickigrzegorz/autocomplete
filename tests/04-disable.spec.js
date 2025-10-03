import { test, expect } from "@playwright/test";
import path from "path";

const localFile =
  "file://" + path.join(process.cwd(), "public", "disable.html");

const styleConsoleLog = (text) => {
  Object.entries(text).forEach(([key, value]) => {
    const description =
      key === "number" ? `\r\nTest: ${value}` : `${value.join("\r\n")}`;
    console.log(
      `\x1b[33m....................................\r\n${description}\x1b[0m`,
    );
  });
};

async function typeW(page) {
  const input = page.locator("#disable");
  await input.fill("w");
  return input;
}

async function typeWAndGetItems(page) {
  const input = await typeW(page);
  const items = page.locator("li");
  await expect(items).toHaveCount(3);
  return { input, items };
}

test.describe("Autocomplete disable granular tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(localFile);
  });

  test("01: type 'w'", async ({ page }) => {
    styleConsoleLog({ number: "1", text: ['- type "w"'] });
    const input = await typeW(page);
    await expect(input).toHaveValue("w");
  });

  test("02: count li elements - 3", async ({ page }) => {
    styleConsoleLog({ number: "2", text: ["- count li elements - 3"] });
    await typeWAndGetItems(page);
  });

  test("03: clear button visible & has class", async ({ page }) => {
    styleConsoleLog({
      number: "3",
      text: ['- check if button has class "auto-clear" and is visible'],
    });
    await typeWAndGetItems(page);
    const button = page.locator("button");
    await expect(button).toHaveClass(/auto-clear/);
    await expect(button).toBeVisible();
  });

  test("04: aria-expanded true after typing", async ({ page }) => {
    styleConsoleLog({
      number: "4",
      text: ['- check if input #disable has atribute aria-expanded="true"'],
    });
    const { input } = await typeWAndGetItems(page);
    await expect(input).toHaveAttribute("aria-expanded", "true");
  });

  test("05: click first li element", async ({ page }) => {
    styleConsoleLog({ number: "5", text: ["- click on first li element"] });
    const { items } = await typeWAndGetItems(page);
    await items.first().click();
  });

  test("06: clear button hidden & aria-expanded false after selection", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "6",
      text: [
        "- check if button is not visible",
        "- aria-expanded becomes false",
      ],
    });
    const { input, items } = await typeWAndGetItems(page);
    const button = page.locator("button");
    await items.first().click();
    await expect(button).not.toBeVisible();
    await expect(input).toHaveAttribute("aria-expanded", "false");
  });

  test("07: after selecting & retyping results list empty (disabled state)", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "7",
      text: ['- type "w" again', "- check if #auto-disable-results is empty"],
    });
    const { input, items } = await typeWAndGetItems(page);
    await items.first().click();
    await input.fill("w");
    const results = page.locator("#auto-disable-results");
    await expect(results).toBeEmpty();
  });

  test("08: refresh page input cleared", async ({ page }) => {
    styleConsoleLog({
      number: "8",
      text: ["- refreash page and check if input is empty"],
    });
    const input = await typeW(page);
    await page.reload();
    await expect(input).toHaveValue("");
  });

  test("09: retype after refresh", async ({ page }) => {
    styleConsoleLog({ number: "9", text: ['- type "w" again'] });
    const input = await typeW(page);
    await expect(input).toHaveValue("w");
  });

  test("10: list has 3 items again", async ({ page }) => {
    styleConsoleLog({
      number: "10",
      text: ["- check if #auto-disable-results has 3 li elements"],
    });
    const { items } = await typeWAndGetItems(page);
    await expect(items).toHaveCount(3);
  });
});
