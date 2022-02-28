import { Selector, ClientFunction } from "testcafe";

fixture`Basics example`.page`./complex-test.html`;

const rootInput = Selector("#complex");
const results = "#auto-complex-results";

const autoSelectedID = Selector("#auto-selected-option-0");

// --------------------------------------------------
// test 1

test('test 01: Type "w" and check if class exist', async (t) => {
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

test('test 02: Type "wal" and count li elements', async (t) => {
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

test("test 03: Check if first element is Walter Jr.", async (t) => {
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

test('test 05: Key press "down" to Wlater White', async (t) => {
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

test('test 06: Check ".group-by" class', async (t) => {
  await t
    // set value to input "w"
    .typeText(rootInput, "wal")

    // wait 1 seconds
    .wait(1000)

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

    .expect(Selector(".auto-is-active").exists)
    .ok()

    .expect(Selector(".auto-clear").visible)
    .ok()

    .expect(autoSelectedID.withAttribute("aria-posinset", "0").exists)
    .ok()

    .expect(autoSelectedID.withAttribute("aria-setsize", "2").exists)
    .ok()

    .expect(autoSelectedID.withAttribute("tabindex", "-1").exists)
    .ok()

    .expect(autoSelectedID.withAttribute("role", "option").exists)
    .ok()

    // take screenshot
    // suld be beakingbadapi.com site
    .takeScreenshot();
});

// --------------------------------------------------
// test 9

test("test 09: Check if bottom element have link, click and open tab", async (t) => {
  const getHost = ClientFunction(() => location.host);

  await t
    // set value to input "w"
    .typeText(rootInput, "walter", { paste: true })

    // wait 1 seconds
    .wait(1000)

    // get text from first element
    .expect(Selector(".additional-elements").textContent)
    .eql("Data come from breakingbadapi.com")

    // take screenshot
    .takeScreenshot()

    // click on link
    .click(Selector(".link-to-api").withText("breakingbadapi.com"))

    // open new tab with link to api
    .expect(getHost())
    .eql("breakingbadapi.com")

    // take screenshot
    // suld be beakingbadapi.com site
    .takeScreenshot();
});

// --------------------------------------------------
// test 10
// 3x takeScreenshot

test("test 10: Press 3x down and check selected element", async (t) => {
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
// test 11

test("test 11: Press active-modal class exist", async (t) => {
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
