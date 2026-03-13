/**
 * Verifies that CSS --duration-* vars in globals.css match the JS config.
 * Run: pnpm check:timing
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Dynamic import of the config (ESM)
const { base, CSS_DURATION_MAP } = await import(
  resolve(__dirname, "../config/animation-config.js")
);

const cssPath = resolve(__dirname, "../app/globals.css");
const css = readFileSync(cssPath, "utf-8");

let ok = true;

for (const [jsKey, cssVar] of Object.entries(CSS_DURATION_MAP)) {
  const jsValue = base[jsKey];

  // Match e.g. --duration-exit: 300ms;
  const re = new RegExp(`${cssVar.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}:\\s*(\\d+)ms`);
  const match = css.match(re);

  if (!match) {
    console.error(`✗ ${cssVar} not found in globals.css`);
    ok = false;
    continue;
  }

  const cssValue = Number(match[1]);
  if (cssValue !== jsValue) {
    console.error(
      `✗ ${cssVar}: CSS=${cssValue}ms, JS base.${jsKey}=${jsValue}ms`
    );
    ok = false;
  } else {
    console.log(`✓ ${cssVar}: ${cssValue}ms`);
  }
}

if (!ok) {
  console.error("\nTiming sync check FAILED — fix mismatches above.");
  process.exit(1);
} else {
  console.log("\nAll timings in sync.");
}
