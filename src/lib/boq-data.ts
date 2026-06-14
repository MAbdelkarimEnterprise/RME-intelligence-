import type {
  BoqRow,
  Conflict,
  WorkPackage,
  WorkPackageKey,
  Severity,
} from "./boq-types";

/**
 * Demo dataset for the BOQ & Specification Intelligence engine.
 * Grounded in a realistic RME infrastructure/building tender so the workflow
 * is fully demonstrable. When Claude + parsing are wired, these structures are
 * produced by the analysis pipeline instead (see /api/chat reasoning notes).
 */

export const tenderProject = {
  name: "New Alamein — Mixed-Use Tower (Tender Rev. A → Rev. B)",
  client: "Alamein Urban Development Authority",
  boqA: "BOQ_AlameinTower_RevA.xlsx",
  boqB: "BOQ_AlameinTower_RevB.xlsx",
  spec: "Technical_Specifications_Vol1-3.pdf",
  tender: "Tender_Conditions_and_Scope.pdf",
};

export const workPackages: WorkPackage[] = [
  {
    key: "civil",
    name: "Civil Works",
    color: "#C8102E",
    boqItems: 134,
    specSections: 22,
    conflicts: 3,
    subPackages: ["Excavation", "Concrete", "Reinforcement", "Backfill"],
  },
  {
    key: "structural",
    name: "Structural Works",
    color: "#3c5174",
    boqItems: 98,
    specSections: 18,
    conflicts: 2,
    subPackages: ["Foundations", "Steel", "Concrete Frames", "Post-Tension"],
  },
  {
    key: "architectural",
    name: "Architectural Works",
    color: "#1f7a52",
    boqItems: 156,
    specSections: 27,
    conflicts: 1,
    subPackages: ["Finishes", "Flooring", "Doors", "Ceilings", "Façade"],
  },
  {
    key: "mechanical",
    name: "Mechanical (MEP)",
    color: "#b5651d",
    boqItems: 87,
    specSections: 14,
    conflicts: 2,
    subPackages: ["HVAC", "Plumbing", "Fire Fighting", "Drainage"],
  },
  {
    key: "electrical",
    name: "Electrical",
    color: "#8a6d1f",
    boqItems: 63,
    specSections: 10,
    conflicts: 1,
    subPackages: ["Power", "Lighting", "Low Current", "Earthing"],
  },
  {
    key: "infrastructure",
    name: "Infrastructure",
    color: "#5c6e88",
    boqItems: 71,
    specSections: 12,
    conflicts: 1,
    subPackages: ["Roads", "Utilities", "Drainage", "External Networks"],
  },
  {
    key: "landscape",
    name: "Landscape",
    color: "#4b7a3f",
    boqItems: 29,
    specSections: 6,
    conflicts: 0,
    subPackages: ["Irrigation", "Softscape", "Hardscape"],
  },
];

