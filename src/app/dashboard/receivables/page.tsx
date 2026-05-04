"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { getApprovedAgreements } from "@/lib/auth/mockData";
import { Card, CardContent } from "@/components/ui/card";
import type { Agreement } from "@/lib/auth/types";

export default function ReceivablesPage() {
  const { user, isReceiver } = useAuth();
  const [agreements, setAgreements] = useState<Agreement[]>([]);

  useEffect(() => {
    setAgreements(getApprovedAgreements());
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Receivables</h1>
        <p className="mt-1 text-sm text-muted-foreground">Approved agreements ready for payment</p>
      </div>

      {agreements.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-muted">
              <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-medium">No receivables yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Approved agreements will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {agreements.map(a => {
            const approvedAct = a.activities.find(x => x.type === "approved");
            return (
              <Card key={a.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <Link href={`/dashboard/agreements/${a.id}`} className="text-sm font-semibold hover:text-brand">
                        {a.title}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">{a.submitterName}</p>
                      {approvedAct && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Approved {new Date(approvedAct.timestamp).toLocaleDateString("en-GB")}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-accent">{a.currency} {a.total.toLocaleString()}</p>
                      <span className="mt-1 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        Ready for payment
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
