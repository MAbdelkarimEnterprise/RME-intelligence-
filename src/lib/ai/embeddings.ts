import { env, hasEmbeddings } from "@/lib/env";

/**
 * Embeddings via Voyage AI — Anthropic's recommended embedding provider for
 * RAG. Returns a vector per input string. Swap the endpoint/model here if you
 * prefer OpenAI or a self-hosted model; keep EMBED_DIMENSIONS in sync with the
 * pgvector column dimension in the migration.
 */
export async function embed(texts: string[]): Promise<number[][]> {
  if (!hasEmbeddings) {
    throw new Error("VOYAGE_API_KEY is not set — cannot generate embeddings.");
  }

  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.voyageKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: texts,
      model: env.voyageModel,
      input_type: "document",
    }),
  });

  if (!res.ok) {
    throw new Error(`Voyage embeddings failed: ${res.status} ${await res.text()}`);
  }

  const json = (await res.json()) as {
    data: { embedding: number[] }[];
  };
  return json.data.map((d) => d.embedding);
}

export async function embedQuery(text: string): Promise<number[]> {
  const [vec] = await embed([text]);
  return vec;
}
