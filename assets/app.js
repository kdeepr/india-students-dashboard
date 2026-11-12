/* India → US Students Dashboard — rendering logic.
 * Reads window.DASH (data/data.js). Computes only derived values
 * (year-over-year change, shares); never invents numbers. */
(function () {
  "use strict";
  const D = window.DASH;
  const S = D.SOURCES;
  const $ = (s) => document.querySelector(s);
  const fmt = (n) => n.toLocaleString("en-US");
  const pct = (a, b) => ((a - b) / b) * 100;
  const signPct = (v) => (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(1) + "%";
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const srcLink = (id) => `<a href="${S[id].url}" target="_blank" rel="noopener">${S[id].label}</a>`;

  /* ---------- theme ---------- */
  const root = document.documentElement;
  try { const t = localStorage.getItem("theme"); if (t) root.dataset.theme = t; } catch (e) {}
  $("#themeBtn").addEventListener("click", () => {
    const dark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    drawAll();
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { if (!root.dataset.theme) drawAll(); });

  /* ---------- source footers ---------- */
  document.querySelectorAll(".src[data-src]").forEach((el) => {
    el.innerHTML = "Source: " + el.dataset.src.split(" ").map(srcLink).join("; ");
  });

  /* ---------- year filter + KPIs ---------- */
  const levels = D.openDoorsLevels;
  const sel = $("#yearSel");
  levels.slice().reverse().forEach((r) => sel.add(new Option(r.year, r.year)));

  function totalOf(r) { return r.undergraduate + r.graduate + r.nonDegree + r.opt; }

  function renderKpis(year) {
    const i = levels.findIndex((r) => r.year === year);
    const r = levels[i], p = levels[i - 1];
    const totRow = D.openDoorsTotals.find((t) => t.year === year);
    const prevTot = D.openDoorsTotals[D.openDoorsTotals.findIndex((t) => t.year === year) - 1];
    const rank = D.openDoorsRank.find((x) => x.year === year);
    const change = (cur, prev) => prev != null ? `<b>${signPct(pct(cur, prev))}</b> vs prior year` : "Earliest year shown";
    const tiles = [
      { lab: "Total Indian students", val: fmt(totRow.total), chg: change(totRow.total, prevTot && prevTot.total) },
      { lab: "Graduate (master's + doctoral)", val: fmt(r.graduate), chg: change(r.graduate, p && p.graduate) + ` · ${(r.graduate / totalOf(r) * 100).toFixed(1)}% of total` },
      { lab: "On OPT (post-study work)", val: fmt(r.opt), chg: change(r.opt, p && p.opt) },
      { lab: "Rank among countries of origin", val: rank ? "#" + rank.rank : "—", chg: rank ? (rank.rank === 1 ? "Largest source country" : "Behind China") : "Not on fact sheet" }
    ];
    $("#kpis").innerHTML = tiles.map((t) =>
      `<div class="kpi"><div class="lab">${t.lab}</div><div class="val">${t.val}</div><div class="chg">${t.chg}</div></div>`
    ).join("") ;
    // Institution type + states follow the selected year when available
    const inst = D.openDoorsInstitutionType.find((x) => x.year === year) || D.openDoorsInstitutionType.at(-1);
    const st = D.openDoorsTopStates.find((x) => x.year === year) || D.openDoorsTopStates.at(-1);
    $("#instSub").textContent = `Share of Indian students, Open Doors ${inst.year}` + (inst.year !== year ? " (latest available for this view)" : "");
    $("#stateSub").textContent = `Open Doors ${st.year}` + (st.year !== year ? " (latest available for this view)" : "");
    $("#instSrc").innerHTML = "Source: " + srcLink(inst.src);
    $("#stateSrc").innerHTML = "Source: " + srcLink(st.src);
    $("#stateList").innerHTML = st.states.map((s) => `<li>${s}</li>`).join("");
    currentInst = inst;
    drawInst();
  }

  /* ---------- charts ---------- */
  const charts = {};
  let unit = "count";
  let currentInst = null;

  function base(extra) {
    const grid = css("--grid"), muted = css("--muted");
    return Object.assign({
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: css("--surface"), titleColor: css("--text"), bodyColor: css("--text-2"), borderColor: css("--border"), borderWidth: 1, padding: 10 }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: muted }, border: { color: grid } },
        y: { grid: { color: grid }, ticks: { color: muted }, border: { display: false }, beginAtZero: true }
      }
    }, extra);
  }
  function make(id, cfg) { if (charts[id]) charts[id].destroy(); charts[id] = new Chart($("#" + id), cfg); }
  const kTick = (v) => v >= 1000 ? v / 1000 + "K" : v;

  function drawTotal() {
    const rows = D.openDoorsTotals;
    const o = base();
    o.scales.y.ticks.callback = kTick;
    o.plugins.tooltip.callbacks = {
      label: (c) => ` ${fmt(c.parsed.y)} students`,
      afterLabel: (c) => c.dataIndex ? ` ${signPct(pct(rows[c.dataIndex].total, rows[c.dataIndex - 1].total))} vs prior year` : ""
    };
    make("cTotal", {
      type: "line",
      data: { labels: rows.map((r) => r.year), datasets: [{ data: rows.map((r) => r.total), borderColor: css("--s1"), backgroundColor: css("--s1"), borderWidth: 2, pointRadius: 4, pointHoverRadius: 6, pointBorderColor: css("--surface"), pointBorderWidth: 2, tension: 0 }] },
      options: o
    });
  }

  const LV = [
    { k: "graduate", name: "Graduate", c: "--s1" },
    { k: "opt", name: "OPT", c: "--s2" },
    { k: "undergraduate", name: "Undergraduate", c: "--s3" },
    { k: "nonDegree", name: "Non-degree", c: "--s4" }
  ];
  function drawLevels() {
    const o = base();
    o.scales.x.stacked = true; o.scales.y.stacked = true;
    if (unit === "share") { o.scales.y.max = 100; o.scales.y.ticks.callback = (v) => v + "%"; }
    else o.scales.y.ticks.callback = kTick;
    o.plugins.tooltip.callbacks = {
      label: (c) => {
        const r = levels[c.dataIndex], raw = r[LV[c.datasetIndex].k];
        return ` ${c.dataset.label}: ${fmt(raw)} (${(raw / totalOf(r) * 100).toFixed(1)}%)`;
      },
      footer: (items) => "Total: " + fmt(totalOf(levels[items[0].dataIndex]))
    };
    make("cLevels", {
      type: "bar",
      data: {
        labels: levels.map((r) => r.year),
        datasets: LV.map((l) => ({
          label: l.name,
          data: levels.map((r) => unit === "share" ? +(r[l.k] / totalOf(r) * 100).toFixed(2) : r[l.k]),
          backgroundColor: css(l.c), borderColor: css("--surface"), borderWidth: { top: 2 }, borderSkipped: false, maxBarThickness: 64
        }))
      },
      options: o
    });
    $("#lgLevels").innerHTML = LV.map((l) => `<span><i style="background:${css(l.c)}"></i>${l.name}</span>`).join("");
  }

  function drawSevis() {
    const rows = D.sevisRecords;
    const o = base();
    o.scales.y.ticks.callback = kTick;
    o.plugins.tooltip.callbacks = {
      label: (c) => ` ${fmt(c.parsed.y)} active records`,
      afterLabel: (c) => c.dataIndex ? ` ${signPct(pct(rows[c.dataIndex].records, rows[c.dataIndex - 1].records))} vs prior year` : ""
    };
    make("cSevis", {
      type: "bar",
      data: { labels: rows.map((r) => r.year), datasets: [{ data: rows.map((r) => r.records), backgroundColor: css("--s1"), borderRadius: { topLeft: 4, topRight: 4 }, borderSkipped: "bottom", maxBarThickness: 48 }] },
      options: o
    });
  }

  function drawGender() {
    const rows = D.sevisRecords;
    const o = base();
    o.scales.x.stacked = true; o.scales.y.stacked = true; o.scales.y.max = 100;
    o.scales.y.ticks.callback = (v) => v + "%";
    o.plugins.tooltip.callbacks = { label: (c) => ` ${c.dataset.label}: ${c.parsed.y}%` };
    const ds = [
      { label: "Female", k: "female", c: "--s2" },
      { label: "Male", k: "male", c: "--s1" }
    ];
    make("cGender", {
      type: "bar",
      data: { labels: rows.map((r) => r.year), datasets: ds.map((d) => ({ label: d.label, data: rows.map((r) => r[d.k]), backgroundColor: css(d.c), borderColor: css("--surface"), borderWidth: { top: 2 }, borderSkipped: false, maxBarThickness: 48 })) },
      options: o
    });
    $("#lgGender").innerHTML = ds.map((d) => `<span><i style="background:${css(d.c)}"></i>${d.label}</span>`).join("");
  }

  function drawInst() {
    if (!currentInst) return;
    const cats = [["Doctoral", "doctoral"], ["Master's", "masters"], ["Special focus", "specialFocus"], ["Baccalaureate", "baccalaureate"], ["Associate's", "associates"]];
    const o = base({ indexAxis: "y" });
    o.interaction = { mode: "nearest", axis: "y", intersect: false };
    o.scales.x.grid = { color: css("--grid") }; o.scales.x.max = 100; o.scales.x.ticks.callback = (v) => v + "%";
    o.scales.y.grid = { display: false };
    o.plugins.tooltip.callbacks = { label: (c) => ` ${c.parsed.x}% of Indian students` };
    make("cInst", {
      type: "bar",
      data: { labels: cats.map((c) => c[0]), datasets: [{ data: cats.map((c) => currentInst[c[1]]), backgroundColor: css("--s1"), borderRadius: { topRight: 4, bottomRight: 4 }, borderSkipped: "left", maxBarThickness: 22 }] },
      options: o
    });
  }

  function drawEcon() {
    const rows = D.economicImpact;
    const o = base();
    o.scales.y.ticks.callback = (v) => "$" + v + "B";
    o.plugins.tooltip.callbacks = { label: (c) => ` $${fmt(rows[c.dataIndex].usd)}` };
    make("cEcon", {
      type: "bar",
      data: { labels: rows.map((r) => r.year), datasets: [{ data: rows.map((r) => +(r.usd / 1e9).toFixed(3)), backgroundColor: css("--s3"), borderRadius: { topLeft: 4, topRight: 4 }, borderSkipped: "bottom", maxBarThickness: 56 }] },
      options: o
    });
  }

  function drawAll() { drawTotal(); drawLevels(); drawSevis(); drawGender(); drawInst(); drawEcon(); }

  /* ---------- static cards ---------- */
  const so = D.sevisStemOpt;
  $("#stemNum").textContent = fmt(so.india);
  $("#stemTxt").innerHTML = `Indian students with STEM OPT authorization in ${so.year}: <b>${so.indiaSharePct}%</b> of all ${fmt(so.totalAllCountries)} foreign students in STEM OPT, up from ${so.indiaSharePct2023}% in 2023.`;
  $("#stemBar").style.width = so.indiaSharePct + "%";
  $("#rankRow").innerHTML = D.openDoorsRank.map((r) => `<div><b>#${r.rank}</b><span>${r.year}</span></div>`).join("");

  /* ---------- data table + CSV ---------- */
  const rows = [];
  D.openDoorsTotals.forEach((r) => rows.push(["Open Doors", r.year, "Total students from India", r.total, r.src]));
  levels.forEach((r) => LV.forEach((l) => rows.push(["Open Doors", r.year, l.name + " students", r[l.k], r.src])));
  D.openDoorsRank.forEach((r) => rows.push(["Open Doors", r.year, "Rank among places of origin", r.rank, r.src]));
  D.openDoorsInstitutionType.forEach((r) => [["doctoral", "Doctoral universities"], ["masters", "Master's colleges & universities"], ["specialFocus", "Special focus institutions"], ["baccalaureate", "Baccalaureate colleges"], ["associates", "Associate's colleges"]]
    .forEach(([k, n]) => rows.push(["Open Doors", r.year, "% at " + n, r[k], r.src])));
  D.openDoorsTopStates.forEach((r) => rows.push(["Open Doors", r.year, "Top receiving states (ranked)", r.states.join(" > "), r.src]));
  D.economicImpact.forEach((r) => rows.push(["Open Doors / Commerce", String(r.year), "Economic impact (USD)", r.usd, r.src]));
  D.sevisRecords.forEach((r) => {
    rows.push(["SEVIS", String(r.year), "Active F-1/M-1 records", r.records, r.src]);
    rows.push(["SEVIS", String(r.year), "% female", r.female, r.src]);
    rows.push(["SEVIS", String(r.year), "% male", r.male, r.src]);
  });
  rows.push(["SEVIS", "2024", "Records with STEM OPT authorization", so.india, "sevis24stem"]);
  rows.push(["SEVIS", "2024", "India share of all STEM OPT (%)", so.indiaSharePct, "sevis24"]);
  rows.push(["SEVIS", "2023", "India share of all STEM OPT (%)", so.indiaSharePct2023, "sevis23"]);
  const dc = D.sevisDegreeContext;
  rows.push(["SEVIS (all countries)", "2024", "Foreign students seeking a master's degree", dc.masters, dc.src]);

  $("#dataTable tbody").innerHTML = rows.map((r) =>
    `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="r">${typeof r[3] === "number" ? fmt(r[3]) : r[3]}</td><td><a href="${S[r[4]].url}" target="_blank" rel="noopener">${S[r[4]].label}</a></td></tr>`
  ).join("");

  $("#csvBtn").addEventListener("click", () => {
    const q = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [["dataset", "period", "measure", "value", "source", "source_url"]]
      .concat(rows.map((r) => [r[0], r[1], r[2], r[3], S[r[4]].label, S[r[4]].url]))
      .map((r) => r.map(q).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "india-us-students-data.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  $("#srcList").innerHTML = Object.values(S).map((s) =>
    `<li><a href="${s.url}" target="_blank" rel="noopener">${s.label}</a> — ${s.publisher}. ${s.covers}.</li>`
  ).join("");

  /* ---------- interactions ---------- */
  document.querySelectorAll(".seg button").forEach((b) => b.addEventListener("click", () => {
    document.querySelectorAll(".seg button").forEach((x) => x.classList.toggle("on", x === b));
    unit = b.dataset.unit; drawLevels();
  }));
  sel.addEventListener("change", () => renderKpis(sel.value));

  drawAll();
  renderKpis(sel.value);
})();
