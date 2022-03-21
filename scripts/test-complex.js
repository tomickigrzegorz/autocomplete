const createTestCafe = require("testcafe");

const browsers = ["chrome:headless", "firefox:headless"];

let testcafe;
let runner;
let failedCount;

createTestCafe()
  .then((tc) => {
    testcafe = tc;
    runner = tc.createRunner();
    return (
      runner
        .src("./tests/Autocomplete.complex.test.js")
        // .browsers(browsers)
        .browsers("chrome:headless")
        // .browsers("chrome")
        // .reporter([{ name: "spec", output: "reports/report-complex.txt" }])
        .run()
    );
  })
  .then((actualFailedCount) => {
    failedCount = actualFailedCount;
    console.log("FAILED COUNT", actualFailedCount);
    return testcafe.close();
  })
  .then(() => process.exit(failedCount));
