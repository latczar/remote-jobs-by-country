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

/** Today's rows. Three tries a minute apart, as the site sometimes answers "try later". */
async function read() {
  for (let attempt = 1; ; attempt++) {
    // A new address each try, so the site's cached copy never answers for today's file.
    const url = `${SOURCE}?fresh=${Date.now()}`;
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'remote-jobs-by-country-updater' },
      });
      if (!response.ok) throw new Error(`${SOURCE} answered ${response.status}.`);
      return parseTable(await response.text());
    } catch (error) {
      if (attempt === 3) throw error;
      console.log(`Try ${attempt} failed (${error.message}); trying again in a minute.`);
      await new Promise((resolve) => setTimeout(resolve, 60_000));
    }
  }
}

const rows = await read();
const day = checkTable(rows);

await mkdir('data', { recursive: true });
const history = existsSync(HISTORY) ? parseTable(await readFile(HISTORY, 'utf8')) : [];
const merged = mergeHistory(history, rows, day);
await writeFile('data/latest.csv', toCsv(rows));
await writeFile(HISTORY, toCsv(merged));
const readme = await readFile('README.md', 'utf8');
await writeFile('README.md', withNumbers(readme, numbersSection(rows, merged, day)));
console.log(`${day}: ${rows.length} countries; history has ${merged.length} rows.`);