export const boqRows: BoqRow[] = [
  {
    id: "b-01",
    item: "Reinforced concrete C40 to columns & cores",
    section: "Concrete Works",
    workPackage: "structural",
    unit: "m³",
    qtyA: 1850,
    qtyB: 2120,
    rateA: 2450,
    rateB: 2450,
    status: "Quantity Change",
    note: "+270 m³ — added tower core to L32",
  },
  {
    id: "b-02",
    item: "Reinforced concrete C35 to rafts & footings",
    section: "Concrete Works",
    workPackage: "civil",
    unit: "m³",
    qtyA: 3200,
    qtyB: 3200,
    rateA: 2180,
    rateB: 2310,
    status: "Rate Change",
    note: "Rate +6% (cement escalation)",
  },
  {
    id: "b-03",
    item: "High-tensile reinforcement steel, cut & fixed",
    section: "Reinforcement",
    workPackage: "civil",
    unit: "Ton",
    qtyA: 980,
    qtyB: null,
    rateA: 41500,
    rateB: null,
    status: "Removed",
    note: "Item not present in Rev. B — verify scope",
  },
  {
    id: "b-04",
    item: "Self-adhesive waterproofing membrane to basement",
    section: "Waterproofing",
    workPackage: "civil",
    unit: "m²",
    qtyA: null,
    qtyB: 6400,
    rateA: null,
    rateB: 320,
    status: "Added",
    note: "New scope in Rev. B",
  },
  {
    id: "b-05",
    item: "Structural steel — composite floor beams",
    section: "Steel",
    workPackage: "structural",
    unit: "Ton",
    qtyA: 420,
    qtyB: 465,
    rateA: 58000,
    rateB: 58000,
    status: "Quantity Change",
  },
  {
    id: "b-06",
    item: "Bulk excavation in all soil types",
    section: "Excavation",
    workPackage: "civil",
    unit: "m³",
    qtyA: 24500,
    qtyB: 24500,
    rateA: 95,
    rateB: 95,
    status: "Unchanged",
  },
  {
    id: "b-07",
    item: "Ready-mix vs cast in-situ blinding concrete",
    section: "Concrete Works",
    workPackage: "civil",
    unit: "m³",
    qtyA: 310,
    qtyB: 310,
    rateA: 1650,
    rateB: 1650,
    status: "Modified",
    note: "Description reworded — AI flags as same scope (no quantity impact)",
  },
  {
    id: "b-08",
    item: "Aluminium unitised curtain-wall façade",
    section: "Façade",
    workPackage: "architectural",
    unit: "m²",
    qtyA: 12800,
    qtyB: 13950,
    rateA: 4200,
    rateB: 4200,
    status: "Quantity Change",
  },
  {
    id: "b-09",
    item: "Porcelain tiling to common areas",
    section: "Flooring",
    workPackage: "architectural",
    unit: "m²",
    qtyA: 9600,
    qtyB: 9600,
    rateA: 540,
    rateB: 540,
    status: "Unchanged",
  },
  {
    id: "b-10",
    item: "Gypsum suspended ceiling system",
    section: "Ceilings",
    workPackage: "architectural",
    unit: "m²",
    qtyA: 8200,
    qtyB: 7400,
    rateA: 310,
    rateB: 310,
    status: "Quantity Change",
    note: "-800 m² (open-soffit design change)",
  },
  {
    id: "b-11",
    item: "Chilled-water FCU units, supply & install",
    section: "HVAC",
    workPackage: "mechanical",
    unit: "No.",
    qtyA: 640,
    qtyB: 720,
    rateA: 18500,
    rateB: 18500,
    status: "Quantity Change",
  },
  {
    id: "b-12",
    item: "Fire-fighting wet riser & sprinkler network",
    section: "Fire Fighting",
    workPackage: "mechanical",
    unit: "Lump",
    qtyA: 1,
    qtyB: 1,
    rateA: 4250000,
    rateB: 4680000,
    status: "Rate Change",
    note: "Rate +10% — extended coverage to podium",
  },
  {
    id: "b-13",
    item: "Potable water piping — measured per metre",
    section: "Plumbing",
    workPackage: "mechanical",
    unit: "m",
    qtyA: 14200,
    qtyB: 14200,
    rateA: 145,
    rateB: 145,
    status: "Unit Change",
    note: "Rev. A in 'm', Rev. B priced in 'LM' — confirm equivalence",
  },
  {
    id: "b-14",
    item: "LV main distribution boards & switchgear",
    section: "Power",
    workPackage: "electrical",
    unit: "No.",
    qtyA: 36,
    qtyB: 42,
    rateA: 165000,
    rateB: 165000,
    status: "Quantity Change",
  },
  {
    id: "b-15",
    item: "LED architectural lighting fittings",
    section: "Lighting",
    workPackage: "electrical",
    unit: "No.",
    qtyA: 4800,
    qtyB: 4800,
    rateA: 1250,
    rateB: 1180,
    status: "Rate Change",
  },
  {
    id: "b-16",
    item: "Structured cabling & low-current backbone",
    section: "Low Current",
    workPackage: "electrical",
    unit: "Lump",
    qtyA: null,
    qtyB: 1,
    rateA: null,
    rateB: 1850000,
    status: "Added",
    note: "New BMS/ELV package in Rev. B",
  },
  {
    id: "b-17",
    item: "Flexible pavement — asphalt wearing course",
    section: "Roads",
    workPackage: "infrastructure",
    unit: "m²",
    qtyA: 18600,
    qtyB: 18600,
    rateA: 280,
    rateB: 280,
    status: "Unchanged",
  },
  {
    id: "b-18",
    item: "Stormwater drainage — RCP pipes & manholes",
    section: "Drainage",
    workPackage: "infrastructure",
    unit: "m",
    qtyA: 3400,
    qtyB: 3950,
    rateA: 680,
    rateB: 680,
    status: "Scope Change",
    note: "Network extended to plot boundary",
  },
  {
    id: "b-19",
    item: "Automatic drip irrigation system",
    section: "Irrigation",
    workPackage: "landscape",
    unit: "m²",
    qtyA: 5200,
    qtyB: 5200,
    rateA: 95,
    rateB: 95,
    status: "Unchanged",
  },
  {
    id: "b-20",
    item: "Precast concrete paving — hardscape",
    section: "Hardscape",
    workPackage: "landscape",
    unit: "m²",
    qtyA: 3100,
    qtyB: 2600,
    rateA: 420,
    rateB: 420,
    status: "Quantity Change",
    note: "-500 m² (revised plaza layout)",
  },
];

