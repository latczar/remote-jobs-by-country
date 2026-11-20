// Reads today's table from Remotejobify, keeps it in data/latest.csv, adds it to
// data/history.csv and writes today's numbers into README.md. Run daily by
// .github/workflows/update.yml.
//
//   node scripts/update.mjs

import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import {
  checkTable,
  mergeHistory,
  numbersSection,
  parseTable,
  toCsv,
  withNumbers,
} from './table.mjs';

const SOURCE = 'https://remotejobify.app/reports/where-remote-jobs-are-open.csv';
const HISTORY = 'data/history.csv';

// A new address each hour, so the site's cached copy never answers for today's file.
const url = `${SOURCE}?fresh=${new Date().toISOString().slice(0, 13)}`;
const response = await fetch(url, { headers: { 'User-Agent': 'remote-jobs-by-country-updater' } });
if (!response.ok) throw new Error(`${SOURCE} answered ${response.status}.`);
const rows = parseTable(await response.text());
const day = checkTable(rows);

await mkdir('data', { recursive: true });
const history = existsSync(HISTORY) ? parseTable(await readFile(HISTORY, 'utf8')) : [];
const merged = mergeHistory(history, rows, day);
await writeFile('data/latest.csv', toCsv(rows));
await writeFile(HISTORY, toCsv(merged));
const readme = await readFile('README.md', 'utf8');
await writeFile('README.md', withNumbers(readme, numbersSection(rows, merged, day)));
console.log(`${day}: ${rows.length} countries; history has ${merged.length} rows.`);
