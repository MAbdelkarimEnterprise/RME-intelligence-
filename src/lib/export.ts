/**
 * Dependency-free client-side exporters. No npm packages required, so nothing
 * extra to install. Covers the three formats the brief asks for:
 *   - Excel  → CSV (opens natively in Excel) and a real .xls (HTML-table) option
 *   - Word   → .doc (Word-compatible HTML)
 *   - PDF    → print-to-PDF via a styled print window
 */

export type Column<T> = {
  header: string;
  value: (row: T) => string | number;
};

function download(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function csvCell(v: string | number): string {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Excel-friendly CSV. */
export function exportCSV<T>(
  filename: string,
  rows: T[],
  columns: Column<T>[]
) {
  const head = columns.map((c) => csvCell(c.header)).join(",");
  const body = rows
    .map((r) => columns.map((c) => csvCell(c.value(r))).join(","))
    .join("\n");
  download(
    filename.endsWith(".csv") ? filename : `${filename}.csv`,
    new Blob(["﻿" + head + "\n" + body], {
      type: "text/csv;charset=utf-8;",
    })
  );
}

/** Real .xls via HTML table (Excel opens it as a worksheet). */
export function exportExcel<T>(
  filename: string,
  title: string,
  rows: T[],
  columns: Column<T>[]
) {
  const th = columns
    .map(
      (c) =>
        `<th style="background:#0c1424;color:#fff;text-align:left;padding:6px 10px;border:1px solid #cdd3df">${c.header}</th>`
    )
    .join("");
  const trs = rows
    .map(
      (r) =>
        `<tr>${columns
          .map(
            (c) =>
              `<td style="padding:5px 10px;border:1px solid #e2e6ee">${String(
                c.value(r)
              )}</td>`
          )
          .join("")}</tr>`
    )
    .join("");
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body><h3>${title}</h3><table>${`<tr>${th}</tr>`}${trs}</table></body></html>`;
  download(
    `${filename}.xls`,
    new Blob([html], { type: "application/vnd.ms-excel" })
  );
}

/** Word-compatible .doc export. `bodyHtml` is the report content. */
export function exportWord(filename: string, title: string, bodyHtml: string) {
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${title}</title>
  <style>
    body{font-family:'Segoe UI',Arial,sans-serif;color:#1a2233;font-size:11pt}
    h1{color:#0c1424;font-size:18pt;margin:0 0 4pt}
    h2{color:#C8102E;font-size:13pt;margin:16pt 0 4pt}
    table{border-collapse:collapse;width:100%;margin:8pt 0;font-size:9.5pt}
    th{background:#0c1424;color:#fff;text-align:left;padding:5pt 7pt;border:1px solid #99a}
    td{padding:4pt 7pt;border:1px solid #cdd3df}
    .muted{color:#5c6473}
  </style></head><body>${bodyHtml}</body></html>`;
  download(
    `${filename}.doc`,
    new Blob(["﻿" + html], { type: "application/msword" })
  );
}

/** Print-to-PDF: opens a styled window and triggers the browser print dialog. */
export function exportPDF(title: string, bodyHtml: string) {
  const w = window.open("", "_blank", "width=1024,height=768");
  if (!w) return;
  w.document.write(`<html><head><meta charset="utf-8"><title>${title}</title>
  <style>
    *{box-sizing:border-box}
    body{font-family:'Segoe UI',Arial,sans-serif;color:#1a2233;margin:28px}
    h1{color:#0c1424;font-size:22px;margin:0 0 2px}
    h2{color:#C8102E;font-size:15px;margin:22px 0 6px}
    .sub{color:#5c6473;font-size:12px;margin-bottom:18px}
    table{border-collapse:collapse;width:100%;margin:8px 0;font-size:11px}
    th{background:#0c1424;color:#fff;text-align:left;padding:7px 9px}
    td{padding:6px 9px;border-bottom:1px solid #e2e6ee}
    .badge{display:inline-block;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:600}
    @media print{button{display:none}}
  </style></head><body>${bodyHtml}
  <button onclick="window.print()" style="margin-top:20px;padding:8px 16px;background:#C8102E;color:#fff;border:0;border-radius:6px;cursor:pointer">Print / Save as PDF</button>
  <script>setTimeout(function(){window.print()},400)</script>
  </body></html>`);
  w.document.close();
}
