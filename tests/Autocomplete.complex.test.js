import { Selector, ClientFunction } from "testcafe";

const addTimeStampForConsoleMessages = `
  const storedConsoleLog = console.log;
  console.log = function (message) {
      const modifiedMsg = JSON.stringify({message});
  
      storedConsoleLog.call(this, modifiedMsg);
  };
`;

const openAccountDropdown = ClientFunction(() => {
  const element = document.querySelector("#show-object");

  element.className = "show-object";
});

const styleConsoleLog = (text) => {
  Object.entries(text).forEach(([key, value]) => {
    const description =
      key === "number" ? `\r\nTest: ${value}` : `${value.join("\r\n")}`;
    console.log(
      `\x1b[33m....................................\r\n${description}\x1b[0m`,
    );
  });
};

fixture`Complex example`.page`./complex-test.html`.clientScripts({
  content: addTimeStampForConsoleMessages,
});

const rootInput = Selector("#complex");
const results = "#auto-complex-results";

const autoSelectedID = Selector("#auto-selected-option-0");

// --------------------------------------------------
// test 1

test('Test 01: Type "w" and check if class ".auto-expanded" exist', async (t) => {
  const description = {
    number: "1",
    text: [
      '- type "w"',
      '- check if results container has class "auto-expanded"',
    ],
  };

  styleConsoleLog(description);

  await t
    // set value to input "w"
    .typeText(rootInput, "w")

    // check if class expanded is added to root
    .expect(Selector(results).hasClass("auto-expanded"))
    .notOk()

    // take screenshot
    .takeScreenshot();
});

// --------------------------------------------------
// test 2

test('test 02: Type "wal" and count li elements and root hasClass "auto-exapnded"', async (t) => {
  const description = {
    number: "2",
    text: [
      '- type "wal"',
      "- count li elements",
      '- check if root input has class "auto-expanded"',
    ],
  };

  styleConsoleLog(description);

  await t
    // set value to input "w"
    .typeText(rootInput, "wal")

    // count li elements should be equal to 4
    // 2 for person and 2 for "group-by"
    .expect(Selector("li").count)
    .eql(4)

    // check if class expanded is added to root
    .expect(Selector(rootInput).hasClass("auto-expanded"))
    .ok();
});

// --------------------------------------------------
// test 3

test("test 03: Check if first element is Walter Jr. and is inside h2", async (t) => {
  const description = {
    number: "3",
    text: [
      '- type "wal"',
      "- check if selected element is Walter Jr. isinside h2",
      "- take screenshot",
    ],
  };

  styleConsoleLog(description);

  await t
    // set value to input "w"
    .typeText(rootInput, "wal")

    // get first element width class auto-selected
    // get text from h2
    .expect(Selector(".auto-selected > h2").innerText)
    .eql("Walter White Jr.")

    // take screenshot
    .takeScreenshot();
});

// --------------------------------------------------
// test 4

test('test 04: Key press "down" to Wlater White', async (t) => {
  const description = {
    number: "4",
    text: [
      '- type "w"',
      '- press key "down"',
      '- check if selected element has text "Walter White" inside h2',
      '- check if root input value is "Walter White"',
      "- take screenshot",
    ],
  };

  styleConsoleLog(description);

  await t
    // set value to input "w"
    .typeText(rootInput, "wal")

    // wait 2 seconds
    .wait(2000)

    // key press "down"
    .pressKey("down")

    // get text from selected element
    .expect(Selector(".auto-selected > h2").innerText)
    .eql("Walter White")

    // input value should be "walter white"
    .expect(rootInput.value)
    .eql("Walter White")

    // take screenshot
    .takeScreenshot();
});

// --------------------------------------------------
// test 5

test('test 05: Key press "down" to Wlater White and press x (clear button)', async (t) => {
  const description = {
    number: "5",
    text: [
      '- type "wal"',
      "- wait 2 seconds",
      "- press key 'down'",
      "- wait 2 seconds",
      '- check if "auto-selected" element has text "Walter White" inside h2',
      "- take screenshot",
      '- click on "x" button',
      "- check if root value is empty",
      "- take screenshot",
    ],
  };

  styleConsoleLog(description);

  await t
    // set value to input "w"
    .typeText(rootInput, "wal")

    // wait 2 seconds
    .wait(2000)

    // key press "down"
    .pressKey("down")

    // wait 2 seconds
    .wait(2000)

    // get text from second element
    .expect(Selector(".auto-selected", { timeout: 500 }).child("h2").innerText)
    .eql("Walter White")

    // input value should be "walter white"
    .expect(rootInput.value)
    .eql("Walter White")

    // take screenshot
    .takeScreenshot()

    // click to clear button clear
    .click(rootInput.nextSibling("button"))

    // input value should be empty
    .expect(rootInput.value)
    .eql("")

    // take screenshot
    .takeScreenshot();
});

