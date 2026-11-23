# Remote jobs by country

How many remote jobs are open to people in each country, counted every day from the job boards of more than 7,500 companies. One CSV for today and one with every day's table, so you can see how it changes. Free to reuse under CC BY 4.0.

Made by [Remotejobify](https://remotejobify.app/). The same table, with links to each country's jobs, is at [Where remote jobs are really open](https://remotejobify.app/reports/where-remote-jobs-are-open/).

## Today's numbers

<!-- numbers:start -->
On 23 November 2026, 28,963 remote jobs were open to people in the US (49.0% of all the remote jobs we list), 4,437 to people in the UK (7.5%) and 3,875 to people in Germany (6.6%). Remote jobs were open to people in 236 countries in all.

| Country | Remote jobs open | Share of all remote jobs | Open to anyone, anywhere | Change on a week ago |
| --- | ---: | ---: | ---: | --- |
| United States | 28,963 | 49.0% | 1.7% | not yet |
| Canada | 4,550 | 7.7% | 10.6% | not yet |
| United Kingdom | 4,437 | 7.5% | 10.9% | not yet |
| Germany | 3,875 | 6.6% | 12.4% | not yet |
| Philippines | 3,734 | 6.3% | 12.9% | not yet |
| Poland | 2,899 | 4.9% | 16.6% | not yet |
| Spain | 2,728 | 4.6% | 17.7% | not yet |
| France | 2,492 | 4.2% | 19.3% | not yet |
| Netherlands | 2,364 | 4.0% | 20.4% | not yet |
| India | 2,331 | 3.9% | 20.7% | not yet |
| Mexico | 2,257 | 3.8% | 21.4% | not yet |
| Brazil | 2,224 | 3.8% | 21.7% | not yet |
| Portugal | 2,193 | 3.7% | 22.0% | not yet |
| Colombia | 2,191 | 3.7% | 22.0% | not yet |
| Argentina | 2,151 | 3.6% | 22.4% | not yet |
| Romania | 2,131 | 3.6% | 22.6% | not yet |
| Ireland | 2,105 | 3.6% | 22.9% | not yet |
| Italy | 2,072 | 3.5% | 23.3% | not yet |
| Ukraine | 1,948 | 3.3% | 24.7% | not yet |
| Bulgaria | 1,944 | 3.3% | 24.8% | not yet |
| Czechia | 1,941 | 3.3% | 24.8% | not yet |
| Hungary | 1,884 | 3.2% | 25.6% | not yet |
| Sweden | 1,866 | 3.2% | 25.8% | not yet |
| Lithuania | 1,848 | 3.1% | 26.1% | not yet |
| Estonia | 1,847 | 3.1% | 26.1% | not yet |

Every country is in [data/latest.csv](data/latest.csv). [data/history.csv](data/history.csv) has all 4 days since 20 November 2026.
<!-- numbers:end -->

## The files

| File | What's in it |
| --- | --- |
| [data/latest.csv](data/latest.csv) | Today's table, one row per country, most jobs first. |
| [data/history.csv](data/history.csv) | Every day's table since this repo started, one row per country per day. |

Both have the same columns:

| Column | What it means |
| --- | --- |
| `date` | The day the jobs were counted (UTC). |
| `country_code` | Two-letter country code (ISO 3166-1). |
| `country` | The country's name. |
| `remote_jobs_open` | Remote jobs open that day that people living in the country can apply for. |
| `percent_of_all_remote_jobs` | `remote_jobs_open` as a share of every open remote job we list. |
| `percent_open_anywhere` | The share of the country's remote jobs that are open to anyone, anywhere. |

## How the jobs are counted

Remotejobify reads companies' own job boards every day, not job sites or reposts. A remote job counts for a country only if its listing names that country, names a region that includes it, or says it's open worldwide. A job open to all of Europe counts in every European country, so the rows add up to more than the number of jobs.

Hybrid and office jobs aren't counted. A job leaves the count the day it closes on the company's board.

The full method, with the proof line each job shows: [How we check who a job is open to](https://remotejobify.app/methodology/).

## Using the data

You can use it anywhere, including in articles, research and products, under [CC BY 4.0](LICENSE). Please credit Remotejobify and link to [remotejobify.app/reports/where-remote-jobs-are-open](https://remotejobify.app/reports/where-remote-jobs-are-open/). Quote numbers with their date: they change every day.

## The jobs themselves

- [Remote jobs open to people in the US](https://remotejobify.app/remote-jobs/united-states/)
- [Remote jobs open to people in the UK](https://remotejobify.app/remote-jobs/united-kingdom/)
- [Remote jobs open to people in Europe](https://remotejobify.app/remote-jobs/europe/)
- [Remote jobs open worldwide](https://remotejobify.app/remote-jobs/worldwide/)
- [Match me](https://remotejobify.app/match/): paste your CV and see the open remote jobs that fit it best.

## How this repo updates

A GitHub Action ([update.yml](.github/workflows/update.yml)) runs every morning after Remotejobify's daily crawl. It reads [the table](https://remotejobify.app/reports/where-remote-jobs-are-open.csv), checks it looks right, adds it to the history and rewrites the numbers above. If the table looks wrong, it changes nothing and tries again later. `node --test "scripts/*.test.mjs"` runs the checks.
