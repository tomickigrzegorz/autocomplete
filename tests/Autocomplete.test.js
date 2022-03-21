import { Selector } from "testcafe";

fixture`Basics example`.page`./simple-test.html`;

const rootInput = Selector("#simple");

const styleConsoleLog = (text) => {
  Object.entries(text).forEach(([key, value]) => {
    const description =
      key === "number" ? `\r\nTest: ${value}` : `${value.join("\r\n")}`;
    console.log(
      `\x1b[33m....................................\r\n${description}\x1b[0m`
    );
  });
};

// --------------------------------------------------

test('test 01: Type "w" and count li elements - 13', async (t) => {
  const description = {
    number: "1",
    text: ['- type "w"', "- count li elements - 13"],
  };

  styleConsoleLog(description);

  await t
    // set value to input "w"
    .typeText(rootInput, "w")

    // count li elements
    .expect(Selector("li").count)
    .eql(13);
});

// --------------------------------------------------

test("test 02: Check if exist aria and class", async (t) => {
  const description = {
    number: "2",
    text: [
      '- type "w"',
      '- check if root has atribute "aria-expanded" with value "true"',
      '- check if root has class "auto-expanded"',
      '- check if root nextSibling div has class "auto-is-active"',
    ],
  };

  styleConsoleLog(description);

  await t
    // set value to input "w"
    .typeText(rootInput, "w")

    // check if input has attribute "aria-expanded"
    .expect(rootInput.withAttribute("aria-expanded", "true").exists)
    .ok()

    // check if input has class "auto-expanded"
    .expect(rootInput.hasClass("auto-expanded"))
    .ok()

    // check if next element have class auto-is-active
    .expect(rootInput.nextSibling("div").hasClass("auto-is-active"))
    .ok();
});

// --------------------------------------------------
// 3x takeScreenshot

test("test 03: Press 3x down and check selected element", async (t) => {
  const description = {
    number: "3",
    text: [
      '- type "w"',
      "- wait 2 seconds",
      '- press key "down" 3x',
      '- check if selected element has text "Duane Chow"',
      "- press enter",
      "- wait 2 seconds",
      '- check if root value is "Duane Chow"',
      "- click on root nextSibling div (x button)",
      "- check if root value is empty",
    ],
  };

  styleConsoleLog(description);

  await t
    // set value to input "w"
    .typeText(rootInput, "w")

    // wait 2 seconds
    .wait(2000)

    // press 3x down
    .pressKey("down down down")

    .expect(Selector(".auto-selected", { timeout: 500 }).innerText)
    .eql("Duane Chow")

    // press enter
    .pressKey("enter")

    // wait 2 seconds
    .wait(2000)

    .expect(rootInput.value)
    .eql("Duane Chow")

    // click to clear button
    .click(rootInput.nextSibling("button"))

    // check if input has value ""
    .expect(rootInput.value)
    .eql("");
});
