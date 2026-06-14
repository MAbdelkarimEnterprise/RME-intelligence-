"use client";

import Link from "next/link";
import { Bell, Plus, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { CommandPalette } from "./command-palette";
import { Avatar } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/demo-data";

export function Topbar({ title }: { title?: string }) {
  const [menu, setMenu] = useState(false);
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur">
      <div className="flex items-center gap-4">
        {title && (
          <h1 className="text-base font-semibold tracking-tight text-navy-900">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        <CommandPalette />
        <Link href="/dashboard/documents?upload=1">
          <Button size="sm" variant="accent">
            <Plus className="h-4 w-4" />
            Upload
          </Button>
        </Link>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-md text-graphite-500 transition-colors hover:bg-muted hover:text-navy-800">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenu((m) => !m)}
            className="flex items-center gap-2 rounded-md py-1 pl-1 pr-2 transition-colors hover:bg-muted"
          >
            <Avatar name={currentUser.name} color={currentUser.avatarColor} size={32} />
            <div className="hidden text-left sm:block">
              <div className="text-xs font-semibold leading-tight text-navy-900">
                {currentUser.name}
              </div>
              <div className="text-[11px] leading-tight text-muted-foreground">
                {currentUser.role}
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          {menu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
              <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-card shadow-elevated animate-fade-in">
                <div className="border-b border-border p-3">
                  <div className="text-sm font-semibold text-navy-900">
                    {currentUser.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {currentUser.email}
                  </div>
                </div>
                <div className="p-1">
                  <Link
                    href="/dashboard/settings"
                    className="block rounded-md px-3 py-2 text-sm text-graphite-700 hover:bg-muted"
                  >
                    Settings
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-accent-hover hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
