// Reading, checking and writing the table. No packages: Node 20 or later.

export const HEADER =
  'date,country_code,country,remote_jobs_open,percent_of_all_remote_jobs,percent_open_anywhere';
export const START = '<!-- numbers:start -->';
export const END = '<!-- numbers:end -->';
/** Fewer rows than this means something went wrong upstream: keep yesterday's files. */
const MIN_ROWS = 100;
/** Countries named in the README's opening sentence. */
const LEAD = ['US', 'GB', 'DE'];
/** Rows in the README's table. */
const TABLE_ROWS = 25;

/** One CSV line into its fields. Country names can hold commas, so they come quoted. */
export function parseLine(line) {
  const fields = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quoted) {
      if (c === '"' && line[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ',') {
      fields.push(field);
      field = '';
    } else {
      field += c;
    }
  }
  fields.push(field);
  return fields;
}

/** CSV text into rows, checking the header. */
export function parseTable(text) {
  const lines = text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((l) => l.trim() !== '');
  if (lines[0] !== HEADER) throw new Error(`Unexpected header: ${lines[0]}`);
  return lines.slice(1).map((line) => {
    const [date, code, country, jobs, share, anywhere] = parseLine(line);
    return { date, code, country, jobs: Number(jobs), share, anywhere };
  });
}

/** Rows back into CSV text, quoted the way the source quotes them. */
export function toCsv(rows) {
  const line = (r) =>
    [r.date, r.code, `"${r.country.replace(/"/g, '""')}"`, r.jobs, r.share, r.anywhere].join(',');
  return `${[HEADER, ...rows.map(line)].join('\n')}\n`;
}

/** Refuses a table that looks broken, so a bad day never overwrites a good one. Returns its day. */
export function checkTable(rows) {
  if (rows.length < MIN_ROWS) throw new Error(`Only ${rows.length} rows.`);
  const dates = new Set(rows.map((r) => r.date));
  if (dates.size !== 1) throw new Error(`More than one date: ${[...dates].join(', ')}`);
  const [day] = dates;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new Error(`Bad date: ${day}`);
  for (const r of rows) {
    if (!/^[A-Z]{2}$/.test(r.code) || !Number.isInteger(r.jobs) || r.jobs < 0) {
      throw new Error(`Bad row: ${JSON.stringify(r)}`);
    }
  }
  const us = rows.find((r) => r.code === 'US');
  if (!us || us.jobs < 1000) throw new Error('The US row is missing or too small.');
  return day;
}

/** History with `day`'s rows replaced by `rows`, so a second run on one day changes nothing. */
export function mergeHistory(history, rows, day) {
  return [...history.filter((r) => r.date !== day), ...rows].sort(
    (a, b) => a.date.localeCompare(b.date) || b.jobs - a.jobs || a.code.localeCompare(b.code),
  );
}

const n = (x) => x.toLocaleString('en-GB');

/** "21 November 2026" from "2026-11-21". */
export const longDate = (day) =>
  new Date(`${day}T12:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

/** The day `days` before `day`, as YYYY-MM-DD. */
export const daysBefore = (day, days) =>
  new Date(Date.parse(`${day}T00:00:00Z`) - days * 86_400_000).toISOString().slice(0, 10);

/** "up 3%", "down 12%", "no change", or "" when there's nothing to compare with. */
export function change(now, before) {
  if (before === undefined || before === 0) return now === before ? 'no change' : '';
  const pct = Math.round((100 * (now - before)) / before);
  if (pct === 0) return 'no change';
  return pct > 0 ? `up ${pct}%` : `down ${-pct}%`;
}

/** A country's name inside a sentence: "the US", "the UK", "Germany". */
const inSentence = (r) => (r.code === 'US' ? 'the US' : r.code === 'GB' ? 'the UK' : r.country);

/** The README's numbers section, from today's rows and the whole history (today included). */
export function numbersSection(rows, history, day) {
  const weekAgo = daysBefore(day, 7);
  const before = new Map(history.filter((r) => r.date === weekAgo).map((r) => [r.code, r.jobs]));
  const lead = LEAD.map((c) => rows.find((r) => r.code === c))
    .filter(Boolean)
    .map((r, i) =>
      i === 0
        ? `${n(r.jobs)} remote jobs were open to people in ${inSentence(r)} (${r.share}% of all the remote jobs we list)`
        : `${n(r.jobs)} to people in ${inSentence(r)} (${r.share}%)`,
    );
  const leadText =
    lead.length > 1 ? `${lead.slice(0, -1).join(', ')} and ${lead[lead.length - 1]}` : lead[0];
  const dates = [...new Set(history.map((r) => r.date))].sort();
  const kept =
    dates.length === 1 ? 'this first day' : `all ${dates.length} days since ${longDate(dates[0])}`;
  return [
    `On ${longDate(day)}, ${leadText}. Remote jobs were open to people in ${rows.length} countries in all.`,
    '',
    '| Country | Remote jobs open | Share of all remote jobs | Open to anyone, anywhere | Change on a week ago |',
    '| --- | ---: | ---: | ---: | --- |',
    ...rows
      .slice(0, TABLE_ROWS)
      .map(
        (r) =>
          `| ${r.country} | ${n(r.jobs)} | ${r.share}% | ${r.anywhere}% | ${change(r.jobs, before.get(r.code)) || 'not yet'} |`,
      ),
    '',
    `Every country is in [data/latest.csv](data/latest.csv). [data/history.csv](data/history.csv) has ${kept}.`,
  ].join('\n');
}

/** README text with the numbers section replaced. */
export function withNumbers(readme, section) {
  const start = readme.indexOf(START);
  const end = readme.indexOf(END);
  if (start === -1 || end < start) throw new Error('README has no numbers markers.');
  return `${readme.slice(0, start + START.length)}\n${section}\n${readme.slice(end)}`;
}
