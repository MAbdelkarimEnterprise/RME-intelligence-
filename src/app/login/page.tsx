"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Demo mode: any credentials proceed to the workspace.
    // With Supabase keys set, swap this for supabase.auth.signInWithPassword.
    await new Promise((r) => setTimeout(r, 700));
    if (!email) {
      setError("Please enter your work email.");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden dark-panel lg:block">
        <div className="absolute inset-0 dark-grid opacity-60" />
        <div className="absolute inset-x-0 top-0 h-px accent-hairline" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo variant="light" />
          <div className="max-w-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-accent shadow-inset-hair">
              <ShieldCheck className="h-6 w-6" strokeWidth={1.6} />
            </div>
            <h2 className="mt-6 text-3xl font-bold leading-tight">
              <span className="text-gradient-light">Engineering Knowledge.</span>
              <br />
              <span className="text-accent-glow">Instantly Accessible.</span>
            </h2>
            <p className="mt-4 leading-relaxed text-white/60">
              Sign in to access ROWAD's organizational knowledge base — project
              schedules, BOQs, quality records and contracts — with grounded,
              cited answers from Claude.
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs text-white/50">
            <span>Encrypted</span>
            <span className="h-1 w-1 rounded-full bg-accent" />
            <span>Role-based access</span>
            <span className="h-1 w-1 rounded-full bg-accent" />
            <span>Audit logged</span>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="mt-8 lg:mt-0">
            <h1 className="text-2xl font-bold tracking-tight text-navy-900">
              Sign in to the platform
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Use your RME work account to continue.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mt-7 flex h-11 w-full items-center justify-center gap-3 rounded-md border border-border bg-card text-sm font-medium text-graphite-700 shadow-sm transition-colors hover:bg-muted"
          >
            <MicrosoftIcon />
            Continue with Microsoft
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              or
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-graphite-700">
                Work email
              </label>
              <Input
                type="email"
                placeholder="name@rowad-rme.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-sm font-medium text-graphite-700">
                  Password
                </label>
                <Link
                  href="/recover"
                  className="text-xs font-medium text-accent hover:text-accent-hover"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-sm text-accent-hover">{error}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Protected internal system. Access is monitored and logged. For
            access requests, contact your platform administrator.
          </p>
        </div>
      </div>
    </div>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 21 21" aria-hidden>
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  );
}
