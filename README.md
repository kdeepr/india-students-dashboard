# India → US Students Dashboard

An interactive, single-page dashboard about **Indian students in U.S. higher education**: totals over time, the split between graduate (master's + doctoral), undergraduate, non-degree and OPT students, institution types, top states, gender, STEM OPT and economic impact.

**Every number comes from an official publication and links to it. Nothing is estimated, modelled or interpolated.**

![Static site, no build step](https://img.shields.io/badge/build-none-lightgrey) ![Data through 2024/25](https://img.shields.io/badge/data-through%202024%2F25-blue)

---

## What's on the page

| Section | What it shows | Period | Source |
|---|---|---|---|
| KPI tiles (year selector) | Total students, graduate students, OPT, India's rank, with year-over-year change | 2021/22 – 2024/25 | Open Doors |
| Total students from India | Line chart | 2015/16 – 2024/25 | Open Doors |
| By academic level | Stacked bars, count ↔ share toggle | 2021/22 – 2024/25 | Open Doors |
| Active SEVIS records | Bar chart of active F-1/M-1 records for Indian citizens | CY 2019 – 2024 | SEVIS by the Numbers |
| Gender split | Female / male share of Indian SEVIS records | CY 2019 – 2024 | SEVIS by the Numbers |
| Institution type | % of Indian students at doctoral, master's, etc. institutions (follows year selector) | 2022/23 – 2024/25 | Open Doors |
| Top receiving states | Ranked list (follows year selector) | 2022/23 – 2024/25 | Open Doors |
| STEM OPT | Indian students with STEM OPT authorization and India's share of all STEM OPT | CY 2024 (and 2023 share) | SEVIS by the Numbers |
| Economic impact | Spending by Indian students in the U.S. | 2022 – 2024 | U.S. Dept. of Commerce, via Open Doors |
| Rank | India's rank among all places of origin | 2022/23 – 2024/25 | Open Doors |
| All the data | Every figure with its source, plus a **Download CSV** button | — | — |

It works on phones, supports light and dark mode, and every chart has hover tooltips.

## Data sources

| ID | Publication | Publisher | Link |
|---|---|---|---|
| `od25` | Open Doors 2025 — India Fact Sheet | Institute of International Education (IIE) / U.S. Dept. of State | [PDF](https://opendoorsdata.org/wp-content/uploads/2026/01/OD_India_Fact-Sheet-2025.pdf) |
| `od24` | Open Doors 2024 — India Fact Sheet | IIE / U.S. Dept. of State | [PDF](https://opendoorsdata.org/wp-content/uploads/2024/12/OpenDoors_FactSheet_India_2024.pdf) |
| `od23` | Open Doors 2023 — India Fact Sheet | IIE / U.S. Dept. of State | [PDF](https://opendoorsdata.org/wp-content/uploads/2023/11/OpenDoors_FactSheet_India_2023.pdf) |
| `sevis24` | SEVIS by the Numbers 2024 | DHS / ICE Student and Exchange Visitor Program | [PDF](https://www.ice.gov/doclib/sevis/btn/25_0605_2024-sevis-btn.pdf) |
| `sevis24stem` | SEVIS by the Numbers 2024 — Countries by STEM OPT authorizations | DHS / ICE SEVP | [PDF](https://www.ice.gov/doclib/sevis/btn/2024/2024_AllCountriesCitizenshipNumberSevisRecordsWithAthorizationsParticipate_STEM_OPT.pdf) |
| `sevis23` | SEVIS by the Numbers 2023 | DHS / ICE SEVP | [PDF](https://www.ice.gov/doclib/sevis/btn/24_0510_hsi_sevp-cy23-sevis-btn.pdf) |
| `sevis22` | SEVIS by the Numbers 2022 | DHS / ICE SEVP | [PDF](https://www.ice.gov/doclib/sevis/btn/22_0406_hsi_sevp-cy22-sevis-btn.pdf) |
| `sevis21` | SEVIS by the Numbers 2021 | DHS / ICE SEVP | [PDF](https://www.ice.gov/doclib/sevis/btn/22_0406_hsi_sevp-cy21-sevis-btn.pdf) |
| `sevis20` | SEVIS by the Numbers 2020 | DHS / ICE SEVP | [PDF](https://www.ice.gov/doclib/sevis/btn/21_0322_hsi_sevp-cy20-sevis-btn.pdf) |
| `sevis19` | SEVIS by the Numbers 2019 | DHS / ICE SEVP | [PDF](https://www.ice.gov/doclib/sevis/btn/20_0903_hsi_sevp-cy19-sevis-btn.pdf) |

Index pages: [opendoorsdata.org](https://opendoorsdata.org/) · [SEVIS by the Numbers](https://www.dhs.gov/hsi/sevp/sevis-by-the-numbers)

## Methodology

1. **Copied, not estimated.** Each figure in [`data/data.js`](data/data.js) was copied from the PDF listed next to it (the `src` field). For each year, the latest fact sheet that prints that year was used. Values that appear in more than one fact sheet were cross-checked.
2. **Integrity check.** For every Open Doors year, the undergraduate + graduate + non-degree + OPT counts add up exactly to the published total (for example, 40,135 + 177,892 + 1,252 + 143,740 = 363,019 for 2024/25).
3. **Derived values only.** The page calculates year-over-year change and percentage shares in the browser from the stored numbers. Nothing else is calculated.
4. **Two systems, never mixed.**
   - *Open Doors* counts by **academic year** (for example 2024/25) from an institutional census. It includes students on OPT.
   - *SEVIS* counts every **active F-1/M-1 record in a calendar year**, which also includes K-12, language and OPT students, so its numbers are higher. The two series are shown in separate charts and never added together.
5. **About "master's".** Neither Open Doors nor SEVIS publishes a master's-only count for Indian students. The closest official figure is Open Doors' **Graduate** category (master's + doctoral + professional), so the dashboard shows that and labels it plainly. For context, SEVIS reports that master's students were 46.5% (667,622) of all foreign higher-ed degree seekers in 2024. That figure covers all nationalities.
6. **What was removed.** An earlier version of this page had university-level counts, state-level counts, field-of-study percentages, a gender split by degree, and a "master's ≈ 85% of graduate" estimate. None of these could be traced to an official publication, so they were removed.

### Updating the data

Each November, IIE publishes a new Open Doors India fact sheet. Each spring, DHS publishes a new SEVIS by the Numbers report. To add a year:

1. Add the source to `SOURCES` in `data/data.js`.
2. Append rows to `openDoorsTotals`, `openDoorsLevels`, `openDoorsRank`, `openDoorsInstitutionType`, `openDoorsTopStates`, `economicImpact` and/or `sevisRecords`, each with its `src` id.
3. Reload the page. Charts, KPI tiles, the year selector, the table and the CSV all update automatically.

## Run it locally

It is a static site with no build step and no dependencies to install. [Chart.js 4.4.0](https://www.chartjs.org/) and the Inter font load from CDNs.

```bash
git clone https://github.com/kdeepr/india-students-dashboard.git
cd india-students-dashboard
python3 -m http.server 8000
# open http://localhost:8000
```

You can also just open `index.html` in a browser.

## Deploy

- **GitHub Pages:** Repo → Settings → Pages → *Deploy from a branch* → `main` / `(root)`. The site goes live at `https://kdeepr.github.io/india-students-dashboard/`.
- **Vercel / Netlify:** import the repo with no framework preset and no build command. The output directory is the repo root.

## Project structure

```
index.html        page layout
assets/styles.css styling (light + dark themes, responsive)
assets/app.js     charts, filters, table, CSV export
data/data.js      every number + its source (edit this to update)
```

## Disclaimer

This is an independent project. It is not affiliated with IIE, the U.S. Department of State, or the U.S. Department of Homeland Security. Figures are as published by those organizations and can be revised in later editions.
