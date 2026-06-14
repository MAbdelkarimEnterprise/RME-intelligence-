import type { TemplateItem, ExtractedItem } from "./engine";

/**
 * Demo intermediary data for Payment Application Intelligence.
 *
 * `templateItems` = line items read from the Client Invoice (Unifier) Excel.
 * `extractedItems` = the structured JSON the OCR/extraction engine would emit
 *                    from the Technical Office Payment Application PDF.
 *
 * Descriptions are intentionally varied (exact, fuzzy, reworded, code-only,
 * plus one PDF-only and one Excel-only item) so the real matching engine has
 * genuine work to do. Weight breakdowns mirror real RME activity splits.
 */

export const projectMeta = {
  contract: "CLI.CON-000242",
  project: "New Alamein — Mixed-Use Tower",
  ipcNo: "IPC-014",
  cutoff: "31 May 2026",
  template: "Client Invoice Template (Oracle Primavera Unifier)",
  pdf: "Technical_Office_Payment_Application_IPC-014.pdf",
};

export const templateItems: TemplateItem[] = [
  { ref: "1", code: "2.1", boqDescription: "Reinforced concrete C40 to columns & cores", unit: "m3", itemQuantity: 2120, unitCost: 2450 },
  { ref: "2", code: "2.2", boqDescription: "Reinforced concrete C35 to rafts & footings", unit: "m3", itemQuantity: 3200, unitCost: 2310 },
  { ref: "3", code: "5.1", boqDescription: "Structural steel — composite floor beams", unit: "Ton", itemQuantity: 465, unitCost: 58000 },
  { ref: "4", code: "4.1", boqDescription: "Aluminium unitised curtain-wall façade", unit: "m2", itemQuantity: 13950, unitCost: 4200 },
  { ref: "5", code: "4.3", boqDescription: "Gypsum suspended ceiling system", unit: "m2", itemQuantity: 7400, unitCost: 310 },
  { ref: "6", code: "6.1", boqDescription: "Chilled-water FCU units, supply & install", unit: "No.", itemQuantity: 720, unitCost: 18500 },
  { ref: "7", code: "6.2", boqDescription: "Fire-fighting wet riser & sprinkler network", unit: "Lump", itemQuantity: 1, unitCost: 4680000 },
  { ref: "8", code: "1.4", boqDescription: "Self-adhesive waterproofing membrane to basement", unit: "m2", itemQuantity: 6400, unitCost: 320 },
  { ref: "9", code: "8.2", boqDescription: "Stormwater drainage — RCP pipes & manholes", unit: "m", itemQuantity: 3950, unitCost: 680 },
];

export const extractedItems: ExtractedItem[] = [
  // Exact match + full weight breakdown
  {
    ref: "P-01", code: "2.1",
    description: "Reinforced concrete C40 to columns & cores",
    unit: "m3", currentQuantity: 1480, workCompletedPct: 70, paymentPct: 64,
    weightsRaw: "50% Formwork 20% Reinforcement 20% Fixing 10% Concrete Pouring",
  },
  // Fuzzy / reworded description
  {
    ref: "P-02", code: "2.2",
    description: "RC C35 raft foundations & footings (cast in-situ)",
    unit: "m3", currentQuantity: 2880, workCompletedPct: 90, paymentPct: 88,
    weightsRaw: "55% Formwork 25% Reinforcement 20% Pouring",
  },
  // Code-only match (description quite different)
  {
    ref: "P-03", code: "5.1",
    description: "Steelwork — primary composite beams to floors",
    unit: "Ton", currentQuantity: 390, workCompletedPct: 84, paymentPct: 80,
    weightsRaw: "40% Fabrication 35% Erection 25% Bolting & Welding",
  },
  // Fuzzy, high similarity
  {
    ref: "P-04", code: "",
    description: "Aluminium unitized curtain wall facade",
    unit: "m2", currentQuantity: 9100, workCompletedPct: 65, paymentPct: 60,
    weightsRaw: "30% Procurement 30% Fabrication 25% Installation 15% Sealing",
  },
  // Weight total > 100 (validation error)
  {
    ref: "P-05", code: "4.3",
    description: "Gypsum suspended ceilings",
    unit: "m2", currentQuantity: 5200, workCompletedPct: 70, paymentPct: 68,
    weightsRaw: "60% Framing 30% Boarding 20% Finishing",
  },
  // Match, no weights (warning)
  {
    ref: "P-06", code: "6.1",
    description: "Chilled water fan-coil units supply and installation",
    unit: "No.", currentQuantity: 410, workCompletedPct: 57, paymentPct: 52,
  },
  // Match with weights
  {
    ref: "P-07", code: "6.2",
    description: "Firefighting wet riser and sprinkler system",
    unit: "Lump", currentQuantity: 1, workCompletedPct: 45, paymentPct: 40,
    weightsRaw: "35% Piping 25% Pumps 20% Sprinkler Heads 20% Testing & Commissioning",
  },
  // Low-confidence / manual review
  {
    ref: "P-08", code: "",
    description: "Tanking membrane — below-grade waterproofing",
    unit: "m2", currentQuantity: 3100, workCompletedPct: 48, paymentPct: 44,
    weightsRaw: "50% Surface Prep 50% Membrane Application",
  },
  // PDF-only item (unmatched in Excel)
  {
    ref: "P-09", code: "9.9",
    description: "Temporary site dewatering & well-points",
    unit: "Lump", currentQuantity: 1, workCompletedPct: 100, paymentPct: 100,
    weightsRaw: "100% Operation",
  },
  // NOTE: template ref 9 (Stormwater drainage) has NO PDF item → unmatched Excel
];
