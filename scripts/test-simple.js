const tests = ["tests/Autocomplete.test.js"];

(async () => {
  const createTestCafe = require("testcafe");
  // const browsers = ["chrome:headless", "firefox:headless"];

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
    // .browsers("chrome") // open browser
    .reporter([{ name: "spec", output: `reports/report-simple.txt` }])
    .concurrency(3)
    .run();

  await testcafe.close();
})();
