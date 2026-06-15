import type {
  BoqRow,
  DiffStatus,
  WorkPackage,
  WorkPackageKey,
} from "@/lib/boq-types";
import { norm, type BoqLineItem } from "./parse";

/** Everything the BOQ dashboard needs, computed from real parsed files. */
export interface BoqAnalysis {
  rows: BoqRow[];
  summary: {
    valueA: number;
    valueB: number;
    valueDelta: number;
    priced: boolean; // false when rates are blank (unpriced tender BOQ)
    totalItems: number;
    added: number;
    removed: number;
    changed: number;
    unchanged: number;
  };
  workPackages: WorkPackage[];
  totals: { itemsA: number; itemsB: number };
}

const WP_META: Record<WorkPackageKey, { name: string; color: string }> = {
  civil: { name: "Civil Works", color: "#C8102E" },
  structural: { name: "Structural Works", color: "#3c5174" },
  architectural: { name: "Architectural Works", color: "#1f7a52" },
  mechanical: { name: "Mechanical (MEP)", color: "#b5651d" },
  electrical: { name: "Electrical", color: "#8a6d1f" },
  infrastructure: { name: "Infrastructure", color: "#5c6e88" },
  landscape: { name: "Landscape", color: "#4b7a3f" },
};

const keyOf = (it: BoqLineItem) =>
  `${it.sheet}||${it.code || norm(it.description)}||${it.occurrence}`;

const lineValue = (it: BoqLineItem) =>
  it.amount != null && it.amount > 0
    ? it.amount
    : it.rate != null
    ? it.qty * it.rate
    : 0;

export function analyzeBoq(a: BoqLineItem[], b: BoqLineItem[]): BoqAnalysis {
  const mapA = new Map(a.map((it) => [keyOf(it), it]));
  const mapB = new Map(b.map((it) => [keyOf(it), it]));

  const rows: BoqRow[] = [];
  let added = 0,
    removed = 0,
    changed = 0,
    unchanged = 0;

  // Walk A → matched / removed
  for (const ia of a) {
    const ib = mapB.get(keyOf(ia));
    if (!ib) {
      removed += 1;
      rows.push(makeRow(ia, null, "Removed", "Not present in Rev B"));
      continue;
    }
    let status: DiffStatus = "Unchanged";
    let note: string | undefined;
    if (Math.abs(ia.qty - ib.qty) > 0.001) {
      status = "Quantity Change";
      const d = ib.qty - ia.qty;
      note = `${d > 0 ? "+" : ""}${round(d)} ${ia.unit}`.trim();
    } else if (
      ia.rate != null &&
      ib.rate != null &&
      Math.abs(ia.rate - ib.rate) > 0.001
    ) {
      status = "Rate Change";
      const pct = ((ib.rate - ia.rate) / ia.rate) * 100;
      note = `${pct > 0 ? "+" : ""}${pct.toFixed(1)}% rate`;
    } else if (norm(ia.unit) !== norm(ib.unit)) {
      status = "Unit Change";
      note = `${ia.unit} → ${ib.unit}`;
    }
    if (status === "Unchanged") unchanged += 1;
    else changed += 1;
    rows.push(makeRow(ia, ib, status, note));
  }
  // Walk B → added
  for (const ib of b) {
    if (!mapA.has(keyOf(ib))) {
      added += 1;
      rows.push(makeRow(null, ib, "Added", "New in Rev B"));
    }
  }

  // sort: changes/added/removed first, unchanged last
  const order: Record<DiffStatus, number> = {
    Removed: 0,
    Added: 1,
    "Scope Change": 2,
    "Quantity Change": 3,
    "Rate Change": 4,
    "Unit Change": 5,
    Modified: 6,
    Unchanged: 9,
  };
  rows.sort((x, y) => order[x.status] - order[y.status]);

  const valueA = a.reduce((s, it) => s + lineValue(it), 0);
  const valueB = b.reduce((s, it) => s + lineValue(it), 0);
  const priced = valueA > 0 || valueB > 0;

  // work package rollup
  const wpCount = new Map<WorkPackageKey, { items: number }>();
  for (const it of b.length ? b : a) {
    const c = wpCount.get(it.workPackage) ?? { items: 0 };
    c.items += 1;
    wpCount.set(it.workPackage, c);
  }
  const workPackages: WorkPackage[] = [...wpCount.entries()].map(
    ([key, v]) => ({
      key,
      name: WP_META[key].name,
      color: WP_META[key].color,
      boqItems: v.items,
      specSections: 0,
      conflicts: 0,
      subPackages: [],
    })
  );
  workPackages.sort((x, y) => y.boqItems - x.boqItems);

  return {
    rows,
    summary: {
      valueA,
      valueB,
      valueDelta: valueB - valueA,
      priced,
      totalItems: rows.length,
      added,
      removed,
      changed,
      unchanged,
    },
    workPackages,
    totals: { itemsA: a.length, itemsB: b.length },
  };
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

function makeRow(
  ia: BoqLineItem | null,
  ib: BoqLineItem | null,
  status: DiffStatus,
  note?: string
): BoqRow {
  const ref = ia ?? ib!;
  return {
    id: `${ref.sheet}-${ref.code || ref.occurrence}-${Math.random()
      .toString(36)
      .slice(2, 6)}`,
    item: ref.description,
    section: ref.sheet,
    workPackage: ref.workPackage,
    unit: ref.unit,
    qtyA: ia ? ia.qty : null,
    qtyB: ib ? ib.qty : null,
    rateA: ia?.rate ?? null,
    rateB: ib?.rate ?? null,
    status,
    note,
  };
}
