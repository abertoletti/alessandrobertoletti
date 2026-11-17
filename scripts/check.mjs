import { readdir, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
for (const directory of ["src", "scripts"]) {
  for (const file of await readdir(directory)) {
    if (!/\.m?js$/.test(file)) continue;
    new TextDecoder("utf-8", { fatal: true }).decode(await readFile(`${directory}/${file}`));
    const result = spawnSync(
      process.execPath,
      ["--check", `${directory}/${file}`],
      { stdio: "inherit" },
    );
    if (result.status !== 0) process.exit(result.status || 1);
  }
}
console.log("JavaScript syntax checks passed.");

await import("./check-seo.mjs");
