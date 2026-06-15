import {
  FileUp,
  MessagesSquare,
  Users,
  HardDrive,
  TrendingUp,
} from "lucide-react";
import { Topbar } from "@/components/app/topbar";
import { Card } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/primitives";
import { FileIcon } from "@/components/ui/file-icon";
import { stats, documents, teamMembers, projects } from "@/lib/demo-data";

const weekly = [42, 55, 38, 61, 49, 72, 58];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const topDocs = documents.slice(0, 5).map((d, i) => ({
  ...d,
  queries: [312, 248, 196, 154, 121][i],
}));

const topUsers = teamMembers.map((u, i) => ({
  ...u,
  queries: [428, 356, 289, 174, 96][i] ?? 50,
}));

export default function AnalyticsPage() {
  const maxWeekly = Math.max(...weekly);
  const maxUser = Math.max(...topUsers.map((u) => u.queries));

  return (
    <>
      <Topbar title="Analytics" />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-7">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Files uploaded", value: stats.filesUploaded, icon: FileUp },
              {
                label: "AI conversations",
                value: stats.conversations.toLocaleString(),
                icon: MessagesSquare,
              },
              { label: "Active users", value: stats.activeUsers, icon: Users },
              {
                label: "Storage used",
                value: `${stats.storageUsedGb} GB`,
                icon: HardDrive,
              },
            ].map(({ label, value, icon: Icon }) => (
              <Card key={label} className="p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                </div>
                <div className="mt-3 text-2xl font-bold tracking-tight text-navy-900">
                  {value}
                </div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Activity chart */}
            <Card className="lg:col-span-2">
              <div className="flex items-center justify-between border-b border-border p-5">
                <h3 className="text-sm font-semibold text-navy-900">
                  Platform activity
                </h3>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <TrendingUp className="h-3.5 w-3.5" />
                  +18% vs last week
                </span>
              </div>
              <div className="p-5">
                <div className="flex h-48 items-stretch justify-between gap-3">
                  {weekly.map((v, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-2">
                      <div className="flex w-full flex-1 items-end">
                        <div
                          className="w-full rounded-t-md bg-gradient-to-t from-navy-700 to-navy-500 transition-all"
                          style={{ height: `${(v / maxWeekly) * 100}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {days[i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Project activity */}
            <Card>
              <div className="border-b border-border p-5">
                <h3 className="text-sm font-semibold text-navy-900">
                  Project activity
                </h3>
              </div>
              <div className="space-y-4 p-5">
                {projects.map((p) => {
                  const max = Math.max(...projects.map((x) => x.documentCount));
                  return (
                    <div key={p.id}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-medium text-graphite-700">
                          {p.name}
                        </span>
                        <span className="text-muted-foreground">
                          {p.documentCount}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(p.documentCount / max) * 100}%`,
                            backgroundColor: p.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Most-used documents */}
            <Card>
              <div className="border-b border-border p-5">
                <h3 className="text-sm font-semibold text-navy-900">
                  Most-used documents
                </h3>
              </div>
              <div className="divide-y divide-border">
                {topDocs.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 px-5 py-3">
                    <FileIcon type={d.type} size={34} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-graphite-800">
                        {d.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {d.projectName}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-navy-700">
                      {d.queries} queries
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Most-active users */}
            <Card>
              <div className="border-b border-border p-5">
                <h3 className="text-sm font-semibold text-navy-900">
                  Most-active users
                </h3>
              </div>
              <div className="space-y-4 p-5">
                {topUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-3">
                    <Avatar name={u.name} color={u.avatarColor} size={34} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-graphite-800">
                        {u.name}
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-navy-600"
                          style={{ width: `${(u.queries / maxUser) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-navy-700">
                      {u.queries}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
