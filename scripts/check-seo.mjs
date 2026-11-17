import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
const root = process.argv[2] || ".";
const base = "https://alessandrobertoletti.it/";
const read = (file) => readFile(path.join(root, file), "utf8");
function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map(([tag]) =>
    Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)].map(([, key, value]) => [key, value])),
  );
}
for (const [file, language, url] of [["index.html", "it", base], ["en/index.html", "en", base + "en/"]]) {
  const html = await read(file), links = tags(html, "link"), meta = tags(html, "meta");
  assert.equal(links.filter(t => t.rel === "canonical").length, 1);
  assert.equal(links.find(t => t.rel === "canonical").href, url);
  for (const [lang, href] of [["it", base], ["en", base + "en/"], ["x-default", base]])
    assert(links.some(t => t.hreflang === lang && t.href === href));
  assert(meta.find(t => t.name === "description")?.content.length > 80);
  assert(!meta.find(t => t.name === "robots")?.content.includes("noindex"));
  assert.equal(meta.find(t => t.property === "og:url")?.content, url);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const data = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(data["@graph"].find(t => t["@type"] === "ProfilePage").inLanguage, language);
  assert.equal(data["@graph"].find(t => t["@type"] === "Person")["@id"], base + "#person");
}
const sitemap = await read("sitemap.xml");
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]), [base, base + "en/"]);
const robots = await read("robots.txt");
assert(robots.includes(`Sitemap: ${base}sitemap.xml`));
assert(!/^Disallow:\s*\/(?:\s|postiz)/mi.test(robots), "Crawlers must be able to read Postiz noindex");
for (const file of await readdir(path.join(root, "postiz"))) {
  if (!file.endsWith(".html")) continue;
  const html = await read(`postiz/${file}`);
  assert(tags(html, "meta").find(t => t.name === "robots")?.content.includes("noindex"), `Missing noindex on ${file}`);
}
console.log(`SEO checks passed (${root}): canonical URLs, languages, schema, sitemap and Postiz noindex.`);
