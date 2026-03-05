import fs from "node:fs";
const { version } = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url)));

const VERSION_REGEX = /@(\d+\.\d+\.\d+)\/dist/i;

const files = ["README.md", "docs/index.html"];

for (const file of files) {
  try {
    const data = fs.readFileSync(file, "utf8");
    const match = data.match(VERSION_REGEX);

    if (!match) {
      console.warn(`[version] No version found in ${file}, skipping.`);
      continue;
    }

    const oldVersion = match[1];

    if (oldVersion === version) {
      console.log(`[version] ${file} already at ${version}, skipping.`);
      continue;
    }

    const updated = data.replaceAll(oldVersion, version);
    fs.writeFileSync(file, updated, "utf8");
    console.log(`[version] ${file}: ${oldVersion} → ${version}`);
  } catch (err) {
    console.error(`[version] Error processing ${file}:`, err.message);
  }
}
