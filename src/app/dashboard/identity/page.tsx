"use client";

import { useState } from "react";
import { useIdentity } from "@/lib/useIdentity";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function IdentitySettingsPage() {
  const stored = useIdentity();
  const [identity, setIdentity] = useState({
    fullName: stored?.fullName ?? "",
    address: stored?.address ?? "",
    postalCode: stored?.postalCode ?? "",
    place: stored?.place ?? "",
    country: stored?.country ?? "",
    phone: stored?.phone ?? "",
    email: stored?.email ?? "",
    bankAccount: stored?.bankAccount ?? "",
    iban: stored?.iban ?? "",
    bicSwift: stored?.bicSwift ?? "",
  });
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");

  const set = (field: string, value: string) => {
    setIdentity(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem("reimburse_identity", JSON.stringify(identity));
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("error");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Identity</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your personal and banking information for reimbursements</p>
      </div>

      <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Contact Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="field sm:col-span-2">
                <Label>Full Name</Label>
                <Input value={identity.fullName} onChange={e => set("fullName", e.target.value)} placeholder="Ricardo Mosonzov Barroca" />
              </div>
              <div className="field sm:col-span-2">
                <Label>Address</Label>
                <Input value={identity.address} onChange={e => set("address", e.target.value)} placeholder="Ualg Tec Campus" />
              </div>
              <div className="field">
                <Label>Postal Code</Label>
                <Input value={identity.postalCode} onChange={e => set("postalCode", e.target.value)} placeholder="8005-139" />
              </div>
              <div className="field">
                <Label>City</Label>
                <Input value={identity.place} onChange={e => set("place", e.target.value)} placeholder="Faro" />
              </div>
              <div className="field">
                <Label>Country</Label>
                <Input value={identity.country} onChange={e => set("country", e.target.value)} placeholder="Portugal" />
              </div>
              <div className="field">
                <Label>Phone</Label>
                <Input value={identity.phone} onChange={e => set("phone", e.target.value)} placeholder="+351 925 549 165" />
              </div>
              <div className="field sm:col-span-2">
                <Label>Email</Label>
                <Input type="email" value={identity.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Bank Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="field">
                <Label>Bank Name</Label>
                <Input value={identity.bankAccount} onChange={e => set("bankAccount", e.target.value)} placeholder="Revolut" />
              </div>
              <div className="field">
                <Label>BIC / SWIFT</Label>
                <Input value={identity.bicSwift} onChange={e => set("bicSwift", e.target.value)} placeholder="REVOLT21" />
              </div>
              <div className="field sm:col-span-2">
                <Label>IBAN</Label>
                <Input value={identity.iban} onChange={e => set("iban", e.target.value)} placeholder="LT47 3250 0305 2886 7229" />
              </div>
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
