"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { documents as seed } from "@/lib/demo-data";
import type { DocumentItem, FileType } from "@/lib/types";

/**
 * App-wide documents store. Any upload across the platform (Documents page,
 * BOQ Intelligence, IPC Merger, project workspaces) is added here so it shows
 * up in the Documents list. Persists to localStorage so it survives refreshes.
 * (Swap for Supabase Storage + a `documents` table when keys are connected.)
 */

const KEY = "rme.uploaded.documents.v1";

type Ctx = {
  docs: DocumentItem[];
  addDocument: (d: DocumentItem) => void;
  removeDocument: (id: string) => void;
};

const DocumentsContext = createContext<Ctx | null>(null);

export function extToType(name: string): FileType {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (ext === "docx" || ext === "doc") return "docx";
  if (ext === "xlsx" || ext === "xls" || ext === "csv") return "xlsx";
  if (ext === "pptx" || ext === "ppt") return "pptx";
  return "txt";
}

/** Build a DocumentItem from an uploaded file + where it came from. */
export function makeDoc(
  name: string,
  size: number,
  source: { projectId: string; projectName: string; uploadedBy?: string }
): DocumentItem {
  return {
    id: `up-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    type: extToType(name),
    size,
    projectId: source.projectId,
    projectName: source.projectName,
    uploadedAt: new Date().toISOString(),
    uploadedBy: source.uploadedBy ?? "Mahmoud Elwalid",
    status: "ready",
  };
}

export function DocumentsProvider({ children }: { children: React.ReactNode }) {
  const [uploaded, setUploaded] = useState<DocumentItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUploaded(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (next: DocumentItem[]) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const addDocument = useCallback((d: DocumentItem) => {
    setUploaded((prev) => {
      const next = [d, ...prev];
      persist(next);
      return next;
    });
  }, []);

  const removeDocument = useCallback((id: string) => {
    setUploaded((prev) => {
      const next = prev.filter((x) => x.id !== id);
      persist(next);
      return next;
    });
  }, []);

  // Uploaded items first, then the seeded demo documents.
  const docs = [...uploaded, ...seed];

  return (
    <DocumentsContext.Provider value={{ docs, addDocument, removeDocument }}>
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocumentsStore() {
  const ctx = useContext(DocumentsContext);
  if (!ctx)
    throw new Error("useDocumentsStore must be used within DocumentsProvider");
  return ctx;
}
