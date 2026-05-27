import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const html = readFileSync("dist/index.html", "utf8");
const headers = readFileSync("dist/_headers", "utf8");

const scriptBodies = [
  ...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g),
]
  .map((m) => m[1])
  .filter((body) => body.trim() !== "");

const expected = new Set(
  scriptBodies.map(
    (body) =>
      "sha256-" + createHash("sha256").update(body, "utf8").digest("base64"),
  ),
);

const cspLine = headers
  .split(/\r?\n/)
  .find((l) => l.trim().startsWith("Content-Security-Policy:"));

if (!cspLine) {
  console.error("verify-csp-hashes: no Content-Security-Policy header found");
  process.exit(1);
}

const scriptSrcMatch = cspLine.match(/script-src ([^;]+)/);
if (!scriptSrcMatch) {
  console.error("verify-csp-hashes: script-src directive missing from CSP");
  process.exit(1);
}

const declared = new Set(
  [...scriptSrcMatch[1].matchAll(/'sha256-[A-Za-z0-9+/=]+'/g)].map((m) =>
    m[0].slice(1, -1),
  ),
);

const missing = [...expected].filter((h) => !declared.has(h));
const extra = [...declared].filter((h) => !expected.has(h));

if (missing.length || extra.length) {
  if (missing.length) {
    console.error("verify-csp-hashes: missing in CSP script-src");
    for (const h of missing) console.error("  + " + h);
  }
  if (extra.length) {
    console.error("verify-csp-hashes: declared in CSP but not in dist");
    for (const h of extra) console.error("  - " + h);
  }
  process.exit(1);
}

console.log(
  `verify-csp-hashes: OK (${expected.size} inline script hash(es) match)`,
);
