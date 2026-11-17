import { mkdir, copyFile, cp, rm, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd();
const output = path.resolve(root, "dist");
if (path.dirname(output) !== root) throw new Error("Invalid build directory");
await rm(output, { recursive: true, force: true });
await mkdir(path.join(output, "public/portraits"), { recursive: true });
await copyFile("index.html", path.join(output, "index.html"));
await cp("src", path.join(output, "src"), { recursive: true });
await cp("en", path.join(output, "en"), { recursive: true });
await cp("postiz", path.join(output, "postiz"), { recursive: true });
for (const directory of ["companies", "projects", "portraits/optimized"]) {
  await cp(`public/${directory}`, path.join(output, "public", directory), {
    recursive: true,
  });
}
await copyFile("public/favicon.svg", path.join(output, "public/favicon.svg"));
await writeFile(path.join(output, ".nojekyll"), "");
console.log("Production site built in dist/ (optimized portraits only).");
