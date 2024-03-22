const tests = ["tests/Autocomplete.test.js"];

(async () => {
  const createTestCafe = require("testcafe");

  const options = {
    hostname: "localhost",
    port1: 1337,
    port2: 1338,
  };
  const testcafe = await createTestCafe(options);

  await testcafe
    .createRunner()
    .src(tests)
    .browsers("chrome:headless")
    .reporter([{ name: "spec", output: `reports/report-simple.txt` }])
    .concurrency(3)
    .run();

  await testcafe.close();
})();

// const createTestCafe = require("testcafe");

// let testcafe;
// let runner;
// let failedCount;

// createTestCafe()
//   .then((tc) => {
//     testcafe = tc;
//     runner = tc.createRunner();
//     return runner
//       .src("./tests/Autocomplete.test.js")
//       .browsers("chrome:headless")
//       .reporter([{ name: "spec", output: `reports/report-simple.txt` }])
//       .concurrency(3)
//       .run();
//   })
//   .then((actualFailedCount) => {
//     failedCount = actualFailedCount;
//     console.log("FAILED COUNT", actualFailedCount);
//     return testcafe.close();
//   })
//   .then(() => process.exit(failedCount));
