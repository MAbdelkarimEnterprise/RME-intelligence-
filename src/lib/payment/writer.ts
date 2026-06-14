import type { MatchResult, ValidationIssue, ExtractedItem } from "./engine";
import { populateUnifierTemplate } from "./populate";

/**
 * Download builders for IPC Merger.
 *  - Invoice  → REAL .xlsx: the built-in Unifier template populated in place
 *               (see ./populate.ts). Structurally identical, import-ready.
 *  - Reports  → clean CSV (opens natively in Excel, no HTML artefacts).
 */

function downloadText(filename: string, content: string, mime: string) {
  const blob = new Blob(["﻿" + content], { type: mime });
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

function toCSV(headers: string[], rows: (string | number)[][]): string {
  return [
    headers.map(csvCell).join(","),
    ...rows.map((r) => r.map(csvCell).join(",")),
  ].join("\n");
}

/** Primary deliverable — the populated, import-ready Unifier workbook. */
export async function downloadInvoice(matches: MatchResult[]) {
  await populateUnifierTemplate(matches);
}

export function downloadMatchingReport(matches: MatchResult[]) {
  const headers = [
    "Template Ref",
    "BOQ No.",
    "Excel Description",
    "PDF Description",
    "Match Level",
    "Confidence %",
    "Weights Detected",
    "Current Qty",
    "Work %",
    "Payment %",
    "Note",
  ];
  const rows = matches.map((m) => [
    m.template?.ref ?? "",
    m.template?.code ?? "",
    m.template?.boqDescription ?? "",
    m.extracted?.description ?? "—",
    m.level,
    m.confidence ? `${m.confidence}%` : "—",
    m.weights.map((w) => `${w.percent}% ${w.description}`).join("; ") || "—",
    m.extracted?.currentQuantity ?? "",
    m.extracted ? `${m.extracted.workCompletedPct}%` : "",
    m.extracted ? `${m.extracted.paymentPct}%` : "",
    m.note,
  ]);
  downloadText(
    "RME_AI_Matching_Report.csv",
    toCSV(headers, rows),
    "text/csv;charset=utf-8;"
  );
}

export function downloadExceptionReport(
  issues: ValidationIssue[],
  unmatchedExtracted: ExtractedItem[]
) {
  const headers = ["Severity", "Reference", "Issue"];
  const rows = [
    ...issues.map((i) => [i.level.toUpperCase(), i.ref, i.message]),
    ...unmatchedExtracted.map((e) => [
      "REVIEW",
      e.ref,
      `Unmatched PDF item: ${e.description}`,
    ]),
  ];
  downloadText(
    "RME_Exception_Report.csv",
    toCSV(headers, rows),
    "text/csv;charset=utf-8;"
  );
}
