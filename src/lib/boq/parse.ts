import type { WorkPackageKey } from "@/lib/boq-types";

/**
 * Real BOQ workbook parser (client-side, SheetJS).
 *
 * Walks every sheet, finds the line-item header row (Description + Quantity),
 * and extracts measured line items with their real quantities/rates/amounts.
 * Used by the BOQ Intelligence engine to produce true numbers from the user's
 * actual uploaded .xlsx files — no demo data.
 */

export interface BoqLineItem {
  sheet: string;
  code: string;
  description: string;
  unit: string;
  qty: number;
  rate: number | null;
  amount: number | null;
  /** disambiguates duplicate descriptions within the same sheet */
  occurrence: number;
  workPackage: WorkPackageKey;
}

export function norm(s: unknown): string {
  return String(s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toNum(v: unknown): number | null {
  if (typeof v === "number") return v;
  if (v == null) return null;
  const n = parseFloat(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

/** Map an explicit BOQ "Work Package" cell value to a known key. */
export function wpFromLabel(label: string): WorkPackageKey | null {
  const l = label.toLowerCase();
  if (!l.trim()) return null;
  // NOTE: check "infra" before "struct" — "infraSTRUCTure" contains "struct".
  if (l.includes("infra")) return "infrastructure";
  if (l.includes("architect")) return "architectural";
  if (l.includes("struct")) return "structural";
  if (l.includes("mech") || l.includes("mep") || l.includes("plumb") || l.includes("hvac")) return "mechanical";
  if (l.includes("elec")) return "electrical";
  if (l.includes("landscape")) return "landscape";
  if (l.includes("civil")) return "civil";
  return null;
}

/** Classify a sheet/description into a work package by keyword. */
export function classify(sheet: string, desc: string): WorkPackageKey {
  const s = (sheet + " " + desc).toLowerCase();
  if (/(elect|mv|lv|earthing|lighting|elv|power|cable|low current)/.test(s)) return "electrical";
  if (/(water|fire|irrigation|sanitary|piping|hvac|mech|plumb|pump|drainage)/.test(s)) return "mechanical";
  if (/(road|paving|storm|excavat|earthwork|fence|gate|infrastructure|utilit)/.test(s)) return "infrastructure";
  if (/(landscape|irrigation|softscape|hardscape|planting)/.test(s)) return "landscape";
  if (/(steel|foundation|raft|concrete frame|column|beam|structural)/.test(s)) return "structural";
  if (/(finish|floor|ceiling|door|window|facade|paint|tiling|gypsum|architect|building|warehouse|mosque|booth|office|room)/.test(s)) return "architectural";
  return "civil";
}

export async function parseBoqWorkbook(buf: ArrayBuffer): Promise<BoqLineItem[]> {
  const XLSX = await import("xlsx");
  const wb = XLSX.read(buf, { cellFormula: false });
  const items: BoqLineItem[] = [];
  const seen = new Map<string, number>();

  for (const sheet of wb.SheetNames) {
    const ws = wb.Sheets[sheet];
    if (!ws || !ws["!ref"]) continue;
    const aoa = XLSX.utils.sheet_to_json<unknown[]>(ws, {
      header: 1,
      defval: null,
      blankrows: false,
    });

    // locate the header row (Description + Quantity) within the first 40 rows
    let hdr = -1;
    for (let i = 0; i < Math.min(aoa.length, 40); i++) {
      const r = (aoa[i] || []).map(norm);
      if (
        r.some((c) => c.includes("description")) &&
        r.some((c) => c.includes("quantity") || c === "qty")
      ) {
        hdr = i;
        break;
      }
    }
    if (hdr < 0) continue;

    const H = (aoa[hdr] || []).map(norm);
    const find = (pred: (h: string) => boolean) => H.findIndex(pred);
    const has = (h: string, ...subs: string[]) => subs.some((x) => h.includes(x));

    const cDesc = find((h) => h.includes("description"));
    const cQty = find((h) => h.includes("quantity") || h === "qty");
    // rate / unit price (matches "rate", "rate (egp)", "unit rate", "unit price")
    const cRate = find((h) => has(h, "rate", "unit price", "unit rate"));
    // amount / total value (matches "amount", "amount (egp)", "total amount")
    const cAmt = find(
      (h) => h.includes("amount") || h === "total" || h.includes("total amount")
    );
    // unit of measure — must NOT grab "unit price" / "unit rate"
    const cUnit = find(
      (h) => h === "unit" || h === "uom" || h.includes("unit of measure")
    );
    const cItem = find(
      (h) => h === "item" || h.includes("item no") || h === "code" || h === "ref"
    );
    // Respect an explicit Work Package / Trade / Discipline column if present.
    const cWP = find(
      (h) =>
        h.includes("work package") ||
        h.includes("trade") ||
        h.includes("discipline")
    );

    for (let i = hdr + 1; i < aoa.length; i++) {
      const row = aoa[i] || [];
      const desc = row[cDesc];
      const q = cQty >= 0 ? toNum(row[cQty]) : null;
      if (!desc || q == null || q <= 0) continue; // a real measured line

      const description = String(desc).replace(/\s+/g, " ").trim();
      // Occurrence is global (per normalized description, across the whole
      // workbook) so matching is independent of sheet names — two revisions
      // whose sheets are named differently still reconcile correctly.
      const dupKey = norm(description);
      const occurrence = (seen.get(dupKey) ?? 0) + 1;
      seen.set(dupKey, occurrence);

      items.push({
        sheet,
        code: cItem >= 0 ? String(row[cItem] ?? "").trim() : "",
        description,
        unit: cUnit >= 0 ? String(row[cUnit] ?? "").trim() : "",
        qty: q,
        rate: cRate >= 0 ? toNum(row[cRate]) : null,
        amount: cAmt >= 0 ? toNum(row[cAmt]) : null,
        occurrence,
        workPackage:
          (cWP >= 0 ? wpFromLabel(String(row[cWP] ?? "")) : null) ??
          classify(sheet, description),
      });
    }
  }
  return items;
}
