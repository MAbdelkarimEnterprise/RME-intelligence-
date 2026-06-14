export type WorkPackageKey =
  | "civil"
  | "architectural"
  | "structural"
  | "mechanical"
  | "electrical"
  | "infrastructure"
  | "landscape";

export type DiffStatus =
  | "Added"
  | "Removed"
  | "Modified"
  | "Quantity Change"
  | "Unit Change"
  | "Rate Change"
  | "Scope Change"
  | "Unchanged";

export interface BoqRow {
  id: string;
  item: string;
  section: string;
  workPackage: WorkPackageKey;
  unit: string;
  qtyA: number | null;
  qtyB: number | null;
  rateA: number | null; // unit rate, EGP
  rateB: number | null;
  status: DiffStatus;
  note?: string;
}

export type Severity = "High" | "Medium" | "Low";

export type ConflictType =
  | "Specification Conflict"
  | "Missing BOQ Item"
  | "BOQ Item Without Specification Reference"
  | "Unit / Standard Mismatch";

export interface Conflict {
  id: string;
  type: ConflictType;
  workPackage: WorkPackageKey;
  section: string;
  specRef: string;
  boqRef: string;
  description: string;
  severity: Severity;
  recommendedAction: string;
}

export interface WorkPackage {
  key: WorkPackageKey;
  name: string;
  color: string;
  boqItems: number;
  specSections: number;
  conflicts: number;
  subPackages: string[];
}
