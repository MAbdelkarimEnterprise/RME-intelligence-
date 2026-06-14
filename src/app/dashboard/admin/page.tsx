"use client";

import { useState } from "react";
import {
  Users,
  Boxes,
  FileText,
  ShieldCheck,
  ScrollText,
  Plus,
} from "lucide-react";
import { Topbar } from "@/components/app/topbar";
import { Card, Badge, Avatar } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { teamMembers, projects, documents } from "@/lib/demo-data";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

const tabs = ["Users", "Projects", "Files", "Audit Log"] as const;
type Tab = (typeof tabs)[number];

const roleTone: Record<Role, "navy" | "accent" | "steel" | "muted"> = {
  Admin: "accent",
  Manager: "navy",
  Engineer: "steel",
  Viewer: "muted",
};

const auditLog = [
  { actor: "Mahmoud Elwalid", action: "Granted Manager role to Nour Hassan", at: "10 Jun 2026, 09:12", tone: "navy" },
  { actor: "System", action: "Document ITP Rev.04 finished indexing", at: "10 Jun 2026, 07:48", tone: "steel" },
  { actor: "Karim Adel", action: "Uploaded 4 files to Infrastructure Projects", at: "10 Jun 2026, 06:15", tone: "navy" },
  { actor: "Mahmoud Elwalid", action: "Created workspace QualiSense", at: "09 Jun 2026, 18:02", tone: "navy" },
  { actor: "Omar Tarek", action: "Failed sign-in attempt (Viewer)", at: "09 Jun 2026, 14:40", tone: "accent" },
  { actor: "Salma Fathy", action: "Exported Risk Register Q2", at: "08 Jun 2026, 11:20", tone: "steel" },
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("Users");

  return (
    <>
      <Topbar title="Admin Panel" />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-7">
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { label: "Users", value: teamMembers.length, icon: Users },
              { label: "Workspaces", value: projects.length, icon: Boxes },
              { label: "Documents", value: documents.length, icon: FileText },
              { label: "Roles enforced", value: 4, icon: ShieldCheck },
            ].map(({ label, value, icon: Icon }) => (
              <Card key={label} className="flex items-center gap-3 p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                </span>
                <div>
                  <div className="text-lg font-bold text-navy-900">{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <div className="mt-7 flex items-center gap-1 border-b border-border">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "relative px-4 py-2.5 text-sm font-medium transition-colors",
                  tab === t
                    ? "text-navy-900"
                    : "text-muted-foreground hover:text-graphite-700"
                )}
              >
                {t}
                {tab === t && (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-5">
            {tab === "Users" && <UsersTab />}
            {tab === "Projects" && <ProjectsTab />}
            {tab === "Files" && <FilesTab />}
            {tab === "Audit Log" && <AuditTab />}
          </div>
        </div>
      </main>
    </>
  );

  function UsersTab() {
    return (
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="text-sm font-semibold text-navy-900">
            User management
          </h3>
          <Button size="sm" variant="accent">
            <Plus className="h-4 w-4" />
            Invite user
          </Button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="hidden px-5 py-3 font-medium sm:table-cell">
                Department
              </th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium text-right">Permissions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {teamMembers.map((u) => (
              <tr key={u.id} className="hover:bg-muted/40">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name} color={u.avatarColor} size={34} />
                    <div>
                      <div className="font-medium text-graphite-800">
                        {u.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {u.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden px-5 py-3 text-graphite-600 sm:table-cell">
                  {u.department}
                </td>
                <td className="px-5 py-3">
                  <Badge tone={roleTone[u.role]}>{u.role}</Badge>
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="text-xs font-medium text-accent hover:text-accent-hover">
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    );
  }

  function ProjectsTab() {
    return (
      <Card className="divide-y divide-border">
        {projects.map((p) => (
          <div key={p.id} className="flex items-center gap-3 px-5 py-3.5">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: p.color }}
            >
              {p.name[0]}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-graphite-800">
                {p.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {p.documentCount} documents · {p.members} members
              </div>
            </div>
            <button className="text-xs font-medium text-accent hover:text-accent-hover">
              Manage access
            </button>
          </div>
        ))}
      </Card>
    );
  }

  function FilesTab() {
    return (
      <Card className="divide-y divide-border">
        {documents.map((d) => (
          <div key={d.id} className="flex items-center gap-3 px-5 py-3">
            <FileText className="h-4 w-4 text-graphite-400" />
            <span className="min-w-0 flex-1 truncate text-sm text-graphite-800">
              {d.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {d.projectName}
            </span>
            <button className="text-xs font-medium text-accent-hover hover:underline">
              Remove
            </button>
          </div>
        ))}
      </Card>
    );
  }

  function AuditTab() {
    return (
      <Card>
        <div className="flex items-center gap-2 border-b border-border p-4">
          <ScrollText className="h-4 w-4 text-graphite-500" />
          <h3 className="text-sm font-semibold text-navy-900">Audit log</h3>
          <Badge tone="green" className="ml-auto">
            Encryption: AES-256
          </Badge>
        </div>
        <div className="divide-y divide-border">
          {auditLog.map((e, i) => (
            <div key={i} className="flex items-start gap-3 px-5 py-3">
              <span
                className={cn(
                  "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                  e.tone === "accent"
                    ? "bg-accent"
                    : e.tone === "navy"
                    ? "bg-navy-600"
                    : "bg-graphite-400"
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-graphite-700">
                  <span className="font-medium text-navy-900">{e.actor}</span>{" "}
                  {e.action}
                </p>
                <p className="text-xs text-muted-foreground">{e.at}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }
}
