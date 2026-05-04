"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { getPendingApprovals, getApprovedAgreements, getRejectedAgreements } from "@/lib/auth/mockData";
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

export default function ApprovalsPage() {
  const { user, canApprove } = useAuth();
  const [pending, setPending] = useState<Agreement[]>([]);
  const [approved, setApproved] = useState<Agreement[]>([]);
  const [rejected, setRejected] = useState<Agreement[]>([]);

  useEffect(() => {
    if (!canApprove) return;
    setPending(getPendingApprovals());
    setApproved(getApprovedAgreements());
    setRejected(getRejectedAgreements());
  }, [canApprove]);

  if (!canApprove) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Approvals</h1>
          <p className="mt-1 text-sm text-muted-foreground">Review and manage agreement approvals</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <p className="text-sm font-medium">Access denied</p>
            <p className="mt-1 text-xs text-muted-foreground">You do not have permission to view this page</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Approvals</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review and manage agreement approvals</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            {pending.length > 0 && (
              <span className="ml-1.5 rounded-full bg-brand text-white px-1.5 py-0.5 text-xs">
                {pending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4 space-y-4">
          {pending.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-14 text-center">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-muted">
                  <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">No pending approvals</p>
                <p className="mt-1 text-xs text-muted-foreground">All agreements have been reviewed</p>
              </CardContent>
            </Card>
          ) : (
            pending.map(a => {
              const submittedAct = a.activities.find(x => x.type === "submitted");
              return (
                <Card key={a.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Link href={`/dashboard/agreements/${a.id}`} className="text-sm font-semibold hover:text-brand">
                            {a.title}
                          </Link>
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CONFIG[a.status].className}`}>
                            {STATUS_CONFIG[a.status].label}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {a.submitterName} · {a.currency} {a.total.toLocaleString()}
                        </p>
                        {submittedAct && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Submitted {new Date(submittedAct.timestamp).toLocaleDateString("en-GB")}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Link href={`/dashboard/agreements/${a.id}`}>
                          <Button size="sm" variant="outline">Review</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-4 space-y-3">
          {approved.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-14 text-center">
                <p className="text-sm font-medium">No approved agreements</p>
                <p className="mt-1 text-xs text-muted-foreground">Approved agreements will appear here</p>
              </CardContent>
            </Card>
          ) : (
            approved.map(a => (
              <Card key={a.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/agreements/${a.id}`} className="text-sm font-semibold hover:text-brand">
                          {a.title}
                        </Link>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CONFIG.approved.className}`}>
                          Approved
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {a.submitterName} · {a.currency} {a.total.toLocaleString()}
                      </p>
                    </div>
                    <Link href={`/dashboard/agreements/${a.id}`}>
                      <Button size="sm" variant="ghost">View</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-4 space-y-3">
          {rejected.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-14 text-center">
                <p className="text-sm font-medium">No rejected agreements</p>
                <p className="mt-1 text-xs text-muted-foreground">Rejected agreements will appear here</p>
              </CardContent>
            </Card>
          ) : (
            rejected.map(a => (
              <Card key={a.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/agreements/${a.id}`} className="text-sm font-semibold hover:text-brand">
                          {a.title}
                        </Link>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CONFIG.rejected.className}`}>
                          Rejected
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {a.submitterName} · {a.currency} {a.total.toLocaleString()}
                      </p>
                      {a.activities.find(x => x.type === "rejected")?.note && (
                        <p className="mt-1 text-xs italic text-muted-foreground">
                          &quot;{a.activities.find(x => x.type === "rejected")?.note}&quot;
                        </p>
                      )}
                    </div>
                    <Link href={`/dashboard/agreements/${a.id}`}>
                      <Button size="sm" variant="ghost">View</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
