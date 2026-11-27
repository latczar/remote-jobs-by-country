# Remote jobs by country

How many remote jobs are open to people in each country, counted every day from the job boards of more than 7,500 companies. One CSV for today and one with every day's table, so you can see how it changes. Free to reuse under CC BY 4.0.

Made by [Remotejobify](https://remotejobify.app/). The same table, with links to each country's jobs, is at [Where remote jobs are really open](https://remotejobify.app/reports/where-remote-jobs-are-open/).

## Today's numbers

<!-- numbers:start -->
On 27 November 2026, 28,699 remote jobs were open to people in the US (49.0% of all the remote jobs we list), 4,441 to people in the UK (7.6%) and 3,868 to people in Germany (6.6%). Remote jobs were open to people in 236 countries in all.

| Country | Remote jobs open | Share of all remote jobs | Open to anyone, anywhere | Change on a week ago |
| --- | ---: | ---: | ---: | --- |
| United States | 28,699 | 49.0% | 1.7% | down 1% |
| Canada | 4,546 | 7.8% | 10.7% | no change |
| United Kingdom | 4,441 | 7.6% | 11.0% | no change |
| Germany | 3,868 | 6.6% | 12.6% | down 1% |
| Philippines | 3,637 | 6.2% | 13.4% | down 3% |
| Poland | 2,932 | 5.0% | 16.6% | no change |
| Spain | 2,752 | 4.7% | 17.7% | no change |
| France | 2,496 | 4.3% | 19.6% | no change |
| India | 2,400 | 4.1% | 20.3% | up 3% |
| Netherlands | 2,347 | 4.0% | 20.8% | down 1% |
| Mexico | 2,281 | 3.9% | 21.4% | up 1% |
| Brazil | 2,214 | 3.8% | 22.0% | no change |
| Colombia | 2,214 | 3.8% | 22.0% | up 1% |
| Portugal | 2,188 | 3.7% | 22.3% | down 1% |
| Argentina | 2,155 | 3.7% | 22.6% | up 1% |
| Romania | 2,140 | 3.7% | 22.8% | no change |
| Ireland | 2,114 | 3.6% | 23.1% | no change |
| Italy | 2,067 | 3.5% | 23.6% | no change |
| Czechia | 1,968 | 3.4% | 24.8% | up 1% |
| Bulgaria | 1,949 | 3.3% | 25.0% | no change |
| Ukraine | 1,938 | 3.3% | 25.2% | no change |
| Hungary | 1,913 | 3.3% | 25.5% | up 1% |
| Sweden | 1,896 | 3.2% | 25.7% | up 1% |
| Estonia | 1,883 | 3.2% | 25.9% | up 2% |
| Lithuania | 1,872 | 3.2% | 26.1% | up 1% |

Every country is in [data/latest.csv](data/latest.csv). [data/history.csv](data/history.csv) has all 8 days since 20 November 2026.
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
