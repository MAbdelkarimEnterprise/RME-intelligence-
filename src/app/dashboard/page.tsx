import Link from "next/link";
import {
  FileUp,
  MessagesSquare,
  Users,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Upload,
  Boxes,
} from "lucide-react";
import { Topbar } from "@/components/app/topbar";
import { Card } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/primitives";
import { FileIcon } from "@/components/ui/file-icon";
import {
  stats,
  documents,
  activity,
  projects,
  currentUser,
} from "@/lib/demo-data";
import { formatBytes, timeAgo } from "@/lib/utils";

const kpis = [
  {
    label: "Files uploaded",
    value: stats.filesUploaded,
    delta: `+${stats.filesThisWeek} this week`,
    icon: FileUp,
  },
  {
    label: "AI conversations",
    value: stats.conversations.toLocaleString(),
    delta: `+${stats.conversationsThisWeek} this week`,
    icon: MessagesSquare,
  },
  {
    label: "Active users",
    value: stats.activeUsers,
    delta: "Across 8 departments",
    icon: Users,
  },
  {
    label: "Storage used",
    value: `${stats.storageUsedGb} GB`,
    delta: `of ${stats.storageQuotaGb} GB quota`,
    icon: TrendingUp,
  },
];

const activityTone: Record<string, string> = {
  upload: "#243a6b",
  chat: "#c8472b",
  project: "#1f7a52",
  member: "#5b6b82",
};

export default function DashboardHome() {
  return (
    <>
      <Topbar title="Home" />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-7">
          {/* Greeting */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Welcome back, {currentUser.name.split(" ")[0]}
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-navy-900">
                Engineering Intelligence Overview
              </h2>
            </div>
            <Link
              href="/dashboard/assistant"
              className="inline-flex items-center gap-2 self-start rounded-md bg-navy-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-navy-700 sm:self-auto"
            >
              <Sparkles className="h-4 w-4" />
              Ask the assistant
            </Link>
          </div>

          {/* KPIs */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map(({ label, value, delta, icon: Icon }) => (
              <Card key={label} className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-graphite-300" />
                </div>
                <div className="mt-4 text-2xl font-bold tracking-tight text-navy-900">
                  {value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{label}</div>
                <div className="mt-2 text-[11px] font-medium text-emerald-600">
                  {delta}
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Recent documents */}
            <Card className="lg:col-span-2">
              <div className="flex items-center justify-between border-b border-border p-5">
                <h3 className="text-sm font-semibold text-navy-900">
                  Recent documents
                </h3>
                <Link
                  href="/dashboard/documents"
                  className="text-xs font-medium text-accent hover:text-accent-hover"
                >
                  View all
                </Link>
              </div>
              <div className="divide-y divide-border">
                {documents.slice(0, 5).map((d) => (
                  <Link
                    key={d.id}
                    href={`/dashboard/documents/${d.id}`}
                    className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/50"
                  >
                    <FileIcon type={d.type} size={38} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-graphite-800">
                        {d.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {d.projectName} · {formatBytes(d.size)} ·{" "}
                        {timeAgo(d.uploadedAt)}
                      </div>
                    </div>
                    {d.status === "ready" ? (
                      <Badge tone="green">Ready</Badge>
                    ) : d.status === "processing" ? (
                      <Badge tone="amber">Processing</Badge>
                    ) : (
                      <Badge tone="muted">{d.status}</Badge>
                    )}
                  </Link>
                ))}
              </div>
            </Card>

            {/* Activity timeline */}
            <Card>
              <div className="border-b border-border p-5">
                <h3 className="text-sm font-semibold text-navy-900">
                  Activity timeline
                </h3>
              </div>
              <div className="p-5">
                <ol className="relative space-y-5 before:absolute before:left-[5px] before:top-1 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
                  {activity.map((a) => (
                    <li key={a.id} className="relative pl-6">
                      <span
                        className="absolute left-0 top-1 h-2.5 w-2.5 rounded-full ring-4 ring-card"
                        style={{ backgroundColor: activityTone[a.type] }}
                      />
                      <p className="text-sm leading-snug text-graphite-700">
                        <span className="font-medium text-navy-900">
                          {a.actor}
                        </span>{" "}
                        {a.summary}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {timeAgo(a.at)}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </Card>
          </div>

          {/* Quick actions */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                href: "/dashboard/documents?upload=1",
                icon: Upload,
                title: "Upload documents",
                body: "Drag & drop PDFs, schedules and reports.",
              },
              {
                href: "/dashboard/projects",
                icon: Boxes,
                title: "Create a workspace",
                body: "Spin up a new project knowledge base.",
              },
              {
                href: "/dashboard/assistant",
                icon: Sparkles,
                title: "Query knowledge",
                body: "Ask across every project in seconds.",
              },
            ].map(({ href, icon: Icon, title, body }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-lg border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent-hover transition-colors group-hover:bg-accent group-hover:text-white">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h4 className="mt-3 text-sm font-semibold text-navy-900">
                  {title}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">{body}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
