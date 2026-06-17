/**
 * Payment Application Intelligence — matching + validation engine.
 *
 * This is REAL logic (no mocks): it performs exact / code / fuzzy matching with
 * confidence scoring, parses weight-allocation breakdowns from free text, and
 * validates the result against Unifier business rules. The only simulated input
 * is the PDF OCR/extraction step (which produces the structured `ExtractedItem`
 * list); everything downstream here runs for real on that data, and the same
 * functions accept genuinely-extracted data once OCR + Claude are wired.
 */

// ── Structured intermediary types ──────────────────────────────
export interface WeightComponent {
  description: string;
  percent: number;
}

/** A line item as extracted from the Payment Application PDF. */
export interface ExtractedItem {
  ref: string; // line ref from the PDF
  code?: string; // BOQ / item code if present
  description: string;
  unit?: string;
  currentQuantity: number; // quantity completed this period
  workCompletedPct: number; // overall % complete
  paymentPct: number; // payment %
  currentAmount?: number; // certified amount this period (currency), if present
  weightsRaw?: string; // e.g. "50% Formwork 20% Reinforcement 20% Fixing 10% Pouring"
}

/** A line item present in the Client Invoice (Unifier) template. */
export interface TemplateItem {
  ref: string;
  code: string;
  boqDescription: string;
  unit: string;
  itemQuantity: number;
  unitCost: number;
}

export type MatchLevel =
  | "Exact Match"
  | "Code Match"
  | "Fuzzy Description Match"
  | "Semantic AI Match"
  | "Unmatched";

export interface MatchResult {
  template: TemplateItem | null;
  extracted: ExtractedItem | null;
  level: MatchLevel;
  confidence: number; // 0–100
  weights: WeightComponent[];
  note: string;
}

export type IssueLevel = "error" | "warning" | "info";
export interface ValidationIssue {
  level: IssueLevel;
  ref: string;
  message: string;
}

// ── Text utilities ─────────────────────────────────────────────
const STOP = new Set(["the", "to", "of", "and", "for", "in", "a", "works", "work"]);

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOP.has(w))
    .join(" ")
    .trim();
}

/** Sørensen–Dice bigram similarity, 0..1. Robust fuzzy string match. */
export function diceSimilarity(a: string, b: string): number {
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return 1;
  if (na.length < 2 || nb.length < 2) return 0;
  const bigrams = (s: string) => {
    const m = new Map<string, number>();
    for (let i = 0; i < s.length - 1; i++) {
      const bg = s.slice(i, i + 2);
      m.set(bg, (m.get(bg) ?? 0) + 1);
    }
    return m;
  };
  const A = bigrams(na);
  const B = bigrams(nb);
  let overlap = 0;
  let total = 0;
  A.forEach((cnt) => (total += cnt));
  B.forEach((cnt, bg) => {
    total += cnt;
    const inA = A.get(bg) ?? 0;
    overlap += Math.min(inA, cnt);
  });
  return (2 * overlap) / total;
}

// ── Weight-allocation parser ───────────────────────────────────
/**
 * Parses "50% Formwork 20% Reinforcement 20% Fixing 10% Concrete Pouring"
 * (and many variants: "Formwork 50%", commas, dashes) into components.
 */
export function parseWeights(raw?: string): WeightComponent[] {
  if (!raw) return [];
  const out: WeightComponent[] = [];
  // pattern A: <pct>% <label>
  const reA = /(\d{1,3})\s*%\s*([A-Za-z][A-Za-z /&-]*?)(?=(?:\s+\d{1,3}\s*%)|[,;]|$)/g;
  let m: RegExpExecArray | null;
  while ((m = reA.exec(raw)) !== null) {
    const pct = Number(m[1]);
    const desc = m[2].trim();
    if (desc) out.push({ description: desc, percent: pct });
  }
  if (out.length) return out.slice(0, 10);
  // pattern B: <label> <pct>%
  const reB = /([A-Za-z][A-Za-z /&-]*?)\s*[:\-]?\s*(\d{1,3})\s*%/g;
  while ((m = reB.exec(raw)) !== null) {
    out.push({ description: m[1].trim(), percent: Number(m[2]) });
  }
  return out.slice(0, 10);
}

