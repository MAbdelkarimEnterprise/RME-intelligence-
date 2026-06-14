import { createServiceClient } from "@/lib/supabase/server";
import { embedQuery } from "./embeddings";

export interface RetrievedChunk {
  id: string;
  content: string;
  documentId: string;
  documentName: string;
  page: number | null;
  similarity: number;
}

/**
 * Retrieval step of RAG: embed the query, then run a pgvector cosine-similarity
 * search via the `match_chunks` SQL function (see supabase/migrations).
 * Optionally scoped to a single project workspace.
 */
export async function retrieve(
  query: string,
  opts: { projectId?: string; topK?: number } = {}
): Promise<RetrievedChunk[]> {
  const { projectId, topK = 8 } = opts;
  const queryEmbedding = await embedQuery(query);
  const supabase = createServiceClient();

  const { data, error } = await supabase.rpc("match_chunks", {
    query_embedding: queryEmbedding,
    match_count: topK,
    filter_project: projectId ?? null,
  });

  if (error) throw new Error(`Retrieval failed: ${error.message}`);

  return (data ?? []).map(
    (r: {
      id: string;
      content: string;
      document_id: string;
      document_name: string;
      page: number | null;
      similarity: number;
    }) => ({
      id: r.id,
      content: r.content,
      documentId: r.document_id,
      documentName: r.document_name,
      page: r.page,
      similarity: r.similarity,
    })
  );
}

/** Build the grounded context block + citation list from retrieved chunks. */
export function buildContext(chunks: RetrievedChunk[]) {
  const context = chunks
    .map(
      (c, i) =>
        `[Source ${i + 1}] ${c.documentName}${
          c.page ? ` (p.${c.page})` : ""
        }\n${c.content}`
    )
    .join("\n\n---\n\n");

  const citations = chunks.map((c) => ({
    documentId: c.documentId,
    documentName: c.documentName,
    page: c.page ?? undefined,
    snippet: c.content.slice(0, 160).replace(/\s+/g, " ").trim(),
  }));

  // Average similarity as a simple confidence proxy.
  const confidence = chunks.length
    ? Math.min(
        0.99,
        chunks.reduce((s, c) => s + c.similarity, 0) / chunks.length
      )
    : 0;

  return { context, citations, confidence };
}
