import { Selector } from "testcafe";

fixture`Show all results`.page`./show-all.html`;

const rootInput = Selector("#show-all");

const styleConsoleLog = (text) => {
  Object.entries(text).forEach(([key, value]) => {
    const description =
      key === "number" ? `\r\nTest: ${value}` : `${value.join("\r\n")}`;
    console.log(
      `\x1b[33m....................................\r\n${description}\x1b[0m`,
    );
  });
};

// --------------------------------------------------

test("test 01", async (t) => {
  const description = {
    number: "1",
    text: ["- count li elements - 63"],
  };

  styleConsoleLog(description);

  await t
    // count li elements
    .expect(Selector("li").count)
    .eql(63);
});

// --------------------------------------------------

test("test 02", async (t) => {
  const description = {
    number: "2",
    text: [
      "- take screenshot",
      "- click on 10 elements",
      "- take screenshot",
      '- check if input has attribute "aria-expanded" and is true',
      '- check if 10 element has class "auto-selected"',
      "- check if 5 element has aria-setsize is 63",
      "- check if 10 element has aria-selected is true",
      "- if button auto-clear is visible",
      '- if button auto-clear don\'t have class "hidden"',
    ],
  };

  styleConsoleLog(description);

  await t
    // take screenshot
    .takeScreenshot()

    // click on 10 elements
    .click(Selector("li").nth(10))

    // take screenshot
    .takeScreenshot()

    // check if input has attribute "aria-expanded" and is true
    .expect(rootInput.getAttribute("aria-expanded"))
    .eql("true")

    // check if 10 element has class "auto-selected"
    .expect(Selector("li").nth(10).hasClass("auto-selected"))
    .ok()

    // check if 5 element has aria-setsize is 63
    .expect(Selector("li").nth(5).getAttribute("aria-setsize"))
    .eql("63")

    // check if 10 element has aria-selected is true
    .expect(Selector("li").nth(10).getAttribute("aria-selected"))
    .eql("true")

    // if button auto-clear is visible
    .expect(rootInput.nextSibling("button").visible)
    .ok()

    // if button auto-clear don't have class "hidden"
    .expect(rootInput.nextSibling("button").hasClass("hidden"))
    .notOk();
});

// --------------------------------------------------
// 2x takeScreenshot

test("test 03", async (t) => {
  const description = {
    number: "3",
    text: [
      "- take screenshot",
      '- type "Adam"',
      '- check if root value is "Adam"',
      '- check if result has 1 element with class "auto-selected"',
      "- take screenshot",
      "- click on button to clear input",
      '- check if root value is ""',
      "- wait 3s",
      "- check if results has 63 elements",
    ],
  };

  styleConsoleLog(description);

  await t
    // take screenshot
    .takeScreenshot()

    // type "Adam"
    .typeText(rootInput, "Adam")

    // check if root value is "Adam"
    .expect(rootInput.value)
    .eql("Adam")

    // check if result has 1 element with class "auto-selected"
    .expect(Selector("li").count)
    .eql(1)

    // take screenshot
    .takeScreenshot()

    // click on button to clear input has class auto-clear
    .click(rootInput.nextSibling("button"))

    // check if root value is ""
    .expect(rootInput.value)
    .eql("")

    // wait 3s
    .wait(3000)

    // check if results has 63 elements
    .expect(Selector("li").count)
    .eql(63);
});
