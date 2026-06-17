"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RecoverPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="absolute inset-0 eng-grid-fine radial-fade" />
      <div className="relative w-full max-w-sm animate-fade-in">
        <Logo className="mb-8 justify-center" />
        <div className="rounded-lg border border-border bg-card p-8 shadow-card">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy-50 text-navy-700">
                <MailCheck className="h-6 w-6" />
              </div>
              <h1 className="mt-4 text-lg font-semibold text-navy-900">
                Check your inbox
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                If an account exists for {email || "that address"}, a recovery
                link is on its way.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-lg font-semibold text-navy-900">
                Reset your password
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Enter your work email and we&apos;ll send a secure recovery link.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="mt-5 space-y-4"
              >
                <Input
                  type="email"
                  placeholder="name@rowad-rme.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" size="lg" className="w-full">
                  Send recovery link
                </Button>
              </form>
            </>
          )}
        </div>
        <Link
          href="/login"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-navy-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
