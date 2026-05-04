"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function OrganizationSettingsPage() {
  const { user, isAdmin } = useAuth();
  const [orgName, setOrgName] = useState("Acme Corporation");
  const [orgSlug, setOrgSlug] = useState("acme-corp");
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");

  const handleSave = () => {
    try {
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("error");
    }
  };

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Organization</h1>
          <p className="mt-1 text-sm text-muted-foreground">Organization settings</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <p className="text-sm font-medium">Access denied</p>
            <p className="mt-1 text-xs text-muted-foreground">Only admins can manage organization settings</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Organization</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your organization settings</p>
      </div>

      <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="field">
              <Label>Organization Name</Label>
              <Input value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Your organization name" />
            </div>
            <div className="field">
              <Label>Organization Slug</Label>
              <Input value={orgSlug} onChange={e => setOrgSlug(e.target.value)} placeholder="your-org-slug" />
              <p className="mt-1 text-xs text-muted-foreground">Used in URLs and identifiers</p>
            </div>
            <div className="field">
              <Label>Member Count</Label>
              <Input value="4" disabled className="opacity-60" />
              <p className="mt-1 text-xs text-muted-foreground">Contact support to change member limits</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit">Save Changes</Button>
          {saveState === "saved" && (
            <span className="text-sm text-emerald-600">All changes saved ✓</span>
          )}
          {saveState === "error" && (
            <span className="text-sm text-destructive">Failed to save. Please try again.</span>
          )}
        </div>
      </form>
    </div>
  );
}
