// node --test scripts/
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  END,
  HEADER,
  START,
  change,
  checkTable,
  daysBefore,
  longDate,
  mergeHistory,
  numbersSection,
  parseLine,
  parseTable,
  toCsv,
  withNumbers,
} from './table.mjs';

/** A plausible day's table: the US, the UK, Germany and filler countries. */
function day(date, us = 29043) {
  const rows = [
    { date, code: 'US', country: 'United States', jobs: us, share: '48.9', anywhere: '1.7' },
    { date, code: 'GB', country: 'United Kingdom', jobs: 4454, share: '7.5', anywhere: '10.8' },
    { date, code: 'DE', country: 'Germany', jobs: 3888, share: '6.5', anywhere: '12.4' },
    { date, code: 'BQ', country: 'Bonaire, Sint Eustatius and Saba', jobs: 700, share: '1.2', anywhere: '69.0' },
  ];
  for (let i = 0; rows.length < 120; i++) {
    const code = String.fromCharCode(72 + Math.floor(i / 26), 65 + (i % 26)); // HA, HB ... LL
    rows.push({ date, code, country: `Country ${i}`, jobs: 500 - i, share: '0.8', anywhere: '96.0' });
  }
  return rows;
}

test('reads quoted names with commas and doubled quotes', () => {
  assert.deepEqual(parseLine('2026-11-21,BQ,"Bonaire, Sint Eustatius and Saba",700,1.2,69.0'), [
    '2026-11-21',
    'BQ',
    'Bonaire, Sint Eustatius and Saba',
    '700',
    '1.2',
    '69.0',
  ]);
  assert.deepEqual(parseLine('"say ""hi""",x'), ['say "hi"', 'x']);
});

test('the file survives a round trip, CRLF or not', () => {
  const rows = day('2026-11-21');
  const csv = toCsv(rows);
  assert.ok(csv.startsWith(`${HEADER}\n`));
  assert.deepEqual(parseTable(csv), rows);
  assert.deepEqual(parseTable(csv.replace(/\n/g, '\r\n')), rows);
});

test('a broken table is refused', () => {
  assert.throws(() => parseTable('date,country\n'), /Unexpected header/);
  assert.throws(() => checkTable(day('2026-11-21').slice(0, 50)), /Only 50 rows/);
  const mixed = day('2026-11-21');
  mixed[5] = { ...mixed[5], date: '2026-11-20' };
  assert.throws(() => checkTable(mixed), /More than one date/);
  assert.throws(() => checkTable(day('2026-11-21', 12)), /US row/);
  assert.equal(checkTable(day('2026-11-21')), '2026-11-21');
});

test('running twice on one day replaces that day instead of adding it again', () => {
  const first = mergeHistory([], day('2026-11-21'), '2026-11-21');
  const again = mergeHistory(first, day('2026-11-21', 29100), '2026-11-21');
  assert.equal(again.length, first.length);
  assert.equal(again.find((r) => r.code === 'US').jobs, 29100);
  const next = mergeHistory(again, day('2026-11-22'), '2026-11-22');
  assert.equal(next.length, first.length * 2);
  assert.equal(next[0].date, '2026-11-21');
});

test('dates and changes read plainly', () => {
  assert.equal(longDate('2026-11-21'), '21 November 2026');
  assert.equal(daysBefore('2026-12-03', 7), '2026-11-26');
  assert.equal(change(110, 100), 'up 10%');
  assert.equal(change(88, 100), 'down 12%');
  assert.equal(change(100, 100), 'no change');
  assert.equal(change(100, undefined), '');
  assert.equal(change(5, 0), '');
});

test('the README section names the US, the UK and Germany, and the week change once there is one', () => {
  const today = day('2026-11-28', 31947);
  const first = numbersSection(today, today, '2026-11-28');
  assert.match(
    first,
    /^On 28 November 2026, 31,947 remote jobs were open to people in the US \(48\.9% of all the remote jobs we list\), 4,454 to people in the UK \(7\.5%\) and 3,888 to people in Germany \(6\.5%\)\. Remote jobs were open to people in 120 countries in all\./,
  );
  assert.match(first, /\| United States \| 31,947 \| 48\.9% \| 1\.7% \| not yet \|/);
  assert.match(first, /has this first day\./);
  const tableRows = first.split('\n').filter((l) => /^\| .* \| \d[\d,]* \|/.test(l));
  assert.equal(tableRows.length, 25);

  const history = mergeHistory(day('2026-11-21'), today, '2026-11-28');
  const later = numbersSection(today, history, '2026-11-28');
  assert.match(later, /\| United States \| 31,947 \| 48\.9% \| 1\.7% \| up 10% \|/);
  assert.match(later, /\| United Kingdom \| 4,454 \| 7\.5% \| 10\.8% \| no change \|/);
  assert.match(later, /has all 2 days since 21 November 2026\./);
  assert.doesNotMatch(later, /—/);
});

test('only the part between the markers changes', () => {
  const readme = `# Title\n\nIntro.\n\n${START}\nold numbers\n${END}\n\n## Files\n`;
  const out = withNumbers(readme, 'new numbers');
  assert.equal(out, `# Title\n\nIntro.\n\n${START}\nnew numbers\n${END}\n\n## Files\n`);
  assert.equal(withNumbers(out, 'new numbers'), out);
  assert.throws(() => withNumbers('# No markers', 'x'), /markers/);
});