// --------------------------------------------------
// test 6
test('test 06: Count ".group-by", get text from first and the third li', async (t) => {
  const description = {
    number: "6",
    text: [
      "- set test speed to 0.1",
      '- type "wal"',
      "- wait 1 seconds",
      '- count ".group-by"',
      '- check first element has text "Alive 1 items"',
      '- check third element has text "Dead 1 items"',
      "- take screenshot",
    ],
  };

  styleConsoleLog(description);

  await t
    .setTestSpeed(0.1)
    // set value to input "w"
    .typeText(rootInput, "wal")

    // wait 1 seconds
    .wait(1000)

    // count class group-by
    .expect(Selector(".group-by").count)
    .eql(2)

    // get text from first element
    .expect(Selector(".group-by:nth-child(1)").textContent)
    .eql("Alive 1 items")

    // get text from first element
    .expect(Selector("li:nth-child(3)").textContent)
    .eql("Presumed dead 1 items")

    // take screenshot
    .takeScreenshot();
});

// --------------------------------------------------
// test 7

test("test 07: No results", async (t) => {
  const description = {
    number: "7",
    text: [
      '- paste "świnka" to root input',
      "- wait 1 seconds",
      '- check if root input value is "świnka"',
      "- wait 1 seconds",
      '- check if "auto-selected" element has text "No results"',
      "- take screenshot",
      '- press key "esc"',
      "- close data list",
      "- take screenshot",
      '- click on "x" button',
      "- check if root input value is empty",
      "- take screenshot",
    ],
  };

  styleConsoleLog(description);

  await t
    // set value to input "w"
    .typeText(rootInput, "świnka", { paste: true })

    // wait 1 seconds
    .wait(1000)

    // get text from root
    .expect(rootInput.value)
    .eql("świnka")

    .wait(1000)

    // get text from first element
    .expect(Selector(".auto-selected").textContent)
    .eql('No results found: "świnka"')

    // take screenshot
    .takeScreenshot()

    // press "esc"
    .pressKey("esc")

    // take screenshot
    .takeScreenshot()

    // clear data from input
    .click(rootInput.nextSibling("button"))
    .expect(rootInput.value)
    .eql("")

    // take screenshot
    .takeScreenshot();
});

// --------------------------------------------------
// test 8

test("test 08: Check all aria class in root - input", async (t) => {
  const description = {
    number: "8",
    text: [
      '- check if "auto-clear" is visible',
      '- type "walter"',
      "- wait 2 seconds",
      '- check if root has attribute "aria-expanded" with value "true"',
      '- check if root has attribute "aria-describedby" with value "instruction"',
      '- check if root has attribute "aria-label" with value "Search for a name"',
      '- check if root has attribute "aria-expanded" with value "true"',
      '- check if class "auto-selected" is exists',
      "-------------------------------------------------------------------------",
      '- check if selected element has attribute "aria-selected" with value "true"',
      '- check that the selected element does not have an "aria-posinset" attribute of "0"',
      '- check if selected element has attribute "aria-setsize" with value "2"',
      '- check if selected element has attribute "tabindex" with value "-1"',
      '- check if selected element has attribute "role" with value "option"',
      '- check if "auto-is-active" is exists',
      '- check if "auto-clear" is visible (x button)',
      "- take screenshot",
    ],
  };

  styleConsoleLog(description);

  await t
    // check is button clear is visible
    .expect(Selector(".auto-clear").visible)
    .eql(false)

    // set value to input "w"
    .typeText(rootInput, "walter")

    // wait 2 seconds
    .wait(2000)

    // --------------------------------------------------
    // inout aria-expanded and class
    .expect(rootInput.withAttribute("aria-expanded", "true").exists)
    .ok()

    .expect(rootInput.withAttribute("aria-describedby", "instruction").exists)
    .ok()

    .expect(rootInput.withAttribute("aria-label", "Search for a name").exists)
    .ok()

    .expect(rootInput.withAttribute("aria-expanded", "true").exists)
    .ok()

    .expect(Selector(".auto-selected").exists)
    .ok()

    // --------------------------------------------------
    // div width data

    .expect(autoSelectedID.withAttribute("aria-selected", "true").exists)
    .ok()

    .expect(autoSelectedID.withAttribute("aria-posinset", "0").exists.notOk())
    .ok()

    .expect(autoSelectedID.withAttribute("aria-setsize", "2").exists)
    .ok()

    .expect(autoSelectedID.withAttribute("tabindex", "-1").exists)
    .ok()

    .expect(autoSelectedID.withAttribute("role", "option").exists)
    .ok()

    .expect(Selector(".auto-is-active").exists)
    .ok()

    .expect(Selector(".auto-clear").visible)
    .ok()

    // take screenshot
    // suld be beakingbadapi.com site
    .takeScreenshot();
});

// --------------------------------------------------
// test 9
// 3x takeScreenshot