export const conflicts: Conflict[] = [
  {
    id: "c-01",
    type: "Specification Conflict",
    workPackage: "structural",
    section: "Concrete Works",
    specRef: "Spec Vol.1 §03300 — Cast-in-place Concrete",
    boqRef: "BOQ Item 2.1 — Columns & Cores",
    description:
      "Specification requires C40/20 concrete to all vertical structural elements; BOQ Rev. B prices C35 to columns above L20. Grade downgrade affects load capacity and durability class.",
    severity: "High",
    recommendedAction:
      "Confirm structural grade with design engineer; re-price columns L20–L32 at C40 or obtain formal design concession.",
  },
  {
    id: "c-02",
    type: "Missing BOQ Item",
    workPackage: "civil",
    section: "Waterproofing",
    specRef: "Spec Vol.1 §07100 — Tanking & Waterproofing",
    boqRef: "— (no corresponding item in Rev. A)",
    description:
      "Specification mandates a full basement tanking membrane system. Rev. A BOQ contained no waterproofing line item (added only in Rev. B). Pricing gap of ~6,400 m².",
    severity: "High",
    recommendedAction:
      "Ensure waterproofing scope is carried and priced; reconcile against Rev. B Item 1.4 before tender submission.",
  },
  {
    id: "c-03",
    type: "Specification Conflict",
    workPackage: "mechanical",
    section: "Fire Fighting",
    specRef: "Spec Vol.2 §21000 — Fire Suppression (NFPA 13)",
    boqRef: "BOQ Item 6.2 — Wet Riser & Sprinklers",
    description:
      "Specification references NFPA 13 full coverage including podium parking; BOQ Rev. A scope excluded podium levels. Coverage standard mismatch.",
    severity: "High",
    recommendedAction:
      "Align sprinkler coverage to NFPA 13; Rev. B rate already extended — verify quantities match spec zones.",
  },
  {
    id: "c-04",
    type: "Unit / Standard Mismatch",
    workPackage: "mechanical",
    section: "Plumbing",
    specRef: "Spec Vol.2 §22100 — Domestic Water Piping",
    boqRef: "BOQ Item 6.3 — Potable Water Piping",
    description:
      "Rev. A measures piping in 'm'; Rev. B prices in 'LM'. Likely equivalent but unverified — risk of double-counting or measurement dispute at valuation.",
    severity: "Medium",
    recommendedAction:
      "Standardise unit of measure to 'm' across both revisions; add UOM note to BOQ preamble.",
  },
  {
    id: "c-05",
    type: "BOQ Item Without Specification Reference",
    workPackage: "electrical",
    section: "Low Current",
    specRef: "— (no matching spec section found)",
    boqRef: "BOQ Item 7.4 — Structured Cabling / ELV (Rev. B)",
    description:
      "Rev. B introduces a low-current/BMS lump-sum package with no corresponding technical specification section. Scope definition risk for ELV systems.",
    severity: "Medium",
    recommendedAction:
      "Request ELV specification from consultant or define scope in a tender clarification before pricing the lump sum.",
  },
  {
    id: "c-06",
    type: "Specification Conflict",
    workPackage: "architectural",
    section: "Façade",
    specRef: "Spec Vol.1 §08400 — Curtain Wall (U-value ≤ 1.8)",
    boqRef: "BOQ Item 4.1 — Unitised Curtain Wall",
    description:
      "Specification sets a thermal performance U-value ≤ 1.8 W/m²K; BOQ description does not state glazing performance, creating compliance ambiguity.",
    severity: "Medium",
    recommendedAction:
      "Add glazing spec (double low-E, thermally broken) to BOQ description to lock compliance and rate basis.",
  },
  {
    id: "c-07",
    type: "Missing BOQ Item",
    workPackage: "structural",
    section: "Steel",
    specRef: "Spec Vol.1 §05120 — Structural Steel Fire Protection",
    boqRef: "— (no intumescent coating item)",
    description:
      "Specification requires 120-minute intumescent fire protection to exposed steel; no BOQ item covers the coating works.",
    severity: "High",
    recommendedAction:
      "Add intumescent coating line item (~465 Ton steel surface area) to avoid an uncovered cost at execution.",
  },
  {
    id: "c-08",
    type: "BOQ Item Without Specification Reference",
    workPackage: "infrastructure",
    section: "Drainage",
    specRef: "— (extension beyond spec drawings)",
    boqRef: "BOQ Item 8.2 — Stormwater Network (Rev. B)",
    description:
      "Rev. B extends stormwater network to plot boundary beyond the extent shown on specification drawings. Scope creep risk if not covered by tender addendum.",
    severity: "Low",
    recommendedAction:
      "Confirm boundary extent against latest tender addendum; flag as provisional if undefined.",
  },
];

