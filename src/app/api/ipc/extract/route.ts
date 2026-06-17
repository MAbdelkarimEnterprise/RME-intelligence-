import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { env, hasAnthropic } from "@/lib/env";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * IPC Merger — real line-item extraction.
 *
 * Receives the Technical Office Payment Certificate PDF and asks Claude to
 * read it (handles bilingual Arabic/English layouts) and return structured
 * line items as JSON. The IPC Merger then populates the Unifier template from
 * these real items instead of the demo set.
 */

const EXTRACT_PROMPT = `You are an RME quantity-surveying assistant extracting line items from a Technical Office Interim Payment Certificate (IPC). The document may be bilingual (Arabic + English) with a works/BOQ progress table.

Return ONLY a JSON object, no prose, no markdown fences:
{
  "project": "<project title in English if present>",
  "certificateNo": "<IPC number if present>",
  "items": [
    {
      "ref": "<row ref or running number>",
      "code": "<BOQ/item code if present, else empty string>",
      "description": "<line item description in English; translate if only Arabic>",
      "unit": "<unit of measure, e.g. m2, m3, No., Lump>",
      "currentQuantity": <number: quantity completed this period (0 if unknown)>,
      "workCompletedPct": <number 0-100: overall percent complete>,
      "paymentPct": <number 0-100: payment percentage, equal to workCompletedPct if not separately stated>,
      "currentAmount": <number: certified amount this period in the certificate currency, 0 if unknown>,
      "weightsRaw": "<component weight breakdown text if present e.g. '50% Formwork 20% Reinforcement', else empty string>"
    }
  ]
}

Extract EVERY line item in the progress/BOQ table. Use plain numbers (no thousands separators, no currency symbols). If a value is genuinely absent, use 0 for numbers and "" for strings. Do not invent items.`;

export async function POST(req: Request) {
  if (!hasAnthropic) {
    return NextResponse.json(
      { ok: false, reason: "no-key", items: [] },
      { status: 200 }
    );
  }

  let file: File | null = null;
  try {
    const form = await req.formData();
    file = form.get("file") as File | null;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad form data" }, { status: 400 });
  }
  if (!file) {
    return NextResponse.json({ ok: false, error: "No file" }, { status: 400 });
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const base64 = bytes.toString("base64");
    const client = new Anthropic({ apiKey: env.anthropicKey });

    const resp = await client.messages.create({
      model: env.anthropicModel,
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: ([
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: base64,
              },
            },
            { type: "text", text: EXTRACT_PROMPT },
          ]) as any,
        },
      ],
    });

    const text = resp.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    const jsonStr = text
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/i, "")
      .trim();
    const start = jsonStr.indexOf("{");
    const end = jsonStr.lastIndexOf("}");
    const parsed = JSON.parse(jsonStr.slice(start, end + 1));

    return NextResponse.json({ ok: true, ...parsed });
  } catch (err) {
    console.error("[/api/ipc/extract]", err);
    return NextResponse.json(
      { ok: false, error: "Extraction failed. Check the PDF and your API key/credit." },
      { status: 200 }
    );
  }
}
