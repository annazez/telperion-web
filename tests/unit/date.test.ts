import test from "node:test";
import assert from "node:assert";
import { formatDate } from "../../src/utils/date.ts";

test("formatDate utility - Czech (default)", () => {
  const date = new Date("2023-12-24");
  const formatted = formatDate(date);
  // cs-CZ formatting: '24. prosince 2023' (or similar, checking for year and month name)
  assert.match(formatted, /24\./);
  assert.match(formatted, /prosince/);
  assert.match(formatted, /2023/);
});

test("formatDate utility - English", () => {
  const date = new Date("2023-12-24");
  const formatted = formatDate(date, "en");
  // en-US formatting: 'December 24, 2023'
  assert.strictEqual(formatted, "December 24, 2023");
});

test("formatDate utility - handles leap year", () => {
  const date = new Date("2024-02-29");
  const formattedEn = formatDate(date, "en");
  assert.strictEqual(formattedEn, "February 29, 2024");

  const formattedCs = formatDate(date, "cs");
  assert.match(formattedCs, /29\./);
  assert.match(formattedCs, /února/);
  assert.match(formattedCs, /2024/);
});
