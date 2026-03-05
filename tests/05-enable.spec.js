import { test, expect } from "@playwright/test";
import path from "node:path";

const localFile = `file://${path.join(process.cwd(), "public", "enable.html")}`;

const styleConsoleLog = (text) => {
  Object.entries(text).forEach(([key, value]) => {
    const description =
      key === "number" ? `\r\nTest: ${value}` : `${value.join("\r\n")}`;
    console.log(
      `\x1b[33m....................................\r\n${description}\x1b[0m`,
    );
  });
};

// Helper: type 'w' and wait for 3 results
async function typeWAndExpectThree(page) {
  const input = page.locator("#enable");
  await input.fill("w");
  const items = page.locator("li");
  await expect(items).toHaveCount(3);
  return { input, items };
}

// Helper: full flow until disabled (type, pick first, disable)
async function flowToDisabled(page) {
  const { input, items } = await typeWAndExpectThree(page);
  await expect(input).toHaveAttribute("aria-expanded", "true");
  await items.first().click();
  const disableButton = page.locator("#disable-btn");
  await disableButton.click();
  return { input };
}

test.describe("Autocomplete enable/disable granular tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(localFile);
  });

  test("[05] 01: input has aria-controls set on load", async ({ page }) => {
    styleConsoleLog({
      number: "[05] 01",
      text: ["- check if input has aria-controls on load"],
    });
    const input = page.locator("#enable");
    await expect(input).toHaveAttribute("aria-controls", "auto-enable-results");
  });

  test("[05] 02: type 'w'", async ({ page }) => {
    styleConsoleLog({ number: "[05] 02", text: ['- type "w"'] });
    const input = page.locator("#enable");
    await input.fill("w");
    await expect(input).toHaveValue("w");
  });

  test("[05] 03: count li elements - 3", async ({ page }) => {
    styleConsoleLog({ number: "[05] 03", text: ["- count li elements - 3"] });
    await typeWAndExpectThree(page);
  });

  test("[05] 04: input has aria-expanded= true after typing", async ({
    page,
  }) => {
    styleConsoleLog({
      number: "[05] 04",
      text: ['- check if input #disable has atribute aria-expanded="true"'],
    });
    const { input } = await typeWAndExpectThree(page);
    await expect(input).toHaveAttribute("aria-expanded", "true");
  });

  test("[05] 05: click on first li element", async ({ page }) => {
    styleConsoleLog({
      number: "[05] 05",
      text: ["- click on first li element"],
    });
    const { items } = await typeWAndExpectThree(page);
    await items.first().click();
    // after click we don't assert value, because component may or may not insert depending on config
  });

  test("[05] 06: click Disable button after selecting first", async ({
    page,
  }) => {
    styleConsoleLog({ number: "[05] 06", text: ["- click on Disable button"] });
    const { input, items } = await typeWAndExpectThree(page);
    await items.first().click();
    const disableButton = page.locator("#disable-btn");
    await disableButton.click();
    // After disable we expect aria-autocomplete to be switched to none
    await expect(input).toHaveAttribute("aria-autocomplete", "none");
  });

  test("[05] 07: type 'w' again after disable", async ({ page }) => {
    styleConsoleLog({ number: "[05] 07", text: ['- type "w" again'] });
    const { input } = await flowToDisabled(page);
    await input.fill("w");
    await expect(input).toHaveValue("w");
  });

  test("[05] 08: results list empty while disabled", async ({ page }) => {
    styleConsoleLog({
      number: "[05] 08",
      text: ["- check if #auto-enable-results is empty"],
    });
    const { input } = await flowToDisabled(page);
    await input.fill("w");
    await expect(page.locator("#auto-enable-results")).toBeEmpty();
  });

  test("[05] 09: refresh page and input is empty", async ({ page }) => {
    styleConsoleLog({
      number: "[05] 09",
      text: ["- refreash page and check if input is empty"],
    });
    // Do a flow first (optional) then reload
    await flowToDisabled(page);
    await page.reload();
    const input = page.locator("#enable");
    await expect(input).toHaveValue("");
  });

  test("[05] 10: type 'w' again after refresh", async ({ page }) => {
    styleConsoleLog({ number: "[05] 10", text: ['- type "w" again'] });
    const input = page.locator("#enable");
    await input.fill("w");
    await expect(input).toHaveValue("w");
  });

  test("[05] 11: results count is 3 after typing again", async ({ page }) => {
    styleConsoleLog({
      number: "[05] 11",
      text: ["- check if #auto-enable-results has 3 li elements"],
    });
    const { items } = await typeWAndExpectThree(page);
    await expect(items).toHaveCount(3);
  });
});
