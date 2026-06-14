import { NextResponse } from "next/server";
import { hasSupabase, hasEmbeddings } from "@/lib/env";

export const runtime = "nodejs";

/**
 * Upload endpoint.
 *
 * Demo mode (no Supabase keys): acknowledges the upload so the UI flow works.
 * Production: stream the file into Supabase Storage, create a `documents` row,
 * extract text (LangChain loaders), then call `ingestDocument` to chunk + embed
 * into pgvector. Run ingestion in a background job/queue for large files.
 */
export async function POST(req: Request) {
  if (!hasSupabase) {
    return NextResponse.json({
      ok: true,
      mode: "demo",
      message:
        "Demo mode: file acknowledged but not persisted. Set Supabase keys in .env.local to store and index documents.",
    });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const projectId = form.get("projectId") as string | null;

  if (!file || !projectId) {
    return NextResponse.json(
      { ok: false, error: "file and projectId are required" },
      { status: 400 }
    );
  }

  // 1) Upload to Supabase Storage
  // 2) Insert documents row (status: 'processing')
  // 3) Extract text via the appropriate LangChain loader
  // 4) await ingestDocument({ documentId, documentName, projectId, text })
  //
  // See src/lib/ai/ingest.ts. Implement steps 1–4 against your bucket + schema.

  return NextResponse.json({
    ok: true,
    mode: hasEmbeddings ? "ready-to-index" : "stored",
    name: file.name,
    size: file.size,
    projectId,
    note: "Wire Storage upload + ingestDocument() to complete indexing.",
  });
}
