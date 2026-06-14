import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

/**
 * Server Supabase client bound to the request cookies.
 * Use in Server Components, Route Handlers and Server Actions.
 */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(toSet) {
        try {
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — safe to ignore when middleware
          // refreshes the session.
        }
      },
    },
  });
}

/** Service-role client for privileged server-only operations (ingestion). */
export function createServiceClient() {
  const { createClient: createSb } = require("@supabase/supabase-js");
  return createSb(env.supabaseUrl, env.supabaseServiceKey, {
    auth: { persistSession: false },
  });
}
