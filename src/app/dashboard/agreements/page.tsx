"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAgreements } from "@/lib/auth/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Agreement } from "@/lib/auth/types";

const STATUS_CONFIG: Record<Agreement["status"], { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-blue-100 text-blue-700 border-blue-200" },
  submitted: { label: "Submitted", className: "bg-amber-100 text-amber-700 border-amber-200" },
  approved: { label: "Approved", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700 border-red-200" },
};

type FilterTab = "all" | Agreement["status"];

export default function AgreementsPage() {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [filter, setFilter] = useState<FilterTab>("all");

  useEffect(() => {
    setAgreements(getAgreements());
  }, []);

  const filtered = filter === "all"
    ? agreements
    : agreements.filter(a => a.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agreements</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage all your reimbursement agreements</p>
        </div>
        <Link href="/dashboard/agreements/new">
          <Button>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Agreement
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" onValueChange={(v) => setFilter(v as FilterTab)}>
        <TabsList>
          {(["all", "draft", "submitted", "approved", "rejected"] as FilterTab[]).map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab === "all" ? "All" : STATUS_CONFIG[tab].label}
              {tab !== "all" && (
                <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs">
                  {agreements.filter(a => a.status === tab).length}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={filter} className="mt-4">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-14 text-center">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-muted">
                  <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">No {filter === "all" ? "" : filter} agreements</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {filter === "all" ? "Create your first agreement to get started" : `No agreements with ${filter} status`}
                </p>
                {filter === "all" && (
                  <Link href="/dashboard/agreements/new">
                    <Button className="mt-4" size="sm">Create agreement →</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {filtered.map((a) => {
                const cfg = STATUS_CONFIG[a.status];
                return (
                  <Link key={a.id} href={`/dashboard/agreements/${a.id}`}>
                    <Card className="transition-all hover:border-brand/40 hover:shadow-sm">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold">{a.title}</p>
                              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${cfg.className}`}>
                                {cfg.label}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">{a.submitterName} · {a.currency}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-semibold">{a.currency} {a.total.toLocaleString()}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{a.createdAt}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
