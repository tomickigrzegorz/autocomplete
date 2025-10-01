import fs from "fs";
import path from "path";

export function getScreenshotPath(fileOrName, maybeName) {
  const today = new Date();
  const dateFolder = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  let dir = path.join(process.cwd(), "test-results", "screenshots", dateFolder);

  let safeFile;
  if (maybeName) {
    dir = path.join(dir, fileOrName);
    safeFile = maybeName;
  } else {
    safeFile = fileOrName;
  }

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  return path.join(dir, safeFile);
}
