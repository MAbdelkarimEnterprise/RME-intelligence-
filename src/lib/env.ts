/** Centralized env access + capability flags. */

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  anthropicKey: process.env.ANTHROPIC_API_KEY ?? "",
  anthropicModel: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
  voyageKey: process.env.VOYAGE_API_KEY ?? "",
  voyageModel: process.env.VOYAGE_EMBED_MODEL ?? "voyage-3",
  embedDimensions: Number(process.env.EMBED_DIMENSIONS ?? 1024),
};

export const hasSupabase = Boolean(env.supabaseUrl && env.supabaseAnonKey);
export const hasAnthropic = Boolean(env.anthropicKey);
export const hasEmbeddings = Boolean(env.voyageKey);
