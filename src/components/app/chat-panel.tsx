"use client";

import { useRef, useState } from "react";
import {
  Sparkles,
  ArrowUp,
  FileSearch,
  Loader2,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";

const STARTERS = [
  "What are the key deliverables?",
  "Summarize this contract.",
  "Find project risks.",
  "List all project deadlines.",
  "Extract stakeholder information.",
];

export function ChatPanel({
  scope,
  initialMessages = [],
  compact = false,
}: {
  /** Human label for what the assistant is grounded on. */
  scope: string;
  initialMessages?: ChatMessage[];
  compact?: boolean;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    const content = text.trim();
    if (!content || pending) return;
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setPending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          scope,
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const data = await res.json();
      const assistant: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.content ?? "No response.",
        citations: data.citations,
        confidence: data.confidence,
        createdAt: new Date().toISOString(),
      };
      setMessages((m) => [...m, assistant]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "I couldn't reach the AI service. Confirm `ANTHROPIC_API_KEY` is set in `.env.local`, then try again.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setPending(false);
      setTimeout(
        () => endRef.current?.scrollIntoView({ behavior: "smooth" }),
        50
      );
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        {messages.length === 0 ? (
          <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-800 text-white">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-navy-900">
              Ask about {scope}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Answers are generated only from your indexed documents, with
              source citations. Try one of these:
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-graphite-700 shadow-sm transition-colors hover:border-navy-300 hover:bg-muted"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {pending && <ThinkingBubble />}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-border bg-card/60 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="mx-auto flex max-w-3xl items-end gap-2"
        >
          <div className="flex flex-1 items-end gap-2 rounded-xl border border-border bg-card p-2 shadow-sm focus-within:border-navy-400 focus-within:ring-2 focus-within:ring-navy-100">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={compact ? 1 : 1}
              placeholder={`Ask about ${scope}…`}
              className="max-h-40 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={!input.trim() || pending}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-800 text-white transition-colors hover:bg-navy-700 disabled:opacity-40"
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </button>
          </div>
        </form>
        <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-muted-foreground">
          Retrieval-augmented · grounded in RME documents · verify critical
          figures against source.
        </p>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  if (isUser) {
    return (
      <div className="flex justify-end gap-3">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-navy-800 px-4 py-2.5 text-sm leading-relaxed text-white">
          {message.content}
        </div>
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-graphite-200 text-graphite-600">
          <UserIcon className="h-4 w-4" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-800 text-white">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div
          className="prose-chat rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3 text-sm text-graphite-800 shadow-card"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
        />
        {message.citations && message.citations.length > 0 && (
          <div className="mt-2.5 space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Sources
            </p>
            {message.citations.map((c, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs"
              >
                <FileSearch className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-500" />
                <div className="min-w-0">
                  <span className="font-medium text-graphite-800">
                    {c.documentName}
                    {c.page ? ` · p.${c.page}` : ""}
                  </span>
                  <p className="mt-0.5 text-muted-foreground">“{c.snippet}”</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {typeof message.confidence === "number" && (
          <div className="mt-2 flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-[11px] text-muted-foreground">
              Confidence
            </span>
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${Math.round(message.confidence * 100)}%` }}
              />
            </div>
            <span className="text-[11px] font-medium text-emerald-700">
              {Math.round(message.confidence * 100)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function ThinkingBubble() {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-800 text-white">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3.5 shadow-card">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-graphite-400 animate-pulse-soft"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
    </div>
  );
}

/** Minimal, safe markdown → HTML (bold, lists, code, paragraphs). */
function renderMarkdown(text: string): string {
  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  const lines = esc(text).split("\n");
  let html = "";
  let inList = false;
  for (const line of lines) {
    const li = line.match(/^\s*[-*]\s+(.*)/);
    if (li) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${inline(li[1])}</li>`;
    } else {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      if (line.trim()) html += `<p>${inline(line)}</p>`;
    }
  }
  if (inList) html += "</ul>";
  return html;

  function inline(s: string) {
    return s
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`(.+?)`/g, "<code>$1</code>");
  }
}
