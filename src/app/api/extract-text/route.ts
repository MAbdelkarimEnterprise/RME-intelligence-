import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { env, hasAnthropic } from "@/lib/env";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Generic document → plain-text extractor used to GROUND the AI Assistant and
 * Knowledge Base in the user's real uploaded documents.
 *  - PDF  → Claude reads it (handles scans + bilingual layouts)
 *  - XLSX / XLS / CSV → SheetJS (every sheet flattened to CSV-ish text)
 *  - TXT / MD → decoded directly
 * Returns { ok, text }. Text is capped to keep chat context lean.
 */

const MAX_CHARS = 60000;

export async function POST(req: Request) {
  let file: File | null = null;
  try {
    const form = await req.formData();
    file = form.get("file") as File | null;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad form data" }, { status: 400 });
  }
  if (!file) return NextResponse.json({ ok: false, error: "No file" }, { status: 400 });

  const name = file.name.toLowerCase();
  try {
    if (/\.(xlsx|xls|csv)$/.test(name)) {
      const XLSX = await import("xlsx");
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { cellFormula: false });
      const parts: string[] = [];
      for (const s of wb.SheetNames) {
        parts.push(`# Sheet: ${s}`);
        parts.push(XLSX.utils.sheet_to_csv(wb.Sheets[s]));
      }
      return NextResponse.json({ ok: true, text: parts.join("\n").slice(0, MAX_CHARS) });
    }

    if (/\.(txt|md|tsv|json)$/.test(name)) {
      const text = await file.text();
      return NextResponse.json({ ok: true, text: text.slice(0, MAX_CHARS) });
    }

    if (/\.pdf$/.test(name)) {
      if (!hasAnthropic)
        return NextResponse.json({ ok: false, reason: "no-key", text: "" });
      const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
      const client = new Anthropic({ apiKey: env.anthropicKey });
      const resp = await client.messages.create({
        model: env.anthropicModel,
        max_tokens: 8000,
        messages: [
          {
            role: "user",
            content: [
              { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } },
              { type: "text", text: "Transcribe this document to clean plain text. Preserve headings, tables (as readable rows), figures and section numbers. Translate Arabic to English inline where helpful. Output only the transcribed text." },
            ],
          },
        ],
      });
      const text = resp.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n");
      return NextResponse.json({ ok: true, text: text.slice(0, MAX_CHARS) });
    }

    return NextResponse.json({ ok: false, error: "Unsupported file type", text: "" });
  } catch (err) {
    console.error("[/api/extract-text]", err);
    return NextResponse.json({ ok: false, error: "Extraction failed", text: "" });
  }
}
