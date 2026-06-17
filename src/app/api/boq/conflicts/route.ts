import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { env, hasAnthropic } from "@/lib/env";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Specification conflict detection.
 *
 * Receives the project Specifications PDF + a compact list of the real BOQ
 * line items (from the deterministic BOQ analysis) and asks Claude to read the
 * spec and flag conflicts: spec-vs-BOQ standard/material mismatches, BOQ items
 * with no spec reference, and spec sections with no matching BOQ item.
 */

const WP = ["civil","architectural","structural","mechanical","electrical","infrastructure","landscape"];
const TYPES = ["Specification Conflict","Missing BOQ Item","BOQ Item Without Specification Reference","Unit / Standard Mismatch"];

const PROMPT = (boq: string) => `You are an RME quantity-surveying + technical-office assistant. You are given (1) a project Specifications document (attached PDF, may be bilingual Arabic/English) and (2) a list of Bill of Quantities (BOQ) line items extracted from the priced BOQ.

Cross-check the BOQ against the specification and identify real conflicts only. Look for:
- "Specification Conflict": the spec mandates a material/grade/standard that the BOQ contradicts (e.g. spec requires concrete C40 but BOQ item says C35; spec calls for galvanized but BOQ says mild steel).
- "Unit / Standard Mismatch": unit of measure or reference standard differs between spec and BOQ for the same work.
- "BOQ Item Without Specification Reference": a BOQ item has no governing spec section.
- "Missing BOQ Item": the spec requires work that has no corresponding BOQ item.

Return ONLY a JSON object, no prose, no markdown fences:
{
  "conflicts": [
    {
      "type": "<one of: ${TYPES.join(" | ")}>",
      "workPackage": "<one of: ${WP.join(" | ")}>",
      "section": "<BOQ section / sheet or spec division name>",
      "specRef": "<spec clause/section number, else empty>",
      "boqRef": "<BOQ item code/description ref, else empty>",
      "description": "<concise description of the conflict>",
      "severity": "<High | Medium | Low>",
      "recommendedAction": "<concise recommended resolution>"
    }
  ]
}

Only report conflicts you can actually substantiate from the spec + BOQ. Do not invent. If you find none, return {"conflicts": []}.

BOQ LINE ITEMS (JSON):
${boq}`;

export async function POST(req: Request) {
  if (!hasAnthropic) {
    return NextResponse.json({ ok: false, reason: "no-key", conflicts: [] }, { status: 200 });
  }

  let file: File | null = null;
  let boqJson = "[]";
  try {
    const form = await req.formData();
    file = form.get("file") as File | null;
    boqJson = String(form.get("boq") ?? "[]");
  } catch {
    return NextResponse.json({ ok: false, error: "Bad form data" }, { status: 400 });
  }
  if (!file) {
    return NextResponse.json({ ok: false, error: "No specifications file" }, { status: 400 });
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
            { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } },
            { type: "text", text: PROMPT(boqJson) },
          ]) as any,
        },
      ],
    });

    const text = resp.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    const jsonStr = text.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
    const start = jsonStr.indexOf("{");
    const end = jsonStr.lastIndexOf("}");
    const parsed = JSON.parse(jsonStr.slice(start, end + 1));
    const conflicts = Array.isArray(parsed.conflicts) ? parsed.conflicts : [];

    // Stamp ids + clamp enum-ish fields so the UI stays consistent.
    const clean = conflicts.map((c: Record<string, unknown>, i: number) => ({
      id: `cf-${i + 1}`,
      type: TYPES.includes(String(c.type)) ? c.type : "Specification Conflict",
      workPackage: WP.includes(String(c.workPackage)) ? c.workPackage : "civil",
      section: String(c.section ?? ""),
      specRef: String(c.specRef ?? ""),
      boqRef: String(c.boqRef ?? ""),
      description: String(c.description ?? ""),
      severity: ["High", "Medium", "Low"].includes(String(c.severity)) ? c.severity : "Medium",
      recommendedAction: String(c.recommendedAction ?? ""),
    }));

    return NextResponse.json({ ok: true, conflicts: clean });
  } catch (err) {
    console.error("[/api/boq/conflicts]", err);
    return NextResponse.json(
      { ok: false, error: "Conflict analysis failed. Check the PDF and your API key/credit.", conflicts: [] },
      { status: 200 }
    );
  }
}
