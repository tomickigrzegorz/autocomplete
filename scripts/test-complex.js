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
        .browsers(browsers)
        // .reporter([{ name: "spec", output: "reports/report-complex.txt" }])
        .run()
    );
  })
  .then((actualFailedCount) => {
    failedCount = actualFailedCount;
    return testcafe.close();
  })
  .then(() => process.exit(failedCount));