// ── Matching engine ────────────────────────────────────────────
export function matchItems(
  template: TemplateItem[],
  extracted: ExtractedItem[]
): { matches: MatchResult[]; unmatchedExtracted: ExtractedItem[] } {
  const matches: MatchResult[] = [];
  const usedExtracted = new Set<number>();

  for (const t of template) {
    let best: { idx: number; level: MatchLevel; conf: number; note: string } | null =
      null;

    extracted.forEach((e, idx) => {
      if (usedExtracted.has(idx)) return;

      // Level 1 — exact normalized description
      if (normalize(e.description) === normalize(t.boqDescription)) {
        best = { idx, level: "Exact Match", conf: 100, note: "Description matched exactly" };
        return;
      }
      // Level 2 — code match
      if (e.code && t.code && e.code.toLowerCase() === t.code.toLowerCase()) {
        if (!best || best.conf < 96)
          best = { idx, level: "Code Match", conf: 96, note: "Matched on item/BOQ code" };
        return;
      }
      // Level 3 — fuzzy description
      const sim = diceSimilarity(e.description, t.boqDescription);
      const conf = Math.round(sim * 100);
      if (sim >= 0.6 && (!best || conf > best.conf)) {
        best = {
          idx,
          level: conf >= 80 ? "Fuzzy Description Match" : "Semantic AI Match",
          conf,
          note:
            conf >= 80
              ? "Minor wording variation"
              : "Low similarity — manual review recommended",
        };
      }
    });

    if (best !== null) {
      const b = best as { idx: number; level: MatchLevel; conf: number; note: string };
      usedExtracted.add(b.idx);
      const e = extracted[b.idx];
      matches.push({
        template: t,
        extracted: e,
        level: b.level,
        confidence: b.conf,
        weights: parseWeights(e.weightsRaw),
        note: b.note,
      });
    } else {
      matches.push({
        template: t,
        extracted: null,
        level: "Unmatched",
        confidence: 0,
        weights: [],
        note: "No corresponding line item found in the Payment Application",
      });
    }
  }

  const unmatchedExtracted = extracted.filter((_, i) => !usedExtracted.has(i));
  return { matches, unmatchedExtracted };
}

// ── Validation engine ──────────────────────────────────────────
export function validate(
  matches: MatchResult[],
  unmatchedExtracted: ExtractedItem[]
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seenCodes = new Map<string, number>();

  for (const m of matches) {
    const ref = m.template?.ref ?? m.extracted?.ref ?? "—";

    if (m.template) {
      seenCodes.set(m.template.code, (seenCodes.get(m.template.code) ?? 0) + 1);
    }

    if (m.level === "Unmatched") {
      issues.push({
        level: "error",
        ref,
        message: `Excel item "${m.template?.boqDescription}" has no match in the PDF`,
      });
      continue;
    }

    // weight total ≤ 100
    const wsum = m.weights.reduce((s, w) => s + w.percent, 0);
    if (m.weights.length > 0 && wsum > 100) {
      issues.push({
        level: "error",
        ref,
        message: `Weight allocation totals ${wsum}% (> 100%)`,
      });
    }
    if (m.weights.length === 0 && (m.extracted?.currentQuantity ?? 0) > 0) {
      issues.push({
        level: "warning",
        ref,
        message: "No weight allocation detected for a progressed item",
      });
    }
    // confidence below 70
    if (m.confidence > 0 && m.confidence < 70) {
      issues.push({
        level: "warning",
        ref,
        message: `Match confidence ${m.confidence}% — manual review required`,
      });
    }
    // missing values
    if (m.extracted && (m.extracted.paymentPct == null || isNaN(m.extracted.paymentPct))) {
      issues.push({ level: "warning", ref, message: "Missing payment %" });
    }
  }

  // duplicates
  seenCodes.forEach((count, code) => {
    if (count > 1)
      issues.push({
        level: "error",
        ref: code,
        message: `Duplicate template item code "${code}" (${count}×)`,
      });
  });

  // unmatched PDF items
  for (const e of unmatchedExtracted) {
    issues.push({
      level: "warning",
      ref: e.ref,
      message: `PDF item "${e.description}" not found in the Excel template`,
    });
  }

  return issues;
}

export function confidenceTone(c: number): "green" | "amber" | "red" {
  if (c >= 95) return "green";
  if (c >= 70) return "amber";
  return "red";
}
