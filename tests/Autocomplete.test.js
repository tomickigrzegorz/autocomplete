import { Selector } from "testcafe";

fixture`Basics example`.page`./simple-test.html`;

const rootInput = Selector("#simple");

// --------------------------------------------------

test('test 01: Type "w" and count li elements', async (t) => {
  await t
    // set value to input "w"
    .typeText(rootInput, "w")

    // count li elements
    .expect(Selector("li").count)
    .eql(13);
});

// --------------------------------------------------

test("test 02: Check if exist aria and class", async (t) => {
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
