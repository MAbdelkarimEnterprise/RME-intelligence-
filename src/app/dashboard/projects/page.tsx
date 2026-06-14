"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FileText, Users, X } from "lucide-react";
import { Topbar } from "@/components/app/topbar";
import { Card } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { projects as seedProjects } from "@/lib/demo-data";
import { timeAgo } from "@/lib/utils";
import type { Project } from "@/lib/types";

const palette = ["#243a6b", "#5b6b82", "#c8472b", "#324a82", "#444b58", "#1f7a52"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  function create() {
    if (!name.trim()) return;
    setProjects((p) => [
      {
        id: `p-${Date.now()}`,
        name: name.trim(),
        description: desc.trim() || "New project workspace.",
        color: palette[p.length % palette.length],
        documentCount: 0,
        members: 1,
        updatedAt: new Date().toISOString(),
      },
      ...p,
    ]);
    setName("");
    setDesc("");
    setOpen(false);
  }

  return (
    <>
      <Topbar title="Projects" />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-navy-900">
                Project Workspaces
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Each workspace is an isolated, permissioned knowledge base.
              </p>
            </div>
            <Button variant="accent" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              New workspace
            </Button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Link key={p.id} href={`/dashboard/projects/${p.id}`}>
                <Card className="group h-full p-5 transition-all hover:-translate-y-0.5 hover:shadow-elevated">
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white"
                      style={{ backgroundColor: p.color }}
                    >
                      <span className="text-sm font-bold">{p.name[0]}</span>
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-navy-900 group-hover:text-accent">
                        {p.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {p.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" />
                      {p.documentCount} docs
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      {p.members}
                    </span>
                    <span>{timeAgo(p.updatedAt)}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-elevated animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-navy-900">
                Create workspace
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-graphite-400 hover:text-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-graphite-700">
                  Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. New Capital — District D"
                  autoFocus
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-graphite-700">
                  Description
                </label>
                <Input
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="What knowledge will this workspace hold?"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="accent" onClick={create}>
                Create workspace
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
