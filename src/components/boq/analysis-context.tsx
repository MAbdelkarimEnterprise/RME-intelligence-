"use client";

import { createContext, useContext } from "react";
import type { BoqAnalysis } from "@/lib/boq/analyze";
import type { Conflict } from "@/lib/boq-types";

/**
 * Carries the REAL analysis (parsed from the user's uploaded BOQs) to the
 * dashboard views. When null, views fall back to the demo dataset so the
 * screens are still populated before a real run.
 */
export const BoqAnalysisContext = createContext<BoqAnalysis | null>(null);

export function useBoqAnalysis(): BoqAnalysis | null {
  return useContext(BoqAnalysisContext);
}

/**
 * Carries the REAL spec-vs-BOQ conflicts (from Claude reading the uploaded
 * Specifications PDF). null = not run yet; [] = ran, none found.
 */
export const BoqConflictsContext = createContext<Conflict[] | null>(null);

export function useBoqConflicts(): Conflict[] | null {
  return useContext(BoqConflictsContext);
}
