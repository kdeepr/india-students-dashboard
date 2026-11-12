/*
 * India → US students dashboard — data file
 * ------------------------------------------------------------
 * Every number in this file is copied verbatim from an official
 * publication listed in SOURCES. Nothing is estimated or modelled.
 * Derived values (year-over-year %, shares) are computed in the
 * browser from these raw numbers, never stored here.
 *
 * Two different counting systems are used, and they are never mixed:
 *  - Open Doors (IIE / U.S. State Dept): academic year (e.g. 2024/25),
 *    census of institutions, includes students on OPT.
 *  - SEVIS by the Numbers (DHS / ICE SEVP): calendar year, count of
 *    all active F-1 and M-1 SEVIS records (incl. K-12, language, OPT).
 *    SEVIS counts are therefore always higher than Open Doors counts.
 */

window.DASH = {
  SOURCES: {
    od25: {
      label: "IIE Open Doors 2025 — India Fact Sheet",
      publisher: "Institute of International Education / U.S. Dept. of State",
      url: "https://opendoorsdata.org/wp-content/uploads/2026/01/OD_India_Fact-Sheet-2025.pdf",
      covers: "Academic years 2017/18–2024/25"
    },
    od24: {
      label: "IIE Open Doors 2024 — India Fact Sheet",
      publisher: "Institute of International Education / U.S. Dept. of State",
      url: "https://opendoorsdata.org/wp-content/uploads/2024/12/OpenDoors_FactSheet_India_2024.pdf",
      covers: "Academic years 2016/17–2023/24"
    },
    od23: {
      label: "IIE Open Doors 2023 — India Fact Sheet",
      publisher: "Institute of International Education / U.S. Dept. of State",
      url: "https://opendoorsdata.org/wp-content/uploads/2023/11/OpenDoors_FactSheet_India_2023.pdf",
      covers: "Academic years 2015/16–2022/23"
    },
    sevis24: {
      label: "SEVIS by the Numbers 2024 (annual report)",
      publisher: "DHS / ICE Student and Exchange Visitor Program",
      url: "https://www.ice.gov/doclib/sevis/btn/25_0605_2024-sevis-btn.pdf",
      covers: "Calendar year 2024"
    },
    sevis24stem: {
      label: "SEVIS by the Numbers 2024 — Countries by STEM OPT authorizations",
      publisher: "DHS / ICE Student and Exchange Visitor Program",
      url: "https://www.ice.gov/doclib/sevis/btn/2024/2024_AllCountriesCitizenshipNumberSevisRecordsWithAthorizationsParticipate_STEM_OPT.pdf",
      covers: "Calendar year 2024"
    },
    sevis23: {
      label: "SEVIS by the Numbers 2023",
      publisher: "DHS / ICE Student and Exchange Visitor Program",
      url: "https://www.ice.gov/doclib/sevis/btn/24_0510_hsi_sevp-cy23-sevis-btn.pdf",
      covers: "Calendar year 2023"
    },
    sevis22: {
      label: "SEVIS by the Numbers 2022",
      publisher: "DHS / ICE Student and Exchange Visitor Program",
      url: "https://www.ice.gov/doclib/sevis/btn/22_0406_hsi_sevp-cy22-sevis-btn.pdf",
      covers: "Calendar year 2022"
    },
    sevis21: {
      label: "SEVIS by the Numbers 2021",
      publisher: "DHS / ICE Student and Exchange Visitor Program",
      url: "https://www.ice.gov/doclib/sevis/btn/22_0406_hsi_sevp-cy21-sevis-btn.pdf",
      covers: "Calendar year 2021"
    },
    sevis20: {
      label: "SEVIS by the Numbers 2020",
      publisher: "DHS / ICE Student and Exchange Visitor Program",
      url: "https://www.ice.gov/doclib/sevis/btn/21_0322_hsi_sevp-cy20-sevis-btn.pdf",
      covers: "Calendar year 2020"
    },
    sevis19: {
      label: "SEVIS by the Numbers 2019",
      publisher: "DHS / ICE Student and Exchange Visitor Program",
      url: "https://www.ice.gov/doclib/sevis/btn/20_0903_hsi_sevp-cy19-sevis-btn.pdf",
      covers: "Calendar year 2019"
    }
  },

  /* Open Doors: total students from India, by academic year */
  openDoorsTotals: [
    { year: "2015/16", total: 165918, src: "od23" },
    { year: "2016/17", total: 186267, src: "od24" },
    { year: "2017/18", total: 196271, src: "od25" },
    { year: "2018/19", total: 202014, src: "od25" },
    { year: "2019/20", total: 193124, src: "od25" },
    { year: "2020/21", total: 167582, src: "od25" },
    { year: "2021/22", total: 199182, src: "od25" },
    { year: "2022/23", total: 268923, src: "od25" },
    { year: "2023/24", total: 331602, src: "od25" },
    { year: "2024/25", total: 363019, src: "od25" }
  ],

  /* Open Doors: India by academic level. Components sum exactly to the total.
     "Graduate" = master's + doctoral + professional; Open Doors does not
     publish a master's-only figure by country. */
  openDoorsLevels: [
    { year: "2021/22", undergraduate: 27545, graduate: 102024, nonDegree: 1425, opt: 68188, src: "od23" },
    { year: "2022/23", undergraduate: 31954, graduate: 165936, nonDegree: 1971, opt: 69062, src: "od24" },
    { year: "2023/24", undergraduate: 36053, graduate: 196567, nonDegree: 1426, opt: 97556, src: "od25" },
    { year: "2024/25", undergraduate: 40135, graduate: 177892, nonDegree: 1252, opt: 143740, src: "od25" }
  ],

  /* Open Doors: India's rank among all places of origin */
  openDoorsRank: [
    { year: "2022/23", rank: 2, src: "od23" },
    { year: "2023/24", rank: 1, src: "od24" },
    { year: "2024/25", rank: 1, src: "od25" }
  ],

  /* Open Doors: share of Indian students by Carnegie institution type */
  openDoorsInstitutionType: [
    { year: "2022/23", doctoral: 84.1, masters: 13.3, specialFocus: 1.0, baccalaureate: 0.9, associates: 0.7, src: "od23" },
    { year: "2023/24", doctoral: 82.7, masters: 14.8, specialFocus: 1.0, baccalaureate: 0.9, associates: 0.6, src: "od24" },
    { year: "2024/25", doctoral: 81.7, masters: 16.2, specialFocus: 0.9, baccalaureate: 0.6, associates: 0.7, src: "od25" }
  ],

  /* Open Doors: top receiving U.S. states for Indian students (names only;
     the fact sheet lists the states but does not print counts) */
  openDoorsTopStates: [
    { year: "2022/23", states: ["Texas", "New York", "California", "Massachusetts", "Illinois"], src: "od23" },
    { year: "2023/24", states: ["Texas", "New York", "California", "Massachusetts", "Illinois"], src: "od24" },
    { year: "2024/25", states: ["Texas", "New York", "Massachusetts", "California", "Illinois"], src: "od25" }
  ],

  /* Economic impact of Indian students on the U.S. economy (U.S. Dept. of
     Commerce figure, as printed on the Open Doors fact sheet), USD */
  economicImpact: [
    { year: 2022, usd: 7137000000, src: "od23" },
    { year: 2023, usd: 11800000000, src: "od24" },
    { year: 2024, usd: 14015000000, src: "od25" }
  ],

  /* SEVIS: active F-1 / M-1 records with Indian citizenship, calendar year,
     with the female / male share printed in the same report */
  sevisRecords: [
    { year: 2019, records: 249221, female: 34.6, male: 65.4, src: "sevis19" },
    { year: 2020, records: 207460, female: 35, male: 65, src: "sevis20" },
    { year: 2021, records: 232851, female: 37, male: 63, src: "sevis21" },
    { year: 2022, records: 297151, female: 37, male: 63, src: "sevis22" },
    { year: 2023, records: 377620, female: 38, male: 62, src: "sevis23" },
    { year: 2024, records: 422335, female: 38, male: 62, src: "sevis24" }
  ],

  /* SEVIS: STEM OPT (post-completion STEM extension) */
  sevisStemOpt: {
    year: 2024,
    india: 79331,          // records with STEM OPT authorization, sevis24stem
    totalAllCountries: 165524, // all foreign students in STEM OPT, sevis24
    indiaSharePct: 48.0,   // printed in sevis24
    indiaSharePct2023: 39.1, // printed in sevis23
    src: ["sevis24stem", "sevis24", "sevis23"]
  },

  /* SEVIS 2024: all-nationality context for master's students (no India split
     is published) */
  sevisDegreeContext: {
    year: 2024,
    masters: 667622, bachelors: 464843, doctoral: 214824, associate: 87459,
    mastersSharePct: 46.5,
    src: "sevis24"
  }
};
