import type { MatchResult } from "./engine";

/**
 * REAL Oracle Primavera Unifier template population.
 *
 * Loads the built-in import template (public/unifier-template.xlsx), writes the
 * matched line items into the exact data-entry cells of the "Import Data
 * Template" sheet (H/D/CA convention, Weight 1–10 blocks), and preserves every
 * other sheet — including the XDO_METADATA Oracle BI Publisher tags — so the
 * result is structurally identical to the template and import-ready.
 *
 * Output is a genuine .xlsx (not an HTML-table placeholder). `xlsx` (SheetJS)
 * is loaded dynamically so the rest of the app works even before it's installed.
 */

const SHEET = "Import Data Template";

export async function populateUnifierTemplate(
  matches: MatchResult[]
): Promise<void> {
  let XLSX: typeof import("xlsx");
  try {
    XLSX = await import("xlsx");
  } catch {
    alert(
      "The Excel engine isn't installed yet. Run `npm install` in the project, restart the dev server, then try again."
    );
    return;
  }

  // 1) Load the built-in template (preserves all sheets + structure)
  const res = await fetch("/unifier-template.xlsx");
  if (!res.ok) throw new Error("Unifier template asset not found in /public.");
  const buf = await res.arrayBuffer();
  const wb = XLSX.read(buf, { cellStyles: true, cellFormula: true });
  const ws = wb.Sheets[SHEET];
  if (!ws) throw new Error(`Sheet "${SHEET}" missing from template.`);

  const range = XLSX.utils.decode_range(ws["!ref"]!);
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(ws, {
    header: 1,
    defval: null,
    blankrows: true,
  });

  // 2) Locate the "D" header row and map columns by header label
  let hdr = -1;
  aoa.forEach((r, i) => {
    if (
      Array.isArray(r) &&
      String(r[0]).trim() === "D" &&
      r.some((c) => String(c).trim() === "BOQ Description")
    )
      hdr = i;
  });
  if (hdr < 0) throw new Error("Could not locate the template data header row.");
  const H = aoa[hdr] as unknown[];
  const col = (name: string) =>
    H.findIndex((c) => String(c).trim() === name);

  const C = {
    pct: col("Percentage Complete"),
    boqNo: col("BOQ No."),
    desc: col("BOQ Description"),
    unit: col("Unit of Measure"),
    qty: col("Item Quantity"),
    cost: col("Item Unit Cost"),
    sched: col("Scheduled Value"),
    w1desc: col("Weight 1 Description"),
    curAmt: col("Current Amount"),
    curQty: col("Current Quantity"),
    totQty: col("Total Quantity"),
    pctToDate: col("Percentage Complete to Date"),
  };

  const set = (r: number, c: number, v: string | number | null) => {
    if (c < 0 || v === null || v === undefined || v === "") return;
    const addr = XLSX.utils.encode_cell({ r, c });
    ws[addr] = { t: typeof v === "number" ? "n" : "s", v } as never;
    if (c > range.e.c) range.e.c = c;
    if (r > range.e.r) range.e.r = r;
  };

  // 3) Write a D row per matched line item, starting after the CA header row
  let r = hdr + 2;
  for (const m of matches) {
    if (!m.template) continue;
    const t = m.template;
    const e = m.extracted;
    const currentAmount = e ? Math.round(e.currentQuantity * t.unitCost) : 0;

    set(r, 0, "D");
    set(r, 1, "Line Items");
    set(r, 2, t.ref);
    set(r, C.boqNo, t.code);
    set(r, C.desc, t.boqDescription);
    set(r, C.unit, t.unit);
    set(r, C.qty, t.itemQuantity);
    set(r, C.cost, t.unitCost);
    set(r, C.sched, Math.round(t.itemQuantity * t.unitCost));
    set(r, C.pct, e?.workCompletedPct ?? 0);

    m.weights.slice(0, 10).forEach((w, i) => {
      const base = C.w1desc + i * 5;
      if (base < 0) return;
      set(r, base, w.description);
      set(r, base + 1, w.percent);
      set(r, base + 2, e ? Math.round((e.currentQuantity * w.percent) / 100) : 0);
      set(r, base + 3, Math.round((currentAmount * w.percent) / 100));
      set(r, base + 4, e?.paymentPct ?? 0);
    });

    set(r, C.curAmt, currentAmount);
    set(r, C.curQty, e?.currentQuantity ?? 0);
    set(r, C.totQty, e?.currentQuantity ?? 0);
    set(r, C.pctToDate, e?.workCompletedPct ?? 0);
    r += 1;
  }

  ws["!ref"] = XLSX.utils.encode_range(range);

  // 4) Write a real .xlsx and download it
  XLSX.writeFile(wb, "RME_ClientInvoice_Unifier_Populated.xlsx", {
    bookType: "xlsx",
  });
}