test("test 09: Press 3x down and check selected element", async (t) => {
  const description = {
    number: "9",
    text: [
      '- type "wal"',
      "- wait 2 seconds",
      '- pres key "down"',
      '- get text from "auto-selected" element is "Walter White"',
      "- take screenshot",
      '- pres key "enter"',
      "- wait 2 seconds",
      '- check if root input has value "Walter White"',
      "- take screenshot",
      '- click on "x" button',
      '- check if root input has value ""',
      "- take screenshot",
    ],
  };

  styleConsoleLog(description);

  await t
    // set value to input "w"
    .typeText(rootInput, "wal")

    // wait 2 seconds
    .wait(2000)

    // press 3x down
    .pressKey("down")

    // first element should be selected
    // and h2 should be have text "Walter White"
    .expect(Selector(".auto-selected", { timeout: 500 }).child("h2").innerText)
    .eql("Walter White")

    // take screenshot
    .takeScreenshot()

    // press down enter
    .pressKey("enter")

    // wait 2 seconds
    .wait(2000)

    .expect(rootInput.value)
    .eql("Walter White")

    // take screenshot
    .takeScreenshot()

    // click to clear button
    .click(rootInput.nextSibling("button"))

    // check if input has value ""
    .expect(rootInput.value)
    .eql("")

    // take screenshot
    .takeScreenshot();
});

// --------------------------------------------------
// test 10

test("test 10: Press active-modal class exist", async (t) => {
  const description = {
    number: "10",
    text: [
      '- type "wal"',
      "- wait 2 seconds",
      "- hover on first li element",
      '- check if "active-modal" class exist',
      '- pres key "down, enter"',
      '- check if root input has value "Walter White"',
      '- check if "active-modal" class exist, exept false',
      "- take screenshot",
    ],
  };

  styleConsoleLog(description);

  await t
    // set value to input "w"
    .typeText(rootInput, "wal")

    // wait 2 seconds
    .wait(2000)

    // hover on second element
    .hover(Selector("li:nth-child(1)"))

    // callback function onOpened
    // add active-modal class to body
    .expect(Selector(".active-modal").exists)
    .ok()

    // remove style from body
    // press enter on li
    // expect Walter White Jr. in input
    .pressKey("down enter")
    .expect(rootInput.value)
    .eql("Walter White")

    // check if class active-modal is not exist
    .expect(Selector(".active-modal").exists)
    .notOk()

    // take screenshot
    .takeScreenshot();
});

// --------------------------------------------------
// test 11

test("test 11: Check input field when press arrow down", async (t) => {
  const description = {
    number: "11",
    text: [
      '- type "wal"',
      "- wait 2 seconds",
      '- press key "down"',
      '- check if root input has value "Walter White"',
      "- take screenshot",
      '- press key "down"',
      '- check if root input value is "wal"',
      "- take screenshot",
      '- press key "down"',
      '- check if root input value is "Walter White Jr."',
      "- take screenshot",
    ],
  };

  styleConsoleLog(description);

  await t
    // .setTestSpeed(0.1)
    // set value to input "wal"
    .typeText(rootInput, "wal")

    // wait 2 seconds
    .wait(2000)

    // press down arrow
    // expect Walter White in input
    .pressKey("down")
    .expect(rootInput.value)
    .eql("Walter White")

    // take screenshot
    .takeScreenshot()

    // press down arrow
    // now you on input filed
    .pressKey("down")
    // get value from input
    // this time is get data from cache
    .expect(rootInput.value)
    .eql("wal")

    // take screenshot
    .takeScreenshot()

    // press down arrow
    // expect Walter White Jr. in input
    // and li also have class active
    .pressKey("down")
    .expect(rootInput.value)
    .eql("Walter White Jr.")

    // take screenshot
    .takeScreenshot();
});

// --------------------------------------------------
// test 12

test("test 12: Check console.log", async (t) => {
  const description = {
    number: "12",
    text: [
      '- add class to textarea "show-object", border 1px solid red',
      '- type "wal"',
      '- press key "down" x2',
      '- check if root input value is still "wal"',
      "- take screenshot",
      "- after test read console.log and print in terminal, the result is:",
      "{ index: 0, countObject: 1 }",
      "{ index: 1, countObject: 1 }",
      "{ index: null, countObject: 'not exist' }",
      "....................................",
    ],
  };

  styleConsoleLog(description);

  await openAccountDropdown();
  await t
    .setTestSpeed(0.1)
    // set value to input "wal"
    .typeText(rootInput, "wal")

    // press down x2 arrow
    // expect Walter White in input
    .pressKey("down down")
    .expect(rootInput.value)
    .eql("wal")
    .takeScreenshot();
}).after(async (t) => {
  const { log } = await t.getBrowserConsoleMessages();

  const obj = log.sort((i) => i);

  function objectEntries(obj) {
    return Object.entries(obj);
  }

  objectEntries(obj).forEach(([key, value]) => {
    const { index, object } = JSON.parse(value).message;
    const countObject = object !== null ? objectEntries.length : "not exist";
    console.dir({ index, countObject });
  });
});