// ── Derived executive-summary figures ──────────────────────────
function lineValue(qty: number | null, rate: number | null) {
  return qty != null && rate != null ? qty * rate : 0;
}

export const execSummary = (() => {
  const valueA = boqRows.reduce((s, r) => s + lineValue(r.qtyA, r.rateA), 0);
  const valueB = boqRows.reduce((s, r) => s + lineValue(r.qtyB, r.rateB), 0);
  const byStatus = boqRows.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});
  const bySeverity = conflicts.reduce<Record<Severity, number>>(
    (acc, c) => {
      acc[c.severity] = (acc[c.severity] ?? 0) + 1;
      return acc;
    },
    { High: 0, Medium: 0, Low: 0 }
  );
  return {
    valueA,
    valueB,
    valueDelta: valueB - valueA,
    totalItems: boqRows.length,
    added: byStatus["Added"] ?? 0,
    removed: byStatus["Removed"] ?? 0,
    changed:
      (byStatus["Quantity Change"] ?? 0) +
      (byStatus["Rate Change"] ?? 0) +
      (byStatus["Unit Change"] ?? 0) +
      (byStatus["Scope Change"] ?? 0) +
      (byStatus["Modified"] ?? 0),
    unchanged: byStatus["Unchanged"] ?? 0,
    conflicts: conflicts.length,
    bySeverity,
    workPackages: workPackages.length,
  };
})();

export const workPackageLabels: Record<WorkPackageKey, string> =
  Object.fromEntries(workPackages.map((w) => [w.key, w.name])) as Record<
    WorkPackageKey,
    string
  >;

export function formatEGP(n: number): string {
  if (Math.abs(n) >= 1_000_000)
    return `${(n / 1_000_000).toFixed(2)}M EGP`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(0)}K EGP`;
  return `${n.toFixed(0)} EGP`;
}
