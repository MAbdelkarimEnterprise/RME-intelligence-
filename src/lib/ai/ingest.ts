import { createServiceClient } from "@/lib/supabase/server";
import { embed } from "./embeddings";

/**
 * Document ingestion pipeline (the "indexing" step of RAG):
 *   1. Parse the file to plain text  (see note below)
 *   2. Chunk the text with overlap
 *   3. Embed each chunk
 *   4. Store chunks + vectors in pgvector
 *
 * Parsing note: wire LangChain document loaders here for production —
 * `pdf-parse` / `WebPDFLoader` for PDF, `mammoth` for DOCX, `xlsx` for XLSX,
 * and a PPTX text extractor. Keep this module server-only.
 */

const CHUNK_SIZE = 1200; // characters
const CHUNK_OVERLAP = 200;

export function chunkText(text: string): string[] {
  const clean = text.replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim();
  const chunks: string[] = [];
  let start = 0;
  while (start < clean.length) {
    const end = Math.min(start + CHUNK_SIZE, clean.length);
    chunks.push(clean.slice(start, end));
    if (end === clean.length) break;
    start = end - CHUNK_OVERLAP;
  }
  return chunks;
}

export interface IngestInput {
  documentId: string;
  documentName: string;
  projectId: string;
  text: string;
  pageMap?: { page: number; offset: number }[];
}

export async function ingestDocument(input: IngestInput) {
  const supabase = createServiceClient();
  const chunks = chunkText(input.text);
  if (chunks.length === 0) return { inserted: 0 };

  // Embed in batches to respect provider limits.
  const BATCH = 64;
  const rows: {
    document_id: string;
    project_id: string;
    content: string;
    page: number | null;
    embedding: number[];
  }[] = [];

  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH);
    const vectors = await embed(batch);
    batch.forEach((content, j) => {
      rows.push({
        document_id: input.documentId,
        project_id: input.projectId,
        content,
        page: null,
        embedding: vectors[j],
      });
    });
  }

  const { error } = await supabase.from("chunks").insert(rows);
  if (error) throw new Error(`Chunk insert failed: ${error.message}`);

  await supabase
    .from("documents")
    .update({ status: "ready" })
    .eq("id", input.documentId);

  return { inserted: rows.length };
}
