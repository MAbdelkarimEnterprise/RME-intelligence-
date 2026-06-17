import { NextResponse } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";
import { hasAnthropic, hasEmbeddings, hasSupabase } from "@/lib/env";
import {
  getClient,
  SYSTEM_PROMPT,
  composeUserMessage,
  type ChatTurn,
} from "@/lib/ai/claude";
import { retrieve, buildContext } from "@/lib/ai/retrieval";
import { env } from "@/lib/env";

export const runtime = "nodejs";

interface ChatRequest {
  message: string;
  scope?: string;
  projectId?: string;
  history?: ChatTurn[];
  documents?: { name: string; text: string }[];
}

export async function POST(req: Request) {
  let body: ChatRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { message, scope = "the knowledge base", projectId, history = [], documents = [] } =
    body;
  if (!message?.trim()) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 });
  }

  // ── Demo mode ────────────────────────────────────────────────
  // No live keys: return a representative grounded-style answer so the
  // product is fully demonstrable. Replace by setting the env keys.
  if (!hasAnthropic) {
    return NextResponse.json(demoAnswer(message, scope));
  }

  // ── Production RAG ───────────────────────────────────────────
  try {
    let context = "";
    let citations: ReturnType<typeof buildContext>["citations"] = [];
    let confidence = 0;

    if (hasSupabase && hasEmbeddings) {
      const chunks = await retrieve(message, { projectId, topK: 8 });
      const built = buildContext(chunks);
      context = built.context;
      citations = built.citations;
      confidence = built.confidence;
    } else if (documents.length) {
      // Context-grounding (no vector DB): inject the uploaded document text.
      const budget = 120000; // ~chars across all docs
      let used = 0;
      const blocks: string[] = [];
      for (const d of documents) {
        if (!d.text) continue;
        const slice = d.text.slice(0, Math.max(0, budget - used));
        if (!slice) break;
        used += slice.length;
        blocks.push(`=== DOCUMENT: ${d.name} ===\n${slice}`);
      }
      context = blocks.join("\n\n");
      citations = documents
        .filter((d) => d.text)
        .map((d) => ({ documentId: d.name, documentName: d.name, snippet: "" }));
      confidence = blocks.length ? 0.9 : 0;
    }

    const client = getClient();
    const resp = await client.messages.create({
      model: env.anthropicModel,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        ...history.map((h) => ({ role: h.role, content: h.content })),
        { role: "user" as const, content: composeUserMessage(message, context) },
      ],
    });

    const content = resp.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return NextResponse.json({
      content,
      citations,
      confidence: confidence || undefined,
    });
  } catch (err) {
    console.error("[/api/chat]", err);
    return NextResponse.json(
      {
        content:
          "The AI service returned an error. Check your `ANTHROPIC_API_KEY` and Supabase configuration, then try again.",
      },
      { status: 200 }
    );
  }
}

function demoAnswer(message: string, scope: string) {
  const q = message.toLowerCase();

  if (q.includes("risk")) {
    return {
      content:
        "The Q2 2026 programme register flags three high-severity risks:\n\n- **Critical-path slippage** on structural works — zero float on the topping-out milestone.\n- **Supply delay** on imported façade units, with a 6-week lead-time exposure.\n- **Resource contention** across concurrent Cairo and Alamein sites.\n\nEach is owned by the PMO with mitigation actions logged.",
      citations: [
        {
          documentId: "d-007",
          documentName: "Risk Register — Q2 2026 Programme.docx",
          page: 4,
          snippet:
            "High-severity: critical-path slippage, façade supply delay, multi-site resource contention.",
        },
      ],
      confidence: 0.91,
    };
  }

  if (q.includes("deadline") || q.includes("milestone") || q.includes("deliverable")) {
    return {
      content:
        "Key dates across the indexed schedules:\n\n- **Substructure completion** — end Q3 2026.\n- **Structural topping-out** — mid Q1 2027 (critical path).\n- **MEP first-fix & façade** — from Q4 2026.\n- **Handover & commissioning** — 14 Jul – 28 Sep 2027.",
      citations: [
        {
          documentId: "d-001",
          documentName: "Alamein Towers — Master Schedule (P6 Baseline).pdf",
          page: 6,
          snippet: "Milestone M-04 'Structural Topping-Out' total float = 0 days.",
        },
      ],
      confidence: 0.93,
    };
  }

  if (q.includes("stakeholder") || q.includes("contact")) {
    return {
      content:
        "Stakeholders identified in the handover dossier include the Project Director (RME), the Client's Engineer, the MEP subcontractor lead, and the QA/QC manager. Full contact details are listed in the document's stakeholder matrix.",
      citations: [
        {
          documentId: "d-005",
          documentName: "Client Handover Dossier — Cairo Metro Phase 3.pdf",
          page: 3,
          snippet: "Stakeholder matrix: Project Director, Client's Engineer, MEP lead, QA/QC manager.",
        },
      ],
      confidence: 0.88,
    };
  }

  return {
    content: `Here's what I found across ${scope}. _(Demo response — add \`ANTHROPIC_API_KEY\` and Supabase keys in \`.env.local\` to run live retrieval-augmented answers grounded in your uploaded documents.)_\n\nOnce connected, I'll answer strictly from indexed RME documents and cite the source document and page for every claim — no hallucinations.`,
    citations: [],
    confidence: undefined,
  };
}
