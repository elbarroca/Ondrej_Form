"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type React from "react";

export default function IdentityPage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.name ?? "Mette Karlsen");
  const [email, setEmail] = useState(user?.email ?? "mette@bergen.kommune.no");
  const [department, setDepartment] = useState("Finance");
  const [iban, setIban] = useState("NO93 8601 1117 947");
  const [bic, setBic] = useState("DNBANOKK");
  const [taxId, setTaxId] = useState("");
  const [defaultCurrency, setDefaultCurrency] = useState("NOK");

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[26px] font-semibold tracking-[-0.02em]">Settings</h1>
        <p className="mt-1.5 text-sm text-mute">Manage your profile and account</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6">
        {/* Side nav */}
        <div className="flex flex-col gap-0.5">
          {["Profile", "Identity & IBAN", "Notifications"].map((item) => (
            <button
              key={item}
              type="button"
              className="text-left rounded-lg px-3 py-2 text-[13.5px] text-mute hover:text-ink hover:bg-ink/4 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {/* Profile */}
          <div className="rounded-[14px] border border-line bg-white p-6">
            <h3 className="text-[15px] font-semibold mb-1">Profile</h3>
            <p className="text-[13px] text-mute mb-4">Your personal information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
              <Input
                id="full-name"
                label="Full name"
                value={fullName}
                onChange={(e) => setFullName((e.target as HTMLInputElement).value)}
                required
              />
              <Input
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
                required
              />
              <Input
                id="department"
                label="Department"
                value={department}
                onChange={(e) => setDepartment((e.target as HTMLInputElement).value)}
              />
            </div>
            <div className="mt-4">
              <Button variant="primary" size="sm">Save changes</Button>
            </div>
          </div>

          {/* Identity */}
          <div className="rounded-[14px] border border-line bg-white p-6">
            <h3 className="text-[15px] font-semibold mb-1">Identity & IBAN</h3>
            <p className="text-[13px] text-mute mb-4">Banking information for reimbursements</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
              <Input
                id="iban"
                label="IBAN"
                value={iban}
                onChange={(e) => setIban((e.target as HTMLInputElement).value)}
                hint="ISO 13616 format"
                required
              />
              <Input
                id="bic"
                label="BIC/SWIFT"
                value={bic}
                onChange={(e) => setBic((e.target as HTMLInputElement).value)}
              />
              <Input
                id="tax-id"
                label="Tax ID"
                value={taxId}
                onChange={(e) => setTaxId((e.target as HTMLInputElement).value)}
              />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="default-currency" className="text-[13px] font-medium text-ink">
                  Default currency
                </label>
                <select
                  id="default-currency"
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                  className="w-full rounded-[10px] border border-line bg-white px-3 py-2.5 text-[14px] focus:border-brand focus:ring-[3px] focus:ring-brand/15 outline-none"
                >
                  {["EUR", "NOK", "SEK", "DKK", "USD", "GBP", "ISK", "CHF", "PLN", "CZK", "HUF", "RON", "BGN", "CAD"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="primary" size="sm">Save changes</Button>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-[14px] border border-line bg-white p-6">
            <h3 className="text-[15px] font-semibold mb-1">Notifications</h3>
            <p className="text-[13px] text-mute mb-4">Control which emails you receive</p>
            <div className="space-y-3">
              {[
                { label: "Report submitted", desc: "When your report is sent for approval" },
                { label: "Report approved", desc: "When an approver accepts your report" },
                { label: "Report rejected", desc: "When an approver rejects your report with feedback" },
                { label: "Approval requested", desc: "When someone requests your approval" },
              ].map(({ label, desc }) => (
                <label key={label} className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="mt-0.5 accent-brand" />
                  <div>
                    <p className="text-[13.5px] font-medium">{label}</p>
                    <p className="text-[12px] text-mute">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
