"use client";

import { Topbar } from "@/components/app/topbar";
import { Card, Avatar, Badge, Separator } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { currentUser } from "@/lib/demo-data";

export default function SettingsPage() {
  return (
    <>
      <Topbar title="Settings" />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-7">
          {/* Profile */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-navy-900">Profile</h3>
            <div className="mt-4 flex items-center gap-4">
              <Avatar
                name={currentUser.name}
                color={currentUser.avatarColor}
                size={56}
              />
              <div>
                <div className="text-base font-semibold text-navy-900">
                  {currentUser.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentUser.email}
                </div>
                <Badge tone="accent" className="mt-1">
                  {currentUser.role}
                </Badge>
              </div>
            </div>
            <Separator className="my-5" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-graphite-700">
                  Full name
                </label>
                <Input defaultValue={currentUser.name} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-graphite-700">
                  Department
                </label>
                <Input defaultValue={currentUser.department} />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="primary" size="sm">
                Save changes
              </Button>
            </div>
          </Card>

          {/* Preferences */}
          <Card className="mt-6 p-6">
            <h3 className="text-sm font-semibold text-navy-900">Preferences</h3>
            <div className="mt-4 space-y-1">
              <Toggle
                label="Email notifications"
                desc="Get notified when documents finish indexing."
                on
              />
              <Separator />
              <Toggle
                label="Show AI confidence indicators"
                desc="Display a confidence score on each AI answer."
                on
              />
              <Separator />
              <Toggle
                label="Restrict answers to my projects"
                desc="The assistant will only search workspaces you can access."
                on
              />
            </div>
          </Card>

          {/* Security */}
          <Card className="mt-6 p-6">
            <h3 className="text-sm font-semibold text-navy-900">Security</h3>
            <div className="mt-4 space-y-3 text-sm">
              <Row label="Password" value="Last changed 24 days ago" action="Update" />
              <Separator />
              <Row label="Microsoft SSO" value="Connected" action="Manage" />
              <Separator />
              <Row
                label="Two-factor authentication"
                value="Recommended for Admins"
                action="Enable"
              />
            </div>
          </Card>

          {/* AI config */}
          <Card className="mt-6 p-6">
            <h3 className="text-sm font-semibold text-navy-900">
              AI configuration
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Model and retrieval settings (Admin only).
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-graphite-700">
                  Model
                </label>
                <select className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-navy-400">
                  <option>claude-sonnet-4-6</option>
                  <option>claude-opus-4-8</option>
                  <option>claude-haiku-4-5</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-graphite-700">
                  Retrieved chunks (top-k)
                </label>
                <Input type="number" defaultValue={8} min={1} max={20} />
              </div>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}

function Toggle({
  label,
  desc,
  on,
}: {
  label: string;
  desc: string;
  on?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="text-sm font-medium text-graphite-800">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <div
        className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${
          on ? "bg-navy-700" : "bg-graphite-300"
        }`}
      >
        <div
          className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
            on ? "translate-x-5" : ""
          }`}
        />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  action,
}: {
  label: string;
  value: string;
  action: string;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <div className="text-sm font-medium text-graphite-800">{label}</div>
        <div className="text-xs text-muted-foreground">{value}</div>
      </div>
      <button className="text-xs font-medium text-accent hover:text-accent-hover">
        {action}
      </button>
    </div>
  );
}
